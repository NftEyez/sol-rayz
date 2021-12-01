import { useEffect, useState } from "react";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
} from "@nfteyez/sol-rayz";
import type { Options } from "@nfteyez/sol-rayz";
import { createConnectionConfig } from "@nfteyez/sol-rayz";

import { NftTokenAccount, WalletResult } from "../types";

/**
 * This hook is wrapper over `getParsedNftAccountsByOwner`
 * it fetches NFT list when wallet public address changes
 * and returns possible states: error, isLoading or list of NFT
 */
export const useWalletNfts = ({
  publicAddress,
  connection = createConnectionConfig(),
  sanitize = true,
  strictNftStandard = false,
  stringifyPubKeys = true,
  sort = true
}: Options): WalletResult => {
  const [nfts, setNfts] = useState<NftTokenAccount[]>([]);
  const [error, setError] = useState<unknown | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNftAccounts();
  }, [publicAddress]);

  const fetchNftAccounts = async () => {
    const isValidAddress: boolean = isValidSolanaAddress(publicAddress);

    if (!isValidAddress) {
      setNfts([]);
      setError(new Error(`Invalid address: ${publicAddress}`));
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress,
        connection,
        sanitize,
        strictNftStandard,
        stringifyPubKeys,
        sort
      });
      setNfts(nfts as any);
    } catch (error) {
      console.log(
        "Error ocurred while Solana NFT list fetched:",
        (error as any).message
      );
      setNfts([]);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nfts,
    error,
    isLoading,
  };
};
