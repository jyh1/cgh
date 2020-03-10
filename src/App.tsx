import React from 'react';
import './App.css';
import "semantic-ui-css/semantic.min.css"
import * as T from './font/types'
import {CGH} from './components/cgh'
import {Input} from './components/input'

const defaultConfig =
  {originX: 0
    , originY: 0
    , unitWidth: 0.7
    , chrDist: 0
    , wordDist: 0.6
    , lineWidth: 40
    , lineHeight: 2
    , pnctDist: 0.2
    , slackness: 0.2
    , connectProb: 0.5
    , faintedProb: 0.3
    , fontSize: 0.5
    , letterRandom: 0.02
    , yRandom: 0.03
  }

class App extends React.Component<{}, {config: T.RenderConfig, text: string}>{

  constructor(props: {}){
    super(props)
    this.state = {config: defaultConfig, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
  }

  setText(txt: string){
    this.setState(s => ({...s, text: txt}))
  }

  setConfig(k: keyof T.RenderConfig, val: number){
    this.setState(s => {let newsconfig={...s.config}; newsconfig[k]=val; return {...s, config: newsconfig}})
  }

  render(){
    const {config, text} = this.state
    return (
      <div className="App">
          <div className="Config">
            <Input text={text} setText={this.setText.bind(this)} config={config} setConfig={this.setConfig.bind(this)} />
          </div>
          <div className= "Display">
            <CGH config={config} text={text} />
          </div>

      </div>
    );
  }

}

export default App;
