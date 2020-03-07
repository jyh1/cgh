
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

// export type CharacterType = "Upper" | "Lower" | "Punctuation"

export type Character = {
      ascii: string
    , segments: Segment[]
    // , characterType: CharacterType
}

export interface FontDict {
  [character: string]: Character
}