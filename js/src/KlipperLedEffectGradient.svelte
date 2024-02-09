<svelte:options customElement="wizard-klipper-led-effect-gradient" />

<script context="module" lang="ts">
  import { Colord, colord, extend } from "colord";
  import mixPlugin from "colord/plugins/mix";

  const round = (n: number, decimals: number): number =>
    Number(n.toFixed(decimals));

  const toKlipperLedEffect = (color: Colord): string => {
    const rgb = color.toRgb();
    return `(${round(rgb.r / 255, 5)}, ${round(rgb.g / 255, 5)}, ${round(
      rgb.b / 255,
      5
    )})`;
  };

  const fromKlipperLedEffect = (color: string): Colord => {
    const [r, g, b] = color.split(",").map((n) => Number(n.trim()) * 255);
    return colord({ r, g, b });
  };

  type LedEffectParam = {
    effect?: string;
    rate?: string;
    cutoff?: string;
    mode?: string;
    palette: Colord[];
  };
  const parseKlipperLedEffectLine = (line: string): LedEffectParam => {
    const trimmed = line.trim();
    let gradientString;
    let effect, rate, cutoff, mode;
    if (!trimmed.startsWith("(")) {
      let rest: string[];
      [effect, rate, cutoff, mode, ...rest] = trimmed.split(/\s+/);
      gradientString = rest.join(" ");
    } else {
      gradientString = trimmed;
    }

    return {
      effect,
      rate,
      cutoff,
      mode,
      palette: gradientString.split("(").flatMap((color) => {
        const trimmed = color.trim().slice(0, color.lastIndexOf(")"));
        const result = fromKlipperLedEffect(trimmed);
        console.log({ color, trimmed, result: result.toRgbString() });

        if (!color) return [];
        return [result];
      }),
    };
  };

  enum MIX {
    LAB = "lab",
    RGB = "rgb",
    HSL = "hsl",
    RGB_SQR = "rgb-sqr",
    NONE = "none",
  }
  extend([mixPlugin]);

  const mixColors = (
    color1: Colord,
    color2: Colord,
    weight: number,
    mix: MIX
  ): Colord => {
    switch (mix) {
      case MIX.LAB:
        return color1.mix(color2, weight);
      case MIX.RGB:
        const rgb1 = color1.toRgb();
        const rgb2 = color2.toRgb();
        const r = rgb1.r * (1 - weight) + rgb2.r * weight;
        const g = rgb1.g * (1 - weight) + rgb2.g * weight;
        const b = rgb1.b * (1 - weight) + rgb2.b * weight;
        return colord({ r, g, b });
      case MIX.HSL:
        const hsl1 = color1.toHsl();
        const hsl2 = color2.toHsl();
        const h = hsl1.h * (1 - weight) + hsl2.h * weight;
        const s = hsl1.s * (1 - weight) + hsl2.s * weight;
        const l = hsl1.l * (1 - weight) + hsl2.l * weight;
        return colord({ h, s, l });
      case MIX.RGB_SQR:
        const rgbSqr1 = color1.toRgb();
        const rgbSqr2 = color2.toRgb();
        const rSqr = Math.sqrt(
          Math.pow(rgbSqr1.r, 2) * (1 - weight) +
            Math.pow(rgbSqr2.r, 2) * weight
        );
        const gSqr = Math.sqrt(
          Math.pow(rgbSqr1.g, 2) * (1 - weight) +
            Math.pow(rgbSqr2.g, 2) * weight
        );
        const bSqr = Math.sqrt(
          Math.pow(rgbSqr1.b, 2) * (1 - weight) +
            Math.pow(rgbSqr2.b, 2) * weight
        );
        return colord({ r: rSqr, g: gSqr, b: bSqr });
      case MIX.NONE:
        if (weight < 0.5) {
          return color1;
        } else {
          return color2;
        }
    }
  };

  const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

  const createGradient = (
    colors: Colord[],
    steps: number,
    mix: MIX = MIX.LAB
  ): Colord[] => {
    const intervalPerColor = steps / colors.length;
    const gradient = [];
    for (let i = 0; i < steps; i++) {
      const positionOnPalette = i / intervalPerColor;

      const closestColorLeft = clamp(
        Math.floor(positionOnPalette),
        0,
        colors.length - 1
      );
      const closestColorRight = clamp(
        closestColorLeft + 1,
        0,
        colors.length - 1
      );
      const distanceToClosestColorLeft = positionOnPalette - closestColorLeft;

      const leftColor = colors[closestColorLeft];
      const rightColor = colors[closestColorRight];

      const mixed = mixColors(
        leftColor,
        rightColor,
        distanceToClosestColorLeft,
        mix
      );
      gradient.push(mixed);
    }
    return gradient;
  };
</script>

<script lang="ts">
  let mix: MIX = MIX.LAB;
  let steps: number = 10;

  let gradient: Colord[] = [];

  let klipperInput: string =
    "    heater  20 0 top (0.227,0.427,0.705),(0.113,1,0.168),(1,0.85,0.168),(1.00,0.47,0.00),(1,0.392,0.196),(1,0.313,0.156),(1,0.078,0.078),(1,0,0),(1,0,0)";

  let effectParams: LedEffectParam;
  $: effectParams = parseKlipperLedEffectLine(klipperInput);
  $: gradient = createGradient(effectParams.palette, steps, mix);
  let gradientStr: string;
  $: if (effectParams?.effect) {
    gradientStr = `    ${effectParams.effect} ${effectParams.rate} ${
      effectParams.cutoff
    } ${effectParams.mode} ${gradient.map(toKlipperLedEffect).join(", ")}`;
  } else {
    gradientStr = gradient.map(toKlipperLedEffect).join(", ");
  }
</script>

<textarea
  bind:value={klipperInput}
  style="width: 100%; display: block;"
  rows="2"
></textarea>
<input type="number" bind:value={steps} />
<select bind:value={mix}>
  {#each Object.values(MIX) as mixType}
    <option value={mixType}>{mixType.toUpperCase()}</option>
  {/each}
</select>
<div style="width: 100%; height: 20px;">
  {#each gradient as color}
    <div
      style="display: inline-block; width: {100 /
        gradient.length}%; height: 20px; background-color: {color.toHex()}"
    ></div>
  {/each}
</div>
<textarea bind:value={gradientStr} style="width: 100%; display: block;" rows="2"
></textarea>
