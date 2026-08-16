// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title SKYCOIN4444 Marketplace Contract
 * @dev A decentralized marketplace for buying and selling NFTs using SKYCOIN.
 * Features include listing NFTs, buying NFTs, and setting a platform fee.
 */
contract SKYCOIN4444Marketplace is Ownable {
    using SafeMath for uint256;

    IERC20 public skycoinToken; // The SKYCOIN ERC20 token
    uint256 public platformFeeBasisPoints; // Fee for the platform (e.g., 200 for 2%)

    struct Listing {
        address seller;
        IERC721 nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    // Mapping from listing ID to Listing struct
    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId; // Counter for unique listing IDs

    event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price);
    event NFTBought(uint256 indexed listingId, address indexed buyer, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price, uint256 feeAmount);
    event ListingCancelled(uint256 indexed listingId, address indexed seller);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    /**
     * @dev Constructor that sets the SKYCOIN token address and initial platform fee.
     * @param _skycoinTokenAddress Address of the SKYCOIN ERC20 token.
     * @param _initialPlatformFeeBasisPoints Initial platform fee in basis points (e.g., 200 for 2%).
     */
    constructor(address _skycoinTokenAddress, uint256 _initialPlatformFeeBasisPoints) {
        require(_skycoinTokenAddress != address(0), "Invalid SKYCOIN token address");
        require(_initialPlatformFeeBasisPoints <= 10000, "Fee cannot exceed 100%");
        skycoinToken = IERC20(_skycoinTokenAddress);
        platformFeeBasisPoints = _initialPlatformFeeBasisPoints;
        nextListingId = 1;
    }

    /**
     * @dev Allows a user to list an NFT for sale.
     * The NFT must be approved for transfer to this marketplace contract first.
     * @param _nftContractAddress Address of the ERC721 NFT contract.
     * @param _tokenId ID of the NFT to list.
     * @param _price Price in SKYCOIN tokens.
     */
    function listNFT(address _nftContractAddress, uint256 _tokenId, uint256 _price) external {
        require(_nftContractAddress != address(0), "Invalid NFT contract address");
        require(_price > 0, "Price must be greater than 0");

        IERC721 nftContract = IERC721(_nftContractAddress);
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not NFT owner");
        require(nftContract.getApproved(_tokenId) == address(this), "NFT not approved for marketplace");

        listings[nextListingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        emit NFTListed(nextListingId, msg.sender, _nftContractAddress, _tokenId, _price);
        nextListingId = nextListingId.add(1);
    }

    /**
     * @dev Allows a user to buy a listed NFT.
     * The buyer must have approved the marketplace to spend SKYCOIN tokens.
     * @param _listingId ID of the listing to buy.
     */
    function buyNFT(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing is not active");
        require(listing.seller != address(0), "Listing does not exist");
        require(listing.seller != msg.sender, "Cannot buy your own NFT");

        uint256 totalPrice = listing.price;
        uint256 feeAmount = totalPrice.mul(platformFeeBasisPoints).div(10000);
        uint256 sellerReceiveAmount = totalPrice.sub(feeAmount);

        // Transfer SKYCOIN from buyer to marketplace (platform fee)
        require(skycoinToken.transferFrom(msg.sender, owner(), feeAmount), "SKYCOIN transfer for fee failed");
        // Transfer SKYCOIN from buyer to seller
        require(skycoinToken.transferFrom(msg.sender, listing.seller, sellerReceiveAmount), "SKYCOIN transfer to seller failed");

        // Transfer NFT from seller to buyer
        listing.nftContract.transferFrom(listing.seller, msg.sender, listing.tokenId);

        listing.active = false; // Deactivate listing after purchase

        emit NFTBought(_listingId, msg.sender, listing.seller, address(listing.nftContract), listing.tokenId, totalPrice, feeAmount);
    }

    /**
     * @dev Allows a seller to cancel their NFT listing.
     * @param _listingId ID of the listing to cancel.
     */
    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "Only seller can cancel listing");

        listing.active = false; // Deactivate listing

        // No token transfers needed, NFT remains with seller

        emit ListingCancelled(_listingId, msg.sender);
    }

    /**
     * @dev Allows the owner to update the platform fee.
     * @param _newFeeBasisPoints New platform fee in basis points.
     */
    function updatePlatformFee(uint256 _newFeeBasisPoints) external onlyOwner {
        require(_newFeeBasisPoints <= 10000, "Fee cannot exceed 100%");
        emit PlatformFeeUpdated(platformFeeBasisPoints, _newFeeBasisPoints);
        platformFeeBasisPoints = _newFeeBasisPoints;
    }

    /**
     * @dev Allows the owner to withdraw collected platform fees.
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = skycoinToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        require(skycoinToken.transfer(owner(), balance), "Fee withdrawal failed");
    }

    // Fallback function to prevent accidental ETH transfers
    receive() external payable {
        revert("ETH not accepted");
    }

    fallback() external payable {
        revert("ETH not accepted");
    }
}
