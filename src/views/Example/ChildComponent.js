import React from "react";

// class ChildComponent extends React.Component {

//     state = {
//         name: ''
//     }
//     handleChangeFirstName = (even) => {
//         this.setState({
//             firstName: even.target.value
//         })
//     }
//     handleChangeLastName = (even) => {
//         this.setState({
//             lastName: even.target.value
//         })
//     }
//     handleSubmit = (even) => {
//         even.preventDefault();
//         alert('click me')
//         console.log('>>> check data input: ', this.state)
//     }



//     render() {
//         console.log("check props", this.props)
//         let { name, age, arrJobs } = this.props
//         return (
//             <>
//                 <div className="job-list">
//                     {
//                         arrJobs.map((item, index) => {
//                             return (
//                                 <div key={item.id}>
//                                     {item.title} - {item.salary}
//                                 </div>
//                             )
//                         })
//                     }

//                 </div>
//             </>

//         )
//     }
// }


const ChildComponent = (props) => {
    console.log('>> ', props)
    let { name, age, arrJobs } = props
    return (
        <>
            <div className="job-list">
                {
                    arrJobs.map((item, index) => {
                        return (
                            <div key={item.id}>
                                {item.title} - {item.salary}
                            </div>
                        )
                    })
                }

            </div>
        </>
    )

}

export default ChildComponent;