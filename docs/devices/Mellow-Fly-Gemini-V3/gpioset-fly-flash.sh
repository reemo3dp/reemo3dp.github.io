#!/bin/bash

set -euxo pipefail

CHIPSET="1c20800.pinctrl"
PD4="100"
PD2="98"
BOOT1="$PD2"
RST="$PD4"

gpioset "$CHIPSET" "$BOOT1"=1 --mode=signal
BOOT1_PID=$!

gpioset "$CHIPSET" "$RST"=1 --mode=time --sec=1
gpioset "$CHIPSET" "$RST"=0 --mode=exit

sleep 1
echo "MCU should now be in HID mode. Check lsusb for HID flash device and proceed in a different shell. Press ENTER to boot the MCU back into regular mode"
lsusb

read
kill $BOOT1_PID
gpioset "$CHIPSET" "$BOOT1"=0 --mode=exit
gpioset "$CHIPSET" "$RST"=1 --mode=time --sec=1
gpioset "$CHIPSET" "$RST"=0 --mode=exit

sleep 1
echo "MCU should now boot into regular mode. Check lsusb for regular device."
lsusb
