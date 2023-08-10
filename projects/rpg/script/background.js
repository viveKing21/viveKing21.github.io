import background from "../data/background.json" assert {type: "json"}

class Background{
    constructor(bgName){
      this.bgName = bgName || "forest"
      this.background = background[this.bgName]

      this.paused = false

      this.images = this.background.images.map(path =>  this.imageBuilder(path))
      this.data = new Map

      this.pos = {
          x: 0,
          y: 0
      }

      this.images.forEach(imageElm => {
        this.data.set(imageElm, {
            x_1: 0,
            y_1: 0,
            x_2: 0
        })
      });
      this.ground = this.background?.padding?.b || 0
      this.audio = new Audio(`./sound/${this.background.sound}`)
    }
    get backgrounds(){
        return Object.keys(background)
    }
    imageBuilder(name){
        let image = new Image
        image.src = `./sprite/background/${this.bgName}/${name}`
        return image
    }
    render(ctx, move, speed, canvas){
        if(this.audio.paused){
            try{
                this.audio?.play?.()
            }
            catch(e){
                
            }
        }

        this.images.forEach((image, index) => {
            let data = this.data.get(image)

            ctx.drawImage(image, data.x_1, data.y_1)
            ctx.drawImage(image, data.x_1 + canvas.width, data.y_1)

            // when go out of the frame
            if(Math.abs(data.x_1) >= this.background.width) data.x_1 = 0
            else if(data.x_1 > 0) data.x_1 = -this.background.width

            if(this.paused) return

            // move according the speed
            if(move.right) data.x_1 -= speed / this.images.length * (index + 1)
            else if(move.left) data.x_1 += speed / this.images.length * (index + 1)

            //setting x, y of the background (no use here)
            if(index === this.images.length - 1) {
                if(move.right) this.pos.x -= speed / this.images.length * (index + 1)
                else if(move.left) this.pos.x += speed / this.images.length * (index + 1)
            }
        })
    }
    reset(){
        this.audio.pause()
        this.audio.remove()
    }

}

export default Background