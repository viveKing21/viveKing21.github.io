import ContextData from '../assets/windows/context/contextdata.json' assert {type: "json"}

class ContextMenu{
    constructor(win){
        this.window = win
        this.isVisible = false
        this.dataIndex = null
        this.newUI = false
    }
    setup(){
        this.menu = document.createElement('div')
        this.menu.id = 'contextmenu' 
        this.menu.setAttribute('visible', this.isVisible)
        this.window.desktop.desktopScreen.append(this.menu)

        this.window.desktop.desktopScreen.addEventListener('contextmenu', e => {
            e.preventDefault()
            this.window.closeTask([this.window.taskbar])
            let path = e.path || e.composedPath();
            this.dataIndex = path.find(elem => elem.id == 'shortcut-app');
            if(this.menu.contains(e.target)) return false
            let shortcutData = this.window.shortcuts?.[this.dataIndex?.getAttribute('data-index')]
            let desktopClick = e.target === this.window.desktop.desktopScreen
            this.newUI = shortcutData?.type !== 'system-app'
            this.#showContextMenu(desktopClick, this.#createTileData(shortcutData?.context_options?.options || shortcutData?.context_options), {x: e.x, y: e.y})
        }, true)
        this.window.events.subscribeEvent('globalmousedown', (e) => this.#hideContextMenu(),null, null, [this.menu])
    }
    #showContextMenu(desktopClick, context_options, pos){
        this.isVisible = true
        this.menu.innerHTML = ''
        this.menu.style.transition = 'opacity 200ms'
        if(this.newUI) {
            this.menu.setAttribute('new_ui', true)
        }
        else {
            this.menu.removeAttribute('new_ui')
        }
        context_options.forEach((tilesData, i) => {
            let tileBox = this.#createList(tilesData)
            if(context_options.length - 1 == i) tileBox.style.setProperty('--border', 'none')
            this.menu.append(tileBox)
        })
        if(!desktopClick)this.#createQuickTool()
        this.#setContextMenuPos(pos)
        this.menu.setAttribute('visible', this.isVisible)
    }
    #hideContextMenu(){
        this.isVisible = false
        this.menu.innerHTML = ''
        this.menu.style.transition = 'none'
        this.menu.setAttribute('visible', this.isVisible)
    }
    #setContextMenuPos({x, y}){
        let menuOffsets = this.menu.getBoundingClientRect()
        let desktopOffsets = this.window.desktop.desktopScreen.getBoundingClientRect()
        let posX = x, posY = y, direction_vertical = "down"
        if(x + menuOffsets.width > desktopOffsets.width) posX = x - menuOffsets.width
        if(y + menuOffsets.height > desktopOffsets.height) {posY = y - menuOffsets.height; direction_vertical = 'up'}
        if(posX < desktopOffsets.x) posX = desktopOffsets.x
        if(posY < desktopOffsets.y) posY = desktopOffsets.y
        
        this.menu.setAttribute('direction-vertical', direction_vertical)
        this.menu.style.left = posX + 'px'
        this.menu.style.top = posY + 'px'
        return direction_vertical
    }
    #createList(tilesData){
        let list = document.createElement('div')
        list.id = 'contextmenu-tiles-list'
        tilesData.forEach(tileData => list.append(this.#createTiles(tileData)))
        return list
    }
    #createTiles(tileData){
        let tile = document.createElement('div')
        let iconBox = document.createElement('div')
        let label = document.createElement('div')
        let sideBox = document.createElement('div')

        if(tileData?.bold) label.style.fontWeight = 'bold'

        if(this.newUI){
            if(tileData?.new_ui_icon){
                let icon = document.createElement('img')
                icon.src = tileData.new_ui_icon
                if(tileData?.new_ui_icon_size){
                    icon.style.setProperty('--icon_size', tileData.new_ui_icon_size+'px')
                }
                iconBox.append(icon)
            }
            if(tileData?.new_ui_text) sideBox.textContent = tileData?.new_ui_text
        }
        else{
            if(tileData?.icon){
                let icon = document.createElement('img')
                icon.src = tileData.icon
                if(tileData?.icon_size){
                    icon.style.setProperty('--icon_size', tileData.icon_size+'px')
                }
                iconBox.append(icon)
            }
            if(tileData?.text) sideBox.textContent = tileData?.text
        }
        
        label.textContent = tileData.label

        iconBox.setAttribute('contextmenu-iconbox', true)
        label.setAttribute('contextmenu-label', true)
        sideBox.setAttribute('contextmenu-sidebox', true)
        tile.setAttribute('type', tileData.type == 'dropdown' ? tileData.type:'button')

        tile.setAttribute('disabled', tileData.disabled == true)
        tile.addEventListener('click', e => this.#actions[tileData.id]?.(e))
        tile.id = 'contextmenu-tile'
        tile.append(iconBox)
        tile.append(label)
        tile.append(sideBox)
        return tile
    }
    #createTileData(tileMap){
        const dataConverter = (map) => map.map(list => list.map(tileName => ({id: tileName, ...ContextData[tileName]})))
        if(Array.isArray(tileMap)) return dataConverter(tileMap)
        switch(tileMap){
            case 'default':
                return dataConverter(this.#defaultOptions[this.newUI ? 'new_ui':'old_ui'].app);
            default: 
                return dataConverter(this.#defaultOptions[this.newUI ? 'new_ui':'old_ui'].screen);
        }
    }
    #createQuickTool(){
        if (!this.newUI) return;
        let quickToolBox = document.createElement('div')
        this.#defaultOptions.new_ui.quick_tool.forEach(toolName => {
            let button = document.createElement('div')
            let icon = document.createElement('img')
            icon.src = ContextData[toolName].icon
            button.id = 'quick-tool-button'
            button.append(icon)
            quickToolBox.append(button)
        })
        quickToolBox.id = 'quick-tools'
        this.menu.prepend(quickToolBox)
        return quickToolBox
    }
    #actions = {
        refresh: () => {
            this.#hideContextMenu()
            window.location.reload()
        },
        show_more_options: (e) => {
            this.newUI = false
            let shortcutData = this.window.shortcuts?.[this.dataIndex?.getAttribute('data-index')]
            this.#showContextMenu(false, this.#createTileData(shortcutData?.context_options?.options || shortcutData?.context_options), {x: e.x, y: e.y})
        },
        pin_to_taskbar: () => {
            let shortcutData = this.window.shortcuts?.[this.dataIndex?.getAttribute('data-index')]
            this.window.taskbar.pinApp(shortcutData)
            this.#hideContextMenu()
        }
    }
    #defaultOptions = {
        old_ui: {
            screen: [
                ["view", "sort_by", "refresh"],
                ["paste", "undo_delete", "open_in_windows_terminal"],
                ["new"],
                ["display_settings", "personalize"]
            ],
            app: [
                ["open", "open_file_location", "run_as_administrator", "troubleshoot_compatibility", "pin_to_taskbar", "pin_to_start"],
                ["copy_as_path", "share", "restore_as_previous_versions"],
                ["send_to"],
                ["cut", "copy"],
                ["create_shortcut", "delete", "rename"],
                ["properties"]
            ]
        },
        new_ui: {
            quick_tool: ['q_t_cut', 'q_t_copy', 'q_t_rename', 'q_t_share', "q_t_delete"],
            screen: [
                ["view", "sort_by", "refresh"],
                ['new'],
                ["display_settings", "personalize"],
                ['open_in_windows_terminal'],
                ['show_more_options']
            ],
            app: [
                ["open", "run_as_administrator", "open_file_location", "pin_to_start", "compress_to_zip_file", "copy_as_path", "properties"],
                ["onedrive"],
                ["show_more_options"]
            ]
        }
    }
}

export default ContextMenu
