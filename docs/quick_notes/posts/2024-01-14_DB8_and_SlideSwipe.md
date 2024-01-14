---
date: 2024-01-14
categories:
  - Dragonburner
  - SlideSwipe
  - Neopixel
---

# Dragonburner DB8 with SlideSwipe

Installed [chirpy2605's Dragonburner with SlideSwipe](https://github.com/chirpy2605/voron/tree/main/V0/Dragon_Burner) today. As I'm also using Rainbow on a Matchstick, I had to reduce the stowed angle of SlideSwipe to `55` degrees to avoid the servo arm hitting the matchstick.

```toml
[servo probeServo]
pin: SERVO
minimum_pulse_width: 0.000544
initial_angle: 55
```

[chestwood96's SlideSwipe](https://github.com/chestwood96/SlideSwipe) works surpsingly well with the Dragonburner.

I added the following to make it work with `KAMP`:

```toml
[gcode_macro MESH_START]
gcode:
    G91
    G1 Z1
    G90
    Query_Probe
    SS_CONDITIONAL_TAKE_PROBE

[gcode_macro MESH_END]
gcode:
    SS_STOW_PROBE

[gcode_macro _KAMP_Settings]
description: This macro contains all adjustable settings for KAMP

# ... SNIP ...

# The following variables are for those with a dockable probe like Klicky, Euclid, etc.                 # ----------------  Attach Macro | Detach Macro
variable_probe_dock_enable: True           # Set to True to enable the usage of a dockable probe.      # ---------------------------------------------
variable_attach_macro: 'MESH_START'       # The macro that is used to attach the probe.               # Klicky Probe:   'Attach_Probe' | 'Dock_Probe'
variable_detach_macro: 'MESH_END'         # The macro that is used to store the probe.                # Euclid Probe:   'Deploy_Probe' | 'Stow_Probe'

# ... SNIP ...
```
