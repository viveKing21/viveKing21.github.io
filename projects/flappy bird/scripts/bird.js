import { minmax } from './utils.js'

let velocity_y = 0
let frame = 0

export default class {
    constructor(ctx, canvas, props){
        let { bird } = props

        this.height = bird.assets.bird.height
        this.width = bird.assets.bird.width
        this.x = canvas.width / 2 - (this.width / 2)
        this.y = props.ground / 2 - (this.height / 2)
        this.y += 48

        this.birdImages = bird.assets.bird.src.map(path => {
            let img = new Image(this.width, this.height)
            img.src = path
            return img
        })

        const keydown = (e) => {
            e.preventDefault()
            if(e.code === 'Space'){
                velocity_y = (bird.jump + (e.shiftKey ? bird.boost:0)) * -1
                if(props.bird.sound) props.bird.sound('swoosh')
            }
        }
        const keyup = (e) => {
            if(e.code === 'Space') addEventListener('keypress', keydown, {once: true})
        }

        addEventListener('keypress', keydown, {once: true })
        addEventListener('keyup', keyup)
    }
    draw(ctx, canvas, props){
        if(props.speed !== 0) frame = props.game_frame
        let frameState = Math.floor(frame / Math.floor(props.stagger_frame - minmax(props.speed / 2, 0, 5)) % this.birdImages.length)
        ctx.drawImage(this.birdImages[frameState], this.x, this.y, this.width, this.height)
    }
    update(ctx, canvas, props){
       velocity_y += props.gravity
       
       if(this.y + velocity_y > props.ground  - this.height || this.y + velocity_y < 0) velocity_y = 0

       if(props.speed == 0) velocity_y = 0

       this.y += velocity_y
    }
}