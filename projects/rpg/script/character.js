import characters from "../data/characters.json" assert {type: "json"}

class Character{
    DIED = false
    constructor(characterName){
        this.characterName = characterName
        this.show = {
            rect: {
                view: false,
                character: false,
                weapon: false
            },
        }
        this.health = 1
        this.height = 0
        this.width = 0
        this.pos = {
            x: 0,
            y: 0
        }
        this.weapon = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
        this.gravity = 1
        this.gameFrame = 0
        
        this.frameState = 0

        this.lockFrame = false

        this.strechedImage = false
    }
    get direction(){
        if(!this.hasOwnProperty('lastDir')) return null
        let initDirection = this.character.source.character?.dir || 1
        return (this.lastDir == 'right' ? 1:-1) * initDirection
    }
    get padding(){
        let padding = this.character.source.character?.padding
        let view = padding?.view
        let character = padding?.character
        let weapon = padding?.weapon

        return {
            view: {
                padLeft: view?.l || 0,
                padTop: view?.t || 0,
                padRight: view?.r || 0,
                padBottom: view?.b || 0,
                get padH(){
                    return this.padLeft + this.padRight
                },
                get padV(){
                    return this.padTop + this.padBottom
                }
            },
            character: {
                padLeft: character?.l || 0,
                padTop: character?.t || 0,
                padRight: character?.r || 0,
                padBottom: character?.b || 0,
                get padH(){
                    return this.padLeft + this.padRight
                },
                get padV(){
                    return this.padTop + this.padBottom
                }
            },
            weapon: {
                padLeft: weapon?.l || 0,
                padTop: weapon?.t || 0,
                padRight: weapon?.r || 0,
                padBottom: weapon?.b || 0,
                get padH(){
                    return this.padLeft + this.padRight
                },
                get padV(){
                    return this.padTop + this.padBottom
                }
            }
        }
    }
    get currentFrame(){
        return this.frameName
    }
    set currentFrame(frameName){
        if(frameName === this.frameName || this.lockFrame || this.DIED) return
        this.frameState = 0
        this.gameFrame = 0
        this.frameName = frameName
    }
    imageBuilder(name){
        let image = new Image
        image.src = `./sprite/character/${this.characterName}/${name}`
        return image
    }
    render(ctx, {move, speed, canvas_height, canvas_width, stagger_frame, background}){
        let image = this.imageBuilder(this.character.source.character.image)

        let frameIndex = this.frameKeys.indexOf(this.currentFrame)
        let frameCount = this.character.source.character.map[this.currentFrame]
        let frameLength = this.frameKeys.length

        const {view, character, weapon} = this.padding

        if(this.strechedImage){
            this.width = canvas_width / Math.max(...Object.values(this.character.source.character.map)) - character.padH
            this.height = canvas_height / frameLength - character.padV
        }
        else{
            this.width = this.character.width / frameCount - character.padH
            this.height = this.character.height / frameLength - character.padV
        }

        this.frameState = Math.floor(this.gameFrame / stagger_frame) % frameCount

        
        this.gravity += .05

        let data = this?.whileRender?.({
            args: arguments,
            frameIndex,
            frameCount,
        }) || {}

        //default
        if(!data.hasOwnProperty("ground")) data.ground = canvas_height - this.height

        if(this.characterName === 'snake'){
            console.log(background.ground)
        }
        if(this.pos.y + this.gravity > data.ground - background.ground) {
            this.gravity = 0
        }

        this.pos.y += this.gravity

        ctx.save();
        ctx.scale(this.direction, 1)

        
        if(this.frameState === frameCount - 1){
            if(this.DIED){
                this.gameFrame--
            }
        }

        let sx = (this.frameState * (this.character.width / frameCount))
        let sy = (frameIndex * this.character.height / frameLength)
        let sWidth = this.character.width / frameCount
        let sHeight = this.character.height / frameLength
        let dx = this.pos.x * this.direction
        let dy  = this.pos.y
        let dWidth = this.width * this.direction
        let dHeight = this.height

        if(this.show.rect.character) this.rect(ctx, dx, dy, dWidth, dHeight, "green")

        sx += view.padLeft
        sy += view.padTop
        sWidth -= view.padH
        sHeight -= view.padV
        dx -= (this.direction > 0 ? character.padLeft - view.padLeft:character.padRight - view.padRight) * this.direction
        dy -= character.padTop - view.padTop
        dWidth = (this.width + (character.padH - view.padH)) * this.direction
        dHeight = this.height + (character.padV - view.padV)

        if(this.show.rect.view) this.rect(ctx, dx, dy, dWidth, dHeight)

        if(this.isAttacking){
            this.weapon.x = dx + (this.direction > 0 ? weapon.padLeft:weapon.padRight) * this.direction
            this.weapon.y = dy + weapon.padTop
            this.weapon.w = dWidth - weapon.padH * this.direction
            this.weapon.h = dHeight - weapon.padV
        }
        else{
            this.weapon = {x: 0, y: 0, w: 0, h: 0}
        }

        // DEATH
        if(this.health <= 0){
            this.lockFrame = false
            this.currentFrame = 'death'
            this.DIED = true
        }

        if(this.show.rect.weapon) this.rect(ctx, this.weapon.x, this.weapon.y, this.weapon.w, this.weapon.h, "blue")
        
        ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        
        ctx.restore();
        this.gameFrame++
    }
    rect(ctx, x, y, w, h, color){
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.strokeStyle = color || "red"
        ctx.stroke()
        ctx.closePath()
    }
    reset(){
        this.pos = {
            x: 0,
            y: 0,
        }
        this.gravity = 1
        this.gameFrame = 0
        this.frameState = 0
        this.health = 1
    }
    collision = {
        character: (x, y, w, h) => {
            let collisionX = this.pos.x + this.width > x && this.pos.x < x + w
            let collisionY = this.pos.y + this.height > y && this.pos.y < y + h
            let distanceX = 0
            if(this.pos.x + this.width < x) distanceX = (this.pos.x + this.width) - x
            if(this.pos.x > x + w) distanceX = this.pos.x - (x + w)
            return {
                distanceX,
                isColliding: collisionX && collisionY,
                collisionX, collisionY,
            }
        },
        weapon: (x, y, w, h) => {
            let collisionX = Math.abs(this.weapon.x + this.weapon.w) > x && Math.abs(this.weapon.x) < x + w
            let collisionY = this.weapon.y + this.weapon.h > y && this.weapon.y < y + h
            return {
                isColliding: this.isAttacking && collisionX && collisionY
            }
        }
    }
}

