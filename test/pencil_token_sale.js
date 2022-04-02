const PencilTokenSale = artifacts.require("PencilTokenSale");
const PencilToken = artifacts.require("PencilToken");

contract('PencilTokenSale', async (accounts) => {
  let instance;
  let tokenInstanceAddress;
  const tokenPrice = 1000000000000000;

  before(async () => {
    const tokenInstance = await PencilToken.new(1000000);
    tokenInstanceAddress = await tokenInstance.address;
  });

  beforeEach(async () => {
    instance = await PencilTokenSale.new(tokenInstanceAddress, tokenPrice);
  });

  describe('initiation', () => {
    
    it('has an address', async () => {
      const address = await instance.address;
      assert.notEqual(address, 0x0, 'address is present');
    });

    it('has token contract address', async () => {
      const tokenAddress = await instance.tokenContract();
      assert.notEqual(tokenAddress, 0x0, 'token address is present');
    });

    it('token price is set correctly', async () => {
      const instanceTokenPrice = await instance.tokenPrice();
      assert.equal(instanceTokenPrice, tokenPrice, 'token price is correct');
    });
  });
});

