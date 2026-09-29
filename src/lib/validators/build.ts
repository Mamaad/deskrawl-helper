import {z} from "zod";
export const buildSchema=z.object({title:z.string().min(3).max(80),description:z.string().max(3000),className:z.enum(["SORCERER","WARRIOR","MONK","HUNTER"]),gameVersion:z.string().min(1).max(30),isPublic:z.boolean().default(true),skills:z.array(z.string().max(100)).max(20).default([]),talents:z.array(z.string().max(100)).max(80).default([]),items:z.array(z.string().max(100)).max(30).default([]),runes:z.array(z.string().max(100)).max(30).default([])});
export type BuildInput=z.infer<typeof buildSchema>;
