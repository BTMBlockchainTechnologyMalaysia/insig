import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { ISupplyChain, IRole } from '../../Common/CommonInterfaces';


// dom controller names
enum DOMNames {
    viewRoleForm = 'viewRoleForm',
    viewRoleId = 'viewRoleId',
    hasRoleForm = 'hasRoleForm',
    hasRoleAddress = 'hasRoleAddress',
    hasRoleId = 'hasRoleId',
}
// Component state
interface IViewRoleState {
    viewRoleId: string;
    hasRoleAddress: string;
    hasRoleId: string;
    hasRole: boolean;
    role: IRole;
}
// Component props
interface IViewRoleProps {
    roleid: string;
    supplyChain: ISupplyChain;
    userAccount: string;
}
class ViewRole extends Component<IViewRoleProps, IViewRoleState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            hasRole: undefined as any,
            hasRoleAddress: '',
            hasRoleId: '',
            role: undefined as any,
            viewRoleId: '',
        };
    }

    /**
     * @ignore
     */
    public componentWillReceiveProps = (nextProps: IViewRoleProps, nextState: IViewRoleState) => {
        const { supplyChain, roleid } = nextProps;
        if (supplyChain !== undefined && roleid !== undefined) {
            this.setState({ viewRoleId: roleid });
            supplyChain.roles(new BigNumber(roleid)).then((role) => {
                this.setState({ role });
            });
        }
    }

    /**
     * @ignore
     */
    public handleChange = (event: any) => {
        if (event.target.name === DOMNames.viewRoleId) {
            this.setState({ viewRoleId: event.target.value });
        } else if (event.target.name === DOMNames.hasRoleAddress) {
            this.setState({ hasRoleAddress: event.target.value, hasRole: undefined as any });
        } else if (event.target.name === DOMNames.hasRoleId) {
            this.setState({ hasRoleId: event.target.value, hasRole: undefined as any });
        }
    }

    /**
     * @ignore
     */
    public handleSubmit = (event: any) => {
        const { supplyChain } = this.props;
        const { hasRoleAddress, hasRoleId, viewRoleId } = this.state;
        // TODO: add input
        if (event.target.name === DOMNames.viewRoleForm) {
            supplyChain.roles(new BigNumber(viewRoleId)).then((role) => {
                this.setState({ role });
            });
        } else {
            supplyChain.hasRole(hasRoleAddress, new BigNumber(hasRoleId)).then((has) => {
                this.setState({ hasRole: has });
            });
        }
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        const { hasRole, hasRoleAddress, hasRoleId, viewRoleId, role } = this.state;
        let roleComp;
        let userHasRole;
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
        if (hasRole !== undefined) {
            if (hasRole === true) {
                userHasRole = <p>User {hasRoleAddress} is a bearer of the role id {hasRoleId}</p>;
            } else {
                userHasRole = <p>User {hasRoleAddress} is <b>NOT</b> a bearer of the role id {hasRoleId}</p>;
            }
        }
        return (
            <div>
                <form name={DOMNames.viewRoleForm} onSubmit={this.handleSubmit}>
                    View Role
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
                <form name={DOMNames.hasRoleForm} onSubmit={this.handleSubmit}>
                    Verify user has role
                    <br />
                    <input
                        className="input"
                        type="text"
                        placeholder="user address"
                        name={DOMNames.hasRoleAddress}
                        value={hasRoleAddress}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input
                        className="input"
                        type="text"
                        placeholder="role id"
                        name={DOMNames.hasRoleId}
                        value={hasRoleId}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input type="submit" className="button is-primary" />
                </form>
                {userHasRole}
            </div>
        );
    }
}

export default ViewRole;
