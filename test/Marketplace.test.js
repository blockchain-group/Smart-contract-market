const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Marketplace', ([seller, buyer, shipper, otherUser]) => {
    let marketplace;

    before(async () => {
        marketplace = await Marketplace.deployed()
    });

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async () => {
            const name = await marketplace.name();
            assert.equal(name, 'Market Contract');
        })

    });

    describe('products', async () => {
        let result, productCount;
        const ProductState = { // Solidity does not support enums https://github.com/ethereum/EIPs/issues/47
            InStock: 0,
            Purchased: 1,
            Shipped: 2,
            Delivered: 3
        };

        before(async () => {
            result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), {from: seller});
            productCount = await marketplace.productCount();
        });

        it('creates products', async () => {
            assert.equal(productCount, 1);
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.state.words[0], ProductState.InStock, 'purchased is correct');

            // FAILURE: Product must have a name
            await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;
            // FAILURE: Product must have a price
            await marketplace.createProduct('iPhone X', 0, {from: seller}).should.be.rejected;
        });

        async function getBalance(_person) {
            const temp = await web3.eth.getBalance(_person);
            return new web3.utils.BN(temp);
        }

        let oldBuyerBalance;
        let newBuyerBalance;
        it('sells products', async () => {
            oldBuyerBalance = await getBalance(buyer);
            // SUCCESS: Buyer makes purchase
            result = await marketplace.purchaseProduct(productCount, shipper, web3.utils.toWei('0.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether')});
            newBuyerBalance = await getBalance(buyer);

            // Check logs
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.shipper, shipper, 'shipper is valid');
            assert.equal(event.shippingPrice, '500000000000000000', 'price is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.buyer, buyer, 'buyer is correct');
            assert.equal(event.state.words[0], ProductState.Purchased, 'purchase is correct');

            // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
            await marketplace.purchaseProduct(99, web3.utils.toWei('0.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether')}).should.be.rejected;
            // FAILURE: Buyer tries to buy without enough ether
            await marketplace.purchaseProduct(productCount, web3.utils.toWei('0.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
            // FAILURE: Seller tries to buy the product, i.e., product can't be purchased twice
            await marketplace.purchaseProduct(productCount, web3.utils.toWei('0.5', 'Ether'), { from: seller, value: web3.utils.toWei('1.5', 'Ether') }).should.be.rejected;
            // FAILURE: Shipper is buyer
            await marketplace.purchaseProduct(productCount, buyer, web3.utils.toWei('0.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether')}).should.be.rejected;
            // FAILURE: Shipper is seller
            await marketplace.purchaseProduct(productCount, seller, web3.utils.toWei('0.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether')}).should.be.rejected;
            // FAILURE: Buyer tries to buy with invalid shippingPrice
            //    insufficient funds
            await marketplace.purchaseProduct(productCount, web3.utils.toWei('1.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether')}).should.be.rejected;
            //    insufficient funds
            await marketplace.purchaseProduct(productCount, web3.utils.toWei('0.6', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether')}).should.be.rejected;
        });

        it('ships products', async () => {
            // SUCCESS: Shipper ships products
            result = await marketplace.shipProduct(productCount, { from: shipper });

            // Check logs
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.shipper, shipper, 'shipper is valid');
            assert.equal(event.shippingPrice, '500000000000000000', 'price is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.buyer, buyer, 'buyer is correct');
            assert.equal(event.state.words[0], ProductState.Shipped, 'shipping is correct');

            // FAILURE: Shipper tries to ship wrong product
            await marketplace.shipProduct(99, { from: shipper }).should.be.rejected;
            // FAILURE: Buyer tries to ship product
            await marketplace.shipProduct(productCount, { from: buyer }).should.be.rejected;
            // FAILURE: Seller tries to ship product
            await marketplace.shipProduct(productCount, { from: seller }).should.be.rejected;
        });

        it('shows product\'s info', async () => {
            // SUCCESS: Shows product's info
            result = await marketplace.getProduct(productCount, { from: shipper });

            // Check logs
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.shipper, shipper, 'shipper is valid');
            assert.equal(event.shippingPrice, '500000000000000000', 'price is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.buyer, buyer, 'buyer is correct');
            expect(Object.values(ProductState)).to.contain.members([event.state.words[0]]);

            // FAILURE: Tried to get invalid product
            await marketplace.getProduct(99, { from: shipper }).should.be.rejected;
            // FAILURE: User is not in actors group
            await marketplace.getProduct(productCount, { from: otherUser }).should.be.rejected;
        });

        it('product gets delivered and purchase - completed', async () => {
            function transformPrice(_price) {
                const temp = web3.utils.toWei(_price, 'Ether');
                return new web3.utils.BN(temp);
            }

            // Track the seller's, buyer's and shipper's balance before the money transfer
            let oldSellerBalance = await getBalance(seller);
            let oldShipperBalance = await getBalance(shipper);

            // SUCCESS: Shows product's info
            result = await marketplace.markProductAsDelivered(productCount, { from: buyer });

            // Check logs
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.shipper, shipper, 'shipper is valid');
            assert.equal(event.shippingPrice, '500000000000000000', 'price is correct');
            assert.equal(event.owner, buyer, 'owner is correct');
            assert.equal(event.buyer, buyer, 'buyer is correct');
            assert.equal(event.state.words[0], ProductState.Delivered, 'shipping is correct');

            // Calculate prices
            const productPrice = transformPrice('1');
            const shippingPrice = transformPrice('0.5');

            // Check that seller and shipper received funds
            let newSellerBalance = await getBalance(seller);
            let newShipperBalance = await getBalance(shipper);
            assert.equal(newSellerBalance.toString(), oldSellerBalance.add(productPrice).toString(), 'transfer to seller is successful');
            assert.equal(newShipperBalance.toString(), oldShipperBalance.add(shippingPrice).toString(), 'transfer to shipper is successful');

            // Check that buyer sent funds
            const totalPrice = transformPrice('1.5');
            assert.equal(newBuyerBalance.add(totalPrice).toString(), oldBuyerBalance.toString(), 'transfer from buyer is successful');

            // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
            await marketplace.purchaseProduct(productCount, web3.utils.toWei('0.5', 'Ether'), { from: buyer, value: web3.utils.toWei('1.5', 'Ether') }).should.be.rejected;

            // FAILURE: Tried to get invalid product
            await marketplace.getProduct(99, { from: buyer }).should.be.rejected;
            // FAILURE: Shipper tries to mark product as delivered
            await marketplace.getProduct(productCount, { from: shipper }).should.be.rejected;
        });
    });
});