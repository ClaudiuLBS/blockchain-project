require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const SEPOLIA_URL = process.env.SEPOLIA_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
        url: SEPOLIA_URL,
        accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
