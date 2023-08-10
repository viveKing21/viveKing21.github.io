class Startmenu{
    #focusHandler
    constructor(win){
        this.window = win
        this.pinnedApps = []
        this.recommendedApps = []
    }
    setup(){
        this.#createStartMenu()
    }
    addtoRecommend(app){
        if(this.recommendedApps.length > 6) return console.error('Reached to maximum recommendation apps!')
        let frame = document.createElement('div')
        let icon = document.createElement('img')
        let text = document.createElement('div')
        frame.id = 'startmenu-recommend-data'
        icon.src = app.icon
        text.innerHTML = `${app.name}<br><span>1 hr ago</span>`
        frame.append(icon)
        frame.append(text)
        
        let container = this.menu.querySelector('#recommend-data')
        container.append(frame)
        this.recommendedApps.push(frame)
    }
    pinApp(app){
        let frame = document.createElement('div')
        let icon = document.createElement('img')
        let name = document.createElement('span')
        name.textContent = app.name
        icon.src = app.icon
        frame.id = 'startmenu-app'
        frame.append(icon)
        frame.append(name)
        let container = this.menu.querySelector('#pinned-app')
        container.append(frame)
        this.pinnedApps.push(frame)
    }
    show(focus){
        this.menu.setAttribute('visible', true)
        clearTimeout(this.#focusHandler)
        if(focus) {
            this.#focusHandler = setTimeout(() => this.input.focus(), 200)
        }
    }
    hide(){
        clearTimeout(this.#focusHandler)
        this.input.blur()
        this.menu.setAttribute('visible', false)
    }
    #createStartMenu(){
        this.menu = document.createElement('div')
        this.menu.id = 'startmenu'
        this.menu.style.bottom = this.window.taskbar.bar.offsetHeight + 'px'

        let padbox = document.createElement('div')
        padbox.id= 'padbox'
        padbox.append(this.#createSearchBox())
        padbox.append(this.#createPinnedAppContainer())
        padbox.append(this.#createRecommendedContainer())
        this.menu.append(padbox)
        this.menu.append(this.#createProfile({name: 'Vivek Sharma', avatar: "https://yt3.ggpht.com/ytc/AKedOLS8OTHoCBw7WgYMFKDCQvuWorgZOyzakqTz_mAR=s88-c-k-c0x00ffffff-no-rj"}))
        this.window.win.append(this.menu)
    }
    #createSearchBox(){
        let box = document.createElement('div')
        this.input = document.createElement('input')
        let iconBox = document.createElement('div')
        iconBox.innerHTML = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g id="Layer_2" data-name="Layer 2"><circle fill='none' stroke='#28282B' stroke-width='2px' cx="27.78" cy="20.22" r="13.11"></circle><rect fill='#28282B' width=2 x="11.03" y="27.08" width="3" height="15.43" rx="2.18" transform="translate(28.47 0.86) rotate(45)"></rect></g></svg>`
        this.input.type = 'text'
        this.input.placeholder = 'Type here to search'
        box.id = 'search'
        box.append(iconBox)
        box.append(this.input)
        return box
    }
    #createPinnedAppContainer(){
        let pinnedContainer = document.createElement('div')
        let pinnedArea = document.createElement('div')
        let box = document.createElement('div')
        let title = document.createElement('h3')
        title.textContent = 'Pinned'
        box.append(title)
        box.innerHTML += `<div id='option-button'>All apps <img src='assets/windows/icons/arrow-up.png'/></div>`
        box.id = 'head'
        pinnedArea.id = 'pinned-app'
        pinnedContainer.id = 'pinned-container'
        pinnedContainer.append(box)
        pinnedContainer.append(pinnedArea)
        return pinnedContainer
    }
    #createRecommendedContainer(){
        let recommendContainer = document.createElement('div')
        let recommendArea = document.createElement('div')
        let box = document.createElement('div')
        let title = document.createElement('h3')
        title.textContent = 'Recommended'
        box.append(title)
        box.innerHTML += `<div id='option-button'>More <img src='assets/windows/icons/arrow-up.png'/></div>`
        box.id = 'head'
        recommendArea.id = 'recommend-data'
        recommendContainer.id = 'recommend-container'
        recommendContainer.append(box)
        recommendContainer.append(recommendArea)
        return recommendContainer
    }
    #createProfile({avatar, name}){
        let box = document.createElement('div')
        let shutdown = document.createElement('div')
        let shutdownIcon = document.createElement('img')
        let profile = document.createElement('div')
        let avatarCon = document.createElement('img')
        let nameCon = document.createElement('span')
        nameCon.textContent = name
        avatarCon.src = avatar
        shutdownIcon.src = 'assets/windows/icons/power.png'
        shutdown.append(shutdownIcon)
        profile.append(avatarCon)
        profile.append(nameCon)

        box.append(profile)
        box.append(shutdown)
        box.id = 'profile-container'
        return box
    }
}

export default Startmenu