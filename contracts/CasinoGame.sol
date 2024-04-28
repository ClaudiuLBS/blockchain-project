// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CasinoGame is Ownable {
  constructor() Ownable(msg.sender) {}

  uint nonce = 0;
  bool public gameStarted = false;
  uint public currentGame = 0;
  mapping(uint => mapping (address => uint256)) public gamesBets; //players bets for every game
  address payable[] public players; //curent game players
  
  event GameStateChanged(bool started);
  
  modifier limitEntry() {
    require(gamesBets[currentGame][msg.sender] + msg.value <= 1 ether, "The maximum entry is 1 ether" );
    _;
  }

  modifier minimumBet() {
    require(msg.value >= .0001 ether, "The minimum bet is  .0001 ether");
    _;
  }

  modifier gameNotStarted() {
    require(!gameStarted, "Game is started");
    _;
  }

  modifier gameIsStarted() {
    require(gameStarted, "Game is not started yet");
    _;
  }

  function getBalance() public view returns(uint){
      return address(this).balance;
  }

  receive() external payable minimumBet() limitEntry() gameNotStarted() {
    bet();
  }

  function startGame() public onlyOwner() gameNotStarted() {
    gameStarted = true;
    emit GameStateChanged(true);
  }

  function stopGame() internal onlyOwner() {
    gameStarted = false;
    currentGame++;
    players = new address payable[](0);
    emit GameStateChanged(false);
  }

  function bet() public payable minimumBet() limitEntry() gameNotStarted() {
    uint256 playerCurrentBet = gamesBets[currentGame][msg.sender];
    if (playerCurrentBet == 0)
      players.push(payable(msg.sender));

    gamesBets[currentGame][msg.sender] += msg.value;
  }

  function myBet() public view returns(uint) {
    return gamesBets[currentGame][msg.sender];
  }

  function random(uint minNumber, uint maxNumber) internal returns (uint) {
    uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % maxNumber;
    randomnumber = randomnumber + minNumber;
    nonce++;
    return randomnumber;
}
}