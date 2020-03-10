import React from 'react';
import './App.css';
import { Vec } from './math/vector'
import {ParagraphObj} from './font/words'

const defaultConfig =
  {origin: new Vec(0, 0)
    , unitWidth: 0.7
    , chrDist: 0
    , wordDist: 0.6
    , lineWidth: 40
    , lineHeight: 2
    , pnctDist: 0.2
    , slackness: 0.3
    , connectProb: 0.5
    , faintedProb: 0.3
    , fontSize: 0.5
    , letterRandom: 0.015
    , yRandom: 0.05
  }

class App extends React.Component<{}, {curr: number}>{

  constructor(props: {}){
    super(props)
    this.state={curr: 30}
  }

  render(){
    const txt = "EEEEE BENTO An easy place to start is by drawing a shape. We will start with a rectangle (the same type that could be more easily made with a <rect> element). It's composed of horizontal and vertical lines only:"
    const word = new ParagraphObj(txt, defaultConfig)
    return (
      <div className="App">
        <div className="App">
          <svg viewBox="-2 -2 50 50" width={"100%"} height={"100%"} onClick={() => this.setState(s => ({curr: s.curr+1}))}>
            {word.toSVGEle()}
          </svg>
        </div>
      </div>
    );
  }

}

export default App;
