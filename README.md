# Rails v5 API and CRA

A definite guide on using Rails api with React application created using `create-react-app`. I will assume that you have `rails` and `create-react-app` installed.

## Step: 1
Create a new Rails project
```
rails new myapp --api
```

Navigate into `myapp` and install React app in it
```
cd myapp/
create-react-app client
```

To make sure everything works in the front-end
```
cd client/
npm start
```

Hopefully you see the spinning symbol of React awesomeness.

Next, shutdown the server and open `App.js` file located inside client's `src` folder, and replace it's content with the code below:
```
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
    this.setState({
      siteUsers: 'No one is here yet'
    });
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
```

Test the front-end again, make sure nothing breaks