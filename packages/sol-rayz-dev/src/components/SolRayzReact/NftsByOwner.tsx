import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

import { useWalletNfts } from "@nfteyez/sol-rayz-react";

const defaultWallet = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy";

export const NftsByOwner = () => {
  const { connection } = useConnection();
  const [walletPubKey, setWalletPubKey] = useState<string>(defaultWallet);
  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: walletPubKey,
    connection,
  });

  console.log("nfts", nfts);

  return (
    <div>
      {isLoading ? <div>Loading...</div> : null}

      {error ? (
        <div>{(error as Error)?.message}</div>
      ) : (
        <div>Wallet have: {nfts?.length} NFTs</div>
      )}
    </div>
  );
};
