export type EventCategory="damage"|"critical"|"loot"|"boss"|"kill"|"death"|"xp"|"gold"|"level"|"zone"|"generic"|"unknown";
export type ParsedLine={raw:string;timestamp?:string;category:EventCategory};
export type LogSummary={totalLines:number;recognizedLines:number;unknownLines:number;timestamps:number;categories:Record<string,number>;parsed:ParsedLine[]};

const timestampPatterns=[/\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?)\]/,/(\d{2}:\d{2}:\d{2}(?:\.\d+)?)/];

export function parseDeskrawlLog(input:string):LogSummary{
 const lines=input.replace(/\r\n/g,"\n").split("\n").map(l=>l.trim()).filter(Boolean).slice(0,250000);
 const parsed=lines.map(raw=>{
   const timestamp=timestampPatterns.map(r=>raw.match(r)?.[1]).find(Boolean);
   const lower=raw.toLowerCase();
   let category:EventCategory="unknown";
   if(/critical|crit hit|crit\b/.test(lower))category="critical";
   else if(/damage|dealt|hit for|dmg/.test(lower))category="damage";
   else if(/loot|drop|dropped|item|chest/.test(lower))category="loot";
   else if(/boss/.test(lower))category="boss";
   else if(/killed|defeated|slain|kill\b/.test(lower))category="kill";
   else if(/died|death|dead|revive/.test(lower))category="death";
   else if(/experience|\bxp\b/.test(lower))category="xp";
   else if(/\bgold\b|currency/.test(lower))category="gold";
   else if(/level up|levelled|leveled/.test(lower))category="level";
   else if(/zone|area|map|stage|region/.test(lower))category="zone";
   else if(/start|end|player|character|session|steam/.test(lower))category="generic";
   return {raw,timestamp,category};
 });
 const categories=parsed.reduce<Record<string,number>>((acc,line)=>{acc[line.category]=(acc[line.category]??0)+1;return acc},{});
 const recognizedLines=parsed.filter(l=>l.category!=="unknown").length;
 return {totalLines:parsed.length,recognizedLines,unknownLines:parsed.length-recognizedLines,timestamps:parsed.filter(l=>l.timestamp).length,categories,parsed};
}
