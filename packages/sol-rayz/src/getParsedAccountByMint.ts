// @ts-nocheck
import { clusterApiUrl, Connection, Commitment, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM } from './config/solana';

export const createConnectionConfig = (clusterApi = clusterApiUrl('mainnet-beta'), commitment = 'confirmed') =>
  new Connection(clusterApi, commitment as Commitment);

export const getParsedAccountByMint = async ({ mintAddress, connection = createConnectionConfig() }) => {
  try {
    const res = await connection.getParsedProgramAccounts(new PublicKey(TOKEN_PROGRAM), {
      filters: [
        { dataSize: 165 },
        {
          memcmp: {
            offset: 0,
            bytes: mintAddress,
          },
        },
      ],
    });

    return res[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
