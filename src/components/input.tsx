import React from 'react';

import * as T from '../font/types'

const names: {[k: string]: string} = {
      unitWidth: "Boldness"
    // , chrDist: "Chr Dist"
    // , wordDist: "Word Dist"
    // , lineWidth: "Line Width"
    // , lineHeight: "Line Height"
    , slackness: "Slcakness"
    , connectProb: "Connecting"
    , fontSize: "Font Size"
    , letterRandom: "Pertubation"
    , yRandom: "Aligning"
}


type Props = {
      setText: (s: string) => void
    , text: string
    , config: T.RenderConfig
    , setConfig: (key: keyof T.RenderConfig, val: number) => void
    }

export class Input extends React.Component<Props, {}>{
    constructor(props: Props){
        super(props)
        this.state = {txt: ""}
    }
    render(){
        const {text, setText, setConfig, config} = this.props
        return(
            <form className="ui form">
                    <h4 className="ui dividing header">Configurations</h4>
                        <div className="fields" style={{flexWrap: "wrap"}}>
                            {Object.entries(config).map(v => v[0] in names ?
                                <ConfigField name={names[v[0]] as string} value={v[1]} setConfig={newv => setConfig(v[0] as any, newv)} />
                                : <React.Fragment key={v[0]}/>)
                            }
                        </div>
                    <h4 className="ui dividing header">Input Text</h4>
                    <div className="field">
                        <textarea style={{width: "100%"}} rows={20} value={text} onChange={e => {setText(e.target.value)}} />
                    </div>

            </form>
        )
    }
}

type FieldProps = {name: string, value: number, setConfig: (val: number) => void}

class ConfigField extends React.Component<FieldProps, {}>{
    render(){
        const {name, value, setConfig} = this.props
        return (
            <div className="field Field" key={name}>
                <label>{name}</label>
                <input type="number" step="0.02" value={value} onChange={e => setConfig(e.target.value as unknown as number)} />
            </div>
        )
    }
}