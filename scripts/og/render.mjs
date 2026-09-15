import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
// Renders scripts/og/og.html to src/app/opengraph-image.png (1200×630) with
// headless Chrome. Run from the project root: node scripts/og/render.mjs
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const here = fileURLToPath(new URL(".", import.meta.url));
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new","--hide-scrollbars","--remote-debugging-port=9466","--no-first-run","--user-data-dir=/tmp/claude-cdp-og","about:blank"],{stdio:"ignore"});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
let t; for(let i=0;i<60;i++){try{t=await (await fetch("http://127.0.0.1:9466/json")).json();break;}catch{await sleep(250);}}
const ws=new WebSocket(t.find(x=>x.type==="page").webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
let id=0; const p=new Map(); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}};
const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}));});
const ev=async(e)=>(await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true})).result?.result?.value;
await send("Emulation.setDeviceMetricsOverride",{width:1200,height:630,deviceScaleFactor:2,mobile:false});
await send("Page.enable");
await send("Page.navigate",{url:"file://"+here+"og.html"});
await sleep(1500);
await ev("document.fonts.ready.then(()=>true)");
console.log("inter:", await ev("document.fonts.check('600 88px Inter')"), "serif:", await ev("document.fonts.check('italic 400 88px \"Instrument Serif\"')"));
const m=await send("Page.captureScreenshot",{format:"png"});
const png = await sharp(Buffer.from(m.result.data,"base64")).resize(1200,630).png({compressionLevel:9}).toBuffer();
writeFileSync(here+"../../src/app/opengraph-image.png", png);
console.log("wrote src/app/opengraph-image.png", png.length, "bytes");
ws.close(); chrome.kill();
