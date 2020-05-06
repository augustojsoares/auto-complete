import React, { Component } from 'react';

import { AutoComplete } from './AutoComplete';
import { hints } from './hints';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AutoComplete hints={hints} />
      </div>
    );
  }
}

export default App;
