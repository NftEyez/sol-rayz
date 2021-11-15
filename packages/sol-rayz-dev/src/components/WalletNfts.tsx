import React, { useState, FC, useEffect } from "react";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  // @ts-ignore
} from "@nfteyez/sol-rayz";
import { useWalletNfts } from "@nfteyez/sol-rayz-react";
// import {
//   useWalletNfts,
//   // @ts-ignore
// } from "../hooks/useWalletNfts";

const defaultWallet = "";

export const WalletNfts: FC = () => {
  const [walletPublicKey, setWalletPublicKey] = useState(defaultWallet);
  const [isValidAddress, setIsValidAddress] = useState(false);
  // const [nfts, setNfts] = useState<any[]>([]);
  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: walletPublicKey,
  });

  // useEffect(() => {
  //   parseNfts();
  // }, [walletPublicKey]);

  console.log("nftsWallet", nfts);
  console.log("error", error);

  // const parseNfts = async () => {
  //   const result = isValidSolanaAddress(walletPublicKey);
  //   console.log("result", result);
  //   setIsValidAddress(result);

  //   const nfts = await getParsedNftAccountsByOwner({
  //     publicAddress: walletPublicKey,
  //   });

  //   setNfts(nfts);
  // };

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
          <b>
            isValidSolanaAddress({walletPublicKey}) {"->"}{" "}
            {isValidAddress.toString()}
          </b>
        </pre>

        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div>NFT Amount: {nfts?.length}</div>
              <div>Results:</div>
              {/* <pre style={{ fontSize: "14px" }}>
  {JSON.stringify(nfts, null, " ")}
</pre> */}
            </div>
          )}
          {error ? (
            <div>
              <h1>Error Occures</h1>
              {(error as any)?.message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
