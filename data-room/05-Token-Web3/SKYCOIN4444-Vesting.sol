// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Vesting Contract for SKYCOIN Token
 * @dev Manages the vesting schedules for investors and team members.
 * Tokens are released linearly after a cliff period.
 */
contract SKYCOIN4444Vesting is Ownable {
    IERC20 public token;

    struct VestingSchedule {
        address beneficiary;
        uint256 totalAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 duration;
        uint256 released;
        bool revoked;
    }

    // Mapping from beneficiary to their vesting schedule
    mapping(address => VestingSchedule) public vestingSchedules;

    event VestingScheduleSet(address indexed beneficiary, uint256 totalAmount, uint256 startTime, uint256 cliffDuration, uint256 duration);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary);

    /**
     * @dev Constructor that sets the ERC20 token address.
     * @param _token Address of the ERC20 token being vested.
     */
    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    /**
     * @dev Sets up a vesting schedule for a beneficiary.
     * Only the owner can call this function.
     * @param _beneficiary The address of the beneficiary.
     * @param _totalAmount The total amount of tokens to be vested.
     * @param _startTime The timestamp when the vesting period starts.
     * @param _cliffDuration The duration of the cliff in seconds.
     * @param _duration The total duration of the vesting period in seconds.
     */
    function createVestingSchedule(
        address _beneficiary,
        uint256 _totalAmount,
        uint256 _startTime,
        uint256 _cliffDuration,
        uint256 _duration
    ) external onlyOwner {
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(_totalAmount > 0, "Total amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_duration >= _cliffDuration, "Duration must be greater than or equal to cliff duration");
        require(vestingSchedules[_beneficiary].totalAmount == 0, "Vesting schedule already exists");

        // Transfer tokens from owner to this contract for vesting
        require(token.transferFrom(msg.sender, address(this), _totalAmount), "Token transfer failed");

        vestingSchedules[_beneficiary] = VestingSchedule({
            beneficiary: _beneficiary,
            totalAmount: _totalAmount,
            startTime: _startTime,
            cliffDuration: _cliffDuration,
            duration: _duration,
            released: 0,
            revoked: false
        });

        emit VestingScheduleSet(_beneficiary, _totalAmount, _startTime, _cliffDuration, _duration);
    }

    /**
     * @dev Calculates the amount of tokens that have vested for a beneficiary.
     * @param _beneficiary The address of the beneficiary.
     * @return The amount of vested tokens.
     */
    function vestedAmount(address _beneficiary) public view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[_beneficiary];
        if (schedule.totalAmount == 0 || schedule.revoked) {
            return 0;
        }

        uint256 currentTime = block.timestamp;
        if (currentTime < schedule.startTime + schedule.cliffDuration) {
            return 0; // Before cliff
        }

        if (currentTime >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount; // After full vesting duration
        }

        // Linear vesting after cliff
        uint256 timeElapsedSinceStart = currentTime - schedule.startTime;
        uint256 vested = (schedule.totalAmount * timeElapsedSinceStart) / schedule.duration;
        return vested;
    }

    /**
     * @dev Releases vested tokens to the beneficiary.
     * @param _beneficiary The address of the beneficiary.
     */
    function release(address _beneficiary) external {
        VestingSchedule storage schedule = vestingSchedules[_beneficiary];
        require(msg.sender == schedule.beneficiary || msg.sender == owner(), "Only beneficiary or owner can release");
        require(!schedule.revoked, "Vesting schedule revoked");

        uint256 currentlyVested = vestedAmount(_beneficiary);
        uint256 unreleased = currentlyVested - schedule.released;

        require(unreleased > 0, "No tokens to release");

        schedule.released += unreleased;
        require(token.transfer(schedule.beneficiary, unreleased), "Token transfer failed");

        emit TokensReleased(_beneficiary, unreleased);
    }

    /**
     * @dev Revokes a vesting schedule.
     * Any unvested tokens are returned to the owner.
     * Only the owner can call this function.
     * @param _beneficiary The address of the beneficiary.
     */
    function revoke(address _beneficiary) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[_beneficiary];
        require(schedule.totalAmount > 0, "No vesting schedule found");
        require(!schedule.revoked, "Vesting schedule already revoked");

        uint256 currentlyVested = vestedAmount(_beneficiary);
        uint256 unreleased = currentlyVested - schedule.released;

        // Release any vested but unreleased tokens
        if (unreleased > 0) {
            schedule.released += unreleased;
            require(token.transfer(schedule.beneficiary, unreleased), "Token transfer failed");
            emit TokensReleased(_beneficiary, unreleased);
        }

        // Return unvested tokens to owner
        uint256 unvested = schedule.totalAmount - schedule.released;
        if (unvested > 0) {
            require(token.transfer(owner(), unvested), "Token transfer failed");
        }

        schedule.revoked = true;
        emit VestingRevoked(_beneficiary);
    }

    /**
     * @dev Allows the owner to recover any ERC20 tokens sent to this contract by mistake.
     * @param _tokenAddress The address of the token to recover.
     * @param _amount The amount of tokens to recover.
     */
    function recoverERC20(address _tokenAddress, uint256 _amount) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_tokenAddress != address(token), "Cannot recover vested token");
        IERC20(_tokenAddress).transfer(owner(), _amount);
    }
}
