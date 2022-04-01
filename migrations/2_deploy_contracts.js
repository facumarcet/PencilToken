const PencilToken = artifacts.require("PencilToken.sol");

module.exports = function (deployer) {
  deployer.deploy(PencilToken, 1000000);
};
