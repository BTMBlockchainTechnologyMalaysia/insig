import React, { Component } from 'react';


// dom controller names
enum DOMNames {
}
// Component state
interface IMintState {
}
// component properties
interface IMintProps {
}
class Mint extends Component<IMintProps, IMintState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
    }

    /**
     * Handle all changes in inputs, selects
     */
    public handleChange = (event: any) => {
    }

    /**
     * Handle any submit button
     */
    public handleSubmit = (event: any) => {
        event.preventDefault();
    }

    /**
     * @ignore
     */
    public render() {
        return (
            <div>
            </div>
        );
    }
}

export default Mint;
