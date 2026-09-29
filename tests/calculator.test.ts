import {describe,it,expect} from "vitest";
import {estimateHit} from "../src/lib/calculator";
describe("estimateHit",()=>{it("computes expected generic crit damage",()=>{expect(estimateHit({baseDamage:100,increasedDamagePct:0,critChancePct:50,critDamagePct:200})).toBe(150)})});
