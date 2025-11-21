/**
 * @deprecated This hook is deprecated. Use useQVRoom hook instead for voter operations.
 * 
 * Migration guide:
 * - For registerVoter: use useQVRoom({ roomAddress }).registerVoter(matNumber)
 * - For castVote: use useQVRoom({ roomAddress }).castVote(sessionId, proposalIds, credits)
 * 
 * This hook is kept for backwards compatibility only.
 */

import { type Address } from "viem";
import { useQVRoom } from "./useQVRoom";

interface UseVoterParams {
  roomAddress?: Address;
}

export const useVoter = ({ roomAddress }: UseVoterParams = {}) => {
  const {
    registerVoter: registerVoterFn,
    castVote: castVoteFn,
    isWriting,
    errorWrite,
  } = useQVRoom({ roomAddress });

  const registerVoter = async (matNumber: string) => {
    if (!roomAddress) {
      throw new Error("Room address is required");
    }
    try {
      await registerVoterFn(matNumber);
    } catch (err: any) {
      console.error("Failed to register voter:", err);
      throw err;
    }
  };

  const castVote = async (
    sessionId: bigint,
    proposalIds: bigint[],
    credits: bigint[]
  ) => {
    if (!roomAddress) {
      throw new Error("Room address is required");
    }

    // Validate arrays have same length
    if (proposalIds.length !== credits.length) {
      throw new Error("ProposalIds and credits arrays must have the same length");
    }

    try {
      await castVoteFn(sessionId, proposalIds, credits);
    } catch (err: any) {
      console.error("Failed to cast vote:", err);
      throw err;
    }
  };

  return {
    registerVoter,
    castVote,
    loading: isWriting,
    error: errorWrite?.message || null,
  };
};