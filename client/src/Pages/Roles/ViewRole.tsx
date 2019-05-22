import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { IRBAC, IRole } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    viewRoleForm = 'viewRoleForm',
    viewRoleId = 'viewRoleId',
}
// Component state
interface IViewRoleState {
    viewRoleId: string;
    role: IRole;
}
// Component props
interface IViewRoleProps {
    rbac: IRBAC;
    userAccount: string;
}
class ViewRole extends Component<IViewRoleProps, IViewRoleState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            role: undefined as any,
            viewRoleId: '',
        };
    }

    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.viewRoleId) {
            this.setState({ viewRoleId: event.target.value });
        }
    }

    public handleSubmit = (event: any) => {
        const { rbac, userAccount } = this.props;
        const { viewRoleId } = this.state;
        // TODO: add input
        rbac.roles(new BigNumber(viewRoleId)).then((role) => {
            this.setState({ role });
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { viewRoleId, role } = this.state;
        let roleComp;
        if (role !== undefined) {
            roleComp = (
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                        Role Id {viewRoleId}
                        </p>
                        <a href="#" className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className="fas fa-angle-down" aria-hidden="true" />
                            </span>
                        </a>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <p><b>Description</b> {role.description}</p>
                            <p><b>Admin</b> {role.admin.toNumber()}</p>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <form name={DOMNames.viewRoleForm} onSubmit={this.handleSubmit}>
                    Remove Bearer
                    <br />
                    <input
                        className="input"
                        type="text"
                        placeholder="role id"
                        name={DOMNames.viewRoleId}
                        value={viewRoleId}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input type="submit" className="button is-primary" />
                </form>
                {roleComp}
            </div>
        );
    }
}

export default ViewRole;
