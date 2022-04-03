import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Universe, Universe__factory } from "../typechain";
import { BigNumber } from "ethers";

describe("My awesome ERC1155 contract", function () {
  let Universe: Universe__factory;
  let universe: Universe;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const baseURI = "https://bafybeieak75ybqmlyqdm766s3kb24vfffegva2uify346jeyno6s2fnrgm.ipfs.dweb.link/metadata/";


  beforeEach(async function () {
    Universe = await ethers.getContractFactory("Universe");
    universe = await Universe.deploy();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  describe("constructor, balanceOf", function () {
    it("Should set correct amount of tokens for owner on construction", async function () {
      const balance0 = await universe.balanceOf(owner.address, 0);
      expect(balance0).to.equal(BigNumber.from("1000000000000000000"));
      const balance2 = await universe.balanceOf(owner.address, 2);
      expect(balance2).to.equal(1);
      const balance3 = await universe.balanceOf(owner.address, 3);
      expect(balance3).to.equal(1);
    });
  });

  describe("tokenURI", function () {
    it("Should correctly get tokenURI", async function () {
      const uri = await universe.uri(1);
      expect(uri).to.equal(baseURI + "{id}");
      const uri2 = await universe.uri(2);
      expect(uri2).to.equal(baseURI + "{id}");
    });
  });

  describe("setApprovalForAll, isApprovedForAll", function () {
    it("Should let owner of the token set approval for all tokens for some address ", async function () {
      await universe.connect(addr2).setApprovalForAll(addr1.address, true);
      const isApprovedForAll = await universe.isApprovedForAll(addr2.address, addr1.address);
      expect(isApprovedForAll).to.equal(true);
    });

    it("Should let owner of the token remove approval for all tokens for some address ", async function () {
      await universe.connect(addr2).setApprovalForAll(addr1.address, false);
      const isApprovedForAll = await universe.isApprovedForAll(addr2.address, addr1.address);
      expect(isApprovedForAll).to.equal(false);
    });

    it("Should not let operator be the caller", async function () {
      await expect(universe.setApprovalForAll(owner.address, true)).to.be.reverted;
    });

    it("Should emit ApprovalForAll event", async function () {
      const approveAll = await universe.connect(addr2).setApprovalForAll(addr1.address, true);
      expect(approveAll).to.emit(universe, "ApprovalForAll")
      .withArgs(addr2.address, addr1.address, true);
    });
  });

  describe("safeTransferFrom", function () {
    it("Should let owner of the token transfer it to another address", async function () {
      const transfer = await universe.safeTransferFrom(owner.address, addr1.address, 1, 10, []);
      expect(transfer).to.changeEtherBalance(owner, 10);
    });

    it("Should let non-owner of the token transfer token if it was approvedAll", async function () {
      await universe.setApprovalForAll(addr1.address, true);
      const event = await universe.connect(addr1).safeTransferFrom(owner.address, addr1.address, 1, 10, []);
      expect(event).to.changeEtherBalance(owner, 10);
    });

    it("Should not let TO be zero address", async function () {
      await expect(universe.safeTransferFrom(owner.address, "0x0", 1, 10, [])).to.be.reverted;
    });

    it("Should not let transfer token which sender doesn't own", async function () {
      await universe.setApprovalForAll(addr1.address, true);
      await universe.connect(addr1).safeTransferFrom(owner.address, addr1.address, 2, 1, []);
      await expect(universe.safeTransferFrom(owner.address, addr2.address, 2, 1, [])).to.be.reverted;
    });

    it("Should not let transfer token more than sender owns", async function () {
      await expect(universe.safeTransferFrom(owner.address, addr2.address, 2, 2, [])).to.be.reverted;
    });

    it("Should emit TransferSingle event", async function () {
      await universe.setApprovalForAll(addr1.address, true);
      const event = await universe.connect(addr1).safeTransferFrom(owner.address, addr1.address, 1, 10, []);
      expect(event).to.emit(universe, "TransferSingle")
        .withArgs(addr1.address, owner.address, addr1.address, 1, 10);
    });
  });

  describe("safeBatchTransferFrom", function () {
    it("Should let owner of the token transfer it to another address", async function () {
      const transfer = await universe.safeBatchTransferFrom(owner.address, addr1.address, [1, 2], [10, 1], []);
      expect(transfer).to.changeEtherBalance(owner, 10);
    });

    it("Should let non-owner of the token transfer token if it was approvedAll", async function () {
      await universe.setApprovalForAll(addr1.address, true);
      const event = await universe.connect(addr1).safeBatchTransferFrom(owner.address, addr1.address, [1, 2], [10, 1], []);
      expect(event).to.changeEtherBalance(owner, 11);
    });

    it("Should not let TO be zero address", async function () {
      await expect(universe.safeBatchTransferFrom(owner.address, "0x0", [1, 2], [10, 1], [])).to.be.reverted;
    });

    it("Should not let transfer token which sender doesn't own", async function () {
      await universe.setApprovalForAll(addr1.address, true);
      await universe.connect(addr1).safeTransferFrom(owner.address, addr1.address, 2, 1, []);
      await expect(universe.safeBatchTransferFrom(owner.address, addr1.address, [1, 2], [10, 1], [])).to.be.reverted;
    });

    it("Should not let transfer token more than sender owns", async function () {
      await expect(universe.safeBatchTransferFrom(owner.address, addr1.address, [1, 2], [10, 2], [])).to.be.reverted;
    });

    it("Should revert if array lengths are different", async function () {
      await expect(universe.safeBatchTransferFrom(owner.address, addr1.address, [1, 2], [10, 2, 3], [])).to.be.reverted;
    });

    it("Should emit TransferSingle event", async function () {
      await universe.setApprovalForAll(addr1.address, true);
      const event = await universe.connect(addr1).safeBatchTransferFrom(owner.address, addr1.address, [1, 2], [10, 1], []);
      expect(event).to.emit(universe, "TransferBatch")
        .withArgs(addr1.address, owner.address, addr1.address, [1, 2], [10, 1]);
    });
  });
});