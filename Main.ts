// init
let colour: custom.Hue = {
    h: 160,
    s: 100,
    v: 50,
}
let timeout = 1 /* minutes */ * 60
let timer = control.timer1
let debounceTimer = control.timer2
let tapTimer = control.timer3
let tapCounter = 0
let state = custom.State.Fuzzy
let lastState = custom.State.Off
light.setBrightness(255)

// So many pretty events
enum Event {
    Tick = 22,
    Press
}

enum Tick {
    Second
}

function incrementHue(h: custom.Hue): custom.Hue {
    h.h += 1
    return h
}
function updateState(st: custom.State) {
    state = st
}

input.onLoudSound(function () {
    if (debounceTimer.millis() <= 10) { return }
    debounceTimer.reset()

    changeMode()
})

// system event handler
control.onEvent(Event.Tick, Tick.Second, function () {
    colour = incrementHue(incrementHue(incrementHue(colour)))
})

function Rainbow() {
    light.showAnimation(light.rainbowAnimation, 500)
}

function Fuzzy() {
    let rgb = light.hsv(colour.h, colour.s, colour.v)
    light.setAll(rgb)
}

function Normal() {
    light.setAll(0xffffff)
}

function handlepinA1Press() {
    debounceTimer.reset()
    switch (state) {
        case custom.State.Off:
            updateState(custom.State.Fuzzy)
            break
        case custom.State.Fuzzy:
            updateState(custom.State.Normal)
            break
        case custom.State.Normal:
            updateState(custom.State.Off)
            break
    }
}

function handleKeys() {
    if (debounceTimer.millis() <= 50) { return }
    if (input.pinA1.isPressed()) { handlepinA1Press() }
}

function onOff() {
    switch (state) {
        case custom.State.Off:
            updateState(custom.State.Fuzzy)
            break
        default:
            updateState(custom.State.Off)
            break
    }
}

function changeMode() {
    switch (state) {
        case custom.State.Fuzzy:
            updateState(custom.State.Normal)
            break
        case custom.State.Normal:
            updateState(custom.State.Rainbow)
            break
        case custom.State.Rainbow:
            updateState(custom.State.Fuzzy)
            break
        default:
            updateState(custom.State.Fuzzy)
            break
    }
}

forever(function () {
    if (timer.seconds() > 1) {
        control.raiseEvent(Event.Tick, Tick.Second)
        timer.reset()
    }
    // if (tapCounter > 0 && tapTimer.millis() > 250) {
    //     switch (tapCounter) {
    //         case 1:
    //             onOff()
    //         case 2:
    //         case 3:
    //         case 4:
    //             changeMode()
    //         default:

    //     }
    //     tapCounter = 0
    // }
    handleKeys()
    custom.printState(state)
    switch (state) {
        case custom.State.Fuzzy:
            Fuzzy()
            break
        case custom.State.Normal:
            Normal()
            break
        case custom.State.Rainbow:
            Rainbow()
            break
        case custom.State.Off:
            light.clear()
    }
})
