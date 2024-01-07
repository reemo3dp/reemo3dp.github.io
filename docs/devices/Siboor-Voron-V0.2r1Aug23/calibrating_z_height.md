# Calibrating Z-Endstop position

1. Home Z: `G28 Z`
2. Absolute Coords: `G90`
3. Move Z 20mm below the toolhead `G1 Z20`
4. Relative Coords: `G91`
5. Babystep Z down until you reach the plastic stoppers (or are just about to): `G1 Z-1` or `G1 Z-0.1`
6. Once you're at a good position, read the Z position `position_z` (`M114`)
7. Calculate `position_endstop = previous_position_endstop - position_z`