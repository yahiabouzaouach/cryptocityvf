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
        const contractBytecode = fs.readFileSync("./contract/cnam_sol_CnamContract.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000) // Increased gas limit
            .setConstructorParameters(
                new ContractFunctionParameters()
                    .addString("OwnerName") // Replace with actual owner name string
                    .addString("CnamName") // Replace with actual Cnam name string
            );
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Interact with the contract
        await addPaper(contractId, 1, "John Doe", "Paper description", 100, 1624550400);
        await getPaper(contractId, 1);
        await updatePaper(contractId, 1, "Jane Smith", "Updated paper description", 150, 1624550400);
        await payPaper(contractId, 1);
        await deletePaper(contractId, 1);

        await getCnamOwner(contractId);
        await getCnamName(contractId);
        await updateCnamDetails(contractId, "New Owner Name", "Updated Cnam Name");
        await deleteCnam(contractId);
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// Cnam Functions
async function getCnamOwner(contractId) {
    const getOwnerQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getCnamOwner");
    const queryResult = await getOwnerQuery.execute(client);
    console.log(`Cnam Owner: ${queryResult.getString(0)}`);
}

async function getCnamName(contractId) {
    const getNameQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getCnamName");
    const queryResult = await getNameQuery.execute(client);
    console.log(`Cnam Name: ${queryResult.getString(0)}`);
}

async function updateCnamDetails(contractId, newOwner, newName) {
    const updateDetailsTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateCnamDetails", new ContractFunctionParameters().addString(newOwner).addString(newName));
    const submitTx = await updateDetailsTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Cnam details updated: ${receipt.status}`);
}

async function deleteCnam(contractId) {
    const deleteCnamTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteCnam");
    const submitTx = await deleteCnamTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Cnam deleted: ${receipt.status}`);
}

async function addPaper(contractId, idclaim, personName, description, montant, dateRecep) {
    const addPaperTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(250000)
        .setFunction("addPaper", new ContractFunctionParameters()
            .addUint256(idclaim)
            .addString(personName)
            .addString(description)
            .addUint256(montant)
            .addUint256(dateRecep)
        );
    const submitTx = await addPaperTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Paper added: ${receipt.status}`);
}

async function getPaper(contractId, idclaim) {
    const getPaperQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getPaper", new ContractFunctionParameters().addUint256(idclaim));
    const queryResult = await getPaperQuery.execute(client);
    console.log(`Paper details: ${JSON.stringify(queryResult)}`);
}

async function updatePaper(contractId, idclaim, personName, description, montant, dateRecep) {
    const updatePaperTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updatePaper", new ContractFunctionParameters()
            .addUint256(idclaim)
            .addString(personName)
            .addString(description)
            .addUint256(montant)
            .addUint256(dateRecep)
        );
    const submitTx = await updatePaperTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Paper updated: ${receipt.status}`);
}

async function payPaper(contractId, idclaim) {
    const payPaperTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("payPaper", new ContractFunctionParameters().addUint256(idclaim));
    const submitTx = await payPaperTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Paper paid: ${receipt.status}`);
}

async function deletePaper(contractId, idclaim) {
    const deletePaperTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deletePaper", new ContractFunctionParameters().addUint256(idclaim));
    const submitTx = await deletePaperTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Paper deleted: ${receipt.status}`);
}

main();
