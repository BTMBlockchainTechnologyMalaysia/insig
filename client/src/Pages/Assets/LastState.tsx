import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ISupplyChain } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    assetToRead = 'assetToRead',
}
// Component state
interface ILastStateState {
    asset: number;
    assetToRead: string;
}
// Component props
interface ILastStateProps {
    assetid: string;
    supplyChain: ISupplyChain;
}
class LastState extends Component<ILastStateProps, ILastStateState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            asset: undefined as any,
            assetToRead: '',
        };
    }

    /**
     * @ignore
     */
    public componentWillReceiveProps = (nextProps: ILastStateProps, nextState: ILastStateState) => {
        const { supplyChain, assetid } = nextProps;
        if (supplyChain !== undefined && assetid !== undefined) {
            this.setState({ assetToRead: assetid });
            supplyChain.lastStates(new BigNumber(assetid)).then((stateInfo) => {
                this.setState({ asset: stateInfo.toNumber() });
            });
        }
    }

    /**
     * Handle all changes in inputs, selects
     */
    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.assetToRead) {
            this.setState({ assetToRead: event.target.value });
        }
    }

    /**
     * Handle any submit button
     */
    public handleSubmit = (event: any) => {
        const { supplyChain } = this.props;
        const { assetToRead } = this.state;
        supplyChain.lastStates(new BigNumber(assetToRead)).then((stateInfo) => {
            this.setState({ asset: stateInfo.toNumber() });
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { assetToRead, asset } = this.state;
        let assetComp;
        if (asset !== undefined) {
            const URL = `/states/${asset}`;
            assetComp = <p>Last state is: <a href={URL} >{asset}</a></p>;
        }
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <legend>Last state</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="asset id"
                        name={DOMNames.assetToRead}
                        value={assetToRead}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input className="button is-primary" type="submit" />
                </form>
                <br />
                {assetComp}
            </div>
        );
    }
}

export default LastState;
