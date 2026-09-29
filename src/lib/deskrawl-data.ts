export type Talent={name:string;row:number;maxPoints:number;requires?:string;effect:string};
export const releaseStats={heroes:4,abilities:56,talents:161,equipment:209,minions:67,enemies:62,maxLevel:70};

export const dataSources=[
  {id:"afk-method",label:"AFK Meta methodology",url:"https://afkmeta.com/about",snapshot:"2026-09",kind:"methodology"},
  {id:"afk-warrior",label:"AFK Meta · Deskrawl Warrior talents",url:"https://afkmeta.com/es/deskrawl/talents/warrior",snapshot:"2026-09-27",kind:"demo"},
  {id:"launch-reference",label:"Wikily · Deskrawl launch reference",url:"https://wikily.gg/deskrawl",snapshot:"2026-09-29",kind:"launch"},
  {id:"steam-save",label:"SteamDB · Deskrawl Cloud Saves",url:"https://steamdb.info/app/4623570/ufs/",snapshot:"2026-09-29",kind:"steam"}
] as const;

export const warriorTalents:Talent[]=[
{name:"Strength",row:0,maxPoints:5,effect:"+25 Strength at max"},
{name:"Vitality",row:0,maxPoints:5,effect:"+250 Max HP at max"},
{name:"Armor",row:0,maxPoints:5,effect:"+125 Armor and +125 Magic Resist at max"},
{name:"Attack Speed",row:0,maxPoints:5,effect:"+10% Attack Speed at max"},
{name:"Critical Hit Chance",row:0,maxPoints:5,effect:"+10% Critical Hit Chance at max"},
{name:"Critical Hit Damage",row:5,maxPoints:5,requires:"Critical Hit Chance",effect:"+25% Critical Hit Damage at max"},
{name:"Thorns",row:0,maxPoints:5,effect:"+15 Thorns at max"},
{name:"Life Regeneration",row:5,maxPoints:5,requires:"Vitality",effect:"+20 Life Regeneration at max"},
{name:"Brutality",row:5,maxPoints:5,effect:"+50% damage to Injured targets at max"},
{name:"Ferocity",row:5,maxPoints:5,effect:"+25% damage to Vulnerable targets at max"},
{name:"Rending Fury",row:10,maxPoints:1,requires:"Attack Speed",effect:"Basic attacks can stack bonus Attack Speed, up to 5 stacks."},
{name:"Battle Inspiration",row:5,maxPoints:3,effect:"Sweep Strike can reduce Warcry cooldown."},
{name:"Heavy Blow",row:10,maxPoints:5,requires:"Ferocity",effect:"Critical hits can inflict Vulnerable."},
{name:"Thorn Boost",row:5,maxPoints:5,requires:"Thorns",effect:"+50% Thorns at max"},
{name:"Improve Strong Attack: Mana",row:10,maxPoints:5,effect:"Reduces Strong Attack mana cost by 25% at max."},
{name:"Fury Infusion",row:15,maxPoints:1,effect:"+50% Strong Attack damage, with +75% mana cost."},
{name:"Improve Warcry: Cooldown",row:10,maxPoints:5,effect:"+25% Warcry cooldown reduction at max."},
{name:"Fury Channeling",row:10,maxPoints:3,effect:"Rage Shield generates mana when activated."},
{name:"Improve Minion [Beast]",row:15,maxPoints:1,effect:"Active Beast grants +5% Strength."},
{name:"Improve Minion [Humanoid]",row:15,maxPoints:1,effect:"Active Humanoid grants +15% EXP gain."},
{name:"Defensive Stance",row:15,maxPoints:5,requires:"Armor",effect:"+30% Armor at max."},
{name:"Restore Mana on Kill",row:15,maxPoints:5,requires:"Improve Strong Attack: Mana",effect:"Restores up to 10% mana per kill."},
{name:"Second Wind",row:15,maxPoints:1,requires:"Life Regeneration",effect:"Heals 20% when HP falls below 50%, 6s cooldown."},
{name:"Focus",row:10,maxPoints:5,requires:"Strength",effect:"Basic attacks gain a chance to Stun."},
{name:"Charge",row:20,maxPoints:3,requires:"Focus",effect:"+60% damage to Stunned targets at max."},
{name:"Improve Flame Strike: Damage",row:20,maxPoints:3,effect:"Flame Strike deals +45% damage at max."},
{name:"Improve Valiant Strike: Mana Gain",row:20,maxPoints:2,effect:"+4 mana gain with Valiant Strike at max."},
{name:"Improve Minion [Undead]",row:20,maxPoints:1,effect:"Active Undead grants +50% Critical Hit Damage."},
{name:"Vicious Thorns",row:20,maxPoints:1,requires:"Thorn Boost",effect:"Thorns can critically hit."}
];

export const heroData=[
  {name:"Warrior",stat:"Strength",status:"imported-demo",note:"29 named combat talents imported from the indexed AFK Meta demo snapshot."},
  {name:"Sorcerer",stat:"Intelligence",status:"release-present",note:"Launch reference confirms a full class tree; do not reuse the old demo placeholder talent data."},
  {name:"Hunter",stat:"Dexterity",status:"release-present",note:"Launch reference confirms its own class tree."},
  {name:"Monk",stat:"Dexterity",status:"release-present",note:"Launch reference confirms its own class tree."}
] as const;
