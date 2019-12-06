import React, { Component } from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ConversationList from './ConversationList'

class Chat extends React.Component {
  state = {
    currentUser: null,
    currentRoom: {},
    messages: []
  }

  async componentDidMount() {
    console.log(await this.props.rhizome.retrieveLinks());
    
  }

  onSend = text => {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id
    })
  }

  render() {
    return (
      <div className="wrapper">
        <div>
          <ConversationList
            currentUser={this.state.currentUser}
            users={this.state.currentRoom.users}
          />
        </div>
        <div className="chat">
          <MessageList messages={this.state.messages} />
          <SendMessageForm onSend={this.onSend} />
        </div>
      </div>
    )
  }
}

export default Chat
