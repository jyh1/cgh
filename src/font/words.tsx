import React from 'react'
import * as F from './fonts'
import * as T from './types'
import {SegmentObj, SegmentObjArray} from './curves'
import { Vec } from '../math/vector';

import { AssertionError } from 'assert';

export class CharacterObj {
    strokes: SegmentObjArray
    ascii: string
    unitWidth: number
    // startingSeg: SegmentObj // possibly connected to the previous character
    // endingSeg: SegmentObj // possibly connected to the next character
    constructor(character: T.Character, unitWidth: number){
        this.strokes = new SegmentObjArray (character.segments.map(s => new SegmentObj(s)))
        this.ascii = character.ascii
        this.unitWidth = unitWidth
        // if (this.segments.length > 0){
        //     this.startingSeg = this.segments[0]
        //     let i
        //     // find the first breaking point
        //     for (i = 0;; i += 1){
        //         if ((i == this.segments.length-1) || (this.segments[i].segment.isBreak)) break
        //     }
        //     this.endingSeg = this.segments[i]
        // }
        // else {
        //     throw new AssertionError
        // }

    }

    toSVGEle(key: number){
        return(
            <React.Fragment key={key}>
                {this.strokes.toSVGEle(this.unitWidth).map((e, i) => (<React.Fragment key={i}>{e}</React.Fragment>))}
            </React.Fragment>
        )
    }
    getType(): T.CharType {
        if (this.ascii <= 'z' && this.ascii >= 'a'){
            return "lower"
        }
        if (this.ascii <= 'Z' && this.ascii >= 'A'){
            return "upper"
        }
        return "punctuation"
    }
    translate(dv: Vec){
        this.strokes.mapPoints(v => v.add(dv))
    }
}

export class WordObj {
    characters: CharacterObj[]
    width: number
    constructor(cs: string, unitWidth: number, chrDist: number, pnctDist: number, slackness: number){
        let offset = new Vec(0, 0)
        this.characters = []
        for(let i = 0; i < cs.length; i+=1){
            const c = cs.charAt(i)
            if (c in F.defaultFont){
                const chr = new CharacterObj(F.defaultFont[c], unitWidth)
                chr.strokes.mapPoints(v => new Vec(v.x - v.y * slackness, v.y))
                const [min, max] = chr.strokes.getBoundingBox()
                offset.x -= min.x
                const chrType = chr.getType()
                if (chrType == "punctuation"){
                    offset.x += pnctDist
                }
                chr.strokes.mapPoints(v => v.add(offset))
                offset.x = offset.x + max.x + chrDist + (chrType == "punctuation"? pnctDist : 0)
                this.characters.push(chr)
            } else {
                console.log("Not found character: ", c)
            }
        }
        this.width = offset.x - chrDist
    }
    translate(dv: Vec){
        this.characters.forEach(c => c.translate(dv))
    }
    toSVGEle(key: number){
        return (
            <React.Fragment key={key}>
                {this.characters.map((c, i) => c.toSVGEle(i))}
            </React.Fragment>
        )
    }
}

export class ParagraphObj {
    words: WordObj[]

    constructor(txt: string, config: T.RenderConfig){
        let offset = new Vec(config.origin.x, config.origin.y)
        this.words = txt.split(" ").map( w => {
            const word = new WordObj(w, config.unitWidth, config.chrDist, config.pnctDist, config.slackness)
            if (word.width + offset.x > config.lineWidth){
                offset.x = config.origin.x
                offset.y += config.lineHeight
            }
            word.translate(offset)
            offset.x += word.width + config.wordDist
            return word
        })
    }

    toSVGEle(){
        return (
            <React.Fragment>
                {this.words.map((w, i) => w.toSVGEle(i))}
            </React.Fragment>
        )
    }
}