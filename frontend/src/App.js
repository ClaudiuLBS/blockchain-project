import logo from './logo.svg';
import './App.css';

import { getConnectedAccount, isConnected, requestAccount } from './utils/ethers.utils'
import { useEffect, useState } from 'react';

const App = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    getConnectedAccount().then(res => setAccount(res))
  }, [account])

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
      <body>

      </body>
    </div>
  );
}

export default App;
