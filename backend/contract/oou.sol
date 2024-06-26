// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OOUContract {
    // Structure for OOU
    struct OOU {
        string owner;  //  type from address to string
        string ouuregion;
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

    OOU public oou;

    mapping(uint256 => Scholarship) public scholarshipMapping; // Mapping for Scholarship using id as key

    uint256 public nextFeesId;
    uint256 public nextScholarshipId;

    // Events for transfers and updates
    event OOUDetailsUpdated(string ouuregion);
    event OOUDeleted();
    event ScholarshipDetailsUpdated(
        uint256 id,
        uint256 cin,
        uint256 amount,
        uint256 beginningDate,
        uint256 endDate,
        bool paid
    );
    event ScholarshipPaid(uint256 id);
    event ScholarshipDeleted(uint256 id);

    // Constructor for OOU
    constructor(string memory _owner, string memory _ouuregion) {
        oou = OOU({owner: _owner, ouuregion: _ouuregion});
        nextFeesId = 1;
        nextScholarshipId = 1;
    }

    // Function to get the oou owner address
    function getOOUOwner() public view returns (string memory) {
        return oou.owner;
    }

    // Function to get the oou region
    function getOOURegion() public view returns (string memory) {
        return oou.ouuregion;
    }

    // Function to update oou details
    function updateOOURegion(string memory _owner, string memory _ouuregion) public {
        oou.owner = _owner;
        oou.ouuregion = _ouuregion;

        emit OOUDetailsUpdated(_ouuregion);
    }

    // Function to delete oou details
    function deleteOOU() public {
        delete oou;

        emit OOUDeleted();
    }

    // Functions to handle scholarships
    function addScholarship(
        uint256 _cin,
        uint256 _amount,
        uint256 _beginningDate,
        uint256 _endDate
    ) public {
        scholarshipMapping[nextScholarshipId] = Scholarship({
            id: nextScholarshipId,
            cin: _cin,
            amount: _amount,
            beginningDate: _beginningDate,
            endDate: _endDate,
            paid: false
        });

        emit ScholarshipDetailsUpdated(
            nextScholarshipId,
            _cin,
            _amount,
            _beginningDate,
            _endDate,
            false
        );
        nextScholarshipId++;
    }

    function updateScholarshipDetails(
        uint256 _id,
        uint256 _cin,
        uint256 _amount,
        uint256 _beginningDate,
        uint256 _endDate
    ) public {
        require(scholarshipMapping[_id].id != 0, "Scholarship not found");
        require(scholarshipMapping[_id].cin == _cin, "CIN does not match");

        scholarshipMapping[_id].amount = _amount;
        scholarshipMapping[_id].beginningDate = _beginningDate;
        scholarshipMapping[_id].endDate = _endDate;

        emit ScholarshipDetailsUpdated(
            _id,
            _cin,
            _amount,
            _beginningDate,
            _endDate,
            scholarshipMapping[_id].paid
        );
    }

    function getScholarshipDetails(
        uint256 _id,
        uint256 _cin
    ) public view returns (uint256, uint256, uint256, uint256, uint256, bool) {
        Scholarship memory scholarship = scholarshipMapping[_id];
        require(scholarship.id != 0, "Scholarship not found");
        require(scholarship.cin == _cin, "CIN does not match");
        return (
            scholarship.id,
            scholarship.cin,
            scholarship.amount,
            scholarship.beginningDate,
            scholarship.endDate,
            scholarship.paid
        );
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

    // Function to retrieve all scholarships by CIN
    function getAllScholarshipsByCIN(
        uint256 _cin
    ) public view returns (Scholarship[] memory) {
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
