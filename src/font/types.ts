import { Vec } from '../math/vector';

export type Point = {x: number, y: number}

export type Quadruple<T> = [T, T, T, T]

// cubic Bezier curve
export type Curve = Quadruple<Point>

// a segment is a part of a stroke with linearly changing width
export type Segment = {
      curve: Curve
    , initWidth: number
    , closingWidth: number
    , isAlign: boolean
    , isBreak: boolean // whether it is the end of a stroke and should be breaked from next segment
}

export type Character = {
      ascii: string
    , segments: Segment[]
}

export interface FontDict {
  [character: string]: Character
}

export type CharType = "lower" | "upper" | "symbol"


export type RenderConfig = {
    originX: number
  , originY: number
  , unitWidth: number
  , chrDist: number
  , wordDist: number
  , lineWidth: number
  , lineHeight: number
  , pnctDist: number
  , slackness: number
  , connectProb: number
  , faintedProb: number
  , fontSize: number
  , letterRandom: number
  , yRandom: number
}