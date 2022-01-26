# @nfteyez/sol-rayz

These packages created to simplify the process of parsing NFTs on Solana. The project written in TypeScript and is used/battle-tested by [NftEyez.Global](https://nfteyez.global/) with thousands of daily users.

## How to use

The simplest way to use it in your app is install package, also you need install `@solana/web3.js` in your project, since it is used as peer dependency.

```bash
npm i @solana/web3.js
npm i @nfteyez/sol-rayz
```

then use it this way:

```javascript
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

// const address = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy;
// or use Solana Domain
const address = "NftEyez.sol";

const publicAddress = await resolveToWalletAddress({
  text: address
});

const nftArray = await getParsedNftAccountsByOwner({
  publicAddress,
});
```

## Details

This project consists of 2 packages. Please refer to specific README file for in-depth details:

- [`@nfteyez/sol-rayz`](https://github.com/NftEyez/sol-rayz/tree/main/packages/sol-rayz) - basic functionality, like fetch all NFTs for specific wallet or by Authority. Designed to be used in browser or Node.JS env. Read [Details](https://github.com/NftEyez/sol-rayz/tree/main/packages/sol-rayz).
- [`@nfteyez/sol-rayz-react`](https://github.com/NftEyez/sol-rayz/tree/main/packages/sol-rayz-react) - bunch of hooks and utils to be used within React app. You can think of it as highlevel construction upon `@nfteyez/sol-rayz` package to simplify its use in UI. Read [Details](https://github.com/NftEyez/sol-rayz/tree/main/packages/sol-rayz-react).

<hr />

## Development

### This section related only for the people who wants contribute to this project.

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
