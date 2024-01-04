#!/bin/bash

# Exit script immediately on error, uninitialized or if any piped command fails
set -euo pipefail

find_ttys() {
    # Taken from https://unix.stackexchange.com/a/144735
    # Enumerates all USB devices found in sysfs, finds the ones with a tty
    # and prints the device name, the serial number and
    # all associated links (e.g. in /dev/serial)
    for sysdevpath in $(find /sys/bus/usb/devices/usb*/ -name dev); do
        (
            set +u
            syspath="${sysdevpath%/dev}"
            devname="$(udevadm info -q name -p $syspath)"
            [[ "$devname" == "bus/"* ]] && exit
            eval "$(udevadm info -q property --export -p $syspath)"
            ! [[ "$SUBSYSTEM" == "tty" ]] && exit
            echo "$ID_SERIAL at $ID_PATH"
            echo "/dev/$devname"
            printf '%s\n' $DEVLINKS
            echo ""
        )
    done
}

# TTYs will always be at the root level, even if udev is broken
echo "# Root Dev TTYs"
find /dev -maxdepth 1 \( -name 'ttyUSB*' -o -name 'ttyACM*' \) || true
echo ""

# Listing all `/dev/serial` symlinks helps identifying name collisions in `by-id`
echo "# /dev/serial symlinks"
find /dev/serial -type l -exec file {} \; || true
echo ""

# Printing `lsusb` potentially shows MCUs in DFU/HID mode
echo "# lsusb"
lsusb --tree
echo ""

# Finally, print all properly initialized TTYs
echo "# All TTYs"
find_ttys
