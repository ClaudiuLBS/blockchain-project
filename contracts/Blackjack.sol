// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./CasinoGame.sol";

contract Blackjack is CasinoGame {
  constructor(address owner) CasinoGame(owner) {} 
}