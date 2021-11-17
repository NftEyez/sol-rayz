## @nfteyez/sol-rayz

These packages created to simplify the process of parsing NFTs on Solana.

Can be used for basic things like fetch all NFTs for specific wallet. Designed to be used in browser or Node.JS env.

## Install

You need install `@solana/web3.js` in your project, since it is used as peer dependency.

```
npm i @solana/web3.js
npm i @nfteyez/sol-rayz

```

## How to use

`getParsedNftAccountsByOwner` - return parsed list of NFTs (SPL Tokens) for given wallet public address. Each item in array have all data specified on the blockchain. The NFT metadata stored separately, you need to pick `uri` property for each token and fetch data youself.

```javascript
import {
  getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";

const tokenList = await getParsedNftAccountsByOwner({
  /**
   * Wallet public address
   */
  publicAddress: StringPublicKey;
  /**
   * Optionally provide your own connection object.
   * Otherwise createConnectionConfig() will be used
   */
  connection?: Connection;
  /**
   * Remove possible rust's empty string symbols `\x00` from the values,
   * which is very common issue.
   * Default is true
   */
  sanitize?: boolean;
  /**
   * TODO: Add description within README and link here
   * Default is false - slow method
   * true - is fast method
   */
  strictNftStandard?: boolean;
  /**
   * Convert all PublicKey objects to string versions.
   * Default is true
   */
  stringifyPubKeys?: boolean;
  /**
   * Sort tokens by Update Authority (read by Collection)
   * Default is true
   */
  sort?: boolean;
});
```

`createConnectionConfig` - method for creating a "connection" with Solana, have two params: clusterApi and commitment.

`isValidSolanaAddress` - check if provided string is valid Solana address.

```javascript
import { isValidSolanaAddress } from "@nfteyez/sol-rayz";

const isValidAddress: boolean = isValidSolanaAddress((walletPublicKey: string));
```

`getParsedAccountByMint` - return parsed account for given mint address.

```javascript
import { getParsedAccountByMint } from '@nfteyez/sol-rayz';

const parsedAccountByMint: ParsedAccountInfo = getParsedAccountByMintgetParsedAccountByMint({
  /**
   * Mint address
   */
  mintAddress: StringPublicKey;
  /**
   * Optionally provide your own connection object.
   * Otherwise createConnectionConfig() will be used
   */
  connection?: Connection;
});
```

`getParsedNftAccountsByUpdateAuthority` - return parsed list of NFTs (SPL Tokens) for given update authority. Each item in array have all data specified on the blockchain. The NFT metadata stored separately, you need to pick `uri` property for each token and fetch data youself.

```javascript
import { getParsedNftAccountsByUpdateAuthority } from '@nfteyez/sol-rayz';

const parsedAccountByMint = getParsedNftAccountsByUpdateAuthority({
  /**
   * Update authority address
   */
  updateAuthority: StringPublicKey;
  /**
   * Optionally provide your own connection object.
   * Otherwise createConnectionConfig() will be used
   */
  connection?: Connection;
});
```
