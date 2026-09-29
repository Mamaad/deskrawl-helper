import {writeFile} from "node:fs/promises";
const url="https://afkmeta.com/en/deskrawl/talents/sorcerer";
const res=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 DeskrawlHelper/1.0","accept-language":"en-US,en;q=0.9"}});
if(!res.ok) throw new Error(`AFK Meta returned ${res.status}`);
const html=await res.text();

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

const tables=[...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(m=>m[0]);
const parseTable=table=>[...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(m=>
 [...m[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c=>decode(c[1]))
).filter(r=>r.length);

const combat=parseTable(tables[0]??"");
const life=parseTable(tables[1]??"");
const out={
 source:url,
 fetchedAt:new Date().toISOString(),
 title:decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??""),
 combatHeader:combat[0]??[],
 combat:combat.slice(1).map((r,i)=>({index:i+1,name:r[0],pointsSpent:Number(r[1]),maxPoints:Number(r[2]),requires:r[3],atMax:r[4]})),
 lifeHeader:life[0]??[],
 lifeSkills:life.slice(1).map((r,i)=>({index:i+1,name:r[0],requires:r[1],gold:r[2],effects:r[3]}))
};
await writeFile("afkmeta-sorcerer.json",JSON.stringify(out,null,2));
console.log(JSON.stringify({status:res.status,title:out.title,combat:out.combat.length,lifeSkills:out.lifeSkills.length,first:out.combat[0],last:out.combat.at(-1)},null,2));
