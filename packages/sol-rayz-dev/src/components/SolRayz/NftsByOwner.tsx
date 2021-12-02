import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";

const defaultWallet = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy";

const endpoint = "https://neon-nft.rpcpool.com/467ba3ccd4823cf0b51ccf509af3";

const connection = createConnectionConfig(endpoint);

export const NftsByOwner = () => {
  // const { connection } = useConnection();
  const [nfts, setNfts] = useState<any>();
  const [walletPubKey, setWalletPubKey] = useState<string>(defaultWallet);
  useEffect(() => {
    fetchNfts();
  }, [walletPubKey]);

  const fetchNfts = async () => {
    const result = await getParsedNftAccountsByOwner({
      publicAddress: walletPubKey,
      connection,
    });
    // console.log("result", result);
    setNfts(result);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setWalletPubKey(value);
  };

  return (
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
                {JSON.stringify(nfts[0], null, " ")}
              </pre>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
