import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { IRBAC } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    removeBearerForm = 'removeBearerForm',
    removeBearerAddress = 'removeBearerAddress',
}
// Component state
interface IRemoveBearerState {
    removeBearerAddress: string;
}
// Component props
interface IRemoveBearerProps {
    rbac: IRBAC;
    userAccount: string;
}
class RemoveBearer extends Component<IRemoveBearerProps, IRemoveBearerState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            removeBearerAddress: '',
        };
    }

    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.removeBearerAddress) {
            this.setState({ removeBearerAddress: event.target.value });
        }
    }

    public handleSubmit = (event: any) => {
        const { rbac, userAccount } = this.props;
        const { removeBearerAddress } = this.state;
        // TODO: add input
        rbac.removeBearer(removeBearerAddress, new BigNumber(1), { from: userAccount });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { removeBearerAddress } = this.state;
        return (
            <form name={DOMNames.removeBearerForm} onSubmit={this.handleSubmit}>
                Remove Bearer
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Bearer name"
                    name={DOMNames.removeBearerAddress}
                    value={removeBearerAddress}
                    onChange={this.handleChange}
                />
                <br />
                <input type="submit" className="button is-primary" />
            </form>
        );
    }
}

export default RemoveBearer;
