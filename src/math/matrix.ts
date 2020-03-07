
export type Mat = number[][]

export class Matrix {
    mat: Mat
    row: number
    col: number
    constructor(mat: Mat){
        this.mat = mat
        this.row = mat.length
        this.col = mat[0].length
    }
    dot(mat: Matrix){
        if (this.col != mat.row){
            throw "Matrix shape not match!"
        }
        let newmat: Mat = Array(this.row)
        for(let i = 0; i < this.row; i++){
            newmat[i] = Array(mat.col).fill(0)
            for(let j = 0; j < mat.col; j++){
                for (let k = 0; k < this.col; k++){
                    newmat[i][j] += this.mat[i][k]* mat.mat[k][j]
                }
            }
        }
        return new Matrix(newmat)
    }


    inverse(){
        if (this.row != 2 || this.col != 2){
            throw "Inverse beyond 2x2 not implemented"
        }
        const [[a, b], [c, d]] = this.mat
        return new Matrix ([[d/(-(b*c) + a*d), -(b/(-(b*c) + a*d))], [-(c/(-(b*c) + a*d)), a/(-(b*c) + a*d)]])
    }
}