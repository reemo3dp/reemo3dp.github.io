<svelte:options customElement="wizard-klipper-led-effect-gradient" />

<script context="module" lang="ts">
  import { colord, extend } from "colord";
  import mixPlugin from "colord/plugins/mix";

  extend([mixPlugin]);

  const createGradient = (colors: string[], steps: number): string[] => {
    const intervalPerColor = steps / colors.length;
    const gradient = [];
    for (let i = 0; i < steps - 1; i++) {
      const positionOnPalette = i / intervalPerColor;
      const closestColorLeft = Math.floor(positionOnPalette);
      const closestColorRight = Math.ceil(positionOnPalette);
      const distanceToClosestColorLeft =
        (positionOnPalette - closestColorLeft) / intervalPerColor;

      const leftColor = colord(colors[closestColorLeft]);
      const rightColor = colord(colors[closestColorRight]);

      const mix = leftColor.mix(rightColor, distanceToClosestColorLeft);
      gradient.push(mix.toHex());
    }
    gradient.push(colord(colors[colors.length - 1]).toHex());
    return gradient;
  };
</script>

<script lang="ts">
  let steps: number = 10;
  let colorInput: string = `(0.227,0.427,0.705)
(0.113,1,0.168)
(1,0.85,0.168)
(1.00,0.47,0.00)
(1,0.392,0.196)
(1,0.313,0.156)
(1,0.078,0.078)
(1,0,0)`;
  colorInput =
    "rgb(" +
    colorInput
      .split("\n")
      .map((color) =>
        color
          .slice(1, -1)
          .split(",")
          .map((n) => Number(n.trim()) * 255)
          .join(",")
      )
      .join(")\nrgb(") +
    ")";
  let gradient: string[] = [];

  $: gradient = createGradient(colorInput.split("\n"), steps);
</script>

<input type="number" bind:value={steps} />
<textarea bind:value={colorInput}></textarea>
<div style="width: 100%; height: 20px;">
  {#each gradient as color}
    <div
      style="display: inline-block; width: {100 /
        gradient.length}%; height: 20px; background-color: {color}"
    ></div>
  {/each}
</div>
<pre>{gradient.join("\n")}</pre>
