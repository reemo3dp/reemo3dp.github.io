## Important Build Notes

- Siboor's kit is an accumulation of hardware from different vendors. **Siboor has done little to no preparations to make those hardware parts work together**:
- Fan plugs might have the wrong polarity. Doesn't need crimping, just changing the pins on the JST plug
- Dec' 23 has seen an influx of kits that shipped with faulty drivers. If your stepper drivers randomly fail (early into setting up the printer), power it down and contact Siboor. **There has not been a fix for this in place. If your drivers are bad, all of them need to be replaced**. (Bonus points if you send me a DM on discord with high-res photos of the drivers)
- Powering off the printer needs to be done by shutting down the printer through mainsail or ssh, waiting until the host led's stop flashing and only then flipping the switch. Otherwise, changes to your configuration might not be saved. See [#details-on-powering-off-the-printer](#details-on-powering-off-the-printer)

## Random Build Notes

- The V0 Display comes unflashed
- Gemini presumably comes with a hid-flash bootloader, so `BOOT1` needs to be `LOW` and reset to put the device into HID-flash mode. (<https://github.com/Arksine/STM32_HID_Bootloader>)
- Klipper on all Fly images is outdated. If you know how to setup kiauh yourself, use [mellow's stock armbian](http://mellow.klipper.cn/#/introduction/downloadimg) image or build your own armbian image using [my patches](https://github.com/reemo3dp/mellowfly-geminipi-armbian).
- Swap the ports for the board-fan and the hotend-fan so the hotend fan can be controlled
- There's a 5V fan port on the host-side of the gemini

## Mods I've installed

- [Nevermore Micro V6](https://github.com/nevermore3d/Nevermore_Micro/tree/master/V6)
- [chirpy2605's Lift-Off Tophat](https://github.com/chirpy2605/voron/tree/main/V0/Lift-Off_Tophat_Hinges) with [my mod that adds a backstop](https://www.printables.com/model/659597-chirpys-v02-lift-off-tophat-hinges-with-backstop)
- [Magnetic Backplate](https://www.printables.com/model/659597-chirpys-v02-lift-off-tophat-hinges-with-backstop) by me
- [V0 Upper Rear Bowden Inlet by MapleLeafMakers](https://github.com/MapleLeafMakers/V0_Upper_Rear_Bowden_Inlet/tree/main) with [my mod to rotate the BTT SFS Filament Sensor](https://github.com/MapleLeafMakers/V0_Upper_Rear_Bowden_Inlet/pull/1)

## Flashing without `fly-flash`

`fly-flash` is bloat that does nothing but switch the GPIO pins `BOOT1` (`PD2`) and `RST` (`PD2`) to put the Gemini MCU into HID-flash mode.

``` bash title="Put the Gemini MCU into HID mode"
# Adapted from https://cdn.mellow.klipper.cn/Utils/fly-flash/fly-flash
PD4="100"
PD2="98"

BOOT1="$PD2"
G_BOOT1="/sys/class/gpio/gpio${BOOT1}"
RST="$PD4"
G_RST="/sys/class/gpio/gpio${RST}"

echo "$RST" > /sys/class/gpio/export
echo "$BOOT1" > /sys/class/gpio/export

echo "out" > "$G_BOOT1/direction"
echo "out" > "$G_RST/direction"

echo "Press enter to reboot the Gemini MCU into the HID bootloader"
read
echo "1" > "$G_BOOT1/value"
sleep 1
echo "0" > "$G_RST/value"
sleep 1
echo "1" > "$G_RST/value"

echo "Proceed with flashing the gemini mcu using hid-flash from klipper"
echo "Press enter to reboot the Gemini into klipper again"
read
echo "0" > "$G_BOOT1/value"
sleep 1
echo "0" > "$G_RST/value"
sleep 1
echo "1" > "$G_RST/value"
```

## Autotune Config

``` toml
[motor_constants siboor-35sth52-1204a_fixed]
#Siboor BOM Voron 0.2 steppers
resistance: 2.3
inductance: 0.0035
holding_torque: 0.36
max_current: 1.2
steps_per_revolution: 200

[motor_constants siboor-42sth26-0804a-200]
resistance: 5.50
inductance: 0.0066
holding_torque: 0.26
max_current: 1.00
steps_per_revolution: 200

[autotune_tmc stepper_x]
motor: siboor-35sth52-1204a_fixed
sg4_thrs: 118
tuning_goal: performance

[autotune_tmc stepper_y]
motor: siboor-35sth52-1204a_fixed
sg4_thrs: 118
tuning_goal: performance

[autotune_tmc stepper_z]
motor: siboor-42sth26-0804a-200
tuning_goal: performance
```

### A hacky script to switch between PERFORMANCE and SILENT while hard-capping velocity

``` toml
[gcode_macro SET_VELOCITY_LIMIT]
rename_existing: _SET_VELOCITY_LIMIT
variable_cap_enabled: False
variable_velocity: 0
variable_accel: 0
variable_accel_to_decel: 0
variable_square_corner_velocity: 0
gcode:
  {% if params.CAP != 'True' and (not cap_enabled) %}
    _SET_VELOCITY_LIMIT {rawparams}
  {% else %}
    {% if params.CAP == 'True' %}
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=cap_enabled VALUE=True
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=velocity VALUE={params.VELOCITY | default(0) | float }
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=accel VALUE={params.ACCEL | default(0) | float }
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=accel_to_decel VALUE={params.ACCEL_TO_DECEL | default(0) | float }
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=square_corner_velocity VALUE={params.SQUARE_CORNER_VELOCITY | default(0) | float }
    {% elif params.CAP == 'False' %}
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=cap_enabled VALUE=False
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=velocity VALUE=0
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=accel VALUE=0
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=accel_to_decel VALUE=0
      SET_GCODE_VARIABLE MACRO=SET_VELOCITY_LIMIT VARIABLE=square_corner_velocity VALUE=0
    {% else %}
      _SET_VELOCITY_LIMIT { "VELOCITY={}".format([params.VELOCITY | float, velocity] | min) if params.VELOCITY else "" } { "ACCEL={}".format([params.ACCEL | float, accel] | min) if params.ACCEL else "" } { "ACCEL_TO_DECEL={}".format([params.ACCEL_TO_DECEL | float, accel_to_decel] | min) if params.ACCEL_TO_DECEL else "" } { "SQUARE_CORNER_VELOCITY={}".format([params.SQUARE_CORNER_VELOCITY | float, square_corner_velocity] | min) if params.SQUARE_CORNER_VELOCITY else "" }
    {% endif %}
  {% endif %}


[gcode_macro SILENT]
gcode:
  {action_respond_info("Silent activated")}
  SET_VELOCITY_LIMIT CAP=True VELOCITY=150 ACCEL=5000 ACCEL_TO_DECEL=2500 SQUARE_CORNER_VELOCITY=5
  SET_TMC_FIELD STEPPER=stepper_y FIELD=SGTHRS VALUE=80
  SET_TMC_FIELD STEPPER=stepper_x FIELD=SGTHRS VALUE=80
  AUTOTUNE_TMC STEPPER=stepper_y tuning_goal=silent sg4_thrs=80
  AUTOTUNE_TMC STEPPER=stepper_x tuning_goal=silent sg4_thrs=80

[gcode_macro PERFORMANCE]
gcode:
  {action_respond_info("Performance activated")}
  SET_VELOCITY_LIMIT CAP=False
  SET_TMC_FIELD STEPPER=stepper_y FIELD=SGTHRS VALUE=118
  SET_TMC_FIELD STEPPER=stepper_x FIELD=SGTHRS VALUE=118
  AUTOTUNE_TMC STEPPER=stepper_y tuning_goal=performance sg4_thrs=118
  AUTOTUNE_TMC STEPPER=stepper_x tuning_goal=performance sg4_thrs=118
```

## Details on powering off the printer

FlyOS by default sets the root filesystems' commit interval to `600 seconds`. This means that, unless explicitly flushed, changes to files will only be written to the sd card every `10 minutes`. In the worst case, this means you will loose any changes to your klipper configuration, updates you've installed or models you've uploaded in the last ten minutes.

You can change the commit interval to a lower value (`5` is the default) in `/etc/fstab`. After changing the value, reboot.

In any case, the host system is stateful and not designed to be switched off instantaneously. [Ellis' shutdown macro](https://ellis3dp.com/Print-Tuning-Guide/articles/useful_macros/shut_down_host.html) can be included in the V0 display menu to make shutting down the printer easier. A good rule of thumb: **Click on shutdown, count to 10, flip the switch**.