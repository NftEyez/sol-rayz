export type NftTokenAccount = {
  id?: string;
  data: any;
  isMutable: 0 | 1;
  key: 0 | 1 | 2 | 3 | 4;
  mint: string;
  primarySaleHappened: 0 | 1;
  updateAuthority: string;
};

export type StringPublicKey = string;

export type WalletResult = {
  nfts: NftTokenAccount[];
  error: unknown | undefined;
  isLoading: boolean;
};
