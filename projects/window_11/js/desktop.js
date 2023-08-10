import Selection from "./selection.js"

class Desktop{
    constructor(win){
        this.window = win
        this.selection = new Selection;
        this.max_area = {
            cols: 0,
            rows: 0
        }
        this.positioning = {
            cols: 1,
            rows: 1
        } 
    }
    setup(){
        this.desktopScreen = document.createElement('div')
        this.desktopScreen.id = 'desktop-screen'
        this.window.win.append(this.desktopScreen)
        this.window.events.subscribeEvent('resize', (e) =>  this.#adjustApps(e))
        this.#desktopDropsListener()
        this.selection.setTarget(this.desktopScreen)
    }
    createShortcut(shortcut, dataIndex){
        let frame = document.createElement('div')
        let frameCover = document.createElement('div')
        let icon = document.createElement('img')
        let name = document.createElement('span')
        icon.src = shortcut.icon
        icon.draggable = false
        name.textContent = shortcut.name
        frame.id = 'shortcut-app'
        frame.draggable = true
        frame.setAttribute('shortcut-id', shortcut.id)
        frame.setAttribute('data-index', dataIndex)
        this.#adjustApps()
        frameCover.append(icon)
        frameCover.append(name)
        frame.append(frameCover)
        this.desktopScreen.append(frame)
        frame.style.setProperty('grid-row-start', this.positioning.rows++)
        frame.style.setProperty('grid-column-start', parseInt(this.positioning.cols / this.max_area.rows)+1)

        frame.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move'
            e.dataTransfer.setData('text/plain', `shortcut-id=${shortcut.id}`)
        })
    }
    #adjustApps(){
        this.max_area.cols = parseInt(this.desktopScreen.offsetWidth / 70)
        this.max_area.rows = parseInt(this.desktopScreen.offsetHeight / 90)
        this.desktopScreen.style.setProperty('--max-rows', this.max_area.rows)
        this.desktopScreen.style.setProperty('--max-cols', this.max_area.cols)
    }
    #desktopDropsListener(){
        this.desktopScreen.addEventListener('dragover', e => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
        })
        this.desktopScreen.addEventListener('drop', e => {
            e.dataTransfer.dropEffect = 'move'
            if(e.target != this.desktopScreen) return
            let data = e.dataTransfer.getData('text/plain')?.split('=')
            if(!data) return;

            if(data[0] == 'shortcut-id'){
                let frame = document.querySelector(`[shortcut-id='${data[1]}']`)
                let {x, y} = e

                let startAreaCol = parseInt((x / this.desktopScreen.offsetWidth * this.max_area.cols) + 1)
                let startAreaRow = parseInt((y / this.desktopScreen.offsetHeight * this.max_area.rows) + 1)
                frame.style.setProperty('grid-column-start', startAreaCol > this.max_area.cols ? this.max_area.cols:startAreaCol)
                frame.style.setProperty('grid-row-start', startAreaRow > this.max_area.rows ? this.max_area.rows:startAreaRow)
            }

        })
    }
}
export default Desktop