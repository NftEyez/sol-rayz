import {
  Connection,
  PublicKey,
  AccountInfo,
  ParsedAccountData,
} from "@solana/web3.js";
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
   * Convert all PublicKey objects to string versions.
   * Default is true
   */
  stringifyPubKeys?: boolean;
  /**
   * Sort tokens by Update Authority (read by Collection)
   * Default is true
   */
  sort?: boolean;
  /**
   * Limit response by this number
   * by default response limited by 5000 NFTs.
   */
  limit?: number;
};

enum sortKeys {
  updateAuthority = "updateAuthority",
}

export const getParsedNftAccountsByOwner = async ({
  publicAddress,
  connection = createConnectionConfig(),
  sanitize = true,
  stringifyPubKeys = true,
  sort = true,
  limit = 5000,
}: Options) => {
  const isValidAddress = isValidSolanaAddress(publicAddress);
  if (!isValidAddress) {
    return [];
  }

  // Get all accounts owned by user
  // and created by SPL Token Program
  // this will include all NFTs, Coins, Tokens, etc.
  const { value: splAccounts } = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(publicAddress),
    {
      programId: new PublicKey(TOKEN_PROGRAM),
    }
  );

  // We assume NFT is SPL token with decimals === 0 and amount at least 1
  // At this point we filter out other SPL tokens, like coins e.g.
  // Unfortunately, this method will also remove NFTы created before Metaplex NFT Standard
  // like Solarians e.g., so you need to check wallets for them in separate call if you wish
  const nftAccounts = splAccounts
    .filter((t) => {
      const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals;
      return decimals === 0 && amount >= 1;
    })
    .map((t) => {
      const address = t.account?.data?.parsed?.info?.mint;
      return new PublicKey(address);
    });

  // if user have tons of NFTs return first N
  const accountsSlice = nftAccounts?.slice(0, limit);

  // Get Addresses of Metadata Account assosiated with Mint Token
  // This info can be deterministically calculated by Associated Token Program
  // available in @solana/web3.js
  const metadataAcountsAddressPromises = await Promise.allSettled(
    accountsSlice.map(getSolanaMetadataAddress)
  );

  const metadataAccounts = metadataAcountsAddressPromises
    .filter(onlySuccessfullPromises)
    .map((p) => (p as PromiseFulfilledResult<PublicKey>).value);

  // Fetch Found Metadata Account data by chunks
  const metaAccountsRawPromises: PromiseSettledResult<
    (AccountInfo<Buffer | ParsedAccountData> | null)[]
  >[] = await Promise.allSettled(
    chunks(metadataAccounts, 99).map((chunk) =>
      connection.getMultipleAccountsInfo(chunk as PublicKey[])
    )
  );

  const accountsRawMeta = metaAccountsRawPromises
    .filter(({ status }) => status === "fulfilled")
    .flatMap((p) => (p as PromiseFulfilledResult<unknown>).value);

  // There is no reason to continue processing
  // if Mints doesn't have associated metadata account. just return []
  if (!accountsRawMeta?.length || accountsRawMeta?.length === 0) {
    return [];
  }

  // Decode data from Buffer to readable objects
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

// Convert all PublicKey to string
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

// Remove all empty space, new line, etc. symbols
// In some reason such symbols parsed back from Buffer looks weird
// like "\x0000" instead of usual spaces.
export const sanitizeMetaStrings = (metaString: string) =>
  metaString.replace(/\0/g, "");

const onlySuccessfullPromises = (
  result: PromiseSettledResult<unknown>
): boolean => result && result.status === "fulfilled";

// Remove any NFT Metadata Account which doesn't have uri field
// We can assume such NFTs are broken or invalid.
const onlyNftsWithMetadata = (t: PromiseSettledResult<Metadata>) => {
  const uri = (
    t as PromiseFulfilledResult<Metadata>
  ).value.data?.uri?.replace?.(/\0/g, "");
  return uri !== "" && uri !== undefined;
};
