import React from 'react'

import * as T from './types'
import { Vec } from '../math/vector';
import { Matrix } from '../math/matrix';

const SampleRate = 3
const dt = 1 / (SampleRate + 1)

export type RenderConfig = {origin: Vec, unitWidth: number}

export class Bezier {
    points: T.Quadruple<Vec>

    constructor(points: T.Quadruple<Vec>){
        this.points = points
    }

    x(i: number){
        return this.points[i].x
    }
    y(i: number){
        return this.points[i].y
    }

    translate(dv: Vec){
        this.points = this.points.map(p => p.add(dv)) as T.Quadruple<Vec>
    }

    // fit for Bezier curve with the same slope at two ends, and distance from the original curve determined by thickness
    solve(thickness: (t: number) => number){
        const newcurve = (t: number) => (this.getPoint(t).add(this.getDeriv(t).rotate().normalized().scale(0.5 * thickness(t))))
        const q1 = this.points[1].sub(this.points[0])
        const q2 = this.points[2].sub(this.points[3])
        const i0 = newcurve(0)
        const i3 = newcurve(1)
        let points: number[][] = []
        let X: number[][] = []
        for (let i = 1; i <= SampleRate + 0.001; i += 1){
            const t = i * dt
            const p = newcurve(t).sub(
                i3.scale(t**3).add(i3.scale(3*(1-t)*t**2)).add(i0.scale(3*(1-t)**2*t)).add(i0.scale((1-t)**3))
            )
            points.push([p.x])
            points.push([p.y])
            const q1t = q1.scale(3*(1-t)**2*t)
            const q2t = q2.scale(3*(1-t)*t**2)
            X.push([q1t.x, q2t.x])
            X.push([q1t.y, q2t.y])
        }
        const XMat = new Matrix(X)
        const XMatT = XMat.transpose()
        const YMat = new Matrix(points)
        const [[b1], [b2]] = XMatT.dot(XMat).inverse().dot(XMatT).dot(YMat).mat

        return (new Bezier([i0, i0.add(q1.scale(b1)), i3.add(q2.scale(b2)), i3]))
    }

    // coordinate of the Bezier curve at time t
    getPoint(t: number){
        const [p0, p1, p2, p3] = this.points
        const point = (
            p0.scale((1-t)**3)
            .add(p1.scale(3*t*(1-t)**2))
            .add(p2.scale(3*(1-t)*t**2))
            .add(p3.scale(t**3))
        )
        return point
    }

    getDeriv(t: number){
        const [p0, p1, p2, p3] = this.points
        const point = (
            p1.sub(p0).scale(3*(1-t)**2).add(p2.sub(p1).scale(6*(1-t)*t)).add(p3.sub(p2).scale(3*t**2))
        )
        return point
    }

}

export class SegmentObj {
    segment: T.Segment
    curve: Bezier
    constructor(segment: T.Segment){
        this.segment = segment
        this.curve = new Bezier(segment.curve.map(v => new Vec(v.x, v.y)) as T.Quadruple<Vec>)
    }

    // width at this segment
    getWidth(t: number){
        return (this.segment.initWidth*(1-t) + this.segment.closingWidth*t)
    }

    toSVGString(thickScale: number){
        const {initWidth, closingWidth} = this.segment

        // outer strand
        const outerStrand = this.curve.solve(t => thickScale*(initWidth * (1- t) + closingWidth * t))
        // inner strand
        const innerStrand = this.curve.solve(t => thickScale*(-initWidth * (1- t) - closingWidth * t))

        const [o0p, o1p, o2p, o3p] = outerStrand.points.map(p => p.toString())
        const [i0p, i1p, i2p, i3p] = innerStrand.points.map(p => p.toString())
        // segment contour
        const path =
            `M${o0p} C${o1p} ${o2p} ${o3p} L${i3p} C${i2p} ${i1p} ${i0p}`
        return path
    }
    toSVGEle(k: number, config: RenderConfig){
        this.curve.translate(config.origin)
        // const [p0, p1, p2, p3] = this.curve.points.map(p => p.toString())
        return (
            <React.Fragment>
            <path key={k} d={this.toSVGString(config.unitWidth)}
                className="segment-base"
            />
            {/* <path key={k + 10} d={`M${p0} C${p1} ${p2} ${p3}`} style={{fill: "none", strokeWidth: "0.005px", stroke: "red"}}/> */}
            </React.Fragment>
        )
    }
}

export class CharacterObj {
    segments: SegmentObj[]
    constructor(character: T.Character){
        this.segments = character.segments.map(s => new SegmentObj(s))
    }

    toSVGEle(config: RenderConfig){
        return(
            <React.Fragment>
                {this.segments.map((s, i) => s.toSVGEle(i, config))}
                {/* {this.segments[1].toSVGEle(0, thickness)} */}
            </React.Fragment>
        )
    }
}