const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CasinoGameModule", (m) => {

  const casino = m.contract("CasinoGame", [], {});

  return { casino: casino };
});
