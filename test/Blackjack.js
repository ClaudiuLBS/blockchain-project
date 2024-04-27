const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Blackjack", () => {
  async function deployBlackjack() {
    const [owner, addr_1, addr_2, addr_3] = await ethers.getSigners();
    const Blackjack = await ethers.getContractFactory("Blackjack");
    const blackjack = await Blackjack.deploy();

    return {blackjack, owner, addr_1, addr_2, addr_3};
  }

  describe("Initial cards drawing", () => {
    it("Shouldn't be able to draw cards if the game isn't started", async () => {
      const {blackjack} = await loadFixture(deployBlackjack);

      await expectRevert(
        blackjack.drawCards(), 
        "Game is not started yet"
      );
    });

    it("Should give 2 cards to the dealer and the player at the begining", async () => {
      const {blackjack} = await loadFixture(deployBlackjack);
      await blackjack.startGame();      
      await blackjack.drawCards();

      const player_cards = await blackjack.getPlayerCards();
      const dealer_cards = await blackjack.getDealerCards();
      
      expect(player_cards.length).to.equal(2);
      expect(dealer_cards.length).to.equal(2);
    });

    it("Shouldn't be able to draw cards multiple times", async () => {
      const {blackjack} = await loadFixture(deployBlackjack);
      await blackjack.startGame();      
      await blackjack.drawCards();

      await expectRevert(
        blackjack.drawCards(),
        "The cards have been already drawn"
      );
    });
  });

});
