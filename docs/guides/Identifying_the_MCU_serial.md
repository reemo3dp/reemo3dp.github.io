# Identifying the mcu on your host maschine

This tutorial guides you through the steps of identifying the serial connection klipper needs to communicate with your mcu. It needs to be done for each mcu in your printer, e.g. for a display, input shaper, klipper expander, etc.

!!! note
    Even though they might cover different featues, all MCUs look the same to klipper. A display has GPIO pins, so does the main mcu. Klippy can connect to multiple MCUs at once. A fully loaded Voron V0.2 might have a a main mcu, a V0 Display, an input shaper board and a klipper expander. With all of them connected, your `printer.cfg` must contain four `[mcu]` entries, each with its own `serial` property.

See also https://www.klipper3d.org/Installation.html#configuring-klipper

Power on the host and make sure all mcu‎s you want to use are connected and powered on. 
[Connect to your host using SSH](https://docs.vorondesign.com/build/software/ssh.html).

## Listing all MCUs

klippy usually communicates with each mcu through a serial port, accessed via a tty device on the linux host it's running on. These devices show up in the `/dev/` folder as `/dev/ttyUSB0`. These names are not stable and might change between reboots, which is why a more stable alias is needed.

The following script will list all plugged-in, initialized TTYs, among those hopefully all mcus.

--8<-- "includes/curl-warning.md"

``` bash title="Paste this into your terminal"
curl -sSL https://reemo3dp.github.io/scripts/find_mcus.sh | bash
```
``` bash title="find_mcus.sh" linenums="1"
--8<-- "docs/scripts/find_mcus.sh"
```

On a Voron V0.2 with a V0 Display mcu and a Mellow Fly Gemini V3, the output might look like this:

``` 
# Root Dev TTYs
/dev/ttyACM0
/dev/ttyACM1

# /dev/serial symlinks
/dev/serial/by-path/platform-1c1b400.usb-usb-0:1:1.0: symbolic link to ../../ttyACM1
/dev/serial/by-path/platform-1c1d400.usb-usb-0:1:1.0: symbolic link to ../../ttyACM0
/dev/serial/by-id/usb-Klipper_stm32f405xx_300028001751399999999999-if00: symbolic link to ../../ttyACM1
/dev/serial/by-id/usb-Klipper_stm32f042x6_2C0002001943311111111111-if00: symbolic link to ../../ttyACM0

# lsusb
/:  Bus 09.Port 1: Dev 1, Class=root_hub, Driver=ehci-platform/1p, 480M
/:  Bus 08.Port 1: Dev 1, Class=root_hub, Driver=ehci-platform/1p, 480M
    |__ Port 1: Dev 2, If 0, Class=Vendor Specific Class, Driver=mt7601u, 480M
/:  Bus 07.Port 1: Dev 1, Class=root_hub, Driver=ohci-platform/1p, 12M
    |__ Port 1: Dev 2, If 0, Class=Communications, Driver=cdc_acm, 12M
    |__ Port 1: Dev 2, If 1, Class=CDC Data, Driver=cdc_acm, 12M
/:  Bus 06.Port 1: Dev 1, Class=root_hub, Driver=ohci-platform/1p, 12M
/:  Bus 05.Port 1: Dev 1, Class=root_hub, Driver=ohci-platform/1p, 12M
    |__ Port 1: Dev 2, If 0, Class=Communications, Driver=cdc_acm, 12M
    |__ Port 1: Dev 2, If 1, Class=CDC Data, Driver=cdc_acm, 12M
/:  Bus 04.Port 1: Dev 1, Class=root_hub, Driver=ohci-platform/1p, 12M
/:  Bus 03.Port 1: Dev 1, Class=root_hub, Driver=ehci-platform/1p, 480M
    |__ Port 1: Dev 2, If 0, Class=Video, Driver=uvcvideo, 480M
    |__ Port 1: Dev 2, If 1, Class=Video, Driver=uvcvideo, 480M
    |__ Port 1: Dev 2, If 2, Class=Audio, Driver=snd-usb-audio, 480M
    |__ Port 1: Dev 2, If 3, Class=Audio, Driver=snd-usb-audio, 480M
/:  Bus 02.Port 1: Dev 1, Class=root_hub, Driver=ehci-platform/1p, 480M
/:  Bus 01.Port 1: Dev 1, Class=root_hub, Driver=musb-hdrc/1p, 480M

# All TTYs
Klipper_stm32f405xx_300028001751399999999999 at platform-1c1b400.usb-usb-0:1:1.0
/dev/ttyACM1
/dev/serial/by-path/platform-1c1b400.usb-usb-0:1:1.0
/dev/serial/by-id/usb-Klipper_stm32f405xx_300028001751399999999999-if00

Klipper_stm32f042x6_2C0002001943311111111111 at platform-1c1d400.usb-usb-0:1:1.0
/dev/ttyACM0
/dev/serial/by-id/usb-Klipper_stm32f042x6_2C0002001943311111111111-if00
/dev/serial/by-path/platform-1c1d400.usb-usb-0:1:1.0
```

!!! warning

    You should be 100% certain about which serial belongs to which MCU. Mixing these up can damage your hardware! The most definitive way is to plug-in each MCU one after another and running the script from above to identify the new entry.

`stm32f405xx`, respectively `stm32f042x6` identifies the model of the stm32 microcontroller on each mcu. If this is enough to identify your mcu (e.g. `stm32f042` is usually the [V0Display](https://github.com/VoronDesign/Voron-Hardware/tree/master/V0_Display)), then you can put the `by-id`-symlinks for each mcu in its respective config section in your `printer.cfg`:


``` toml
[mcu]
serial: /dev/serial/by-id/usb-Klipper_stm32f405xx_300028001751399999999999-if00

[mcu display]
serial: /dev/serial/by-id/usb-Klipper_stm32f042x6_2C0002001943311111111111-if00
```

## Troubleshooting

### The folder  `/dev/serial/` doesn't exist or is empty

Update your system. `systemd` 247 and/or 252 have wrong `udev` rules that prevent proper initialization of these symlinks.

- https://www.reddit.com/r/debian/comments/1331wlr/devserialbyid_suddenly_missing/
- https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1035094
- https://github.com/systemd/systemd/issues/25238