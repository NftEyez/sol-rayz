# @nfteyez/sol-rayz

These packages created to simplify the process of parsing NFTs on Solana.

Can be used for basic things like fetch all NFTs for specific wallet. Designed to be used in browser or Node.JS env.

## Install

You need install `@solana/web3.js` in your project, since it is used as peer dependency.

```
npm i @solana/web3.js
npm i @nfteyez/sol-rayz

```

## How to use

The very basic example looks like this:

```javascript
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

try {
  // const address = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy;
  // or use Solana Domain
  const address = "NftEyez.sol";

  const publicAddress = await resolveToWalletAddress({
    text: address
  });

  const nftArray = await getParsedNftAccountsByOwner({
    publicAddress,
  });
} catch (error) {
  console.log("Error thrown, while fetching NFTs", error.message);
}
```

1. First, we import methods from "@nfteyez/sol-rayz".
2. Then we use `resolveToWalletAddress()` fn to check if passed string is [Solana Domain Names](https://docs.bonfida.org/collection/v/help/an-introduction-to-the-solana-name-service) or just usual Solana address, it also checks if such address is valid Solana public key. Otherwise, it throw the error. You can also skip this method if you are sure you have correct Solana wallet public key.
3. Finaly, we fetch all NFTs for this address with `getParsedNftAccountsByOwner()` method, passing object with only 1 argument `publicAddress`.

### Some Notes

In this example we pass object with single 1 argument `publicAddress`.
However, in real-life scenario, most times you will also wish to pass at least `Connection` object with your custom rpc-node. By default `getParsedNftAccountsByOwner()` fetches NFTs from Solana `mainnet` rpc-node, but since this method may do thousands of rpc-node calls for single wallet (depends of number of NFTs it holds), you may be quickly banned by network for abusing it. Custom RPC-nodes doesn't have such restrictions.

Keep in mind most methods from the package throw an error in case of any issues, so you might need to wrap them with `try-catch` block. This done intentionaly to force you handle possible errors and to provide you with proper error message.

## Available Methods

Here is the list of available methods:

| Method Name                           | Returns                                                                    |     |
| ------------------------------------- | -------------------------------------------------------------------------- | --- |
| getParsedNftAccountsByOwner           | List of valid NFTs holded by passed wallet                                 |     |
| getParsedAccountByMint                | Mint information. Finding the token owner is main purpose of using this fn |     |
| getParsedNftAccountsByUpdateAuthority | ????                                                                       |     |

| Utils Method Name        | Returns                                                                                                                          |     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --- |
| resolveToWalletAddress   | Can be used to to check and resolve provided text (like Solana Domain name ) into valid Solana wallet address. or fail otherwise |     |
| isValidSolanaAddress     | Check if passed address is valid Solana address                                                                                  |     |
| createConnectionConfig   | ???                                                                                                                              |     |
| getSolanaMetadataAddress | Get Addresses of Metadata account assosiated with Mint Token                                                                     |     |
| decodeTokenMetadata      | Decode Buffer-type data into readable object                                                                                     |     |

### `getParsedNftAccountsByOwner`

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
   * Limit response by this number
   * by default response limited by 5000 NFTs
   */
  limit?: number;
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
