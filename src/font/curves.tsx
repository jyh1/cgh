import React from 'react'

import * as T from './types'
import { Vec } from '../math/vector';
import { Matrix } from '../math/matrix';


const SampleRate = 3
const dt = 1 / (SampleRate + 1)

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
        this.mapPoints(p => p.add(dv))
    }

    mapPoints(f: (v: Vec) => Vec){
        this.points = this.points.map(p => f(p)) as T.Quadruple<Vec>
    }

    // fit for Bezier curve with the same slope at two ends, and distance from the original curve determined by thickness
    solve(thickness: (t: number) => number, diminish = false){
        const newcurve = (t: number, strand: number) => (this.getPoint(t).add(this.getDeriv(t).rotate().normalized().scale(0.5 * strand * thickness(t))))
        const q1 = this.points[1].sub(this.points[0])
        const q2 = this.points[2].sub(this.points[3])
        const opposite = diminish ? -1 : 1
        const i0 = newcurve(0, 1)
        const i3 = newcurve(1, opposite)
        let points: number[][] = []
        let X: number[][] = []
        for (let i = 1; i <= SampleRate + 0.001; i += 1){
            const isopposite = i > SampleRate/2 ? opposite : 1
            const t = i * dt
            const p = newcurve(t, isopposite).sub(
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
    curve: Bezier
    width: (t: number) => number
    connecting: boolean = false
    constructor(points: T.Quadruple<T.Point>, initWidth: number, closingWidth: number){
        this.curve = new Bezier(points.map(v => new Vec(v.x, v.y)) as T.Quadruple<Vec>)
        this.width = (t: number) => (initWidth*(1-t) + closingWidth*t)
    }

    translate(v: Vec){
        this.curve.translate(v)
    }

    toSVGString(thickScale: number, faintedProb: number){
        const fainted = this.connecting? (Math.random() < faintedProb? true : false) : false
        // outer strand
        const outerStrand = this.curve.solve(t => this.width(t) * thickScale, fainted)
        // inner strand
        const innerStrand = this.curve.solve(t => - this.width(t) * thickScale, fainted)

        const [o0p, o1p, o2p, o3p] = outerStrand.points.map(p => p.toString())
        const [i0p, i1p, i2p, i3p] = innerStrand.points.map(p => p.toString())
        // segment contour
        const path =
            `M${o0p} C${o1p} ${o2p} ${o3p} L${i3p} C${i2p} ${i1p} ${i0p} Z`
        return path
    }
    toSVGEle(unitWidth: number, faintedProb: number){
        const [p0, p1, p2, p3] = this.curve.points.map(p => p.toString())
        return (
                [<path d={this.toSVGString(unitWidth, faintedProb)}className="segment-base"/>
                // ,<path d={`M${p0} C${p1} ${p2} ${p3}`} style={{fill: "none", strokeWidth: "0.005px", stroke: "red"}}/>
                ]
        )
    }
}

export class SegmentObjArray{
    segments: SegmentObj[]
    constructor(segs: SegmentObj[]){
        this.segments = segs
    }
    mapPoints(f: (v: Vec) => Vec){
        this.segments.map(s => s.curve.mapPoints(f))
    }

    // estimate bounding box by sampling
    getBoundingBox(): [Vec, Vec] {
        let maxX = Number.MIN_VALUE
        let minX = Number.MAX_VALUE
        let maxY = Number.MIN_VALUE
        let minY = Number.MAX_VALUE
        this.segments.forEach(
            s => {
                for (let t = 0; t <= 1.01; t += dt){
                    const p = s.curve.getPoint(t)
                    if (p.x > maxX) maxX = p.x
                    if (p.y > maxY) maxY = p.y
                    if (p.x < minX) minX = p.x
                    if (p.y < minY) minY = p.y
                }
            }
        )
        return [new Vec(minX, minY), new Vec(maxX, maxY)]
    }
    toSVGEle(unitWidth: number, faintedProb: number){
        return [...this.segments.map(s => s.toSVGEle(unitWidth, faintedProb))]
    }
}
