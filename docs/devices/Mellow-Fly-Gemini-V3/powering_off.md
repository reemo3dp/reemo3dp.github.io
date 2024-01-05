# Powering off a Gemini V3 Printer

FlyOS by default sets the root filesystems' commit interval to `600 seconds`. This means that, unless explicitly flushed, changes to files will only be written to the sd card every `10 minutes`. In the worst case, this means you will loose any changes to your klipper configuration, updates you've installed or models you've uploaded in the last ten minutes.

You can change the commit interval to a lower value (`5` is the default) in `/etc/fstab`. After changing the value, reboot.

In any case, the host system is stateful and not designed to be switched off instantaneously. [Ellis' shutdown macro](https://ellis3dp.com/Print-Tuning-Guide/articles/useful_macros/shut_down_host.html) can be included in the V0 display menu to make shutting down the printer easier. A good rule of thumb: **Click on shutdown, count to 10, flip the switch**.
