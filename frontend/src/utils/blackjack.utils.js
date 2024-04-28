import { ethers } from "ethers"
import Blackjack from '../artifacts/BlackjackModule#Blackjack.json'

class BlackjackContract {
  constructor() {
    this.getContract()
  };
  
  async getContract() {
    const address = "0x0a8D3Be050520965629500CfE8d0FE7fbb1cEDA2" 
    const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
    this.contract = new ethers.Contract(address, Blackjack.abi, signer);
  }

  async execute(command, value = null) {
    if (!this.contract) 
      await this.getContract();

    const contractCommand = this.contract[command];
    try {
      const result = value ? await contractCommand({value: ethers.parseEther(value)}) : await contractCommand();
      return result;
    } catch(e) {
      console.log(e);
    }
  }

  gameStarted = async () => await this.execute('gameStarted');
  startGame = async () => await this.execute('drawCards');
  stopGame = async () => await this.execute('stopBlackjackGame');

  drawCards = async () => await this.execute('drawCards');
  drawPlayerCard = async () => await this.execute('drawPlayerCard');
  drawDealerCards = async () => await this.execute('drawDealerCards');
  getPlayerCards = async () => await this.execute('getPlayerCards');
  getDealerCards = async () => await this.execute('getDealerCards');

  bet = async (value) => await this.execute('bet', value);
  playerHit = async () => await this.execute('playerHit');
  playerStand = async () => await this.execute('playerStand');
  myBet = async () => await this.execute('myBet');
}

export {
  BlackjackContract
}