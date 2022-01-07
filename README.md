## @nfteyez/sol-rayz

These packages created to simplify the process of parsing NFTs on Solana.

It consists of:

- `@nfteyez/sol-rayz` - package basic things like fetch all NFTs for specific wallet. Designed to be used in browser or Node.JS env.
- `@nfteyez/sol-rayz-react` - bunch of hooks and utils to be used within React app.

## Install

You need install `@solana/web3.js` in your project, since it is used as peer dependency.

```
npm i @solana/web3.js
npm i @nfteyez/sol-rayz

```

or if you want to use code with React

```
npm i @solana/web3.js
npm i @nfteyez/sol-rayz-react

```

## How to use

<!-- TBA -->

`getParsedNftAccountsByOwner` - return parsed list of NFTs (SPL Tokens) for given wallet public address. Each item in array have all data specified on the blockchain. The NFT metadata stored separately, you need to pick `uri` property for each token and fetch data youself.

```
import {
  getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";

const tokenList = getParsedNftAccountsByOwner();
```

`createConnectionConfig` - method for creating a "connection" with Solana, have two params: clusterApi and commitment.

`getParsedNftAccountsByOwner` - method to get array of parsed NFTs by owner address. Have three params: wallet address(required), connection , serialization (true/false).

`isValidSolanaAddress` - check if provided string is valid Solana address.

TBD

TODO list:

- Create descriptive README
- Add React Hooks
-

## Development

<!-- TBA -->

Instructions for starting project for the contributors.
Clone repo, run in root of the project:

```
yarn
yarn run build
```

### Development process

You might want to test package while you do changes. For this purpose you can use react app in `packages/sol-rayz-dev` and start package you are working on in watch mode, for example `sol-rayz`:

```bash
# go to sol-rayz
cd packages/sol-rayz
yarn run watch

# in new tab go to react app
cd packages/sol-rayz-dev
yarn run start
```

Now when you changes something `sol-rayz` package it will be automatically updated in `sol-rayz-dev` app.

### Add New new dependency to some package

Here is example how to add new dependency module `@solana/spl-name-service` to `@nfteyez/sol-rayz` package:

```
 lerna add @solana/spl-name-service --scope=@nfteyez/sol-rayz
```
