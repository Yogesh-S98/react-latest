import React, { Component } from "react";
import MyComponent from "./childhooks";
import { Button } from "react-bootstrap";

class Hooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            title: ''
        };
    }

    incrementCount = () => {
        this.setState({ count: this.state.count + 1 });
    }

    changeTitle = () => {
        this.setState({ title: 'New name' });
    }

    componentDidMount() {
        console.log('Parent Component did mount!');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('Parent Component did update!');
    }

    componentWillUnmount() {
        console.log('Parent Component will unmount!');
    }

    render() {
        return (
            <div>
                <h1>Parent Component</h1>
                <p>Count in Parent: {this.state.count}</p>
                <div>
                    {this.state.title}
                </div>
                <Button onClick={this.changeTitle}>
                    Change
                </Button>

                <button onClick={this.incrementCount}>Increment Count in Parent</button>

                {/* Passing count and incrementCount function to the child component as props */}
                <MyComponent
                    title={this.state.title}
                    count={this.state.count}
                    incrementCount={this.incrementCount} />
            </div>
        )
    }
}

export default Hooks;