# Identifying the mcu on your host maschine

This tutorial guides you through the steps of identifying the serial connection klipper needs to communicate with your mcu. It needs to be done for each mcu in your printer, e.g. for a display, input shaper, klipper expander, etc.

See also https://www.klipper3d.org/Installation.html#configuring-klipper

Power on the host and make sure all mcu‎s you want to use are connected and powered on. 
[Connect to your host using SSH](https://docs.vorondesign.com/build/software/ssh.html).

## Listing all MCUs

klippy usually communicates with each mcu through a serial port, accessed via a tty device on linux. These devices show up in the `/dev/` folder as `/dev/ttyUSB0`. These names are not stable and might change between reboots, which is why a more stable alias is needed.

The following script will list all plugged-in, initialized TTYs, among those hopefully all mcus.

``` bash title="Download and run this script"
curl -sSL https://reemo3dp.github.io/scripts/find_mcus.sh | bash
```
``` bash title="find_mcus.sh"
--8<-- "docs/scripts/find_mcus.sh"
```

## Troubleshooting

### The folder  `/dev/serial/` doesn't exist