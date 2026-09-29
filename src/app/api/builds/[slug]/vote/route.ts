import {NextResponse} from "next/server";
import {z} from "zod";
const schema=z.object({value:z.number().int().min(-1).max(1)});
export async function POST(request:Request){const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid vote"},{status:400});return NextResponse.json({error:"Authentication and database are required."},{status:501})}
