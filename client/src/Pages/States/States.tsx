import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Hint, Sankey } from 'react-vis';
import Energy from './energy.json';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, ISupplyChain } from '../../Common/CommonInterfaces';
import '../../main.scss';
import './states.scss';

import Navbar from '../../Components/Navbar/Navbar';

import HandoverState from './HandoverState';
import InfoState from './InfoState';
import PartOf from './PartOfState';
import RootState from './RootState';
import ViewState from './ViewState';

// graphic variables
const BLURRED_LINK_OPACITY = 0.3;
const FOCUSED_LINK_OPACITY = 1;
// dom controller names
enum DOMNames {
    rootStateForm = 'rootStateForm',
    infoStateForm = 'infoStateForm',
    handoverStateForm = 'handoverStateForm',
    partOfStateForm = 'partOfStateForm',
    viewStateForm = 'viewStateForm',
}
interface IState extends IBlockchainState {
    activeLink: any;
    listActions: Array<{ description: string, index: number }>;
    supplyChain: ISupplyChain;
    currentTab: string;
    rolesList: Array<{ description: string, index: number }>;
    nodes: any[];
    links: any[];
}
class State extends Component<{ match: { params: { stateid: string } }}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeLink: null as any,
            currentTab: '',
            links: [],
            listActions: [],
            nodes: [],
            rolesList: [],
            supplyChain: undefined as any,
            userAccount: undefined as any,
            web3: undefined as any,
        };
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        const { match: { params } } = this.props;
        if (params.stateid !== undefined) {
            this.setState({
                currentTab: DOMNames.viewStateForm,
            });
        }
        BlockchainGeneric.onLoad().then((generic) => {
            BlockchainGeneric.loadSupplyChain(generic.web3).then((contracts) => {
                this.setState({
                    supplyChain: contracts.supplyChain,
                    userAccount: generic.userAccount,
                    web3: generic.web3,
                });
                this.loadActions().then((actionsName) => this.setState({ listActions: actionsName }));
                this.loadRoles();
                this.loadGraphicData();
            });
        });
    }

    /**
     * Handle tab change
     */
    public handleChangeTab = (event: any) => {
        this.setState({ currentTab: event.currentTarget.dataset.id });
        event.preventDefault();
    }

    /**
     * @ignore
     */
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
                            <a>Create Asset</a>
                        </li>
                        <li data-id={DOMNames.infoStateForm} onClick={this.handleChangeTab}>
                            <a>Add State</a>
                        </li>
                        <li data-id={DOMNames.handoverStateForm} onClick={this.handleChangeTab}>
                            <a>Handover Asset</a>
                        </li>
                        <li data-id={DOMNames.partOfStateForm} onClick={this.handleChangeTab}>
                            <a>Compose Asset</a>
                        </li>
                        <li data-id={DOMNames.viewStateForm} onClick={this.handleChangeTab}>
                            <a>View State</a>
                        </li>
                    </ul>
                </aside>
                <main>
                    {this.renderTabContent()}
                </main>
            </div>
        );
    }

    /**
     * Render content for each tab
     */
    private renderTabContent = () => {
        const {
            listActions,
            currentTab,
            rolesList,
            supplyChain,
            userAccount,
            web3,
        } = this.state;
        const { match: { params } } = this.props;

        return (
            <div>
                <div className="tabContent" hidden={currentTab !== DOMNames.rootStateForm}>
                    <RootState
                        userAccount={userAccount}
                        supplyChain={supplyChain}
                        listActions={listActions}
                        rolesList={rolesList}
                        web3={web3}
                    />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.infoStateForm}>
                    <InfoState
                        userAccount={userAccount}
                        supplyChain={supplyChain}
                        listActions={listActions}
                    />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.handoverStateForm}>
                    <HandoverState
                        userAccount={userAccount}
                        supplyChain={supplyChain}
                        listActions={listActions}
                        rolesList={rolesList}
                    />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.partOfStateForm}>
                    <PartOf
                        userAccount={userAccount}
                        supplyChain={supplyChain}
                        listActions={listActions}
                    />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.viewStateForm}>
                    <ViewState
                        stateid={params.stateid}
                        userAccount={userAccount}
                        supplyChain={supplyChain}
                    />
                </div>
                {this.drawGraph()}
            </div>
        );
    }

    /**
     * Navigate through the precendentsm until root
     */
    private generateGraphic = async (lastState: BigNumber) => {
        const { supplyChain } = this.state;
        const links: [{ source: number, target: number, value: number }] = [] as any;
        const nodes: [{ name: string }] = [{ name: lastState.toString() }];
        const precedents = await supplyChain.getPrecedents(lastState);
        // tslint:disable-next-line prefer-for-of
        for (let p = 0; p < precedents.length; p += 1) {
            links.push({ source: precedents[p].toNumber() - 1, target: lastState.toNumber() - 1, value: 1 });
            const deep = await this.generateGraphic(precedents[p]);
            deep.links.forEach((d) => links.push(d));
            deep.nodes.forEach((d) => nodes.push(d));
        }
        return { links, nodes };
    }

    /**
     * Load data to render graphic
     */
    private loadGraphicData = () => {
        const { supplyChain } = this.state;
        // get the total assets
        supplyChain.totalAssets().then(async (tAssets) => {
            const links: [{ source: number, target: number, value: number }] = [] as any;
            const nodes: [{ name: string }] = [] as any;
            let highestStateNumber = 0;
            // and then navigate through the precedents of each one
            for (let i = 1; i <= tAssets.toNumber(); i += 1) {
                const lastStateN = await supplyChain.lastStates(new BigNumber(i));
                if (lastStateN.toNumber() > highestStateNumber) {
                    highestStateNumber = lastStateN.toNumber();
                }
                const generated = await this.generateGraphic(lastStateN);
                // and add new values to arrays
                generated.links.forEach((e) => {
                    if (
                        links.find((l) => l.source === e.source && l.target === e.target && l.value === e.value)
                        === undefined
                    ) {
                        links.push(e);
                    }
                });
            }
            // render labels
            for (let x = 0; x < highestStateNumber; x += 1) {
                nodes.push({ name: (x + 1) + ' (' + (await supplyChain.states(new BigNumber(x + 1))).asset + ')' });
            }
            this.setState({ links, nodes });
        });
    }

    private drawGraph() {
        const { activeLink, nodes, links } = this.state;
        // const nodes = Energy.nodes;
        // const links = Energy.links;
        if (nodes.length === 0 || links.length === 0) {
            return;
        }
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

        const customHigh = 80 + nodes.length * 10;
        return (
            <div>
                <Sankey
                    nodes={nodes}
                    links={mapLinks}
                    width={960}
                    height={customHigh}
                    layout={24}
                    align={'right'}
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
                {activeLink && this.renderHint()}
            </div>
        );
    }

    /**
     * load all existing roles
     */
    private loadRoles = async () => {
        const { supplyChain } = this.state;
        if (supplyChain === undefined) {
            return [];
        }
        const totalRoles = await supplyChain.totalRoles();
        const roles: Array<{ description: string, index: number }> = [];
        for (let r = 1; r <= totalRoles.toNumber(); r += 1) {
            roles.push({ description: (await supplyChain.roles(new BigNumber(r))).description, index: r });
        }
        this.setState({ rolesList: roles });
    }

    /**
     * Load all existing actions
     */
    private loadActions = async () => {
        const { supplyChain } = this.state;
        const actionsName: Array<{ description: string, index: number }> = [];
        const totalActions = (await supplyChain.totalActions()).toNumber();
        for (let a = 1; a <= totalActions; a += 1) {
            actionsName.push({ index: a, description: await supplyChain.actionDescription(new BigNumber(a)) });
        }
        return actionsName;
    }

    /**
     * Render hint when mouse is hover grafic
     */
    private renderHint() {
        const { activeLink } = this.state;

        // calculate center x,y position of link for positioning of hint
        const x =
            parseInt(activeLink.source.x1 + (activeLink.target.x0 - activeLink.source.x1) / 2, 10);
        const y = activeLink.y0 - (activeLink.y0 - activeLink.y1) / 2;

        const hintValue = {
            [`${activeLink.source.name} ➞ ${
                activeLink.target.name
                }`]: activeLink.value,
        };

        return <Hint x={x} y={y} value={hintValue} />;
    }
}

export default State;
