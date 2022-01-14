import { NftsByOwner } from "./NftsByOwner";
import { NftsByUpdateAuth } from "./NftsByUpdateAuth";
import { SingleNft } from "./SingleNft";
import { ResolveDomain } from "./ResolveDomain";

export const SolRayz = () => {
  return (
    <div>
      <h2>SolRayz</h2>

      <div>
        {/* <ResolveDomain /> */}

        <NftsByOwner />

        {/* <SingleNft /> */}

        {/* <NftsByUpdateAuth /> */}
      </div>
    </div>
  );
};
