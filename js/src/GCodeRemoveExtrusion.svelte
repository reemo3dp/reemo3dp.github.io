<svelte:options customElement="wizard-remove-extrusions" />

<script context="module" lang="ts">
  const composeFilters = (
    ...filters: ((gcodeLine: string) => string | false)[]
  ) => {
    return (gcodeLine: string) => {
      const onlyCommand = gcodeLine.split(";")[0];
      for (let filter of filters) {
        const result = filter(onlyCommand);
        if (result !== false) {
          return `${result}; ${gcodeLine}`;
        }
      }
      return gcodeLine;
    };
  };

  const removeExtrusionG0G1 = (gcode: string) => {
    if (
      !(gcode.startsWith("G0") || gcode.startsWith("G1")) ||
      !gcode.includes("E")
    ) {
      return false;
    }
    const withoutExtrusion = gcode.replace(/E-?\d*(\.\d+)?/g, "").trim();
    if (withoutExtrusion === "G0" || withoutExtrusion === "G1") {
      return "";
    }
    return withoutExtrusion;
  };

  const HEATING_COMMANDS = ["M104", "M109", "M140", "M190", "M192"];
  const removeHeatingCommands = (gcode: string) => {
    if (HEATING_COMMANDS.some((command) => gcode.startsWith(command))) {
      return "";
    }
    return false;
  };

  const RETRACTION_COMMANDS = ["G10", "G11"];
  const removeRetractions = (gcode: string) => {
    if (RETRACTION_COMMANDS.some((command) => gcode.startsWith(command))) {
      return "";
    }
    return false;
  };

  export const removeExtrusion = (gcode: string) => {
    return gcode
      .split("\n")
      .map((line) => line.trim())
      .map(
        composeFilters(
          removeExtrusionG0G1,
          removeHeatingCommands,
          removeRetractions
        )
      )
      .join("\n");
  };
</script>

<script lang="ts">
  let importedGcode: string = "";
  let cleanedGcode: string = "";
  let processGcode = () => {
    cleanedGcode = removeExtrusion(importedGcode);
  };

  let fileName: string = "";
  let fileInput: FileList | null = null;
  $: if (fileInput && fileInput.length > 0) {
    const file = fileInput.item(0);
    file?.text().then((text) => {
      fileName = file?.name || "";
      importedGcode = text;
      processGcode();
    });
  }

  let download = () => {
    const blob = new Blob([cleanedGcode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a") as HTMLAnchorElement;
    a.href = url;
    a.download = fileName.replace(/\.gcode$/, "") + "_no_extrusions.gcode";
    a.click();
  };
</script>

<input type="file" bind:files={fileInput} />
<textarea rows="10" style="width: 100%" bind:value={importedGcode} />
<p><button on:click={processGcode}>Remove Extrusions</button></p>
<textarea rows="10" style="width: 100%">{cleanedGcode}</textarea>
<p><button on:click={download}>Download</button></p>
