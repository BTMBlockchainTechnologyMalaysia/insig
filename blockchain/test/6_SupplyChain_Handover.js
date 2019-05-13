const SupplyChain = artifacts.require('./SupplyChain.sol');

const chai = require('chai');
const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();

contract('SupplyChain', (accounts) => {
    let supplyChain;
    // let productCreationAction;
    let productCreationDescription;
    let itemCreationAction;
    let itemCreationDescription;
    // let itemCertificationAction;
    let itemCertificationDescription;
    // let certificationCreationAction;
    let certificationCreationDescription;
    let transaction;
    const root = accounts[0];
    const operator1 = accounts[1];
    const operator2 = accounts[2];
    const owner1 = accounts[3];
    const owner2 = accounts[4];
    let rootRole;
    let operatorRole1;
    let ownerRole1;
    let operatorRole2;
    let ownerRole2;

    before(async () => {
        supplyChain = await SupplyChain.deployed();
    });

    describe('addHandoverState', () => {
        beforeEach(async () => {
            supplyChain = await SupplyChain.new();

            productCreationDescription = 'Product line created.';
            transaction = await supplyChain.addAction(productCreationDescription);
            // productCreationAction = transaction.logs[0].args.action;

            itemCreationDescription = 'Instance created.';
            transaction = await supplyChain.addAction(itemCreationDescription);
            itemCreationAction = transaction.logs[0].args.action;

            certificationCreationDescription = 'Certification created';
            transaction = await supplyChain.addAction(certificationCreationDescription);
            // certificationCreationAction = transaction.logs[0].args.action;

            itemCertificationDescription = 'Instance certified';
            transaction = await supplyChain.addAction(itemCertificationDescription);
            // itemCertificationAction = transaction.logs[0].args.action;

            transaction = await supplyChain.addRootRole('Root', { from: root });
            rootRole = transaction.logs[0].args.role;

            transaction = await supplyChain.addRole('owner1', rootRole);
            ownerRole1 = transaction.logs[0].args.role;
            await supplyChain.addBearer(owner1, ownerRole1, { from: root });

            transaction = await supplyChain.addRole('operator1', ownerRole1);
            operatorRole1 = transaction.logs[0].args.role;
            await supplyChain.addBearer(operator1, operatorRole1, { from: owner1 });

            transaction = await supplyChain.addRole('owner2', rootRole);
            ownerRole2 = transaction.logs[0].args.role;
            await supplyChain.addBearer(owner2, ownerRole2, { from: root });

            transaction = await supplyChain.addRole('operator2', ownerRole2);
            operatorRole2 = transaction.logs[0].args.role;
            await supplyChain.addBearer(operator2, operatorRole2, { from: owner2 });
        });

        itShouldThrow(
            'addHandoverState - item must exist.',
            async () => {
                await supplyChain.addHandoverState(
                    itemCreationAction,
                    1,
                    operatorRole2,
                    ownerRole2,
                    { from: operator1 },
                );
            },
            'Item does not exist.',
        );

        // If permissions are different to a precedent with the same instance id check user belongs to its ownerRole.
        itShouldThrow(
            'addHandoverState - only ownerRole can change permissions.',
            async () => {
                // const partZero = 200;
                await supplyChain.addBearer(operator1, operatorRole2, { from: owner2 });

                const itemOne = (
                    await supplyChain.addRootState(
                        itemCreationAction,
                        operatorRole1,
                        ownerRole1,
                        { from: owner1 },
                    )
                ).logs[0].args.item;
                await supplyChain.addHandoverState(
                    itemCreationAction,
                    itemOne,
                    operatorRole2,
                    ownerRole2,
                    { from: operator1 },
                );
            },
            'Needs owner for handover.',
        );

        it('sanity check addHandoverState', async () => {
            transaction = (
                await supplyChain.addRootState(
                    itemCreationAction,
                    operatorRole1,
                    ownerRole1,
                    { from: owner1 },
                )
            );
            const itemOne = transaction.logs[0].args.item;
            // const stateOne = transaction.logs[1].args.state;

            const stateTwo = (
                await supplyChain.addInfoState(
                    itemCreationAction,
                    itemOne,
                    [],
                    { from: operator1 },
                )
            ).logs[0].args.state;

            const stateThree = (
                await supplyChain.addHandoverState(
                    itemCreationAction,
                    itemOne,
                    operatorRole2,
                    ownerRole2,
                    { from: owner1 },
                )
            ).logs[0].args.state;

            assert.equal(
                (await supplyChain.getPrecedents(stateThree)).length,
                1,
            );
            assert.equal(
                (await supplyChain.getPrecedents(stateThree))[0].toNumber(),
                stateTwo,
            );
        });
    });
});
