// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SKYCOIN4444 DAO (Decentralized Autonomous Organization) Contract
 * @dev Enables community governance through token-based voting.
 * Holders of SKYCOIN tokens can create and vote on proposals.
 */
contract SKYCOIN4444DAO is Ownable {
    IERC20 public skycoinToken; // The SKYCOIN ERC20 token used for voting

    struct Proposal {
        uint256 id; // Unique ID for the proposal
        address proposer; // Address of the proposal creator
        string description; // Description of the proposal
        uint256 voteCountYes; // Number of 'Yes' votes
        uint256 voteCountNo; // Number of 'No' votes
        uint256 startTime; // Timestamp when voting starts
        uint256 endTime; // Timestamp when voting ends
        bool executed; // True if the proposal has been executed
        bool passed; // True if the proposal passed
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId; // Counter for unique proposal IDs

    // Mapping from proposal ID to voter address to boolean (true if voted)
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public minVotingPower; // Minimum SKYCOIN tokens required to create a proposal
    uint256 public votingPeriodDuration; // Duration of the voting period in seconds

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description, uint256 startTime, uint256 endTime);
    event Voted(uint256 indexed proposalId, address indexed voter, bool vote);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event MinVotingPowerUpdated(uint256 oldPower, uint256 newPower);
    event VotingPeriodDurationUpdated(uint256 oldDuration, uint256 newDuration);

    /**
     * @dev Constructor that sets the SKYCOIN token address and initial DAO parameters.
     * @param _skycoinTokenAddress Address of the SKYCOIN ERC20 token.
     * @param _minVotingPower Minimum SKYCOIN tokens required to create a proposal.
     * @param _votingPeriodDuration Duration of the voting period in seconds.
     */
    constructor(address _skycoinTokenAddress, uint256 _minVotingPower, uint256 _votingPeriodDuration) {
        require(_skycoinTokenAddress != address(0), "Invalid SKYCOIN token address");
        skycoinToken = IERC20(_skycoinTokenAddress);
        minVotingPower = _minVotingPower;
        votingPeriodDuration = _votingPeriodDuration;
        nextProposalId = 1;
    }

    /**
     * @dev Allows the owner to update the minimum voting power required to create a proposal.
     * @param _newMinVotingPower The new minimum voting power.
     */
    function updateMinVotingPower(uint256 _newMinVotingPower) external onlyOwner {
        emit MinVotingPowerUpdated(minVotingPower, _newMinVotingPower);
        minVotingPower = _newMinVotingPower;
    }

    /**
     * @dev Allows the owner to update the duration of the voting period.
     * @param _newVotingPeriodDuration The new voting period duration in seconds.
     */
    function updateVotingPeriodDuration(uint256 _newVotingPeriodDuration) external onlyOwner {
        emit VotingPeriodDurationUpdated(votingPeriodDuration, _newVotingPeriodDuration);
        votingPeriodDuration = _newVotingPeriodDuration;
    }

    /**
     * @dev Creates a new proposal.
     * Requires the proposer to hold at least `minVotingPower` SKYCOIN tokens.
     * @param _description Description of the proposal.
     */
    function createProposal(string memory _description) external {
        require(skycoinToken.balanceOf(msg.sender) >= minVotingPower, "Insufficient voting power to create proposal");

        uint256 proposalId = nextProposalId;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + votingPeriodDuration;

        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: _description,
            voteCountYes: 0,
            voteCountNo: 0,
            startTime: startTime,
            endTime: endTime,
            executed: false,
            passed: false
        });

        emit ProposalCreated(proposalId, msg.sender, _description, startTime, endTime);
        nextProposalId++;
    }

    /**
     * @dev Allows a user to vote on a proposal.
     * Requires the user to hold SKYCOIN tokens.
     * @param _proposalId The ID of the proposal to vote on.
     * @param _vote True for 'Yes', False for 'No'.
     */
    function vote(uint256 _proposalId, bool _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.proposer != address(0), "Proposal does not exist");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");

        uint256 voterVotingPower = skycoinToken.balanceOf(msg.sender);
        require(voterVotingPower > 0, "No voting power (hold SKYCOIN tokens to vote)");

        if (_vote) {
            proposal.voteCountYes += voterVotingPower;
        } else {
            proposal.voteCountNo += voterVotingPower;
        }

        hasVoted[_proposalId][msg.sender] = true;
        emit Voted(_proposalId, msg.sender, _vote);
    }

    /**
     * @dev Executes a proposal if the voting period has ended and it has passed.
     * A proposal passes if 'Yes' votes are strictly greater than 'No' votes.
     * @param _proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.proposer != address(0), "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting period has not ended");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;
        proposal.passed = proposal.voteCountYes > proposal.voteCountNo;

        emit ProposalExecuted(_proposalId, proposal.passed);

        // Further actions based on proposal.passed would typically be handled by a separate executor contract
        // or by the DAO owner manually if the proposal is simple (e.g., update a parameter in another contract)
    }

    // Fallback function to prevent accidental ETH transfers
    receive() external payable {
        revert("ETH not accepted");
    }

    fallback() external payable {
        revert("ETH not accepted");
    }
}
