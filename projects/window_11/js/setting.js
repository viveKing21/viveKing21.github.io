class Setting{
    constructor(win){
        Object.assign(this, win)
    }
    setWallpaper(){
        this.win.style.backgroundImage = `url(https://wallpapercave.com/wp/wp9378861.jpg)`
    }
}

export default Setting