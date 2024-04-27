const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BlackjackModule", (m) => {

  const blackjack = m.contract("Blackjack", [], {});

  return { blackjack };
});
