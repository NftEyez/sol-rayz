import { PublicKey, Connection } from "@solana/web3.js";
import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from "@solana/spl-name-service";
import { isValidSolanaAddress, createConnectionConfig } from "./utils";

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
  input: string;
  connection?: Connection;
};

export const resolveDomain = async ({
  input: rawInput,
  connection = createConnectionConfig(),
}: Props) => {
  const input = rawInput?.trim?.();
  const isValidSolana = isValidSolanaAddress(input);

  if (isValidSolana) {
    return Promise.resolve(input);
  }

  const isSolDamain = input.endsWith(".sol");

  if (isSolDamain) {
    // get domain part before .sol
    const domainName = input.split(".sol")[0];
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
  const error = new Error(
    "Can't resolve provided name into valid Solana address =("
  );
  return Promise.reject(error);
};
