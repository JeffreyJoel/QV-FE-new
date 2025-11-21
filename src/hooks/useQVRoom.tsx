"use client";

import { useState, useCallback } from "react";
import { 
  useReadContract, 
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount 
} from "wagmi";
import { type Address } from "viem";
import { QVRoomABI } from "@/constants/abis/QVRoomABI";

// Types
interface VoterVote {
  proposalId: number;
  credits: number;
  votes: number;
}

interface Voter {
  id: number;
  address: string;
  name: string;
  votes: VoterVote[];
  totalCredits: number;
  matNumber?: string;
  isRegistered?: boolean;
}

interface ProposalResult {
  id: number;
  title: string;
  description: string;
  votes: number;
}

interface VotingResultsData {
  proposals: ProposalResult[];
  voters: Voter[];
  totalVotesByProposal: Record<string, number>;
  totalCreditsByProposal: Record<string, number>;
}

interface RoomInfo {
  name: string;
  description: string;
  active: boolean;
  creator: Address;
  createdAt: bigint;
  participantCount: bigint;
  sessionCount: bigint;
}

interface SessionDetails {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  creditsPerVoter: string;
  active: boolean;
  creator: Address;
  proposalCount: string;
}

interface ProposalDetails {
  id: string;
  title: string;
  description: string;
  voteCount: string;
  sessionId: string;
}

interface ProposalInput {
  title: string;
  description: string;
}

interface UseQVRoomParams {
  roomAddress?: Address;
  sessionId?: bigint;
  proposalId?: bigint;
  voterAddress?: Address;
  enabled?: boolean;
}

interface UseQVRoomReturn {
  // Write functions
  createVotingSession: (
    name: string,
    description: string,
    startTime: bigint,
    endTime: bigint,
    creditsPerVoter: bigint,
    proposals: ProposalInput[]
  ) => Promise<Address | undefined>;
  castVote: (
    sessionId: bigint,
    proposalIds: bigint[],
    credits: bigint[]
  ) => Promise<Address | undefined>;
  joinRoom: () => Promise<Address | undefined>;
  registerVoter: (matNumber: string) => Promise<Address | undefined>;
  deactivateRoom: () => Promise<Address | undefined>;
  
  // Read contract data
  roomInfo: RoomInfo | undefined;
  sessionDetails: SessionDetails | undefined;
  proposalDetails: ProposalDetails | undefined;
  voterDetails: { matNumber: string; isRegistered: boolean } | undefined;
  voterProposalVotes: bigint | undefined;
  hasAccess: boolean | undefined;
  
  // Refetch functions
  refetchRoomInfo: () => void;
  refetchSessionDetails: () => void;
  refetchProposalDetails: () => void;
  refetchVoterDetails: () => void;
  refetchVoterProposalVotes: () => void;
  refetchHasAccess: () => void;
  
  // Helper functions
  fetchAllSessions: () => Promise<SessionDetails[]>;
  fetchAllProposals: (sessionId: bigint) => Promise<ProposalDetails[]>;
  processVotingResults: (
    sessionId: bigint,
    addresses: Address[]
  ) => Promise<VotingResultsData | null>;
  
  // Loading states
  isLoadingRoomInfo: boolean;
  isLoadingSessionDetails: boolean;
  isLoadingProposalDetails: boolean;
  isLoadingVoterDetails: boolean;
  isLoadingVoterProposalVotes: boolean;
  isLoadingHasAccess: boolean;
  isWriting: boolean;
  isConfirming: boolean;
  
  // Error states
  errorRoomInfo: Error | null;
  errorSessionDetails: Error | null;
  errorProposalDetails: Error | null;
  errorVoterDetails: Error | null;
  errorVoterProposalVotes: Error | null;
  errorHasAccess: Error | null;
  errorWrite: Error | null;
  
  // Transaction data
  txHash: Address | undefined;
  txReceipt: any;
}

