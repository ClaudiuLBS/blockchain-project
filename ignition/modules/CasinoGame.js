const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CasinoGameModule", (m) => {

  const casinoGame = m.contract("CasinoGame", [], {});

  return { casinoGame };
});
