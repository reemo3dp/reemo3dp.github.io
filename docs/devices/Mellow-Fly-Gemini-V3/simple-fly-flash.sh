#!/bin/bash

# Adapted from https://cdn.mellow.klipper.cn/Utils/fly-flash/fly-flash
PD4="100"
PD2="98"

BOOT1="$PD2"
G_BOOT1="/sys/class/gpio/gpio${BOOT1}"
RST="$PD4"
G_RST="/sys/class/gpio/gpio${RST}"

echo "$RST" > /sys/class/gpio/export
echo "$BOOT1" > /sys/class/gpio/export

echo "out" > "$G_BOOT1/direction"
echo "out" > "$G_RST/direction"

echo "Press enter to reboot the Gemini MCU into the HID bootloader"
read
echo "1" > "$G_BOOT1/value"
sleep 1
echo "0" > "$G_RST/value"
sleep 1
echo "1" > "$G_RST/value"

echo "Proceed with flashing the gemini mcu using hid-flash from klipper"
echo "Press enter to reboot the Gemini into klipper again"
read
echo "0" > "$G_BOOT1/value"
sleep 1
echo "0" > "$G_RST/value"
sleep 1
echo "1" > "$G_RST/value"