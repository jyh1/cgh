import React from 'react';

import {ParagraphObj} from '../font/words'
import * as T from '../font/types'

type Prop = {config: T.RenderConfig, text: string}

export class CGH extends React.Component<Prop, {}>{
    constructor(props: Prop){
        super(props)
    }

    render(){
        const paragraph = new ParagraphObj(this.props.text, this.props.config)
        return (
            <svg viewBox="-2 -2 50 50" width={"100%"} height={"100%"}>
                {paragraph.toSVGEle()}
            </svg>
        )
    }
}