"use client";

import { useState } from "react";
import { 
  useReadContract, 
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount 
} from "wagmi";
import { type Address } from "viem";
import { QVFactoryABI } from "@/constants/abis/QVFactoryABI";
import { QVFactoryContract } from "@/constants";

interface ContractError {
  code: string;
  message: string;
  transaction?: any;
}

interface UseQVFactoryParams {
  creatorAddress?: Address;
  roomAddress?: Address;
  roomIndex?: number;
  enabled?: boolean;
}

interface UseQVFactoryReturn {
  // Write functions
  createRoom: (name: string, description: string) => Promise<Address | undefined>;
  
  // Read contract data
  allRooms: Address[] | undefined;
  roomCount: bigint | undefined;
  roomsByCreator: Address[] | undefined;
  isValidRoomResult: boolean | undefined;
  roomAtIndex: Address | undefined;
  
  // Refetch functions
  refetchAllRooms: () => void;
  refetchRoomCount: () => void;
  refetchRoomsByCreator: () => void;
  refetchIsValidRoom: () => void;
  refetchRoomAtIndex: () => void;
  
  // Loading states
  isLoadingAllRooms: boolean;
  isLoadingRoomCount: boolean;
  isLoadingRoomsByCreator: boolean;
  isLoadingIsValidRoom: boolean;
  isLoadingRoomAtIndex: boolean;
  isCreatingRoom: boolean;
  isConfirming: boolean;
  
  // Error states
  errorAllRooms: Error | null;
  errorRoomCount: Error | null;
  errorRoomsByCreator: Error | null;
  errorIsValidRoom: Error | null;
  errorRoomAtIndex: Error | null;
  errorCreateRoom: Error | null;
  
  // Transaction data
  txHash: Address | undefined;
  txReceipt: any;
}

export const useQVFactory = ({
  creatorAddress,
  roomAddress,
  roomIndex,
  enabled = true,
}: UseQVFactoryParams = {}): UseQVFactoryReturn => {
  const { address: connectedAddress } = useAccount();
  
  // Read: Get all rooms
  const {
    data: allRooms,
    isLoading: isLoadingAllRooms,
    error: errorAllRooms,
    refetch: refetchAllRooms,
  } = useReadContract({
    address: QVFactoryContract as Address,
    abi: QVFactoryABI,
    functionName: "getAllRooms",
    query: {
      enabled,
    },
  });

  // Read: Get room count
  const {
    data: roomCount,
    isLoading: isLoadingRoomCount,
    error: errorRoomCount,
    refetch: refetchRoomCount,
  } = useReadContract({
    address: QVFactoryContract as Address,
    abi: QVFactoryABI,
    functionName: "getRoomCount",
    query: {
      enabled,
    },
  });

  // Read: Get rooms by creator
  const {
    data: roomsByCreator,
    isLoading: isLoadingRoomsByCreator,
    error: errorRoomsByCreator,
    refetch: refetchRoomsByCreator,
  } = useReadContract({
    address: QVFactoryContract as Address,
    abi: QVFactoryABI,
    functionName: "getRoomsByCreator",
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: enabled && !!creatorAddress,
    },
  });

  // Read: Check if valid room
  const {
    data: isValidRoomResult,
    isLoading: isLoadingIsValidRoom,
    error: errorIsValidRoom,
    refetch: refetchIsValidRoom,
  } = useReadContract({
    address: QVFactoryContract as Address,
    abi: QVFactoryABI,
    functionName: "isValidRoom",
    args: roomAddress ? [roomAddress] : undefined,
    query: {
      enabled: enabled && !!roomAddress,
    },
  });

  // Read: Get room at index
  const {
    data: roomAtIndex,
    isLoading: isLoadingRoomAtIndex,
    error: errorRoomAtIndex,
    refetch: refetchRoomAtIndex,
  } = useReadContract({
    address: QVFactoryContract as Address,
    abi: QVFactoryABI,
    functionName: "allRooms",
    args: roomIndex !== undefined ? [BigInt(roomIndex)] : undefined,
    query: {
      enabled: enabled && roomIndex !== undefined,
    },
  });

  // Write: Create room
  const {
    writeContractAsync,
    data: txHash,
    isPending: isCreatingRoom,
    error: errorCreateRoom,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    data: txReceipt,
    isLoading: isConfirming,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  /**
   * Creates a new room using async/await pattern
   * @param name - The name of the room
   * @param description - The description of the room
   * @returns Promise<Address | undefined> - The transaction hash
   */
  const createRoom = async (
    name: string,
    description: string
  ): Promise<Address | undefined> => {
    try {
      const hash = await writeContractAsync({
        address: QVFactoryContract as Address,
        abi: QVFactoryABI,
        functionName: "createRoom",
        args: [name, description],
      });
      
      // Refetch data after successful creation
      refetchAllRooms();
      refetchRoomCount();
      if (connectedAddress) {
        refetchRoomsByCreator();
      }
      
      return hash;
    } catch (err: any) {
      console.error("Failed to create room:", err);
      throw err;
    }
  };

  return {
    // Write functions
    createRoom,
    
    // Read contract data
    allRooms: allRooms as Address[] | undefined,
    roomCount: roomCount as bigint | undefined,
    roomsByCreator: roomsByCreator as Address[] | undefined,
    isValidRoomResult: isValidRoomResult as boolean | undefined,
    roomAtIndex: roomAtIndex as Address | undefined,
    
    // Refetch functions
    refetchAllRooms,
    refetchRoomCount,
    refetchRoomsByCreator,
    refetchIsValidRoom,
    refetchRoomAtIndex,
    
    // Loading states
    isLoadingAllRooms,
    isLoadingRoomCount,
    isLoadingRoomsByCreator,
    isLoadingIsValidRoom,
    isLoadingRoomAtIndex,
    isCreatingRoom,
    isConfirming,
    
    // Error states
    errorAllRooms: errorAllRooms as Error | null,
    errorRoomCount: errorRoomCount as Error | null,
    errorRoomsByCreator: errorRoomsByCreator as Error | null,
    errorIsValidRoom: errorIsValidRoom as Error | null,
    errorRoomAtIndex: errorRoomAtIndex as Error | null,
    errorCreateRoom: errorCreateRoom as Error | null,
    
    // Transaction data
    txHash,
    txReceipt,
  };
};

