import './App.css';
import { useEffect, useState } from 'react';

import { getConnectedAccount, isConnected, requestAccount } from './utils/ethers.utils'
import { BlackjackContract } from './utils/blackjack.utils';
import { ethers } from 'ethers';

const App = () => {
  const [account, setAccount] = useState("");
  const [betValue, setBetValue] = useState("0");
  const [blackjack, setBlackjack] = useState(new BlackjackContract());
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [currentBet, setCurrentBet] = useState(0);

  useEffect(() => {
    getConnectedAccount().then(res => setAccount(res))
    setBlackjack(new BlackjackContract())

    refreshBet();
    blackjack.gameStarted().then(res => {
      if (res) refreshCards();
    });
  }, [])

  useEffect(() => {
    if (!blackjack)
      return;

    if (!blackjack.contract)
      return;
    
    blackjack.contract.on("PlayerCardsUpdated", () => {
      refreshCards();
    });
    
    blackjack.contract.on("DealerCardsUpdated", () => {
      refreshCards();
    });
    
    blackjack.contract.on("GameStateChanged", (gameState) => {
      refreshCards();
      refreshBet();
    });

  }, [blackjack, blackjack.contract]) 

  function refreshCards() {
    if (!blackjack)
      return;

    blackjack.getPlayerCards().then(cards => setPlayerCards(cards))
    blackjack.getDealerCards().then(cards => setDealerCards(cards))
  }

  function refreshBet() {
    blackjack.myBet().then(res => {

      setCurrentBet(ethers.formatEther(res))
      console.log(res)
    }
    );
  }
  async function handleBet(value) {
    const trx = await blackjack.bet(value);
    if (!trx) return;

    await trx.wait()
    refreshBet();
  }

  function cardValue(card) {
    const intValue = parseInt(card)
    const resultValues = ['?', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return resultValues[intValue];
  }

  return (
    <div>
      <header className='app-header'>
        <p className='logo'>ETHERS BET</p>
        {isConnected ? <p className='button-secondary'>{account}</p> :
          <button className='button-primary' onClick={requestAccount}>
            Connect account
          </button>
        }
      </header>

      <div className='content'>
        <button className='button-primary m-10' onClick={blackjack.startGame}>Start game</button>
        <button className='button-primary m-10' onClick={blackjack.stopGame}>Stop game</button>
        <button className='button-primary m-10' onClick={blackjack.drawPlayerCard}>Draw player card</button>
        <button className='button-primary m-10' onClick={blackjack.drawDealerCards}>Draw dealer cards</button>
        <div className='d-flex m-10'>
          <input className='betting-field mr-10' type='number' step={.0001} value={betValue} onChange={e => setBetValue(e.target.value)}/>
          <button className='button-primary' onClick={() => handleBet(betValue)}>Bet</button>
        </div>
        <p className='m-10'>Total bet: {currentBet}</p>

      </div>
      {
        playerCards.length > 0 && (
          <>
            <p className='cards-title'>Dealer</p>
            <div className='cards-holder'>
              {dealerCards.map((card, idx) => (
                <div className='card' key={idx}>{cardValue(card)}</div>
              ))}
            </div>

            <p className='cards-title'>Player</p>
            <div className='cards-holder'>
              {playerCards.map((card, idx) => (
                <div className='card' key={idx}>{cardValue(card)}</div>
              ))}
            </div>

            <div className='player-actions'>
              <button className='button-primary m-10' onClick={blackjack.playerHit}>Hit</button>
              <button className='button-primary m-10' onClick={blackjack.playerStand}>Stand</button>
            </div>
          </>
        )
      }
      
    </div>
  );
}

export default App;
