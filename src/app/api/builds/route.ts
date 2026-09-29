import {NextResponse} from "next/server";
import {buildSchema} from "@/lib/validators/build";
import {demoBuilds} from "@/lib/data/demo-builds";
export async function GET(){return NextResponse.json({data:demoBuilds,source:"demo"})}
export async function POST(request:Request){const body=await request.json().catch(()=>null);const parsed=buildSchema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Invalid build",issues:parsed.error.issues},{status:400});return NextResponse.json({error:"Database persistence requires DATABASE_URL and authentication."},{status:501})}
