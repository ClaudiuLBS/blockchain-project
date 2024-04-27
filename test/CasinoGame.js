const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("CasinoGame", () => {
  async function deployCasinoGame() {
    const [owner, contractAccount] = await ethers.getSigners();
    const CasinoGame = await ethers.getContractFactory("CasinoGame");
    const casinoGame = await CasinoGame.deploy();
    return {casinoGame, owner, contractAccount};
  }

  describe("Deployment", () => {
    it("Should not be started", async () => {
      const { casinoGame } = await loadFixture(deployCasinoGame);
      expect(await casinoGame.gameStarted()).to.equal(false);
    });

    it("Should set the right owner", async () => {
      const { casinoGame, owner } = await loadFixture(deployCasinoGame);
      expect(await casinoGame.owner()).to.equal(owner.address);
    });
  });

  describe("Betting", () => {
    it("Should not be able to bet if the game has started", async () => {
      const { casinoGame } = await loadFixture(deployCasinoGame);
      await casinoGame.startGame()

      await expectRevert(
        casinoGame.bet({value: ethers.parseEther(".1")}), 
        "Can't bet after the game is started"
      );
    });

    it("Should not be able to bet under .0001 ether", async () => {
      const { casinoGame } = await loadFixture(deployCasinoGame);

      await expectRevert(
        casinoGame.bet({value: ethers.parseEther(".00001")}), 
        "The minimum bet is  .0001 ether"
      );
    });

    it("Should not be abel to have an entry above 1 ether", async () => {
      const { casinoGame } = await loadFixture(deployCasinoGame);

      await casinoGame.bet({value: ethers.parseEther("0.99")}), 

      await expectRevert(
        casinoGame.bet({value: ethers.parseEther(".1")}), 
        "The maximum entry is 1 ether"
      );
    });
  })

});
