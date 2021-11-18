// @ts-nocheck
import { clusterApiUrl, Connection, Commitment, PublicKey } from '@solana/web3.js';
import { METADATA_PROGRAM } from './config/metaplex';
import { decodeTokenMetadata } from './utils';

export const createConnectionConfig = (clusterApi = clusterApiUrl('mainnet-beta'), commitment = 'confirmed') =>
  new Connection(clusterApi, commitment as Commitment);

export const getParsedNftAccountsByUpdateAuthority = async ({
  updateAuthority,
  connection = createConnectionConfig(),
}) => {
  try {
    const res = await connection.getProgramAccounts(new PublicKey(METADATA_PROGRAM), {
      encoding: 'base64',
      filters: [
        {
          memcmp: {
            offset: 1,
            bytes: updateAuthority,
          },
        },
      ],
    });

    const decodedArray = await Promise.all(res.map(acc => decodeTokenMetadata(acc.account.data)));

    return decodedArray;
  } catch (err) {
    console.error(err);
    return [];
  }
};
