# MockUSDC Token Contract

A simple ERC20 token contract that mimics USDC for testing and development purposes.

## Features

- **ERC20 Standard**: Full ERC20 implementation with transfer, approve, and allowance functionality
- **6 Decimals**: Matches real USDC precision
- **Mintable**: Owner can mint tokens to any address
- **Ownable**: Access control for minting functionality
- **OpenZeppelin**: Built using battle-tested OpenZeppelin contracts

## Contract Details

- **Name**: Mock USD Coin
- **Symbol**: USDC
- **Decimals**: 6
- **Initial Supply**: 0 (tokens must be minted)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mock-usdc.git
cd mock-usdc
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
npx hardhat test --gas-reporter

# Run with coverage
npx hardhat coverage
```

### Deploy Contract

```bash
# Deploy to local network
npx hardhat node # In one terminal
npx hardhat run scripts/deploy.js --network localhost # In another terminal

# Deploy to testnet (configure network in hardhat.config.js first)
npx hardhat run scripts/deploy.js --network goerli
```

### Interact with Contract

```bash
# Start Hardhat console
npx hardhat console --network localhost

# In console:
const MockUSDC = await ethers.getContractFactory("MockUSDC");
const mockUSDC = await MockUSDC.attach("CONTRACT_ADDRESS");
await mockUSDC.mint("0x...", ethers.parseUnits("1000", 6));
```

## Contract Functions

### Owner Functions

- `mint(address to, uint256 amount)`: Mint tokens to specified address (only owner)
- `transferOwnership(address newOwner)`: Transfer contract ownership

### ERC20 Functions

- `transfer(address to, uint256 amount)`: Transfer tokens
- `approve(address spender, uint256 amount)`: Approve spending allowance
- `transferFrom(address from, address to, uint256 amount)`: Transfer on behalf of another
- `balanceOf(address account)`: Get token balance
- `allowance(address owner, address spender)`: Get spending allowance

## Testing

The test suite covers:

- Contract deployment and initialization
- Minting functionality and access control
- ERC20 token transfers and approvals
- Ownership management
- Edge cases and error handling

## Security Considerations

⚠️ **This is a mock contract for testing purposes only**

- Not audited for production use
- Contains minting functionality that real USDC doesn't have
- Should only be used in development/testing environments

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Networks

This contract can be deployed on:

- Ethereum Mainnet/Testnets
- Polygon
- BSC
- Arbitrum
- Optimism
- Any EVM-compatible network

## Support

If you have questions or need help:

1. Check the existing issues
2. Create a new issue with detailed description
3. Include error messages and relevant code

## Changelog

### v1.0.0
- Initial release
- Basic ERC20 functionality
- Minting capability
- Comprehensive test suite
