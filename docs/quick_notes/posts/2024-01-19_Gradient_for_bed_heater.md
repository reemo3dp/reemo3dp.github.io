---
date: 2024-01-19
categories:
  - Klipper
  - led-effects
---

# My heater gradient to show bed temperature during heatup

```toml
[led_effect bed_heating]
leds:
    neopixel:disco20_bed8 (1-20)
autostart:                          false
frame_rate:                         24
heater:                             heater_bed
layers:
    linearfade  5 0 multiply (0.2,0.2,0.2),(1,1,1)
    heater  20 0 top (0.227,0.427,0.705),(0.113,1,0.168),(1,0.85,0.168),(1.00,0.47,0.00),(1,0.392,0.196),(1,0.313,0.156),(1,0.078,0.078),(1,0,0),(1,0,0)
```

![Bed heating from the simulator](./2024-01-19_bed_heater_gradient.webp)

With that, I override `M190` so this always happens when the printer waits for the bed to heat.

```toml
[gcode_macro M190]
description: Wait and show heating bed
rename_existing: M190.0
gcode:
  SET_LED_EFFECT EFFECT=bed_heating
  M190.0 {rawparams}
  SET_LED_EFFECT EFFECT=bed_heating STOP=1
```