/**
 * @deprecated This file is deprecated. Use wagmi hooks instead:
 * - usePublicClient() for read operations
 * - useWalletClient() for write operations
 * - Keeping for backwards compatibility only
 */

import { BrowserProvider, Eip1193Provider, ethers } from "ethers";

export const readOnlyProvider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL
);

export const getProvider = (provider: Eip1193Provider | any | undefined) => {
  if (provider) {
    return new ethers.BrowserProvider(provider);
  }
};
