import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as F from './character/fonts'
import * as C from './character/classes'
import {drawSegment} from './canvas/draw'
import { Vec } from './math/vector';

class App extends React.Component<{}, {curr: number}>{

  constructor(props: {}){
    super(props)
    this.state={curr: 30}
  }

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
    const cs = []
    const dv = new Vec(0, 0)
    const l = Object.keys(F.defaultFont).length
    for (let i = 0; i < l / 10 + 1; i ++){
      dv.x = 0
      for (let j = 0; j < 10; j ++){
        if (i * 10 + j >= l){
          break
        }
        const c = Object.keys(F.defaultFont)[i*10+j]
        cs.push((<React.Fragment key={i*10+j}>{new C.CharacterObj(F.defaultFont[c]).toSVGEle({unitWidth: 1, origin: dv})}</React.Fragment>))
        dv.x += 4
      }
      dv.y += 4
    }
    // const char = new C.CharacterObj(F.defaultFont[c])
    return (
      <div className="App">
        <div className="App">
          {/* <canvas ref="canvas" width={640} height={425} /> */}
          <svg viewBox="-2 -2 50 50" width={"100%"} height={"100%"} onClick={() => this.setState(s => ({curr: s.curr+1}))}>
            {cs}
          </svg>
        </div>
      </div>
    );
  }

}

export default App;
