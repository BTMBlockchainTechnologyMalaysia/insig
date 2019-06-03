import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ISupplyChain } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    newRoleForm = 'newRoleForm',
    newRoleTitle = 'newRoleTitle',
    newRoleAdmin = 'newRoleAdmin',
}
// Component state
interface INewRoleState {
    roleTitle: string;
    roleAdmin: string;
}
// Component props
interface INewRoleProps {
    supplyChain: ISupplyChain;
    userAccount: string;
}
class NewRole extends Component<INewRoleProps, INewRoleState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            roleAdmin: '',
            roleTitle: '',
        };
    }

    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.newRoleTitle) {
            this.setState({ roleTitle: event.target.value });
        } else if (event.target.name === DOMNames.newRoleAdmin) {
            this.setState({ roleAdmin: event.target.value });
        }
    }

    public handleSubmit = (event: any) => {
        const { supplyChain, userAccount } = this.props;
        const { roleAdmin, roleTitle } = this.state;
        supplyChain.addRole(roleTitle, new BigNumber(roleAdmin), { from: userAccount }).then(() => {
            // refresh page
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { roleTitle, roleAdmin } = this.state;
        return (
            <form name={DOMNames.newRoleForm} onSubmit={this.handleSubmit}>
                Add Role
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Role Name"
                    name={DOMNames.newRoleTitle}
                    value={roleTitle}
                    onChange={this.handleChange}
                />
                <br />
                <input
                    className="input"
                    type="text"
                    placeholder="Admin Role"
                    name={DOMNames.newRoleAdmin}
                    value={roleAdmin}
                    onChange={this.handleChange}
                />
                <br />
                <input type="submit" className="button is-primary" />
            </form>
        );
    }
}

export default NewRole;
