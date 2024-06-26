// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CnamContract {
    // Structure for Cnam
    struct Cnam {
        string owner;
        string name;
    }

    // Structure for Paper
    struct Paper {
        uint256 idclaim;
        string personName;
        string description;
        uint256 montant;
        uint256 dateRecep;
        bool paid;
    }

    Cnam public cnam;
    mapping(uint256 => Paper) public papersMapping;

    // Events for transfers and updates
    event CnamDetailsUpdated(string name);
    event CnamDeleted();
    event PaperAdded(uint256 idclaim, string personName, string description, uint256 montant, uint256 dateRecep, bool paid);
    event PaperUpdated(uint256 idclaim, string personName, string description, uint256 montant, uint256 dateRecep, bool paid);
    event PaperPaid(uint256 idclaim);
    event PaperDeleted(uint256 idclaim);

    // Constructor for Cnam
    constructor(string memory _owner, string memory _name) {
        cnam = Cnam({
            owner: _owner,
            name: _name
        });
    }

    // Function to get the Cnam owner
    function getCnamOwner() public view returns (string memory) {
        return cnam.owner;
    }

    // Function to get the Cnam name
    function getCnamName() public view returns (string memory) {
        return cnam.name;
    }

    // Function to update Cnam details
    function updateCnamDetails(string memory _owner, string memory _name) public {
        cnam.owner = _owner;
        cnam.name = _name;

        emit CnamDetailsUpdated(_name);
    }

    // Function to delete Cnam details
    function deleteCnam() public {
        delete cnam;

        emit CnamDeleted();
    }

    // Function to add a paper
    function addPaper(uint256 _idclaim, string memory _personName, string memory _description, uint256 _montant, uint256 _dateRecep) public {
        require(papersMapping[_idclaim].idclaim == 0, "Paper ID already exists");

        papersMapping[_idclaim] = Paper({
            idclaim: _idclaim,
            personName: _personName,
            description: _description,
            montant: _montant,
            dateRecep: _dateRecep,
            paid: false
        });

        emit PaperAdded(_idclaim, _personName, _description, _montant, _dateRecep, false);
    }

    // Function to update a paper
    function updatePaper(uint256 _idclaim, string memory _personName, string memory _description, uint256 _montant, uint256 _dateRecep) public {
        require(papersMapping[_idclaim].idclaim != 0, "Paper not found");

        papersMapping[_idclaim].personName = _personName;
        papersMapping[_idclaim].description = _description;
        papersMapping[_idclaim].montant = _montant;
        papersMapping[_idclaim].dateRecep = _dateRecep;

        emit PaperUpdated(_idclaim, _personName, _description, _montant, _dateRecep, papersMapping[_idclaim].paid);
    }

    // Function to get a paper
    function getPaper(uint256 _idclaim) public view returns (uint256, string memory, string memory, uint256, uint256, bool) {
        Paper memory paper = papersMapping[_idclaim];
        require(paper.idclaim != 0, "Paper not found");
        return (paper.idclaim, paper.personName, paper.description, paper.montant, paper.dateRecep, paper.paid);
    }

    // Function to mark a paper as paid
    function payPaper(uint256 _idclaim) public {
        require(papersMapping[_idclaim].idclaim != 0, "Paper not found");
        require(!papersMapping[_idclaim].paid, "Paper already paid");

        papersMapping[_idclaim].paid = true;

        emit PaperPaid(_idclaim);
    }

    // Function to delete a paper
    function deletePaper(uint256 _idclaim) public {
        require(papersMapping[_idclaim].idclaim != 0, "Paper not found");

        delete papersMapping[_idclaim];

        emit PaperDeleted(_idclaim);
    }
}
