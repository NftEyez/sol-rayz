import { useEffect, useState } from "react";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  getParsedAccountByMint,
} from "@nfteyez/sol-rayz";

const defaultWallet = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy";
const defaultMint = "9siT5VjouSGFjcQp29EtQAbdR1NNJibysVhjcvCyK19T";

export const SolRayz = () => {
  const [walletPubKey, setWalletPubKey] = useState<string>(defaultWallet);
  const [mintPubKey, setMintPubKey] = useState<string>(defaultMint);
  const [nfts, setNfts] = useState<any>();
  const [singleToken, setSingleToken] = useState<any>();

  useEffect(() => {
    fetchNfts();
  }, [walletPubKey]);

  useEffect(() => {
    fetchToken();
  }, [mintPubKey]);

  const fetchNfts = async () => {
    const result = await getParsedNftAccountsByOwner({
      publicAddress: walletPubKey,
    });
    // console.log("result", result);
    setNfts(result);
  };
  const fetchToken = async () => {
    const result = await getParsedAccountByMint({
      mintAddress: mintPubKey,
    });
    console.log("result", result);
    setSingleToken(result);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setWalletPubKey(value);
  };

  const onMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMintPubKey(value);
  };

  return (
    <div>
      <h2>SolRayz</h2>

      <div>
        <div>
          <label>
            <span>Enter Wallet Address </span>
            <input type="text" value={walletPubKey} onChange={onChange} />
          </label>
        </div>
        <hr />
        <br />

        <div>
          {`isValidSolanaAddress( "${walletPubKey}" )`} {"->"}{" "}
          {isValidSolanaAddress(walletPubKey).toString()}
        </div>
        <br />

        <div>
          {`getParsedNftAccountsByOwner( "${walletPubKey}" )`} {"->"}{" "}
          {`fetched NFTs: ${nfts?.length}`}
          <div>
            {nfts?.length ? (
              <>
                <h4>First Item:</h4>
                <pre style={{ fontSize: "14px" }}>
                  {JSON.stringify(nfts[1], null, " ")}
                </pre>
              </>
            ) : null}
          </div>
        </div>

        <div>
          <hr />
          <h4>Single Token</h4>
          <div>
            <label>
              <span>Enter Mint Address </span>
              <input type="text" value={mintPubKey} onChange={onMintChange} />
            </label>
          </div>
          <br />
          <div>
            {`getParsedAccountByMint( "${mintPubKey}" )`} {"->"}{" "}
            {`${!!singleToken ? "is FOUND" : "is NOT FOUND"}`}
          </div>
          <div>
            {singleToken ? (
              <>
                <h4>Result:</h4>
                <pre style={{ fontSize: "14px" }}>
                  {JSON.stringify(singleToken, null, " ")}
                </pre>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
