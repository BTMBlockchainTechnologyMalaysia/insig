import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ISupplyChain } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    // partof
    partOfStateForm = 'partOfStateForm',
    partOfStateAction = 'partOfStateAction',
    partOfStateAsset = 'partOfStateAsset',
    partOfStatePartOf = 'partOfStatePartOf',
}
// Component state
interface IPartOfState {
    partOfStateAction: string;
    partOfStateAsset: string;
    partOfStatePartOf: string;
}
// Component props
interface IPartOfProps {
    userAccount: string;
    supplyChain: ISupplyChain;
    listActions: Array<{ description: string, index: number }>;
}
class PartOf extends Component<IPartOfProps, IPartOfState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            partOfStateAction: 'default',
            partOfStateAsset: '',
            partOfStatePartOf: '',
        };
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        //
    }

    /**
     * Handle all changes in inputs, selects
     */
    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.partOfStateAction) {
            this.setState({ partOfStateAction: event.target.value });
        } else if (event.target.name === DOMNames.partOfStateAsset) {
            this.setState({ partOfStateAsset: event.target.value });
        } else if (event.target.name === DOMNames.partOfStatePartOf) {
            this.setState({ partOfStatePartOf: event.target.value });
        }
    }

    /**
     * Handle any submit button
     */
    public handleSubmit = (event: any) => {
        const { supplyChain, userAccount } = this.props;
        const {
            partOfStateAction,
            partOfStateAsset,
            partOfStatePartOf,
        } = this.state;
        supplyChain.addPartOfState(
            new BigNumber(partOfStateAction),
            new BigNumber(partOfStateAsset),
            new BigNumber(partOfStatePartOf),
            { from: userAccount },
        ).then(() => {
            alert('Success!');
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { listActions } = this.props;
        const {
            partOfStateAction,
            partOfStateAsset,
            partOfStatePartOf,
        } = this.state;
        return (
            <form name={DOMNames.partOfStateForm} onSubmit={this.handleSubmit}>
                <legend>PartOf state</legend>
                <div className="select">
                    <select
                        name={DOMNames.partOfStateAction}
                        value={partOfStateAction}
                        onChange={this.handleChange}
                    >
                        <option value="default" disabled={true}>Action</option>
                        {listActions.map((a) => <option key={a.index} value={a.index}>{a.description}</option>)}
                    </select>
                </div>
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Asset"
                    name={DOMNames.partOfStateAsset}
                    value={partOfStateAsset}
                    onChange={this.handleChange}
                />
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Part of"
                    name={DOMNames.partOfStatePartOf}
                    value={partOfStatePartOf}
                    onChange={this.handleChange}
                />
                <br />
                <input className="button is-primary" type="submit" />
            </form>
        );
    }
}

export default PartOf;