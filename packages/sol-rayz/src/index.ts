export {
  getParsedNftAccountsByOwner,
  createConnectionConfig,
} from "./getParsedNftAccountsByOwner";

// weird way to export type
// https://github.com/microsoft/TypeScript/issues/28481#issuecomment-552938424
export type Options = import("./getParsedNftAccountsByOwner").Options;

export { isValidSolanaAddress } from "./utils";
