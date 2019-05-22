import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { IRBAC } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    newRootRoleForm = 'newRootRoleForm',
    newRootRoleTile = 'newRootRoleTile',
}
// Component state
interface INewRootRoleState {
    rootRoleTile: string;
}
// Component props
interface INewRootRoleProps {
    rbac: IRBAC;
    userAccount: string;
}
class NewRootRole extends Component<INewRootRoleProps, INewRootRoleState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            rootRoleTile: '',
        };
    }

    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.newRootRoleTile) {
            this.setState({ rootRoleTile: event.target.value });
        }
    }

    public handleSubmit = (event: any) => {
        const { rbac, userAccount } = this.props;
        const { rootRoleTile } = this.state;
        rbac.addRootRole(rootRoleTile, { from: userAccount }).then(() => {
            // refresh page
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { rootRoleTile } = this.state;
        return (
            <form name={DOMNames.newRootRoleForm} onSubmit={this.handleSubmit}>
                Add root role
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Root role tile"
                    name={DOMNames.newRootRoleTile}
                    value={rootRoleTile}
                    onChange={this.handleChange}
                />
                <br />
                <input type="submit" className="button is-primary" />
            </form>
        );
    }
}

export default NewRootRole;
