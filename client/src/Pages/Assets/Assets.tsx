import React, { Component } from 'react';

import '../../main.scss';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, ISupplyChain } from '../../Common/CommonInterfaces';
import Navbar from '../../Components/Navbar/Navbar';
import LastState from './LastState';

// dom controller names
enum DOMNames {
    lastStateForm = 'lastStateForm',
}
interface IAssetsState extends IBlockchainState {
    supplyChain: ISupplyChain;
    currentTab: string;
}
/**
 * Assets class
 */
class Assets extends Component<{ match: { params: { assetid: string } }}, IAssetsState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            currentTab: '',
            supplyChain: undefined as any,
            userAccount: '',
            web3: undefined as any,
        };
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        const { match: { params } } = this.props;
        if (params.assetid !== undefined) {
            this.setState({
                currentTab: DOMNames.lastStateForm,
            });
        }
        BlockchainGeneric.onLoad().then((generic) => {
            BlockchainGeneric.loadSupplyChain(generic.web3).then((contracts) => {
                this.setState({
                    supplyChain: contracts.supplyChain,
                    userAccount: generic.userAccount,
                    web3: generic.web3,
                });
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
                        <li data-id={DOMNames.lastStateForm} onClick={this.handleChangeTab}>
                            <a>Last state</a>
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
            currentTab,
            supplyChain,
        } = this.state;
        const { match: { params } } = this.props;

        return (
            <div>
                <div className="tabContent" hidden={currentTab !== DOMNames.lastStateForm}>
                    <LastState
                        assetid={params.assetid}
                        supplyChain={supplyChain}
                    />
                </div>
            </div>
        );
    }
}

export default Assets;
