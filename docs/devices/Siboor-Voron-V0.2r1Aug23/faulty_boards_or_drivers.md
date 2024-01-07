# Faulty Boards or Drivers Investigation

**This guide is for an investigation of a faulty board or driver. Unless specifically asked to do so, do not follow this guide.**

## Introduction

**All of this measurements are to be taken without live current. Phyiscally remove the power cable (from the PSU to your power socket) and make sure any capacitors are drained (no light on the mainboard dimmly lit).**

We are only measuring resistance and continuity.

## Driver Measurements

!!! danger
    Do not plug the driver into the board for this, and do not measure any other pins than the ones on the picture.

![Annotated picture of the driver](./driver_pins.jpg)

Flip the driver around so that you can easily probe the pins. Measure the resistance from **GND** (now on the bottom **left**) to each of the non-crossed out pins. The resistance should read (with a margin of error) as follows:

| GND to $PIN | Reemo3dp | Ben | KaeAl |
| --- | --- | --- | --- |
| VDD | 770kΏ | ~= Reemo3dp | 670kΏ |
| DIR | 20kΏ |~= Reemo3dp | 141.7kΏ |
| STEP | 5mΏ |~= Reemo3dp | 1.5mΏ
| PDN2 | 20kΏ (MKS TMC2209)<br/>- (Siboor) | - (Siboor) | - (Siboor) |
| PDN1 |  20kΏ |~= Reemo3dp | 19.9kΏ |
| MS2 | 157kΏ |~= Reemo3dp | 141.5kΏ
| MS1 | 157kΏ |~= Reemo3dp |141.6kΏ
| EN | 789kΏ |~= Reemo3dp | 676kΏ |
| INDEX | 8.23kΏ |~= Reemo3dp | 8.1kΏ |

## Mainboard Measurements

!!! danger
    **We are probing the Gemini V3. Remove the power supply cable before taking these measurements. No live current!**

### Capacitors

#### Top Capacitor

![Capacitor top](./faulty_probe_capacitor_top.jpg)

#### Bottom Capacitor

![Capacitor bottom](./faulty_probe_capacitor_bottom.jpg)

### Inductors

#### Inductor `H1`

![Inductor H1](./faulty_probe_h1_inductor.jpg)

#### Inductor `H2`

![Inductor H1](./faulty_probe_h2_inductor.jpg)

### Driver Power

![Driver Power](./faulty_probe_driver_power.jpg)

Measure this one twice, once with the PSU connected to the mainboard, **but not plugged to your mains (no 110V/230V)! No live current**.
