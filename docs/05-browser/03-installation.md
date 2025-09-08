---
id: browser-installation
title: Browser Installation
---

# Browser Installation

This guide covers installation options for the WTTP Browser, including pre-built Windows releases and development setup for all platforms.

## Windows Installation (Recommended)

### Pre-built Release

The easiest way to get started is with our pre-built Windows installer:

1. **Download the Latest Release**
   - Visit the [WTTP Browser Releases](https://github.com/TechnicallyWeb3/min-web3/releases/tag/v4.0.1) page
   - Download the latest Windows installer (`.exe` file)
   - Current version: **v4.0.1** (Pre-alpha release)

2. **Install the Browser**
   - Run the downloaded installer
   - Follow the installation wizard
   - The browser will be installed to your default applications folder

3. **Launch the Browser**
   - Find "Min" in your Start Menu or desktop
   - Launch the application
   - Start browsing Web3 content immediately!

### System Requirements

- **Operating System**: Windows 10 or later
- **Architecture**: x64 (64-bit) or ARM64
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 200MB free space
- **Network**: Internet connection for blockchain access

## Development Installation

For developers who want to build from source or contribute to the project:

### Prerequisites

- **Node.js**: Version 16 or later ([Download Node.js](https://nodejs.org/))
- **Git**: For cloning the repository
- **Platform-specific tools** (see below)

### Clone and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/TechnicallyWeb3/min-web3.git
   cd min-web3
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Mode**
   ```bash
   npm run start
   ```

### Platform-Specific Setup

#### Windows Development

**Required Tools**:
- **Visual Studio**: Install Visual Studio with C++ build tools
- **Python**: Install Python 2.7 (required for native modules)

**Setup Commands**:
```bash
# Set Visual Studio version (adjust year as needed)
npm config set msvs_version 2019

# Install dependencies
npm install

# Start development
npm run start
```

#### macOS Development

**Required Tools**:
- **Xcode**: Install Xcode and command-line tools
- **macOS SDK**: Version 11.0 or higher

**Setup Commands**:
```bash
# Set SDK path (adjust version as needed)
export SDKROOT=/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.1.sdk

# Install dependencies
npm install

# Start development
npm run start
```

#### Linux Development

**Required Tools**:
- **Build Essentials**: `sudo apt-get install build-essential`
- **Python**: `sudo apt-get install python2.7`
- **Node.js**: Install via NodeSource repository

**Setup Commands**:
```bash
# Install build tools (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install build-essential python2.7

# Install dependencies
npm install

# Start development
npm run start
```

### Building Binaries

To create distributable binaries for your platform:

#### Windows Build
```bash
npm run buildWindows
```

#### macOS Builds
```bash
# Intel Macs
npm run buildMacIntel

# Apple Silicon Macs
npm run buildMacArm
```

#### Linux Builds
```bash
# Debian/Ubuntu
npm run buildDebian

# Red Hat/CentOS
npm run buildRedhat

# AppImage (universal Linux)
npm run buildAppImage
```

### Development Workflow

1. **Make Changes**: Edit the source code
2. **Reload UI**: Press `Alt+Ctrl+R` (or `Opt+Cmd+R` on Mac) to reload the browser UI
3. **Test Changes**: Your modifications will be reflected immediately
4. **Build Release**: Use the appropriate build command when ready

## Configuration

### Network Configuration

The WTTP Browser uses Sepolia testnet by default. To configure different networks:

1. **Default Chain**: Sepolia (11155111)
2. **Supported Networks**: See the [Modifications Guide](/docs/wttp/browser-modifications) for full list
3. **Custom RPC**: Configure in the WTTP Handler settings

### Environment Variables

For development, you can set these environment variables:

```bash
# Custom RPC endpoint
export WTTP_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Custom chain ID
export WTTP_CHAIN_ID=11155111

# Debug mode
export WTTP_DEBUG=true
```

## Troubleshooting

### Common Issues

#### Installation Fails
- **Windows**: Ensure you have Visual Studio installed
- **macOS**: Check Xcode command-line tools are installed
- **Linux**: Install build-essential package

#### Protocol Not Working
- **Check Network**: Ensure you have internet connection
- **RPC Issues**: Verify your RPC endpoint is working
- **Chain ID**: Confirm the correct chain ID is configured

#### Build Errors
- **Node Version**: Ensure you're using Node.js 16+
- **Dependencies**: Run `npm install` again
- **Clean Build**: Try `npm run build` first

### Getting Help

- **GitHub Issues**: [Report bugs or ask questions](https://github.com/TechnicallyWeb3/min-web3/issues)
- **Documentation**: Check the [WTTP Documentation](/docs/wttp)
- **Community**: Join our Discord for support

### Debug Mode

Enable debug mode to see detailed logs:

```bash
# Windows
set DEBUG=wttp:*
npm run start

# macOS/Linux
DEBUG=wttp:* npm run start
```

## Next Steps

Once you have the WTTP Browser installed:

1. **Try Example Sites**: Visit some [Web3 examples](/docs/wttp/browser-usage)
2. **Deploy Your Own**: Learn how to [deploy WTTP sites](/docs/wttp/wttp-deployment)
3. **Develop Applications**: Use the [WTTP Handler](/docs/wttp/handler-overview) in your projects

## Security Notes

### Pre-built Releases
- **Verification**: Always download from official GitHub releases
- **Antivirus**: Some antivirus software may flag the installer (false positive)
- **Permissions**: The installer may require administrator privileges

### Development Builds
- **Code Review**: Always review code before building
- **Dependencies**: Keep dependencies updated for security patches
- **Network Security**: Use HTTPS RPC endpoints in production

The WTTP Browser is designed to be secure by default, but always exercise caution when downloading and installing software from the internet.
