import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ISupplyChain } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    // root
    rootStateForm = 'rootStateForm',
    rootStateAction = 'rootStateAction',
    rootStateOperatorRole = 'rootStateOperatorRole',
    rootStateOwnerRole = 'rootStateOwnerRole',
}
// Component state
interface IRootState {
    rootStateAction: string;
    rootStateOperatorRole: string;
    rootStateOwnerRole: string;
    modalMessage: string;
}
// Component props
interface IRootProps {
    userAccount: string;
    supplyChain: ISupplyChain;
    listActions: Array<{ description: string, index: number }>;
    rolesList: Array<{ description: string, index: number }>;
    web3: any;
}
class RootState extends Component<IRootProps, IRootState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            modalMessage: '',
            rootStateAction: 'default',
            rootStateOperatorRole: 'default',
            rootStateOwnerRole: 'default',
        };
    }

    /**
     * Handle ESC button click
     */
    public escFunction = (event: any) => {
        if (event.keyCode === 27) {
            // when esc is pressed
            this.setState({ modalMessage: '' });
        }
    }

    /**
     * @ignore
     */
    public componentDidMount = () => {
        document.addEventListener('keydown', this.escFunction, false);
    }

    /**
     * @ignore
     */
    public componentWillUnmount = () => {
        document.removeEventListener('keydown', this.escFunction, false);
    }

    /**
     * Handle all changes in inputs, selects
     */
    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.rootStateAction) {
            this.setState({ rootStateAction: event.target.value });
        } else if (event.target.name === DOMNames.rootStateOperatorRole) {
            this.setState({ rootStateOperatorRole: event.target.value });
        } else if (event.target.name === DOMNames.rootStateOwnerRole) {
            this.setState({ rootStateOwnerRole: event.target.value });
        }
    }

    /**
     * Handle any submit button
     */
    public handleSubmit = (event: any) => {
        const { supplyChain, userAccount, web3 } = this.props;
        const {
            rootStateAction,
            rootStateOperatorRole,
            rootStateOwnerRole,
        } = this.state;
        supplyChain.addRootState(
            new BigNumber(rootStateAction),
            new BigNumber(rootStateOperatorRole),
            new BigNumber(rootStateOwnerRole),
            { from: userAccount },
        ).then(() => {
            this.setState({ modalMessage: 'Success!' });
        });

        event.preventDefault();
    }

    /**
     * Hnadle click
     */
    public handleClick = (event: any) => {
        this.setState({ modalMessage: '' });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { listActions, rolesList } = this.props;
        const {
            modalMessage,
            rootStateAction,
            rootStateOperatorRole,
            rootStateOwnerRole,
        } = this.state;
        let modal;
        if (modalMessage.length > 0) {
            modal = (
                <div className="modal is-active">
                    <div className="modal-background" />
                    <div className="modal-content">
                        <div className="box">
                            <article className="media">
                                <div className="media-content">
                                    <div className="content">
                                        <p>
                                            {modalMessage}
                                        </p>
                                    </div>
                                </div>
                            </article>
                            <button className="modal-close is-large" onClick={this.handleClick} aria-label="close" />
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <form name={DOMNames.rootStateForm} onSubmit={this.handleSubmit}>
                    <legend>Add root state</legend>
                    <div className="select">
                        <select
                            name={DOMNames.rootStateAction}
                            value={rootStateAction}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Action</option>
                            {listActions.map((a) => <option key={a.index} value={a.index}>{a.description}</option>)}
                        </select>
                    </div>
                    <br />
                    <div className="select">
                        <select
                            name={DOMNames.rootStateOperatorRole}
                            value={rootStateOperatorRole}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Operator Role</option>
                            {rolesList.map((r) => <option key={r.index} value={r.index}>{r.description}</option>)}
                        </select>
                    </div>
                    <br />
                    <div className="select">
                        <select
                            name={DOMNames.rootStateOwnerRole}
                            value={rootStateOwnerRole}
                            onChange={this.handleChange}
                        >
                            <option value="default" disabled={true}>Owner Role</option>
                            {rolesList.map((r) => <option key={r.index} value={r.index}>{r.description}</option>)}
                        </select>
                    </div>
                    <br />
                    <input className="button is-primary" type="submit" />
                </form>
                {modal}
            </div>
        );
    }
}

export default RootState;
