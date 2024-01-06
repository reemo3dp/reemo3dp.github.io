# Errata

**`VORON` Manual**: <https://github.com/VoronDesign/Voron-0/blob/Voron0.2r1/Manuals/VORON_V0.2r1_Assembly_Manual.pdf> (Version referenced here: [9b13baa1](https://github.com/VoronDesign/Voron-0/blob/9b13baa1806497ae7a028f273a8d9d4273fbc3ef/Manuals/VORON_V0.2r1_Assembly_Manual.pdf))

**`SIBOOR` Supplementary**: <https://github.com/Lzhikai/SIBOOR-Voron-0.2-AUG/blob/main/supplementary/SIBOOR%200.2%20AUG%20Supplementary%20Instructions.pdf> (Version referenced here: [a7ac3643](https://github.com/Lzhikai/SIBOOR-Voron-0.2-AUG/blob/a7ac3643d21dcb62dc93d0c126f8b84060b94258/supplementary/SIBOOR%200.2%20AUG%20Supplementary%20Instructions.pdf))

- `VORON` Page 92: The method of mounting the Z-Lead-Screw is the same for the kirigami bed
- `VORON` Page 171: This is the moment to wire up the `HE-LED`. Thread the wire, then glue the LEDs in place.
- `VORON` Page 180: Milky PTFE tube for the hotend tube (smaller diameter)
- `VORON` Page 191/`SIBOOR` Page 17: Flip the panel around. USB Ports to the left, 4 holes on the panel on the top
- `VORON` Page 224: Skip, as the kit comes with umbilical PCB
- `VORON` Page 227: Clear FEP for the reverse bowden from toolhead to back (larger diameter)
- `SIBOOR` Page 23: If you use an ethernet cable, skip this step
- `SIBOOR` Page 25:
    - Before powering on for the first time, double-check your wiring. See [my build guide](../../guides/build_guide.md).
    - You will get errors in klipper at this point. Replace the printer.cfg with [Lzhikai/SIBOOR-Voron-0.2-AUG/printer.cfg](https://github.com/Lzhikai/SIBOOR-Voron-0.2-AUG/blob/main/printer.cfg). Copy `V0Display.cfg` from that repository too.
    - You will then get an error about the display mcu not being available. Flash the display now (see <https://github.com/VoronDesign/Voron-Hardware/blob/master/V0_Display/Documentation/Setup_and_Flashing_Guide.md>) and update `V0Display.cfg`, or comment out line 3 in `printer.cfg` for the time being. Flashing could require updating klipper.
    - Once klipper is running, proceed with <https://www.klipper3d.org/Config_checks.html>
