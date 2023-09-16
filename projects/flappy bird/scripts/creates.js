import Background from "./background.js";
import Bird from './bird.js';
import Pipe from './pipes.js'
import Count from './count.js'
import { isColliding, defaultParams, propertyBinder, randomBetween, percentageBetween, minmax } from "./utils.js";
import assets from '../asset_info.json' assert {type: 'json'}

const MAX_LEVEL = 20

const MAX_SPEED = 8
const MIN_SPEED = 0.5
const MAX_SPEED_AT_LEVEL = 15

const MIN_BIRD_JUMP = 1
const MAX_BIRD_JUMP = 3 
const MIN_BIRD_JUMP_AT_LEVEL = 10

const MIN_PIPES_VERTICAL_GAP_AT_LEVEL = 20
const MIN_PIPES_HORIZONTAL_GAP_AT_LEVEL = 20

const getDefaultProps = () => {
    return Object.setPrototypeOf({
        __level__: 1,
        __speed__: MIN_SPEED,
        set speed(sp){
            this.__speed__ = sp
        },
        get speed(){
            let tenths = (Math.min(this.level, MAX_SPEED_AT_LEVEL) - 1) / (MAX_SPEED_AT_LEVEL - 1)
            let difficulty_speed_increament = percentageBetween(tenths , 0, MAX_SPEED - MIN_SPEED)
            return this.__speed__ && this.__speed__ + difficulty_speed_increament
        },
        set level(lvl){
            this.__level__ = minmax(lvl, 1, MAX_LEVEL)
        },
        get level(){
            return this.__level__
        },
        score: 0,
        ground: 0,
        gravity: 0.08,
        game_frame: 0,
        stagger_frame: 8        
    }, {
        reset(...keys){
            let defaultProp = getDefaultProps()
            for(let key of (keys.length ? keys:Object.keys(this))){
                if(defaultProp.hasOwnProperty(key)) this[key] = defaultProp[key]
            }
        }
    })
}

const createBackground = (...params) => {
    let withParams = defaultParams(...params)
    let props = params[2]
    let background = [withParams(Background), withParams(Background), withParams(Background)]
    let monitorBackground = 0
    let monitorBase = 0
    background.forEach((bg, i) => {
        bg.x = bg.width * i
        bg.base_x = bg.base_width * i
    })

    //setting background info
    propertyBinder(props.background, background[0], ['height', 'width', 'x', 'y', 'base_height', 'base_width', 'base_x', 'base_y'])
    props.ground = props.background.base_y
    
    return {
        getBackground(){
            return background[0]
        },
        getAllBackground(){
            return background
        },
        draw(){
            for(let i in background){
                let bg = background[i]
                if(i == monitorBackground % background.length){
                 if(bg.x + bg.width <= 0){
                     let last = background.at(monitorBackground % background.length-1)
                     bg.x = last.x + last.width
                     monitorBackground++
                 }
                }
                withParams(bg.draw.bind(bg), 'background')
             }
             for(let i in background){
                 let bg = background[i]
                 if(i == monitorBase % background.length){
                     if(bg.base_x + bg.base_width <= 0){
                         let last = background.at(monitorBase % background.length-1)
                         bg.base_x = last.base_x + last.base_width
                         monitorBase++
                     }
                 }
                 withParams(bg.draw.bind(bg), 'base')
             }
        },
        update(){
            background.forEach(bg => withParams(bg.update.bind(bg), 'background'))
            background.forEach(bg => withParams(bg.update.bind(bg), 'base'))
            propertyBinder(props.background, background[0], ['x', 'y'])
        }
    }
} 

const createBird = (...params) => {
    let withParams = defaultParams(...params)
    let props = params[2]
    let bird = withParams(Bird)

    //setting bird info
    propertyBinder(props.bird, bird, ['height', 'width', 'x', 'y'])

    return {
        getBird(){
            return bird
        },
        draw(){
            withParams(bird.draw.bind(bird))
        },
        update(){
            withParams(bird.update.bind(bird))
            propertyBinder(props.bird, bird, ['x', 'y'])

            let tenths = Math.min(props.level, MIN_BIRD_JUMP_AT_LEVEL) / MIN_BIRD_JUMP_AT_LEVEL
            let difficulty_low_jump = percentageBetween(tenths, MAX_BIRD_JUMP, MIN_BIRD_JUMP)
            props.bird.jump = difficulty_low_jump
        }
    }
}

