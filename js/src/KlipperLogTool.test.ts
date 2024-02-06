import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { klipperLogTool } from "./KlipperLogTool.svelte";

describe("KlipperLogTool", () => {
    it("removes noise", () => {
        const input = readFileSync(__dirname + "/KlipperLogTool.test.data/remove_noise.txt").toString();

        const result = klipperLogTool(input, { onlyShowLastklipperStart: false, removeStatusReportLines: true });

        expect(result).toEqual(`Start printer at Sat May  6 16:29:38 2023 (1683390578.7 4387047.6)
Empty otherwise
Dumping serial stats: bytes_write=5424 bytes_read=4673 bytes_retransmit=9 bytes_invalid=0 send_seq=219 receive_seq=219 retransmit_seq=2 srtt=0.001 rttvar=0.001 rto=0.025 ready_bytes=0 upcoming_bytes=0
`)
    });

    it("only shows last klipper start", () => {
        const input = readFileSync(__dirname + "/KlipperLogTool.test.data/only_last_log.txt").toString();

        const result = klipperLogTool(input, { onlyShowLastklipperStart: true, removeStatusReportLines: false });

        expect(result).toEqual(`Start printer at Sat May  6 16:29:38 2023 (1683390578.7 4387047.6)
===== Config file =====
[virtual_sdcard]
path = /opt/printer_data/gcodes

[pause_resume]

[display_status]

[exclude_object]

[mcu]
serial =`);
    });

    it("shows everything without a start marker", () => {
        const input = readFileSync(__dirname + "/KlipperLogTool.test.data/nostartmarker.txt").toString();

        const result = klipperLogTool(input, { onlyShowLastklipperStart: true, removeStatusReportLines: false });

        expect(result).toEqual(`webhooks client 139646904459424: Disconnected
Restarting printer
===== Config file =====
webhooks client 139646904459424: Disconnected
Restarting printer
===== Config file =====
webhooks client 139646904459424: Disconnected
Receive: 0 151.864215 151.863561 49: seq: 13, identify_response offset=160 data=b'\\xf1\\xfb\\xc7\\xf0GF\\xeb\\xc9t\\x92\\xd5e\\x99V9\\xd0\\xff}\\x92\\x16E\\x9d\\xa5\\x9d\\xe0\\xb5\\xcc\\x15\\xcb\\xea\\xbe\\xea>\\xbc\\xcb&\\xe7\\xab)0'
Receive: 1 151.866267 151.865424 49: seq: 14, identify_response offset=200 data=b"\\xdbu\\xc0%O\\xb3'\\x06\\xa7\\xb0\\xed\\x9d\\xc7\\xb1\\x07\\x90\\xe7\\x16\\xa0\\xa9\\x95\\xfe\\x91\\xd5\\x87w=k\\xfa\\xa2\\xe0}C\\x08\\x8b\\x01\\xe1K/\\xda"
Restarting printer
===== Config file =====
[virtual_sdcard]
path = /opt/printer_data/gcodes

[pause_resume]

[display_status]

[exclude_object]

[mcu]
serial =`);
    });


    it("may also just output the raw log", () => {
        const input = readFileSync(__dirname + "/KlipperLogTool.test.data/raw.txt").toString();

        const result = klipperLogTool(input, { onlyShowLastklipperStart: false, removeStatusReportLines: false });

        expect(result).toEqual(`webhooks client 139646904459424: Disconnected
Restarting printer
Start printer at Sat May  6 16:29:38 2023 (1683390578.7 4387047.6)
===== Config file =====
webhooks client 139646904459424: Disconnected
Restarting printer
Start printer at Sat May  6 16:29:38 2023 (1683390578.7 4387047.6)
===== Config file =====
webhooks client 139646904459424: Disconnected
Receive: 0 151.864215 151.863561 49: seq: 13, identify_response offset=160 data=b'\\xf1\\xfb\\xc7\\xf0GF\\xeb\\xc9t\\x92\\xd5e\\x99V9\\xd0\\xff}\\x92\\x16E\\x9d\\xa5\\x9d\\xe0\\xb5\\xcc\\x15\\xcb\\xea\\xbe\\xea>\\xbc\\xcb&\\xe7\\xab)0'
Receive: 1 151.866267 151.865424 49: seq: 14, identify_response offset=200 data=b"\\xdbu\\xc0%O\\xb3'\\x06\\xa7\\xb0\\xed\\x9d\\xc7\\xb1\\x07\\x90\\xe7\\x16\\xa0\\xa9\\x95\\xfe\\x91\\xd5\\x87w=k\\xfa\\xa2\\xe0}C\\x08\\x8b\\x01\\xe1K/\\xda"
Restarting printer
Start printer at Sat May  6 16:29:38 2023 (1683390578.7 4387047.6)
===== Config file =====
[virtual_sdcard]
path = /opt/printer_data/gcodes

[pause_resume]

[display_status]

[exclude_object]

[mcu]
serial =`);
    });
});