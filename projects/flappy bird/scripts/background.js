export default class {
    constructor(ctx, canvas, props){
        //enviroment info
        this.images = []
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height

        //base info
        this.base = null
        this.base_x = 0
        this.base_y = 0
        this.base_width = canvas.width
        this.base_height = props.background.assets.base.height

        // enviroment images
        let w = this.height / props.background.assets.bg.height * props.background.assets.bg.width

        for(let i = 0; i < Math.ceil(this.width / w); i++){
            let image = new Image(w, this.height)
            image.src = props.background.assets.bg.src
            this.images.push(image)
        }

        //base images
        this.base = new Image(this.base_width, this.base_height)
        this.base.src = props.background.assets.base.src
        this.base_y = canvas.height - this.base_height
    }
    draw(ctx, canvas, props, only = null){
        if(only != 'base'){
            //draw enviroment
            for(let i in this.images){
                let img = this.images[i]
                let w = img.width
                let x = w * i + this.x 
                if(i == this.images.length - 1) w = this.width - w * i
                // ctx.strokeRect(x, 0, w, this.height)
                ctx.drawImage(img, 0, 0, w / img.width * props.background.assets.bg.width, props.background.assets.bg.height, x, 0, w, this.height)
            }
        }
        if(only != 'background'){
            //draw base
            // ctx.strokeRect(this.base_x, this.base_y, this.base_width, this.base_height)
            ctx.drawImage(this.base, this.base_x, this.base_y, this.base_width, this.base_height)
        }
    }
    update(ctx, canvas, props, only = null){
        if(only != 'base'){
            this.x -= props.speed * .3
        }
        if(only != 'background'){
            this.base_x -= props.speed
        }

    }
}