export type EventCategory="damage"|"critical"|"loot"|"boss"|"kill"|"death"|"xp"|"gold"|"level"|"zone"|"generic"|"unknown";
export type ParsedLine={raw:string;timestamp?:string;category:EventCategory};
export type TrackerStats={
 level?:number;
 xpToNext?:number;
 xpGained:number;
 goldGained:number;
 itemsFound:number;
 xpPerHour?:number;
 goldPerHour?:number;
 itemsPerHour?:number;
 stage?:string;
 heroClass?:string;
 elapsedSeconds?:number;
};
export type LogSummary={totalLines:number;recognizedLines:number;unknownLines:number;timestamps:number;categories:Record<string,number>;parsed:ParsedLine[];stats:TrackerStats};

const isoPattern=/\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?)\]/;
const clockPattern=/(?:^|\[)(\d{2}:\d{2}:\d{2}(?:\.\d+)?)(?:\]|\s)/;

function numeric(value?:string){return value?Number(value.replace(/[ ,]/g,"")):undefined}
function clockSeconds(value:string){
 const parts=value.split(":").map(Number);
 if(parts.length!==3||parts.some(Number.isNaN))return undefined;
 return parts[0]*3600+parts[1]*60+parts[2];
}
function parseTime(raw:string){
 const iso=raw.match(isoPattern)?.[1];
 if(iso){const ms=Date.parse(iso.replace(" ","T"));if(Number.isFinite(ms))return ms/1000}
 const clock=raw.match(clockPattern)?.[1];
 return clock?clockSeconds(clock):undefined;
}
function lastNumber(lines:string[],patterns:RegExp[]){
 for(let i=lines.length-1;i>=0;i--){for(const p of patterns){const m=lines[i].match(p);const n=numeric(m?.[1]);if(n!==undefined)return n}}
 return undefined;
}
function lastText(lines:string[],patterns:RegExp[]){
 for(let i=lines.length-1;i>=0;i--){for(const p of patterns){const m=lines[i].match(p);if(m?.[1])return m[1].trim()}}
 return undefined;
}

export function parseDeskrawlLog(input:string):LogSummary{
 const lines=input.replace(/\r\n/g,"\n").split("\n").map(l=>l.trim()).filter(Boolean).slice(-300000);
 const parsed=lines.map(raw=>{
   const timestamp=raw.match(isoPattern)?.[1]??raw.match(clockPattern)?.[1];
   const lower=raw.toLowerCase();
   let category:EventCategory="unknown";
   if(/critical|crit hit|crit\b/.test(lower))category="critical";
   else if(/damage|dealt|hit for|dmg/.test(lower))category="damage";
   else if(/loot|drop|dropped|item|chest|pickup/.test(lower))category="loot";
   else if(/boss/.test(lower))category="boss";
   else if(/killed|defeated|slain|kill\b/.test(lower))category="kill";
   else if(/died|death|dead|revive/.test(lower))category="death";
   else if(/experience|\bxp\b/.test(lower))category="xp";
   else if(/\bgold\b|currency/.test(lower))category="gold";
   else if(/level up|levelled|leveled|\blevel\b/.test(lower))category="level";
   else if(/zone|area|map|stage|region/.test(lower))category="zone";
   else if(/start|end|player|character|session|steam|hero|class/.test(lower))category="generic";
   return {raw,timestamp,category};
 });
 const categories=parsed.reduce<Record<string,number>>((acc,line)=>{acc[line.category]=(acc[line.category]??0)+1;return acc},{});
 const recognizedLines=parsed.filter(l=>l.category!=="unknown").length;

 let xpGained=0,goldGained=0,itemsFound=0;
 for(const line of lines){
   const xp=line.match(/(?:xp|experience)(?:\s+(?:gain|gained|earned))?\s*(?:\+|:|=)\s*([\d ,]+)/i);
   if(xp)xpGained+=numeric(xp[1])??0;
   const gold=line.match(/(?:gold)(?:\s+(?:gain|gained|earned|pickup|picked up))?\s*(?:\+|:|=)\s*([\d ,]+)/i);
   if(gold)goldGained+=numeric(gold[1])??0;
   if(/(?:loot|drop|dropped|picked up|item acquired)/i.test(line))itemsFound++;
 }

 const times=lines.map(parseTime).filter((v):v is number=>v!==undefined);
 let elapsedSeconds: number|undefined;
 if(times.length>=2){
   const first=times[0]; let last=times[times.length-1];
   if(last<first&&first<86400&&last<86400)last+=86400;
   const span=last-first;if(span>0)elapsedSeconds=span;
 }
 const perHour=(value:number)=>elapsedSeconds&&elapsedSeconds>=60?value*3600/elapsedSeconds:undefined;
 const level=lastNumber(lines,[/(?:hero|player|character)?\s*level\s*(?:[:=]|is)?\s*(\d{1,3})/i,/level\s+up[^\d]*(\d{1,3})/i]);
 const xpToNext=lastNumber(lines,[/(?:xp|experience)\s*(?:needed|required|remaining|to next(?: level)?)\s*(?:[:=]|is)?\s*([\d ,]+)/i,/(?:needed|required|remaining)\s*(?:xp|experience)\s*(?:[:=]|is)?\s*([\d ,]+)/i]);
 const stage=lastText(lines,[/(?:stage|map|zone|area)\s*(?:[:=]|is)\s*([^|;,\]]{2,80})/i,/(?:entering|entered|farming)\s+(?:stage|map|zone|area)?\s*[:=-]?\s*([^|;,\]]{2,80})/i]);
 const heroClass=lastText(lines,[/(?:class|hero)\s*(?:[:=]|is)\s*(Warrior|Sorcerer|Hunter|Monk)/i,/(Warrior|Sorcerer|Hunter|Monk)\s+(?:character|hero)/i]);

 return {
  totalLines:parsed.length,recognizedLines,unknownLines:parsed.length-recognizedLines,timestamps:parsed.filter(l=>l.timestamp).length,categories,parsed,
  stats:{level,xpToNext,xpGained,goldGained,itemsFound,xpPerHour:perHour(xpGained),goldPerHour:perHour(goldGained),itemsPerHour:perHour(itemsFound),stage,heroClass,elapsedSeconds}
 };
}
