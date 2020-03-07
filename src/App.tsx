import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as F from './character/fonts'
import * as C from './character/classes'
import {drawSegment} from './canvas/draw'

class App extends React.Component<{}, {}>{
  componentDidMount() {
    // const canvas = this.refs.canvas as HTMLCanvasElement
    // const ctx = canvas.getContext("2d")
    // const char = new C.CharacterObj(F.defaultFont['d'])
    // if (ctx){
    //   ctx.beginPath()
    //   char.segments.forEach(s => drawSegment(ctx, s))
    // }
  }
  render(){
    const char = new C.CharacterObj(F.defaultFont['E'])
    return (
      <div className="App">
        <div className="App">
          {/* <canvas ref="canvas" width={640} height={425} /> */}
          <svg viewBox="-5 -5 10 10" width={640} height={425}>
            {char.toSVGEle(1)}
          </svg>
        </div>
      </div>
    );
  }

}

export default App;
