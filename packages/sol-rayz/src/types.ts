export type StringPublicKey = string;

export interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

export interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

export type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;
