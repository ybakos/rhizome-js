import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
// const rhizome = require('rhizome');
(async function(){
  // const ipfs = await new IPFSAPI('127.0.0.1', 5001);
  // const redis = Redis.createClient({host: 'localhost'});

ReactDOM.render(<App rhizome={rhizome} />, document.getElementById('app'))
})();