export class Hero extends Character{
    constructor(...params){
       super(...params)
       this.character = characters.hero[this.characterName]

       this.frameKeys = Object.keys(this.character.source.character.map)
       this.frameName = "idle"
       this.lastDir = "right"


       this.velocityX = 0

       this.jump = false
       this.isJumping = false
       this.attack = false
       this.isAttacking = false
       this.checkedAttackCollision = false

       this.showHealthBar = true
       
       //events
       this.onFrameEnd = null
    }
    get heros(){
        return Object.keys(characters.hero)
    }
    whileRender({args, frameIndex, frameCount}){
        if(this.DIED) return

        let ctx = args[0]
        let {move, init_speed, speed, setSpeed, stagger_frame, canvas_width, canvas_height, background, enemies} = args[1] // render data

        background.paused = false

        let ground = canvas_height - this.height

        if(move.run){
            if(move.right) this.velocityX += .03
            if(move.left) this.velocityX -= .03
            setSpeed(init_speed + Math.abs(this.velocityX))

            if(this.pos.x + this.velocityX > 0 && this.pos.x + this.velocityX < canvas_width - this.width)  background.paused = true
        }
        else{
            setSpeed(init_speed)
        }

        this.pos.x += this.velocityX

        if(this.pos.x < 0) this.pos.x = 0
        if(this.pos.x > canvas_width - this.width) this.pos.x = canvas_width - this.width
        
        this.velocityX *= 0.9

        if(move.right){
            this.currentFrame = "walk"
            this.lastDir = "right"
        }
        else if(move.left){
            this.currentFrame = "walk"
            this.lastDir = "left"
        }
        else{
            this.currentFrame = "idle"
        }

        if(this.jump && this.isJumping == false){
            this.currentFrame = "idle"
            this.gravity = -2
            this.lockFrame = true
            this.isJumping = true
        }

        if(this.attack && this.isAttacking == false){
            this.lockFrame = false
            this.currentFrame = "attack"
            this.lockFrame = true
            this.isAttacking = true
            this.checkedAttackCollision = false
        }

        if(this.frameState === frameCount - 1){
            // on frameEnd
            if(this.isAttacking){
                this.isAttacking = false
                this.attack = false
                this.lockFrame = false
            }
        }

        if(this.pos.y + this.gravity > ground){
            // on land
            if(this.isJumping){
               this.isJumping = false
               this.jump = false
               if(!this.isAttacking) this.lockFrame = false
            }
        }

        
        let {isColliding} = this.collision.weapon(enemies[0].pos.x, enemies[0].pos.y, enemies[0].width, enemies[0].height)

        if(isColliding && this.checkedAttackCollision == false){
            let damage = this.character.source.character.damage
            enemies[0].health = parseFloat((enemies[0].health - damage).toFixed(1))
            if(enemies[0].health <= 0){
                enemies[0].health = 0
            }
            this.checkedAttackCollision = true
        }

        let walkSpeed = this.currentFrame === "walk" ? Math.floor(Math.min(speed * 5, stagger_frame * .9)):0
        this.frameState = Math.floor(this.gameFrame / (stagger_frame - walkSpeed)) % frameCount
        
        return {
            ground
        }
    }
    createHealthBar(ctx){
        let x = 5, y = 5, w = 40, h = 3
        if(this.showHealthBar){
            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.fillRect(x - 1, y - 1, w + 2, h + 2)
            ctx.closePath()
            ctx.beginPath()
            ctx.fillStyle = 'red'
            ctx.fillRect(x, y, this.health * w, h)
            ctx.closePath()
        }
    }
    reset(){
        super.reset()
        this.frameName = "idle"
        this.lastDir = "right"

        this.lockFrame = false

        this.velocityX = 0

        this.jump = false
        this.isJumping = false
        this.attack = false
        this.isAttacking = false
    }
}

