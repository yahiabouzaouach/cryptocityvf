// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PersonManager {
    struct Person {
        string account_id;
        string fullname;
        int cin;
        string password;
    }

    mapping(int => Person) public persons; 
    mapping(int => bool) public personExists; 

    event PersonRegistered(string account_id, string fullname, int cin);
    event PersonModified(string account_id, string fullname, int cin);
    event PasswordUpdated(int cin);
    event PersonLoggedIn(string account_id);

    function register(string memory _account_id, string memory _fullname, int _cin, string memory _password) public {
        require(!personExists[_cin], "Person already registered");

        persons[_cin] = Person({
            account_id: _account_id,
            fullname: _fullname,
            cin: _cin,
            password: _password
        });
        personExists[_cin] = true;

        emit PersonRegistered(_account_id, _fullname, _cin);
    }

    function modifyPerson(int _cin, string memory _fullname, string memory _account_id) public {
        require(personExists[_cin], "Person does not exist");

        persons[_cin].fullname = _fullname;
        persons[_cin].account_id = _account_id;

        emit PersonModified(_account_id, _fullname, _cin);
    }

    function updatePassword(int _cin, string memory _newPassword) public {
        require(personExists[_cin], "Person does not exist");

        persons[_cin].password = _newPassword;

        emit PasswordUpdated(_cin);
    }

    function getAccountId(int _cin) public view returns (string memory) {
        require(personExists[_cin], "Person does not exist");
        return persons[_cin].account_id;
    }

    function getFullname(int _cin) public view returns (string memory) {
        require(personExists[_cin], "Person does not exist");
        return persons[_cin].fullname;
    }

    function canLogin(int _cin) public view returns (bool) {
        return personExists[_cin];
    }

    function login(int _cin, string memory _password) public {
        require(personExists[_cin], "Person does not exist");
        require(keccak256(abi.encodePacked(persons[_cin].password)) == keccak256(abi.encodePacked(_password)), "Invalid password");

        emit PersonLoggedIn(persons[_cin].account_id);
    }
}
