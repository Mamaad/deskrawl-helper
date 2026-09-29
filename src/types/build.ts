export type DeskrawlClass="SORCERER"|"WARRIOR"|"MONK"|"HUNTER";
export type Build={slug:string;title:string;className:DeskrawlClass;author:string;gameVersion:string;votes:number;description:string;createdAt:string;demo:boolean;skills:string[];talents:string[];items:string[];runes:string[]};
