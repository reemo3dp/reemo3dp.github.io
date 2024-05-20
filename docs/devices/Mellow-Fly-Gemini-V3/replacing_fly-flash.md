`fly-flash` is bloat that does nothing but switch the GPIO pins `BOOT1` (`PD2`) and `RST` (`PD2`) to put the Gemini MCU into HID-flash mode.

Here are 4 ways to flash klipper to the Gemini MCU:

### 1. Use `make flash`

The easiest way is possible only if a sufficiently recent klipper version is already running on the MCU. In that case, `make flash FLASH_DEVICE=/dev/serial/by-id/...` will reset the MCU into the DFU bootloader, flash klipper and then reset it back into klipper. Find the `FLASH_DEVICE` by following [Identifying the Gemini MCU](../../guides/Identifying_the_MCU_serial.md).

### 2. Booting into the STM32 Bootloader (DFU)

Just like `make flash`, you can boot the DFU bootloader by adding the `BOOT0` jumper (`BT0`, red) and the `BOOT1` jumper to `GND`, followed by pressing `RESET1`. The board will now be in DFU mode ("STM32 Bootloader").

You can now use `make flash FLASH_DEVICE=0483:df11` to flash klipper to the MCU.

### 3. Jump `BOOT1` to `3.3V` and reset the board (`RESET1`)

Straight forward if you have physical access to the device. Connect `BOOT1` to `3.3V` and press the `RESET1` button (bottom right, not the one next to the USB-C UART port). The board will now be in HID-flash mode.

!!! info

    Removing the jumper alltogether will have the PIN floating. This means the MCU might or might not boot into the application firmware or the HID bootloader. You should only remove the jumper if you're using any of the following scripts.

### 4. Remove the jumper for `BOOT1` and use a script *like* fly-flash to switch the MCU to HID-flash mode

Remove the jumper connecting `BT1` with `GND` before proceeding. If you have a newer kernel (like my armbian images) and there is no `/sys/class/gpio/` directory, use the first script. Otherwise, you may use the second script.

#### Newer kernels (without `/sys/class/gpio/`)

--8<-- "includes/curl-warning.md"

``` bash title="Paste this into your terminal"
curl -sSL https://reemo3dp.github.io/devices/Mellow-Fly-Gemini-V3/gpioset-fly-flash.sh | sudo bash
```
``` bash title="gpioset-fly-flash.sh" linenums="1"
--8<-- "docs/devices/Mellow-Fly-Gemini-V3/gpioset-fly-flash.sh"
```

#### Older kernels (with `/sys/class/gpio`)

--8<-- "includes/curl-warning.md"

``` bash title="Paste this into your terminal"
curl -sSL https://reemo3dp.github.io/devices/Mellow-Fly-Gemini-V3/simple-fly-flash.sh | sudo bash
```
``` bash title="gpioset-fly-flash.sh" linenums="1"
--8<-- "docs/devices/Mellow-Fly-Gemini-V3/simple-fly-flash.sh"
```
