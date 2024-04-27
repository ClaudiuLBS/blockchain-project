// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./CasinoGame.sol";

struct Card {
  uint value;
  uint symbol;
}

contract Blackjack is CasinoGame {
  Card[] private dealerCards;
  Card[] public playerCards;

  mapping(address => uint) playersStandValues;
  mapping(address => bool) playersVotedHit;
  bool anyPlayerHit = false;
  uint256 lastActionTimestamp;
  uint public roundTime = 30;

  modifier cardsHaveNotBeenDrawned() {
    require(dealerCards.length == 0 && playerCards.length == 0,  "The cards have been already drawned");
    _;
  }

  modifier playerSumUnder21() {
    require(playerCardsSum() < 21, "The player's cards sum is equal or greater than 21");
    _;
  }

  modifier playerDidNotStand() {
    require(playersStandValues[msg.sender] == 0, "Player already stood");
    _;
  }

  modifier playerDidNotHit() {
    require(playersVotedHit[msg.sender] == false, "Player already hitted");
    _;
  }

  modifier anyPlayerVotedHit() {
    require(anyPlayerHit, "No player voted hit");
    _;
  }

  modifier playersVoteTimeEnded() {
    require(block.timestamp - lastActionTimestamp >= roundTime, "Time did not end");
    _;
  }

  modifier dealerHasFinished() {
    require(dealerCardsSum() >= 17, "Dealer is not finished yet");
    _;
  }

  function getDealerCards() view external onlyOwner() returns(Card[] memory){
    return dealerCards;
  }

  function cardsSum(Card[] memory _cards) internal pure returns(uint) {
    uint sum = 0;
    // calculate initial sum where Ace = 1
    for (uint i = 0; i < _cards.length; i++)
      sum += cardValue(_cards[i]);

    // check if Aces can take the value 11
    for(uint i = 0; i < _cards.length; i++) 
      if (_cards[i].value == 1 && sum + 10 <= 21) 
        sum += 10;

    return sum;
  }

  function playerCardsSum() view public returns(uint) {
    return cardsSum(playerCards);
  }

  function dealerCardsSum() view public returns(uint) {
    return cardsSum(dealerCards);
  }

  function drawCards() public onlyOwner() cardsHaveNotBeenDrawned() gameIsStarted(){
    dealerCards.push(randomCard());
    playerCards.push(randomCard());

    dealerCards.push(randomCard());
    playerCards.push(randomCard());
    lastActionTimestamp = block.timestamp;
  }

  function randomCard() internal returns(Card memory) {
    return Card(random(1, 14), random(0, 4));
  }

  function playerHit() playerDidNotStand() playerDidNotHit() playerSumUnder21() external {
    playersVotedHit[msg.sender] = true;
    anyPlayerHit = true;
  }

  function playerStand() public playerDidNotStand() {
    playerStand(msg.sender);
  }

  function playerStand(address _player) internal {
    playersStandValues[_player] = playerCardsSum();
  }

  function drawPlayerCard() public onlyOwner() anyPlayerVotedHit() playersVoteTimeEnded() playerSumUnder21() {
    playerCards.push(randomCard());
    anyPlayerHit = false;
    for (uint i = 0; i < players.length; i++) {
      address playerAddress = players[i];

      // if the player didn't hit, it automaticaly stands
      if (!playersVotedHit[playerAddress] && playersStandValues[playerAddress] == 0)
        playerStand(playerAddress);

      // reset the votes mapping
      playersVotedHit[playerAddress] = false;
    }
  }
  
  function drawDealerCards() public onlyOwner() {
   while (dealerCardsSum() < 17)
      dealerCards.push(randomCard()); 
  }

  function stopBlackjackGame() dealerHasFinished() public {
    pickWinners();
    dealerCards = new Card[](0);
    playerCards = new Card[](0);
    stopGame();
  }
  
  function cardValue(Card memory _card) internal pure returns(uint) {
    if (_card.value > 10) return 10;
    return _card.value;
  }

  function pickWinners() private {
    for (uint i = 0; i < players.length; i++) {
      address payable playerAddress = players[i];

      
      // player busted
      if (playersStandValues[playerAddress] > 21) continue;
      // player didn't bust but it has less than the dealer
      if (playersStandValues[playerAddress] < dealerCardsSum() && dealerCardsSum() <= 21) continue;
      
      payPlayer(playerAddress);
    }
  }

  function payPlayer(address payable _player) public payable onlyOwner() {
    uint256 bettingValue = gamesBets[currentGame][_player];
    uint256 winningValue = bettingValue * 2;

    if (playersStandValues[_player] == 21)
      winningValue = bettingValue * 3;

    (bool success, ) = _player.call{value: winningValue}("");
    require(success, "Failed to send Ether");
  }
}