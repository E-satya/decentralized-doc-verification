//import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const DocumentVerification = await ethers.getContractFactory(
    "DocumentVerification"
  );
  console.log("Deploying contract...");
  const documentVerification = await DocumentVerification.deploy();
  await documentVerification.deployed();
  console.log(
    "DocumentVerification deployed to:",
    documentVerification.address
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
