export type PlannerClass="warrior"|"sorcerer"|"hunter"|"monk";
export type PlannerTalent={id:string;name:string;row:number;max:number;effect:string;requires?:string};
export type PlannerTree={id:PlannerClass;name:string;stat:string;sourceLabel:string;sourceUrl:string;status:string;accent:string;talents:PlannerTalent[]};

const warrior:PlannerTalent[]=[
{id:"w-strength",name:"Strength",row:0,max:5,effect:"+25 Strength at max."},
{id:"w-vitality",name:"Vitality",row:0,max:5,effect:"+250 Max HP at max."},
{id:"w-armor",name:"Armor",row:0,max:5,effect:"+125 Armor and +125 Magic Resist at max."},
{id:"w-as",name:"Attack Speed",row:0,max:5,effect:"+10% Attack Speed at max."},
{id:"w-crit",name:"Critical Hit Chance",row:0,max:5,effect:"+10% Critical Hit Chance at max."},
{id:"w-thorn",name:"Thorns",row:0,max:5,effect:"+15 Thorns at max."},
{id:"w-critdmg",name:"Critical Hit Damage",row:5,max:5,effect:"+25% Critical Hit Damage at max.",requires:"Critical Hit Chance"},
{id:"w-regen",name:"Life Regeneration",row:5,max:5,effect:"+20 Life Regeneration at max.",requires:"Vitality"},
{id:"w-brutality",name:"Brutality",row:5,max:5,effect:"+50% damage to Injured targets at max."},
{id:"w-ferocity",name:"Ferocity",row:5,max:5,effect:"+25% damage to Vulnerable targets at max."},
{id:"w-inspiration",name:"Battle Inspiration",row:5,max:3,effect:"Sweep Strike can reduce Warcry cooldown."},
{id:"w-thornboost",name:"Thorn Boost",row:5,max:5,effect:"+50% Thorns at max.",requires:"Thorns"},
{id:"w-rending",name:"Rending Fury",row:10,max:1,effect:"Basic attacks can stack bonus Attack Speed.",requires:"Attack Speed"},
{id:"w-strongmana",name:"Improve Strong Attack: Mana",row:10,max:5,effect:"Reduces Strong Attack mana cost by 25% at max."},
{id:"w-warcry",name:"Improve Warcry: Cooldown",row:10,max:5,effect:"+25% Warcry cooldown reduction at max."},
{id:"w-focus",name:"Focus",row:10,max:5,effect:"Basic attacks gain a chance to Stun.",requires:"Strength"},
{id:"w-heavy",name:"Heavy Blow",row:10,max:5,effect:"Critical hits can inflict Vulnerable.",requires:"Ferocity"},
{id:"w-channel",name:"Fury Channeling",row:10,max:3,effect:"Rage Shield generates Mana when activated."},
{id:"w-beast",name:"Improve Minion [Beast]",row:15,max:1,effect:"Active Beast grants +5% Strength."},
{id:"w-human",name:"Improve Minion [Humanoid]",row:15,max:1,effect:"Active Humanoid grants +15% EXP gain."},
{id:"w-defense",name:"Defensive Stance",row:15,max:5,effect:"+30% Armor at max.",requires:"Armor"},
{id:"w-manakill",name:"Restore Mana on Kill",row:15,max:5,effect:"Restores up to 10% Mana per kill.",requires:"Improve Strong Attack: Mana"},
{id:"w-infusion",name:"Fury Infusion",row:15,max:1,effect:"+50% Strong Attack damage, with +75% Mana cost."},
{id:"w-second",name:"Second Wind",row:15,max:1,effect:"Heals 20% when HP falls below 50%, with a 6s cooldown.",requires:"Life Regeneration"},
{id:"w-undead",name:"Improve Minion [Undead]",row:20,max:1,effect:"Active Undead grants +50% Critical Hit Damage."},
{id:"w-flame",name:"Improve Flame Strike: Damage",row:20,max:3,effect:"Flame Strike deals +45% damage at max."},
{id:"w-valiant",name:"Improve Valiant Strike: Mana Gain",row:20,max:2,effect:"+4 Mana gain with Valiant Strike at max."},
{id:"w-charge",name:"Charge",row:20,max:3,effect:"+60% damage to Stunned targets at max.",requires:"Focus"},
{id:"w-vicious",name:"Vicious Thorns",row:20,max:1,effect:"Thorns can critically hit.",requires:"Thorn Boost"}
];

const pending=(id:PlannerClass,name:string,stat:string,accent:string,sourceUrl:string):PlannerTree=>({
 id,name,stat,accent,sourceUrl,
 sourceLabel:"Release tree · source page linked",
 status:"The release tree exists, but its current node rows are not available in the indexed source feed used by this build. The class stays selectable and the planner will accept the verified rows as soon as they can be imported; no guide-only or guessed talents are inserted.",
 talents:[]
});

export const plannerTrees:Record<PlannerClass,PlannerTree>={
 warrior:{id:"warrior",name:"Warrior",stat:"Strength",sourceLabel:"AFK Meta game-data snapshot · 27 Sep 2026",sourceUrl:"https://afkmeta.com/en/deskrawl/talents/warrior",status:"29 named combat talents from the AFK Meta Deskrawl snapshot. This snapshot is explicitly marked as demo-era data.",accent:"#b94a48",talents:warrior},
 sorcerer:pending("sorcerer","Sorcerer","Intelligence","#7166d9","https://afkmeta.com/en/deskrawl/talents/sorcerer"),
 hunter:pending("hunter","Hunter","Dexterity","#5e9d6c","https://afkmeta.com/en/deskrawl/talents/hunter"),
 monk:pending("monk","Monk","Dexterity","#d39748","https://afkmeta.com/en/deskrawl/talents/monk")
};
