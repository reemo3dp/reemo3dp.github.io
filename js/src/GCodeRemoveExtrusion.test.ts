import { describe, it, expect } from 'vitest';
import { removeExtrusion } from './GCodeRemoveExtrusion.svelte';

describe("RemoveExtrusion", () => {
    it("comments out extrusion commands", () => {
        const input = `G1 X0 Y0 E1.13
G28
G1 E.1
G1 E1`;
        const expected = `G1 X0 Y0; G1 X0 Y0 E1.13
G28
; G1 E.1
; G1 E1`;

        const result = removeExtrusion(input);
        expect(result).toBe(expected);
    });

    it("removes heating commands", () => {
        const input = `G28
M104 S200
M109 S200
M140 S60
M190 S60
M192 S40`;
        const expected = `G28
; M104 S200
; M109 S200
; M140 S60
; M190 S60
; M192 S40`;
        const result = removeExtrusion(input);
        expect(result).toBe(expected);

    });

    it("ignores trailing whitespace and comments", () => {
        const input = `G28
 G1 X0 Y0 E1.13
 M104 S200
M109 S200
G1 X0 Y0 ; G1 E1.13
M140 S60
G28 ; Should not E123
M190 S60
M192 S40`;
        const expected = `G28
G1 X0 Y0; G1 X0 Y0 E1.13
; M104 S200
; M109 S200
G1 X0 Y0 ; G1 E1.13
; M140 S60
G28 ; Should not E123
; M190 S60
; M192 S40`;
        const result = removeExtrusion(input);
        expect(result).toBe(expected);
    })

    it("removes retractions and unretractions", () => {

        const input = `G28
G10
G11`;
        const expected = `G28
; G10
; G11`;
        const result = removeExtrusion(input);
        expect(result).toBe(expected);

    })

});