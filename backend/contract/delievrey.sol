// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DelieveryContract {
    // Structure for Company
    struct Company {
        string owner;
        string companyName;
    }

    // Structure for Fees
    struct Fees {
        uint256 id;
        string fullName;
        uint256 numTlf;
        uint256[] productIds; // Store product IDs instead of array directly
        uint256 totalAmount;
        bool paid;
    }

    // Structure for Products
    struct Product {
        string name;
        uint256 quantity;
        uint256 price;
        string adresse; // New field for product address
    }

    // Structure for Rating
    struct Rating {
        uint256 id;
        uint256 rating;
        string comment;
    }

    Company public company;
    mapping(uint256 => Fees) public feesMapping;
    mapping(uint256 => Product) public productsMapping; // Mapping for products
    mapping(uint256 => Rating) public ratingsMapping;
    uint256 public nextFeesId;
    uint256 public nextProductId;
    uint256 public nextRatingId;

    // Events for transfers and updates
    event CompanyDetailsUpdated(string companyName);
    event CompanyDeleted();
    event FeesUpdated(uint256 id, string fullName, uint256 numTlf, uint256[] productIds, uint256 totalAmount, bool paid);
    event FeesPaid(uint256 id);
    event FeesDeleted(uint256 id);
    event RatingUpdated(uint256 id, uint256 rating, string comment);
    event RatingDeleted(uint256 id);
    event ProductAdded(uint256 id, string name, uint256 quantity, uint256 price, string adresse); // Updated event
    event ProductUpdated(uint256 id, string name, uint256 quantity, uint256 price, string adresse); // Updated event
    event ProductDeleted(uint256 id);

    // Constructor for Company
    constructor(string memory _owner, string memory _companyName) {
        company = Company({
            owner: _owner,
            companyName: _companyName
        });
        nextFeesId = 1;
        nextProductId = 1;
        nextRatingId = 1;
    }

    // Function to get the company owner address
    function getCompanyOwner() public view returns (string memory) {
        return company.owner;
    }

    // Function to get the company name
    function getCompanyName() public view returns (string memory) {
        return company.companyName;
    }

    // Function to update company details
    function updateCompanyDetails(string memory _owner, string memory _companyName) public {
        company.owner = _owner;
        company.companyName = _companyName;

        emit CompanyDetailsUpdated(_companyName);
    }

    // Function to delete company details
    function deleteCompany() public {
        delete company;

        emit CompanyDeleted();
    }

    // Functions to handle fees
    function addFees(string memory _fullName, uint256 _numTlf, uint256[] memory _productIds) public {
        uint256 totalAmount = calculateTotalAmount(_productIds);
        
        feesMapping[nextFeesId] = Fees({
            id: nextFeesId,
            fullName: _fullName,
            numTlf: _numTlf,
            productIds: _productIds,
            totalAmount: totalAmount,
            paid: false
        });

        emit FeesUpdated(nextFeesId, _fullName, _numTlf, _productIds, totalAmount, false);
        nextFeesId++;
    }

    function updateFees(uint256 _id, string memory _fullName, uint256 _numTlf, uint256[] memory _productIds) public {
        require(feesMapping[_id].id != 0, "Fees not found");

        uint256 totalAmount = calculateTotalAmount(_productIds);
        
        feesMapping[_id].fullName = _fullName;
        feesMapping[_id].numTlf = _numTlf;
        feesMapping[_id].productIds = _productIds;
        feesMapping[_id].totalAmount = totalAmount;

        emit FeesUpdated(_id, _fullName, _numTlf, _productIds, totalAmount, feesMapping[_id].paid);
    }

    function getFees(uint256 _id) public view returns (uint256, string memory, uint256, uint256[] memory, uint256, bool) {
        Fees memory fee = feesMapping[_id];
        require(fee.id != 0, "Fees not found");
        return (fee.id, fee.fullName, fee.numTlf, fee.productIds, fee.totalAmount, fee.paid);
    }

    function payFees(uint256 _id) public {
        require(feesMapping[_id].id != 0, "Fees not found");
        require(!feesMapping[_id].paid, "Fees already paid");

        feesMapping[_id].paid = true;

        emit FeesPaid(_id);
    }

    function deleteFees(uint256 _id) public {
        require(feesMapping[_id].id != 0, "Fees not found");

        delete feesMapping[_id];

        emit FeesDeleted(_id);
    }

    // Functions to handle products
    function addProduct(string memory _name, uint256 _quantity, uint256 _price, string memory _adresse) public {
        productsMapping[nextProductId] = Product({
            name: _name,
            quantity: _quantity,
            price: _price,
            adresse: _adresse
        });

        emit ProductAdded(nextProductId, _name, _quantity, _price, _adresse);
        nextProductId++;
    }

    function updateProduct(uint256 _id, string memory _name, uint256 _quantity, uint256 _price, string memory _adresse) public {
        require(productsMapping[_id].price != 0, "Product not found");

        productsMapping[_id].name = _name;
        productsMapping[_id].quantity = _quantity;
        productsMapping[_id].price = _price;
        productsMapping[_id].adresse = _adresse;

        emit ProductUpdated(_id, _name, _quantity, _price, _adresse);
    }

    function getProduct(uint256 _id) public view returns (uint256, string memory, uint256, uint256, string memory) {
        Product memory product = productsMapping[_id];
        require(bytes(product.name).length > 0, "Product not found");
        return (_id, product.name, product.quantity, product.price, product.adresse);
    }

    function deleteProduct(uint256 _id) public {
        require(productsMapping[_id].price != 0, "Product not found");

        delete productsMapping[_id];

        emit ProductDeleted(_id);
    }

    // Functions to handle ratings
    function addRating(uint256 _rating, string memory _comment) public {
        ratingsMapping[nextRatingId] = Rating({
            id: nextRatingId,
            rating: _rating,
            comment: _comment
        });

        emit RatingUpdated(nextRatingId, _rating, _comment);
        nextRatingId++;
    }

    function updateRating(uint256 _id, uint256 _rating, string memory _comment) public {
        require(ratingsMapping[_id].id != 0, "Rating not found");

        ratingsMapping[_id].rating = _rating;
        ratingsMapping[_id].comment = _comment;

        emit RatingUpdated(_id, _rating, _comment);
    }

    function getRating(uint256 _id) public view returns (uint256, uint256, string memory) {
        Rating memory rating = ratingsMapping[_id];
        require(rating.id != 0, "Rating not found");
        return (rating.id, rating.rating, rating.comment);
    }

    function deleteRating(uint256 _id) public {
        require(ratingsMapping[_id].id != 0, "Rating not found");

        delete ratingsMapping[_id];

        emit RatingDeleted(_id);
    }

    // Internal function to calculate total amount based on product IDs
    function calculateTotalAmount(uint256[] memory _productIds) internal view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _productIds.length; i++) {
            total += productsMapping[_productIds[i]].price * productsMapping[_productIds[i]].quantity;
        }
        return total;
    }
}
