const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockUSDC", function () {
  let mockUSDC;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await mockUSDC.name()).to.equal("Mock USD Coin");
      expect(await mockUSDC.symbol()).to.equal("USDC");
    });

    it("Should set the right decimals", async function () {
      expect(await mockUSDC.decimals()).to.equal(6);
    });

    it("Should set the right owner", async function () {
      expect(await mockUSDC.owner()).to.equal(owner.address);
    });

    it("Should have zero initial supply", async function () {
      expect(await mockUSDC.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to specified address", async function () {
      const mintAmount = ethers.parseUnits("1000", 6); // 1000 USDC with 6 decimals
      
      await mockUSDC.mint(addr1.address, mintAmount);
      
      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await mockUSDC.totalSupply()).to.equal(mintAmount);
    });

    it("Should only allow owner to mint", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      
      await expect(
        mockUSDC.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(mockUSDC, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      
      await expect(mockUSDC.mint(addr1.address, mintAmount))
        .to.emit(mockUSDC, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });

    it("Should mint multiple times to different addresses", async function () {
      const mintAmount1 = ethers.parseUnits("500", 6);
      const mintAmount2 = ethers.parseUnits("300", 6);
      
      await mockUSDC.mint(addr1.address, mintAmount1);
      await mockUSDC.mint(addr2.address, mintAmount2);
      
      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(mintAmount1);
      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(mintAmount2);
      expect(await mockUSDC.totalSupply()).to.equal(mintAmount1 + mintAmount2);
    });
  });

  describe("ERC20 Functionality", function () {
    beforeEach(async function () {
      // Mint some tokens for testing transfers
      const mintAmount = ethers.parseUnits("1000", 6);
      await mockUSDC.mint(addr1.address, mintAmount);
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      
      await mockUSDC.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(
        ethers.parseUnits("900", 6)
      );
      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should approve and transferFrom", async function () {
      const approveAmount = ethers.parseUnits("200", 6);
      const transferAmount = ethers.parseUnits("100", 6);
      
      // addr1 approves addr2 to spend tokens
      await mockUSDC.connect(addr1).approve(addr2.address, approveAmount);
      
      // Check allowance
      expect(await mockUSDC.allowance(addr1.address, addr2.address))
        .to.equal(approveAmount);
      
      // addr2 transfers from addr1 to owner
      await mockUSDC.connect(addr2)
        .transferFrom(addr1.address, owner.address, transferAmount);
      
      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(
        ethers.parseUnits("900", 6)
      );
      expect(await mockUSDC.balanceOf(owner.address)).to.equal(transferAmount);
      expect(await mockUSDC.allowance(addr1.address, addr2.address))
        .to.equal(approveAmount - transferAmount);
    });

    it("Should fail transfer with insufficient balance", async function () {
      const transferAmount = ethers.parseUnits("2000", 6); // More than balance
      
      await expect(
        mockUSDC.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(mockUSDC, "ERC20InsufficientBalance");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await mockUSDC.transferOwnership(addr1.address);
      expect(await mockUSDC.owner()).to.equal(addr1.address);
    });

    it("Should allow new owner to mint", async function () {
      await mockUSDC.transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseUnits("500", 6);
      await mockUSDC.connect(addr1).mint(addr2.address, mintAmount);
      
      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(mintAmount);
    });

    it("Should prevent old owner from minting after ownership transfer", async function () {
      await mockUSDC.transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseUnits("500", 6);
      await expect(
        mockUSDC.connect(owner).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(mockUSDC, "OwnableUnauthorizedAccount")
        .withArgs(owner.address);
    });
  });
});
