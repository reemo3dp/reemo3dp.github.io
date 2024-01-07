# Reemo's Build Guide

This is the idealistic process I'm following (when people ask) when working on electronics.

!!! info
    The checkboxes can be checked, but won't be persisted. If you reload the page, they will be gone.  
    <input type="checkbox" /> Understood

## Guiding Principles

- No multimeter, no build
- Every guide is outdated and wrong - Take them for a checklist of things to do, but don't bindly follow them.
- The schematics and the pinout is the only digital source of truth that an be trusted (until you find out it's wrong)
- Every wire needs to be traced from source to target and be in agreement with the schematics.
- If there's any smoke/short-circuits/malfunction, all hardware connected is to be considered a fire hazard and not to be used again without proper care and verification.

## Checklists for first power-on

!!! warning
    This is a non-exhaustive list of checks! If at any point in time the printer starts acting weird (or starts smoking), turn it off and don't turn it on again.

First power-on happens with minimal periphals, only endstops, drivers, motors, heaters and thermistors connected. No fans, no lights, no probes

- [ ] Power supply has the correct input voltage (`110v` vs `230v`) set
- [ ] Motor wire pairs (`AABB` on the pin, so `AA` and `BB`) have continuity
- [ ] Motor drivers are rotated correctly (e.g. on a Mellow Gemini, DIAG pin is on the top)
- [ ] Motor drivers are jumped correctly (e.g. TMC2209 on a Gemini should have UART jumped)
- [ ] All polarities are correct (*duh*)
- [ ] Minimal `printer.cfg` with only stepper definitions, heaters and thermistors in place

After power-on follow <https://www.klipper3d.org/Config_checks.html>:

- [ ] [Verify temperature](https://www.klipper3d.org/Config_checks.html#verify-temperature)
- [ ] [Verify M112](https://www.klipper3d.org/Config_checks.html#verify-m112)
- [ ] [Verify heaters](https://www.klipper3d.org/Config_checks.html#verify-heaters)
- [ ] [Verify stepper motor enable pin](https://www.klipper3d.org/Config_checks.html#verify-stepper-motor-enable-pin)
- [ ] [Verify endstops](https://www.klipper3d.org/Config_checks.html#verify-endstops)
- [ ] [Verify stepper motors](https://www.klipper3d.org/Config_checks.html#verify-stepper-motors)
- [ ] When using sensorless homing: [Verify sensorless homing](https://www.klipper3d.org/TMC_Drivers.html#sensorless-homing)
- [ ] [Verify extruder motor](https://www.klipper3d.org/Config_checks.html#verify-extruder-motor)
- [ ] [Calibrate PID settings](https://www.klipper3d.org/Config_checks.html#calibrate-pid-settings)
