# My Build

## Settings

### Bed Screws

```toml
[bed_screws]
screw1: 60, 10
screw1_name: Front
screw2: 10, 110
screw2_name: Left
screw3: 110, 110
screw3_name: Right
```

### Nevermore

(Part-Cooling on `FAN0`, Hotend Fan always-on on `FAN1`, Board Fan always-on on `CORE_FAN`):

```toml
[fan_generic nevermore]
pin: FAN1
```

### [TMC Autotune](./motors.md#tmc-autotune)

### `DUMP_Z_OFFSET` Macro

Goes into `PRINT_END` macro:

```toml
[gcode_macro DUMP_Z_OFFSET]
description: Dumps the current Z_OFFSET
gcode:
  {action_respond_info("config.settings.stepper_z.position_endstop: {}, gcode_move.homing_origin.z: {}, effective z-offset: {}".format(
            printer.configfile.settings.stepper_z.position_endstop,
            printer.gcode_move.homing_origin.z,
            printer.configfile.settings.stepper_z.position_endstop - printer.gcode_move.homing_origin.z,
        ))}
```

### `UNLOAD_FILAMENT_AT_END_OF_PRINT` Macro

```toml
[gcode_macro PRINT_END]
gcode:
  # ...
  {% if printer["gcode_macro PRINT_END"].unload_filament == True %}
    G1 E-.8 F2700
    G1 E-50 F1000
  {% endif %}
  M104 S0 ;Turn-off hotend

[gcode_macro UNLOAD_FILAMENT_AT_END_OF_PRINT]
description: Unload the filament at the end of the print
gcode:
  SET_GCODE_VARIABLE macro=PRINT_END variable=unload_filament value=True
```

## Additional Hardware

### [BigTreeTech Smart Filament Sensor V2.0](https://biqu.equipment/products/btt-sfs-v2-0-smart-filament-sensor)

on STLINK using `PA13` and `PA14` (`5V` doesn't seem reliable with regards to the motion sensor, I'm considering switching back to `3.3V`):

```toml
[filament_switch_sensor filament_switch]
switch_pin: ^PA13    # Use the correct pin for your mainboard.
pause_on_runout: True

[filament_motion_sensor filament_motion]
switch_pin: ^PA14    # Use the correct pin for your mainboard.
extruder: extruder
pause_on_runout: True
detection_length: 50
```

### [BME680/CJMCU680 Chamber Temperature Sensor](https://aliexpress.com/item/1005005970382773.html)

on `i2c3` (`SCL`: `PA8`/`LCD-D5`, `SDA`: `PC9`/`SBC_transfer` using `3.3V` from `STLINK`:

```toml
[temperature_sensor bme680]
sensor_type: BME280
i2c_bus: i2c3
i2c_address: 119
```

## Mods I've installed

- [Rainbow on a Matchstick](https://github.com/VoronDesign/Voron-Hardware/tree/master/Daylight/Rainbow_on_a_matchstick)
- [Nevermore Micro V6](https://github.com/nevermore3d/Nevermore_Micro/tree/master/V6)
- [chirpy2605's Lift-Off Tophat](https://github.com/chirpy2605/voron/tree/main/V0/Lift-Off_Tophat_Hinges) with [my mod that adds a backstop](https://www.printables.com/model/659597-chirpys-v02-lift-off-tophat-hinges-with-backstop)
- [Magnetic Backplate](https://www.printables.com/model/659559-magnetic-backplate-for-voron-v02) by me with a [Noctua NF-A8-5V-PWM](https://noctua.at/en/products/fan/nf-a8-5v-pwm)
- [V0 Upper Rear Bowden Inlet by MapleLeafMakers](https://github.com/MapleLeafMakers/V0_Upper_Rear_Bowden_Inlet/tree/main) with [my mod to rotate the BTT SFS Filament Sensor](https://github.com/MapleLeafMakers/V0_Upper_Rear_Bowden_Inlet/pull/1)
