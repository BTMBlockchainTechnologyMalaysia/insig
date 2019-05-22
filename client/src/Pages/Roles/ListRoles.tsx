import React, { Component } from 'react';


// dom controller names
enum DOMNames {

}
// Component props
interface ILIstRolesProps {
    rolesList: Array<{ description: string, index: number }>;
}
class ListRoles extends Component<ILIstRolesProps, {}> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
    }

    /**
     * @ignore
     */
    public render() {
        const { rolesList } = this.props;
        return (
            <div>
                Existing roles
                <br />
                <ol type="1">
                    {rolesList.map((r) => <li key={r.index}>{r.description}</li>)}
                </ol>
            </div>
        );
    }
}

export default ListRoles;
