import { NftsByOwner } from "./NftsByOwner";
import { NftsByUpdateAuth } from "./NftsByUpdateAuth";
import { SingleNft } from "./SingleNft";

export const SolRayz = () => {
  return (
    <div>
      <h2>SolRayz</h2>

      <div>
        <NftsByOwner />

        <SingleNft />

        {/* <NftsByUpdateAuth /> */}
      </div>
    </div>
  );
};
