import React, { Component } from 'react';

class MyComponent extends Component {
    componentDidMount() {
        console.log('Child Component did mount!');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('value change', prevProps, prevState);
        console.log('Child Component did update!');
    }

    componentWillUnmount() {
        console.log('Child Component will unmount!');
    }

    render() {
        const { count, incrementCount, title } = this.props;

        return (
            <div>
                <h2>Child Component</h2>
                <p>Count in Child: {count}</p>
                <div>
                    {title}
                </div>
                <button onClick={incrementCount}>Increment Count in Child</button>
            </div>
        );
    }
}

export default MyComponent;
