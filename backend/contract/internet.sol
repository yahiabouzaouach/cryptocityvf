// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InternetContract {
    // Structure for Internet
    struct Internet {
        string owner;
        string operatorName;
    }

    // Structure for Bill
    struct Bill {
        uint256 id;
        uint256 cin; // Customer Identification Number
        uint256 amount;
        string description;
        uint256 beginningDate;
        uint256 endDate;
        bool paid;
    }

    Internet public internet;

    mapping(uint256 => Bill) public billMapping; // Mapping for Bills using id as key

    uint256 public nextBillId;

    // Events for transfers and updates
    event InternetDetailsUpdated(string owner, string operatorName);
    event InternetDeleted();
    event BillUpdated(uint256 id, uint256 cin, uint256 amount, string description, uint256 beginningDate, uint256 endDate, bool paid);
    event BillPaid(uint256 id);
    event BillDeleted(uint256 id);

    // Constructor for InternetContract
    constructor(string memory _owner, string memory _operatorName) {
        internet = Internet({
            owner: _owner,
            operatorName: _operatorName
        });
        nextBillId = 1;
    }

    // Function to get the Internet owner address
    function getInternetOwner() public view returns (string memory) {
        return internet.owner;
    }

    // Function to get the operator name
    function getOperatorName() public view returns (string memory) {
        return internet.operatorName;
    }

    // Function to update Internet details
    function updateInternetDetails(string memory _owner, string memory _operatorName) public {
        internet.owner = _owner;
        internet.operatorName = _operatorName;

        emit InternetDetailsUpdated(_owner, _operatorName);
    }

    // Function to delete Internet details
    function deleteInternet() public {
        delete internet;

        emit InternetDeleted();
    }

    // Function to add a new Bill
    function addBill(uint256 _cin, uint256 _amount, string memory _description, uint256 _beginningDate, uint256 _endDate) public {
        billMapping[nextBillId] = Bill({
            id: nextBillId,
            cin: _cin,
            amount: _amount,
            description: _description,
            beginningDate: _beginningDate,
            endDate: _endDate,
            paid: false
        });

        emit BillUpdated(nextBillId, _cin, _amount, _description, _beginningDate, _endDate, false);
        nextBillId++;
    }

    // Function to update a Bill
    function updateBill(uint256 _id, uint256 _cin, uint256 _amount, string memory _description, uint256 _beginningDate, uint256 _endDate) public {
        Bill storage bill = billMapping[_id];
        require(bill.id != 0, "Bill not found");

        bill.cin = _cin;
        bill.amount = _amount;
        bill.description = _description;
        bill.beginningDate = _beginningDate;
        bill.endDate = _endDate;

        emit BillUpdated(_id, _cin, _amount, _description, _beginningDate, _endDate, bill.paid);
    }

    // Function to get a Bill by id
    function getBill(uint256 _id) public view returns (uint256, uint256, uint256, string memory, uint256, uint256, bool) {
        Bill memory bill = billMapping[_id];
        require(bill.id != 0, "Bill not found");
        return (bill.id, bill.cin, bill.amount, bill.description, bill.beginningDate, bill.endDate, bill.paid);
    }

    // Function to mark a Bill as paid
    function payBill(uint256 _id) public {
        Bill storage bill = billMapping[_id];
        require(bill.id != 0, "Bill not found");
        require(!bill.paid, "Bill already paid");

        bill.paid = true;

        emit BillPaid(_id);
    }

    // Function to delete a Bill
    function deleteBill(uint256 _id) public {
        require(billMapping[_id].id != 0, "Bill not found");

        delete billMapping[_id];

        emit BillDeleted(_id);
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
