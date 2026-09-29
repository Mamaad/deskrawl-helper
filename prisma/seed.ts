import {PrismaClient,DeskrawlClass} from "@prisma/client";
const prisma=new PrismaClient();
async function main(){const user=await prisma.user.upsert({where:{username:"demo"},update:{},create:{username:"demo",displayName:"Demo User"}});for(const className of Object.values(DeskrawlClass)){const slug="demo-"+className.toLowerCase();await prisma.build.upsert({where:{slug},update:{},create:{slug,title:"Demo "+className+" Build",description:"Demo data only. Not a verified Deskrawl meta build.",class:className,gameVersion:"demo",authorId:user.id,isDemo:true}})}}
main().finally(()=>prisma.$disconnect());
