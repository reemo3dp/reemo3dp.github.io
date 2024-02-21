<svelte:options customElement="wizard-klipper-log-tool" />

<script context="module" lang="ts">
  export type Options = {
    removeStatusReportLines: boolean;
    onlyShowLastklipperStart: boolean;
  };
  const STATUS_LINES = [
    "Receive: ",
    "Sent ",
    "Stats ",
    "Dumping receive queue",
  ];
  export function klipperLogTool(log: string, opts: Options): string {
    let lines;
    if (opts.onlyShowLastklipperStart) {
      const start = log.lastIndexOf("Start printer at ");
      if (start === -1) {
        lines = log.split("\n");
      } else {
        lines = log.slice(start).split("\n");
      }
    } else {
      lines = log.split("\n");
    }

    const newLog = [];
    for (let line of lines) {
      if (opts.removeStatusReportLines) {
        if (STATUS_LINES.some((statusLine) => line.startsWith(statusLine))) {
          continue;
        }
      }
      newLog.push(line);
    }
    return newLog.join("\n");
  }
</script>

<script lang="ts">
  import materialDarkTheme from "svelte-material-ui/themes/material-dark.css?url";
  import TabBar from "@smui/tab-bar";
  import Tab from "@smui/tab";
  import { Label } from "@smui/common";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Textfield from "@smui/textfield";
  import Button from "@smui/button";
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";
  import Paper, { Title } from "@smui/paper";
  import Autocomplete from "@smui-extra/autocomplete";
  import Card, { Actions } from "@smui/card";
  let files: FileList | null = null;

  let active: string = "File";
  let log = "";
  let showMoonRakerCorsMessage: boolean = false;
  let moonrakerUrl: string = "";
  let processedLog = "";

  let error: string = "";

  let outputTextarea: Textfield | null = null;

  let removeStatusReportLines: boolean = true;
  let onlyShowLastklipperStart: boolean = false;

  let processLog = async () => {
    if (active === "File") {
      if (!files || files.length === 0) {
        return;
      }
      log = await files[0].text();
      active = "Text";
    } else if (active === "Fetch from Moonraker") {
      try {
        const url = new URL("/server/files/klippy.log", moonrakerUrl);
        log = await fetch(url).then((res) => res.text());
        active = "Text";
        showMoonRakerCorsMessage = true;
      } catch (e: any) {
        error = e.message || e;
        return;
      }
    }
    error = "";

    processedLog = klipperLogTool(log, {
      removeStatusReportLines,
      onlyShowLastklipperStart,
    });
    outputTextarea?.getElement()?.scrollIntoView({ behavior: "smooth" });
  };
</script>

<link rel="stylesheet" href={materialDarkTheme} />

<form
  on:submit|preventDefault={() => {
    console.log("Submitted");
  }}
>
  <Card padded variant="outlined" style="margin-bottom: 20px">
    <Paper variant="unelevated">
      <Title>Upload</Title>
      <TabBar
        tabs={["File", "Text", "Fetch from Moonraker"]}
        let:tab
        bind:active
      >
        <Tab {tab} type="button">
          <Label>{tab}</Label>
        </Tab>
      </TabBar>
      <br />
      {#if active === "File"}
        <div class="hide-file-ui">
          <Textfield
            style="width: 100%;"
            helperLine$style="width: 100%;"
            type="file"
            input$name="file"
            label="Upload your klippy.log"
            bind:files
          ></Textfield>
        </div>
      {:else if active === "Text"}
        <Textfield
          style="width: 100%"
          helperLine$style="width: 100%;"
          input$style="font-family: monospace; font-size: 12px; line-height: 1rem;"
          input$autocomplete="off"
          input$autocorrect="off"
          input$autocapitalize="off"
          input$spellcheck="false"
          input$rows={5}
          input$name="content"
          textarea
          label="Paste your log file"
          bind:value={log}
        ></Textfield>
      {:else}
        <Autocomplete
          combobox          
          textfield$name="moonrakerUrl"
          options={[
            "http://klipper.local:7125",
            "http://raspberrypi.local:7125",
            "http://flygemini.local:7125",
          ]}
          bind:value={moonrakerUrl}
          label="Moonraker URL"
          style="width: 100%;"
          textfield$style="width: 100%;"
        />
        <p>
          For this to work, you need to have mixed content allowed for this
          website. Check how to for your browser here: <a
            href="https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox#w_unblock-mixed-content"
            >Firefox</a
          >,
          <a
            href="https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en"
            >Chrome</a
          >
        </p>
      {/if}
      {#if error.length > 0}
        <p style="color: red;"><strong>Error: {error}</strong></p>
      {/if}
    </Paper>
    <Paper variant="unelevated">
      <Title>Options</Title>
      <LayoutGrid align="left">
        <Cell span={6}>
          <FormField>
            <Switch bind:checked={removeStatusReportLines} />
            <span slot="label">Remove status report lines</span>
          </FormField>
        </Cell>
        <Cell span={6}>
          <FormField>
            <Switch bind:checked={onlyShowLastklipperStart} />
            <span slot="label">Only show last klipper start</span>
          </FormField>
        </Cell>
      </LayoutGrid>
    </Paper>
    <Actions>
      <Button type="submit" variant="raised" on:click={processLog}
        ><Label>Process Log</Label></Button
      >
    </Actions>
  </Card>
</form>
<Card>
  <form method="post" action="https://www.paste.rs/web">
    <Paper>
      <input type="hidden" name="ext" value="txt" />
      <Title>Output</Title>
      <Textfield
        bind:this={outputTextarea}
        input$name="content"
        input$style="font-family: monospace; font-size: 12px; line-height: 1rem;"
        input$autocomplete="off"
        input$autocorrect="off"
        input$autocapitalize="off"
        input$spellcheck="false"
        style="width: 100%;"
        helperLine$style="width: 100%;"
        input$rows={10}
        textarea
        label="Output"
        bind:value={processedLog}
      />
      {#if showMoonRakerCorsMessage}
        <p style="color: red;">
          <strong
            >The fact that we were able to directly access your moonraker
            instance without authentication is a security risk. Any website can
            right now start and interrupt your printer, e.g. heat up the hotend
            to 350°C, or delete your printer configuration. <br />See
            <a
              href="https://moonraker.readthedocs.io/en/latest/configuration/#authorization"
              >https://moonraker.readthedocs.io/en/latest/configuration/#authorization</a
            >
            on how to avoid this using API keys or restricting origin webservers.</strong
          >
        </p>
      {/if}
      <Actions>
        <Button type="submit" variant="raised"
          ><Label>Upload to paste.rs</Label></Button
        >
      </Actions>
    </Paper>
  </form>
</Card>

<style>
  .hide-file-ui :global(input[type="file"]::file-selector-button) {
    display: none;
  }

  .hide-file-ui
    :global(:not(.mdc-text-field--label-floating) input[type="file"]) {
    color: transparent;
  }
</style>
