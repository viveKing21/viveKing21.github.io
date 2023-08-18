const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const isColliding = (a, b) => {
    return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height
}

const defaultParams = (...default_params) => {
    return (fn, ...params) => {
        try{
            return new fn(...default_params, ...params)
        }
        catch(e){
            return fn(...default_params, ...params)
        }
    }
}

const propertyBinder = (target, object, keys) => {
    keys.forEach(key => {
        target[key] = object[key]
    })
}

const minmax = (value, min, max) => Math.min(max, Math.max(value, min))

const percentageBetween = (tenths, min, max) => min + tenths * (max - min)

export {randomBetween, isColliding, defaultParams, propertyBinder, minmax, percentageBetween}