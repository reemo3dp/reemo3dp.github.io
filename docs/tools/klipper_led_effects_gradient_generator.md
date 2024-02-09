# Klipper LED Effects Gradient Generator

[`klipper-led_effect`](https://github.com/julianschill/klipper-led_effect/blob/master/docs/LED_Effect.md) is a plugin for klipper that allows your neopixels to dance, supporting layered blending and animations.

One of these animations is `heater`, which sets the color according to the temperature of a heater. The implementation of `heater` will interpolate any given color steps to `200` steps using a simple RGB mixing mode. This can cause the occasional off-color and is what this generator aims to fix:

You put in your color layer and can then select a gradient with the given number of steps (e.g. 200) being generated using the given blend mode. **NONE** is special as it will only keep repeating your gradient colors to "fill up" the number of given steps.

Replace your layer with the generated layer and restart klipper to see how it works.

<script type="module" src="/assets/js/KlipperLedEffectGradient.js"></script>

<wizard-klipper-led-effect-gradient></wizard-klipper-led-effect-gradient>
