---
date: 2024-03-23
categories:
  - Voron
  - Klipper
---

# Using the RatOs Filament Unload Macro

RatOS has a very nice filament unload macro that seemingly produces a nice tip and reduces stringing. Adding it to a vanilla klipper installation is easy too:

```toml
# Based on https://github.com/Rat-OS/RatOS-configuration/blob/4d5e42e90abb7f82161ba096ebb6845bc7e9d71b/macros.cfg#L295-L323
[gcode_macro UNLOAD_FILAMENT]
description: Unloads the filament. Note: be careful with PETG, make sure you inspect the tip of your filament before reloading to avoid jams.
variable_filament_unload_length: 130
variable_filament_unload_speed: 5
gcode:
	SAVE_GCODE_STATE NAME=unload_state
	G91
	{% if params.TEMP is defined or printer.extruder.can_extrude|lower == 'false' %}
		M117 Heating...
		# Heat up hotend to provided temp or 220 as default as that should work OK with most filaments.
		M104 S{params.TEMP|default(220, true)}
		TEMPERATURE_WAIT SENSOR=extruder MINIMUM={params.TEMP|default(220, true)}
	{% endif %}
	{% set unload_speed = printer["gcode_macro UNLOAD_FILAMENT"].filament_unload_speed|float * 60 %}
	{% set unload_length = printer["gcode_macro UNLOAD_FILAMENT"].filament_unload_length|float %}
	M117 Unloading filament...
	# Extrude a bit
	G0 E10 F300
	# Extract filament to cold end area 
	G0 E-5 F3600
	# Wait for three seconds
	G4 P3000
	# Push back the filament to smash any stringing 
	G0 E5 F3600
	# Extract back fast in to the cold zone 
	G0 E-15 F3600
	# Continue extraction slowly, allow the filament time to cool solid before it reaches the gears       
	G0 E-{unload_length} F{unload_speed}
	M117 Filament unloaded!
	RESPOND MSG="Filament unloaded! Please inspect the tip of the filament before reloading."
	RESTORE_GCODE_STATE NAME=unload_state
```

All I did was move the variables `filament_unload_speed` and `filament_unload_length` from the RatOs configuration macro to this macro.