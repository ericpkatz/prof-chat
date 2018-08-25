import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component{
  constructor(){
    super();
    this.state = {
      messages: [],
      text: ''
    };
    this.onChange = this.onChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  sendMessage(){
    const message = {
      text: this.state.text,
      id: Math.random()
    };
    this.ws.send(JSON.stringify({ message }));
    this.setState({ messages: [ ...this.state.messages, message], text: '' });
  }
  onChange(ev){
    this.setState({ text: ev.target.value });
  }
  componentDidMount(){
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.addEventListener('message', (obj) => {
      const data = JSON.parse(obj.data);
      if(data.message){
        this.setState({ messages: [ ...this.state.messages, data.message ]});
      }
      if(data.messages){
        this.setState({ messages: data.messages });
      }
    });
  }
  render(){
    const { text, messages } = this.state;
    const { onChange, sendMessage } = this;
    return (
      <div>
        <input value={ text } onChange = { onChange }/>
        <button disabled={ !text } onClick={ sendMessage }>Post</button>
        <ul>
          {
            messages.map( message => <li key={ message.id }>{ message.text }</li>)
          }
        </ul>
      </div>
    );
  }
}

const root = document.getElementById('root');
render(<App/>, root);
