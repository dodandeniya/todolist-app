import React, { Component } from "react";
import TodoItems from "./TodoItems";
import "./TodoList.css";
import Promise from "bluebird";

const AppDAO = require('./db/dao').default
const Crud = require('./db/crud').default

class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };

        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.setDatabase();
        this.loadData();
    }

    setDatabase() {
        this.dao = new AppDAO('./database.sqlite3');
        this.db = new Crud(this.dao);
        this.db.createTable()
            .then(() => {
                console.log('db is created...')
            })
            .catch((err) => {
                console.log('Error: ')
                console.log(JSON.stringify(err))
            });
    }

    loadData() {
        var getAllData = this.db.getAll();

        Promise.all(getAllData).then((data) => {
            console.log(data);
            this.loadItem(data);
        })

    }

    loadItem(data) {
        Object.keys(data).forEach((item) => {
            var newItem = {
                text: data[item].ToDo,
                key: data[item].DT
            };

            this.setState((prevState) => {
                return {
                    items: prevState.items.concat(newItem)
                };
            });
        });
    }

    addItem(e) {
        if (this._inputElement.value !== "") {
            var newItem = {
                text: this._inputElement.value,
                key: Date.now()
            };

            this.setState((prevState) => {
                return {
                    items: prevState.items.concat(newItem)
                };
            });

            this.db.insert(newItem.text, newItem.key);
            this._inputElement.value = "";
        }

        console.log(this.state.items);

        e.preventDefault();
    }

    deleteItem(key) {
        var filteredItems = this.state.items.filter(function (item) {
            return (item.key !== key);
        });

        this.setState({
            items: filteredItems
        });

        this.db.delete(key);
    }

    render() {
        return (
            <div className="todoListMain">
                <div className="header">
                    <form onSubmit={this.addItem}>
                        <input ref={(a) => this._inputElement = a}
                            placeholder="enter task">
                        </input>
                        <button type="submit">add</button>
                    </form>
                </div>
                <TodoItems entries={this.state.items} delete={this.deleteItem} />
            </div>
        );
    }
}

export default TodoList;