---
date: 2024-01-17
categories:
  - Mellow Fly Gemini V3
---

# Experiment: Adding an external power LED to the Gemini

Because [just flipping off the switch can cause data loss](../../devices/Mellow-Fly-Gemini-V3/powering_off.md), I've been experimenting with adding a host-controlled LED to the front skirt of my V0.2.

The software part of this experiment is adding a new LED to the Gemini's device tree that is controlled by a GPIO on the host SoC:

```dts title="Draft for a Gemini V3 Status LED Section"
/ {
    leds {
        compatible = "gpio-leds";
        status_pwr_ext {
            label = "mellowfly:green:pwr_ext";
            gpios = <&pio 0 0 GPIO_ACTIVE_HIGH>; // PA0
            default-state = "on";
        };
    };
};
```

Early experiments show this to be working, now this should ideally be a device tree overlay that can be applied optionally.