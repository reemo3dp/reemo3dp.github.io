#!/bin/bash


set -euxo pipefail


CHIPSET="1c20800.pinctrl"
PD4="100"
PD2="98"
BOOT1="$PD2"
RST="$PD4"

echo "Remove all jumpers from the board, then press ENTER"
read

gpioset --mode=signal "$CHIPSET" "$BOOT1"=1 &
BOOT1_PID=$!

gpioset --mode=time --sec=1 "$CHIPSET" "$RST"=0
gpioset --mode=exit "$CHIPSET" "$RST"=1
sleep 1

lsusb

echo "MCU should now be in HID mode. Check lsusb for HID flash device and proceed in a different shell. Press ENTER to boot the MCU back into regular mode"
read

kill $BOOT1_PID

gpioset --mode=exit "$CHIPSET" "$BOOT1"=0

gpioset --mode=time --sec=1 "$CHIPSET" "$RST"=0
gpioset --mode=exit "$CHIPSET" "$RST"=1

sleep 1

lsusb

echo "MCU should now boot into regular mode. Check lsusb for regular device."
echo "Put the jumper back into place (GND+BOOT1), otherwise your MCU might boot into HID after a power-on"
