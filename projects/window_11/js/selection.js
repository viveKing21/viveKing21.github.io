class Selection{
    constructor(){
       this.isActive = false
       this.isMoved = false
       this.coordinates = [0, 0]
    }
    setTarget(target){
        this.target = target
        this.#listen()
    }
    #listen(){
        this.target.addEventListener('mousedown', e => {
            if(e.target !== this.target || e.which !== 1) return; //prevent
            this.isActive = true
            this.coordinates = [e.x, e.y]
        })        
        window.addEventListener('mouseup', e => {
            if(!this.isActive) return //prevent 
            this.isActive = false
            this.coordinates = [0, 0]
            if(this.view) this.view.remove()
            this.view = null
        })
        window.addEventListener('mousemove', e => {
            if(!this.isActive) return //prevent
            this.#addView()
            this.#setCoordinate({x: e.x, y: e.y})
        })
    }
    #addView(){
        if(this.view) return
        this.view = document.createElement('div')
        this.view.id = 'selection'
        this.target.append(this.view)
    }
    #setCoordinate({x, y}){
        let width = Math.abs(x - this.coordinates[0])
        let height = Math.abs(y - this.coordinates[1])
        
        let posX = x > this.coordinates[0] ? this.coordinates[0]:x
        let posY = y > this.coordinates[1] ? this.coordinates[1]:y

        if(posX + width > this.target.offsetLeft + this.target.offsetWidth)
           width = (this.target.offsetLeft + this.target.offsetWidth) - posX
        if(posY + height > this.target.offsetTop + this.target.offsetHeight)
           height = (this.target.offsetTop + this.target.offsetHeight) - posY
        if(posX < this.target.offsetLeft) {
            posX = this.target.offsetLeft
            width = Math.abs(posX - this.coordinates[0])
        }
        if(posY < this.target.offsetTop) {
            posY = this.target.offsetTop
            height = Math.abs(posY - this.coordinates[1])
        }
        this.view.style.transform = `translateX(${posX}px) translateY(${posY}px)`
        this.view.style.width = `${width}px`
        this.view.style.height = `${height}px`
    }
}
export default Selection