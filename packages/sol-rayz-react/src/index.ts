// @ts-ignore
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
} from "@nfteyez/sol-rayz";

const result = isValidSolanaAddress(
  "8H4iibgTn3d9S6oGABKZADg1grWrYp5GGDyo5FaAqpYV"
);
console.log("result", result);

const parseNfts = async () => {
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress: "8H4iibgTn3d9S6oGABKZADg1grWrYp5GGDyo5FaAqpYV",
  });
  console.log("fetched nfts: ", nfts.length);
};

parseNfts();
