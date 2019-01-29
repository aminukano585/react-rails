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

```javascript
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

## Step: 2
Let's create a database model, I'll create one for User. Shutdown the server, and make sure you navigate back to the app's root directory.
```
cd ..
rails generate scaffold user name:string location:string
```

Next, migrate the database and prepare it for the users.
```
rails db:migrate
```

Get into `console` and use it to add some users
```
rails console

User.create(name: "Aminu", location: "Kano, Nigeria")
User.create(name: "Prosper", location: "Lagos, Nigeria")
```

Exit the console and configure routes next. Let's put everything behind "api" namespace.

Open `routes.rb` file located inside `config` folder, and replace it's content with the one below:

```ruby
Rails.application.routes.draw do
  scope '/api' do 
    resources :users 
  end
end
```

Next, navigate into `client` folder and install proxy
```
yarn add http-proxy-middleware
```

In the same `client` folder, create `setupProxy.js` file and add the following code in it:

```javascript
import proxy from 'http-proxy-middleware';

module.exports = function(app) {
  app.use(proxy('/api', {
    target: 'http://localhost:3001'
  }));
}
```

Using the proxy, we will have our api server running on port 3001, and the React front-end running on port 3000.

Save everything, and start both servers:

For the Back-End, make sure you're in the root directory and run
```
rails server -p 3001
```

For the Front-End, open another terminal and navigate into `client` folder, then run
```
npm start
``` 

Now, Back-End api is here `http://localhost:3001/api/users`

And, Front-End is here `http://localhost:3000/`

## Step: 3
Let's use `fetch` to consume the api, but first let's solve some potential issues with `cors`. We will use `rack-cors` gem to workaround that issue.

Open `Gemfile` file in the root directory, and find the line below:

```ruby
# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'
```

Make sure you uncomment the second line, to enable `rack-cors`.

Open `application.rb` file located inside `config` folder.

Locate a module similar to this one in it:
```ruby
module ReactRails
  class Application < Rails::Application
```

In the module add the code below, just below `config.api_only = true` line:
```ruby
config.middleware.insert_before 0, Rack::Cors do
  allow do
      origins '*'
      resource '*', :headers => :any, :methods => [:get, :post, :options]
    end
end
```

In the `client` folder, open the `App.js` file located inside `src` folder, and edit the `getUsers` method to look like the one below:
```javascript
getUsers() {
  fetch('http://localhost:3001/api/users')
    .then(res => res.json())
    .then(data => {
      this.setState({
        siteUsers: JSON.stringify(data)
      });
    })
}
```

Save everything and make sure both servers were running. Navigate to `http://localhost:3000` to access the Front-End. Click the `View Site Users` and voila!! 💥 the Rails api response is showing in the React application.

## Step: 4
Let's make starting the app easier using single command.

Make sure you have `foreman` installed on your system. If not install it via apt repo
```
sudo apt install ruby-foreman
```

In `Gemfile` add `gem foreman` right above `group :development, :test do`.

Run `bundle install`.

Create `Procfile` in the root directory and add the following code:
```
web: sh -c 'cd client && PORT=3000 npm start'
api: rails server -p 3001
```

To start the application next time just run
```
foreman start
```

**Thank You**

_Adapted from [this](https://medium.com/@nick.hartunian/rails-5-api-create-react-app-full-stack-heaven-2b2160b5ce6b)_