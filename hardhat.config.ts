/** @type import('hardhat/config').HardhatUserConfig */

import "@nomiclabs/hardhat-ethers";

import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: `${process.env.NETWORK_URL}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
      chainId: 11155111,
    },
  },
};
