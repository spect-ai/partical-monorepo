// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Factory.sol";
import "../src/Entity.sol";

import "forge-std/Test.sol";


contract FactoryTest is Test {
    Factory factory;
    address bob = address(0x1);
    address alice = address(0x2);
    address mary = address(0x3);
    address deployer = address(0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84);

    function setUp() public {
        factory = new Factory();
    }

    function testCreateEntity() public {
        vm.prank(bob);
        address entityAddress = factory.createEntity("http://example.com");
        Entity entity = Entity(entityAddress);
        assert(entity.balanceOf(bob, 0) == 1);
        assertEq(entity.owner(), bob);
        vm.prank(bob);
        entity.mintAccessToken(alice, 0, 1);
        assert(entity.balanceOf(alice, 0) == 1);
        vm.expectRevert();
        entity.mintAccessToken(mary, 0, 1);
    }

}
