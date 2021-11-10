import React, { useState, FC, useEffect } from "react";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  // @ts-ignore
} from "@nfteyez/sol-rayz";

const defaultWallet = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy";

export const WalletNfts: FC = () => {
  const [walletPublicKey, setWalletPublicKey] = useState(defaultWallet);
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    parseNfts();
  }, [walletPublicKey]);

  const parseNfts = async () => {
    const result = isValidSolanaAddress(walletPublicKey);
    console.log("result", result);

    const nfts = await getParsedNftAccountsByOwner({
      publicAddress: walletPublicKey,
    });

    setNfts(nfts);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setWalletPublicKey(value.trim());
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter wallet address"
        value={walletPublicKey}
        onChange={onInputChange}
      />
      <div>
        <pre>
          <b>isValidSolanaAddress({walletPublicKey})</b>
          <div>NFT Amount: {nfts?.length}</div>
        </pre>

        <div>Results:</div>
        <pre style={{ fontSize: "14px" }}>
          {JSON.stringify(nfts, null, " ")}
        </pre>
      </div>
    </div>
  );
};
