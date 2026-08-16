// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SKYCOIN4444 NFT Contract
 * @dev ERC-721 compliant contract for unique digital assets within the SKYCOIN4444 ecosystem.
 * Supports enumerable tokens and URI storage for metadata.
 */
contract SKYCOIN4444NFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseTokenURI; // Base URI for token metadata

    event BaseTokenURIUpdated(string newURI);

    /**
     * @dev Constructor that sets the name and symbol for the NFT collection.
     * @param _name Name of the NFT collection (e.g., "SkyCoin4444 Collectibles").
     * @param _symbol Symbol for the NFT collection (e.g., "SC4444NFT").
     * @param _baseTokenURI Initial base URI for token metadata.
     */
    constructor(string memory _name, string memory _symbol, string memory _baseTokenURI)
        ERC721(_name, _symbol)
    {
        baseTokenURI = _baseTokenURI;
    }

    /**
     * @dev Mints a new NFT and assigns it to a recipient.
     * Only the owner can call this function.
     * @param _to The address of the recipient.
     * @param _tokenURI The URI pointing to the NFT metadata.
     * @return The ID of the newly minted token.
     */
    function mint(address _to, string memory _tokenURI) external onlyOwner returns (uint256) {
        require(_to != address(0), "Invalid recipient address");
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(_to, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    /**
     * @dev Updates the base URI for all tokens.
     * Only the owner can call this function.
     * @param _newBaseTokenURI The new base URI.
     */
    function setBaseTokenURI(string memory _newBaseTokenURI) external onlyOwner {
        baseTokenURI = _newBaseTokenURI;
        emit BaseTokenURIUpdated(_newBaseTokenURI);
    }

    /**
     * @dev See {ERC721URIStorage-_baseURI}.
     * This function is overridden to use the `baseTokenURI` state variable.
     */
    function _baseURI() internal view override(ERC721URIStorage, ERC721) returns (string memory) {
        return baseTokenURI;
    }

    /**
     * @dev See {ERC721-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) internal view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function _increaseBalance(address account, uint256 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (address) {
        return super._update(to, tokenId, auth);
    }
}
