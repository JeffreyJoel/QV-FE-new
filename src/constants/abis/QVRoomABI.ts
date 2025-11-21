export const QVRoomABI = [
    {
      "type": "constructor",
      "inputs": [
        { "name": "_name", "type": "string", "internalType": "string" },
        { "name": "_description", "type": "string", "internalType": "string" },
        { "name": "_creator", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "active",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "authorizedVoters",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "baseCredits",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "castVote",
      "inputs": [
        { "name": "_sessionId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_proposalIds",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        { "name": "_credits", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createVotingSession",
      "inputs": [
        { "name": "_name", "type": "string", "internalType": "string" },
        { "name": "_description", "type": "string", "internalType": "string" },
        { "name": "_startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "_endTime", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_creditsPerVoter",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_proposals",
          "type": "tuple[]",
          "internalType": "struct QVRoom.ProposalInput[]",
          "components": [
            { "name": "title", "type": "string", "internalType": "string" },
            {
              "name": "description",
              "type": "string",
              "internalType": "string"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createdAt",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "creator",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "deactivateRoom",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "description",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getProposalDetails",
      "inputs": [
        { "name": "_sessionId", "type": "uint256", "internalType": "uint256" },
        { "name": "_proposalId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "title", "type": "string", "internalType": "string" },
        {
          "name": "proposalDescription",
          "type": "string",
          "internalType": "string"
        },
        { "name": "voteCount", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoomInfo",
      "inputs": [],
      "outputs": [
        { "name": "roomName", "type": "string", "internalType": "string" },
        {
          "name": "roomDescription",
          "type": "string",
          "internalType": "string"
        },
        { "name": "isActive", "type": "bool", "internalType": "bool" },
        { "name": "roomCreator", "type": "address", "internalType": "address" },
        {
          "name": "roomCreatedAt",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "roomParticipantCount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "roomSessionCount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getSessionDetails",
      "inputs": [
        { "name": "_sessionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "sessionName", "type": "string", "internalType": "string" },
        {
          "name": "sessionDescription",
          "type": "string",
          "internalType": "string"
        },
        { "name": "startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "endTime", "type": "uint256", "internalType": "uint256" },
        {
          "name": "creditsPerVoter",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "isActive", "type": "bool", "internalType": "bool" },
        {
          "name": "sessionCreator",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "proposalCount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUserVoteHistory",
      "inputs": [
        { "name": "_user", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct QVRoom.Vote[]",
          "components": [
            {
              "name": "sessionId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "proposalId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "credits", "type": "uint256", "internalType": "uint256" },
            {
              "name": "timestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVoterCredits",
      "inputs": [
        { "name": "_sessionId", "type": "uint256", "internalType": "uint256" },
        { "name": "_voter", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVoterDetails",
      "inputs": [
        { "name": "_voter", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "matNumber", "type": "string", "internalType": "string" },
        { "name": "isRegistered", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVoterProposalVotes",
      "inputs": [
        { "name": "_sessionId", "type": "uint256", "internalType": "uint256" },
        { "name": "_voter", "type": "address", "internalType": "address" },
        { "name": "_proposalId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasRoomAccess",
      "inputs": [
        { "name": "_user", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "joinRoom",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "participantCount",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "registerVoter",
      "inputs": [
        { "name": "_matNumber", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "sessionCount",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "sessions",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [
        { "name": "name", "type": "string", "internalType": "string" },
        { "name": "description", "type": "string", "internalType": "string" },
        { "name": "startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "endTime", "type": "uint256", "internalType": "uint256" },
        {
          "name": "creditsPerVoter",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "active", "type": "bool", "internalType": "bool" },
        {
          "name": "proposalCount",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "creator", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "updateBaseCredits",
      "inputs": [
        { "name": "_newBaseCredits", "type": "uint8", "internalType": "uint8" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "userVoteHistory",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "sessionId", "type": "uint256", "internalType": "uint256" },
        { "name": "proposalId", "type": "uint256", "internalType": "uint256" },
        { "name": "credits", "type": "uint256", "internalType": "uint256" },
        { "name": "timestamp", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "voters",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [
        { "name": "matNumber", "type": "string", "internalType": "string" },
        { "name": "isRegistered", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "BaseCreditsUpdated",
      "inputs": [
        {
          "name": "newBaseCredits",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProposalAdded",
      "inputs": [
        {
          "name": "sessionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "proposalId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "description",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoomAccessGranted",
      "inputs": [
        {
          "name": "voter",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoomDeactivated",
      "inputs": [
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "SessionCreated",
      "inputs": [
        {
          "name": "sessionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "name",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "creator",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "startTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "endTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "VoteCast",
      "inputs": [
        {
          "name": "voter",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sessionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "proposalId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "credits",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "voteWeight",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "VoterRegistered",
      "inputs": [
        {
          "name": "voter",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "matNumber",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    { "type": "error", "name": "InsufficientCredits", "inputs": [] },
    { "type": "error", "name": "InvalidProposalId", "inputs": [] },
    { "type": "error", "name": "InvalidTimeRange", "inputs": [] },
    { "type": "error", "name": "MismatchedArrays", "inputs": [] },
    { "type": "error", "name": "NoProposalsProvided", "inputs": [] },
    { "type": "error", "name": "NotAuthorized", "inputs": [] },
    { "type": "error", "name": "OnlyCreator", "inputs": [] },
    { "type": "error", "name": "RoomNotActive", "inputs": [] },
    { "type": "error", "name": "SessionNotActive", "inputs": [] },
    { "type": "error", "name": "SessionNotInProgress", "inputs": [] },
    { "type": "error", "name": "VoterNotRegistered", "inputs": [] }
  ]