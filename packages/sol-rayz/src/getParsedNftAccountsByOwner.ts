import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import chunks from "lodash.chunk";
import orderBy from "lodash.orderby";
import {
  decodeTokenMetadata,
  getSolanaMetadataAddress,
  isValidSolanaAddress,
  createConnectionConfig,
} from "./utils";
import { TOKEN_PROGRAM } from "./config/solana";
import { Metadata } from "./config/metaplex";
import {
  StringPublicKey,
  PromiseSettledResult,
  PromiseFulfilledResult,
} from "./types";

export type Options = {
  /**
   * Wallet public address
   */
  publicAddress: StringPublicKey;
  /**
   * Optionally provide your own connection object.
   * Otherwise createConnectionConfig() will be used
   */
  connection?: Connection;
  /**
   * Remove possible rust's empty string symbols `\x00` from the values,
   * which is very common issue.
   * Default is true
   */
  sanitize?: boolean;
  /**
   * TODO: Add description within README and link here
   * Default is false - slow method
   * true - is fast method
   */
  strictNftStandard?: boolean;
  /**
   * Convert all PublicKey objects to string versions.
   * Default is true
   */
  stringifyPubKeys?: boolean;
  /**
   * Sort tokens by Update Authority (read by Collection)
   * Default is true
   */
  sort?: boolean;
};

enum sortKeys {
  updateAuthority = "updateAuthority",
}

export const getParsedNftAccountsByOwner = async ({
  publicAddress,
  connection = createConnectionConfig(),
  sanitize = true,
  strictNftStandard = false,
  stringifyPubKeys = true,
  sort = true,
}: Options) => {
  const isValidAddress = isValidSolanaAddress(publicAddress);
  if (!isValidAddress) {
    return [];
  }

  // TODO: Needs performace test
  // getParsedTokenAccountsByOwner vs getTokenAccountsByOwner + partial parsing
  // vs RPC getTokenAccountsByOwner with slice + partial parsing
  // vs RPC getProgramAccounts with slice and filter + partial parsing

  const { value: splAccounts } = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(publicAddress),
    {
      programId: new PublicKey(TOKEN_PROGRAM),
    }
  );

  const nftAccounts = splAccounts.filter(({ account }) => {
    const amount = account?.data?.parsed?.info?.tokenAmount?.uiAmount;
    const decimals = account?.data?.parsed?.info?.tokenAmount?.decimals;

    if (strictNftStandard) {
      // Here is correct way to do it. it is described by Solana
      // faster way, will filter out most unrelivant SPL-tokens
      return decimals === 0 && amount >= 1;
    }

    // Weak method to find NFT tokens
    // some older NFTs can be found only this way, like Solarians e.g.
    return amount > 0;
  });

  const acountsMetaAddressPromises = await Promise.allSettled(
    nftAccounts.map(({ account }) => {
      const address = account?.data?.parsed?.info?.mint;
      return address ? getSolanaMetadataAddress(new PublicKey(address)) : null;
    })
  );

  const acountsMetaAddress = acountsMetaAddressPromises
    .filter(onlySuccessfullPromises)
    .map((p) => (p as PromiseFulfilledResult<unknown>).value);

  const accountsRawMetaResponse = await Promise.allSettled(
    chunks(acountsMetaAddress, 99).map(async (chunk) => {
      try {
        return await connection.getMultipleAccountsInfo(chunk as PublicKey[]);
      } catch (err) {
        console.log(err); // eslint-disable-line
        return false;
      }
    })
  );

  const accountsRawMeta = accountsRawMetaResponse
    .filter(({ status }) => status === "fulfilled")
    .flatMap((p) => (p as PromiseFulfilledResult<unknown>).value);

  const accountsDecodedMeta = await Promise.allSettled(
    accountsRawMeta.map((accountInfo) =>
      decodeTokenMetadata((accountInfo as AccountInfo<Buffer>)?.data)
    )
  );

  const accountsFiltered = accountsDecodedMeta
    .filter(onlySuccessfullPromises)
    .filter(onlyNftsWithMetadata)
    .map((p) => {
      const { value } = p as PromiseFulfilledResult<Metadata>;
      return sanitize ? sanitizeTokenMeta(value) : value;
    })
    .map((token) => (stringifyPubKeys ? publicKeyToString(token) : token));

  // sort accounts if sort is true & updateAuthority stringified
  if (stringifyPubKeys && sort) {
    const accountsSorted = orderBy(
      accountsFiltered,
      [sortKeys.updateAuthority],
      ["asc"]
    );
    return accountsSorted;
  }
  // otherwise return unsorted
  return accountsFiltered;
};

const sanitizeTokenMeta = (tokenData: Metadata) => ({
  ...tokenData,
  data: {
    ...tokenData?.data,
    name: sanitizeMetaStrings(tokenData?.data?.name),
    symbol: sanitizeMetaStrings(tokenData?.data?.symbol),
    uri: sanitizeMetaStrings(tokenData?.data?.uri),
  },
});

const publicKeyToString = (tokenData: Metadata) => ({
  ...tokenData,
  mint: tokenData?.mint?.toString?.(),
  updateAuthority: tokenData?.updateAuthority?.toString?.(),
  data: {
    ...tokenData?.data,
    creators: tokenData?.data?.creators?.map((c: any) => ({
      ...c,
      address: new PublicKey(c?.address)?.toString?.(),
    })),
  },
});

export const sanitizeMetaStrings = (metaString: string) =>
  metaString.replace(/\0/g, "");

const onlySuccessfullPromises = (
  result: PromiseSettledResult<unknown>
): boolean => result && result.status === "fulfilled";

const onlyNftsWithMetadata = (t: PromiseSettledResult<Metadata>) => {
  const uri = (
    t as PromiseFulfilledResult<Metadata>
  ).value.data?.uri?.replace?.(/\0/g, "");
  return uri !== "" && uri !== undefined;
};
