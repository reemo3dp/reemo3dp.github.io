# Siboor Voron V0.2 R1 [Aug23]

## Important Links

- Mellow documentation for the Gemini v3 (might be broken in some browsers, works on Chrome/Firefox):  <https://mellow.klipper.cn/#/board/fly_gemini_v3/>
    - System Image for FlyOS or "Stock"-ish Armbian: <http://mellow.klipper.cn/#/introduction/downloadimg>
    - Pinout for the Gemini v3: <https://github.com/Mellow-3D/Fly-Gemini-V3/blob/main/Hardware/Gemini_v3_pinout.svg>  ([Mirror](../Mellow-Fly-Gemini-V3//Gemini_v3_pinout.svg))
    - Schematic for the Gemini v3: <https://github.com/Mellow-3D/Fly-Gemini-V3/blob/main/Hardware/Gemini_v3_schematic.pdf> ([Mirror](../Mellow-Fly-Gemini-V3/Gemini_v3_schematic.pdf))
- V0Display Setup Guide:
<https://github.com/VoronDesign/Voron-Hardware/blob/master/V0_Display/Documentation/Setup_and_Flashing_Guide.md>
- Siboor supplementary docs and models:
<https://github.com/Lzhikai/SIBOOR-Voron-0.2-AUG>
- My collection of [errata](./errata.md) for the official guides.

## Important Build Notes

- Siboor's kit is an accumulation of hardware from different vendors. **Siboor has done little to no preparations to make those hardware parts work together**. Double check all wiring.
- Fan plugs might have the wrong polarity. They won't require new crimping, just changing the pins on the JST plug.
- Dec' 23 has seen an influx of kits that shipped with faulty drivers. If your stepper drivers randomly fail (early into setting up the printer), power it down and contact Siboor. **There has not been a fix for this in place. If your drivers are bad, all of them need to be replaced**. (Bonus points if you send me a DM on discord with high-res photos of the drivers)
- Powering off the printer needs to be done by shutting down the printer through mainsail or ssh, waiting until the host led's stop flashing and only then flipping the switch. Otherwise, changes to your configuration might not be saved. See [Powering off the Gemini V3](../Mellow-Fly-Gemini-V3/powering_off.md) for more details.

## Random Build Notes

- The V0 Display comes unflashed
- Swap the ports for the board-fan and the hotend-fan so the hotend fan can be controlled
- There's a 5V fan port on the host-side of the gemini
- Gemini comes with a hid-flash bootloader, so `BOOT1` needs to be `HIGH` to put the device into HID-flash mode. (<https://github.com/Arksine/STM32_HID_Bootloader>) – the opposite of how the DFU bootloader works?
- Klipper on all Fly images is outdated. If you know how to setup kiauh yourself, use [mellow's stock armbian](http://mellow.klipper.cn/#/introduction/downloadimg) image or build your own armbian image using [my patches](https://github.com/reemo3dp/mellowfly-geminipi-armbian).
