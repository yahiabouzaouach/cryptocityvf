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

async function main() {
    try {
        // Import the compiled contract bytecode
        const contractBytecode = fs.readFileSync("./contract/university_sol_UniversityContract.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000) // Increased gas limit
            .setConstructorParameters(
                new ContractFunctionParameters()
                    .addString("0x137D1E8fC3579BF6D238A3b89642c1844434a763") // Assuming this is the new owner as string
                    .addString("Sample Region")
            );
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Interact with the contract
        await addFees(contractId, 123456, 1000, 1622520000, 1625121600);
        await payFees(contractId, 1, 123456);
        await updateUniversityDetails(contractId, "0x137D1E8fC3579BF6D238A3b89642c1844434a763", "New University Name");

        await addScholarship(contractId, 123456, 2000, 1622520000, 1625121600);
        await getScholarshipDetails(contractId, 1, 123456);
        await payScholarship(contractId, 1, 123456);
        await updateScholarshipDetails(contractId, 1, 123456, 2500, 1622520000, 1625121600);
        await deleteScholarship(contractId, 1, 123456);

        await getAllFeesByCIN(contractId, 123456);
        await getAllScholarshipsByCIN(contractId, 123456);

        await getUniversityOwner(contractId);
        await getUniversityName(contractId);
        await deleteUniversity(contractId);


    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// University Functions
async function getUniversityOwner(contractId) {
    const getOwnerQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getUniversityOwner");
    const queryResult = await getOwnerQuery.execute(client);
    console.log(`University Owner: ${queryResult.getString(0)}`); // Assuming owner is returned as string
}

async function getUniversityName(contractId) {
    const getNameQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getUniversityName");
    const queryResult = await getNameQuery.execute(client);
    console.log(`University Name: ${queryResult.getString(0)}`);
}

async function updateUniversityDetails(contractId, owner, uniName) {
    const updateDetailsTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateUniversityDetails", new ContractFunctionParameters().addString(owner).addString(uniName));
    const submitTx = await updateDetailsTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`University details updated: ${receipt.status}`);
}

async function deleteUniversity(contractId) {
    const deleteUniversityTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteUniversity");
    const submitTx = await deleteUniversityTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`University deleted: ${receipt.status}`);
}

// Fees Functions
async function addFees(contractId, cin, amount, beginningDate, endDate) {
    const addFeesTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("addFees", new ContractFunctionParameters().addUint256(cin).addUint256(amount).addUint256(beginningDate).addUint256(endDate));
    const submitTx = await addFeesTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Fees added: ${receipt.status}`);
}

async function payFees(contractId, id, cin) {
    const payFeesTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("payFees", new ContractFunctionParameters().addUint256(id).addUint256(cin));
    const submitTx = await payFeesTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Fees paid: ${receipt.status}`);
}

async function getAllFeesByCIN(contractId, cin) {
    const getAllFeesQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getAllFeesByCIN", new ContractFunctionParameters().addUint256(cin));
    const queryResult = await getAllFeesQuery.execute(client);
    console.log(`All Fees by CIN: ${JSON.stringify(queryResult)}`);
}

// Scholarship Functions
async function addScholarship(contractId, cin, amount, beginningDate, endDate) {
    const addScholarshipTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("addScholarship", new ContractFunctionParameters().addUint256(cin).addUint256(amount).addUint256(beginningDate).addUint256(endDate));
    const submitTx = await addScholarshipTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Scholarship added: ${receipt.status}`);
}

async function getScholarshipDetails(contractId, id, cin) {
    const getScholarshipQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getScholarshipDetails", new ContractFunctionParameters().addUint256(id).addUint256(cin));
    const queryResult = await getScholarshipQuery.execute(client);
    console.log(`Scholarship: ${queryResult.getUint256(0)}, CIN: ${queryResult.getUint256(1)}, Amount: ${queryResult.getUint256(2)}, Beginning Date: ${queryResult.getUint256(3)}, End Date: ${queryResult.getUint256(4)}, Paid: ${queryResult.getBool(5)}`);
}

async function payScholarship(contractId, id, cin) {
    const payScholarshipTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("payScholarship", new ContractFunctionParameters().addUint256(id).addUint256(cin));
    const submitTx = await payScholarshipTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Scholarship paid: ${receipt.status}`);
}

async function updateScholarshipDetails(contractId, id, cin, amount, beginningDate, endDate) {
    const updateScholarshipTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateScholarshipDetails", new ContractFunctionParameters().addUint256(id).addUint256(cin).addUint256(amount).addUint256(beginningDate).addUint256(endDate));
    const submitTx = await updateScholarshipTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Scholarship updated: ${receipt.status}`);
}

async function deleteScholarship(contractId, id, cin) {
    const deleteScholarshipTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteScholarship", new ContractFunctionParameters().addUint256(id).addUint256(cin));
    const submitTx = await deleteScholarshipTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Scholarship deleted: ${receipt.status}`);
}

async function getAllScholarshipsByCIN(contractId, cin) {
    const getAllScholarshipsQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getAllScholarshipsByCIN", new ContractFunctionParameters().addUint256(cin));
    const queryResult = await getAllScholarshipsQuery.execute(client);
    console.log(`All Scholarships by CIN: ${JSON.stringify(queryResult)}`);
}

main();
