import snapshot from "@/data/afkmeta-talents.json";

export type PlannerClass="warrior"|"sorcerer"|"hunter"|"monk";
export type PlannerTalent={
 index:number;
 id:string;
 name:string;
 row:number;
 max:number;
 requires:string;
 effect:string;
};
export type LifeSkill={index:number;name:string;requires:string;gold:string;effects:string};
export type PlannerTree={
 id:PlannerClass;
 name:string;
 stat:string;
 accent:string;
 sourceUrl:string;
 talents:PlannerTalent[];
};

type RawTalent={index:number;name:string;pointsSpent:number;maxPoints:number;requires:string;atMax:string};
type RawClass={sourceUrl:string;title:string;talents:RawTalent[]};
type RawSnapshot={
 source:string;
 fetchedAt:string;
 classes:Record<PlannerClass,RawClass>;
 lifeSkills:LifeSkill[];
};

const raw=snapshot as RawSnapshot;
const meta:Record<PlannerClass,{name:string;stat:string;accent:string}>={
 warrior:{name:"Warrior",stat:"Strength",accent:"#d34e4e"},
 sorcerer:{name:"Sorcerer",stat:"Intelligence",accent:"#7c6cff"},
 hunter:{name:"Hunter",stat:"Dexterity",accent:"#61b477"},
 monk:{name:"Monk",stat:"Dexterity",accent:"#d7a24d"}
};

const slug=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export const plannerTrees=Object.fromEntries((Object.keys(meta) as PlannerClass[]).map(id=>{
 const source=raw.classes[id];
 const info=meta[id];
 const talents=source.talents.map((talent,index):PlannerTalent=>({
   index:talent.index,
   id:`${id}-${index+1}-${slug(talent.name)}`,
   name:talent.name,
   row:talent.pointsSpent,
   max:talent.maxPoints,
   requires:talent.requires,
   effect:talent.atMax
 }));
 return [id,{id,...info,sourceUrl:source.sourceUrl,talents} satisfies PlannerTree];
})) as Record<PlannerClass,PlannerTree>;

export const lifeSkills=raw.lifeSkills;
export const talentSnapshot={
 source:raw.source,
 fetchedAt:raw.fetchedAt,
 combatTalentCount:Object.values(raw.classes).reduce((sum,c)=>sum+c.talents.length,0),
 lifeSkillCount:raw.lifeSkills.length
};

export function talentElement(talent:PlannerTalent){
 const hay=(talent.name+" "+talent.effect).toLowerCase();
 if(/lightning|electro|storm|thunder|static|plasma/.test(hay))return "lightning";
 if(/fire|flame|burn|ignite|combust|cataclysm|immolat/.test(hay))return "fire";
 if(/cold|frost|ice|frozen|chill|permafrost/.test(hay))return "frost";
 if(/poison|venom|toxin/.test(hay))return "poison";
 if(/bleed|blood|hemorrhage/.test(hay))return "blood";
 if(/mana|arcane|intelligence/.test(hay))return "arcane";
 return "neutral";
}
