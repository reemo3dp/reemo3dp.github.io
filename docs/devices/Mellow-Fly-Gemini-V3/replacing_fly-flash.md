## Flashing without `fly-flash`

`fly-flash` is bloat that does nothing but switch the GPIO pins `BOOT1` (`PD2`) and `RST` (`PD2`) to put the Gemini MCU into HID-flash mode.

In principle, if the MCU is already running *a* version of klipper, `make flash` from klipper should be able to instruct the mcu to boot into HID mode (https://www.klipper3d.org/Bootloaders.html#stm32f103-with-hid-bootloader). In case that doesn't work, the following scripts reset the MCU and boot it into HID mode (by putting `BOOT1` high and toggling `RST`).

For each of the following methods, remove the jumper connecting `BT1` with `GND`.

!!! danger

    Neither of these scripts have been tested. Proceed at your own risk.

### Newer kernels (without `/sys/class/gpio/`)

``` bash title="Put the Gemini MCU into HID mode"
--8<-- "docs/devices/Mellow-Fly-Gemini-V3/gpioset-fly-flash.sh"
```

### Older kernels (with `/sys/class/gpio`)

``` bash title="Put the Gemini MCU into HID mode"
--8<-- "docs/devices/Mellow-Fly-Gemini-V3/simple-fly-flash.sh"
```
