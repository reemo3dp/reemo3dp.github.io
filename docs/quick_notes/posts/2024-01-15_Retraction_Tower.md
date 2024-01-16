---
date: 2024-01-15
categories:
  - Klipper
---

# Retraction tower with klipper

One thing that was amazing about _Ultimaker Cura_ was the [https://github.com/5axes/Calibration-Shapes/tree/master](Calibration Shapes) plugin, allowing easy calibration for all major filament parameters.

None of the _SuperSlicer_ forks seem to handle this variety of calibration shapes, and retraction has always been the most problematic one for me.

With Klipper and Firmware Retractions, this turned out to be a lot easier after all:

## Prep Work

Enable Firmware Retraction in your slicer and your klipper configuration and add `SET_RETRACTION` to your start code, e.g. for OrcaSlicer:

```toml
SET_RETRACTION RETRACT_LENGTH={retraction_length[0]} RETRACT_SPEED={retraction_speed[0]} UNRETRACT_SPEED={retraction_speed[0]} UNRETRACT_EXTRA_LENGTH={retract_restart_extra[0]}
```

!!! info

    If you do multi-material printing, there needs to be additional G-Code to set the new filament's retraction settings on Filament Change.

Setup a macro that switches both retraction speeds together:

```toml
[gcode_macro _SET_RETRACTION_SPEED_TOGETHER]
gcode:
  SET_RETRACTION RETRACT_SPEED={ params.RETRACT_SPEED | float } UNRETRACT_SPEED={ params.RETRACT_SPEED | float }
  GET_RETRACTION

[gcode_macro _SET_RETRACTION_LENGTH]
gcode:
  SET_RETRACTION RETRACT_LENGTH={ params.RETRACT_LENGTH | float }
  GET_RETRACTION

[gcode_macro RETRACTION_SPEED_TOWER]
gcode:
  TUNING_TOWER COMMAND=_SET_RETRACTION_SPEED_TOGETHER PARAMETER=RETRACT_SPEED SKIP=0.8 STEP_HEIGHT=7.6 STEP_DELTA={ params.STEP_DELTA | default(10) | float } START={ params.START | default(10) | float }

[gcode_macro RETRACTION_LENGTH_TOWER]
gcode:
  TUNING_TOWER COMMAND=_SET_RETRACTION_LENGTH PARAMETER=RETRACT_LENGTH SKIP=0.8 STEP_HEIGHT=7.6 STEP_DELTA={ params.STEP_DELTA | float } START={ params.START | float }
```

Slice the [`RetractTower.stl`](https://github.com/5axes/Calibration-Shapes/blob/master/models/RetractTower.stl) with arbitrary retraction settings (anything else but disabled) and upload it to the machine.

## Running the test

Start the print, followed by running:

```toml
RETRACTION_SPEED_TOWER STEP_DELTA=10 START=10
```

This will start the test at `20mm` retraction, and increase it by `20mm` every `7.6mm` starting from `0.8mm` height.

Calibrate the speed accordingly, slice the model again, and now run distance:

```toml
RETRACTION_LENGTH_TOWER STEP_DELTA=0.25 START=0.25
```
