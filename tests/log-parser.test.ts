import {describe,it,expect} from "vitest";
import {parseDeskrawlLog} from "../src/lib/deskrawl-log-parser";
describe("parseDeskrawlLog",()=>{it("summarizes generic lines",()=>{const r=parseDeskrawlLog("[2026-09-29 12:00:00] player hit for 10 damage\nloot item dropped\nmystery");expect(r.totalLines).toBe(3);expect(r.categories.damage).toBe(1);expect(r.categories.loot).toBe(1);expect(r.unknownLines).toBe(1)})});
