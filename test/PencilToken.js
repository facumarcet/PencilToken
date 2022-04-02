let PencilToken = artifacts.require("./PencilToken.sol");
const { expectToThrow, assertTransferEmitted } = require('../helpers/test/testHelper');

contract('PencilToken', (accounts) => {
    let instance;

    beforeEach(async () => {
        instance = await PencilToken.new(1000000);
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
            await expectToThrow(instance.transfer.call(accounts[1], 9999999999), 'revert');
        });

        it('transfers token correctly', async () => {
            const receipt = await instance.transfer(accounts[1], 250000, { from: accounts[0] });
            const response = await instance.transfer.call(accounts[1], 250000, { from: accounts[0] });
            const senderBalance = await instance.balanceOf(accounts[0]);
            const receiverBalance = await instance.balanceOf(accounts[1]);

            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assertTransferEmitted(receipt.logs[0], accounts[0], accounts[1], 250000);
            assert.equal(receiverBalance.toNumber(), 250000, 'adds the amount to the receiving account');
            assert.equal(senderBalance.toNumber(), 750000, 'deducts the amount from the sending account');
            assert.equal(response, true, 'response is true');
        });
    });

    describe('.approve', () => {

        it('approves spender', async () => {
            const owner = accounts[0];
            const spender = accounts[1];
            const receipt = await instance.approve(spender, 20000);
            const response = await instance.approve.call(spender, 20000);
            const spenderAllowance = await instance.allowance(owner, spender);

            assert.equal(spenderAllowance.toNumber(), 20000, 'sets the spender allowance');
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'event is Approval');
            assert.equal(receipt.logs[0].args._owner, owner, 'owner is correct');
            assert.equal(receipt.logs[0].args._spender, spender, 'spender is correct');
            assert.equal(receipt.logs[0].args._value, 20000, 'allowed amount is correct');
            assert.equal(response, true, 'response is true');
        });
    });

    describe('.transferFrom', () => {
        const sender = accounts[0];
        const from = accounts[1];
        const to = accounts[2];


        beforeEach(async () => {
            await instance.approve(sender, 20000, { from });
        });

        it('throws if the value entered is bigger than the allowed', async () => {
            await instance.transfer(from, 250000, { from: sender });
            await expectToThrow(instance.transferFrom
                .call(from, to, 30000, { from: sender }), 'address not alowed to spend that amount');
        });

        it('throws if the from account does not have enough founds', async () => {
            await expectToThrow(instance.transferFrom
                .call(from, to, 1, { from: sender }), 'address does not have enough founds');
        });

        context('works', async () => {
            let receipt;
            beforeEach(async () => {
                await instance.transfer(accounts[1], 250000, { from: accounts[0] });
                receipt = await instance.transferFrom(from, to, 10000, { from: sender });
            });

            it('transfers the tokens', async () => {
                const fromBalance = await instance.balanceOf(from);
                const toBalance = await instance.balanceOf(to);

                assert.equal(fromBalance.toNumber(), 240000, 'deducts the amount sended to from account balance');
                assert.equal(toBalance.toNumber(), 10000, 'adds the amounts sended receiver balance');
            });

            it('deducts the amount from allowance mapping', async () => {
                const allowance = await instance.allowance(from, sender);
                assert.equal(allowance.toNumber(), 10000, 'allowance was deducted');
            });

            it('emits the Transfer event', async () => {
                assert.equal(receipt.logs.length, 1, 'triggers one event');
                assertTransferEmitted(receipt.logs[0], from, to, 10000);
            });

            it('returns true', async () => {
                const response = await instance.transferFrom.call(from, to, 10000, { from: sender });
                assert.equal(response, true, 'response is true');
            });
        });
    });
})