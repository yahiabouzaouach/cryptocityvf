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
        const contractBytecode = fs.readFileSync("./contract/internet_sol_InternetContract.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000) // Increased gas limit
            .setConstructorParameters(
                new ContractFunctionParameters()
                    .addString("Owner Name")
                    .addString("Operator Name")
            );
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Interact with the contract
        await addBill(contractId, 123456, 5000, "Internet Bill", 1622505600, 1625097600);
        await getBill(contractId, 1);
        await updateBill(contractId, 1, 123456, 5500, "Updated Internet Bill", 1622505600, 1625097600);
        await payBill(contractId, 1);
        await deleteBill(contractId, 1);

        await getInternetOwner(contractId);
        await getOperatorName(contractId);
        await updateInternetDetails(contractId, "New Owner Name", "New Operator Name");
        await deleteInternet(contractId);
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// Internet Contract Functions

async function getInternetOwner(contractId) {
    const getOwnerQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getInternetOwner");
    const queryResult = await getOwnerQuery.execute(client);
    console.log(`Internet Owner: ${queryResult.getString(0)}`);
}

async function getOperatorName(contractId) {
    const getNameQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getOperatorName");
    const queryResult = await getNameQuery.execute(client);
    console.log(`Operator Name: ${queryResult.getString(0)}`);
}

async function updateInternetDetails(contractId, newOwner, newName) {
    const updateDetailsTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateInternetDetails", new ContractFunctionParameters().addString(newOwner).addString(newName));
    const submitTx = await updateDetailsTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Internet details updated: ${receipt.status}`);
}

async function deleteInternet(contractId) {
    const deleteInternetTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteInternet");
    const submitTx = await deleteInternetTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Internet deleted: ${receipt.status}`);
}

async function addBill(contractId, cin, amount, description, beginningDate, endDate) {
    const addBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(200000)
        .setFunction("addBill", new ContractFunctionParameters().addUint256(cin).addUint256(amount).addString(description).addUint256(beginningDate).addUint256(endDate));
    const submitTx = await addBillTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Bill added: ${receipt.status}`);
}

async function getBill(contractId, id) {
    const getBillQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getBill", new ContractFunctionParameters().addUint256(id));
    const queryResult = await getBillQuery.execute(client);
    console.log(`Bill ID: ${queryResult.getUint256(0)}, CIN: ${queryResult.getUint256(1)}, Amount: ${queryResult.getUint256(2)}, Description: ${queryResult.getString(3)}, Beginning Date: ${queryResult.getUint256(4)}, End Date: ${queryResult.getUint256(5)}, Paid: ${queryResult.getBool(6)}`);
}

async function updateBill(contractId, id, cin, amount, description, beginningDate, endDate) {
    const updateBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateBill", new ContractFunctionParameters().addUint256(id).addUint256(cin).addUint256(amount).addString(description).addUint256(beginningDate).addUint256(endDate));
    const submitTx = await updateBillTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Bill updated: ${receipt.status}`);
}

async function payBill(contractId, id) {
    const payBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("payBill", new ContractFunctionParameters().addUint256(id));
    const submitTx = await payBillTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Bill paid: ${receipt.status}`);
}

async function deleteBill(contractId, id) {
    const deleteBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteBill", new ContractFunctionParameters().addUint256(id));
    const submitTx = await deleteBillTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Bill deleted: ${receipt.status}`);
}

main();
