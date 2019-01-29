import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      siteUsers: ''
    };

    this.getUsers = this.getUsers.bind(this);
  }

  getUsers() {
    fetch('http://localhost:3001/api/users')
      .then(res => res.json())
      .then(data => {
        this.setState({
          siteUsers: JSON.stringify(data)
        });
      })
  }

  render() {
    return (
      <div className="App">
        <button 
          onClick={this.getUsers}
          style={{ marginTop: '45vh' }}
        >
          View Site Users
        </button>
        <p>{this.state.siteUsers}</p>
      </div>
    );
  }
}