// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SKYCOIN Token Contract
 * @dev SKYCOIN is the native token of the SKYCOIN4444 ecosystem
 * @notice This contract implements ERC-20 standard with vesting, burning, and governance features
 * 
 * Token Distribution:
 * - Founder (30%): 300,000,000 tokens
 * - Investors (10%): 100,000,000 tokens
 * - Team & Advisors (15%): 150,000,000 tokens
 * - Community Rewards (20%): 200,000,000 tokens
 * - Charity/SkyHope (10%): 100,000,000 tokens
 * - Reserve & Operations (15%): 150,000,000 tokens
 * - TOTAL: 1,000,000,000 tokens
 */

contract SKYCOINToken is ERC20, Ownable, Pausable {
    
    // ============ Constants ============
    
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;
    
    // Allocation percentages (in basis points for precision)
    uint256 public constant FOUNDER_ALLOCATION = 300_000_000 * 10 ** 18;      // 30%
    uint256 public constant INVESTOR_ALLOCATION = 100_000_000 * 10 ** 18;     // 10%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10 ** 18;         // 15%
    uint256 public constant COMMUNITY_ALLOCATION = 200_000_000 * 10 ** 18;    // 20%
    uint256 public constant CHARITY_ALLOCATION = 100_000_000 * 10 ** 18;      // 10%
    uint256 public constant RESERVE_ALLOCATION = 150_000_000 * 10 ** 18;      // 15%
    
    // Vesting constants
    uint256 public constant VESTING_CLIFF_MONTHS = 12;
    uint256 public constant VESTING_DURATION_MONTHS = 48;
    
    // ============ State Variables ============
    
    // Vesting schedules
    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => uint256) public vestedAmounts;
    
    // Allocation tracking
    mapping(address => bool) public founderAllocated;
    mapping(address => bool) public charityAllocated;
    
    // Burn tracking
    uint256 public totalBurned;
    
    // Governance
    address public governanceAddress;
    
    // ============ Structs ============
    
    struct VestingSchedule {
        uint256 totalTokens;
        uint256 vestingStartTime;
        uint256 cliffMonths;
        uint256 vestingDurationMonths;
        bool isActive;
    }
    
    // ============ Events ============
    
    event FounderTokensAllocated(address indexed founder, uint256 amount);
    event InvestorTokensAllocated(address indexed investor, uint256 amount, uint256 vestingMonths);
    event TeamTokensAllocated(address indexed teamMember, uint256 amount, uint256 vestingMonths);
    event CharityTokensAllocated(address indexed charity, uint256 amount);
    event CommunityTokensAllocated(address indexed recipient, uint256 amount);
    event TokensVested(address indexed beneficiary, uint256 amount);
    event TokensBurned(address indexed burner, uint256 amount);
    event GovernanceAddressUpdated(address indexed newGovernance);
    
    // ============ Constructor ============
    
    constructor() ERC20("SKYCOIN", "SKY") {
        // Mint total supply to contract
        _mint(address(this), TOTAL_SUPPLY);
        
        // Emit initial supply event
        emit Transfer(address(0), address(this), TOTAL_SUPPLY);
    }
    
    // ============ Founder Allocation ============
    
    /**
     * @dev Allocate founder tokens (no vesting, immediate ownership)
     * @param founder Address of the founder
     */
    function allocateFounderTokens(address founder) external onlyOwner {
        require(founder != address(0), "Invalid founder address");
        require(!founderAllocated[founder], "Founder tokens already allocated");
        require(balanceOf(address(this)) >= FOUNDER_ALLOCATION, "Insufficient tokens in contract");
        
        founderAllocated[founder] = true;
        _transfer(address(this), founder, FOUNDER_ALLOCATION);
        
        emit FounderTokensAllocated(founder, FOUNDER_ALLOCATION);
    }
    
    // ============ Investor Allocation ============
    
    /**
     * @dev Allocate investor tokens with vesting schedule
     * @param investor Address of the investor
     * @param vestingMonths Duration of vesting in months (typically 48 for 4 years)
     */
    function allocateInvestorTokens(address investor, uint256 vestingMonths) external onlyOwner {
        require(investor != address(0), "Invalid investor address");
        require(vestingMonths > 0, "Vesting duration must be positive");
        require(balanceOf(address(this)) >= INVESTOR_ALLOCATION, "Insufficient tokens in contract");
        
        // Create vesting schedule
        vestingSchedules[investor] = VestingSchedule({
            totalTokens: INVESTOR_ALLOCATION,
            vestingStartTime: block.timestamp,
            cliffMonths: VESTING_CLIFF_MONTHS,
            vestingDurationMonths: vestingMonths,
            isActive: true
        });
        
        emit InvestorTokensAllocated(investor, INVESTOR_ALLOCATION, vestingMonths);
    }
    
    // ============ Team Allocation ============
    
    /**
     * @dev Allocate team tokens with vesting schedule
     * @param teamMember Address of the team member
     * @param vestingMonths Duration of vesting in months (typically 48 for 4 years)
     */
    function allocateTeamTokens(address teamMember, uint256 vestingMonths) external onlyOwner {
        require(teamMember != address(0), "Invalid team member address");
        require(vestingMonths > 0, "Vesting duration must be positive");
        require(balanceOf(address(this)) >= TEAM_ALLOCATION, "Insufficient tokens in contract");
        
        // Create vesting schedule
        vestingSchedules[teamMember] = VestingSchedule({
            totalTokens: TEAM_ALLOCATION,
            vestingStartTime: block.timestamp,
            cliffMonths: VESTING_CLIFF_MONTHS,
            vestingDurationMonths: vestingMonths,
            isActive: true
        });
        
        emit TeamTokensAllocated(teamMember, TEAM_ALLOCATION, vestingMonths);
    }
    
    // ============ Charity Allocation ============
    
    /**
     * @dev Allocate charity tokens (immediate, no vesting)
     * @param charity Address of the charity (SkyHope)
     */
    function allocateCharityTokens(address charity) external onlyOwner {
        require(charity != address(0), "Invalid charity address");
        require(!charityAllocated[charity], "Charity tokens already allocated");
        require(balanceOf(address(this)) >= CHARITY_ALLOCATION, "Insufficient tokens in contract");
        
        charityAllocated[charity] = true;
        _transfer(address(this), charity, CHARITY_ALLOCATION);
        
        emit CharityTokensAllocated(charity, CHARITY_ALLOCATION);
    }
    
    // ============ Community Allocation ============
    
    /**
     * @dev Allocate community tokens (usage-based rewards)
     * @param recipients Array of recipient addresses
     * @param amounts Array of token amounts for each recipient
     */
    function allocateCommunityTokens(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Array length mismatch");
        require(recipients.length > 0, "Empty recipients array");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(balanceOf(address(this)) >= totalAmount, "Insufficient tokens in contract");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            _transfer(address(this), recipients[i], amounts[i]);
            emit CommunityTokensAllocated(recipients[i], amounts[i]);
        }
    }
    
    // ============ Vesting Functions ============
    
    /**
     * @dev Get the amount of tokens that can be claimed by a beneficiary
     * @param beneficiary Address of the token holder
     * @return Amount of tokens available to claim
     */
    function getClaimableTokens(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        if (!schedule.isActive || schedule.totalTokens == 0) {
            return 0;
        }
        
        uint256 elapsedTime = block.timestamp - schedule.vestingStartTime;
        uint256 cliffTime = schedule.cliffMonths * 30 days;
        
        // Before cliff, no tokens are claimable
        if (elapsedTime < cliffTime) {
            return 0;
        }
        
        uint256 vestingTime = schedule.vestingDurationMonths * 30 days;
        
        // After vesting period, all tokens are claimable
        if (elapsedTime >= vestingTime) {
            return schedule.totalTokens - vestedAmounts[beneficiary];
        }
        
        // During vesting, linearly unlock tokens
        uint256 vestedTokens = (schedule.totalTokens * (elapsedTime - cliffTime)) / (vestingTime - cliffTime);
        return vestedTokens - vestedAmounts[beneficiary];
    }
    
    /**
     * @dev Claim vested tokens
     */
    function claimVestedTokens() external {
        uint256 claimable = getClaimableTokens(msg.sender);
        require(claimable > 0, "No tokens to claim");
        
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        vestedAmounts[msg.sender] += claimable;
        
        _transfer(address(this), msg.sender, claimable);
        
        emit TokensVested(msg.sender, claimable);
    }
    
    // ============ Burn Functions ============
    
    /**
     * @dev Burn tokens (reduce total supply)
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        totalBurned += amount;
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from another address (requires approval)
     * @param account Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) external {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "Insufficient allowance");
        
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
        totalBurned += amount;
        emit TokensBurned(account, amount);
    }
    
    // ============ Governance Functions ============
    
    /**
     * @dev Set governance address for future governance mechanisms
     * @param newGovernance Address of the governance contract
     */
    function setGovernanceAddress(address newGovernance) external onlyOwner {
        require(newGovernance != address(0), "Invalid governance address");
        governanceAddress = newGovernance;
        emit GovernanceAddressUpdated(newGovernance);
    }
    
    // ============ Pause Functions ============
    
    /**
     * @dev Pause token transfers (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ Override Functions ============
    
    /**
     * @dev Override transfer to respect pause state
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    // ============ Query Functions ============
    
    /**
     * @dev Get total tokens allocated (not including reserve in contract)
     */
    function getTotalAllocated() external pure returns (uint256) {
        return FOUNDER_ALLOCATION + INVESTOR_ALLOCATION + TEAM_ALLOCATION + 
               COMMUNITY_ALLOCATION + CHARITY_ALLOCATION;
    }
    
    /**
     * @dev Get tokens remaining in contract
     */
    function getContractBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }
    
    /**
     * @dev Get vesting schedule details
     */
    function getVestingSchedule(address beneficiary) external view returns (VestingSchedule memory) {
        return vestingSchedules[beneficiary];
    }
}
