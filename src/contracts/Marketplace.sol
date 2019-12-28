pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;
    enum ProductState {InStock, Purchased, Shipped, Delivered}
    mapping(address => uint) balance;

    struct Product {
        uint id;
        string name;
        uint price;
        uint shippingPrice;
        address payable owner;
        address payable buyer;
        address payable shipper;
        ProductState state;
    }

    constructor() public {
        name = "Market Contract";
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        ProductState state
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable shipper,
        uint shippingPrice,
        address payable owner,
        address payable buyer,
        ProductState state
    );

    event ProductShipped(
        uint id,
        string name,
        uint price,
        address payable shipper,
        uint shippingPrice,
        address payable owner,
        address payable buyer,
        ProductState state
    );

    event ProductDelivered (
        uint id,
        string name,
        uint price,
        address payable shipper,
        uint shippingPrice,
        address payable owner,
        address payable buyer,
        ProductState state
    );

    modifier hasName(string memory _name) {
        // Require a valid name
        require(bytes(_name).length > 0, "Invalid name");
        _;
    }
    modifier hasPrice(uint _price) {
        // Require a valid name
        require(_price > 0, "Not enough funds");
        _;
    }

    function createProduct(string memory _name, uint _price)
        public
        hasName(_name)
        hasPrice(_price)
    {

        // Increment product count
        productCount++;

        // Create the product
        products[productCount] = Product(productCount, _name, _price, 0, msg.sender, address(0), address(0), ProductState.InStock);
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, ProductState.InStock);
    }

    modifier IdExists(uint _id) {
        // Make sure the product has a valid id
        require(products[_id].id > 0 && products[_id].id <= productCount, "Invalid product id");
        _;
    }
    modifier EnoughMoneyToBuy(uint _id, uint shippingCost) {
        Product storage _product = products[_id];

        // Require that there is enough Ether in the transaction
        require(msg.value > _product.price && _product.price == (msg.value - shippingCost), "Insufficient funds");
        // Require that shipping cost wouldn't be 0
        require(shippingCost < msg.value && shippingCost == (msg.value - _product.price), "Invalid shipping cost");
        _;
    }
    modifier ProductIsInStock(uint _id) {
        // Require that the product has not been purchased already
        require(products[_id].state != ProductState.Purchased, "Product has been already purchased");
        _;
    }
    modifier isNotSeller(address payable seller) {
        // Require that the buyer is not the seller
        require(seller != msg.sender, "Buying your own goods is prohibited");
        _;
    }
    modifier isValidShipper(uint _id, address payable _shipper) {
        // Require that the buyer is not the shipper
        require(_shipper != msg.sender, "Buyer cannot ship");
        // Require that the seller is not the shipper
        require(_shipper != products[_id].owner, "Seller cannot ship");
        _;
    }

    function purchaseProduct(uint _id, address payable _shipper, uint shippingCost)
        public
        payable
        IdExists(_id)
        EnoughMoneyToBuy(_id, shippingCost)
        ProductIsInStock(_id)
        isNotSeller(products[_id].owner)
        isValidShipper(_id, _shipper)
    {

        // Fetch the product
        Product storage _product = products[_id];

        // Change product's state
        _product.state = ProductState.Purchased;
        // Change product's shipping cost
        _product.shippingPrice = shippingCost;
        // Add Ether to the contract
        _product.buyer = msg.sender;

        uint value = msg.value;
        mapping(address => uint) storage _balance = balance;
        _balance[_product.owner] += (value - shippingCost);

        // Add shipper to the contract
        _product.shipper = _shipper;

        // Trigger an event
        emit ProductPurchased(_product.id, _product.name, _product.price, _product.shipper, _product.shippingPrice, _product.owner, _product.buyer, ProductState.Purchased);
    }

    modifier isShipper(uint _id) {
        Product storage _product = products[_id];

        require(msg.sender == _product.shipper, 'Only shipper can ship the product');
        _;
    }

    modifier ProductIsInState(uint _id, ProductState _state) {
        Product storage _product = products[_id];

        require(_product.state == _state, 'Product does not meet required state');
        _;
    }

    function shipProduct(uint _id)
        public
        IdExists(_id)
        ProductIsInState(_id, ProductState.Purchased)
        isShipper(_id)
    {

        // Fetch the product
        Product storage _product = products[_id];

        // Mark shipper's ether as salary
        mapping(address => uint) storage _balance = balance;
        _balance[msg.sender] += _product.shippingPrice;
        // Mark product as shipped;
        _product.state = ProductState.Shipped;

        //Trigger an event
        emit ProductShipped(_product.id, _product.name, _product.price, _product.shipper, _product.shippingPrice, _product.owner, _product.buyer, _product.state);
    }

    modifier IsBuyer(uint _id) {
        Product storage _product = products[_id];

        require(msg.sender == _product.buyer, "Only buyer can perform this task");
        _;
    }

    function markProductAsDelivered(uint _id)
        public
        IdExists(_id)
        IsBuyer(_id)
    {
        Product storage _product = products[_id];

        mapping(address => uint) storage _balance = balance;
        // Check if there's enough balance
        require(_balance[_product.owner] >= _product.price, "There was a problem calculating price for the seller");
        require(_balance[_product.shipper] >= _product.shippingPrice, "There was a problem calculating price for the shipper");
        // Pay the seller and shipper
        _product.owner.transfer(_product.price);
        _product.shipper.transfer(_product.shippingPrice);
        _balance[_product.owner] -= _product.price;
        _balance[_product.shipper] -= _product.shippingPrice;

        // Transfer ownership to the buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.state = ProductState.Delivered;

        emit ProductDelivered(_product.id, _product.name, _product.price, _product.shipper, _product.shippingPrice, _product.owner, _product.buyer, _product.state);
    }
}