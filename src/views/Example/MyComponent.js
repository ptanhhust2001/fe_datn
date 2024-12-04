import React from "react";
import ChildComponent from "./ChildComponent";

class MyComponent extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        arrjobs: [
            {
                id: '1',
                title: 'developer',
                salary: '500 $'
            },
            {
                id: '2',
                title: 'tester',
                salary: '400 $'
            },
            {
                id: '3',
                title: 'PM',
                salary: '1000 $'
            }
        ]
    }
    handleChangeFirstName = (even) => {
        this.setState({
            firstName: even.target.value
        })
    }
    handleChangeLastName = (even) => {
        this.setState({
            lastName: even.target.value
        })
    }
    handleSubmit = (even) => {
        even.preventDefault();
        alert('click me')
        console.log('>>> check data input: ', this.state)
    }



    render() {
        return (
            <>
                <form >
                    <label htmlFor="fname">First name:</label><br />
                    <input
                        type="text"
                        value={this.state.firstName}
                        onChange={(even) => this.handleChangeFirstName(even)}
                    /><br />
                    <label htmlFor="lname">Last name:</label><br />
                    <input
                        type="text"
                        value={this.state.lastName}
                        onChange={(even) => this.handleChangeLastName(even)}
                    /><br /><br />
                    <input
                        type="submit"
                        value="Submit"
                        onClick={(even) => this.handleSubmit(even)}
                    />
                </form>
                <ChildComponent
                    name={this.state.firstName}
                    age={'25'}
                    arrJobs={this.state.arrjobs}
                />

            </>

        )
    }
}
export default MyComponent;