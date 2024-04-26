// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CasinoGame is Ownable {
  constructor() Ownable(msg.sender) {}

  bool gameStarted = false;
  uint64 currentGame = 0;
  mapping(uint64 => mapping (address => uint)) public gamesBets; //players bets for every game
  address payable[] public players; //curent game players
  
  modifier limitEntry() {
    require(gamesBets[currentGame][msg.sender] + msg.value <= 1 ether, "The maximum entry is 1 ether" );
    _;
  }

  modifier minimumBet() {
    require(msg.value > .0001 ether, "The minimum bet is  .0001 ether");
    _;
  }

  modifier gameNotStarted() {
    require(!gameStarted, "Can't bet after the game is started");
    _;
  }

  function getBalance() public view returns(uint){
      return address(this).balance;
  }

  receive() external payable minimumBet() limitEntry() gameNotStarted() {
    uint256 playerCurrentBet = gamesBets[currentGame][msg.sender];

    if (playerCurrentBet == 0)
      players.push(payable(msg.sender));

    gamesBets[currentGame][msg.sender] += msg.value;
  }

  function startGame() public onlyOwner() {
    gameStarted = true;
  }

  function stopGame() public onlyOwner() {
    gameStarted = false;
    currentGame++;
    players = new address payable[](0);
  }
}