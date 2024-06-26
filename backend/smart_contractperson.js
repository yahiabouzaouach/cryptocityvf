console.clear();
require("dotenv").config();
const {
    AccountId,
    PrivateKey,
    Client,
    ContractFunctionParameters,
    ContractCreateFlow,
    ContractExecuteTransaction,
    ContractCallQuery
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// Contract interaction functions
async function registerPerson(contractId, accountId, fullname, cin, password) {
    const params = new ContractFunctionParameters()
        .addString(accountId)
        .addString(fullname)
        .addInt256(cin)
        .addString(password);
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(200000)
        .setFunction("register", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Person registered: ${receipt.status}`);
}

async function modifyPerson(contractId, cin, fullname, accountId) {
    const params = new ContractFunctionParameters()
        .addInt256(cin)
        .addString(fullname)
        .addString(accountId);
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("modifyPerson", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Person modified: ${receipt.status}`);
}

async function updatePassword(contractId, cin, newPassword) {
    const params = new ContractFunctionParameters()
        .addInt256(cin)
        .addString(newPassword);
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updatePassword", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Password updated: ${receipt.status}`);
}

async function getAccountId(contractId, cin) {
    const params = new ContractFunctionParameters().addInt256(cin);
    const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getAccountId", params);
    const result = await query.execute(client);
    return result.getString(0);
}

async function getFullname(contractId, cin) {
    const params = new ContractFunctionParameters().addInt256(cin);
    const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getFullname", params);
    const result = await query.execute(client);
    return result.getString(0);
}

async function canLogin(contractId, cin) {
    const params = new ContractFunctionParameters().addInt256(cin);
    const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("canLogin", params);
    const result = await query.execute(client);
    return result.getBool(0);
}

async function login(contractId, cin, password) {
    const params = new ContractFunctionParameters()
        .addInt256(cin)
        .addString(password);
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("login", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Person logged in: ${receipt.status}`);
}

async function main() {
    try {
        // Import the compiled contract bytecode
        const contractBytecode = fs.readFileSync("./contract/personne_sol_PersonManager.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000)
            .setConstructorParameters(new ContractFunctionParameters());
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Example interactions with the contract
        await registerPerson(contractId, "accountid", "John Doe", 123456789, "password123");
        await modifyPerson(contractId, 123456789, "Jane Doe", "0x137D1E8fC3579BF6D238A3b89642c1844434a763");
        await updatePassword(contractId, 123456789, "newpassword123");

        const accountId = await getAccountId(contractId, 123456789);
        console.log(`Account ID: ${accountId}`);

        const fullname = await getFullname(contractId, 123456789);
        console.log(`Full Name: ${fullname}`);

        const canLoginResult = await canLogin(contractId, 123456789);
        console.log(`Can Login: ${canLoginResult}`);

        await login(contractId, 123456789, "newpassword123");
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// Run the main function
main();
