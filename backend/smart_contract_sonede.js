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
        const contractBytecode = fs.readFileSync("./contract/sonede_sol_SONEDEContract.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000) // Increased gas limit
            .setConstructorParameters(
                new ContractFunctionParameters()
                    .addString("0x137D1E8fC3579BF6D238A3b89642c1844434a763")
                    .addString("SONEDE")
            );
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Interact with the contract
        await addBill(contractId, 100, 200, 3, 20, 1000, "Electricity bill", "123 Main St", 1622505600, 1625097600);
        await getBill(contractId, 1);
        await updateBill(contractId, 1, 150, 250, 3, 20, 1100, "Updated bill", "456 Elm St", 1622505600, 1625097600);
        await payBill(contractId, 1);
        await deleteBill(contractId, 1);

        await getAllBills(contractId);
        await getSONEDEOwner(contractId);
        await getSONEDEName(contractId);
        await updateSONEDEDetails(contractId, "0x137D1E8fC3579BF6D238A3b89642c1844434a763", "Updated SONEDE Name");
        await deleteSONEDE(contractId);
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// SONEDE Functions
async function getSONEDEOwner(contractId) {
    const getOwnerQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getSONEDEOwner");
    const queryResult = await getOwnerQuery.execute(client);
    console.log(`SONEDE Owner: ${queryResult.getString(0)}`);
}

async function getSONEDEName(contractId) {
    const getNameQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getSONEDEName");
    const queryResult = await getNameQuery.execute(client);
    console.log(`SONEDE Name: ${queryResult.getString(0)}`);
}

async function updateSONEDEDetails(contractId, newOwner, newName) {
    const updateDetailsTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateSONEDEDetails", new ContractFunctionParameters().addString(newOwner).addString(newName));
    const submitTx = await updateDetailsTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`SONEDE details updated: ${receipt.status}`);
}

async function deleteSONEDE(contractId) {
    const deleteSONEDETx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteSONEDE");
    const submitTx = await deleteSONEDETx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`SONEDE deleted: ${receipt.status}`);
}

async function addBill(contractId, ancienindex, nouveauindex, nmbremonths, tva, montant, description, adresse, beginningDate, endDate) {
    const addBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(250000)
        .setFunction("addBill", new ContractFunctionParameters()
            .addUint256(ancienindex)
            .addUint256(nouveauindex)
            .addUint256(nmbremonths)
            .addUint256(tva)
            .addUint256(montant)
            .addString(description)
            .addString(adresse)
            .addUint256(beginningDate)
            .addUint256(endDate)
        );
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
    console.log(`Bill details: ${JSON.stringify(queryResult)}`);
}

async function updateBill(contractId, id, ancienindex, nouveauindex, nmbremonths, tva, montant, description, adresse, beginningDate, endDate) {
    const updateBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateBill", new ContractFunctionParameters()
            .addUint256(id)
            .addUint256(ancienindex)
            .addUint256(nouveauindex)
            .addUint256(nmbremonths)
            .addUint256(tva)
            .addUint256(montant)
            .addString(description)
            .addString(adresse)
            .addUint256(beginningDate)
            .addUint256(endDate)
        );
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

async function getAllBills(contractId) {
    const getAllBillsQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getAllBills");
    const queryResult = await getAllBillsQuery.execute(client);
    console.log(`All Bills: ${JSON.stringify(queryResult)}`);
}

main();
