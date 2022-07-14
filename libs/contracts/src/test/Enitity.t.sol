// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Entity.sol";

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";


contract EntityTest is Test, ERC1155Holder {
    Entity entity;
    address bob = address(0x1);
    address alice = address(0x2);
    address mary = address(0x3);
    address john = address(0x4);
    address deployer = address(0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84);

    function setUp() public {
        entity = new Entity("http://example.com", bob);
    }

    function testMintToken() public {
        assert(entity.balanceOf(bob, 0) == 1);
        vm.prank(bob);
        entity.mintAccessToken(alice, 0, 1);
        assert(entity.balanceOf(alice, 0) == 1);
        vm.prank(alice);
        entity.mintAccessToken(mary, 0, 1);
        assert(entity.balanceOf(mary, 0) == 1);
        vm.expectRevert();
        entity.mintAccessToken(john, 0, 1);
        vm.prank(mary);
        vm.expectRevert();
        entity.mintAccessToken(mary, 0, 1);
    }

    function testFailMintTokenMoreThanOne() public {
        vm.prank(bob);
        entity.mintAccessToken(bob, 0, 1);
    }

    function testFailMintTwo() public {
        vm.prank(bob);
        entity.mintAccessToken(bob, 0, 2);
    }

    function testFailMintTokenDifferentTokenId() public {
        vm.prank(bob);
        entity.mintAccessToken(bob, 1, 1);
    }

    function testRevokeAccessToken() public {
        vm.prank(bob);
        entity.mintAccessToken(alice, 0, 1);
        assert(entity.balanceOf(alice, 0) == 1);
        vm.prank(bob);
        entity.revokeAccessToken(alice, 0);
        assert(entity.balanceOf(alice, 0) == 0);
    }

    function testFailRevokeAccessToken() public {
        vm.prank(bob);
        entity.revokeAccessToken(alice, 0);
    }

    function testFailOnlyOwnerCanRevoke() public {
        vm.prank(bob);
        entity.mintAccessToken(alice, 0, 1);
        assert(entity.balanceOf(alice, 0) == 1);
        vm.prank(alice);
        entity.revokeAccessToken(bob, 0);
    }

    function testSetUri() public {
        vm.prank(bob);
        entity.updateuri("http://update.com");
        assertEq(entity.uri(0), "http://update.com");
    }

    function testGetURI() public {
        assertEq(entity.uri(0), "http://example.com");
    }

}
