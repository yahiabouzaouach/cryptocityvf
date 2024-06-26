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
        const contractBytecode = fs.readFileSync("./contract/delievrey_sol_DelieveryContract.bin");

        // Instantiate the smart contract
        const contractInstantiateTx = new ContractCreateFlow()
            .setBytecode(contractBytecode)
            .setGas(1500000) // Adjusted gas limit as needed
            .setConstructorParameters(
                new ContractFunctionParameters()
                    .addString("0x137D1E8fC3579BF6D238A3b89642c1844434a763")
                    .addString("Delivery Company Name")
            );
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`- The smart contract ID is: ${contractId} \n`);
        console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

        // Example interactions with the contract
        await addFees(contractId, "John Doe", 1234567890, [1, 2]);
        await getFees(contractId, 1);
        await updateFees(contractId, 1, "Jane Doe", 987654321, [1, 3]);
        await payFees(contractId, 1);
        await deleteFees(contractId, 1);

        await addProduct(contractId, "Product A", 10, 100, "123 Street");
        await getProduct(contractId, 1);
        await updateProduct(contractId, 1, "Product B", 20, 200, "456 Avenue");
        await deleteProduct(contractId, 1);

        await addRating(contractId, 5, "Excellent service");
        await getRating(contractId, 1);
        await updateRating(contractId, 1, 4, "Good service");
        await deleteRating(contractId, 1);

        await getCompanyOwner(contractId);
        await getCompanyName(contractId);
        await updateCompanyDetails(contractId, "0x137D1E8fC3579BF6D238A3b89642c1844434a763", "New Delivery Company Name");
        await deleteCompany(contractId);
    } catch (error) {
        console.error("Error instantiating or interacting with the contract:", error);
    }
}

// Company Functions
async function getCompanyOwner(contractId) {
    const query = new ContractCallQuery().setContractId(contractId).setGas(100000).setFunction("getCompanyOwner");
    const result = await query.execute(client);
    console.log(`Company Owner: ${result.getString(0)}`);
}

async function getCompanyName(contractId) {
    const query = new ContractCallQuery().setContractId(contractId).setGas(100000).setFunction("getCompanyName");
    const result = await query.execute(client);
    console.log(`Company Name: ${result.getString(0)}`);
}

async function updateCompanyDetails(contractId, newOwner, newName) {
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateCompanyDetails", new ContractFunctionParameters().addString(newOwner).addString(newName));
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Company details updated: ${receipt.status}`);
}

async function deleteCompany(contractId) {
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(100000).setFunction("deleteCompany");
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Company deleted: ${receipt.status}`);
}

// Fees Functions
async function addFees(contractId, fullName, numTlf, productIds) {
    const params = new ContractFunctionParameters()
        .addString(fullName)
        .addUint256(numTlf)
        .addUint256Array(productIds);
    
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(250000)
        .setFunction("addFees", params);
    
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Fees added: ${receipt.status}`);
}

async function getFees(contractId, feeId) {
    const query = new ContractCallQuery().setContractId(contractId).setGas(100000).setFunction("getFees", new ContractFunctionParameters().addUint256(feeId));
    const result = await query.execute(client);
    console.log(`Fees: Full Name: ${result.getString(0)}, Phone Number: ${result.getUint256(1)}, Product IDs: ${result.getUint256(2)}`);
}

async function updateFees(contractId, feeId, newFullName, newNumTlf, newProductIds) {
    const params = new ContractFunctionParameters().addUint256(feeId).addString(newFullName).addUint256(newNumTlf).addUint256Array(newProductIds);
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(150000).setFunction("updateFees", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Fees updated: ${receipt.status}`);
}

async function payFees(contractId, feeId) {
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(100000).setFunction("payFees", new ContractFunctionParameters().addUint256(feeId));
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Fees paid: ${receipt.status}`);
}

async function deleteFees(contractId, feeId) {
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(100000).setFunction("deleteFees", new ContractFunctionParameters().addUint256(feeId));
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Fees deleted: ${receipt.status}`);
}

// Product Functions
async function addProduct(contractId, name, quantity, price, location) {
    const params = new ContractFunctionParameters().addString(name).addUint256(quantity).addUint256(price).addString(location);
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(150000).setFunction("addProduct", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Product added: ${receipt.status}`);
}

async function getProduct(contractId, productId) {
    const query = new ContractCallQuery().setContractId(contractId).setGas(100000).setFunction("getProduct", new ContractFunctionParameters().addUint256(productId));
    const result = await query.execute(client);
    console.log(`Product: Name: ${result.getString(0)}, Quantity: ${result.getUint256(1)}, Price: ${result.getUint256(2)}, Location: ${result.getString(3)}`);
}

async function updateProduct(contractId, productId, newName, newQuantity, newPrice, newLocation) {
    const params = new ContractFunctionParameters().addUint256(productId).addString(newName).addUint256(newQuantity).addUint256(newPrice).addString(newLocation);
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(150000).setFunction("updateProduct", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Product updated: ${receipt.status}`);
}

async function deleteProduct(contractId, productId) {
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(100000).setFunction("deleteProduct", new ContractFunctionParameters().addUint256(productId));
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Product deleted: ${receipt.status}`);
}

// Rating Functions
async function addRating(contractId, stars, comment) {
    const params = new ContractFunctionParameters().addUint256(stars).addString(comment);
    const tx = new ContractExecuteTransaction().setContractId(contractId).setGas(150000).setFunction("addRating", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Rating added: ${receipt.status}`);
}

async function getRating(contractId, ratingId) {
    const query = new ContractCallQuery().setContractId(contractId).setGas(100000).setFunction("getRating", new ContractFunctionParameters().addUint256(ratingId));
    const result = await query.execute(client);
    console.log(`Rating: Stars: ${result.getUint256(0)}, Comment: ${result.getString(1)}`);
}

async function updateRating(contractId, ratingId, newStars, newComment) {
    const params = new ContractFunctionParameters()
        .addUint256(ratingId)
        .addUint256(newStars)
        .addString(newComment);
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("updateRating", params);
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Rating updated: ${receipt.status}`);
}

async function deleteRating(contractId, ratingId) {
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("deleteRating", new ContractFunctionParameters().addUint256(ratingId));
    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    console.log(`Rating deleted: ${receipt.status}`);
}

// Initialize and run the main function
main();