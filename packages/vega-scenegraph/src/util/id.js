let markArray = []
let idCount = 0

function getMarkId() {
    return 'mark' + idCount++
}

function getMarkClass(mark) {
    if (!mark) return
    let index = markArray.indexOf(mark)
    if (index < 0) {
        index = markArray.length
        markArray.push(mark)
    }
    return 'element' + index
}

function reset() {
    markArray = []
    idCount = 0
}

export default {
    getMarkId,
    getMarkClass,
    reset
}