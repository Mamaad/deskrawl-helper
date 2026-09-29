import {NextResponse} from "next/server";
import {demoBuilds} from "@/lib/data/demo-builds";
import {buildSchema} from "@/lib/validators/build";
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const build=demoBuilds.find(b=>b.slug===slug);return build?NextResponse.json({data:build}):NextResponse.json({error:"Not found"},{status:404})}
export async function PATCH(request:Request){const body=await request.json().catch(()=>null);const parsed=buildSchema.partial().safeParse(body);if(!parsed.success)return NextResponse.json({error:"Invalid build",issues:parsed.error.issues},{status:400});return NextResponse.json({error:"Database persistence not configured."},{status:501})}
export async function DELETE(){return NextResponse.json({error:"Database persistence not configured."},{status:501})}
