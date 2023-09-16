const numArray = num => {
    if(num < 10) num = "0"+num
    return num.toString().split('').map(i => parseInt(i))
}

export default class {
    constructor(ctx, canvas, props){

        this.x = canvas.width / 2
        this.y = 50
        this.height = props.count.assets.count.height * props.count.scale
        this.width = props.count.assets.count.width * props.count.scale

        this.interval = null
       
        this.images = []
        this.loaded_imgs = 0


        for(let i = 0; i < 10; i++){
            this.images[i] = new Image(this.width, this.height)
            this.images[i].onload = () => this.loaded_imgs++
            this.images[i].src = props.count.assets.count.src[i]
        }
    }
    draw(ctx, canvas, props){
        if(this.loaded_imgs !== this.images.length) return
        let number = numArray(props.score)
        for(let i in number){
            let img = this.images[number[i]]
            let x = this.x - (number.length * this.width / 2) + ((this.width + props.count.gap) * i)
            ctx.drawImage(img, x, this.y, this.width, this.height)
        }
    }
}