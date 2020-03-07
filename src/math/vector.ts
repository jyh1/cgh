// simple 2-d vector


export class Vec {
    x: number
    y: number
    constructor(x: number, y: number){
        this.x = x
        this.y = y
    }

    add(v2: Vec){
        return (new Vec(this.x + v2.x, this.y + v2.y))
    }

    sub(v2: Vec){
        return (new Vec(this.x - v2.x, this.y - v2.y))
    }

    scale(c: number){
        return (new Vec(c * this.x, c * this.y))
    }

    length(){
        return (this.x ** 2 + this.y ** 2)**0.5
    }

    normalized(){
        const l = this.length()
        return (new Vec(this.x / l, this.y / l))
    }

    translate(d: number){
        return (new Vec(this.x + d, this.y + d))
    }

    rotate(){
        return (new Vec(-this.y, this.x))
    }
    rotateCW(){
        return (new Vec(this.y, -this.x))
    }

    toString(){
        return `${this.x},${this.y}`
    }

}