---
date: 2024-01-15
categories:
  - Klipper
---

# Retraciton tower with klipper

One thing that was amazing about *Ultimaker Cura* was the [https://github.com/5axes/Calibration-Shapes/tree/master](Calibration Shapes) plugin, allowing easy calibration for all major filament parameters.

None of the *SuperSlicer* forks seem to handle this variety of calibration shapes, and retraction has always been the most problematic one for me.

With Klipper and Firmware Retractions, this turned out to be a lot easier after all:

## Prep Work

Setup a macro that switches both retraction speeds together:

```
[gcode_macro _SET_RETRACTION_SPEED_TOGETHER]
gcode:
  SET_RETRACTION RETRACT_SPEED={ params.RETRACT_SPEED | float } UNRETRACT_SPEED={ params.RETRACT_SPEED | float }
```

Slice the [`RetractTower.stl`](https://github.com/5axes/Calibration-Shapes/blob/master/models/RetractTower.stl) with arbitrary retraction settings (anything else but disabled) and upload it to the machine.

## Running the test

Start the print, followed by running:

```
TUNING_TOWER COMMAND=_SET_RETRACTION_SPEED PARAMETER=RETRACT_SPEED SKIP=0.8 STEP_HEIGHT=7.6 STEP_DELTA=20 START=20
```

This will start the test at `20mm` retraction, and increase it by `20mm` every `7.6mm` starting from `0.8mm` height.

Calibrate the speed accordingly, slice the model again, and now run distance:

```
TUNING_TOWER COMMAND=SET_RETRACTION PARAMETER=RETRACT_LENGTH SKIP=0.8 STEP_HEIGHT=7.6 STEP_DELTA=0.25 START=0.25
```