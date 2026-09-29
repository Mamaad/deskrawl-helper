"use client";

import {useState} from "react";
import {useI18n} from "@/components/i18n-provider";

const windowsRunCommand = "powershell -NoProfile -Command \"$f=Get-ChildItem (Join-Path $env:USERPROFILE 'AppData\\\\LocalLow') -Filter game.log -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'Deskrawl' } | Select-Object -First 1; if ($f) { Start-Process explorer.exe $f.Directory.FullName }\"";

const copy:Record<string,{eyebrow:string;title:string;open:string;paste:string;enter:string;copy:string;copied:string;note:string}> = {
  en:{eyebrow:"WINDOWS · QUICK OPEN",title:"Find game.log with Win + R",open:"Open Windows Run",paste:"Paste the command",enter:"Explorer opens the log folder",copy:"COPY COMMAND",copied:"COPIED",note:"This command searches your Windows LocalLow folder for game.log inside a Deskrawl path, then opens its folder in Explorer. It does not upload, edit or execute the log."},
  fr:{eyebrow:"WINDOWS · ACCÈS RAPIDE",title:"Trouver game.log avec Win + R",open:"Ouvre Exécuter",paste:"Colle la commande",enter:"L’Explorateur ouvre le dossier du log",copy:"COPIER LA COMMANDE",copied:"COPIÉ",note:"Cette commande cherche game.log dans le dossier Windows LocalLow, uniquement dans un chemin Deskrawl, puis ouvre son dossier dans l’Explorateur. Elle n’envoie, ne modifie et n’exécute pas le log."},
  de:{eyebrow:"WINDOWS · SCHNELLZUGRIFF",title:"game.log mit Win + R finden",open:"Windows Ausführen öffnen",paste:"Befehl einfügen",enter:"Explorer öffnet den Log-Ordner",copy:"BEFEHL KOPIEREN",copied:"KOPIERT",note:"Der Befehl sucht in LocalLow nach game.log in einem Deskrawl-Pfad und öffnet den Ordner. Er lädt nichts hoch und verändert oder führt das Log nicht aus."},
  es:{eyebrow:"WINDOWS · ACCESO RÁPIDO",title:"Encuentra game.log con Win + R",open:"Abre Ejecutar",paste:"Pega el comando",enter:"Explorer abre la carpeta del log",copy:"COPIAR COMANDO",copied:"COPIADO",note:"El comando busca game.log en LocalLow dentro de una ruta Deskrawl y abre su carpeta. No sube, modifica ni ejecuta el log."},
  "zh-CN":{eyebrow:"WINDOWS · 快速打开",title:"用 Win + R 找到 game.log",open:"打开“运行”",paste:"粘贴命令",enter:"资源管理器打开日志目录",copy:"复制命令",copied:"已复制",note:"此命令只在 Windows LocalLow 中查找 Deskrawl 路径下的 game.log，并用资源管理器打开其目录。不会上传、修改或执行日志。"},
  ja:{eyebrow:"WINDOWS · クイックオープン",title:"Win + R で game.log を探す",open:"「ファイル名を指定して実行」を開く",paste:"コマンドを貼り付ける",enter:"Explorer がログのフォルダを開く",copy:"コマンドをコピー",copied:"コピー済み",note:"このコマンドは LocalLow 内の Deskrawl パスから game.log を検索し、Explorer でフォルダを開くだけです。ログのアップロード、編集、実行は行いません。"},
  ko:{eyebrow:"WINDOWS · 빠른 열기",title:"Win + R로 game.log 찾기",open:"Windows 실행 열기",paste:"명령 붙여넣기",enter:"탐색기가 로그 폴더를 엽니다",copy:"명령 복사",copied:"복사됨",note:"이 명령은 LocalLow의 Deskrawl 경로에서 game.log를 찾아 탐색기로 폴더를 엽니다. 로그를 업로드, 수정 또는 실행하지 않습니다."},
  pl:{eyebrow:"WINDOWS · SZYBKIE OTWARCIE",title:"Znajdź game.log przez Win + R",open:"Otwórz Uruchamianie",paste:"Wklej polecenie",enter:"Eksplorator otworzy folder logu",copy:"KOPIUJ POLECENIE",copied:"SKOPIOWANO",note:"Polecenie szuka game.log w LocalLow w ścieżce Deskrawl i otwiera folder w Eksploratorze. Nie wysyła, nie zmienia ani nie uruchamia logu."},
  "pt-BR":{eyebrow:"WINDOWS · ACESSO RÁPIDO",title:"Encontre game.log com Win + R",open:"Abra Executar",paste:"Cole o comando",enter:"O Explorer abre a pasta do log",copy:"COPIAR COMANDO",copied:"COPIADO",note:"O comando procura game.log em LocalLow dentro de um caminho Deskrawl e abre a pasta no Explorer. Ele não envia, altera nem executa o log."},
  ru:{eyebrow:"WINDOWS · БЫСТРЫЙ ДОСТУП",title:"Найдите game.log через Win + R",open:"Откройте «Выполнить»",paste:"Вставьте команду",enter:"Проводник откроет папку лога",copy:"КОПИРОВАТЬ КОМАНДУ",copied:"СКОПИРОВАНО",note:"Команда ищет game.log в LocalLow внутри пути Deskrawl и открывает папку в Проводнике. Она не загружает, не меняет и не запускает лог."}
};

export function QuickOpenGameLog(){
  const [copied,setCopied]=useState(false);
  const {locale}=useI18n();
  const text=copy[locale]??copy.en;

  async function copyCommand(){
    await navigator.clipboard.writeText(windowsRunCommand);
    setCopied(true);
    window.setTimeout(()=>setCopied(false),1600);
  }

  return <section className="game-card quick-open">
    <div className="quick-open-head">
      <div>
        <div className="eyebrow">{text.eyebrow}</div>
        <h2>{text.title}</h2>
      </div>
      <span className="source-badge method">WIN + R</span>
    </div>

    <div className="run-steps">
      <div className="run-step"><div><kbd>WIN</kbd><span>+</span><kbd>R</kbd></div><small>{text.open}</small></div>
      <div className="run-arrow">→</div>
      <div className="run-step"><div><kbd>CTRL</kbd><span>+</span><kbd>V</kbd></div><small>{text.paste}</small></div>
      <div className="run-arrow">→</div>
      <div className="run-step"><div><kbd>ENTER</kbd></div><small>{text.enter}</small></div>
    </div>

    <div className="run-command">
      <code>{windowsRunCommand}</code>
      <button type="button" className="game-btn gold" onClick={copyCommand}>{copied?text.copied:text.copy}</button>
    </div>

    <p className="muted quick-note">{text.note}</p>
  </section>;
}
