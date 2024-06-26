// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniversityContract {
    // Structure for University
    struct University {
        string owner; //  from address to string
        string uniName;
    }

    // Structure for Fees
    struct Fees {
        uint256 id;
        uint256 cin;
        uint256 amount;
        uint256 beginningDate;
        uint256 endDate;
        bool paid;
    }

    // Structure for Scholarship
    struct Scholarship {
        uint256 id;
        uint256 cin;
        uint256 amount;
        uint256 beginningDate;
        uint256 endDate;
        bool paid;
    }

    University public university;

    mapping(uint256 => Fees) public feesMapping; // Mapping for Fees using id as key
    mapping(uint256 => Scholarship) public scholarshipMapping; // Mapping for Scholarship using id as key

    uint256 public nextFeesId;
    uint256 public nextScholarshipId;

    // Events for transfers and updates
    event UniversityDetailsUpdated(string uniName);
    event UniversityDeleted();
    event FeesUpdated(uint256 id, uint256 cin, uint256 amount, uint256 beginningDate, uint256 endDate, bool paid);
    event FeesPaid(uint256 id);
    event FeesDeleted(uint256 id);
    event ScholarshipDetailsUpdated(uint256 id, uint256 cin, uint256 amount, uint256 beginningDate, uint256 endDate, bool paid);
    event ScholarshipPaid(uint256 id);
    event ScholarshipDeleted(uint256 id);

    // Constructor for University
    constructor(string memory _owner, string memory _uniName) {
        university = University({
            owner: _owner,
            uniName: _uniName
        });
        nextFeesId = 1;
        nextScholarshipId = 1;
    }

    // Function to get the university owner address
    function getUniversityOwner() public view returns (string memory) {
        return university.owner;
    }

    // Function to get the university name
    function getUniversityName() public view returns (string memory) {
        return university.uniName;
    }

    // Function to update university details
    function updateUniversityDetails(string memory _owner, string memory _uniName) public {
        university.owner = _owner;
        university.uniName = _uniName;

        emit UniversityDetailsUpdated(_uniName);
    }

    // Function to delete university details
    function deleteUniversity() public {
        delete university;

        emit UniversityDeleted();
    }

    // Functions to handle fees
    function addFees(uint256 _cin, uint256 _amount, uint256 _beginningDate, uint256 _endDate) public {
        feesMapping[nextFeesId] = Fees({
            id: nextFeesId,
            cin: _cin,
            amount: _amount,
            beginningDate: _beginningDate,
            endDate: _endDate,
            paid: false
        });

        emit FeesUpdated(nextFeesId, _cin, _amount, _beginningDate, _endDate, false);
        nextFeesId++;
    }

    function updateFees(uint256 _id, uint256 _cin, uint256 _amount, uint256 _beginningDate, uint256 _endDate) public {
        require(feesMapping[_id].id != 0, "Fees not found");
        require(feesMapping[_id].cin == _cin, "CIN does not match");

        feesMapping[_id].amount = _amount;
        feesMapping[_id].beginningDate = _beginningDate;
        feesMapping[_id].endDate = _endDate;

        emit FeesUpdated(_id, _cin, _amount, _beginningDate, _endDate, feesMapping[_id].paid);
    }

    function getFees(uint256 _id, uint256 _cin) public view returns (uint256, uint256, uint256, uint256, uint256, bool) {
        Fees memory fee = feesMapping[_id];
        require(fee.id != 0, "Fees not found");
        require(fee.cin == _cin, "CIN does not match");
        return (fee.id, fee.cin, fee.amount, fee.beginningDate, fee.endDate, fee.paid);
    }

    function payFees(uint256 _id, uint256 _cin) public {
        require(feesMapping[_id].id != 0, "Fees not found");
        require(feesMapping[_id].cin == _cin, "CIN does not match");
        require(!feesMapping[_id].paid, "Fees already paid");

        feesMapping[_id].paid = true;

        emit FeesPaid(_id);
    }

    function deleteFees(uint256 _id, uint256 _cin) public {
        require(feesMapping[_id].id != 0, "Fees not found");
        require(feesMapping[_id].cin == _cin, "CIN does not match");

        delete feesMapping[_id];

        emit FeesDeleted(_id);
    }

    // Functions to handle scholarships
    function addScholarship(uint256 _cin, uint256 _amount, uint256 _beginningDate, uint256 _endDate) public {
        scholarshipMapping[nextScholarshipId] = Scholarship({
            id: nextScholarshipId,
            cin: _cin,
            amount: _amount,
            beginningDate: _beginningDate,
            endDate: _endDate,
            paid: false
        });

        emit ScholarshipDetailsUpdated(nextScholarshipId, _cin, _amount, _beginningDate, _endDate, false);
        nextScholarshipId++;
    }

    function updateScholarshipDetails(uint256 _id, uint256 _cin, uint256 _amount, uint256 _beginningDate, uint256 _endDate) public {
        require(scholarshipMapping[_id].id != 0, "Scholarship not found");
        require(scholarshipMapping[_id].cin == _cin, "CIN does not match");

        scholarshipMapping[_id].amount = _amount;
        scholarshipMapping[_id].beginningDate = _beginningDate;
        scholarshipMapping[_id].endDate = _endDate;

        emit ScholarshipDetailsUpdated(_id, _cin, _amount, _beginningDate, _endDate, scholarshipMapping[_id].paid);
    }

    function getScholarshipDetails(uint256 _id, uint256 _cin) public view returns (uint256, uint256, uint256, uint256, uint256, bool) {
        Scholarship memory scholarship = scholarshipMapping[_id];
        require(scholarship.id != 0, "Scholarship not found");
        require(scholarship.cin == _cin, "CIN does not match");
        return (scholarship.id, scholarship.cin, scholarship.amount, scholarship.beginningDate, scholarship.endDate, scholarship.paid);
    }

    function payScholarship(uint256 _id, uint256 _cin) public {
        require(scholarshipMapping[_id].id != 0, "Scholarship not found");
        require(scholarshipMapping[_id].cin == _cin, "CIN does not match");
        require(!scholarshipMapping[_id].paid, "Scholarship already paid");

        scholarshipMapping[_id].paid = true;

        emit ScholarshipPaid(_id);
    }

    function deleteScholarship(uint256 _id, uint256 _cin) public {
        require(scholarshipMapping[_id].id != 0, "Scholarship not found");
        require(scholarshipMapping[_id].cin == _cin, "CIN does not match");

        delete scholarshipMapping[_id];

        emit ScholarshipDeleted(_id);
    }

    // Function to retrieve all fees by CIN
    function getAllFeesByCIN(uint256 _cin) public view returns (Fees[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextFeesId; i++) {
            if (feesMapping[i].cin == _cin) {
                count++;
            }
        }
        Fees[] memory result = new Fees[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextFeesId; i++) {
            if (feesMapping[i].cin == _cin) {
                result[index] = feesMapping[i];
                index++;
            }
        }
        return result;
    }

    // Function to retrieve all scholarships by CIN
    function getAllScholarshipsByCIN(uint256 _cin) public view returns (Scholarship[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextScholarshipId; i++) {
            if (scholarshipMapping[i].cin == _cin) {
                count++;
            }
        }
        Scholarship[] memory result = new Scholarship[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextScholarshipId; i++) {
            if (scholarshipMapping[i].cin == _cin) {
                result[index] = scholarshipMapping[i];
                index++;
            }
        }
        return result;
    }
}
