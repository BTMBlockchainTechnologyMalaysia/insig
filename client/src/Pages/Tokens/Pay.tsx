import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ITokens } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    inputTokenId = 'inputTokenId',
    inputAmount = 'inputAmount',
    payForm = 'payForm',
}
// Component state
interface IPayState {
    inputTokenId: string;
    inputAmount: string;
    modalMessage: string;
}
// component properties
interface IPayProps {
    tokens: ITokens;
    userAccount: string;
}
class Pay extends Component<IPayProps, IPayState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            inputAmount: '',
            inputTokenId: '',
            modalMessage: '',
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
        if (event.target.name === DOMNames.inputAmount) {
            this.setState({ inputAmount: event.target.value });
        } else if (event.target.name === DOMNames.inputTokenId) {
            this.setState({ inputTokenId: event.target.value });
        }
    }

    /**
     * Handle any submit button
     */
    public handleSubmit = (event: any) => {
        const {
            inputTokenId,
            inputAmount,
        } = this.state;
        const { tokens, userAccount } = this.props;
        tokens.pay(
            new BigNumber(inputTokenId),
            new BigNumber(inputAmount),
            { from: userAccount},
        ).then(() => {
            this.setState({ modalMessage: 'Success!' });
        });
        event.preventDefault();
    }

    /**
     * Handle click
     */
    public handleClick = (event: any) => {
        this.setState({ modalMessage: '' });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const {
            inputTokenId,
            inputAmount,
            modalMessage,
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
                <form name={DOMNames.payForm} onSubmit={this.handleSubmit}>
                    <legend>Pay</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="token id"
                        name={DOMNames.inputTokenId}
                        value={inputTokenId}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input
                        className="input"
                        type="text"
                        placeholder="amount"
                        name={DOMNames.inputAmount}
                        value={inputAmount}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input className="button is-primary" type="submit" />
                </form>
                {modal}
            </div>
        );
    }
}

export default Pay;
