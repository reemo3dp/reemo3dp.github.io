---
date: 2024-05-24
categories:
  - Voron
  - Klipper
---

# Showing remaining print time on a V0 Display

This is a crude macro to show the remaining print time on a V0 display, sourcing the progress information from `M73 R` if available, and afterwards falling back to `M73 P` averaged with the file progress.

If you're not using the [`lcd_tweaks.cfg` by alchemyEngine](https://github.com/VoronDesign/Voron-Documentation/blob/b59ea5173cc68d0d48ce5f27cc9012c17dc2b45c/community/howto/alchemyEngine/lcd_tweaks.cfg), you may need to replace the `[display_data]` section headline as such:

```diff
-[display_data __voron_display printing_time]
+[display_data _printing_time]
```

The time will be shown in HH:MM format. It is probably not as accurate as mainsail is, as it can also use the total filament used (from moonraker) to approximate the remaining time.

```toml
[gcode_macro M73]
rename_existing: M73.0
variable_remaining_time_minutes: False
gcode:
  SET_GCODE_VARIABLE MACRO=M73 VARIABLE=remaining_time_minutes VALUE={params.R | default(false) }
  M73.0 {rawparams}

[display_data __voron_display printing_time]
position: 2, 10
text:
  {% if printer.print_stats.state == "printing" %}
    {% set remaining_time_in_minutes = printer['gcode_macro M73'].remaining_time_minutes %}
    {% if remaining_time_in_minutes is sameas false %}
      {% set progress = (printer.display_status.progress + printer.virtual_sdcard.progress)/2 %}
      {% set remaining_time_in_minutes = ((printer.print_stats.print_duration / progress) - printer.print_stats.print_duration) // 60 %}
    {% endif %}    
    { "E%02d:%02d" % (remaining_time_in_minutes // (60), (remaining_time_in_minutes) % 60) }
  {% endif %}
```
