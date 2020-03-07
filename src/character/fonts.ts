import {default as fontfile}  from './fonts.json'
import * as I from './types'

export let defaultFont: I.FontDict = {}

fontfile.forEach(c => {
    defaultFont[c.ascii] = c as I.Character
})

