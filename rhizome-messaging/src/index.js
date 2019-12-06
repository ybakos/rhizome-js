import React from 'react'
import ReactDOM from 'react-dom'
import { runningRhizome } from 'rhizome'
import App from './App'
import './index.css'

(async function(){
 

const rhizome = await runningRhizome();

ReactDOM.render(<App rhizome={rhizome} />, document.getElementById('app'))
})();
