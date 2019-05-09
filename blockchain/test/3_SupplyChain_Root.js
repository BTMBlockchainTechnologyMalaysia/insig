const SupplyChain = artifacts.require('./SupplyChain.sol');

const chai = require('chai');
const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();

contract('SupplyChain', (accounts) => {
    let supplyChain;
    let productCreationAction;
    let productCreationDescription;
    let itemCreationAction;
    let itemCreationDescription;
    let certificationCreationAction;
    let certificationCreationDescription;
    let itemCertificationAction;
    let transaction;
    const root = accounts[0];
    const operator1 = accounts[1];
    const operator2 = accounts[2];
    const owner1 = accounts[3];
    const owner2 = accounts[4];

    before(async () => {
        supplyChain = await SupplyChain.deployed();
    });

    describe('addRootStep', () => {
        beforeEach(async () => {
            supplyChain = await SupplyChain.new();

            productCreationDescription = 'Product line created.';
            transaction = await supplyChain.addAction(productCreationDescription);
            productCreationAction = transaction.logs[0].args.action;

            itemCreationDescription = 'Instance created.';
            transaction = await supplyChain.addAction(itemCreationDescription);
            itemCreationAction = transaction.logs[0].args.action;

            certificationCreationDescription = 'Certification created';
            transaction = await supplyChain.addAction(certificationCreationDescription);
            certificationCreationAction = transaction.logs[0].args.action;

            itemCertificationDescription = 'Instance certified';
            transaction = await supplyChain.addAction(itemCertificationDescription);
            itemCertificationAction = transaction.logs[0].args.action;

            transaction = await supplyChain.addRootRole("Root", { from: root });
            rootRole = transaction.logs[0].args.role;

            transaction = await supplyChain.addRole("owner1", rootRole);
            ownerRole1 = transaction.logs[0].args.role;
            await supplyChain.addBearer(owner1, ownerRole1, { from: root });

            transaction = await supplyChain.addRole("operator1", ownerRole1);
            operatorRole1 = transaction.logs[0].args.role;
            await supplyChain.addBearer(operator1, operatorRole1, { from: owner1 });

            transaction = await supplyChain.addRole("owner2", rootRole);
            ownerRole2 = transaction.logs[0].args.role;
            await supplyChain.addBearer(owner2, ownerRole2, { from: root });

            transaction = await supplyChain.addRole("operator2", ownerRole2);
            operatorRole2 = transaction.logs[0].args.role;
            await supplyChain.addBearer(operator2, operatorRole2, { from: owner2 });
        });

        // TODO: Test fails with _operatorRole == NO_ROLE
        // TODO: Test fails with _ownerRole == NO_ROLE
        // TODO: Test fails with _item that already exists

        // If there are no precedents check operator1 belongs to operators of the current step.
        itShouldThrow(
            'addRootStep - operator must be owner for created step.',
            async () => {    
                await supplyChain.addRootStep(itemCreationAction, operator1, owner1, { from: owner1 });
            },
            'Creator not in ownerRole.',
        );

        it('sanity check addRootStep', async () => {
            await supplyChain.addBearer(operator1, operatorRole2, { from: owner2 });
            await supplyChain.addBearer(operator1, ownerRole2, { from: root });

            const itemOne = (
                await supplyChain.addRootStep(
                    itemCreationAction, 
                    operatorRole1, 
                    ownerRole1, 
                    { from: owner1 }
                )
            ).logs[0].args.item;

            const itemTwo = (
                await supplyChain.addRootStep(
                    itemCreationAction, 
                    operatorRole2, 
                    ownerRole2, 
                    { from: owner2 }
                )
            ).logs[0].args.item;
            
            assert.equal(itemOne.toNumber(), 1);
            assert.equal(itemTwo.toNumber(), 2);
            // TODO: Test step has no precedents
        });
    });
})
