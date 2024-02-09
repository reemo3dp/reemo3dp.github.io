# Remove Extrusions from G-Code

This tool can be used to remove any extrusion from g-code, to e.g. pin-point mechanical issues without extrusion.

It comments out the following commands:

- `G1`/`G0` with `E` parameter (`F` parameter is preserved, if present)
- `G10`/`G11` retraction commands
- `M104`, `M109`, `M140`, `M190`, `M192` heater related commands

!!! info

    This tool is **client-side** only. No data is sent to the server, and all will be lost once you leave the page.

    Furthermore, I can not promise exhaustiveness of this tool, it's been designed to work on Marlin-compatible g-code (see above). The test cases can be found here: https://github.com/reemo3dp/reemo3dp.github.io/blob/main/js/src/GCodeRemoveExtrusion.test.ts

<script type="module" src="/assets/js/GCodeRemoveExtrusion.js"></script>

<wizard-remove-extrusions></wizard-remove-extrusions>