const createPipe = (ctx, canvas, props) => {
    let withParams = defaultParams(ctx, canvas, props)

    const updateMinMaxData = () => {
        let MIN_V_GAP = props.ground - props.pipe.assets.pipe.head.height * 4
        let MAX_V_GAP = props.ground - props.pipe.assets.pipe.head.height * 2
        let tenths_v = Math.min(props.level, MIN_PIPES_VERTICAL_GAP_AT_LEVEL) / MIN_PIPES_VERTICAL_GAP_AT_LEVEL
        let tenths_h = Math.min(props.level, MIN_PIPES_HORIZONTAL_GAP_AT_LEVEL) / MIN_PIPES_HORIZONTAL_GAP_AT_LEVEL
        props.pipe.v_gap.min = percentageBetween(tenths_v, Math.min(props.bird.height * 8, MIN_V_GAP), Math.min(props.bird.height * 4, MIN_V_GAP))
        props.pipe.v_gap.max = percentageBetween(tenths_v, Math.min(props.bird.height * 12, MAX_V_GAP), Math.min(props.bird.height * 8, MAX_V_GAP))
        props.pipe.h_gap.min = percentageBetween(tenths_h, props.bird.width * 8, props.bird.width * 4)
        props.pipe.h_gap.max = percentageBetween(tenths_h, props.bird.width * 12, props.bird.width * 8)
        props.pipe.height.min = props.pipe.assets.pipe.head.height
        props.pipe.height.max = props.ground - props.pipe.v_gap.max - props.pipe.height.min
    }
    updateMinMaxData()

    let pipes = [
        [withParams(Pipe)]
    ]

    pipes[0].push(withParams(Pipe, pipes[0][0]))
    props.pipe.up = props.pipe.down = {}
    propertyBinder(props.pipe.up, pipes[0][0], ['height', 'width', 'x', 'y'])
    propertyBinder(props.pipe.down, pipes[0][0], ['height', 'width', 'x', 'y'])

    return {
        getPipe(){
            return pipes[0]
        },
        getAllPipe(){
            return pipes
        },
        getPipeUp(){
            return getPipe()[0]
        },
        getPipeDown(){
            return getPipe()[1]
        },
        draw(){
            let hasPipeOutOfFrame = false;

            for(let i in pipes){
                let pipe = pipes[i]
                withParams(pipe[0].draw.bind(pipe[0]))
                withParams(pipe[1].draw.bind(pipe[1]))
        
                if(isColliding(props.bird, pipe[0]) || isColliding(props.bird, pipe[1])){
                    props.control.setGameState('game_over')
                    if(props.bird.sound) props.bird.sound('die')
                }
        
                if(pipe[0].x + pipe[0].width < 0) hasPipeOutOfFrame = true
        
                if(pipe[0].x + pipe[0].width < props.bird.x && !pipe[0].crossed) {
                    pipe[0].crossed = true
                    props.score++
                    if(props.bird.sound) props.bird.sound('point')
                }
        
                if(i == pipes.length - 1){
                    if(pipe[0].x < canvas.width){
                        let pipe_up = withParams(Pipe)
                        let pipe_down = withParams(Pipe, pipe_up)
                        pipe_down.x = pipe_up.x = (pipe[0].x + pipe[0].width) + randomBetween(props.pipe.h_gap.min, props.pipe.h_gap.max)
                        pipes.push([pipe_up, pipe_down])
                    }
                }
            }
            if(hasPipeOutOfFrame){
                //remove pipes that has been out of frame
                pipes.shift()
                hasPipeOutOfFrame = false
            }
        },
        update(){
            pipes.forEach(pipes => {
                withParams(pipes[0].update.bind(pipes[0]))
                withParams(pipes[1].update.bind(pipes[1]))
            })
            propertyBinder(props.pipe.up, pipes[0][0], ['height', 'width', 'x', 'y'])
            propertyBinder(props.pipe.down, pipes[0][0], ['height', 'width', 'x', 'y'])
            updateMinMaxData()
        }
    }
}

const createCount = (...params) => {
    let withParams = defaultParams(...params)
    let count = withParams(Count)

    return {
        getCount(){
           return count
        },
        draw(){
            withParams(count.draw.bind(count))
        }
    }
}

const control = (ctx, canvas, props) => {
    let isGameOver = false
    let isGameStarted = false
    let gameover_image = new Image(assets.gameover.width, assets.gameover.height)
    let gamestart_image = new Image(assets.gamestart.width, assets.gamestart.height)
    gameover_image.src = assets.gameover.src
    gamestart_image.src = assets.gamestart.src

    return props.control = {
        getGameState(){
            return isGameOver && isGameStarted ? 'game_over':!isGameOver && !isGameStarted ? 'not_running':'running'
        },
        setGameState(gameState){
           if(gameState === 'game_start' && !isGameOver){
                isGameStarted = true
                props.reset('speed')
                ctx.globalAlpha = 1
           }
           if(gameState === 'game_over' && isGameStarted){
                isGameOver = true
                props.speed = 0
           }
        },
        restart(){
            props.reset()
            isGameOver = false
            isGameStarted = false
        },
        showScreen(){
            if(isGameStarted === false){
               props.speed = 0
               ctx.globalAlpha = 1
               ctx.drawImage(gamestart_image, (canvas.width - gamestart_image.width) / 2, (props.ground - gamestart_image.height) / 2, gamestart_image.width, gamestart_image.height)
               ctx.globalAlpha = .5
            }
            if(isGameOver){
                props.speed = 0
                ctx.globalAlpha = 1
                ctx.drawImage(gameover_image, (canvas.width - gameover_image.width) / 2, (props.ground - gameover_image.height) / 2, gameover_image.width, gameover_image.height)
                ctx.globalAlpha = .5
            }
        }
    }
}

const loadAudio = (props, loadList) => {
    let dieAudio = new Audio(assets.sound.die)
    let swooshAudio = new Audio(assets.sound.swoosh)
    let pointAudio = new Audio(assets.sound.point)

    dieAudio.addEventListener('canplaythrough', (e) => e.target.canPlay = true)
    swooshAudio.addEventListener('canplaythrough', (e) => e.target.canPlay = true)
    pointAudio.addEventListener('canplaythrough', (e) => e.target.canPlay = true)

    const insertSound = (o, v) => {
        Object.defineProperty(o, 'sound', {
            value: v,
            enumerable: false,
            configurable: false,
            writable: false
         })
    }
    insertSound(props.bird, (sound) => {
        if(loadList) if(!loadList.includes(sound)) return;
        
        switch(sound){
            case 'swoosh':
                if(swooshAudio.canPlay) swooshAudio.play()
                break;
            case 'point':
                if(pointAudio.canPlay) pointAudio.play()
                break;
            case 'die':
                if(dieAudio.canPlay) dieAudio.play()
                break;
        }
    })
}
export {control, createBackground, createBird, createPipe, createCount, getDefaultProps, loadAudio}