export const useQVRoom = ({
  roomAddress,
  sessionId,
  proposalId,
  voterAddress,
  enabled = true,
}: UseQVRoomParams = {}): UseQVRoomReturn => {
  const { address: connectedAddress } = useAccount();
  const [processingResults, setProcessingResults] = useState(false);
  
  // Read: Get room info
  const {
    data: roomInfoData,
    isLoading: isLoadingRoomInfo,
    error: errorRoomInfo,
    refetch: refetchRoomInfo,
  } = useReadContract({
    address: roomAddress,
    abi: QVRoomABI,
    functionName: "getRoomInfo",
    query: {
      enabled: enabled && !!roomAddress,
    },
  });

  // Parse room info
  const roomInfo: RoomInfo | undefined = roomInfoData ? {
    name: (roomInfoData as any)[0],
    description: (roomInfoData as any)[1],
    active: (roomInfoData as any)[2],
    creator: (roomInfoData as any)[3] as Address,
    createdAt: (roomInfoData as any)[4] as bigint,
    participantCount: (roomInfoData as any)[5] as bigint,
    sessionCount: (roomInfoData as any)[6] as bigint,
  } : undefined;

  // Read: Get session details
  const {
    data: sessionDetailsData,
    isLoading: isLoadingSessionDetails,
    error: errorSessionDetails,
    refetch: refetchSessionDetails,
  } = useReadContract({
    address: roomAddress,
    abi: QVRoomABI,
    functionName: "getSessionDetails",
    args: sessionId !== undefined ? [sessionId] : undefined,
    query: {
      enabled: enabled && !!roomAddress && sessionId !== undefined,
    },
  });

  // Parse session details
  const sessionDetails: SessionDetails | undefined = sessionDetailsData ? {
    id: sessionId?.toString() || "0",
    name: (sessionDetailsData as any)[0],
    description: (sessionDetailsData as any)[1],
    startTime: (sessionDetailsData as any)[2]?.toString(),
    endTime: (sessionDetailsData as any)[3]?.toString(),
    creditsPerVoter: (sessionDetailsData as any)[4]?.toString(),
    active: (sessionDetailsData as any)[5],
    creator: (sessionDetailsData as any)[6] as Address,
    proposalCount: (sessionDetailsData as any)[7]?.toString(),
  } : undefined;

  // Read: Get proposal details
  const {
    data: proposalDetailsData,
    isLoading: isLoadingProposalDetails,
    error: errorProposalDetails,
    refetch: refetchProposalDetails,
  } = useReadContract({
    address: roomAddress,
    abi: QVRoomABI,
    functionName: "getProposalDetails",
    args: sessionId !== undefined && proposalId !== undefined ? [sessionId, proposalId] : undefined,
    query: {
      enabled: enabled && !!roomAddress && sessionId !== undefined && proposalId !== undefined,
    },
  });

  // Parse proposal details
  const proposalDetails: ProposalDetails | undefined = proposalDetailsData ? {
    id: proposalId?.toString() || "0",
    title: (proposalDetailsData as any)[0],
    description: (proposalDetailsData as any)[1],
    voteCount: (proposalDetailsData as any)[2]?.toString(),
    sessionId: sessionId?.toString() || "0",
  } : undefined;

  // Read: Get voter details
  const {
    data: voterDetailsData,
    isLoading: isLoadingVoterDetails,
    error: errorVoterDetails,
    refetch: refetchVoterDetails,
  } = useReadContract({
    address: roomAddress,
    abi: QVRoomABI,
    functionName: "getVoterDetails",
    args: voterAddress ? [voterAddress] : connectedAddress ? [connectedAddress] : undefined,
    query: {
      enabled: enabled && !!roomAddress && !!(voterAddress || connectedAddress),
    },
  });

  // Parse voter details
  const voterDetails = voterDetailsData ? {
    matNumber: (voterDetailsData as any)[0],
    isRegistered: (voterDetailsData as any)[1],
  } : undefined;

  // Read: Get voter proposal votes
  const {
    data: voterProposalVotes,
    isLoading: isLoadingVoterProposalVotes,
    error: errorVoterProposalVotes,
    refetch: refetchVoterProposalVotes,
  } = useReadContract({
    address: roomAddress,
    abi: QVRoomABI,
    functionName: "getVoterProposalVotes",
    args: sessionId !== undefined && proposalId !== undefined && (voterAddress || connectedAddress)
      ? [sessionId, voterAddress || connectedAddress, proposalId]
      : undefined,
    query: {
      enabled: enabled && !!roomAddress && sessionId !== undefined && proposalId !== undefined && !!(voterAddress || connectedAddress),
    },
  });

  // Read: Check room access
  const {
    data: hasAccess,
    isLoading: isLoadingHasAccess,
    error: errorHasAccess,
    refetch: refetchHasAccess,
  } = useReadContract({
    address: roomAddress,
    abi: QVRoomABI,
    functionName: "hasRoomAccess",
    args: voterAddress ? [voterAddress] : connectedAddress ? [connectedAddress] : undefined,
    query: {
      enabled: enabled && !!roomAddress && !!(voterAddress || connectedAddress),
    },
  });

  // Write contract hook
  const {
    writeContractAsync,
    data: txHash,
    isPending: isWriting,
    error: errorWrite,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    data: txReceipt,
    isLoading: isConfirming,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  /**
   * Creates a new voting session
   */
  const createVotingSession = async (
    name: string,
    description: string,
    startTime: bigint,
    endTime: bigint,
    creditsPerVoter: bigint,
    proposals: ProposalInput[]
  ): Promise<Address | undefined> => {
    if (!roomAddress) throw new Error("Room address is required");

    try {
      const hash = await writeContractAsync({
        address: roomAddress,
        abi: QVRoomABI,
        functionName: "createVotingSession",
        args: [name, description, startTime, endTime, creditsPerVoter, proposals],
      });

      // Refetch data after successful creation
      refetchRoomInfo();
      
      return hash;
    } catch (err: any) {
      console.error("Failed to create voting session:", err);
      throw err;
    }
  };

  /**
   * Casts a vote
   */
  const castVote = async (
    sessionId: bigint,
    proposalIds: bigint[],
    credits: bigint[]
  ): Promise<Address | undefined> => {
    if (!roomAddress) throw new Error("Room address is required");

    try {
      const hash = await writeContractAsync({
        address: roomAddress,
        abi: QVRoomABI,
        functionName: "castVote",
        args: [sessionId, proposalIds, credits],
      });

      // Refetch relevant data
      refetchSessionDetails();
      refetchProposalDetails();
      refetchVoterProposalVotes();
      
      return hash;
    } catch (err: any) {
      console.error("Failed to cast vote:", err);
      throw err;
    }
  };

  /**
   * Joins the room
   */
  const joinRoom = async (): Promise<Address | undefined> => {
    if (!roomAddress) throw new Error("Room address is required");

    try {
      const hash = await writeContractAsync({
        address: roomAddress,
        abi: QVRoomABI,
        functionName: "joinRoom",
      });

      // Refetch data
      refetchRoomInfo();
      refetchHasAccess();
      
      return hash;
    } catch (err: any) {
      console.error("Failed to join room:", err);
      throw err;
    }
  };

  /**
   * Registers a voter
   */
  const registerVoter = async (matNumber: string): Promise<Address | undefined> => {
    if (!roomAddress) throw new Error("Room address is required");

    try {
      const hash = await writeContractAsync({
        address: roomAddress,
        abi: QVRoomABI,
        functionName: "registerVoter",
        args: [matNumber],
      });

      // Refetch voter details
      refetchVoterDetails();
      
      return hash;
    } catch (err: any) {
      console.error("Failed to register voter:", err);
      throw err;
    }
  };

  /**
   * Deactivates the room
   */
  const deactivateRoom = async (): Promise<Address | undefined> => {
    if (!roomAddress) throw new Error("Room address is required");

    try {
      const hash = await writeContractAsync({
        address: roomAddress,
        abi: QVRoomABI,
        functionName: "deactivateRoom",
      });

      // Refetch room info
      refetchRoomInfo();
      
      return hash;
    } catch (err: any) {
      console.error("Failed to deactivate room:", err);
      throw err;
    }
  };

  /**
   * Fetches all sessions for the room
   */
  const fetchAllSessions = useCallback(async (): Promise<SessionDetails[]> => {
    if (!roomAddress || !roomInfo?.sessionCount) return [];

    try {
      const sessionCount = Number(roomInfo.sessionCount);
      const sessions: SessionDetails[] = [];

      for (let i = 0; i < sessionCount; i++) {
        const { data } = await refetchSessionDetails();
        if (data) {
          sessions.push({
            id: i.toString(),
            name: (data as any)[0],
            description: (data as any)[1],
            startTime: (data as any)[2]?.toString(),
            endTime: (data as any)[3]?.toString(),
            creditsPerVoter: (data as any)[4]?.toString(),
            active: (data as any)[5],
            creator: (data as any)[6] as Address,
            proposalCount: (data as any)[7]?.toString(),
          });
        }
      }

      return sessions;
    } catch (err: any) {
      console.error("Failed to fetch sessions:", err);
      return [];
    }
  }, [roomAddress, roomInfo?.sessionCount, refetchSessionDetails]);

  /**
   * Fetches all proposals for a session
   */
  const fetchAllProposals = useCallback(async (
    sessionId: bigint
  ): Promise<ProposalDetails[]> => {
    if (!roomAddress) return [];

    try {
      // First get session details to know proposal count
      const { data: sessionData } = await refetchSessionDetails();
      if (!sessionData) return [];

      const proposalCount = Number((sessionData as any)[7]);
      const proposals: ProposalDetails[] = [];

      for (let i = 0; i < proposalCount; i++) {
        const { data: proposalData } = await refetchProposalDetails();
        if (proposalData) {
          proposals.push({
            id: i.toString(),
            title: (proposalData as any)[0],
            description: (proposalData as any)[1],
            voteCount: (proposalData as any)[2]?.toString(),
            sessionId: sessionId.toString(),
          });
        }
      }

      return proposals;
    } catch (err: any) {
      console.error("Failed to fetch proposals:", err);
      return [];
    }
  }, [roomAddress, refetchSessionDetails, refetchProposalDetails]);

  /**
   * Processes voting results for a session
   */
  const processVotingResults = useCallback(async (
    sessionId: bigint,
    addresses: Address[]
  ): Promise<VotingResultsData | null> => {
    if (!roomAddress) return null;

    setProcessingResults(true);

    try {
      // Fetch proposals
      const proposals = await fetchAllProposals(sessionId);

      // Process voter data
      const voters: Voter[] = [];
      const totalVotesByProposal: Record<string, number> = {};
      const totalCreditsByProposal: Record<string, number> = {};

      // Initialize totals
      proposals.forEach(proposal => {
        totalVotesByProposal[proposal.title] = 0;
        totalCreditsByProposal[proposal.title] = 0;
      });

      for (let i = 0; i < addresses.length; i++) {
        const voterAddress = addresses[i];
        
        // Get voter details - need to make a direct read call
        // This is a limitation - we'd need to use publicClient directly for dynamic reads
        // For now, we'll use the hook pattern
        
        const voter: Voter = {
          id: i + 1,
          address: voterAddress,
          name: `Voter ${i + 1}`,
          votes: [],
          totalCredits: 0,
        };

        // Get votes for each proposal
        for (let proposalId = 0; proposalId < proposals.length; proposalId++) {
          try {
            // This would need a dynamic read call
            // We'll need to refactor this to use publicClient
            const votes = 0; // Placeholder

            if (votes > 0) {
              const credits = Number(votes) * Number(votes);
              const proposalTitle = proposals[proposalId].title;

              voter.votes.push({
                proposalId: proposalId + 1,
                credits,
                votes: Number(votes)
              });

              voter.totalCredits += credits;
              totalVotesByProposal[proposalTitle] += Number(votes);
              totalCreditsByProposal[proposalTitle] += credits;
            }
          } catch (err: any) {
            // Skip errors for individual votes
          }
        }

        if (voter.votes.length > 0) {
          voters.push(voter);
        }
      }

      const proposalResults: ProposalResult[] = proposals.map((proposal, idx) => ({
        id: idx + 1,
        title: proposal.title,
        description: proposal.description,
        votes: totalVotesByProposal[proposal.title]
      }));

      return {
        proposals: proposalResults,
        voters,
        totalVotesByProposal,
        totalCreditsByProposal
      };
      
    } catch (err: any) {
      console.error("Failed to process voting results:", err);
      return null;
    } finally {
      setProcessingResults(false);
    }
  }, [roomAddress, fetchAllProposals]);

  return {
    // Write functions
    createVotingSession,
    castVote,
    joinRoom,
    registerVoter,
    deactivateRoom,
    
    // Read contract data
    roomInfo,
    sessionDetails,
    proposalDetails,
    voterDetails,
    voterProposalVotes: voterProposalVotes as bigint | undefined,
    hasAccess: hasAccess as boolean | undefined,
    
    // Refetch functions
    refetchRoomInfo,
    refetchSessionDetails,
    refetchProposalDetails,
    refetchVoterDetails,
    refetchVoterProposalVotes,
    refetchHasAccess,
    
    // Helper functions
    fetchAllSessions,
    fetchAllProposals,
    processVotingResults,
    
    // Loading states
    isLoadingRoomInfo,
    isLoadingSessionDetails,
    isLoadingProposalDetails,
    isLoadingVoterDetails,
    isLoadingVoterProposalVotes,
    isLoadingHasAccess,
    isWriting: isWriting || processingResults,
    isConfirming,
    
    // Error states
    errorRoomInfo: errorRoomInfo as Error | null,
    errorSessionDetails: errorSessionDetails as Error | null,
    errorProposalDetails: errorProposalDetails as Error | null,
    errorVoterDetails: errorVoterDetails as Error | null,
    errorVoterProposalVotes: errorVoterProposalVotes as Error | null,
    errorHasAccess: errorHasAccess as Error | null,
    errorWrite: errorWrite as Error | null,
    
    // Transaction data
    txHash,
    txReceipt,
  };
};

