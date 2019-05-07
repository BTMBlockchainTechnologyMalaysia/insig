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
    let roleId;
    const root = accounts[0];
    // const operator1 = accounts[1];
    // const operator2 = accounts[2];
    // const owner1 = accounts[3];
    // const owner2 = accounts[4];

    before(async () => {
        supplyChain = await SupplyChain.deployed();
    });

    describe('Actions', () => {
        beforeEach(async () => {
            supplyChain = await SupplyChain.new();
        });

        it('addAction creates a action.', async () => {
            productCreationDescription = 'Product line created.';

            transaction = await supplyChain.addAction(productCreationDescription, { from: root });

            assert.equal(transaction.logs.length, 1);
            assert.equal(transaction.logs[0].event, 'ActionCreated');
            assert.equal(transaction.logs[0].args.action.toNumber(), 1);

            assert.equal(
                await supplyChain.actionDescription(transaction.logs[0].args.action.toNumber()),
                productCreationDescription,
            );
            let totalActions = (await supplyChain.totalActions()).toNumber();
            assert.equal(
                totalActions,
                1,
            );

            itemCreationDescription = 'Instance';
            transaction = await supplyChain.addAction(itemCreationDescription, { from: root });

            assert.equal(transaction.logs.length, 1);
            assert.equal(transaction.logs[0].event, 'ActionCreated');
            assert.equal(transaction.logs[0].args.action.toNumber(), 2);

            assert.equal(
                await supplyChain.actionDescription(transaction.logs[0].args.action.toNumber()),
                itemCreationDescription,
            );
            totalActions = (await supplyChain.totalActions()).toNumber();
            assert.equal(
                totalActions,
                2,
            );
        });
    });

    describe('Steps as a graph', () => {
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

            const itemCertificationDescription = 'Instance certified';
            transaction = await supplyChain.addAction(itemCertificationDescription);
            itemCertificationAction = transaction.logs[0].args.action;

            transaction = await supplyChain.addRootRole('OnlyRole');
            roleId = transaction.logs[0].args.role;
        });

        it('addRootStep creates a step.', async () => {
            const productZero = 100;
            const productOne = 101;

            const stepOne = (
                await supplyChain.addRootStep(productCreationAction, productZero, roleId, roleId)
            ).logs[0].args.step;
            const stepTwo = (
                await supplyChain.addRootStep(productCreationAction, productOne, roleId, roleId)
            ).logs[0].args.step;

            assert.equal(stepOne, 1);
            assert.equal(stepTwo, 2);
        });

        it('addInfoStep creates chains.', async () => {
            const itemZero = 100;

            await supplyChain.addRootStep(productCreationAction, itemZero, roleId, roleId);
            const stepTwo = (
                await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero])
            ).logs[0].args.step;
            const stepThree = (
                await supplyChain.addInfoStep(itemCertificationAction, itemZero, [itemZero])
            ).logs[0].args.step;

            assert.equal(
                (await supplyChain.getPrecedents(stepTwo))[0].toNumber(),
                itemZero,
            );
            assert.equal(
                (await supplyChain.getPrecedents(stepThree))[0].toNumber(),
                itemZero,
            );
        });

        it('addInfoStep maintains lastSteps.', async () => {
            const itemZero = 200;

            const stepOne = (
                await supplyChain.addRootStep(itemCreationAction, itemZero, roleId, roleId)
            ).logs[0].args.step;
            const stepTwo = (
                await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero])
            ).logs[0].args.step;

            assert.isFalse(
                (await supplyChain.isLastStep(10)),
            );
            assert.isFalse(
                (await supplyChain.isLastStep(stepOne)),
            );
            assert.isTrue(
                (await supplyChain.isLastStep(stepTwo)),
            );
        });

        itShouldThrow(
            'Precedent items must exist.',
            async () => {
                const itemZero = 200;
                const itemOne = 201;

                await supplyChain.addRootStep(itemCreationAction, itemZero, roleId, roleId);
                await supplyChain.addInfoStep(itemCertificationAction, itemZero, [itemOne]);
            },
            'Precedent item does not exist.',
        );

        it('addInfoStep allows multiple precedents.', async () => {
            const itemZero = 200;
            const itemOne = 201;

            await supplyChain.addRootStep(itemCreationAction, itemZero, roleId, roleId);
            await supplyChain.addRootStep(itemCreationAction, itemOne, roleId, roleId);
            const stepThree = (
                await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero, itemOne])
            ).logs[0].args.step;

            assert.equal(
                (await supplyChain.getPrecedents(stepThree))[0].toNumber(),
                itemZero,
            );
            assert.equal(
                (await supplyChain.getPrecedents(stepThree))[1].toNumber(),
                itemOne,
            );
        });

        itShouldThrow(
            'item must be the same as a direct precedent for addInfoStep.',
            async () => {
                const itemZero = 200;
                const itemOne = 201;

                await supplyChain.addRootStep(itemCreationAction, itemZero, roleId, roleId);
                await supplyChain.addRootStep(itemCreationAction, itemOne, roleId, roleId);
                await supplyChain.addInfoStep(itemCertificationAction, itemOne, [itemZero]);
            },
            'Item not in precedents.',
        );

        it('addInfoStep records action.', async () => {
            const itemZero = 100;

            const stepOne = (
                await supplyChain.addRootStep(productCreationAction, itemZero, roleId, roleId)
            ).logs[0].args.step;
            const stepTwo = (
                await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero])
            ).logs[0].args.step;

            assert.equal(
                ((await supplyChain.steps.call(stepOne)).action).toNumber(),
                productCreationAction.toNumber(),
            );
            assert.equal(
                ((await supplyChain.steps.call(stepTwo)).action).toNumber(),
                itemCreationAction.toNumber(),
            );
        });

        it('addInfoStep records item.', async () => {
            const itemZero = 200;
            const certificationZero = 300;

            const stepOne = (
                await supplyChain.addRootStep(productCreationAction, itemZero, roleId, roleId)
            ).logs[0].args.step;
            const stepTwo = (
                await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero])
            ).logs[0].args.step;
            const stepThree = (
                await supplyChain.addRootStep(certificationCreationAction, certificationZero, roleId, roleId)
            ).logs[0].args.step;
            const stepFour = (
                await supplyChain.addInfoStep(itemCertificationAction, itemZero, [itemZero, certificationZero])
            ).logs[0].args.step;

            assert.equal(
                ((await supplyChain.steps.call(stepOne)).item).toNumber(),
                itemZero,
            );
            assert.equal(
                ((await supplyChain.steps.call(stepTwo)).item).toNumber(),
                itemZero,
            );
            assert.equal(
                ((await supplyChain.steps.call(stepThree)).item).toNumber(),
                certificationZero,
            );
            assert.equal(
                ((await supplyChain.steps.call(stepFour)).item).toNumber(),
                itemZero,
            );
        });

        it('lastSteps records item.', async () => {
            const itemZero = 200;
            const certificationZero = 300;

            await supplyChain.addRootStep(productCreationAction, itemZero, roleId, roleId);
            await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero]);
            const stepThree = (
                await supplyChain.addRootStep(certificationCreationAction, certificationZero, roleId, roleId)
            ).logs[0].args.step;
            const stepFour = (
                await supplyChain.addInfoStep(itemCertificationAction, itemZero, [itemZero, certificationZero])
            ).logs[0].args.step;

            assert.equal(
                ((await supplyChain.lastSteps.call(itemZero))).toNumber(),
                stepFour,
            );
            assert.equal(
                ((await supplyChain.lastSteps.call(certificationZero))).toNumber(),
                stepThree,
            );
        });

        it('addInfoStep records step creator.', async () => {
            const itemZero = 200;
            const certificationZero = 300;

            await supplyChain.addRootStep(productCreationAction, itemZero, roleId, roleId);
            await supplyChain.addInfoStep(itemCreationAction, itemZero, [itemZero]);
            const stepThree = (
                await supplyChain.addRootStep(certificationCreationAction, certificationZero, roleId, roleId)
            ).logs[0].args.step;
            await supplyChain.addInfoStep(itemCertificationAction, itemZero, [itemZero, certificationZero]);

            const certifier = (await supplyChain.steps.call(stepThree)).creator;

            assert.equal(certifier, root);
        });
    });
});
