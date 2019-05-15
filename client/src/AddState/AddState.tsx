import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Sankey } from 'react-vis';
import Energy from './energy.json';

import BlockchainGeneric from '../Common/BlockchainGeneric';
import { IBlockchainState, ISupplyChain } from '../Common/CommonInterfaces';
import '../main.scss';
import './addstate.scss';

import Navbar from '../Components/Navbar/Navbar';

// graphic variables
const BLURRED_LINK_OPACITY = 0.3;
const FOCUSED_LINK_OPACITY = 1;
// dom controller names
enum DOMNames {
    // root
    rootStateForm = 'rootStateForm',
    rootStateAction = 'rootStateAction',
    rootStateOperatorRole = 'rootStateOperatorRole',
    rootStateOwnerRole = 'rootStateOwnerRole',
    // info
    infoStateForm = 'infoStateForm',
    infoStateAction = 'infoStateAction',
    infoStatePrecedents = 'infoStatePrecedents',
    infoStateItem = 'infoStateItem',
    // handover
    handoverStateForm = 'handoverStateForm',
    handoverStateAction = 'handoverStateAction',
    handoverStateItem = 'handoverStateItem',
    handoverStateOperatorRole = 'handoverStateOperatorRole',
    handoverStateOwnerRole = 'handoverStateOwnerRole',
    // partof
    parteOfStateForm = 'parteOfStateForm',
    parteOfStateAction = 'parteOfStateAction',
    parteOfStateItem = 'parteOfStateItem',
    parteOfStateParteOf = 'parteOfStateParteOf',
}
interface IAddState extends IBlockchainState {
    activeLink: object;
    listActions: string[];
    supplyChain: ISupplyChain;
    currentTab: string;
    rootStateAction: string;
    rootStateOperatorRole: string;
    rootStateOwnerRole: string;
    infoStateAction: string;
    infoStatePrecedents: string;
    infoStateItem: string;
    handoverStateAction: string;
    handoverStateItem: string;
    handoverStateOperatorRole: string;
    handoverStateOwnerRole: string;
    parteOfStateAction: string;
    parteOfStateItem: string;
    parteOfStateParteOf: string;
}
class AddState extends Component<{}, IAddState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeLink: null as any,
            currentTab: '',
            handoverStateAction: 'default',
            handoverStateItem: 'default',
            handoverStateOperatorRole: 'default',
            handoverStateOwnerRole: 'default',
            infoStateAction: 'default',
            infoStateItem: 'default',
            infoStatePrecedents: 'default',
            listActions: [],
            parteOfStateAction: 'default',
            parteOfStateItem: 'default',
            parteOfStateParteOf: 'default',
            rootStateAction: 'default',
            rootStateOperatorRole: 'default',
            rootStateOwnerRole: 'default',
            supplyChain: undefined as any,
            userAccount: undefined as any,
            web3: undefined as any,
        };
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        BlockchainGeneric.onLoad().then((generic) => {
            BlockchainGeneric.loadSupplyChain(generic.web3).then((contracts) => {
                this.setState({
                    supplyChain: contracts.supplyChain,
                    userAccount: generic.userAccount,
                    web3: generic.web3,
                });
                this.loadActions().then((actionsName) => this.setState({ listActions: actionsName }));
            });
        });
    }

    public handleChange = (event: any) => {
        const { currentTab } = this.state;
        if (currentTab === DOMNames.rootStateForm) {
            if (event.target.name === DOMNames.rootStateAction) {
                this.setState({ rootStateAction: event.target.value });
            } else if (event.target.name === DOMNames.rootStateOperatorRole) {
                this.setState({ rootStateOperatorRole: event.target.value });
            } else if (event.target.name === DOMNames.rootStateOwnerRole) {
                this.setState({ rootStateOwnerRole: event.target.value });
            }
        } else if (currentTab === DOMNames.infoStateForm) {
            if (event.target.name === DOMNames.infoStateAction) {
                this.setState({ infoStateAction: event.target.value });
            } else if (event.target.name === DOMNames.infoStatePrecedents) {
                this.setState({ infoStatePrecedents: event.target.value });
            } else if (event.target.name === DOMNames.infoStateItem) {
                this.setState({ infoStateItem: event.target.value });
            }
        } else if (currentTab === DOMNames.handoverStateForm) {
            if (event.target.name === DOMNames.handoverStateAction) {
                this.setState({ handoverStateAction: event.target.value });
            } else if (event.target.name === DOMNames.handoverStateItem) {
                this.setState({ handoverStateItem: event.target.value });
            } else if (event.target.name === DOMNames.handoverStateOperatorRole) {
                this.setState({ handoverStateOperatorRole: event.target.value });
            } else if (event.target.name === DOMNames.handoverStateOwnerRole) {
                this.setState({ handoverStateOwnerRole: event.target.value });
            }
        } else if (currentTab === DOMNames.parteOfStateForm) {
            if (event.target.name === DOMNames.parteOfStateAction) {
                this.setState({ parteOfStateAction: event.target.value });
            } else if (event.target.name === DOMNames.parteOfStateItem) {
                this.setState({ parteOfStateItem: event.target.value });
            } else if (event.target.name === DOMNames.parteOfStateParteOf) {
                this.setState({ parteOfStateParteOf: event.target.value });
            }
        }
    }

    public handleSubmit = (event: any) => {
        const { infoStatePrecedents } = this.state;
        alert('A name was submitted: ' + infoStatePrecedents);
        event.preventDefault();
    }

    public handleChangeTab = (event: any) => {
        this.setState({ currentTab: event.currentTarget.dataset.id });
        event.preventDefault();
    }

    public render() {
        return (
            <div>
                <Navbar />
                <aside className="menu">
                    <p className="menu-label">
                        General
                    </p>
                    <ul className="menu-list">
                        <li data-id={DOMNames.rootStateForm} onClick={this.handleChangeTab}>
                            <a>Add root state</a>
                        </li>
                        <li data-id={DOMNames.infoStateForm} onClick={this.handleChangeTab}>
                            <a>Add state</a>
                        </li>
                        <li data-id={DOMNames.handoverStateForm} onClick={this.handleChangeTab}>
                            <a>Handover state</a>
                        </li>
                        <li data-id={DOMNames.parteOfStateForm} onClick={this.handleChangeTab}>
                            <a>Handover state</a>
                        </li>
                    </ul>
                </aside>
                <main>
                    {this.renderTabContent()}
                </main>
            </div>
        );
    }

    private renderTabContent = () => {
        const {
            listActions,
            currentTab,
            rootStateAction,
            rootStateOperatorRole,
            rootStateOwnerRole,
            infoStateAction,
            infoStatePrecedents,
            infoStateItem,
            handoverStateAction,
            handoverStateItem,
            handoverStateOperatorRole,
            handoverStateOwnerRole,
            parteOfStateAction,
            parteOfStateItem,
            parteOfStateParteOf,
        } = this.state;

        return (
            <div>
                <div hidden={currentTab !== DOMNames.rootStateForm}>
                    <form name={DOMNames.rootStateForm} onSubmit={this.handleSubmit}>
                        <legend>Add root state</legend>
                        <select name={DOMNames.rootStateAction} value={rootStateAction} onChange={this.handleChange}>
                            <option value="default" disabled={true}>Action</option>
                            {listActions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select
                            name={DOMNames.rootStateOperatorRole}
                            value={rootStateOperatorRole}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Operator Role</option>
                        </select>
                        <select
                            name={DOMNames.rootStateOwnerRole}
                            value={rootStateOwnerRole}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Owner Role</option>
                        </select>
                        <input type="submit" />
                    </form>
                </div>
                <div hidden={currentTab !== DOMNames.infoStateForm}>
                    <form name={DOMNames.infoStateForm} onSubmit={this.handleSubmit}>
                        <legend>Add state</legend>
                        <select name={DOMNames.infoStateAction} value={infoStateAction} onChange={this.handleChange}>
                            <option value="default" disabled={true}>Action</option>
                            {listActions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select
                            name={DOMNames.infoStatePrecedents}
                            value={infoStatePrecedents}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Precedents</option>
                        </select>
                        <select name={DOMNames.infoStateItem} value={infoStateItem} onChange={this.handleChange}>
                            <option value="default" disabled={true}>Item</option>
                        </select>
                        <input type="submit" />
                    </form>
                </div>
                <div hidden={currentTab !== DOMNames.handoverStateForm}>
                    <form name={DOMNames.handoverStateForm} onSubmit={this.handleSubmit}>
                        <legend>Handover state</legend>
                        <select
                            name={DOMNames.handoverStateAction}
                            value={handoverStateAction}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Action</option>
                            {listActions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select
                            name={DOMNames.handoverStateItem}
                            value={handoverStateItem}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Item</option>
                        </select>
                        <input
                            className="input"
                            type="text"
                            placeholder="operator role"
                            name={DOMNames.handoverStateOperatorRole}
                            value={handoverStateOperatorRole}
                            onChange={this.handleChange}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder="owner role"
                            name={DOMNames.handoverStateOwnerRole}
                            value={handoverStateOwnerRole}
                            onChange={this.handleChange}
                        />
                        <input type="submit" />
                    </form>
                </div>
                <div hidden={currentTab !== DOMNames.parteOfStateForm}>
                    <form name={DOMNames.parteOfStateForm} onSubmit={this.handleSubmit}>
                        <legend>ParteOf state</legend>
                        <select
                            name={DOMNames.parteOfStateAction}
                            value={parteOfStateAction}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Action</option>
                            {listActions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select
                            name={DOMNames.parteOfStateItem}
                            value={parteOfStateItem}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Item</option>
                        </select>
                        <input
                            className="input"
                            type="text"
                            placeholder="parte of"
                            name={DOMNames.parteOfStateParteOf}
                            value={parteOfStateParteOf}
                            onChange={this.handleChange}
                        />
                        <input type="submit" />
                    </form>
                </div>
                {this.drawGraph()}
            </div>
        );
    }

    private drawGraph() {
        const nodes = Energy.nodes;
        const links = Energy.links;
        const { activeLink } = this.state;
        const mapLinks = links.map((d, i) => ({
            ...d,
            opacity:
                activeLink && i === (activeLink as any).index
                    ? FOCUSED_LINK_OPACITY
                    : BLURRED_LINK_OPACITY,
        }));
        const sankeyStyle = {
            labels: {
                fontSize: '8px',
            },
            links: {
                opacity: 0.3,
            },
            rects: {
                stroke: '#1A3177',
                strokeWidth: 2,
            },
        };

        return (
            <Sankey
                nodes={nodes}
                links={mapLinks}
                width={960}
                height={500}
                layout={24}
                nodeWidth={15}
                nodePadding={10}
                style={sankeyStyle}
                // do not use voronoi in combination with link mouse over
                hasVoronoi={false}
                // tslint:disable-next-line:jsx-no-lambda
                onLinkMouseOver={(node: any) => this.setState({ activeLink: node })}
                // tslint:disable-next-line:jsx-no-lambda
                onLinkMouseOut={() => this.setState({ activeLink: null as any })}
            />
        );
    }

    private async loadActions() {
        const { supplyChain } = this.state;
        const actionsName: string[] = [];
        const totalActions = (await supplyChain.totalActions()).toNumber();
        for (let a = 1; a <= totalActions; a += 1) {
            actionsName.push(await supplyChain.actionDescription(new BigNumber(a)));
        }
        return actionsName;
    }
}

export default AddState;
