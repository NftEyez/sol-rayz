import { deserializeUnchecked } from "borsh";
import {
  clusterApiUrl,
  Connection,
  Commitment,
  PublicKey,
} from "@solana/web3.js";
import {
  METADATA_SCHEMA,
  Metadata,
  METADATA_PREFIX,
  METADATA_PROGRAM,
} from "./config/metaplex";

import { extendBorsh } from "./config/borsh";

extendBorsh();

const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM);
const metaProgamPublicKeyBuffer = metaProgamPublicKey.toBuffer();
// Create UTF-8 bytes Buffer from string
// similar to Buffer.from(METADATA_PREFIX) but should work by default in node.js/browser
const metaProgamPrefixBuffer = new TextEncoder().encode(METADATA_PREFIX);

export const decodeTokenMetadata = async (buffer: Buffer) =>
  deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer);

/**
 * Get Addresses of Metadata account assosiated with Mint Token
 */
export async function getSolanaMetadataAddress(tokenMint: PublicKey) {
  const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM);
  return (
    await PublicKey.findProgramAddress(
      [metaProgamPrefixBuffer, metaProgamPublicKeyBuffer, tokenMint.toBuffer()],
      metaProgamPublicKey
    )
  )[0];
}

/**
 * Check if passed address is Solana address
 */
export const isValidSolanaAddress = (address: string) => {
  try {
    // this fn accepts Base58 character
    // and if it pass we suppose Solana address is valid
    new PublicKey(address);
    return true;
  } catch (error) {
    // Non-base58 character or can't be used as Solana address
    return false;
  }
};

export const createConnectionConfig = (
  clusterApi = clusterApiUrl("mainnet-beta"),
  commitment = "confirmed"
) => new Connection(clusterApi, commitment as Commitment);
