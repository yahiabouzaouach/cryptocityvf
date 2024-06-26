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
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
    try {
        // Import the compiled contract bytecode
        const contractBytecode = fs.readFileSync("./contract/hopital_sol_HopitalContract.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000) // Increased gas limit
            .setConstructorParameters(
                new ContractFunctionParameters()
                    .addString("OwnerName") // Replace with actual owner name string
                    .addString("HopitalName") // Replace with actual Hopital name string
            );
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Interact with the contract
        await addBill(contractId, "John Doe", "Bill description", 100, 1624550400);
        await getBill(contractId, 1);
        await updateBill(contractId, 1, "Jane Smith", "Updated bill description", 150, 1624550400);
        await payBill(contractId, 1);
        await deleteBill(contractId, 1);

        await getHopitalOwner(contractId);
        await getHopitalName(contractId);
        await updateHopitalDetails(contractId, "New Owner Name", "Updated Hopital Name");
        await deleteHopital(contractId);
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// Hopital Functions
async function getHopitalOwner(contractId) {
    const getOwnerQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getHopitalOwner");
    const queryResult = await getOwnerQuery.execute(client);
    console.log(`Hopital Owner: ${queryResult.getString(0)}`);
}

async function getHopitalName(contractId) {
    const getNameQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getHopitalName");
    const queryResult = await getNameQuery.execute(client);
    console.log(`Hopital Name: ${queryResult.getString(0)}`);
}

async function updateHopitalDetails(contractId, newOwner, newName) {
    const updateDetailsTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateHopitalDetails", new ContractFunctionParameters().addString(newOwner).addString(newName));
    const submitTx = await updateDetailsTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Hopital details updated: ${receipt.status}`);
}

async function deleteHopital(contractId) {
    const deleteHopitalTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteHopital");
    const submitTx = await deleteHopitalTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Hopital deleted: ${receipt.status}`);
}

// Bill Functions
async function addBill(contractId, nomPatient, description, montant, dateRecep) {
    const addBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(250000)
        .setFunction("addBill", new ContractFunctionParameters()
            .addString(nomPatient)
            .addString(description)
            .addUint256(montant)
            .addUint256(dateRecep)
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

async function updateBill(contractId, id, nomPatient, description, montant, dateRecep) {
    const updateBillTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(200000)
        .setFunction("updateBill", new ContractFunctionParameters()
            .addUint256(id)
            .addString(nomPatient)
            .addString(description)
            .addUint256(montant)
            .addUint256(dateRecep)
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

main();
