import BigNumber from 'bignumber.js';
import React, { Component } from 'react';

import '../../main.scss';
import './roles.scss';

import Navbar from '../../Components/Navbar/Navbar';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, ISupplyChain } from '../../Common/CommonInterfaces';

import AddBearer from './AddBearer';
import ListRoles from './ListRoles';
import NewRole from './NewRole';
import NewRootRole from './NewRootRole';
import RemoveBearer from './RemoveBearer';
import ViewRole from './ViewRole';

enum DOMNames {
    newRoleForm = 'newRoleForm',
    newRootRoleForm = 'newRootRoleForm',
    addBearerForm = 'addBearerForm',
    removeBearerForm = 'removeBearerForm',
    listRolesForm = 'listRolesForm',
    viewRoleForm = 'viewRoleForm',
}
/**
 * Roles class states
 */
interface IRolesState extends IBlockchainState {
    supplyChain: ISupplyChain;
    rolesList: Array<{ description: string, index: number }>;
    currentTab: string;
}
/**
 * Roles class
 */
class Roles extends Component<{}, IRolesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentTab: '',
            supplyChain: undefined as any,
            rolesList: [],
            userAccount: '',
            web3: undefined as any,
        };
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        BlockchainGeneric.onLoad().then((generic) => {
            BlockchainGeneric.loadSupplyChain(generic.web3).then(async (contracts) => {
                this.setState({
                    supplyChain: contracts.supplyChain,
                    userAccount: generic.userAccount,
                    web3: generic.web3,
                }, this.loadRoles);
            });
        });
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
                        <li data-id={DOMNames.newRootRoleForm} onClick={this.handleChangeTab}>
                            <a>Add root role</a>
                        </li>
                        <li data-id={DOMNames.newRoleForm} onClick={this.handleChangeTab}>
                            <a>Add role</a>
                        </li>
                        <li data-id={DOMNames.addBearerForm} onClick={this.handleChangeTab}>
                            <a>Add Bearer</a>
                        </li>
                        <li data-id={DOMNames.removeBearerForm} onClick={this.handleChangeTab}>
                            <a>Remove Bearer</a>
                        </li>
                        <li data-id={DOMNames.listRolesForm} onClick={this.handleChangeTab}>
                            <a>List roles</a>
                        </li>
                        <li data-id={DOMNames.viewRoleForm} onClick={this.handleChangeTab}>
                            <a>View role</a>
                        </li>
                    </ul>
                </aside>
                <main>
                    {this.renderTabContent()}
                </main>
            </div>
        );
    }

    private renderTabContent() {
        const {
            currentTab,
            rolesList,
            userAccount,
            supplyChain,
        } = this.state;
        return (<div>
            <div className="tabContent" hidden={currentTab !== DOMNames.newRootRoleForm}>
                <NewRootRole
                    userAccount={userAccount}
                    supplyChain={supplyChain}
                />
            </div>
            <div className="tabContent" hidden={currentTab !== DOMNames.newRoleForm}>
                <NewRole
                    userAccount={userAccount}
                    supplyChain={supplyChain}
                />
            </div>
            <div className="tabContent" hidden={currentTab !== DOMNames.addBearerForm}>
                <AddBearer
                    userAccount={userAccount}
                    supplyChain={supplyChain}
                    rolesList={rolesList}
                />
            </div>
            <div className="tabContent" hidden={currentTab !== DOMNames.removeBearerForm}>
                <RemoveBearer
                    userAccount={userAccount}
                    supplyChain={supplyChain}
                />
            </div>
            <div className="tabContent" hidden={currentTab !== DOMNames.viewRoleForm}>
                <ViewRole
                    userAccount={userAccount}
                    supplyChain={supplyChain}
                />
            </div>
            <div>
                <ListRoles
                    rolesList={rolesList}
                />
            </div>
        </div>);
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
}
export default Roles;
