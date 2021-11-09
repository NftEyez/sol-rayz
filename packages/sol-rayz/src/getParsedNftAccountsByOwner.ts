// @ts-nocheck
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Commitment,
} from "@solana/web3.js";
import chunks from "lodash.chunk";
import {
  decodeTokenMetadata,
  getSolanaMetadataAddress,
  isValidSolanaAddress,
} from "./utils";
import { TOKEN_PROGRAM } from "./config/solana";
import { StringPublicKey } from "./types";

export const createConnectionConfig = (
  clusterApi = clusterApiUrl("mainnet-beta"),
  commitment = "confirmed"
) => new Connection(clusterApi, commitment as Commitment);

type Props = {
  /**
   * Wallet public address
   */
  publicAddress: StringPublicKey;
  connection?: Connection;
  serialization?: boolean;
  /**
   * TODO: Add description within README and link here
   */
  strictNftStandard?: boolean;
};

export const getParsedNftAccountsByOwner = async ({
  publicAddress,
  connection = createConnectionConfig(),
  serialization = true,
  strictNftStandard = false,
}: Props) => {
  const isValidAddress = isValidSolanaAddress(publicAddress);
  if (!isValidAddress) return [];

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
      // Here is correct way to do it described by Solana
      // faster way, will filter out most unrelivant SPL-tokens
      return decimals === 0 && amount >= 1;
    } else {
      // Weak method to find NFT tokens
      // some older NFTs can be found only this way, like Solarians e.g.
      return amount > 0;
    }
  });

  const acountsMetaAddressPromises = await Promise.allSettled(
    nftAccounts.map(({ account }) => {
      const address = account?.data?.parsed?.info?.mint;
      return address ? getSolanaMetadataAddress(new PublicKey(address)) : null;
    })
  );

  const acountsMetaAddress = acountsMetaAddressPromises
    .filter(onlySuccessfull)
    .map(({ value }) => value);

  const accountsRawMetaResponse = await Promise.allSettled(
    chunks(acountsMetaAddress, 99).map(async (chunk) => {
      try {
        return await connection.getMultipleAccountsInfo(chunk);
      } catch (err) {
        console.error(err);
      }
    })
  );

  const accountsRawMeta = accountsRawMetaResponse
    .filter(({ status }) => status === "fulfilled")
    .flatMap(({ value }) => value);

  const accountsDecodedMeta = await Promise.allSettled(
    accountsRawMeta.map((accountInfo) => {
      return decodeTokenMetadata(accountInfo?.data);
    })
  );

  return accountsDecodedMeta
    .filter(onlySuccessfull)
    .filter(onlyNftsWithMetadata)
    .map(({ value }) => (serialization ? sanitizeTokenMeta(value) : value));
};

const sanitizeTokenMeta = (tokenData) => {
  return {
    ...tokenData,
    data: {
      ...tokenData.data,
      name: sanitizeMetaStrings(tokenData?.data?.name),
      symbol: sanitizeMetaStrings(tokenData?.data?.symbol),
      uri: sanitizeMetaStrings(tokenData?.data?.uri),
    },
  };
};

export const sanitizeMetaStrings = (metaString) => {
  return metaString.replace(/\0/g, "");
};

const onlySuccessfull = (
  result: PromiseSettledResult<Promise<PublicKey>>
): boolean => result && result.status === "fulfilled";

const onlyNftsWithMetadata = (t) => {
  const uri = t.value.data?.uri?.replace?.(/\0/g, "");
  return uri !== "" && uri !== undefined;
};
