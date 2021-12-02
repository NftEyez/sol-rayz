import { useEffect, useState } from "react";
import useSWR from "swr";
import { isValidSolanaAddress } from "@nfteyez/sol-rayz";

import { fetcher } from "../utils/fetcher";
import { WalletResult } from "../types";

type Props = {
  /**
   * Wallet public address
   */
  publicAddress: string;
  /**
   * Endpoint to your API, which hold all RPC calls
   * This endpoint needs to return result of getParsedNftAccountsByOwner()
   * from @nfteyez/sol-rayz package
   * EXAMPLE: '/api/accounts', 'https://example.com/accounts'
   */
  endpoint: string;
};

/**
 * This hook is wrapper over `getParsedNftAccountsByOwner`
 * it fetches NFT list when wallet public address changes
 * and returns possible states: error, isLoading or list of NFT
 */
export const useWalletNftsSWR = ({
  publicAddress,
  endpoint,
}: Props): WalletResult => {
  const [error, setError] = useState<unknown | undefined>();
  const [apiUrl, setApiUrl] = useState<string | undefined>();

  useEffect(() => {
    const isValidAddress: boolean = isValidSolanaAddress(publicAddress);

    if (!isValidAddress) {
      setError(new Error(`Invalid address: ${publicAddress}`));
    } else {
      setError(undefined);
      const url = `${endpoint}/${publicAddress}`;
      setApiUrl(url);
    }
  }, [publicAddress]);

  const { data: nfts, error: fetchError } = useSWR(apiUrl as string, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // update error object with fetch error if any
  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  return {
    nfts,
    error,
    isLoading: !nfts && !error,
  };
};
