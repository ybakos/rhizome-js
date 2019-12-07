import React, { Component } from 'react'
import Chat from './Chat'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: 'temporary',
      currentId: 'blah',
      currentScreen: 'chat'
    }
  }

  render() {
    return <Chat currentId={this.state.currentId}/>
  }
}

export default App
