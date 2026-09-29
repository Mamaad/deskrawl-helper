import {LogAnalyzer} from "@/components/log-analyzer/log-analyzer";
export default function Page(){return <><span className="badge">Local-first</span><h1>game.log Analyzer</h1><p style={{color:"#8e9ab3"}}>Generic parser scaffolding until real Deskrawl log samples define exact event formats. It does not invent DPS when the source log does not expose it.</p><LogAnalyzer/></>}
