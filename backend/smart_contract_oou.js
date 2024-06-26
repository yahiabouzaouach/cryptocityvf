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
        const contractBytecode = fs.readFileSync("./contract/oou_sol_OOUContract.bin");

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
        await addScholarship(contractId, 123456, 2000, 1622505600, 1625097600);
        await getScholarshipDetails(contractId, 1, 123456);
        await payScholarship(contractId, 1, 123456);
        await updateScholarshipDetails(contractId, 1, 123456, 2500, 1622505600, 1625097600);
        await deleteScholarship(contractId, 1, 123456);

        await getAllScholarshipsByCIN(contractId, 123456);
        await getOOUOwner(contractId);
        await getOOURegion(contractId);
        await updateOOURegion(contractId, "0x137D1E8fC3579BF6D238A3b89642c1844434a763", "New Region Name");
        await deleteOOU(contractId);
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// OOU Functions
async function getOOUOwner(contractId) {
    const getOwnerQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getOOUOwner");
    const queryResult = await getOwnerQuery.execute(client);
    console.log(`OOU Owner: ${queryResult.getString(0)}`); // Assuming owner is returned as string
}

async function getOOURegion(contractId) {
    const getRegionQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getOOURegion");
    const queryResult = await getRegionQuery.execute(client);
    console.log(`OOU Region: ${queryResult.getString(0)}`);
}

async function updateOOURegion(contractId, newOwner, newRegion) {
    const updateRegionTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateOOURegion", new ContractFunctionParameters().addString(newOwner).addString(newRegion));
    const submitTx = await updateRegionTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`OOU details updated: ${receipt.status}`);
}

async function deleteOOU(contractId) {
    const deleteOOUTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteOOU");
    const submitTx = await deleteOOUTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`OOU deleted: ${receipt.status}`);
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
