# Identifying the mcu on your host maschine

This tutorial guides you through the steps of identifying the serial connection klipper needs to communicate with your mcu. It needs to be done for each mcu in your printer, e.g. for a display, input shaper, klipper expander, etc.

See also https://www.klipper3d.org/Installation.html#configuring-klipper

Power on the host and make sure all mcu‎s you want to use are connected and powered on. 
[Connect to your host using SSH](https://docs.vorondesign.com/build/software/ssh.html) and run the following commands:


## Troubleshooting

### The folder  `/dev/serial/` doesn't exist