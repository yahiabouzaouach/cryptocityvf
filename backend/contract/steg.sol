// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract STEGContract {
    // Structure for STEG
    struct STEG {
        string owner; // Changed from address to string
        string name;
    }

    // Structure for Bill
    struct Bill {
        uint256 ancienindex;
        uint256 nouveauindex;
        uint256 nmbremonths;
        uint256 tva;
        uint256 montant;
        string description;
        string adresse;
        uint256 beginningDate;
        uint256 endDate;
        bool paid;
    }

    STEG public steg;

    mapping(uint256 => Bill) public billMapping; // Mapping for Bills using id as key

    uint256 public nextBillId;

    // Events for transfers and updates
    event STEGDetailsUpdated(string name);
    event STEGDeleted();
    event BillUpdated(uint256 id, bool paid);

    // Constructor for STEG
    constructor(string memory _owner, string memory _name) {
        steg = STEG({
            owner: _owner,
            name: _name
        });
        nextBillId = 1;
    }

    // Function to get the STEG owner
    function getSTEGOwner() public view returns (string memory) {
        return steg.owner;
    }

    // Function to get the STEG name
    function getSTEGName() public view returns (string memory) {
        return steg.name;
    }

    // Function to update STEG details
    function updateSTEGDetails(string memory _owner, string memory _name) public {
        steg.owner = _owner;
        steg.name = _name;

        emit STEGDetailsUpdated(_name);
    }

    // Function to delete STEG details
    function deleteSTEG() public {
        delete steg;

        emit STEGDeleted();
    }

    // Function to add a new Bill
    function addBill(uint256 _ancienindex, uint256 _nouveauindex, uint256 _nmbremonths, uint256 _tva, uint256 _montant, string memory _description, string memory _adresse, uint256 _beginningDate, uint256 _endDate) public {
        billMapping[nextBillId] = Bill({
            ancienindex: _ancienindex,
            nouveauindex: _nouveauindex,
            nmbremonths: _nmbremonths,
            tva: _tva,
            montant: _montant,
            description: _description,
            adresse: _adresse,
            beginningDate: _beginningDate,
            endDate: _endDate,
            paid: false
        });

        emit BillUpdated(nextBillId, false);
        nextBillId++;
    }

    // Function to update a Bill
    function updateBill(uint256 _id, uint256 _ancienindex, uint256 _nouveauindex, uint256 _nmbremonths, uint256 _tva, uint256 _montant, string memory _description, string memory _adresse, uint256 _beginningDate, uint256 _endDate) public {
        Bill storage bill = billMapping[_id];
        require(bill.ancienindex != 0, "Bill not found");

        bill.ancienindex = _ancienindex;
        bill.nouveauindex = _nouveauindex;
        bill.nmbremonths = _nmbremonths;
        bill.tva = _tva;
        bill.montant = _montant;
        bill.description = _description;
        bill.adresse = _adresse;
        bill.beginningDate = _beginningDate;
        bill.endDate = _endDate;

        emit BillUpdated(_id, bill.paid);
    }

    // Function to get a Bill by id
    function getBill(uint256 _id) public view returns (uint256, uint256, uint256, uint256, uint256, string memory, string memory, uint256, uint256, bool) {
        Bill memory bill = billMapping[_id];
        require(bill.ancienindex != 0, "Bill not found");
        return (bill.ancienindex, bill.nouveauindex, bill.nmbremonths, bill.tva, bill.montant, bill.description, bill.adresse, bill.beginningDate, bill.endDate, bill.paid);
    }

    // Function to mark a Bill as paid
    function payBill(uint256 _id) public {
        Bill storage bill = billMapping[_id];
        require(bill.ancienindex != 0, "Bill not found");
        require(!bill.paid, "Bill already paid");

        bill.paid = true;

        emit BillUpdated(_id, true);
    }

    // Function to delete a Bill
    function deleteBill(uint256 _id) public {
        require(billMapping[_id].ancienindex != 0, "Bill not found");

        delete billMapping[_id];

        emit BillUpdated(_id, false);
    }

    // Function to retrieve all Bills
    function getAllBills() public view returns (Bill[] memory) {
        Bill[] memory result = new Bill[](nextBillId - 1);
        for (uint256 i = 1; i < nextBillId; i++) {
            result[i - 1] = billMapping[i];
        }
        return result;
    }
}
