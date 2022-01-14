import { PublicKey, Connection } from "@solana/web3.js";
import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from "@solana/spl-name-service";
import { isValidSolanaAddress, createConnectionConfig } from "./utils";
import { StringPublicKey } from "./types";

// Address of the SOL TLD
export const SOL_TLD_AUTHORITY = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export const getInputKey = async (input: any) => {
  const hashedInputName = await getHashedName(input);
  const inputDomainKey = await getNameAccountKey(
    hashedInputName,
    undefined,
    SOL_TLD_AUTHORITY
  );
  return { inputDomainKey, hashedInputName };
};

type Props = {
  /**
   * Text to be resolved to Solana wallet Public Key,
   * For now it resolves Solana Domain Names.
   * If Solana address passed it is validated and send back
   */
  text: string;
  /**
   * Optional Connection object.
   * Required for production use.
   * W/o it will connect to Mainnet-Beta
   */
  connection?: Connection;
};

const errorCantResolve = new Error(
  "Can't resolve provided name into valid Solana address =("
);

/**
 * Fn to resolve text into Solana wallet Public Key,
 * For now it resolves Solana Domain Names.
 * If Solana address passed it is validated and send back.
 *
 * Throw error if input text can't be resolved and validated.
 */
export const resolveToWalletAddress = async ({
  text: rawText,
  connection = createConnectionConfig(),
}: Props): Promise<StringPublicKey> => {
  const input = rawText?.trim?.();

  // throw and error if input is not provided
  if (!input) {
    return Promise.reject(errorCantResolve);
  }

  const isValidSolana = isValidSolanaAddress(input);
  if (isValidSolana) {
    return Promise.resolve(input);
  }

  const inputLowerCased = input?.toLowerCase();
  const isSolDamain = inputLowerCased?.endsWith?.(".sol");

  if (isSolDamain) {
    // get domain part before .sol
    const domainName = inputLowerCased.split(".sol")[0];
    const { inputDomainKey } = await getInputKey(domainName);

    const registry = await NameRegistryState.retrieve(
      connection,
      inputDomainKey
    );

    const owner = registry?.owner?.toBase58?.();

    if (owner) {
      return Promise.resolve(owner);
    }
  }

  // throw error if had no luck get valid Solana address
  return Promise.reject(errorCantResolve);
};
