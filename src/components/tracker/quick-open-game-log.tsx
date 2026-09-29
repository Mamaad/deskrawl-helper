"use client";

import {useState} from "react";

const windowsRunCommand = 'powershell -NoProfile -Command "$f=Get-ChildItem (Join-Path $env:USERPROFILE \\'AppData\\LocalLow\\') -Filter game.log -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match \\'Deskrawl\\' } | Select-Object -First 1; if ($f) { Start-Process explorer.exe $f.Directory.FullName }"';

export function QuickOpenGameLog(){
  const [copied,setCopied]=useState(false);

  async function copyCommand(){
    await navigator.clipboard.writeText(windowsRunCommand);
    setCopied(true);
    window.setTimeout(()=>setCopied(false),1600);
  }

  return <section className="game-card quick-open">
    <div className="quick-open-head">
      <div>
        <div className="eyebrow">WINDOWS · QUICK OPEN</div>
        <h2>Find game.log with Win + R</h2>
      </div>
      <span className="source-badge method">WIN + R</span>
    </div>

    <div className="run-steps">
      <div className="run-step">
        <div><kbd>WIN</kbd><span>+</span><kbd>R</kbd></div>
        <small>Open Windows Run</small>
      </div>
      <div className="run-arrow">→</div>
      <div className="run-step">
        <div><kbd>CTRL</kbd><span>+</span><kbd>V</kbd></div>
        <small>Paste the command</small>
      </div>
      <div className="run-arrow">→</div>
      <div className="run-step">
        <div><kbd>ENTER</kbd></div>
        <small>Explorer opens the log folder</small>
      </div>
    </div>

    <div className="run-command">
      <code>{windowsRunCommand}</code>
      <button type="button" className="game-btn gold" onClick={copyCommand}>
        {copied?"COPIED":"COPY COMMAND"}
      </button>
    </div>

    <p className="muted quick-note">
      This command searches your Windows LocalLow folder for a file named <code>game.log</code> inside a Deskrawl path, then opens its folder in Explorer. It does not upload, edit or execute the log.
    </p>
  </section>;
}
