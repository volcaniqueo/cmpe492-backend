// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "../openzeppelin-contracts-master/contracts/token/ERC721/ERC721.sol";
import {IERC6150} from "../interfaces/IERC6150.sol";

abstract contract ERC6150 is ERC721, IERC6150{

    mapping(uint256 => uint256) private parentArray;  // Key is the tokenId, value is the parentId.
    mapping(uint256 => uint256[]) private childrenArray;  // Key is the tokenId, value is an array of children Ids.
    mapping(uint256 => uint256) private indexOfChildrenArray;  // Key is the tokenId, value is the index of the specified token in its parent's children array.

    /*
    ERC6150 uses default constructor of the ERC721.
    */
    constructor (string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /*
    Returns the parentId of the tokenId.
    Reverts if tokenId does not exist.
    */
    function parentOf(uint256 tokenId) public view override returns (uint256 parentId) {
        _requireOwned(tokenId);
        parentId = parentArray[tokenId];
    }

    /*
    Returns the childrenIds of the tokenId.
    Reverts if tokenId does not exist.
    */
    function childrenOf(uint256 tokenId) public view override returns (uint256[] memory childrenIds) {
        _requireOwned(tokenId);
        childrenIds = childrenArray[tokenId];
    }

    /*
    Returns true if the tokenId specifies a root token.
    Reverts if tokenId does not exist.
    */
    function isRoot(uint256 tokenId) public view override returns (bool root) {
        _requireOwned(tokenId);
        if (parentArray[tokenId] == 0){
            root = true;
        }else {
            root = false;
        }
    }

    /*
    Returns true if the tokenId specifies a leaf token.
    Reverts if tokenId does not exist.
    */
    function isLeaf(uint256 tokenId) public view override returns (bool leaf) {
        _requireOwned(tokenId);
        if (childrenArray[tokenId].length == 0) {
            leaf = true;
        }else {
            leaf = false;
        }
    }

    /*
    Calls _safeMintHierarchical with empty data when data is not given.
    */
    function _safeMintHierarchical(address to, uint256 parentId, uint256 tokenId) internal virtual {
        _safeMintHierarchical(to, parentId, tokenId, "");
    }

    /*
    Uses _safeMint from ERC721 and makes necessary modifications to preserve the hierarchy.
    Necessary modifications are: Parent-child, child-parent relationships are formed and child's index is stored.
    Also Minted event is emitted as required from the IERC6150.
    */
    function _safeMintHierarchical(address to, uint256 parentId, uint256 tokenId, bytes memory data) internal virtual {
        require(tokenId != 0, "ERC6150 TokenId cannot be zero!");
        if (parentId != 0) {
            _requireOwned(parentId);
        }
        _beforeSafeMintHierarchical(to, parentId, tokenId, data);

        _safeMint(to, tokenId, data);

        parentArray[tokenId] = parentId;
        childrenArray[parentId].push(tokenId);
        indexOfChildrenArray[tokenId] = childrenArray[parentId].length - 1;
        emit Minted(msg.sender, to, parentId, tokenId);

        _afterSafeMintHierarchical(to, parentId, tokenId, data);

    }

    /*
    Derived contracts can add additional operations without modifying the _safeMintHierarchical function.
    */
    function _beforeSafeMintHierarchical(address to, uint256 parentId, uint256 tokenId, bytes memory data) internal virtual {}

    /*
    Derived contracts can add additional operations without modifying the _safeMintHierarchical function.
    */
    function _afterSafeMintHierarchical(address to, uint256 parentId, uint256 tokenId, bytes memory data) internal virtual {}

    /*
    Adds support to batch minting.
    */
    function _safeBatchMintHierarchical(address to, uint256 parentId, uint256[] memory tokenIds) internal virtual {
        _safeBatchMintHierarchical(to, parentId, tokenIds, new bytes[](tokenIds.length));
    }

    /*
    Adds support to batch minting.
    */
    function _safeBatchMintHierarchical(address to, uint256 parentId, uint256[] memory tokenIds, bytes[] memory datas) internal virtual {
        require(tokenIds.length == datas.length, "Number of tokens must be equal to the length of the data!");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _safeMintHierarchical(to, parentId, tokenIds[i], datas[i]);
        }
    }

    /*
    Uses _burn from ERC721 and makes necessary modifications to preserve the hierarchy.
    Necessary modifications are: Parent-child, child-parent relationships are deleted and child's index is deleted.
    */
    function _safeBurn(uint256 tokenId) internal virtual {
        _requireOwned(tokenId);
        require(isLeaf(tokenId), "Only leaf tokens can be burned!");
        _beforeSafeBurn(tokenId);

        _burn(tokenId);

        uint256 parent = parentArray[tokenId];
        uint256 lastIndex = childrenArray[parent].length - 1;
        uint256 burnIndex = indexOfChildrenArray[tokenId];
        uint256 lastIndexToken = childrenArray[parent][lastIndex];

        if (burnIndex != lastIndex) {
            childrenArray[parent][burnIndex] = lastIndexToken;
            indexOfChildrenArray[lastIndexToken] = burnIndex;
        }

        childrenArray[parent].pop();
        delete indexOfChildrenArray[tokenId];
        delete parentArray[tokenId];

        _afterSafeBurn(tokenId);
    }

    /*
    Derived contracts can add additional operations without modifying the _safeBurn function.
    */
    function _beforeSafeBurn(uint256 tokenId) internal virtual {}

    /*
    Derived contracts can add additional operations without modifying the _safeBurn function.
    */
    function _afterSafeBurn(uint256 tokenId) internal virtual {}

    /*
    Adds support to batch burning.
    */
    function _safeBatchBurn(uint256[] memory tokenIds) internal virtual {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _safeBurn(tokenIds[i]);
        }
    }
}

