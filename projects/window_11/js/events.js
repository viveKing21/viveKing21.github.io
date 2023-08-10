class Events{
    static registeredEvents;
    constructor(win){
        Object.assign(this, win)
        this.registeredEvents = new Map(Object.values(this.#events).map(id => [id, []]))
        Object.values(this.#events).forEach(evt => evt())
    }
    subscribeEvent(name, handler, matchElement = null, onDontMatch = null, preventOn = [], id = null){
        if(this.registeredEvents.has(this.#events[name])) {
            this.registeredEvents.get(this.#events[name]).push([handler, matchElement, matchElement && onDontMatch, preventOn, id])
        }
        else console.error(`Event '${name}' not found`)
    }
    unsubscribeEvent(name, identifier){
        if(this.registeredEvents.has(this.#events[name])) {
            this.registeredEvents.set(this.#events[name], this.registeredEvents.get(this.#events[name]).filter(registeredData => registeredData[0] != identifier || registeredData[4] != identifier))
        }
        else console.error(`Event '${name}' not found`)
    }
    dragEvent(elem, startCB = () => { }, dragCB = () => { }, releaseCB = () => { }){
        elem.addEventListener('mousedown', e => {
            startCB(e)
            window.addEventListener('mousemove', dragCB)
            window.addEventListener('mouseup', e => {
                window.removeEventListener('mousemove', dragCB)
                releaseCB(e)
            }, { once: true })
        })
    }
    #events = {
        globalclick: () => {
            window.addEventListener('click', e => {
                    this.registeredEvents.get(this.#events.globalclick).forEach(([handler, matchElement, onDontMatch, preventOn]) => {
                    if(preventOn.some(elem => elem.contains(e.target))) return
                    if(matchElement && !matchElement.contains(e.target)){
                        if(onDontMatch) onDontMatch()
                        return
                    };
                    handler(e)
                })
            })
        },
        globalmousedown: () => {
            window.addEventListener('mousedown', e => {
                    this.registeredEvents.get(this.#events.globalmousedown).forEach(([handler, matchElement, onDontMatch, preventOn]) => {
                    if(preventOn.some(elem => elem.contains(e.target))) return
                    if(matchElement && !matchElement.contains(e.target)){
                        if(onDontMatch) onDontMatch()
                        return
                    };
                    handler(e)
                })
            })
        },
        resize: () => {
            window.addEventListener('resize', e => {
                this.registeredEvents.get(this.#events.resize).forEach(([handler]) => handler(e))
            })
        },
    }
    
}
export default Events