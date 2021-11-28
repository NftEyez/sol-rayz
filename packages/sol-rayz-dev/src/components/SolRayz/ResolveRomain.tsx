import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { resolveDomain } from "@nfteyez/sol-rayz";
import { error } from "console";

const defaultDomain = "gargolon.sol";

export const ResolveDomain = () => {
  const { connection } = useConnection();
  const [allTokensForUAuth, setAllTokensForUAuth] = useState<any>();
  const [domain, setDomain] = useState<string>(defaultDomain);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    resolveIt();
  }, [domain]);

  const resolveIt = async () => {
    try {
      const result = await resolveDomain({
        input: domain,
        connection,
      });

      setResolvedAddress(result);
      setError(undefined);
    } catch (error) {
      setResolvedAddress("");
      setError(error as Error);
    }
  };

  const onDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDomain(value);
  };

  return (
    <div>
      <hr />
      <h4>Resolve .sol domain</h4>
      <div>
        <label>
          <span>Enter .sol domain </span>
          <input type="text" value={domain} onChange={onDomainChange} />
        </label>
      </div>
      <br />
      <div>
        {`resolveDomain( "${domain}" )`} {"->"}{" "}
        {`${resolvedAddress ? "is FOUND" : "is NOT FOUND"}`}
      </div>
      <div>
        {resolvedAddress ? (
          <>
            <h4>Resolved Address is:</h4>
            <pre style={{ fontSize: "18px" }}>{resolvedAddress}</pre>
          </>
        ) : null}

        {error ? (
          <>
            <br />
            <div>Error Occured: {error.message}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};
