import { BytesLike } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0x52d06346B73e88C610AF1edce1AFb02541D3DA87";

task("mint", "Mints from the contract")
.addParam("address", "The address to receive a token")
.addParam("id", "Token id")
.addParam("amount", "The amount of tokens to mint")
.addParam("data", "Optional data")
.setAction(async function ({ address, id, amount, data }, { ethers }) {
    const universe = await ethers.getContractAt("Universe", contractAddress);
    const transactionResponse = await universe.mint(address, id, amount, data);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-token-uri", "Sets the base token URI for the deployed smart contract")
.addParam("baseUrl", "The base of the tokenURI endpoint to set")
.setAction(async function (taskArguments, { ethers }) {
    const contract = await ethers.getContractAt("Universe", contractAddress);
    const transactionResponse = await contract.setURI(taskArguments.baseUrl, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("token-uri", "Fetches the token metadata for the given token ID")
.addParam("tokenId", "The tokenID to fetch metadata for")
.setAction(async function (taskArguments, { ethers }) {
    const contract = await ethers.getContractAt("Universe", contractAddress);
    const response = await contract.uri(taskArguments.tokenId, {
        gasLimit: 500_000,
    });
    
    const metadata_url = response.replace('{id}', taskArguments.tokenId);
    console.log(`Metadata URL: ${metadata_url}`);

});