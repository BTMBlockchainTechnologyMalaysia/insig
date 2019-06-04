import { Connect } from 'uport-connect';

const getUport = () => {
    const uport = new Connect('Soup', {
        bannerImage: { '/': '/ipfs/QmSu1BvnPGy5gEEe2eHunyNN6vb2Zd4pvaqABbvVHUKP3T' },
        description: 'Some potatos are better than others.',
        network: 'ropsten',
        // network: { id: 5577, rpcUrl: 'http://192.168.1.67:8545' },
    });
    return uport;
};

export default getUport;
