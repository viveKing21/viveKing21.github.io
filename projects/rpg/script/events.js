
const keyMap = new Map

addEventListener("keydown", e => {
    if(keyMap.get(e.code)) return;
    else keyMap.set(e.code, true)

    const keypressdown = new CustomEvent("keypressdown", {detail: {key: e.key, code: e.code}})
    dispatchEvent(keypressdown)
})

addEventListener("keyup", e => {
    if(keyMap.has(e.code)) keyMap.set(e.code, false)
})