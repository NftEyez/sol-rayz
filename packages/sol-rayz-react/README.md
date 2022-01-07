# @nfteyez/sol-rayz-react

These packages created to simplify the process of parsing NFTs on Solana for React apps.

## Install

You need install `@solana/web3.js` in your project, since it is used as peer dependency.

```
npm i @solana/web3.js
npm i @nfteyez/sol-rayz-react

```

## How to use

`useWalletNfts` - returns parsed list of NFTs (SPL Tokens) for given wallet public address. Each item in array have all data specified on the blockchain. The NFT metadata stored separately, you need to pick `uri` property for each token and fetch data youself.

```javascript
import { useWalletNfts } from "@nfteyez/sol-rayz-react";
import type { Options } from "@nfteyez/sol-rayz";

// within component
const { nfts, isLoading, error } = useWalletNfts({
  publicAddress: walletPublicKey,
  // pass your connection object to use specific RPC node
  connection,
}: Options);
```

`Options` is the same type used used in `"@nfteyez/sol-rayz"` for `getParsedNftAccountsByOwner` method:

```javascript
// only `publicAddress` is required
export type Options = {
  /**
   * Wallet public address
   */
  publicAddress: StringPublicKey,
  /**
   * Optionally provide your own connection object.
   * Otherwise createConnectionConfig() will be used
   */
  connection?: Connection,
  /**
   * Remove possible rust's empty string symbols `\x00` from the values,
   * which is very common issue.
   * Default is true
   */
  sanitize?: boolean,
  /**
   * TODO: Add description within README and link here
   * Default is false - slow method
   * true - is fast method
   */
  strictNftStandard?: boolean,
  /**
   * Convert all PublicKey objects to string versions.
   * Default is true
   */
  stringifyPubKeys?: boolean,
  /**
   * Sort tokens by Update Authority (read by Collection)
   * Default is true
   */
  sort?: boolean,
};
```
