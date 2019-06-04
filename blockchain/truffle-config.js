// eslint-disable-next-line import/no-extraneous-dependencies
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');

const mnemonic = fs.readFileSync('.secret').toString().trim();

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },
        ropsten: {
            provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/b03c2cbd8095451fa05f44753e08d452'),
            network_id: 3, // Ropsten's id
            gas: 5500000, // Ropsten has a lower block limit than mainnet
            confirmations: 2, // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
        },
    },

    mocha: {
        reporter: 'eth-gas-reporter',
    },

    solc: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },

    compilers: {
        solc: {
            version: '0.5.2',
        },
    },
};
