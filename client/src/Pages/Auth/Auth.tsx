import React, { Component } from 'react';
import { UPortButton } from 'rimble-ui';
import getUport from '../../utils/getUport';

import '../../main.scss';
import './auth.scss';
import insigLogo from './insigv1trans.png';

import Navbar from '../../Components/Navbar/Navbar';

/**
 * Define class interface
 */
interface IAuthState {
    logged: boolean;
    uport: any;
}
/**
 * Action class
 */
class Auth extends Component<{}, IAuthState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            logged: undefined as any,
            uport: getUport(),
        };
    }

    /**
     * @ignore
     */
    public componentDidMount() {
        const { uport } = this.state;
        uport.loadState();
        this.setState({ logged: (uport.state.name !== undefined) });
    }

    public handleLogout = () => {
        const { uport } = this.state;
        uport.logout();
    }

    public handleLogin = () => {
        const { uport } = this.state;
        // Request credentials to login
        const req = {
            notifications: true,
            requested: ['name', 'country'],
        };
        uport.requestDisclosure(req);
        uport.onResponse('disclosureReq').then(() => {
            uport.sendVerification({
                claim: { User: { Signed: new Date() } },
            });
        });
    }

    /**
     * @ignore
     */
    public render() {
        const { logged } = this.state;
        const centerStyle: any = {
            textAlign: 'center',
        };
        let button;
        if (logged) {
            button = (<button className="button is-primary is-large" onClick={this.handleLogout} hidden={!logged}>
                Logout
            </button>);
        } else {
            button = (<UPortButton.Solid onClick={this.handleLogin}>Connect with uPort</UPortButton.Solid>);
        }
        return (
            <div>
                <Navbar />
                <main style={centerStyle}>
                    <img src={insigLogo} />
                    <br />
                    {button}
                </main>
            </div>
        );
    }
}

export default Auth;