export class Enemy extends Character{
    constructor(...params){
       super(...params)
       this.character = characters.enemy[this.characterName]

       this.frameKeys = Object.keys(this.character.source.character.map)
       this.frameName = "idle"
       this.lastDir = 'right'
       this.initialPositionX = 100

       this.isAttacking = false
       this.walked = false
       this.canRun = true
       this.velocityX = 0
       
       this.checkedAttackCollision = false
    }
    whileRender({args, frameCount}){
        const {move, background, hero} = args[1]

        this.pos.x = this.initialPositionX + background.pos.x

        if(this.DIED) return

        if(hero.DIED){
            this.currentFrame = 'idle'
        }
        else{
            let collision = this.collision.character(hero.pos.x, hero.pos.y, hero.width, hero.height)
            let {distanceX, isColliding} = collision

            // look towards player
            if(distanceX) this.lastDir = distanceX > 0 ? 'left':'right'

            if(Math.abs(distanceX) < 40){
            if(this.canRun){
                this.currentFrame = 'walk'
                this.velocityX += .05
                this.walked = true
            }
            }
            else{
                this.canRun = true
                this.walked = false
            }

            this.initialPositionX -= this.velocityX * this.direction
            this.velocityX *= .9

            if(Math.abs(distanceX) < 10 && this.walked){
                this.currentFrame = 'idle'
                this.canRun = false
                this.walked = false
                this.velocityX = 0
            }

            if(Math.abs(distanceX) < 10 && this.isAttacking == false){
                this.currentFrame = 'attack'
                this.isAttacking = true
                this.attackFrameCount = 0
                this.checkedAttackCollision = false
            }

            if(this.frameState === frameCount - 1){
                if(this.isAttacking){
                    this.currentFrame = 'idle'
                    this.isAttacking = false
                }
            }

            let isWeaponCollision = this.collision.weapon(hero.pos.x, hero.pos.y, hero.width, hero.height).isColliding

            if(isWeaponCollision && this.checkedAttackCollision == false){
                let damage = this.character.source.character.damage
                hero.health = parseFloat((hero.health - damage).toFixed(1))
                if(hero.health <= 0){
                    hero.health = 0
                }
                this.checkedAttackCollision = true
            }
        }

        return {
            direction: this.direction        
        }
    }
}