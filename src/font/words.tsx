import React from 'react'
import * as F from './fonts'
import * as T from './types'
import {SegmentObj, SegmentObjArray, Bezier} from './curves'
import { Vec } from '../math/vector';
import {norm} from '../math/random'

import { AssertionError } from 'assert';

export class CharacterObj {
    strokes: SegmentObjArray
    ascii: string
    unitWidth: number
    startingSeg: SegmentObj
    endingSeg: SegmentObj
    faintedProb: number
    constructor(character: T.Character, config: T.RenderConfig){
        this.strokes = new SegmentObjArray (character.segments.map(s => new SegmentObj(s.curve, s.initWidth, s.closingWidth)))
        this.ascii = character.ascii
        this.unitWidth = config.unitWidth
        this.faintedProb = config.faintedProb
        const segs = this.strokes.segments
        if (character.segments.length > 0){
            this.startingSeg = segs[0]
            let i
            // find the first breaking point
            for (i = 0;; i += 1){
                if ((i == segs.length-1) || (character.segments[i].isBreak)) break
            }
            this.endingSeg = segs[i]
        }
        else {
            throw new AssertionError
        }

        this.strokes.mapPoints(v => v.scale(config.fontSize))

    }

    toSVGEle(key: number){
        return(
            <React.Fragment key={key}>
                {this.strokes.toSVGEle(this.unitWidth, this.faintedProb).map((e, i) => (<React.Fragment key={i}>{e}</React.Fragment>))}
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
        return "symbol"
    }
    translate(dv: Vec){
        this.strokes.mapPoints(v => v.add(dv))
    }

    removeFirst(){
        this.strokes.segments = this.strokes.segments.slice(1)
        delete this.startingSeg
    }

    merge(next: CharacterObj){
        const s1 = this.endingSeg
        const s2 = next.startingSeg
        const s1points = s1.curve.points
        const s2points = s2.curve.points
        const newcurve = new Bezier([s1points[0], s1points[1], s2points[2], s2points[3]])
        const iW = s1.width(0)
        const eW = s2.width(1)
        s1.curve = newcurve
        s1.width = connectedWidth(iW, eW)
        s1.connecting = true
        next.removeFirst()
    }

    perturb(scale: number){
        const center = this.strokes.estimateCenter()
        const segments = this.strokes.segments
        const perturbPoint = (p: Vec) => {
                const diff = p.sub(center)
                return diff.scale(scale * norm())
            }
        segments[0].curve.moveP0(perturbPoint(segments[0].curve.points[0]))
        for(let i = 0; i < segments.length; i += 1){
            const dv = perturbPoint(segments[0].curve.points[3])
            segments[i].curve.moveP3(dv)
            if (i + 1 < segments.length){
                segments[i+1].curve.moveP0(dv)
            }
        }
    }
}

function connectedWidth(st: number, en: number){
    const mid = (st > en? en : st) * 0.1
    const tmid = 0.6
    return (t: number) => (t < tmid? st + (t/tmid) * (mid-st) : mid + ((t-tmid)/(1-tmid)) * (en-mid))
}

export class WordObj {
    characters: CharacterObj[]
    width: number
    constructor(cs: string, config: T.RenderConfig){
        let offset = new Vec(0, 0)
        const {chrDist, pnctDist, slackness} = config
        this.characters = []
        for(let i = 0; i < cs.length; i+=1){
            const c = cs.charAt(i)
            if (c in F.defaultFont){
                const chr = new CharacterObj(F.defaultFont[c], config)
                chr.perturb(config.letterRandom)
                chr.strokes.mapPoints(v => new Vec(v.x - v.y * slackness, v.y))
                const [min, max] = chr.strokes.getBoundingBox()
                offset.x -= min.x
                const chrType = chr.getType()
                if (chrType == "symbol"){
                    offset.x += pnctDist
                }
                chr.strokes.mapPoints(v => v.add(offset))
                offset.x = offset.x + max.x + chrDist + (chrType == "symbol"? pnctDist : 0)
                this.characters.push(chr)
            } else {
                console.log("Not found character: ", c)
            }
        }

        this.width = offset.x - chrDist

        // trying to connect adjacent character
        for(let i = 0; i < this.characters.length - 1; i += 1){
            const curr = this.characters[i]
            const next = this.characters[i + 1]
            if ((curr.getType() == "lower") && (next.getType() == "lower")){
                curr.merge(next)
            }
        }
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
        let yrand = 0
        this.words = txt.split(" ").map( w => {
            const word = new WordObj(w, config)
            if (word.width + offset.x > config.lineWidth){
                offset.x = config.origin.x
                offset.y += config.lineHeight
            }
            yrand = yrand * 0.8 + norm() * config.yRandom
            word.translate(offset.add(new Vec(0, yrand)))
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