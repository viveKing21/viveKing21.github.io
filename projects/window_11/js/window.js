import ContextMenu from './contextmenu.js'
import Events from './events.js'
import Desktop from './desktop.js';
import Setting from "./setting.js"
import Taskbar from "./taskbar.js";
import Startmenu from './startmenu.js';
import Shortcuts from "../assets/windows/shortcuts/shortcuts.json" assert {type: 'json'}
import SystemApp from '../assets/app/system.json' assert {type: 'json'}
import InstalledApp from '../assets/app/installed.json' assert {type: 'json'}

class Window{
    constructor(){
        this.win = document.getElementById('window')
        this.apps = [...SystemApp, ...InstalledApp]
        this.shortcuts = [...Shortcuts, ...InstalledApp]
        this.contextmenu = new ContextMenu(this)
        this.events = new Events(this);
        this.desktop = new Desktop(this);
        this.setting = new Setting(this);
        this.startmenu = new Startmenu(this)
        this.taskbar = new Taskbar(this);
    }
    setup(){
        this.desktop.setup()
        this.setting.setWallpaper()
        this.taskbar.setup()
        this.startmenu.setup()
        this.shortcuts.forEach(this.desktop.createShortcut.bind(this.desktop))
        this.apps.forEach(app => {
            if(app.id != 'in-2')
            this.taskbar.pinApp(app)
            this.startmenu.pinApp(app)
            this.startmenu.addtoRecommend(app)
            this.taskbar.addBackgroundRunningTask(app)
        })
        this.contextmenu.setup()
        window.addEventListener('contextmenu', e => e.preventDefault())
    }
    closeTask(list){
        list.forEach(task => task.cancelAll?.())
    }

}

export default Window