import { ethers } from 'hardhat';

async function main() {
  const tokenSwap = await ethers.deployContract("TokenSwap");

  await tokenSwap.waitForDeployment();

  console.log('TokenSwap Contract Deployed at ' + tokenSwap.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});