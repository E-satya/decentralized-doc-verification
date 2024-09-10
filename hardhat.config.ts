/** @type import('hardhat/config').HardhatUserConfig */

import "@nomiclabs/hardhat-ethers";

module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/43babf32ce0346fabbf1c1069418a90b`,
      accounts: [
        "6b777a5e8686dcc1075a9ef05dfbe007020df809d44b5d1f185314c4734f4277",
      ],
      chainId: 11155111,
    },
  },
};
