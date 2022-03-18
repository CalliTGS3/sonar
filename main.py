def TasteBereichAb():
    global WinkelServo
    OLED12864_I2C.show_number(22, 0, EntfernungCMMax, 1)
    MesseEntfernung()
    if Winkel == 0:
        WinkelServo = 2
    else:
        if Winkel == 180:
            WinkelServo = 178
        else:
            WinkelServo = Winkel
    pins.servo_write_pin(AnalogPin.P2, WinkelServo)
    basic.pause(20)
    OLED12864_I2C.line(Mittelpunkt_X,
        Mittelpunkt_Y,
        Math.ceil(Mittelpunkt_X + Strahl * Math.cos((360 - Winkel) * 3.14 / Abtastbereich)),
        Math.ceil(Mittelpunkt_Y + Strahl * Math.sin((360 - Winkel) * 3.14 / Abtastbereich)),
        1)
    OLED12864_I2C.line(Mittelpunkt_X,
        Mittelpunkt_Y,
        Math.ceil(Mittelpunkt_X + Strahl * Math.cos((360 - Winkel) * 3.14 / Abtastbereich)),
        Math.ceil(Mittelpunkt_Y + Strahl * Math.sin((360 - Winkel) * 3.14 / Abtastbereich)),
        0)
    if EntfernungPixel > 0:
        OLED12864_I2C.circle(Math.round(Mittelpunkt_X + EntfernungPixel * Math.cos((360 - Winkel) * 3.14 / Abtastbereich)),
            Math.round(Mittelpunkt_Y + EntfernungPixel * Math.sin((360 - Winkel) * 3.14 / Abtastbereich)),
            2,
            1)

def on_button_pressed_a():
    global EntfernungCMMax
    if EntfernungCMMax < 400:
        EntfernungCMMax += 10
input.on_button_pressed(Button.A, on_button_pressed_a)

def MesseEntfernung():
    global Pulsdauer, EntfernungCM, EntfernungPixel
    # send pulse
    pins.digital_write_pin(DigitalPin.P0, 0)
    control.wait_micros(2)
    pins.digital_write_pin(DigitalPin.P0, 1)
    control.wait_micros(10)
    pins.digital_write_pin(DigitalPin.P0, 0)
    Pulsdauer = pins.pulse_in(DigitalPin.P1, PulseValue.HIGH)
    if Pulsdauer > 0 and Pulsdauer < 200000:
        EntfernungCM = int(Pulsdauer * 153 / 29 / 2 / 100)
    else:
        EntfernungCM = 0
    EntfernungPixel = Strahl * EntfernungCM / EntfernungCMMax
    OLED12864_I2C.show_number(0, 0, EntfernungCM, 1)
def ErmitteZufaelligesHindernis():
    global Hindernis, EntfernungPixel
    Hindernis = randint(1, 10)
    if Hindernis == 10:
        EntfernungPixel = randint(10, 60)
    else:
        EntfernungPixel = 0

def on_button_pressed_b():
    global EntfernungCMMax
    if EntfernungCMMax > 50:
        EntfernungCMMax += -10
input.on_button_pressed(Button.B, on_button_pressed_b)

Hindernis = 0
EntfernungCM = 0
Pulsdauer = 0
EntfernungPixel = 0
WinkelServo = 0
Winkel = 0
EntfernungCMMax = 0
Abtastbereich = 0
Strahl = 0
Mittelpunkt_Y = 0
Mittelpunkt_X = 0
OLED12864_I2C.init(60)
OLED12864_I2C.zoom(False)
Mittelpunkt_X = 64
Mittelpunkt_Y = 64
Strahl = 62
Radius = Strahl + 2
Abtastbereich = 180
Abtastungen = 20
VonRechtsNachLinks = True
EntfernungCMMax = 100

def on_forever():
    global Winkel, VonRechtsNachLinks
    OLED12864_I2C.clear()
    OLED12864_I2C.circle(Mittelpunkt_X, Mittelpunkt_Y, Radius, 1)
    Index = 0
    while Index <= Abtastungen - 1:
        if VonRechtsNachLinks:
            Winkel = Index * Math.idiv(Abtastbereich, Abtastungen)
        else:
            Winkel = Abtastbereich - Index * Math.idiv(Abtastbereich, Abtastungen)
        TasteBereichAb()
        Index += 1
    VonRechtsNachLinks = not (VonRechtsNachLinks)
basic.forever(on_forever)
