import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const { BASE_TESTNET_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    'base-sepolia': {
      url: "https://base-sepolia.infura.io/v3/f7f8ec54d0cd4d82b7c2b3ecbdeb734a",
      accounts: [PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
     "base-sepolia": "484J4V72DZ5ZKJI9BYGYYA1RABZBBGFSPW"
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api.etherscan.io/v2/api?chainid=84532",
         browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  },
};

export default config;
