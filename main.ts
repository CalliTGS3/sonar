function TasteBereichAb () {
    OLED12864_I2C.showNumber(
    22,
    0,
    EntfernungCMMax,
    1
    )
    MesseEntfernung()
    if (Winkel == 0) {
        WinkelServo = 2
    } else {
        if (Winkel == 180) {
            WinkelServo = 178
        } else {
            WinkelServo = Winkel
        }
    }
    pins.servoWritePin(AnalogPin.P2, WinkelServo)
    basic.pause(20)
    OLED12864_I2C.line(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Math.ceil(Mittelpunkt_X + Strahl * Math.cos((360 - Winkel) * 3.14 / Abtastbereich)),
    Math.ceil(Mittelpunkt_Y + Strahl * Math.sin((360 - Winkel) * 3.14 / Abtastbereich)),
    1
    )
    OLED12864_I2C.line(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Math.ceil(Mittelpunkt_X + Strahl * Math.cos((360 - Winkel) * 3.14 / Abtastbereich)),
    Math.ceil(Mittelpunkt_Y + Strahl * Math.sin((360 - Winkel) * 3.14 / Abtastbereich)),
    0
    )
    if (EntfernungPixel > 0) {
        OLED12864_I2C.circle(
        Math.round(Mittelpunkt_X + EntfernungPixel * Math.cos((360 - Winkel) * 3.14 / Abtastbereich)),
        Math.round(Mittelpunkt_Y + EntfernungPixel * Math.sin((360 - Winkel) * 3.14 / Abtastbereich)),
        2,
        1
        )
    }
}
input.onButtonPressed(Button.A, function () {
    if (EntfernungCMMax < 400) {
        EntfernungCMMax += 10
    }
})
function MesseEntfernung () {
    // send pulse
    pins.digitalWritePin(DigitalPin.P0, 0)
    control.waitMicros(2)
    pins.digitalWritePin(DigitalPin.P0, 1)
    control.waitMicros(10)
    pins.digitalWritePin(DigitalPin.P0, 0)
    Pulsdauer = pins.pulseIn(DigitalPin.P1, PulseValue.High)
    if (Pulsdauer > 0 && Pulsdauer < 200000) {
        EntfernungCM = Math.trunc(Pulsdauer * 153 / 29 / 2 / 100)
    } else {
        EntfernungCM = 0
    }
    EntfernungPixel = Strahl * EntfernungCM / EntfernungCMMax
    OLED12864_I2C.showNumber(
    0,
    0,
    EntfernungCM,
    1
    )
}
function ErmitteZufaelligesHindernis () {
    Hindernis = randint(1, 10)
    if (Hindernis == 10) {
        EntfernungPixel = randint(10, 60)
    } else {
        EntfernungPixel = 0
    }
}
input.onButtonPressed(Button.B, function () {
    if (EntfernungCMMax > 50) {
        EntfernungCMMax += -10
    }
})
let Hindernis = 0
let EntfernungCM = 0
let Pulsdauer = 0
let EntfernungPixel = 0
let WinkelServo = 0
let Winkel = 0
let EntfernungCMMax = 0
let Abtastbereich = 0
let Strahl = 0
let Mittelpunkt_Y = 0
let Mittelpunkt_X = 0
OLED12864_I2C.init(60)
OLED12864_I2C.zoom(false)
Mittelpunkt_X = 64
Mittelpunkt_Y = 64
Strahl = 62
let Radius = Strahl + 2
Abtastbereich = 180
let Abtastungen = 20
let VonRechtsNachLinks = true
EntfernungCMMax = 100
basic.forever(function () {
    OLED12864_I2C.clear()
    OLED12864_I2C.circle(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Radius,
    1
    )
    for (let Index = 0; Index <= Abtastungen - 1; Index++) {
        if (VonRechtsNachLinks) {
            Winkel = Index * Math.idiv(Abtastbereich, Abtastungen)
        } else {
            Winkel = Abtastbereich - Index * Math.idiv(Abtastbereich, Abtastungen)
        }
        TasteBereichAb()
    }
    VonRechtsNachLinks = !(VonRechtsNachLinks)
})
