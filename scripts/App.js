import React, {Component} from 'react';
import DragSortableList from 'react-drag-sortable';
import './style.css';

const placeholder = (
  <div className="placeholderContent"> DROP HERE ! </div>
);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      items: [{
        content: 'kasra',
        key: Date.now()
      }, {
        content: 'ansari',
        key: Date.now() + 1
      }],
    };
  };


  handleSubmit = e => {
    this.textInput.focus();
    const itemArray = this.state.items;

    if (this.textInput.value !== '') {
      itemArray.push(
        {
          content: this.textInput.value,
          key: Date.now(),
        }
      );
      this.setState({
        items: itemArray
      });

      this.textInput.value = '';
    }
  };

  removeItem = (e) => {
    let count = 0;
    const id = e.target.getAttribute('data-id');
    const { items } = this.state;

    const filterItems = (item) => {
      if (item.key == id) {
        count++;
        return false;
      } else {
        return true;
      }
    };

    // filter selected item
    const newArr = items.filter(filterItems);
    // set new array to state
    this.setState({items: newArr});

  };

  renderText = (item) => {
    return {
      content: (
        <div className="item" key={item.key}>
          <span className="no-drag">{item.content}</span>
          <span className="no-drag fa fa-trash-o" data-id={item.key} onClick={this.removeItem}/>
          <span className="drag"><i className="fa fa-bars"/></span>
        </div>),
      // classes: ["bigBang", "kasra"],
      key: item.key
    }
  };

  componentDidMount() {
    this.textInput.focus();
  }

  onSort = (sortList) => {
    const arr = [];
    for (let i in sortList) {
      delete sortList[i].rank;
      delete sortList[i].id;

      arr.push({
        content: sortList[i].content.props.children[0].props.children,
        key: sortList[i].key
      });
    }

    this.setState({items: arr});
  };


  handleInput = e => {
    if (e.keyCode == 13) {
      this.handleSubmit(e)
    }
    if (e.target.value.length > 0) {

      this.setState({disabled: false});
    } else {
      this.setState({disabled: true});
    }
  };

  handleTextarea = e => {
    const val = e.target.value

    setTimeout(() => {
      this.textareaInput.value = val;
    }, 1);
  };

  textAreaKeyup = e => {
    if (e.keyCode == 13) {
      try {
        JSON.parse(e.target.value)

        this.setState({
          items: JSON.parse(e.target.value)
        })
        return true;
      } catch (e) {
        alert("JSON is not valid");
        return false;
      }
    }
  }

  removeAll = () => {
    this.setState({
      items: []
    });
  }



  render() {
    const todoEntires = this.state.items;
    const todoList = todoEntires.map(this.renderText);

    return (
      <div className="container">
        <div className="input-group">
          <input ref={(input) => {
            this.textInput = input;
          }} onKeyUp={this.handleInput} type="text"/>
          <button disabled={this.state.disabled} onClick={this.handleSubmit}>submit</button>
        </div>
        <div className="main-list">
          <DragSortableList
            items={todoList}
            moveTransitionDuration={0.3}
            type="vertical"
            placeholder={placeholder}
            onSort={this.onSort}
          />
          <button className="remove-all" onClick={this.removeAll}>Remove all</button>
        </div>
        <textarea cols="50" rows="20" ref={(input) => {
          this.textareaInput = input
        }} value={JSON.stringify(todoEntires)}
                  onChange={this.handleTextarea}
                  onKeyUp={this.textAreaKeyup}/>
        <span className="note">Note: You can add valid json with this structure and Enter to add to list</span>
      </div>
    );
  }
}
