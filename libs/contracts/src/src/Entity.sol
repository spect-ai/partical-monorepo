// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Entity is ERC1155 {
    uint256 public constant ACCESS_TOKEN= 0;
    // owner of the entity
    address public owner;
    event AccessMinted(address to);

    constructor(string memory uri, address entityOwner) ERC1155(uri) {
        _mint(entityOwner, ACCESS_TOKEN, 1, "");
        owner = entityOwner;
    }

    function mintAccessToken(address _to, uint256 _tokenId) public {
        require(_to != address(0));
        require(_tokenId == ACCESS_TOKEN);
        require(balanceOf(_to, _tokenId) == 0);
        require(balanceOf(msg.sender, _tokenId) == 1);
        _mint(_to, _tokenId, 1, "");

        emit AccessMinted(_to);
    }

    function revokeAccessToken(address _to, uint256 _tokenId) public {
        require(_to != address(0));
        require(_tokenId == ACCESS_TOKEN);
        require(msg.sender == owner);
        _burn(_to, _tokenId, 1);
    }

    function updateuri(string memory uri) public {
        require(msg.sender == owner);
        _setURI(uri);
    }

    function hasAccess(address _eoa) public view returns (bool) {
        return balanceOf(_eoa, ACCESS_TOKEN) > 0;
    }

    function hasServiceAccess(address _contract, address _eoa) public view returns (bool) {
        return balanceOf(_contract, ACCESS_TOKEN) > 0 && IERC1155(_contract).balanceOf(_eoa, ACCESS_TOKEN) > 0;
    }
}
