import React, { Component } from 'react'
import Chat from './Chat'

class App extends Component {
  constructor(props) {
    super(props);
    this.rhizome = this.props.rhizome;
    this.state = {
      currentUsername: 'temporary',
      currentId: this.rhizome.publicKey,
      currentScreen: 'chat'
    }
  }

  render() {
    return <Chat currentId={this.state.currentId} rhizome={this.rhizome} />
  }
}

export default App
