# Mellow Fly Gemini V3

The Gemini V3 is a printer mainboard that incorporates both a host single-board computer running linux, and a MCU running klipper.

![The pinout of the gemini v3 with the host part highlighted](./Gemini_v3_pinout_host_highlighted.svg)

All ports inside the blue frame are controlled by the host, e.g.:

- `ZH1`, `ZH2`, `ZH3`, `ZH5` and the FPGA Connector expose SPI- and UART-capable GPIOs on the host, for displays like the Fly TFT (or the BTT SPI TFT), an ADXL, but also custom uses from klipper or through the device tree of the host.
- The left USB-C port (`USB3`) exposes an UART shell that shows the full boot log and allows root access to the system.
- `CORE_FAN` is a switchable 5V port on `PL2` (`GPIO3`) on the host. If you want that fan to be always-on, the red pins next to it can be jumped for a constant 5V power.

## Important Notes

- The `IC3` responsible for providing 5V power is a `XL1509-5V`, which are usually rated at less than 2A current. That 5V rail will provide power to all USB devices and all 5V ports on the MCU (neopixels, endstops, probes) plus the MCU and the host itself. A single neopixel uses up to `60mA`, two matchsticks + the 8 bed pixel might draw up to `1.68A`. Consider not running them at full brightness.
- Do not flip the switch to power off the system. Read [Powering off](./powering_off.md)


## Important Links

- Mellow documentation for the Gemini v3 (might be broken in some browsers, works on Chrome/Firefox):  <https://mellow.klipper.cn/#/board/fly_gemini_v3/>
- Pinout for the Gemini v3: <https://github.com/Mellow-3D/Fly-Gemini-V3/blob/main/Hardware/Gemini_v3_pinout.svg>  ([Mirror](./Gemini_v3_pinout.svg))
- Schematic for the Gemini v3: <https://github.com/Mellow-3D/Fly-Gemini-V3/blob/main/Hardware/Gemini_v3_schematic.pdf> ([Mirror](./Gemini_v3_schematic.pdf))
