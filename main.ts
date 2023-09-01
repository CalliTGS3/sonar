function SendeWerte () {
	
}
function ZeichneSonarRadius () {
    OLED12864_I2C.clear()
    OLED12864_I2C.circle(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Radius,
    1
    )
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (EntfernungCMMax < 400) {
        EntfernungCMMax += 10
    }
})
function MesseEntfernung () {
    for (let ListenIndex = 0; ListenIndex <= 4; ListenIndex++) {
        // send pulse
        pins.digitalWritePin(DigitalPin.P0, 0)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P0, 1)
        control.waitMicros(10)
        pins.digitalWritePin(DigitalPin.P0, 0)
        USPulsdauer = pins.pulseIn(DigitalPin.P1, PulseValue.High)
        if (USPulsdauer > 0 && USPulsdauer < 200000) {
            EntfernungCM = Math.trunc(USPulsdauer * 153 / 29 / 2 / 100)
        } else {
            EntfernungCM = 0
        }
        EntfernungsListe[ListenIndex] = EntfernungCM
    }
    EntfernungsListe.sort()
EntfernungCM = EntfernungsListe[2]
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    Abtasten = !(Abtasten)
})
function ZeichneSonar () {
    EntfernungPixel = Math.ceil(Strahl * EntfernungCM / EntfernungCMMax)
    OLED12864_I2C.showNumber(
    22,
    0,
    EntfernungCMMax,
    1
    )
    OLED12864_I2C.showNumber(
    0,
    0,
    EntfernungCM,
    1
    )
    OLED12864_I2C.showNumber(
    0,
    1,
    WinkelServo,
    1
    )
    OLED12864_I2C.radius_line(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Strahl,
    Winkel,
    1
    )
    OLED12864_I2C.radius_line(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Strahl,
    Winkel,
    0
    )
    if (EntfernungPixel > 0) {
        OLED12864_I2C.radius_circle(
        Mittelpunkt_X,
        Mittelpunkt_Y,
        EntfernungPixel,
        Winkel,
        2,
        1
        )
    }
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (EntfernungCMMax > 50) {
        EntfernungCMMax += -10
    }
})
let ServoPulsdauer = 0
let Winkel = 0
let WinkelServo = 0
let EntfernungPixel = 0
let EntfernungCM = 0
let USPulsdauer = 0
let Abtasten = false
let EntfernungCMMax = 0
let Radius = 0
let Strahl = 0
let Mittelpunkt_Y = 0
let Mittelpunkt_X = 0
let EntfernungsListe: number[] = []
radio.setGroup(1)
OLED12864_I2C.init(60)
OLED12864_I2C.zoom(false)
Mittelpunkt_X = 64
Mittelpunkt_Y = 64
Strahl = 62
Radius = Strahl + 2
let Abtastbereich = 180
let Abtastungen = 20
let VonRechtsNachLinks = true
EntfernungCMMax = 60
Abtasten = false
while (!(input.buttonIsPressed(Button.A))) {
	
}
Abtasten = true
EntfernungsListe = [
0,
0,
0,
0,
0
]
basic.forever(function () {
    ZeichneSonarRadius()
    if (Abtasten) {
        for (let ListenIndex2 = 0; ListenIndex2 <= Abtastungen - 1; ListenIndex2++) {
            if (VonRechtsNachLinks) {
                Winkel = ListenIndex2 * Math.idiv(Abtastbereich, Abtastungen)
            } else {
                Winkel = Abtastbereich - ListenIndex2 * Math.idiv(Abtastbereich, Abtastungen)
            }
            MesseEntfernung()
            ZeichneSonar()
            SendeWerte()
            WinkelServo = Math.trunc(Winkel / 10) * 10
            ServoPulsdauer = WinkelServo * 1800 / 180 + 600
            ServoPulsdauer = Math.constrain(ServoPulsdauer, 600, 2300)
            Servo.ServoPulse(0, ServoPulsdauer)
            basic.pause(20)
        }
        VonRechtsNachLinks = !(VonRechtsNachLinks)
    } else {
    	
    }
})
