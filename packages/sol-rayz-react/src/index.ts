export { useWalletNfts } from "./hooks/useWalletNfts";

// weird way to export types
// https://github.com/microsoft/TypeScript/issues/28481#issuecomment-552938424
export type NftTokenAccount = import("./types").NftTokenAccount;
export type WalletResult = import("./types").WalletResult;
