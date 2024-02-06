<svelte:options customElement="wizard-klipper-log-tool" />

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
  let moonrakerUrl: String = "";
  let processedLog = "";

  let removeStatusReportLines: boolean = true;
  let onlyShowLastklipperStart: boolean = true;
</script>

<link rel="stylesheet" href={materialDarkTheme} />

<Card padded variant="outlined" style="margin-bottom: 20px">
  <Paper variant="unelevated">
    <Title>Upload</Title>
    <TabBar tabs={["File", "Text", "Fetch from Moonraker"]} let:tab bind:active>
      <Tab {tab}>
        <Label>{tab}</Label>
      </Tab>
    </TabBar>
    <br/>
    {#if active === "File"}
      <div class="hide-file-ui">
        <Textfield
          style="width: 100%;"
          helperLine$style="width: 100%;"
          type="file"
          label="Upload your klippy.log"
          bind:files
        ></Textfield>
      </div>
    {:else if active === "Text"}
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        input$rows={10}
        textarea
        label="Paste your log file"
        bind:value={log}
      ></Textfield>
    {:else}
      <Autocomplete
        combobox
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
    <Button variant="raised"><Label>Process Log</Label></Button>
  </Actions>
</Card>
<Card>
  <form method="post" action="https://www.paste.rs/web">
    <Paper>
      <input type="hidden" name="ext" value="txt" />
      <Title>Output</Title>
      <Textfield
        input$name="content"
        style="width: 100%;"
        helperLine$style="width: 100%;"
        input$rows={10}
        textarea
        label="Output"
        bind:value={processedLog}
      />
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
