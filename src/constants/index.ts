import { type Address } from "viem";
import { baseSepolia } from "viem/chains";

/**
 * Contract Addresses
 */
export const QVFactoryContract: Address = "0x50139d921E6746C628dB7AbEc73060e8DA70afad";

/**
 * Chain Configuration
 */
export const SUPPORTED_CHAIN = baseSepolia;
export const CHAIN_ID = baseSepolia.id;

/**
 * RPC Configuration
 */
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || baseSepolia.rpcUrls.default.http[0];

/**
 * App Configuration
 */
export const APP_NAME = "QV FE";
export const APP_DESCRIPTION = "Room based Quadratic voting application";