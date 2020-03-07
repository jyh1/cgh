import React from 'react'

import * as T from './types'
import { Vec } from '../math/vector';
import { Matrix } from '../math/matrix';

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


    // solve for Bezier curve with end points i0, i3, end slopes q1, q2, and going through m
    solve(i0: Vec, i3: Vec, q1: Vec, q2: Vec, m: Vec){
        const d1 = (4*(-(i0.y*q2.x) - i3.y*q2.x + 2*m.y*q2.x + i0.x*q2.y + i3.x*q2.y - 2*m.x*q2.y))/(3*(q1.y*q2.x - q1.x*q2.y))
        const d2 = (4*(i0.y*q1.x + i3.y*q1.x - 2*m.y*q1.x - i0.x*q1.y - i3.x*q1.y + 2*m.x*q1.y))/(3*(q1.y*q2.x - q1.x*q2.y))
        const i1 = i0.add(q1.scale(d1))
        const i2 = i3.add(q2.scale(d2))
        return (new Bezier([i0, i1, i2, i3]))
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
        const [p0, p1, p2, p3] = this.curve.points
        const {initWidth, closingWidth} = this.segment
        // console.log(this.curve.points, initWidth, closingWidth)
        const mat = new Matrix([[2,3],[4,2]])
        const mat2 = new Matrix([[2,3,45],[4,2,1]])
        console.log(mat.dot(mat2).mat)
        const mid = this.curve.getPoint(0.5)
        const q1 = p1.sub(p0)
        const q2 = p3.sub(p2)

        const n1 = q1.normalized().rotate().scale(initWidth * thickScale / 2)
        const n3 = q2.normalized().rotate().scale(closingWidth * thickScale / 2)
        const nm = this.curve.getDeriv(0.5).rotate().normalized().scale((initWidth+closingWidth)/4*thickScale)
        // outer strand
        const o0 = p0.add(n1)
        const o3 = p3.add(n3)
        const om = mid.add(nm)
        const outerStrand = this.curve.solve(o0, o3, q1, q2, om)

        // inner strand
        const i0 = p0.sub(n1)
        const i3 = p3.sub(n3)
        const im = mid.sub(nm)
        const innerStrand = this.curve.solve(i0, i3, q1, q2, im)

        const [o0p, o1p, o2p, o3p] = outerStrand.points.map(p => p.toString())
        const [i0p, i1p, i2p, i3p] = innerStrand.points.map(p => p.toString())
        // segment counter
        const path =
            `M${o0p} C${o1p} ${o2p} ${o3p} L${i3p} C${i2p} ${i1p} ${i0p}`
            // `M${o0p} C${o1p} ${o2p} ${o3p}`
        return path
    }
    toSVGEle(k: number, thickness: number){
        const [p0, p1, p2, p3] = this.curve.points.map(p => p.toString())
        return (
            <React.Fragment>
            <path key={k} d={this.toSVGString(thickness)}
                className="segment-base"
            />
            {/* <path d={`M${p0} C${p1} ${p2} ${p3}`}/> */}
            </React.Fragment>
        )
    }
}

export class CharacterObj {
    segments: SegmentObj[]

    constructor(character: T.Character){
        this.segments = character.segments.map(s => new SegmentObj(s))
    }

    toSVGEle(thickness: number){
        return(
            <React.Fragment>
                {/* {this.segments.map((s, i) => s.toSVGEle(i, thickness))} */}
                {this.segments[0].toSVGEle(0, thickness)}
            </React.Fragment>
        )
    }
}