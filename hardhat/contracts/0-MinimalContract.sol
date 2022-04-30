//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MinimalContract {

        event RewardCreated(
        address indexed admin,
        uint256 payload);

    constructor() {
   
    }

    function testEvent(uint256 _payload) external {
        emit RewardCreated(msg.sender, _payload);
        console.log('emit reward');
    }
}
