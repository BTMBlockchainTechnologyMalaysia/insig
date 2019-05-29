import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ITokens } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    viewForm = 'viewForm',
    inputTokenId = 'inputTokenId',
}
// Component state
interface IViewState {
    inputTokenId: string;
    faceValue: string;
    revenues: string;
}
// component properties
interface IViewProps {
    tokens: ITokens;
}
class View extends Component<IViewProps, IViewState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            faceValue: '',
            inputTokenId: '',
            revenues: '',
        };
    }

    /**
     * Handle all changes in inputs, selects
     */
    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.inputTokenId) {
            this.setState({ inputTokenId: event.target.value, faceValue: '' });
        }
    }

    /**
     * Handle any submit button
     */
    public handleSubmit = (event: any) => {
        const { tokens } = this.props;
        const { inputTokenId } = this.state;
        tokens.exists(
            new BigNumber(inputTokenId),
        ).then((exist) => {
            if (exist) {
                tokens.faceValue(new BigNumber(inputTokenId)).then((faceValue) => {
                    tokens.revenues(new BigNumber(inputTokenId)).then((revenue) => {
                        this.setState({ faceValue: faceValue.toString(), revenues: revenue.toString() });
                    });
                });
            }
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { inputTokenId, faceValue, revenues } = this.state;
        let viewComp;
        if (faceValue.length > 0) {
            viewComp = (
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                        Token Id {inputTokenId}
                        </p>
                        <a href="#" className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className="fas fa-angle-down" aria-hidden="true" />
                            </span>
                        </a>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <p><b>Face value</b> {faceValue}</p>
                            <p><b>Revenues</b> {revenues}</p>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <form name={DOMNames.viewForm} onSubmit={this.handleSubmit}>
                    <legend>View</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="token id"
                        name={DOMNames.inputTokenId}
                        value={inputTokenId}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input className="button is-primary" type="submit" />
                </form>
                {viewComp}
            </div>
        );
    }
}

export default View;
