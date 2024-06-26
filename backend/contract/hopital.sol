// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HopitalContract {
    // Structure for Hopital
    struct Hopital {
        string owner; // Changed from address to string
        string nomHopital;
    }

    // Structure for Bill
    struct Bill {
        uint256 id;
        string nomPatient;
        string description;
        uint256 montant;
        uint256 dateRecep;
        bool paid;
    }

    Hopital public hopital;
    mapping(uint256 => Bill) public billsMapping;
    uint256 public nextBillId;

    // Events for transfers and updates
    event HopitalDetailsUpdated(string nomHopital);
    event HopitalDeleted();
    event BillAdded(uint256 id, string nomPatient, string description, uint256 montant, uint256 dateRecep, bool paid);
    event BillUpdated(uint256 id, string nomPatient, string description, uint256 montant, uint256 dateRecep, bool paid);
    event BillPaid(uint256 id);
    event BillDeleted(uint256 id);

    // Constructor for Hopital
    constructor(string memory _owner, string memory _nomHopital) {
        hopital = Hopital({
            owner: _owner,
            nomHopital: _nomHopital
        });
        nextBillId = 1;
    }

    // Function to get the hopital owner
    function getHopitalOwner() public view returns (string memory) {
        return hopital.owner;
    }

    // Function to get the hopital name
    function getHopitalName() public view returns (string memory) {
        return hopital.nomHopital;
    }

    // Function to update hopital details
    function updateHopitalDetails(string memory _owner, string memory _nomHopital) public {
        hopital.owner = _owner;
        hopital.nomHopital = _nomHopital;

        emit HopitalDetailsUpdated(_nomHopital);
    }

    // Function to delete hopital details
    function deleteHopital() public {
        delete hopital;

        emit HopitalDeleted();
    }

    // Function to add a bill
    function addBill(string memory _nomPatient, string memory _description, uint256 _montant, uint256 _dateRecep) public {
        billsMapping[nextBillId] = Bill({
            id: nextBillId,
            nomPatient: _nomPatient,
            description: _description,
            montant: _montant,
            dateRecep: _dateRecep,
            paid: false
        });

        emit BillAdded(nextBillId, _nomPatient, _description, _montant, _dateRecep, false);
        nextBillId++;
    }

    // Function to update a bill
    function updateBill(uint256 _id, string memory _nomPatient, string memory _description, uint256 _montant, uint256 _dateRecep) public {
        require(billsMapping[_id].id != 0, "Bill not found");

        billsMapping[_id].nomPatient = _nomPatient;
        billsMapping[_id].description = _description;
        billsMapping[_id].montant = _montant;
        billsMapping[_id].dateRecep = _dateRecep;

        emit BillUpdated(_id, _nomPatient, _description, _montant, _dateRecep, billsMapping[_id].paid);
    }

    // Function to get a bill
    function getBill(uint256 _id) public view returns (uint256, string memory, string memory, uint256, uint256, bool) {
        Bill memory bill = billsMapping[_id];
        require(bill.id != 0, "Bill not found");
        return (bill.id, bill.nomPatient, bill.description, bill.montant, bill.dateRecep, bill.paid);
    }

    // Function to mark a bill as paid
    function payBill(uint256 _id) public {
        require(billsMapping[_id].id != 0, "Bill not found");
        require(!billsMapping[_id].paid, "Bill already paid");

        billsMapping[_id].paid = true;

        emit BillPaid(_id);
    }

    // Function to delete a bill
    function deleteBill(uint256 _id) public {
        require(billsMapping[_id].id != 0, "Bill not found");

        delete billsMapping[_id];

        emit BillDeleted(_id);
    }
}
