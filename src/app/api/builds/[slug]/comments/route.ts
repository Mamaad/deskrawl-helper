import {NextResponse} from "next/server";
import {z} from "zod";
const schema=z.object({content:z.string().min(1).max(2000)});
export async function POST(request:Request){const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid comment"},{status:400});return NextResponse.json({error:"Authentication and database are required."},{status:501})}
