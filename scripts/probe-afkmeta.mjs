import {mkdir,writeFile} from "node:fs/promises";

const classes=["warrior","sorcerer","hunter","monk"];
const base="https://afkmeta.com/en/deskrawl/talents/";
const decode=s=>s
 .replace(/<script[\s\S]*?<\/script>/gi," ")
 .replace(/<style[\s\S]*?<\/style>/gi," ")
 .replace(/<[^>]+>/g," ")
 .replace(/&nbsp;/g," ")
 .replace(/&amp;/g,"&")
 .replace(/&quot;/g,'"')
 .replace(/&#39;|&apos;/g,"'")
 .replace(/&lt;/g,"<")
 .replace(/&gt;/g,">")
 .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
 .replace(/\s+/g," ").trim();
const parseTable=table=>[...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(m=>
 [...m[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c=>decode(c[1]))
).filter(r=>r.length);

const result={source:"AFK Meta",fetchedAt:new Date().toISOString(),classes:{},lifeSkills:[]};
for(const cls of classes){
 const url=base+cls;
 const res=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 DeskrawlHelper/1.0","accept-language":"en-US,en;q=0.9"}});
 if(!res.ok)throw new Error(`${cls}: AFK Meta returned ${res.status}`);
 const html=await res.text();
 const tables=[...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(m=>m[0]);
 const combat=parseTable(tables[0]??"");
 const life=parseTable(tables[1]??"");
 result.classes[cls]={
   sourceUrl:url,
   title:decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??""),
   talents:combat.slice(1).map((r,i)=>({
     index:i+1,
     name:r[0],
     pointsSpent:Number(r[1]),
     maxPoints:Number(r[2]),
     requires:r[3],
     atMax:r[4]
   }))
 };
 if(cls==="sorcerer"){
   result.lifeSkills=life.slice(1).map((r,i)=>({index:i+1,name:r[0],requires:r[1],gold:r[2],effects:r[3]}));
 }
 console.log(cls,result.classes[cls].talents.length,"combat talents");
}
console.log("life skills",result.lifeSkills.length);
await mkdir("src/data",{recursive:true});
await writeFile("src/data/afkmeta-talents.json",JSON.stringify(result,null,2));
