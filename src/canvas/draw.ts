import {SegmentObj} from '../character/classes'

export type DrawingOptions = {
      sampleRate: number
    , unitWidth: number
}

const defaultOptions: DrawingOptions = {sampleRate: 20, unitWidth: 100}

export function drawSegment(
      ctx: CanvasRenderingContext2D
    , segment: SegmentObj
    , opt = defaultOptions
){

    for (let i = 0; i < opt.sampleRate + 0.1; i += 1){
        const t = i / opt.sampleRate
        const p = segment.curve.getPoint(t)
        const width = segment.getWidth(t)
        ctx.lineTo(p.x * 200, p.y * 200 + 400)
        ctx.lineWidth = width*opt.unitWidth
        ctx.stroke()
    }
}