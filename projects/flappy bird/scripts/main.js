import assets from '../asset_info.json' assert {type: 'json'}
import { defaultParams, minmax } from './utils.js'
import { control as GameControl, createBackground, createBird, createPipe, createCount, getDefaultProps, loadAudio } from './creates.js'

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

canvas.height = minmax(innerHeight, 500, 600)
canvas.width = minmax(innerWidth / 2, 400, 800)

const background_prop = {
    assets: {
        bg: assets.background.day,
        base: assets.base.grass
    }
}
const bird_prop = {
    jump: 3,
    boost: 1,
    assets: {
        bird: assets.bird.blue
    }
}
const pipe_prop = {
    height: { min: 0, max: 0}, //auto-change with levels
    v_gap: { min: 0, max: 0},
    h_gap: { min: 500,max: 500},
    assets: {
        pipe: assets.pipe.green
    }
}
const count_prop = {
    scale: 1,
    gap: 5,
    assets: {
        count: assets.count
    }
}
const props = Object.assign(getDefaultProps(), {background: background_prop, bird: bird_prop, pipe: pipe_prop, count: count_prop})
const withParams = defaultParams(ctx, canvas, props)

const control = withParams(GameControl)

loadAudio(props, ['point'])

let background = withParams(createBackground)
let bird = withParams(createBird)
let pipes = withParams(createPipe)
let count = withParams(createCount)

let last_lvl_increased_at = 0

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    background.draw()
    bird.draw()
    pipes.draw()
    count.draw()

    background.update()
    bird.update()
    pipes.update()

    control.showScreen()


    if(last_lvl_increased_at !== props.score && props.score > 0){
        props.level += 0.05
        last_lvl_increased_at = props.score
    }
    props.game_frame++
    requestAnimationFrame(render)
}

render()

// controls
let box = document.querySelector('.box')
let birds_elm = document.querySelector('.birds')
let background_elm = document.querySelector('.backgrounds')
let difficulty_elm = document.querySelector('.difficulty')

const start = () => {
    switch(control.getGameState()){
        case 'not_running':
            control.setGameState('game_start')
            box.classList.add('disabled')
            break;
        case 'game_over':
            control.restart()
            background = withParams(createBackground)
            bird = withParams(createBird)
            pipes = withParams(createPipe)
            count = withParams(createCount)
            
            //restore difficulty level
            box.classList.remove('disabled')
            props.level = (parseInt(difficulty_elm.querySelector('.selected').id) + 1) * 2

    }
    
}
canvas.addEventListener('click', start)
addEventListener('keypress', e => {
    if(e.code === 'Space' && control.getGameState() === 'not_running'){
        control.setGameState('game_start')
        box.classList.add('disabled')
    } 
})

// customization

const selectorElements = (object, element, innset) => {
    Object.keys(object).forEach((k, i, array) => {
        let data = object[k]
        let div = document.createElement('div')
        let image = new Image(data.width, data.height)
        if(Array.isArray(data.src)) image.src = data.src[1]
        else image.src = data.src
        if(i == 0) div.className = 'selected'
        div.id = k
        div.appendChild(image)
        element.appendChild(div)
    })
}

selectorElements(assets.bird, birds_elm)
selectorElements(assets.background, background_elm)

Array.from(difficulty_elm.children).forEach((elm, i ,array) => {
    elm.addEventListener('click', e => {
        if(elm.classList.contains('selected')) return
        array.forEach(elm_ => elm_.className = elm === elm_ ? 'selected':'')
        props.level = (i + 1) * 2
    })
})
Array.from(background_elm.children).forEach((elm, i, array) => {
    elm.addEventListener('click', () => {
        if(elm.classList.contains('selected')) return
        if(control.getGameState() === 'not_running'){
            array.forEach(k_ => k_.className = elm === k_ ? 'selected':'')
            background_prop.assets.bg = assets.background[elm.id]
            background = withParams(createBackground)
        }
    })
})
Array.from(birds_elm.children).forEach((elm, i, array) => {
    elm.addEventListener('click', () => {
        if(elm.classList.contains('selected')) return
        if(control.getGameState() === 'not_running'){
            array.forEach(k_ => k_.className = elm === k_ ? 'selected':'')
            bird_prop.assets.bird = assets.bird[elm.id]
            bird = withParams(createBird)
        }
    })
})


//show read.md
fetch('./Read.md')
.then(res => res.text())
.then(res => {
    console.log('###### READ.MD ######')
    console.log(res)
})