let PencilToken = artifacts.require("./PencilToken.sol");
const {expectToThrow} = require('../helpers/test/expectThrow');

contract('PencilToken', (accounts) => {
    let instance;

    beforeEach(async () => {
        instance = await PencilToken.deployed();
    });

    describe('initiation', () => {

        it('sets the contract properties properly', async () => {
            const name = await instance.name();
            const symbol = await instance.symbol();

            assert.equal(name, 'Pencil', 'sets the name correctly');
            assert.equal(symbol, 'PNC', 'sets the symbol correctly');
        });
    
        it('sets the total supply upon deployment', async () => {
            const totalSupply = await instance.totalSupply();
            const adminBalance = await instance.balanceOf(accounts[0]);

            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin');
        });
    });


    describe('.transfer', () => {

        it('throws an error when the amount to send is bigger than the balance', async () => {
            const error = await expectToThrow(instance.transfer.call(accounts[1], 9999999999));
            const revertExist = error ? error.message.indexOf('revert') > -1 : false;

            assert(revertExist, 'error message contains revert');
        });

        it('transfers token correctly', async () => {
            const receipt = await instance.transfer(accounts[1], 250000, {from: accounts[0]});
            const response = await instance.transfer.call(accounts[1], 250000, {from: accounts[0]});
            const senderBalance = await instance.balanceOf(accounts[0]);
            const receiverBalance = await instance.balanceOf(accounts[1]);

            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'event is Transfer');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'sender is correct');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'receiver is correct');
            assert.equal(receipt.logs[0].args._value, 250000, 'transfered amount is correct');
            assert.equal(receiverBalance.toNumber(), 250000, 'adds the amount to the receiving account');
            assert.equal(senderBalance.toNumber(), 750000, 'deducts the amount from the sending account');
            assert.equal(response, true, 'response is true');
        });
    });
})