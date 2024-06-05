// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC6150} from "./ERC6150.sol";

contract ERC6150Token is ERC6150 {

    // Variable to keep track of the next token ID
    uint256 private idCounter;

    // Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) private _ownedTokens;

    constructor(string memory name, string memory symbol) ERC6150(name, symbol) {
        idCounter = 1;
    }

    /*
    Public function to safely mint a hierarchical token.
    Calls _safeMintHierarchical defined in the abstract contract.
    */
    function safeMintHierarchical(address to, uint256 parentId) public {
        uint256 tokenId = idCounter;
        _safeMintHierarchical(to, parentId, tokenId);
        _ownedTokens[to].push(tokenId);
        idCounter++;
    }

    /*
    Public function to safely mint a batch of hierarchical tokens.
    Calls _safeBatchMintHierarchical defined in the abstract contract.
    */
    function safeBatchMintHierarchical(address to, uint256 parentId, uint256 numberOfTokens) public {
        uint256[] memory tokenIds = new uint256[](numberOfTokens);
        for (uint256 i = 0; i < numberOfTokens; i++) {
            tokenIds[i] = idCounter;
            _ownedTokens[to].push(idCounter);
            idCounter++;
        }
        _safeBatchMintHierarchical(to, parentId, tokenIds);
    }

    /*
    Public function to safely burn a token.
    Calls _safeBurn defined in the abstract contract.
    */
    function safeBurn(uint256 tokenId) public {
        _safeBurn(tokenId);
        _removeTokenFromOwnerEnumeration(msg.sender, tokenId);
    }

    /*
    Public function to safely burn a batch of tokens.
    Calls _safeBatchBurn defined in the abstract contract.
    */
    function safeBatchBurn(uint256[] memory tokenIds) public {
        _safeBatchBurn(tokenIds);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _removeTokenFromOwnerEnumeration(msg.sender, tokenIds[i]);
        }
    }

    /*
    Public function to get the list of token IDs owned by a specific address.
    */
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    /*
    Override the _beforeSafeMintHierarchical to add additional operations.
    */
    function _beforeSafeMintHierarchical(address to, uint256 parentId, uint256 tokenId, bytes memory data) internal virtual override {
        
    }

    /*
    Override the _afterSafeMintHierarchical to add additional operations.
    */
    function _afterSafeMintHierarchical(address to, uint256 parentId, uint256 tokenId, bytes memory data) internal virtual override {
        
    }

    /*
    Override the _beforeSafeBurn to add additional operations.
    */
    function _beforeSafeBurn(uint256 tokenId) internal virtual override {
        
    }

    /*
    Override the _afterSafeBurn to add additional operations.
    */
    function _afterSafeBurn(uint256 tokenId) internal virtual override {
        
    }

    /*
    Internal function to remove a token from the list of owned tokens of an address.
    */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        uint256 tokenIndex;

        // Find the index of the token to remove
        for (uint256 i = 0; i < _ownedTokens[from].length; i++) {
            if (_ownedTokens[from][i] == tokenId) {
                tokenIndex = i;
                break;
            }
        }

        uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

        _ownedTokens[from][tokenIndex] = lastTokenId;
        _ownedTokens[from].pop();
    }
}
