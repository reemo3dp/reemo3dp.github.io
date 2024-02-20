---
date: 2024-02-20
categories:
  - Klipper
  - DragonBurner
  - Orbiter
  - Bambu
---

# Filament Loading Menu for Orbiter+DB8+Bambu Hotend

- Adds Heat up and Cooldown Menu Entries
- Extends the feed length to `80mm`, roughly the length from reverse bowden to nozzle.
- Decreases the Fast Load feed rate to `10mm/s` (about `~25mm³/s`) so the extruder doesn't skip.

```toml
[menu __main __filament __heat]
type: command
enable: {'extruder' in printer}
name: Heat to 245C
index: 0
gcode: M104 S245

[menu __main __filament __cooldown]
type: command
enable: {'extruder' in printer}
name: Cooldown
index: 1
gcode: M104 S0

[menu __main __filament __loadf]
type: command
name: Load Fil. fast
gcode:
    SAVE_GCODE_STATE NAME=__filament__load
    M83
    G1 E80 F600
    RESTORE_GCODE_STATE NAME=__filament__load

[menu __main __filament __loads]
type: command
name: Load Fil. slow
gcode:
    SAVE_GCODE_STATE NAME=__filament__load
    M83
    G1 E80 F240
    RESTORE_GCODE_STATE NAME=__filament__load

[menu __main __filament __unloadf]
type: command
name: Unload Fil.fast
gcode:
    SAVE_GCODE_STATE NAME=__filament__load
    M83
    G1 E-80 F960
    RESTORE_GCODE_STATE NAME=__filament__load

[menu __main __filament __unloads]
type: command
name: Unload Fil.slow
gcode:
    SAVE_GCODE_STATE NAME=__filament__load
    M83
    G1 E-80 F240
    RESTORE_GCODE_STATE NAME=__filament__load
```