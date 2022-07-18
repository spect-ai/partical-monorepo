// contract to create entity contract
pragma solidity ^0.8.13;

import "./Entity.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Factory is ERC1155Holder {
    address[] entities;
    mapping(address=>Entity) public entityMapping;
    event EntityCreated(address entity);

    constructor() {}

    function createEntity(string memory uri) public returns (address) {
        Entity entity = new Entity(uri, msg.sender);
        entities.push(address(entity));
        entityMapping[msg.sender] = entity;
        emit EntityCreated(address(entity));
        return address(entity);
    }

}
