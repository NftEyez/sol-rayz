import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { getParsedAccountByMint } from "@nfteyez/sol-rayz";

const defaultMint = "9siT5VjouSGFjcQp29EtQAbdR1NNJibysVhjcvCyK19T";

export const SingleNft = () => {
  const { connection } = useConnection();
  const [mintPubKey, setMintPubKey] = useState<string>(defaultMint);
  const [singleToken, setSingleToken] = useState<any>();

  useEffect(() => {
    fetchToken();
  }, [mintPubKey]);

  const fetchToken = async () => {
    const result = await getParsedAccountByMint({
      mintAddress: mintPubKey,
      connection,
    });
    console.log("result", result);
    setSingleToken(result);
  };

  const onMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMintPubKey(value);
  };

  return (
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
  );
};
