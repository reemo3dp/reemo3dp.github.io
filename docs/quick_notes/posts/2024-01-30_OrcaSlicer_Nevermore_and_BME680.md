---
date: 2024-01-30
categories:
  - Klipper
  - OrcaSlicer
---

# Macros to use M106 and M191 with Nevermore

![Air Filtration Settings in OrcaSlicer under Cooling "Exhaust Fan"](./2024-01-30_OrcaSlicer_Nevermore_and_BME680_Air_Filtration.png)

```toml
[gcode_macro M106]
rename_existing: M106.0
gcode:
  {% set nevermore = params.P == "3" %}
  {% if nevermore %}
    SET_FAN_SPEED FAN="nevermore" SPEED={(params.S | float)/255.0}
  {% else %}
    M106.0 {rawparams}
  {% endif %}
```

![Chamber Temperature Setting in OrcaSlicer under "Filament"](./2024-01-30_OrcaSlicer_Nevermore_and_BME680_Chamber_Temp.png)

```toml
[gcode_macro M191]
gcode:
  {% set min = params.S|float %}
  ;; From Heat-Soak Macro
  ;; fire up the heater
  SET_HEATER_TEMPERATURE HEATER=heater_bed TARGET=105
  ;; run the fans to circulate air
  _FAN_SOAK
  ;; home the printer
  G28
  ;; put the bed and nozzle where they're a safe distance apart
  G90
  G1 X60 Y60 Z80
  TEMPERATURE_WAIT SENSOR="temperature_sensor bme680" MINIMUM={min}
```
