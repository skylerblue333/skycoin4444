// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title SKYCOIN4444 Staking Contract
 * @dev Allows users to stake SKYCOIN tokens and earn rewards.
 * Rewards are distributed based on the amount staked and the duration.
 */
contract SKYCOIN4444Staking is Ownable {
    using SafeMath for uint256;

    IERC20 public skycoinToken; // The SKYCOIN ERC20 token
    uint256 public rewardRate; // Rewards per second per staked token (e.g., 1e18 for 1 token per second)
    uint256 public totalStaked; // Total amount of SKYCOIN staked in the contract

    struct Staker {
        uint256 amount; // Amount of tokens staked by the user
        uint256 rewardDebt; // Tracks rewards already claimed
        uint256 lastUpdateTime; // Last time user interacted with staking
    }

    // Mapping from staker address to their staking information
    mapping(address => Staker) public stakers;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    /**
     * @dev Constructor that sets the SKYCOIN token address and initial reward rate.
     * @param _skycoinTokenAddress Address of the SKYCOIN ERC20 token.
     * @param _initialRewardRate Initial reward rate (e.g., 1e18 for 1 token per second per staked token).
     */
    constructor(address _skycoinTokenAddress, uint256 _initialRewardRate) {
        require(_skycoinTokenAddress != address(0), "Invalid SKYCOIN token address");
        skycoinToken = IERC20(_skycoinTokenAddress);
        rewardRate = _initialRewardRate;
    }

    /**
     * @dev Updates the reward rate. Only owner can call.
     * @param _newRewardRate The new reward rate.
     */
    function updateRewardRate(uint256 _newRewardRate) external onlyOwner {
        emit RewardRateUpdated(rewardRate, _newRewardRate);
        rewardRate = _newRewardRate;
    }

    /**
     * @dev Allows users to stake SKYCOIN tokens.
     * Users must approve this contract to spend their SKYCOIN tokens first.
     * @param _amount The amount of SKYCOIN tokens to stake.
     */
    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0 tokens");

        // Distribute pending rewards before updating stake
        _distributeRewards(msg.sender);

        // Transfer tokens from user to this contract
        require(skycoinToken.transferFrom(msg.sender, address(this), _amount), "SKYCOIN transfer failed");

        stakers[msg.sender].amount = stakers[msg.sender].amount.add(_amount);
        totalStaked = totalStaked.add(_amount);
        stakers[msg.sender].lastUpdateTime = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    /**
     * @dev Allows users to unstake SKYCOIN tokens.
     * @param _amount The amount of SKYCOIN tokens to unstake.
     */
    function unstake(uint256 _amount) external {
        require(_amount > 0, "Cannot unstake 0 tokens");
        require(stakers[msg.sender].amount >= _amount, "Insufficient staked amount");

        // Distribute pending rewards before updating stake
        _distributeRewards(msg.sender);

        stakers[msg.sender].amount = stakers[msg.sender].amount.sub(_amount);
        totalStaked = totalStaked.sub(_amount);
        stakers[msg.sender].lastUpdateTime = block.timestamp;

        // Transfer tokens from this contract back to user
        require(skycoinToken.transfer(msg.sender, _amount), "SKYCOIN transfer failed");

        emit Unstaked(msg.sender, _amount);
    }

    /**
     * @dev Claims pending rewards for the caller.
     */
    function claimRewards() external {
        _distributeRewards(msg.sender);
        uint256 rewards = stakers[msg.sender].rewardDebt;
        require(rewards > 0, "No rewards to claim");

        stakers[msg.sender].rewardDebt = 0; // Reset reward debt after claiming

        require(skycoinToken.transfer(msg.sender, rewards), "Reward transfer failed");

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Calculates the pending rewards for a specific user.
     * @param _user The address of the user.
     * @return The amount of pending rewards.
     */
    function pendingRewards(address _user) public view returns (uint256) {
        if (stakers[_user].amount == 0) {
            return 0;
        }
        uint256 timeElapsed = block.timestamp.sub(stakers[_user].lastUpdateTime);
        uint256 rewards = stakers[_user].amount.mul(rewardRate).mul(timeElapsed);
        return rewards.add(stakers[_user].rewardDebt);
    }

    /**
     * @dev Internal function to distribute rewards to a user.
     * @param _user The address of the user to distribute rewards to.
     */
    function _distributeRewards(address _user) internal {
        if (stakers[_user].amount > 0) {
            uint256 rewards = pendingRewards(_user);
            if (rewards > 0) {
                stakers[_user].rewardDebt = rewards;
            }
        }
        stakers[_user].lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Allows the owner to fund the staking contract with rewards.
     * @param _amount The amount of SKYCOIN tokens to add as rewards.
     */
    function fundRewards(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot fund with 0 tokens");
        require(skycoinToken.transferFrom(msg.sender, address(this), _amount), "SKYCOIN transfer failed");
    }

    /**
     * @dev Allows the owner to withdraw excess tokens from the contract.
     * This is for recovering tokens sent by mistake, not for withdrawing staked funds.
     * @param _tokenAddress The address of the token to recover.
     * @param _amount The amount of tokens to recover.
     */
    function recoverERC20(address _tokenAddress, uint256 _amount) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_tokenAddress != address(skycoinToken), "Cannot recover staked token");
        IERC20(_tokenAddress).transfer(owner(), _amount);
    }

    // Fallback function to prevent accidental ETH transfers
    receive() external payable {
        revert("ETH not accepted");
    }

    fallback() external payable {
        revert("ETH not accepted");
    }
}
