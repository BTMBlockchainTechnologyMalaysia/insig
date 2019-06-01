import express from 'express';
import Web3 from 'web3';
import truffleContract from 'truffle-contract';
import BigNumber from 'bignumber.js';
import redis from 'redis';
import util from 'util';

// read contract truffle artifact
import SupplyChainJSON from './contracts/SupplyChain.json';
// start web3
const provider = new Web3.providers.HttpProvider(
    'http://127.0.0.1:8545',
);
const web3 = new Web3(provider);
// start express app
const app = express();
const port = 3001;
// start redis
const redisClient = redis.createClient();
// global variable for the contract
let supplyChain;
// promisify
redisClient.get = util.promisify(redisClient.get);


// allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


async function generateGraphic(lastState) {
    const cacheResult = await redisClient.get(lastState.toString());
    // if it exists of cache, return it from there
    if (cacheResult !== null) {
        const resultCache = JSON.parse(cacheResult);
        return { links: resultCache.links, nodes: resultCache.nodes };
    }
    const links = [];
    const nodes = [];
    const precedents = await supplyChain.getPrecedents(lastState);
    // tslint:disable-next-line prefer-for-of
    for (let p = 0; p < precedents.length; p += 1) {
        links.push({ source: precedents[p].toNumber() - 1, target: lastState.toNumber() - 1, value: 1 });
        // eslint-disable-next-line no-await-in-loop
        const deep = await generateGraphic(precedents[p]);
        deep.links.forEach(d => links.push(d));
        deep.nodes.forEach(d => nodes.push(d));
    }
    // if it does not exist on cache, add
    const saveElement = `{ "links": ${JSON.stringify(links)}, "nodes": ${JSON.stringify(nodes)} }`;
    redisClient.set(lastState.toString(), saveElement);
    return { links, nodes };
}


app.get('/cache/graph/', (req, res) => {
    supplyChain.totalAssets().then(async (tAssets) => {
        const links = [];
        const nodes = [];
        let highestStateNumber = 0;
        // and then navigate through the precedents of each one
        for (let i = 1; i <= tAssets.toNumber(); i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const lastStateN = await supplyChain.lastStates(new BigNumber(i));
            if (lastStateN.toNumber() > highestStateNumber) {
                highestStateNumber = lastStateN.toNumber();
            }
            // eslint-disable-next-line no-await-in-loop
            const generated = await generateGraphic(lastStateN);
            // and add new values to arrays
            generated.links.forEach((e) => {
                if (
                    links.find(l => l.source === e.source && l.target === e.target && l.value === e.value)
                    === undefined
                ) {
                    links.push(e);
                }
            });
        }
        // render labels
        for (let x = 0; x < highestStateNumber; x += 1) {
            // eslint-disable-next-line no-await-in-loop
            nodes.push({ name: `${x + 1} (${(await supplyChain.states(new BigNumber(x + 1))).asset})` });
        }
        res.send({ links, nodes });
    });
});

app.listen(port, async () => {
    // load the contract
    const ContractSupplyChain = truffleContract(SupplyChainJSON);
    ContractSupplyChain.setProvider((web3).currentProvider);
    supplyChain = await ContractSupplyChain.deployed();
    //
    console.log(`Example app listening on port ${port}!`);
});
