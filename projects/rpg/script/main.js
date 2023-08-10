import Background from './background.js'
import { Hero, Enemy } from "./character.js"

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

const CANVAS_WIDTH = canvas.width = 272
const CANVAS_HEIGHT = canvas.height = 160

const MOVE = {
    left: false,
    right: false,
    run: false
}

let STAGGER_FRAME = 12
let SPEED = .1
let INIT_SPEED = .1

let INIT_BACKGROUND = "forest"
let INIT_HERO = "assassin"

let background = new Background(INIT_BACKGROUND)
let hero = new Hero(INIT_HERO)
let enemy = new Enemy("snake")

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    let data = {
        move: MOVE,
        init_speed: INIT_SPEED,
        speed: SPEED,
        setSpeed: (newSpeed) => SPEED = newSpeed,
        canvas: canvas,
        canvas_height: CANVAS_HEIGHT,
        canvas_width: CANVAS_WIDTH,
        stagger_frame: STAGGER_FRAME,
        background
    }
    background.render(ctx, MOVE, SPEED, canvas)
    hero.render(ctx, {
        ...data,
        enemies: [enemy]
    })
    enemy.render(ctx, {
        ...data,
        hero
    })

    hero.createHealthBar(ctx)

    if(hero.DIED){
        background.paused = true
    }
    
    requestAnimationFrame(animate)
}

animate()

// Mouse Event

function keydown(e){
    let key = null
    let shiftPressed = false
    switch(e.key.toLowerCase()){
        case "d":
            MOVE.right = true
            if(e.shiftKey) MOVE.run = shiftPressed = true
            key = "d"
            break
        case "a":
            MOVE.left = true
            if(e.shiftKey) MOVE.run = shiftPressed = true
            key = "a"
            break
        case "shift":
            if(MOVE.left || MOVE.right){
                MOVE.run = shiftPressed = true
            }
            break
    }
    if(key) document.getElementById(key)?.classList.add("pressed")
    if(shiftPressed) document.getElementById("shift")?.classList.add("pressed")
}

function keyup(e){
    let key = null
    switch(e.key.toLowerCase()){
        case "d":
            MOVE.right = false
            key = "d"
            break
        case "a":
            MOVE.left = false
            key = "a"
            break
        case "w":
            key = "w"
            break
        case " ":
            key = "space"
            break
        case "f":
            key = "f"
            break
        case "shift":
            MOVE.run = false
            key = "shift"
    }
    if(key) document.getElementById(key)?.classList.remove("pressed")
}
function keypressdown(e){
    let key = e.detail.key.toLowerCase()
    let keyID = null
    if(key === "w" || key === " " || key === "space"){
        hero.jump = true
        keyID = key == " " ? "space":key
    }
    else if(key === "f"){
        hero.attack = true
        keyID = "f"
    }
    document.getElementById(keyID)?.classList.add("pressed")
}

addEventListener("keydown", keydown)

addEventListener("keyup", keyup)

addEventListener("keypressdown", keypressdown)

let btnElements = ["w", "a", "d", "f", "space", "shift"]
btnElements.forEach(id => {
    document.getElementById(id).onmousedown = () => {
        keydown({key: id})
        keypressdown({detail: {key: id}})
    }
    window.addEventListener("mouseup", () => {
        keyup({key: id == 'space' ? ' ':id})
    })
})

// on customize

let backgroundParent = document.querySelector(".background .buttons")
let playerParent = document.querySelector(".player .buttons")

buttonBuilder(backgroundParent, background.backgrounds, INIT_BACKGROUND, bgName => {
    background.reset()
    background = new Background(bgName)
    hero.reset()
    enemy.reset()
})
buttonBuilder(playerParent, hero.heros, INIT_HERO, heroName => {
    hero = new Hero(heroName)
})

function buttonBuilder(parent, list, init, callback){
    list.forEach(name => {
        let btn = document.createElement("div")
        btn.textContent = name.toUpperCase()
        if(name === init) btn.className = "selected"
        btn.addEventListener('click', e => {
            callback(name)
            Array.from(parent.children).forEach(btnElem => {
               if(btnElem === btn) btnElem.classList.add('selected')
               else btnElem.classList.remove('selected')
            })
        })
        parent.append(btn)
    })
}