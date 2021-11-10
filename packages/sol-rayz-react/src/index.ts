// @ts-ignore
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
} from "@nfteyez/sol-rayz";

const result = isValidSolanaAddress(
  "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy"
);
console.log("result", result);

const parseNfts = async () => {
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress: "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy",
  });
  console.log("fetched nfts: ", nfts.length);
};

parseNfts();
