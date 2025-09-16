# Jetton Black & White Lists

## 🎯 Overview

A sophisticated Jetton token implementation for the TON ecosystem featuring advanced blacklist and whitelist functionality. This smart contract allows precise control over token transfers with comprehensive access management.

**Key Features:**

- ✅ **Blacklist Management** - Block specific addresses from receiving tokens
- ✅ **Whitelist Management** - Allow multiple addresses to bypass blacklist restrictions  
- ✅ **Admin Controls** - Comprehensive token and contract management
- ✅ **W5 Wallet Support** - Compatible with latest TON wallet versions
- ✅ **Flexible Metadata** - Support for both on-chain and off-chain metadata

## 📁 Project Structure

```json
├── 📄 contracts/          # FunC smart contracts
│   ├── jetton-minter-discoverable.fc
│   ├── jetton-wallet.fc
│   └── imports/           # Contract dependencies
├── 📄 scripts/            # Deployment & management scripts
│   ├── deployJettonMinterDiscoverable.ts
│   ├── deployJettonWallet.ts
│   └── bwController.ts    # Main control interface
├── 📄 wrappers/           # TypeScript contract wrappers
├── 📄 sandbox_tests/      # Contract test suite
├── 📄 data/               # Token metadata
└── 📄 build/              # Compiled contracts (auto-generated)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **TON Wallet** with testnet TON for deployment
- **Wallet Mnemonic** (24-word seed phrase)

### Installation

```bash
# Clone and install dependencies
npm install

# Build all contracts
npm run build
```

### Environment Setup

1. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Add your wallet mnemonic to `.env`:**

   ```env
   WALLET_MNEMONIC="your 24 word mnemonic phrase here"
   ```

3. **Ensure sufficient testnet TON** in your wallet for deployment and operations

## 📋 Usage Guide

### 1. Deploy Jetton Minter

```bash
npm run deploy
```

**Deployment Process:**

1. Select wallet connection method (TON Connect recommended)
2. Connect your wallet
3. Choose metadata type:
   - **On-Chain**: Uses local `data/jetton-metadata.json`
   - **Off-Chain**: Provide external metadata URL
4. Confirm deployment transaction
5. **Save the minter address** for next steps

### 2. Token Management

```bash
npm run ctrl
```

**Available Operations:**

#### 🔧 Admin Functions

- **Mint Tokens** - Create new tokens to any address
- **Set Blacklist** - Block a specific address from receiving tokens
- **Add to Whitelist** - Allow address to bypass blacklist
- **Remove from Whitelist** - Remove address from whitelist
- **Withdraw TON** - Extract accumulated fees from minter

#### 👤 User Functions  

- **Transfer Tokens** - Send tokens to other addresses
- **Get Token Info** - View token metadata and supply
- **Check Blacklist** - View current blacklisted address
- **Check Whitelist** - View all whitelisted addresses

### 3. Token Metadata Configuration

Edit `data/jetton-metadata.json` before deployment:

```json
{
  "name": "Your Token Name",
  "description": "Token description",
  "symbol": "SYMBOL",
  "decimals": 9,
  "image": "https://your-image-url.com/token.png"
}
```

## 🔐 Access Control Logic

The blacklist/whitelist system works as follows:

1. **Normal Operation**: All addresses can receive tokens
2. **Blacklisted Address**: Cannot receive tokens from anyone
3. **Whitelisted + Blacklisted**: Whitelist overrides blacklist (can receive tokens)
4. **Admin Override**: Admin can always perform operations

## 🛠️ Development Commands

```bash
# Build contracts
npm run build

# Run tests
npm run test

# Deploy to testnet
npm run deploy

# Launch control interface
npm run ctrl
```

## 🔧 Advanced Configuration

### Custom Network Configuration

For mainnet deployment, modify commands:

```bash
npx blueprint run deployJettonMinterDiscoverable --mainnet
npx blueprint run bwController --mainnet
```

### Wallet Compatibility

- ✅ **Wallet V4**: Fully supported
- ✅ **Wallet V5**: Fully supported (latest updates applied)
- ✅ **TON Connect**: Recommended for mobile wallets

## 📊 Contract Economics

- **Deployment Cost**: ~0.1 TON
- **Minting Cost**: ~0.05 TON per operation
- **Transfer Cost**: ~0.01 TON per transfer
- **Admin Operations**: ~0.02-0.05 TON each

*Note: The minter accumulates small fees from each operation, which can be withdrawn by the admin.*

## 🐛 Troubleshooting

### Common Issues

### Contract Not Found

- Ensure you're using the correct minter address
- Verify you're on the right network (testnet/mainnet)

### Insufficient Funds

- Add more TON to your wallet
- Check gas estimation for operations

### Transaction Failed

- Wait for network confirmation
- Retry with higher gas limit

### Wallet Connection Issues

- Try different connection method
- Ensure wallet has latest updates

## 🗺️ Roadmap

- [x] ✅ On-chain and off-chain metadata support
- [x] ✅ Wallet V5 compatibility
- [x] ✅ Enhanced error handling and API compatibility
- [ ] 🔄 Advanced batch operations
- [ ] 🔄 Multi-signature admin controls
- [ ] 🔄 Governance token features
- [ ] 🔄 Cross-chain bridge integration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Need Help?** Check the troubleshooting section or open an issue for support.
