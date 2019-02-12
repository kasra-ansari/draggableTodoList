import React, {Component} from 'react';
import {connect} from "react-redux";
import {setData} from "../redux/app/actions/index";
import "../style.css";

const mapStateToProps = (state) => (
    {
        data: state.app.data
    }
)

const mapDispatchToProps = (dispatch) => (
    {
        setDataAction: (data) => dispatch(setData(data)),
    }
);

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            list: this.props.data.list || {},
        };

        this.listSwap = this.props.data.swap || {};
    }

    idGenerator() {
        let S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            list: Object.assign({}, this.state.list, {
                [this.idGenerator()]: {
                    value: this.state.value,
                    complete: false
                }
            })
        }, () => {
            this.setState({value: ''});
            this.listSwap = this.state.list;
            this.props.setDataAction({list: this.state.list, swap: this.listSwap})
        })

    }

    handleChange = e => {
        if (e.target.value.length > 0) {
            this.setState({
                value: e.target.value
            })
        }

    }

    handleDelete = (e, id) => {
        e.preventDefault();

        let currentState = this.state.list;
        delete currentState[id];

        this.setState({
            list: currentState
        }, () => {
            this.listSwap = this.state.list;
            this.props.setDataAction({list: this.state.list, swap: this.listSwap});
        })
    }

    handleDone = (e, id) => {
        e.preventDefault();

        let currentState = this.state.list;
        currentState[id] = Object.assign({}, currentState[id], {complete: true})

        this.setState({
            list: currentState
        }, () => {
            this.props.setDataAction({list: this.state.list, swap: this.listSwap})
        })
    }

    handleFilter = (e, operator) => {
        e.preventDefault();

        switch (operator) {
            case 'active':
                if (Object.keys(this.listSwap).length > 0) {
                    const filtered = Object.keys(this.listSwap).filter(item => !this.listSwap[item].complete);
                    this.filterRender(filtered);
                }
                break;
            case 'complete':
                if (Object.keys(this.listSwap).length > 0) {
                    const filtered = Object.keys(this.listSwap).filter(item => this.listSwap[item].complete);
                    this.filterRender(filtered);
                }
                break;
            default:
                this.setState({
                    list: this.listSwap
                })
        }
    }

    filterRender = ids => {
        let obj = {};
        ids.length > 0 && ids.map(item => {
            obj[item] = this.listSwap[item]
        });

        this.setState({
            list: obj
        })
    }

    handleRemoveComplete = e => {
        e.preventDefault();
        this.setState({
            list: this.listSwap
        }, () => {
            let activeState = {}
            Object.keys(this.state.list).length > 0 && Object.keys(this.state.list).map(item => {
                if (!this.state.list[item].complete) {
                    activeState[item] = this.state.list[item]
                }
            })

            this.setState({
                list: activeState
            }, () => {
                this.listSwap = this.state.list;
                this.props.setDataAction({list: this.state.list, swap: this.listSwap})
            })
        })
    }

    render() {
        const activeNumber = () => {
            let number = 0;
            Object.keys(this.state.list).length > 0 && Object.keys(this.state.list).map(id => {
                if (!this.state.list[id].complete) number += 1;
            })

            return number;
        }
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        task:
                        <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" disabled={!this.state.value.length > 0}/>
                </form>
                <div className="list">
                    <ul>
                        {
                            Object.keys(this.state.list).length > 0 && Object.keys(this.state.list).map((item, index) => {
                                return (
                                    <li style={{textDecoration: this.state.list[item].complete ? 'line-through' : 'initial'}} key={index}><span>{this.state.list[item].value}</span>
                                     <span>
                                         <a href="" onClick={e => this.handleDelete(e, item)}>delete</a>
                                         {
                                             !this.state.list[item].complete &&
                                             <a href="" onClick={e => this.handleDone(e, item)}>done</a>
                                         }
                                     </span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="operator">
                    <ul>
                        <li><a href="" onClick={e => this.handleFilter(e, 'all')}>All</a></li>
                        <li><a href="" onClick={e => this.handleFilter(e, 'active')}>Active</a></li>
                        <li><a href="" onClick={e => this.handleFilter(e, 'complete')}>Complete</a></li>
                    </ul>
                    <div className="active">
                        <span>{activeNumber()}</span>
                        number active
                    </div>
                    <div>
                        <a href="" onClick={this.handleRemoveComplete}>remove complete task</a>
                    </div>
                </div>
            </div>
        )
    }
}