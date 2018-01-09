import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import List from './components/GameList/list';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">GDQ Notifier</h1>
        </header>
        <List />
      </div>
    );
  }
}

export default App;
