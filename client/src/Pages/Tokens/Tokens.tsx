import React, { Component } from 'react';
import Navbar from '../../Components/Navbar/Navbar';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, ITokens } from '../../Common/CommonInterfaces';
import Burn from './Burn';
import Mint from './Mint';
import Pay from './Pay';
import View from './View';


// dom controller names
enum DOMNames {
    mintForm = 'mintForm',
    viewForm = 'viewForm',
    burnForm = 'burnForm',
    payForm = 'payForm',
}
// Component state
interface ITokensState extends IBlockchainState {
    currentTab: string;
    tokens: ITokens;
}
class Tokens extends Component<{}, ITokensState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            currentTab: '',
            tokens: undefined as any,
            userAccount: '',
            web3: undefined as any,
        }
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        BlockchainGeneric.onLoad().then((generic) => {
            BlockchainGeneric.loadTokens(generic.web3).then((contracts) => {
                this.setState({
                    tokens: contracts.tokens,
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
                        <li data-id={DOMNames.mintForm} onClick={this.handleChangeTab}>
                            <a>Mint</a>
                        </li>
                        <li data-id={DOMNames.viewForm} onClick={this.handleChangeTab}>
                            <a>View</a>
                        </li>
                        <li data-id={DOMNames.burnForm} onClick={this.handleChangeTab}>
                            <a>Burn</a>
                        </li>
                        <li data-id={DOMNames.payForm} onClick={this.handleChangeTab}>
                            <a>Pay</a>
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
            userAccount,
            web3,
        } = this.state;

        return (
            <div>
                <div className="tabContent" hidden={currentTab !== DOMNames.mintForm}>
                    <Mint />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.viewForm}>
                    <View />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.burnForm}>
                    <Burn />
                </div>
                <div className="tabContent" hidden={currentTab !== DOMNames.payForm}>
                    <Pay />
                </div>
            </div>
        );
    }
}

export default Tokens;
