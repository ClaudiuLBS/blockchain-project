import { ethers } from 'ethers'

async function requestAccount() {
  const account = await window.ethereum.request({ method: "eth_requestAccounts" });
  return account;
}

async function getConnectedAccount() {
  if (isConnected()) {
    const account = await window.ethereum.request({ method: "eth_requestAccounts" });
    return account;
  }
  return null;
}

function isConnected() {
  return (window.ethereum && window.ethereum.isMetaMask)
}

export {
  requestAccount,
  getConnectedAccount,
  isConnected
}