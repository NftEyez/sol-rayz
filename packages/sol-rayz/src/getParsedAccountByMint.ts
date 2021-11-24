import { PublicKey, Connection } from "@solana/web3.js";
import { createConnectionConfig } from "./utils";
import { StringPublicKey } from "./types";

type Props = {
  /**
   * Mint public address
   */
  mintAddress: StringPublicKey;
  /**
   * Optionally provide your own connection object.
   * Otherwise createConnectionConfig() will be used
   */
  connection?: Connection;
  /**
   * Convert all PublicKey objects to string versions.
   * Default is true
   */
  stringifyPubKeys?: boolean;
};

/**
 * This fn look for the account associated with passed NFT token mint field.
 * This associated account holds some useful information like who is current owner of token.
 * it is stored within result.account.data.parsed.info.owner
 * Finding the token owner is main purpose of using this fn.
 */
export const getParsedAccountByMint = async ({
  mintAddress,
  connection = createConnectionConfig(),
  stringifyPubKeys = true,
}: Props) => {
  const res = await connection.getTokenLargestAccounts(
    new PublicKey(mintAddress)
  );

  if (!res.value?.length) {
    return undefined;
  }

  const firstResult = res.value[0];
  const formatedData = stringifyPubKeys
    ? publicKeyToString(firstResult)
    : firstResult;

  return formatedData;
};

const publicKeyToString = (tokenData: any) => ({
  ...tokenData,
  account: {
    ...tokenData?.account,
    owner: new PublicKey(tokenData?.account.owner)?.toString?.(),
  },
  pubkey: new PublicKey(tokenData?.pubkey)?.toString?.(),
});
