const PencilToken = artifacts.require("PencilToken.sol");
const PencilTokenSale = artifacts.require("PencilTokenSale.sol");

module.exports = async (deployer) => {
  await deployer.deploy(PencilToken, 1000000);
  deployer.deploy(PencilTokenSale, PencilToken.address, 1000000000000000);
};
