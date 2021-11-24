import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

const defaultUpdateAuth = "4iYvVGQkcgYe2PhLLtqvnxMyXuaAAbs5hCweo3imrRLQ";

export const NftsByUpdateAuth = () => {
  const { connection } = useConnection();
  const [allTokensForUAuth, setAllTokensForUAuth] = useState<any>();
  const [updateAuth, setUpdateAuth] = useState<string>(defaultUpdateAuth);

  useEffect(() => {
    fetchAllTokensForUpdateAuth();
  }, [updateAuth]);

  const fetchAllTokensForUpdateAuth = async () => {
    // console.log("defaultUpdateAuth", defaultUpdateAuth);
    // const result = await getParsedNftAccountsByUpdateAuthority({
    //   updateAuthority: updateAuth,
    //   connection
    // });
    // console.log("all tokens for UAuth", result);
    // setAllTokensForUAuth(result);
  };

  const onUpdateAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUpdateAuth(value);
  };
  return (
    <div>
      <hr />
      <h4>Get all NFTs for given Update Authority</h4>
      <div>
        <label>
          <span>Enter Mint Address </span>
          <input
            type="text"
            value={updateAuth}
            // onChange={onMintChange}
          />
        </label>
      </div>
      <br />
      <div>
        {`getParsedNftAccountsByUpdateAuth( "${updateAuth}" )`} {"->"}{" "}
        {`${!!allTokensForUAuth?.length ? "is FOUND" : "is NOT FOUND"}`}
      </div>
      <div>
        {allTokensForUAuth?.length ? (
          <>
            <h4>First in results:</h4>
            <pre style={{ fontSize: "14px" }}>
              {JSON.stringify(allTokensForUAuth[0], null, " ")}
            </pre>
          </>
        ) : null}
      </div>
    </div>
  );
};
