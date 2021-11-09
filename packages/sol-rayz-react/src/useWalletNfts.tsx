import { useState, useEffect } from "react";

const nftsDummy = [
  {
    id: 0,
    name: "thugbirdz",
  },
  {
    id: 1,
    name: "trashpandas",
  },
];

export const useWalletNfts = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    setNfts(nftsDummy);
  }, []);

  return { nfts };
};
