import {describe,it,expect} from "vitest";
import {buildSchema} from "../src/lib/validators/build";
describe("buildSchema",()=>{it("accepts a minimal build",()=>{expect(buildSchema.safeParse({title:"Arc build",description:"demo",className:"SORCERER",gameVersion:"1.0.0"}).success).toBe(true)})});
