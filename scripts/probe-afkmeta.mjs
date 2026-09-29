const url="https://afkmeta.com/en/deskrawl/talents/sorcerer";
const res=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 DeskrawlHelper/1.0","accept-language":"en-US,en;q=0.9"}});
console.log("STATUS",res.status,res.url);
const html=await res.text();
console.log("LENGTH",html.length);
console.log("TITLE",html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??"");
const clean=s=>s.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g," ").trim();
const tables=[...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(m=>m[0]);
console.log("TABLE_COUNT",tables.length);
tables.forEach((table,i)=>{
 console.log("\n=== TABLE",i,"===");
 const rows=[...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(m=>m[0]);
 rows.forEach((row,j)=>{
   const cells=[...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(m=>clean(m[1]));
   console.log(JSON.stringify({j,cells}));
 });
});
console.log("\nTEXT_SAMPLE");
console.log(clean(html).slice(0,30000));
