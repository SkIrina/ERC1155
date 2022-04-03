import { ethers } from "hardhat";

async function main() {

  const Universe = await ethers.getContractFactory("Universe");
  const universe = await Universe.deploy();

  await universe.deployed();

  console.log("Universe deployed to:", universe.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
