import { BladeConnector, ConnectorStrategy } from "@bladelabs/blade-web3.js";

export const bladeConnector = await BladeConnector.init(
  ConnectorStrategy.WALLET_CONNECT, 
  {
    name: "Lightency and Dar Blockchain Community DAO",
    description: "streamline urban living through the integration of cutting-edge web3 technologies",
  }
);