let markArray = []

let idCount = {}
function getMarkId(namespace) {
    if(idCount[namespace] === undefined){
        idCount[namespace] = Object.keys(idCount).length * 1000
    }
    return 'mark' + idCount[namespace]++
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
    idCount = {}
}

export default {
    getMarkId,
    getMarkClass,
    reset
}