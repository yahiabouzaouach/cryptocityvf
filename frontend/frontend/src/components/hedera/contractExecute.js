import {
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractId,
    AccountId,
    TransactionId,
  } from "@hashgraph/sdk";
  
  // Function to create a proposal in the LightencyDAO contract
  export const registerPerson = async (
    bladeConnector,
    contractId, 
    accountId,
     fullname, 
     cin, 
     password
  ) => {
    if (!bladeConnector) {
      throw new Error("Blade connector is not initialized.");
    }
  
    try {
      const bladeSigner = await bladeConnector.getSigner();
      console.log("blade signer", bladeSigner);
      const params = new ContractFunctionParameters()
          .addString(accountId)
          .addString(fullname)
          .addInt256(cin)
          .addString(password);
      const tx = new ContractExecuteTransaction()
          .setContractId(contractId)
          .setGas(200000)
          .setFunction("register", params);
  
      const signedTransaction = await bladeSigner.signTransaction(
       tx
      );
  
      // call executes the transaction
      const result = await bladeSigner.call(signedTransaction);
  
      // Request the receipt of the transaction
      const receipt = await result.getReceiptWithSigner(bladeSigner);
  
      console.log(`Person registered: ${receipt.status}`);
      return receipt;
    } catch (error) {
      console.error("Error executing smart contract function:", error);
      throw error;
    }
  };
  
  // Function to vote on a proposal in the LightencyDAO Contract
  export const login = async (
    bladeConnector,
    contractId, cin, password
  ) => {
    if (!bladeConnector) {
      throw new Error("Blade connector is not initialized.");
    }
  
    try {
      const bladeSigner = await bladeConnector.getSigner();
      console.log("blade signer", bladeSigner);
  
      const params = new ContractFunctionParameters()
      .addInt256(cin)
      .addString(password);
  const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(150000)
      .setFunction("login", params);
      const signedTransaction = await bladeSigner.signTransaction(
        tx
      );
  
      // call executes the transaction
      const result = await bladeSigner.call(signedTransaction);
  
      // Request the receipt of the transaction
      const receipt = await result.getReceiptWithSigner(bladeSigner);
  
      console.log(`Person logged in: ${receipt.status}`);
      return receipt;
    } catch (error) {
      console.error("Error executing smart contract function:", error);
      throw error;
    }
  };
  
  // Function to execute proposal
  export const updatePassword = async (
    bladeConnector,
    contractId, cin, newPassword
  ) => {
    if (!bladeConnector) {
      throw new Error("Blade connector is not initialized.");
    }
  
    try {
      const bladeSigner = await bladeConnector.getSigner();
      console.log("blade signer", bladeSigner);
      const params = new ContractFunctionParameters()
          .addInt256(cin)
          .addString(newPassword);
      const tx = new ContractExecuteTransaction()
          .setContractId(contractId)
          .setGas(150000)
          .setFunction("updatePassword", params);
      
      const signedTransaction = await bladeSigner.signTransaction(
        tx
      );
  
      // call executes the transaction
      const result = await bladeSigner.call(signedTransaction);
  
      // Request the receipt of the transaction
      const receipt = await result.getReceiptWithSigner(bladeSigner);
  
      console.log(`Password updated: ${receipt.status}`);
      return receipt;
    } catch (error) {
      console.error("Error executing smart contract function:", error);
      throw error;
    }
  };
  
  