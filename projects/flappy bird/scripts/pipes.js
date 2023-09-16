import { randomBetween } from './utils.js'


export default class {
    constructor(ctx, canvas, props, pipe_up = null){
        let {head, body} = props.pipe.assets.pipe

        this.x = canvas.width
        this.y = 0
        this.height = randomBetween(props.pipe.height.min, props.pipe.height.max)
        this.width = body.width
        this.isUpside = !pipe_up
        this.crossed = false

        
        this.pipeBody = new Image(body.width, body.height - head.height)
        this.pipeBody.src = body.src
        this.pipeHead = new Image(head.width, head.height)
        this.pipeHead.src = head.src

        if(!this.isUpside){

            //if pipe is down
            let gap = randomBetween(props.pipe.v_gap.min, props.pipe.v_gap.max)
            this.y = Math.min(props.ground - props.pipe.height.min, pipe_up.height + gap)
            this.height = props.ground - this.y
            console
        }
    }
    draw(ctx, canvas, props){
        if(this.isUpside) ctx.drawImage(this.pipeBody, this.x, this.y, this.width, this.height - this.pipeHead.height)
        if(!this.isUpside) ctx.drawImage(this.pipeBody, this.x, this.y + this.pipeHead.height, this.width, this.height - this.pipeHead.height)
        if(this.isUpside) ctx.drawImage(this.pipeHead, this.x, this.y + this.height - this.pipeHead.height, this.width, this.pipeHead.height)
        if(!this.isUpside) ctx.drawImage(this.pipeHead, this.x, this.y, this.width, this.pipeHead.height)
    }
    update(ctx, canvas, props){
        this.x -= props.speed
    }
}