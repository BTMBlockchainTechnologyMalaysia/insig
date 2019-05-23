import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ISupplyChain } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    addBearerForm = 'addBearerForm',
    addBearerAddress = 'addBearerAddress',
    bearerRole = 'bearerRole',
}
// Component state
interface IAddBearerState {
    addBearerAddress: string;
    bearerRole: string;
}
// Component props
interface IAddBearerProps {
    supplyChain: ISupplyChain;
    userAccount: string;
    rolesList: Array<{ description: string, index: number }>;
}
class AddBearer extends Component<IAddBearerProps, IAddBearerState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            addBearerAddress: '',
            bearerRole: 'default',
        };
    }

    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.addBearerAddress) {
            this.setState({ addBearerAddress: event.target.value });
        } else if (event.target.name === DOMNames.bearerRole) {
            this.setState({ bearerRole: event.target.value });
        }
    }

    public handleSubmit = (event: any) => {
        const { supplyChain, userAccount } = this.props;
        const { addBearerAddress, bearerRole } = this.state;
        supplyChain.addBearer(addBearerAddress, new BigNumber(bearerRole), { from: userAccount });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { addBearerAddress, bearerRole } = this.state;
        const { rolesList } = this.props;
        return (
            <form name={DOMNames.addBearerForm} onSubmit={this.handleSubmit}>
                Add Bearer
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Bearer name"
                    name={DOMNames.addBearerAddress}
                    value={addBearerAddress}
                    onChange={this.handleChange}
                />
                <br />
                <div className="select">
                    <select name={DOMNames.bearerRole} value={bearerRole} onChange={this.handleChange}>
                        <option key="default" value="default" disabled={true}>Role</option>
                        {rolesList.map((r) => <option key={r.index} value={r.index}>{r.description}</option>)}
                    </select>
                </div>
                <br />
                <input type="submit" className="button is-primary" />
            </form>
        );
    }
}

export default AddBearer;
