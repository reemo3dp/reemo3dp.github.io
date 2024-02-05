# Remove Extrusions from G-Code

This tool can be used to remove any extrusion from g-code, to e.g. pin-point mechanical issues without extrusion.

It comments out the following commands:

- `G1`/`G0` with `E` parameter (`F` parameter is preserved, if present)
- `G10`/`G11` retraction commands
- `M104`, `M109`, `M140`, `M190`, `M192` heater related commands

<script type="module" src="/assets/js/GCodeRemoveExtrusion.js"></script>

<wizard-remove-extrusions/>
