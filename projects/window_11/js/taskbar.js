Array.prototype.last = function () { return this[this.length - 1] }
Array.prototype.remove = function (index) { return this.filter((e, i) => i != index) }

class Taskbar {
    #backgroundRunningTaskBtn;
    #backgroundRunningTask;

    constructor(win) {
        this.window = win
        this.bar = document.createElement('div')
        this.bar.id = 'taskbar'
        this.pinnedApps = []
        this.state = {
            startMenuOpened: false,
            searchPanelOpen: false,
            currentFocused: 0,
        }
    }
    setup() {
        this.#setupStartMenu() //global
        this.#setupSearch() //global

        let quickSettings = this.#setupQuickSetting()

        let pinnedApps = document.createElement('div')
        pinnedApps.id = 'pinned-apps'

        let titleBox = document.createElement('div')
        titleBox.id = 'title-box'

        this.bar.append(titleBox)
        this.bar.append(this.startmenu)
        this.bar.append(this.search)
        this.bar.append(pinnedApps)
        this.bar.append(quickSettings)
        this.window.win.append(this.bar)
    }
    isPinableApp(id_) {
        return this.window.apps.some(({id}) => id == id_)
    }
    isPinned(id_){
        return this.pinnedApps.some(frame => frame.getAttribute('app-id') == id_)
    }
    pinApp(app) {
        if(!this.isPinableApp(app.id)) return console.error(`'${app.name}' app is not pinabled`)
        if(this.isPinned(app.id)) return console.error(`'${app.name}' app is already pinned`)
        let frame = document.createElement('div')
        frame.id = 'taskbar-icon'
        frame.setAttribute('app-id', app.id)
        let icon = document.createElement('img')
        icon.src = app.icon
        icon.draggable = false
        frame.append(icon)
        this.bar.querySelector('#pinned-apps').append(frame)

        this.pinnedApps.push(frame)

        //hover show title
        let timer = 0
        frame.addEventListener('mouseenter', () => {
            timer = setTimeout(() => {
                let titleBox = this.bar.querySelector('#title-box')
                titleBox.textContent = app.name
                let frameOffsets = frame.getBoundingClientRect()
                titleBox.style.transform = `translateX(${frameOffsets.x - (titleBox.offsetWidth / 2 - frameOffsets.width / 2)}px)`
                titleBox.setAttribute('show', 'true')
            }, 2000)
        })
        frame.addEventListener('mouseleave', () => {
            this.bar.querySelector('#title-box').setAttribute('show', 'false')
            clearTimeout(timer)
        })

        //click and active app
        this.window.events.subscribeEvent('globalclick', e => {
             if(frame.contains(e.target)){
                if(frame.getAttribute('focused') !== 'true') return this.focusApp(app.id) //on active
             }
             frame.setAttribute('focused', 'false')
        }, undefined, undefined, undefined, app.id)

        //drag and re-arrange
        let startPos = 0, prevPos = 0;
        let capturedFrames = []
        let offsets = new Map()
        let moved = false
        let reverseEnd = true

        const onDraggingStart = e => {
            startPos = e.clientX
            capturedFrames.push(frame)
            this.pinnedApps.forEach(elem => offsets.set(elem, elem.getBoundingClientRect()))
        }
        const onDragging = e => {
            moved = true

            let pos = e.clientX - startPos
            let pinnedContainer = this.bar.querySelector('#pinned-apps').getBoundingClientRect()

            //set up max and min drag limit
            let minPos = pinnedContainer.x + (startPos - offsets.get(frame).x)
            let maxPos = (pinnedContainer.x + pinnedContainer.width - offsets.get(frame).width) + (startPos - offsets.get(frame).x)
            if (e.clientX < minPos) pos = minPos - startPos
            if (e.clientX > maxPos) pos = maxPos - startPos

            if (prevPos == pos || e.movementX == 0) return;

            frame.style.transition = 'none'
            frame.style.transform = `translateX(${pos}px)`
            const getDirectionFrame = (value, elem) => {
                let currentIndex = this.pinnedApps.indexOf(elem)
                return value > 0 ? this.pinnedApps[currentIndex + 1] : this.pinnedApps[currentIndex - 1]
            }
            if (pos > 0 === pos > prevPos) {
                let elemAround = getDirectionFrame(e.movementX, capturedFrames.last())
                if (elemAround?.id !== 'taskbar-icon') return
                if (this.#xOverlappingDetect(elemAround, frame)) {
                    let distance = offsets.get(getDirectionFrame(e.movementX > 0 ? -1 : 1, elemAround)).x - offsets.get(elemAround).x
                    elemAround.style.transition = 'transform 200ms'
                    elemAround.style.transform = `translateX(${distance}px)`
                    if (!capturedFrames.includes(elemAround)) capturedFrames.push(elemAround)
                }
                reverseEnd = true
            }
            else if (reverseEnd && frame !== capturedFrames.last()) {
                //reverse control
                if (this.#xOverlappingDetect(capturedFrames.last(), frame)) {
                    capturedFrames.last().style.transform = `translateX(0px)`
                    capturedFrames.pop()
                    if (capturedFrames.last() == frame) reverseEnd = false
                }
            }

            prevPos = pos

            // adding other effects
            frame.setAttribute('dragging', 'true')
        }
        const onDraggingEnd = () => {
            if (!moved && !this.state.startMenuOpened) {
                if (this.state.searchPanelOpen) {
                    this.state.searchPanelOpen = false
                    this.search.removeAttribute('active')
                }
                icon.setAttribute('shake-animation', 'true')
                icon.onanimationend = () => icon.removeAttribute('shake-animation')
                return
            }
            moved = false
            capturedFrames = []
            offsets.clear()
            startPos = 0
            prevPos = 0

            //removing other effects
            frame.removeAttribute('dragging')

            //ordering
            let list = this.pinnedApps.map((frame, index) => [index, frame.getBoundingClientRect().x]).sort((a, b) => a[1] - b[1])
            list.forEach(([frameIndex], i) => {
                this.pinnedApps[frameIndex].style.transition = 'none'
                this.pinnedApps[frameIndex].style.transform = 'none'
                this.pinnedApps[frameIndex].style.order = i + 1
            })
            this.pinnedApps = list.map(([frameIndex]) => this.pinnedApps[frameIndex])
        }
        this.window.events.dragEvent(frame, onDraggingStart, onDragging, onDraggingEnd)
    }
    unPinApp(id){
        let at = this.pinnedApps.findIndex(frame => frame.getAttribute('app-id') == id)
        this.pinnedApps[at].remove()
        this.pinnedApps.remove(at)
        this.window.events.unsubscribeEvent('globalclick', id)
    }
    focusApp(id) {
        this.#blurFocusedApp()

        //newState
        let frame = this.getApp(id)
        if (!frame.getAttribute('active')) frame.setAttribute('active', 'true')
        frame.setAttribute('focused', 'true')
        this.state.currentFocused = id

    }
    getApp(id) {
        return document.querySelector(`[app-id='${id}']`)
    }
    addBackgroundRunningTask(app){
        let bgRunningApp = document.createElement('div')
        bgRunningApp.id = `bg-running-app-id-${app.id}`
        let icon = document.createElement('img')
        icon.src = app.icon
        bgRunningApp.append(icon)
        this.#backgroundRunningTask.append(bgRunningApp)
    }
    cancelAll(){
        this.#blurFocusedApp()
        this.#events.startMenu.deactive()
        this.#events.search.deactive()
        this.#events.backgroundTask.deactive()
    }
    //private feilds
    #setupStartMenu(){
        this.startmenu = document.createElement('div')
        this.startmenu.id = "startmenu"
        let svg = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48"><defs><linearGradient id="starmenu-gredient" gradientTransform="rotate(45)"><stop offset="5%" stop-color='#82e5ff'/><stop offset="95%" stop-color='#0092d0'/></linearGradient></defs><path fill="url(#starmenu-gredient)" d="M7,6h15c0.552,0,1,0.448,1,1v15c0,0.552-0.448,1-1,1H7c-0.552,0-1-0.448-1-1V7	C6,6.448,6.448,6,7,6z M25.042,21.958V7c0-0.552,0.448-1,1-1H41c0.552,0,1,0.448,1,1v14.958	c0,0.552-0.448,1-1,1H26.042C25.489,22.958,25.042,22.511,25.042,21.958z M7,25h15c0.552,0,1,0.448,1,1v15c0,0.552-0.448,1-1,1H7c-0.552,0-1-0.448-1-1V26	C6,25.448,6.448,25,7,25z M25,41V26c0-0.552,0.448-1,1-1h15c0.552,0,1,0.448,1,1v15c0,0.552-0.448,1-1,1H26	C25.448,42,25,41.552,25,41z"/></svg>`
        this.startmenu.innerHTML = svg

        this.window.events.subscribeEvent('globalmousedown', e => {
            if(this.window.startmenu.menu.contains(e.target)) return
            if(this.startmenu.contains(e.target)){
                this.#events.search.deactive()
                this.#blurFocusedApp()
                if(this.startmenu.getAttribute('active') !== 'true') return this.#events.startMenu.active()
            }
            this.#events.startMenu.deactive()
        })
    }
    #setupSearch(){
        this.search = document.createElement('div')
        this.search.id = 'search'
        let srchSVG = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><style>.cls-1{fill:none;stroke-miterlimit:10;stroke-width:4px;}</style><linearGradient id="search-gredient" gradientTransform="rotate(-20)"><stop offset="5%" stop-color="#28282B"/><stop offset="100%" stop-color="#28282B"/></linearGradient></defs><g id="Layer_2" data-name="Layer 2"><circle class="cls-1" stroke="url('#search-gredient')" cx="27.78" cy="20.22" r="13.11"/><rect fill='#28282B' x="11.03" y="27.08" width="4.35" height="15.43" rx="2.18" transform="translate(28.47 0.86) rotate(45)"/></g></svg>`
        this.search.innerHTML = srchSVG

        this.window.events.subscribeEvent('globalmousedown', e => {
            if(this.window.startmenu.menu.contains(e.target)) return
            if(this.search.contains(e.target)){
                this.#events.startMenu.deactive()
                this.#blurFocusedApp()
                if(this.search.getAttribute('active') !== 'true') return  this.#events.search.active()
            }
            this.#events.search.deactive()
        })
    }
    #setupQuickSetting(){
        let quickSetting = document.createElement('div')
        quickSetting.id = 'quick-settings'

        //background task 
        this.#backgroundRunningTaskBtn = document.createElement('div')
        let arrowIcon = document.createElement('img')
        arrowIcon.src = 'assets/windows/icons/arrow-up.png'
        this.#backgroundRunningTaskBtn.id = 'arrow'
        this.#backgroundRunningTaskBtn.setAttribute('background-running-visible', 'false')
        this.#backgroundRunningTaskBtn.setAttribute('custom-title', 'Show hidden icons')
        this.#backgroundRunningTaskBtn.append(arrowIcon)
        
        this.#backgroundRunningTask = document.createElement('div')
        this.#backgroundRunningTask.id = 'background-running-task'
        this.#backgroundRunningTaskBtn.append(this.#backgroundRunningTask)
        this.window.events.subscribeEvent('globalclick', e => {
            if(this.#backgroundRunningTaskBtn.contains(e.target)){
                if(this.#backgroundRunningTaskBtn.getAttribute('background-running-visible') == 'false'){
                    this.#events.backgroundTask.active()
                    return
                }
            }
            this.#events.backgroundTask.deactive()
        }, undefined, undefined, [this.#backgroundRunningTask])

        //just for hover effect
        this.#backgroundRunningTask.addEventListener('mouseenter', () => this.#backgroundRunningTaskBtn.setAttribute('hover', 'false'))
        this.#backgroundRunningTask.addEventListener('mouseleave', () => this.#backgroundRunningTaskBtn.removeAttribute('hover'))

        //language 
        let lang = document.createElement('div')
        lang.id = 'language'
        lang.innerHTML = 'ENG<br>IN'

        let multibox = document.createElement('div')
        let wifiIcon = document.createElement('img')
        let speakerIcon = document.createElement('img')
        let batteryIcon = document.createElement('img')
        wifiIcon.src = 'assets/windows/icons/wifi.png'
        speakerIcon.src = 'assets/windows/icons/speaker.png'
        batteryIcon.src = 'assets/windows/icons/battery.png'
        multibox.id = 'multi-setting-box'
        multibox.append(wifiIcon)
        multibox.append(speakerIcon)
        multibox.append(batteryIcon)

        let datetime = document.createElement('div')
        datetime.id = 'datetime'
        const setDate = () => {
            let time = new Date()
            datetime.innerHTML = `${time.getHours()}:${time.getMinutes()}`
            datetime.innerHTML += `<br>${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`
            return setDate
        }
        setInterval(setDate(), 1000)
        
        quickSetting.append(this.#backgroundRunningTaskBtn)
        quickSetting.append(lang)
        quickSetting.append(multibox)
        quickSetting.append(datetime)
        return quickSetting;
    }
    #blurFocusedApp(){
        if (this.state.currentFocused) {
            let prevFrame = this.getApp(this.state.currentFocused)
            prevFrame.setAttribute('focused', 'false')
            this.state.currentFocused = 0
        }
    }
    #xOverlappingDetect(elemA, elemB){
        if (!elemA || !elemB) return false;
        let a = elemA.getBoundingClientRect()
        let b = elemB.getBoundingClientRect()
        return b.x < a.x + a.width * .6 && b.x + b.width * .6 > a.x
    }
    //Events :
    #events = {
        startMenu: {
            active: () => {
                if (!this.state.startMenuOpened) {
                    this.startmenu.setAttribute('active', 'true')
                    this.state.startMenuOpened = true
                    this.window.startmenu.show()
                }
            },
            deactive: () => {
                if (this.state.startMenuOpened) {
                    this.startmenu.removeAttribute('active')
                    this.state.startMenuOpened = false
                    this.window.startmenu.hide()
                }
            }
        },
        search: {
            active: () => {
                if (!this.state.searchPanelOpen) {
                    this.search.setAttribute('active', 'true')
                    this.state.searchPanelOpen = true
                    this.window.startmenu.show(true)
                }
            },
            deactive: () => {
                if (this.state.searchPanelOpen) {
                    this.search.removeAttribute('active')
                    this.state.searchPanelOpen = false
                    this.window.startmenu.hide()
                }
            }
        },
        backgroundTask: {
            active: () => {
                this.#backgroundRunningTaskBtn.setAttribute('background-running-visible', 'true')
                this.#backgroundRunningTaskBtn.setAttribute('custom-title', 'Hide')
            },
            deactive: () => {
                this.#backgroundRunningTaskBtn.setAttribute('background-running-visible', 'false')
                this.#backgroundRunningTaskBtn.setAttribute('custom-title', 'Show hidden icons')
            }
        }
    }
}

export default Taskbar