/* src-sha256:a5c5057efe0e3302 */
var et=Object.defineProperty;var tt=(Ce,e,t)=>e in Ce?et(Ce,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):Ce[e]=t;var Ke=(Ce,e,t)=>tt(Ce,typeof e!="symbol"?e+"":e,t);const LIVESCORE_LOCAL_ASSET_DIR="images/teams",LIVESCORE_TEAMS={ARS:{name:"Arsenal",code:"ars",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/ars.png`},AVL:{name:"Aston Villa",code:"avl",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/avl.png`},BOU:{name:"AFC Bournemouth",code:"bou",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/bou.png`},BRE:{name:"Brentford",code:"bre",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/bre.png`},BHA:{name:"Brighton",code:"bha",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/bha.png`},BRI:{name:"Brighton",code:"bha",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/bha.png`},CHE:{name:"Chelsea",code:"che",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/che.png`},CRY:{name:"Crystal Palace",code:"cry",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/cry.png`},CPL:{name:"Crystal Palace",code:"cry",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/cry.png`},EVE:{name:"Everton",code:"eve",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/eve.png`},FUL:{name:"Fulham",code:"ful",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/ful.png`},FLU:{name:"Fulham",code:"ful",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/ful.png`},IPS:{name:"Ipswich Town",code:"ips",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/ips.png`},LEE:{name:"Leeds United",code:"lee",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/lee.png`},LIV:{name:"Liverpool",code:"liv",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/liv.png`},MCI:{name:"Manchester City",code:"mci",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/mci.png`},MUN:{name:"Manchester United",code:"mun",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/mun.png`},NEW:{name:"Newcastle United",code:"new",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/new.png`},NFO:{name:"Nottingham Forest",code:"nfo",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/nfo.png`},SPU:{name:"Tottenham Hotspur",code:"tot",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/tot.png`},TOT:{name:"Tottenham Hotspur",code:"tot",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/tot.png`},SUN:{name:"Sunderland",code:"sun",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/sun.png`},HUL:{name:"Hull City",code:"hul",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/hul.png`},COV:{name:"Coventry City",code:"cov",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/cov.png`},WOL:{name:"Wolves",code:"wol",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/wol.png`},WHU:{name:"West Ham United",code:"whu",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/whu.png`},WHA:{name:"West Ham United",code:"whu",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/whu.png`},LEI:{name:"Leicester City",code:"lei",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/lei.png`},SOU:{name:"Southampton",code:"sou",logo:`${LIVESCORE_LOCAL_ASSET_DIR}/sou.png`},BAY:{name:"Bayern Munich",code:"bay",logo:""},COM:{name:"Como",code:"com",logo:""}};function resolveLiveScoreTeam(Ce,e="",t=1){if(!Ce)return{name:"",code:"",logo:""};const a=String(Ce).toUpperCase().replace(/[.\/]+$/,"").trim();if((a==="I"||a==="S"||a==="B")&&e){const r=e.split(/\s+vs\s+/i);if(r.length===2){const i=(t===1?r[0]:r[1]).match(/[A-Za-z]+/g);if(i&&i.length>0){const d=i[0].toUpperCase();if(LIVESCORE_TEAMS[d])return LIVESCORE_TEAMS[d]}}}return LIVESCORE_TEAMS[a]?LIVESCORE_TEAMS[a]:{name:Ce,code:a.toLowerCase(),logo:""}}const f=class f{static getPersonaMeta(e,t=!1){const a=f.PERSONAS.find(r=>r.id===e)||f.PERSONAS[0];return{id:a.id,label:t?a.labelEn:a.labelTh,tone:a.tone}}static _clean(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}static _c(e,t,a){return{id:e,tags:Array.isArray(t)?t:[t],text:a}}static _pickNonRepeating(e,t,a,r,p,i){if(!Array.isArray(e)||e.length===0)return null;let d=e.filter(s=>!s.tags.some(o=>t.has(o))&&!a.has(s.id));d.length===0&&(d=e.filter(s=>!s.tags.some(o=>t.has(o)))),d.length===0&&(d=e.filter(s=>!a.has(s.id))),d.length===0&&(d=e);const n=Math.sin(r*13.37+p*93.17+i*37.71)*43758.5453,c=Math.floor((n-Math.floor(n))*d.length),m=d[Math.max(0,Math.min(d.length-1,c))];return m.tags.forEach(s=>t.add(s)),a.add(m.id),m}static _pickPlain(e,t,a,r){if(!Array.isArray(e)||e.length===0)return"";const p=Math.sin(t*17.13+a*71.29+r*41.53)*43758.5453,i=Math.floor((p-Math.floor(p))*e.length);return e[Math.max(0,Math.min(e.length-1,i))]}static generateFreshNote(e,t,a,r=!1,p=[],i=null,d=!0,n=!1,c=!1,m=null){return f.generateNoteObject(e,t,a,r,p,i,d,n,c,m).text}static generateNoteObject(e,t,a,r=!1,p=[],i=null,d=!0,n=!1,c=!1,m=null){const s=f.getPersonaMeta("broadcaster",c);if(!t||!t.results||t.results.length===0)return{text:c?`Gameweek ${e} is awaiting verified match results from the pitch.`:`Gameweek ${e} กำลังรอข้อมูลผลคะแนนจากสนามจริง`,personaId:s.id,personaLabel:s.label,personaTone:s.tone};r&&(f._refreshStep=(f._refreshStep+1)%997);const o=r?f._refreshStep:0,l=f._clean,g=String(i?.id||a||"40700"),y=g.split("").reduce((ee,re)=>ee+re.charCodeAt(0),0),D=Math.abs(Number(e)*37+y*13),h=`${g}_${e}`;let $;r?$=((f._personaCursor.has(h)?f._personaCursor.get(h):D%f.PERSONAS.length)+1)%f.PERSONAS.length:$=f._personaCursor.has(h)?f._personaCursor.get(h):D%f.PERSONAS.length,f._personaCursor.set(h,$);const v=f.getPersonaMeta(f.PERSONAS[$].id,c),I=`${g}_${e}_${c?"en":"th"}`,L=f._recentSignatures.get(I)||[],k=new Set;L.forEach(ee=>{ee.leadId&&k.add(ee.leadId),(ee.midIds||[]).forEach(re=>k.add(re)),ee.endId&&k.add(ee.endId)});const x=new Set,C=(ee,re)=>f._pickNonRepeating(ee,x,k,D,o,re),T=!!t.is_finished,H=t.is_started!==void 0?!!t.is_started:T||t.results&&t.results.some(ee=>ee.points>0),z=H&&!T,U=T||d?"net_points":"points",Q=ee=>!i||!i.squads?null:i.squads[`${ee}_${e}`]||null,W=ee=>{const re=Q(ee);return!re||!re.starting?null:re.starting.filter(le=>!!le.not_played_yet).length},P=ee=>{const re=Q(ee);if(!re||!re.starting)return[];const le=re.starting.map(ie=>Number(ie.raw_points!==void 0?ie.raw_points:ie.points)||0);return(re.chip==="bboost"||re.chip==="bench_boost")&&re.bench&&le.push(...re.bench.map(ie=>Number(ie.raw_points!==void 0?ie.raw_points:ie.points)||0)),le.sort((ie,pe)=>pe-ie)},u=(ee,re)=>{const le=P(ee),ie=P(re);for(let pe=0;pe<Math.max(le.length,ie.length);pe++){const ke=le[pe]!==void 0?le[pe]:-1/0,ye=ie[pe]!==void 0?ie[pe]:-1/0;if(ke!==ye)return ye-ke}return 0},N=[...t.results].map(ee=>({...ee,team_name:l(ee.team_name),player_name:l(ee.player_name),captain:l(ee.captain)})).sort((ee,re)=>{const le=re[U]-ee[U]||re.net_points-ee.net_points||re.points-ee.points;return le!==0?le:n?u(ee.entry_id,re.entry_id):0});if(!H){const ee={};let re=0,le=0;N.forEach(ke=>{const ye=(ke.captain||"-").replace(/\s*\(C\)/gi,"").trim();ye&&ye!=="-"&&(ee[ye]=(ee[ye]||0)+1),ke.chip&&ke.chip!=="-"&&re++,ke.hits>0&&le++});const ie=Object.entries(ee).sort((ke,ye)=>ye[1]-ke[1])[0],pe=c?f._buildEnglishPreMatch({gwNumber:e,topCapEntry:ie,chipCnt:re,hitCnt:le,persona:v,pick:C}):f._buildThaiPreMatch({gwNumber:e,topCapEntry:ie,chipCnt:re,hitCnt:le,persona:v,pick:C});return f._recordSignature(I,{personaId:v.id,leadId:`pre_${v.id}`,midIds:[],endId:""}),{text:pe,personaId:v.id,personaLabel:v.label,personaTone:v.tone}}const w=ee=>p&&p.some(re=>Number(re)===Number(ee)),b=N.filter(ee=>!w(ee.entry_id)),_=N[0],S=w(_.entry_id)&&b.length>0&&_[U]>b[0][U],E=b.length>0?b[0]:_,A=b.length>1?b[1]:N[1],F=N[N.length-1],q=Number(E[U])||0,j=A&&Number(A[U])||0,R=q-j;let G=(b.length>0?b:N).filter(ee=>Number(ee[U])===q);if(n&&G.length>1){const ee=G[0];G=G.filter(re=>u(re.entry_id,ee.entry_id)===0)}const K=G.length>1,B=(E.captain||"-").replace(/\s*\(C\)/gi,"").trim(),Y=q>=100,X=(E.chip||"").toLowerCase(),M=Math.round(N.reduce((ee,re)=>ee+(Number(re[U])||0),0)/Math.max(1,N.length)),V=A?A.team_name:c?"second place":"อันดับสอง",Z=W(E.entry_id),O=A?W(A.entry_id):0;let ae=null,de=null;const oe=Q(E.entry_id);if(oe&&oe.starting&&oe.starting.length>0){const ee=[...oe.starting].sort((re,le)=>(Number(le.points)||0)-(Number(re.points)||0));ee[0]&&Number(ee[0].points)>=10&&(ae={name:l(ee[0].name),pts:Number(ee[0].points),isCap:!!ee[0].is_captain}),ee[1]&&Number(ee[1].points)>=10&&(de={name:l(ee[1].name),pts:Number(ee[1].points)})}let ue=1;if(i&&i.gameweeks&&Number(e)>1)for(let ee=Number(e)-1;ee>=1;ee--){const re=i.gameweeks[String(ee)];if(!re||!re.results||re.results.length===0)break;const le=re.is_finished||d?"net_points":"points",ie=re.results.filter(pe=>!w(pe.entry_id)).sort((pe,ke)=>ke[le]-pe[le]);if(ie.length>0){const pe=ie[0][le];if(ie.filter(ye=>ye[le]===pe).some(ye=>Number(ye.entry_id)===Number(E.entry_id)))ue++;else break}else break}const _e=ue>=2,ce=f._extractSignals({gwNumber:e,sorted:N,top:E,second:A,bottom:F,topPts:q,secondPts:j,diff:R,scoreKey:U,isLive:z,isFinished:T,leagueData:i,getSquad:Q,clean:l,avgScore:M,extraContext:m}),J=c?f._buildEnglishCommentary({gwNumber:e,leagueName:a,persona:v,pick:C,clean:l,getSquad:Q,sorted:N,eligibleSorted:b,top:E,second:A,bottom:F,topPts:q,secondPts:j,diff:R,scoreKey:U,isLive:z,isFinished:T,isJoint:K,winners:G,isCentury:Y,chip:X,captName:B,avgScore:M,secName:V,topRem:Z,secRem:O,heroPlayer:ae,secondHero:de,winStreak:ue,isStreak:_e,isTopNonPrize:S,overallTop:_,signals:ce,baseHash:D,stepOffset:o}):f._buildThaiCommentary({gwNumber:e,leagueName:a,persona:v,pick:C,clean:l,getSquad:Q,sorted:N,eligibleSorted:b,top:E,second:A,bottom:F,topPts:q,secondPts:j,diff:R,scoreKey:U,isLive:z,isFinished:T,isJoint:K,winners:G,isCentury:Y,chip:X,captName:B,avgScore:M,secName:V,topRem:Z,secRem:O,heroPlayer:ae,secondHero:de,winStreak:ue,isStreak:_e,isTopNonPrize:S,overallTop:_,signals:ce,baseHash:D,stepOffset:o});return f._recordSignature(I,{personaId:v.id,leadId:J.leadId,midIds:J.midIds,endId:J.endId}),{text:J.text,personaId:v.id,personaLabel:v.label,personaTone:v.tone}}static _recordSignature(e,t){const a=f._recentSignatures.get(e)||[];a.push(t),a.length>8&&a.shift(),f._recentSignatures.set(e,a)}static _extractSignals({gwNumber:e,sorted:t,bottom:a,scoreKey:r,isLive:p,isFinished:i,leagueData:d,getSquad:n,clean:c,avgScore:m,extraContext:s}){const o={};t.forEach(b=>{const _=(b.captain||"-").replace(/\s*\(C\)/gi,"").trim();_&&_!=="-"&&(o[_]=(o[_]||0)+1)});const l=Object.entries(o).sort((b,_)=>_[1]-b[1])[0]||null,g=t.slice(0,8).filter(b=>{const _=(b.captain||"-").replace(/\s*\(C\)/gi,"").trim();return _&&_!=="-"&&(o[_]||0)<=2}),y={},D=[],h=[],$=[],v={},I={},L=[];t.forEach(b=>{const _=n(b.entry_id);if(!_||!_.starting)return;if(Array.isArray(_.auto_subs)&&_.auto_subs.length>0){const j=new Set(_.auto_subs.map(K=>Number(K.element_in))),R=_.starting.filter(K=>j.has(Number(K.id))),G=R.reduce((K,B)=>K+(Number(B.points)||0),0);G>=5&&R[0]&&D.push({team:b.team_name,player:c(R[0].name),pts:G})}const S=_.starting.find(j=>j.is_captain),E=_.starting.concat(_.bench||[]).find(j=>j.is_vice);if(S&&E&&!S.not_played_yet&&!E.not_played_yet){const j=Number(S.raw_points!==void 0?S.raw_points:Math.floor((Number(S.points)||0)/(Number(S.multiplier)||2))),R=Number(E.raw_points!==void 0?E.raw_points:Number(E.points)||0),G=Number(S.minutes||0);(i||G>0)&&R-j>=6&&$.push({team:b.team_name,capName:c(S.name),capRaw:j,vcName:c(E.name),vcRaw:R,lostPts:(R-j)*((Number(S.multiplier)||2)-1)})}let A=0,F=0,q=0;_.starting.forEach(j=>{const R=Number(j.raw_points!==void 0?j.raw_points:j.is_captain?Math.floor((Number(j.points)||0)/(Number(j.multiplier)||2)):Number(j.points)||0),G=c(j.name);G&&(!I[G]||I[G].pts<R?I[G]={name:G,pts:R,owners:[b.team_name]}:I[G].pts===R&&!I[G].owners.includes(b.team_name)&&I[G].owners.push(b.team_name)),(Number(j.provisional_bonus)||0)>=2&&G&&(y[G]||(y[G]={name:G,bonus:Number(j.provisional_bonus),owners:[]}),y[G].owners.includes(b.team_name)||y[G].owners.push(b.team_name)),((Number(j.goals_scored)||0)>=2||(Number(j.goals_scored)||0)+(Number(j.assists)||0)>=2)&&G&&(v[G]||(v[G]={name:G,goals:Number(j.goals_scored)||0,assists:Number(j.assists)||0,pts:R,owners:[]}),v[G].owners.includes(b.team_name)||v[G].owners.push(b.team_name)),((Number(j.points)||0)<0||R<0||(Number(j.red_cards)||0)>0||(Number(j.penalties_missed)||0)>0)&&h.push({team:b.team_name,player:G,pts:Number(j.points)||0,isCap:!!j.is_captain,isRed:(Number(j.red_cards)||0)>0,isPenMiss:(Number(j.penalties_missed)||0)>0}),["GKP","DEF","1","2"].includes(String(j.pos||j.position||j.element_type))&&(A+=Number(j.points)||0,!j.not_played_yet&&Number(j.minutes||0)>0&&F++,q+=Number(j.minutes||0))}),L.push({team:b.team_name,defPts:A,playedCount:F,totalMins:q})}),L.sort((b,_)=>_.defPts-b.defPts);const k=L.filter(b=>i||b.playedCount>=3&&b.totalMins>=180),x=L[0]||null,C=k.length>0?k[k.length-1]:null,T=Object.values(I).sort((b,_)=>_.pts-b.pts)[0]||null,H=Object.values(y).sort((b,_)=>_.bonus-b.bonus||_.owners.length-b.owners.length)[0]||null,z=Object.values(v).sort((b,_)=>_.goals-b.goals||_.pts-b.pts)[0]||null,U=[...t].filter(b=>(b.transfers_net_impact||0)>=6).sort((b,_)=>(_.transfers_net_impact||0)-(b.transfers_net_impact||0))[0]||null,Q=[...t].filter(b=>(b.transfers_net_impact||0)<=-6).sort((b,_)=>(b.transfers_net_impact||0)-(_.transfers_net_impact||0))[0]||null,W=[...t].filter(b=>(b.bench_points||0)>=10&&!["bboost","bench_boost"].includes((b.chip||"").toLowerCase())).sort((b,_)=>(_.bench_points||0)-(b.bench_points||0))[0]||null,P=t.filter(b=>b.hits>0).sort((b,_)=>_.hits-b.hits),u=t.filter(b=>b.chip&&!["","-","none"].includes(String(b.chip).toLowerCase()));let N=null;if(d&&d.teams&&t.length>=6){const b=[...d.teams].sort((_,S)=>(S.total_points||0)-(_.total_points||0));N=t.slice(0,2).find(_=>b.findIndex(E=>Number(E.entry_id)===Number(_.entry_id))+1>Math.floor(b.length/2))||null}const w=s&&s.overallContext?s.overallContext:null;return{capCountMap:o,mostPopCap:l,diffCapTeams:g,topProvBonus:H,topGoalHero:z,autoSubHeroes:D,redCardVictims:h,vcRegrets:$,bestDef:x,worstDef:C,sortedBestPlayer:T,txMaster:U,txBust:Q,benchKing:W,hitTakers:P,chipUsers:u,darkHorse:N,overallContext:w,bottom:a,avgScore:m}}static _buildThaiPreMatch({gwNumber:e,topCapEntry:t,chipCnt:a,hitCnt:r,persona:p,pick:i}){const d=t?`กัปตันมหาชนรอบนี้เทไปที่ ${t[0]} (${t[1]} ทีม)`:"ต่างคนต่างแยกสายเลือกกัปตันวัดใจ",n=a>0?`มีกุนซือเปิดชิปตั้งแต่ก่อนคิกออฟ ${a} ทีม`:r>0?`มีทีมยอมแลกแต้มลบเสริมทัพ ${r} ทีม`:"ทุกทีมเก็บแต้มลบไว้มิดชิดไม่มีใครยอมเสียฟรี",c={broadcaster:[f._c("pre_th_b1","pre",`สัญญาณสดก่อนคิกออฟ Gameweek ${e}! ${d} และ${n} แฟนแฟนตาซีเตรียมลุ้นระทึกตั้งแต่คู่เปิดสนามได้เลย!`),f._c("pre_th_b2","pre",`เข้าสู่โค้งนับถอยหลัง GW ${e} อย่างเป็นทางการ ${d} ขณะที่${n} ใครจะออกตัวแรงตั้งแต่วันแรก เดี๋ยวรู้กันบนสนามจริง!`),f._c("pre_th_b3","pre",`รายชื่อทั้ง 11 ตัวจริงของทุกลีกพร้อมรบใน Gameweek ${e} แล้ว ${d} ส่วน${n} จับตาดูหมากเด็ดในคู่แรกให้ดี!`)],columnist:[f._c("pre_th_c1","pre",`ม่านแห่ง Gameweek ${e} กำลังจะเปิดฉาก ${d} และ${n} สัปดาห์นี้ไม่ใช่แค่เรื่องของตัวเต็ง แต่เป็นบททดสอบความนิ่งของคนจัดทัพ`),f._c("pre_th_c2","pre",`ก่อนเสียงนกหวีดแรกของ GW ${e} จะดังขึ้น ${d} ขณะที่${n} ตัวเลขบนกระดาษสวยแค่ไหน สุดท้ายต้องวัดกันที่ 90 นาทีในสนาม`),f._c("pre_th_c3","pre",`หน้ากระดานหมากรุก GW ${e} วางตัวครบทุกตำแหน่ง ${d} และ${n} รอดูว่าใครอ่านเกมขาดและใครจะเดินหลงทาง`)],analyst:[f._c("pre_th_a1","pre",`สรุปภาพรวมหลังเดดไลน์ GW ${e}: ${d} และ${n} จุดชี้วัดรอบนี้อยู่ที่ผลงานของตัวต่างนอกกระแส`),f._c("pre_th_a2","pre",`เช็กโครงสร้างขุมกำลัง GW ${e} เรียบร้อย ${d} พร้อมข้อมูลเสริมว่า${n} คู่ไหนจะพลิกค่าเฉลี่ยลีกต้องติดตามจากตัวทีเด็ดที่ถือครองน้อย`),f._c("pre_th_a3","pre",`เข้าสู่ช่วงพรีแมตช์ GW ${e} ${d} และ${n} ทีมที่กัปตันตรงกันจะต้องไปตัดสินกันที่กองหลังและม้านั่งสำรอง`)],banter:[f._c("pre_th_x1","pre",`ระฆังเดดไลน์ GW ${e} ปิดฉากแล้ว! ${d} แถม${n} คืนนี้เตรียมป๊อปคอร์นรอได้เลย มีคนหน้ามืดคาสนามแน่นอน!`),f._c("pre_th_x2","pre",`จัดตัวเสร็จแล้วก็แยกย้ายไปสวดมนต์สำหรับ GW ${e}! ${d} และ${n} ใครกัปตันบอดเตรียมโดนล้อในกลุ่มแชทจนถึงเช้า!`),f._c("pre_th_x3","pre",`เปิดโผความบันเทิง GW ${e} ครบทุกทีม! ${d} ส่วน${n} ใครมือลั่นนาทีสุดท้าย เดี๋ยวสนามจริงตบหน้าสั่งสอนให้เอง!`)]};return i(c[p.id]||c.broadcaster,101).text}static _buildEnglishPreMatch({gwNumber:e,topCapEntry:t,chipCnt:a,hitCnt:r,persona:p,pick:i}){const d=t?`${t[0]} takes the popular armband (${t[1]} teams)`:"captaincy choices are split across the board",n=a>0?`with ${a} managers firing chips right out of the gate`:r>0?`while ${r} managers took point hits to reshape their squads`:"with zero point hits taken across the league",c={broadcaster:[f._c("pre_en_b1","pre",`Welcome to Gameweek ${e} kickoff coverage! ${d}, ${n}. Strap in for every goal, bonus swing, and late twist!`),f._c("pre_en_b2","pre",`Teams are locked in for GW ${e}! ${d}, ${n}. First whistle is moments away and the live table is poised to move!`),f._c("pre_en_b3","pre",`All squads are set for Gameweek ${e}! ${d}, ${n}. Keep an eye on those early differentials!`)],columnist:[f._c("pre_en_c1","pre",`The curtain rises on Gameweek ${e}. ${d}, ${n}. Conviction meets reality the moment the opening ball is kicked.`),f._c("pre_en_c2","pre",`Lineups are sealed for GW ${e}. ${d}, ${n}. Reputations mean nothing once ninety minutes begin.`),f._c("pre_en_c3","pre",`A fascinating tactical puzzle awaits in Gameweek ${e}: ${d}, ${n}.`)],analyst:[f._c("pre_en_a1","pre",`GW ${e} pre-match readout: ${d}, ${n}. When armbands cluster, rank movement shifts onto differential slots and defensive returns.`),f._c("pre_en_a2","pre",`Deadline lock complete for GW ${e}. ${d}, ${n}. Expect tight early variance until late-fixture assets feature.`),f._c("pre_en_a3","pre",`Pre-kickoff telemetry for GW ${e}: ${d}, ${n}. Watch the low-owned picks to decide the weekly margin.`)],banter:[f._c("pre_en_x1","pre",`Deadline locked for GW ${e} — no take-backs now! ${d}, ${n}. Half the league is already sweating before kickoff!`),f._c("pre_en_x2","pre",`Pencils down for Gameweek ${e}! ${d}, ${n}. Whoever kneejerked five minutes before lock is about to learn a painful lesson!`),f._c("pre_en_x3","pre",`Lineups are official for GW ${e}! ${d}, ${n}. Group chat excuses start in 3, 2, 1!`)]};return i(c[p.id]||c.broadcaster,102).text}static _buildThaiCommentary(e){const{gwNumber:t,persona:a,pick:r,clean:p,getSquad:i,sorted:d,top:n,second:c,bottom:m,topPts:s,secondPts:o,diff:l,scoreKey:g,isLive:y,isFinished:D,isJoint:h,winners:$,isCentury:v,chip:I,captName:L,avgScore:k,secName:x,topRem:C,secRem:T,heroPlayer:H,secondHero:z,winStreak:U,isStreak:Q,isTopNonPrize:W,overallTop:P,signals:u,baseHash:N,stepOffset:w}=e,b=a.id,_=H?z?`${H.name} (${H.pts} pts) กับ ${z.name} (${z.pts} pts)`:`${H.name} (${H.pts} pts)`:`กัปตัน ${L}`,S=B=>B[b]||B.broadcaster;let E=[];if(y)if(W){const B=P[g];E=S({broadcaster:[f._c("ld_th_np_b1","nonprize",`คะแนนดิบสูงสุดเวลานี้เป็นของทีมร่วมสนุก "${P.team_name}" (${B} pts) ส่วนโควตาชิงรางวัลมี "${n.team_name}" (${s} pts) นำ "${x}" อยู่ ${l} แต้ม`),f._c("ld_th_np_b2","nonprize",`"${P.team_name}" ออกตัวแรงแต้มสดพุ่งถึง ${B} คะแนน แต่ผู้นำฝั่งชิงรางวัลสดๆ คือ "${n.team_name}" (${s} pts)!`)],columnist:[f._c("ld_th_np_c1","nonprize",`"${P.team_name}" ลงสนามไร้ความกดดันแต้มทะยานไป ${B} แต้ม เปิดเวทีให้ "${n.team_name}" (${s} pts) ถือธงนำฝั่งชิงรางวัล GW ${t}`),f._c("ld_th_np_c2","nonprize",`ในขณะที่ "${P.team_name}" โชว์ฟอร์มสะสม ${B} แต้มในฐานะทีมร่วมสนุก การแย่งตำแหน่งบนโพเดียมจริงมี "${n.team_name}" (${s} pts) ยืนจ่าฝูง`)],analyst:[f._c("ld_th_np_a1","nonprize",`ทีมร่วมสนุก "${P.team_name}" ทำคะแนนสดสูงสุดที่ ${B} pts ส่วนอันดับ 1 สายเงินรางวัลคือ "${n.team_name}" (${s} pts, นำอันดับ 2 อยู่ +${l})`),f._c("ld_th_np_a2","nonprize",`ตารางคะแนนชิงรางวัล GW ${t} นำโดย "${n.team_name}" (${s} pts) ขณะที่สกอร์รวมสูงสุดของสัปดาห์อยู่ที่ "${P.team_name}" (${B} pts)`)],banter:[f._c("ld_th_np_x1","nonprize",`เล่นขำๆ แต่ยิงโหดเฉย! "${P.team_name}" กดไป ${B} แต้มสด ปล่อยให้พวกชิงตังค์นำโดย "${n.team_name}" (${s} pts) บี้กันต่อ!`),f._c("ld_th_np_x2","nonprize",`ทีมรับเชิญอย่าง "${P.team_name}" แอบป่วนหัวตารางที่ ${B} แต้ม ส่วนตัวตึงสายรางวัลยกให้ "${n.team_name}" (${s} pts) ที่กำลังนำอยู่!`)]})}else l<=0||h||s===o?T>C&&C!==null?E=S({broadcaster:[f._c("ld_th_tc_b1",["tie","chasers_left"],`หัวตารางคะแนนสดเสมอกันที่ ${s} แต้ม! "${n.team_name}" กับ "${x}" กอดคอกันแน่น แต่ฝั่ง "${x}" ยังมีตัวรอลงสนามอีก ${T} คน`),f._c("ld_th_tc_b2",["tie","chasers_left"],`แต้มสดชนกันเป๊ะที่ ${s} คะแนนระหว่าง "${n.team_name}" และ "${x}" จุดเปลี่ยนอยู่ที่ "${x}" เหลือตัวเตะมากกว่า (${T} ต่อ ${C} คน)`)],columnist:[f._c("ld_th_tc_c1",["tie","chasers_left"],`ความสมดุลชั่วคราวที่ ${s} แต้มระหว่าง "${n.team_name}" และ "${x}" อาจอยู่ไม่นาน เมื่อ "${x}" ยังเหลือขุมกำลังรอลงเล่นถึง ${T} ตำแหน่ง`),f._c("ld_th_tc_c2",["tie","chasers_left"],`แม้คะแนนสดจะเท่ากันที่ ${s} แต้ม แต่ความได้เปรียบเชิงขุมกำลังเทไปฝั่ง "${x}" ที่เหลือตัวเล่นอีก ${T} คน`)],analyst:[f._c("ld_th_tc_a1",["tie","chasers_left"],`คะแนนสดเสมอกันที่ ${s} pts แต่ "${x}" ได้เปรียบด้านจำนวนตัวลงสนามที่เหลือ (${T} vs ${C} คน) มีโอกาสขยับแซงสูงกว่า`),f._c("ld_th_tc_a2",["tie","chasers_left"],`สถานะ Tie ที่ ${s} คะแนน: โมเมนตัมอยู่ฝั่ง "${x}" เพราะยังมีผู้เล่นที่ยังไม่คิกออฟอีก ${T} ราย`)],banter:[f._c("ld_th_tc_x1",["tie","chasers_left"],`แต้มชนกันเป๊ะที่ ${s} คะแนน! แต่ "${x}" นั่งยิ้มมุมปากเพราะยังเหลือตัวปล่อยของอีก ${T} คน เตรียมแซงเข้าป้ายได้เลย!`),f._c("ld_th_tc_x2",["tie","chasers_left"],`เสมอกันอยู่ ${s} แต้มก็จริง แต่ "${n.team_name}" เหลือตัวแค่ ${C} คน เทียบกับ ${T} คนของ "${x}" งานนี้มีเสียว!`)]}):E=S({broadcaster:[f._c("ld_th_tie_b1","tie",`เบียดกันแบบหายใจรดต้นคอที่ ${s} แต้ม! "${n.team_name}" กับ "${x}" เกาะจ่าฝูงสดร่วมกัน รอตัดสินกันต่อในคู่ที่เหลือ`),f._c("ld_th_tie_b2","tie",`ยังไม่มีใครยอมหลีกทาง! "${n.team_name}" และ "${x}" ยืนจ่าฝูงสดคู่กันที่ ${s} แต้มใน GW ${t}`)],columnist:[f._c("ld_th_tie_c1","tie",`บนยอดตาราง GW ${t} มีชื่อของ "${n.team_name}" และ "${x}" ยืนเคียงคู่กันที่ ${s} แต้ม — เกมนี้ยังเปิดกว้างเต็มที่`),f._c("ld_th_tie_c2","tie",`กินกันไม่ลงแม้แต่คะแนนเดียวที่ ${s} แต้มระหว่าง "${n.team_name}" กับ "${x}" ทุกจังหวะจากนี้คือตัวตัดสิน`)],analyst:[f._c("ld_th_tie_a1","tie",`จ่าฝูงสดเสมอกันที่ ${s} pts ("${n.team_name}" และ "${x}") ต้องติดตามตัวต่างและแต้มโบนัสในนัดที่เหลือ`),f._c("ld_th_tie_a2","tie",`สมดุลหัวตารางที่ ${s} คะแนน แนะนำเปิดเทียบ 1v1 เพื่อเช็กว่าใครถือไพ่ตัวต่างเหนือกว่า`)],banter:[f._c("ld_th_tie_x1","tie",`กอดคอกันแน่นที่ ${s} แต้ม! "${n.team_name}" กับ "${x}" ไม่มีใครยอมใคร คู่ดึกเดี๋ยวรู้เลยใครจะร่วงก่อน!`),f._c("ld_th_tie_x2","tie",`แต้มเท่ากันที่ ${s} คะแนนแบบนี้ มีหวังนั่งลุ้นทุกใบเหลืองทุกแอสซิสต์กันจนตาค้าง!`)]}):T>C&&C!==null?E=S({broadcaster:[f._c("ld_th_lv_b1","chasers_left",`เกมสดกำลังเข้มข้น! "${n.team_name}" นำอยู่ ${s} แต้ม เหนือ "${x}" ${l} แต้ม แต่ฝ่ายตามหลังยังมีนักเตะรอลงสนามถึง ${T} คน (จ่าฝูงเหลือ ${C} คน)`),f._c("ld_th_lv_b2","chasers_left",`ยังไม่การันตีแชมป์! "${n.team_name}" ถือแต้มสด ${s} แต้มนำ "${x}" (${o} pts) ทว่าผู้ตามยังเหลือกระสุนอีก ${T} นัดในคู่ดึก!`)],columnist:[f._c("ld_th_lv_c1","chasers_left",`บัลลังก์จ่าฝูงสดของ "${n.team_name}" (${s} pts) ยังสั่นคลอน เพราะระยะห่าง ${l} แต้มอาจไม่พอรับมือกับ ${T} ตัวจริงที่เหลือของ "${x}"`),f._c("ld_th_lv_c2","chasers_left",`"${n.team_name}" ออกตัวแรงเก็บ ${s} แต้มนำหน้าก็จริง แต่ฝ่ายไล่ล่าอย่าง "${x}" กุมความได้เปรียบเรื่องตัวเหลือ (${T} ต่อ ${C} คน)`)],analyst:[f._c("ld_th_lv_a1","chasers_left",`สถานะสด: "${n.team_name}" นำ "${x}" อยู่ +${l} แต้ม (${s} vs ${o}) แต่เสียเปรียบจำนวนนักเตะที่ยังไม่เตะ ${C} ต่อ ${T} คน`),f._c("ld_th_lv_a2","chasers_left",`ช่องว่าง ${l} แต้มของ "${n.team_name}" (${s} pts) กำลังถูกท้าทายโดย "${x}" ที่มีผู้เล่นรอลงสนามอีก ${T} ราย`)],banter:[f._c("ld_th_lv_x1","chasers_left",`เก้าอี้ร้อนฉ่าแล้วโว้ย! "${n.team_name}" นำอยู่ ${l} แต้ม (${s} pts) แต่ตัวเตะใกล้หมดมือเหลือ ${C} คน ส่วน "${x}" ยังซ่อนไพ่อีกตั้ง ${T} ใบในคู่ดึก!`),f._c("ld_th_lv_x2","chasers_left",`อย่าเพิ่งรีบเดินแอ็ค! "${n.team_name}" (${s} pts) นำ "${x}" แค่ ${l} แต้ม แต่ผู้ตามยังมีตัวรอปล่อยของอีก ${T} คน ระวังโดนปาดหน้าเค้กคาจอ!`)]}):C!==null&&C>=T&&C>0?E=S({broadcaster:[f._c("ld_th_cr_b1","leader_cruising",`"${n.team_name}" กุมความได้เปรียบเต็มมือ! นำสดที่ ${s} แต้ม (เหนือ "${x}" ${l} แต้ม) แถมยังมีตัวเตะรอลงสนามอีก ${C} คน!`),f._c("ld_th_cr_b2","leader_cruising",`ฟอร์มสดไหลลื่น! "${n.team_name}" ขึ้นนำ "${x}" อยู่ ${l} แต้ม และยังเหลือกำลังเสริมในมืออีก ${C} ตำแหน่ง`)],columnist:[f._c("ld_th_cr_c1","leader_cruising",`ไม่เพียงนำในตารางสดที่ ${s} แต้ม (+${l} เหนือ "${x}") แต่ "${n.team_name}" ยังถือไพ่เหนือกว่าด้วยตัวจริงที่รอลงอีก ${C} คน`),f._c("ld_th_cr_c2","leader_cruising",`"${n.team_name}" ยึดทั้งคะแนนนำ (${s} pts) และความได้เปรียบด้านจำนวนผู้เล่น (${C} vs ${T} คน) ยากที่คู่แข่งจะไล่ทัน`)],analyst:[f._c("ld_th_cr_a1","leader_cruising",`โอกาสคว้าแชมป์สัปดาห์ของ "${n.team_name}" สูงมาก: นำ ${l} แต้ม (${s} vs ${o}) พร้อมจำนวนตัวเหลือมากกว่า (${C} ต่อ ${T})`),f._c("ld_th_cr_a2","leader_cruising",`สถานการณ์เอื้อต่อ "${n.team_name}" เต็มรูปแบบ — สกอร์นำ +${l} และเหลือ ${C} ตัวลงสนาม`)],banter:[f._c("ld_th_cr_x1","leader_cruising",`กินเต็มข้อลอยลำ! "${n.team_name}" นำไปแล้ว ${s} แต้ม (+${l}) แถมยังมีตัวเหลือให้กดแต้มเพิ่มอีก ${C} คน คู่แข่งเตรียมทำใจได้เลย!`),f._c("ld_th_cr_x2","leader_cruising",`เครื่องติดเทอร์โบไม่รอใคร! "${n.team_name}" นำ "${x}" อยู่ ${l} แต้ม แล้วยังเหลือตัวรอลงอีก ${C} คน เดินยืดอกรอรับถ้วยได้เลย!`)]}):C===0&&T===0&&C!==null?E=S({broadcaster:[f._c("ld_th_dn_b1","bps_wait",`ตัวจริงของคู่ชิงลงสนามครบ 11 คนเรียบร้อย! "${n.team_name}" นำ "${x}" อยู่ ${l} แต้ม (${s} vs ${o}) เหลือลุ้นเพียงคะแนนโบนัสและออโต้ซับชี้ขาด`),f._c("ld_th_dn_b2","bps_wait",`ปิดจ็อบครบทุกตำแหน่งในสนาม! "${n.team_name}" ถือไพ่เหนือกว่า "${x}" อยู่ ${l} แต้ม (${s} pts) รอแค่ผลโบนัสทางการเคาะปิดเกม`)],columnist:[f._c("ld_th_dn_c1","bps_wait",`ไพ่ทุกใบของ "${n.team_name}" (${s} pts) และ "${x}" (${o} pts) ถูกเปิดบนโต๊ะหมดแล้ว เหลือเพียงบทสรุปจากโบนัส BPS`),f._c("ld_th_dn_c2","bps_wait",`ครบ 11 ตำแหน่งทั้งสองฝั่งกับระยะห่าง ${l} แต้ม — ชะตากรรมของ GW ${t} ขึ้นอยู่กับตัวเลขโบนัสทางการเท่านั้น`)],analyst:[f._c("ld_th_dn_a1","bps_wait",`ทั้ง "${n.team_name}" และ "${x}" ไม่มีผู้เล่นเหลือค้างแข่ง ช่องว่าง ${l} แต้มรอการยืนยันโบนัสและออโต้ซับสุดท้าย`),f._c("ld_th_dn_a2","bps_wait",`จบการลงสนามครบ 100% ของคู่จ่าฝูง: "${n.team_name}" (${s}) นำ "${x}" (${o}) รอประมวลผลทางการ`)],banter:[f._c("ld_th_dn_x1","bps_wait",`ตัวเล่นหมดเกลี้ยงทั้งคู่! "${n.team_name}" นำอยู่ ${l} แต้ม ตอนนี้นั่งจ้องจอภาวนาให้กรรมการไม่ริบโบนัสคืนอย่างเดียว!`),f._c("ld_th_dn_x2","bps_wait",`ลงครบหมดแล้วจ้า! "${n.team_name}" ตุนไว้ ${s} แต้ม เหนือ "${x}" ${l} แต้ม ถ้าระบบไม่หักมุมก็เตรียมเฮได้เลย!`)]}):l<=2?E=S({broadcaster:[f._c("ld_th_cl_b1","nailbiter",`เฉือนกันระดับเส้นยาแดง! "${n.team_name}" (${s} pts) นำสด "${x}" (${o} pts) เพียง ${l} แต้ม แค่ประตูเดียวหรือโบนัสเปลี่ยนฝั่งก็พลิกทันที!`),f._c("ld_th_cl_b2","nailbiter",`เกมตึงสุดขีด! "${n.team_name}" เกาะจ่าฝูงสดห่าง "${x}" แค่ ${l} แต้ม (${s} ต่อ ${o} pts) ลุ้นกันลูกต่อลูก`)],columnist:[f._c("ld_th_cl_c1","nailbiter",`ระยะห่างเพียง ${l} คะแนนระหว่าง "${n.team_name}" และ "${x}" สะท้อนความสูสีระดับห้าดาวของเกมวีคนี้`),f._c("ld_th_cl_c2","nailbiter",`บัลลังก์สดใน GW ${t} แขวนอยู่บนเส้นด้ายแค่ ${l} แต้ม ("${n.team_name}" ${s} vs "${x}" ${o})`)],analyst:[f._c("ld_th_cl_a1","nailbiter",`Margin แค่ ${l} แต้ม (${s} vs ${o}) อยู่ในระยะพลิกได้จากโบนัสหรือคลีนชีตเดียว`),f._c("ld_th_cl_a2","nailbiter",`ส่วนต่าง ${l} pts ระหว่างอันดับ 1-2 ถือว่าบางมาก ความเสี่ยงสลับตำแหน่งสูงทุกนาที`)],banter:[f._c("ld_th_cl_x1","nailbiter",`หายใจรดต้นคอกันแค่ ${l} แต้ม! "${n.team_name}" กับ "${x}" บี้กันแบบกระพริบตาไม่ได้แม้แต่วินาทีเดียว!`),f._c("ld_th_cl_x2","nailbiter",`ห่างกันจึ๋งเดียว ${l} แต้ม! ใครโดนใบเหลืองท้ายเกมมีหวังหลังหักตกจ่าฝูงคาจอ!`)]}):l>=15?E=S({broadcaster:[f._c("ld_th_bl_b1","blowout",`ฉีกหนีตั้งแต่ไก่โห่! "${n.team_name}" พาทีมโกย ${s} แต้มสด นำ "${x}" ขาดลอย ${l} แต้ม โดยได้ ${_} ช่วยแบกเต็มกำลัง`),f._c("ld_th_bl_b2","blowout",`"${n.team_name}" ฟอร์มร้อนเกินต้าน กดไปแล้ว ${s} แต้มสด ทิ้งห่างอันดับสองอย่าง "${x}" ถึง ${l} แต้ม`)],columnist:[f._c("ld_th_bl_c1","blowout",`การคุมเกมที่เด็ดขาดพา "${n.team_name}" พุ่งสู่ ${s} แต้มสด สร้างระยะปลอดภัยเหนือ "${x}" ถึง ${l} แต้ม`),f._c("ld_th_bl_c2","blowout",`ในขณะที่ทีมอื่นยังไล่ตามจังหวะ "${n.team_name}" ก็ทิ้งขาดไป ${l} แต้มแล้วด้วยแรงขับเคลื่อนจาก ${_}`)],analyst:[f._c("ld_th_bl_a1","blowout",`ระยะห่าง +${l} แต้มของ "${n.team_name}" (${s} vs ${o}) มาจากจุดแข็งของ ${_} ที่สร้างผลต่างชัดเจน`),f._c("ld_th_bl_a2","blowout",`"${n.team_name}" ทำแต้มสดทิ้งค่าเฉลี่ยลีกไปไกล แตะ ${s} pts นำอันดับ 2 ถึง ${l} คะแนน`)],banter:[f._c("ld_th_bl_x1","blowout",`โหดเกินไปแล้ว! "${n.team_name}" ฟาดแต้มสดไป ${s} แต้ม ทิ้ง "${x}" ขาดลอย ${l} แต้ม เล่นเอาคู่แข่งเริ่มท้อใจตั้งแต่ยังไม่จบวีค!`),f._c("ld_th_bl_x2","blowout",`พับสนามบุกอยู่ทีมเดียว! "${n.team_name}" กดไป ${s} แต้ม นำห่าง ${l} แต้ม สัปดาห์นี้ขอเดินแอ็คหล่อล่วงหน้าเลยละกัน!`)]}):E=S({broadcaster:[f._c("ld_th_st_b1","lead_std",`"${n.team_name}" ขึ้นแท่นผู้นำสด GW ${t} ที่ ${s} แต้ม นำ "${x}" (${o} pts) อยู่ ${l} แต้ม โดยมี ${_} เป็นกำลังหลัก`),f._c("ld_th_st_b2","lead_std",`จ่าฝูงชั่วคราวเป็นของ "${n.team_name}" ด้วยสกอร์สด ${s} แต้ม ทิ้งระยะจาก "${x}" ${l} แต้ม`)],columnist:[f._c("ld_th_st_c1","lead_std",`จังหวะเกมสดเทมาทาง "${n.team_name}" ที่เก็บไปแล้ว ${s} แต้ม นำ "${x}" อยู่ ${l} แต้มอย่างมั่นคง`),f._c("ld_th_st_c2","lead_std",`"${n.team_name}" วางหมากได้ลงตัวใน GW ${t} นำจ่าฝูงสดที่ ${s} แต้ม จากผลงานเด่นของ ${_}`)],analyst:[f._c("ld_th_st_a1","lead_std",`สรุปตารางสด: "${n.team_name}" ยืนหัวตารางที่ ${s} pts (นำ "${x}" +${l}) โดยมี ${_} เป็นแกนทำคะแนน`),f._c("ld_th_st_a2","lead_std",`สถานะ GW ${t}: "${n.team_name}" ทำคะแนนนำค่าเฉลี่ยลีกอยู่ที่ ${s} แต้ม กุมระยะห่าง +${l}`)],banter:[f._c("ld_th_st_x1","lead_std",`เครื่องติดแล้ว! "${n.team_name}" กดแต้มสดไป ${s} แต้ม นำ "${x}" อยู่ ${l} แต้ม อาศัย ${_} ไล่ตบคู่แข่งเรียงตัว!`),f._c("ld_th_st_x2","lead_std",`จ่าฝูงสดหน้าใหม่หรือหน้าเดิมไม่รู้ แต่ตอนนี้ "${n.team_name}" จองหัวแถวที่ ${s} แต้ม นำอยู่ ${l} คะแนนแบบหล่อๆ!`)]});else if(W){const B=P[g];E=S({broadcaster:[f._c("fn_th_np_b1","nonprize",`คะแนนสูงสุดบนกระดานเป็นของทีมร่วมสนุก "${P.team_name}" (${B} pts) ทำให้สิทธิ์แชมป์ประจำสัปดาห์ตกเป็นของ "${n.team_name}" (${s} pts) อย่างเป็นทางการ`),f._c("fn_th_np_b2","nonprize",`"${P.team_name}" ระเบิดฟอร์มไร้แรงกดดันเก็บ ${B} แต้ม ก่อนส่งไม้ต่อบัลลังก์แชมป์ GW ${t} ให้ "${n.team_name}" (${s} pts)`)],columnist:[f._c("fn_th_np_c1","nonprize",`แม้ "${P.team_name}" จะปิดสกอร์ดิบสูงสุดที่ ${B} แต้มในโหมดร่วมสนุก แต่ผู้รับเกียรติยศแชมป์สายรางวัล GW ${t} คือ "${n.team_name}" (${s} pts)`),f._c("fn_th_np_c2","nonprize",`บทสรุป GW ${t}: "${P.team_name}" โชว์เหนือที่ ${B} แต้ม ส่วนแชมป์ที่มีสิทธิ์รับรางวัลตกเป็นของ "${n.team_name}" (${s} pts)`)],analyst:[f._c("fn_th_np_a1","nonprize",`อันดับ 1 คะแนนรวมสัปดาห์คือทีมร่วมสนุก "${P.team_name}" (${B} pts) สิทธิ์แชมป์เงินรางวัลจึงเลื่อนให้ "${n.team_name}" (${s} pts)`),f._c("fn_th_np_a2","nonprize",`ผลทางการ GW ${t}: "${n.team_name}" คว้าอันดับ 1 สายเงินรางวัลที่ ${s} pts (+${l} เหนือ "${x}")`)],banter:[f._c("fn_th_np_x1","nonprize",`ทีมรับเชิญอย่าง "${P.team_name}" เล่นชิลแต่ดันกดไป ${B} แต้ม! ส่วนเงินรางวัลสัปดาห์นี้โอนตรงเข้ากระเป๋า "${n.team_name}" (${s} pts) เต็มๆ!`),f._c("fn_th_np_x2","nonprize",`"${P.team_name}" ขโมยซีนกด ${B} แต้มแบบไม่เอาตังค์ ปล่อยให้ "${n.team_name}" (${s} pts) เดินรับแชมป์ประจำสัปดาห์ไปแบบยิ้มกว้าง!`)]})}else if(Q&&!h){const B=U>=3?`แฮตทริกแชมป์ ${U} วีคติด`:`เบิ้ลแชมป์ ${U} สัปดาห์ซ้อน`;E=S({broadcaster:[f._c("fn_th_sk_b1","streak",`ฟอร์มไร้เทียมทาน! "${n.team_name}" คว้า${B}ด้วยสกอร์ ${s} แต้ม เฉือน "${x}" ไป ${l} แต้ม โดยมี ${_} เป็นฟันเฟืองสำคัญ`),f._c("fn_th_sk_b2","streak",`ยังหาคนหยุดไม่อยู่! "${n.team_name}" ครอง${B}ใน GW ${t} จบที่ ${s} แต้ม นำอันดับสอง ${l} แต้ม`)],columnist:[f._c("fn_th_sk_c1","streak",`ความสม่ำเสมอระดับราชวงศ์: "${n.team_name}" สร้างผลงาน${B}ด้วยสกอร์ ${s} แต้ม เหนือกว่า "${x}" ${l} แต้ม`),f._c("fn_th_sk_c2","streak",`สัปดาห์แล้วสัปดาห์เล่าที่ "${n.team_name}" ไม่ยอมปล่อยบัลลังก์ คว้า${B}ที่ ${s} แต้มอย่างสง่างาม`)],analyst:[f._c("fn_th_sk_a1","streak",`"${n.team_name}" รักษาโมเมนตัมคว้า${B}ได้สำเร็จ ปิดสกอร์ ${s} pts (+${l} เหนือ "${x}") จากแรงหนุนของ ${_}`),f._c("fn_th_sk_a2","streak",`อัตราการยืนระยะของ "${n.team_name}" โดดเด่นที่สุดในลีก กวาด${B}ด้วยแต้มสุทธิ ${s} คะแนน`)],banter:[f._c("fn_th_sk_x1","streak",`ผูกขาดบัลลังก์แล้วมั้ง! "${n.team_name}" กด${B}ที่ ${s} แต้ม ทิ้ง "${x}" ไป ${l} แต้ม ใครก็ได้ช่วยมาหยุดทีมนี้ที!`),f._c("fn_th_sk_x2","streak",`ยึดสัมปทานแชมป์ประจำสัปดาห์! "${n.team_name}" จัด${B}ไปอีก ${s} แต้ม ทำเอาเพื่อนร่วมลีกเริ่มมองบนกันหมดแล้ว!`)]})}else if(I==="bboost"||I==="bench_boost")E=S({broadcaster:[f._c("fn_th_bb_b1","chip_win",`จังหวะเปิด Bench Boost ระดับตำรา! "${n.team_name}" ระดมกำลังทั้ง 15 คนโกย ${s} แต้ม คว้าแชมป์ GW ${t} เหนือ "${x}" ${l} แต้ม`),f._c("fn_th_bb_b2","chip_win",`ส่งสำรองลงสนามได้คุ้มค่าทุกแต้ม! "${n.team_name}" ใช้ชิป Bench Boost พุ่งทะยานสู่ ${s} แต้ม ซิวแชมป์ประจำสัปดาห์`)],columnist:[f._c("fn_th_bb_c1","chip_win",`ชิป Bench Boost ถูกใช้งานในเวลาที่เหมาะสมที่สุด "${n.team_name}" เก็บเกี่ยวแต้มครบทั้ง 15 ช่อง ปิดสกอร์แชมป์ที่ ${s} แต้ม`),f._c("fn_th_bb_c2","chip_win",`การวางแผนม้านั่งสำรองของ "${n.team_name}" ออกดอกออกผล กวาด ${s} แต้มคว้าชัย GW ${t}`)],analyst:[f._c("fn_th_bb_a1","chip_win",`ROI จากชิป Bench Boost ของ "${n.team_name}" ทำงานเต็มประสิทธิภาพ ดันแต้มรวมสัปดาห์แตะ ${s} pts (+${l} เหนือ "${x}")`),f._c("fn_th_bb_a2","chip_win",`ผลต่างจากการเปิด Bench Boost ทำให้ "${n.team_name}" ก้าวข้าม "${x}" และปิดเกมที่ ${s} คะแนน`)],banter:[f._c("fn_th_bb_x1","chip_win",`กางการ์ด Bench Boost ทีเดียวแต้มทะลัก! "${n.team_name}" ขนมาทั้ง 15 ตัวไล่ถล่มถึง ${s} แต้ม คว้าแชมป์แบบโคตรคุ้ม!`),f._c("fn_th_bb_x2","chip_win",`สำรองไม่ได้มีไว้นั่งตบยุง! "${n.team_name}" กด Bench Boost กวาด ${s} แต้ม ยืนหนึ่งแบบไม่ต้องสืบ!`)]});else if(I==="3xc"||I==="triple_captain")E=S({broadcaster:[f._c("fn_th_tc_b1","chip_win",`ปลอกแขนคูณสามแผลงฤทธิ์! "${n.team_name}" กด Triple Captain ใส่ ${L} พาทีมเข้าป้าย ${s} แต้ม เหนือ "${x}" ${l} แต้ม`),f._c("fn_th_tc_b2","chip_win",`เดิมพัน Triple Captain เข้าเป้าเต็มๆ! "${n.team_name}" มอบภารกิจให้ ${L} ก่อนปิดจ็อบแชมป์ GW ${t} ที่ ${s} แต้ม`)],columnist:[f._c("fn_th_tc_c1","chip_win",`ความกล้าเดิมพัน Triple Captain กับ ${L} ตอบแทน "${n.team_name}" อย่างงดงาม ปิดสัปดาห์แชมป์ที่ ${s} แต้ม`),f._c("fn_th_tc_c2","chip_win",`หนึ่งสัปดาห์กับหนึ่งการตัดสินใจที่เฉียบขาด: "${n.team_name}" ใช้ Triple Captain พาทีมสู่ ${s} แต้มเหนือ "${x}" ${l} แต้ม`)],analyst:[f._c("fn_th_tc_a1","chip_win",`ตัวคูณ 3x จาก Triple Captain ของ ${L} ช่วยส่ง "${n.team_name}" แซงเข้าวินที่ ${s} pts (+${l} เหนือ "${x}")`),f._c("fn_th_tc_a2","chip_win",`จังหวะเลือก ${L} เป็น Triple Captain ของ "${n.team_name}" สร้างมูลค่าแต้มสูงจนปิดแชมป์สัปดาห์ที่ ${s} แต้ม`)],banter:[f._c("fn_th_tc_x1","chip_win",`กัปตันคูณสามยิงไส้แตก! "${n.team_name}" ยัด Triple Captain ใส่ ${L} แล้วโกยไป ${s} แต้ม เดินหัวเราะดังๆ ได้ทั้งอาทิตย์!`),f._c("fn_th_tc_x2","chip_win",`ตาถึงระดับเทพ! "${n.team_name}" กาง 3XC ใส่ ${L} เก็บไป ${s} แต้ม ทิ้งคู่แข่งนั่งตาปริบๆ!`)]});else if(I==="freehit"||I==="wildcard"){const B=I==="freehit"?"Free Hit":"Wildcard";E=S({broadcaster:[f._c("fn_th_wc_b1","chip_win",`เปิดการ์ด ${B} เปลี่ยนเกมทันที! "${n.team_name}" จัดชุดใหม่เข้าป้ายแชมป์ GW ${t} ที่ ${s} แต้ม นำ "${x}" ${l} แต้ม`),f._c("fn_th_wc_b2","chip_win",`ลงทุน ${B} แล้วได้คืนทันที! "${n.team_name}" เก็บไป ${s} แต้ม คว้าแชมป์สัปดาห์แบบทันตาเห็น`)],columnist:[f._c("fn_th_wc_c1","chip_win",`การรีเซ็ตขุมกำลังด้วย ${B} ของ "${n.team_name}" ให้ผลลัพธ์ระดับมาสเตอร์พีซ จบที่ ${s} แต้มครองแชมป์ GW ${t}`),f._c("fn_th_wc_c2","chip_win",`"${n.team_name}" ใช้สิทธิ์ ${B} อย่างเฉียบแหลม ฉีกหนี "${x}" ไป ${l} แต้มที่สกอร์ ${s} คะแนน`)],analyst:[f._c("fn_th_wc_a1","chip_win",`โครงสร้างทีมใหม่จาก ${B} ของ "${n.team_name}" ทำคะแนนรวม ${s} pts สูงสุดในลีก (+${l} เหนือ "${x}")`),f._c("fn_th_wc_a2","chip_win",`การใช้ ${B} ใน GW ${t} ของ "${n.team_name}" ตอบโจทย์ทันทีด้วยผลงาน ${s} แต้ม`)],banter:[f._c("fn_th_wc_x1","chip_win",`ล้างไพ่ด้วย ${B} ปุ๊บแชมป์ปั๊บ! "${n.team_name}" กวาดไป ${s} แต้ม เล่นเอาเพื่อนร่วมลีกอยากกดตามแทบไม่ทัน!`),f._c("fn_th_wc_x2","chip_win",`ผ่าตัดทีมใหม่ด้วย ${B} แล้วปังทันที! "${n.team_name}" ซัด ${s} แต้ม คว้าแชมป์สัปดาห์แบบสบายมือ!`)]})}else if(h&&$.length>1){const B=$.slice(0,3).map(Y=>`"${Y.team_name}"`).join(" และ ");E=S({broadcaster:[f._c("fn_th_jt_b1","joint",`เสมอกันสุดมันส์! ${B} ปิดสกอร์เท่ากันเป๊ะที่ ${s} แต้ม กอดคอครองแชมป์ร่วม GW ${t}`),f._c("fn_th_jt_b2","joint",`บทสรุปแบ่งครึ่งบัลลังก์! ${B} ทำแต้มเท่ากันที่ ${s} แต้ม ไม่มีใครยอมใครในสัปดาห์นี้`)],columnist:[f._c("fn_th_jt_c1","joint",`ใน GW ${t} ไม่มีผู้แพ้ที่แท้จริงบนยอดตาราง เมื่อ ${B} จบลงด้วยคะแนนเท่ากันที่ ${s} แต้ม`),f._c("fn_th_jt_c2","joint",`การดวลที่สมน้ำสมเนื้อจบลงด้วยการครองบัลลังก์ร่วมของ ${B} ที่ ${s} คะแนน`)],analyst:[f._c("fn_th_jt_a1","joint",`ผลสรุป GW ${t} เกิด Tie ที่อันดับ 1: ${B} ทำคะแนนสุทธิเท่ากันที่ ${s} pts`),f._c("fn_th_jt_a2","joint",`จ่าฝูงประจำสัปดาห์มีผู้ทำคะแนนสูงสุดร่วมกันที่ ${s} แต้ม ได้แก่ ${B}`)],banter:[f._c("fn_th_jt_x1","joint",`กินกันไม่ลงต้องหารรางวัลแล้ว! ${B} ซัดเท่ากันเป๊ะ ${s} แต้ม จับมือขึ้นรับถ้วยร่วมกันไปเลย!`),f._c("fn_th_jt_x2","joint",`เสมอแบบเส้นยาแดง! ${B} ปิดที่ ${s} แต้มเท่ากันทุกเม็ด แบ่งตังค์กันคนละครึ่งแบบสมานฉันท์!`)]})}else v?E=S({broadcaster:[f._c("fn_th_ct_b1","century",`ทะลุหลักร้อยอย่างยิ่งใหญ่! "${n.team_name}" กวาดไปถึง ${s} แต้ม (ค่าเฉลี่ยลีก ${k} pts) ทิ้ง "${x}" ไป ${l} แต้ม โดยมี ${_} เป็นพระเอก`),f._c("fn_th_ct_b2","century",`สกอร์สามหลักลงบันทึกประวัติศาสตร์! "${n.team_name}" ระเบิดพลัง ${s} แต้ม ซิวแชมป์ GW ${t} ไปแบบเหนือชั้น`)],columnist:[f._c("fn_th_ct_c1","century",`หลัก 100 คะแนนคือหมุดหมายของสัปดาห์ระดับตำนาน และ "${n.team_name}" ทำได้สำเร็จที่ ${s} แต้ม ทิ้งค่าเฉลี่ยลีก (${k}) ไว้เบื้องหลัง`),f._c("fn_th_ct_c2","century",`เข้าสู่ทำเนียบ Century Club อย่างสง่างามสำหรับ "${n.team_name}" ที่สกอร์ ${s} แต้ม ด้วยฟอร์มของ ${_}`)],analyst:[f._c("fn_th_ct_a1","century",`สกอร์ ${s} pts ของ "${n.team_name}" สูงกว่าค่าเฉลี่ยลีก (${k}) ถึง +${s-k} แต้ม ทะลุเกณฑ์ 100+ สมบูรณ์แบบ`),f._c("fn_th_ct_a2","century",`ประสิทธิภาพระดับสูงในทุกตำแหน่งส่งให้ "${n.team_name}" แตะหลักร้อยที่ ${s} แต้ม (+${l} เหนือ "${x}")`)],banter:[f._c("fn_th_ct_x1","century",`ร้อยแต้มแตกเฉย! "${n.team_name}" กดไป ${s} แต้ม ทำเอาค่าเฉลี่ยลีก (${k} pts) ดูเหมือนทีมคนละดิวิชัน!`),f._c("fn_th_ct_x2","century",`นี่คนหรือเครื่องจักรผลิตแต้ม! "${n.team_name}" ซัดทะลุร้อยที่ ${s} แต้ม เหยียบคันเร่งหนี "${x}" ไป ${l} แต้มเต็มๆ!`)]}):l<=2&&c?E=S({broadcaster:[f._c("fn_th_cl_b1","nailbiter",`ตัดสินกันที่เส้นชัย! "${n.team_name}" (${s} pts) เฉือน "${x}" (${o} pts) เพียง ${l} แต้ม คว้าแชมป์ GW ${t} ไปแบบสุดระทึก!`),f._c("fn_th_cl_b2","nailbiter",`เกมบีบหัวใจจนวินาทีสุดท้าย! "${n.team_name}" เบียดเข้าวินเหนือ "${x}" แค่ ${l} แต้ม ด้วยแรงหนุนจาก ${_}`)],columnist:[f._c("fn_th_cl_c1","nailbiter",`เส้นแบ่งระหว่างผู้ชนะกับรองแชมป์บางเฉียบเพียง ${l} คะแนน! "${n.team_name}" (${s} pts) อาศัยความนิ่งเฉือน "${x}" (${o} pts) เข้าป้าย`),f._c("fn_th_cl_c2","nailbiter",`บทสรุป GW ${t} วัดกันด้วยรายละเอียดเล็กน้อย "${n.team_name}" เก็บ ${s} แต้ม เหนือกว่า "${x}" เพียง ${l} แต้มเท่านั้น`)],analyst:[f._c("fn_th_cl_a1","nailbiter",`ผลต่างแค่ ${l} แต้ม (${s} vs ${o}) ตัดสินแชมป์ GW ${t} ให้ "${n.team_name}" โดยได้ ${_} สร้างความแตกต่าง`),f._c("fn_th_cl_a2","nailbiter",`มินิลีกสัปดาห์นี้สูสีมาก "${n.team_name}" จบที่ ${s} แต้ม เหนือ "${x}" แค่ ${l} แต้ม — หนึ่งคลีนชีตหรือโบนัสเดียวก็เปลี่ยนผู้ชนะได้`)],banter:[f._c("fn_th_cl_x1","nailbiter",`ปาดหน้าเค้กปลายเล็บขบ! "${n.team_name}" (${s} pts) ปล้นแชมป์จากมือ "${x}" (${o} pts) ไปแค่ ${l} แต้ม เจ็บใจกว่าเดินเหยียบเลโก้!`),f._c("fn_th_cl_x2","nailbiter",`ชนะแต้มเดียวก็ขึ้นแท่นแชมป์โว้ย! "${n.team_name}" (${s} pts) เฉือน "${x}" (${o} pts) ไปแค่ ${l} แต้ม งานนี้มีคนนอนไม่หลับ!`)]}):l<=5&&c?E=S({broadcaster:[f._c("fn_th_md_b1","mid_close",`สู้กันสมศักดิ์ศรี! "${n.team_name}" เก็บไป ${s} แต้ม เบียดหนี "${x}" (${o} pts) ไปแบบสูสี ${l} แต้ม`),f._c("fn_th_md_b2","mid_close",`บี้กันสนุกยันคู่สุดท้าย! "${n.team_name}" ยึดแชมป์ GW ${t} ที่ ${s} แต้ม นำ "${x}" ${l} แต้ม`)],columnist:[f._c("fn_th_md_c1","mid_close",`"${n.team_name}" ยืนระยะได้อย่างแข็งแกร่งในสัปดาห์ที่ตึงเครียด ปิดบัญชี ${s} แต้มเหนือ "${x}" อยู่ ${l} แต้ม`),f._c("fn_th_md_c2","mid_close",`ความเฉียบคมในตำแหน่งสำคัญอย่าง ${_} ช่วยให้ "${n.team_name}" (${s} pts) กัน "${x}" (${o} pts) ออกไปได้ ${l} แต้ม`)],analyst:[f._c("fn_th_md_a1","mid_close",`ช่องว่าง ${l} แต้ม (${s} vs ${o}) แสดงให้เห็นการแข่งขันที่เข้มข้นระหว่าง "${n.team_name}" และ "${x}"`),f._c("fn_th_md_a2","mid_close",`"${n.team_name}" คุมเกมได้นิ่งกว่าเล็กน้อย ปิดที่ ${s} pts เหนือกว่าอันดับ 2 อยู่ +${l} แต้ม`)],banter:[f._c("fn_th_md_x1","mid_close",`ไล่บี้มาเกือบทันแต่ยังไม่พอ! "${n.team_name}" (${s} pts) ตบเกียร์หนี "${x}" ไป ${l} แต้ม คว้าชัยสัปดาห์นี้แบบตึงมือ!`),f._c("fn_th_md_x2","mid_close",`เกือบโดนแซงโค้งสุดท้ายแต่ยังรอด! "${n.team_name}" เอาตัวรอดที่ ${s} แต้ม เหนือ "${x}" อยู่ ${l} แต้ม`)]}):l>=15?E=S({broadcaster:[f._c("fn_th_bl_b1","blowout",`ชนะขาดลอยไร้ข้อกังขา! "${n.team_name}" กวาด ${s} แต้ม ทิ้งห่าง "${x}" ถึง ${l} แต้ม จากผลงานเด่นของ ${_}`),f._c("fn_th_bl_b2","blowout",`"${n.team_name}" เดินเครื่องเต็มกำลังใน GW ${t} ปิดสกอร์ที่ ${s} แต้ม นำอันดับสอง ${l} แต้ม`)],columnist:[f._c("fn_th_bl_c1","blowout",`สัปดาห์นี้เป็นเวทีเดี่ยวของ "${n.team_name}" ที่ทะยานสู่ ${s} แต้ม ทิ้งระยะห่างจาก "${x}" ถึง ${l} คะแนน`),f._c("fn_th_bl_c2","blowout",`ชัยชนะที่แทบไม่ต้องลุ้นในช่วงท้าย: "${n.team_name}" กดไป ${s} แต้ม เหนือกว่าอันดับสอง ${l} แต้มเต็ม`)],analyst:[f._c("fn_th_bl_a1","blowout",`ค่าความต่าง +${l} แต้มเหนืออันดับสองของ "${n.team_name}" (${s} pts) ถือเป็นหนึ่งในชัยชนะที่ขาดลอยที่สุดของรอบนี้`),f._c("fn_th_bl_a2","blowout",`"${n.team_name}" กวาด ${s} pts (+${s-k} เหนือค่าเฉลี่ยลีก) ทิ้ง "${x}" ขาดถึง ${l} คะแนน`)],banter:[f._c("fn_th_bl_x1","blowout",`ตบเด็กโชว์ทั้งลีก! "${n.team_name}" กดไป ${s} แต้ม ทิ้ง "${x}" ขาดกระจุย ${l} แต้ม นั่งดูคู่แข่งวิ่งตามหลังแบบไม่เห็นฝุ่น!`),f._c("fn_th_bl_x2","blowout",`นี่มันมินิลีกหรือเกมอุ่นเครื่อง! "${n.team_name}" ซัด ${s} แต้ม ฉีกหนี "${x}" ไป ${l} แต้มแบบไร้คู่ต่อกร!`)]}):s<50?E=S({broadcaster:[f._c("fn_th_lw_b1","grind",`สัปดาห์ที่แต้มทั้งลีกฝืดหนัก (เฉลี่ย ${k} pts) แต่ "${n.team_name}" ยังประคองตัวคว้าชัยที่ ${s} แต้ม เหนือ "${x}" ${l} แต้ม`),f._c("fn_th_lw_b2","grind",`เกมที่แนวรุกพร้อมใจกันเงียบ "${n.team_name}" เอาตัวรอดด้วยสกอร์ ${s} แต้ม ซิวแชมป์ GW ${t} แบบเหนียวแน่น`)],columnist:[f._c("fn_th_lw_c1","grind",`ในสัปดาห์ที่ดาวดังพากันเงียบงัน "${n.team_name}" คือคนที่ผิดพลาดน้อยที่สุด คว้าแชมป์ไปด้วย ${s} แต้ม`),f._c("fn_th_lw_c2","grind",`ไม่จำเป็นต้องสวยงามทุกสัปดาห์: "${n.team_name}" เก็บ ${s} แต้มท่ามกลางค่าเฉลี่ย ${k} pts เพื่อครองอันดับ 1`)],analyst:[f._c("fn_th_lw_a1","grind",`GW ${t} มีค่าเฉลี่ยต่ำเพียง ${k} pts แต่ "${n.team_name}" ทำได้ ${s} แต้ม เพียงพอสำหรับชัยชนะ (+${l})`),f._c("fn_th_lw_a2","grind",`สัปดาห์คะแนนต่ำ (Low-scoring GW): "${n.team_name}" ยืนระยะดีกว่าค่าเฉลี่ยที่ ${s} pts`)],banter:[f._c("fn_th_lw_x1","grind",`สัปดาห์สุดฝืดที่ทั้งลีกเฉลี่ยแค่ ${k} แต้ม แต่ "${n.team_name}" ดันลากสังขารไปถึง ${s} แต้ม คว้าถ้วยไปแบบงงๆ!`),f._c("fn_th_lw_x2","grind",`เตะกันแบบง่วงทั้งลีก! แต่ "${n.team_name}" ยังมีแต้มพอฟาดแชมป์ที่ ${s} แต้ม ชนะก็คือชนะไม่เกี่ยงคะแนน!`)]}):E=S({broadcaster:[f._c("fn_th_st_b1","lead_std",`เสียงนกหวีดสุดท้ายดังขึ้น! "${n.team_name}" ปิดจ็อบแชมป์ GW ${t} ที่ ${s} แต้ม เหนือ "${x}" อยู่ ${l} แต้ม โดยมี ${_} ช่วยสร้างจังหวะสำคัญ`),f._c("fn_th_st_b2","lead_std",`จบศึก GW ${t} อย่างสวยงาม! "${n.team_name}" เข้าป้ายอันดับหนึ่งที่ ${s} แต้ม ฉีก "${x}" ออกไป ${l} แต้ม`)],columnist:[f._c("fn_th_st_c1","lead_std",`การจัดทัพที่สมดุลพา "${n.team_name}" คว้าแชมป์ GW ${t} ด้วยสกอร์ ${s} แต้ม ทิ้ง "${x}" (${o} pts) ไป ${l} แต้ม`),f._c("fn_th_st_c2","lead_std",`"${n.team_name}" อ่านเกมสัปดาห์นี้ได้ขาดลอย ปิดบัญชีที่ ${s} แต้ม สูงกว่าค่าเฉลี่ยลีก (${k} pts) และได้ ${_} เป็นตัวชูโรง`)],analyst:[f._c("fn_th_st_a1","lead_std",`บทสรุป GW ${t}: "${n.team_name}" ทำได้ ${s} แต้ม (+${s-k} เหนือค่าเฉลี่ยลีก) ชนะ "${x}" ${l} แต้ม จากแกนหลัก ${_}`),f._c("fn_th_st_a2","lead_std",`ประสิทธิภาพขุมกำลังของ "${n.team_name}" พาทีมคว้าชัยที่ ${s} แต้ม เหนือกว่าอันดับสอง "${x}" อยู่ ${l} แต้ม`)],banter:[f._c("fn_th_st_x1","lead_std",`"${n.team_name}" เดินรับถ้วยประจำสัปดาห์หล่อๆ ที่ ${s} แต้ม ปล่อยให้ "${x}" (${o} pts) ยืนมองตาปริบๆ ห่างออกไป ${l} แต้ม`),f._c("fn_th_st_x2","lead_std",`จบ GW ${t} แบบกินนิ่ม! "${n.team_name}" ฟาด ${s} แต้ม เหนือกว่า "${x}" ${l} แต้ม สบายใจเฉิบ`)]});const A=r(E,11),F=[];if(u.overallContext&&u.overallContext.leaderChanged){const B=u.overallContext;F.push(f._c("md_th_ov1","overall_swing",`จุดเปลี่ยนสำคัญของตารางรวม: "${B.currLeaderName}" แซง "${B.prevLeaderName}" ขึ้นยึดจ่าฝูงสะสมคนใหม่ที่ ${B.currLeaderPts} แต้มแล้ว!`),f._c("md_th_ov2","overall_swing",`บัลลังก์คะแนนรวมเปลี่ยนมือ! "${B.currLeaderName}" ทะยานขึ้นนำฝูงสะสมเหนือ "${B.prevLeaderName}" ในสัปดาห์นี้`))}else if(u.overallContext&&u.overallContext.gap<=5&&u.overallContext.runnerName){const B=u.overallContext;F.push(f._c("md_th_ov3","overall_tight",`ขณะที่หัวตารางคะแนนรวมบี้กันสุดเดือด "${B.currLeaderName}" นำ "${B.runnerName}" ห่างแค่ ${B.gap} แต้มเท่านั้น`))}if(y&&u.topProvBonus){const B=u.topProvBonus;F.push(f._c("md_th_pb1","bonus_watch",`จับตาโบนัสชั่วคราว! ${B.name} กำลังลุ้นบวกเพิ่ม +${B.bonus} BPS โดยมีถึง ${B.owners.length} ทีมในลีกรอรับส้มหล่น`),f._c("md_th_pb2","bonus_watch",`คะแนนโบนัสยังไม่นิ่ง แต่ตอนนี้ ${B.name} กวาด BPS นำจ่อรับ +${B.bonus} แต้ม เข้ากระเป๋า ${B.owners.length} ทีม`))}if(y&&u.topGoalHero){const B=u.topGoalHero;F.push(f._c("md_th_gh1","goal_shock",`ช็อตระเบิดสนามของ ${B.name} (${B.goals} ประตู ${B.assists} แอสซิสต์ · ${B.pts} pts) ทำเอา ${B.owners.length} ทีมในลีกเฮลั่นจอ`),f._c("md_th_gh2","goal_shock",`${B.name} โชว์ฟอร์มสะเด่า (${B.pts} pts) ส่งผลให้ ${B.owners.length} ทีมที่มีติดทัพได้แต้มพุ่งทันที`))}if(u.autoSubHeroes.length>0){const B=u.autoSubHeroes[0];F.push(f._c("md_th_as1","autosub",`ม้านั่งช่วยชีวิต! "${B.team}" ได้ ${B.player} ขยับขึ้นมาช่วยทีมแทนตัวที่ไม่ลงสนาม บวกคืนให้ +${B.pts} แต้มเต็มๆ`))}if(u.vcRegrets.length>0){const B=u.vcRegrets[0];F.push(f._c("md_th_vc1","captain_regret",`ช็อต "รู้งี้..." ประจำสัปดาห์เป็นของ "${B.team}" ที่รองกัปตัน ${B.vcName} กดไป ${B.vcRaw} แต้ม แต่กัปตัน ${B.capName} ได้แค่ ${B.capRaw} แต้ม เสียดายแต้มที่หลุดมือไป ${B.lostPts} คะแนน`),f._c("md_th_vc2","captain_regret",`"${B.team}" แทบอยากสลับปลอกแขนย้อนหลัง เมื่อรองกัปตัน ${B.vcName} (${B.vcRaw} pts) ทำแต้มแซงกัปตัน ${B.capName} (${B.capRaw} pts)`))}if(u.txMaster){const B=u.txMaster,Y=(B.transfer_moves||[]).filter(M=>M&&M.in&&M.in!=="-").sort((M,V)=>(V.in_pts||0)-(M.in_pts||0))[0],X=Y&&Y.in_pts>=4?` (ดึง ${p(Y.in)} มายิง ${Y.in_pts} pts)`:"";F.push(f._c("md_th_tx1","tx_win",`ดีลเปลี่ยนตัวสุดคมต้องยกให้ "${B.team_name}" ที่ขยับตลาดแล้วบวกกำไรสุทธิทันที +${B.transfers_net_impact} แต้ม${X}`),f._c("md_th_tx2","tx_win",`กุนซือตาเพชรประจำสัปดาห์คือ "${B.team_name}" ซื้อขายรอบเดียวโกยกำไรส่วนต่าง +${B.transfers_net_impact} แต้ม${X}`))}if(u.txBust){const B=u.txBust,Y=(B.transfer_moves||[]).filter(M=>M&&M.out&&M.out!=="-").sort((M,V)=>(V.out_pts||0)-(M.out_pts||0))[0],X=Y&&Y.out_pts>=6?`ขาย ${p(Y.out)} ทิ้งแล้วเจ้าตัวดันกด ${Y.out_pts} pts`:"ตัวที่ดึงเข้ามายังเงียบ";F.push(f._c("md_th_tb1","tx_bust",`ส่วน "${B.team_name}" เจออาถรรพ์ตลาดนักเตะ (${X}) ขาดทุนสุทธิจากการย้ายตัวไป ${B.transfers_net_impact} แต้ม`),f._c("md_th_tb2","tx_bust",`ด้าน "${B.team_name}" ขยับตัวผิดจังหวะ (${X}) โดนส่วนต่างย้ายตัวหักหายไป ${Math.abs(B.transfers_net_impact)} แต้ม`))}if(u.benchKing){const B=u.benchKing,Y=i(B.entry_id),X=Y&&Y.bench?[...Y.bench].sort((V,Z)=>(Z.points||0)-(V.points||0))[0]:null,M=X&&X.points>=6?` โดยเฉพาะ ${p(X.name)} (${X.points} pts)`:"";F.push(f._c("md_th_bn1","bench_pain",`ขณะที่ "${B.team_name}" นั่งมองตาปริบๆ เมื่อซุ้มตัวสำรองเก็บรวมกันถึง ${B.bench_points} แต้ม${M} แต่นั่งอยู่ข้างสนาม`),f._c("md_th_bn2","bench_pain",`ดราม่าม้านั่งตกเป็นของ "${B.team_name}" ที่ปล่อยให้ตัวสำรองทำแต้มหลุดมือไป ${B.bench_points} แต้ม${M}`),f._c("md_th_bn3","bench_pain",`"${B.team_name}" มีขุมกำลังสำรองที่ร้อนแรงถึง ${B.bench_points} แต้ม${M} แต่น่าเสียดายที่ไม่ได้ส่งลงเป็นตัวจริง`))}if(u.mostPopCap&&u.mostPopCap[1]>=3){const[B,Y]=u.mostPopCap,X=d.find(Z=>(Z.captain||"").includes(B)),M=X?i(X.entry_id):null,V=M&&M.starting?M.starting.find(Z=>Z.is_captain):null;if(V){const Z=Number(V.points)||0;y&&(!!V.not_played_yet||Number(V.minutes||0)===0)?F.push(f._c("md_th_pc1","cap_pop",`จุดชี้ชะตาอยู่ที่กัปตันมหาชน ${B} (${Y} ทีม) ที่ยังรอลงสนาม — ถ้ามาเต็มเมื่อไหร่มีสิทธิ์เขย่าทั้งตาราง`)):Z<=6?F.push(f._c("md_th_pc2","cap_pop",`กัปตันขวัญใจมหาชนอย่าง ${B} (${Y} ทีม) รอบนี้ฟอร์มฝืดได้แค่ ${Z} แต้ม ทำเอาเกินครึ่งลีกต้องถอนหายใจ`),f._c("md_th_pc2b","cap_pop",`คนที่ฝากปลอกแขนไว้ที่ ${B} (${Y} ทีม) ต่างผิดหวังไปตามๆ กัน หลังทำได้เพียง ${Z} คะแนน`)):Z>=18&&F.push(f._c("md_th_pc3","cap_pop",`กัปตันมหาชน ${B} (${Y} ทีม) ไม่ทำให้ผิดหวัง จัดไป ${Z} แต้ม พาขบวนคนเชื่อใจยิ้มกว้างทั้งลีก`),f._c("md_th_pc3b","cap_pop",`ใครไม่ได้จับ ${B} (${Y} ทีม) เป็นกัปตันรอบนี้มีจุก เพราะเจ้าตัวแจกคะแนนคูณสองไปถึง ${Z} แต้ม`))}}if(u.redCardVictims.length>0){const B=f._pickPlain(u.redCardVictims,N,w,22),Y=B.isRed?"โดนใบแดงไล่ออก":B.isPenMiss?"พลาดจุดโทษ":"แต้มติดลบ";F.push(f._c("md_th_rc1","red_card",`โชคร้ายสุดๆ สำหรับ "${B.team}" เมื่อ ${B.player} ${Y} จนแต้มหล่นไป ${B.pts} คะแนน`))}if(m&&m.entry_id!==n.entry_id&&d.length>3){const B=Number(m.players_remaining!==void 0?m.players_remaining:m.live_rem||0),Y=Number(m[g]||0);y&&Y<=6&&B>=6?F.push(f._c("md_th_bt_l","bottom",`ส่วนท้ายตาราง "${m.team_name}" (${Y} pts) ยังไม่ต้องรีบตกใจ เพราะยังมีผู้เล่นรอลงเตะอีกถึง ${B} คน`)):b==="banter"?F.push(f._c("md_th_bt_x1","bottom",`ฝั่งก้นตารางสัปดาห์นี้ "${m.team_name}" เก็บได้แค่ ${Y} แต้ม ครองบ๊วยอย่างเหงาๆ รอเพื่อนมาแซวในแชทได้เลย!`),f._c("md_th_bt_x2","bottom",`ตำแหน่งผู้กล้าท้ายตารางยกให้ "${m.team_name}" ที่หยุดอยู่ที่ ${Y} แต้ม สัปดาห์หน้าค่อยมาแก้มือใหม่นะเพื่อน!`)):F.push(f._c("md_th_bt_c1","bottom",`ด้านท้ายตาราง "${m.team_name}" สัปดาห์นี้เจองานหนัก จบที่ ${Y} แต้ม ต้องรีบปรับขบวนก่อนเดดไลน์หน้า`),f._c("md_th_bt_c2","bottom",`ส่วน "${m.team_name}" (${Y} pts) ต้องเร่งแก้เกมในตลาดรอบหน้าหลังรั้งอันดับสุดท้ายของสัปดาห์`))}let q=[],j="";if(F.length>0){const B=r(F,21);if(B&&(j=B.text,q.push(B.id)),F.length>=3&&(w%2===1||y)){const Y=F.filter(M=>M.id!==B?.id),X=r(Y,25);X&&(j+=` ${X.text}`,q.push(X.id))}}const R=D?{broadcaster:[f._c("ed_th_fb1","end","ครบ 90 นาทีทุกสนามของสัปดาห์นี้ เตรียมนับถอยหลังสู่เกมวีคถัดไปกันต่อ!"),f._c("ed_th_fb2","end","สัปดาห์นี้ปิดฉากอย่างเร้าใจ ใครจะรักษาโมเมนตัมได้ต่อต้องไปวัดกันรอบหน้า!"),f._c("ed_th_fb3","end","คะแนนทางการยืนยันเรียบร้อย เจอกันใหม่ในแมตช์เดย์ถัดไป!"),f._c("ed_th_fb4","end",`เสียงนกหวีดสุดท้ายปิดม่าน GW ${t} อย่างสมบูรณ์ พร้อมเปิดฉากศึกหน้าทันที!`)],columnist:[f._c("ed_th_fc1","end","ตารางคะแนนไม่เคยโกหกใคร สัปดาห์หน้าคือบทพิสูจน์บทใหม่ของคนจัดทัพ"),f._c("ed_th_fc2","end","ความสม่ำเสมอใน 38 สัปดาห์ต่างหากที่เป็นตัวตัดสินแชมป์ตัวจริง"),f._c("ed_th_fc3","end","จบหนึ่งสัปดาห์ก็ถึงเวลาทบทวนบทเรียน ก่อนตลาดนักเตะรอบหน้าจะปิดลง"),f._c("ed_th_fc4","end","ทุกคะแนนที่เกิดขึ้นในเกมวีคนี้จะถูกจารึกเป็นจุดเปลี่ยนสำคัญเมื่อจบฤดูกาล")],analyst:[f._c("ed_th_fa1","end","ถึงเวลาสแกนโปรแกรม 3 นัดถัดไปและจัดการงบประมาณก่อนราคาขยับ"),f._c("ed_th_fa2","end","เก็บข้อมูลฟอร์มและนาทีลงสนามสัปดาห์นี้ไว้ใช้ชิงความได้เปรียบในรอบถัดไป"),f._c("ed_th_fa3","end","ทุกแต้มที่เสียหรือได้ในสัปดาห์นี้จะสะท้อนผลชัดเจนเมื่อเข้าสู่ช่วงโค้งสุดท้าย"),f._c("ed_th_fa4","end","เช็กแท็บแนะนำการย้ายตัวเพื่อเตรียมวางแผนก่อนตลาดรอบใหม่เปิดทำการ")],banter:[f._c("ed_th_fx1","end","คนชนะเดินยืดอกแคปจอไปลงกลุ่มได้เลย ส่วนคนแพ้ซุ่มเงียบจัดตัวใหม่แก้ตัวสัปดาห์หน้า!"),f._c("ed_th_fx2","end","บทสรุปออกแล้ว ใครโดนเพื่อนล้อวันนี้สัปดาห์หน้าค่อยกลับมาเอาคืน!"),f._c("ed_th_fx3","end","วงการนี้เข้าแล้วออกยาก สัปดาห์นี้จะพังแค่ไหนเดี๋ยวพรุ่งนี้ก็เปิดดูราคาตัวใหม่ต่ออยู่ดี!"),f._c("ed_th_fx4","end","ผลออกมาชัดขนาดนี้ คืนนี้กลุ่มแชทมีประเด็นให้แซวกันยาวแน่นอน!")]}:{broadcaster:[f._c("ed_th_lb1","end","เกมยังไม่จบครบทุกคู่ รอติดตามจังหวะเปลี่ยนอันดับแบบเรียลไทม์กันต่อ!"),f._c("ed_th_lb2","end","ยังเหลือเวลาให้ลุ้นทั้งโบนัสและออโต้ซับ ห้ามกะพริบตาเด็ดขาด!"),f._c("ed_th_lb3","end","ความสนุกของแมตช์เดย์เพิ่งเริ่มต้น คู่ที่เหลือยังพลิกกระดานได้เสมอ"),f._c("ed_th_lb4","end","เกาะติดทุกประตูและคะแนนโบนัสสดๆ ที่จะอัปเดตให้เห็นทุก 20 วินาที!")],columnist:[f._c("ed_th_lc1","end","บอลยังไม่ครบ 90 นาทีทุกสนาม อันดับชั่วคราวอาจเปลี่ยนหน้าได้ในพริบตา"),f._c("ed_th_lc2","end","ความแน่นอนยังไม่เกิดจนกว่าผู้ตัดสินจะเป่านกหวีดสุดท้ายของเกมวีค"),f._c("ed_th_lc3","end","ระหว่างทางของเกมวีคมักซ่อนเรื่องราวพลิกผันไว้ในคู่สุดท้ายเสมอ"),f._c("ed_th_lc4","end","ผู้ชนะตัวจริงไม่ได้ตัดสินที่วันแรก แต่ตัดสินเมื่อเสียงนกหวีดคู่สุดท้ายดังขึ้น")],analyst:[f._c("ed_th_la1","end","ตัวแปรสำคัญยังอยู่ที่คะแนนโบนัสชั่วคราวและจำนวนนักเตะที่เหลือของกลุ่มหัวตาราง"),f._c("ed_th_la2","end","แนะนำเช็กหน้าเทียบคู่แข่ง 1v1 เพื่อดูตัวต่างที่ยังเหลือลงสนามในช่วงเวลาที่เหลือ"),f._c("ed_th_la3","end","อัปเดตตัวสำรองอัตโนมัติชั่วคราวจะช่วยสะท้อนคะแนนสุทธิจริงทันทีที่แต่ละคู่จบ"),f._c("ed_th_la4","end","จับตาค่า BPS ในคู่ที่กำลังแข่ง เพราะโบนัส +3 สามารถเปลี่ยนอันดับหัวตารางได้ทันที")],banter:[f._c("ed_th_lx1","end","บอลยังไม่จบอย่าเพิ่งรีบโม้ ระวังโดนลูกยิงนาทีบาปปาดหน้าเค้กคาจอ!"),f._c("ed_th_lx2","end","จ่าฝูงชั่วคราวเตรียมยาดมรอไว้เลย คู่ดึกยังมีสิทธิ์พลิกตารางได้ตลอดเวลา!"),f._c("ed_th_lx3","end","ตอนนี้ใครมีตัวเหลืออยู่ในมือก็เตรียมลุ้นให้สุดเสียง คืนนี้ยังไม่รู้ใครจะหัวเราะทีหลัง!"),f._c("ed_th_lx4","end","เปิดโหมดเทียบ 1v1 แล้วแคปจอไปกดดันเพื่อนที่นั่งตามหลังได้เลย!")]},G=r(R[b]||R.broadcaster,31);return{text:j?`${A.text} ${j} ${G.text}`:`${A.text} ${G.text}`,leadId:A.id,midIds:q,endId:G.id}}static _buildEnglishCommentary(e){const{gwNumber:t,persona:a,pick:r,clean:p,getSquad:i,sorted:d,top:n,second:c,bottom:m,topPts:s,secondPts:o,diff:l,scoreKey:g,isLive:y,isFinished:D,isJoint:h,winners:$,isCentury:v,chip:I,captName:L,avgScore:k,secName:x,topRem:C,secRem:T,heroPlayer:H,secondHero:z,winStreak:U,isStreak:Q,isTopNonPrize:W,overallTop:P,signals:u,baseHash:N,stepOffset:w}=e,b=a.id,_=H?z?`${H.name} (${H.pts} pts) and ${z.name} (${z.pts} pts)`:`${H.name} (${H.pts} pts)`:`captain ${L}`,S=B=>B[b]||B.broadcaster;let E=[];if(y)W?E=S({broadcaster:[f._c("ld_en_np_b","nonprize",`Exhibition side "${P.team_name}" leads raw scoring on ${P[g]} pts, while "${n.team_name}" (${s} pts) fronts the prize race by ${l} pts.`)],columnist:[f._c("ld_en_np_c","nonprize",`"${P.team_name}" plays with total freedom on ${P[g]} pts, leaving "${n.team_name}" (${s} pts) to set the official prize pace.`)],analyst:[f._c("ld_en_np_a","nonprize",`Guest leader: "${P.team_name}" (${P[g]} pts). Official prize leader: "${n.team_name}" (${s} pts, +${l} over "${x}").`)],banter:[f._c("ld_en_np_x","nonprize",`"${P.team_name}" is tearing it up for pure vibes on ${P[g]} pts while "${n.team_name}" (${s} pts) leads the cash race!`)]}):l<=0||h||s===o?E=T>C&&C!==null?S({broadcaster:[f._c("ld_en_tc_b",["tie","chasers_left"],`Deadlock at ${s} pts! "${n.team_name}" and "${x}" share the summit, though "${x}" holds ${T} players left vs ${C}.`)],columnist:[f._c("ld_en_tc_c",["tie","chasers_left"],`Level on ${s} pts for now, yet "${x}" carries superior late-game firepower (${T} vs ${C} remaining).`)],analyst:[f._c("ld_en_tc_a",["tie","chasers_left"],`Tie at ${s} pts: "${x}" projects higher remaining ceiling with ${T} starters left against ${C}.`)],banter:[f._c("ld_en_tc_x",["tie","chasers_left"],`Locked at ${s} pts, except "${x}" still has ${T} players in reserve vs ${C} — somebody is about to get overtaken!`)]}):S({broadcaster:[f._c("ld_en_tie_b","tie",`All square at ${s} pts between "${n.team_name}" and "${x}"! Everything hinges on the remaining fixtures.`)],columnist:[f._c("ld_en_tie_c","tie",`Nothing separates "${n.team_name}" and "${x}" on ${s} pts as GW ${t} enters its decisive stretch.`)],analyst:[f._c("ld_en_tie_a","tie",`Co-leaders at ${s} pts ("${n.team_name}" & "${x}"). Differential picks and BPS will break the deadlock.`)],banter:[f._c("ld_en_tie_x","tie",`Dead bloody heat on ${s} pts! "${n.team_name}" and "${x}" are refusing to blink!`)]}):T>C&&C!==null?E=S({broadcaster:[f._c("ld_en_lv_b","chasers_left",`High drama! "${n.team_name}" leads on ${s} pts (+${l}), but "${x}" still has ${T} players to play vs ${C}.`)],columnist:[f._c("ld_en_lv_c","chasers_left",`"${n.team_name}" holds #1 on ${s} pts (+${l}), yet "${x}" keeps the pressure on with ${T} players left to feature vs ${C}.`)],analyst:[f._c("ld_en_lv_a","chasers_left",`Lead vulnerability alert: "${n.team_name}" is +${l} pts ahead (${s} vs ${o}) but trails ${C} to ${T} in remaining starters.`)],banter:[f._c("ld_en_lv_x","chasers_left",`Hold that celebration! "${n.team_name}" leads on ${s} pts, but "${x}" (${o} pts) still has ${T} players lurking in the late games vs ${C}.`)]}):C!==null&&C>=T&&C>0?E=S({broadcaster:[f._c("ld_en_cr_b","leader_cruising",`"${n.team_name}" is in full command on ${s} pts (+${l} over "${x}") with ${C} players still to kick a ball!`)],columnist:[f._c("ld_en_cr_c","leader_cruising",`Strength on top of strength: "${n.team_name}" leads on ${s} pts and still holds ${C} starters in reserve vs ${T}.`)],analyst:[f._c("ld_en_cr_a","leader_cruising",`Strong live equity for "${n.team_name}": +${l} pts clear (${s} vs ${o}) with a ${C}-to-${T} starter advantage.`)],banter:[f._c("ld_en_cr_x","leader_cruising",`"${n.team_name}" is cruising on ${s} pts (+${l}) and STILL has ${C} players left — chasers are in trouble!`)]}):C===0&&T===0&&C!==null?E=S({broadcaster:[f._c("ld_en_dn_b","bps_wait",`All eleven starters have played for both contenders! "${n.team_name}" leads "${x}" by ${l} pts (${s} vs ${o}) pending final bonus.`)],columnist:[f._c("ld_en_dn_c","bps_wait",`Every card is on the table: "${n.team_name}" (${s}) holds a ${l}-point edge over "${x}" (${o}) awaiting final BPS confirmation.`)],analyst:[f._c("ld_en_dn_a","bps_wait",`0 starters remaining for both top sides. "${n.team_name}" leads by ${l} pts subject to provisional bonus and auto-subs.`)],banter:[f._c("ld_en_dn_x","bps_wait",`Zero players left for either side! "${n.team_name}" is up ${l} pts — now just pray the bonus gods don't flip it!`)]}):l<=2?E=S({broadcaster:[f._c("ld_en_cl_b","nailbiter",`Razor-thin live race! "${n.team_name}" (${s} pts) edges "${x}" (${o} pts) by just ${l} pt!`)],columnist:[f._c("ld_en_cl_c","nailbiter",`Only ${l} point separates "${n.team_name}" and "${x}" in a riveting live duel at the top.`)],analyst:[f._c("ld_en_cl_a","nailbiter",`Live margin is just ${l} pt (${s} vs ${o}) — single bonus swing territory.`)],banter:[f._c("ld_en_cl_x","nailbiter",`Sweating buckets at the top! "${n.team_name}" clings to a ${l}-point lead over "${x}". Don't blink!`)]}):l>=15?E=S({broadcaster:[f._c("ld_en_bl_b","blowout",`Statement live display from "${n.team_name}" on ${s} pts, opening a ${l}-point cushion over "${x}" behind ${_}.`)],columnist:[f._c("ld_en_bl_c","blowout",`"${n.team_name}" has turned GW ${t} into a procession, surging ${l} pts clear on ${s} pts.`)],analyst:[f._c("ld_en_bl_a","blowout",`Commanding +${l} pts live lead for "${n.team_name}" (${s} vs ${o}), anchored by ${_}.`)],banter:[f._c("ld_en_bl_x","blowout",`Total demolition! "${n.team_name}" is ${l} pts clear on ${s} pts while the rest of the league watches from the mud!`)]}):E=S({broadcaster:[f._c("ld_en_st_b","lead_std",`"${n.team_name}" commands GW ${t} live on ${s} pts, sitting ${l} pts ahead of "${x}" with ${_} leading the charge.`)],columnist:[f._c("ld_en_st_c","lead_std",`Steady authority from "${n.team_name}" on ${s} pts live, holding "${x}" at bay by ${l} pts.`)],analyst:[f._c("ld_en_st_a","lead_std",`Live GW ${t} leader: "${n.team_name}" (${s} pts, +${l} over "${x}") powered by ${_}.`)],banter:[f._c("ld_en_st_x","lead_std",`"${n.team_name}" is bossing GW ${t} live on ${s} pts (+${l} over "${x}") — vibes are immaculate!`)]});else if(W)E=S({broadcaster:[f._c("fn_en_np_b","nonprize",`Guest squad "${P.team_name}" topped raw points on ${P[g]} pts, passing the official GW ${t} crown to "${n.team_name}" (${s} pts).`)],columnist:[f._c("fn_en_np_c","nonprize",`While exhibition side "${P.team_name}" posted ${P[g]} pts, "${n.team_name}" (${s} pts) claims the official weekly honours.`)],analyst:[f._c("fn_en_np_a","nonprize",`Top raw score: "${P.team_name}" (${P[g]} pts, guest). Official prize winner: "${n.team_name}" (${s} pts).`)],banter:[f._c("fn_en_np_x","nonprize",`"${P.team_name}" dropped ${P[g]} pts just for fun, handing the cash crown straight to "${n.team_name}" (${s} pts)!`)]});else if(Q&&!h)E=S({broadcaster:[f._c("fn_en_sk_b","streak",`Relentless consistency! "${n.team_name}" locks up ${U} straight weekly wins with ${s} pts (+${l} over "${x}").`)],columnist:[f._c("fn_en_sk_c","streak",`A mini-dynasty in the making as "${n.team_name}" captures ${U} consecutive gameweeks on ${s} pts.`)],analyst:[f._c("fn_en_sk_a","streak",`${U}-week winning streak confirmed for "${n.team_name}" (${s} pts, +${l} margin) behind ${_}.`)],banter:[f._c("fn_en_sk_x","streak",`Someone stop "${n.team_name}"! ${U} weekly wins in a row (${s} pts) — rest of the league is playing for second!`)]});else if(I==="bboost"||I==="bench_boost")E=[f._c("fn_en_bb","chip_win",`Bench Boost timed to perfection — "${n.team_name}" mobilized all 15 players to claim GW ${t} on ${s} pts.`)];else if(I==="3xc"||I==="triple_captain")E=[f._c("fn_en_tc","chip_win",`Triple Captain jackpot! "${n.team_name}" trusted ${L} with the 3x armband and swept the week on ${s} pts.`)];else if(h&&$.length>1){const B=$.slice(0,3).map(Y=>`"${Y.team_name}"`).join(" & ");E=[f._c("fn_en_jt","joint",`Impossible to separate! ${B} share top honours in GW ${t} level on ${s} pts.`)]}else v?E=S({broadcaster:[f._c("fn_en_ct_b","century",`Century club unlocked! "${n.team_name}" smashed ${s} pts (league avg ${k}) to take GW ${t} powered by ${_}.`)],columnist:[f._c("fn_en_ct_c","century",`A triple-digit masterpiece: "${n.team_name}" breaches 100 with ${s} pts to tower over GW ${t}.`)],analyst:[f._c("fn_en_ct_a","century",`"${n.team_name}" hit ${s} pts (+${s-k} above league avg ${k}) to claim GW ${t} in style.`)],banter:[f._c("fn_en_ct_x","century",`TRIPLE DIGIT BANGER! "${n.team_name}" dropped ${s} pts and embarrassed the entire mini-league!`)]}):l<=2&&c?E=S({broadcaster:[f._c("fn_en_cl_b","nailbiter",`Decided at the wire! "${n.team_name}" (${s} pts) edged "${x}" (${o} pts) by just ${l} pt in GW ${t}.`)],columnist:[f._c("fn_en_cl_c","nailbiter",`Decided by the finest margin: "${n.team_name}" (${s} pts) outlasted "${x}" (${o} pts) by ${l} pt.`)],analyst:[f._c("fn_en_cl_a","nailbiter",`GW ${t} settled by ${l} pt (${s} vs ${o}), with ${_} providing the winning margin.`)],banter:[f._c("fn_en_cl_x","nailbiter",`Daylight robbery! "${n.team_name}" (${s} pts) snatched GW ${t} from "${x}" (${o} pts) by ${l} pt. Brutal way to lose!`)]}):l<=5&&c?E=S({broadcaster:[f._c("fn_en_md_b","mid_close",`Tight battle to the end! "${n.team_name}" took GW ${t} on ${s} pts, ${l} ahead of "${x}".`)],columnist:[f._c("fn_en_md_c","mid_close",`Cool heads prevailed as "${n.team_name}" (${s} pts) fended off "${x}" (${o} pts) by ${l} pts.`)],analyst:[f._c("fn_en_md_a","mid_close",`Competitive ${l}-pt margin (${s} vs ${o}) gives "${n.team_name}" the GW ${t} win.`)],banter:[f._c("fn_en_md_x","mid_close",`Close, but no cigar for "${x}"! "${n.team_name}" locked it up on ${s} pts (+${l}).`)]}):l>=15?E=S({broadcaster:[f._c("fn_en_bl_b","blowout",`Commanding win in GW ${t}! "${n.team_name}" posted ${s} pts to finish ${l} pts clear of "${x}".`)],columnist:[f._c("fn_en_bl_c","blowout",`Utter dominance from "${n.team_name}" on ${s} pts, leaving "${x}" ${l} pts adrift.`)],analyst:[f._c("fn_en_bl_a","blowout",`Decisive +${l} pts gap for "${n.team_name}" (${s} pts vs avg ${k}) led by ${_}.`)],banter:[f._c("fn_en_bl_x","blowout",`Not a contest, a crime scene! "${n.team_name}" dropped ${s} pts and buried "${x}" by ${l} pts!`)]}):s<50?E=S({broadcaster:[f._c("fn_en_lw_b","grind",`In a low-scoring grind (league avg ${k} pts), "${n.team_name}" ground out ${s} pts to take the week by ${l} pts.`)],columnist:[f._c("fn_en_lw_c","grind",`Survival of the steadiest: "${n.team_name}" scraped ${s} pts amidst widespread blanks to win GW ${t}.`)],analyst:[f._c("fn_en_lw_a","grind",`Low league baseline (${k} pts avg) made "${n.team_name}"'s ${s} pts enough for #1 (+${l}).`)],banter:[f._c("fn_en_lw_x","grind",`Ugly slog of a week (avg ${k} pts), yet "${n.team_name}" crawled out alive on ${s} pts to take the win!`)]}):E=S({broadcaster:[f._c("fn_en_st_b","lead_std",`Full-time triumph for "${n.team_name}", claiming GW ${t} on ${s} pts (${l} ahead of "${x}") behind ${_}.`)],columnist:[f._c("fn_en_st_c","lead_std",`Composed execution from "${n.team_name}", sealing GW ${t} on ${s} pts ahead of "${x}" by ${l} pts.`)],analyst:[f._c("fn_en_st_a","lead_std",`GW ${t} winner: "${n.team_name}" (${s} pts, +${s-k} vs avg) driven by ${_}.`)],banter:[f._c("fn_en_st_x","lead_std",`Easy work for "${n.team_name}", banking ${s} pts and leaving "${x}" ${l} pts behind!`)]});const A=r(E,111),F=[];if(u.overallContext&&u.overallContext.leaderChanged){const B=u.overallContext;F.push(f._c("md_en_ov1","overall_swing",`Big movement at the top overall: "${B.currLeaderName}" overtakes "${B.prevLeaderName}" to seize #1 on ${B.currLeaderPts} pts.`))}if(y&&u.topProvBonus){const B=u.topProvBonus,Y=B.owners.length===1?"league squad":"league squads";F.push(f._c("md_en_pb1","bonus_watch",`Bonus watch: ${B.name} currently holds +${B.bonus} provisional BPS for ${B.owners.length} ${Y}.`))}if(u.autoSubHeroes.length>0){const B=u.autoSubHeroes[0];F.push(f._c("md_en_as1","autosub",`Auto-sub lifeline: ${B.player} stepped off the bench for "${B.team}" to deliver +${B.pts} pts.`))}if(u.vcRegrets.length>0){const B=u.vcRegrets[0];F.push(f._c("md_en_vc1","captain_regret",`Captaincy regret for "${B.team}" — vice-captain ${B.vcName} (${B.vcRaw} pts) outscored captain ${B.capName} (${B.capRaw} pts), leaving ${B.lostPts} pts behind.`))}if(u.txMaster&&F.push(f._c("md_en_tx1","tx_win",`Sharpest transfer business belongs to "${u.txMaster.team_name}" with +${u.txMaster.transfers_net_impact} net gain.`)),u.benchKing&&F.push(f._c("md_en_bn1","bench_pain",`"${u.benchKing.team_name}" watched ${u.benchKing.bench_points} points go unused on the substitutes bench.`)),u.redCardVictims.length>0){const B=u.redCardVictims[0];F.push(f._c("md_en_rc1","red_card",`Ouch for "${B.team}" as ${B.player} suffered a negative haul (${B.pts} pts).`))}if(m&&m.entry_id!==n.entry_id&&d.length>3){const B=Number(m[g]||0);F.push(f._c("md_en_bt1","bottom",`Down in last place this week sits "${m.team_name}" on ${B} pts.`))}let q=[],j="";if(F.length>0){const B=r(F,121);if(B&&(j=B.text,q.push(B.id)),F.length>=3&&(w%2===1||y)){const Y=r(F.filter(X=>X.id!==B?.id),125);Y&&(j+=` ${Y.text}`,q.push(Y.id))}}const R=D?{broadcaster:[f._c("ed_en_fb1","end","Full-time across the league — on to the next deadline!"),f._c("ed_en_fb2","end",`That wraps up GW ${t} in dramatic fashion — see you next weekend!`),f._c("ed_en_fb3","end","Official scores locked in; reset the watchlist and go again next round!"),f._c("ed_en_fb4","end",`The final whistle sounds on GW ${t} — momentum carries straight into next week!`)],columnist:[f._c("ed_en_fc1","end","The table never lies; next week writes a fresh chapter."),f._c("ed_en_fc2","end","Thirty-eight chapters make a champion, and this one left plenty to ponder."),f._c("ed_en_fc3","end","Form is temporary, positioning is everything as the next deadline approaches."),f._c("ed_en_fc4","end","Lessons learned in red ink often pay dividends by spring.")],analyst:[f._c("ed_en_fa1","end","Time to review 3-week fixture swings before prices shift."),f._c("ed_en_fa2","end","Check the Transfer Advisor tab to spot undervalued targets ahead of price changes."),f._c("ed_en_fa3","end","Audit minutes played and underlying xGI before committing early transfers."),f._c("ed_en_fa4","end","Every point gained now compounds across the upcoming fixture turn.")],banter:[f._c("ed_en_fx1","end","Screenshot the table and enjoy the group chat fallout!"),f._c("ed_en_fx2","end","Winner takes the bragging rights, everyone else back to the drawing board!"),f._c("ed_en_fx3","end","Dry your eyes, lads — there's always next weekend to bottle it all over again!"),f._c("ed_en_fx4","end","No excuses left on the board; see you before the next deadline!")]}:{broadcaster:[f._c("ed_en_lb1","end","Plenty of live minutes still left — keep watching the bonus and auto-subs!"),f._c("ed_en_lb2","end","Live action keeps rolling with every goal and BPS update!"),f._c("ed_en_lb3","end","Stay tuned as late fixtures threaten to shake up the standings!"),f._c("ed_en_lb4","end","Still plenty of twists waiting before full-time across the league!")],columnist:[f._c("ed_en_lc1","end","Nothing is settled until the final whistle of the gameweek."),f._c("ed_en_lc2","end","Provisional tables flatter early leaders; true verdicts arrive on Monday night."),f._c("ed_en_lc3","end","Late drama has a habit of rewriting the most comfortable scripts."),f._c("ed_en_lc4","end","Patience remains a virtue until every starter has left the pitch.")],analyst:[f._c("ed_en_la1","end","Open the 1v1 Rival view to track every remaining differential player."),f._c("ed_en_la2","end","Provisional bonus and pending auto-subs remain the biggest live variance drivers."),f._c("ed_en_la3","end","Track remaining starters in the pinned My Team bar to gauge comeback odds."),f._c("ed_en_la4","end","Watch BPS thresholds closely — a single +3 swing can flip tight matchups.")],banter:[f._c("ed_en_lx1","end","Don't celebrate early — one late goal can ruin someone's entire weekend!"),f._c("ed_en_lx2","end","Fire up the 1v1 Battle Card and screenshot it straight to your rival!"),f._c("ed_en_lx3","end","Hold onto your hats, late kickoffs are coming for someone's lead!"),f._c("ed_en_lx4","end","Still plenty of time for chaos and questionable VAR decisions!")]},G=r(R[b]||R.broadcaster,131);return{text:j?`${A.text} ${j} ${G.text}`:`${A.text} ${G.text}`,leadId:A.id,midIds:q,endId:G.id}}static generateMatchupVerdict({nameA:e,nameB:t,scoreA:a,scoreB:r,remA:p,remB:i,overallDiff:d,isLive:n,isFinished:c,diffCountA:m,diffCountB:s,isEn:o}){const l=f._clean,g=l(e),y=l(t),D=a-r,h=Math.abs(D);if(c){if(D===0){const I=d>=0?`"${g}" holds the overall edge`:`"${y}" stays ahead overall`,L=d>=0?`"${g}" ยังคุมความได้เปรียบในตารางรวม`:`"${y}" ยังนำในตารางรวมอยู่`;return o?`Dead even at ${a} pts apiece — ${I}.`:`คู่นี้เสมอกันเป๊ะ ${a} แต้ม — ${L}`}const $=D>0?g:y,v=D>0?y:g;return h<=3?o?`"${$}" edged "${v}" by a razor-thin ${h} pts in a thriller decided by tiny margins.`:`"${$}" เฉือน "${v}" ไปแบบหวุดหวิดแค่ ${h} แต้ม ตัดสินกันที่รายละเอียดเล็กน้อย!`:h>=18?o?`Dominant week for "${$}", outscoring "${v}" by ${h} pts across their differential picks.`:`สัปดาห์นี้ "${$}" ทิ้งขาด "${v}" ถึง ${h} แต้ม จากความต่างของตัวทีเด็ดชัดเจน!`:o?`"${$}" took the head-to-head by ${h} pts (${a} vs ${r}).`:`"${$}" ชนะศึกดวลตัวต่อตัวสัปดาห์นี้ไป ${h} แต้ม (${a} ต่อ ${r})`}if(n){if(D===0){if(p!==i){const k=p>i?g:y,x=Math.max(p,i);return o?`Level on ${a} pts live, but "${k}" holds ${x} starters left to swing it.`:`แต้มสดเท่ากันที่ ${a} แต้ม แต่ "${k}" มีตัวรอลงเตะเหลือ ${x} คน ได้เปรียบลุ้นแซง!`}return o?`Locked at ${a} pts live with ${m+s} differential slots set to decide it.`:`แต้มสดชนกันที่ ${a} แต้ม วัดกันที่ตัวต่าง ${m+s} จุดในเกมที่เหลือ`}const $=D>0?g:y,v=D>0?y:g,I=D>0?p:i,L=D>0?i:p;return L>I?o?`"${$}" leads by ${h} pts live, yet "${v}" still has ${L} players left vs ${I} to stage a comeback!`:`"${$}" นำสดอยู่ ${h} แต้ม แต่ "${v}" ยังเหลือตัวรอเตะอีก ${L} คน (เทียบกับ ${I}) มีลุ้นพลิก!`:o?`"${$}" leads by ${h} pts live with ${I} players left vs ${L} for "${v}".`:`"${$}" คุมความได้เปรียบนำสด ${h} แต้ม และเหลือตัวเตะ ${I} คน ต่อ ${L} คนของ "${v}"`}return o?`${m+s} differential positions separate "${g}" and "${y}" heading into kickoff.`:`คู่นี้มีตัวต่างชี้ชะตารวม ${m+s} ตำแหน่ง รอวัดกันหลังนกหวีดเริ่มเกม!`}};Ke(f,"_refreshStep",0),Ke(f,"_recentSignatures",new Map),Ke(f,"_personaCursor",new Map),Ke(f,"PERSONAS",[{id:"broadcaster",labelTh:"พากษ์สดข้างสนาม",labelEn:"Live Broadcaster",tone:"clean"},{id:"columnist",labelTh:"กูรูคอลัมนิสต์",labelEn:"Veteran Columnist",tone:"clean"},{id:"analyst",labelTh:"นักวิเคราะห์แท็กติก",labelEn:"Tactical Analyst",tone:"clean"},{id:"banter",labelTh:"สายปั่นวงเพื่อน",labelEn:"Locker-Room Banter",tone:"spicy"}]);let LiveCommentaryEngine=f;function resolveWorkerApiBase(Ce="https://api.fplsawadika.com"){try{if(typeof window>"u"||!window.location)return{base:Ce,isOverride:!1,isNonProdTarget:!1};const e=String(window.location.hostname||"").toLowerCase();if(!(String(window.location.protocol||"").toLowerCase()==="file:"||!e||e==="localhost"||e==="127.0.0.1"||e==="::1"||e==="[::1]"||e==="0.0.0.0"||e.endsWith(".local")))return{base:Ce,isOverride:!1,isNonProdTarget:!1};let r="";if(window.location.search){const p=new URLSearchParams(window.location.search).get("api");if(p!==null){const i=p.trim();if(i==="reset"||i==="prod"||i==="")try{sessionStorage.removeItem("fpl_dev_api_base")}catch{}else r=i==="local"||i==="staging"?"http://127.0.0.1:8787":i}}if(!r)try{r=sessionStorage.getItem("fpl_dev_api_base")||""}catch{}if(r){const p=new URL(r),i=p.hostname.toLowerCase();if(p.protocol==="http:"&&(i==="127.0.0.1"||i==="localhost")||p.protocol==="https:"&&(i.endsWith(".workers.dev")||i==="api.fplsawadika.com"||i.endsWith(".fplsawadika.com"))){const n=p.origin;try{sessionStorage.setItem("fpl_dev_api_base",n)}catch{}return{base:n,isOverride:!0,isNonProdTarget:!(i==="api.fplsawadika.com"||i==="fpl-live-relay.asawamanasak.workers.dev")}}}}catch{}return{base:Ce,isOverride:!1,isNonProdTarget:!1}}const FPL_TEAM_CODES={ARS:3,AVL:7,BOU:91,BRE:94,BHA:36,CHE:8,COV:9,CRY:31,EVE:11,FUL:54,HUL:88,IPS:40,LEE:2,LEI:13,LIV:14,MCI:43,MUN:1,NEW:4,NFO:17,SOU:20,TOT:6,SUN:56,WHU:21,WOL:39};class StandaloneApp{constructor(e,t,a){this.multiData=e,this.configs=t;let r=this.detectPathLeague(),p="",i="",d="";try{if(typeof URLSearchParams<"u"&&window.location&&window.location.search){const h=new URLSearchParams(window.location.search);p=h.get("league")||"",i=h.get("tab")||"",d=h.get("gw")||""}}catch{}let n="",c="";if(window.location&&window.location.hash){const h=window.location.hash.replace("#","");if(this.multiData.leagues[h])n=h;else if(h.includes("tab="))try{c=new URLSearchParams(h.split("?")[1]||h).get("tab")||""}catch{}else h&&(c=h)}let m="",s="";try{typeof localStorage<"u"&&(m=localStorage.getItem("fpl_mini_active_league")||"",s=localStorage.getItem("fpl_mini_active_tab")||"")}catch{}r&&this.multiData.leagues[r]?this.activeLeagueId=r:p&&this.multiData.leagues[p]?this.activeLeagueId=p:n&&this.multiData.leagues[n]?this.activeLeagueId=n:m&&this.multiData.leagues[m]?this.activeLeagueId=m:a&&this.multiData.leagues[a]?this.activeLeagueId=a:this.activeLeagueId=this.getDefaultLeagueId(),this.data=this.multiData.leagues[this.activeLeagueId]||Object.values(this.multiData.leagues)[0]||{},this.config=this.configs[this.activeLeagueId]||Object.values(this.configs)[0]||{},this.config.features||(this.config.features={});const o=String(this.data&&this.data.name||this.config&&this.config.name||"").slice(0,80);typeof this.recordRecentLeague=="function"&&this.recordRecentLeague(this.activeLeagueId,o);const l=Number(this.multiData.max_gw)||2,g=Number(d);this._hasExplicitQueryGW=g>=1&&g<=l,this._hasExplicitQueryGW?this.selectedGW=g:this.selectedGW=this.resolveDefaultGW(this.data);const y=(this.config&&this.config.monthly_schedule||[]).find(h=>h.gw_list&&h.gw_list.includes(this.selectedGW));this.selectedMonthId=y?y.id:1,this.matchdayChunkLimit=40,this.overallChunkLimit=40,this.prizesSearchQuery="",this.prizesFilterMode="all",this.prizesHistoryExpanded=!1,this.cupSearchQuery="",this.cupFilterMode="all";let D=this.normalizeTab(i||c||s||"gameweek-view");!this.hasShi62Feature()&&D==="shi62-special-view"&&(D="gameweek-view"),!this.hasBramannPredFeature()&&D==="bramann-prediction-view"&&(D="gameweek-view"),!this.hasBramannChalFeature()&&D==="bramann-challenge-view"&&(D="gameweek-view"),!this.hasDevCornerFeature()&&D==="about-view"&&(D="gameweek-view"),this.activeTab=D,this.liveNotesCache={},this.shi62Data=typeof SHI62_SPECIAL_DATA<"u"?SHI62_SPECIAL_DATA:null,this.bramannPredData=typeof BRAMANN_PREDICTION_DATA<"u"?BRAMANN_PREDICTION_DATA:null,this.bramannChalData=typeof BRAMANN_CHALLENGE_DATA<"u"?BRAMANN_CHALLENGE_DATA:null,this.activeShi62GW=null,this.activeBramannPredGW=null,this.activeBramannChalGW=null,this.radarSearchQuery="",this.radarLeagueFilter="all",this.radarSortBy="total_net",this.radarSortOrder="desc",this.hofSearchQuery="",this.hofFilterMode="all",this.hofSortBy="total_net",this.hofSortOrder="desc",this.hofCachedStats=[],this.prizesSearchQuery="",this.prizesFilterMode="all",this.prizesHistoryExpanded=!1,this.cupSearchQuery="",this.cupFilterMode="all",this._dataVersion=0,this._renderedState={}}resolveDefaultGW(e=this.data){const t=Number(this.multiData&&this.multiData.max_gw)||2,a=e&&e.gameweeks?e.gameweeks[String(t)]:null;return!(a?a.is_started!==void 0?!!a.is_started:!!a.is_finished||a.results&&a.results.some(p=>p.points>0):!1)&&t>1?t-1:t}getDefaultLeagueId(){const e=this.configs||{};for(const[a,r]of Object.entries(e))if(r&&r.is_default)return String(a);const t=this.multiData&&Array.isArray(this.multiData.league_order)?this.multiData.league_order:Object.keys(e);return t.length>0?String(t[0]):"40700"}isLeaguePaused(e=this.activeLeagueId){const t=this.configs&&this.configs[String(e)]||(String(e)===String(this.activeLeagueId)?this.config:null)||{};return String(t.status||"active").toLowerCase()==="paused"}isLeagueTrial(e=this.activeLeagueId){const t=this.configs&&this.configs[String(e)]||(String(e)===String(this.activeLeagueId)?this.config:null)||{};return String(t.status||"active").toLowerCase()==="trial"}getLeagueCurrency(){const e=this.config||{},t=e.features&&typeof e.features=="object"?e.features:{},a=e.currency||t.currency||"THB",r=String(a||"THB").trim().toUpperCase()==="USD"?"USD":"THB";return{code:r,symbol:r==="USD"?"$":"฿"}}getWeeklyPenaltyTiers(){const t=(this.config&&this.config.features||{}).weekly_penalty_tiers;if(Array.isArray(t)){const a=t.map(Number).filter(r=>Number.isFinite(r)&&r>0);if(a.length>0)return a}else if(t&&typeof t=="object"){const r=Object.keys(t).sort((p,i)=>{const d=p.match(/^last_(\d+)$/),n=i.match(/^last_(\d+)$/);return d&&n?Number(d[1])-Number(n[1]):d?-1:n?1:p.localeCompare(i)}).map(p=>Number(t[p])).filter(p=>Number.isFinite(p)&&p>0);if(r.length>0)return r}return[600,500,400,300,200]}getMonthlySchedule(){const e=this.config||{},t=this.currentLang==="en";if(Array.isArray(e.monthly_schedule)&&e.monthly_schedule.length>0){const m={สิงหาคม:"Aug",กันยายน:"Sep",ตุลาคม:"Oct",พฤศจิกายน:"Nov",ธันวาคม:"Dec",มกราคม:"Jan",กุมภาพันธ์:"Feb",มีนาคม:"Mar",เมษายน:"Apr",พฤษภาคม:"May"};return e.monthly_schedule.map((s,o)=>{let l=String(t&&s.month_en?s.month_en:s.month||s.name||`Month ${o+1}`);return t&&!s.month_en&&Object.entries(m).forEach(([g,y])=>{l.includes(g)&&(l=l.replace(g,y))}),{...s,id:s.id!==void 0?s.id:s.month!==void 0&&typeof s.month=="number"?s.month:o+1,month:l}})}const a=e.features||{},r=this.getLeagueCurrency(),p=Number(a.monthly_champion_prize??a.monthly_prize_amount??600),i=a.monthly_runner_up_prize!==void 0&&a.monthly_runner_up_prize!==null?Number(a.monthly_runner_up_prize):a.monthly_champion_prize!==void 0?0:400,d=p+i,n=i>0?t?`${d.toLocaleString()} ${r.code} (Champ ${p.toLocaleString()} / Runner ${i.toLocaleString()})`:`${d.toLocaleString()} ${r.code} (แชมป์ ${p.toLocaleString()} / รอง ${i.toLocaleString()})`:`${d.toLocaleString()} ${r.code}`;return[{id:1,monthTh:"สิงหาคม 2026",monthEn:"Aug 2026",gw_list:[1,2,3]},{id:2,monthTh:"กันยายน 2026",monthEn:"Sep 2026",gw_list:[4,5,6]},{id:3,monthTh:"ตุลาคม 2026",monthEn:"Oct 2026",gw_list:[7,8,9]},{id:4,monthTh:"พฤศจิกายน 2026",monthEn:"Nov 2026",gw_list:[10,11,12,13]},{id:5,monthTh:"ธันวาคม 2026",monthEn:"Dec 2026",gw_list:[14,15,16,17,18,19]},{id:6,monthTh:"มกราคม 2027",monthEn:"Jan 2027",gw_list:[20,21,22,23,24]},{id:7,monthTh:"กุมภาพันธ์ 2027",monthEn:"Feb 2027",gw_list:[25,26,27,28]},{id:8,monthTh:"มีนาคม 2027",monthEn:"Mar 2027",gw_list:[29,30,31]},{id:9,monthTh:"เมษายน 2027",monthEn:"Apr 2027",gw_list:[32,33,34,35]},{id:10,monthTh:"พฤษภาคม 2027",monthEn:"May 2027",gw_list:[36,37,38]}].map(m=>({id:m.id,month:t?m.monthEn:m.monthTh,gws:`GW ${m.gw_list[0]} - ${m.gw_list[m.gw_list.length-1]}`,gw_list:m.gw_list,budget:n}))}getSeasonPrizeSummary(e){const t=this.config||{},a=this.getLeagueCurrency(),r=t.season_prizes&&typeof t.season_prizes=="object"?t.season_prizes:null,p=t.season_total_prize!==void 0&&t.season_total_prize!==null&&String(t.season_total_prize).trim()!=="",i=!!(r&&Object.keys(r).length>0),d=!!(t.season_prize_desc&&String(t.season_prize_desc).trim()!=="");if(!p&&!i&&!d)return{total:null,desc:""};let n=p?String(t.season_total_prize).trim():null;if(!n&&i){let m=0;Object.values(r).forEach(s=>{const o=Number(String(s).replace(/[^0-9.-]/g,""));Number.isFinite(o)&&(m+=o)}),n=m>0?m.toLocaleString():"0"}let c=d?String(t.season_prize_desc).trim():"";if(!c&&i){const m={"1st":"ที่ 1","2nd":"ที่ 2","3rd":"ที่ 3","4th":"ที่ 4","5th":"ที่ 5"};c=Object.entries(r).map(([s,o])=>`${e?s:m[s]||s}: ${String(o).replace(/\s*(THB|USD)\s*$/i,"").trim()}`).join(" / ")+` ${a.code}`}return{total:n,desc:c}}renderPausedOverlay(e){const t=document.getElementById("paused-league-overlay"),a=document.getElementById("header-tabs-bar"),r=document.querySelectorAll(".tab-content");if(a&&a.classList.toggle("hidden",e),a&&(a.style.display=e?"none":""),!t)return;if(!e){t.classList.add("hidden"),t.innerHTML="",r.forEach(s=>{s.style.display=""});return}r.forEach(s=>{s.classList.add("hidden"),s.style.display="none"});const p=this.currentLang==="en",i=this.escapeHtml(this.data&&this.data.name||this.config&&this.config.name||`League ${this.activeLeagueId}`),d=typeof SITE_LINE_URL<"u"&&SITE_LINE_URL?SITE_LINE_URL:"https://line.me/ti/p/lgWPeyIBR7",n=this.getAssetPrefix(),m=typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${n}index.html`:n;t.classList.remove("hidden"),t.innerHTML=`
          <div class="max-w-xl mx-auto my-8 sm:my-14 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-4">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="space-y-1.5">
              <span class="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ${p?"LEAGUE PAUSED":"ปิดปรับปรุง / พักการใช้งานชั่วคราว"}
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">${i}</h2>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                ${p?"Live updates for this mini-league dashboard are currently paused or awaiting season renewal.":"แดชบอร์ดมินิลีกนี้อยู่ระหว่างพักการอัปเดตชั่วคราวหรือรอการต่ออายุฤดูกาล หากคุณเป็นผู้ดูแลลีก สามารถติดต่อทีมงานเพื่อเปิดใช้งานได้ทันที"}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a href="${this.escapeHtml(d)}" target="_blank" rel="noopener noreferrer" style="background-color: #06C755;" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl hover:brightness-95 text-white text-xs sm:text-sm font-bold shadow-sm transition-all">
                <span>${p?"Renew / Contact via LINE":"ติดต่อต่ออายุ / เปิดลีกผ่าน LINE"}</span>
              </a>
              <a href="${this.escapeHtml(m)}" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors">
                <span>${p?"Back to Home":"กลับหน้าแรก FPLSaWaDiKa"}</span>
              </a>
            </div>
          </div>
        `}hasShi62Feature(e=this.activeLeagueId){const t=this.configs&&this.configs[String(e)]||(String(e)===String(this.activeLeagueId)?this.config:null);return!!(t&&t.features&&t.features.has_shi62_special||(!t||!t.features)&&String(e)==="187827")}hasBramannPredFeature(e=this.activeLeagueId){const t=this.configs&&this.configs[String(e)]||(String(e)===String(this.activeLeagueId)?this.config:null);return!!(t&&t.features&&t.features.has_bramann_prediction||(!t||!t.features)&&String(e)==="5349")}hasBramannChalFeature(e=this.activeLeagueId){const t=this.configs&&this.configs[String(e)]||(String(e)===String(this.activeLeagueId)?this.config:null);return!!(t&&t.features&&t.features.has_bramann_challenge||(!t||!t.features)&&String(e)==="5349")}hasDevCornerFeature(e=this.activeLeagueId){const t=this.configs&&this.configs[String(e)]||(String(e)===String(this.activeLeagueId)?this.config:null);return t&&t.visibility==="private"?!1:!!(t&&t.features&&t.features.has_dev_corner||(!t||!t.features)&&String(e)==="40700")}getTeamLogoUrl(e){if(!e)return"";let t=String(e).trim();if(t.startsWith("http://")||t.startsWith("https://"))return t;if(t.includes("/")?t.startsWith("./")?t=t.substring(2):t.startsWith("../")?t=t.substring(3):t.startsWith("/")&&(t=t.substring(1)):t=`images/teams/${t.toLowerCase()}.png`,typeof window<"u"&&window.location&&(window.location.protocol==="http:"||window.location.protocol==="https:"))return`${window.location.pathname.includes("/fpl-mini")?"/fpl-mini/":"/"}${t}`;const a=Object.keys(this.configs||{});return`${!!(typeof window<"u"&&window.location&&window.location.pathname&&a.some(i=>window.location.pathname.includes("/"+i+"/")||window.location.pathname.endsWith("/"+i)))?"../":"./"}${t}`}normalizeTab(e){if(!e)return"gameweek-view";let t=String(e).trim().toLowerCase(),a=t.endsWith("-view")?t.slice(0,-5):t;const r=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2);return r&&(a==="highlight"||a==="highlights"||a==="weekly-highlight"||a==="competition"||a==="comp"||a==="chips"||a==="chip"||a==="transfers"||a==="transfer"||a==="transfer-analytics"||a==="prize"||a==="prizes"||a==="reward"||a==="rewards"||a==="hof"||a==="hall-of-fame"||a==="halloffame"||a==="global-radar"||a==="radar"||a==="global"||a==="all-leagues"||a==="consistency-radar"||a==="consistency"||a==="cup"||a==="shi62"||a==="shi62-special"||a==="bramann-prediction"||a==="bramann-challenge")||!(!r&&!!(this.config&&this.config.features&&(this.config.features.prize_model==="bramann_dual_prize"||this.config.features.has_weekly_prizes||this.config.features.has_monthly_prizes||this.config.features.has_settlement_phases||this.config.features.has_weekly_penalties)||this.config&&this.config.total_pool&&this.config.total_pool!=="-"&&!String(this.config.total_pool).includes("เสื้อบอล")&&!String(this.config.entry_fee).includes("ฟรี")))&&(a==="prize"||a==="prizes"||a==="reward"||a==="rewards")||a==="live"||a==="gw"||a==="gameweek"?"gameweek-view":a==="highlight"||a==="highlights"||a==="weekly-highlight"?"highlights-view":a==="competition"||a==="comp"||a==="standings"||a==="chips"||a==="chip"?"competition-view":a==="transfers"||a==="transfer"||a==="transfer-analytics"?"transfers-view":a==="transfer-advisor"||a==="advisor"||a==="transfer-suggestions"||a==="suggestions"||a==="recommend"?"transfer-advisor-view":a==="prize"||a==="prizes"||a==="reward"||a==="rewards"?"prizes-view":a==="hof"||a==="hall-of-fame"||a==="halloffame"?"hall-of-fame-view":a==="global-radar"||a==="radar"||a==="global"||a==="all-leagues"||a==="consistency-radar"||a==="consistency"?"global-radar-view":a==="cup"?"cup-view":a==="shi62"||a==="shi62-special"||a==="special"||a==="beta"?this.hasShi62Feature()?"shi62-special-view":"gameweek-view":a==="bramann-prediction"||a==="bramann-pred"?this.hasBramannPredFeature()?"bramann-prediction-view":"gameweek-view":a==="bramann-challenge"||a==="bramann-chal"||a==="chal"||a==="challenge"?this.hasBramannChalFeature()?"bramann-challenge-view":"gameweek-view":a==="pred"||a==="prediction"?this.hasShi62Feature()?"shi62-special-view":this.hasBramannPredFeature()?"bramann-prediction-view":"gameweek-view":a==="rule"||a==="rules"?"rules-view":a==="about"||a==="about-us"||a==="about-me"||a==="feature"||a==="features"||a==="function"||a==="functions"||a==="capabilities"||a==="dev"||a==="dev-corner"?this.hasDevCornerFeature()?"about-view":"gameweek-view":t.endsWith("-view")?t:t+"-view"}detectPathLeague(){if(typeof window<"u"&&window.location&&window.location.pathname){const e=window.location.pathname.split("/").filter(Boolean);for(let t of e)if(this.multiData&&this.multiData.leagues&&this.multiData.leagues[t])return t}return""}init(){if(this.initLanguage(),this.initTheme(),this.renderLeagueDropdown(),this.updateHeaderInfo(),this.isLeaguePaused()){typeof this.renderFooterCta=="function"&&this.renderFooterCta(),this.initDeadlineCountdown();return}this.initTabNavigation(),this.renderAll(),this.activeTab&&this.switchTab(this.activeTab,!0,!0),this.initDeadlineCountdown();const e=String(this.activeLeagueId),t=!!(this.config&&this.config.tier===2)||!!(this.data&&this.data.tier===2),a=t?!!(this.data&&this.data.teams&&this.data.teams.length>0):!!(this.data&&this.data.squads&&Object.keys(this.data.squads).length>0);a&&this.initLivePolling(),a?t?Promise.all([this.ensureTier2GWChunk(this.selectedGW),this.ensureTier2PicksChunk(this.selectedGW,e)]).then(([r,p])=>{(r||p)&&String(this.activeLeagueId)===e&&this.renderAll()}):this.hasTier1SquadsForGw(this.data,this.selectedGW)||this.ensureTier1GWSquads(this.selectedGW,e).then(r=>{r&&String(this.activeLeagueId)===e&&this.renderAll()}):(this._isLoadingLeague=e,this.renderAll(),this.fetchLeagueData(e,2).then(async r=>{if(this._isLoadingLeague===e&&(this._isLoadingLeague=null),r&&String(this.activeLeagueId)===e)this._hasExplicitQueryGW||(this.selectedGW=this.resolveDefaultGW(r)),await this.ensureTier2GWChunk(this.selectedGW),t?await this.ensureTier2PicksChunk(this.selectedGW,e):await this.ensureTier1GWSquads(this.selectedGW,e),this.updateHeaderInfo(),this.initLivePolling(),this.renderAll();else if(!r&&String(this.activeLeagueId)===e&&(this.renderAll(),!(typeof window<"u"&&window.location&&window.location.protocol==="file:")&&typeof this.showToast=="function")){const i=this.currentLang==="en";this.showToast(i?"Could not load league data. Please check your connection.":"ไม่สามารถโหลดข้อมูลของลีกได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต","error")}})),this.ensureSpecialFeatureData(this.activeLeagueId).then(r=>{r&&this.renderAll()}),this.activeTab==="transfer-advisor-view"&&typeof this.ensureTransferSuggestionsData=="function"&&this.ensureTransferSuggestionsData().then(r=>{r&&this.activeTab==="transfer-advisor-view"&&this.renderCurrentTab(!0)}),typeof window<"u"&&window.addEventListener&&!this._popstateBound&&(this._popstateBound=!0,window.addEventListener("popstate",async()=>{try{this.currentModalEntryId&&this.closeTeamModal(),this._rivalState&&this._rivalState.isOpen&&typeof this.closeRivalModal=="function"&&this.closeRivalModal();const r=new URLSearchParams(window.location&&window.location.search?window.location.search:""),p=r.get("league")||this.detectPathLeague(),i=this.normalizeTab(r.get("tab")),d=r.get("gw");p&&this.multiData.leagues[p]&&p!==this.activeLeagueId&&await this.switchLeague(p,!0),i&&i!==this.activeTab&&this.switchTab(i,!0),d&&Number(d)!==this.selectedGW&&await this.selectGW(Number(d),!0)}catch{}}))}initDeadlineCountdown(){typeof window>"u"||(this._deadlineInterval&&clearInterval(this._deadlineInterval),this.updateDeadlineCountdown(),this._deadlineInterval=setInterval(()=>{this.updateDeadlineCountdown()},1e3))}updateHeaderDeadline(){const e=document.getElementById("header-deadline-badge"),t=document.getElementById("header-deadline-val");if(!t)return;const a=this.multiData&&this.multiData.next_deadline?this.multiData.next_deadline:null;if(!a||!a.deadline_epoch){e&&e.classList.add("hidden");return}const r=this.currentLang==="en",p=a.id||10,i=Math.floor(Date.now()/1e3),d=a.deadline_epoch-i;if(e&&(e.title=r?`Gameweek ${p} Team Selection Deadline`:`เส้นตายการจัดทีม Gameweek ${p}`),d<=0){t.innerText=r?`GW ${p} Deadline: Passed`:`เส้นตาย GW ${p}: ปิดรับแล้ว`,e&&(e.className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs"),this._deadlineInterval&&(clearInterval(this._deadlineInterval),this._deadlineInterval=null);return}const n=Math.floor(d/86400),c=Math.floor(d%86400/3600),m=Math.floor(d%3600/60),s=d%60,o=y=>String(y).padStart(2,"0"),l=`${o(c)}:${o(m)}:${o(s)}`;let g="";n>0?g=r?`GW ${p} Deadline: ${n}d ${l}`:`เส้นตาย GW ${p}: ${n} วัน ${l}`:g=r?`GW ${p} Deadline: ${l}`:`เส้นตาย GW ${p}: ${l}`,t.innerText=g,e&&(d<7200?e.className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800/60 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs animate-pulse max-w-full":e.className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 sm:px-2.5 py-0.5 rounded-full font-display shadow-2xs max-w-full")}updateDeadlineCountdown(){typeof document<"u"&&document.hidden||this.updateHeaderDeadline()}setLivePollCadence(e){const t=Number(e)>=9e4?9e4:2e4;this._currentPollIntervalMs===t&&this.livePollInterval||(this._currentPollIntervalMs=t,this.livePollInterval&&(clearInterval(this.livePollInterval),this.livePollInterval=null),!(typeof window>"u"||this.isLeaguePaused()||!this.isLiveWindowActive()||!this._checkAndPollLiveFn)&&(this.livePollInterval=setInterval(this._checkAndPollLiveFn,t),this._nextLivePollAt=Date.now()+t))}initLivePolling(){if(typeof window>"u"||typeof fetch>"u")return;if(this.isLeaguePaused()){this.livePollInterval&&(clearInterval(this.livePollInterval),this.livePollInterval=null);return}const e=2e4;this._currentPollIntervalMs||(this._currentPollIntervalMs=e);const t=()=>{if(this.isLeaguePaused()||!this.isLiveWindowActive()){this.livePollInterval&&(clearInterval(this.livePollInterval),this.livePollInterval=null);return}const a=this._currentPollIntervalMs||e;this._nextLivePollAt=Date.now()+a,document.hidden||this.fetchLivePoints(!1)};this._checkAndPollLiveFn=t,this._boundVisibilityHandler&&document.removeEventListener("visibilitychange",this._boundVisibilityHandler),this._boundVisibilityHandler=()=>{this._visibilityPollTimer&&(clearTimeout(this._visibilityPollTimer),this._visibilityPollTimer=null),!document.hidden&&(this._visibilityPollTimer=setTimeout(()=>{this._visibilityPollTimer=null,document.hidden||t()},500))},document.addEventListener("visibilitychange",this._boundVisibilityHandler),this.isLiveWindowActive()&&(t(),this.livePollInterval&&clearInterval(this.livePollInterval),this.livePollInterval=setInterval(t,this._currentPollIntervalMs))}isLiveWindowActive(){const e=Number(this.multiData&&this.multiData.max_gw)||8,t=this.data&&this.data.gameweeks?this.data.gameweeks[String(e)]:null;return!!(t&&(!t.is_finished||!t.data_checked))}markHeaderLiveSynced(e=!1){const t=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],a=new Date(Date.now()+252e5),r=a.getUTCDate(),p=t[a.getUTCMonth()],i=a.getUTCFullYear(),d=String(a.getUTCHours()).padStart(2,"0"),n=String(a.getUTCMinutes()).padStart(2,"0"),c=String(a.getUTCSeconds()).padStart(2,"0"),m=`${r} ${p} ${i}, ${d}:${n} น.`,s=`${i}-${String(a.getUTCMonth()+1).padStart(2,"0")}-${String(r).padStart(2,"0")} ${d}:${n}:${c}`;this.multiData&&(this.multiData.last_sync=m,this.multiData.last_sync_iso=s,this.multiData.sync_status="ok");const o=this.formatSyncDate(s)||m,l=document.getElementById("header-last-sync-icon");if(l){const y=this.currentLang==="en"?"Auto-Sync Online":"ระบบเชื่อมต่อ Auto-Sync ปกติ";l.setAttribute("title",`${y} (${o})`)}if(e&&typeof this.showCopiedToast=="function"){const g=this.currentLang==="en";this.showCopiedToast(g?`Live scores updated (${d}:${n}:${c})`:`อัปเดตคะแนนสดเรียบร้อย (${d}:${n}:${c} น.)`)}}applyTier2StandingsRows(e,t,a){if(!Array.isArray(t)||t.length===0)return!1;const r=this.multiData&&this.multiData.leagues&&this.multiData.leagues[e]||(String(this.activeLeagueId)===e?this.data:null);if(!r)return!1;Array.isArray(r.teams)||(r.teams=[]),r.gameweeks||(r.gameweeks={});const p=String(a);r.gameweeks[p]||(r.gameweeks[p]={gw:Number(a),results:[]});const i=r.gameweeks[p];Array.isArray(i.results)||(i.results=[]);const d=new Map;r.teams.forEach(s=>{s&&s.entry_id&&d.set(Number(s.entry_id),s)});const n=new Map;i.results.forEach(s=>{s&&s.entry_id&&n.set(Number(s.entry_id),s)});let c=!1,m=!1;for(let s=0;s<t.length;s++){const o=t[s],l=Number(o&&o.entry);if(!l)continue;const g=Number(o.event_total||0),y=Number(o.total||0),D=Number(o.rank||0),h=Number(o.last_rank||0);g>0&&(m=!0);let $=n.get(l);const v=!!($&&$._squadEnriched),I=$&&Number($.hits)||0,L=g-I;let k=d.get(l);k?(v||((k.total_points!==y||k.event_total!==L||k.rank!==D||k.last_rank!==h)&&(c=!0),k.rank=D,k.last_rank=h,k.total_points=y,k.event_total=L),o.entry_name&&(k.entry_name=o.entry_name),o.player_name&&(k.player_name=o.player_name)):(k={entry_id:l,entry_name:o.entry_name||`Team ${l}`,player_name:o.player_name||"-",rank:D,last_rank:h,total_points:y,event_total:L,total_hits:I},r.teams.push(k),d.set(l,k),c=!0),$?v||(($.points!==g||$.net_points!==L||$.total_points!==y||$.overall_rank!==D)&&(c=!0),$.points=g,$.net_points=L,$.total_points=y,$.overall_rank=D,$.last_rank=h):($={entry_id:l,entry_name:o.entry_name||k.entry_name,team_name:o.entry_name||k.entry_name,player_name:o.player_name||k.player_name,rank:D,overall_rank:D,last_rank:h,total_points:y,points:g,net_points:L,hits:I,chip:null,captain:"-",team_value:null,transfers_count:0,transfers_pts_gain:0,transfers_net_impact:0,transfer_moves:[]},i.results.push($),n.set(l,$),c=!0)}return m&&!i.is_started&&(i.is_started=!0,c=!0),i.results.sort((s,o)=>Number(o.net_points||0)-Number(s.net_points||0)||(Number(s.overall_rank)||999999)-(Number(o.overall_rank)||999999)),i.results.forEach((s,o)=>{s.rank=o+1}),r.teams.sort((s,o)=>(Number(s.rank)||999999)-(Number(o.rank)||999999)||Number(o.total_points||0)-Number(s.total_points||0)),c&&this.invalidateRenderCache(),c}async fetchTier2LiveStandings(e,t,a=!1){if(this._lastTier2FailReason=null,typeof navigator<"u"&&navigator.onLine===!1)return this._lastTier2FailReason="offline",!1;const r=typeof resolveWorkerApiBase=="function"?resolveWorkerApiBase():{base:"https://api.fplsawadika.com",isOverride:!1},p=a?"&force=1":"",i=async(g,y)=>{const D=r.isOverride?[`${r.base}/standings?league=${e}&from=${g}&to=${y}${p}`]:[`${r.base}/standings?league=${e}&from=${g}&to=${y}${p}`,`https://fpl-live-relay.asawamanasak.workers.dev/standings?league=${e}&from=${g}&to=${y}${p}`];let h=!1,$=!1;for(const v of D){if(typeof navigator<"u"&&navigator.onLine===!1)return{data:null,reason:"offline"};const I=typeof AbortController<"u"?new AbortController:null,L=I?setTimeout(()=>I.abort(),26e3):null;try{const k=await fetch(v,{cache:"no-store",signal:I?I.signal:void 0});if(k&&k.ok){const x=await k.json();if(x&&Array.isArray(x.results))return{data:x,reason:null};h=!0}else h=!0}catch(k){k&&k.name==="AbortError"&&($=!0)}finally{L&&clearTimeout(L)}}return typeof navigator<"u"&&navigator.onLine===!1?{data:null,reason:"offline"}:typeof document<"u"&&document.hidden?{data:null,reason:"hidden"}:{data:null,reason:h?"http":$?"timeout":"network"}},d=async(g,y,D=!1)=>{const h=await i(g,y);if(h.data)return h.data;if(!D||h.reason==="offline"||h.reason==="hidden")return this._lastTier2FailReason=h.reason,null;if(await new Promise(v=>setTimeout(v,1500)),typeof navigator<"u"&&navigator.onLine===!1||typeof document<"u"&&document.hidden)return this._lastTier2FailReason=typeof navigator<"u"&&navigator.onLine===!1?"offline":"hidden",null;const $=await i(g,y);return $.data?$.data:(this._lastTier2FailReason=$.reason,null)},n=await d(1,12,!0);if(!n)return!1;let c=this.applyTier2StandingsRows(e,n.results,t);this._tier2LastFetchAt||(this._tier2LastFetchAt={}),this._tier2LastFetchAt[e]=Date.now(),String(this.activeLeagueId)===e&&(c||a)&&(this.liveNotesCache={},this.updateHeaderInfo(),this.renderAll());let m=!!n.has_next,s=(Number(n.last_fetched_page)||12)+1,o=!1,l=!1;for(;m&&s<=108;){const g=s+11,y=await d(s,g,!1);if(!y){l=!0;break}this.applyTier2StandingsRows(e,y.results,t)&&(o=!0),m=!!y.has_next,s=(Number(y.last_fetched_page)||g)+1}return this._tier2LastFetchAt[e]=Date.now(),String(this.activeLeagueId)===e&&o&&(this.liveNotesCache={},this.updateHeaderInfo(),this.renderAll()),!l}async fetchLivePoints(e=!1){if(this._isFetchingLive||this.isLeaguePaused())return;const t=Number(this.multiData&&this.multiData.max_gw)||8,a=String(t),r=this.data&&this.data.gameweeks?this.data.gameweeks[a]:null;if(!r||!e&&r.is_finished&&r.data_checked)return;if(typeof navigator<"u"&&navigator.onLine===!1){if(e&&typeof this.showCopiedToast=="function"){const g=this.currentLang==="en";this.showCopiedToast(g?"You appear to be offline":"ไม่พบการเชื่อมต่ออินเทอร์เน็ตในขณะนี้")}return}if(!e&&typeof document<"u"&&document.hidden)return;const p=String(this.activeLeagueId||""),i=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2);this._isFetchingLive=!0,this._nextLivePollAt=Date.now()+2e4;const d=e?"&force=1":"",n=typeof resolveWorkerApiBase=="function"?resolveWorkerApiBase():{base:"https://api.fplsawadika.com",isOverride:!1},c=n.isOverride?[`${n.base}/live?event=${t}&slim=1${d}`]:[`${n.base}/live?event=${t}&slim=1${d}`,`https://fpl-live-relay.asawamanasak.workers.dev/?event=${t}&slim=1${d}`],m=Array.from(new Set(this._preferredWorkerEndpoint?[`${this._preferredWorkerEndpoint}?event=${t}&slim=1${d}`,...c]:c)),s=async()=>{let g=!1,y=!1;for(const D of m){if(typeof navigator<"u"&&navigator.onLine===!1)return{data:null,reason:"offline"};const h=typeof AbortController<"u"?new AbortController:null,$=h?setTimeout(()=>h.abort(),11e3):null;try{const v=await fetch(D,{cache:"no-store",signal:h?h.signal:void 0});if(v&&v.ok){const I=await v.json();if(I&&Array.isArray(I.elements))return this._preferredWorkerEndpoint=D.split("?")[0],{data:I,reason:null};g=!0}else g=!0}catch(v){v&&v.name==="AbortError"&&(y=!0)}finally{$&&clearTimeout($)}}return typeof navigator<"u"&&navigator.onLine===!1?{data:null,reason:"offline"}:typeof document<"u"&&document.hidden?{data:null,reason:"hidden"}:{data:null,reason:g?"http":y?"timeout":"network"}},o=async()=>{const g=await s();if(g.data)return{data:g.data,reason:null,attempts:1};if(g.reason==="offline"||g.reason==="hidden")return{data:null,reason:g.reason,attempts:0};if(await new Promise(D=>setTimeout(D,1500)),typeof navigator<"u"&&navigator.onLine===!1||typeof document<"u"&&document.hidden)return{data:null,reason:typeof navigator<"u"&&navigator.onLine===!1?"offline":"hidden",attempts:0};const y=await s();return y.data?{data:y.data,reason:null,attempts:2}:{data:null,reason:y.reason,attempts:2}},l=(g,y=1)=>{g==="offline"||g==="hidden"||typeof navigator<"u"&&navigator.onLine===!1||typeof document<"u"&&document.hidden||(this._liveFetchConsecutiveFails=(this._liveFetchConsecutiveFails||0)+1,this._liveFetchConsecutiveFails>=2&&typeof window._reportClientError=="function"&&window._reportClientError(g==="timeout"?"api_timeout":"api_http"))};try{if(i){if(await this.ensureTier2PicksChunk(t,p),String(this.activeLeagueId||"")!==p)return;if(!this.hasTier2PicksForGw(this.data,t)){const I=!this._latestLiveMap||e,[L,k]=await Promise.all([this.fetchTier2LiveStandings(p,t,e),I?o():Promise.resolve({data:this.lastLiveJson,reason:null,attempts:0})]),x=k&&k.data?k.data:null;if(x&&Array.isArray(x.elements)){if(this.lastLiveJson=x,this.lastLiveGw=t,String(this.activeLeagueId||"")===p){const z=Number(x.in_play_count||0)>0?2e4:9e4;typeof this.setLivePollCadence=="function"&&this.setLivePollCadence(z),this._nextLivePollAt=Date.now()+(this._currentPollIntervalMs||z)}this.applyLiveElements(x,t)}if(String(this.activeLeagueId||"")!==p)return;const C=!I||!!(x&&Array.isArray(x.elements));if(!L||!C){if(l(L?k&&k.reason||"http":this._lastTier2FailReason||"http",1),e&&typeof this.showCopiedToast=="function"){const H=this.currentLang==="en";this.showCopiedToast(H?"Unable to reach Cloudflare Live Edge":"ไม่สามารถเชื่อมต่อ Cloudflare Live Edge ได้ในขณะนี้")}return}this._liveFetchConsecutiveFails=0,this.markHeaderLiveSynced(e);const T=document.getElementById("team-modal");T&&!T.classList.contains("hidden")&&this.currentModalEntryId&&this.openTeamModal(this.currentModalEntryId);return}}const g=await o(),y=g&&g.data?g.data:null;if(!y||!Array.isArray(y.elements)){if(String(this.activeLeagueId||"")!==p)return;if(l(g?g.reason:"http",g?g.attempts:1),e&&typeof this.showCopiedToast=="function"){const v=this.currentLang==="en";this.showCopiedToast(v?"Unable to reach Cloudflare Live Edge":"ไม่สามารถเชื่อมต่อ Cloudflare Live Edge ได้ในขณะนี้")}return}this.lastLiveJson=y,this.lastLiveGw=t;const D=this.applyLiveElements(y,t);if(String(this.activeLeagueId||"")!==p)return;this._liveFetchConsecutiveFails=0;const $=Number(y.in_play_count||0)>0?2e4:9e4;if(typeof this.setLivePollCadence=="function"&&this.setLivePollCadence($),this._nextLivePollAt=Date.now()+(this._currentPollIntervalMs||$),this.markHeaderLiveSynced(e),D||e){this.liveNotesCache={},this.updateHeaderInfo(),this.renderAll();const v=document.getElementById("team-modal");v&&!v.classList.contains("hidden")&&this.currentModalEntryId&&this.openTeamModal(this.currentModalEntryId)}}catch(g){console.warn("Live fetch notice:",g)}finally{this._isFetchingLive=!1}}computeClientProvisionalBonus(e,t=null){const a={},r={},p={};Array.isArray(t)&&t.forEach(d=>{d&&d.id!==void 0&&d.id!==null&&(r[d.id]=Math.max(r[d.id]||0,Number(d.minutes)||0))}),e.forEach(d=>{if(!d||!d.stats||d.stats.provisional_bonus!==void 0)return;const n=Number(d.stats.bps)||0,c=Array.isArray(d.explain)?d.explain:[],m=c.length===1;c.forEach(s=>{if(!s||s.fixture===void 0||s.fixture===null)return;const o=s.fixture,l=Array.isArray(s.stats)?s.stats:[],g=l.find(h=>h&&h.identifier==="minutes"),y=g?Number(g.value)||0:m&&Number(d.stats.minutes)||0;y>(r[o]||0)&&(r[o]=y),l.some(h=>h&&h.identifier==="bonus"&&Number(h.points)>0)&&(p[o]=!0),m&&y>0&&n>0&&(a[o]||(a[o]=[]),a[o].push({id:d.id,bps:n}))})});const i={};return Object.keys(a).forEach(d=>{if(p[d]||(r[d]||0)<60)return;const n=a[d];n.sort((s,o)=>o.bps-s.bps);const c=[];if(n.forEach(s=>{c.length===0||c[c.length-1].bps!==s.bps?c.push({bps:s.bps,ids:[s.id]}):c[c.length-1].ids.push(s.id)}),c.length===0||c[0].ids.length>4)return;const m=c[0];if(m.ids.forEach(s=>{i[s]=(i[s]||0)+3}),m.ids.length===1&&c.length>1){const s=c[1];if(s.ids.forEach(o=>{i[o]=(i[o]||0)+2}),s.ids.length===1&&c.length>2){const o=c[2];o.ids.length<=4&&o.ids.forEach(l=>{i[l]=(i[l]||0)+1})}}else if(m.ids.length===2&&c.length>1){const s=c[1];s.ids.length<=4&&s.ids.forEach(o=>{i[o]=(i[o]||0)+1})}}),i}applyLiveElements(e,t){if(!e||!Array.isArray(e.elements))return!1;const a=new Set,r=new Set,p=Array.isArray(e.fixtures)&&e.fixtures.length>0;p&&e.fixtures.forEach(l=>{l&&l.id!==void 0&&(l.started&&a.add(l.id),(l.finished||l.finished_provisional)&&r.add(l.id))}),e.elements.forEach(l=>{l&&l.stats&&(Number(l.stats.minutes)>0||l.stats.played||Number(l.stats.starts)>0)&&Array.isArray(l.explain)&&l.explain.forEach(g=>{g&&g.fixture!==void 0&&g.fixture!==null&&a.add(g.fixture)})});const i=this.computeClientProvisionalBonus(e.elements,e.fixtures),d={};e.elements.forEach(l=>{if(l&&l.id&&l.stats){const g=Number(l.stats.minutes)||0,y=!!(l.stats.played||g>0),D=Array.isArray(l.explain)?l.explain:[],h=D.length>0,$=y||D.some(x=>x&&a.has(x.fixture)),v=!!e.all_finished||p&&(!h||D.every(x=>x&&r.has(x.fixture))),I=l.stats.provisional_bonus!==void 0?Number(l.stats.provisional_bonus)||0:null,L=I!==null?I:i[l.id]||0,k=I!==null?Number(l.stats.total_points)||0:(Number(l.stats.total_points)||0)+L;d[l.id]={total_points:k,provisional_bonus:L,bps:Number(l.stats.bps)||0,minutes:g,goals_scored:Number(l.stats.goals_scored)||0,assists:Number(l.stats.assists)||0,clean_sheets:Number(l.stats.clean_sheets)||0,goals_conceded:Number(l.stats.goals_conceded)||0,own_goals:Number(l.stats.own_goals)||0,penalties_saved:Number(l.stats.penalties_saved)||0,penalties_missed:Number(l.stats.penalties_missed)||0,yellow_cards:Number(l.stats.yellow_cards)||0,red_cards:Number(l.stats.red_cards)||0,saves:Number(l.stats.saves)||0,played:y,has_fixtures:h,fixture_started:$,fixture_finished:v}}}),this._latestLiveMap=d,this._latestLiveElements=d,this._latestLiveFixtureBonus=e.provisional_bonus_by_fixture||null;const n=String(t),c=a.size>0;let m=!1;const s={},o=this.multiData&&this.multiData.leagues?this.multiData.leagues:{};return Object.values(o).forEach(l=>{const g=(l.gameweeks||{})[n];if(!g)return;c&&!g.is_started&&(g.is_started=!0,m=!0),e.all_finished&&!g.is_finished&&(g.is_finished=!0,m=!0);const y=l.squads||{},D=l.teams||[],h=g.results||[],$=!!(l.tier===2||this.configs&&this.configs[String(l.id)]&&this.configs[String(l.id)].tier===2),v=new Map;h.forEach(k=>{k&&k.entry_id&&v.set(Number(k.entry_id),k)});let I=!1;const L=(k,x)=>{const C=d[k.id];if(!C)return;const T=C.total_points,H=T*x,z=!!(!g.is_finished&&C.has_fixtures&&!C.fixture_started);if((k.points!==H||k.not_played_yet!==z||k.provisional_bonus!==C.provisional_bonus||k.raw_points!==T)&&(m=!0),k.points=H,k.raw_points=T,k.provisional_bonus=C.provisional_bonus,k.bps=C.bps,k.minutes=C.minutes,k.goals_scored=C.goals_scored,k.assists=C.assists,k.clean_sheets=C.clean_sheets,k.goals_conceded=C.goals_conceded,k.own_goals=C.own_goals,k.penalties_saved=C.penalties_saved,k.penalties_missed=C.penalties_missed,k.yellow_cards=C.yellow_cards,k.red_cards=C.red_cards,k.saves=C.saves,k.not_played_yet=z,k.name&&(s[k.name]=T),C.fixture_started&&k.team&&Array.isArray(g.unstarted_teams)){const U=g.unstarted_teams.indexOf(k.team);U!==-1&&(g.unstarted_teams.splice(U,1),m=!0)}};if(D.forEach(k=>{const x=Number(k.entry_id),C=`${x}_${t}`,T=y[C];if(!T)return;const H=T.chip,z=H==="bboost"||H==="bench_boost",U=H==="3xc"||H==="triple_captain"?3:2,Q=Array.isArray(T.starting)?T.starting:[],W=Array.isArray(T.bench)?T.bench:[],P=v.get(x);Q.forEach(_=>{const S=_.multiplier!==void 0&&_.multiplier!==null?Number(_.multiplier):1;L(_,S)}),W.forEach(_=>{const S=z&&Number(_.multiplier)||1;L(_,S)});const u=Array.isArray(T.auto_subs)&&T.auto_subs.some(_=>_&&!_.is_provisional);if(!T.final_checked&&!u&&p){if(Array.isArray(T.auto_subs)||(T.auto_subs=[]),!z&&Q.length===11&&W.length>0){const G=new Set(T.auto_subs.filter(K=>K&&K.element_in).map(K=>Number(K.element_in)));for(let K=0;K<Q.length;K++){const B=Q[K],Y=B?d[B.id]:null;if(!Y||!Y.fixture_finished||Y.minutes!==0)continue;const X=B.pos||"MID";for(let M=0;M<W.length;M++){const V=W[M];if(!V||G.has(Number(V.id)))continue;const Z=d[V.id];if(Z&&Z.fixture_finished&&Z.minutes===0)continue;const O=V.pos||"MID";if(X==="GKP"!=(O==="GKP"))continue;const ae={GKP:0,DEF:0,MID:0,FWD:0};for(let de=0;de<Q.length;de++){const oe=de===K?O:Q[de].pos||"MID";ae[oe]=(ae[oe]||0)+1}if(ae.GKP===1&&ae.DEF>=3&&ae.MID>=2&&ae.FWD>=1){if(!Z||Z.minutes===0&&!Z.fixture_finished){G.add(Number(V.id));break}B.is_captain&&(B._orig_captain=!0),B.is_captain=!1,B.multiplier=0,B.points=0,V.multiplier=1,V.points=Number(V.raw_points)||0,Q[K]=V,W[M]=B,G.add(Number(V.id)),T.auto_subs.push({element_in:V.id,element_out:B.id,is_provisional:!0}),m=!0;break}}}}const _=Q.concat(W),S=_.find(G=>G&&(G.is_captain||G._orig_captain)),E=_.find(G=>G&&G.is_vice),A=S?d[S.id]:null,F=!!(S&&(A&&A.fixture_finished&&A.minutes===0||S._orig_captain)),q=E?d[E.id]:null,j=!!(E&&(Q.includes(E)||z&&W.includes(E))),R=!!(q&&q.fixture_finished&&q.minutes===0);F&&E&&j&&!R&&Number(E.multiplier||1)<U&&(S.is_captain=!1,S.multiplier=0,S.points=0,E.is_captain=!0,E.multiplier=U,E.points=(Number(E.raw_points)||0)*U,P&&E.name&&(P.captain=E.name),m=!0)}let N=0;Q.forEach(_=>{N+=Number(_&&_.points)||0});let w=0;W.forEach(_=>{w+=Number(_&&_.points)||0}),z&&(N+=w);const b=z?0:w;if(P){I=!0;const _=Q.find(j=>j&&j.is_captain)||W.find(j=>j&&j.is_captain);_&&_.name&&P.captain!==_.name&&(P.captain=_.name,m=!0);const S=Number(P.hits)||0,E=N-S,A=Number(P.net_points)||0,F=E-A;(P.points!==N||P.net_points!==E||P.bench_points!==b)&&(m=!0),P.points=N,P.net_points=E,P.bench_points=b;const q=P.prev_total!==void 0&&P.prev_total!==null?Number(P.prev_total):k.prev_total!==void 0&&k.prev_total!==null?Number(k.prev_total):null;if(q!==null&&!g.data_checked){const j=q+E;(k.total_points!==j||P.total_points!==j)&&(m=!0),k.total_points=j,P.total_points=j}else F!==0&&typeof k.total_points=="number"&&(k.total_points+=F);k.event_total=E}}),Object.keys(y).forEach(k=>{const x=y[k];x&&(x.starting||[]).concat(x.bench||[]).forEach(C=>{C&&C.id&&C.name&&d[C.id]&&s[C.name]===void 0&&(s[C.name]=d[C.id].total_points)})}),h.forEach(k=>{if(Array.isArray(k.transfer_moves)&&k.transfer_moves.length>0){let x=0;k.transfer_moves.forEach(H=>{const z=H.in_id&&d[H.in_id]?d[H.in_id].total_points:s[H.in]!==void 0?s[H.in]:Number(H.in_pts)||0,U=H.out_id&&d[H.out_id]?d[H.out_id].total_points:s[H.out]!==void 0?s[H.out]:Number(H.out_pts)||0,Q=z-U;(H.in_pts!==z||H.out_pts!==U||H.net!==Q)&&(m=!0),H.in_pts=z,H.out_pts=U,H.net=Q,x+=Q});const C=Number(k.hits)||0,T=x-C;(k.transfers_pts_gain!==x||k.transfers_net_impact!==T)&&(m=!0),k.transfers_pts_gain=x,k.transfers_net_impact=T}}),$&&I&&!g.data_checked&&D.length>0){D.sort((C,T)=>Number(T.total_points||0)-Number(C.total_points||0)||(Number(C.last_rank)||999999)-(Number(T.last_rank)||999999));let k=1,x=null;D.forEach((C,T)=>{const H=Number(C.total_points||0);x!==null&&H<x&&(k=T+1),x=H,C.rank!==k&&(C.rank=k,m=!0);const z=v.get(Number(C.entry_id));z&&(z.overall_rank=k,z.total_points=H)})}h.sort((k,x)=>x.net_points-k.net_points||k.hits-x.hits),h.forEach((k,x)=>{k.rank=x+1})}),m&&this.invalidateRenderCache(),m}initLanguage(){var e=new URLSearchParams(typeof window<"u"&&window.location&&window.location.search?window.location.search:""),t=e.get("lang"),a=null;try{typeof localStorage<"u"&&(a=localStorage.getItem("fpl_lang"))}catch{}this.currentLang=t==="en"||!t&&a==="en"?"en":"th",typeof document<"u"&&(document.documentElement.lang=this.currentLang),this.updateLanguageUI()}toggleLanguage(){const e=this.currentLang==="en"?"th":"en";this.setLanguage(e)}setLanguage(e){this.currentLang=e==="en"?"en":"th";try{typeof localStorage<"u"&&localStorage.setItem("fpl_lang",this.currentLang)}catch{}if(typeof document<"u"&&(document.documentElement.lang=this.currentLang),this.updateLanguageUI(),this.updateHeaderInfo(),this.renderLeagueDropdown(),this.renderAll(),this.currentModalEntryId){const t=document.getElementById("team-modal");t&&!t.classList.contains("hidden")&&this.openTeamModal(this.currentModalEntryId)}if(this._rivalState&&this._rivalState.isOpen){const t=document.getElementById("rival-modal");t&&!t.classList.contains("hidden")&&this.renderRivalModal()}}updateLanguageUI(){const e=this.currentLang==="en",t=document.getElementById("lang-btn-text");t&&(t.innerText=e?"TH":"EN");const a=document.getElementById("btn-lang-toggle");a&&(a.title=e?"สลับเป็นภาษาไทย":"Switch to English",a.setAttribute("aria-label",a.title));const r=document.getElementById("btn-export-excel");r&&(r.title=e?"Export to Excel (.xlsx)":"ส่งออกไฟล์ Excel (.xlsx)"),this.translateStaticElements(),typeof this.renderFooterCta=="function"&&this.renderFooterCta()}formatSyncDate(e){if(!e)return"";try{const t=new Date(e.replace(" ","T")+"+07:00");if(isNaN(t.getTime()))return this.multiData&&this.multiData.last_sync?this.multiData.last_sync:"";const a=t.getDate(),r=t.getMonth(),p=t.getFullYear(),i=String(t.getHours()).padStart(2,"0"),d=String(t.getMinutes()).padStart(2,"0");return this.currentLang==="en"?`${a} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][r]} ${p}, ${i}:${d}`:`${a} ${["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."][r]} ${p}, ${i}:${d} น.`}catch{return this.multiData&&this.multiData.last_sync?this.multiData.last_sync:""}}translateStaticElements(){const e=this.currentLang==="en";Object.entries({"tab-btn-live":e?"Live Points":"คะแนนสด","tab-btn-highlights":e?"Highlights":"ไฮไลท์","tab-btn-global-radar":e?"Radar":"เรดาร์ฟอร์ม","tab-btn-competition":e?"Chips":"สถานะชิป","tab-btn-transfers":e?"Transfers":"วิเคราะห์การย้ายตัว","tab-btn-transfer-advisor":e?"Transfer Advisor":"แนะนำการย้ายตัว","tab-btn-shi62-special":e?"Prediction":"ทายผล","tab-btn-bramann-prediction":e?"Prediction":"ทายผล","tab-btn-bramann-challenge":e?"Challenge":"ท้าชน","tab-btn-prizes":e?"Prizes":"เงินรางวัล","tab-btn-cup":e?"Cup":"บอลถ้วย","tab-btn-hall-of-fame":e?"Hall of Fame":"ทำเนียบแชมป์","tab-btn-rules":e?"Rules":"กติกา","tab-btn-about":"Dev Corner"}).forEach(([Se,Me])=>{const Ae=document.getElementById(Se);Ae&&(Ae.innerText=Me)});const a=document.querySelector("#league-dropdown-menu span:first-child");a&&(a.innerText=e?"Select League":"เลือกลีก");const r=document.querySelector("#league-dropdown-menu span:last-child");r&&(r.innerText=e?"Click to switch":"คลิกเพื่อสลับ"),document.querySelectorAll("#league-dropdown-menu button").forEach(Se=>{const Me=Se.querySelector("span.text-slate-400");Me&&(Me.innerText.includes("ทีม")||Me.innerText.includes("Teams"))&&(Me.innerText=e?Me.innerText.replace(/ทีม/g,"Teams"):Me.innerText.replace(/Teams/g,"ทีม"));const Ae=Se.querySelector("span.text-blue-600, span.text-blue-400");Ae&&(Ae.innerText.includes("กำลังดู")||Ae.innerText.includes("Viewing"))&&(Ae.innerText=e?"✓ Viewing":"✓ กำลังดู")});const p=document.getElementById("header-member-count");if(p){const Se=this.data&&this.data.teams?this.data.teams.length:12;p.innerText=e?`${Se} Members`:`${Se} ทีมสมาชิก`}const i=document.getElementById("header-season");if(i){const Se=this.data&&this.data.season?this.data.season:"2026/27";i.innerText=e?`Season ${Se}`:`ฤดูกาล ${Se}`}const d=document.getElementById("header-last-sync-icon");if(d){const Se=this.multiData&&this.multiData.last_sync_iso?this.formatSyncDate(this.multiData.last_sync_iso):this.multiData.last_sync||"",Ae=this.multiData&&this.multiData.sync_status!=="offline"?e?"Auto-Sync System Online":"ระบบเชื่อมต่อ Auto-Sync ปกติ":e?"Auto-Sync Offline":"ระบบเชื่อมต่อ Auto-Sync ขัดข้อง";d.setAttribute("title",Se?`${Ae} (${Se})`:Ae)}const n=document.getElementById("gw-selector-main-label");n&&(n.innerText=e?"GAMEWEEK SELECTOR":"เลือกสัปดาห์การแข่งขัน");const c=document.getElementById("highlights-overview-title");c&&(c.innerText=e?"Weekly Highlights":"ไฮไลท์ประจำสัปดาห์");const m=document.getElementById("hl-prev-label");m&&(m.innerText=e?"Prev":"ก่อนหน้า");const s=document.getElementById("hl-next-label");s&&(s.innerText=e?"Next":"ถัดไป");const o=document.getElementById("competition-overview-title");o&&(o.innerText=e?"Chips Status":"สถานะชิป");const l=document.getElementById("competition-overview-subtitle");l&&(l.innerText=e?"Track remaining chip inventory of league rivals (Wildcard, Free Hit, Bench Boost, Triple Captain)":"ตรวจสอบสถานะการใช้ชิปคงเหลือของคู่แข่งในลีก (Wildcard, Free Hit, Bench Boost, Triple Captain)"),this.updateDeadlineCountdown();const g=document.getElementById("gw-range-status");g&&(g.innerHTML=e?'<span class="hidden min-[380px]:inline">Gameweeks </span>1 - 38':'<span class="hidden min-[380px]:inline">สัปดาห์ที่ </span>1 - 38');const y=document.getElementById("matchday-sub-label");y&&(y.innerText=e?"GAMEWEEK STANDINGS":"คะแนนประจำสัปดาห์");const D=document.getElementById("overall-sub-label");D&&(D.innerText=e?"OVERALL STANDINGS":"คะแนนรวมสะสม");const h=document.getElementById("overall-table-title");h&&(h.innerText=e?"Overall Cumulative Standings":"ตารางคะแนนรวมสะสม");const $=document.getElementById("th-matchday-team");$&&($.innerText=e?"Team & Manager":"ทีม & ผู้จัดการ");const v=document.getElementById("th-matchday-captain");v&&(v.innerText=e?"Captain":"กัปตัน");const I=document.getElementById("th-matchday-points");if(I){const Se=String(this.selectedGW||2),Me=this.data&&this.data.gameweeks?this.data.gameweeks[Se]||this.data.gameweeks[this.selectedGW]:null,Ae=!!(Me&&Me.is_finished),Ve=Me?Me.is_started!==void 0?!!Me.is_started:Ae||Me.results&&Me.results.some(Ye=>Ye.points>0):!1;Ae?I.innerHTML=e?'<span class="hidden sm:inline">Raw Pts</span><span class="sm:hidden">Raw</span>':'<span class="hidden sm:inline">คะแนนดิบ</span><span class="sm:hidden">ดิบ</span>':Ve?I.innerHTML=e?'<span class="hidden sm:inline">Live Pts</span><span class="sm:hidden">Live</span>':'<span class="hidden sm:inline">คะแนนสด</span><span class="sm:hidden">สด</span>':I.innerHTML=e?'<span class="hidden sm:inline">Points</span><span class="sm:hidden">Pts</span>':'<span class="hidden sm:inline">คะแนน</span><span class="sm:hidden">คะแนน</span>'}const L=document.getElementById("th-matchday-hits");L&&(L.innerHTML=e?'<span class="hidden sm:inline">Hits</span><span class="sm:hidden">Hits</span>':'<span class="hidden sm:inline">คะแนนลบ</span><span class="sm:hidden">ลบ</span>');const k=document.getElementById("th-matchday-net");k&&(k.innerHTML=e?'<span class="hidden sm:inline">Net Pts</span><span class="sm:hidden">Net</span>':'<span class="hidden sm:inline">คะแนนสุทธิ</span><span class="sm:hidden">สุทธิ</span>');const x=document.getElementById("header-platform-sub");x&&(x.innerText=e?"Mini-League":"มินิลีก");const C=document.getElementById("league-dropdown-header-title");C&&(C.innerText=e?"Switch Mini-League (FPLSaWaDiKa)":"สลับมินิลีก (FPLSaWaDiKa)");const T=document.getElementById("league-dropdown-header-hint");T&&(T.innerText=e?"Click to switch":"คลิกเพื่อสลับ");const H=document.getElementById("live-team-search");H&&(H.placeholder=e?"Search team or manager...":"ค้นหาชื่อทีม / ผู้จัดการ...");const z=document.getElementById("btn-switch-matchday-table");z&&(z.innerText=e?"Matchday Table":"ตารางประจำสัปดาห์");const U=document.getElementById("btn-switch-overall-table");U&&(U.innerText=e?"Overall Standings":"ตารางคะแนนรวม");const Q=document.getElementById("th-overall-team");Q&&(Q.innerText=e?"Team & Manager":"ทีม & ผู้จัดการ");const W=document.getElementById("th-overall-lastgw");W&&(W.innerText=e?"Latest GW":"GW ล่าสุด");const P=document.getElementById("th-overall-hits");P&&(P.innerHTML=e?'<span class="hidden sm:inline">Total Hits</span><span class="sm:hidden">Hits</span>':'<span class="hidden sm:inline">คะแนนลบสะสม</span><span class="sm:hidden">ลบสะสม</span>');const u=document.getElementById("th-overall-total");u&&(u.innerText=e?"Total Pts":"คะแนนรวม");const N=document.getElementById("radar-guide-heading");N&&(N.innerText=e?"Consistency Tiers Criteria":"ระดับความสม่ำเสมอ");const w=document.getElementById("radar-benchmark-title");w&&(w.innerText=e?"Average League Strength Benchmarks":"จัดอันดับความแข็งแกร่งเฉลี่ยของแต่ละลีก");const b=document.getElementById("radar-guide-btn-text");if(b){const Se=document.getElementById("radar-guide-content")?.classList.contains("hidden");e?b.innerText=Se?"Show Criteria":"Hide Criteria":b.innerText=Se?"ดูเกณฑ์":"ซ่อนเกณฑ์"}const _=document.getElementById("radar-guide-content");_&&this.renderRadarGuideCards(_,e);const S=document.getElementById("radar-main-title");S&&(S.innerText=e?"Team Consistency Radar":"เรดาร์ความสม่ำเสมอของทีม");const E=Object.keys(this.multiData&&this.multiData.leagues||{}).filter(Se=>{const Me=this.multiData.leagues[Se],Ae=this.configs&&this.configs[Se]||{};return Me&&Me.tier!==2&&Ae.tier!==2}).length<=1,A=this.data&&Array.isArray(this.data.teams)?this.data.teams.length:0,F=document.getElementById("radar-main-subtitle");F&&(F.innerText=E?e?"Compare form consistency, scoring floor, and ceiling across every team in your league":"เปรียบเทียบมาตรฐานฟอร์มการเล่น ความนิ่ง และความแกว่ง ของทุกทีมภายในลีกของคุณ":e?"Comparing baseline scoring, floor resilience, and spread across all fantasy managers in the system.":"เปรียบเทียบมาตรฐานฟอร์มการเล่น ความนิ่ง และความแกว่ง ของทุกทีมในระบบ ไม่จำกัดเฉพาะในลีก");const q=document.getElementById("radar-banner-stat-text");q&&(q.innerText=E?e?`All ${A} league teams analyzed`:`วิเคราะห์ครบทั้ง ${A} ทีมในลีก`:e?"Cross-League Analytics Active":"วิเคราะห์ข้าม 8 ลีกสมบูรณ์");const j=document.getElementById("radar-benchmark-title");j&&(j.innerText=e?"League Strength Power Rankings":"จัดอันดับความแข็งแกร่งเฉลี่ยของแต่ละลีก");const R=document.getElementById("radar-benchmark-unit");R&&(R.innerText=e?"Avg Points per Team / GW":"คะแนนเฉลี่ยต่อทีม / GW");const G=document.getElementById("benchmark-clear-filter");G&&(G.innerText=e?"Clear Filter ✕":"ล้างตัวกรอง ✕");const K=document.getElementById("radar-matrix-title");if(K){const Se=document.getElementById("radar-gw-status-badge"),Me=Se?Se.outerHTML:"";K.innerHTML=(e?"Consistency & Performance Matrix ":"ตารางวัดระดับความสม่ำเสมอ & ฟอร์มการเล่น ")+Me}const B=document.getElementById("global-radar-search-input");B&&B.setAttribute("placeholder",e?"Search team or manager...":"ค้นหาชื่อทีม / ผู้จัดการ...");const Y=document.getElementById("global-radar-sort-select");if(Y){const Se=Y.value;Y.innerHTML=e?`
            <option value="total_net">Sort: Total Net Pts ▼</option>
            <option value="avg">Sort: Avg Pts ▼</option>
            <option value="tier">Sort: Consistency Tier ▼</option>
            <option value="high">Sort: High Score ▼</option>
            <option value="low">Sort: Floor (Lowest) ▼</option>
            <option value="spread">Sort: Spread (Most Consistent) ▲</option>
            <option value="hits">Sort: Fewest Hits ▲</option>
            <option value="bench">Sort: Highest Bench ▼</option>
            <option value="team_name">Sort: Team Name A-Z ▲</option>
          `:`
            <option value="total_net">เรียง: คะแนนรวม ▼</option>
            <option value="avg">เรียง: คะแนนเฉลี่ย ▼</option>
            <option value="tier">เรียง: ระดับความสม่ำเสมอ ▼</option>
            <option value="high">เรียง: คะแนนสูงสุด ▼</option>
            <option value="low">เรียง: คะแนนต่ำสุด ▼</option>
            <option value="spread">เรียง: ความนิ่ง (แกว่งน้อย) ▲</option>
            <option value="hits">เรียง: คะแนนลบน้อยสุด ▲</option>
            <option value="bench">เรียง: คะแนนสำรองสูงสุด ▼</option>
            <option value="team_name">เรียง: ชื่อทีม A-Z ▲</option>
          `,Se&&(Y.value=Se)}const X=document.getElementById("th-radar-team_name");X&&(X.innerText=e?"Team & Manager":"ทีม & ผู้จัดการ");const M=document.getElementById("th-radar-total_net");M&&(M.innerHTML=e?"<span>Total Net ▼</span>":'<span class="hidden sm:inline">คะแนนรวม ▼</span><span class="sm:hidden">คะแนนรวม ▼</span>');const V=document.getElementById("th-radar-avg");V&&(V.innerHTML=e?"<span>Avg Pts</span>":'<span class="hidden sm:inline">คะแนนเฉลี่ย</span><span class="sm:hidden">เฉลี่ย</span>');const Z=document.getElementById("th-radar-high");Z&&(Z.innerHTML=e?"<span>High</span>":'<span class="hidden sm:inline">สูงสุด</span><span class="sm:hidden">สูงสุด</span>');const O=document.getElementById("th-radar-low");O&&(O.innerHTML=e?"<span>Floor</span>":'<span class="hidden sm:inline">คะแนนต่ำสุด</span><span class="sm:hidden">ต่ำสุด</span>');const ae=document.getElementById("th-radar-spread");ae&&(ae.innerHTML=e?"<span>Spread</span>":'<span class="hidden sm:inline">ความแกว่ง</span><span class="sm:hidden">แกว่ง</span>');const de=document.getElementById("th-radar-hits");de&&(de.innerHTML=e?"<span>Hits</span>":'<span class="hidden sm:inline">คะแนนลบ</span><span class="sm:hidden">ลบ</span>');const oe=document.getElementById("th-radar-bench");oe&&(oe.innerHTML=e?"<span>Bench</span>":'<span class="hidden sm:inline">คะแนนสำรอง</span><span class="sm:hidden">สำรอง</span>');const ue=document.getElementById("th-radar-tier");ue&&(ue.innerHTML=e?"<span>Tier</span>":'<span class="hidden sm:inline">ระดับความสม่ำเสมอ</span><span class="sm:hidden">ระดับ</span>');const _e=document.getElementById("mobile-radar-sort-label");_e&&(_e.innerText=e?"Sorted by Total Net Pts (# Overall Rank)":"เรียงตามคะแนนรวม (# อันดับรวม)");const ce=document.getElementById("mobile-radar-scroll-hint");ce&&(ce.innerText=e?"Scroll right for more stats →":"เลื่อนขวาดูสถิติเพิ่มเติม →");const J=document.querySelector("#team-modal header .font-mono span:last-child");J&&(J.innerText=e?"Squad & Starting Lineup":"ขุมกำลัง & การจัดทัพ");const ee=document.querySelector("#team-modal section span.uppercase");ee&&(ee.innerText=e?"Substitutes (Bench)":"ตัวสำรอง");const re=document.getElementById("team-modal-formation-label");re&&(re.innerText=e?"Formation:":"แผน:");const le=document.querySelector("#projected-points-modal h3");le&&(le.innerText=e?"Projected Points & Advisor Guide":"คะแนนคาดการณ์ & คำแนะนำย้ายตัว");const ie=document.getElementById("projected-points-desc");ie&&(ie.innerText=e?"Projected Points (xP) uses our Hybrid Engine (recent form, xGI/CS stats, minutes consistency, injury status, and fixture difficulty FDR/DGW/BGW blended with AI projections) across 1 GW and 3 GWs horizons.":"คะแนนคาดการณ์ (xP) คำนวณจากโมเดล Hybrid (ฟอร์มล่าสุด, สถิติ xGI/CS, โอกาสลงสนาม, ความยากโปรแกรม FDR/DGW/BGW ผสานค่าคาดการณ์ AI) รองรับทั้งระยะ 1 GW และ 3 GWs");const pe=document.getElementById("projected-points-fdr");pe&&(pe.innerHTML=e?'<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 font-mono font-bold">FDR 1–2 Easy</span><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-mono font-bold">FDR 3 Med</span><span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 font-mono font-bold">FDR 4–5 Hard</span><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 font-mono font-bold">BGW Blank</span>':'<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 font-mono font-bold">FDR 1–2 ง่าย</span><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-mono font-bold">FDR 3 กลาง</span><span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 font-mono font-bold">FDR 4–5 ยาก</span><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 font-mono font-bold">BGW ว่าง</span>');const ke=document.getElementById("projected-points-notice");ke&&(ke.innerHTML=e?'<strong class="font-bold">Squad Advisor (Sell → Buy):</strong> Estimated budget = current price + bank, enforcing FPL max 3 players per club. Always verify exact selling price and press-conference injury news before confirming transfers.':'<strong class="font-bold">คำแนะนำเฉพาะทีม (Sell → Buy):</strong> คำนวณงบโดยประมาณจากราคาปัจจุบัน + Bank พร้อมตรวจกฎไม่เกิน 3 คน/สโมสร ควรเช็กแถลงการณ์ความฟิตและราคาขายจริงในแอป FPL ก่อนกดยืนยัน');const ye=document.getElementById("projected-points-btn");ye&&(ye.innerText=e?"Got it":"เข้าใจแล้ว");const te=document.getElementById("competition-overview-title");te&&(te.innerHTML=e?'Chips Strategy <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(Availability Matrix)</span>':"สถานะชิป");const ne=document.getElementById("competition-overview-subtitle");ne&&(ne.innerText=e?"Monitor chip availability, active chips, and remaining tokens across all league managers":"ตรวจสอบสถานะการใช้ชิปคงเหลือของคู่แข่งในลีก (Wildcard, Free Hit, Bench Boost, Triple Captain)");const he=document.getElementById("transfers-overview-title");he&&(he.innerHTML=e?'Transfer Analytics <span class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">(Squad Movement & Trends)</span>':"วิเคราะห์การย้ายตัว");const fe=document.getElementById("transfers-overview-subtitle");fe&&(fe.innerText=e?"Weekly transfer activity, net transfer ROI, template ownership (>70%), and differential picks (<20%)":"สถิติการย้ายตัวประจำสัปดาห์, แต้มได้-เสียสุทธิจากการย้ายตัว, การถือครองนักเตะมหาชน และตัวทีเด็ดในลีก");const me=document.getElementById("transfer-advisor-overview-title");me&&(me.innerText=e?"Transfer Advisor":"แนะนำการย้ายตัว");const we=document.getElementById("transfer-advisor-overview-subtitle");we&&(we.innerText=e?"Personalized squad advisor (Sell → Buy), Hybrid xP 1 GW / 3 GWs projections, and fixture difficulty (FDR)":"วิเคราะห์จุดอ่อนรายทีม (ขายใคร → ซื้อใคร), คะแนนคาดการณ์ Hybrid xP 1 GW / 3 GWs และความยากโปรแกรม (FDR)"),this.renderPrizesView();const be=document.getElementById("hof-overview-title");be&&(be.innerText=e?"Hall of Fame":"ทำเนียบแชมป์");const ve=document.getElementById("hof-overview-subtitle");ve&&(ve.innerText=e?"All-time league records, peak performances, and squad consistency across official finished gameweeks.":"บันทึกที่สุดของลีก สถิติคะแนนสูงสุดตลอดกาล และความสม่ำเสมอของทุกทีมในลีก (เฉพาะสัปดาห์ที่จบทางการ)");const Le=document.getElementById("hof-consistency-kicker");Le&&(Le.innerText=e?"CONSISTENCY MATRIX":"สถิติความสม่ำเสมอ");const Ee=document.getElementById("hof-consistency-title");Ee&&(Ee.innerText=e?"Team Consistency Standings":"ตารางวัดความสม่ำเสมอของทีม");const ge=document.getElementById("hof-search-input");ge&&(ge.placeholder=e?"Search team / manager...":"ค้นหาชื่อทีม / ผู้จัดการ...",ge.setAttribute("aria-label",e?"Search team or manager in consistency matrix":"ค้นหาชื่อทีมหรือผู้จัดการในตารางทำเนียบแชมป์"));const We=document.getElementById("mobile-hof-scroll-hint");We&&(We.innerText=e?"Swipe right for more stats →":"เลื่อนขวาดูสถิติเพิ่มเติม →");const Pe=document.getElementById("hof-sort-select");if(Pe){Pe.setAttribute("aria-label",e?"Sort team consistency standings":"เรียงลำดับตารางความสม่ำเสมอ");const Se=Pe.value;Pe.innerHTML=e?`
            <option value="total_net">Sort: Total Net Pts ▼</option>
            <option value="wins">Sort: GW #1 Wins ▼</option>
            <option value="avg">Sort: Avg Points ▼</option>
            <option value="high">Sort: High Score ▼</option>
            <option value="low">Sort: Floor Score ▼</option>
            <option value="spread">Sort: Spread (Stable) ▲</option>
            <option value="hits">Sort: Fewest Hits ▲</option>
            <option value="team_name">Sort: Team Name A-Z ▲</option>
          `:`
            <option value="total_net">เรียง: คะแนนรวม ▼</option>
            <option value="wins">เรียง: แชมป์ GW ▼</option>
            <option value="avg">เรียง: คะแนนเฉลี่ย ▼</option>
            <option value="high">เรียง: คะแนนสูงสุด ▼</option>
            <option value="low">เรียง: คะแนนต่ำสุด ▼</option>
            <option value="spread">เรียง: ความนิ่ง (แกว่งน้อย) ▲</option>
            <option value="hits">เรียง: คะแนนลบน้อยสุด ▲</option>
            <option value="team_name">เรียง: ชื่อทีม A-Z ▲</option>
          `,Pe.value=Se}const Te=document.getElementById("hof-th-rank");Te&&(Te.innerText="#");const Ne=document.getElementById("hof-th-team");Ne&&(Ne.innerText=e?"Team & Manager":"ทีม");const He=document.getElementById("hof-th-wins");He&&(He.innerHTML=e?'<span class="sm:hidden">#1 GW</span><span class="hidden sm:inline">#1 GAMEWEEK</span>':'<span class="sm:hidden">#1 แชมป์</span><span class="hidden sm:inline">#1 แชมป์สัปดาห์</span>');const De=document.getElementById("hof-th-avg");De&&(De.innerHTML=e?'<span class="hidden sm:inline">Avg Points</span><span class="sm:hidden">Avg</span>':'<span class="hidden sm:inline">คะแนนเฉลี่ย</span><span class="sm:hidden">เฉลี่ย</span>');const je=document.getElementById("hof-th-high");je&&(je.innerHTML=e?'<span class="hidden sm:inline">High Score</span><span class="sm:hidden">High</span>':'<span class="hidden sm:inline">คะแนนสูงสุด</span><span class="sm:hidden">สูงสุด</span>');const ze=document.getElementById("hof-th-low");ze&&(ze.innerHTML=e?'<span class="hidden sm:inline">Floor Score</span><span class="sm:hidden">Floor</span>':'<span class="hidden sm:inline">คะแนนต่ำสุด</span><span class="sm:hidden">ต่ำสุด</span>');const Ge=document.getElementById("hof-th-spread");Ge&&(Ge.innerHTML=e?'<span class="hidden sm:inline">Spread (Range)</span><span class="sm:hidden">Range</span>':'<span class="hidden sm:inline">ความแกว่ง</span><span class="sm:hidden">แกว่ง</span>');const qe=document.getElementById("hof-th-hits");qe&&(qe.innerHTML=e?'<span class="hidden sm:inline">Transfer Hits</span><span class="sm:hidden">Hits</span>':'<span class="hidden sm:inline">คะแนนลบสะสม</span><span class="sm:hidden">คะแนนลบ</span>'),this.renderHallOfFameView();const Ue=document.getElementById("cup-kicker");Ue&&(Ue.innerText=e?"MINI-LEAGUE KNOCKOUT CUP":"การแข่งขันฟุตบอลถ้วยทางการ");const Qe=document.getElementById("cup-title");Qe&&(Qe.innerText=e?"Knockout Cup Tournament":"การแข่งขันฟุตบอลถ้วย");const se=document.getElementById("cup-subtitle");se&&(se.innerText=e?"Official FPL single-elimination tournament • Automatic pairings":"ระบบประกบคู่แบบแพ้คัดออก 1 ต่อ 1 ตามกติกา Official FPL"),this.renderCupView();const xe=document.getElementById("rules-kicker");xe&&(xe.innerText=e?"OFFICIAL LEAGUE RULES & PRIZE MATRIX":"กฎระเบียบและข้อบังคับลีกทางการ");const Ie=document.getElementById("rules-gw-badge");Ie&&(Ie.innerText=e?"38 GAMEWEEKS":"38 สัปดาห์"),this.renderRulesView(),this.renderAboutView()}renderRadarGuideCards(e,t){e&&(t?e.innerHTML=`
            <!-- S-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-900 dark:border-white font-display shadow-2xs">S-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">Elite</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Avg ≥ 71.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">Floor ≥ 41</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">High ≥ 110</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                Ultra-high average, resilient floor, explosive ceiling
              </div>
            </div>

            <!-- A-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 font-display">A-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">High Standard</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Avg ≥ 64.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">Floor ≥ 32</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                Consistently high output across fixtures
              </div>
            </div>

            <!-- B-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 font-display">B-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">Mid Baseline</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Avg ≥ 58.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">Standard Baseline</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                Steady mid-table baseline
              </div>
            </div>

            <!-- C-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-normal px-2 py-0.5 rounded-md bg-slate-50/60 text-slate-500 border border-slate-200/80 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 font-display">C-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">Developing</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Avg &lt; 58.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">Below Average</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                Needs squad restructuring
              </div>
            </div>

            <!-- Volatile -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50/80 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 font-display">Volatile</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">Volatile</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Wild Swings / Deep Floor</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">Floor &lt; 32 or Spread ≥ 75</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                Boom-or-bust wild score swings
              </div>
            </div>
          `:e.innerHTML=`
            <!-- S-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-900 dark:border-white font-display shadow-2xs">S-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">หัวกะทิ</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">เฉลี่ย ≥ 71.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">ต่ำสุด ≥ 41</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">สูงสุด ≥ 110</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                แต้มสูงจัด นิ่งจริง ระเบิดฟอร์มได้
              </div>
            </div>

            <!-- A-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 font-display">A-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">มาตรฐานสูง</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">เฉลี่ย ≥ 64.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">ต่ำสุด ≥ 32</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                มาตรฐานสูงสม่ำเสมอคงเส้นคงวา
              </div>
            </div>

            <!-- B-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 font-display">B-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">กลุ่มกลาง</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">เฉลี่ย ≥ 58.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">มาตรฐานทั่วไป</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                เกาะกลุ่มกลางคงที่
              </div>
            </div>

            <!-- C-Tier -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-normal px-2 py-0.5 rounded-md bg-slate-50/60 text-slate-500 border border-slate-200/80 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 font-display">C-Tier</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">พัฒนาการ</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">เฉลี่ย &lt; 58.0</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">ต่ำกว่าค่าเฉลี่ย</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                ระดับต้องปรับจูนทีม
              </div>
            </div>

            <!-- Volatile -->
            <div class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-colors">
              <div class="flex items-center gap-2 sm:w-36 flex-shrink-0">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50/80 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 font-display">Volatile</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">สวิงสูง</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:flex-1 text-xs font-mono">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">แกว่งจัด / จุดต่ำสุดหลุดลึก</span>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">ต่ำสุด &lt; 32 หรือ แกว่ง ≥ 75</span>
              </div>
              <div class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-right flex-shrink-0">
                วีคปังแต่วีคอื่นดิ่งลึก
              </div>
            </div>
          `)}initTheme(){const e=document.documentElement.classList.contains("dark");this.updateThemeIcons(e)}toggleTheme(){const e=document.documentElement.classList.toggle("dark");try{localStorage.setItem("fpl_theme",e?"dark":"light")}catch{}this.updateThemeIcons(e)}updateThemeIcons(e){const t=document.getElementById("theme-icon-moon"),a=document.getElementById("theme-icon-sun");t&&a&&(e?(t.classList.add("hidden"),t.classList.remove("block"),a.classList.remove("hidden"),a.classList.add("block")):(t.classList.remove("hidden"),t.classList.add("block"),a.classList.add("hidden"),a.classList.remove("block")))}escapeHtml(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}toggleLeagueDropdown(e){e&&e.stopPropagation();const t=document.getElementById("league-dropdown-menu"),a=document.getElementById("league-switcher-chevron");t&&(t.classList.contains("hidden")?(t.classList.remove("hidden"),a&&(a.style.transform="rotate(180deg)")):(t.classList.add("hidden"),a&&(a.style.transform="rotate(0deg)")))}closeLeagueDropdownIfClickedOutside(e){const t=document.getElementById("league-dropdown-menu"),a=document.getElementById("league-switcher-btn"),r=document.getElementById("league-switcher-chevron");if(t&&!t.classList.contains("hidden")){if(a&&a.contains(e.target))return;t.classList.add("hidden"),r&&(r.style.transform="rotate(0deg)")}}getLeagueDataUrl(e){const t=String(e);return typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${Object.keys(this.configs||{}).some(c=>window.location.pathname.includes("/"+c))?"../":"./"}data/leagues/${t}.json`:`${(typeof window<"u"&&window.location&&window.location.pathname?window.location.pathname:"").includes("/fpl-mini")?"/fpl-mini/":"/"}data/leagues/${t}.json`}getLeagueChunkUrl(e,t){const a=String(e);return typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${Object.keys(this.configs||{}).some(m=>window.location.pathname.includes("/"+m))?"../":"./"}data/leagues/${a}/gw${t}.json`:`${(typeof window<"u"&&window.location&&window.location.pathname?window.location.pathname:"").includes("/fpl-mini")?"/fpl-mini/":"/"}data/leagues/${a}/gw${t}.json`}getPlayersDataUrl(){return typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${Object.keys(this.configs||{}).some(d=>window.location.pathname.includes("/"+d))?"../":"./"}data/players.json`:`${(typeof window<"u"&&window.location&&window.location.pathname?window.location.pathname:"").includes("/fpl-mini")?"/fpl-mini/":"/"}data/players.json`}getAssetPrefix(){return typeof APP_ASSET_PREFIX<"u"&&APP_ASSET_PREFIX?APP_ASSET_PREFIX:"./"}async ensureSpecialFeatureData(e){if(typeof window<"u"&&window.location&&window.location.protocol==="file:")return!1;const t=String(e),r=(this.configs&&this.configs[t]||{}).features||{},p=this.getAssetPrefix();this._specialFetchPromises||(this._specialFetchPromises={});const i=(c,m,s)=>(this._specialFetchPromises[c]||(this._specialFetchPromises[c]=fetch(`${p}data/${m}`).then(o=>o.ok?o.json():null).then(o=>o?(s(o),!0):(delete this._specialFetchPromises[c],!1)).catch(()=>(delete this._specialFetchPromises[c],!1))),this._specialFetchPromises[c]),d=[];return r.has_shi62_special&&!this.shi62Data&&d.push(i("shi62","shi62_special.json",c=>{this.shi62Data=c})),(r.has_bramann_prediction||r.prize_model==="bramann_dual_prize")&&!this.bramannPredData&&d.push(i("bramann_pred","bramann_prediction.json",c=>{this.bramannPredData=c})),(r.has_bramann_challenge||r.prize_model==="bramann_dual_prize")&&!this.bramannChalData&&d.push(i("bramann_chal","bramann_challenge.json",c=>{this.bramannChalData=c})),d.length===0?!1:(await Promise.all(d)).some(Boolean)}async _fetchJsonWithRetry(e,t=2,a=12e3){if(typeof window<"u"&&window.location&&window.location.protocol==="file:"&&!/^https?:\/\//i.test(String(e||"")))return null;for(let r=0;r<=t;r++){const p=typeof AbortController<"u"?new AbortController:null,i=p?setTimeout(()=>p.abort(),a):null;try{const d=await fetch(e,{signal:p?p.signal:void 0});if(d&&d.ok)return await d.json();if(d&&d.status===404)return null}catch(d){console.debug(`Dynamic fetch attempt ${r+1} error (${e}):`,d)}finally{i&&clearTimeout(i)}r<t&&await new Promise(d=>setTimeout(d,400*(r+1)))}return null}async ensureTier2GWChunk(e=this.selectedGW,t=1){const a=String(this.activeLeagueId);if(!(!!(this.data&&this.data.tier===2)||!!(this.configs&&this.configs[a]&&this.configs[a].tier===2))||!this.data)return!1;const p=Number(e),i=Number(this.multiData&&this.multiData.max_gw)||p;if(!p||p<1||p>i)return!1;this.data.gameweeks||(this.data.gameweeks={});const d=String(p);let n=this.data.gameweeks[d];if(n&&Array.isArray(n.results)&&n.results.length>0)return!1;const c=`${a}_${d}`;if(this._tier2ChunkPromises||(this._tier2ChunkPromises={}),!this._tier2ChunkPromises[c]){const m=this.getLeagueChunkUrl(a,p);this._tier2ChunkPromises[c]=this._fetchJsonWithRetry(m,t,12e3).then(s=>{if(s&&Array.isArray(s.results)&&s.results.length>0){const o=this.multiData&&this.multiData.leagues&&this.multiData.leagues[a]||this.data;return o&&(o.gameweeks||(o.gameweeks={}),o.gameweeks[d]||(o.gameweeks[d]={gw:p}),o.gameweeks[d].results=s.results,s.is_finished!==void 0&&(o.gameweeks[d].is_finished=s.is_finished),s.is_started!==void 0&&(o.gameweeks[d].is_started=s.is_started),s.data_checked!==void 0&&(o.gameweeks[d].data_checked=s.data_checked),Array.isArray(s.unstarted_teams)&&(o.gameweeks[d].unstarted_teams=s.unstarted_teams),s.picks_synced!==void 0&&(o.gameweeks[d].picks_synced=s.picks_synced)),this.invalidateRenderCache(),!0}return!1}).finally(()=>{this._tier2ChunkPromises&&delete this._tier2ChunkPromises[c]})}return this._tier2ChunkPromises[c]}async ensurePlayersDict(){if(this.playersDict&&Object.keys(this.playersDict).length>0)return this.playersDict;if(typeof PLAYERS_DICT<"u"&&PLAYERS_DICT&&Object.keys(PLAYERS_DICT).length>0)return this.playersDict=PLAYERS_DICT,this.playersDict;try{const e=this.getPlayersDataUrl?this.getPlayersDataUrl():"data/players.json",t=await fetch(e);t&&t.ok&&(this.playersDict=await t.json())}catch{}return this.playersDict||(this.playersDict={}),this.playersDict}buildSquadPlayerEntry(e,t={}){const a=this.playersDict||{},r=a[String(e)]||a[e]||null;let p,i,d,n;Array.isArray(r)?(p=r[0],i=r[1],d=r[2],n=r[3]):r&&typeof r=="object"&&(p=r.name,i=r.team,d=r.pos,n=r.team_code);const c=t.elementType===1?"GKP":t.elementType===2?"DEF":t.elementType===3?"MID":t.elementType===4?"FWD":"MID";d=d||c,p=p||`Player ${e}`,i=i||"PL",n=n||0;const m=!!t.isCaptain,s=!!t.isVice,o=Number(t.multiplier!==void 0?t.multiplier:m?2:1),g=(t.liveMap||{})[e]||null,y=g&&Number(g.total_points)||0,D=g&&Number(g.provisional_bonus)||0,h=Array.isArray(t.unstartedTeams)?t.unstartedTeams:[],$=!!t.isGwFinished,v=g&&g.has_fixtures?!$&&!g.fixture_started:!$&&(h.includes(i)||h.includes(n));return{id:e,name:p,pos:d,team:i,team_code:n,points:t.isBench?y*(o>0?o:1):y*o,raw_points:y,multiplier:o,is_captain:m,is_vice:s,provisional_bonus:D,bps:g&&Number(g.bps)||0,minutes:g&&Number(g.minutes)||0,goals_scored:g&&Number(g.goals_scored)||0,assists:g&&Number(g.assists)||0,clean_sheets:g&&Number(g.clean_sheets)||0,goals_conceded:g&&Number(g.goals_conceded)||0,own_goals:g&&Number(g.own_goals)||0,penalties_saved:g&&Number(g.penalties_saved)||0,penalties_missed:g&&Number(g.penalties_missed)||0,yellow_cards:g&&Number(g.yellow_cards)||0,red_cards:g&&Number(g.red_cards)||0,saves:g&&Number(g.saves)||0,is_sub:!!t.isSub,is_sub_out:!!t.isSubOut,not_played_yet:v}}getTier2PicksChunkUrl(e,t){const a=String(e);return typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${Object.keys(this.configs||{}).some(m=>window.location.pathname.includes("/"+m))?"../":"./"}data/leagues/${a}/gw${t}_picks.json`:`${(typeof window<"u"&&window.location&&window.location.pathname?window.location.pathname:"").includes("/fpl-mini")?"/fpl-mini/":"/"}data/leagues/${a}/gw${t}_picks.json`}hasTier2PicksForGw(e,t){if(!e)return!1;const a=Number(t);return Array.isArray(e._loaded_t2_picks_gws)&&e._loaded_t2_picks_gws.includes(a)}async ensureTier2PicksChunk(e=this.selectedGW,t=this.activeLeagueId){const a=String(t||this.activeLeagueId||"");if(!a||!this.multiData||!this.multiData.leagues)return!1;const r=this.multiData.leagues[a]||(a===String(this.activeLeagueId)?this.data:null);if(!r||!(r.tier===2||this.configs&&this.configs[a]&&this.configs[a].tier===2)||typeof window<"u"&&window.location&&window.location.protocol==="file:")return!1;const i=Number(e),d=Number(this.multiData&&this.multiData.max_gw)||i;if(!i||i<1||i>d)return!1;if(this.hasTier2PicksForGw(r,i))return!0;const n=r.gameweeks?r.gameweeks[String(i)]:null;if(!n||i<d&&!n.picks_synced)return!1;const c=`${a}_${i}`;if(this._missingTier2PicksGws||(this._missingTier2PicksGws=new Set),this._missingTier2PicksGws.has(c))return!1;if(this._tier2PicksPromises||(this._tier2PicksPromises={}),!this._tier2PicksPromises[c]){const m=this.getTier2PicksChunkUrl(a,i);this._tier2PicksPromises[c]=(async()=>{try{const s=await fetch(m);if(!s||!s.ok)return this._missingTier2PicksGws.add(c),!1;const o=await s.json(),l=o&&o.picks;if(!l||typeof l!="object"||Object.keys(l).length===0)return this._missingTier2PicksGws.add(c),!1;await this.ensurePlayersDict();const g=this._liveMapsByGw&&this._liveMapsByGw[i]||(Number(this.lastLiveGw)===i?this._latestLiveMap:null)||{},y=!!(n&&n.is_finished),D=!!(n&&n.data_checked),h=n&&Array.isArray(n.unstarted_teams)?n.unstarted_teams:[];r.squads||(r.squads={});const $=new Map;(n.results||[]).forEach(I=>{I&&I.entry_id&&$.set(Number(I.entry_id),I)});const v=new Map;(r.teams||[]).forEach(I=>{I&&I.entry_id&&v.set(Number(I.entry_id),I)});for(const[I,L]of Object.entries(l)){const k=Number(I);if(!k||!L)continue;const x=`${k}_${i}`;if(L.dnp){r.squads[x]={dnp:!0,starting:[],bench:[],auto_subs:[]};continue}const C=Array.isArray(L.p)?L.p:[];if(C.length===0)continue;const T=L.ch||null,H=T==="bboost"||T==="bench_boost",z=T==="3xc"||T==="triple_captain"?3:2,U=L.c,Q=L.v,W=C.map((A,F)=>({element:A,position:F+1,is_captain:A===U,is_vice:A===Q,multiplier:A===U?z:F<11||H?1:0}));let P=W.slice(0,11),u=W.slice(11);const N=Array.isArray(L.as)?L.as.filter(A=>Array.isArray(A)&&A.length>=2).map(A=>({element_in:A[0],element_out:A[1]})):[];if(N.length>0)for(const A of N){const F=P.findIndex(j=>j.element===A.element_out),q=u.findIndex(j=>j.element===A.element_in);if(F!==-1&&q!==-1){const j=P[F],R=u[q];P[F]={...R,multiplier:j.multiplier>0?j.multiplier:1,is_captain:j.is_captain,is_vice:j.is_vice,is_sub:!0},u[q]={...j,multiplier:0,is_captain:!1,is_vice:!1,is_sub_out:!0}}}const w=P.map(A=>this.buildSquadPlayerEntry(A.element,{isCaptain:A.is_captain,isVice:A.is_vice,multiplier:A.multiplier,isBench:!1,isSub:A.is_sub,liveMap:g,isGwFinished:y,unstartedTeams:h})),b=u.map(A=>this.buildSquadPlayerEntry(A.element,{isCaptain:A.is_captain,isVice:A.is_vice,multiplier:A.multiplier,isBench:!0,isSubOut:A.is_sub_out,liveMap:g,isGwFinished:y,unstartedTeams:h})),_=Number(L.h||0);r.squads[x]={starting:w,bench:b,auto_subs:N,chip:T,hits:_,prev_total:L.pt,summary_overall_rank:L.ov||null,final_checked:!!(y&&D)};const S=$.get(k),E=v.get(k);if(S){if(S._squadEnriched=!0,S.prev_total===void 0&&L.pt!==void 0&&(S.prev_total=L.pt),S.hits===void 0&&(S.hits=_),!S.chip&&T&&(S.chip=T),(!S.captain||S.captain==="-")&&U){const A=w.find(F=>F.is_captain)||b.find(F=>F.is_captain);A&&A.name&&(S.captain=A.name)}!S.fpl_overall_rank&&L.ov&&(S.fpl_overall_rank=L.ov)}E&&(E.prev_total===void 0&&L.pt!==void 0&&(E.prev_total=L.pt),!E.fpl_overall_rank&&L.ov&&(E.fpl_overall_rank=L.ov))}return Array.isArray(r._loaded_t2_picks_gws)||(r._loaded_t2_picks_gws=[]),r._loaded_t2_picks_gws.includes(i)||r._loaded_t2_picks_gws.push(i),a===String(this.activeLeagueId)&&this.data&&this.data!==r&&(this.data.squads=r.squads,this.data._loaded_t2_picks_gws=r._loaded_t2_picks_gws),this.lastLiveJson&&Number(this.lastLiveGw)===i&&this.applyLiveElements(this.lastLiveJson,i),this.invalidateRenderCache(),!0}catch{return!1}finally{this._tier2PicksPromises&&delete this._tier2PicksPromises[c]}})()}return this._tier2PicksPromises[c]}getLeagueSquadChunkUrl(e,t){const a=String(e);return typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${Object.keys(this.configs||{}).some(m=>window.location.pathname.includes("/"+m))?"../":"./"}data/leagues/${a}/gw${t}_squads.json`:`${(typeof window<"u"&&window.location&&window.location.pathname?window.location.pathname:"").includes("/fpl-mini")?"/fpl-mini/":"/"}data/leagues/${a}/gw${t}_squads.json`}getRadarDataUrl(){return typeof window<"u"&&window.location&&window.location.protocol==="file:"?`${Object.keys(this.configs||{}).some(d=>window.location.pathname.includes("/"+d))?"../":"./"}data/radar.json`:`${(typeof window<"u"&&window.location&&window.location.pathname?window.location.pathname:"").includes("/fpl-mini")?"/fpl-mini/":"/"}data/radar.json`}hasTier1SquadsForGw(e,t){if(!e||!e.squads)return!1;const a=Number(t);if(Array.isArray(e._loaded_squad_gws)&&e._loaded_squad_gws.includes(a))return!0;const r=`_${a}`;return Object.keys(e.squads).some(p=>p.endsWith(r))}async ensureTier1GWSquads(e=this.selectedGW,t=this.activeLeagueId,a=1){const r=String(t);if(!this.multiData||!this.multiData.leagues)return!1;const p=this.multiData.leagues[r]||(r===String(this.activeLeagueId)?this.data:null);if(!p||p.tier===2||this.configs&&this.configs[r]&&this.configs[r].tier===2||typeof window<"u"&&window.location&&window.location.protocol==="file:")return!1;const d=Number(e),n=Number(this.multiData&&this.multiData.max_gw)||d;if(!d||d<1||d>n||this.hasTier1SquadsForGw(p,d))return!1;const c=`${r}_${d}`;if(this._tier1SquadChunkPromises||(this._tier1SquadChunkPromises={}),!this._tier1SquadChunkPromises[c]){const m=this.getLeagueSquadChunkUrl(r,d);this._tier1SquadChunkPromises[c]=this._fetchJsonWithRetry(m,a,12e3).then(s=>s&&s.squads&&typeof s.squads=="object"?(p.squads||(p.squads={}),Object.assign(p.squads,s.squads),Array.isArray(p._loaded_squad_gws)||(p._loaded_squad_gws=[]),p._loaded_squad_gws.includes(d)||p._loaded_squad_gws.push(d),r===String(this.activeLeagueId)&&this.data&&this.data!==p&&(this.data.squads||(this.data.squads={}),Object.assign(this.data.squads,s.squads)),this.invalidateRenderCache(),!0):!1).finally(()=>{this._tier1SquadChunkPromises&&delete this._tier1SquadChunkPromises[c]})}return this._tier1SquadChunkPromises[c]}async ensureTransferSuggestionsData(e=1){if(!this.multiData)return!1;const t=this.multiData.transfer_suggestions;if(t&&typeof t=="object"&&Array.isArray(t.pool)&&t.pool.length>0||typeof window<"u"&&window.location&&window.location.protocol==="file:")return!1;if(!this._transferSuggPromise){const r=`${this.getAssetPrefix()}data/transfer_suggestions.json`;this._transferSuggPromise=this._fetchJsonWithRetry(r,e,12e3).then(p=>p&&typeof p=="object"&&(Array.isArray(p.pool)||p.gw)?(this.multiData.transfer_suggestions=p,this.invalidateRenderCache(),!0):!1).finally(()=>{this._transferSuggPromise=null})}return this._transferSuggPromise}async ensureRadarData(e=1){if(!this.multiData||!this.multiData.leagues||!!(this.config&&this.config.visibility==="private")||Object.keys(this.multiData.leagues).length<=1||typeof window<"u"&&window.location&&window.location.protocol==="file:")return!1;const a=this.configs||{};if(!Object.entries(this.multiData.leagues).some(([p,i])=>!i||i.tier===2||a[p]&&a[p].tier===2?!1:!Array.isArray(i.teams)||i.teams.length===0||!i.gameweeks||Object.keys(i.gameweeks).length===0))return!1;if(!this._radarFetchPromise){const p=this.getRadarDataUrl();this._radarFetchPromise=this._fetchJsonWithRetry(p,e,12e3).then(i=>{if(i&&i.leagues){let d=!1;return Object.entries(i.leagues).forEach(([n,c])=>{const m=this.multiData.leagues[n];if(!m){this.multiData.leagues[n]=c,d=!0;return}!!(Array.isArray(m.teams)&&m.teams.length>0&&m.gameweeks&&Object.keys(m.gameweeks).length>0||m.squads&&Object.keys(m.squads).length>0)||(m.teams=c.teams||[],m.gameweeks=c.gameweeks||{},c.member_count!==void 0&&(m.member_count=c.member_count),d=!0)}),d&&(this._radarTeamList=null,this._teamTierCache={},this.invalidateRenderCache()),d}return!1}).finally(()=>{this._radarFetchPromise=null})}return this._radarFetchPromise}async fetchLeagueData(e,t=2){const a=String(e);if(!this.multiData||!this.multiData.leagues||!this.multiData.leagues[a])return null;const r=this.multiData.leagues[a],p=r.tier===2||this.configs[a]&&this.configs[a].tier===2;if(p){if(r.teams&&r.teams.length>0)return r}else if(r.squads&&Object.keys(r.squads).length>0)return r;if(this._leagueFetchPromises||(this._leagueFetchPromises={}),!this._leagueFetchPromises[a]){const i=this.getLeagueDataUrl(a);this._leagueFetchPromises[a]=this._fetchJsonWithRetry(i,t,15e3).then(d=>d&&(d.squads||p&&d.teams)?(this.multiData.leagues[a]=d,this.lastLiveJson&&this.lastLiveGw&&this.applyLiveElements(this.lastLiveJson,this.lastLiveGw),String(this.activeLeagueId)===a&&(this.data=this.multiData.leagues[a]),this.multiData.leagues[a]):null).finally(()=>{this._leagueFetchPromises&&delete this._leagueFetchPromises[a]})}return this._leagueFetchPromises[a]}recordRecentLeague(e,t){const a=String(e||"").trim();if(!/^[0-9]{1,10}$/.test(a))return;const r=String(t||"").slice(0,80).trim();try{if(typeof localStorage>"u")return;localStorage.setItem("fpl_mini_active_league",a),r&&localStorage.setItem("fpl_mini_active_league_name",r);let p=[];try{const n=JSON.parse(localStorage.getItem("fpl_mini_recent_leagues")||"[]");Array.isArray(n)&&(p=n)}catch{}const i=[{id:a,name:r}],d=new Set([a]);for(let n=0;n<p.length;n+=1){const c=p[n],m=String(c&&c.id||"").trim();if(!/^[0-9]{1,10}$/.test(m)||d.has(m))continue;d.add(m);const s=String(c&&c.name||"").slice(0,80).trim();if(i.push({id:m,name:s}),i.length>=3)break}localStorage.setItem("fpl_mini_recent_leagues",JSON.stringify(i))}catch{}}async switchLeague(e,t=!1){const a=String(e);if(!this.multiData||!this.multiData.leagues||!this.multiData.leagues[a])return;typeof window<"u"&&window._trackLeagueSwitch&&window._trackLeagueSwitch(a),this._switchingTargetId=a;const r=this.multiData.leagues[a],p=r.tier===2||this.configs[a]&&this.configs[a].tier===2;if(p?!!(r.teams&&r.teams.length>0):!!(r.squads&&Object.keys(r.squads).length>0)){if(await this.ensureSpecialFeatureData(a),this._switchingTargetId!==a)return}else{this._isLoadingLeague=a;try{const[s]=await Promise.all([this.fetchLeagueData(a,2),this.ensureSpecialFeatureData(a)]);if(this._isLoadingLeague===a&&(this._isLoadingLeague=null),this._switchingTargetId!==a)return;if(!s)if(typeof window<"u"&&window.location&&window.location.protocol==="file:"){const o=this.getLeagueDataUrl(a).startsWith("../")?"../":"./";window.location.href=`${o}${a}/index.html`;return}else{const o=this.currentLang==="en";this.showToast(o?"Could not load league data. Please check your connection.":"ไม่สามารถโหลดข้อมูลของลีกได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต","error")}}finally{this._isLoadingLeague===a&&(this._isLoadingLeague=null)}}if(this.activeLeagueId=a,this.data=this.multiData.leagues[this.activeLeagueId]||{},this.config=this.configs[this.activeLeagueId]||{},this.config.features||(this.config.features={}),p){if(await this.ensureTier2GWChunk(this.selectedGW),this._switchingTargetId!==a||(await this.ensureTier2PicksChunk(this.selectedGW,a),this._switchingTargetId!==a))return}else if(await this.ensureTier1GWSquads(this.selectedGW,a),this._switchingTargetId!==a)return;const d=(this.config&&this.config.monthly_schedule||[]).find(s=>s.gw_list&&s.gw_list.includes(this.selectedGW));this.selectedMonthId=d?d.id:1,this.matchdayChunkLimit=40,this.overallChunkLimit=40,this.prizesSearchQuery="",this.prizesFilterMode="all",this.prizesHistoryExpanded=!1,this.cupSearchQuery="",this.cupFilterMode="all";const n=String(this.data&&this.data.name||this.config&&this.config.name||"").slice(0,80);if(typeof this.recordRecentLeague=="function"&&this.recordRecentLeague(this.activeLeagueId,n),!t)try{if(window.history&&(window.history.pushState||window.history.replaceState)){const s=new URLSearchParams(window.location.search||""),o=s.get("tab");if(o){const l=this.normalizeTab(o),g=["highlights-view","competition-view","transfers-view","transfer-advisor-view","hall-of-fame-view","global-radar-view"];(l==="about-view"&&!this.hasDevCornerFeature()||l==="shi62-special-view"&&!this.hasShi62Feature()||l==="bramann-prediction-view"&&!this.hasBramannPredFeature()||l==="bramann-challenge-view"&&!this.hasBramannChalFeature()||p&&g.includes(l))&&s.delete("tab")}if(window.location.protocol==="http:"||window.location.protocol==="https:"){const g=window.location.pathname.includes("/fpl-mini")?"/fpl-mini/":"/",y=Object.keys(this.configs||{});if(y.some(h=>window.location.pathname.includes("/"+h))){let h=window.location.pathname;y.forEach(v=>{h=h.replace(new RegExp("/"+v+"(/index.html|/)?$"),"/"+this.activeLeagueId+"/")});const $=s.toString();window.history.pushState(null,"",h+($?"?"+$:""))}else s.set("league",this.activeLeagueId),window.history.pushState(null,"",g+"?"+s.toString())}else{const l=window.location.pathname;s.set("league",this.activeLeagueId),window.history.replaceState(null,"",l+"?"+s.toString())}}}catch(s){console.warn("history state update skipped:",s);try{window.location.hash=this.activeLeagueId}catch{}}const c=document.getElementById("league-dropdown-menu"),m=document.getElementById("league-switcher-chevron");if(c&&c.classList.add("hidden"),m&&(m.style.transform="rotate(0deg)"),this.renderLeagueDropdown(),this.updateHeaderInfo(),this._openDramaEventId=null,this._dramaStripExpandedMobile=!1,this._rivalState&&this._rivalState.isOpen&&typeof this.closeRivalModal=="function"&&this.closeRivalModal(),this.renderAll(),this.activeTab&&this.switchTab(this.activeTab,!0),p&&this.isLiveWindowActive()){const s=this._tier2LastFetchAt&&this._tier2LastFetchAt[a]||0;Date.now()-s>55e3&&this.fetchLivePoints(!1)}}renderLeagueDropdown(){const e=document.getElementById("league-dropdown-options");if(!e)return;const t=this.currentLang==="en",a=Object.keys(this.multiData.leagues||{});a.sort((p,i)=>Number(p)-Number(i));let r="";a.forEach(p=>{const i=this.multiData.leagues[p];if(!i)return;const d=p===this.activeLeagueId,n=i.member_count!==void 0?i.member_count:(i.teams||[]).length,m=i.tier===2||this.configs[p]&&this.configs[p].tier===2?'<span class="ml-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 font-display">Tier 2</span>':"";r+=`
            <button onclick="app.switchLeague('${p}')" class="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-50/60 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${d?"bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-950 dark:text-blue-300 font-black":""}">
              <div>
                <div class="${d?"text-blue-950 dark:text-blue-300 font-black":"text-slate-900 dark:text-white"}">${this.escapeHtml(i.name)}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-normal flex items-center gap-1 mt-0.5">League ${p} • ${n.toLocaleString()} ${t?"Teams":"ทีม"} ${m}</div>
              </div>
              ${d?`<span class="text-blue-600 dark:text-blue-400 font-black text-xs font-display">✓ ${t?"Active":"กำลังดู"}</span>`:""}
            </button>
          `}),e.innerHTML=r}updateHeaderInfo(){const e=this.currentLang==="en",t=document.getElementById("header-brand-home");if(t){const Y=typeof window<"u"&&window.location&&window.location.protocol==="file:",X=this.getAssetPrefix();t.href=Y?`${X}index.html`:X,t.title=e?"Back to FPLSaWaDiKa Home":"กลับหน้าแรก FPLSaWaDiKa"}const a=document.getElementById("header-trial-badge");if(a){const Y=this.isLeagueTrial();a.classList.toggle("hidden",!Y);const X=this.config&&typeof this.config.expires_at=="string"?this.config.expires_at.trim():"";if(Y&&/^\d{4}-\d{2}-\d{2}$/.test(X)){const M=X.split("-").map(ue=>parseInt(ue,10)),V=new Date(Date.UTC(M[0],M[1]-1,M[2])),Z=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],O=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],ae=V.getUTCMonth(),de=V.getUTCDate(),oe=e?`${O[ae]} ${de}`:`${de} ${Z[ae]}`;a.textContent=e?`TRIAL · til ${oe}`:`ทดลองใช้ · ถึง ${oe}`,a.title=e?`Trial expires on ${X}`:`ทดลองใช้งานถึงวันที่ ${X}`}else a.textContent=e?"TRIAL":"ทดลองใช้",a.removeAttribute("title")}const p=Object.keys(this.multiData&&this.multiData.leagues||{}).length<=1,i=document.getElementById("league-switcher-btn"),d=document.getElementById("league-switcher-chevron-wrap");d&&(d.classList.toggle("hidden",p),d.style.display=p?"none":""),i&&(i.classList.toggle("cursor-default",p),i.classList.toggle("cursor-pointer",!p),i.disabled=p,i.title=p?"":e?"Click to switch mini-league":"คลิกเพื่อสลับดูมินิลีกอื่น");const n=this.isLeaguePaused();this.renderPausedOverlay(n),n&&(this.livePollInterval&&(clearInterval(this.livePollInterval),this.livePollInterval=null),this._visibilityPollTimer&&(clearTimeout(this._visibilityPollTimer),this._visibilityPollTimer=null));const c=document.getElementById("header-platform-sub");c&&(c.innerText=e?"Mini-League":"มินิลีก");const m=document.getElementById("league-dropdown-header-title");m&&(m.innerText=e?"Switch Mini-League (FPLSaWaDiKa)":"สลับมินิลีก (FPLSaWaDiKa)");const s=document.getElementById("league-dropdown-header-hint");s&&(s.innerText=e?"Click to switch":"คลิกเพื่อสลับ");const o=document.getElementById("header-league-name"),l=document.getElementById("header-league-id-badge"),g=document.getElementById("header-season"),y=document.getElementById("header-member-count"),D=document.getElementById("tab-btn-cup");o&&(o.innerText=this.data.name);const h=document.getElementById("main-page-heading");h&&this.data&&this.data.name&&(h.textContent=`${this.data.name} — FPLSaWaDiKa`),typeof document<"u"&&this.data&&this.data.name&&(document.title=`FPLSaWaDiKa — ${this.data.name}`),l&&(l.innerText=`LEAGUE ${this.activeLeagueId}`),g&&(g.innerText=e?`Season ${this.data.season||"2026/27"}`:`ฤดูกาล ${this.data.season||"2026/27"}`),y&&(y.innerText=e?`${(this.data.teams||[]).length} Members`:`${(this.data.teams||[]).length} ทีมสมาชิก`);const $=Number(this.multiData.max_gw)||2,v=this.data.gameweeks?this.data.gameweeks[String($)]:null,I=!!(v&&v.is_finished),L=v?v.is_started!==void 0?!!v.is_started:I||v.results&&v.results.some(Y=>Y.points>0):!1,k=document.getElementById("header-gw-status"),x=document.getElementById("api-status-text"),C=document.getElementById("header-gw-status-dot"),T=document.getElementById("header-last-sync-icon");k&&(I?k.innerText=e?`Gameweek ${$} Finished`:`Gameweek ${$} จบการแข่งขัน`:L?k.innerText=e?`Gameweek ${$} Live in Progress`:`Gameweek ${$} กำลังแข่งขัน`:k.innerText=e?`Gameweek ${$} Upcoming`:`Gameweek ${$} รอคิกออฟ`),I?(x&&(x.className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"),C&&(C.className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-2")):L?(x&&(x.className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 hidden md:flex items-center bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-xs"),C&&(C.className="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2")):(x&&(x.className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 hidden md:flex items-center bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-xs"),C&&(C.className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"));let H=!0,z=e?"Auto-Sync System Online":"ระบบเชื่อมต่อ Auto-Sync ปกติ";if(this.multiData&&this.multiData.sync_status==="offline")H=!1,z=e?"Auto-Sync Offline / Error":"ไม่สามารถเชื่อมต่อระบบ Auto-Sync ได้";else if(this.multiData&&this.multiData.last_sync_iso)try{const Y=new Date(this.multiData.last_sync_iso.replace(" ","T")+"+07:00");(new Date-Y)/(1e3*60*60)>24&&(H=!1,z=e?"No Auto-Sync signal for > 24h (Offline)":"ไม่พบสัญญาณ Auto-Sync นานกว่า 24 ชม.")}catch{}if(T){const Y=this.multiData&&this.multiData.last_sync_iso?this.formatSyncDate(this.multiData.last_sync_iso):this.multiData.last_sync||"",X=Y?`${z} (${Y})`:z;H?T.innerHTML=`
              <span class="relative flex items-center justify-center w-2.5 h-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span class="relative inline-flex rounded-full w-2 h-2 bg-emerald-500 heartbeat-green shadow-xs"></span>
              </span>
            `:T.innerHTML=`
              <span class="relative flex items-center justify-center w-2.5 h-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
                <span class="relative inline-flex rounded-full w-2 h-2 bg-rose-500 heartbeat-rose shadow-xs"></span>
              </span>
            `,T.setAttribute("title",X)}this.updateHeaderDeadline();const U=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2),Q=!U&&!!(this.config&&this.config.features&&(this.config.features.prize_model==="bramann_dual_prize"||this.config.features.has_weekly_prizes||this.config.features.has_monthly_prizes||this.config.features.has_settlement_phases||this.config.features.has_weekly_penalties)||this.config&&this.config.total_pool&&this.config.total_pool!=="-"&&!String(this.config.total_pool).includes("เสื้อบอล")&&!String(this.config.entry_fee).includes("ฟรี")),W=document.getElementById("tab-btn-highlights"),P=document.getElementById("tab-btn-competition"),u=document.getElementById("tab-btn-transfers"),N=document.getElementById("tab-btn-transfer-advisor"),w=document.getElementById("tab-btn-global-radar"),b=document.getElementById("tab-btn-hall-of-fame"),_=document.getElementById("tab-btn-prizes");W&&W.classList.toggle("hidden",U),P&&P.classList.toggle("hidden",U),u&&u.classList.toggle("hidden",U),N&&N.classList.toggle("hidden",U),w&&w.classList.toggle("hidden",U),b&&b.classList.toggle("hidden",U),_&&_.classList.toggle("hidden",!Q);const S=!!(this.config.features&&this.config.features.has_cup);D&&(S?D.classList.remove("hidden"):D.classList.add("hidden"));const E=document.getElementById("tab-btn-about"),A=this.hasDevCornerFeature();E&&(E.classList.toggle("hidden",!A),!A&&this.activeTab==="about-view"&&this.switchTab("gameweek-view",!1));const F=document.getElementById("tab-btn-shi62-special"),q=this.hasShi62Feature();F&&(q?F.classList.remove("hidden"):(F.classList.add("hidden"),this.activeTab==="shi62-special-view"&&this.switchTab("gameweek-view",!0)));const j=this.hasBramannPredFeature(),R=this.hasBramannChalFeature(),G=document.getElementById("tab-btn-bramann-prediction"),K=document.getElementById("tab-btn-bramann-challenge");G&&(j?G.classList.remove("hidden"):(G.classList.add("hidden"),this.activeTab==="bramann-prediction-view"&&this.switchTab("gameweek-view",!0))),K&&(R?K.classList.remove("hidden"):(K.classList.add("hidden"),this.activeTab==="bramann-challenge-view"&&this.switchTab("gameweek-view",!0))),U&&["highlights-view","competition-view","transfers-view","transfer-advisor-view","hall-of-fame-view","global-radar-view"].includes(this.activeTab)?this.switchTab("gameweek-view",!0):!Q&&this.activeTab==="prizes-view"?this.switchTab("gameweek-view",!0):!q&&this.activeTab==="shi62-special-view"?this.switchTab("gameweek-view",!0):!j&&this.activeTab==="bramann-prediction-view"?this.switchTab("gameweek-view",!0):!R&&this.activeTab==="bramann-challenge-view"?this.switchTab("gameweek-view",!0):!A&&this.activeTab==="about-view"?this.switchTab("gameweek-view",!1):this.switchTab(this.activeTab,!0,!0)}initTabNavigation(){this._tabNavBound||(this._tabNavBound=!0,document.querySelectorAll(".tab-nav-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-tab-target");this.switchTab(t)})})),this.updateHighlightsTabBlink()}switchTab(e,t=!1,a=!1){if(this.isLeaguePaused()){this.renderPausedOverlay(!0);return}let r=this.normalizeTab(e);!this.hasDevCornerFeature()&&r==="about-view"&&(r="gameweek-view");let p=document.getElementById(r);p||(r="gameweek-view",p=document.getElementById("gameweek-view")),this.activeTab=r;try{typeof window._trackFeature=="function"&&window._trackFeature("tab",r)}catch{}document.querySelectorAll(".tab-content").forEach(n=>n.classList.add("hidden")),p&&p.classList.remove("hidden");const i=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2),d=!i&&!!(this.config&&this.config.features&&(this.config.features.prize_model==="bramann_dual_prize"||this.config.features.has_weekly_prizes||this.config.features.has_monthly_prizes||this.config.features.has_settlement_phases||this.config.features.has_weekly_penalties)||this.config&&this.config.total_pool&&this.config.total_pool!=="-"&&!String(this.config.total_pool).includes("เสื้อบอล")&&!String(this.config.entry_fee).includes("ฟรี"));document.querySelectorAll(".tab-nav-btn").forEach(n=>{let m=n.getAttribute("data-tab-target")===this.activeTab?"tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white":"tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800";i&&(n.id==="tab-btn-highlights"||n.id==="tab-btn-competition"||n.id==="tab-btn-transfers"||n.id==="tab-btn-transfer-advisor"||n.id==="tab-btn-global-radar"||n.id==="tab-btn-hall-of-fame")&&(m+=" hidden"),!d&&n.id==="tab-btn-prizes"&&(m+=" hidden"),n.id==="tab-btn-cup"&&!(this.config&&this.config.features&&this.config.features.has_cup)&&(m+=" hidden"),n.id==="tab-btn-shi62-special"&&!this.hasShi62Feature()&&(m+=" hidden"),n.id==="tab-btn-bramann-prediction"&&!this.hasBramannPredFeature()&&(m+=" hidden"),n.id==="tab-btn-bramann-challenge"&&!this.hasBramannChalFeature()&&(m+=" hidden"),n.id==="tab-btn-about"&&!this.hasDevCornerFeature()&&(m+=" hidden"),n.className=m});try{typeof localStorage<"u"&&localStorage.setItem("fpl_mini_active_tab",this.activeTab)}catch{}if(!t)try{if(typeof window<"u"&&window.history&&window.history.replaceState){const n=new URLSearchParams(window.location.search||""),c=this.activeTab.replace("-view","");c==="gameweek"?n.delete("tab"):n.set("tab",c);const m=n.toString(),s=window.location.pathname+(m?"?"+m:"")+window.location.hash;window.history.replaceState(null,"",s)}}catch{}this.updateHighlightsTabBlink(),a||this.renderCurrentTab(!1),this.activeTab==="global-radar-view"&&typeof this.ensureRadarData=="function"?this.ensureRadarData().then(n=>{n&&this.activeTab==="global-radar-view"&&this.renderCurrentTab(!0)}):(this.activeTab==="transfer-advisor-view"||this.activeTab==="transfers-view")&&typeof this.ensureTransferSuggestionsData=="function"&&this.ensureTransferSuggestionsData().then(n=>{n&&(this.activeTab==="transfer-advisor-view"||this.activeTab==="transfers-view")&&this.renderCurrentTab(!0)})}updateHighlightsTabBlink(){const e=document.getElementById("tab-btn-live"),t=document.getElementById("tab-btn-highlights"),a=document.getElementById("tab-btn-competition"),r=document.getElementById("tab-btn-transfer-advisor"),p=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2);p&&(t&&t.classList.add("hidden"),a&&a.classList.add("hidden"),r&&r.classList.add("hidden"));const i=String(this.selectedGW),d=this.data.gameweeks?this.data.gameweeks[i]:null;(d?!!d.is_finished:!1)?(e&&(this.activeTab==="gameweek-view"?e.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent":e.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",e.classList.remove("tab-pulse-live","tab-pulse-live-active")),t&&!p&&(this.activeTab==="highlights-view"?t.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent":t.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",t.classList.remove("tab-pulse-live","tab-pulse-live-active")),r&&!p&&(this.activeTab==="transfer-advisor-view"?r.className="tab-nav-btn tab-pulse-live-active flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 text-white border border-emerald-500 shadow-xs dark:bg-emerald-600 dark:text-white dark:border-emerald-400":r.className="tab-nav-btn tab-pulse-live flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-emerald-600 dark:text-emerald-400 border border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20"),a&&!p&&(this.activeTab==="competition-view"?a.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent":a.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",a.classList.remove("tab-pulse-comp","tab-pulse-comp-active"))):(e&&(this.activeTab==="gameweek-view"?e.className="tab-nav-btn tab-pulse-live-active flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 text-white border border-emerald-500 shadow-xs dark:bg-emerald-600 dark:text-white dark:border-emerald-400":e.className="tab-nav-btn tab-pulse-live flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-emerald-600 dark:text-emerald-400 border border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20"),t&&!p&&(this.activeTab==="highlights-view"?t.className="tab-nav-btn tab-pulse-live-active flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-emerald-600 text-white border border-emerald-500 shadow-xs dark:bg-emerald-600 dark:text-white dark:border-emerald-400":t.className="tab-nav-btn tab-pulse-live flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-emerald-600 dark:text-emerald-400 border border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20"),r&&!p&&(this.activeTab==="transfer-advisor-view"?r.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent":r.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",r.classList.remove("tab-pulse-live","tab-pulse-live-active")),a&&!p&&(this.activeTab==="competition-view"?a.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white border border-transparent":a.className="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",a.classList.remove("tab-pulse-comp","tab-pulse-comp-active")))}getRenderStamp(){return`${this.activeLeagueId||""}|${this.selectedGW||""}|${this.currentLang||"th"}|${this._dataVersion||0}`}invalidateRenderCache(){this._dataVersion=(this._dataVersion||0)+1,this._renderedState={}}renderAll(){if(this.isLeaguePaused()){this.renderPausedOverlay(!0);return}this.invalidateRenderCache(),this.renderGWSelector(),this.renderCurrentTab(!0),this.updateHighlightsTabBlink()}renderCurrentTab(e=!1){const t=this.activeTab||"gameweek-view",a=this.getRenderStamp();if(!(!e&&this._renderedState&&this._renderedState[t]===a)){if(this._renderedState||(this._renderedState={}),t==="gameweek-view")this.renderGameweekView();else if(t==="highlights-view")this.renderHighlightsView();else if(t==="competition-view")this.renderCompetitionView();else if(t==="transfers-view")this.renderTransfersView();else if(t==="transfer-advisor-view")this.renderTransferAdvisorView();else if(t==="prizes-view")this.renderPrizesView();else if(t==="hall-of-fame-view")this.renderHallOfFameView();else if(t==="global-radar-view")this.renderGlobalRadarView();else if(t==="cup-view")this.renderCupView();else if(t==="rules-view")this.renderRulesView();else if(t==="shi62-special-view")if(this.hasShi62Feature())this.renderShi62Special();else{this.switchTab("gameweek-view");return}else if(t==="bramann-prediction-view")if(this.hasBramannPredFeature())this.renderBramannPrediction();else{this.switchTab("gameweek-view");return}else if(t==="bramann-challenge-view")if(this.hasBramannChalFeature())this.renderBramannChallenge();else{this.switchTab("gameweek-view");return}else if(t==="about-view")if(this.hasDevCornerFeature())this.renderAboutView();else{this.switchTab("gameweek-view");return}else this.renderGameweekView();this._renderedState[t]=a}}selectShi62GW(e){this.activeShi62GW=e,this.renderShi62Special()}showCopiedToast(e="คัดลอกข้อความสำเร็จ!"){this.showToast(e,"line",1800)}selectBramannPredGW(e){this.activeBramannPredGW=e,this.renderBramannPrediction()}selectBramannChalGW(e){this.activeBramannChalGW=e,this.renderBramannChallenge()}renderBramannPrediction(){if(!this.hasBramannPredFeature()||!this.bramannPredData)return;const e=document.getElementById("bramann-prediction-view");if(!e)return;const t=this.currentLang==="en",a=this.bramannPredData;!this.activeBramannPredGW&&a.gameweeks&&a.gameweeks.length>0&&(this.activeBramannPredGW=a.gameweeks[a.gameweeks.length-1].name);const r=(a.gameweeks||[]).find(o=>o.name===this.activeBramannPredGW)||a.gameweeks[a.gameweeks.length-1];if(!r)return;const p=(o,l=!0,g="")=>{const y=Math.abs(o).toLocaleString(),D=g?` ${g}`:"";return o>0?`${l?"+":""}${y}${D}`:o<0?`-${y}${D}`:`0${D}`},d=[...Array.isArray(a.cumulative_standings)?a.cumulative_standings:[]].sort((o,l)=>l.win_rate-o.win_rate),n={};(r.matches||[]).forEach(o=>{Object.entries(o.payouts||{}).forEach(([l,g])=>{n[l]||(n[l]={net:0,won:0,lost:0,push:0,legs:0}),n[l].net+=g.net||0,n[l].legs+=g.legs||0,g.net>0?n[l].won+=1:g.net<0?n[l].lost+=1:n[l].push+=1})});const c=Object.entries(n).map(([o,l])=>({name:o,...l})).sort((o,l)=>l.net-o.net),m=(r.matches||[]).reduce((o,l)=>o+(l.pool||0),0);let s=`
          <!-- Header Banner -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                  ${this.data&&this.data.name?this.data.name:"Bramann League"} ${t?"Prediction":"ทายผล"}
                </h2>
              </div>

              <!-- Quick Stats Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Total Turnover":"ยอดเงินสะพัดรวม"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">฿${Number(a.total_season_turnover).toLocaleString()}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Matches Tracked":"คู่ที่เปิดทายผล"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">${a.total_season_matches} ${t?"Matches":"คู่"}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Top Profit Leader":"ผู้นำทำกำไรสูงสุด"}</div>
                  <div class="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-display truncate mt-0.5">${a.cumulative_standings[0]?this.escapeHtml(a.cumulative_standings[0].player.display_name)+" ("+p(a.cumulative_standings[0].net)+")":"-"}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Highest Win Rate":"แม่นยำสูงสุด (%ชนะ)"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 font-display mt-0.5">${this.escapeHtml(d[0]?.player.display_name||"-")} (${d[0]?.win_rate||0}%)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Gameweek Breakdown & Match Details -->
          <div class="glass-card rounded-2xl p-3 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <!-- Gameweek Controls Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                ${t?"Gameweek Results & Financial Settlement":"ผลการแข่งขัน & การคิดเงินประจำสัปดาห์"}
              </h2>

              <!-- GW Pills Selector & Copy LINE Button -->
              <div class="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                <div class="flex items-center gap-1 overflow-x-auto touch-scroll scrollbar-thin p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 max-w-full w-full sm:w-auto">
                  ${[...a.gameweeks].reverse().map(o=>{const l=o.name===this.activeBramannPredGW;return`
                      <button 
                        onclick="app.selectBramannPredGW('${o.name}')"
                        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${l?"bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60"}"
                      >
                        ${o.name}
                      </button>
                    `}).join("")}
                </div>
              </div>
            </div>

            <!-- Active GW Stats & Financial Balance Card -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Left: GW Info -->
              <div class="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${r.name}</span>
                    <span class="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">${r.matches.length} ${t?"Matches":"คู่"}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display mt-2">
                    ฿${Number(m).toLocaleString()}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ${t?"Total pool turnover this Gameweek":"ยอดเงินพูลที่หมุนเวียนในสัปดาห์นี้"}
                  </div>
                </div>
              </div>

              <!-- Right 2 cols: GW Standings -->
              <div class="md:col-span-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>${t?`Weekly Net Balance Summary (${r.name})`:`สรุปยอดเงินได้-เสียสุทธิในสัปดาห์นี้ (${r.name})`}</span>
                  <span class="text-[10.5px] text-slate-400 font-normal">${t?"Sorted by net profit":"เรียงตามกำไรสุทธิ"}</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  ${c.map(o=>{const l=o.net>0,g=o.net<0,y=l?"bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20":g?"bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20":"bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60",D=l?"text-emerald-600 dark:text-emerald-400":g?"text-rose-600 dark:text-rose-400":"text-slate-600 dark:text-slate-400";return`
                      <div class="p-2 rounded-lg border ${y} flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${this.escapeHtml(o.name)}</span>
                          <span class="text-[10px] text-slate-400">${o.won}W - ${o.lost}L</span>
                        </div>
                        <div class="text-xs sm:text-sm font-bold font-display mt-1 ${D}">
                          ${p(o.net)}
                        </div>
                      </div>
                    `}).join("")}
                </div>
              </div>
            </div>

            <!-- Matches List Grid -->
            <div>
              <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                <span>${t?`All Matches Breakdown (${r.matches.length} Matches)`:`รายละเอียดการทายผลทุกคู่ (${r.matches.length} คู่)`}</span>
                <span class="text-[11px] text-slate-400 font-normal">${t?"✅ indicates winning selection":"เครื่องหมาย ✅ คือผลชนะ"}</span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                ${r.matches.map((o,l)=>{const g=o.status==="push"||o.winning_side==="push",y=o.winning_side===1,D=o.winning_side===2,h=typeof resolveLiveScoreTeam=="function"?resolveLiveScoreTeam(o.side1_label,o.title,1):{name:o.side1_label,logo:""},$=typeof resolveLiveScoreTeam=="function"?resolveLiveScoreTeam(o.side2_label,o.title,2):{name:o.side2_label,logo:""},v=o.side1_full_name||h.name||o.side1_label,I=o.side1_logo||h.logo||"",L=o.side2_full_name||$.name||o.side2_label,k=o.side2_logo||$.logo||"",x=this.getTeamLogoUrl(I),C=this.getTeamLogoUrl(k),T=function(H,z,U){if(z||U){const A=(H||"").replace(/\s*[+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?\s*/g," ").trim().split(/\s+vs\s+/i);return{s1Hdc:z||"",s2Hdc:U||"",s1Clean:(A[0]||o.side1_label||"").trim(),s2Clean:(A[1]||o.side2_label||"").trim()}}if(!H||!H.includes(" vs "))return{s1Hdc:"",s2Hdc:"",s1Clean:H||"",s2Clean:""};const Q=H.split(/\s+vs\s+/i),W=(Q[0]||"").trim(),P=(Q[1]||"").trim(),u=W.match(/([+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?)/),N=P.match(/([+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?)/);let w=u?u[1]:"",b=N?N[1]:"";w&&!w.startsWith("-")&&!w.startsWith("+")&&(w="-"+w),b&&!b.startsWith("-")&&!b.startsWith("+")&&(b="-"+b);const _=W.replace(/\s*[+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?\s*/g,"").trim(),S=P.replace(/\s*[+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?\s*/g,"").trim();return{s1Hdc:w,s2Hdc:b,s1Clean:_,s2Clean:S}}(o.title,o.side1_handicap,o.side2_handicap);return`
                    <div class="rounded-2xl border ${g?"border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40":"border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700/90 hover:shadow-md"} p-3 sm:p-4 flex flex-col justify-between transition-all duration-200">
                      
                      <!-- Header Row: Match # + Matchup Title + Winner Badge & Pool -->
                      <div class="flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2.5">
                        <div class="flex items-center gap-1.5 min-w-0 pr-1">
                          <span class="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold font-display shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                            ${l+1}
                          </span>
                          <div class="flex items-center gap-1 text-xs sm:text-sm text-slate-900 dark:text-white font-display truncate">
                            <span class="font-bold">${T.s1Clean}</span>
                            ${T.s1Hdc?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shadow-2xs">${T.s1Hdc}</span>`:""}
                            <span class="text-slate-400 font-normal text-[11px] px-0.5">vs</span>
                            <span class="font-bold">${T.s2Clean}</span>
                            ${T.s2Hdc?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shadow-2xs">${T.s2Hdc}</span>`:""}
                          </div>
                        </div>
                        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          ${g?`<span class="text-[9.5px] sm:text-[10.5px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">${t?"Push / Void":"เสมอ / ยก"}</span>`:`<span class="inline-flex items-center gap-0.5 text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">${t?"Won":"ชนะ"}: ${o.winning_label} ✅</span>`}
                          <span class="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-display border border-slate-200/50 dark:border-slate-700/50">฿${o.pool.toLocaleString()}</span>
                        </div>
                      </div>

                      <!-- Options Grid: Side 1 vs Side 2 -->
                      <div class="grid grid-cols-2 gap-2 sm:gap-2.5">
                        
                        <!-- Side 1 Box -->
                        <div class="rounded-xl p-2.5 sm:p-3 border flex flex-col justify-between transition-all duration-150 hover:brightness-105 ${y?"bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border-emerald-500/40 dark:border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-2xs":"bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80"}">
                          <div class="flex flex-col justify-between h-full">
                            <!-- Team & Legs Header -->
                            <div class="flex items-start gap-2 mb-2">
                              ${x?`<img src="${x}" alt="${v}" class="w-6 h-6 sm:w-6.5 sm:h-6.5 object-contain shrink-0 mt-0.5 filter drop-shadow-2xs" loading="lazy" onerror="this.style.display='none'">`:""}
                              <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                  <span class="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-tight" title="${v}">${v}</span>
                                  ${T.s1Hdc?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shrink-0 shadow-2xs">${T.s1Hdc}</span>`:""}
                                </div>
                                <div class="flex items-center gap-1.5 mt-1">
                                  <span class="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs ${y?"bg-emerald-600 text-white":"bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}">${o.side1_legs} ${t?o.side1_legs>1?"legs":"leg":"ขา"}</span>
                                  ${y?'<span class="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">ชนะ ✅</span>':""}
                                </div>
                              </div>
                            </div>

                            <!-- Bettors Tags -->
                            <div class="flex flex-wrap gap-1 min-h-[26px] items-center pt-2 border-t border-slate-200/60 dark:border-slate-700/50 mt-1">
                              ${o.side1_bets.length>0?o.side1_bets.map(H=>`
                                  <span class="inline-flex items-center text-[10px] sm:text-[10.5px] px-1.5 py-0.5 rounded-md transition-transform hover:scale-105 cursor-default ${y?"bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/60 shadow-2xs font-medium":"bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"}">
                                    ${H.name}${H.legs>1?` <strong class="ml-0.5 text-blue-600 dark:text-blue-400 font-bold">x${H.legs}</strong>`:""}
                                  </span>
                                `).join(""):`<span class="text-[10px] text-slate-400 italic">${t?"No selections":"ไม่มีผู้เลือก"}</span>`}
                            </div>
                          </div>
                        </div>

                        <!-- Side 2 Box -->
                        <div class="rounded-xl p-2.5 sm:p-3 border flex flex-col justify-between transition-all duration-150 hover:brightness-105 ${D?"bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border-emerald-500/40 dark:border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-2xs":"bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80"}">
                          <div class="flex flex-col justify-between h-full">
                            <!-- Team & Legs Header -->
                            <div class="flex items-start gap-2 mb-2">
                              ${C?`<img src="${C}" alt="${L}" class="w-6 h-6 sm:w-6.5 sm:h-6.5 object-contain shrink-0 mt-0.5 filter drop-shadow-2xs" loading="lazy" onerror="this.style.display='none'">`:""}
                              <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                  <span class="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-tight" title="${L}">${L}</span>
                                  ${T.s2Hdc?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shrink-0 shadow-2xs">${T.s2Hdc}</span>`:""}
                                </div>
                                <div class="flex items-center gap-1.5 mt-1">
                                  <span class="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs ${D?"bg-emerald-600 text-white":"bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}">${o.side2_legs} ${t?o.side2_legs>1?"legs":"leg":"ขา"}</span>
                                  ${D?'<span class="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">ชนะ ✅</span>':""}
                                </div>
                              </div>
                            </div>

                            <!-- Bettors Tags -->
                            <div class="flex flex-wrap gap-1 min-h-[26px] items-center pt-2 border-t border-slate-200/60 dark:border-slate-700/50 mt-1">
                              ${o.side2_bets.length>0?o.side2_bets.map(H=>`
                                  <span class="inline-flex items-center text-[10px] sm:text-[10.5px] px-1.5 py-0.5 rounded-md transition-transform hover:scale-105 cursor-default ${D?"bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/60 shadow-2xs font-medium":"bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"}">
                                    ${H.name}${H.legs>1?` <strong class="ml-0.5 text-blue-600 dark:text-blue-400 font-bold">x${H.legs}</strong>`:""}
                                  </span>
                                `).join(""):`<span class="text-[10px] text-slate-400 italic">${t?"No selections":"ไม่มีผู้เลือก"}</span>`}
                            </div>
                          </div>
                        </div>

                      </div>

                      <!-- Payout Breakdown Footer -->
                      <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                        <span class="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">${t?"Net Payout:":"ผลได้-เสีย:"}</span>
                        ${Object.entries(o.payouts||{}).map(([H,z])=>{const U=z.net||0,Q=U>0,W=U<0;return`
                            <span class="text-[10px] px-1.5 py-0.5 rounded-md border ${Q?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60":W?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60":"bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60"} font-display">
                              ${this.escapeHtml(H)}: <strong>${p(U)}</strong>
                            </span>
                          `}).join("")}
                      </div>
                    </div>
                  `}).join("")}
              </div>
            </div>
          </div>

          <!-- SECTION 2: Cumulative Standings Table -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  ${t?"Cumulative Prediction Standings":"ตารางการแข่งขันทายผลสะสม"}
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ${t?`Prediction performance from GW 1 to ${r.name} • Zero-Sum Balance calculation (Total net equals 0 THB)`:`สรุปผลงานทายผล GW 1 ถึง ${r.name} • คิดเงินแบบ Zero-Sum Balance (ยอดรวมได้-เสียสุทธิเท่ากับ 0 บาท)`}
                </p>
              </div>
            </div>

            <div class="overflow-x-auto touch-scroll -mx-4 sm:mx-0 scrollbar-thin table-sticky-container">
              <table class="w-full text-left min-w-[640px] table-sticky table-clean">
                <thead>
                  <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    <th class="sticky-col-rank py-2.5 px-2 text-center">${t?"#":"อันดับ"}</th>
                    <th class="sticky-col-team py-2.5 px-3">${t?"Player / FPL Team":"ผู้เล่น / ทีม FPL"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Played":"แข่ง (คู่)"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Total Legs":"ขารวม"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Won":"ชนะ"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Lost":"แพ้"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Push":"เสมอ"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Win %":"% ชนะ"}</th>
                    <th class="py-2.5 px-3 text-right">${t?"Won Amt":"เงินที่ได้"}</th>
                    <th class="py-2.5 px-3 text-right">${t?"Lost Amt":"เงินที่เสีย"}</th>
                    <th class="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">${t?"Net Profit/Loss":"กำไร/ขาดทุนสุทธิ"}</th>
                  </tr>
                </thead>
                <tbody class="text-xs sm:text-sm">
                  ${a.cumulative_standings.map(o=>{const l=o.net>0,g=o.net<0,y=l?"text-emerald-600 dark:text-emerald-400 font-bold":g?"text-rose-600 dark:text-rose-400 font-bold":"text-slate-500 font-medium";return`
                      <tr onclick="app.toggleTrackedRow(this)" class="cursor-pointer transition-colors">
                        <td class="sticky-col-rank py-2.5 px-2 text-center font-display">${`<span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${o.rank}</span>`}</td>
                        <td class="sticky-col-team py-2.5 px-3 min-w-[140px] sm:min-w-0">
                          <div class="flex items-center gap-2">
                            <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                              ${this.escapeHtml(o.player.display_name)}
                            </span>
                            <div class="min-w-0">
                              ${o.player.is_guest?`<div class="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">${t?"Prediction only":"เล่นเฉพาะทายผล"}</div>`:`
                                  <div class="font-bold text-slate-900 dark:text-white leading-tight truncate">${this.escapeHtml(o.player.team_name)}</div>
                                  <div class="text-[11px] text-slate-400 leading-tight truncate">${this.escapeHtml(o.player.manager)}</div>
                                `}
                            </div>
                          </div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-medium text-slate-700 dark:text-slate-300">${o.matches}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-medium text-slate-700 dark:text-slate-300">${o.legs_total}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">${o.won}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-semibold text-rose-500 dark:text-rose-400">${o.lost}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums text-slate-400">${o.push}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-medium text-slate-600 dark:text-slate-400">${o.win_rate}%</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums text-emerald-600 dark:text-emerald-400">${o.total_won_amount.toLocaleString()}</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums text-rose-500 dark:text-rose-400">${o.total_lost_amount>0?`-${o.total_lost_amount.toLocaleString()}`:"0"}</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums ${y}">
                          ${p(o.net)}
                        </td>
                      </tr>
                    `}).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;e.innerHTML=s}renderBramannChallenge(){if(!this.hasBramannChalFeature()||!this.bramannChalData)return;const e=document.getElementById("bramann-challenge-view");if(!e)return;const t=this.currentLang==="en",a=this.bramannChalData;!this.activeBramannChalGW&&a.gameweeks&&a.gameweeks.length>0&&(this.activeBramannChalGW=a.gameweeks[a.gameweeks.length-1].name);const r=(a.gameweeks||[]).find(n=>n.name===this.activeBramannChalGW)||a.gameweeks[a.gameweeks.length-1];if(!r)return;const p=(n,c=!0,m="")=>{const s=Math.abs(n).toLocaleString(),o=m?` ${m}`:"";return n>0?`${c?"+":""}${s}${o}`:n<0?`-${s}${o}`:`0${o}`},i=n=>!n||!t?n:n.replace(/เสมอแต้มรวม ชนะกัปตัน/g,"Tied on total points, won on Captain").replace(/เสมอแต้มรวมและกัปตัน ชนะรองกัปตัน/g,"Tied on total & Captain, won on Vice-Captain").replace(/ชนะตัวท็อปอันดับ (\d+)/g,"Won on top scorer rank $1").replace(/แต้มเท่ากันทุกตำแหน่ง เสมอแยกย้าย/g,"Tied on all squad positions (Push)");let d=`
          <!-- Header Banner -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                  ${this.data&&this.data.name?this.data.name:"Bramann League"} ${t?"Challenge":"ท้าชน"}
                </h2>
              </div>

              <!-- Quick Stats Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Total Stakes Turnover":"ยอดเดิมพันสะพัด"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">฿${Number(a.total_season_turnover).toLocaleString()}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Challenge Matches":"แมตช์ท้าชน"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">${a.total_season_matches} ${t?"Matches":"คู่"}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center col-span-2 sm:col-span-1">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Top Profit Leader":"ผู้นำทำกำไรสูงสุด"}</div>
                  <div class="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-display truncate mt-0.5">${a.cumulative_standings[0]?this.escapeHtml(a.cumulative_standings[0].player.display_name)+" ("+p(a.cumulative_standings[0].net)+")":"-"}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Gameweek Challenge Matches -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <!-- GW Controls -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                ${t?"Weekly Challenge Matches":"คู่ท้าชนประจำสัปดาห์"}
              </h2>

              <div class="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                <div class="flex items-center gap-1 overflow-x-auto touch-scroll scrollbar-thin p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 max-w-full w-full sm:w-auto">
                  ${[...a.gameweeks].reverse().map(n=>{const c=n.name===this.activeBramannChalGW;return`
                      <button 
                        onclick="app.selectBramannChalGW('${n.name}')"
                        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${c?"bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60"}"
                      >
                        ${n.name}
                      </button>
                    `}).join("")}
                </div>
              </div>
            </div>

            <!-- Challenge Matches List -->
            <div class="space-y-4">
              ${r.matches.map((n,c)=>{const m=n.winning_side===1,s=n.winning_side===2;return`
                  <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">MATCH #${c+1}</span>
                        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5">
                          ${n.team1_name&&n.team2_name?`${this.escapeHtml(n.team1_name)} vs ${this.escapeHtml(n.team2_name)}`:this.escapeHtml(n.title)}
                        </h3>
                      </div>
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-[10.5px] px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60">
                          ${n.count_hits?t?"Transfer Hits Deducted":"หักคะแนนลบย้ายตัว":t?"No Hits Deducted":"ไม่หักคะแนนลบ"}
                        </span>
                        <span class="text-[10.5px] px-2 py-0.5 rounded-md font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60">
                          ${n.count_chips?t?"Active Chips Counted":"นับชิปพิเศษ":t?"Chips Excluded":"ไม่นับชิป"}
                        </span>
                        <span class="text-[10.5px] px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          ${t?"Pool":"พูล"}: ฿${n.pool.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
                      <!-- Team 1 -->
                      <div class="rounded-xl p-3.5 sm:p-4 border ${m?"bg-emerald-500/10 border-emerald-500/40":"bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700"} flex flex-col justify-between">
                        <div>
                          <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-400 font-display">${t?"Side 1":"ฝั่งที่ 1"}</span>
                            ${m?`<span class="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white shadow-2xs">${t?"Winner ✅":"ชนะ ✅"}</span>`:""}
                          </div>
                          <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                            ${this.escapeHtml(n.team1_name)}
                          </div>
                          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ${t?"Manager":"ผู้จัดการ"}: ${this.escapeHtml(n.team1_player||"-")}
                          </div>
                          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ${t?"Captain":"กัปตัน"}: <strong class="text-slate-700 dark:text-slate-300">${this.escapeHtml(n.team1_captain||"-")}</strong>
                          </div>
                        </div>

                        <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-baseline justify-between">
                          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${t?"Fantasy Points":"คะแนนแฟนตาซี"}</span>
                          <span class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">${n.team1_pts} <span class="text-xs font-bold text-slate-400">pts</span></span>
                        </div>
                      </div>

                      <!-- Team 2 -->
                      <div class="rounded-xl p-3.5 sm:p-4 border ${s?"bg-emerald-500/10 border-emerald-500/40":"bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700"} flex flex-col justify-between">
                        <div>
                          <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-400 font-display">${t?"Side 2":"ฝั่งที่ 2"}</span>
                            ${s?`<span class="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white shadow-2xs">${t?"Winner ✅":"ชนะ ✅"}</span>`:""}
                          </div>
                          <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                            ${this.escapeHtml(n.team2_name)}
                          </div>
                          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ${t?"Manager":"ผู้จัดการ"}: ${this.escapeHtml(n.team2_player||"-")}
                          </div>
                          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ${t?"Captain":"กัปตัน"}: <strong class="text-slate-700 dark:text-slate-300">${this.escapeHtml(n.team2_captain||"-")}</strong>
                          </div>
                        </div>

                        <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-baseline justify-between">
                          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${t?"Fantasy Points":"คะแนนแฟนตาซี"}</span>
                          <span class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">${n.team2_pts} <span class="text-xs font-bold text-slate-400">pts</span></span>
                        </div>
                      </div>
                    </div>

                    ${n.tie_break_note?`
                      <div class="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                        <span>${t?"⚖️ Tie-Breaker Decision:":"⚖️ การตัดสิน Tie-Breaker:"}</span>
                        <span class="font-bold">${i(n.tie_break_note)}</span>
                      </div>
                    `:""}

                    <div class="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                      <div class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>${t?"Stakes & Supporter Picks":"สมาชิกที่ร่วมวางเดิมพัน & ขาเชียร์"}</span>
                        <span class="text-[10.5px] text-slate-400 font-normal">${t?`Stake: ${n.stake_per_leg||100} THB / leg`:`เดิมพันขาละ ${n.stake_per_leg||100} บาท`}</span>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div class="space-y-1">
                          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">${t?"Backing":"เชียร์"} ${this.escapeHtml(n.team1_name)}:</span>
                          <div class="flex flex-wrap gap-1">
                            ${(n.side1_bets||[]).map(o=>`<span class="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium">${this.escapeHtml(o.name)} (${o.legs} ${t?o.legs>1?"legs":"leg":"ขา"})</span>`).join("")}
                          </div>
                        </div>

                        <div class="space-y-1">
                          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">${t?"Backing":"เชียร์"} ${this.escapeHtml(n.team2_name)}:</span>
                          <div class="flex flex-wrap gap-1">
                            ${(n.side2_bets||[]).map(o=>`<span class="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium">${this.escapeHtml(o.name)} (${o.legs} ${t?o.legs>1?"legs":"leg":"ขา"})</span>`).join("")}
                          </div>
                        </div>
                      </div>

                      <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 flex-wrap">
                        <span class="text-[10.5px] text-slate-400 font-medium">${t?"Net Result:":"ผลการได้-เสีย:"}</span>
                        ${Object.entries(n.payouts||{}).map(([o,l])=>{const g=l.net||0,y=g>0,D=g<0;return`
                            <span class="text-[10px] px-2 py-0.5 rounded border ${y?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60":D?"bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60":"bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200"} font-display">
                              ${this.escapeHtml(o)}: <strong>${p(g)}</strong>
                            </span>
                          `}).join("")}
                      </div>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>

          <!-- SECTION 2: Cumulative Standings Table -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  ${t?"Cumulative Challenge Standings":"ตารางการแข่งขันท้าชนสะสม"}
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ${t?"Season-long cumulative challenge performance":"สรุปผลงานท้าชนสะสมตลอดฤดูกาล"}
                </p>
              </div>
            </div>

            <div class="overflow-x-auto touch-scroll -mx-4 sm:mx-0 scrollbar-thin table-sticky-container">
              <table class="w-full text-left min-w-[580px] table-sticky table-clean">
                <thead>
                  <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    <th class="sticky-col-rank py-2.5 px-2 text-center">${t?"#":"อันดับ"}</th>
                    <th class="sticky-col-team py-2.5 px-3">${t?"Player / FPL Team":"ผู้เล่น / ทีม FPL"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Played":"แข่ง (คู่)"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Won":"ชนะ"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Lost":"แพ้"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Push":"เสมอ"}</th>
                    <th class="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">${t?"Net Profit/Loss":"กำไร/ขาดทุนสุทธิ"}</th>
                  </tr>
                </thead>
                <tbody class="text-xs sm:text-sm">
                  ${a.cumulative_standings.map(n=>{const c=n.net>0,m=n.net<0,s=c?"text-emerald-600 dark:text-emerald-400 font-bold":m?"text-rose-600 dark:text-rose-400 font-bold":"text-slate-500 font-medium";return`
                      <tr onclick="app.toggleTrackedRow(this)" class="cursor-pointer transition-colors">
                        <td class="sticky-col-rank py-2.5 px-2 text-center font-display font-semibold text-slate-500">${n.rank}</td>
                        <td class="sticky-col-team py-2.5 px-3 min-w-[140px] sm:min-w-0">
                          <div class="min-w-0">
                            <div class="font-bold text-slate-900 dark:text-white leading-tight truncate">${this.escapeHtml(n.player.team_name||n.player.display_name)}</div>
                            <div class="text-[11px] text-slate-400 leading-tight truncate">${this.escapeHtml(n.player.manager||"")}</div>
                          </div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-medium text-slate-700 dark:text-slate-300">${n.matches}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">${n.won}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-semibold text-rose-500 dark:text-rose-400">${n.lost}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums text-slate-400">${n.push}</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums ${s}">
                          ${p(n.net)}
                        </td>
                      </tr>
                    `}).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;e.innerHTML=d}renderBramannDualPrizeView(e,t,a,r,p){if(!(this.config&&this.config.features&&this.config.features.prize_model==="bramann_dual_prize")&&String(this.activeLeagueId)!=="5349")return;const i=this.currentLang==="en",d=this.config&&this.config.features||{},n=Number(d.prize1_target_gw)||18,c=Number(d.prize2_target_gw)||38,m=d.prize1_tiers||{1:500,2:500,3:500,5:500,7:500,9:500,11:500,13:500,15:500},s=d.prize2_tiers||{1:1e3,2:800,3:700,7:700,8:500,9:400,13:400,14:300,15:200},o=Number(this.multiData&&this.multiData.max_gw)||7,l=this.data.gameweeks?this.data.gameweeks[String(o)]:null,g=!!(l&&l.is_finished),y=l?l.is_started!==void 0?!!l.is_started:!!l.is_finished||l.results&&l.results.some(G=>G.points>0):!1,D=!!(this.isLiveMatchday||this.liveData&&this.liveData.isLive||this.isLiveWindowActive&&this.isLiveWindowActive()||y&&!g),h=this.liveData&&(this.liveData.currentGw||this.liveData.liveGw)||(D&&!g?o:o+1),$=g?o:Math.max(1,o-1);r&&(D?r.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10.5px] font-mono font-bold"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>${i?`GW ${h} IN-PLAY (LIVE)`:`กำลังแข่งขัน GW ${h} (LIVE)`}</span>`:r.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10.5px] font-mono font-bold">✓ ${i?`OFFICIAL SETTLED • GW 1 - ${$}`:`สรุปยอดทางการ • GW 1 - ${$}`}</span>`),e&&(e.innerText=i?"FPL Prize & Treasury Summary":"สรุปเงินรางวัล FPL & การจัดสรรกองกลาง"),t&&(D?t.innerText=i?`Total treasury 9,500 THB • GW ${h} in-play • Payouts officially settled after final match • Ledger finalized for GW 1 - ${$}`:`เงินกองกลางรวม 9,500 THB • กำลังแข่งขัน GW ${h} • ยอดเงินรางวัลจะตัดรอบอย่างเป็นทางการหลังจบคู่สุดท้าย • บันทึกถึง GW 1 - ${$}`:t.innerText=i?`Total treasury 9,500 THB (19 teams x 500 THB) • Prize 1 (Post-GW ${n} 4,500 THB) + Prize 2 (Post-GW ${c} 5,000 THB)`:`เงินกองกลางรวม 9,500 THB (19 ทีม x 500 THB) • Prize 1 (หลังจบ GW ${n} รวม 4,500 THB) + Prize 2 (หลังจบ GW ${c} รวม 5,000 THB)`),a&&(a.className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1 rounded-xl font-bold font-display shadow-2xs",a.innerText="9,500 THB");const v=document.getElementById("prizes-league-badge");if(v){const G=(this.data.teams||[]).length;v.className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1 rounded-xl font-semibold font-display",v.innerText=i?`${G} Members`:`สมาชิก ${G} ทีม`}const I={};(this.data.teams||[]).forEach(G=>{I[G.entry_id]={entry_id:G.entry_id,team_name:G.entry_name,player_name:G.player_name,fpl_rank:G.rank||999,p1_points:0,p2_points:0,total_points:0}});for(let G=1;G<=o;G++){const K=this.data.gameweeks?this.data.gameweeks[String(G)]:null;if(K&&K.results&&(K.is_started!==void 0?!!K.is_started:!!K.is_finished||K.results.some(Y=>Y.points>0))){const Y=new Set;K.results.forEach(X=>{if(Y.has(X.entry_id))return;Y.add(X.entry_id);const M=I[X.entry_id];if(M){const V=X.net_points||0;M.total_points+=V,G<=n&&(M.p1_points+=V),G<=c&&(M.p2_points+=V)}})}}const L=Object.values(I).filter(G=>this.isPrizeEligible(G.entry_id)),k=(G,K,B,Y,X,M)=>{const V=[...G].sort((O,ae)=>ae[K]-O[K]||(O.fpl_rank||999)-(ae.fpl_rank||999));let Z=0;for(;Z<V.length;){let O=Z+1;for(;O<V.length&&V[O][K]===V[Z][K];)O++;const ae=O-Z,de=Z+1,oe=Z+ae;let ue=0;for(let ce=de;ce<=oe;ce++)ue+=Number(B[String(ce)]||0);const _e=ae>0?ue/ae:0;for(let ce=Z;ce<O;ce++)V[ce][Y]=Number.isInteger(_e)?_e:Number(_e.toFixed(2)),X&&(V[ce][X]=de),M&&(V[ce][M]=ae>1);Z=O}};k(L,"p1_points",m,"p1_amt","p1_rank","p1_joint"),k(L,"p2_points",s,"p2_amt","p2_rank","p2_joint");const x=Object.values(I).sort((G,K)=>{const B=this.isPrizeEligible(G.entry_id)?1:0,Y=this.isPrizeEligible(K.entry_id)?1:0;return B!==Y?Y-B:K.total_points-G.total_points||(G.fpl_rank||999)-(K.fpl_rank||999)}),C={};this.bramannPredData&&this.bramannPredData.cumulative_standings&&this.bramannPredData.cumulative_standings.forEach(G=>{G.player&&(G.player.entry_id&&(C[G.player.entry_id]=Number(G.net)||0),G.player.display_name&&(C[G.player.display_name.toLowerCase()]=Number(G.net)||0))});const T={};this.bramannChalData&&this.bramannChalData.cumulative_standings&&this.bramannChalData.cumulative_standings.forEach(G=>{G.player&&(G.player.entry_id&&(T[G.player.entry_id]=Number(G.net)||0),G.player.display_name&&(T[G.player.display_name.toLowerCase()]=Number(G.net)||0))});const H=(G,K=!0,B="")=>{const Y=Number.isInteger(G)?G:Number(G.toFixed(2)),X=Math.abs(Y).toLocaleString(),M=B?` ${B}`:"";return Y>0?`${K?"+":""}${X}${M}`:Y<0?`-${X}${M}`:`0${M}`};let z=0,U=0,Q=0,W=0,P=0,u=0,N=0;x.forEach(G=>{const K=this.isPrizeEligible(G.entry_id),B=K&&G.p1_amt||0,Y=K&&G.p2_amt||0,X=Number((B+Y).toFixed(2)),M=C[G.entry_id]!==void 0?C[G.entry_id]:C[(G.player_name||"").toLowerCase()]||0,V=T[G.entry_id]!==void 0?T[G.entry_id]:T[(G.player_name||"").toLowerCase()]||0,Z=Number((X+M+V).toFixed(2));K&&(z+=G.total_points,U=Number((U+B).toFixed(2)),Q=Number((Q+Y).toFixed(2)),W=Number((W+X).toFixed(2)),P+=M,u+=V,N=Number((N+Z).toFixed(2)))});const w=this.bramannPredData&&this.bramannPredData.cumulative_standings?this.bramannPredData.cumulative_standings.find(G=>G.player&&G.player.is_guest):null;if(w){const G=w.net||0;P+=G,N+=G}const b=(this.prizesSearchQuery||"").toLowerCase().trim(),_=this.prizesFilterMode||"all",S=x.filter(G=>{if(b){const O=(G.team_name||"").toLowerCase().includes(b),ae=(G.player_name||"").toLowerCase().includes(b);if(!O&&!ae)return!1}const K=this.isPrizeEligible(G.entry_id),B=K&&G.p1_amt||0,Y=K&&G.p2_amt||0,X=Number((B+Y).toFixed(2)),M=C[G.entry_id]!==void 0?C[G.entry_id]:C[(G.player_name||"").toLowerCase()]||0,V=T[G.entry_id]!==void 0?T[G.entry_id]:T[(G.player_name||"").toLowerCase()]||0,Z=Number((X+M+V).toFixed(2));return _==="winners"?K&&(Z>0||X>0&&Z>=0):_==="fined"?K&&Z<0:_==="non_prize"?!K:!0});let E="";S.forEach(G=>{const K=this.isPrizeEligible(G.entry_id);let B="-",Y=0,X=0;K&&(B=G.p2_rank,Y=G.p1_amt||0,X=G.p2_amt||0);const M=Number((Y+X).toFixed(2)),V=C[G.entry_id]!==void 0?C[G.entry_id]:C[(G.player_name||"").toLowerCase()]||0,Z=T[G.entry_id]!==void 0?T[G.entry_id]:T[(G.player_name||"").toLowerCase()]||0,O=Number((M+V+Z).toFixed(2));let ae="";K?B===1?ae='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-2xs">1</span>':B===2?ae='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-xs">2</span>':B===3?ae='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/80 text-white font-bold text-xs">3</span>':ae=`<span class="text-xs font-bold text-slate-500 dark:text-slate-400 font-display">${B}</span>`:ae=this.getNonPrizeRankBadge();const de=Y>0?`<span class="inline-flex items-baseline justify-end font-mono font-bold text-xs text-slate-800 dark:text-slate-200"><span class="text-[10px] font-normal text-slate-400 dark:text-slate-500 mr-0.5">฿</span><span class="tabular-nums">${Y.toLocaleString()}</span></span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">-</span>',oe=X>0?`<span class="inline-flex items-baseline justify-end font-mono font-bold text-xs text-slate-800 dark:text-slate-200"><span class="text-[10px] font-normal text-slate-400 dark:text-slate-500 mr-0.5">฿</span><span class="tabular-nums">${X.toLocaleString()}</span></span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">-</span>',ue=M>0?`<span class="inline-flex items-baseline justify-end font-mono font-black text-xs text-slate-900 dark:text-white"><span class="text-[10px] font-normal text-slate-400 dark:text-slate-500 mr-0.5">฿</span><span class="tabular-nums">${M.toLocaleString()}</span></span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">-</span>',_e=V!==0?`<span class="inline-flex items-baseline justify-end font-mono font-bold text-xs ${V>0?"text-emerald-600 dark:text-emerald-400":"text-rose-600 dark:text-rose-400"}"><span class="text-[10px] font-normal opacity-70 mr-0.5">${V>0?"+":"-"}฿</span><span class="tabular-nums">${Math.abs(V).toLocaleString()}</span></span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">0</span>',ce=Z!==0?`<span class="inline-flex items-baseline justify-end font-mono font-bold text-xs ${Z>0?"text-emerald-600 dark:text-emerald-400":"text-rose-600 dark:text-rose-400"}"><span class="text-[10px] font-normal opacity-70 mr-0.5">${Z>0?"+":"-"}฿</span><span class="tabular-nums">${Math.abs(Z).toLocaleString()}</span></span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">0</span>',J=O>0?`<span class="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 tabular-nums"><span class="text-[10px] font-normal opacity-75 mr-0.5">+฿</span>${O.toLocaleString()}</span>`:O<0?`<span class="font-mono font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400 tabular-nums"><span class="text-[10px] font-normal opacity-75 mr-0.5">-฿</span>${Math.abs(O).toLocaleString()}</span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono font-bold text-xs sm:text-sm tabular-nums"><span class="text-[10px] font-normal mr-0.5">฿</span>0</span>';E+=`
            <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer ${K?"":"is-non-prize opacity-70"}">
              <td class="sticky-col-rank py-2.5 px-2 text-center font-display">${ae}</td>
              <td class="sticky-col-team py-2.5 px-3 min-w-[140px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button onclick="event.stopPropagation(); app.openTeamModal(${G.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate max-w-[125px] xs:max-w-[175px] sm:max-w-none">${this.escapeHtml(G.team_name)}</button>
                  ${this.getPrizeBadge(G.entry_id)}
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap truncate">
                  <span>${this.escapeHtml(G.player_name)}</span>
                  ${K?"":`<span class="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 font-bold font-mono">${i?"Guest":"ร่วมสนุก"}</span>`}
                </div>
              </td>
              <td class="py-2.5 px-2 text-center font-mono tabular-nums font-bold text-slate-900 dark:text-white text-xs">${G.total_points}</td>
              <td class="py-2.5 px-2 text-right font-display">${de}</td>
              <td class="py-2.5 px-2 text-right font-display">${oe}</td>
              <td class="py-2.5 px-2 text-right font-display">${ue}</td>
              <td class="py-2.5 px-2 text-right font-display">${_e}</td>
              <td class="py-2.5 px-2 text-right font-display">${ce}</td>
              <td class="py-2.5 px-3 text-right font-display">${J}</td>
            </tr>
          `});let A=!1;if(w){const G=w.net||0;(!b||"fee".includes(b)||"guest".includes(b)||"ร่วมสนุก".includes(b))&&(_==="all"||_==="non_prize"||_==="fined"&&G<0||_==="winners"&&G>0)&&(A=!0)}if(A&&w){const G=w.net||0;E+=`
            <tr onclick="app.toggleTrackedRow(this)" class="is-non-prize text-slate-500 cursor-pointer">
              <td class="sticky-col-rank py-2.5 px-2 text-center font-mono text-xs text-slate-400">•</td>
              <td class="sticky-col-team py-2.5 px-3 min-w-[140px]">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">Fee</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 font-mono">Guest</span>
                </div>
                <span class="text-[11px] text-slate-400 block truncate">${i?"Prediction only":"เล่นเฉพาะทายผล"}</span>
              </td>
              <td class="py-2.5 px-2 text-center font-mono text-slate-400 text-xs">-</td>
              <td class="py-2.5 px-2 text-right font-mono text-slate-400 text-xs">-</td>
              <td class="py-2.5 px-2 text-right font-mono text-slate-400 text-xs">-</td>
              <td class="py-2.5 px-2 text-right font-mono text-slate-400 text-xs">-</td>
              <td class="py-2.5 px-2 text-right font-mono tabular-nums text-xs ${G<0?"text-rose-600 dark:text-rose-400 font-bold":"text-emerald-600 dark:text-emerald-400 font-bold"}">${H(G)}</td>
              <td class="py-2.5 px-2 text-right font-mono text-slate-400 text-xs">-</td>
              <td class="py-2.5 px-3 text-right font-mono tabular-nums ${G<0?"text-rose-600 dark:text-rose-400 font-bold":"text-emerald-600 dark:text-emerald-400 font-bold"} text-xs sm:text-sm">${H(G)} THB</td>
            </tr>
          `}S.length===0&&!A&&(E=`
            <tr>
              <td colspan="9" class="py-10 px-4 text-center">
                <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                  <svg class="w-6 h-6 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <p class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                    ${i?`No teams found matching "${this.escapeHtml(b)}"`:`ไม่พบทีมที่ตรงกับคำค้นหา "${this.escapeHtml(b)}"`}
                  </p>
                  <button type="button" onclick="app.handlePrizesSearch(''); app.setPrizesFilter('all');" class="mt-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    ${i?"Clear Search & Filter":"ล้างการค้นหาและตัวกรอง"}
                  </button>
                </div>
              </td>
            </tr>
          `);const F=i?"en":"th",q=String(this.activeLeagueId||""),j=document.getElementById("bramann-prizes-tbody"),R=document.getElementById("bramann-prizes-search-input");if(j&&R&&R.dataset.renderedLang===F&&R.dataset.renderedLeague===q){j.innerHTML=E;const G=document.getElementById("bramann-prizes-count");G&&(b||_!=="all"?(G.innerText=i?`Showing ${S.length} of ${x.length} teams`:`แสดง ${S.length} จาก ${x.length} ทีม`,G.classList.remove("hidden")):G.classList.add("hidden"));const K=document.getElementById("bramann-prizes-search-clear");K&&(this.prizesSearchQuery?K.classList.remove("hidden"):K.classList.add("hidden")),["all","winners","fined","non_prize"].forEach(B=>{const Y=document.getElementById(`btn-bramann-filter-${B}`);if(Y){const X=this.prizesFilterMode===B;Y.setAttribute("aria-pressed",X?"true":"false"),Y.className=`min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${X?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}}),R.value!==(this.prizesSearchQuery||"")&&(R.value=this.prizesSearchQuery||"");return}p&&(p.innerHTML=`
            <!-- 01 / BRAMANN DUAL-PRIZE STRUCTURE -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">01 /</span>
                <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                  ${i?"BRAMANN DUAL-PRIZE STRUCTURE":"โครงสร้างเงินรางวัล 2 งวด BRAMANN"}
                </h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <!-- Prize 1 Card -->
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 shadow-2xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">
                      ${i?`PRIZE 1: Mid-Season (Post GW ${n})`:`PRIZE 1: สิ้นปี 2026 (หลังจบ GW ${n})`}
                    </span>
                    <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${i?`Played ${o} / ${n}`:`แข่งไปแล้ว ${o} / ${n}`}</span>
                  </div>
                  <div>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                      4,500 <span class="text-xs font-normal text-slate-400">THB</span>
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ${i?"Awarded to 9 positions (Rank 1, 2, 3, 5, 7, 9, 11, 13, 15) 500 THB each":"จัดสรรให้ 9 อันดับ (อันดับ 1, 2, 3, 5, 7, 9, 11, 13, 15) คนละ 500 THB เท่ากัน"}
                    </div>
                  </div>
                  <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1 font-mono">
                    ${[1,2,3,5,7,9,11,13,15].map(G=>`<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">#${G} 500 THB</span>`).join("")}
                  </div>
                </div>

                <!-- Prize 2 Card -->
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 shadow-2xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">
                      ${i?"PRIZE 2: Season End (Post GW 38)":"PRIZE 2: สิ้นสุดฤดูกาล (หลังจบ GW 38)"}
                    </span>
                    <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${i?`Played ${o} / 38`:`แข่งไปแล้ว ${o} / 38`}</span>
                  </div>
                  <div>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                      5,000 <span class="text-xs font-normal text-slate-400">THB</span>
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ${i?"Tiered payout across 9 positions":"จัดสรรตามอันดับแบบขั้นบันได 9 อันดับ"}
                    </div>
                  </div>
                  <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1 font-mono">
                    ${[{r:1,a:1e3},{r:2,a:800},{r:3,a:700},{r:7,a:700},{r:8,a:500},{r:9,a:400},{r:13,a:400},{r:14,a:300},{r:15,a:200}].map(G=>`<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">#${G.r} ${G.a.toLocaleString()} THB</span>`).join("")}
                  </div>
                </div>
              </div>
            </div>

            <!-- 02 / ALL-GAME PRIZE SUMMARY & PROJECTION -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">02 /</span>
                    <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                      ${i?`ALL-GAME PRIZE PROJECTION (GW 1 - ${$})`:`ตารางจำลองเงินรางวัลรวมทุกเกม (GW 1 - ${$})`}
                    </h3>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ${i?"Fantasy standings combined with net balances from prediction and challenge games.":"อัปเดตตามอันดับคะแนนแฟนตาซี พร้อมรวมยอดสุทธิจากมินิเกมทายผลและท้าชน"}
                  </p>
                </div>
                <!-- Search & Filters -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span id="bramann-prizes-count" class="${b||_!=="all"?"":"hidden "}inline-flex items-center text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
                    ${i?`Showing ${S.length} of ${x.length} teams`:`แสดง ${S.length} จาก ${x.length} ทีม`}
                  </span>
                  <div class="relative min-w-[140px] xs:min-w-[180px] max-w-xs flex-1">
                    <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </span>
                    <input 
                      type="text" 
                      id="bramann-prizes-search-input"
                      data-rendered-lang="${F}"
                      data-rendered-league="${this.escapeHtml(q)}"
                      value="${this.escapeHtml(this.prizesSearchQuery||"")}" 
                      oninput="app.handlePrizesSearch(this.value)"
                      aria-label="${i?"Search team name or manager":"ค้นหาชื่อทีมหรือผู้จัดการ"}"
                      placeholder="${i?"Search team...":"ค้นหาทีม..."}"
                      class="w-full pl-8 pr-7 py-2 min-h-[38px] sm:min-h-[34px] text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-sans"
                    />
                    <button id="bramann-prizes-search-clear" type="button" aria-label="${i?"Clear search":"ล้างการค้นหา"}" onclick="app.handlePrizesSearch('')" class="${this.prizesSearchQuery?"":"hidden "}absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div class="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-wrap">
                    <button id="btn-bramann-filter-all" type="button" onclick="app.setPrizesFilter('all')" aria-pressed="${this.prizesFilterMode==="all"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="all"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                      ${i?"All":"ทั้งหมด"}
                    </button>
                    <button id="btn-bramann-filter-winners" type="button" onclick="app.setPrizesFilter('winners')" aria-pressed="${this.prizesFilterMode==="winners"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="winners"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                      ${i?"Winners":"มีรางวัล"}
                    </button>
                    <button id="btn-bramann-filter-fined" type="button" onclick="app.setPrizesFilter('fined')" aria-pressed="${this.prizesFilterMode==="fined"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="fined"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                      ${i?"Paying":"จ่ายส่วนต่าง"}
                    </button>
                    <button id="btn-bramann-filter-non_prize" type="button" onclick="app.setPrizesFilter('non_prize')" aria-pressed="${this.prizesFilterMode==="non_prize"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="non_prize"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                      ${i?"Guest":"ร่วมสนุก"}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Standings Table (High-Craft Responsive Sticky Freeze) -->
              <div class="overflow-x-auto touch-scroll -mx-4 sm:mx-0 scrollbar-thin table-sticky-container">
                <table aria-label="${i?"Bramann Dual Prize and Overall Standings Table":"ตารางสรุปเงินรางวัลแบบคู่และอันดับรวม Bramann"}" class="w-full text-left table-sticky table-clean">
                  <thead>
                    <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                      <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                      <th scope="col" class="sticky-col-team py-2.5 px-3">${i?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                      <th scope="col" class="py-2.5 px-2 text-center w-16">${i?"Total Pts":"คะแนนรวม"}</th>
                      <th scope="col" class="py-2.5 px-2 text-right min-w-[80px]">Prize 1 (GW${n})</th>
                      <th scope="col" class="py-2.5 px-2 text-right min-w-[80px]">Prize 2 (GW${c})</th>
                      <th scope="col" class="py-2.5 px-2 text-right min-w-[90px]">${i?"FPL Prize":"รางวัล FPL"}</th>
                      <th scope="col" class="py-2.5 px-2 text-right min-w-[95px]">${i?"Prediction Net":"ทายผลสะสม"}</th>
                      <th scope="col" class="py-2.5 px-2 text-right min-w-[90px]">${i?"Challenge Net":"ท้าชนสะสม"}</th>
                      <th scope="col" class="py-2.5 px-3 text-right min-w-[110px] font-black text-slate-800 dark:text-slate-200">${i?"Net Total":"ยอดรวมสุทธิ"}</th>
                    </tr>
                  </thead>
                  <tbody id="bramann-prizes-tbody" class="text-xs sm:text-sm">
                    ${E}
                  </tbody>
                  <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-mono text-xs sm:text-sm font-bold">
                    <tr>
                      <td class="sticky-col-rank"></td>
                      <td class="sticky-col-team py-3 px-3 text-slate-700 dark:text-slate-300 font-display">
                        ${i?"Total Pool Balance":"ยอดรวมจัดสรรเงินกองกลาง"}
                      </td>
                      <td class="py-3 px-2 text-center text-slate-900 dark:text-white font-black">${z}</td>
                      <td class="py-3 px-2 text-right text-slate-900 dark:text-white font-black">${U.toLocaleString()}</td>
                      <td class="py-3 px-2 text-right text-slate-900 dark:text-white font-black">${Q.toLocaleString()}</td>
                      <td class="py-3 px-2 text-right text-slate-900 dark:text-white font-black">${W.toLocaleString()}</td>
                      <td class="py-3 px-2 text-right text-slate-900 dark:text-white font-black">${P===0?"0":P.toLocaleString()}</td>
                      <td class="py-3 px-2 text-right text-slate-900 dark:text-white font-black">${u===0?"0":u.toLocaleString()}</td>
                      <td class="py-3 px-3 text-right text-slate-900 dark:text-white font-black text-sm sm:text-base">${N.toLocaleString()} THB</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          `)}renderShi62Special(){if(!this.hasShi62Feature()||!this.shi62Data)return;const e=document.getElementById("shi62-special-view");if(!e)return;const t=this.currentLang==="en",a=[...this.shi62Data.gameweeks||[]].sort((n,c)=>{const m=parseInt((n.name||"").replace(/[^0-9]/g,"")||"0",10),s=parseInt((c.name||"").replace(/[^0-9]/g,"")||"0",10);return s!==m?s-m:(n.name||"").includes("Commu")?1:-1});!this.activeShi62GW&&a.length>0&&(this.activeShi62GW=a[0].name);const r=this.shi62Data,p=a.find(n=>n.name===this.activeShi62GW)||a[0];if(!p)return;const i=(n,c=!0,m="")=>{const s=Math.abs(n).toLocaleString(),o=m?` ${m}`:"";return n>0?`${c?"+":""}${s}${o}`:n<0?`-${s}${o}`:`0${o}`};let d=`
          <!-- Header Banner (Minimal & Professional) -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                  ${this.data&&this.data.name?this.data.name:"Shi62"} ${t?"Prediction Game":"ทายผล"}
                </h2>
              </div>

              <!-- Quick Stats Grid (Clean & Minimal) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Total Season Turnover":"ยอดเงินสะพัดรวม"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">฿${Number(r.total_season_turnover).toLocaleString()}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Matches Opened":"คู่ที่เปิดทายผล"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">${r.total_season_matches} ${t?"Matches":"คู่"}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Top Profit Leader":"ผู้นำทำกำไรสูงสุด"}</div>
                  <div class="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-display truncate mt-0.5">${r.cumulative_standings[0]?this.escapeHtml(r.cumulative_standings[0].player.display_name)+" ("+i(r.cumulative_standings[0].net)+")":"-"}</div>
                </div>
                <div class="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">${t?"Highest Win Rate":"แม่นยำสูงสุด (%ชนะ)"}</div>
                  <div class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 font-display mt-0.5">${this.escapeHtml([...Array.isArray(r.cumulative_standings)?r.cumulative_standings:[]].sort((n,c)=>c.win_rate-n.win_rate)[0]?.player.display_name||"-")} (${[...Array.isArray(r.cumulative_standings)?r.cumulative_standings:[]].sort((n,c)=>c.win_rate-n.win_rate)[0]?.win_rate||0}%)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Gameweek Breakdown & Match Details -->
          <div class="glass-card rounded-2xl p-3 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <!-- Gameweek Controls Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                ${t?"Match Results & Weekly Settlement":"ผลการแข่งขัน & การคิดเงินประจำสัปดาห์"}
              </h2>

              <!-- GW Pills Selector & Copy LINE Button -->
              <div class="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                <div class="flex items-center gap-1 overflow-x-auto touch-scroll scrollbar-thin p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 max-w-full w-full sm:w-auto">
                  ${a.map(n=>{const c=n.name===this.activeShi62GW;return`
                      <button 
                        onclick="app.selectShi62GW('${n.name}')"
                        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${c?"bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60"}"
                      >
                        ${n.name}
                      </button>
                    `}).join("")}
                </div>
              </div>
            </div>

            <!-- Active GW Stats & Financial Balance Card -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Left: GW Info -->
              <div class="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300 font-display">${p.name}</span>
                    <span class="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">${p.matches.length} ${t?"Matches":"คู่"}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display mt-2">
                    ฿${Number(p.total_pool).toLocaleString()}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ${t?"Total pool turnover this Gameweek":"ยอดเงินพูลที่หมุนเวียนในสัปดาห์นี้"}
                  </div>
                </div>
              </div>

              <!-- Right 2 cols: GW Standings -->
              <div class="md:col-span-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>${t?`Weekly Net Balance Summary (${p.name})`:`สรุปยอดเงินได้-เสียสุทธิในสัปดาห์นี้ (${p.name})`}</span>
                  <span class="text-[10.5px] text-slate-400 font-normal">${t?"Sorted by net profit":"เรียงตามกำไรสุทธิ"}</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  ${p.summary.map(n=>{const c=n.net>0,m=n.net<0,s=c?"bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20":m?"bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20":"bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60",o=c?"text-emerald-600 dark:text-emerald-400":m?"text-rose-600 dark:text-rose-400":"text-slate-600 dark:text-slate-400";return`
                      <div class="p-2 rounded-lg border ${s} flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${this.escapeHtml(n.player.display_name)}</span>
                          <span class="text-[10px] text-slate-400">${n.won}W - ${n.lost}L</span>
                        </div>
                        <div class="text-xs sm:text-sm font-bold font-display mt-1 ${o}">
                          ${i(n.net)}
                        </div>
                      </div>
                    `}).join("")}
                </div>
              </div>
            </div>

            <!-- Matches List Grid -->
            <div>
              <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                <span>${t?`All Matches Breakdown (${p.matches.length} Matches)`:`รายละเอียดการทายผลทุกคู่ (${p.matches.length} คู่)`}</span>
                <span class="text-[11px] text-slate-400 font-normal">${t?"✅ indicates winning selection":"เครื่องหมาย ✅ คือผลชนะ"}</span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                ${p.matches.map((n,c)=>{const m=n.status==="void"||!n.winning_option,s=n.winning_option,l=s==="draw"?t?"Draw":"เสมอ":s||"",g=function(y){let D=(y||"").trim(),h="";const $=D.match(/^\[(.*?)\]\s*/);$&&(h=$[1],D=D.substring($[0].length).trim());const v=D.split(/\s+vs\s+/i),I=(v[0]||"").trim(),L=(v[1]||"").trim(),k=T=>{const H=T.match(/\(([+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?)\)/)||T.match(/([+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?)/);let z=H?H[1]:"";return z&&!z.startsWith("-")&&!z.startsWith("+")&&(z="-"+z),{team:T.replace(/\s*\([+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?\)\s*/g,"").replace(/\s*[+-]?\d+(?:\.\d+)?(?:[/]\d+(?:\.\d+)?)?\s*/g,"").trim(),hdc:z}},x=k(I),C=k(L);return{tour:h,s1Team:x.team,s1Hdc:x.hdc,s2Team:C.team,s2Hdc:C.hdc}}(n.title);return`
                    <div class="rounded-2xl border ${m?"border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40":"border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700/90 hover:shadow-md"} p-3 sm:p-4 flex flex-col justify-between transition-all duration-200">
                      
                      <!-- Header Row: Match # + Matchup Title + Winner Badge & Pool -->
                      <div class="flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2.5">
                        <div class="flex items-center gap-1.5 min-w-0 pr-1">
                          <span class="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold font-display shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                            ${c+1}
                          </span>
                          ${g.tour?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-extrabold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 uppercase shrink-0 font-display shadow-2xs">${g.tour}</span>`:""}
                          <div class="flex items-center gap-1 text-xs sm:text-sm text-slate-900 dark:text-white font-display truncate">
                            <span class="font-bold">${g.s1Team}</span>
                            ${g.s1Hdc?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shadow-2xs">${g.s1Hdc}</span>`:""}
                            <span class="text-slate-400 font-normal text-[11px] px-0.5">vs</span>
                            <span class="font-bold">${g.s2Team}</span>
                            ${g.s2Hdc?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shadow-2xs">${g.s2Hdc}</span>`:""}
                          </div>
                        </div>
                        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          ${m?`<span class="text-[9.5px] sm:text-[10.5px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">${t?"Push / Void":"เสมอ / ยก"}</span>`:`<span class="inline-flex items-center gap-0.5 text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">${t?"Won":"ชนะ"}: ${l} ✅</span>`}
                          <span class="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-display border border-slate-200/50 dark:border-slate-700/50">฿${Number(n.pool||0).toLocaleString()}</span>
                        </div>
                      </div>

                      <!-- Options Grid -->
                      <div class="${n.options&&n.options.length===3?"grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5":"grid grid-cols-2 gap-2 sm:gap-2.5"}">
                        ${n.options.map((y,D)=>{const h=!!y.is_win,$=(y.raw_label||y.label||"").toLowerCase().trim(),v=y.label==="draw"||$==="d"||$==="draw"||$==="เสมอ";let I=y.label,L="",k="";if(v)I=t?"Draw":"เสมอ (Draw)";else{const C=D===0?1:2,T=typeof resolveLiveScoreTeam=="function"?resolveLiveScoreTeam(y.label,n.title,C):{name:y.label,logo:""};I=T.name||y.label,T.logo&&(L=this.getTeamLogoUrl(T.logo));const H=String(y.label).toUpperCase();g.s1Team.toUpperCase()===H&&g.s1Hdc?k=g.s1Hdc:g.s2Team.toUpperCase()===H&&g.s2Hdc&&(k=g.s2Hdc)}const x=y.names&&y.names.length||0;return`
                            <div class="rounded-xl p-2.5 sm:p-3 border flex flex-col justify-between transition-all duration-150 hover:brightness-105 ${h?"bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border-emerald-500/40 dark:border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-2xs":"bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80"}">
                              <div class="flex flex-col justify-between h-full">
                                <!-- Team / Option Header -->
                                <div class="flex items-start gap-2 mb-2">
                                  ${L?`<img src="${L}" alt="${I}" class="w-6 h-6 sm:w-6.5 sm:h-6.5 object-contain shrink-0 mt-0.5 filter drop-shadow-2xs" loading="lazy" onerror="this.style.display='none'">`:v?'<div class="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">🤝</div>':""}
                                  <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                      <span class="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-tight" title="${I}">${I}</span>
                                      ${k?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-display shrink-0 shadow-2xs">${k}</span>`:""}
                                    </div>
                                    <div class="flex items-center gap-1.5 mt-1">
                                      <span class="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs ${h?"bg-emerald-600 text-white":"bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}">${x} ${t?x>1?"picks":"pick":"ขา"}</span>
                                      ${h?'<span class="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">ชนะ ✅</span>':""}
                                    </div>
                                  </div>
                                </div>

                                <!-- Bettors Tags -->
                                <div class="flex flex-wrap gap-1 min-h-[26px] items-center pt-2 border-t border-slate-200/60 dark:border-slate-700/50 mt-1">
                                  ${x>0?y.names.map(C=>`
                                      <span class="inline-flex items-center text-[10px] sm:text-[10.5px] px-1.5 py-0.5 rounded-md transition-transform hover:scale-105 cursor-default ${h?"bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/60 shadow-2xs font-medium":"bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"}">
                                        ${this.escapeHtml(C)}
                                      </span>
                                    `).join(""):`<span class="text-[10px] text-slate-400 italic">${t?"No selections":"ไม่มีผู้เลือก"}</span>`}
                                </div>
                              </div>
                            </div>
                          `}).join("")}
                      </div>

                      <!-- Payout Breakdown Footer -->
                      <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                        <span class="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">${t?"Net Payout:":"ผลได้-เสีย:"}</span>
                        ${Object.entries(n.payouts||{}).map(([y,D])=>{const h=D.net||0,$=h>0,v=h<0;return`
                            <span class="text-[10px] px-1.5 py-0.5 rounded-md border ${$?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60":v?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60":"bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60"} font-display">
                              ${this.escapeHtml(y)}: <strong>${i(h)}</strong>
                            </span>
                          `}).join("")}
                      </div>
                    </div>
                  `}).join("")}
              </div>
            </div>
          </div>

          <!-- SECTION 2: Cumulative Standings Table (ตารางการแข่งขันทายผล) -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  ${t?"Cumulative Prediction Standings":"ตารางการแข่งขันทายผลสะสม"}
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ${t?`Prediction performance from GW 1 to ${p.name} • Zero-Sum Balance calculation (Total net equals 0 THB)`:`สรุปผลงานทายผล GW 1 ถึง ${p.name} • คิดเงินแบบ Zero-Sum Balance (ยอดรวมได้-เสียสุทธิเท่ากับ 0 บาท)`}
                </p>
              </div>
            </div>

            <!-- Standings Table -->
            <div class="overflow-x-auto touch-scroll -mx-4 sm:mx-0 scrollbar-thin table-sticky-container">
              <table class="w-full text-left min-w-[640px] table-sticky table-clean">
                <thead>
                  <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    <th class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                    <th class="sticky-col-team py-2.5 px-3">${t?"Player / FPL Team":"ผู้เล่น / ทีม FPL"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Matches":"แข่ง (คู่)"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Won":"ชนะ"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Lost":"แพ้"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Push":"เสมอ"}</th>
                    <th class="py-2.5 px-3 text-center">${t?"Win %":"% ชนะ"}</th>
                    <th class="py-2.5 px-3 text-right">${t?"Won":"เงินที่ได้"}</th>
                    <th class="py-2.5 px-3 text-right">${t?"Lost":"เงินที่เสีย"}</th>
                    <th class="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">${t?"Net P/L":"กำไร/ขาดทุนสุทธิ"}</th>
                  </tr>
                </thead>
                <tbody class="text-xs sm:text-sm">
                  ${r.cumulative_standings.map(n=>{const c=n.net>0,m=n.net<0,s=c?"text-emerald-600 dark:text-emerald-400 font-bold":m?"text-rose-600 dark:text-rose-400 font-bold":"text-slate-500 font-medium";return`
                      <tr onclick="app.toggleTrackedRow(this)" class="cursor-pointer transition-colors">
                        <td class="sticky-col-rank py-2.5 px-2 text-center font-display">${`<span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${n.rank}</span>`}</td>
                        <td class="sticky-col-team py-2.5 px-3 min-w-[140px] sm:min-w-0">
                          <div class="flex items-center gap-2">
                            <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                              ${this.escapeHtml(n.player.display_name)}
                            </span>
                            <div class="min-w-0">
                              ${n.player.is_guest?'<div class="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">เล่นเฉพาะทายผล</div>':`
                                  <div class="font-bold text-slate-900 dark:text-white leading-tight truncate">${this.escapeHtml(n.player.team_name)}</div>
                                  <div class="text-[11px] text-slate-400 leading-tight truncate">${this.escapeHtml(n.player.manager)}</div>
                                `}
                            </div>
                          </div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-medium text-slate-700 dark:text-slate-300">${n.matches}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">${n.won}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-semibold text-rose-500 dark:text-rose-400">${n.lost}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums text-slate-400">${n.push}</td>
                        <td class="py-2.5 px-3 text-center font-display tabular-nums font-medium text-slate-600 dark:text-slate-400">${n.win_rate}%</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums text-emerald-600 dark:text-emerald-400">${n.total_won_amount.toLocaleString()}</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums text-rose-500 dark:text-rose-400">${n.total_lost_amount>0?`-${n.total_lost_amount.toLocaleString()}`:"0"}</td>
                        <td class="py-2.5 px-3 text-right font-display tabular-nums ${s}">
                          ${i(n.net)}
                        </td>
                      </tr>
                    `}).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;e.innerHTML=d}renderGWSelector(){const e=document.getElementById("gw-selector-container");if(!e)return;let t="";const a=Number(this.multiData.max_gw)||2,r=this.currentLang==="en";for(let p=1;p<=38;p++){const i=p===this.selectedGW,d=p<=a,n=this.data.gameweeks?this.data.gameweeks[String(p)]:null,c=!!(n&&n.is_finished),m=n?n.is_started!==void 0?!!n.is_started:c||n.results&&n.results.some(l=>l.points>0):!1;let s="bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-500 dark:border-slate-800/40 cursor-not-allowed opacity-60",o=r?"LOCKED":"ล็อก";d&&(c?(o=r?"Finished":"จบแล้ว",i?s="bg-slate-900 text-white border border-slate-900 dark:bg-blue-600 dark:text-white dark:border-blue-500 shadow-sm cursor-pointer scale-105":s="bg-white text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"):m?(o=r?"LIVE":"สด",i?s="bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-emerald-300 dark:border-emerald-400 shadow-lg shadow-emerald-950/40 cursor-pointer scale-105 btn-live-pulse font-bold":s="bg-emerald-700/90 hover:bg-emerald-700 text-white border-2 border-emerald-400 shadow-md cursor-pointer btn-live-pulse font-bold"):(o=r?"Upcoming":"รอแข่ง",i?s="bg-indigo-950 text-white border-2 border-indigo-400 dark:bg-indigo-600 dark:border-indigo-400 shadow-md cursor-pointer scale-105":s="bg-indigo-50/80 text-indigo-900 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 hover:bg-indigo-100 cursor-pointer")),t+=`
            <button 
              id="gw-btn-${p}"
              onclick="${d?`app.selectGW(${p})`:""}"
              class="flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 py-1.5 min-h-[44px] rounded-xl transition-all duration-150 font-display active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 ${s}"
              ${d?"":"disabled"}
            >
              <span class="text-xs font-bold">GW ${p}</span>
              <span class="text-[9px] font-semibold">${o}</span>
            </button>
          `}e.innerHTML=t;try{const p=document.getElementById(`gw-btn-${this.selectedGW}`);if(p&&e){const i=p.offsetLeft-e.clientWidth/2+p.clientWidth/2;e.scrollTo({left:Math.max(0,i),behavior:"smooth"})}}catch{}}stepHighlightsGW(e){const t=Number(this.multiData&&this.multiData.max_gw)||2,a=(Number(this.selectedGW)||1)+e;a>=1&&a<=t&&this.selectGW(a)}async selectGW(e,t=!1,a=!1){const r=this._selectGwSeq=(this._selectGwSeq||0)+1,p=Number(this.multiData.max_gw)||2;this.selectedGW=Math.min(Math.max(Number(e)||1,1),p);const i=(this.config&&this.config.monthly_schedule||[]).find(d=>d.gw_list&&d.gw_list.includes(this.selectedGW));if(i&&(this.selectedMonthId=i.id),!t)try{if(typeof window<"u"&&window.history&&window.history.replaceState){const d=new URLSearchParams(window.location.search||"");d.set("gw",this.selectedGW);const n=d.toString(),c=window.location.pathname+(n?"?"+n:"")+window.location.hash;window.history.replaceState(null,"",c)}}catch{}await this.ensureTier2GWChunk(this.selectedGW),this._selectGwSeq===r&&(await this.ensureTier2PicksChunk(this.selectedGW),this._selectGwSeq===r&&(await this.ensureTier1GWSquads(this.selectedGW),this._selectGwSeq===r&&(this.renderGWSelector(),this.updateHighlightsTabBlink(),a||this.renderCurrentTab(!0))))}renderGameweekView(){const e=String(this.selectedGW),t=this.data.gameweeks?this.data.gameweeks[e]:null,a=document.getElementById("matchday-table-title"),r=document.getElementById("matchday-table-badge"),p=document.getElementById("matchday-table-body"),i=document.getElementById("overall-standings-body"),d=document.getElementById("overall-gw-num"),n=document.getElementById("champion-card-container"),c=this.currentLang==="en";d&&(d.innerText=this.selectedGW);const m=typeof document<"u"?document.getElementById("live-team-search"):null,s=m?m.value.trim().toLowerCase():"";if(String(this._isLoadingLeague||"")===String(this.activeLeagueId)){const K=c?"Loading league data...":"กำลังโหลดข้อมูลลีก...";n&&(n.innerHTML="");const B=document.getElementById("live-drama-strip-container");B&&(B.innerHTML="",B.classList.add("hidden")),p&&(p.innerHTML=`<tr><td colspan="6" class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs animate-pulse">${K}</td></tr>`),i&&(i.innerHTML=`<tr><td colspan="5" class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs animate-pulse">${K}</td></tr>`);return}const o=!!(t&&Array.isArray(t.results)&&t.results.length>0),l=t?!!t.is_finished:!1,g=o?t.is_started!==void 0?!!t.is_started:l||t.results.some(K=>K.points>0):!!(t&&t.is_started),y=document.getElementById("overall-gw-pill");y?l?y.innerText=c?`Post-GW ${this.selectedGW}`:`หลังจบ GW ${this.selectedGW}`:g?y.innerText=c?`Live GW ${this.selectedGW}`:`คะแนนสด GW ${this.selectedGW}`:y.innerText=c?`Pre-GW ${this.selectedGW}`:`ก่อนแข่ง GW ${this.selectedGW}`:d&&(d.innerText=this.selectedGW),a&&(a.innerText=c?`Gameweek ${this.selectedGW} Standings`:`ตารางคะแนน Gameweek ${this.selectedGW}`);const D=document.getElementById("overall-table-title");D&&(D.innerText=c?"Overall Cumulative Standings":"ตารางคะแนนรวมสะสม");const h=document.getElementById("matchday-sub-label");h&&(h.innerText=c?"Gameweek Standings":"คะแนนประจำสัปดาห์");const $=document.getElementById("overall-sub-label");$&&($.innerText=c?"Overall Standings":"คะแนนรวมสะสม"),r&&(l?(r.innerText=c?"Official Results":"ผลการแข่งขันทางการ",r.className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"):g?(r.innerText=c?"Live in Progress":"กำลังแข่งขัน",r.className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"):(r.innerText=c?"Upcoming":"รอคิกออฟ",r.className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"));const v=document.getElementById("th-matchday-points");v&&(l?v.innerHTML=c?'<span class="hidden sm:inline">Raw Pts</span><span class="sm:hidden">Raw</span>':'<span class="hidden sm:inline">คะแนนดิบ</span><span class="sm:hidden">ดิบ</span>':g?v.innerHTML=c?'<span class="hidden sm:inline">Live Pts</span><span class="sm:hidden">Live</span>':'<span class="hidden sm:inline">คะแนนสด</span><span class="sm:hidden">สด</span>':v.innerHTML=c?'<span class="hidden sm:inline">Points</span><span class="sm:hidden">Pts</span>':'<span class="hidden sm:inline">คะแนน</span><span class="sm:hidden">คะแนน</span>');const I=this.config.features&&this.config.features.prize_model==="weekly",L=!!(this.config.features&&this.config.features.tie_breaker==="highest_player"),k="net_points",x=o?[...t.results].sort((K,B)=>{const Y=B[k]-K[k]||B.net_points-K.net_points||B.points-K.points;return Y!==0?Y:L?this.compareTeamPlayerScores(K.entry_id,B.entry_id,this.selectedGW):0}):[];let C=1,T=null,H=null,z=0;x.forEach(K=>{if(!this.isPrizeEligible(K.entry_id)){K.rank=null,K.preRank=null;return}z++,K.preRank=z;let B=!1;T!==null&&K[k]===T&&(L&&H?B=this.compareTeamPlayerScores(K.entry_id,H.entry_id,this.selectedGW)===0:B=!0),!B&&T!==null&&(C=z),T=K[k],H=K,K.rank=C});const Q=[...x.filter(K=>this.isPrizeEligible(K.entry_id))].sort((K,B)=>{const Y=B[k]-K[k]||B.net_points-K.net_points;return Y!==0?Y:L?this.compareTeamPlayerScores(K.entry_id,B.entry_id,this.selectedGW):0}),W=Q.length>0?Q[0][k]:0;let P=[];if(Q.length>0){const K=Q[0];L?P=Q.filter(B=>B[k]===K[k]&&this.compareTeamPlayerScores(B.entry_id,K.entry_id,this.selectedGW)===0):P=Q.filter(B=>B[k]===W)}const u=P[0]||x[0],N=P.length>1,w=x[0],b=this.config&&this.config.features&&this.config.features.weekly_prizes?Object.keys(this.config.features.weekly_prizes).length:1,_=x.slice(0,Math.min(x.length,b)).filter(K=>!this.isPrizeEligible(K.entry_id)),S=_.length>0,E=u,{overallSorted:A,overallContext:F,targetGW:q}=this.computeGameweekOverallStandings(this.selectedGW),j=this.isTier2League(),R=j?"":this.getMyTeamId();if(n&&!o)n.innerHTML="";else if(n&&E){const K=this.getLiveNoteCacheKey(this.selectedGW,l,g),B=this.config&&this.config.non_prize_teams||[];let Y=this.liveNotesCache[K];(!Y||typeof Y=="string")&&(Y=LiveCommentaryEngine.generateNoteObject(this.selectedGW,t,this.data.name,!1,B,this.data,I,L,c,{overallContext:F}),this.liveNotesCache[K]=Y);const X=Y.text,M=`<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 font-display truncate max-w-[180px] sm:max-w-[260px]">${this.escapeHtml(this.data.name||"")} · GW ${this.selectedGW}</span>`;if(g){const V=this.config.features.prize_model==="weekly";let Z="";l?Z=V?N?c?"Joint Weekly Winners":"แชมป์ร่วมประจำสัปดาห์":c?"Weekly Winner":"แชมป์ประจำสัปดาห์":c?"Top Scorer":"คะแนนสูงสุดประจำสัปดาห์":Z=V?N?c?"Joint Live Leaders":"ผู้นำคะแนนสดร่วม":c?"Live Leader":"ผู้นำคะแนนสด":c?"Live Leader":"ผู้นำคะแนนสดประจำสัปดาห์";const O='<svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>',ae='<span class="w-2 h-2 rounded-full bg-emerald-500"></span>';let de=l?O:ae;V||(de=l?O:ae);const oe=5;let ue="",_e="";if(P.length<=1)ue=`
                <button onclick="app.openTeamModal(${u.entry_id})" class="text-left group cursor-pointer inline-flex items-center min-h-[36px] sm:min-h-[40px] py-0.5 max-w-full">
                  <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 tracking-tight leading-snug transition-colors truncate">${this.escapeHtml(u.team_name)}</h2>
                </button>
              `,_e=`
                <p class="text-xs sm:text-sm ${l?"text-amber-950/75 dark:text-amber-100/80":"text-emerald-950/75 dark:text-emerald-100/80"} font-medium truncate">
                  ${this.escapeHtml(u.player_name)} • (C) <strong>${this.escapeHtml((u.captain||"-").replace(/\s*\(C\)/gi,"").trim())}</strong>
                </p>
              `;else{const le=P.slice(0,oe),ie=P.length-oe;ue=`
                <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  ${le.map((pe,ke)=>{const ye=ke===le.length-1&&ie<=0,te=ke===le.length-2&&ie<=0,ne=ye?"":te?"&":",";return`
                      <button onclick="app.openTeamModal(${pe.entry_id})" class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white hover:text-amber-700 dark:hover:text-amber-400 tracking-tight transition-colors cursor-pointer text-left min-h-[36px] sm:min-h-[40px] inline-flex items-center">
                        ${this.escapeHtml(pe.team_name)}
                      </button>
                      ${ne?`<span class="text-slate-400 dark:text-slate-500 font-bold text-base sm:text-xl">${ne}</span>`:""}
                    `}).join("")}
                  ${ie>0?`<span class="text-sm sm:text-base font-bold text-slate-500 self-center">${c?`and ${ie} more teams`:`และอีก ${ie} ทีม`}</span>`:""}
                </div>
              `,_e=`
                <div class="text-xs sm:text-sm ${l?"text-amber-950/75 dark:text-amber-100/80":"text-emerald-950/75 dark:text-emerald-100/80"} font-medium mt-0.5 space-y-0.5">
                  ${le.map(pe=>`
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <button onclick="app.openTeamModal(${pe.entry_id})" class="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                        ${this.escapeHtml(pe.player_name)}
                      </button>
                      <span class="opacity-60">•</span>
                      <span>(C) <strong>${this.escapeHtml((pe.captain||"-").replace(/\s*\(C\)/gi,"").trim())}</strong></span>
                    </div>
                  `).join("")}
                  ${ie>0?`<div class="text-xs opacity-75">${c?`and ${ie} more managers`:`และอีก ${ie} คน`}</div>`:""}
                </div>
              `}let ce="";if(S)if(_.length===1&&_[0].entry_id===w.entry_id)ce=`
                  <div class="mt-3 px-3.5 py-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs text-amber-950 dark:text-amber-200 shadow-2xs">
                    <div class="leading-relaxed">
                      <strong class="font-bold">${c?"Prize Allocation Note:":"หมายเหตุการมอบรางวัล:"}</strong> ${c?`Team <strong>${this.escapeHtml(w.team_name)}</strong> (${w.points} pts${w.hits>0?`, net ${w.net_points} pts after hits -${w.hits}`:""}) is the highest scorer this week but participates as guest, passing weekly prize eligibility to <strong>${this.escapeHtml(u.team_name)}</strong> (${u[k]} pts).`:`ทีม <strong>${this.escapeHtml(w.team_name)}</strong> (${w.points} pts${w.hits>0?`, แต้มสุทธิ ${w.net_points} pts หักย้าย -${w.hits}`:""}) ทำคะแนนสูงสุดในสัปดาห์นี้แต่เป็นทีมร่วมสนุก จึงส่งมอบสิทธิ์รับรางวัลประจำสัปดาห์ให้แก่ <strong>${this.escapeHtml(u.team_name)}</strong> (${u[k]} pts)`}
                    </div>
                  </div>
                `;else{const le=_.map(ie=>`<strong>${this.escapeHtml(ie.team_name)}</strong> (${ie[k]} pts)`).join(", ");ce=`
                  <div class="mt-3 px-3.5 py-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs text-amber-950 dark:text-amber-200 shadow-2xs">
                    <div class="leading-relaxed">
                      <strong class="font-bold">${c?"Prize Allocation Note:":"หมายเหตุการมอบรางวัล:"}</strong> ${c?`Team ${le} finished in weekly podium position but participates as guest, rolling prize eligibility down to eligible league teams.`:`ทีม ${le} ทำคะแนนติดอันดับรับรางวัลสัปดาห์นี้แต่เป็นทีมร่วมสนุก จึงส่งมอบสิทธิ์รับรางวัลเลื่อนลงให้แก่ทีมที่มีสิทธิ์รับรางวัลในลีก`}
                    </div>
                  </div>
                `}const J=this.getLeagueCurrency();let ee="";if(l&&I&&this.config.features&&this.config.features.weekly_prizes){const le=Object.values(this.config.features.weekly_prizes).map(Number),ie=this.calculateWeeklyTierPrizes(Q,le,this.selectedGW);ie.length>0&&(ee=`
                  <div class="mt-3 pt-3 border-t ${l?"border-slate-200 dark:border-slate-800":"border-emerald-200/80 dark:border-emerald-900/60"}">
                    <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display flex items-center justify-between">
                      <span>${c?"Weekly Prize Breakdown (Top 3)":"สรุปเงินรางวัลประจำสัปดาห์ 3 อันดับ"}</span>
                      <span class="text-[10px] text-slate-500 font-normal">${c?`Total ${le.reduce((pe,ke)=>pe+ke,0).toLocaleString()} ${J.code}/GW`:`รวมสัปดาห์ละ ${le.reduce((pe,ke)=>pe+ke,0).toLocaleString()} ${J.code}`}</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      ${ie.map(pe=>{const ke=c?pe.rank===1?"#1 1st":pe.rank===2?"#2 2nd":"#3 3rd":pe.rank===1?"#1 ที่ 1":pe.rank===2?"#2 ที่ 2":"#3 ที่ 3",ye=pe.rank===1?"bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-100 shadow-2xs":pe.rank===2?"bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-200":"bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-slate-300",te=pe.tieBreakNote?`<span class="text-[9px] text-amber-700 dark:text-amber-400 font-semibold block truncate mt-0.5">• ${this.escapeHtml(pe.tieBreakNote)}</span>`:"";return`
                          <div class="p-2.5 rounded-xl border ${ye} flex items-center justify-between text-xs shadow-2xs">
                            <div class="truncate pr-2">
                              <span class="font-bold text-[11px] block">${ke}${pe.isJoint?c?` (Tied ${pe.jointCount})`:` (เสมอ ${pe.jointCount})`:""}</span>
                              <span class="font-bold truncate block">${this.escapeHtml(pe.team_name)}</span>
                              <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(pe.player_name)} (${pe.net_points} pts)</span>
                              ${te}
                            </div>
                            <div class="text-right flex-shrink-0">
                              <span class="font-black font-display text-emerald-700 dark:text-emerald-400 text-sm block">${pe.prize.toLocaleString()}</span>
                              <span class="text-[9px] text-slate-400 block">${pe.isJoint?c?`${J.code} (Split)`:`${J.code} (หารเท่า)`:J.code}</span>
                            </div>
                          </div>
                        `}).join("")}
                    </div>
                  </div>
                `)}let re="";if(l&&this.config.features&&this.config.features.has_weekly_penalties){const le=this.calculateWeeklyPenalties(Q,this.selectedGW),ie=this.getWeeklyPenaltyTiers(),pe=ie.length,ke=ie.reduce((ne,he)=>ne+he,0),ye=this.config.features.weekly_prize_amount!==void 0?Number(this.config.features.weekly_prize_amount):200,te=ke-ye;re=`
                <div class="mt-3 pt-3 border-t ${l?"border-slate-200 dark:border-slate-800":"border-emerald-200/80 dark:border-emerald-900/60"}">
                  <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display flex items-center justify-between flex-wrap gap-1">
                    <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> ${c?`Bottom ${pe} Penalties (Total ${ke.toLocaleString()} ${J.code} - Weekly Champ ${ye.toLocaleString()} ${J.code})`:`ผู้เสียค่าปรับ ${pe} อันดับท้าย (รวม ${ke.toLocaleString()} ${J.code} - หักจ่ายแชมป์ ${ye.toLocaleString()} ${J.code})`}</span>
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">${c?`+${te.toLocaleString()} ${J.code} to Prize Pool`:`+${te.toLocaleString()} ${J.code} สะสมเข้ากองกลาง`}</span>
                  </div>
                  ${`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${{1:"xl:grid-cols-1",2:"xl:grid-cols-2",3:"xl:grid-cols-3",4:"xl:grid-cols-4",5:"xl:grid-cols-5"}[Math.min(Math.max(pe,1),5)]||"xl:grid-cols-3"} gap-2">`}
                    ${le.map((ne,he)=>`
                        <div class="p-2 rounded-xl border ${ne.bottomTierIndex===0?"bg-rose-100/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700/60 text-rose-950 dark:text-rose-200":"bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-800/40 text-rose-900 dark:text-rose-300"} text-xs shadow-2xs">
                          <div class="flex items-center justify-between">
                            <span class="font-bold text-[10px] block">${ne.rankLabel}</span>
                            <span class="font-black text-rose-600 dark:text-rose-400 text-xs">-${ne.fine.toLocaleString()} ${J.code}</span>
                          </div>
                          <div class="font-bold truncate mt-1 text-slate-900 dark:text-white">${this.escapeHtml(ne.team_name)}</div>
                          <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(ne.player_name)} (${ne.net_points} pts)</div>
                        </div>
                      `).join("")}
                  </div>
                </div>
              `}n.innerHTML=`
              <div class="${l?"winner-spotlight-card":"live-leader-spotlight-card"} rounded-2xl p-3.5 sm:p-4 relative overflow-hidden transition-colors duration-200">
                <div class="flex items-start justify-between gap-3 sm:gap-4">
                  
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${l?"bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/50 dark:border-amber-500/40":"bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-400/50 dark:border-emerald-500/40"} font-display">
                        <span class="inline-flex items-center">${de}</span>
                        <span>${Z}</span>
                      </span>
                      ${M}
                    </div>
                    ${ue}
                    ${_e}
                  </div>

                  <div class="flex-shrink-0 text-right pl-3 border-l ${l?"border-amber-300/70 dark:border-amber-700/50":"border-emerald-300/70 dark:border-emerald-700/50"} tabular-nums">
                    <span class="text-[10px] sm:text-[11px] ${l?"text-amber-800 dark:text-amber-300":"text-emerald-800 dark:text-emerald-300"} font-bold font-display block leading-tight">
                      ${c?l?I?"Net Pts":"Official":I?"Live Net":"Live Pts":l?I?"แต้มสุทธิ":"ทางการ":I?"แต้มสุทธิสด":"คะแนนสด"}
                    </span>
                    <div class="flex items-baseline justify-end gap-1 mt-0.5">
                      <span class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display leading-none">${u[k]}</span>
                      <span class="text-[11px] font-bold ${l?"text-amber-900/70 dark:text-amber-200/70":"text-emerald-900/70 dark:text-emerald-200/70"}">pts</span>
                    </div>
                    <span class="text-[10px] font-display block mt-0.5 ${u.hits>0?"text-rose-600 dark:text-rose-400 font-bold":l?"text-amber-900/65 dark:text-amber-200/65":"text-emerald-900/65 dark:text-emerald-200/65"}">${u.hits>0?c?`Hits -${u.hits}`:`ลบ -${u.hits}`:c?"No hits":"ไม่เสียแต้มลบ"}</span>
                  </div>

                </div>

                ${ee}
                ${re}

                <!-- Highlight Note (4-Persona Commentary, Screenshot-Ready) -->
                <div class="mt-2.5 pt-2.5 border-t ${l?"border-amber-200/70 dark:border-amber-800/40":"border-emerald-200/70 dark:border-emerald-800/40"} flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div class="min-w-0 pr-1">
                    <span id="current-gw-note-text" class="font-medium text-slate-800 dark:text-slate-200 leading-relaxed break-words">${X}</span>
                  </div>
                  <div class="flex items-center justify-end flex-shrink-0 self-end sm:self-center">
                    <button type="button" onclick="app.regenerateLiveNote()" class="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] text-[11px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-xl bg-white/75 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border ${l?"border-amber-200/80 dark:border-slate-700":"border-emerald-200/80 dark:border-slate-700"} transition-colors cursor-pointer active:scale-95 font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" title="${c?"Switch Pundit Style":"เปลี่ยนมุมพากษ์"}" aria-label="${c?"Switch pundit style":"เปลี่ยนมุมพากษ์"}">
                      <svg class="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      <span>${c?"Switch Style":"เปลี่ยนมุมพากษ์"}</span>
                    </button>
                  </div>
                </div>
                ${ce}
              </div>
            `}else{const V={},Z={};let O=0,ae=0;t.results.forEach(ce=>{if(ce.captain&&ce.captain!=="-"){const J=ce.captain.replace(/\s*\(C\)/gi,"").trim();V[J]=(V[J]||0)+1}if(ce.chip){const J=ce.chip.toUpperCase();Z[J]=(Z[J]||0)+1}ce.hits>0&&(O++,ae+=ce.hits)});const oe=Object.entries(V).sort((ce,J)=>J[1]-ce[1]).slice(0,3).map(([ce,J])=>`${this.escapeHtml(ce)} (${J})`).join(", ")||"-",ue=Object.entries(Z).map(([ce,J])=>`${this.escapeHtml(ce)} (${J})`).join(", ")||(c?"No Active Chips":"ไม่มีทีมเปิดชิป"),_e=O>0?c?`${O} Teams (-${ae} pts)`:`${O} ทีม (-${ae} pts)`:c?"No Hits Taken":"ไม่มีทีมเสียแต้มลบ";n.innerHTML=`
              <div class="prematch-spotlight-card rounded-2xl p-3.5 sm:p-4 relative overflow-hidden transition-colors duration-200">
                <div class="flex items-start justify-between gap-3 sm:gap-4">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-indigo-500/15 text-indigo-900 dark:text-indigo-200 border border-indigo-300/60 dark:border-indigo-500/30 font-display">
                        <span>${c?"Gameweek Preview":"พรีวิวสัปดาห์การแข่งขัน"}</span>
                      </span>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100/90 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">${c?"Upcoming":"รอคิกออฟ"}</span>
                      ${M}
                    </div>
                    <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 leading-snug">${c?`Gameweek ${this.selectedGW} Lineups Locked`:`Gameweek ${this.selectedGW} ส่งรายชื่อเรียบร้อยแล้ว`}</h2>
                    <p class="text-xs sm:text-sm text-indigo-950/75 dark:text-indigo-100/75 font-medium mt-0.5 truncate">${c?"Awaiting opening match kickoff • Tactical overview & league stats":"รอคู่เปิดสนามคิกออฟ • สถิติการจัดทีมและวางหมากในลีก"}</p>
                  </div>

                  <div class="flex-shrink-0 text-right pl-3 border-l border-indigo-200/70 dark:border-indigo-800/50 tabular-nums">
                    <span class="text-[10px] text-indigo-900/75 dark:text-indigo-200/75 font-bold font-display block leading-tight">${c?"League Teams":"ทีมในลีก"}</span>
                    <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display leading-none">${t.results.length}</span>
                    <span class="text-[10px] font-bold text-indigo-900/70 dark:text-indigo-200/70 block mt-0.5">${c?"Teams":"ทีม"}</span>
                  </div>
                </div>

                <!-- Tactical Strip for Pre-Match (Flat Divided Row) -->
                <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-indigo-200/60 dark:divide-indigo-800/40 mt-2.5 pt-2.5 border-t border-indigo-200/60 dark:border-indigo-800/40 text-xs">
                  <div class="py-1.5 sm:py-0 sm:pr-3 min-w-0">
                    <span class="text-[10px] font-bold text-indigo-900/75 dark:text-indigo-200/75 font-display block">${c?"Top Captains":"กัปตันยอดฮิต"}</span>
                    <span class="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">${oe}</span>
                  </div>
                  <div class="py-1.5 sm:py-0 sm:px-3 min-w-0">
                    <span class="text-[10px] font-bold text-indigo-900/75 dark:text-indigo-200/75 font-display block">${c?"Active Chips":"ชิปที่ใช้งาน"}</span>
                    <span class="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">${ue}</span>
                  </div>
                  <div class="py-1.5 sm:py-0 sm:pl-3 min-w-0">
                    <span class="text-[10px] font-bold text-indigo-900/75 dark:text-indigo-200/75 font-display block">${c?"Hits Taken":"คะแนนลบย้ายตัว"}</span>
                    <span class="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate">${_e}</span>
                  </div>
                </div>

                <!-- Highlight Note (4-Persona Commentary, Screenshot-Ready) -->
                <div class="mt-2.5 pt-2.5 border-t border-indigo-200/60 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-950/80 dark:text-indigo-100/80">
                  <div class="min-w-0 pr-1">
                    <span id="current-gw-note-text" class="font-medium text-slate-800 dark:text-slate-200 leading-relaxed break-words">${X}</span>
                  </div>
                  <div class="flex items-center justify-end flex-shrink-0 self-end sm:self-center">
                    <button type="button" onclick="app.regenerateLiveNote()" class="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] text-[11px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-xl bg-white/75 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-indigo-200/70 dark:border-slate-700 transition-colors cursor-pointer active:scale-95 font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" title="${c?"Switch Pundit Style":"เปลี่ยนมุมพากษ์"}" aria-label="${c?"Switch pundit style":"เปลี่ยนมุมพากษ์"}">
                      <svg class="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      <span>${c?"Switch Style":"เปลี่ยนมุมพากษ์"}</span>
                    </button>
                  </div>
                </div>
              </div>
            `}}if(this.renderLiveDramaStrip(t,x,A,g,l),p&&!o)p.innerHTML=`<tr><td colspan="6" class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">${c?"No data available for this Gameweek":"ยังไม่มีข้อมูลในสัปดาห์นี้"}</td></tr>`;else if(p){let K="";const B=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2),Y=!!(t&&(t.picks_synced||this.hasTier2PicksForGw(this.data,this.selectedGW)||x&&x.some(O=>O.captain&&O.captain!=="-")));B&&g&&!l&&!Y&&(K+=`
              <tr class="bg-amber-50/70 dark:bg-amber-950/25 border-b border-amber-200/70 dark:border-amber-800/40">
                <td colspan="6" class="px-3 py-2 text-center">
                  <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 dark:text-amber-300 leading-snug">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                    <span>${c?"Syncing post-deadline captains & hits — tap any team to view lineup & update row":"กำลังซิงก์ข้อมูลกัปตันและแต้มลบหลังเดดไลน์ — แตะชื่อทีมเพื่อดูผังและอัปเดตแถวนั้นทันที"}</span>
                  </span>
                </td>
              </tr>
            `);const X={};let M=200;if(this.config.features&&this.config.features.has_weekly_penalties){this.calculateWeeklyPenalties(Q,this.selectedGW).forEach(de=>{X[de.entry_id]=de});const ae=this.calculateWeeklyTierPrizes(Q,[this.config.features.weekly_prize_amount||200],this.selectedGW);ae&&ae.length>0&&(M=ae[0].prize)}const V=x.length>100;this.matchdayChunkLimit=this.matchdayChunkLimit||40;let Z=x;if(s?Z=x.filter(O=>(O.team_name||"").toLowerCase().includes(s)||(O.player_name||"").toLowerCase().includes(s)):V&&(Z=x.slice(0,this.matchdayChunkLimit)),Z.forEach((O,ae)=>{const de=O.chip?`<span class="chip-badge badge-${O.chip.toLowerCase()} font-display">${O.chip.toUpperCase()}</span>`:"",oe=O.hits>0?`<span class="text-rose-600 dark:text-rose-400 font-bold font-display">-${O.hits}</span>`:'<span class="text-slate-500 dark:text-slate-400 font-medium">-</span>',ue=this.isPrizeEligible(O.entry_id),_e=this.getPrizeBadge(O.entry_id),ce=g&&ue&&P.some(he=>he.entry_id===O.entry_id),J=g?O.rank:O.preRank;let ee="";if(!ue)ee=this.getNonPrizeRankBadge();else if(g){const he=O.rank===1&&P.length>1?"T1":O.rank;ee=this.getRankBadge(O.rank,he)}else ee=this.getRankBadge(J,J);const re=this.getLeagueCurrency();let le="";this.config.features&&this.config.features.has_weekly_penalties&&ue&&g&&(O.rank===1&&M>0?le=`<span class="text-[10.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400 ml-1 tabular-nums">+${M} ${re.code}</span>`:X[O.entry_id]&&(le=`<span class="text-[10.5px] font-mono font-bold text-rose-600 dark:text-rose-400 ml-1 tabular-nums">-${X[O.entry_id].fine.toLocaleString()} ${re.code}</span>`));let ie="";if(g&&!l){const he=`${O.entry_id}_${this.selectedGW}`,fe=this.data.squads&&this.data.squads[he]||null;if(fe&&fe.starting){const me=O.chip&&(O.chip.toLowerCase()==="bboost"||O.chip.toLowerCase()==="bench_boost"),we=me?15:11,ve=(me?fe.starting.concat(fe.bench||[]):fe.starting).filter(ge=>!!ge.not_played_yet).length,Le=Math.max(0,we-ve);ie=`<div class="text-[10px] sm:text-[10.5px] font-medium text-slate-500 dark:text-slate-400 font-display tabular-nums whitespace-nowrap" title="${c?`Played ${Le} of ${we} players`:`ลงเตะแล้ว ${Le} จาก ${we} คน`}">${Le}/${we}</div>`}}const pe=this.isTeamDeparted(O.entry_id),ke=pe?this.getDepartedBadge(O.entry_id,!0):"",ye=!!(!j&&R&&Number(O.entry_id)===Number(R)),te=ye?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-600 text-white font-display">${c?"ME":"ทีมฉัน"}</span>`:"",ne=j?"":R?ye?"":`<button type="button" onclick="event.stopPropagation(); app.openRivalModal(${Number(R)}, ${Number(O.entry_id)})" class="inline-flex items-center px-1.5 py-0.5 min-h-[24px] rounded text-[10px] font-bold text-slate-500 bg-slate-100/80 hover:bg-slate-900 hover:text-white dark:text-slate-400 dark:bg-slate-800/80 dark:hover:bg-blue-600 dark:hover:text-white transition-colors cursor-pointer flex-shrink-0" title="${c?"Compare 1v1":"เทียบ 1v1"}" aria-label="${c?"Compare 1v1":"เทียบ 1v1"}">VS</button>`:`<button type="button" onclick="event.stopPropagation(); app.setMyTeamId(${Number(O.entry_id)})" class="inline-flex items-center px-1.5 py-0.5 min-h-[24px] rounded text-[10px] font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50/90 dark:text-slate-500 dark:hover:text-blue-400 dark:hover:bg-blue-950/60 transition-colors cursor-pointer flex-shrink-0" title="${c?"Pin My Team":"ปักหมุดทีมฉัน"}" aria-label="${c?"Pin my team":"ปักหมุดทีมฉัน"}">${c?"Pin":"ปักหมุด"}</button>`;K+=`
              <tr tabindex="0" role="button" data-team-name="${this.escapeHtml(O.team_name)}" data-manager-name="${this.escapeHtml(O.player_name)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.openTeamModal(${O.entry_id});}" onclick="app.openTeamModal(${O.entry_id})" class="group cursor-pointer transition-colors ${ce?"font-semibold":""} ${pe?"opacity-70":""} ${ye?"bg-blue-50/60 dark:bg-blue-950/25 border-l-2 border-l-blue-500":""}">
                <td class="py-2.5 pl-3.5 sm:pl-3 pr-1 sm:pr-2 text-center font-display font-bold text-xs sm:text-sm">${ee}</td>
                <td class="py-2.5 px-2 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors max-w-[150px] xs:max-w-[200px] sm:max-w-none truncate block">
                      ${this.escapeHtml(O.team_name)}
                    </span>
                    ${te}
                    ${de}
                    ${_e}
                    ${ke}
                    ${le}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="truncate">${this.escapeHtml(O.player_name)}</span>
                      ${ne}
                    </div>
                    <div class="sm:hidden text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5 truncate">
                      <span class="inline-flex items-center px-1 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 mr-0.5">(C)</span> ${this.escapeHtml((O.captain||"-").replace(/\s*\(C\)/gi,"").trim())}
                    </div>
                  </div>
                </td>
                <td class="py-2.5 px-2 sm:px-3 text-center hidden sm:table-cell">
                  <span class="text-xs text-slate-600 dark:text-slate-300 font-medium">${O.captain&&O.captain!=="-"?`<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 mr-1">(C)</span>${this.escapeHtml(O.captain.replace(/\s*\(C\)/gi,"").trim())}`:"-"}</span>
                </td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display font-semibold tabular-nums whitespace-nowrap text-xs sm:text-sm ${g?"text-emerald-700 dark:text-emerald-400":"text-slate-600 dark:text-slate-300"}">
                  <div>${O.points}</div>
                  ${ie}
                </td>
                <td class="py-2.5 px-1 sm:px-2 text-center tabular-nums whitespace-nowrap text-xs sm:text-sm">${oe}</td>
                <td class="py-2.5 pl-1.5 sm:pl-2 pr-3.5 sm:pr-3 text-right font-display font-black tabular-nums whitespace-nowrap text-[13px] sm:text-sm text-slate-900 dark:text-white">${O.net_points}</td>
              </tr>
            `}),!s&&V&&this.matchdayChunkLimit<x.length){const O=Math.min(this.matchdayChunkLimit,x.length);K+=`
              <tr class="chunk-control-row">
                <td colspan="6" class="py-3 px-4 text-center bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
                  <div class="flex items-center justify-center gap-2.5 flex-wrap text-xs">
                    <span class="text-slate-500 dark:text-slate-400 font-medium font-mono">${c?`Showing 1 - ${O} of ${x.length.toLocaleString()} teams`:`แสดง 1 - ${O} จากทั้งหมด ${x.length.toLocaleString()} ทีม`}</span>
                    <button onclick="app.showMoreMatchdayTeams(100)" class="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-2xs">
                      ${c?"Load +100 More":"โหลดเพิ่มอีก 100 ทีม (+100)"}
                    </button>
                    <button onclick="app.showMoreMatchdayTeams('all')" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                      ${c?`Show All ${x.length.toLocaleString()}`:`แสดงทั้งหมด ${x.length.toLocaleString()} ทีม`}
                    </button>
                  </div>
                </td>
              </tr>
            `}p.innerHTML=K}if(i){let K="";const B=A.length>100;this.overallChunkLimit=this.overallChunkLimit||40;let Y=A;if(s?Y=A.filter(X=>(X.team_name||"").toLowerCase().includes(s)||(X.player_name||"").toLowerCase().includes(s)):B&&(Y=A.slice(0,this.overallChunkLimit)),Y.forEach(X=>{const M=this.isPrizeEligible(X.entry_id),V=this.isTeamDeparted(X.entry_id),Z=this.getPrizeBadge(X.entry_id),O=V?this.getDepartedBadge(X.entry_id):"",ae=!!(!j&&R&&Number(X.entry_id)===Number(R)),de=ae?`<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-600 text-white font-display">${c?"ME":"ทีมฉัน"}</span>`:"",oe=!j&&R&&!ae?`<button type="button" onclick="event.stopPropagation(); app.openRivalModal(${Number(R)}, ${Number(X.entry_id)})" class="inline-flex items-center px-1.5 py-0.5 min-h-[24px] rounded text-[10px] font-bold text-slate-500 bg-slate-100/80 hover:bg-slate-900 hover:text-white dark:text-slate-400 dark:bg-slate-800/80 dark:hover:bg-blue-600 dark:hover:text-white transition-colors cursor-pointer flex-shrink-0" title="${c?"Compare 1v1":"เทียบ 1v1"}" aria-label="${c?"Compare 1v1":"เทียบ 1v1"}">VS</button>`:"";let ue="";M?V?ue=this.getDepartedRankBadge():ue=this.getRankBadge(X.overall_rank):ue=this.getNonPrizeRankBadge();let _e="";if(q>1&&M&&!V&&X.overall_rank!==null&&X.prev_rank!==null&&X.prev_rank!==void 0){const re=X.prev_rank-X.overall_rank;re>0?_e=`<span class="inline-flex items-center text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400 font-display" title="${c?`Up ${re} ranks`:`ขึ้น ${re} อันดับ`}">▲${re}</span>`:re<0?_e=`<span class="inline-flex items-center text-[9.5px] font-extrabold text-rose-600 dark:text-rose-400 font-display" title="${c?`Down ${Math.abs(re)} ranks`:`ลง ${Math.abs(re)} อันดับ`}">▼${Math.abs(re)}</span>`:_e=`<span class="inline-flex items-center text-[9.5px] font-semibold text-slate-400 font-display" title="${c?"Unchanged":"อันดับคงที่"}">—</span>`}const ce=X.last_gw_raw!==void 0?X.last_gw_raw:X.last_gw_pts,J=X.last_gw_hits>0?`<span class="text-[10px] sm:text-[11px] font-bold text-rose-500 dark:text-rose-400 font-display ml-0.5">(-${X.last_gw_hits})</span>`:"",ee=X.total_hits>0?`<span class="font-bold text-rose-500 dark:text-rose-400 font-display">-${X.total_hits}</span>`:'<span class="text-slate-400 dark:text-slate-500 font-medium font-display">-</span>';K+=`
              <tr tabindex="0" role="button" data-team-name="${this.escapeHtml(X.team_name)}" data-manager-name="${this.escapeHtml(X.player_name)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.openTeamModal(${X.entry_id});}" onclick="app.openTeamModal(${X.entry_id})" class="group cursor-pointer transition-colors ${V?"opacity-70":""} ${ae?"bg-blue-50/60 dark:bg-blue-950/25 border-l-2 border-l-blue-500":""}">
                <td class="py-2.5 pl-3.5 sm:pl-3 pr-1 sm:pr-2 text-center font-display font-bold text-xs sm:text-sm">
                  <div class="flex flex-col items-center justify-center">
                    ${ue}
                    ${_e?`<span class="mt-0.5 leading-none">${_e}</span>`:""}
                  </div>
                </td>
                <td class="py-2.5 px-2 sm:px-3 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors block truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
                      ${this.escapeHtml(X.team_name)}
                    </span>
                    ${de}
                    ${Z}
                    ${O}
                  </div>
                  <div class="flex items-center gap-1.5 min-w-0 mt-0.5">
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(X.player_name)}</span>
                    ${oe}
                  </div>
                </td>
                <td class="py-2.5 px-1 sm:px-3 text-center font-display text-xs sm:text-sm text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap"><span class="font-semibold">${ce}</span>${J}</td>
                <td class="py-2.5 px-1 sm:px-2 text-center font-display text-xs sm:text-sm tabular-nums whitespace-nowrap">${ee}</td>
                <td class="py-2.5 pl-1.5 sm:pl-2 pr-3.5 sm:pr-3 text-right font-display font-black tabular-nums text-[13px] sm:text-sm text-slate-900 dark:text-white">${X.total_points}</td>
              </tr>
            `}),!s&&B&&this.overallChunkLimit<A.length){const X=Math.min(this.overallChunkLimit,A.length);K+=`
              <tr class="chunk-control-row">
                <td colspan="5" class="py-3 px-4 text-center bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
                  <div class="flex items-center justify-center gap-2.5 flex-wrap text-xs">
                    <span class="text-slate-500 dark:text-slate-400 font-medium font-mono">${c?`Showing 1 - ${X} of ${A.length.toLocaleString()} teams`:`แสดง 1 - ${X} จากทั้งหมด ${A.length.toLocaleString()} ทีม`}</span>
                    <button onclick="app.showMoreOverallTeams(100)" class="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs">
                      ${c?"Load +100 More":"โหลดเพิ่มอีก 100 ทีม (+100)"}
                    </button>
                    <button onclick="app.showMoreOverallTeams('all')" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                      ${c?`Show All ${A.length.toLocaleString()}`:`แสดงทั้งหมด ${A.length.toLocaleString()} ทีม`}
                    </button>
                  </div>
                </td>
              </tr>
            `}i.innerHTML=K||`<tr><td colspan="5" class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">${c?"No data available for this Gameweek":"ยังไม่มีข้อมูลในสัปดาห์นี้"}</td></tr>`}const G=this.data&&this.data.teams?this.data.teams.length:0;if(G<=100)this.filterLiveTables();else{const K=document.getElementById("live-search-count");if(K)if(s){const Y=(x.length>0?x:(this.data&&this.data.teams||[]).map(X=>({team_name:X.entry_name,player_name:X.player_name}))).filter(X=>(X.team_name||"").toLowerCase().includes(s)||(X.player_name||"").toLowerCase().includes(s)).length;K.textContent=c?`Found ${Y} of ${G.toLocaleString()} teams`:`พบ ${Y} จาก ${G.toLocaleString()} ทีม`,K.classList.remove("hidden")}else K.textContent="",K.classList.add("hidden")}}getChipCode(e){if(!e)return"";const t=String(e).toLowerCase();return t==="wildcard"?"WC":t==="bboost"?"BB":t==="3xc"?"TC":t==="freehit"?"FH":e.toUpperCase()}getChipName(e){if(!e)return"-";const t=String(e).toLowerCase();return t==="wildcard"?"Wildcard":t==="bboost"?"Bench Boost":t==="3xc"?"Triple Captain":t==="freehit"?"Free Hit":e.toUpperCase()}getTeamPlayerScores(e,t){if(!this.data||!this.data.squads)return[];const a=`${e}_${t}`,r=this.data.squads[a];if(!r||!r.starting)return[];const p=n=>{if(n.raw_points!==void 0&&n.raw_points!==null)return Number(n.raw_points)||0;const c=Number(n.multiplier)||(n.is_captain?2:1),m=Number(n.points)||0;return c>1?Math.round(m/c):m},i=r.starting.map(p);return["bboost","bench_boost"].includes(String(r.chip||"").toLowerCase())&&r.bench&&i.push(...r.bench.map(p)),i.sort((n,c)=>c-n)}compareTeamPlayerScores(e,t,a){const r=this.getTeamPlayerScores(e,a),p=this.getTeamPlayerScores(t,a);if(r.length===0||p.length===0)return 0;const i=Math.min(11,Math.max(r.length,p.length));for(let d=0;d<i;d++){const n=r[d]!==void 0?r[d]:-1/0,c=p[d]!==void 0?p[d]:-1/0;if(n!==c)return c-n}return 0}getTieBreakerExplanation(e,t,a,r=!1){const p=this.currentLang==="en",i=this.getTeamPlayerScores(e,a),d=this.getTeamPlayerScores(t,a);if(i.length===0||d.length===0)return null;const n=Math.min(11,Math.max(i.length,d.length));for(let c=0;c<n;c++){const m=i[c]!==void 0?i[c]:-1/0,s=d[c]!==void 0?d[c]:-1/0;if(m!==s)return r?p?`Lost tie-breaker by ${c===0?"highest scoring player":`player #${c+1} score`} (${s} vs ${m} pts)`:`แพ้ Tie-breaker ${c===0?"ตัวทำคะแนนสูงสุด":`ตัวทำคะแนนอันดับ ${c+1}`} (${s} vs ${m} pts)`:p?`Won tie-breaker by ${c===0?"Highest scoring player":`Player #${c+1} score`} (${m} vs ${s} pts)`:`ชนะ Tie-breaker ${c===0?"ตัวทำคะแนนสูงสุด":`ตัวทำคะแนนอันดับ ${c+1}`} (${m} vs ${s} pts)`}return null}getWeeklyTierPrizes(){return this.config&&this.config.features&&this.config.features.weekly_prizes?Object.values(this.config.features.weekly_prizes).map(Number):this.config&&this.config.features&&this.config.features.weekly_prize_amount?[Number(this.config.features.weekly_prize_amount)]:[300]}calculateWeeklyTierPrizes(e,t,a=null){(!t||t.length===0)&&(t=this.getWeeklyTierPrizes());const r=a||this.selectedGW,p=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),i=[...e].sort((m,s)=>{const o=m.net_points!==void 0?m.net_points:m.points,l=s.net_points!==void 0?s.net_points:s.points;return l!==o?l-o:p?this.compareTeamPlayerScores(m.entry_id,s.entry_id,r):0}),d=[];let n=0;const c=[];i.forEach(m=>{const s=m.net_points!==void 0?m.net_points:m.points,o=c[c.length-1];let l=!1;if(o&&o.score===s)if(p){const g=o.teams[0];this.compareTeamPlayerScores(m.entry_id,g.entry_id,r)===0&&(l=!0)}else l=!0;l?o.teams.push(m):c.push({score:s,teams:[m]})});for(const m of c){if(n>=t.length)break;const s=m.teams.length;let o=0;const l=n,g=Math.min(n+s,t.length);for(let v=l;v<g;v++)o+=t[v];const y=o>0?Math.floor(o/s):0,D=o>0?o%s:0,h=l+1,$=s>1;m.teams.forEach((v,I)=>{const L=y+(I<D?1:0);if(L>0){let k=null;if(p){const x=v.net_points!==void 0?v.net_points:v.points,C=i.filter(T=>(T.net_points!==void 0?T.net_points:T.points)===x);if(C.length>1){const T=C.find(H=>H.entry_id!==v.entry_id&&this.compareTeamPlayerScores(v.entry_id,H.entry_id,r)<0);T&&(k=this.getTieBreakerExplanation(v.entry_id,T.entry_id,r))}}d.push({entry_id:v.entry_id,team_name:v.team_name,player_name:v.player_name,rank:h,prize:L,isJoint:$,jointCount:s,net_points:v.net_points,hits:v.hits||0,points:v.points,tieBreakNote:k})}}),n+=s}return d}calculateWeeklyPenalties(e,t=null){if(!e||e.length===0)return[];const a=t||this.selectedGW,r=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),p=[...e].sort((o,l)=>{const g=o.net_points!==void 0?o.net_points:o.points,y=l.net_points!==void 0?l.net_points:l.points;return g!==y?g-y:r?-this.compareTeamPlayerScores(o.entry_id,l.entry_id,a):0}),i=this.getWeeklyPenaltyTiers(),d=this.currentLang==="en",n=i.map((o,l)=>{if(l===0)return d?"💀 Last Place":"💀 บ๊วย";if(l===1)return d?"⚠️ 2nd from Bottom":"⚠️ รองบ๊วย";if(d){const g=l+1;return`⚠️ ${g}${g===3?"rd":"th"} from Bottom`}return`⚠️ ท้าย ${l+1}`}),c=[];p.forEach(o=>{const l=o.net_points!==void 0?o.net_points:o.points,g=c[c.length-1];let y=!1;if(g&&g.score===l)if(r){const D=g.teams[0];this.compareTeamPlayerScores(o.entry_id,D.entry_id,a)===0&&(y=!0)}else y=!0;y?g.teams.push(o):c.push({score:l,teams:[o]})});const m=[];let s=0;for(const o of c){if(s>=i.length)break;const l=o.teams.length;let g=0;const y=s,D=Math.min(s+l,i.length);for(let k=y;k<D;k++)g+=i[k];const h=g>0?Math.floor(g/l):0,$=g>0?g%l:0,v=l>1,I=n[y]||(d?`⚠️ Bottom ${y+1}`:`⚠️ ท้าย ${y+1}`),L=v?d?`${I} (Tie)`:`${I}ร่วม`:I;o.teams.forEach((k,x)=>{const C=h+(x<$?1:0);if(C>0){let T=null;if(r){const H=k.net_points!==void 0?k.net_points:k.points,z=p.filter(U=>(U.net_points!==void 0?U.net_points:U.points)===H);if(z.length>1){const U=z.find(Q=>Q.entry_id!==k.entry_id&&this.compareTeamPlayerScores(Q.entry_id,k.entry_id,a)<0);U&&(T=this.getTieBreakerExplanation(U.entry_id,k.entry_id,a,!0))}}m.push({entry_id:k.entry_id,team_name:k.team_name,player_name:k.player_name,net_points:k.net_points!==void 0?k.net_points:k.points,fine:C,rankLabel:L,bottomTierIndex:y,isJoint:v,jointCount:l,tieBreakNote:T})}}),s+=l}return m}isPrizeEligible(e){if(!this.config||!this.config.non_prize_teams)return!0;const t=Number(e);return!this.config.non_prize_teams.some(a=>Number(a)===t)}getPrizeBadge(e){if(this.isPrizeEligible(e))return"";const t=this.currentLang==="en";return`<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ml-1.5" title="${t?"This team is participating for fun (not eligible for cash prizes)":"ทีมนี้เข้าร่วมเล่นสนุก ไม่ได้ลงชิงเงินรางวัล"}">${t?"Non-Prize":"ร่วมสนุก"}</span>`}getNonPrizeRankBadge(){return`<span class="w-5 h-5 inline-flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xs flex-shrink-0" title="${this.currentLang==="en"?"Non-prize participant (no official rank)":"ทีมร่วมสนุก (ไม่นับอันดับ)"}">-</span>`}getDepartedMeta(e,t=this.data){if(!t||!t.departed_teams||typeof t.departed_teams!="object")return null;const a=String(e);return t.departed_teams[a]||null}isTeamDeparted(e,t=this.data){return!!this.getDepartedMeta(e,t)}isDepartedNonPrize(e,t=this.data){return this.isTeamDeparted(e,t)&&!this.isPrizeEligible(e)}isActivePrizeEligible(e,t=this.data){return this.isPrizeEligible(e)&&!this.isTeamDeparted(e,t)}getDepartedBadge(e,t=!1,a=this.data){const r=this.getDepartedMeta(e,a);if(!r)return"";const p=this.currentLang==="en",i=Number(r.last_gw||0),d=t?p?"Left":"ออกจากลีก":i>0?p?`Left (GW ${i})`:`ออกจากลีก (GW ${i})`:p?"Left League":"ออกจากลีก";return`<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700/80 ml-1" title="${i>0?p?`Left league after Gameweek ${i} (historical stats preserved)`:`ออกจากลีกหลังจบ GW ${i} (เก็บสถิติย้อนหลังครบ)`:p?"Left league mid-season (historical stats preserved)":"ออกจากลีกกลางฤดูกาล (เก็บสถิติย้อนหลังครบ)"}">${d}</span>`}getDepartedRankBadge(){return`<span class="w-5 h-5 inline-flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xs flex-shrink-0" title="${this.currentLang==="en"?"Left league mid-season (unranked)":"ออกจากลีกกลางฤดูกาล (ไม่นับอันดับ)"}">—</span>`}getRankBadge(e,t=null){const a=Number(e);return a===1?`<span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center text-[10px] border border-amber-300 dark:border-amber-300/80 shadow-xs flex-shrink-0">${t!==null?t:"1"}</span>`:a===2?`<span class="w-5 h-5 rounded-full bg-slate-200 text-slate-950 font-black inline-flex items-center justify-center text-[10px] border border-slate-300 dark:bg-slate-200 dark:text-slate-950 dark:border-slate-100 shadow-xs flex-shrink-0">${t!==null?t:"2"}</span>`:a===3?`<span class="w-5 h-5 rounded-full bg-amber-700 text-white dark:bg-amber-800 dark:text-white font-black inline-flex items-center justify-center text-[10px] border border-amber-800 dark:border-amber-600 shadow-xs flex-shrink-0">${t!==null?t:"3"}</span>`:`<span class="text-slate-500 dark:text-slate-400 font-bold font-display">${t!==null?t:e||"-"}</span>`}renderHighlightsView(){const e=String(this.selectedGW),t=this.data.gameweeks?this.data.gameweeks[e]:null,a=document.getElementById("highlights-overview-title"),r=document.getElementById("highlights-status-badge"),p=document.getElementById("highlights-cards-grid"),i=this.currentLang==="en";a&&(a.innerText=i?"Weekly Highlights":"ไฮไลท์ประจำสัปดาห์");const d=Number(this.multiData&&this.multiData.max_gw)||2,n=document.getElementById("highlights-gw-select"),c=document.getElementById("hl-prev-gw-btn"),m=document.getElementById("hl-next-gw-btn"),s=document.getElementById("hl-prev-label"),o=document.getElementById("hl-next-label");if(n){let se="";for(let xe=1;xe<=d;xe++)se+=`<option value="${xe}" ${xe===this.selectedGW?"selected":""}>${i?`Gameweek ${xe}`:`สัปดาห์ที่ ${xe}`}</option>`;n.innerHTML=se}if(c&&(c.disabled=this.selectedGW<=1,c.setAttribute("aria-label",i?"Previous Gameweek":"สัปดาห์ก่อนหน้า"),c.title=i?"Previous Gameweek":"สัปดาห์ก่อนหน้า"),m&&(m.disabled=this.selectedGW>=d,m.setAttribute("aria-label",i?"Next Gameweek":"สัปดาห์ถัดไป"),m.title=i?"Next Gameweek":"สัปดาห์ถัดไป"),n&&n.setAttribute("aria-label",i?"Select Gameweek":"เลือกสัปดาห์การแข่งขัน"),s&&(s.innerText=i?"Prev":"ก่อนหน้า"),o&&(o.innerText=i?"Next":"ถัดไป"),this.updateHighlightsTabBlink(),!p)return;if(this.data.tier===2||this.config&&this.config.tier===2){r&&(r.innerHTML=""),p.innerHTML=`
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs max-w-xl mx-auto my-8">
              <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold font-display">
                ⭐
              </div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                ${i?"Tier 2 League: Standings & Leaderboard Only":"มินิลีกระดับ Tier 2: โหมดแสดงตารางคะแนน"}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                ${i?"Weekly highlights, squad awards, and tactical badges are optimized for Tier 1 leagues. For Tier 2 leagues, please refer to the Standings table.":"ไฮไลท์ประจำสัปดาห์ รางวัลผู้จัดการทีม และสถิติแท็กติกเปิดให้ใช้งานสำหรับลีกระดับ Tier 1 สำหรับลีก Tier 2 สามารถติดตามคะแนนสดและอันดับได้ที่ตารางคะแนน"}
              </p>
              <button onclick="app.switchTab('gameweek-view')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-display shadow-2xs transition-colors cursor-pointer">
                ${i?"View Standings & Live Points":"กลับไปดูตารางคะแนน & แต้มสด"}
              </button>
            </div>
          `;return}if(!t||!t.results||t.results.length===0){r&&(r.innerHTML=""),p.innerHTML=`<div class="py-12 text-center text-slate-500 dark:text-slate-400 font-medium font-display glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800">${i?"No data available for this Gameweek":"ยังไม่มีข้อมูลการแข่งขันในสัปดาห์นี้"}</div>`;return}const l=!!t.is_finished,g=t.is_started!==void 0?!!t.is_started:l||t.results&&t.results.some(se=>se.points>0);if(r&&(g?l?r.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-display"><svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${i?"OFFICIAL Finalized":"สรุปผลทางการ"}</span>`:r.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-display"><span class="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse"></span>${i?"LIVE In-Play":"กำลังแข่งขันสด"}</span>`:r.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-display"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>${i?"Upcoming":"ยังไม่เริ่ม"}</span>`),!g){p.innerHTML=`
            <div class="py-12 text-center text-slate-500 dark:text-slate-400 font-medium font-display glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <svg class="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div class="text-slate-800 dark:text-slate-100 font-bold text-base sm:text-lg font-display">${i?`Gameweek ${this.selectedGW} has not started yet`:`สัปดาห์ที่ ${this.selectedGW} ยังไม่เริ่มแข่งขัน`}</div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${i?"Weekly awards will update live as matches kick off":"การประกาศรางวัลประจำสัปดาห์จะอัปเดตสดเมื่อเริ่มการแข่งขัน"}</p>
            </div>
          `;return}const y=[...t.results],D=[...y].sort((se,xe)=>xe.net_points-se.net_points),h=y.reduce((se,xe)=>se+xe.net_points,0)/y.length,$=y.reduce((se,xe)=>se+xe.points,0)/y.length,v={star:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',trendingDown:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',layers:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',alertCircle:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>',wallet:'<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>'},I=se=>{if(!se.winner)return"";let xe="text-slate-800 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80";se.sentiment==="positive"?xe="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/20 dark:border-emerald-800/40":se.sentiment==="negative"&&(xe="text-rose-700 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/20 dark:border-rose-800/40");const Ie=!l&&se.isProvisional?`<span class="inline-flex items-center text-[9.5px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-display">${i?"Live":"สด"}</span>`:"";return`
            <div class="glass-card rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs group">
              
              <!-- Header: Subtle Icon, Title & Subtitle + Hero Stat -->
              <div class="flex items-start justify-between gap-3 min-w-0">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-8 h-8 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/70 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    ${se.icon}
                  </span>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display truncate">${se.title}</h4>
                      ${Ie}
                    </div>
                    <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 truncate">${se.subtitle}</p>
                  </div>
                </div>
                
                <!-- Hero Stat Pill on Top Right -->
                <div class="flex-shrink-0 text-right">
                  <span class="inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black font-display tabular-nums ${xe} border">
                    ${se.statText}
                  </span>
                </div>
              </div>

              <!-- Manager Block: Team Name (clickable) + Player Name + Prize Badge -->
              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button 
                      onclick="app.openTeamModal(${se.winner.entry_id})" 
                      class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left truncate group-hover:underline"
                      aria-label="${i?`View squad of ${this.escapeHtml(se.winner.team_name)}`:`ดูแผนทีม ${this.escapeHtml(se.winner.team_name)}`}"
                    >
                      ${this.escapeHtml(se.winner.team_name)}
                    </button>
                    ${this.getPrizeBadge(se.winner.entry_id)}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                    ${this.escapeHtml(se.winner.player_name)}
                  </div>
                </div>
              </div>

              <!-- Detail Container: Flat Metadata Shelf (No nested card box, clean hairline separator) -->
              ${se.detailHtml?`
                <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  ${se.detailHtml}
                </div>
              `:""}

            </div>
          `},L=se=>!se||se.length===0?"":se.map(xe=>{const Ie=Number(xe.in_pts)||0,Se=Number(xe.out_pts)||0,Me=Ie>0?"+":"",Ae=i?"In":"เข้า",Ve=i?"Out":"ออก";return`<span class="inline-flex items-center gap-1.5 flex-wrap"><span class="font-medium text-slate-500 dark:text-slate-400">${Ae}:</span> <span class="font-bold text-slate-900 dark:text-slate-100">${this.escapeHtml(xe.in)} <span class="tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">(${Me}${Ie})</span></span> <span class="text-slate-300 dark:text-slate-600">/</span> <span class="font-medium text-slate-500 dark:text-slate-400">${Ve}:</span> <span class="text-slate-700 dark:text-slate-300">${this.escapeHtml(xe.out)} <span class="tabular-nums text-slate-400 dark:text-slate-500">(${Se})</span></span></span>`}).join('<span class="mx-2 text-slate-300 dark:text-slate-700">•</span>'),k=se=>{if(!se)return"";const xe=se.captain?`${i?"Captain: ":"กัปตัน: "}<strong>${this.escapeHtml(se.captain)}</strong>`:"",Ie=se.hits>0?i?` • Hits: -${se.hits} pts`:` • แต้มลบย้ายตัว: -${se.hits} แต้ม`:"";return`
            <div class="glass-card rounded-2xl p-4.5 sm:p-5.5 border border-amber-400/40 dark:border-amber-500/30 bg-white/80 dark:bg-slate-900/60 shadow-xs relative overflow-hidden ring-1 ring-amber-400/20 dark:ring-amber-500/20">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      ${i?"TOP GUN • WEEKLY SPOTLIGHT":"แชมป์คะแนนสูงสุดประจำสัปดาห์"}
                    </span>
                    ${l?`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-display"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${i?"Weekly Winner":"ผู้ชนะประจำสัปดาห์"}</span>`:`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-display"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>${i?"Live Leader":"ผู้นำคะแนนสด"}</span>`}
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <button 
                      onclick="app.openTeamModal(${se.entry_id})" 
                      class="text-base sm:text-xl font-bold font-display text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left truncate"
                      aria-label="${this.escapeHtml(i?`View squad of ${se.team_name}`:`ดูแผนทีม ${se.team_name}`)}"
                    >
                      ${this.escapeHtml(se.team_name)}
                    </button>
                    ${this.getPrizeBadge(se.entry_id)}
                  </div>

                  <div class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    ${this.escapeHtml(se.player_name)}
                  </div>

                  ${xe||Ie?`
                    <div class="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      ${xe}${Ie}
                    </div>
                  `:""}
                </div>

                <div class="flex-shrink-0 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/80 dark:border-slate-800 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-1">
                  <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    ${i?"Gameweek Score":"คะแนนสัปดาห์นี้"}
                  </span>
                  <div class="text-3xl sm:text-4xl font-black font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${se.points} <span class="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 font-sans">${i?"pts":"แต้ม"}</span>
                  </div>
                </div>

              </div>
            </div>
          `},x=(se,xe,Ie)=>{const Se=Ie.filter(Boolean);return Se.length===0?"":`
            <div class="space-y-3">
              <div class="flex items-baseline justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
                    ${se}
                  </h3>
                </div>
                ${xe?`<span class="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500 font-medium">${xe}</span>`:""}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                ${Se.join("")}
              </div>
            </div>
          `},C=[...y].sort((se,xe)=>xe.points-se.points||xe.net_points-se.net_points),T=C[0],H=C[C.length-1],z=C.length>1&&H&&T&&H.points<T.points?H:null,U=I({icon:v.trendingDown,title:i?"Tough Week":"ฟอร์มสะดุด",subtitle:i?"Lowest Gameweek score":"คะแนนต่ำสุดประจำสัปดาห์",sentiment:"negative",winner:z,statText:z?`${z.points} ${i?"pts":"แต้ม"}`:"",detailHtml:z?`${z.hits>0?i?`Hits: -${z.hits} pts`:`แต้มลบย้ายตัว: -${z.hits} แต้ม`:i?"Official Score":"คะแนนตามสรุปผลทางการ"}`:null});let Q=null,W="",P="",u=null,N="",w="";if(this.selectedGW>1){const se={},xe={};(this.data.teams||[]).forEach($e=>{se[$e.entry_id]=0,xe[$e.entry_id]=0});for(let $e=1;$e<=this.selectedGW;$e++){const Be=this.data.gameweeks?this.data.gameweeks[String($e)]:null;Be&&Be.results&&Be.results.forEach(Fe=>{$e<this.selectedGW&&(se[Fe.entry_id]=(se[Fe.entry_id]||0)+(Fe.net_points||0)),xe[Fe.entry_id]=(xe[Fe.entry_id]||0)+(Fe.net_points||0)})}const Ie={};(this.data.teams||[]).forEach(($e,Be)=>{Ie[$e.entry_id]=Be});const Se=Object.keys(se).map($e=>({entry_id:Number($e),pts:se[$e]})).sort(($e,Be)=>Be.pts-$e.pts||(Ie[$e.entry_id]??999)-(Ie[Be.entry_id]??999)),Me=Object.keys(xe).map($e=>({entry_id:Number($e),pts:xe[$e]})).sort(($e,Be)=>Be.pts-$e.pts||(Ie[$e.entry_id]??999)-(Ie[Be.entry_id]??999)),Ae={};Se.forEach(($e,Be)=>Ae[$e.entry_id]=Be+1);const Ve={};Me.forEach(($e,Be)=>Ve[$e.entry_id]=Be+1);const Ye={};(this.data.teams||[]).forEach($e=>Ye[$e.entry_id]=$e);const Je=Number(this.multiData&&this.multiData.max_gw)||1;let Xe=[];t.data_checked&&this.selectedGW===Je&&this.data.teams&&this.data.teams.some($e=>$e.last_rank&&$e.rank)?Xe=y.map($e=>{const Be=Ye[$e.entry_id]||{},Fe=Be.last_rank!==void 0&&Be.last_rank!==null?Be.last_rank:y.length,Ze=Be.rank||y.length;return{result:$e,prevRank:Fe,currRank:Ze,diff:Fe-Ze}}):Xe=y.map($e=>{const Be=Ae[$e.entry_id]||y.length,Fe=Ve[$e.entry_id]||y.length;return{result:$e,prevRank:Be,currRank:Fe,diff:Be-Fe}});const Re=[...Xe].filter($e=>$e.diff>0).sort(($e,Be)=>Be.diff-$e.diff||Be.prevRank-$e.prevRank)[0];Re&&(Q=Re.result,W=`+${Re.diff} ${i?"ranks":"อันดับ"}`,P=i?`Rose from rank ${Re.prevRank} to rank ${Re.currRank}`:`ไต่จากอันดับ ${Re.prevRank} ขึ้นมาอันดับ ${Re.currRank} (+${Re.diff} ขั้น)`);const Oe=[...Xe].filter($e=>$e.diff<0).sort(($e,Be)=>$e.diff-Be.diff||Be.prevRank-$e.prevRank)[0];Oe&&(u=Oe.result,N=`${Oe.diff} ${i?"ranks":"อันดับ"}`,w=i?`Fell from rank ${Oe.prevRank} to rank ${Oe.currRank}`:`หล่นจากอันดับ ${Oe.prevRank} ลงไปอันดับ ${Oe.currRank} (${Oe.diff} ขั้น)`)}const b=I({icon:v.trendingUp,title:i?"Comeback Kid":"ไต่อันดับสูงสุด",subtitle:i?"Biggest rank rise":"ไต่อันดับขึ้นมามากที่สุด",sentiment:"positive",isProvisional:!0,winner:Q,statText:W,detailHtml:P}),_=I({icon:v.trendingDown,title:i?"Rank Crasher":"อันดับร่วงลงแรง",subtitle:i?"Biggest rank fall":"อันดับร่วงลงมามากที่สุด",sentiment:"negative",isProvisional:!0,winner:u,statText:N,detailHtml:w}),E=y.filter(se=>se.chip&&se.chip!=="-").sort((se,xe)=>xe.net_points-se.net_points)[0]||null,A=I({icon:v.zap,title:i?"Chip Master":"เซียนเปิดการ์ด",subtitle:E?i?`Best score with chip (${this.getChipCode(E.chip)})`:`คะแนนสูงสุดด้วยการ์ด (${this.getChipCode(E.chip)})`:i?"Best score with a chip":"คะแนนสูงสุดด้วยการ์ดชิป",sentiment:"positive",winner:E,statText:E?`${E.net_points} ${i?"pts":"แต้ม"}`:"",detailHtml:E?`${i?"Active Chip: ":"เปิดใช้ชิป: "}<strong>${this.getChipName(E.chip)}</strong>`:null}),q=y.filter(se=>!se.chip||se.chip==="-").sort((se,xe)=>xe.net_points-se.net_points)[0]||null,j=I({icon:v.shield,title:i?"No-Chip Warrior":"ไม่ง้อชิปการ์ด",subtitle:i?"Best score without playing a chip":"คะแนนสูงสุดโดยไม่ใช้ชิป",sentiment:"positive",winner:q,statText:q?`${q.net_points} ${i?"pts":"แต้ม"}`:"",detailHtml:q?i?"Played without an active chip":"ลงสนามสัปดาห์นี้โดยไม่เปิดใช้ชิปเสริม":null}),G=[...y].sort((se,xe)=>(xe.team_value||100)-(se.team_value||100)||(se.bank||0)-(xe.bank||0))[0]||null,K=I({icon:v.wallet,title:i?"Value King":"มูลค่าทีมสูงสุด",subtitle:i?"Highest team valuation":"มูลค่าขุมกำลังรวมสูงสุดในลีก",sentiment:"neutral",winner:G,statText:G?`£${G.team_value||100}m`:"",detailHtml:G?`${i?`Team Value: £${G.team_value||100}m`:`มูลค่าทีม: £${G.team_value||100}m`}${G.bank?i?` • In bank: £${G.bank}m`:` • เงินในธนาคาร: £${G.bank}m`:""}`:null}),Y=y.filter(se=>se.chip==="wildcard"&&se.points<$).sort((se,xe)=>se.points-xe.points)[0]||null,X=I({icon:v.alertCircle,title:i?"Wildcard Wasteland":"การ์ดยังไม่โดน",subtitle:i?"Wildcard played below average":"ใช้ Wildcard แต่แต้มต่ำกว่าเฉลี่ย",sentiment:"negative",winner:Y,statText:Y?`${Y.points} ${i?"pts":"แต้ม"}`:"",detailHtml:Y?i?`Played Wildcard: ${Y.points} pts (league avg ${$.toFixed(1)} pts)`:`เปิดใช้ Wildcard ได้ ${Y.points} แต้ม (ต่ำกว่าเฉลี่ยลีก ${$.toFixed(1)} แต้ม)`:null}),M=se=>["bboost","bench_boost"].includes(String(se||"").toLowerCase()),Z=y.filter(se=>!M(se.chip)&&(se.bench_points||0)>=20).sort((se,xe)=>(xe.bench_points||0)-(se.bench_points||0))[0]||null,O=I({icon:v.layers,title:i?"Bench Disaster":"ดองแต้มสำรอง",subtitle:i?"Left 20+ points on bench":"ทิ้งแต้มบนม้านั่งสำรอง 20+ แต้ม",sentiment:"negative",winner:Z,statText:Z?`${Z.bench_points} ${i?"pts":"แต้ม"}`:"",detailHtml:Z?i?`${Z.bench_points} points left on bench without Bench Boost`:`ทิ้งแต้มบนม้านั่งสำรอง ${Z.bench_points} แต้ม โดยไม่ได้เปิดใช้ Bench Boost`:null}),ae=y.filter(se=>{const xe=String(se.chip||"").toLowerCase().replace("_","");return xe!=="wildcard"&&xe!=="freehit"}),oe=ae.filter(se=>se.hits>0).sort((se,xe)=>xe.hits-se.hits)[0]||null,ue=I({icon:v.alertCircle,title:i?"YOLO Manager":"สายลบไม่ยั้ง",subtitle:i?"Most transfer hits taken":"เสียแต้มลบย้ายตัวมากที่สุด",sentiment:"negative",winner:oe,statText:oe?`-${oe.hits} ${i?"pts":"แต้ม"}`:"",detailHtml:oe?i?`Took -${oe.hits} pts in transfer penalties (${oe.hits/4} extra transfer${oe.hits/4>1?"s":""})`:`เสียแต้มลบย้ายตัว -${oe.hits} แต้ม (ย้ายตัวเพิ่ม ${oe.hits/4} ตัว)`:null}),ce=ae.filter(se=>(se.transfers_count||0)>0&&(se.transfers_net_impact||0)>0).sort((se,xe)=>xe.transfers_net_impact-se.transfers_net_impact)[0]||null;let J="",ee="";if(ce){const se=ce.hits>0?`-${ce.hits}`:"0",xe=i?`${se} hits`:`${se} แต้มลบ`,Ie=ce.transfers_pts_gain>=0?"+":"",Se=i?`${Ie}${ce.transfers_pts_gain} from moves`:`${Ie}${ce.transfers_pts_gain} จากตัวย้ายเข้า`;ee=`+${ce.transfers_net_impact} ${i?"net":"สุทธิ"}`,J=`
            ${L(ce.transfer_moves)}
            <div class="mt-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
              ${i?"Impact:":"ผลลัพธ์สุทธิ:"} +${ce.transfers_net_impact} (${Se}, ${xe})
            </div>
          `}const re=I({icon:v.refreshCw,title:i?"Sharpest Trader":"ดึงตัวเข้าเป้าสุดปัง",subtitle:i?"Best net transfer impact":"ย้ายตัวสุทธิดีที่สุดประจำสัปดาห์",sentiment:"positive",winner:ce,statText:ee,detailHtml:J}),ie=ae.filter(se=>(se.transfers_count||0)>0&&(se.transfers_net_impact||0)<0).sort((se,xe)=>se.transfers_net_impact-xe.transfers_net_impact)[0]||null;let pe="",ke="";if(ie){const se=ie.hits>0?`-${ie.hits}`:"0",xe=i?`${se} hits`:`${se} แต้มลบ`,Ie=ie.transfers_pts_gain>=0?"+":"",Se=i?`${Ie}${ie.transfers_pts_gain} from moves`:`${Ie}${ie.transfers_pts_gain} จากตัวย้ายเข้า`;ke=`${ie.transfers_net_impact} ${i?"net":"สุทธิ"}`,pe=`
            ${L(ie.transfer_moves)}
            <div class="mt-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
              ${i?"Impact:":"ผลลัพธ์สุทธิ:"} ${ie.transfers_net_impact} (${Se}, ${xe})
            </div>
          `}const ye=I({icon:v.alertCircle,title:i?"Transfer Tangle":"ดึงผิดชีวิตเปลี่ยน",subtitle:i?"Worst net transfer impact":"ย้ายตัวสุทธิแย่ที่สุดประจำสัปดาห์",sentiment:"negative",winner:ie,statText:ke,detailHtml:pe}),te=ae.filter(se=>se.hits>0),he=te.filter(se=>(se.transfers_net_impact||0)>0).sort((se,xe)=>xe.transfers_net_impact-se.transfers_net_impact)[0]||null;let fe="",me="";if(he){const se=he.transfers_pts_gain>=0?"+":"",xe=i?`${se}${he.transfers_pts_gain} from moves`:`${se}${he.transfers_pts_gain} จากตัวย้ายเข้า`,Ie=i?`-${he.hits} hits`:`-${he.hits} แต้มลบ`;me=`+${he.transfers_net_impact} ${i?"net":"สุทธิ"}`,fe=`
            ${L(he.transfer_moves)}
            <div class="mt-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
              ${i?"Impact:":"ผลลัพธ์สุทธิ:"} +${he.transfers_net_impact} (${xe}, ${Ie})
            </div>
          `}const we=I({icon:v.arrowUpRight,title:i?"Hit Hero":"ยอมลบแต่จบกำไร",subtitle:i?"Took a hit but profited overall":"เสียแต้มลบแต่แต้มสุทธิยังบวก",sentiment:"positive",winner:he,statText:me,detailHtml:fe}),ve=te.filter(se=>(se.transfers_net_impact||0)<0).sort((se,xe)=>se.transfers_net_impact-xe.transfers_net_impact)[0]||null;let Le="",Ee="";if(ve){const se=ve.transfers_pts_gain>=0?"+":"",xe=i?`${se}${ve.transfers_pts_gain} from moves`:`${se}${ve.transfers_pts_gain} จากตัวย้ายเข้า`,Ie=i?`-${ve.hits} hits`:`-${ve.hits} แต้มลบ`;Ee=`${ve.transfers_net_impact} ${i?"net":"สุทธิ"}`,Le=`
            ${L(ve.transfer_moves)}
            <div class="mt-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
              ${i?"Impact:":"ผลลัพธ์สุทธิ:"} ${ve.transfers_net_impact} (${xe}, ${Ie})
            </div>
          `}const ge=I({icon:v.alertCircle,title:i?"Painful Hit":"ยอมลบแต่จบเจ็บ",subtitle:i?"Took a hit and it didn't pay off":"ยอมเสียแต้มลบแล้วแต้มสุทธิติดลบ",sentiment:"negative",winner:ve,statText:Ee,detailHtml:Le}),Pe=ae.filter(se=>(se.transfers_count||0)===1&&(se.transfers_net_impact||0)>0).sort((se,xe)=>xe.transfers_net_impact-se.transfers_net_impact)[0]||null;let Te="",Ne="";Pe&&(Ne=`+${Pe.transfers_net_impact} ${i?"net":"สุทธิ"}`,Te=`
            ${L(Pe.transfer_moves)}
            <div class="mt-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
              ${i?"Single move net impact:":"ผลลัพธ์ย้าย 1 ตัวสุทธิ:"} +${Pe.transfers_net_impact} ${i?"pts":"แต้ม"}
            </div>
          `);const He=I({icon:v.refreshCw,title:i?"One-Move Master":"ย้ายตัวเดียวเสียวทั้งลีก",subtitle:i?"Single transfer with positive impact":"ย้ายตัวเดียวแล้วได้แต้มบวก",sentiment:"positive",winner:Pe,statText:Ne,detailHtml:Te});let De=we;he&&ce&&he.entry_id===ce.entry_id&&(De=null);let je=ge;ve&&ie&&ve.entry_id===ie.entry_id&&(je=null);let ze=He;Pe&&ce&&Pe.entry_id===ce.entry_id&&(ze=null);const Ge=k(T),qe=x(i?"Performance & Standings":"คะแนน & การขยับอันดับ",i?"Gameweek scores and rank shifts":"คะแนนประจำสัปดาห์และการเปลี่ยนอันดับ",[U,b,_]),Ue=x(i?"Tactics & Club Finances":"แท็กติก & มูลค่าทีม",i?"Chip usage, bench points and squad value":"การเปิดใช้การ์ดพิเศษ, แต้มม้านั่งสำรอง และมูลค่าทีม",[A,j,X,O,K]),Qe=x(i?"Transfers & Hits":"ตลาดนักเตะ & แต้มย้ายตัว",i?"Net transfer impact and penalty points":"ผลลัพธ์ย้ายตัวสุทธิและแต้มลบ",[re,ye,De,je,ze,ue]);p.innerHTML=[Ge,qe,Ue,Qe].filter(Boolean).join(""),this.updateHighlightsTabBlink()}getLeaderboardTeams(){const e=this.data;if(!e)return[];const t=e.teams||[],a=Number(this.multiData.max_gw)||1,r=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2),p={};if(t.forEach(m=>{p[m.entry_id]={...m,entry_id:m.entry_id,entry_name:m.entry_name,player_name:m.player_name,fpl_rank:Number(m.rank)||999,total_points:r&&Number(m.total_points)||0}}),!r)for(let m=1;m<=a;m++){const s=e.gameweeks?e.gameweeks[String(m)]:null;if(s&&s.results&&(s.is_started!==void 0?!!s.is_started:!!s.is_finished||s.results.some(l=>l.points>0))){const l=new Set;s.results.forEach(g=>{l.has(g.entry_id)||(l.add(g.entry_id),!this.isTeamDeparted(g.entry_id,e)&&(p[g.entry_id]||(p[g.entry_id]={entry_id:g.entry_id,entry_name:g.entry_name,player_name:g.player_name,fpl_rank:999,total_points:0}),p[g.entry_id].total_points+=g.net_points||0))})}}const i=Object.values(p).sort((m,s)=>{const o=this.isPrizeEligible(m.entry_id)?1:0,l=this.isPrizeEligible(s.entry_id)?1:0;return o!==l?l-o:r?(m.fpl_rank||999)-(s.fpl_rank||999)||s.total_points-m.total_points:s.total_points-m.total_points||(m.fpl_rank||999)-(s.fpl_rank||999)});let d=1,n=0,c=null;return i.forEach(m=>{if(!this.isPrizeEligible(m.entry_id)){m.leaderboard_rank=null;return}if(r){m.leaderboard_rank=Number(m.rank)||d;return}n++,c!==null&&m.total_points<c&&(d=n),c=m.total_points,m.leaderboard_rank=d}),i}setCompCardFilter(e){this.compCardFilter===e&&e!=="all"?this.compCardFilter="all":this.compCardFilter=e,this.updateCompCardFilterButtons(),this.renderCompetitionCardsTableOnly()}updateCompCardFilterButtons(){const e=this.compCardFilter||"all",t=this.currentLang==="en";["wc1","wc2","fh","tc","bb"].forEach(p=>{const i=document.getElementById(`comp-summary-card-${p}`);if(i){const d=p===e;i.setAttribute("aria-pressed",String(d)),d?(i.classList.remove("border-slate-200/90","dark:border-slate-800","bg-white","dark:bg-slate-900","hover:border-slate-400","dark:hover:border-slate-600"),i.classList.add("border-slate-900","dark:border-white","ring-2","ring-slate-900/15","dark:ring-white/20","bg-slate-50/90","dark:bg-slate-800/80","shadow-xs")):(i.classList.remove("border-slate-900","dark:border-white","ring-2","ring-slate-900/15","dark:ring-white/20","bg-slate-50/90","dark:bg-slate-800/80","shadow-xs"),i.classList.add("border-slate-200/90","dark:border-slate-800","bg-white","dark:bg-slate-900","hover:border-slate-400","dark:hover:border-slate-600"))}});const a={all:t?"All Teams":"ทุกทีม",wc1:"Wildcard 1",wc2:"Wildcard 2",fh:"Free Hit",tc:"Triple Captain",bb:"Bench Boost"},r=document.getElementById("comp-active-filter-indicator");r&&(r.innerHTML=`
            <span class="text-xs text-slate-500 dark:text-slate-400">
              ${t?"Filter:":"ตัวกรอง:"}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${e==="all"?"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"}">
              ${a[e]||e}
            </span>
            ${e!=="all"?`
              <button onclick="app.setCompCardFilter('all')" aria-label="${t?"Reset filter to show all teams":"ล้างตัวกรองเพื่อดูทุกทีม"}" class="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-medium">
                <span>✕</span>
                <span>${t?"Reset":"ล้างตัวกรอง"}</span>
              </button>
            `:""}
          `)}setCompCardSearch(e){this.compCardSearch=(e||"").toLowerCase().trim(),this.renderCompetitionCardsTableOnly()}setCompDiffPosFilter(e){this.preserveInputFocus(()=>{this.compDiffPosFilter=e,this.renderCompetitionDiffPlayersOnly()})}setCompDiffSearch(e){this.preserveInputFocus(()=>{this.compDiffSearch=(e||"").toLowerCase().trim(),this.renderCompetitionDiffPlayersOnly()})}getSavedAdvisorTeam(e){try{if(typeof localStorage>"u"||!this.activeLeagueId)return"";const t=localStorage.getItem("fpl_advisor_team_"+this.activeLeagueId)||"";return t&&(Array.isArray(e)?e:this.getLeaderboardTeams()).some(p=>String(p.entry_id)===String(t))?String(t):""}catch{return""}}ensureLeaguePlayerCounts(e,t){const a=this.data;if(!a)return{};const r=Array.isArray(e)?e:this.getLeaderboardTeams(),p=t||this.selectedGW,i=Number(this.multiData.max_gw)||p,d=`${this.activeLeagueId}_${p}_${r.length}`;if(this.cachedPlayerCounts&&this._playerCountsCacheKey===d)return this.cachedPlayerCounts;const n={};return r.forEach(c=>{const m=Number(c.entry_id);let s=a.squads?a.squads[`${m}_${p}`]:null;if(!s&&a.squads&&(s=a.squads[`${m}_${i}`]),!s)return;(s.starting||[]).concat(s.bench||[]).forEach(l=>{const g=l.id;n[g]||(n[g]={id:g,name:l.name,pos:l.pos||"MID",team:l.team||"UNK",team_code:l.team_code||FPL_TEAM_CODES[l.team]||0,count:0,teams:[]}),n[g].count+=1,n[g].teams.push({entry_id:m,team_name:c.entry_name,player_name:c.player_name})})}),this.cachedPlayerCounts=n,this._playerCountsCacheKey=d,n}setCompTransferTeam(e){this.compTransferTeam=e?String(e):"",this.compAdvisorAltIdx={},this.compTransferTeam||(this.compTransferHideOwned=!1);try{typeof localStorage<"u"&&this.activeLeagueId&&(this.compTransferTeam?localStorage.setItem("fpl_advisor_team_"+this.activeLeagueId,this.compTransferTeam):localStorage.removeItem("fpl_advisor_team_"+this.activeLeagueId))}catch{}const t=document.getElementById("comp-transfers-team-select");t&&(t.value=this.compTransferTeam),this.invalidateRenderCache(),this.renderCompetitionTransfersOnly()}setCompTransferHorizon(e){this.compTransferHorizon=e==="3gw"?"3gw":"1gw",this.renderCompetitionTransfersOnly()}setCompTransferMode(e){e==="both"&&(e="dual"),["dual","best","value","diff"].includes(e)||(e="dual"),this.compTransferMode=e,this.compTransferMobileView=e==="dual"?"both":e,this.renderCompetitionTransfersOnly()}setCompTransferPos(e){const t=["ALL","GKP","DEF","MID","FWD"];this.compTransferPos=t.includes(e)?e:"ALL",this.renderCompetitionTransfersOnly()}setCompTransferMaxCost(e){const t=["ALL","5.5","7.5","9.5"];this.compTransferMaxCost=t.includes(String(e))?String(e):"ALL",this.renderCompetitionTransfersOnly()}toggleCompTransferHideOwned(){this.compTransferHideOwned=!this.compTransferHideOwned,this.renderCompetitionTransfersOnly()}setCompAdvisorAlt(e,t){this.compAdvisorAltIdx=this.compAdvisorAltIdx||{},this.compAdvisorAltIdx[String(e)]=Number(t)||0,this.renderCompetitionTransfersOnly()}resetCompTransferFilters(){this.compTransferPos="ALL",this.compTransferMaxCost="ALL",this.compTransferHideOwned=!1,this.compTransferMode==="diff"&&(this.compTransferMode="dual"),this.renderCompetitionTransfersOnly()}setCompTransferMobileView(e){this.setCompTransferMode(e==="both"?"dual":e)}showProjectedPointsModal(){const e=document.getElementById("projected-points-modal");if(e){const t=this.currentLang==="en",a=document.getElementById("projected-points-title"),r=document.getElementById("projected-points-desc"),p=document.getElementById("projected-points-fdr"),i=document.getElementById("projected-points-notice"),d=document.getElementById("projected-points-btn");a&&(a.innerText=t?"Projected Points & Advisor Guide":"คะแนนคาดการณ์ & คำแนะนำย้ายตัว"),r&&(r.innerText=t?"Projected Points (xP) uses our Hybrid Engine (recent form, xGI/CS stats, minutes consistency, injury status, and fixture difficulty FDR/DGW/BGW blended with AI projections) across 1 GW and 3 GWs horizons.":"คะแนนคาดการณ์ (xP) คำนวณจากโมเดล Hybrid (ฟอร์มล่าสุด, สถิติ xGI/CS, โอกาสลงสนาม, ความยากโปรแกรม FDR/DGW/BGW ผสานค่าคาดการณ์ AI) รองรับทั้งระยะ 1 GW และ 3 GWs"),p&&(p.innerHTML=t?'<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 font-mono font-bold">FDR 1–2 Easy</span><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-mono font-bold">FDR 3 Med</span><span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 font-mono font-bold">FDR 4–5 Hard</span><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 font-mono font-bold">BGW Blank</span>':'<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 font-mono font-bold">FDR 1–2 ง่าย</span><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-mono font-bold">FDR 3 กลาง</span><span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 font-mono font-bold">FDR 4–5 ยาก</span><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 font-mono font-bold">BGW ว่าง</span>'),i&&(i.innerHTML=t?'<strong class="font-bold">Squad Advisor (Sell → Buy):</strong> Estimated budget = current price + bank, enforcing FPL max 3 players per club. Always verify exact selling price and press-conference injury news before confirming transfers.':'<strong class="font-bold">คำแนะนำเฉพาะทีม (Sell → Buy):</strong> คำนวณงบโดยประมาณจากราคาปัจจุบัน + Bank พร้อมตรวจกฎไม่เกิน 3 คน/สโมสร ควรเช็กแถลงการณ์ความฟิตและราคาขายจริงในแอป FPL ก่อนกดยืนยัน'),d&&(d.innerText=t?"Got it":"เข้าใจแล้ว"),this._lastFocusedElement=document.activeElement,e.classList.remove("hidden"),this.lockBodyScroll(),d?d.focus({preventScroll:!0}):e.focus({preventScroll:!0})}}closeProjectedPointsModal(){const e=document.getElementById("projected-points-modal");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),this.unlockBodyScroll(),this._lastFocusedElement&&this._lastFocusedElement!==document.body&&typeof this._lastFocusedElement.focus=="function"&&this._lastFocusedElement.focus({preventScroll:!0}),this._lastFocusedElement=null)}toggleImportantTeamList(e){const t=document.getElementById(`important-teams-${e}`),a=document.getElementById(`important-btn-${e}`);if(!t)return;const r=this.currentLang==="en";t.classList.contains("hidden")?(t.classList.remove("hidden"),a&&(a.innerText=r?"▲ Hide team list":"▲ ซ่อนรายชื่อทีม")):(t.classList.add("hidden"),a&&(a.innerText=r?"▼ View team list":"▼ ดูรายชื่อทีมที่เลือก"))}renderCompetitionView(){const e=this.data;if(!e)return;if(e.tier===2||this.config&&this.config.tier===2){const s=document.getElementById("competition-view");if(s){const o=this.currentLang==="en";s.innerHTML=`
              <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs max-w-xl mx-auto my-8">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold font-display">
                  📊
                </div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                  ${o?"Tier 2 League: Standings & Leaderboard Only":"มินิลีกระดับ Tier 2: โหมดแสดงตารางคะแนน"}
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  ${o?"This league is optimized for large mini-leagues (up to 1,000+ teams). Detailed squad pitch formations, card tracker, and transfer suggestions are active for Tier 1 leagues (up to 30 teams).":"มินิลีกนี้ทำงานในโหมด Standings Only สำหรับลีกขนาดใหญ่ (รองรับได้ถึง 1,000+ ทีม) ระบบผังจัดทัพ การวิเคราะห์ชิปคงเหลือ และคำแนะนำย้ายตัวจะเปิดใช้งานสำหรับลีกระดับ Tier 1 (ไม่เกิน 30 ทีม)"}
                </p>
                <button onclick="app.switchTab('gameweek-view')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-display shadow-2xs transition-colors cursor-pointer">
                  ${o?"View Standings & Live Points":"กลับไปดูตารางคะแนน & แต้มสด"}
                </button>
              </div>
            `}return}const t=this.getLeaderboardTeams(),a=t.length;if(a===0)return;const r=this.selectedGW,p=Number(this.multiData.max_gw)||r,i=this.currentLang==="en";this.compCardFilter=this.compCardFilter||"all",this.compCardSearch=this.compCardSearch||"";const d=document.getElementById("competition-overview-title");d&&(d.innerText=i?"Chips Status":"สถานะชิป");const n=document.getElementById("competition-overview-subtitle");n&&(n.innerText=i?"Track remaining chip inventory of league rivals (Wildcard, Free Hit, Bench Boost, Triple Captain)":"ตรวจสอบสถานะการใช้ชิปคงเหลือของคู่แข่งในลีก (Wildcard, Free Hit, Bench Boost, Triple Captain)");const c=document.getElementById("competition-league-badge"),m=document.getElementById("competition-gw-badge");c&&(c.innerText=e.name||`League ${this.activeLeagueId}`),m&&(m.innerText=`Gameweek ${r}`),this.renderCompetitionCards(t,a,p)}setTransfersFilter(e){this.preserveInputFocus(()=>{this.transfersFilter===e&&e!=="all"?this.transfersFilter="all":this.transfersFilter=e;const t=this.getLeaderboardTeams();this.renderTransfersWeeklyAnalytics(t,t.length,this.selectedGW)})}setTransfersSearch(e){this.preserveInputFocus(()=>{this.transfersSearch=(e||"").toLowerCase().trim();const t=this.getLeaderboardTeams();this.renderTransfersWeeklyAnalytics(t,t.length,this.selectedGW)})}renderTransfersView(){const e=this.data;if(!e)return;if(e.tier===2||this.config&&this.config.tier===2){const h=document.getElementById("transfers-view");if(h){const $=this.currentLang==="en";h.innerHTML=`
              <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs max-w-xl mx-auto my-8">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                  ${$?"Tier 2 League: Standings & Leaderboard Only":"มินิลีกระดับ Tier 2: โหมดแสดงตารางคะแนน"}
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  ${$?"This league is optimized for large mini-leagues (up to 1,000+ teams). Detailed transfer moves and squad analytics are active for Tier 1 leagues.":"มินิลีกนี้ทำงานในโหมด Standings Only สำหรับลีกขนาดใหญ่ (รองรับได้ถึง 1,000+ ทีม) ระบบวิเคราะห์การย้ายตัวและขุมกำลังจะเปิดใช้งานสำหรับลีกระดับ Tier 1 (ไม่เกิน 30 ทีม)"}
                </p>
                <button onclick="app.switchTab('gameweek-view')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold font-display shadow-2xs transition-colors cursor-pointer">
                  ${$?"View Standings & Live Points":"กลับไปดูตารางคะแนน & แต้มสด"}
                </button>
              </div>
            `}return}const t=this.getLeaderboardTeams(),a=t.length;if(a===0)return;const r=this.selectedGW,p=this.currentLang==="en";this.transfersFilter=this.transfersFilter||"all",this.transfersSearch=this.transfersSearch||"",this.compDiffPosFilter=this.compDiffPosFilter||"ALL",this.compDiffSearch=this.compDiffSearch||"",this.compTransferTeam=this.compTransferTeam||"",this.compTransferHorizon=this.compTransferHorizon||"1gw",this.compTransferMode=this.compTransferMode||"dual",this.compTransferPos=this.compTransferPos||"ALL",this.compTransferMaxCost=this.compTransferMaxCost||"ALL",this.compTransferHideOwned=!!this.compTransferHideOwned,this.compAdvisorAltIdx=this.compAdvisorAltIdx||{},this.compTransferMobileView=this.compTransferMobileView||(typeof window<"u"&&window.innerWidth<640?"best":"both");const i=String(r),d=this.data.gameweeks?this.data.gameweeks[i]:null,n=!!(d&&d.is_finished),m=(d?d.is_started!==void 0?!!d.is_started:n||d.results&&d.results.some(h=>h.points>0):!1)&&!n,s=document.getElementById("transfers-overview-title");s&&(s.innerText=p?"Transfer Analytics":"วิเคราะห์การย้ายตัว");const o=document.getElementById("transfers-overview-subtitle");o&&(o.innerText=p?"Weekly transfer activity, net transfer ROI, template ownership (>70%), and differential picks (<20%)":"สถิติการย้ายตัวประจำสัปดาห์, แต้มได้-เสียสุทธิจากการย้ายตัว, การถือครองนักเตะมหาชน และตัวทีเด็ดในลีก");const l=document.getElementById("transfers-live-dot");l&&(m?l.className="w-2.5 h-2.5 rounded-full bg-emerald-500 motion-safe:animate-pulse":n?l.className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500":l.className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600");const g=document.getElementById("transfers-league-badge"),y=document.getElementById("transfers-gw-badge");g&&(g.innerText=e.name||`League ${this.activeLeagueId}`),y&&(y.innerText=`Gameweek ${r}`),this.renderTransfersWeeklyAnalytics(t,a,r),this.renderCompetitionPlayers(t,a,r);const D=document.getElementById("transfers-to-advisor-cta");if(D){const $=(this.multiData.transfer_suggestions||{}).gw||(Number(this.multiData.max_gw)||r)+1;D.innerHTML=`
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div class="space-y-1 min-w-0">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  ${p?`Plan Gameweek ${$} Transfers with Smart Squad Advisor`:`วางแผนซื้อขาย Gameweek ${$} ในแท็บ "แนะนำการย้ายตัว"`}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  ${p?"Scan your 15-man squad for injuries, tough fixtures, and personalized Sell → Buy swaps with 1 GW & 3 GWs Hybrid xP projections.":"สแกนจุดอ่อน 15 นักเตะในทีมคุณ จับคู่ ขายใคร → ซื้อใคร ตามงบ Bank พร้อมตารางคะแนนคาดการณ์ Hybrid xP 1 GW / 3 GWs และความยากโปรแกรม (FDR)"}
                </p>
              </div>
              <button
                type="button"
                onclick="app.switchTab('transfer-advisor-view')"
                class="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold font-display shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <span>${p?"Open Transfer Advisor":"ไปที่แท็บ: แนะนำการย้ายตัว"}</span>
                <span>&rarr;</span>
              </button>
            </div>
          `}}renderTransferAdvisorView(){const e=this.data;if(!e)return;if(e.tier===2||this.config&&this.config.tier===2){const l=document.getElementById("transfer-advisor-view");if(l){const g=this.currentLang==="en";l.innerHTML=`
              <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs max-w-xl mx-auto my-8">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                  ${g?"Tier 2 League: Standings & Leaderboard Only":"มินิลีกระดับ Tier 2: โหมดแสดงตารางคะแนน"}
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  ${g?"Personalized squad transfer advisor and Hybrid xP target projections are active for Tier 1 leagues.":"ระบบแนะนำการย้ายตัวและวิเคราะห์จุดอ่อนรายทีม (ขายใคร → ซื้อใคร) เปิดใช้งานสำหรับลีกระดับ Tier 1"}
                </p>
                <button onclick="app.switchTab('gameweek-view')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold font-display shadow-2xs transition-colors cursor-pointer">
                  ${g?"View Standings & Live Points":"กลับไปดูตารางคะแนน & แต้มสด"}
                </button>
              </div>
            `}return}const t=this.getLeaderboardTeams(),a=t.length;if(a===0)return;const r=this.selectedGW,p=this.currentLang==="en";this._advisorLoadedLeague!==this.activeLeagueId?(this._advisorLoadedLeague=this.activeLeagueId,this.compTransferTeam=this.getSavedAdvisorTeam(t),this.compAdvisorAltIdx={}):this.compTransferTeam&&!t.some(l=>String(l.entry_id)===String(this.compTransferTeam))&&(this.compTransferTeam=this.getSavedAdvisorTeam(t)),this.compTransferHorizon=this.compTransferHorizon||"1gw",this.compTransferMode=this.compTransferMode||"dual",this.compTransferPos=this.compTransferPos||"ALL",this.compTransferMaxCost=this.compTransferMaxCost||"ALL",this.compTransferHideOwned=!!this.compTransferHideOwned,this.compAdvisorAltIdx=this.compAdvisorAltIdx||{},this.compTransferMobileView=this.compTransferMobileView||(typeof window<"u"&&window.innerWidth<640?"best":"both"),this.ensureLeaguePlayerCounts(t,r);const d=(this.multiData.transfer_suggestions||{}).gw||(Number(this.multiData.max_gw)||r)+1,n=this.multiData.next_deadline||{},c=document.getElementById("transfer-advisor-overview-title");c&&(c.innerText=p?"Transfer Advisor":"แนะนำการย้ายตัว");const m=document.getElementById("transfer-advisor-overview-subtitle");m&&(m.innerText=p?"Personalized squad advisor (Sell → Buy), Hybrid xP 1 GW / 3 GWs projections, and fixture difficulty (FDR)":"วิเคราะห์จุดอ่อนรายทีม (ขายใคร → ซื้อใคร), คะแนนคาดการณ์ Hybrid xP 1 GW / 3 GWs และความยากโปรแกรม (FDR)");const s=document.getElementById("transfer-advisor-deadline-badge");s&&(s.innerText=`Gameweek ${d}`,s.classList.remove("hidden"));const o=document.getElementById("transfer-advisor-league-badge");o&&(o.innerText=e.name||`League ${this.activeLeagueId}`),this.renderCompetitionTransfers(t,a,r)}renderTransfersWeeklyAnalytics(e,t,a){const r=this.currentLang==="en",p=document.getElementById("transfers-analytics-section");if(!p)return;const i=String(a),d=this.data.gameweeks?this.data.gameweeks[i]:null,n=d&&d.results?d.results:[],c=!!(d&&d.is_finished),s=(d?d.is_started!==void 0?!!d.is_started:c||d.results&&d.results.some(u=>u.points>0):!1)&&!c,o={};n.forEach(u=>{o[Number(u.entry_id)]=u});let l=0,g=0,y=0,D=null,h="",$=0,v=0;const I=e.map(u=>{const N=Number(u.entry_id),w=o[N]||{},b=Number(w.transfers_count)||0,_=Number(w.hits)||0,S=Number(w.transfers_net_impact)||0,E=Number(w.transfers_pts_gain)||0,A=Array.isArray(w.transfer_moves)?w.transfer_moves:[],F=w.chip||null;return b>0&&v++,_>0&&$++,l+=b,g+=_,y+=S,A.forEach(q=>{const j=Number(q.net)||0;(!D||j>(D.net||0))&&(D=q,h=u.player_name||u.entry_name)}),{team:u,transfers_count:b,hits:_,net:S,pts_gain:E,moves:A,chip:F}}),L=this.transfersFilter||"all",k=(this.transfersSearch||"").toLowerCase().trim();let x=I;L==="transferred"?x=x.filter(u=>u.transfers_count>0):L==="hits"?x=x.filter(u=>u.hits>0):L==="profit"?x=x.filter(u=>u.net>0):L==="loss"?x=x.filter(u=>u.net<0):L==="best"&&D&&(x=x.filter(u=>u.team.player_name&&u.team.player_name===h||u.team.entry_name&&u.team.entry_name===h||u.moves.some(N=>N.in===D.in&&N.net===D.net))),k&&(x=x.filter(u=>{const N=(u.team.entry_name||"").toLowerCase(),w=(u.team.player_name||"").toLowerCase(),b=u.moves.map(_=>`${_.in||""} ${_.out||""}`).join(" ").toLowerCase();return N.includes(k)||w.includes(k)||b.includes(k)})),x.sort((u,N)=>N.transfers_count>0!=u.transfers_count>0?N.transfers_count>0?1:-1:N.net!==u.net?N.net-u.net:(u.team.leaderboard_rank||99)-(N.team.leaderboard_rank||99));const C=y>0?"text-emerald-600 dark:text-emerald-400":y<0?"text-rose-600 dark:text-rose-400":"text-slate-900 dark:text-white",T={all:r?"All Teams":"ทุกทีม",transferred:r?"Transfers Made":"มีการย้ายตัว",hits:r?"Took Hits":"ติดลบฮิตส์",profit:r?"Profitable Returns":"กำไรแต้มสุทธิ",best:r?"Best Deal of GW":"ดีลยอดเยี่ยม"},H=this.renderTransfersCardsListHtml(x,r),z=r?"en":"th",U=String(this.activeLeagueId||""),Q=String(this.selectedGW||""),W=document.getElementById("transfers-cards-list"),P=document.getElementById("transfers-search-input");if(W&&P&&P.dataset.renderedLang===z&&P.dataset.renderedLeague===U&&P.dataset.renderedGw===Q){W.innerHTML=H;const u=document.getElementById("transfers-filter-badge");u&&(u.innerText=`${T[L]||L} (${x.length})`,u.className=`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${L==="all"?"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"}`);const N=document.getElementById("transfers-search-clear");N&&(this.transfersSearch?N.classList.remove("hidden"):N.classList.add("hidden")),["transferred","hits","profit","best"].forEach(w=>{const b=document.getElementById(`kpi-btn-transfers-${w}`);if(b){const _=L===w;b.setAttribute("aria-pressed",_?"true":"false"),b.className=`text-left rounded-2xl p-3 sm:p-4 border transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-2xs group ${_?"border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 bg-slate-50/90 dark:bg-slate-800/80":"border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-600"}`}}),P.value!==(this.transfersSearch||"")&&(P.value=this.transfersSearch||"");return}p.innerHTML=`
          <div class="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            
            <!-- Section Title & GW (01 / TRANSFER ACTIVITY) -->
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">01</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                    ${r?"Gameweek Transfer Activity & ROI":"สถิติการย้ายตัวประจำสัปดาห์"}
                  </h3>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ${s?r?"Provisional net impact and live transfer returns as matches unfold":"สรุปการซื้อขายนักเตะเข้า-ออก และผลกำไร-ขาดทุนคะแนนสดชั่วคราวขณะแข่งขัน":r?"Official transfers in/out, hits taken, and verified net point returns":"สรุปการซื้อขายนักเตะเข้า-ออก, แต้มลบจากการย้ายตัว และผลกำไร-ขาดทุนคะแนนสุทธิอย่างเป็นทางการ"}
                </p>
              </div>
              <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-bold font-display">
                Gameweek ${a}
              </span>
            </div>

            <!-- 4 Interactive Transfer Command KPIs -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              
              <!-- KPI 1: Total Transfers -->
              <button 
                id="kpi-btn-transfers-transferred"
                type="button"
                onclick="app.setTransfersFilter('transferred')"
                aria-pressed="${L==="transferred"}"
                class="text-left rounded-2xl p-3 sm:p-4 border transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-2xs group ${L==="transferred"?"border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 bg-slate-50/90 dark:bg-slate-800/80":"border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-600"}"
              >
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">
                      ${r?"Total Transfers":"การย้ายตัวทั้งลีก"}
                    </span>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-opacity ${L==="transferred"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900":"text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100"}">
                    ${L==="transferred"?r?"ACTIVE":"เลือกอยู่":r?"Filter":"กรอง"}
                  </span>
                </div>
                <div class="mt-2.5 flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tabular-nums">${l}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">${r?"moves":"ครั้ง"}</span>
                </div>
                <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                  ${r?`${v} of ${t} teams active`:`${v} จาก ${t} ทีมมีการย้ายตัว`}
                </p>
              </button>

              <!-- KPI 2: Hits Cost -->
              <button 
                id="kpi-btn-transfers-hits"
                type="button"
                onclick="app.setTransfersFilter('hits')"
                aria-pressed="${L==="hits"}"
                class="text-left rounded-2xl p-3 sm:p-4 border transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-2xs group ${L==="hits"?"border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 bg-slate-50/90 dark:bg-slate-800/80":"border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-600"}"
              >
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">
                      ${r?"Hits Deducted":"แต้มลบทั้งลีก"}
                    </span>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-opacity ${L==="hits"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900":"text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100"}">
                    ${L==="hits"?r?"ACTIVE":"เลือกอยู่":r?"Filter":"กรอง"}
                  </span>
                </div>
                <div class="mt-2.5 flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-black ${g>0?"text-rose-600 dark:text-rose-400":"text-slate-900 dark:text-white"} font-display tabular-nums">${g>0?`-${g}`:"0"}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">pts</span>
                </div>
                <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                  ${r?`${$} teams took hits`:`${$} ทีมยอมเสียแต้ม`}
                </p>
              </button>

              <!-- KPI 3: Net Impact -->
              <button 
                id="kpi-btn-transfers-profit"
                type="button"
                onclick="app.setTransfersFilter('profit')"
                aria-pressed="${L==="profit"}"
                class="text-left rounded-2xl p-3 sm:p-4 border transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-2xs group ${L==="profit"?"border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 bg-slate-50/90 dark:bg-slate-800/80":"border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-600"}"
              >
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">
                      ${r?"Net ROI Impact":"กำไรแต้มสุทธิ"}
                    </span>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-opacity ${L==="profit"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900":"text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100"}">
                    ${L==="profit"?r?"ACTIVE":"เลือกอยู่":r?"Filter":"กรอง"}
                  </span>
                </div>
                <div class="mt-2.5 flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-black ${C} font-display tabular-nums">${y>0?`+${y}`:y}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">pts</span>
                </div>
                <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                  ${s?r?"Live provisional returns":"แต้มสุทธิสดชั่วคราว":r?"Points gained minus hits":"แต้มตัวเข้าลบตัวออกและฮิตส์"}
                </p>
              </button>

              <!-- KPI 4: Best Transfer of the Week -->
              <button 
                id="kpi-btn-transfers-best"
                type="button"
                onclick="app.setTransfersFilter('best')"
                aria-pressed="${L==="best"}"
                class="text-left rounded-2xl p-3 sm:p-4 border transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-2xs group ${L==="best"?"border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 bg-slate-50/90 dark:bg-slate-800/80":"border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-600"}"
              >
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">
                      ${r?"Best Deal of GW":"ดีลยอดเยี่ยมประจำสัปดาห์"}
                    </span>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-opacity ${L==="best"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900":"text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100"}">
                    ${L==="best"?r?"ACTIVE":"เลือกอยู่":r?"Filter":"กรอง"}
                  </span>
                </div>
                <div class="mt-2.5 truncate">
                  ${D?`
                    <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display truncate">
                      <span class="text-emerald-600 dark:text-emerald-400 font-black font-mono">+${D.net} pts</span> ➔ ${this.escapeHtml(D.in)}
                    </div>
                  `:`
                    <div class="text-xs font-medium text-slate-400 dark:text-slate-500 font-display">
                      -
                    </div>
                  `}
                </div>
                <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                  ${D?r?`by ${this.escapeHtml(h)}`:`โดย ${this.escapeHtml(h)}`:r?"No transfers yet":"ยังไม่มีการย้ายตัว"}
                </p>
              </button>

            </div>

            <!-- Filter Status & Search -->
            <div class="glass-card rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <!-- Filter Indicator & Reset -->
              <div class="flex items-center gap-2 flex-wrap min-w-0">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  ${r?"Filter:":"ตัวกรอง:"}
                </span>
                <span id="transfers-filter-badge" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${L==="all"?"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"}">
                  ${T[L]||L} (${x.length})
                </span>
                ${L!=="all"?`
                  <button onclick="app.setTransfersFilter('all')" class="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-medium">
                    <span>✕</span>
                    <span>${r?"Reset":"ล้างตัวกรอง"}</span>
                  </button>
                `:""}
              </div>

              <!-- Search Box -->
              <div class="relative w-full sm:w-72">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </span>
                <input 
                  type="text" 
                  id="transfers-search-input"
                  data-rendered-lang="${z}"
                  data-rendered-league="${this.escapeHtml(U)}"
                  data-rendered-gw="${this.escapeHtml(Q)}"
                  value="${this.escapeHtml(this.transfersSearch||"")}"
                  aria-label="${r?"Search team, manager, player":"ค้นหาทีม, ผู้จัดการ, นักเตะ"}"
                  placeholder="${r?"Search team, manager, player...":"ค้นหาทีม, ผู้จัดการ, นักเตะ..."}"
                  oninput="app.setTransfersSearch(this.value)"
                  class="w-full bg-slate-50/90 dark:bg-slate-800/80 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all shadow-2xs"
                />
                <button id="transfers-search-clear" type="button" aria-label="${r?"Clear search":"ล้างการค้นหา"}" onclick="app.setTransfersSearch('')" class="${this.transfersSearch?"":"hidden "}absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer p-0.5">✕</button>
              </div>
            </div>

            <!-- List of Manager Transfer Cards -->
            <div id="transfers-cards-list" class="space-y-2.5">
              ${H}
            </div>

          </div>
        `}renderTransfersCardsListHtml(e,t){return!e||e.length===0?`
            <div class="py-10 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-2.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div class="text-xs font-bold text-slate-700 dark:text-slate-300">
                ${t?"No teams match the selected filter or search keyword":"ไม่พบทีมที่ตรงกับตัวกรองหรือคำค้นหา"}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                ${t?"Try adjusting your search query or reset filters to display all league transfers.":"ลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อแสดงรายชื่อทีมและการย้ายตัวทั้งหมด"}
              </div>
              <div class="mt-3.5">
                <button onclick="app.setTransfersFilter('all'); app.setTransfersSearch('');" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold font-display shadow-2xs transition-colors cursor-pointer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span>${t?"Reset All Filters":"ล้างตัวกรองทั้งหมด"}</span>
                </button>
              </div>
            </div>
          `:e.map(a=>{const p=this.isPrizeEligible(a.team.entry_id)?this.getRankBadge(a.team.leaderboard_rank):this.getNonPrizeRankBadge(),i=this.getPrizeBadge(a.team.entry_id);let d="";if(a.chip){const o=String(a.chip).toLowerCase().trim().replace(/_/g,"");let l=a.chip;o==="wildcard"?l="Wildcard":o==="freehit"?l="Free Hit":o==="3xc"||o==="triplecaptain"?l="3xC":(o==="bboost"||o==="benchboost")&&(l="Bench Boost"),d=`
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                ${l}
              </span>
            `}const n=a.hits>0?`
            <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              -${a.hits} pts
            </span>
          `:"",c=a.transfers_count===0?t?"0 Transfer (Rolled FT)":"0 ย้ายตัว (สะสมสิทธิ์)":t?`${a.transfers_count} ${a.transfers_count===1?"Transfer":"Transfers"}`:`ย้าย ${a.transfers_count} คน`;let m="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",s="";return a.net>0?(m="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",s="+"):a.net<0&&(m="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"),`
            <div class="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3.5 sm:p-4 hover:border-slate-400/80 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs group max-w-full overflow-hidden">
              
              <!-- Left: Manager & Status -->
              <div class="flex items-center gap-2.5 w-full md:w-auto md:min-w-[220px]">
                <div class="w-[32px] min-w-[32px] text-center flex-shrink-0">
                  ${p}
                </div>
                <div class="truncate">
                  <button onclick="app.openTeamModal(${a.team.entry_id})" class="text-left group cursor-pointer block truncate">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        ${this.escapeHtml(a.team.entry_name||"-")}
                      </span>
                      ${i}
                      ${d}
                    </div>
                    <div class="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      <span>${this.escapeHtml(a.team.player_name||"-")}</span>
                      <span>•</span>
                      <span class="font-semibold ${a.transfers_count>0?"text-slate-900 dark:text-white":"text-slate-400"}">${c}</span>
                      ${n}
                    </div>
                  </button>
                </div>
              </div>

              <!-- Center: Transfer Moves -->
              <div class="flex-1 min-w-0 max-w-full">
                ${a.moves.length>0?`
                  <div class="flex flex-wrap items-center gap-2">
                    ${a.moves.map(o=>{const l=Number(o.net)||0,g=l>0?"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30":l<0?"bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30":"bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",y=l>0?"+":"";return`
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 text-xs shadow-2xs flex-wrap max-w-full">
                          <span class="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 min-w-0">
                            <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold flex-shrink-0">${t?"IN":"เข้า"}</span>
                            <span class="truncate max-w-[95px] sm:max-w-none">${this.escapeHtml(o.in||"-")}</span>
                            <span class="text-[10px] font-normal text-emerald-600/80 dark:text-emerald-400/80 font-mono flex-shrink-0">(${o.in_pts||0}p)</span>
                          </span>
                          <span class="text-slate-400 dark:text-slate-500 text-xs font-bold flex-shrink-0">➔</span>
                          <span class="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 min-w-0">
                            <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-extrabold flex-shrink-0">${t?"OUT":"ออก"}</span>
                            <span class="truncate max-w-[95px] sm:max-w-none">${this.escapeHtml(o.out||"-")}</span>
                            <span class="text-[10px] font-normal text-rose-500/80 dark:text-rose-400/80 font-mono flex-shrink-0">(${o.out_pts||0}p)</span>
                          </span>
                          <span class="ml-1 px-1.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold border flex-shrink-0 ${g}">
                            ${y}${l} pts
                          </span>
                        </div>
                      `}).join("")}
                  </div>
                `:`
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-full">
                    <span class="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-[10px] flex-shrink-0 font-mono">✓</span>
                    <span class="font-medium truncate">${t?"No transfers made • Rolled Free Transfer for next GW":"ไม่มีการย้ายตัวในสัปดาห์นี้ • สะสมโควตาย้ายตัวฟรีไปสัปดาห์ถัดไป"}</span>
                  </div>
                `}
              </div>

              <!-- Right: Net Points Impact Badge -->
              <div class="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 w-full md:w-auto">
                <div class="md:hidden text-[11px] text-slate-400 font-medium">
                  ${t?"Net Gameweek Impact:":"ผลตอบแทนแต้มสุทธิ:"}
                </div>
                <div class="flex flex-col items-end">
                  <span class="hidden md:block text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-display mb-0.5">
                    ${t?"Net Impact":"แต้มสุทธิ"}
                  </span>
                  <div class="text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl border font-mono shadow-2xs tabular-nums ${m}">
                    ${a.transfers_count>0?`${s}${a.net} pts`:"0 pts"}
                  </div>
                </div>
              </div>

            </div>
          `}).join("")}renderCompetitionCards(e,t,a){const r=this.currentLang==="en",p=document.getElementById("competition-cards-section"),i=document.getElementById("competition-live-spotlight");if(!p)return;const d=this.getLeaderboardTeams(),n=this.data,c=a>=20,m={};let s=0,o=0,l=0,g=0,y=0;d.forEach(w=>{const b=Number(w.entry_id),_={wc1:null,wc2:null,fh:null,tc:null,bb:null};for(let S=1;S<=a;S++){const E=n.gameweeks?n.gameweeks[String(S)]:null;if(E&&E.results){const q=E.results.find(j=>Number(j.entry_id)===b);if(q&&q.chip){const j=String(q.chip).toLowerCase().trim();j==="wildcard"?S<=19?_.wc1=S:_.wc2=S:j==="freehit"?_.fh=S:j==="3xc"||j==="triple_captain"?_.tc=S:(j==="bboost"||j==="bench_boost")&&(_.bb=S)}}const A=`${b}_${S}`,F=n.squads?n.squads[A]:null;if(F&&F.chip){const q=String(F.chip).toLowerCase().trim();q==="wildcard"?S<=19&&_.wc1===null?_.wc1=S:S>19&&_.wc2===null&&(_.wc2=S):q==="freehit"&&_.fh===null?_.fh=S:(q==="3xc"||q==="triple_captain")&&_.tc===null?_.tc=S:(q==="bboost"||q==="bench_boost")&&_.bb===null&&(_.bb=S)}}m[b]=_,_.wc1===null&&a<=19&&s++,_.wc2===null&&a>=20&&o++,_.fh===null&&l++,_.tc===null&&g++,_.bb===null&&y++}),this.cachedChipsByTeam=m;const D=n.gameweeks?n.gameweeks[String(a)]:null,h=!!(this.isLiveWindowActive&&this.isLiveWindowActive()&&this.selectedGW===a),$=[];h&&d.forEach(w=>{const b=Number(w.entry_id),_=m[b]||{},S=`${b}_${a}`,E=n.squads?n.squads[S]:null;let A=null,F="";if(_.tc===a?(A="tc",F="Triple Captain (3xC)"):_.bb===a?(A="bb",F="Bench Boost (BB)"):_.fh===a?(A="fh",F="Free Hit (FH)"):_.wc1===a?(A="wc1",F="Wildcard 1 (WC1)"):_.wc2===a&&(A="wc2",F="Wildcard 2 (WC2)"),A){let q="";if(A==="tc"&&E&&Array.isArray(E.starting)){const j=E.starting.find(R=>R.is_captain)||E.starting.find(R=>R.multiplier>1);if(j){const R=j.points!==void 0&&j.points!==null?`${j.points} pts`:"",G=this.escapeHtml(j.name);q=r?`Captain: ${G} ${R?`(${R})`:""}`:`กัปตัน: ${G} ${R?`(${R})`:""}`}}else if(A==="bb"&&E&&Array.isArray(E.bench)){let j=0;E.bench.forEach(R=>{j+=Number(R.points||0)}),q=r?`Bench: ${j} pts`:`แต้มสำรอง: ${j}`}else A==="fh"?q=r?"Free Hit Squad":"จัดทัพใหม่เฉพาะสัปดาห์นี้":(A==="wc1"||A==="wc2")&&(q=r?"Squad Rebuilt":"ปรับเปลี่ยนทีมถาวร");$.push({team:w,chipKey:A,chipName:F,detail:q})}}),i&&(h&&$.length>0?(i.classList.remove("hidden"),i.innerHTML=`
              <div class="rounded-2xl p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-slate-800">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse"></span>
                    <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display">
                      ${r?`Active Chips Spotlight (Gameweek ${a})`:`ชิปที่เปิดใช้งานในสัปดาห์นี้ (Gameweek ${a})`}
                    </h3>
                    <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      ${$.length} ${r?$.length===1?"team":"teams":"ทีม"}
                    </span>
                  </div>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    ${r?"Live Matchday":"กำลังแข่งขันสด"}
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
                  ${$.map(w=>`
                    <div onclick="app.openTeamModal(${w.team.entry_id})" class="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer group">
                      <div class="min-w-0 pr-2">
                        <div class="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          ${this.escapeHtml(w.team.entry_name)}
                        </div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          <span>${this.escapeHtml(w.team.player_name)}</span>
                          ${w.detail?` • <span class="text-slate-700 dark:text-slate-300 font-medium">${w.detail}</span>`:""}
                        </div>
                      </div>
                      <span class="flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-mono shadow-2xs">
                        ⚡ ${w.chipKey.toUpperCase()}
                      </span>
                    </div>
                  `).join("")}
                </div>
              </div>
            `):(i.classList.add("hidden"),i.innerHTML=""));const v=c?o:s,I=c?"wc2":"wc1",L=c?"Wildcard 2":"Wildcard 1",k=c?"WC2":"WC1",x=c?r?"Second half of season (GW 20-38)":"ใช้ได้ครึ่งฤดูกาลหลัง (GW 20-38)":r?"First half of season (until GW 19)":"เปลี่ยนตัวฟรีไม่จำกัด (ถึง GW 19)",C=t>0?Math.round(v/t*100):0,T=t>0?Math.round(l/t*100):0,H=t>0?Math.round(g/t*100):0,z=t>0?Math.round(y/t*100):0,U=this.compCardFilter||"all",W={all:r?"All Teams":"ทุกทีม",wc1:"Wildcard 1",wc2:"Wildcard 2",fh:"Free Hit",tc:"Triple Captain",bb:"Bench Boost"}[U]||U,P="rounded-2xl p-3.5 sm:p-4 transition-all cursor-pointer group shadow-2xs",u="border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 bg-slate-50/90 dark:bg-slate-800/80 shadow-xs",N="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600";p.innerHTML=`
          <!-- Section Title -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                ${r?"Chip Inventory":"สถานะชิปคงเหลือของทุกทีมในลีก"}
              </h3>
              <span class="text-xs font-normal text-slate-400 dark:text-slate-500 font-sans">
                (${r?"Remaining %":"% คงเหลือ"})
              </span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">
              ${r?"Total":"รวม"} <strong class="text-slate-900 dark:text-white font-bold font-display">${t}</strong> ${r?"teams":"ทีม"}
            </div>
          </div>

          <!-- 4 Tactical Chip Cards (Interactive Filter Cards) -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            
            <!-- Wildcard Card -->
            <div id="comp-summary-card-${I}" role="button" tabindex="0" aria-pressed="${U===I}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); app.setCompCardFilter('${I}');}" onclick="app.setCompCardFilter('${I}')" class="${P} ${U===I?u:N}">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">${L}</span>
                <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">${k}</span>
              </div>
              <div class="mt-2.5 flex items-baseline justify-between gap-1">
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">${v}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">/ ${t} ${r?"teams":"ทีม"}</span>
                </div>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">${C}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-500" style="width: ${C}%"></div>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">${x}</p>
            </div>

            <!-- Free Hit -->
            <div id="comp-summary-card-fh" role="button" tabindex="0" aria-pressed="${U==="fh"}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); app.setCompCardFilter('fh');}" onclick="app.setCompCardFilter('fh')" class="${P} ${U==="fh"?u:N}">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">Free Hit</span>
                <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">FH</span>
              </div>
              <div class="mt-2.5 flex items-baseline justify-between gap-1">
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">${l}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">/ ${t} ${r?"teams":"ทีม"}</span>
                </div>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">${T}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-500" style="width: ${T}%"></div>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">${r?"Single GW refresh":"เปลี่ยนตัว 11 คนฟรี 1 สัปดาห์"}</p>
            </div>

            <!-- Triple Captain -->
            <div id="comp-summary-card-tc" role="button" tabindex="0" aria-pressed="${U==="tc"}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); app.setCompCardFilter('tc');}" onclick="app.setCompCardFilter('tc')" class="${P} ${U==="tc"?u:N}">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">Triple Captain</span>
                <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">3xC</span>
              </div>
              <div class="mt-2.5 flex items-baseline justify-between gap-1">
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">${g}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">/ ${t} ${r?"teams":"ทีม"}</span>
                </div>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">${H}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-500" style="width: ${H}%"></div>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">${r?"Captain points multiplied by 3":"คะแนนกัปตันคูณ 3"}</p>
            </div>

            <!-- Bench Boost -->
            <div id="comp-summary-card-bb" role="button" tabindex="0" aria-pressed="${U==="bb"}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); app.setCompCardFilter('bb');}" onclick="app.setCompCardFilter('bb')" class="${P} ${U==="bb"?u:N}">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">Bench Boost</span>
                <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">BB</span>
              </div>
              <div class="mt-2.5 flex items-baseline justify-between gap-1">
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">${y}</span>
                  <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans">/ ${t} ${r?"teams":"ทีม"}</span>
                </div>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">${z}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-500" style="width: ${z}%"></div>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">${r?"Points from all 4 bench players":"นับแต้มผู้เล่นสำรองทั้ง 4 ตัว"}</p>
            </div>

          </div>

          <!-- Controls: Filters indicator & Search -->
          <div class="glass-card rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
            <!-- Left: Filter Indicator -->
            <div id="comp-active-filter-indicator" class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-slate-500 dark:text-slate-400">
                ${r?"Filter:":"ตัวกรอง:"}
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${U==="all"?"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"}">
                ${W}
              </span>
              ${U!=="all"?`
                <button onclick="app.setCompCardFilter('all')" aria-label="${r?"Reset filter to show all teams":"ล้างตัวกรองเพื่อดูทุกทีม"}" class="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-medium">
                  <span>✕</span>
                  <span>${r?"Reset":"ล้างตัวกรอง"}</span>
                </button>
              `:""}
            </div>

            <!-- Right: Search Box -->
            <div class="relative w-full sm:w-64">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <input 
                type="text" 
                id="comp-card-search-input" 
                aria-label="${r?"Search team or manager":"ค้นหาชื่อทีม หรือ ผู้จัดการ"}" 
                placeholder="${r?"Search team or manager...":"ค้นหาชื่อทีม หรือ ผู้จัดการ..."}" 
                value="${this.escapeHtml(this.compCardSearch)}"
                oninput="app.setCompCardSearch(this.value)"
                class="w-full bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all"
              />
              ${this.compCardSearch?`<button onclick="document.getElementById('comp-card-search-input').value=''; app.setCompCardSearch('')" aria-label="${r?"Clear search":"ล้างการค้นหา"}" class="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors">✕</button>`:""}
            </div>
          </div>

          <!-- Cards Table Container -->
          <div id="comp-cards-table-container" class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <!-- Table body populated by renderCompetitionCardsTableOnly -->
          </div>
        `,this.renderCompetitionCardsTableOnly()}renderCompetitionCardsTableOnly(){const e=this.currentLang==="en",t=document.getElementById("comp-cards-table-container");if(!t)return;const a=Number(this.multiData.max_gw)||this.selectedGW,r=a>=20,p=r?5:4,i=this.getLeaderboardTeams(),d=this.cachedChipsByTeam||{},n=this.compCardSearch||"",c=this.compCardFilter||"all";let m=i;if(n&&(m=m.filter(v=>(v.entry_name||"").toLowerCase().includes(n)||(v.player_name||"").toLowerCase().includes(n))),c==="tc"?m=m.filter(v=>d[v.entry_id]?.tc===null):c==="bb"?m=m.filter(v=>d[v.entry_id]?.bb===null):c==="fh"?m=m.filter(v=>d[v.entry_id]?.fh===null):c==="wc1"?m=m.filter(v=>d[v.entry_id]?.wc1===null&&a<=19):c==="wc2"&&(m=m.filter(v=>d[v.entry_id]?.wc2===null&&a>=20)),m.length===0){t.innerHTML=`
            <div class="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              <div class="text-2xl mb-1">🔍</div>
              ${e?"No teams match the search criteria":"ไม่พบทีมที่ตรงกับเงื่อนไขการค้นหา"}
            </div>
          `;return}const s=!!(this.isLiveWindowActive&&this.isLiveWindowActive()&&this.selectedGW===a),o=`
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap shadow-2xs">
            <svg class="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            ${e?"Available":"พร้อมใช้"}
          </span>
        `,l=`
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 whitespace-nowrap shadow-2xs font-mono">
            ⚡ LIVE
          </span>
        `,g=v=>`
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700/60 whitespace-nowrap font-mono">
            GW ${v}
          </span>
        `,y=`
          <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-normal text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 whitespace-nowrap">
            ${e?"Starts GW 20":"เริ่ม GW 20"}
          </span>
        `,D=`
          <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-normal text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 whitespace-nowrap">
            ${e?"Expired":"หมดอายุ"}
          </span>
        `;let h="",$=!1;m.forEach(v=>{const I=this.isPrizeEligible(v.entry_id);!I&&!$&&($=!0,h+=`
              <tr class="bg-slate-100/75 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700/80">
                <td colspan="${r?8:7}" class="py-2 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display sticky left-0 bg-slate-100 dark:bg-slate-800 z-10">
                  ${e?"Non-Prize Teams (Not included in prize calculation)":"ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัล)"}
                </td>
              </tr>
            `);const L=d[v.entry_id]||{wc1:null,wc2:null,fh:null,tc:null,bb:null},k=(L.wc1?0:1)+(r?L.wc2?0:1:0)+(L.fh?0:1)+(L.tc?0:1)+(L.bb?0:1);let x=o;L.wc1?x=L.wc1===a&&s?l:g(L.wc1):a>19&&(x=D);let C=y;L.wc2?C=L.wc2===a&&s?l:g(L.wc2):a>=20&&(C=o);let T=o;L.fh&&(T=L.fh===a&&s?l:g(L.fh));let H=o;L.tc&&(H=L.tc===a&&s?l:g(L.tc));let z=o;L.bb&&(z=L.bb===a&&s?l:g(L.bb));let U="";I?U=this.getRankBadge(v.leaderboard_rank):U=this.getNonPrizeRankBadge();const Q=this.getPrizeBadge(v.entry_id),P=[{key:"wc1",avail:L.wc1===null&&a<=19,name:"WC1"},...r?[{key:"wc2",avail:L.wc2===null&&a>=20,name:"WC2"}]:[],{key:"fh",avail:L.fh===null,name:"FH"},{key:"tc",avail:L.tc===null,name:"TC"},{key:"bb",avail:L.bb===null,name:"BB"}].map(u=>u.avail?`<span title="${u.name} ${e?"Available":"พร้อมใช้"}" class="w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-200 inline-block"></span>`:`<span title="${u.name} ${e?"Used":"ใช้แล้ว"}" class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block"></span>`).join("");h+=`
            <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer">
              <td class="sticky-col-rank py-2.5 px-2 text-center text-xs font-bold">
                ${U}
              </td>
              <td class="sticky-col-team py-2.5 px-2.5 sm:px-3 min-w-[130px] sm:min-w-[180px] max-w-[160px] sm:max-w-[220px]">
                <button onclick="event.stopPropagation(); app.openTeamModal(${v.entry_id})" class="text-left group cursor-pointer block truncate w-full">
                  <div class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate flex items-center gap-1.5 flex-wrap">
                    <span class="truncate">${this.escapeHtml(v.entry_name)}</span>
                    ${Q}
                  </div>
                  <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                    <span>${this.escapeHtml(v.player_name)}</span>
                    <span class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-semibold">(${v.total_points} pts)</span>
                  </div>
                </button>
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">
                <div class="inline-flex flex-col items-center">
                  <span class="text-xs font-bold text-slate-900 dark:text-white font-mono tabular-nums">${k} / ${p}</span>
                  <div class="flex items-center gap-1 mt-1">
                    ${P}
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${x}
              </td>
              ${r?`<td class="py-2.5 px-2 sm:px-3 text-center">${C}</td>`:""}
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${T}
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${H}
              </td>
              <td class="py-2.5 px-2 sm:px-3 text-center">
                ${z}
              </td>
            </tr>
          `}),t.innerHTML=`
          <!-- Mobile Scroll Affordance Bar -->
          <div class="sm:hidden flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800">
            <span class="flex items-center gap-1.5 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              ${e?"Sorted by Overall Standings":"เรียงตาม Total Leaderboard"}
            </span>
            <span class="text-[10px] text-slate-400 dark:text-slate-400 font-medium flex items-center gap-1">
              <span>${e?"Scroll right for chips":"เลื่อนขวาดูสถานะชิป"}</span>
              <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </span>
          </div>

          <div class="overflow-x-auto touch-scroll scrollbar-thin table-sticky-container">
            <table class="w-full text-left table-sticky table-clean">
              <thead>
                <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider">
                  <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                  <th scope="col" class="sticky-col-team py-2.5 px-2.5 sm:px-3">${e?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                  <th scope="col" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">${e?"Remaining":"การ์ดคงเหลือ"}</th>
                  <th scope="col" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Wildcard 1</th>
                  ${r?'<th scope="col" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Wildcard 2</th>':""}
                  <th scope="col" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Free Hit</th>
                  <th scope="col" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Triple Capt</th>
                  <th scope="col" class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">Bench Boost</th>
                </tr>
              </thead>
              <tbody class="text-xs sm:text-sm">
                ${h}
              </tbody>
            </table>
          </div>
        `}renderCompetitionPlayers(e,t,a){const r=this.currentLang==="en",p=this.getDefaultShirtUrl(),i=this.ensureLeaguePlayerCounts(e,a),d=document.getElementById("transfers-important-section");if(d){const n=Object.values(i).filter(m=>m.count/t>.7).sort((m,s)=>s.count-m.count||m.name.localeCompare(s.name));let c=`
            <div>
              <!-- Header (02 / SQUAD OWNERSHIP) -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">02</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                    ${r?"Important Players (> 70%)":"นักเตะมหาชน > 70%"}
                  </h3>
                </div>
                <span class="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  ${n.length} ${r?"Players":"คน"}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3.5">
                ${r?"Players selected by >70% of the league. Template essentials to protect your rank.":"นักเตะที่ถูกเลือกมากกว่า 70% ของลีก เป็นตัวหลักที่ต้องมีเพื่อรักษาระยะห่างแต้ม"}
              </p>

              <!-- Players List -->
              <div class="space-y-3">
          `;if(n.length===0)c+=`
              <div class="p-6 text-center text-slate-400 dark:text-slate-500 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                ${r?"No players selected by > 70% in this Gameweek":"ไม่มีนักเตะที่ถูกเลือกเกิน 70% ใน Gameweek นี้"}
              </div>
            `;else{const m="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60";n.forEach(s=>{const o=s.count/t*100,l=this.getPlayerShirtUrl(s);c+=`
                <div class="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <img src="${l}" alt="${this.escapeHtml(s.team)}" class="w-8 h-8 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='${p}';" />
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="font-bold text-slate-900 dark:text-white text-sm truncate">${this.escapeHtml(s.name)}</span>
                          <span class="${m}">${this.escapeHtml(s.pos)}</span>
                          <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">${this.escapeHtml(s.team)}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <div class="text-xs font-mono font-bold text-slate-900 dark:text-white">${o.toFixed(1)}%</div>
                      <div class="text-[10px] text-slate-500 dark:text-slate-400">${s.count}/${t} ${r?"teams":"ทีม"}</div>
                    </div>
                  </div>

                  <!-- Progress Bar (Solid tone without gradients) -->
                  <div class="w-full bg-slate-200 dark:bg-slate-700/80 h-1.5 rounded-full overflow-hidden mt-2.5">
                    <div class="bg-slate-900 dark:bg-slate-100 h-full rounded-full transition-all duration-500" style="width: ${o}%"></div>
                  </div>

                  <!-- Collapsible Teams List Toggle -->
                  <div class="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button id="important-btn-${s.id}" onclick="app.toggleImportantTeamList(${s.id})" class="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                      <span>${r?`▼ View teams (${s.teams.length})`:`▼ ดูรายชื่อทีมที่เลือก (${s.teams.length} ทีม)`}</span>
                    </button>
                    <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">${r?"High Template":"มหาชนตัวจริง"}</span>
                  </div>

                  <!-- Team tags list (hidden by default) -->
                  <div id="important-teams-${s.id}" class="hidden mt-2 pt-1 flex flex-wrap gap-1.5">
                    ${s.teams.map(g=>`
                      <button onclick="app.openTeamModal(${g.entry_id})" class="text-[10px] px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-colors cursor-pointer truncate max-w-[150px]">
                        ${this.escapeHtml(g.team_name)}
                      </button>
                    `).join("")}
                  </div>

                </div>
              `})}c+=`
              </div>
            </div>
          `,d.innerHTML=c}this.renderCompetitionDiffPlayersOnly()}renderCompetitionDiffPlayersOnly(){const e=this.currentLang==="en",t=this.getDefaultShirtUrl(),a=document.getElementById("transfers-differential-section");if(!a)return;const r=this.cachedPlayerCounts||{},i=(this.data.teams||[]).length,d=this.compDiffPosFilter||"ALL",n=(this.compDiffSearch||"").toLowerCase().trim();let c=Object.values(r).filter(v=>v.count/i<.2&&v.count>0).sort((v,I)=>I.count-v.count||v.name.localeCompare(I.name));const m={ALL:c.length,GKP:c.filter(v=>v.pos==="GKP").length,DEF:c.filter(v=>v.pos==="DEF").length,MID:c.filter(v=>v.pos==="MID").length,FWD:c.filter(v=>v.pos==="FWD").length};d!=="ALL"&&(c=c.filter(v=>v.pos===d)),n&&(c=c.filter(v=>(v.name||"").toLowerCase().includes(n)||(v.team||"").toLowerCase().includes(n)));const o=this.renderCompetitionDiffListHtml(c,e,d,n,i,t,"px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"),l=e?"en":"th",g=String(this.activeLeagueId||""),y=String(this.selectedGW||""),D=document.getElementById("comp-diff-list-container"),h=document.getElementById("comp-diff-search-input");if(D&&h&&h.dataset.renderedLang===l&&h.dataset.renderedLeague===g&&h.dataset.renderedGw===y){D.innerHTML=o;const v=document.getElementById("comp-diff-search-clear");v&&(this.compDiffSearch?v.classList.remove("hidden"):v.classList.add("hidden")),["ALL","GKP","DEF","MID","FWD"].forEach(I=>{const L=document.getElementById(`btn-comp-diff-pos-${I}`);if(L){const k=this.compDiffPosFilter===I;L.className=`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${k?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"}`}}),h.value!==(this.compDiffSearch||"")&&(h.value=this.compDiffSearch||"");return}let $=`
          <div>
            <!-- Header (02 / SQUAD OWNERSHIP) -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">02</span>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  ${e?"Differential Players (< 20%)":"นักเตะทีเด็ด < 20%"}
                </h3>
              </div>
              <span class="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                ${m.ALL} ${e?"Players":"คน"}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
              ${e?"Players owned by < 20% in the league with at least 1 owner. Crucial differential rank boosters!":"นักเตะที่ถูกเลือกน้อยกว่า 20% ในลีก มีอย่างน้อย 1 ทีมเลือกใช้ แต้มมาเมื่อไหร่อันดับพุ่งฉีกคู่แข่ง!"}
            </p>

            <!-- Position Filter Pills & Search -->
            <div class="space-y-2 mb-3.5">
              <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-thin touch-scroll py-0.5 -mx-1 px-1">
                ${["ALL","GKP","DEF","MID","FWD"].map(v=>{const I=v==="ALL"?e?"ALL":"ทั้งหมด":v,L=this.compDiffPosFilter===v;return`
                  <button id="btn-comp-diff-pos-${v}" onclick="app.setCompDiffPosFilter('${v}')" class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${L?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"}">
                    ${I} (${m[v]})
                  </button>
                `}).join("")}
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </span>
                <input 
                  type="text" 
                  id="comp-diff-search-input"
                  data-rendered-lang="${l}"
                  data-rendered-league="${this.escapeHtml(g)}"
                  data-rendered-gw="${this.escapeHtml(y)}"
                  aria-label="${e?"Search differential player":"ค้นหานักเตะทีเด็ด"}"
                  placeholder="${e?"Search differential player...":"ค้นหานักเตะทีเด็ด..."}" 
                  value="${this.escapeHtml(this.compDiffSearch)}"
                  oninput="app.setCompDiffSearch(this.value)"
                  class="w-full bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all shadow-2xs"
                />
                <button id="comp-diff-search-clear" type="button" aria-label="${e?"Clear search":"ล้างการค้นหา"}" onclick="app.setCompDiffSearch('')" class="${this.compDiffSearch?"":"hidden "}absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer p-0.5">✕</button>
              </div>
            </div>

            <!-- Scrollable List of Differentials -->
            <div id="comp-diff-list-container" class="max-h-[520px] overflow-y-auto space-y-2.5 pr-1 touch-scroll">
              ${o}
            </div>
          </div>
        `;a.innerHTML=$}renderCompetitionDiffListHtml(e,t,a,r,p,i,d){return!e||e.length===0?`
            <div class="py-8 px-4 text-center text-slate-400 dark:text-slate-500 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <div class="font-bold text-slate-700 dark:text-slate-300 mb-1">${t?"No differential players found matching selected filters":"ไม่พบนักเตะทีเด็ดตามเงื่อนไขที่เลือก"}</div>
              ${a!=="ALL"||r?`
                <button onclick="app.setCompDiffPosFilter('ALL'); app.setCompDiffSearch('');" class="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer">
                  <span>✕</span>
                  <span>${t?"Reset Position & Search":"ล้างตำแหน่ง & คำค้นหา"}</span>
                </button>
              `:""}
            </div>
          `:e.map(n=>{const c=n.count/p*100;return`
            <div class="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
              <div class="flex items-center justify-between gap-2.5">
                <div class="flex items-center gap-2 min-w-0">
                  <img src="${this.getPlayerShirtUrl(n)}" alt="${this.escapeHtml(n.team)}" class="w-7 h-7 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='${i}';" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">${this.escapeHtml(n.name)}</span>
                      <span class="${d}">${this.escapeHtml(n.pos)}</span>
                      <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${this.escapeHtml(n.team)}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="text-xs font-mono font-bold text-slate-900 dark:text-white">${c.toFixed(1)}%</div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400">${n.count}/${p} ${t?"teams":"ทีม"}</div>
                </div>
              </div>

              <!-- Teams that picked this differential -->
              <div class="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">${t?"Owned by:":"ทีมที่ถือครอง:"}</span>
                ${n.teams.map(s=>`
                  <button onclick="app.openTeamModal(${s.entry_id})" class="text-[10px] px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-colors cursor-pointer truncate max-w-[130px]" title="${this.escapeHtml(s.player_name)}">
                    ${this.escapeHtml(s.team_name)}
                  </button>
                `).join("")}
              </div>
            </div>
          `}).join("")}getTransferPoolFromSuggestions(e){const t=e&&e.club_fx?e.club_fx:{};if(e&&Array.isArray(e.pool)&&e.pool.length>0)return e.pool.map(p=>({...p,fx:p.fx||t[p.team]||[]}));const a=[["GoalKeepers","GKP"],["Defenders","DEF"],["Midfielders","MID"],["Forwards","FWD"]],r=new Map;return a.forEach(([p,i])=>{(e&&Array.isArray(e[p])?e[p]:[]).forEach(d=>{[d&&d.ValuePlayer,d&&d.GoodPlayer].forEach(n=>{if(!n||!n.Id)return;const c=Number(n.Id),m=Number(n.Cost)||0,s=Number(n.ExpectedPoints)||0,o=Number(n.PercentMinutesRecentMatches)||0,l=n.ChanceOfPlaying!=null?Number(n.ChanceOfPlaying):100,g=r.get(c);(!g||s>g.xp1)&&r.set(c,{id:c,name:n.PlayerWebName||"-",team:n.TeamName||"PL",pos:i,cost:m,xp1:s,xp3:Number((s*2.85).toFixed(1)),val1:m>0?Number((s/m).toFixed(2)):Number(n.PlayerValue)||0,val3:m>0?Number((s*2.85/m).toFixed(2)):0,form:s,min_pct:o,chance:l,status:l===0?"i":l<100?"d":"a",sel_pct:0,src:"azure",fx:t[n.TeamName]||[]})})})}),Array.from(r.values())}renderFdrPills(e,t){const a=this.currentLang==="en",r=Array.isArray(e)?e:[];if(r.length===0)return"";let p=[];if(t==="1gw"){const c=r[0].gw;p=r.filter(m=>m.gw===c)}else p=r.slice(0,4);const d=t==="1gw"&&p.length>=2?'<span class="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80 text-[9.5px] font-mono font-bold">DGW</span>':"",n=p.map(c=>{if(c.bgw)return`<span class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 text-[10px] font-mono font-bold" title="${a?"Blank Gameweek":"สัปดาห์ไม่มีแข่ง"}">BGW</span>`;const m=Number(c.fdr)||3;let s="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";m<=2?s="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80":m>=4&&(s="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80");const o=this.escapeHtml(c.opp||"PL"),l=c.h?"H":"A";return`<span class="px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold tabular-nums ${s}" title="GW ${c.gw} • FDR ${m}">${o}(${l})</span>`}).join("");return`<span class="inline-flex items-center gap-1 flex-wrap">${d}${n}</span>`}computeSquadTransferAdvice(e,t,a,r,p){const i=this.currentLang==="en",d=Number(e);if(!d)return null;const n=this.data.squads?this.data.squads[`${d}_${r}`]||this.data.squads[`${d}_${p}`]:null;if(!n)return null;const c=String(r),m=String(p),o=(this.data.gameweeks&&this.data.gameweeks[c]&&this.data.gameweeks[c].results||this.data.gameweeks&&this.data.gameweeks[m]&&this.data.gameweeks[m].results||[]).find(W=>Number(W.entry_id)===d),l=o&&o.bank!=null?Number(o.bank):0,g=this.getTransferPoolFromSuggestions(t),y=t&&t.club_fx?t.club_fx:{},D=t&&t.squad_index?t.squad_index:{},h=new Map;g.forEach(W=>h.set(Number(W.id),W)),Object.keys(D).forEach(W=>{const P=D[W];P&&P.id&&!h.has(Number(P.id))&&h.set(Number(P.id),{...P,fx:P.fx||y[P.team]||[]})});const $=(n.starting||[]).map(W=>({...W,isStarter:!0})),v=(n.bench||[]).map(W=>({...W,isStarter:!1})),I=$.concat(v);if(I.length===0)return null;const L=new Set,k={};let x=0,C=0;const T=I.map(W=>{const P=Number(W.id);L.add(P);const u=h.get(P),N=u&&u.team||W.team||"PL";k[N]=(k[N]||0)+1;const w=u&&u.pos||W.pos||"MID",b=u&&u.status||"a",_=u&&u.chance!=null?Number(u.chance):100,S=u&&u.fx||y[N]||[];return b==="i"||b==="s"||b==="u"||b==="d"||_<75||S[0]&&S[0].bgw?C+=1:x+=1,{raw:W,pid:P,isStarter:W.isStarter,rec:u||{id:P,name:W.name||"Player",team:N,pos:w,cost:5,xp1:2,xp3:6,val1:.4,val3:1.2,min_pct:60,chance:100,status:"a",fx:S}}}),H=a==="3gw"?"xp3":"xp1",z=a==="3gw"?"val3":"val1",U=a==="3gw"?3.5:1.5,Q=[];return T.forEach(({pid:W,isStarter:P,rec:u})=>{const N=Number(u.cost)||0,w=Number(u[H])||0,b=u.fx||[],_=!!(b[0]&&b[0].bgw),S=b.slice(0,3),E=S.length>0?S.reduce((K,B)=>K+(Number(B.fdr)||3),0)/S.length:3;let A=0,F="",q="neutral";u.status==="i"||u.status==="s"||u.status==="u"||Number(u.chance)===0?(A=1,q="rose",F=i?`Out (${u.chance}%)`:`เจ็บ/แบน (${u.chance}%)`):u.status==="d"||Number(u.chance)<=50?(A=2,q="amber",F=i?`Doubtful (${u.chance}%)`:`เช็กฟิต (${u.chance}%)`):_?(A=3,q="rose",F=i?"Blank GW":"ไม่มีแข่ง (BGW)"):Number(u.min_pct)<30&&(P||N>=5)?(A=4,q="amber",F=i?`Low Mins (${u.min_pct}%)`:`ลงเล่นน้อย (${u.min_pct}%)`):(A=5,q="indigo",F=E>=3.65?i?"Tough Run / Upgrade":"โปรแกรมหนัก · อัปเกรดได้":i?"Higher xP Upgrade":"อัปเกรดแต้มคาดการณ์");const j=Number((N+l).toFixed(1)),R=g.filter(K=>K.pos!==u.pos||L.has(Number(K.id))||Number(K.cost)>j+.001||K.status!=="a"||K.chance!=null&&Number(K.chance)<75?!1:(k[K.team]||0)-(K.team===u.team?1:0)<3).map(K=>{const B=Number(((Number(K[H])||0)-w).toFixed(1));return{...K,gain:B,remBank:Number((j-Number(K.cost)).toFixed(1))}}).sort((K,B)=>B.gain-K.gain||Number(B[z])-Number(K[z]));if(R.length===0)return;const G=R[0].gain;A===5&&G<U||A<=4&&G<-.5||Q.push({sell:u,urgency:A,severity:q,reason:F,topGain:G,estBudget:j,alts:R.slice(0,3)})}),Q.sort((W,P)=>W.urgency-P.urgency||P.topGain-W.topGain),{bank:Number(l.toFixed(1)),healthyCount:x,flaggedCount:C,totalOwned:T.length,suggestions:Q.slice(0,3),rollFt:Q.length===0}}renderCompetitionTransfers(e,t,a){const r=this.currentLang==="en",p=document.getElementById("transfers-suggestions-section");if(!p)return;const d=(this.multiData.transfer_suggestions||{}).gw||a+1,n=this.getLeaderboardTeams(),m=(this.compTransferHorizon||"1gw")==="3gw"?`Gameweek ${d}–${d+2}`:`Gameweek ${d}`;p.innerHTML=`
          <!-- CARD 01: Personalized Smart Squad Advisor (Sell -> Buy) -->
          <div class="glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 sm:space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">01</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                    ${r?"Smart Squad Advisor (Sell → Buy)":"ผู้ช่วยวิเคราะห์ทีม (ขายใคร → ซื้อใคร)"}
                  </h3>
                  <button onclick="app.showProjectedPointsModal()" class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center text-[11px] font-bold cursor-pointer border border-slate-200 dark:border-slate-700" title="${r?"Methodology & FDR Guide":"วิธีคำนวณและสีความยากโปรแกรม"}" aria-label="${r?"Projected points methodology":"อธิบายวิธีคำนวณคะแนนคาดการณ์"}">?</button>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ${r?"Select your team to auto-diagnose injuries, tough fixtures, and best same-position replacements within your Bank (auto-saved on this device)":"เลือกทีมของคุณเพื่อสแกนจุดอ่อน 15 นักเตะ คำนวณงบ Bank และจับคู่ตัวแทนอัตโนมัติ (ระบบจำทีมที่คุณเลือกไว้ให้ในครั้งถัดไป)"}
                </p>
              </div>

              <!-- Team Selector -->
              <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <label for="comp-transfers-team-select" class="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  ${r?"My Squad:":"เลือกทีมวิเคราะห์:"}
                </label>
                <select 
                  id="comp-transfers-team-select" 
                  onchange="app.setCompTransferTeam(this.value)"
                  class="w-full sm:w-auto max-w-full min-h-[44px] sm:min-h-[40px] bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 cursor-pointer shadow-2xs"
                >
                  <option value="">${r?"-- Select a team to analyze (Full League Overview) --":"-- เลือกทีมเพื่อวิเคราะห์จุดอ่อน (ภาพรวมทั้งลีก) --"}</option>
                  ${n.map(s=>{const l=this.isPrizeEligible(s.entry_id)?`#${s.leaderboard_rank}`:r?"[Non-Prize]":"[ร่วมสนุก]";return`
                      <option value="${s.entry_id}" ${String(this.compTransferTeam)===String(s.entry_id)?"selected":""}>
                        ${l} ${this.escapeHtml(s.entry_name)} (${this.escapeHtml(s.player_name)})
                      </option>
                    `}).join("")}
                </select>
              </div>
            </div>

            <!-- Dynamic Advisor Body (or Quick-Pick Prompt when no team selected) -->
            <div id="comp-transfers-advisor-wrapper">
              <!-- Rendered by renderCompetitionTransfersOnly -->
            </div>
          </div>

          <!-- CARD 02: Ranked Transfer Recommendations (Hybrid xP & FDR) -->
          <div class="glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 sm:space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">02</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                    ${r?"Recommended Targets (Best Players & Best Value)":"จัดอันดับนักเตะแนะนำ (ตัวเลือกยอดเยี่ยม & สุดคุ้ม)"}
                  </h3>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ${r?"Compare 1 GW & 3 GWs projected points (xP), value per £m, upcoming fixture difficulty (FDR), and league ownership %":"เปรียบเทียบคะแนนคาดการณ์ 1 GW / 3 GWs (xP), แต้มต่อราคา, ความยากโปรแกรมแข่งขัน (FDR) และสัดส่วนถือครองในลีก"}
                </p>
              </div>
              <span id="comp-transfers-gw-badge" class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-bold font-display">
                ${m}
              </span>
            </div>

            <!-- Controls + Recommendation Grid -->
            <div id="comp-transfers-table-container" class="space-y-3 sm:space-y-4">
              <!-- Rendered by renderCompetitionTransfersOnly -->
            </div>
          </div>
        `,this.renderCompetitionTransfersOnly()}renderPlayerRecRow(e,t){const{isEn:a,horizon:r,xpKey:p,valKey:i,mode:d,totalTeams:n,pCounts:c,selectedTeamPlayerIds:m,compTransferTeam:s,defaultShirtUrl:o}=t,l=Number(e.id),g=m.has(l),y=c[l]?c[l].count:0,D=n>0?Math.round(y/n*100):0,h=this.getPlayerShirtUrl({pos:e.pos,team:e.team}),$=e.status!=="a"||Number(e.chance)<100?`<span class="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold ${e.status==="i"||e.status==="s"||e.status==="u"||Number(e.chance)<=25?"bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80":"bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80"}" title="${this.escapeHtml(e.news||"")}">${Number(e.chance)}%</span>`:"",v=s?g?`<span class="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">${a?"IN SQUAD":"ในทีม"}</span>`:"":`<span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono tabular-nums" title="${a?`Owned by ${y}/${n} teams in league`:`ถือครองในลีก ${y}/${n} ทีม`}">${a?`· ${D}% owned`:`· ลีก ${D}%`}</span>`,I=this.renderFdrPills(e.fx,r),L=Number(e.cost)%1===0?`${Number(e.cost)}m`:`${Number(e.cost).toFixed(1)}m`,k=Number(e[p]||0).toFixed(1),x=Number(e[i]||0).toFixed(2),C=d==="value"?`<span class="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">${x}/m</span>`:`<span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">£${L}</span>`;return`
          <div class="flex items-center justify-between gap-2.5 px-2.5 sm:px-3 py-2.5 rounded-xl border transition-colors ${g?"bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60":"bg-white dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800"}">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <img src="${h}" alt="${this.escapeHtml(e.team||"")}" class="w-6 h-6 sm:w-7 sm:h-7 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='${o}';" />
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-xs sm:text-[13px] ${g?"font-bold text-slate-900 dark:text-white":"font-semibold text-slate-800 dark:text-slate-100"} truncate max-w-[140px] sm:max-w-none" title="${this.escapeHtml(e.name||"")}">
                    ${this.escapeHtml(e.name||"-")}
                  </span>
                  <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">${this.escapeHtml(e.team||"")}</span>
                  ${$}
                  ${v}
                </div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  ${I}
                  <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400">${a?`${e.min_pct}% min`:`ลง ${e.min_pct}%`}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 text-right tabular-nums">
              ${d==="value"?`<div class="hidden sm:block text-right"><div class="text-[11px] font-mono text-slate-600 dark:text-slate-300">£${L}</div><div class="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">${x} xP/£</div></div>`:""}
              <div class="text-right min-w-[46px]">
                <div class="text-sm font-mono font-bold text-slate-900 dark:text-white leading-none">${k} <span class="text-[10px] font-medium text-slate-400">xP</span></div>
                <div class="mt-0.5 ${d==="value"?"sm:hidden":""}">${C}</div>
              </div>
            </div>
          </div>
        `}renderCompetitionTransfersOnly(){const e=this.currentLang==="en",t=this.getDefaultShirtUrl(),a=document.getElementById("comp-transfers-table-container");if(!a)return;const r=this.multiData.transfer_suggestions||{};if((!Array.isArray(r.pool)||r.pool.length===0)&&typeof this.ensureTransferSuggestionsData=="function"&&typeof window<"u"&&window.location&&window.location.protocol!=="file:"){this.ensureTransferSuggestionsData().then(_=>{_&&(this.activeTab==="transfer-advisor-view"||this.activeTab==="transfers-view")&&this.renderCurrentTab(!0)});const w=e?"Loading transfer recommendations & Hybrid xP...":"กำลังโหลดข้อมูลแนะนำการย้ายตัวและคะแนนคาดการณ์ Hybrid xP...",b=document.getElementById("comp-transfers-advisor-wrapper");b&&(b.innerHTML=`<div class="py-6 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">${w}</div>`),a.innerHTML=`<div class="py-8 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">${w}</div>`;return}const p=this.getLeaderboardTeams(),i=p.length,d=this.selectedGW,n=Number(this.multiData.max_gw)||d,c=this.cachedPlayerCounts||{},m=this.compTransferHorizon||"1gw",s=this.compTransferMode||"dual",o=this.compTransferPos||"ALL",l=this.compTransferMaxCost||"ALL",g=!!(this.compTransferHideOwned&&this.compTransferTeam),y=m==="3gw"?"xp3":"xp1",D=m==="3gw"?"val3":"val1",h=r.gw||d+1,$=document.getElementById("comp-transfers-gw-badge");$&&($.innerText=m==="3gw"?`Gameweek ${h}–${h+2}`:`Gameweek ${h}`);const v=this.getTransferPoolFromSuggestions(r);if(v.length===0){a.innerHTML=`
            <div class="py-8 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <span class="text-3xl block mb-2">⏳</span>
              <p class="font-bold text-sm text-slate-700 dark:text-slate-300">${e?"Processing transfer recommendations for upcoming Gameweek":"กำลังประมวลผลรายการแนะนำการย้ายตัวสำหรับ Gameweek ถัดไป"}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${e?"Best Players and Best Value lists will appear automatically once fixtures and player data are updated":"ระบบจะแสดงรายชื่อตัวเลือกยอดเยี่ยมและตัวเลือกสุดคุ้มค่าอัตโนมัติเมื่อข้อมูลโปรแกรมแข่งขันและสถิติอัปเดตเรียบร้อย"}</p>
            </div>
          `;return}let I=new Set,L="";if(this.compTransferTeam){const w=Number(this.compTransferTeam),b=p.find(S=>Number(S.entry_id)===w);b&&(L=b.entry_name);const _=this.data.squads?this.data.squads[`${w}_${d}`]||this.data.squads[`${w}_${n}`]:null;_&&(_.starting||[]).concat(_.bench||[]).forEach(S=>I.add(Number(S.id)))}let k="";if(this.compTransferTeam){const w=this.computeSquadTransferAdvice(this.compTransferTeam,r,m,d,n);if(w){const b=this.compAdvisorAltIdx||{},_=Number(w.bank).toFixed(1),S=w.flaggedCount>0?e?`${w.healthyCount}/${w.totalOwned} Fit · ${w.flaggedCount} Flagged`:`พร้อมลง ${w.healthyCount}/${w.totalOwned} · เฝ้าระวัง ${w.flaggedCount}`:e?`${w.healthyCount}/${w.totalOwned} Fit`:`พร้อมลงครบ ${w.healthyCount}/${w.totalOwned}`,E=w.rollFt?`
                <div class="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/70 px-3.5 py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div class="space-y-0.5">
                    <div class="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200">
                      ${e?"Squad Looks Strong — Consider Rolling Free Transfer":"ทีมสภาพพร้อมมาก — แนะนำเก็บ Free Transfer ไว้สัปดาห์หน้า"}
                    </div>
                    <p class="text-[11px] text-emerald-700/90 dark:text-emerald-300/80">
                      ${e?"No injured/blank starters and no single-transfer swap clears the xP gain threshold.":"ไม่มีตัวหลักบาดเจ็บ/ไม่มีแข่ง และยังไม่มีตัวเปลี่ยนที่เพิ่มแต้มคาดการณ์คุ้มค่าพอจะเสียสิทธิ์ฟรี"}
                    </p>
                  </div>
                </div>
              `:`
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  ${w.suggestions.map(A=>{const F=A.sell,q=Math.min(A.alts.length-1,Math.max(0,Number(b[String(F.id)]||0))),j=A.alts[q],R=this.getPlayerShirtUrl({pos:F.pos,team:F.team}),G=this.getPlayerShirtUrl({pos:j.pos,team:j.team}),K=A.severity==="rose"?"bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80":A.severity==="amber"?"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80":"bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80",B=c[j.id]?c[j.id].count:0,Y=i>0?Math.round(B/i*100):0,X=j.gain>=0?`+${j.gain.toFixed(1)}`:j.gain.toFixed(1);return`
                      <div class="rounded-xl bg-white dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-700/80 p-3 flex flex-col justify-between gap-2.5">
                        <!-- SELL ROW -->
                        <div class="space-y-1.5">
                          <div class="flex items-center justify-between gap-2">
                            <span class="px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold ${K}">${this.escapeHtml(A.reason)}</span>
                            <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">${F.pos} · £${Number(F.cost).toFixed(1)}m</span>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 min-w-0">
                              <img src="${R}" alt="${this.escapeHtml(F.team)}" class="w-5 h-5 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='${t}';" />
                              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate" title="${this.escapeHtml(F.name)}">${this.escapeHtml(F.name)}</span>
                            </div>
                            <span class="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums flex-shrink-0">${Number(F[y]||0).toFixed(1)} xP</span>
                          </div>
                          ${F.news?`<p class="text-[10px] text-slate-500 dark:text-slate-400 truncate" title="${this.escapeHtml(F.news)}">${this.escapeHtml(F.news)}</p>`:""}
                        </div>

                        <!-- SWAP BRIDGE -->
                        <div class="flex items-center justify-between gap-2 py-1 border-y border-dashed border-slate-200 dark:border-slate-800 text-[10.5px] font-mono">
                          <span class="text-slate-500 dark:text-slate-400 font-bold">SELL → BUY</span>
                          <span class="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-bold tabular-nums">
                            ${X} xP
                          </span>
                          <span class="text-slate-500 dark:text-slate-400 tabular-nums">${e?`£${j.remBank.toFixed(1)}m left`:`เหลือ £${j.remBank.toFixed(1)}m`}</span>
                        </div>

                        <!-- BUY ROW -->
                        <div class="space-y-1.5">
                          <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 min-w-0">
                              <img src="${G}" alt="${this.escapeHtml(j.team)}" class="w-6 h-6 object-contain flex-shrink-0" onerror="this.onerror=null; this.src='${t}';" />
                              <div class="min-w-0">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                  <span class="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">${this.escapeHtml(j.name)}</span>
                                  <span class="text-[10px] font-mono text-slate-400">${this.escapeHtml(j.team)}</span>
                                  <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400" title="${e?`Owned by ${B}/${i} teams in league`:`ถือครองในลีก ${B}/${i} ทีม`}">${e?`· ${Y}% owned`:`· ลีก ${Y}%`}</span>
                                </div>
                              </div>
                            </div>
                            <div class="text-right tabular-nums flex-shrink-0">
                              <div class="text-xs sm:text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">${Number(j[y]||0).toFixed(1)} xP</div>
                              <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400">£${Number(j.cost).toFixed(1)}m</div>
                            </div>
                          </div>
                          <div>${this.renderFdrPills(j.fx,m)}</div>
                        </div>

                        <!-- ALTERNATIVE OPTIONS -->
                        ${A.alts.length>1?`
                          <div class="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
                            ${A.alts.map((M,V)=>`
                              <button
                                onclick="app.setCompAdvisorAlt(${F.id}, ${V})"
                                class="px-2.5 py-1 min-h-[44px] sm:min-h-[32px] rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${V===q?"bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}"
                              >
                                #${V+1} ${this.escapeHtml(M.name)} £${Number(M.cost).toFixed(1)}m
                              </button>
                            `).join("")}
                          </div>
                        `:""}
                      </div>
                    `}).join("")}
                </div>
              `;k=`
              <div id="comp-transfers-advisor" class="space-y-2.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-slate-900 dark:text-white font-display">
                      ${e?`Squad Diagnosis — ${this.escapeHtml(L)}`:`ผลวิเคราะห์ขุมกำลัง — ${this.escapeHtml(L)}`}
                    </span>
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 tabular-nums">
                      Bank £${_}m
                    </span>
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${w.flaggedCount>0?"bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800":"bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"}">
                      ${S}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[10.5px] text-slate-500 dark:text-slate-400">
                      ${e?"Est. budget = current price + bank · Max 3/club enforced":"งบประมาณ = ราคาปัจจุบัน + Bank · เช็กกฎไม่เกิน 3 คน/สโมสร"}
                    </span>
                    <button
                      type="button"
                      onclick="app.setCompTransferTeam('')"
                      class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 cursor-pointer"
                    >
                      ${e?"Clear Team":"สลับกลับภาพรวมลีก"}
                    </button>
                  </div>
                </div>
                ${E}
              </div>
            `}}else{const w=p.slice(0,5);k=`
            <div id="comp-transfers-advisor-empty" class="rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  ${e?"Choose a squad above or tap a quick-pick team below to generate personalized Sell → Buy advice":'เลือกทีมจากเมนูด้านบน หรือกดปุ่มลัดด้านล่างเพื่อดูแผน "ขายใคร → ซื้อใคร" เฉพาะทีมทันที'}
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  ${e?"Your selected team is remembered automatically on this device for your next visit.":"เมื่อเลือกแล้ว ระบบจะจำทีมของคุณไว้ในเครื่องอัตโนมัติ เปิดเข้ามาครั้งหน้าเห็นแผนทันที"}
                </p>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                ${w.map(b=>{const S=this.isPrizeEligible(b.entry_id)?`#${b.leaderboard_rank}`:"";return`
                    <button
                      type="button"
                      onclick="app.setCompTransferTeam('${b.entry_id}')"
                      class="min-h-[40px] sm:min-h-[34px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      ${S?`<span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${S}</span> `:""}${this.escapeHtml(b.entry_name)}
                    </button>
                  `}).join("")}
              </div>
            </div>
          `}const x=document.getElementById("comp-transfers-advisor-wrapper");x&&(x.innerHTML=k);const C="bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold",T="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium",H=s==="dual"?"best":s,z=`
          <div id="comp-transfers-controls" class="space-y-2">
            <!-- Row 1: Horizon + Mode Switcher -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="inline-flex w-full sm:w-auto items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-xs border border-slate-200/80 dark:border-slate-700/60">
                <button onclick="app.setCompTransferHorizon('1gw')" class="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg transition-all cursor-pointer ${m==="1gw"?C:T}">
                  ${e?"Next GW (1 GW)":"นัดถัดไป (1 GW)"}
                </button>
                <button onclick="app.setCompTransferHorizon('3gw')" class="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg transition-all cursor-pointer ${m==="3gw"?C:T}">
                  ${e?"Next 3 GWs":"ระยะ 3 นัด (3 GWs)"}
                </button>
              </div>

              <!-- Desktop (>= lg) Mode Tabs -->
              <div class="hidden lg:inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-xs border border-slate-200/80 dark:border-slate-700/60">
                <button onclick="app.setCompTransferMode('dual')" class="min-h-[36px] px-3 py-1.5 rounded-lg transition-all cursor-pointer ${s==="dual"||s==="best"||s==="value"?C:T}">
                  ${e?"Best vs Value":"ยอดเยี่ยม & สุดคุ้ม"}
                </button>
                <button onclick="app.setCompTransferMode('diff')" class="min-h-[36px] px-3 py-1.5 rounded-lg transition-all cursor-pointer ${s==="diff"?C:T}">
                  ${e?"Differentials (<20%)":"ตัวทีเด็ด (<20%)"}
                </button>
              </div>

              <!-- Mobile / Tablet (< lg) Mode Tabs -->
              <div id="comp-transfers-mobile-btns" class="lg:hidden flex w-full sm:w-auto items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-xs border border-slate-200/80 dark:border-slate-700/60">
                <button onclick="app.setCompTransferMode('best')" class="flex-1 min-h-[44px] sm:min-h-[38px] py-1.5 px-2.5 rounded-lg text-center transition-all cursor-pointer ${H==="best"?C:T}">
                  ${e?"Best":"ยอดเยี่ยม"}
                </button>
                <button onclick="app.setCompTransferMode('value')" class="flex-1 min-h-[44px] sm:min-h-[38px] py-1.5 px-2.5 rounded-lg text-center transition-all cursor-pointer ${H==="value"?C:T}">
                  ${e?"Value":"สุดคุ้ม"}
                </button>
                <button onclick="app.setCompTransferMode('diff')" class="flex-1 min-h-[44px] sm:min-h-[38px] py-1.5 px-2.5 rounded-lg text-center transition-all cursor-pointer ${H==="diff"?C:T}">
                  ${e?"Diff (<20%)":"ทีเด็ด (<20%)"}
                </button>
              </div>
            </div>

            <!-- Row 2: Position + Max Price + Hide Owned -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-1 flex-wrap">
                ${["ALL","GKP","DEF","MID","FWD"].map(w=>`
                    <button
                      onclick="app.setCompTransferPos('${w}')"
                      class="min-h-[44px] sm:min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${o===w?"bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 font-bold":"bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}"
                    >
                      ${w==="ALL"?e?"All":"ทั้งหมด":w}
                    </button>
                  `).join("")}
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <select
                  id="comp-transfers-max-cost"
                  onchange="app.setCompTransferMaxCost(this.value)"
                  aria-label="${e?"Maximum price filter":"กรองงบสูงสุด"}"
                  class="min-h-[44px] sm:min-h-[36px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="ALL" ${l==="ALL"?"selected":""}>${e?"Any Price":"ทุกงบประมาณ"}</option>
                  <option value="5.5" ${l==="5.5"?"selected":""}>≤ £5.5m</option>
                  <option value="7.5" ${l==="7.5"?"selected":""}>≤ £7.5m</option>
                  <option value="9.5" ${l==="9.5"?"selected":""}>≤ £9.5m</option>
                </select>

                ${this.compTransferTeam?`
                  <button
                    id="comp-transfers-hide-owned"
                    onclick="app.toggleCompTransferHideOwned()"
                    class="min-h-[44px] sm:min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${g?"bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold":"bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}"
                  >
                    ${g?e?"✓ Hiding Owned":"✓ ซ่อนตัวในทีม":e?"Hide Owned":"ซ่อนตัวในทีม"}
                  </button>
                `:""}
              </div>
            </div>
          </div>
        `,U=l==="ALL"?999:Number(l),Q=v.filter(w=>!(o!=="ALL"&&w.pos!==o||Number(w.cost)>U+.001||g&&I.has(Number(w.id)))),W=Q.filter(w=>{const b=c[w.id]?c[w.id].count:0;return(i>0?b/i*100:Number(w.sel_pct||0))<20}),P=[{pos:"GKP",title:e?"Goalkeepers":"ผู้รักษาประตู (GKP)",cap:o==="ALL"?2:10},{pos:"DEF",title:e?"Defenders":"กองหลัง (DEF)",cap:o==="ALL"?5:10},{pos:"MID",title:e?"Midfielders":"กองกลาง (MID)",cap:o==="ALL"?5:10},{pos:"FWD",title:e?"Forwards":"กองหน้า (FWD)",cap:o==="ALL"?3:10}].filter(w=>o==="ALL"||w.pos===o),u=(w,b,_)=>{let S="",E=0;return P.forEach(A=>{const F=w.filter(q=>q.pos===A.pos).sort((q,j)=>Number(j[b])-Number(q[b])||Number(j[y])-Number(q[y])).slice(0,A.cap);F.length!==0&&(E+=F.length,S+=`
              <div class="space-y-1.5">
                <div class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pt-1">
                  ${this.escapeHtml(A.title)}
                </div>
                <div class="space-y-1.5">
                  ${F.map(q=>this.renderPlayerRecRow(q,{isEn:e,horizon:m,xpKey:y,valKey:D,mode:_,totalTeams:i,pCounts:c,selectedTeamPlayerIds:I,compTransferTeam:this.compTransferTeam,defaultShirtUrl:t})).join("")}
                </div>
              </div>
            `)}),E===0?`
              <div class="py-6 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <p class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  ${e?"No players match the current filters.":"ไม่พบนักเตะที่ตรงกับเงื่อนไขฟิลเตอร์"}
                </p>
                <button onclick="app.resetCompTransferFilters()" class="px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold cursor-pointer">
                  ${e?"Reset Filters":"รีเซ็ตฟิลเตอร์"}
                </button>
              </div>
            `:S};let N="";if(s==="diff")N=`
            <div class="space-y-2">
              <div class="flex items-center justify-between px-1">
                <span class="text-xs font-bold text-slate-900 dark:text-white font-display">
                  ${e?"League Differentials (<20% Owned)":"ตัวทีเด็ดในลีก (ถือครอง < 20%)"}
                </span>
                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">${m==="3gw"?e?"Sorted by 3-GW xP":"เรียงตาม 3-GW xP":e?"Sorted by 1-GW xP":"เรียงตาม 1-GW xP"}</span>
              </div>
              <div class="space-y-3">
                ${u(W,y,"best")}
              </div>
            </div>
          `;else{const w=u(Q,y,"best"),b=u(Q,D,"value");N=`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="${H==="best"?"space-y-2":"hidden lg:block space-y-2"}">
                <div class="flex items-center justify-between px-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span class="text-xs font-bold text-slate-900 dark:text-white font-display uppercase tracking-wide">
                    ${e?"Best Players (Top xP)":"ตัวเลือกยอดเยี่ยม (xP สูงสุด)"}
                  </span>
                  <span class="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">${m==="3gw"?"3 GWs":"1 GW"}</span>
                </div>
                <div class="space-y-2.5">${w}</div>
              </div>

              <div class="${H==="value"?"space-y-2":"hidden lg:block space-y-2"}">
                <div class="flex items-center justify-between px-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span class="text-xs font-bold text-slate-900 dark:text-white font-display uppercase tracking-wide">
                    ${e?"Best Value (xP / £)":"ตัวเลือกสุดคุ้ม (แต้มต่อราคา)"}
                  </span>
                  <span class="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">${m==="3gw"?"3 GWs":"1 GW"}</span>
                </div>
                <div class="space-y-2.5">${b}</div>
              </div>
            </div>
          `}a.innerHTML=`${x?"":k}${z}${N}`}renderPrizesView(){const e=this.currentLang==="en",t=document.getElementById("prizes-overview-title"),a=document.getElementById("prizes-overview-subtitle"),r=document.getElementById("prizes-pool-badge"),p=document.getElementById("prizes-league-badge"),i=document.getElementById("prizes-main-content"),d=document.getElementById("prizes-overview-tag"),n=document.getElementById("prizes-top-banner"),c=!!(this.config&&this.config.features&&(this.config.features.prize_model==="annual_zero_sum"||this.config.features.prize_model==="annual"));n&&n.classList.remove("hidden");const m=Number(this.multiData.max_gw)||2,s=this.data.gameweeks?this.data.gameweeks[String(m)]:null,o=!!(s&&s.is_finished),l=s?s.is_started!==void 0?!!s.is_started:!!s.is_finished||s.results&&s.results.some(I=>I.points>0):!1,g=!!(this.isLiveMatchday||this.liveData&&this.liveData.isLive||this.isLiveWindowActive&&this.isLiveWindowActive()||l&&!o),y=this.liveData&&(this.liveData.currentGw||this.liveData.liveGw)||(g&&!o?m:m+1),D=o?m:Math.max(1,m-1);if(d&&(g?d.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10.5px] font-mono font-bold"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>${e?`GW ${y} IN-PLAY (LIVE)`:`กำลังแข่งขัน GW ${y} (LIVE)`}</span>`:d.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10.5px] font-mono font-bold">✓ ${e?`OFFICIAL SETTLED • GW 1 - ${D}`:`สรุปยอดทางการ • GW 1 - ${D}`}</span>`),t&&(t.innerText=e?"Prize Money & Treasury Ledger":"สรุปเงินรางวัล & บัญชีกองกลาง"),a&&(g?a.innerText=e?`GW ${y} in-play • Payouts officially settled after final match • Current ledger finalized for GW 1 - ${D}`:`กำลังแข่งขัน GW ${y} • ยอดเงินรางวัลจะตัดรอบอย่างเป็นทางการหลังจบคู่สุดท้าย • ยอดบัญชีปัจจุบันบันทึกถึง GW 1 - ${D}`:a.innerText=e?`Official prize ledger finalized across completed Gameweeks 1 - ${D}`:`ตารางสรุปเงินรางวัลทางการ ตัดรอบเรียบร้อยตามผลการแข่งขัน GW 1 - ${D}`),p){const I=(this.data.teams||[]).length;p.className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1 rounded-xl font-semibold font-display",p.innerText=e?`${I} Members`:`สมาชิก ${I} ทีม`}const h=this.getLeagueCurrency(),$=this.config&&this.config.features||{},v=$.prize_model==="weekly"||$.prize_model==="penalties"||!!$.has_weekly_penalties;if(r){const I=e?this.config.total_pool_en||this.config.total_pool:this.config.total_pool;let L=I&&String(I).trim()!=="-"?String(I).trim():"";L||(c?L=e?`Zero-Sum (3,100 ${h.code})`:`Zero-Sum (ดุล 3,100 ${h.code})`:v?L=`${(Number($.weekly_prize_amount||300)*38).toLocaleString()} ${h.code}`:$.prize_model==="monthly"?L=`${(Number($.monthly_prize_amount||Number($.monthly_champion_prize??600)+Number($.monthly_runner_up_prize??400))*this.getMonthlySchedule().length).toLocaleString()} ${h.code}`:L=e?"Prize Pool":"เงินรางวัล"),r.className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1 rounded-xl font-bold font-display shadow-2xs",r.innerText=L}if(v){const I=this.config.features.weekly_prizes,L=!!(this.config.features&&this.config.features.has_weekly_penalties),k=!!(I&&Object.keys(I).length>1),x=I?Object.values(I).map(Number):[this.config.features.weekly_prize_amount!==void 0?Number(this.config.features.weekly_prize_amount):L?200:300],C=x.reduce((te,ne)=>te+ne,0),T=C*38,H=L?this.getWeeklyPenaltyTiers():[600,500,400,300,200],z=H.length,U=H.reduce((te,ne)=>te+ne,0),Q=this.config.features.weekly_prize_amount!==void 0?Number(this.config.features.weekly_prize_amount):200,W=U-Q,P=W*38,u={},N={},w={},b={},_={},S=[],E=[];let A=0;(this.data.teams||[]).forEach(te=>{u[te.entry_id]=0,N[te.entry_id]=0,w[te.entry_id]={1:0,2:0,3:0},b[te.entry_id]=0,_[te.entry_id]=0});for(let te=1;te<=m;te++){const ne=this.data.gameweeks?this.data.gameweeks[String(te)]:null;if(ne&&ne.results&&ne.is_finished){A++;const he=ne.results.filter(we=>this.isPrizeEligible(we.entry_id)),fe=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),me=[...he].sort((we,be)=>{const ve=be.net_points-we.net_points;return ve!==0?ve:fe?this.compareTeamPlayerScores(we.entry_id,be.entry_id,te):0});if(me.length>0)if(L){const we=this.calculateWeeklyTierPrizes(me,[Q],te);we.forEach(ge=>{u[ge.entry_id]=(u[ge.entry_id]||0)+1/ge.jointCount,N[ge.entry_id]=(N[ge.entry_id]||0)+ge.prize});const be=we&&we.length>0?we:[me[0]],ve=be[0],Le=this.calculateWeeklyPenalties(me,te),Ee=[];Le.forEach(ge=>{b[ge.entry_id]=(b[ge.entry_id]||0)+ge.fine,_[ge.entry_id]=(_[ge.entry_id]||0)+1,Ee.push({rankLabel:ge.rankLabel,fine:ge.fine,team_name:ge.team_name,player_name:ge.player_name,net_points:ge.net_points,entry_id:ge.entry_id,bottomTierIndex:ge.bottomTierIndex})}),E.push({gw:te,winner:ve,winners:be,bottomList:Ee,netPot:W})}else{const we=this.calculateWeeklyTierPrizes(me,x,te);k&&S.push({gw:te,payouts:we}),we.forEach(be=>{u[be.entry_id]===void 0&&(u[be.entry_id]=0,N[be.entry_id]=0,w[be.entry_id]={1:0,2:0,3:0}),be.rank===1&&(u[be.entry_id]+=1/be.jointCount),w[be.entry_id][be.rank]=(w[be.entry_id][be.rank]||0)+1/be.jointCount,N[be.entry_id]+=be.prize})}}}const F={};(this.data.teams||[]).forEach(te=>{F[Number(te.entry_id)]=te}),Object.values(this.data.departed_teams||{}).forEach(te=>{const ne=Number(te&&te.entry_id);!ne||F[ne]||this.isDepartedNonPrize(ne)||(F[ne]={entry_id:ne,entry_name:te.entry_name||`Team ${ne}`,player_name:te.player_name||""})});const q=Object.values(F).sort((te,ne)=>{const he=this.isPrizeEligible(te.entry_id)?1:0,fe=this.isPrizeEligible(ne.entry_id)?1:0;if(he!==fe)return fe-he;const me=this.isTeamDeparted(te.entry_id)?1:0,we=this.isTeamDeparted(ne.entry_id)?1:0;if(me!==we)return me-we;if(L){const be=(N[te.entry_id]||0)-(b[te.entry_id]||0),ve=(N[ne.entry_id]||0)-(b[ne.entry_id]||0);return ve!==be?ve-be:(u[ne.entry_id]||0)!==(u[te.entry_id]||0)?(u[ne.entry_id]||0)-(u[te.entry_id]||0):(b[te.entry_id]||0)-(b[ne.entry_id]||0)}return(N[ne.entry_id]||0)!==(N[te.entry_id]||0)?(N[ne.entry_id]||0)-(N[te.entry_id]||0):k?(w[ne.entry_id]?.[1]||0)!==(w[te.entry_id]?.[1]||0)?(w[ne.entry_id]?.[1]||0)-(w[te.entry_id]?.[1]||0):(w[ne.entry_id]?.[2]||0)!==(w[te.entry_id]?.[2]||0)?(w[ne.entry_id]?.[2]||0)-(w[te.entry_id]?.[2]||0):(w[ne.entry_id]?.[3]||0)-(w[te.entry_id]?.[3]||0):(u[ne.entry_id]||0)-(u[te.entry_id]||0)});let j=0,R=0,G=0,K=0,B=0,Y=0,X=0;const M={};let V=0;q.forEach(te=>{this.isPrizeEligible(te.entry_id)&&(V+=1,M[te.entry_id]=V,j+=u[te.entry_id]||0,R+=N[te.entry_id]||0,G+=b[te.entry_id]||0,K+=_[te.entry_id]||0,k&&(B+=w[te.entry_id]?.[1]||0,Y+=w[te.entry_id]?.[2]||0,X+=w[te.entry_id]?.[3]||0))});const Z=Math.round(j*100)/100,O=Math.abs(Z-Math.round(Z))<1e-9?Math.round(Z):Z.toFixed(1),ae=(this.prizesSearchQuery||"").toLowerCase().trim(),de=this.prizesFilterMode||"all",oe=q.filter(te=>{if(ae){const be=(te.entry_name||"").toLowerCase().includes(ae),ve=(te.player_name||"").toLowerCase().includes(ae);if(!be&&!ve)return!1}const ne=this.isPrizeEligible(te.entry_id),he=u[te.entry_id]||0,fe=N[te.entry_id]||0,me=b[te.entry_id]||0,we=fe-me;return de==="winners"?ne&&(fe>0||he>0||L&&we>0):de==="fined"?ne&&(me>0||we<0):de==="non_prize"?!ne:!0});let ue="",_e=!1;oe.length===0&&(ue=`
              <tr>
                <td colspan="${L?7:k?6:4}" class="py-10 px-4 text-center">
                  <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <svg class="w-6 h-6 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <p class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                      ${e?`No teams found matching "${this.escapeHtml(ae)}"`:`ไม่พบทีมที่ตรงกับคำค้นหา "${this.escapeHtml(ae)}"`}
                    </p>
                    <button type="button" onclick="app.handlePrizesSearch(''); app.setPrizesFilter('all');" class="mt-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                      ${e?"Clear Search & Filter":"ล้างการค้นหาและตัวกรอง"}
                    </button>
                  </div>
                </td>
              </tr>
            `),oe.forEach((te,ne)=>{const he=this.isPrizeEligible(te.entry_id),fe=u[te.entry_id]||0,me=N[te.entry_id]||0,we=b[te.entry_id]||0,be=_[te.entry_id]||0,ve=me-we;!he&&!_e&&de==="all"&&(_e=!0,ue+=`
                <tr>
                  <td colspan="${L?7:k?6:4}" class="pt-3 pb-1.5 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    ${e?"Guest Teams (Excluded from prize & fine calculation)":"ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัลและค่าปรับ)"}
                  </td>
                </tr>
              `);const Le=he?fe%1===0?fe:fe.toFixed(1):"-",Ee=he?me>0?`<span class="font-mono font-bold tabular-nums text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">+${me.toLocaleString()} <span class="text-[10px] font-normal opacity-75">${h.code}</span></span>`:`<span class="font-mono text-slate-400 dark:text-slate-500 text-xs sm:text-sm tabular-nums">0 ${h.code}</span>`:`<span class="text-slate-400 font-mono text-xs">${e?"Guest":"ร่วมสนุก"}</span>`;let ge="";if(L){const He=he?fe>0?`<span class="font-mono font-bold tabular-nums text-xs text-slate-900 dark:text-white">${Le}</span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">-</span>':"-",De=he?be>0?`<span class="font-mono font-bold tabular-nums text-xs text-rose-600 dark:text-rose-400">${be}</span>`:`<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">${e?"Safe":"รอด"}</span>`:"-",je=he?we>0?`<span class="inline-flex items-baseline justify-end font-mono font-bold text-xs text-rose-600 dark:text-rose-400"><span class="text-[10px] font-normal opacity-70 mr-0.5">-${h.symbol}</span><span class="tabular-nums">${we.toLocaleString()}</span></span>`:`<span class="text-slate-400 dark:text-slate-500 font-mono text-xs"><span class="text-[10px] font-normal mr-0.5">${h.symbol}</span>0</span>`:"-",ze=he?me>0?`<span class="inline-flex items-baseline justify-end font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400"><span class="text-[10px] font-normal opacity-70 mr-0.5">+${h.symbol}</span><span class="tabular-nums">${me.toLocaleString()}</span></span>`:`<span class="text-slate-400 dark:text-slate-500 font-mono text-xs"><span class="text-[10px] font-normal mr-0.5">${h.symbol}</span>0</span>`:"-",Ge=he?ve>0?`<span class="inline-flex items-baseline font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400"><span class="text-[10px] font-normal opacity-75 mr-0.5">+${h.symbol}</span><span class="tabular-nums">${ve.toLocaleString()}</span></span>`:ve<0?`<span class="inline-flex items-baseline font-mono font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400"><span class="text-[10px] font-normal opacity-75 mr-0.5">-${h.symbol}</span><span class="tabular-nums">${Math.abs(ve).toLocaleString()}</span></span>`:`<span class="font-mono text-xs sm:text-sm text-slate-400 dark:text-slate-500"><span class="text-[10px] font-normal mr-0.5">${h.symbol}</span>0</span>`:`<span class="text-slate-400 font-mono text-xs">${e?"Guest":"ร่วมสนุก"}</span>`;ge=`
                <td class="py-2.5 px-2 text-center font-display">${He}</td>
                <td class="py-2.5 px-2 text-center font-display">${De}</td>
                <td class="py-2.5 px-3 text-right font-display">${je}</td>
                <td class="py-2.5 px-3 text-right font-display">${ze}</td>
                <td class="py-2.5 px-3 text-right font-display">${Ge}</td>
              `}else if(k){const He=w[te.entry_id]?.[1]||0,De=w[te.entry_id]?.[2]||0,je=w[te.entry_id]?.[3]||0,ze=(Ge,qe)=>{if(!he)return'<span class="text-slate-400 font-mono text-xs">-</span>';if(Ge===0)return'<span class="text-slate-400 dark:text-slate-500 font-mono text-xs">-</span>';const Ue=Ge%1===0?Ge:Ge.toFixed(1);return qe===1?`<span class="font-mono font-black tabular-nums text-xs text-slate-900 dark:text-white">${Ue}</span>`:`<span class="font-mono font-bold tabular-nums text-xs text-slate-700 dark:text-slate-300">${Ue}</span>`};ge=`
                <td class="py-2.5 px-2 text-center font-display">${ze(He,1)}</td>
                <td class="py-2.5 px-2 text-center font-display">${ze(De,2)}</td>
                <td class="py-2.5 px-2 text-center font-display">${ze(je,3)}</td>
                <td class="py-2.5 px-3 text-right font-display">${Ee}</td>
              `}else ge=`
                <td class="py-2.5 px-3 text-center font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200 text-xs">${Le}</td>
                <td class="py-2.5 px-3 text-right font-display">${Ee}</td>
              `;const We=this.isTeamDeparted(te.entry_id),Pe=M[te.entry_id]||ne+1;let Te="";he?We?Te=this.getDepartedRankBadge():Pe===1?Te='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-2xs">1</span>':Pe===2?Te='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-xs">2</span>':Pe===3?Te='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/80 text-white font-bold text-xs">3</span>':Te=`<span class="text-xs font-bold text-slate-500 dark:text-slate-400 font-display">${Pe}</span>`:Te=this.getNonPrizeRankBadge(),ue+=`
              <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer ${!he||We?"is-non-prize opacity-70":""}">
                <td class="sticky-col-rank py-2.5 px-2 text-center font-display">${Te}</td>
                <td class="sticky-col-team py-2.5 px-3 min-w-[140px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="event.stopPropagation(); app.openTeamModal(${te.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate max-w-[125px] xs:max-w-[175px] sm:max-w-none">${this.escapeHtml(te.entry_name)}</button>
                    ${this.getPrizeBadge(te.entry_id)}
                    ${We?this.getDepartedBadge(te.entry_id):""}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(te.player_name)}</div>
                </td>
                ${ge}
              </tr>
            `});let ce="";this.config.settlement_phases&&this.config.settlement_phases.forEach(te=>{const ne=(te.gws||"").replace(/GW/gi,"").split("-"),he=parseInt(ne[0])||1,fe=parseInt(ne[1])||6,me=[];let we=0,be=0;for(let Pe=he;Pe<=fe;Pe++){const Te=this.data.gameweeks?this.data.gameweeks[String(Pe)]:null;if(Te&&Te.results&&Te.is_finished){be++;const He=[...Te.results.filter(De=>this.isPrizeEligible(De.entry_id))].sort((De,je)=>je.net_points-De.net_points);if(He.length>0){const De=He[0].net_points,je=He.filter(Ge=>Ge.net_points===De),ze=(this.config.features.weekly_prize_amount||300)/je.length;je.forEach(Ge=>{me.push({gw:Pe,entry_id:Ge.entry_id,team_name:Ge.team_name,player_name:Ge.player_name,amount:ze,is_joint:je.length>1}),we+=ze})}}}const ve=be>=fe-he+1,Le=m>=he&&!ve;let Ee="";ve?Ee=`<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0">${e?"Settled":"จบรอบแล้ว"}</span>`:Le?Ee=`<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex-shrink-0">${e?"In Progress":"กำลังแข่งขัน"}</span>`:Ee=`<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex-shrink-0">${e?"Upcoming":"รอการแข่งขัน"}</span>`;let ge="";me.length>0?ge=`
                  <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <div class="text-[10px] font-bold text-slate-400 uppercase font-display">${e?"Winners this window:":"สรุปทีมที่ได้รับเงินรางวัลรอบนี้:"}</div>
                    ${me.map(Pe=>`
                      <div class="flex items-center justify-between text-xs py-0.5">
                        <div class="truncate pr-2">
                          <span class="font-bold text-slate-900 dark:text-white">${this.escapeHtml(Pe.team_name)}</span>
                          <span class="text-[10px] text-slate-400">(${"GW "+Pe.gw}${Pe.is_joint?e?" Joint #1":" แชมป์ร่วม":""})</span>
                        </div>
                        <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">+${Pe.amount.toLocaleString()} ${h.code}</span>
                      </div>
                    `).join("")}
                    <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                      <span>${e?"Total Payout":"ยอดรวมรอบนี้"}</span>
                      <span class="font-mono text-emerald-600 dark:text-emerald-400">${we.toLocaleString()} ${h.code}</span>
                    </div>
                  </div>
                `:ge=`
                  <div class="mt-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                    ${Le?e?"No completed gameweeks in this window yet":"ยังไม่มีสัปดาห์ที่จบการแข่งขันในรอบนี้":e?`Awaiting matches in Gameweeks ${te.gws}`:"รอการแข่งขันในสัปดาห์ "+te.gws}
                  </div>
                `;const We=e?(te.title||"").replace(/รอบที่\s*/g,"Window "):te.title;ce+=`
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div class="flex items-center justify-between mb-1 gap-1">
                      <span class="text-xs font-bold text-slate-900 dark:text-white font-display">${We} (${te.gws})</span>
                      ${Ee}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">${e?"Budget:":"งบประมาณ:"} <strong class="text-slate-800 dark:text-slate-200 font-mono">${te.budget}</strong></div>
                  </div>
                  ${ge}
                </div>
              `});const J=this.prizesHistoryExpanded?S:S.slice(-4).reverse();let ee="";k&&J.length>0&&(ee=J.map(te=>`
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-700/80">
                      <span class="text-xs font-bold font-mono text-slate-900 dark:text-white">Gameweek ${te.gw}</span>
                      <span class="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">${e?"Final":"จบการแข่งขัน"}</span>
                    </div>
                    <div class="space-y-1.5 text-xs">
                      ${te.payouts.map(ne=>{const he=ne.rank===1?"1st":ne.rank===2?"2nd":"3rd";return`
                          <div class="p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                            <div class="truncate pr-2">
                              <span class="font-mono font-bold text-[10px] text-slate-500 dark:text-slate-400 block">#${ne.rank} ${he}${ne.isJoint?e?` (Tied ${ne.jointCount})`:` (เสมอ ${ne.jointCount})`:""}</span>
                              <span class="font-bold truncate block text-xs text-slate-900 dark:text-white">${this.escapeHtml(ne.team_name)}</span>
                              <span class="text-[10px] text-slate-400 block truncate font-mono">${this.escapeHtml(ne.player_name)} (${ne.net_points} pts)${ne.tieBreakNote?" • Tie-break":""}</span>
                            </div>
                            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs flex-shrink-0">+${ne.prize.toLocaleString()} ${h.code}</span>
                          </div>
                        `}).join("")}
                    </div>
                  </div>
                </div>
              `).join(""));const re=this.prizesHistoryExpanded?E:E.slice(-4).reverse();let le="";L&&re.length>0&&(le=re.map(te=>`
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                      <span class="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Gameweek ${te.gw}</span>
                      <span class="text-[10.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">+${(te.netPot||W).toLocaleString()} ${e?`${h.code} Pot`:`${h.code} กองกลาง`}</span>
                    </div>
                    
                    ${te.winners&&te.winners.length>1?te.winners.map(ne=>`
                      <div class="mb-1.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div class="truncate pr-2">
                          <span class="font-mono font-bold text-[10px] text-amber-700 dark:text-amber-400 block">${e?`Joint Winner (${ne.jointCount})`:`แชมป์ร่วมสัปดาห์ (${ne.jointCount} ทีม)`}</span>
                          <span class="font-bold truncate block text-xs text-slate-900 dark:text-white">${this.escapeHtml(ne.team_name)}</span>
                          <span class="text-[10px] text-slate-400 block truncate font-mono">${this.escapeHtml(ne.player_name)} (${ne.net_points} pts)</span>
                        </div>
                        <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs flex-shrink-0">+${ne.prize.toLocaleString()} ${h.code}</span>
                      </div>
                    `).join(""):`
                      <div class="mb-2 p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div class="truncate pr-2">
                          <span class="font-mono font-bold text-[10px] text-amber-700 dark:text-amber-400 block">${e?"Weekly Winner":"แชมป์สัปดาห์"}</span>
                          <span class="font-bold truncate block text-xs text-slate-900 dark:text-white">${this.escapeHtml(te.winner.team_name)}</span>
                          <span class="text-[10px] text-slate-400 block truncate font-mono">${this.escapeHtml(te.winner.player_name)} (${te.winner.net_points} pts)</span>
                        </div>
                        <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs flex-shrink-0">+${(te.winner.prize!==void 0?te.winner.prize:Q).toLocaleString()} ${h.code}</span>
                      </div>
                    `}

                    <div class="space-y-1">
                      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">${e?`Bottom ${z} Fined Teams:`:`ผู้เสียค่าปรับ ${z} อันดับท้าย:`}</div>
                      ${te.bottomList.map(ne=>`
                          <div class="px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/30 flex items-center justify-between text-xs">
                            <div class="truncate pr-2">
                              <span class="font-bold text-[10px] text-slate-500">${ne.rankLabel}:</span>
                              <span class="font-medium text-xs text-slate-900 dark:text-white">${this.escapeHtml(ne.team_name)}</span>
                              <span class="text-[10px] text-slate-400 font-mono">(${ne.net_points} pts)</span>
                            </div>
                            <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs flex-shrink-0">-${ne.fine.toLocaleString()} ${h.code}</span>
                          </div>
                        `).join("")}
                    </div>
                  </div>
                </div>
              `).join(""));const ie=e?"en":"th",pe=String(this.activeLeagueId||""),ke=document.getElementById("weekly-prizes-tbody"),ye=document.getElementById("weekly-prizes-search-input");if(ke&&ye&&ye.dataset.renderedLang===ie&&ye.dataset.renderedLeague===pe){ke.innerHTML=ue;const te=document.getElementById("weekly-prizes-count");te&&(ae||de!=="all"?(te.innerText=e?`Showing ${oe.length} of ${q.length} teams`:`แสดง ${oe.length} จาก ${q.length} ทีม`,te.classList.remove("hidden")):te.classList.add("hidden"));const ne=document.getElementById("weekly-prizes-search-clear");ne&&(this.prizesSearchQuery?ne.classList.remove("hidden"):ne.classList.add("hidden")),["all","winners","fined","non_prize"].forEach(he=>{const fe=document.getElementById(`btn-weekly-filter-${he}`);if(fe){const me=this.prizesFilterMode===he;fe.setAttribute("aria-pressed",me?"true":"false"),fe.className=`min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${me?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}}),ye.value!==(this.prizesSearchQuery||"")&&(ye.value=this.prizesSearchQuery||"");return}if(i){const te=this.getSeasonPrizeSummary(e),ne=!!(te&&te.total),he=this.config.features&&this.config.features.cup_champion_prize||this.config.cup_champion_prize||"",fe=this.config.features&&this.config.features.cup_runner_up_prize||this.config.cup_runner_up_prize||"",me=!!(this.config.features&&this.config.features.has_cup&&(he||fe));let we="";if(me){const Te=Number(String(he).replace(/[^0-9.-]/g,""))||0,Ne=Number(String(fe).replace(/[^0-9.-]/g,""))||0;we=Te+Ne>0?(Te+Ne).toLocaleString():String(he).replace(/\s*(THB|USD)\s*$/i,"").trim()}const be=e?this.config.total_pool_en||this.config.total_pool:this.config.total_pool,ve=e?this.config.entry_fee_en||this.config.entry_fee:this.config.entry_fee,Le=be&&String(be).trim()!=="-"?String(be).trim():"",Ee=ve&&String(ve).trim()!=="-"?String(ve).trim():"",ge=!!(this.config.coordinator||Le||this.config.payment_method||Ee),We=H.map((Te,Ne)=>{if(Ne===0)return e?`Last ${Te.toLocaleString()}`:`บ๊วย ${Te.toLocaleString()}`;if(Ne===1)return e?`2nd-Last ${Te.toLocaleString()}`:`รองบ๊วย ${Te.toLocaleString()}`;const He=Ne+1;return e?`${He}${He===3?"rd":"th"} ${Te.toLocaleString()}`:`อันดับ ${He} ${Te.toLocaleString()}`}).join(" / ");let Pe="";if(L)Pe=`
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Current Net Accumulated Pot":"ยอดเงินกองกลางสะสมสุทธิปัจจุบัน"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">${(G-R).toLocaleString()} <span class="text-xs font-normal">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?`Completed ${A} GWs x ${W.toLocaleString()} ${h.code} (Target 38 GWs = ${P.toLocaleString()} ${h.code})`:`จบแล้ว ${A} สัปดาห์ x ${W.toLocaleString()} ${h.code} (เป้าหมาย 38 สัปดาห์ = ${P.toLocaleString()} ${h.code})`}</div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Weekly Winner Awards (38 GWs)":"รางวัลแชมป์ประจำสัปดาห์ (38 สัปดาห์)"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${(Q*38).toLocaleString()} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?`${Q.toLocaleString()} ${h.code}/week (Funded from ${U.toLocaleString()} ${h.code} fines)`:`สัปดาห์ละ ${Q.toLocaleString()} ${h.code} (หักจากค่าปรับ ${U.toLocaleString()} ${h.code})`}</div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?`Bottom ${z} Fines Scale`:`ค่าปรับ ${z} อันดับท้ายจากบ๊วย`}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">${U.toLocaleString()} <span class="text-xs font-normal">${h.code} / ${e?"GW":"สัปดาห์"}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${We}</div>
                  </div>
                </div>
              `;else if(ce)Pe=`
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Weekly Winner Prizes (38 GWs)":"รางวัลแชมป์สัปดาห์ (38 สัปดาห์)"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${T.toLocaleString()} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?`${C.toLocaleString()} ${h.code}/week x 38 awards`:`สัปดาห์ละ ${C.toLocaleString()} ${h.code} x 38 รางวัล`}</div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Cup Tournament Champion":"รางวัลแชมป์ฟุตบอลถ้วย"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${we||"1,650"} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?`Champion ${he||"1,000 THB"} / Runner-Up ${fe||"650 THB"}`:`แชมป์ ${he||"1,000 THB"} / รองแชมป์ ${fe||"650 THB"}`}</div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Season Podium Prizes":"รางวัลแชมป์ฤดูกาล"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${ne?te.total:"7,050"} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${ne?this.escapeHtml(te.desc):e?"1st: 3,500 / 2nd: 2,000 / 3rd: 1,000 / 4th: 550":"ที่ 1: 3,500 / ที่ 2: 2,000 / ที่ 3: 1,000 / ที่ 4: 550"}</div>
                  </div>
                </div>
              `;else{const Te=[];if(Te.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${I?e?"Weekly Top 3 Awards (38 GWs)":"รางวัลประจำสัปดาห์ 3 อันดับ (38 สัปดาห์)":e?"Weekly Winner Awards (38 GWs)":"แชมป์ประจำสัปดาห์ (38 สัปดาห์)"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${T.toLocaleString()} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${I?e?`1st: ${I["1st"].toLocaleString()} / 2nd: ${I["2nd"].toLocaleString()} / 3rd: ${I["3rd"].toLocaleString()} (${C.toLocaleString()} ${h.code}/week)`:`ที่ 1: ${I["1st"].toLocaleString()} / ที่ 2: ${I["2nd"].toLocaleString()} / ที่ 3: ${I["3rd"].toLocaleString()} (สัปดาห์ละ ${C.toLocaleString()} ${h.code})`:e?`${C.toLocaleString()} ${h.code}/week x 38 weeks`:`สัปดาห์ละ ${C.toLocaleString()} ${h.code} x 38 สัปดาห์`}</div>
                  </div>
              `),ne&&Te.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${this.config.season_prizes&&Object.keys(this.config.season_prizes).length?e?`Season Champions (${Object.keys(this.config.season_prizes).length} Places)`:`แชมป์ฤดูกาล (รวม ${Object.keys(this.config.season_prizes).length} อันดับ)`:e?"Season Champions":"แชมป์ฤดูกาล"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${this.escapeHtml(te.total)} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${this.escapeHtml(te.desc)}</div>
                  </div>
                `),me&&!this.config.coordinator){const He=fe?e?`Champion ${he} / Runner-Up ${fe}`:`แชมป์ ${he} / รองแชมป์ ${fe}`:e?`Knockout Cup Champion (${he})`:`แชมป์บอลถ้วยน็อคเอาท์ (${he})`;Te.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Cup Tournament Champion":"รางวัลแชมป์ฟุตบอลถ้วย"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${this.escapeHtml(we)} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${this.escapeHtml(He)}</div>
                  </div>
                `)}if(ge){const He=this.config.coordinator||Le||`${T.toLocaleString()} ${h.code}`,De=this.config.payment_method||Ee||(e?"38 Gameweeks Official Settlement":"คำนวณคะแนนสุทธิครบ 38 สัปดาห์");Te.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${this.config.coordinator?e?"League Coordinator & Treasury":"ผู้ประสานงาน & ดูแลกองกลาง":e?"Entry Fee & Total Treasury":"ค่าสมัคร & กองกลางรวม"}</span>
                    <div class="${this.config.coordinator?"text-base font-bold text-slate-900 dark:text-white":"text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400"} mt-1">${this.escapeHtml(He)}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${this.escapeHtml(De)}</div>
                  </div>
                `)}Pe=`
                <div class="grid ${Te.length===1?"grid-cols-1":Te.length===2?"grid-cols-1 sm:grid-cols-2":Te.length>=4?"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4":"grid-cols-1 sm:grid-cols-3"} gap-3">
                  ${Te.join("")}
                </div>
              `}i.innerHTML=`
              <!-- 01 / TREASURY LEDGER & PRIZE STRUCTURE -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">01 /</span>
                  <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                    ${L?e?"TREASURY POT & FINES STRUCTURE":"สรุปกองกลางสะสม & โครงสร้างค่าปรับ":e?"TREASURY LEDGER & PRIZE STRUCTURE":"สรุปบัญชีกองกลาง & โครงสร้างเงินรางวัล"}
                  </h3>
                </div>
                ${Pe}
              </div>

              <!-- 02 / ACCUMULATED PRIZE LEADERBOARD -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">02 /</span>
                      <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                        ${L?e?"ACCUMULATED PRIZES & FINES LEADERBOARD":"ตารางเงินรางวัลสะสม & ยอดค่าปรับ":e?"ACCUMULATED PRIZE LEADERBOARD":"ตารางเงินรางวัลสะสมรายบุคคล"}
                      </h3>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ${e?`Official finalized calculation across completed Gameweeks 1 - ${D}`:`คำนวณเงินรางวัลสะสมตามผลการแข่งขันทางการ GW 1 - ${D}`}
                    </p>
                  </div>
                  <!-- Search & Filter Controls (Monochrome Style) -->
                  <div class="flex items-center gap-2 flex-wrap">
                    <span id="weekly-prizes-count" class="${ae||de!=="all"?"":"hidden "}inline-flex items-center text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
                      ${e?`Showing ${oe.length} of ${q.length} teams`:`แสดง ${oe.length} จาก ${q.length} ทีม`}
                    </span>
                    <div class="relative min-w-[140px] xs:min-w-[180px] max-w-xs flex-1">
                      <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </span>
                      <input 
                        type="text" 
                        id="weekly-prizes-search-input"
                        data-rendered-lang="${ie}"
                        data-rendered-league="${this.escapeHtml(pe)}"
                        value="${this.escapeHtml(this.prizesSearchQuery||"")}" 
                        oninput="app.handlePrizesSearch(this.value)"
                        aria-label="${e?"Search team name or manager":"ค้นหาชื่อทีมหรือผู้จัดการ"}"
                        placeholder="${e?"Search team...":"ค้นหาทีม..."}"
                        class="w-full pl-8 pr-7 py-2 min-h-[38px] sm:min-h-[34px] text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-sans"
                      />
                      <button id="weekly-prizes-search-clear" type="button" aria-label="${e?"Clear search":"ล้างการค้นหา"}" onclick="app.handlePrizesSearch('')" class="${this.prizesSearchQuery?"":"hidden "}absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div class="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-wrap">
                      <button id="btn-weekly-filter-all" type="button" onclick="app.setPrizesFilter('all')" aria-pressed="${this.prizesFilterMode==="all"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="all"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"All":"ทั้งหมด"}
                      </button>
                      <button id="btn-weekly-filter-winners" type="button" onclick="app.setPrizesFilter('winners')" aria-pressed="${this.prizesFilterMode==="winners"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="winners"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Winners":"มีรางวัล"}
                      </button>
                      ${L?`
                      <button id="btn-weekly-filter-fined" type="button" onclick="app.setPrizesFilter('fined')" aria-pressed="${this.prizesFilterMode==="fined"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="fined"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Fined":"โดนปรับ"}
                      </button>
                      `:""}
                      ${q.some(Te=>!this.isPrizeEligible(Te.entry_id))?`
                      <button id="btn-weekly-filter-non_prize" type="button" onclick="app.setPrizesFilter('non_prize')" aria-pressed="${this.prizesFilterMode==="non_prize"?"true":"false"}" class="min-h-[38px] sm:min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${this.prizesFilterMode==="non_prize"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Guest":"ร่วมสนุก"}
                      </button>
                      `:""}
                    </div>
                  </div>
                </div>

                <!-- Standings Table (High-Craft Responsive Sticky Freeze) -->
                <div class="overflow-x-auto scrollbar-thin -mx-4 sm:mx-0 touch-scroll table-sticky-container">
                  <table aria-label="${e?"Prize Money and Treasury Standings Table":"ตารางสรุปเงินรางวัลสะสมและยอดกองกลาง"}" class="w-full text-left table-sticky table-clean">
                    <thead>
                      <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display">
                        <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                        <th scope="col" class="sticky-col-team py-2.5 px-3 min-w-[140px]">${e?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                        ${L?`
                        <th scope="col" class="py-2.5 px-2 text-center w-16 sm:w-20">${e?"GW Wins":"แชมป์สัปดาห์"}</th>
                        <th scope="col" class="py-2.5 px-2 text-center w-14">${e?"Fined":"โดนปรับ"}</th>
                        <th scope="col" class="py-2.5 px-3 text-right">${e?"Total Fines":"ค่าปรับสะสม"}</th>
                        <th scope="col" class="py-2.5 px-3 text-right">${e?"Total Prizes":"รางวัลสะสม"}</th>
                        <th scope="col" class="py-2.5 px-3 text-right font-black text-slate-800 dark:text-slate-200">${e?"Net Total":"ยอดรวมสุทธิ"}</th>
                        `:k?`
                        <th scope="col" class="py-2.5 px-2 text-center w-14 sm:w-16">
                          <span>${e?"1st":"ที่ 1"}</span>
                        </th>
                        <th scope="col" class="py-2.5 px-2 text-center w-14 sm:w-16">
                          <span>${e?"2nd":"ที่ 2"}</span>
                        </th>
                        <th scope="col" class="py-2.5 px-2 text-center w-14 sm:w-16">
                          <span>${e?"3rd":"ที่ 3"}</span>
                        </th>
                        <th scope="col" class="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">${e?"Accumulated Prize":"เงินรางวัลสะสม"}</th>
                        `:`
                        <th scope="col" class="py-2.5 px-3 text-center">${e?"GW Wins":"แชมป์สัปดาห์"}</th>
                        <th scope="col" class="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">${e?"Accumulated Prize":"เงินรางวัลสะสม"}</th>
                        `}
                      </tr>
                    </thead>
                    <tbody id="weekly-prizes-tbody" class="text-xs sm:text-sm">
                      ${ue}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-mono text-xs sm:text-sm font-bold">
                      <tr>
                        <td class="sticky-col-rank"></td>
                        <td class="sticky-col-team py-3 px-3 text-slate-700 dark:text-slate-300 font-display">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span>${L?e?"Net Accumulated Treasury Pot":"ยอดเงินกองกลางสะสมสุทธิ":e?"Total Prizes Distributed":"ยอดรวมเงินรางวัลสะสมที่มอบไปแล้ว"}</span>
                            <span class="text-[11px] font-normal text-slate-400 font-mono">(${e?`${A} GWs Settled`:`จบแล้ว ${A} สัปดาห์`})</span>
                          </div>
                        </td>
                        ${L?`
                        <td class="py-3 px-2 text-center text-slate-900 dark:text-white font-black">${O}</td>
                        <td class="py-3 px-2 text-center text-rose-600 dark:text-rose-400 font-black">${K}</td>
                        <td class="py-3 px-3 text-right font-black text-rose-600 dark:text-rose-400">-${G.toLocaleString()} ${h.code}</td>
                        <td class="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">+${R.toLocaleString()} ${h.code}</td>
                        <td class="py-3 px-3 text-right font-black ${G-R>=0?"text-emerald-600 dark:text-emerald-400":"text-rose-600 dark:text-rose-400"} text-sm sm:text-base">${G-R>0?"+":""}${(G-R).toLocaleString()} ${h.code}</td>
                        `:k?`
                        <td class="py-3 px-2 text-center text-slate-900 dark:text-white font-black">${B%1===0?B:B.toFixed(1)}</td>
                        <td class="py-3 px-2 text-center text-slate-700 dark:text-slate-300 font-black">${Y%1===0?Y:Y.toFixed(1)}</td>
                        <td class="py-3 px-2 text-center text-slate-700 dark:text-slate-300 font-black">${X%1===0?X:X.toFixed(1)}</td>
                        <td class="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">${R.toLocaleString()} ${h.code}</td>
                        `:`
                        <td class="py-3 px-3 text-center text-slate-800 dark:text-slate-200 font-bold">${O}</td>
                        <td class="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">${R.toLocaleString()} ${h.code}</td>
                        `}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- 03 / SETTLEMENT WINDOWS & AWARD HISTORY -->
              ${L&&E.length>0?`
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">03 /</span>
                    <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                      ${e?"WEEKLY FINES & WINNER HISTORY":"ประวัติค่าปรับและผู้ชนะรายสัปดาห์"}
                    </h3>
                  </div>
                  <span class="text-[11px] font-mono text-slate-400">${e?`Showing ${re.length} of ${E.length} GWs`:`แสดง ${re.length} จาก ${E.length} สัปดาห์`}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${le}
                </div>
                ${E.length>4?`
                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <button onclick="app.togglePrizesHistory()" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer font-display">
                    <span>${this.prizesHistoryExpanded?e?"Collapse to Recent Weeks":"ย่อประวัติเหลือสัปดาห์ล่าสุด":e?`Show Full History (${E.length} Gameweeks)`:`แสดงประวัติทั้งหมด (${E.length} สัปดาห์)`}</span>
                    <svg class="w-3.5 h-3.5 transition-transform ${this.prizesHistoryExpanded?"rotate-180":""}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                </div>
                `:""}
              </div>
              `:k&&S.length>0?`
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">03 /</span>
                    <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                      ${e?"WEEKLY TOP 3 WINNERS HISTORY":"ประวัติผู้ชนะ 3 อันดับรายสัปดาห์"}
                    </h3>
                  </div>
                  <span class="text-[11px] font-mono text-slate-400">${e?`Showing ${J.length} of ${S.length} GWs`:`แสดง ${J.length} จาก ${S.length} สัปดาห์`}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${ee}
                </div>
                ${S.length>4?`
                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <button onclick="app.togglePrizesHistory()" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer font-display">
                    <span>${this.prizesHistoryExpanded?e?"Collapse to Recent Weeks":"ย่อประวัติเหลือสัปดาห์ล่าสุด":e?`Show Full History (${S.length} Gameweeks)`:`แสดงประวัติทั้งหมด (${S.length} สัปดาห์)`}</span>
                    <svg class="w-3.5 h-3.5 transition-transform ${this.prizesHistoryExpanded?"rotate-180":""}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                </div>
                `:""}
              </div>
              `:ce?`
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">03 /</span>
                  <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                    ${e?"6 SETTLEMENT WINDOWS":"รอบเคลียร์เงินรางวัล 6 งวด"}
                  </h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${ce}
                </div>
              </div>
              `:""}
            `}}else if(this.config&&this.config.features&&this.config.features.prize_model==="monthly"){const I=this.config&&this.config.features||{},L=this.getMonthlySchedule(),k=Number(I.monthly_champion_prize??I.monthly_prize_amount??600),x=I.monthly_runner_up_prize!==void 0&&I.monthly_runner_up_prize!==null?Number(I.monthly_runner_up_prize):I.monthly_champion_prize!==void 0?0:400,C=Number(I.monthly_prize_amount||k+x),T=I.total_monthly_budget||`${(C*L.length).toLocaleString()} ${h.code}`,H=L.find(J=>J.id===this.selectedMonthId)||L[0],z={};(this.data.teams||[]).forEach(J=>{z[J.entry_id]={entry_id:J.entry_id,team_name:J.entry_name,player_name:J.player_name,gw_scores:{},month_total:0}}),H&&H.gw_list&&H.gw_list.forEach(J=>{const ee=this.data.gameweeks?this.data.gameweeks[String(J)]:null;if(ee&&ee.results&&(ee.is_started!==void 0?!!ee.is_started:!!ee.is_finished||ee.results.some(le=>le.points>0))){const le=new Set;ee.results.forEach(ie=>{if(le.has(ie.entry_id)||(le.add(ie.entry_id),this.isDepartedNonPrize(ie.entry_id)))return;z[ie.entry_id]||(z[ie.entry_id]={entry_id:ie.entry_id,team_name:ie.team_name,player_name:ie.player_name,gw_scores:{},month_total:0});const pe=Number(ie.net_points)||0;z[ie.entry_id].gw_scores[J]=pe,z[ie.entry_id].month_total+=pe})}});const U=H.gw_list||[],Q=U.length>0&&U.every(J=>{const ee=this.data.gameweeks?this.data.gameweeks[String(J)]:null;return ee&&ee.is_finished}),W=J=>Q?this.isPrizeEligible(J):this.isActivePrizeEligible(J),P=Object.values(z).sort((J,ee)=>{const re=W(J.entry_id)?1:0,le=W(ee.entry_id)?1:0;if(re!==le)return le-re;const ie=this.isTeamDeparted(J.entry_id)?1:0,pe=this.isTeamDeparted(ee.entry_id)?1:0;return ie!==pe?ie-pe:ee.month_total-J.month_total||(J.team_name||"").localeCompare(ee.team_name||"")||J.entry_id-ee.entry_id});let u=1,N=0,w=null;P.forEach(J=>{if(!W(J.entry_id)){J.rank=null,J.eligible_monthly_rank=null;return}N++,w!==null&&J.month_total<w&&(u=N),w=J.month_total,J.rank=u,J.eligible_monthly_rank=u});const b=U.some(J=>{const ee=this.data.gameweeks?this.data.gameweeks[String(J)]:null;return ee?ee.is_started!==void 0?!!ee.is_started:!!ee.is_finished||ee.results&&ee.results.some(re=>re.points>0):!1});let _="";Q?_=`<span class="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0">${e?"Completed":"จบการแข่งขันแล้ว"}</span>`:b?_=`<span class="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex-shrink-0">${e?"In Progress":"กำลังแข่งขัน"}</span>`:_=`<span class="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex-shrink-0">${e?"Upcoming":"รอการแข่งขัน"}</span>`;let S="";L.forEach(J=>{const ee=J.id===this.selectedMonthId,re=J.gw_list||[],le=re.length>0&&re.every(ie=>{const pe=this.data.gameweeks?this.data.gameweeks[String(ie)]:null;return pe&&pe.is_finished});S+=`
              <button 
                onclick="app.selectMonth(${J.id})"
                class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${ee?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}"
              >
                ${J.month.split(" ")[0]} (${J.gws}) ${le?"✓":""}
              </button>
            `});const E=(this.prizesSearchQuery||"").toLowerCase().trim(),A=this.prizesFilterMode||"all",F=P.filter(J=>{if(E){const re=(J.team_name||"").toLowerCase().includes(E),le=(J.player_name||"").toLowerCase().includes(E);if(!re&&!le)return!1}const ee=this.isPrizeEligible(J.entry_id);return A==="winners"?ee&&(J.eligible_monthly_rank===1||J.eligible_monthly_rank===2):A==="non_prize"?!ee:!0});let q="",j=!1;const R=b?P.filter(J=>W(J.entry_id)):[],G=R.length>0&&R[0].month_total>0,K=G?R.filter(J=>J.eligible_monthly_rank===1):[],B=G?R.filter(J=>J.eligible_monthly_rank===2):[],Y=K.length,X=B.length,M=Y>0?(k+(Y>1?x:0))/Y:k,V=Y>1&&(k+x)%Y!==0?`${M.toFixed(2)} ${h.code}`:`${M.toLocaleString()} ${h.code}`,Z=X>0?x/X:x,O=X>1&&x%X!==0?`${Z.toFixed(2)} ${h.code}`:`${Z.toLocaleString()} ${h.code}`;F.forEach(J=>{const ee=this.isPrizeEligible(J.entry_id),re=this.isTeamDeparted(J.entry_id),le=W(J.entry_id);!ee&&!j&&A==="all"&&(j=!0,q+=`
                <tr class="bg-slate-100/75 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700/80">
                  <td colspan="${H.gw_list.length+3}" class="py-2 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    ${e?"Guest Teams (Excluded from prize calculation)":"ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัล)"}
                  </td>
                </tr>
              `);const ie=le&&b&&G&&J.eligible_monthly_rank===1,pe=le&&b&&G&&J.eligible_monthly_rank===2;let ke="";ee?!le&&re?ke=this.getDepartedRankBadge():ie?ke='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-2xs">1</span>':pe?ke='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-xs">2</span>':ke=`<span class="text-xs font-bold text-slate-500 dark:text-slate-400 font-display">${J.eligible_monthly_rank||J.rank||"-"}</span>`:ke=this.getNonPrizeRankBadge();let ye="";H.gw_list.forEach(te=>{const ne=this.data.gameweeks?this.data.gameweeks[String(te)]:null,fe=(ne?ne.is_started!==void 0?!!ne.is_started:!!ne.is_finished||ne.results&&ne.results.some(me=>me.points>0):!1)&&J.gw_scores[te]!==void 0?J.gw_scores[te]:"-";ye+=`<td class="py-2.5 px-2 text-center font-mono tabular-nums text-xs text-slate-600 dark:text-slate-300">${fe}</td>`}),q+=`
              <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer ${re?"opacity-70":""}">
                <td class="sticky-col-rank py-2.5 px-2 text-center font-display">${ke}</td>
                <td class="sticky-col-team py-2.5 px-3 min-w-[140px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="event.stopPropagation(); app.openTeamModal(${J.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate max-w-[125px] xs:max-w-[175px] sm:max-w-none">${this.escapeHtml(J.team_name)}</button>
                    ${this.getPrizeBadge(J.entry_id)}
                    ${re?this.getDepartedBadge(J.entry_id):""}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(J.player_name)}</div>
                </td>
                ${ye}
                <td class="py-2.5 px-3 text-right font-mono tabular-nums font-black text-xs sm:text-sm ${ie?"text-amber-600 dark:text-amber-400":pe?"text-slate-900 dark:text-white":"text-slate-800 dark:text-slate-200"}">${J.month_total}</td>
              </tr>
            `}),F.length===0&&(q=`
              <tr>
                <td colspan="${H.gw_list.length+3}" class="py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                  ${e?"No teams match your search or filter":"ไม่พบทีมที่ตรงกับคำค้นหาหรือตัวกรอง"}
                </td>
              </tr>
            `);let ae="";L.forEach(J=>{const ee=J.gw_list||[];let re=0,le=0;ee.forEach(fe=>{const me=this.data.gameweeks?this.data.gameweeks[String(fe)]:null;me&&(me.is_finished&&re++,(me.is_started!==void 0?me.is_started:me.is_finished||me.results&&me.results.some(be=>be.points>0))&&le++)});const ie=ee.length>0&&re===ee.length,pe=!ie&&le>0;let ke="";ie?ke=`<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0">${e?"Completed":"จบแล้ว"}</span>`:pe?ke=`<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex-shrink-0">${e?"In Progress":"กำลังแข่งขัน"}</span>`:ke=`<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex-shrink-0">${e?"Upcoming":"รอการแข่งขัน"}</span>`;const ye={};(this.data.teams||[]).forEach(fe=>{ye[fe.entry_id]={entry_id:fe.entry_id,team_name:fe.entry_name,player_name:fe.player_name,total:0}}),le>0&&ee.forEach(fe=>{const me=this.data.gameweeks?this.data.gameweeks[String(fe)]:null;me&&me.results&&(me.is_started!==void 0?me.is_started:me.is_finished||me.results.some(be=>be.points>0))&&me.results.forEach(be=>{ye[be.entry_id]||(ye[be.entry_id]={entry_id:be.entry_id,team_name:be.team_name,player_name:be.player_name,total:0}),ye[be.entry_id].total+=be.net_points||0})});const ne=Object.values(ye).sort((fe,me)=>me.total-fe.total||(fe.team_name||"").localeCompare(me.team_name||"")||fe.entry_id-me.entry_id).filter(fe=>this.isPrizeEligible(fe.entry_id));let he="";if(ie&&ne.length>0&&ne[0].total>0){const fe=ne[0].total,me=ne.filter(Le=>Le.total===fe);let we="",be="",ve=0;if(me.length>1){const Le=(k+x)/me.length,Ee=(k+x)%me.length!==0?`${Le.toFixed(2)} ${h.code}`:`${Le.toLocaleString()} ${h.code}`;ve=k+x,we=me.map(ge=>`
                  <div class="flex items-center justify-between text-xs py-0.5">
                    <div class="truncate pr-2">
                      <span class="font-bold text-slate-900 dark:text-white">${e?`Joint Champ (Split ${me.length}):`:`แชมป์ร่วม (หาร ${me.length}):`} ${this.escapeHtml(ge.team_name)}</span>
                      <span class="text-[10px] text-slate-400 font-mono">(${ge.total} pts)</span>
                    </div>
                    <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">+${Ee}</span>
                  </div>
                `).join("")}else{const Le=me[0];ve+=k,we=`
                  <div class="flex items-center justify-between text-xs py-0.5">
                    <div class="truncate pr-2">
                      <span class="font-bold text-slate-900 dark:text-white">${e?"Monthly Champ:":"แชมป์เดือน:"} ${this.escapeHtml(Le.team_name)}</span>
                      <span class="text-[10px] text-slate-400 font-mono">(${Le.total} pts)</span>
                    </div>
                    <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">+${k.toLocaleString()} ${h.code}</span>
                  </div>
                `;const Ee=ne.find(ge=>ge.total<fe)?.total;if(x>0&&Ee!==void 0&&Ee>0){const ge=ne.filter(Ne=>Ne.total===Ee),We=ge.length>1,Pe=x/ge.length,Te=ge.length>1&&x%ge.length!==0?`${Pe.toFixed(2)} ${h.code}`:`${Pe.toLocaleString()} ${h.code}`;ve+=x,be=ge.map(Ne=>`
                    <div class="flex items-center justify-between text-xs py-0.5">
                      <div class="truncate pr-2">
                        <span class="font-bold text-slate-700 dark:text-slate-300">${We?e?`Joint Runner-up (Split ${ge.length}):`:`รองแชมป์ร่วม (หาร ${ge.length}):`:e?"Runner-up:":"รองแชมป์:"} ${this.escapeHtml(Ne.team_name)}</span>
                        <span class="text-[10px] text-slate-400 font-mono">(${Ne.total} pts)</span>
                      </div>
                      <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">+${Te}</span>
                    </div>
                  `).join("")}}he=`
                <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div class="text-[10px] font-bold text-slate-400 uppercase font-display">${e?"Winners Summary:":"สรุปทีมได้รับรางวัล:"}</div>
                  ${we}
                  ${be}
                  <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                    <span>${e?"Total Payout":"ยอดรวมเดือนนี้"}</span>
                    <span class="font-mono text-emerald-600 dark:text-emerald-400">${ve.toLocaleString()} ${h.code}</span>
                  </div>
                </div>
              `}else if(pe&&ne.length>0&&ne[0].total>0){const fe=ne[0].total,me=ne.filter(ve=>ve.total===fe),we=me.length>1,be=me.map(ve=>`
                <div class="flex items-center justify-between text-xs py-0.5">
                  <span class="font-bold text-slate-900 dark:text-white truncate pr-2">${this.escapeHtml(ve.team_name)}</span>
                  <span class="font-mono font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">${ve.total} pts</span>
                </div>
              `).join("");he=`
                <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div class="text-[10px] font-bold text-slate-400 uppercase font-display flex items-center gap-1">
                    <span>${we?e?`Live Leaders (${me.length} Teams):`:`ผู้นำร่วมชั่วคราว (${me.length} ทีม):`:e?"Live Leader:":"ผู้นำชั่วคราว:"}</span>
                  </div>
                  ${be}
                </div>
              `}else he=`
                <div class="mt-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                  ${e?`Awaiting matches in Gameweeks ${J.gws}`:`รอการแข่งขันในสัปดาห์ ${J.gws}`}
                </div>
              `;ae+=`
              <div class="bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between shadow-2xs">
                <div>
                  <div class="flex items-center justify-between mb-1 gap-1">
                    <span class="text-xs font-bold text-slate-900 dark:text-white font-display">${J.month} (${J.gws})</span>
                    ${ke}
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">${e?"Budget:":"งบประมาณ:"} <strong class="text-slate-800 dark:text-slate-200 font-mono">${J.budget}</strong></div>
                </div>
                ${he}
              </div>
            `});const de=e?"en":"th",oe=String(this.activeLeagueId||""),ue=String(H&&H.month||""),_e=document.getElementById("monthly-prizes-tbody"),ce=document.getElementById("monthly-prizes-search-input");if(_e&&ce&&ce.dataset.renderedLang===de&&ce.dataset.renderedLeague===oe&&ce.dataset.renderedMonth===ue){_e.innerHTML=q;const J=document.getElementById("monthly-prizes-search-clear");J&&(this.prizesSearchQuery?J.classList.remove("hidden"):J.classList.add("hidden")),ce.value!==(this.prizesSearchQuery||"")&&(ce.value=this.prizesSearchQuery||"");return}if(i){const J=this.getSeasonPrizeSummary(e),ee=!!(J&&J.total),re=this.config.season_prizes&&typeof this.config.season_prizes=="object"?Object.keys(this.config.season_prizes).length:0,le=I.cup_champion_prize||this.config.cup_champion_prize||"",ie=I.cup_runner_up_prize||this.config.cup_runner_up_prize||"",pe=!!(I.has_cup&&(le||ie)),ke=I.charity_donation||"",ye=e?this.config.total_pool_en||this.config.total_pool:this.config.total_pool,te=e?this.config.entry_fee_en||this.config.entry_fee:this.config.entry_fee,ne=ye&&String(ye).trim()!=="-"?String(ye).trim():"",he=te&&String(te).trim()!=="-"?String(te).trim():"",fe=[],me=L.length||10,we=x>0?e?`Champion ${k.toLocaleString()} / Runner ${x.toLocaleString()}`:`แชมป์ ${k.toLocaleString()} / รอง ${x.toLocaleString()}`:e?`Champion ${k.toLocaleString()} ${h.code} / month`:`แชมป์เดือนละ ${k.toLocaleString()} ${h.code}`;if(fe.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?`Monthly Awards (${me} Months)`:`รางวัลประจำเดือน (${me} เดือน)`}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${(C*me).toLocaleString()} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${we}</div>
                  </div>
            `),ee){const Le=re>0?e?`Season Podium (Top ${re})`:`รางวัลประจำฤดูกาล (${re} อันดับ)`:e?"Season Podium":"รางวัลประจำฤดูกาล";fe.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${Le}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${this.escapeHtml(J.total)} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${this.escapeHtml(J.desc)}</div>
                  </div>
              `)}if(pe){const Le=Number(String(le).replace(/[^0-9.-]/g,""))||0,Ee=Number(String(ie).replace(/[^0-9.-]/g,""))||0,ge=Le+Ee>0?(Le+Ee).toLocaleString():String(le).replace(/\s*(THB|USD)\s*$/i,"").trim(),We=ie?e?`Champion ${le} / Runner-Up ${ie}`:`แชมป์ ${le} / รองแชมป์ ${ie}`:e?"Tie-broken by total points if same round":"วัดผลคะแนนหากตกรอบพร้อมกัน";fe.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Cup Tournament Champion":"แชมป์ฟุตบอลถ้วย"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${this.escapeHtml(ge)} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${this.escapeHtml(We)}</div>
                  </div>
              `)}if(ke){const Le=String(ke).replace(/\s*(THB|USD)\s*$/i,"").trim();fe.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Charity Donation":"บริจาคการกุศล"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">${this.escapeHtml(Le)} <span class="text-xs font-normal text-slate-400">${h.code}</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"Hospital designated fund":"ร่วมทำบุญให้แก่โรงพยาบาล"}</div>
                  </div>
              `)}else(ne||he)&&fe.push(`
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Entry Fee & Total Treasury":"ค่าสมัคร & กองกลางรวม"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">${this.escapeHtml(ne||`${(C*me).toLocaleString()} ${h.code}`)}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${this.escapeHtml(he||(e?"Official Monthly Settlement":"คำนวณคะแนนสุทธิรายเดือน"))}</div>
                  </div>
              `);const be=fe.length===1?"grid-cols-1":fe.length===2?"grid-cols-1 sm:grid-cols-2":fe.length===3?"grid-cols-1 sm:grid-cols-3":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",ve=ke?`<div class="text-right text-[11px] text-slate-400 mt-2">${e?"*** Prize pool may increase if additional participants join throughout the season.":"*** เงินรางวัลอาจมีการเพิ่มเติม ถ้าในระหว่างสิบเดือนของฤดูกาล มีผู้ลงเล่นประจำเดือน"}</div>`:"";i.innerHTML=`
              <!-- 01 / MONTHLY AWARDS & TREASURY ALLOCATION -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">01 /</span>
                  <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                    ${e?"MONTHLY AWARDS & TREASURY ALLOCATION":"สรุปรางวัลประจำเดือน & การจัดสรรกองกลาง"}
                  </h3>
                </div>
                <div class="grid ${be} gap-3">
                  ${fe.join("")}
                </div>
                ${ve}
              </div>

              <!-- 02 / MONTHLY STANDINGS LEADERBOARD -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">02 /</span>
                      <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                        ${e?`MONTHLY STANDINGS: ${H.month} (${H.gws})`:`ตารางคะแนนประจำเดือน: ${H.month} (${H.gws})`}
                      </h3>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ${e?"Points scored strictly in official gameweeks of the selected month":"คะแนนสะสมสุทธิเฉพาะสัปดาห์ในเดือนที่เลือก"}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <div class="relative min-w-[140px] xs:min-w-[180px] max-w-xs flex-1">
                      <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </span>
                      <input 
                        type="text" 
                        id="monthly-prizes-search-input"
                        data-rendered-lang="${de}"
                        data-rendered-league="${this.escapeHtml(oe)}"
                        data-rendered-month="${this.escapeHtml(ue)}"
                        value="${this.escapeHtml(this.prizesSearchQuery||"")}" 
                        oninput="app.handlePrizesSearch(this.value)"
                        aria-label="${e?"Search team name or manager":"ค้นหาชื่อทีมหรือผู้จัดการ"}"
                        placeholder="${e?"Search team...":"ค้นหาทีม..."}"
                        class="w-full pl-8 pr-7 py-2 min-h-[38px] sm:min-h-[34px] text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-sans"
                      />
                      <button id="monthly-prizes-search-clear" type="button" aria-label="${e?"Clear search":"ล้างการค้นหา"}" onclick="app.handlePrizesSearch('')" class="${this.prizesSearchQuery?"":"hidden "}absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div class="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-wrap">
                      <button onclick="app.setPrizesFilter('all')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="all"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"All":"ทั้งหมด"}
                      </button>
                      <button onclick="app.setPrizesFilter('winners')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="winners"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Podium":"ลุ้นรางวัล"}
                      </button>
                      ${P.some(Le=>!this.isPrizeEligible(Le.entry_id))?`
                      <button onclick="app.setPrizesFilter('non_prize')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="non_prize"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Guest":"ร่วมสนุก"}
                      </button>
                      `:""}
                    </div>
                    ${_}
                  </div>
                </div>

                <div class="flex space-x-1.5 overflow-x-auto touch-scroll scrollbar-thin pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-800">
                  ${S}
                </div>

                <div class="overflow-x-auto scrollbar-thin -mx-4 sm:mx-0 touch-scroll table-sticky-container">
                  <table aria-label="${e?"Prize Money and Treasury Standings Table":"ตารางสรุปเงินรางวัลสะสมและยอดกองกลาง"}" class="w-full text-left table-sticky table-clean">
                    <thead>
                      <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display">
                        <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                        <th scope="col" class="sticky-col-team py-2.5 px-3 min-w-[140px]">${e?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                        ${H.gw_list.map(Le=>`<th scope="col" class="py-2 px-2 text-center font-mono">GW ${Le}</th>`).join("")}
                        <th scope="col" class="py-2.5 px-3 text-right font-black font-mono text-slate-800 dark:text-slate-200">${e?"Monthly Total":"คะแนนรวมเดือน"}</th>
                      </tr>
                    </thead>
                    <tbody id="monthly-prizes-tbody" class="text-xs sm:text-sm">
                      ${q}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-mono text-xs sm:text-sm font-bold">
                      <tr>
                        <td class="sticky-col-rank"></td>
                        <td class="sticky-col-team py-3 px-3 text-slate-700 dark:text-slate-300 font-display">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span>${e?`Monthly Budget: ${H.month}`:`งบประมาณรางวัล: ${H.month}`}</span>
                            <span class="text-[11px] font-normal text-slate-400 font-mono">(${Q?e?"Settled":"จบรอบแล้ว":b?e?"In Progress":"กำลังแข่งขัน":e?"Upcoming":"รอการแข่งขัน"})</span>
                          </div>
                        </td>
                        <td colspan="${H.gw_list.length}" class="py-3 px-2 text-center text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          ${x>0?e?`Champ ${k.toLocaleString()} ${h.code} • Runner ${x.toLocaleString()} ${h.code}`:`แชมป์ ${k.toLocaleString()} ${h.code} • รอง ${x.toLocaleString()} ${h.code}`:e?`Champ ${k.toLocaleString()} ${h.code}`:`แชมป์ ${k.toLocaleString()} ${h.code}`}
                        </td>
                        <td class="py-3 px-3 text-right font-black text-slate-900 dark:text-white">${C.toLocaleString()} ${h.code}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- 03 / 10-MONTH TOURNAMENT SCHEDULE -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">03 /</span>
                  <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                    ${e?`10-MONTH TOURNAMENT SCHEDULE (BUDGET ${T})`:`กำหนดการแข่งขันประจำเดือนทั้ง 10 เดือน (งบ ${T})`}
                  </h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${ae}
                </div>
              </div>
            `}}else if(this.config&&this.config.features&&(this.config.features.prize_model==="annual_zero_sum"||this.config.features.prize_model==="annual")){const I=this.config&&this.config.features||{},L=String(this.activeLeagueId)==="187827"||!!I.has_shi62_special,k=I.annual_payout_tiers||{1:1e3,2:800,3:600,4:400,5:200,6:100,7:-100,8:-200,9:-400,10:-600,11:-800,12:-1e3},x=Object.values(k).filter(M=>Number(M)>0).reduce((M,V)=>M+Number(V),0),C=Math.abs(Object.values(k).filter(M=>Number(M)<0).reduce((M,V)=>M+Number(V),0)),T={},H={};this.shi62Data&&this.shi62Data.cumulative_standings&&this.shi62Data.cumulative_standings.forEach(M=>{M.player&&(M.player.entry_id&&(T[M.player.entry_id]=Number(M.net)||0),M.player.display_name&&(H[M.player.display_name.toLowerCase()]=Number(M.net)||0))});const z={1309919:"Tong",837763:"Oo",2342390:"Riin",720631:"Totti",1153245:"Poang",7601484:"Oan",3508212:"Sia",1312974:"Mai",2804957:"Boy",5463640:"Dow",4549514:"Bert",5340913:"Pong+"},U={};(this.data.teams||[]).forEach(M=>{U[M.entry_id]={entry_id:M.entry_id,team_name:M.entry_name,player_name:M.player_name,fpl_rank:M.rank||999,total_points:0}});for(let M=1;M<=m;M++){const V=this.data.gameweeks?this.data.gameweeks[String(M)]:null;if(V&&V.results&&(V.is_started!==void 0?!!V.is_started:!!V.is_finished||V.results.some(O=>O.points>0))){const O=new Set;V.results.forEach(ae=>{O.has(ae.entry_id)||(O.add(ae.entry_id),!this.isDepartedNonPrize(ae.entry_id)&&(U[ae.entry_id]||(U[ae.entry_id]={entry_id:ae.entry_id,team_name:ae.team_name,player_name:ae.player_name,fpl_rank:999,total_points:0}),U[ae.entry_id].total_points+=ae.net_points))})}}const Q=Object.values(U).sort((M,V)=>{const Z=this.isPrizeEligible(M.entry_id)?1:0,O=this.isPrizeEligible(V.entry_id)?1:0;if(Z!==O)return O-Z;const ae=this.isTeamDeparted(M.entry_id)?1:0,de=this.isTeamDeparted(V.entry_id)?1:0;return ae!==de?ae-de:V.total_points-M.total_points||(M.fpl_rank||999)-(V.fpl_rank||999)}),W=Q.filter(M=>this.isActivePrizeEligible(M.entry_id)),P=W.length;let u=0;for(;u<W.length;){let M=u+1;for(;M<W.length&&W[M].total_points===W[u].total_points;)M++;const V=M-u,Z=u+1,O=u+V;let ae=0;for(let oe=Z;oe<=O;oe++)ae+=Number(k[String(oe)]||0);const de=V>0?ae/V:0;for(let oe=u;oe<M;oe++){const ue=W[oe];ue.overall_rank=Z,ue.is_joint=V>1,ue.joint_count=V,ue.pos_start=Z,ue.pos_end=O,ue.payout=de}u=M}Q.forEach(M=>{this.isActivePrizeEligible(M.entry_id)||(M.overall_rank=null,M.is_joint=!1,M.payout=0)});let N=0,w=0,b=0,_=0;Q.forEach(M=>{const V=this.isPrizeEligible(M.entry_id),Z=V?M.payout:0,O=T[M.entry_id]!==void 0?T[M.entry_id]:H[(M.player_name||"").toLowerCase()]||0,ae=V?Z+O:0;V&&(w+=Z,b+=O,_+=ae,N+=M.total_points)});const S=L&&this.shi62Data&&this.shi62Data.cumulative_standings?this.shi62Data.cumulative_standings.find(M=>M.player&&M.player.is_guest):null;if(S){const M=Number(S.net)||0;b+=M,_+=M}const E=(this.prizesSearchQuery||"").toLowerCase().trim(),A=this.prizesFilterMode||"all",F=Q.filter(M=>{if(E){const de=z[M.entry_id]||"",oe=(M.team_name||"").toLowerCase().includes(E),ue=(M.player_name||"").toLowerCase().includes(E),_e=de.toLowerCase().includes(E);if(!oe&&!ue&&!_e)return!1}const V=this.isPrizeEligible(M.entry_id),Z=V?M.payout:0,O=T[M.entry_id]!==void 0?T[M.entry_id]:H[(M.player_name||"").toLowerCase()]||0,ae=V?Z+O:0;return A==="winners"?V&&(ae>0||Z>0):A==="fined"?V&&(ae<0||Z<0):A==="non_prize"?!V:!0});let q="";F.forEach(M=>{const V=this.isPrizeEligible(M.entry_id),Z=this.isTeamDeparted(M.entry_id),O=V&&!Z,ae=this.getPrizeBadge(M.entry_id),de=Z?this.getDepartedBadge(M.entry_id):"",oe=M.overall_rank,ue=O?M.payout:0,_e=T[M.entry_id]!==void 0?T[M.entry_id]:H[(M.player_name||"").toLowerCase()]||0,ce=O?ue+_e:V?_e:0;let J="";V?Z?J=this.getDepartedRankBadge():M.is_joint?J=`<span class="text-slate-600 dark:text-slate-300 font-bold" title="${e?`Tied with ${M.joint_count} teams`:`คะแนนเท่ากัน ${M.joint_count} ทีม`}">${M.overall_rank} <span class="text-[9px] text-slate-400 font-mono">${e?"T":"ร่วม"}</span></span>`:oe===1?J='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-2xs">1</span>':oe===2?J='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-xs">2</span>':oe===3?J='<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/80 text-white font-bold text-xs">3</span>':oe===P?J=`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-mono text-xs font-bold">${oe}</span>`:J=`<span class="text-slate-500 dark:text-slate-400 font-bold font-display text-xs">${oe}</span>`:J=this.getNonPrizeRankBadge();const ee=le=>le>0?`<span class="font-mono font-bold tabular-nums text-xs text-emerald-600 dark:text-emerald-400">+${Number(le).toLocaleString()}</span>`:le<0?`<span class="font-mono font-bold tabular-nums text-xs text-rose-600 dark:text-rose-400">${Number(le).toLocaleString()}</span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono tabular-nums text-xs">0</span>',re=le=>le>0?`<span class="font-mono font-bold tabular-nums text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">+${Number(le).toLocaleString()} <span class="text-[10px] font-normal opacity-75">THB</span></span>`:le<0?`<span class="font-mono font-bold tabular-nums text-xs sm:text-sm text-rose-600 dark:text-rose-400">${Number(le).toLocaleString()} <span class="text-[10px] font-normal opacity-75">THB</span></span>`:'<span class="text-slate-400 dark:text-slate-500 font-mono font-bold tabular-nums text-xs sm:text-sm">0 THB</span>';if(L){const le=z[M.entry_id],ie=le?`<span class="font-bold text-slate-700 dark:text-slate-300">${le}</span> <span class="text-slate-400">(${this.escapeHtml(M.player_name)})</span>`:this.escapeHtml(M.player_name);q+=`
                <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer ${!V||Z?"is-non-prize opacity-70":""}">
                  <td class="sticky-col-rank py-3 px-2 text-center font-display">${J}</td>
                  <td class="sticky-col-team py-3 px-3 min-w-[140px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <button onclick="event.stopPropagation(); app.openTeamModal(${M.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors block truncate cursor-pointer max-w-[125px] xs:max-w-[175px] sm:max-w-none">
                        ${this.escapeHtml(M.team_name)}
                      </button>
                      ${ae}
                      ${de}
                    </div>
                    <div class="text-[11px] block truncate text-slate-500 dark:text-slate-400">${ie}</div>
                  </td>
                  <td class="py-3 px-2 text-center font-mono tabular-nums font-black text-xs sm:text-sm text-slate-900 dark:text-white">${M.total_points}</td>
                  <td class="py-3 px-3 text-right font-display text-xs sm:text-sm">${O?ee(ue):'<span class="text-slate-400 font-mono text-xs">-</span>'}</td>
                  <td class="py-3 px-3 text-right font-display text-xs sm:text-sm">${V?ee(_e):'<span class="text-slate-400 font-mono text-xs">-</span>'}</td>
                  <td class="py-3 px-3 text-right font-display">${V?re(ce):'<span class="text-slate-400 font-mono text-xs">-</span>'}</td>
                </tr>
              `}else q+=`
                <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer ${!V||Z?"is-non-prize opacity-70":""}">
                  <td class="sticky-col-rank py-3 px-2 text-center font-display">${J}</td>
                  <td class="sticky-col-team py-3 px-3 min-w-[140px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <button onclick="event.stopPropagation(); app.openTeamModal(${M.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors block truncate cursor-pointer max-w-[125px] xs:max-w-[175px] sm:max-w-none">
                        ${this.escapeHtml(M.team_name)}
                      </button>
                      ${ae}
                      ${de}
                    </div>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">${this.escapeHtml(M.player_name)}</span>
                  </td>
                  <td class="py-3 px-2 text-center font-mono tabular-nums font-black text-xs sm:text-sm text-slate-900 dark:text-white">${M.total_points}</td>
                  <td class="py-3 px-3 text-right font-display">${O?re(ue):'<span class="text-slate-400 font-mono text-xs">-</span>'}</td>
                </tr>
              `});let j=!1;if(S){const M=Number(S.net)||0;(!E||"nod".includes(E)||"guest".includes(E)||"ทายผล".includes(E))&&(A==="all"||A==="non_prize"||A==="fined"&&M<0||A==="winners"&&M>0)&&(j=!0)}if(j&&S){const M=Number(S.net)||0,V=M>0?`<span class="font-mono font-bold tabular-nums text-xs text-emerald-600 dark:text-emerald-400">+${Number(M).toLocaleString()}</span>`:M<0?`<span class="font-mono font-bold tabular-nums text-xs text-rose-600 dark:text-rose-400">${Number(M).toLocaleString()}</span>`:'<span class="text-slate-400 font-mono tabular-nums text-xs">0</span>',Z=M>0?`<span class="font-mono font-bold tabular-nums text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">+${Number(M).toLocaleString()} <span class="text-[10px] font-normal opacity-75">THB</span></span>`:M<0?`<span class="font-mono font-bold tabular-nums text-xs sm:text-sm text-rose-600 dark:text-rose-400">${Number(M).toLocaleString()} <span class="text-[10px] font-normal opacity-75">THB</span></span>`:'<span class="text-slate-400 font-mono font-bold tabular-nums text-xs sm:text-sm">0 THB</span>';q+=`
              <tr onclick="app.toggleTrackedRow(this)" class="is-non-prize text-slate-500 cursor-pointer">
                <td class="sticky-col-rank py-3 px-2 text-center font-mono text-xs text-slate-400">•</td>
                <td class="sticky-col-team py-3 px-3 min-w-[140px]">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">Nod</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 font-mono">Guest</span>
                  </div>
                  <span class="text-[11px] text-slate-400 block truncate">${e?"Prediction only":"เล่นเฉพาะทายผล"}</span>
                </td>
                <td class="py-3 px-2 text-center font-mono text-xs text-slate-400">-</td>
                <td class="py-3 px-3 text-right font-mono text-xs text-slate-400">-</td>
                <td class="py-3 px-3 text-right font-display text-xs sm:text-sm">${V}</td>
                <td class="py-3 px-3 text-right font-display">${Z}</td>
              </tr>
            `}F.length===0&&!j&&(q=`
              <tr>
                <td colspan="${L?6:4}" class="py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                  ${e?"No teams match your search or filter":"ไม่พบทีมที่ตรงกับคำค้นหาหรือตัวกรอง"}
                </td>
              </tr>
            `);const R=e?"en":"th",G=String(this.activeLeagueId||""),K=document.getElementById("standard-prizes-tbody"),B=document.getElementById("standard-prizes-search-input");if(K&&B&&B.dataset.renderedLang===R&&B.dataset.renderedLeague===G){K.innerHTML=q;const M=document.getElementById("standard-prizes-search-clear");M&&(this.prizesSearchQuery?M.classList.remove("hidden"):M.classList.add("hidden")),["all","winners","fined","non_prize"].forEach(V=>{const Z=document.getElementById(`btn-standard-filter-${V}`);if(Z){const O=this.prizesFilterMode===V;Z.className=`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${O?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}}),B.value!==(this.prizesSearchQuery||"")&&(B.value=this.prizesSearchQuery||"");return}let Y="",X="";L?(Y=`
              <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display">
                <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                <th scope="col" class="sticky-col-team py-2.5 px-3 min-w-[140px]">${e?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                <th scope="col" class="py-2.5 px-2 text-center w-16">${e?"Total Pts":"คะแนนรวม"}</th>
                <th scope="col" class="py-2.5 px-3 text-right min-w-[90px]">${e?"FPL Prize":"รางวัล FPL"}</th>
                <th scope="col" class="py-2.5 px-3 text-right min-w-[95px]">${e?"Prediction Net":"ทายผลสะสม"}</th>
                <th scope="col" class="py-2.5 px-3 text-right min-w-[110px] font-black text-slate-800 dark:text-slate-200">${e?"Net Total":"ยอดรวมสุทธิ"}</th>
              </tr>
            `,X=`
              <tr class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-mono text-xs sm:text-sm font-bold">
                <td class="sticky-col-rank"></td>
                <td class="sticky-col-team py-3 px-3 text-slate-700 dark:text-slate-300 font-display">
                  ${e?"Net Zero-Sum Balance (All League)":"ยอดรวมสุทธิทั้งลีก (Net Zero-Sum Balance)"}
                </td>
                <td class="py-3 px-2 text-center text-slate-900 dark:text-white font-black">${N}</td>
                <td class="py-3 px-3 text-right font-black text-slate-900 dark:text-white text-xs sm:text-sm">${w===0?"0":w.toLocaleString()} THB</td>
                <td class="py-3 px-3 text-right font-black text-slate-900 dark:text-white text-xs sm:text-sm">${b===0?"0":b.toLocaleString()} THB</td>
                <td class="py-3 px-3 text-right font-black text-slate-900 dark:text-white text-sm sm:text-base">${_===0?"0":_.toLocaleString()} THB</td>
              </tr>
            `):(Y=`
              <tr class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display">
                <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">#</th>
                <th scope="col" class="sticky-col-team py-2.5 px-3 min-w-[140px]">${e?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                <th scope="col" class="py-2.5 px-2 text-center">${e?"Total Pts":"คะแนนรวม"}</th>
                <th scope="col" class="py-2.5 px-3 text-right font-black text-slate-800 dark:text-slate-200">${e?"Net Total":"ยอดรวมสุทธิ"}</th>
              </tr>
            `,X=`
              <tr class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-mono text-xs sm:text-sm font-bold">
                <td class="sticky-col-rank"></td>
                <td class="sticky-col-team py-3 px-3 text-slate-700 dark:text-slate-300 font-display">
                  ${e?"Net Zero-Sum Balance (All League)":"ยอดรวมสุทธิทั้งลีก (Net Zero-Sum Balance)"}
                </td>
                <td class="py-3 px-2 text-center text-slate-900 dark:text-white font-black">${N}</td>
                <td class="py-3 px-3 text-right font-black text-slate-900 dark:text-white text-sm sm:text-base">0 THB</td>
              </tr>
            `),i&&(i.innerHTML=`
              <!-- 01 / ZERO-SUM BALANCE & PAYOUT TIERS -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">01 /</span>
                  <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                    ${e?"ZERO-SUM BALANCE & PAYOUT TIERS":"โครงสร้างดุล ZERO-SUM & ขั้นบันไดจ่าย-รับ"}
                  </h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Rank 1 - 6 Receives (+)":"กลุ่มผู้ได้รับเงินรางวัล (อันดับ 1 - 6)"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">+${x.toLocaleString()} <span class="text-xs font-normal">THB</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"1st 1,000 / 2nd 800 / 3rd 600 / 4th 400 / 5th 200 / 6th 100":"แชมป์ 1,000 / รอง 800 / ที่ 3 600 / ที่ 4 400 / ที่ 5 200 / ที่ 6 100"}</div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Rank 7 - 12 Pays (-)":"กลุ่มผู้ร่วมจ่ายเงินค่าปรับ (อันดับ 7 - 12)"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">-${C.toLocaleString()} <span class="text-xs font-normal">THB</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"7th -100 / 8th -200 / 9th -400 / 10th -600 / 11th -800 / 12th -1,000":"ที่ 7 -100 / ที่ 8 -200 / ที่ 9 -400 / ที่ 10 -600 / ที่ 11 -800 / บ๊วย -1,000"}</div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span class="text-[10px] uppercase font-bold text-slate-400 font-display">${e?"Net Zero-Sum Treasury Balance":"ดุลเงินกองกลางสุทธิ (Zero-Sum)"}</span>
                    <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">0 <span class="text-xs font-normal text-slate-400">THB</span></div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"Perfect balance • Settled all-at-once post-GW 38":"ดุลพอดี 100% • เคลียร์จ่ายทีเดียวหลังจบ GW 38"}</div>
                  </div>
                </div>
              </div>

              <!-- 02 / SEASON-END PAYOUT LEADERBOARD -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">02 /</span>
                      <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                        ${e?`SEASON-END PAYOUT LEADERBOARD (GW 1 - ${D})`:`ตารางสรุปยอดจ่าย-รับสิ้นฤดูกาล (GW 1 - ${D})`}
                      </h3>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ${e?`Overall fantasy standings combined with mini-game balances (${D} GWs finalized)`:`อัปเดตตามอันดับคะแนนรวมแฟนตาซี พร้อมรวมยอดทายผล (จบแล้ว ${D} วีค)`}
                    </p>
                  </div>
                  <!-- Search & Filters -->
                  <div class="flex items-center gap-2 flex-wrap">
                    <div class="relative min-w-[140px] xs:min-w-[180px] max-w-xs flex-1">
                      <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </span>
                      <input 
                        type="text" 
                        id="standard-prizes-search-input"
                        data-rendered-lang="${R}"
                        data-rendered-league="${this.escapeHtml(G)}"
                        value="${this.escapeHtml(this.prizesSearchQuery||"")}" 
                        oninput="app.handlePrizesSearch(this.value)"
                        aria-label="${e?"Search team name or manager":"ค้นหาชื่อทีมหรือผู้จัดการ"}"
                        placeholder="${e?"Search team...":"ค้นหาทีม..."}"
                        class="w-full pl-8 pr-7 py-2 min-h-[38px] sm:min-h-[34px] text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-sans"
                      />
                      <button id="standard-prizes-search-clear" type="button" aria-label="${e?"Clear search":"ล้างการค้นหา"}" onclick="app.handlePrizesSearch('')" class="${this.prizesSearchQuery?"":"hidden "}absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div class="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-wrap">
                      <button id="btn-standard-filter-all" onclick="app.setPrizesFilter('all')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="all"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"All":"ทั้งหมด"}
                      </button>
                      <button id="btn-standard-filter-winners" onclick="app.setPrizesFilter('winners')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="winners"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Receiving":"รับเงินรางวัล"}
                      </button>
                      <button id="btn-standard-filter-fined" onclick="app.setPrizesFilter('fined')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="fined"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Paying":"ร่วมจ่ายเงิน"}
                      </button>
                      ${Q.some(M=>!this.isPrizeEligible(M.entry_id))?`
                      <button id="btn-standard-filter-non_prize" onclick="app.setPrizesFilter('non_prize')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${this.prizesFilterMode==="non_prize"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}">
                        ${e?"Guest":"ร่วมสนุก"}
                      </button>
                      `:""}
                    </div>
                  </div>
                </div>
                <div class="overflow-x-auto scrollbar-thin -mx-4 sm:mx-0 touch-scroll table-sticky-container">
                  <table class="w-full text-left table-sticky table-clean ${L?"min-w-[620px]":""}">
                    <thead>
                      ${Y}
                    </thead>
                    <tbody id="standard-prizes-tbody" class="text-xs sm:text-sm">
                      ${q}
                    </tbody>
                    <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 font-mono text-xs sm:text-sm font-bold">
                      ${X}
                    </tfoot>
                  </table>
                </div>
              </div>
            `)}else this.config&&this.config.features&&this.config.features.prize_model==="bramann_dual_prize"?this.renderBramannDualPrizeView(t,a,r,d,i):(d&&(d.innerHTML=`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10.5px] font-mono font-bold">${e?"PENDING RULES":"รอการประกาศกติกา"}</span>`),t&&(t.innerText=e?"Official Rules & Prize Structure Pending":"โครงสร้างเงินรางวัล & กติกาการแข่งขัน"),a&&(a.innerText=e?"Awaiting official rules and prize structure confirmation from league managers.":"อยู่ระหว่างรอยืนยันรายละเอียดกติกาและเงินรางวัลจากผู้จัดการลีก"),i&&(i.innerHTML=`
              <!-- 01 / OFFICIAL STATUS -->
              <div class="glass-card rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-2xs">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div class="space-y-1.5">
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-display">${e?"Awaiting Official Rules & Prize Structure Announcement":"อยู่ระหว่างรอการประกาศกติกาและโครงสร้างเงินรางวัล"}</h3>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                    ${e?`Competition conditions, rules, and prize allocations for <strong>${this.escapeHtml(this.data.name)}</strong> are currently being finalized by the league managers. Details will be updated on this page upon official announcement.`:`รายละเอียดกติกา เงื่อนไขการแข่งขัน และการจัดสรรเงินรางวัลของลีก <strong>${this.escapeHtml(this.data.name)}</strong> อยู่ระหว่างการสรุปรายละเอียดจากผู้จัดการลีก ระบบจะนำมาอัปเดตให้ทราบในหน้านี้ทันทีหลังการประกาศอย่างเป็นทางการ`}
                  </p>
                </div>
                <div class="pt-2 flex items-center justify-center gap-2 flex-wrap font-mono">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    League ID: ${this.activeLeagueId}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    ${e?`${(this.data.teams||[]).length} Members`:`สมาชิก ${(this.data.teams||[]).length} ทีม`}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    ${e?"Rules: Pending":"กติกา: รอยืนยัน"}
                  </span>
                </div>
              </div>
            `))}toggleTrackedRow(e){if(!e)return;const t=e.classList.contains("row-tracked"),a=e.closest("tbody");a&&a.querySelectorAll("tr.row-tracked").forEach(r=>r.classList.remove("row-tracked")),t||e.classList.add("row-tracked")}lockBodyScroll(){this._isScrollLocked||(this._savedScrollY=window.pageYOffset||document.documentElement.scrollTop||window.scrollY||0,document.body.style.position="fixed",document.body.style.top=`-${this._savedScrollY}px`,document.body.style.left="0",document.body.style.right="0",document.body.style.width="100%",document.body.style.overflow="hidden",this._isScrollLocked=!0)}unlockBodyScroll(e=null){if(!this._isScrollLocked)return;const t=this._savedScrollY||0;document.body.style.position="",document.body.style.top="",document.body.style.left="",document.body.style.right="",document.body.style.width="",document.body.style.overflow="",this._isScrollLocked=!1,window.scrollTo(0,t),e&&this.highlightRecentTeam(e)}highlightRecentTeam(e){if(e)try{document.querySelectorAll(".active-row-cue").forEach(r=>{r.classList.remove("active-row-cue")});const t=`tr[onclick*="${e}"], button[onclick*="${e}"]`;document.querySelectorAll(t).forEach(r=>{const p=r.tagName==="TR"?r:r.closest("tr");p&&(p.classList.add("active-row-cue"),setTimeout(()=>{p.classList.remove("active-row-cue")},2500))})}catch{}}preserveInputFocus(e){const t=document.activeElement,a=t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"),r=a?t.id:null,p=a?t.selectionStart:null,i=a?t.selectionEnd:null;if(e(),r){const d=document.getElementById(r);if(d&&document.activeElement!==d&&(d.focus(),p!==null&&i!==null&&d.setSelectionRange))try{d.setSelectionRange(p,i)}catch{}}}handlePrizesSearch(e){this.preserveInputFocus(()=>{this.prizesSearchQuery=(e||"").trim(),this.renderPrizesView()})}setPrizesFilter(e){this.preserveInputFocus(()=>{this.prizesFilterMode=e||"all",this.renderPrizesView()})}togglePrizesHistory(){this.prizesHistoryExpanded=!this.prizesHistoryExpanded,this.renderPrizesView()}handleCupSearch(e){this.preserveInputFocus(()=>{this.cupSearchQuery=(e||"").trim(),this.renderCupView()})}setCupFilter(e){this.preserveInputFocus(()=>{this.cupFilterMode=e||"all",this.renderCupView()})}selectMonth(e){this.selectedMonthId=e,this.renderPrizesView()}renderHallOfFameView(){const e=document.getElementById("hall-of-fame-records"),t=document.getElementById("hall-of-fame-table-body"),a=Number(this.multiData.max_gw)||2,r=this.currentLang==="en";if(this.data.tier===2||this.config&&this.config.tier===2){e&&(e.innerHTML=`
              <div class="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs max-w-xl mx-auto my-4">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xl font-bold font-display">
                  🏆
                </div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                  ${r?"Tier 2 League: Standings & Leaderboard Only":"มินิลีกระดับ Tier 2: โหมดแสดงตารางคะแนน"}
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  ${r?"Hall of Fame consistency metrics, medalists, and variance benchmarking are designed for Tier 1 leagues. For Tier 2 leagues, please refer to the Standings table.":"ทำเนียบแชมป์และสถิติความสม่ำเสมอออกแบบมาสำหรับลีกระดับ Tier 1 สำหรับลีก Tier 2 สามารถติดตามอันดับและคะแนนรวมได้ที่หน้าตารางคะแนน"}
                </p>
                <button onclick="app.switchTab('gameweek-view')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-display shadow-2xs transition-colors cursor-pointer">
                  ${r?"View Standings & Live Points":"กลับไปดูตารางคะแนน & แต้มสด"}
                </button>
              </div>
            `),t&&(t.innerHTML="");return}const p=document.getElementById("hof-league-badge");if(p){const C=(this.data.teams||[]).length;p.innerText=r?`${C} Teams`:`${C} ทีมสมาชิก`}let i=0;for(let C=1;C<=a;C++){const T=this.data.gameweeks?this.data.gameweeks[String(C)]:null;T&&T.is_finished&&i++}const d=document.getElementById("hof-gw-badge");d&&(d.innerText=i>0?r?`Official Archive: GW 1 - GW ${i}`:`บันทึกทางการ: GW 1 - GW ${i}`:r?"Awaiting Official Final":"รอผลการแข่งขันทางการ");let n={score:0,team:"-",gw:1,entry_id:null},c={bench:0,team:"-",gw:1,entry_id:null};const m={};(this.data.teams||[]).forEach(C=>{m[C.entry_id]={entry_id:C.entry_id,team_name:C.entry_name,player_name:C.player_name,total_net:0,scores:[],total_hits:0,wins:0,top3:0}});for(let C=1;C<=a;C++){const T=this.data.gameweeks?this.data.gameweeks[String(C)]:null;if(T&&T.results&&T.is_finished){T.results.forEach(w=>{this.isDepartedNonPrize(w.entry_id)||(m[w.entry_id]||(m[w.entry_id]={entry_id:w.entry_id,team_name:w.team_name,player_name:w.player_name,total_net:0,scores:[],total_hits:0,wins:0,top3:0}),m[w.entry_id].total_hits+=w.hits||0)});const H=T.results.filter(w=>this.isPrizeEligible(w.entry_id)),z=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),U=[...H].sort((w,b)=>{const _=b.net_points-w.net_points;return _!==0?_:z?this.compareTeamPlayerScores(w.entry_id,b.entry_id,C):0}),Q=U.length>0?U[0].net_points:0;let W=[];if(U.length>0){const w=U[0];z?W=U.filter(b=>b.net_points===Q&&this.compareTeamPlayerScores(b.entry_id,w.entry_id,C)===0):W=U.filter(b=>b.net_points===Q)}const P=W.length>0?1/W.length:0;[...T.results.filter(w=>!this.isDepartedNonPrize(w.entry_id))].sort((w,b)=>{const _=b.net_points-w.net_points;return _!==0?_:z?this.compareTeamPlayerScores(w.entry_id,b.entry_id,C):0}).forEach((w,b)=>{const _=m[w.entry_id];_&&(_.total_net+=w.net_points,_.scores.push(w.net_points),this.isPrizeEligible(w.entry_id)&&W.some(S=>S.entry_id===w.entry_id)&&(_.wins+=P),b<3&&(_.top3+=1),w.net_points>n.score&&(n={score:w.net_points,team:w.team_name,gw:C,entry_id:w.entry_id}),w.bench_points>c.bench&&(c={bench:w.bench_points,team:w.team_name,gw:C,entry_id:w.entry_id}))})}}const s=Object.values(m).sort((C,T)=>{const H=this.isTeamDeparted(C.entry_id)?1:0,z=this.isTeamDeparted(T.entry_id)?1:0;return H!==z?H-z:T.total_net-C.total_net}),o=s[0]||{team_name:"-",total_net:0,scores:[0],entry_id:null},l=s.filter(C=>this.isActivePrizeEligible(C.entry_id)),y=(l.length>0?l:s.filter(C=>this.isPrizeEligible(C.entry_id)))[0]||o,D=y,h=o.entry_id!==y.entry_id;let $=0,v=[];s.forEach(C=>{this.isPrizeEligible(C.entry_id)&&(C.wins>$?($=C.wins,v=[{name:C.team_name,entry_id:C.entry_id}]):C.wins===$&&C.wins>0&&v.push({name:C.team_name,entry_id:C.entry_id}))});const I=$%1===0?$:$.toFixed(1);let L=1,k=0,x=null;if(s.forEach(C=>{const T=this.isPrizeEligible(C.entry_id),H=this.isTeamDeparted(C.entry_id);!T||H?C.hof_rank=null:(k++,x!==null&&C.total_net<x&&(L=k),x=C.total_net,C.hof_rank=L),C.avg=C.scores.length>0?C.total_net/C.scores.length:0,C.high=C.scores.length>0?Math.max(...C.scores):0,C.low=C.scores.length>0?Math.min(...C.scores):0,C.spread=C.scores.length>0?C.high-C.low:0,C.isPrize=T,C.isDeparted=H}),this.hofCachedStats=s,e){let C="";if(v.length===1){const T=v[0];C=`<button onclick="app.openTeamModal(${T.entry_id})" class="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left cursor-pointer w-full">${this.escapeHtml(T.name)}</button>`}else v.length>1?C=`
              <div class="flex items-center gap-1 flex-wrap">
                ${v.map(T=>`
                  <button onclick="app.openTeamModal(${T.entry_id})" class="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer truncate max-w-[120px]">${this.escapeHtml(T.name)}</button>
                `).join("")}
              </div>
            `:C='<div class="text-xs font-bold text-slate-400 dark:text-slate-500">-</div>';e.innerHTML=`
            <!-- Card 1: Highest Single GW Score -->
            <div class="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div class="flex items-center justify-between gap-1.5 mb-1.5">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider truncate">${r?"Highest Single GW":"คะแนนสูงสุดต่อสัปดาห์"}</span>
                <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </span>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight tabular-nums">${n.score} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">PTS</span></div>
                <div class="mt-1">
                  ${n.entry_id?`<button onclick="app.openTeamModal(${n.entry_id})" class="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left cursor-pointer w-full">${this.escapeHtml(n.team)}</button>`:`<span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">${this.escapeHtml(n.team)}</span>`}
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-display">
                <span>Gameweek ${n.gw}</span>
                <span class="font-medium text-slate-500 dark:text-slate-400">${n.score>0?r?"Record High":"สถิติสูงสุด":"-"}</span>
              </div>
            </div>

            <!-- Card 2: Most Gameweek Wins -->
            <div class="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div class="flex items-center justify-between gap-1.5 mb-1.5">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider truncate">${r?"Most GW #1 Wins":"ครองอันดับ 1 มากที่สุด"}</span>
                <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3h14v4a5 5 0 01-5 5h-4a5 5 0 01-5-5V3zm2 4v0a3 3 0 003 3h4a3 3 0 003-3V5H7v2zm5 7v4m-4 4h8"/></svg>
                </span>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight tabular-nums">${I} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">${r?"WINS":"ครั้ง"}</span></div>
                <div class="mt-1">
                  ${C}
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-display">
                <span>${r?"Prize Eligible":"ชิงเงินรางวัล"}</span>
                <span class="font-medium text-slate-500 dark:text-slate-400">${v.length>1?`${v.length} ${r?"Tied Teams":"ทีมร่วม"}`:r?"Sole Leader":"แชมป์เดี่ยว"}</span>
              </div>
            </div>

            <!-- Card 3: Overall Leader -->
            <div class="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div class="flex items-center justify-between gap-1.5 mb-1.5">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider truncate">${r?"Overall Leader":"จ่าฝูงคะแนนรวม"}</span>
                <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                </span>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight tabular-nums">${D.total_net} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">PTS</span></div>
                <div class="mt-1">
                  ${D.entry_id?`<button onclick="app.openTeamModal(${D.entry_id})" class="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left cursor-pointer w-full">${this.escapeHtml(D.team_name)}</button>`:`<span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">${this.escapeHtml(D.team_name)}</span>`}
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-display">
                <span class="truncate max-w-[130px] sm:max-w-none">${h?r?`*Friendly Lead: ${this.escapeHtml(o.team_name)}`:`*ร่วมสนุกนำ: ${this.escapeHtml(o.team_name)}`:r?`Avg ${(D.avg||0).toFixed(1)} pts/GW`:`เฉลี่ย ${(D.avg||0).toFixed(1)} pts/GW`}</span>
                <span class="font-medium text-slate-500 dark:text-slate-400">#1 Net</span>
              </div>
            </div>

            <!-- Card 4: Best Single GW Bench -->
            <div class="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div class="flex items-center justify-between gap-1.5 mb-1.5">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider truncate">${r?"Best Single GW Bench":"คะแนนสำรองสูงสุด"}</span>
                <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </span>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight tabular-nums">${c.bench} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">PTS</span></div>
                <div class="mt-1">
                  ${c.entry_id?`<button onclick="app.openTeamModal(${c.entry_id})" class="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left cursor-pointer w-full">${this.escapeHtml(c.team)}</button>`:`<span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">${this.escapeHtml(c.team)}</span>`}
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-display">
                <span>Gameweek ${c.gw}</span>
                <span class="font-medium text-slate-500 dark:text-slate-400">${r?"Bench Power":"ตัวสำรองแต้มสูง"}</span>
              </div>
            </div>
          `}this.renderHallOfFameFilterPills(),this.renderHallOfFameTable()}renderHallOfFameFilterPills(){const e=document.getElementById("hof-filter-pills");if(!e)return;const t=this.currentLang==="en",a=this.hofCachedStats||[],r=a.length,p=a.filter(m=>m.hof_rank&&m.hof_rank<=10).length,i=a.filter(m=>m.isPrize).length,d=a.filter(m=>m.wins>0).length,n=[{id:"all",label:t?"All Teams":"ทุกทีม",count:r},{id:"top10",label:t?"Top 10":"10 อันดับแรก",count:p},{id:"prize",label:t?"Prize Contenders":"ชิงเงินรางวัล",count:i},{id:"winners",label:t?"GW Winners":"เคยได้แชมป์สัปดาห์",count:d}];let c="";n.forEach(m=>{const s=this.hofFilterMode===m.id;c+=`
            <button 
              type="button"
              role="button"
              aria-pressed="${s}"
              onclick="app.setHofFilter('${m.id}')" 
              class="px-3 py-1.5 min-h-[32px] rounded-xl font-bold font-display text-[11px] sm:text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${s?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs font-black":"bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold"}"
            >
              <span>${m.label}</span>
              <span class="text-[10px] opacity-75 font-semibold font-mono">(${m.count})</span>
            </button>
          `}),e.innerHTML=c}setHofFilter(e){this.hofFilterMode=e||"all",this.renderHallOfFameFilterPills(),this.renderHallOfFameTable()}setHofSortBy(e,t=null){t?(this.hofSortBy=e,this.hofSortOrder=t):this.hofSortBy===e?this.hofSortOrder=this.hofSortOrder==="asc"?"desc":"asc":(this.hofSortBy=e,e==="spread"||e==="hits"||e==="team_name"?this.hofSortOrder="asc":this.hofSortOrder="desc"),this.renderHallOfFameTable()}handleHofSearch(e){this.hofSearchQuery=(e||"").trim(),this.renderHallOfFameTable()}renderHallOfFameTable(){const e=document.getElementById("hall-of-fame-table-body");if(!e)return;const t=this.currentLang==="en";let a=[...this.hofCachedStats||[]];if(this.hofFilterMode==="top10"?a=a.filter(m=>m.hof_rank&&m.hof_rank<=10):this.hofFilterMode==="prize"?a=a.filter(m=>m.isPrize):this.hofFilterMode==="winners"&&(a=a.filter(m=>m.wins>0)),this.hofSearchQuery){const m=this.hofSearchQuery.toLowerCase();a=a.filter(s=>s.team_name&&s.team_name.toLowerCase().includes(m)||s.player_name&&s.player_name.toLowerCase().includes(m))}const r=this.hofSortBy||"total_net",p=this.hofSortOrder==="asc";a.sort((m,s)=>{if(r==="total_net"&&!p){const l=m.isDeparted?1:0,g=s.isDeparted?1:0;if(l!==g)return l-g}let o=0;if(r==="total_net")o=m.total_net-s.total_net;else if(r==="wins")o=m.wins-s.wins;else if(r==="avg")o=m.avg-s.avg;else if(r==="high")o=m.high-s.high;else if(r==="low")o=m.low-s.low;else if(r==="spread")o=m.spread-s.spread;else if(r==="hits")o=m.total_hits-s.total_hits;else if(r==="team_name")return p?m.team_name.localeCompare(s.team_name):s.team_name.localeCompare(m.team_name);return o!==0?p?o:-o:s.total_net-m.total_net}),[{id:"rank",key:"total_net"},{id:"team",key:"team_name"},{id:"wins",key:"wins"},{id:"avg",key:"avg"},{id:"high",key:"high"},{id:"low",key:"low"},{id:"spread",key:"spread"},{id:"hits",key:"hits"}].forEach(m=>{const s=document.getElementById(`hof-th-${m.id}`);s&&(this.hofSortBy===m.key?(s.classList.add("text-slate-900","dark:text-white","font-black"),s.classList.remove("text-slate-500","dark:text-slate-400"),s.setAttribute("aria-sort",p?"ascending":"descending")):(s.classList.remove("text-slate-900","dark:text-white","font-black"),s.classList.add("text-slate-500","dark:text-slate-400"),s.removeAttribute("aria-sort")))});const d=document.getElementById("mobile-hof-sort-label");if(d){const o=t?{total_net:"Total Net Points",wins:"GW #1 Wins",avg:"Average Points",high:"High Score",low:"Floor Score",spread:"Stability (Lowest Spread)",hits:"Fewest Hits",team_name:"Team Name (A-Z)"}:{total_net:"คะแนนรวม (# อันดับรวม)",wins:"แชมป์สัปดาห์ (#1 Wins)",avg:"คะแนนเฉลี่ย (Avg Points)",high:"คะแนนสูงสุด (High Score)",low:"คะแนนต่ำสุด (Floor Score)",spread:"ความนิ่ง (แกว่งน้อยสุด)",hits:"คะแนนลบน้อยสุด",team_name:"ชื่อทีม (A-Z)"};d.innerText=`${t?"Sorted by":"เรียงตาม"}: ${o[r]||r}`}const n=document.getElementById("hof-sort-select");if(n&&n.value!==r&&(n.value=r),a.length===0){e.innerHTML=`
            <tr>
              <td colspan="8" class="py-8 text-center text-slate-500 dark:text-slate-400">
                <div class="text-2xl mb-1">🔍</div>
                <div class="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">${t?"No teams matched your criteria":"ไม่พบข้อมูลทีมตามเงื่อนไขที่เลือก"}</div>
                <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">${t?"Try clearing your search query or switching filter pills":'ลองพิมพ์ค้นหาใหม่ หรือกดเลือก "ทุกทีม"'}</div>
              </td>
            </tr>
          `;return}let c="";a.forEach(m=>{let s="";m.isPrize?m.isDeparted?s=this.getDepartedRankBadge():m.hof_rank===1?s='<span class="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-black text-xs font-display">1</span>':m.hof_rank===2?s='<span class="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700 font-bold text-xs font-display">2</span>':m.hof_rank===3?s='<span class="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold text-xs font-display">3</span>':s=`<span class="text-slate-400 dark:text-slate-500 font-semibold font-display text-xs">${m.hof_rank}</span>`:s=this.getNonPrizeRankBadge();const o=m.scores.length>0?m.avg.toFixed(1):"-",l=m.scores.length>0?m.high:"-",g=m.scores.length>0?m.low:"-",y=m.scores.length>0?`±${m.spread}`:"-",D=m.wins%1===0?m.wins:m.wins.toFixed(1);c+=`
            <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer ${m.isDeparted?"opacity-70":""}">
              <td class="sticky-col-rank py-2.5 px-2 text-center whitespace-nowrap">${s}</td>
              <td class="sticky-col-team py-2.5 px-2 sm:px-3 min-w-[130px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button onclick="event.stopPropagation(); app.openTeamModal(${m.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer block truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-none">${this.escapeHtml(m.team_name)}</button>
                  ${this.getPrizeBadge(m.entry_id)}
                  ${m.isDeparted?this.getDepartedBadge(m.entry_id):""}
                </div>
                <div class="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">${this.escapeHtml(m.player_name||"")}</div>
              </td>
              <td class="py-2.5 px-1 sm:px-2 text-center font-display tabular-nums font-bold whitespace-nowrap ${m.wins>0?"text-amber-600 dark:text-amber-400 font-black":"text-slate-400 dark:text-slate-500"}">${D}</td>
              <td class="py-2.5 px-1 sm:px-2 text-center font-display tabular-nums font-black text-slate-900 dark:text-white whitespace-nowrap">${o}</td>
              <td class="py-2.5 px-1 sm:px-2 text-center font-display tabular-nums text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">${l}</td>
              <td class="py-2.5 px-1 sm:px-2 text-center font-display tabular-nums text-slate-400 dark:text-slate-500 whitespace-nowrap">${g}</td>
              <td class="py-2.5 px-1 sm:px-2 text-center font-display tabular-nums whitespace-nowrap">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 font-mono">${y}</span>
              </td>
              <td class="py-2.5 px-1.5 sm:px-3 text-right font-display tabular-nums whitespace-nowrap ${m.total_hits>0?"text-rose-600/80 dark:text-rose-400/80 font-semibold font-mono":"text-slate-400 dark:text-slate-500 font-mono"}">${m.total_hits>0?`-${m.total_hits}`:"-"}</td>
            </tr>
          `}),e.innerHTML=c}renderGlobalRadarView(){const e=document.getElementById("global-radar-header-pill"),t=this.currentLang==="en";if(e){const u=this.multiData&&this.multiData.leagues||{},N=this.configs||{},w=(this.multiData&&this.multiData.league_order||Object.keys(u)).filter(E=>{const A=u[E];return A&&A.tier!==2&&(!N[E]||N[E].tier!==2)}),b=new Set;w.forEach(E=>{(u[E]&&u[E].teams||[]).forEach(A=>{A&&A.entry_id!==void 0&&b.add(Number(A.entry_id))})});const _=w.length,S=b.size;e.innerText=t?`${_} ${_===1?"League":"Leagues"} • ${S} Teams`:`${_} ลีก • ${S} ทีม`}const a=document.getElementById("radar-main-subtitle"),r=document.getElementById("radar-banner-stat-text"),p=Object.keys(this.multiData&&this.multiData.leagues||{}).filter(u=>{const N=this.multiData.leagues[u],w=this.configs&&this.configs[u]||{};return N&&N.tier!==2&&w.tier!==2}).length,i=p<=1;if(a&&(i?a.innerText=t?"Compare form consistency, scoring floor, and ceiling across every team in your league":"เปรียบเทียบมาตรฐานฟอร์มการเล่น ความนิ่ง และความแกว่ง ของทุกทีมภายในลีกของคุณ":a.innerText=t?"Compare performance consistency, stability, and volatility across all Tier-1 leagues in this group":"เปรียบเทียบมาตรฐานฟอร์มการเล่น ความนิ่ง และความแกว่ง ของทุกทีมในกลุ่มลีกที่เชื่อมต่อ"),r){const u=this.data&&Array.isArray(this.data.teams)?this.data.teams.length:0;r.innerText=i?t?`All ${u} league teams analyzed`:`วิเคราะห์ครบทั้ง ${u} ทีมในลีก`:t?`Analyzed across ${p} Leagues`:`วิเคราะห์ข้าม ${p} ลีกสมบูรณ์`}const d=document.getElementById("benchmark-ranking-card");d&&d.classList.toggle("hidden",i);const n=document.getElementById("radar-guide-heading");n&&(n.innerText=t?"Consistency Tiers Criteria":"ระดับความสม่ำเสมอ");const c=document.getElementById("radar-benchmark-title");c&&(c.innerText=t?"Average League Strength Benchmarks":"จัดอันดับความแข็งแกร่งเฉลี่ยของแต่ละลีก");const m=document.getElementById("radar-guide-btn-text");if(m){const u=document.getElementById("radar-guide-content")?.classList.contains("hidden");t?m.innerText=u?"Show Criteria":"Hide Criteria":m.innerText=u?"ดูเกณฑ์":"ซ่อนเกณฑ์"}const s=document.getElementById("global-radar-records"),o=document.getElementById("global-radar-league-benchmarks"),l=document.getElementById("global-radar-league-pills"),g=document.getElementById("global-radar-table-body");if(!g)return;const y=Number(this.multiData.max_gw)||2,D=this.multiData.leagues||{},h=this.configs||{};if(Object.entries(D).some(([u,N])=>!N||N.tier===2||h[u]&&h[u].tier===2?!1:!Array.isArray(N.teams)||N.teams.length===0||!N.gameweeks||Object.keys(N.gameweeks).length===0)&&typeof window<"u"&&window.location&&window.location.protocol!=="file:"){g.innerHTML=`<tr><td colspan="10" class="text-center py-8 text-slate-400 dark:text-slate-500 text-xs animate-pulse">${t?"Loading cross-league radar telemetry...":"กำลังโหลดข้อมูลเรดาร์ฟอร์มทุกลีก..."}</td></tr>`,this.ensureRadarData().then(u=>{u&&this.activeTab==="global-radar-view"&&this.renderGlobalRadarView()});return}const v=this.multiData&&this.multiData.league_order||Object.keys(D),I=[];if(v.forEach(u=>{const N=D[u];if(!N||N.tier===2||h[u]&&h[u].tier===2)return;const w=N.teams||[],b=new Set(w.map(q=>Number(q.entry_id))),_=N.gameweeks||{};let S=0,E=0;for(let q=1;q<=y;q++){const j=_[String(q)];j&&j.is_finished&&(E++,(j.results||[]).forEach(R=>{b.has(Number(R.entry_id))&&(S+=R.net_points||0)}))}const A=w.length*Math.max(E,1),F=A>0?(S/A).toFixed(1):"0.0";I.push({id:u,name:N.name,short_name:h[u]&&h[u].short_name||N.name,team_count:w.length,avg:Number(F),total_net:S})}),o){const u=[...I].sort((E,A)=>A.avg-E.avg),N=u.length>0?u[0].avg:70,w=Math.max(0,N-12),b=this.radarLeagueFilter||"all",_=String(this.activeLeagueId),S=document.getElementById("benchmark-clear-filter");S&&(b!=="all"?S.classList.remove("hidden"):S.classList.add("hidden")),o.innerHTML=u.map((E,A)=>{const F=A+1,q=b===String(E.id),j=String(E.id)===_,R=N-w,G=R>0&&N>0?Math.max(0,Math.min(100,Math.round((E.avg-w)/R*100))):0,K=F===1?'<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black inline-flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0 font-mono shadow-2xs">1</span>':F===2?'<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-bold inline-flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0 font-mono">2</span>':F===3?'<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold inline-flex items-center justify-center text-[10px] sm:text-xs border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0 font-mono">3</span>':`<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-transparent text-slate-400 dark:text-slate-500 font-medium inline-flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0 font-mono">${F}</span>`,B=this.currentLang==="en",Y=j?`<span class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 font-display">${B?"Your League":"ลีกที่คุณอยู่"}</span>`:"",X=q?"ring-2 ring-slate-900 dark:ring-white border-slate-900 dark:border-white bg-white dark:bg-slate-800/90 shadow-xs":j?"border-slate-400/80 dark:border-slate-600/80 bg-white/80 dark:bg-slate-900/50 hover:border-slate-500":"border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600";return`
              <div onclick="app.setRadarLeagueFilter('${q?"all":E.id}')" 
                   class="group relative overflow-hidden rounded-xl border ${X} p-2 sm:p-2.5 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
                   title="${q?B?"Click to clear filter":"คลิกเพื่อยกเลิกการกรอง":B?"Click to filter this league":"คลิกเพื่อกรองเฉพาะลีกนี้"}">
                
                <!-- Power Bar Background with subtle neutral tone -->
                <div class="absolute left-0 top-0 bottom-0 bg-slate-100/90 dark:bg-slate-800/60 pointer-events-none transition-all group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/60 border-r border-slate-300/60 dark:border-slate-700/60" style="width: ${G}%"></div>

                <!-- Left info: Uniform Rank + League Name + Current League Badge -->
                <div class="relative flex items-center gap-2.5 sm:gap-3 min-w-0">
                  ${K}
                  <div class="min-w-0 flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-display truncate">${this.escapeHtml(E.short_name)}</span>
                    ${Y}
                    ${q?`<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold flex items-center gap-1">${B?"Filtering":"กำลังกรอง"} <span class="text-[8px]">✕</span></span>`:""}
                  </div>
                </div>

                <!-- Right Score: Only Average Score pts -->
                <div class="relative text-right flex-shrink-0">
                  <span class="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono tabular-nums">${E.avg.toFixed(1)}</span>
                  <span class="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono"> pts</span>
                </div>
              </div>
            `}).join("")}const L={};Object.keys(D).forEach(u=>{const N=D[u];if(!N||N.tier===2||h[u]&&h[u].tier===2)return;const w=h[u]&&h[u].short_name||N.name||`League ${u}`;(N.teams||[]).forEach(_=>{const S=Number(_.entry_id);L[S]||(L[S]={entry_id:S,team_name:_.entry_name,player_name:_.player_name,leagues:[],scores_by_gw:{},hits_by_gw:{},bench_by_gw:{},total_hits:0,total_bench:0}),L[S].leagues.some(E=>String(E.id)===String(u))||L[S].leagues.push({id:u,name:w})});const b=N.gameweeks||{};for(let _=1;_<=y;_++){const S=b[String(_)];!S||!S.results||S.results.forEach(E=>{const A=Number(E.entry_id);L[A]&&S.is_finished&&(L[A].hits_by_gw[_]===void 0&&(L[A].hits_by_gw[_]=E.hits||0),L[A].scores_by_gw[_]===void 0&&(L[A].scores_by_gw[_]=E.net_points,L[A].bench_by_gw[_]=E.bench_points||0))})}});let k=null,x=0;Object.values(D).forEach(u=>{const N=u&&u.gameweeks||{};for(let w=1;w<=y;w++){const b=N[String(w)];if(!b)continue;b.is_finished&&w>x&&(x=w),(b.is_started!==void 0?!!b.is_started:b.is_finished||b.results&&b.results.some(S=>S.points>0))&&!b.is_finished&&(!k||w>k)&&(k=w)}});const C=document.getElementById("radar-banner-stat-badge");C&&(k?(C.className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-display shadow-2xs",C.innerHTML=`<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span><span>${t?`GW ${k} In-Play • Stats based on finalized GW 1 - ${x}`:`กำลังแข่งขันสด GW ${k} • สถิติอิงตาม GW 1 - ${x} ที่จบสมบูรณ์`}</span>`):(C.className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/70 font-display shadow-2xs",C.innerHTML=`<svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t?`GW 1 - ${x} Finalized • Official Standings`:`GW 1 - ${x} จบสมบูรณ์ • สถิติทางการ`}</span>`));const T=document.getElementById("radar-gw-status-badge");T&&(k?T.innerText=t?`(GW ${k} In-Play • GW 1 - ${x} Finalized)`:`(กำลังแข่ง GW ${k} • สถิติจบสมบูรณ์ GW 1 - ${x})`:T.innerText=x>0?t?`(GW 1 - ${x} Finished)`:`(GW 1 - ${x} จบสมบูรณ์)`:t?"(Awaiting GW 1)":"(รอผล GW 1)");let H={score:0,team:"-",player:"-",gw:1,league:"-",entry_id:0},z={avg:0,team:"-",player:"-",total:0,league:"-",entry_id:0},U={spread:999,floor:0,team:"-",player:"-",avg:0,league:"-",entry_id:0},Q={bench:0,team:"-",player:"-",league:"-",entry_id:0};const W=Object.values(L).map(u=>{const N=Object.entries(u.scores_by_gw).map(([M,V])=>({gw:Number(M),pts:V})),w=N.map(M=>M.pts),b=w.reduce((M,V)=>M+V,0),_=w.length,S=_>0?b/_:0,E=N.reduce((M,V)=>V.pts>M.pts?V:M,{gw:1,pts:0}),A=N.reduce((M,V)=>V.pts<M.pts?V:M,{gw:1,pts:_>0?w[0]:0}),F=_>0?E.pts:0,q=_>0?A.pts:0,j=F-q,R=Object.values(u.hits_by_gw).reduce((M,V)=>M+V,0),G=Object.values(u.bench_by_gw).reduce((M,V)=>M+V,0),K=u.leagues[0]?u.leagues[0].name:"-";F>H.score&&(H={score:F,team:u.team_name,player:u.player_name,gw:E.gw,league:K,entry_id:u.entry_id}),S>z.avg&&(z={avg:S,team:u.team_name,player:u.player_name,total:b,league:K,entry_id:u.entry_id}),_>=4&&S>=60&&(j<U.spread||j===U.spread&&q>U.floor)&&(U={spread:j,floor:q,team:u.team_name,player:u.player_name,avg:S,league:K,entry_id:u.entry_id}),G>Q.bench&&(Q={bench:G,team:u.team_name,player:u.player_name,league:K,entry_id:u.entry_id});let B="",Y=0,X="pending";if(_>=3){const M=Math.round(S*10)/10,V=M>=71&&q>=41&&F>=110,Z=!V&&M>=64&&q>=32,O=!V&&!Z&&(j>=75&&q<35||F>=110&&q<32),ae=!V&&!Z&&!O&&M>=58,de=this.currentLang==="en";V?(X="s",Y=5,B=`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-white border border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-2xs font-display" title="${de?"S-Tier: Elite top performers (Avg ≥ 71.0, Floor ≥ 41, High ≥ 110)":"S-Tier: หัวกะทิยอดเยี่ยมและนิ่งจริง (Avg ≥ 71.0, Floor ≥ 41, High ≥ 110)"}">S-Tier</span>`):Z?(X="a",Y=4,B=`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 font-display" title="${de?"A-Tier: High standard performers (Avg ≥ 64.0, Floor ≥ 32)":"A-Tier: ฟอร์มดีมาตรฐานสูงสม่ำเสมอ (Avg ≥ 64.0, Floor ≥ 32)"}">A-Tier</span>`):O?(X="volatile",Y=2,B=`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50/90 text-rose-800 border border-rose-200/90 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 font-display" title="${de?"Volatile: Wild swings with deep floor drop or high score volatility":"Volatile: แต้มสวิงสูง จุดต่ำสุดหลุดลึกหรือแต้มแกว่งรุนแรง"}">Volatile</span>`):ae?(X="b",Y=3,B=`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 font-display" title="${de?"B-Tier: Steady mid baseline (Avg ≥ 58.0)":"B-Tier: ฟอร์มคงที่ระดับกลาง (Avg ≥ 58.0)"}">B-Tier</span>`):(X="c",Y=1,B=`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-normal bg-slate-50/60 text-slate-500 border border-slate-200/80 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 font-display" title="${de?"C-Tier: Developing baseline (Avg < 58.0)":"C-Tier: ระดับพัฒนาการ (Avg < 58.0)"}">C-Tier</span>`)}else X="pending",Y=0,B=`<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700 select-none" title="${this.currentLang==="en"?"Pending: Minimum 3 Gameweeks required for consistency rating":"กำลังเก็บข้อมูล: ต้องแข่งอย่างน้อย 3 Gameweeks เพื่อประเมินระดับความสม่ำเสมอ"}">-</span>`;return{...u,count:_,total_net:b,total_hits:R,total_bench:G,avg:S,high:F,high_gw:E.gw,low:q,low_gw:A.gw,spread:j,tier_key:X,tier_badge:B,tier_weight:Y}});if(U.spread===999&&W.length>0){const u=W.filter(_=>_.count>=2),b=[...u.length>0?u:W].sort((_,S)=>_.spread-S.spread)[0];U={spread:b.spread,floor:b.low,team:b.team_name,player:b.player_name,avg:b.avg,league:b.leagues[0]?b.leagues[0].name:"-",entry_id:b.entry_id}}if(W.sort((u,N)=>{const w=N.total_net-u.total_net;if(w!==0)return w;const b=N.avg-u.avg;if(b!==0)return b;const _=u.avg-u.low-(N.avg-N.low);if(Math.abs(_)>.001)return _;const S=N.high-N.avg-(u.high-u.avg);if(Math.abs(S)>.001)return S;const E=u.spread-N.spread;if(E!==0)return E;const A=u.total_hits-N.total_hits;if(A!==0)return A;const F=N.total_bench-u.total_bench;return F!==0?F:(u.team_name||"").localeCompare(N.team_name||"")}),W.forEach((u,N)=>{u.global_rank=N+1}),this._radarTeamList=W,e){const u=I.length<=1;e.innerText=u?t?`League Radar • ${W.length} Teams`:`เรดาร์ในลีก • ${W.length} ทีม`:t?`${I.length} Leagues • ${W.length} Teams`:`${I.length} ลีก • ${W.length} ทีม`}const P=document.getElementById("radar-banner-stat-text");if(P&&I.length<=1&&(P.innerText=t?`All ${W.length} league teams analyzed`:`วิเคราะห์ครบทั้ง ${W.length} ทีมในลีก`),s&&(s.innerHTML=`
            <!-- Card 1: Top Average -->
            <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between group shadow-xs">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 font-display truncate">
                      ${t?"Top Average":"คะแนนเฉลี่ยสูงสุด"}
                    </span>
                  </div>
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono tracking-wider whitespace-nowrap">
                    ${t?"AVG PTS":"เฉลี่ย"}
                  </span>
                </div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-tight flex items-baseline gap-1 tabular-nums">
                  <span>${z.avg.toFixed(1)}</span>
                  <span class="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">PTS/GW</span>
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button onclick="app.openTeamModal(${z.entry_id||0})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate w-full group-hover:underline">
                  ${this.escapeHtml(z.team)}
                </button>
                <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  ${this.escapeHtml(z.player)} • <span class="text-slate-600 dark:text-slate-300 font-mono font-bold">${t?"Total":"รวม"} ${z.total} pts</span>
                </div>
              </div>
            </div>

            <!-- Card 2: Most Consistent -->
            <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between group shadow-xs">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 font-display truncate">
                      ${t?"Most Consistent":"ความนิ่งสูงสุด"}
                    </span>
                  </div>
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono tracking-wider whitespace-nowrap">
                    ${t?"LOW SPREAD":"แกว่งน้อย"}
                  </span>
                </div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-tight flex items-baseline gap-1 tabular-nums">
                  <span>±${U.spread}</span>
                  <span class="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">PTS</span>
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button onclick="app.openTeamModal(${U.entry_id||0})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate w-full group-hover:underline">
                  ${this.escapeHtml(U.team)}
                </button>
                <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  ${this.escapeHtml(U.player)} • <span class="text-slate-600 dark:text-slate-300 font-mono font-bold">Floor ${U.floor} pts</span>
                </div>
              </div>
            </div>

            <!-- Card 3: Highest Single GW -->
            <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between group shadow-xs">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 font-display truncate">
                      ${t?"Highest GW Score":"ระเบิดฟอร์มสูงสุด"}
                    </span>
                  </div>
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono tracking-wider whitespace-nowrap">
                    GW ${H.gw}
                  </span>
                </div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-tight flex items-baseline gap-1 tabular-nums">
                  <span>${H.score}</span>
                  <span class="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">PTS</span>
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button onclick="app.openTeamModal(${H.entry_id||0})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate w-full group-hover:underline">
                  ${this.escapeHtml(H.team)}
                </button>
                <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  ${this.escapeHtml(H.player)} • <span class="text-slate-600 dark:text-slate-300 font-medium">${this.escapeHtml(H.league)}</span>
                </div>
              </div>
            </div>

            <!-- Card 4: Bench Depth -->
            <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between group shadow-xs">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    </span>
                    <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 font-display truncate">
                      ${t?"Highest Bench Points":"คะแนนสำรองสูงสุด"}
                    </span>
                  </div>
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono tracking-wider whitespace-nowrap">
                    ${t?"BENCH":"ตัวสำรอง"}
                  </span>
                </div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-tight flex items-baseline gap-1 tabular-nums">
                  <span>${Q.bench}</span>
                  <span class="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">PTS</span>
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button onclick="app.openTeamModal(${Q.entry_id||0})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate w-full group-hover:underline">
                  ${this.escapeHtml(Q.team)}
                </button>
                <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  ${this.escapeHtml(Q.player)} • <span class="text-slate-600 dark:text-slate-300 font-mono font-bold">${t?"Benched total":"ตกน้ำสะสม"}</span>
                </div>
              </div>
            </div>
          `),l)if(I.length<=1)l.classList.add("hidden"),l.innerHTML="";else{l.classList.remove("hidden");const u=this.radarLeagueFilter||"all";let N=`
            <button onclick="app.setRadarLeagueFilter('all')" class="px-3 py-1.5 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${u==="all"?"bg-slate-900 text-white dark:bg-blue-600 shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}">
              <span>${t?"All Leagues":"ทุกลีก"}</span>
              <span class="text-[10px] opacity-75 font-semibold">(${W.length})</span>
            </button>
          `;v.forEach(w=>{const b=D[w];if(!b||b.tier===2||h[w]&&h[w].tier===2)return;const _=h[w]&&h[w].short_name||b.name,S=(b.teams||[]).length,E=u===String(w);N+=`
              <button onclick="app.setRadarLeagueFilter('${w}')" class="px-3 py-1.5 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${E?"bg-slate-900 text-white dark:bg-blue-600 shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}">
                <span>${this.escapeHtml(_)}</span>
                <span class="text-[10px] opacity-75 font-semibold">(${S})</span>
              </button>
            `}),l.innerHTML=N}this.renderGlobalRadarTable()}renderGlobalRadarTable(){const e=document.getElementById("global-radar-table-body");if(!e||!this._radarTeamList)return;const t=this.radarSortBy||"total_net",a=this.radarSortOrder||(t==="spread"||t==="hits"?"asc":"desc"),r=this.currentLang==="en",p=["total_net","avg","high","low","spread","hits","bench","tier","team_name"],i={total_net:{full:r?"Total Net":"คะแนนรวม",short:r?"Total Net":"คะแนนรวม"},avg:{full:r?"Average Points":"คะแนนเฉลี่ย",short:r?"Avg":"เฉลี่ย"},high:{full:r?"Highest Score":"คะแนนสูงสุด",short:r?"High":"สูงสุด"},low:{full:r?"Lowest Floor":"คะแนนต่ำสุด",short:r?"Floor":"ต่ำสุด"},spread:{full:r?"Variance (Spread)":"ความแกว่ง",short:r?"Spread":"แกว่ง"},hits:{full:r?"Transfer Hits":"คะแนนลบ",short:r?"Hits":"ลบ"},bench:{full:r?"Bench Points":"คะแนนสำรอง",short:r?"Bench":"สำรอง"},tier:{full:r?"Consistency Tier":"ระดับความสม่ำเสมอ",short:r?"Tier":"ระดับ"},team_name:{full:r?"Team & Manager":"ทีม & ผู้จัดการ",short:r?"Team & Manager":"ทีม & ผู้จัดการ"}},d=a==="asc"?" ▲":" ▼";p.forEach(o=>{const l=document.getElementById("th-radar-"+o);if(l){const g=i[o]||{full:o,short:o},y=o===t,D=y?d:"";l.innerHTML=`<span class="hidden sm:inline">${g.full}${D}</span><span class="sm:hidden">${g.short}${D}</span>`;const h=l.closest("th");h&&(y?(h.classList.add("text-blue-600","dark:text-blue-400","font-black"),h.classList.remove("text-slate-500","dark:text-slate-400")):(h.classList.remove("text-blue-600","dark:text-blue-400","font-black"),h.classList.add("text-slate-500","dark:text-slate-400")))}});const n=document.getElementById("global-radar-sort-select");n&&n.value!==t&&(n.value=t);const c=document.getElementById("mobile-radar-sort-label");if(c){const g=r?{total_net:"Sorted by Total Net Pts",avg:"Sorted by Avg Pts",high:"Sorted by High Score",low:"Sorted by Floor (Lowest)",spread:"Sorted by Variance (Spread)",hits:"Sorted by Transfer Hits",bench:"Sorted by Bench Points",tier:"Sorted by Consistency Tier",team_name:"Sorted by Team Name"}:{total_net:"เรียงตามคะแนนรวม",avg:"เรียงตามคะแนนเฉลี่ย",high:"เรียงตามคะแนนสูงสุด",low:"เรียงตามคะแนนต่ำสุด",spread:"เรียงตามความนิ่ง (แกว่ง)",hits:"เรียงตามคะแนนลบ",bench:"เรียงตามคะแนนสำรอง",tier:"เรียงตามระดับความสม่ำเสมอ",team_name:"เรียงตามชื่อทีม"},y=a==="asc"?r?" ▲ (Ascending)":" ▲ (น้อยไปมาก)":r?" ▼ (Descending)":" ▼ (มากไปน้อย)";c.innerText=`${g[t]||(r?"Sorted by Total Net Pts":"เรียงตามคะแนนรวม")}${y}`}let m=[...this._radarTeamList];if(this.radarLeagueFilter&&this.radarLeagueFilter!=="all"&&(m=m.filter(o=>o.leagues.some(l=>String(l.id)===String(this.radarLeagueFilter)))),this.radarSearchQuery){const o=this.radarSearchQuery.toLowerCase().normalize("NFC").trim();m=m.filter(l=>(l.team_name||"").toLowerCase().normalize("NFC").includes(o)||(l.player_name||"").toLowerCase().normalize("NFC").includes(o))}if(m.sort((o,l)=>{let g=0;if(t==="avg"?g=a==="asc"?o.avg-l.avg:l.avg-o.avg:t==="spread"?g=a==="asc"?o.spread-l.spread:l.spread-o.spread:t==="high"?g=a==="asc"?o.high-l.high:l.high-o.high:t==="low"?g=a==="asc"?o.low-l.low:l.low-o.low:t==="hits"?g=a==="asc"?o.total_hits-l.total_hits:l.total_hits-o.total_hits:t==="bench"?g=a==="asc"?o.total_bench-l.total_bench:l.total_bench-o.total_bench:t==="tier"?g=a==="asc"?o.tier_weight-l.tier_weight:l.tier_weight-o.tier_weight:t==="team_name"?g=a==="asc"?(o.team_name||"").localeCompare(l.team_name||""):(l.team_name||"").localeCompare(o.team_name||""):g=a==="asc"?o.total_net-l.total_net:l.total_net-o.total_net,g!==0)return g;const y=l.total_net-o.total_net;if(y!==0)return y;const D=l.avg-o.avg;if(D!==0)return D;const h=o.avg-o.low-(l.avg-l.low);if(Math.abs(h)>.001)return h;const $=l.high-l.avg-(o.high-o.avg);if(Math.abs($)>.001)return $;const v=o.spread-l.spread;if(v!==0)return v;const I=o.total_hits-l.total_hits;if(I!==0)return I;const L=l.total_bench-o.total_bench;return L!==0?L:(o.team_name||"").localeCompare(l.team_name||"")}),m.length===0){e.innerHTML=`
            <tr>
              <td colspan="10" class="py-8 text-center text-slate-400 dark:text-slate-500 font-display">
                ${r?"No teams match the search criteria":"ไม่พบทีมที่ตรงกับเงื่อนไขค้นหา"}
              </td>
            </tr>
          `;return}let s="";m.forEach(o=>{const l=o.spread<=38?"text-emerald-600 dark:text-emerald-400 font-bold":o.spread>=75?"text-amber-600 dark:text-amber-400 font-bold":"text-slate-600 dark:text-slate-400 font-medium",g=o.total_hits>0?`<span class="text-rose-600 dark:text-rose-400 font-bold">-${o.total_hits}</span>`:'<span class="text-slate-400 dark:text-slate-600 font-medium">-</span>',y=o.total_bench>0?`<span class="text-slate-700 dark:text-slate-300 font-semibold">${o.total_bench}</span>`:'<span class="text-slate-400 dark:text-slate-600 font-medium">-</span>';s+=`
            <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer">
              <td class="sticky-col-rank py-2.5 px-1 sm:px-2 text-center font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">${o.global_rank}</td>
              <td class="sticky-col-team py-2.5 px-1.5 sm:px-3 min-w-[135px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                <button onclick="event.stopPropagation(); app.openTeamModal(${o.entry_id})" class="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate w-full group-hover:underline">
                  ${this.escapeHtml(o.team_name)}
                </button>
                <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">${this.escapeHtml(o.player_name||"")}</div>
              </td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums font-black text-slate-900 dark:text-white whitespace-nowrap">${o.total_net}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">${o.avg.toFixed(1)}</td>
              <td class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">${o.tier_badge}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap" title="Gameweek ${o.high_gw}">${o.high}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap" title="Gameweek ${o.low_gw}">${o.low}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums whitespace-nowrap ${l}" title="${r?"Points spread: Highest score minus Lowest score":"ส่วนต่างแต้มสูงสุด - ต่ำสุด"}">±${o.spread}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums whitespace-nowrap">${g}</td>
              <td class="py-2.5 px-1.5 sm:px-2 text-center font-mono tabular-nums whitespace-nowrap">${y}</td>
            </tr>
          `}),e.innerHTML=s}setRadarLeagueFilter(e){if(this.radarLeagueFilter=String(e),typeof this.renderGlobalRadarView=="function"){this.renderGlobalRadarView();return}const t=document.getElementById("global-radar-league-pills");if(t&&this._radarTeamList){const a=this.multiData.leagues||{},r=this.configs||{},p=this.multiData&&this.multiData.league_order||Object.keys(a);let i=`
            <button onclick="app.setRadarLeagueFilter('all')" class="px-3 py-1.5 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${this.radarLeagueFilter==="all"?"bg-slate-900 text-white dark:bg-blue-600 shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}">
              <span>${this.currentLang==="en"?"All Leagues":"ทุกลีก"}</span>
              <span class="text-[10px] opacity-75 font-semibold">(${this._radarTeamList.length})</span>
            </button>
          `;p.forEach(d=>{const n=a[d];if(!n||n.tier===2||r[d]&&r[d].tier===2)return;const c=r[d]&&r[d].short_name||n.name,m=(n.teams||[]).length,s=this.radarLeagueFilter===String(d);i+=`
              <button onclick="app.setRadarLeagueFilter('${d}')" class="px-3 py-1.5 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${s?"bg-slate-900 text-white dark:bg-blue-600 shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}">
                <span>${this.escapeHtml(c)}</span>
                <span class="text-[10px] opacity-75 font-semibold">(${m})</span>
              </button>
            `}),t.innerHTML=i}this.renderGlobalRadarTable()}setRadarSortBy(e,t=null){t?(this.radarSortBy=e,this.radarSortOrder=t):this.radarSortBy===e?this.radarSortOrder=this.radarSortOrder==="asc"?"desc":"asc":(this.radarSortBy=e,e==="spread"||e==="hits"?this.radarSortOrder="asc":this.radarSortOrder="desc"),this.renderGlobalRadarTable()}handleRadarSearch(e){this.radarSearchQuery=e||"",this.renderGlobalRadarTable()}toggleRadarGuide(){const e=document.getElementById("radar-guide-content"),t=document.getElementById("radar-guide-btn-text"),a=document.getElementById("radar-guide-arrow");if(!e)return;const r=this.currentLang==="en";e.classList.contains("hidden")?(e.classList.remove("hidden"),t&&(t.innerText=r?"Hide Criteria":"ซ่อนเกณฑ์"),a&&a.classList.add("rotate-180")):(e.classList.add("hidden"),t&&(t.innerText=r?"Show Criteria":"ดูเกณฑ์"),a&&a.classList.remove("rotate-180"))}renderCupView(){const e=this.currentLang==="en",t=document.getElementById("cup-title"),a=document.getElementById("cup-subtitle"),r=document.getElementById("cup-kicker"),p=document.getElementById("cup-header-dot"),i=document.getElementById("cup-prize-badge"),d=document.getElementById("cup-teams-badge"),n=document.getElementById("cup-tournament-container");r&&(r.innerText=e?"MINI-LEAGUE KNOCKOUT CUP":"การแข่งขันฟุตบอลถ้วยทางการ");const c=this.config&&this.config.features||{};if(!!!c.has_cup){t&&(t.innerText=e?"Knockout Cup Tournament":"การแข่งขันฟุตบอลถ้วย"),p&&(p.className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"),a&&(a.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                <span class="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                <span>${e?"This mini-league operates without an official knockout cup competition.":"มินิลีกนี้ไม่ได้เปิดใช้งานระบบฟุตบอลถ้วย"}</span>
              </div>
            `),i&&(i.innerText=e?"NO CUP":"ไม่มีบอลถ้วย",i.className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-mono text-[11px] font-semibold"),d&&d.classList.add("hidden"),n&&(n.innerHTML=`
              <div class="glass-card rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 text-center max-w-xl mx-auto shadow-2xs" role="region" aria-labelledby="no-cup-title">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 mx-auto flex items-center justify-center mb-3.5" aria-hidden="true">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                </div>
                <h4 id="no-cup-title" class="text-base font-bold text-slate-900 dark:text-white font-display">${e?"No Cup Competition Configured":"ไม่มีการแข่งขันฟุตบอลถ้วย"}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-md mx-auto">${e?"This mini-league does not feature an official knockout cup competition. All standings, points, and prizes are tracked in the League Table and Prizes tabs.":"มินิลีกนี้ไม่ได้เปิดใช้งานระบบฟุตบอลถ้วย สามารถติดตามอันดับ คะแนน และเงินรางวัลได้ที่หน้าตารางคะแนนรวมหรือหน้าสรุปรางวัล"}</p>
                <div class="mt-5 flex items-center justify-center gap-2.5 flex-wrap">
                  <button type="button" onclick="app.switchTab('gameweek-view')" aria-label="${e?"Navigate to League Standings":"ดูตารางคะแนนรวมของลีก"}" class="px-3.5 py-2 min-h-[36px] rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer shadow-2xs">
                    ${e?"View League Standings →":"ดูตารางคะแนนรวม →"}
                  </button>
                  <button type="button" onclick="app.switchTab('prizes-view')" aria-label="${e?"Navigate to Prize Summary":"ดูสรุปเงินรางวัลของลีก"}" class="px-3.5 py-2 min-h-[36px] rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    ${e?"View Prizes →":"ดูสรุปเงินรางวัล →"}
                  </button>
                </div>
              </div>
            `);return}const s=c.cup_champion_prize,o=c.cup_runner_up_prize,l=Number(c.cup_start_gw)||35,g=c.cup_rule_note||"",y=Number(this.multiData&&this.multiData.max_gw)||1,D=this.data&&this.data.gameweeks?this.data.gameweeks[String(y)]:null,h=!!(D&&D.is_finished),v=(D?D.is_started!==void 0?!!D.is_started:h||D.results&&D.results.some(M=>M.points>0):!1)&&!h,I=y>=l;t&&(t.innerText=e?`${this.data.name||"Mini-League"} Cup Tournament`:`ฟุตบอลถ้วย ${this.data.name||"ประจำลีก"}`),p&&(p.className=v?"w-2.5 h-2.5 rounded-full bg-amber-500 motion-safe:animate-pulse flex-shrink-0":h?"w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0":"w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"),a&&(v?a.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs leading-relaxed" role="status">
                <span class="w-2 h-2 rounded-full bg-amber-500 motion-safe:animate-pulse flex-shrink-0"></span>
                <span class="font-bold font-mono tracking-tight flex-shrink-0">${e?`GW ${y} IN-PLAY (LIVE)`:`GW ${y} กำลังแข่งขัน (LIVE)`}</span>
                <span class="text-slate-600 dark:text-slate-300 border-l border-amber-500/30 pl-2 text-[11px] sm:text-xs">
                  ${I?e?"Head-to-head knockout matches in progress. Scores reflect live provisional net points.":"การแข่งขันรอบแพ้คัดออก 1 ต่อ 1 กำลังฟาดแข้งสด คะแนนสะท้อนผลสุทธิชั่วคราว":e?"Qualification phase live. Ranks reflect provisional net points towards knockout seeds.":"รอบสะสมคะแนนมือวางกำลังแข่งขันสด อันดับสะท้อนผลคะแนนสุทธิชั่วคราว"}
                </span>
              </div>
            `:h?a.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs leading-relaxed" role="status">
                <span class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="font-bold font-mono tracking-tight flex-shrink-0 text-slate-900 dark:text-slate-100">${e?`GW ${y} OFFICIAL SETTLED`:`GW ${y} สรุปผลทางการแล้ว`}</span>
                <span class="text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2 text-[11px] sm:text-xs">
                  ${I?e?"Knockout scores finalized. Advancing managers are officially confirmed.":"ผลการประกบคู่รอบน็อคเอาท์ได้รับการยืนยันทางการเรียบร้อย":e?`Official seed standings updated through GW ${y} • Knockout commences GW ${l}.`:`อันดับมือวางได้รับการยืนยันถึง GW ${y} • รอบน็อคเอาท์เริ่ม GW ${l}`}
                </span>
              </div>
            `:a.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs leading-relaxed" role="status">
                <span class="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                <span class="font-bold font-mono tracking-tight flex-shrink-0 text-slate-900 dark:text-slate-100">${e?`GW ${y} UPCOMING`:`GW ${y} รอคิกออฟ`}</span>
                <span class="text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2 text-[11px] sm:text-xs">
                  ${e?`Official FPL single-elimination tournament • Kickoff GW ${l}`:`ระบบจับคู่แบบแพ้คัดออก 1 ต่อ 1 ตามกติกา Official FPL • เริ่มสัปดาห์ที่ ${l}`}
                </span>
              </div>
            `);const L=this.data&&this.data.teams?this.data.teams:[],k=L.filter(M=>this.isPrizeEligible(M.entry_id)).length;if(i&&(i.className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-bold font-display shadow-2xs whitespace-nowrap",s&&o?i.innerText=e?`Prizes: ${s} + ${o}`:`รางวัล ${s} + ${o}`:s?i.innerText=e?`Prize: ${s}`:`รางวัล ${s}`:i.innerText=e?"CUP TOURNAMENT":"ทัวร์นาเมนต์บอลถ้วย"),d&&(d.classList.remove("hidden"),d.className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-mono text-[11px] font-semibold whitespace-nowrap",d.innerText=e?`${L.length} Teams (${k} Contenders)`:`${L.length} ทีม (${k} ลุ้นรางวัล)`),!n)return;const x={};if(L.forEach(M=>{x[M.entry_id]={entry_id:M.entry_id,team_name:M.entry_name||M.team_name||"",player_name:M.player_name||"",rank:M.rank||999,total_net:0,gw_count:0,cur_net:0,cur_played:!1}}),this.data&&this.data.gameweeks){const M=Number(this.multiData.max_gw)||38;for(let V=1;V<=M;V++){const Z=this.data.gameweeks[String(V)];if(!Z||!Z.results)continue;if(Z.is_started!==void 0?!!Z.is_started:!!Z.is_finished||Z.results.some(ae=>ae.points>0)){const ae=new Set;Z.results.forEach(de=>{if(!ae.has(de.entry_id)&&(ae.add(de.entry_id),x[de.entry_id])){const oe=de.net_points!==void 0?de.net_points:de.points||0;x[de.entry_id].total_net+=oe,x[de.entry_id].gw_count+=1,V===M&&(x[de.entry_id].cur_net=oe,x[de.entry_id].cur_played=!0)}})}}}const C=Object.values(x),T=C.filter(M=>this.isPrizeEligible(M.entry_id)).sort((M,V)=>V.total_net-M.total_net||M.rank-V.rank);T.forEach((M,V)=>{M.seed_rank=V+1,M.is_eligible=!0});const H=C.filter(M=>!this.isPrizeEligible(M.entry_id)).sort((M,V)=>V.total_net-M.total_net||M.rank-V.rank);H.forEach(M=>{M.seed_rank=null,M.is_eligible=!1});let z=[];if(this.cupFilterMode==="contenders"?z=[...T]:this.cupFilterMode==="seeds"?z=T.slice(0,Math.min(T.length,16)):this.cupFilterMode==="non_prize"?z=[...H]:z=[...T,...H],this.cupSearchQuery){const M=this.cupSearchQuery.toLowerCase();z=z.filter(V=>(V.team_name||"").toLowerCase().includes(M)||(V.player_name||"").toLowerCase().includes(M))}const U='<svg class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 4h16v6a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V4z"></path><path d="M12 16v4"></path><path d="M8 20h8"></path></svg>',Q='<svg class="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 dark:text-slate-300" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>',W='<svg class="w-4 h-4 text-slate-400 dark:text-slate-500" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',P='<svg class="w-4 h-4 text-slate-400 dark:text-slate-500" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',u='<svg class="w-4 h-4 text-slate-400 dark:text-slate-500" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" y1="14" x2="9" y2="18"></line><line x1="7" y1="17" x2="4" y2="20"></line><line x1="3" y1="19" x2="5" y2="21"></line></svg>';let N="";s&&o?N=`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              <!-- Champion Card -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-amber-400/40 dark:border-amber-500/30 ring-1 ring-amber-400/15 bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs">
                <div class="flex items-start gap-3.5">
                  <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center shrink-0 shadow-2xs">
                    ${U}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">${e?"TOURNAMENT CHAMPION":"แชมป์ฟุตบอลถ้วย"}</span>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">${e?"1st Place":"อันดับ 1"}</span>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display">${e?"Cup Champion Silverware":"ถ้วยเกียรติยศแชมป์ฟุตบอลถ้วย"}</h3>
                    <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mt-1 tracking-tight tabular-nums">${s}</div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${e?"Awarded to the ultimate winner of the Grand Final knockout match.":"มอบให้แก่ผู้ชนะเลิศนัดชิงชนะเลิศรอบ Final (สัปดาห์ที่ 38)"}</p>
                  </div>
                </div>
              </div>

              <!-- Runner-Up Card -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs">
                <div class="flex items-start gap-3.5">
                  <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                    ${Q}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">${e?"RUNNER-UP":"รองชนะเลิศ"}</span>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">${e?"2nd Place":"อันดับ 2"}</span>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display">${e?"Cup Runner-Up Medal":"รางวัลรองชนะเลิศฟุตบอลถ้วย"}</h3>
                    <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mt-1 tracking-tight tabular-nums">${o}</div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${e?"Awarded to the runner-up contesting the Grand Final.":"มอบให้แก่ทีมรองชนะเลิศที่ผ่านเข้าสู่รอบชิงชนะเลิศ"}</p>
                  </div>
                </div>
              </div>
            </div>
          `:s&&(N=`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              <!-- Champion Card -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-amber-400/40 dark:border-amber-500/30 ring-1 ring-amber-400/15 bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs">
                <div class="flex items-start gap-3.5">
                  <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center shrink-0 shadow-2xs">
                    ${U}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">${e?"TOURNAMENT CHAMPION":"แชมป์ฟุตบอลถ้วย"}</span>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">${e?"Winner Takes All":"ผู้ชนะคว้าเดี่ยว"}</span>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display">${e?"Cup Champion Silverware":"ถ้วยเกียรติยศแชมป์ฟุตบอลถ้วย"}</h3>
                    <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mt-1 tracking-tight tabular-nums">${s}</div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${e?"Awarded to the ultimate winner of the knockout tournament.":"มอบให้แก่ผู้ชนะเลิศทัวร์นาเมนต์บอลถ้วย"}</p>
                  </div>
                </div>
              </div>

              <!-- Context Schedule / League Special Rule Card -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs">
                <div class="flex items-start gap-3.5">
                  <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                    ${g?W:P}
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="font-mono text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      ${g?e?"SPECIAL LEAGUE RULE":"กติกาพิเศษประจำลีก":e?"KICKOFF SCHEDULE":"กำหนดการเปิดสนาม"}
                    </span>
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                      ${g?e?"Tie-Break Qualification Rule":"เกณฑ์ชี้ขาดพิเศษเฉพาะลีก":e?`Knockout Commences GW ${l}`:`เริ่มแข่งขัน Gameweek ${l}`}
                    </h3>
                    <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      ${g||(e?`Bracket pairings automatically kick off in Gameweek ${l}.`:`ตารางประกบคู่รอบแพ้คัดออกจะเริ่มอย่างเป็นทางการในสัปดาห์ที่ ${l}`)}
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      ${g?e?"If prize contenders are knocked out in the same round, the manager with higher total tournament points takes the prize.":"หากทีมผู้ลุ้นรางวัลตกรอบพร้อมกันในรอบเดียวกัน จะวัดผลจากคะแนนสะสมรวมสูงสุด":e?"Contenders must ensure league fees are settled to receive prizes.":"สงวนสิทธิ์เงินรางวัลเฉพาะผู้จัดการทีมที่ชำระค่าสมัครครบถ้วน"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          `);let w="";g&&s&&o&&(w=`
            <div class="rounded-xl p-3.5 border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-start gap-3 mt-3 shadow-2xs">
              <div class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                ${W}
              </div>
              <div class="text-xs leading-relaxed">
                <span class="font-bold text-slate-900 dark:text-white">${e?"Special League Rule:":"กติกาพิเศษประจำลีก:"}</span>
                <span class="ml-1">${g}</span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${e?"If contenders are eliminated in the same round, the team with the higher cumulative points wins.":"หากผู้ลุ้นรางวัลตกรอบพร้อมกันในรอบเดียวกัน ทีมที่มีคะแนนรวมสะสมสูงกว่าจะได้รับสิทธิ์อันดับที่ดีกว่า"}</p>
              </div>
            </div>
          `);const b=`
          <div class="space-y-3" role="region" aria-labelledby="cup-sec-01">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">01</span>
              <span id="cup-sec-01" class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">${e?"THE SILVERWARE & PRIZES":"ถ้วยเกียรติยศและเงินรางวัล"}</span>
            </div>
            ${N}
            ${w}
          </div>
        `,_=Math.max(1,l-1),S=Math.min(36,l+1);let E=1;y>=38?E=4:y>=37?E=3:y>=l?E=2:E=1;function A(M){return M===E?v?`<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse"></span>${e?"Live":"กำลังแข่ง"}</span>`:h?`<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">${e?"Current":"ปัจจุบัน"}</span>`:`<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">${e?"Upcoming":"รอแข่ง"}</span>`:M<E?`<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">${e?"Done":"แข่งแล้ว"}</span>`:`<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">${e?"Upcoming":"รอเปิดสาย"}</span>`}const F=`
          <div class="space-y-3" role="region" aria-labelledby="cup-sec-02">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">02</span>
                <span id="cup-sec-02" class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">${e?"TOURNAMENT PIPELINE & STAGES":"ไทม์ไลน์และรอบการแข่งขัน"}</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span class="font-mono text-[11px] font-semibold">${e?"Single Elimination 1v1":"แพ้คัดออก 1 ต่อ 1"}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- Stage 1 -->
              <div class="rounded-xl p-3.5 border ${E===1?"border-slate-300 dark:border-slate-700 ring-1 ring-slate-400/20":"border-slate-200/80 dark:border-slate-800"} bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">01 • GW 1-${_}</span>
                    ${A(1)}
                  </div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display">${e?"Qualification & Seeding":"รอบจัดอันดับมือวาง"}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${e?"All teams compete in weekly league matches. Cumulative net score determines seed rank.":"ทุกทีมลงแข่งสะสมคะแนนสุทธิเพื่อกำหนดอันดับมือวาง (Seeds) ในสายการแข่งขัน"}</p>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  ${e?`${T.length} Contenders Qualify`:`${T.length} ทีมลุ้นสิทธิ์เข้ารอบ`}
                </div>
              </div>

              <!-- Stage 2 -->
              <div class="rounded-xl p-3.5 border ${E===2?"border-slate-300 dark:border-slate-700 ring-1 ring-slate-400/20":"border-slate-200/80 dark:border-slate-800"} bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">02 • GW ${l}-${S}</span>
                    ${A(2)}
                  </div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display">${e?"Knockout Playoff":"รอบประกบคู่แพ้คัดออก"}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${e?"1v1 Head-to-Head single elimination. Manager with higher GW net score advances.":"ประกบคู่ 1 ต่อ 1 ใครได้คะแนนมากกว่าในสัปดาห์นั้นผ่านเข้ารอบทันที"}</p>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  ${e?"High Seeds vs Low Seeds":"มือวางสูงพบมือวางต่ำ"}
                </div>
              </div>

              <!-- Stage 3 -->
              <div class="rounded-xl p-3.5 border ${E===3?"border-slate-300 dark:border-slate-700 ring-1 ring-slate-400/20":"border-slate-200/80 dark:border-slate-800"} bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">03 • GW 37</span>
                    ${A(3)}
                  </div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display">${e?"Semi-Finals":"รอบรองชนะเลิศ"}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${e?"The final four managers clash for a coveted ticket to the Championship Match.":"การต่อสู้ของ 4 ผู้จัดการทีมสุดท้ายเพื่อชิงตั๋วเข้าสู่รอบชิงชนะเลิศ"}</p>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  ${e?"2 Finalists Advance":"2 ผู้ชนะเข้าชิงแชมป์"}
                </div>
              </div>

              <!-- Stage 4 -->
              <div class="rounded-xl p-3.5 border ${E===4?"border-amber-400/40 dark:border-amber-500/30 ring-1 ring-amber-400/15":"border-slate-200/80 dark:border-slate-800"} bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-mono text-xs font-bold ${E===4?"text-amber-600 dark:text-amber-400":"text-slate-700 dark:text-slate-300"}">04 • GW 38</span>
                    ${A(4)}
                  </div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display">${e?"Grand Final & Trophy":"รอบชิงชนะเลิศ ชิงถ้วยแชมป์"}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${e?"The championship match to crown the Mini-League Cup Champion.":"เกมนัดชิงชนะเลิศตัดสินแชมป์บอลถ้วยประจำลีกและมอบเงินรางวัล"}</p>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800 font-mono text-[11px] font-bold ${E===4?"text-amber-600 dark:text-amber-400":"text-slate-700 dark:text-slate-300"}">
                  ${e?`Champion: ${s||"Trophy"}`:`แชมป์รับ: ${s||"ถ้วยเกียรติยศ"}`}
                </div>
              </div>
            </div>
          </div>
        `;let q="";if(I){const M=[],V=Math.floor(T.length/2);for(let Z=0;Z<V;Z++){const O=T[Z],ae=T[T.length-1-Z];M.push({teamA:O,teamB:ae,index:Z+1})}q=`
            <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 overflow-hidden mb-4" role="region" aria-labelledby="h2h-knockout-title">
              <div class="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true">
                    ${u}
                  </div>
                  <div>
                    <h3 id="h2h-knockout-title" class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">${e?`GW ${y} Head-to-Head Knockout Matches`:`ประกบคู่รอบน็อคเอาท์ GW ${y}`}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"Single-elimination 1v1 match. Higher gameweek net score advances to next round.":"การแข่งขันแพ้คัดออก 1 ต่อ 1 ทีมที่ทำแต้มสุทธิในสัปดาห์นี้ได้มากกว่าจะผ่านเข้ารอบต่อไป"}</p>
                  </div>
                </div>
                <div>
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${v?"bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}">
                    ${v?'<span class="w-1.5 h-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse"></span>LIVE IN-PLAY':"✓ OFFICIAL SETTLED"}
                  </span>
                </div>
              </div>

              <div class="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                ${M.map(Z=>{const O=Z.teamA.cur_net||0,ae=Z.teamB.cur_net||0,de=O>ae,oe=ae>O;return`
                    <div class="rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-2xs flex flex-col justify-between">
                      <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span>MATCH #${Z.index}</span>
                        <span>${v?"LIVE":h?"FINAL":"UPCOMING"}</span>
                      </div>
                      
                      <!-- Team A -->
                      <div class="flex items-center justify-between py-1.5">
                        <div class="min-w-0 flex-1 pr-2">
                          <div class="flex items-center gap-1.5">
                            <span class="font-mono text-xs font-bold text-slate-400">#${Z.teamA.seed_rank}</span>
                            <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">${this.escapeHtml(Z.teamA.team_name)}</span>
                          </div>
                          <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(Z.teamA.player_name)}</div>
                        </div>
                        <div class="text-right shrink-0">
                          <span class="text-sm sm:text-base font-black font-mono tabular-nums ${de?"text-emerald-600 dark:text-emerald-400":"text-slate-900 dark:text-white"}">${O}</span>
                          <span class="text-[10px] text-slate-400 ml-0.5">pts</span>
                        </div>
                      </div>

                      <!-- Divider -->
                      <div class="my-1 border-t border-dashed border-slate-200 dark:border-slate-800"></div>

                      <!-- Team B -->
                      <div class="flex items-center justify-between py-1.5">
                        <div class="min-w-0 flex-1 pr-2">
                          <div class="flex items-center gap-1.5">
                            <span class="font-mono text-xs font-bold text-slate-400">#${Z.teamB.seed_rank}</span>
                            <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">${this.escapeHtml(Z.teamB.team_name)}</span>
                          </div>
                          <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(Z.teamB.player_name)}</div>
                        </div>
                        <div class="text-right shrink-0">
                          <span class="text-sm sm:text-base font-black font-mono tabular-nums ${oe?"text-emerald-600 dark:text-emerald-400":"text-slate-900 dark:text-white"}">${ae}</span>
                          <span class="text-[10px] text-slate-400 ml-0.5">pts</span>
                        </div>
                      </div>

                      <!-- Match Result / Status Footer -->
                      <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-right">
                        ${h?de?`<span class="text-emerald-600 dark:text-emerald-400 font-bold">${e?`${this.escapeHtml(Z.teamA.team_name)} Advances →`:`${this.escapeHtml(Z.teamA.team_name)} ชนะผ่านเข้ารอบ →`}</span>`:oe?`<span class="text-emerald-600 dark:text-emerald-400 font-bold">${e?`${this.escapeHtml(Z.teamB.team_name)} Advances →`:`${this.escapeHtml(Z.teamB.team_name)} ชนะผ่านเข้ารอบ →`}</span>`:`<span class="text-amber-600 dark:text-amber-400 font-bold">${e?"Tied • Decided by Tie-Breaker":"เสมอ • ชี้ขาดตามกติกาไทเบรก"}</span>`:v?de?`<span class="text-amber-600 dark:text-amber-400 font-bold">${e?`${this.escapeHtml(Z.teamA.team_name)} currently leads`:`${this.escapeHtml(Z.teamA.team_name)} นำอยู่ขณะนี้`}</span>`:oe?`<span class="text-amber-600 dark:text-amber-400 font-bold">${e?`${this.escapeHtml(Z.teamB.team_name)} currently leads`:`${this.escapeHtml(Z.teamB.team_name)} นำอยู่ขณะนี้`}</span>`:`<span class="text-slate-500 font-semibold">${e?"Scores Level":"คะแนนเสมอกัน"}</span>`:`<span class="text-slate-400">${e?"Match upcoming":"รอการแข่งขัน"}</span>`}
                      </div>
                    </div>
                  `}).join("")}
              </div>
            </div>
          `}let j="";z.length===0?j=`
            <tr>
              <td colspan="5" class="py-10 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                ${e?"No teams matching the filter or search criteria.":"ไม่พบทีมที่ตรงกับเงื่อนไขการค้นหาหรือตัวกรอง"}
              </td>
            </tr>
          `:j=z.map(M=>{const V=M.is_eligible,Z=V?M.seed_rank===1?'<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black font-mono text-slate-950 bg-amber-400 shadow-2xs">1</span>':M.seed_rank===2?'<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono text-slate-900 dark:text-slate-200 bg-slate-200 dark:bg-slate-700">2</span>':M.seed_rank===3?'<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono text-white bg-amber-700/80">3</span>':`<span class="text-xs font-bold font-mono tabular-nums text-slate-500 dark:text-slate-400">${M.seed_rank}</span>`:'<span class="text-xs font-mono text-slate-400 dark:text-slate-500">-</span>';let O="";V?M.seed_rank<=4?O=`<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>${e?"Top Seed":"มือวางแถวหน้า"}</span>`:O=`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">${e?"Contender":"ผู้มีสิทธิ์ลุ้นแชมป์"}</span>`:O=`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">${e?"Guest (Non-Prize)":"ร่วมสนุก (ไม่ลุ้นรางวัล)"}</span>`;const ae=M.gw_count>0?(M.total_net/M.gw_count).toFixed(1):"-";return`
              <tr onclick="app.toggleTrackedRow(this)" class="group transition-colors cursor-pointer">
                <td class="sticky-col-rank py-3 px-2 text-center font-mono font-bold">
                  ${Z}
                </td>
                <td class="sticky-col-team py-3 px-3 sm:px-4 min-w-[140px] sm:min-w-0 max-w-[165px] sm:max-w-none">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[125px] xs:max-w-[180px] sm:max-w-xs block">${this.escapeHtml(M.team_name)}</span>
                    ${V?"":this.getPrizeBadge(M.entry_id)}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[125px] xs:max-w-[180px] sm:max-w-xs">${this.escapeHtml(M.player_name)}</div>
                </td>
                <td class="py-3 px-3 sm:px-4 whitespace-nowrap">
                  ${O}
                </td>
                <td class="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                  <span class="text-xs sm:text-sm font-black font-mono tabular-nums text-slate-900 dark:text-white">${M.total_net.toLocaleString()}</span>
                  <span class="text-[10px] text-slate-400 ml-0.5 font-normal">pts</span>
                </td>
                <td class="py-3 px-3 sm:px-4 text-right whitespace-nowrap hidden sm:table-cell">
                  <span class="text-xs font-semibold font-mono tabular-nums text-slate-600 dark:text-slate-300">${ae}</span>
                </td>
              </tr>
            `}).join("");const R=e?"en":"th",G=String(this.activeLeagueId||""),K=document.getElementById("cup-seeding-tbody"),B=document.getElementById("cup-search-input");if(K&&B&&B.dataset.renderedLang===R&&B.dataset.renderedLeague===G){K.innerHTML=j;const M=document.getElementById("cup-search-clear");M&&(this.cupSearchQuery?M.classList.remove("hidden"):M.classList.add("hidden")),["all","contenders","seeds","non_prize"].forEach(V=>{const Z=document.getElementById(`cup-filter-${V==="non_prize"?"guest":V}`);if(Z){const O=this.cupFilterMode===V;Z.setAttribute("aria-selected",O?"true":"false"),Z.className=`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${O?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}}),B.value!==(this.cupSearchQuery||"")&&(B.value=this.cupSearchQuery||"");return}const Y=`
          <div class="space-y-3" role="region" aria-labelledby="cup-sec-03">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">03</span>
              <span id="cup-sec-03" class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">
                ${I?e?"KNOCKOUT MATCHES & SEEDING RACE":"รอบน็อคเอาท์และอันดับมือวาง":e?"TOURNAMENT QUALIFICATION & SEEDING":"อันดับมือวางและสถานะการลุ้นถ้วย"}
              </span>
            </div>

            ${q}

            <!-- Seeding Table Card -->
            <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div class="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">${e?"Live Seeding & Contenders":"อันดับมือวางและคะแนนสะสมสุทธิ"}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"Rankings based on cumulative league net points heading into knockout rounds.":"คำนวณจากคะแนนสุทธิสะสมในลีกเพื่อประกบคู่ในรอบน็อคเอาท์"}</p>
                </div>

                <!-- Search & Monochrome Segmented Filters with Touch Targets >= 36px & ARIA Roles -->
                <div class="flex items-center gap-2 flex-wrap">
                  <div class="relative min-w-[140px] sm:min-w-[190px] flex-1">
                    <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </span>
                    <input 
                      id="cup-search-input"
                      type="text" 
                      data-rendered-lang="${R}"
                      data-rendered-league="${this.escapeHtml(G)}"
                      aria-label="${e?"Search team or manager name":"ค้นหาชื่อทีมหรือผู้จัดการ"}"
                      value="${this.escapeHtml(this.cupSearchQuery||"")}" 
                      oninput="app.handleCupSearch(this.value)"
                      placeholder="${e?"Search team / manager...":"ค้นหาชื่อทีม / ผู้จัดการ..."}"
                      class="w-full pl-8 pr-8 py-2 min-h-[36px] text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors duration-150 font-sans"
                    />
                    <button 
                      id="cup-search-clear"
                      type="button"
                      onclick="app.handleCupSearch('')" 
                      aria-label="${e?"Clear search text":"ล้างคำค้นหา"}"
                      class="${this.cupSearchQuery?"":"hidden "}absolute inset-y-0 right-0 pr-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div role="tablist" aria-label="${e?"Cup contender filters":"ตัวกรองผู้ลุ้นรางวัลบอลถ้วย"}" class="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-wrap">
                    <button 
                      type="button"
                      role="tab"
                      id="cup-filter-all"
                      aria-selected="${this.cupFilterMode==="all"}"
                      aria-label="${e?`Show all ${C.length} teams`:`แสดงทั้งหมด ${C.length} ทีม`}"
                      onclick="app.setCupFilter('all')" 
                      class="px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${this.cupFilterMode==="all"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}"
                    >
                      ${e?`All (${C.length})`:`ทั้งหมด (${C.length})`}
                    </button>
                    <button 
                      type="button"
                      role="tab"
                      id="cup-filter-contenders"
                      aria-selected="${this.cupFilterMode==="contenders"}"
                      aria-label="${e?`Show ${T.length} prize contenders`:`แสดง ${T.length} ทีมลุ้นรางวัล`}"
                      onclick="app.setCupFilter('contenders')" 
                      class="px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${this.cupFilterMode==="contenders"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}"
                    >
                      ${e?`Contenders (${T.length})`:`ลุ้นรางวัล (${T.length})`}
                    </button>
                    <button 
                      type="button"
                      role="tab"
                      id="cup-filter-seeds"
                      aria-selected="${this.cupFilterMode==="seeds"}"
                      aria-label="${e?"Show top seeded teams":"แสดงเฉพาะทีมมือวาง"}"
                      onclick="app.setCupFilter('seeds')" 
                      class="px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${this.cupFilterMode==="seeds"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}"
                    >
                      ${e?"Top Seeds":"มือวาง"}
                    </button>
                    ${H.length>0?`
                      <button 
                        type="button"
                        role="tab"
                        id="cup-filter-guest"
                        aria-selected="${this.cupFilterMode==="non_prize"}"
                        aria-label="${e?`Show ${H.length} guest teams`:`แสดง ${H.length} ทีมร่วมสนุก`}"
                        onclick="app.setCupFilter('non_prize')" 
                        class="px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${this.cupFilterMode==="non_prize"?"bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}"
                      >
                        ${e?`Guest (${H.length})`:`ร่วมสนุก (${H.length})`}
                      </button>
                    `:""}
                  </div>
                </div>
              </div>

              <!-- Polite Screen Reader Announcement -->
              <div class="sr-only" role="status" aria-live="polite">
                ${e?`${z.length} teams shown in seeding table`:`แสดงผลลัพธ์ ${z.length} ทีมในตารางจัดอันดับมือวาง`}
              </div>

              <!-- Table with Accessible Semantic Markup (High-Craft Responsive Sticky Freeze) -->
              <div class="overflow-x-auto scrollbar-thin table-sticky-container">
                <table class="w-full text-left text-xs table-sticky table-clean" aria-label="${e?"Cup Tournament Seeding Table":"ตารางจัดอันดับมือวางฟุตบอลถ้วย"}">
                  <thead>
                    <tr class="text-slate-500 dark:text-slate-400 uppercase font-mono font-bold text-[10px] tracking-wider">
                      <th scope="col" class="sticky-col-rank py-2.5 px-2 text-center">${e?"Seed":"มือวาง"}</th>
                      <th scope="col" class="sticky-col-team py-2.5 px-3 sm:px-4 min-w-[140px]">${e?"Team & Manager":"ทีม & ผู้จัดการ"}</th>
                      <th scope="col" class="py-2.5 px-3 sm:px-4 whitespace-nowrap">${e?"Cup Status":"สถานะการแข่งขัน"}</th>
                      <th scope="col" class="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap text-slate-800 dark:text-slate-200">${e?"Net Points":"คะแนนสุทธิ"}</th>
                      <th scope="col" class="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap hidden sm:table-cell">${e?"Avg / GW":"เฉลี่ย/นัด"}</th>
                    </tr>
                  </thead>
                  <tbody id="cup-seeding-tbody">
                    ${j}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `,X=`
          <div class="space-y-3" role="region" aria-labelledby="cup-sec-04">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">04</span>
              <span id="cup-sec-04" class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 font-display">${e?"TOURNAMENT RULES & REGULATIONS":"กติกาและข้อบังคับทางการ"}</span>
            </div>

            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div class="mb-4">
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">${e?"Official FPL Cup Tournament Matrix":"ข้อกำหนดการแข่งขัน Official FPL Cup"}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${e?"Standardized single-elimination rules applied uniformly across all tournament rounds.":"กติกามาตรฐานสากลสำหรับการแข่งขันแบบแพ้คัดออกในทุกรอบ"}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <!-- Card 1: Format -->
                <div class="rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-mono text-xs font-bold text-slate-400">01</span>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${e?"Match Format & Knockout":"รูปแบบประกบคู่ 1 ต่อ 1"}</h4>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${e?"Single-elimination head-to-head match per gameweek. The team with the higher net points in that gameweek advances to the next round automatically.":"แข่งขันประกบคู่ 1 ต่อ 1 แบบแพ้คัดออกในแต่ละสัปดาห์ ทีมที่ทำคะแนนสุทธิได้สูงกว่าในสัปดาห์นั้นจะผ่านเข้าสู่รอบต่อไปทันที"}</p>
                </div>

                <!-- Card 2: Qualification -->
                <div class="rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-mono text-xs font-bold text-slate-400">02</span>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${e?"Seeding & Pairing Tree":"การจัดอันดับมือวางและประกบคู่"}</h4>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${e?`Bracket pairings are determined by league standings prior to GW ${l}. Higher seeds are paired against lower seeds according to the official FPL bracket structure.`:`จัดอันดับมือวางตามคะแนนสุทธิในลีกก่อนเริ่มสัปดาห์ที่ ${l} ทีมมือวางอันดับสูงจะถูกประกบพบกับทีมมือวางอันดับล่างตามผังการแข่งขัน Official FPL`}</p>
                </div>

                <!-- Card 3: Tie-Breakers -->
                <div class="rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-mono text-xs font-bold text-slate-400">03</span>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${e?"Official Tie-Breaker Priority":"เกณฑ์ตัดสินเมื่อเสมอกัน"}</h4>
                  </div>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside leading-relaxed">
                    <li>${e?"1. Most goals scored in the Gameweek":"1. ประตูที่นักเตะในทีมทำได้มากกว่าในสัปดาห์นั้น"}</li>
                    <li>${e?"2. Fewest goals conceded in the Gameweek":"2. เสียประตูน้อยกว่าในสัปดาห์นั้น"}</li>
                    <li>${e?"3. Virtual coin toss by FPL system":"3. จับสลากสุ่มผู้ชนะเสมือนจริงโดยระบบ FPL"}</li>
                  </ul>
                  ${g?`
                    <div class="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      * ${g}
                    </div>
                  `:""}
                </div>

                <!-- Card 4: Hits & Chips -->
                <div class="rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-mono text-xs font-bold text-slate-400">04</span>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${e?"Transfer Hits & Chips Impact":"การคิดแต้มลบ (Hits) และการใช้ชิป"}</h4>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${e?"Transfer hits (-4 pts per extra transfer) are deducted directly from cup match scores. All chips (Bench Boost, Triple Captain, Free Hit) are valid and count.":"แต้มลบจากการย้ายตัว (-4 ต่อครั้ง) จะถูกหักออกจากคะแนนการแข่งขันคัพโดยตรง ส่วนชิปทุกชนิด (Bench Boost, Triple Captain, Free Hit) สามารถใช้งานได้ตามปกติและนับคะแนนเต็ม"}</p>
                </div>
              </div>
            </div>
          </div>
        `;n.innerHTML=`
          ${b}
          ${F}
          ${Y}
          ${X}
        `}renderRulesView(){const e=document.getElementById("rules-header-title"),t=document.getElementById("rules-header-desc"),a=document.getElementById("rules-header-badge"),r=document.getElementById("rules-ledger-container"),p=document.getElementById("rules-cards-container"),i=document.getElementById("rules-governance-container"),d=this.currentLang==="en";e&&(e.innerText=d?"Official League Rules & Governance":"กติกาและการจัดสรรรางวัล"),a&&(a.innerText=d?"OFFICIAL RULES":"กติกาทางการ");const n=Number(this.multiData&&this.multiData.max_gw)||1,c=this.data&&this.data.gameweeks?this.data.gameweeks[String(n)]:null,m=!!(c&&c.is_finished),o=(c?c.is_started!==void 0?!!c.is_started:m||c.results&&c.results.some(I=>I.points>0):!1)&&!m;t&&(o?t.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
                <span class="font-bold font-mono tracking-tight flex-shrink-0">${d?`GW ${n} IN-PLAY (LIVE)`:`GW ${n} กำลังแข่งขัน (LIVE)`}</span>
                <span class="text-slate-600 dark:text-slate-300 border-l border-amber-500/30 pl-2 text-[11px] sm:text-xs">
                  ${d?"Scores and ranks are provisional. Official weekly prize payouts & penalties will be settled post-gameweek upon final data confirmation.":"คะแนนสดและอันดับระหว่างแข่งยังเป็นผลชั่วคราว การตัดสินเงินรางวัลและค่าปรับประจำสัปดาห์จะยึดตามผลคะแนนทางการ (Official Settled) หลังจบคู่สุดท้าย"}
                </span>
              </div>
            `:m?t.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                <span class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="font-bold font-mono tracking-tight flex-shrink-0 text-slate-900 dark:text-slate-100">${d?`GW ${n} OFFICIAL SETTLED`:`GW ${n} สรุปผลทางการแล้ว`}</span>
                <span class="text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2 text-[11px] sm:text-xs">
                  ${d?"Scores finalized. Prize awards & penalty balances are fully calculated in the":"คะแนนสุทธิได้รับการยืนยันเรียบร้อย — สามารถตรวจสอบการแจกแจงเงินรางวัลและค่าปรับได้ที่"}
                </span>
                <button type="button" onclick="app.switchTab('prizes-view')" class="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 cursor-pointer text-[11px] sm:text-xs">
                  <span>${d?"Prizes Tab →":"แท็บสรุปรางวัล →"}</span>
                </button>
              </div>
            `:t.innerHTML=`
              <div class="inline-flex flex-wrap items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                <span class="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                <span class="font-bold font-mono tracking-tight flex-shrink-0 text-slate-900 dark:text-slate-100">${d?`GW ${n} UPCOMING`:`GW ${n} รอเปิดสนาม`}</span>
                <span class="text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2 text-[11px] sm:text-xs">
                  ${d?"Squad picks and chip activations will lock automatically at the scheduled deadline prior to kickoff.":"การจัดทัพและการใช้ชิปพิเศษจะล็อกอัตโนมัติเมื่อถึงกำหนด Deadline ก่อนเกมคู่แรกเริ่มแข่งขัน"}
                </span>
              </div>
            `);const l=this.config&&this.config.non_prize_teams?this.config.non_prize_teams.length:0,g=(this.data.teams||[]).length,y=g-l;let D="";d?D=l>0?`${g} Teams (${y} Contenders, ${l} Casual)`:`${g} Teams`:D=l>0?`สมาชิก ${g} ทีม (ชิงรางวัล ${y} ทีม, ร่วมสนุก ${l} ทีม)`:`สมาชิก ${g} ทีม`;const h=d&&this.config.entry_fee_en?this.config.entry_fee_en:this.config.entry_fee||"-",$=d&&this.config.total_pool_en?this.config.total_pool_en:this.config.total_pool||"-";r&&(r.innerHTML=`
            <div class="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-2xs w-full min-w-0 overflow-hidden">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 dark:divide-slate-800/80">
                <!-- Item 1: League ID -->
                <div class="flex flex-col justify-center px-1 sm:px-3 pt-0">
                  <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-display">${d?"LEAGUE IDENTIFIER":"รหัสลีกทางการ"}</span>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums">#${this.activeLeagueId}</span>
                </div>
                <!-- Item 2: Members -->
                <div class="flex flex-col justify-center px-1 sm:px-3 pt-2 md:pt-0">
                  <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-display">${d?"MEMBERSHIP":"สมาชิกในลีก"}</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 truncate" title="${D}">${D}</span>
                </div>
                <!-- Item 3: Fee -->
                <div class="flex flex-col justify-center px-1 sm:px-3 pt-2 md:pt-0">
                  <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-display">${d?"ENTRY STAKE":"ค่าสมัครลงแข่ง"}</span>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums truncate" title="${h}">${h}</span>
                </div>
                <!-- Item 4: Pool -->
                <div class="flex flex-col justify-center px-1 sm:px-3 pt-2 md:pt-0">
                  <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold font-display">${d?"CENTRAL POOL":"งบประมาณกองกลาง"}</span>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums truncate" title="${$}">${$}</span>
                </div>
              </div>
            </div>
          `);const v=d&&this.config.rules_cards_en?this.config.rules_cards_en:this.config.rules_cards||[];if(p){v.length===1?p.className="grid grid-cols-1 max-w-3xl mx-auto gap-4 sm:gap-5 w-full min-w-0":v.length===2?p.className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full min-w-0":p.className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0";let I="";v.forEach((L,k)=>{const x=String(k+1).padStart(2,"0"),C=d?`RULE ${x}`:`กติกา ${x}`;let T="";(L.items||[]).forEach(z=>{let U="";if(z.desc){const Q=(z.desc||"").split(`
`).flatMap(W=>W.split("\\n")).map(W=>W.trim()).filter(Boolean);Q.length>1?U=`<ul class="space-y-2 mt-2 pl-1">${Q.map(P=>`
                      <li class="flex items-start gap-2 leading-relaxed text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                        <span class="flex-1">${P.startsWith("•")||P.startsWith("-")||P.startsWith("*")?P.replace(/^[•\-\*]\s*/,""):P}</span>
                      </li>
                    `).join("")}</ul>`:U=`<p class="mt-1.5 pl-1 leading-relaxed text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">${z.desc}</p>`}T+=`
                <div class="pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/70 last:border-0 last:pb-0 last:mb-0">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"></span>
                    <strong class="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm tracking-tight font-display">${z.label}</strong>
                  </div>
                  ${U}
                </div>
              `});let H="";if(L.image){const z=this.getAssetUrl(L.image),U=this.escapeHtml(L.title);H=`
                <div class="mb-4 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shadow-2xs">
                  <a href="${z}" target="_blank" rel="noopener noreferrer" class="block group relative cursor-zoom-in" title="${d?"Click to view full image":"คลิกเพื่อดูรูปภาพขนาดเต็ม"}">
                    <img src="${z}" alt="${U}" class="w-full h-auto rounded-xl object-contain max-h-[520px] mx-auto transition-transform duration-200 group-hover:scale-[1.01]" loading="lazy">
                    <div class="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-slate-900/85 text-white text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-xs">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                      <span>${d?"Expand ↗":"ดูรูปเต็ม ↗"}</span>
                    </div>
                  </a>
                </div>
              `}I+=`
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                    <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                      ${C}
                    </span>
                    <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider font-display">${d?"OFFICIAL PROVISION":"ข้อบังคับทางการ"}</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] tracking-tight leading-snug mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/60 font-display">${L.title}</h3>
                  ${H}
                  <div class="text-xs text-slate-600 dark:text-slate-300">
                    ${T}
                  </div>
                </div>
                ${L.footer?`
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 leading-normal flex items-start gap-1.5">
                    <span class="text-slate-400 dark:text-slate-500 flex-shrink-0 select-none">•</span>
                    <span class="italic">${L.footer.replace(/^[\*\s]+/,"")}</span>
                  </div>
                `:""}
              </div>
            `}),p.innerHTML=I}if(i){const I=d?"Official Rules & Integrity Standards":"ข้อกำหนดและกติกามาตรฐานสากล",L=d?"Premier League Official Data Standards, Tie-Breaker Principles & Competition Integrity":"มาตรฐานความโปร่งใส การตัดสินคะแนน และระบบแข่งขันทางการ (Premier League Data Standards)",k=d?"Tie-Breaker Principles":"เกณฑ์การตัดสินกรณีคะแนนเท่ากัน (Tie-Breaker)",x=d?["Weekly Head-to-Head & Weekly Prize: Tied net points are decided by comparing individual active scoring players (starters + autosubs) in descending score order. Under Bench Boost, top 11 scoring players across the squad are compared.","Season Cumulative Overall: Ties in 38-gameweek cumulative net points are broken by Official Premier League Rank (fpl_rank)."]:["แชมป์ประจำสัปดาห์ & การหักค่าปรับ: กรณีคะแนนสุทธิเท่ากัน จะตัดสินด้วยคะแนนของผู้เล่นตัวจริงและตัวสำรองที่ถูกเปลี่ยนลงสนาม (Autosubs) เรียงจากมากไปน้อย (กรณีใช้ Bench Boost จะเปรียบเทียบจาก 11 ผู้เล่นที่ทำแต้มสูงสุด)","ตารางคะแนนรวมตลอดฤดูกาล: หากคะแนนสะสมสุทธิเท่ากันหลังจบ 38 สัปดาห์ จะตัดสินตามลำดับ Official FPL Rank (อันดับทางการของพรีเมียร์ลีก)"],C=d?"Official FPL Cup Tournament & Fair Play":"การแข่งขันฟุตบอลถ้วย & สิทธิประโยชน์",T=d?["Knockout Bracket: Pairings and progression are powered automatically by the Official FPL Cup engine starting on the designated kickoff gameweek.","Eligibility & Payouts: Prize payouts and awards are strictly reserved for verified participating members of this league."]:["ผังประกบคู่ Knockout: ประกบคู่และตัดสินผลแพ้-ชนะแบบอัตโนมัติตามระบบ Official FPL Cup เมื่อถึงสัปดาห์ที่เริ่มแข่งขันที่กำหนด","คุณสมบัติ & การรับรางวัล: สงวนสิทธิ์การรับเงินรางวัลเฉพาะทีมแข่งขันที่มีสิทธิ์รับรางวัลและเป็นสมาชิกทางการของลีก"],H=d?"Prizes Tab":"แท็บเงินรางวัล",z=d?"Chips Matrix":"สถานะชิป",U=d?"Hall of Fame":"ทำเนียบแชมป์";i.innerHTML=`
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-2xs w-full min-w-0 overflow-hidden">
              <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center justify-center shadow-2xs flex-shrink-0">
                    <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </span>
                  <div>
                    <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight font-display">${I}</h3>
                    <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">${L}</p>
                  </div>
                </div>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                  ${d?"HIGH INTEGRITY":"มาตรฐานพรีเมียร์ลีก"}
                </span>
              </div>

              <!-- 2-Column Balanced Micro-Cards (De-nested Clean Flow) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Tie-Breaker Card -->
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"></span>
                      <strong class="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm tracking-tight font-display">${k}</strong>
                    </div>
                    <ul class="space-y-2.5 mt-2.5 pl-1">
                      ${x.map(Q=>`
                        <li class="flex items-start gap-2 leading-relaxed text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span class="flex-1">${Q}</span>
                        </li>
                      `).join("")}
                    </ul>
                  </div>
                </div>

                <!-- Cup & Eligibility Card -->
                <div class="flex flex-col justify-between pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 md:pl-6">
                  <div>
                    <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"></span>
                      <strong class="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm tracking-tight font-display">${C}</strong>
                    </div>
                    <ul class="space-y-2.5 mt-2.5 pl-1">
                      ${T.map(Q=>`
                        <li class="flex items-start gap-2 leading-relaxed text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span class="flex-1">${Q}</span>
                        </li>
                      `).join("")}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Quick Cross-Tab Navigation -->
              <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span class="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-display font-bold">${d?"JUMP TO:":"ไปยังแท็บ:"}</span>
                  <button type="button" onclick="app.switchTab('prizes-view')" class="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                    <span>${H}</span>
                    <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <button type="button" onclick="app.switchTab('chips-view')" class="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                    <span>${z}</span>
                    <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <button type="button" onclick="app.switchTab('hall-of-fame-view')" class="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                    <span>${U}</span>
                    <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          `}}getAssetUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:"))return e;const t=e.startsWith("/")?e.slice(1):e;if(typeof window<"u"&&window.location&&(window.location.protocol==="http:"||window.location.protocol==="https:"))return`${window.location.pathname.includes("/fpl-mini")?"/fpl-mini/":"/"}${t}`;const a=Object.keys(this.configs||{});return`${!!(typeof window<"u"&&window.location&&window.location.pathname&&a.some(i=>window.location.pathname.includes("/"+i+"/")||window.location.pathname.endsWith("/"+i)))?"../":"./"}${t}`}getDefaultShirtUrl(){if(typeof window<"u"&&window.location&&(window.location.protocol==="http:"||window.location.protocol==="https:"))return`${window.location.pathname.includes("/fpl-mini")?"/fpl-mini/":"/"}images/shirts/shirt_0-66.webp`;const e=Object.keys(this.configs||{});return`${!!(typeof window<"u"&&window.location&&window.location.pathname&&e.some(r=>window.location.pathname.includes("/"+r+"/")||window.location.pathname.endsWith("/"+r)))?"../":"./"}images/shirts/shirt_0-66.webp`}getPlayerShirtUrl(e){const t=e.pos==="GKP",a=e.team_code||FPL_TEAM_CODES[e.team]||0,r=t?"_1-66.webp":"-66.webp";if(window.location&&(window.location.protocol==="http:"||window.location.protocol==="https:"))return`${window.location.pathname.includes("/fpl-mini")?"/fpl-mini/":"/"}images/shirts/shirt_${a}${r}`;const p=Object.keys(this.configs||{});return`${!!(window.location&&window.location.pathname&&p.some(n=>window.location.pathname.includes("/"+n+"/")||window.location.pathname.endsWith("/"+n)))?"../":"./"}images/shirts/shirt_${a}${r}`}renderAboutView(){if(!this.hasDevCornerFeature())return;const e=document.getElementById("about-view");if(!e)return;const t=this.currentLang==="en",a=Number(this.multiData&&this.multiData.max_gw)||this.selectedGW||1,r=String(a),p=this.data&&this.data.gameweeks?this.data.gameweeks[r]:null,i=!!(p&&p.is_finished),n=(p?p.is_started!==void 0?!!p.is_started:i||p.results&&p.results.some(x=>x.points>0):!1)&&!i,c=document.getElementById("site-footer"),m=Number(c&&c.dataset&&c.dataset.leagues)||Object.keys(this.configs||{}).length||9,o=(Number(c&&c.dataset&&c.dataset.teams)||1921).toLocaleString("en-US"),l=Object.values(this.configs||{}).filter(x=>x&&Number(x.tier||1)===1&&x.visibility!=="private"&&x.status!=="archived").length||Object.values(this.configs||{}).filter(x=>x&&Number(x.tier||1)===1).length||8,g=n?`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs">
               <span class="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse"></span>
               ${t?"⚡ LIVE RELAY • 15s Edge / 20s Poll":"⚡ กำลังแข่งขันสด • Edge 15 วิ / 20 วิ"}
             </span>`:`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-2xs">
               <span class="w-2 h-2 rounded-full bg-slate-400"></span>
               ${t?"✓ OFFICIAL SETTLED • Cached":"✓ สรุปผลทางการ • แคชระดับ Edge"}
             </span>`,y=n?t?"15s Edge cache &amp; 20s adaptive score/BPS relay active • Inspect Live Points (Pillar 01) and Starting XI Lineups (Pillar 02)":"กำลังรีเลย์คะแนนสดและโบนัส BPS ผ่านแคช Edge 15 วิ (Poll 20 วิ) • แนะนำดูคะแนนสด (เสาหลัก 01) และส่องแผน 11 ตัวจริง (เสาหลัก 02)":t?"Official gameweek results finalized &amp; cached • Review Transfer Advisor v2 (Pillar 03), Prize Pool (Pillar 05) &amp; Hall of Fame (Pillar 06)":"สรุปผลคะแนนเป็นทางการและบันทึกแคชแล้ว • แนะนำเช็กแนะนำการย้ายตัว v2 (เสาหลัก 03), เงินรางวัล (เสาหลัก 05) และทำเนียบแชมป์ (เสาหลัก 06)",D=n?`<span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60 tracking-wider motion-safe:animate-pulse flex-shrink-0">${t?"● LIVE":"● สดตอนนี้"}</span>`:"",h=n?`<span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60 tracking-wider flex-shrink-0">${t?"● IN-ACTION":"● กำลังเตะ"}</span>`:"",$=i?`<span class="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">${t?"✓ SETTLED":"✓ สรุปผล"}</span>`:"",v=i?`<span class="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">${t?"✓ FINAL":"✓ บันทึกผล"}</span>`:"",I=n?"border-emerald-500/40 dark:border-emerald-500/30 ring-1 ring-emerald-500/20":"border-slate-200/80 dark:border-slate-800",L=n?"bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",k=n?'<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse mr-1"></span>':"";t?e.innerHTML=`
            <!-- Top Overview Banner -->
            <div class="glass-card rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-2xs w-full max-w-full overflow-hidden">
              <div class="min-w-0">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 motion-safe:animate-pulse flex-shrink-0"></span>
                  <h2 id="about-overview-title" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-snug">
                    Dev Corner &amp; System Architecture
                  </h2>
                </div>
                <p id="about-overview-subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  ${y}
                </p>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto mt-1 sm:mt-0">
                ${g}
                <span class="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs px-3 py-1 rounded-xl font-bold font-display">
                  v3.0 Hybrid Edge
                </span>
                <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-mono text-[11px] font-semibold">
                  Fastly + Cloudflare Edge
                </span>
              </div>
            </div>

            <!-- 6 Core Feature Pillars -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0">
              
              <!-- Pillar 01: Live Points & Auto-Sub -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${D}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        01
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    Live Points &amp; Auto-Subs
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Adaptive polling (20s in-play / 90s idle) over 15s Edge cache with live BPS bonus updates.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Provisional auto-substitutions &amp; VC x2 promotions live across both Tier 1 &amp; Tier 2 Auto-Picks Live.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Live match highlights and momentum tracking reflecting rank changes as they happen.</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('gameweek-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">Jump to: Live Points</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">Open <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 02: Squad Pitch Lineup -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${h}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        02
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    Starting XI Pitch &amp; Lineup
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Click any rival team name to inspect authentic pitch formation and 4 substitutes (incl. Tier 2 on-demand).</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Displays individual player points, fixture status, and minutes played in real time.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Clearly displays active special chips (TC, BB, FH, WC).</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('gameweek-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">Open Leaderboard (Click Team Name)</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">Open <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 03: Transfers & Advisor v2 -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        03
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    Transfer Analytics &amp; Advisor v2
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Full breakdown of rival moves, net ROI after hits, Essentials (&gt;70%), and Differentials (&lt;20%).</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>In-house Hybrid xP + FDR engine projecting 1–3 GW returns on the dedicated Transfer Advisor tab.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Smart Squad Advisor scans your 15-man squad for Sell &rarr; Buy moves within budget &amp; 3-per-club limits.</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('transfers-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">Jump to: Transfer Analytics</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">Open <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 04: Rival Chips Matrix -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        04
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    Rival Chips Availability Matrix
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Strategy matrix tracking special chips (WC, FH, BB, TC) across all league rivals.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Monitor gameweek chip usage history and remaining available inventory.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Real-time visual callouts for active chips during ongoing matchdays.</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('competition-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">Jump to: Chips Matrix</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">Open <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 05: Prize Pool & Treasury -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${$}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        05
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    Prize Pool &amp; Treasury Tracker
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Automated calculation for weekly winners, monthly awards, season podiums, and fines (THB/USD).</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Integrated transfer hit deductions with fair tie-pooling split logic.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Supports league-specific mini-games such as match predictions and fantasy challenges.</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('prizes-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">Jump to: Prize Pool</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">Open <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 06: Radar & Hall of Fame -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${v}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        06
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    Form Radar &amp; Hall of Fame
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Multi-league consistency analysis measuring floor resilience and ceiling potential across ${l} Tier 1 leagues.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Historical Hall of Fame archive for weekly winners, champions, and milestones.</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Screenshot-ready 4-persona matchday commentary, 1v1 rival battle cards, and lazy-loaded Excel (.xlsx) export.</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('hall-of-fame-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">Jump to: Hall of Fame &amp; Radar</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">Open <span>&rarr;</span></span>
                </button>
              </div>

            </div>

            <!-- Ultra Clean LINE Contact Box -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 w-full min-w-0 overflow-hidden">
              <div class="space-y-1.5 max-w-xl text-left min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#06C755] motion-safe:animate-pulse"></span>
                    DIRECT LINE HOTLINE
                  </span>
                  <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
                    🟢 Responds within 24h
                  </span>
                </div>
                <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-display">
                  Contact the Developer Directly
                </h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Have questions about live points, scoring discrepancies, or want to suggest new league features? Contact the developer directly on LINE.
                </p>
              </div>

              <!-- Action Buttons (LINE + Email) -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
                <a 
                  href="https://line.me/ti/p/lgWPeyIBR7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Contact the developer via LINE (opens in a new window)"
                  class="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors active:scale-95 cursor-pointer font-display focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  <svg class="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 3.1 1.87 5.86 4.75 7.37-.21.78-.77 2.82-.88 3.25-.15.58.21.57.44.42.18-.12 2.5-1.7 3.51-2.4.72.11 1.45.16 2.18.16 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg>
                  <span>Chat with Developer</span>
                </a>
                <a 
                  href="mailto:support@fplsawadika.com" 
                  aria-label="Email developer support at support@fplsawadika.com"
                  class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-colors active:scale-95 cursor-pointer font-display focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <svg class="w-4 h-4 flex-shrink-0" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span>support@fplsawadika.com</span>
                </a>
              </div>
            </div>

            <!-- Technical Architecture -->
            <details class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-xs text-slate-500 group transition-all w-full min-w-0 overflow-hidden">
              <summary class="cursor-pointer font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-between select-none min-w-0 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/70">
                <span class="flex items-center gap-2 min-w-0 pr-2">
                  <svg class="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span class="font-display tracking-tight text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">System Architecture (Specs)</span>
                </span>
                <span class="inline-flex items-center gap-1.5 text-[10.5px] text-emerald-700 dark:text-emerald-300 font-mono font-medium bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20 dark:border-emerald-500/30 flex-shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse"></span>
                  Hybrid Edge v3.0
                </span>
              </summary>
              <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 w-full min-w-0">
                <!-- Telemetry Spec Bar -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono min-w-0">
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">RUNTIME &amp; RUNNER</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">Python 3.11</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Ubuntu • Dual-Cadence 1h/4h</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">CONCURRENCY &amp; FLEET</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">${m} Leagues • ${o} Teams</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Tier 1 &amp; 2 Auto-Picks Live</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">EDGE RELAY &amp; STORAGE</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">Cloudflare Workers</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">15s TTL • D1 &amp; KV • /picks</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">DELIVERY &amp; SECURITY</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">TTFB &lt; 50ms</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Fastly + CF Edge • SRI</span>
                  </div>
                </div>
                
          <!-- Architecture Workflow Diagram (Visual Guide) -->
          <div class="mt-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 sm:p-4 overflow-hidden arch-diagram">
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="truncate">SYSTEM WORKFLOW ARCHITECTURE (DIAGRAM)</span>
              </span>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="sm:hidden text-[9.5px] font-mono text-slate-400 dark:text-slate-500">← Swipe horizontally to view full →</span>
                <a href="${this.getAssetPrefix()}docs/architecture-workflow.html" target="_blank" rel="noopener noreferrer" class="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  <span>Open Fullscreen ↗</span>
                </a>
              </div>
            </div>
            <div class="w-full overflow-x-auto rounded-lg border border-slate-200/60 dark:border-slate-800/80 p-2 sm:p-3 bg-slate-100/50 dark:bg-slate-950/60">
              <svg viewBox="0 0 1020 450" class="w-full min-w-[760px] h-auto block" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fpl-embed-arch-title fpl-embed-arch-desc">
                <title id="fpl-embed-arch-title">FPLSaWaDiKa System Architecture & Pipeline Workflow (Season 2026/27)</title>
                <desc id="fpl-embed-arch-desc">Architecture diagram showing v3.0 Hybrid Edge (9 leagues, 1,921 teams): Dual-Cadence 1h/4h sync, Tier 2 Auto-Picks Live, Hybrid xP+FDR, and Cloudflare Workers + D1/KV</desc>
                <defs>
                  <pattern id="embed-bg-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.8" fill="var(--diag-ink)" opacity="0.08"/>
                  </pattern>
                  <marker id="embed-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--diag-muted)"/>
                  </marker>
                  <marker id="embed-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--diag-accent)"/>
                  </marker>
                  <marker id="embed-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--diag-link)"/>
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="var(--diag-paper)" rx="10"/>
                <rect width="100%" height="100%" fill="url(#embed-bg-dots)" rx="10"/>
                <rect x="220" y="52" width="288" height="344" rx="8" fill="var(--diag-paper-2)" stroke="var(--diag-rule-solid)" stroke-width="1"/>
                <rect x="232" y="44" width="216" height="16" rx="2" fill="var(--diag-paper)"/>
                <text x="240" y="56" fill="var(--diag-accent)" font-size="8.5" font-weight="600" font-family="var(--font-mono)" letter-spacing="0.12em">1. INGESTION &amp; ATOMIC STATE</text>
                <rect x="528" y="52" width="248" height="344" rx="8" fill="var(--diag-paper-2)" stroke="var(--diag-rule-solid)" stroke-width="1"/>
                <rect x="540" y="44" width="204" height="16" rx="2" fill="var(--diag-paper)"/>
                <text x="548" y="56" fill="var(--diag-muted)" font-size="8.5" font-weight="600" font-family="var(--font-mono)" letter-spacing="0.12em">2. JAMSTACK &amp; EDGE CDN</text>
                <rect x="796" y="52" width="204" height="344" rx="8" fill="var(--diag-paper-2)" stroke="var(--diag-rule-solid)" stroke-width="1"/>
                <rect x="808" y="44" width="168" height="16" rx="2" fill="var(--diag-paper)"/>
                <text x="816" y="56" fill="var(--diag-accent)" font-size="8.5" font-weight="600" font-family="var(--font-mono)" letter-spacing="0.12em">3. CLIENT RUNTIME</text>
                <line x1="180" y1="128" x2="240" y2="128" stroke="var(--diag-link)" stroke-width="1.3" marker-end="url(#embed-arrow-link)"/>
                <line x1="364" y1="164" x2="364" y2="196" stroke="var(--diag-accent)" stroke-width="1.4" marker-end="url(#embed-arrow-accent)"/>
                <line x1="364" y1="268" x2="364" y2="300" stroke="var(--diag-muted)" stroke-width="1.2" marker-end="url(#embed-arrow)"/>
                <path d="M 488,336 H 510 Q 518,336 518,328 V 176 Q 518,168 526,168 H 548" fill="none" stroke="var(--diag-accent)" stroke-width="1.4" marker-end="url(#embed-arrow-accent)"/>
                <line x1="652" y1="204" x2="652" y2="252" stroke="var(--diag-muted)" stroke-width="1.2" marker-end="url(#embed-arrow)"/>
                <path d="M 756,280 H 778 Q 786,280 786,272 V 224 Q 786,216 794,216 H 816" fill="none" stroke="var(--diag-link)" stroke-width="1.3" marker-end="url(#embed-arrow-link)"/>
                <path d="M 816,244 H 794 Q 786,244 786,252 V 300 Q 786,308 778,308 H 756" fill="none" stroke="var(--diag-muted)" stroke-width="1.1" stroke-dasharray="4,3" marker-end="url(#embed-arrow)"/>
                <path d="M 102,324 V 412 Q 102,420 110,420 H 892 Q 900,420 900,412 V 264" fill="none" stroke="var(--diag-link)" stroke-width="1.3" stroke-dasharray="5,3" marker-end="url(#embed-arrow-link)"/>
                <rect x="186" y="106" width="48" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="210" y="116" fill="var(--diag-link)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.08em">REST JSON</text>
                <rect x="330" y="173" width="68" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="364" y="183" fill="var(--diag-accent)" font-size="7.5" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">THREAD-SAFE</text>
                <rect x="330" y="277" width="68" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="364" y="287" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.08em">OS.REPLACE</text>
                <rect x="487" y="242" width="62" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="518" y="252" fill="var(--diag-accent)" font-size="7.5" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">DIFF DETECT</text>
                <rect x="612" y="221" width="80" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="652" y="231" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.06em">SPLIT &amp; CHUNKS</text>
                <rect x="752" y="168" width="68" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="786" y="178" fill="var(--diag-link)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.08em">TTFB &lt; 50ms</text>
                <rect x="744" y="330" width="84" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="786" y="340" fill="var(--diag-muted)" font-size="7" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.06em">LAZY &amp; CHUNKS</text>
                <rect x="300" y="413" width="400" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="500" y="423" fill="var(--diag-link)" font-size="7.5" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">15s EDGE TTL • 20s/90s POLL • /PICKS &amp; /STANDINGS</text>
                <g id="embed-node-fpl-api">
                  <rect x="24" y="92" width="156" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="24" y="92" width="156" height="72" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke="var(--diag-link)" stroke-width="1.2"/>
                  <rect x="32" y="100" width="64" height="12" rx="2" fill="rgba(96, 165, 250, 0.15)"/>
                  <text x="64" y="109" fill="var(--diag-link)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">EXTERNAL API</text>
                  <text x="102" y="130" fill="var(--diag-ink)" font-size="11.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Official FPL API</text>
                  <text x="102" y="148" fill="var(--diag-muted)" font-size="8" font-family="var(--font-mono)" text-anchor="middle">Live / Picks / Fixtures</text>
                </g>
                <g id="embed-node-cf-worker">
                  <rect x="24" y="252" width="156" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="24" y="252" width="156" height="72" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke="var(--diag-link)" stroke-width="1.2"/>
                  <rect x="32" y="260" width="76" height="12" rx="2" fill="rgba(96, 165, 250, 0.15)"/>
                  <text x="70" y="269" fill="var(--diag-link)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">EDGE &amp; STORAGE</text>
                  <text x="102" y="290" fill="var(--diag-ink)" font-size="11" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Cloudflare Edge + D1/KV</text>
                  <text x="102" y="308" fill="var(--diag-muted)" font-size="7.8" font-family="var(--font-mono)" text-anchor="middle">15s TTL • /picks • Analytics</text>
                </g>
                <g id="embed-node-sync-engine">
                  <rect x="240" y="92" width="248" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="240" y="92" width="248" height="72" rx="6" fill="var(--diag-accent-tint)" stroke="var(--diag-accent)" stroke-width="1.5"/>
                  <rect x="248" y="100" width="88" height="12" rx="2" fill="var(--diag-accent)" opacity="0.18"/>
                  <text x="292" y="109" fill="var(--diag-accent)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">HYBRID PIPELINE</text>
                  <text x="364" y="130" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">sync_live_fpl.py</text>
                  <text x="364" y="148" fill="var(--diag-muted)" font-size="8" font-family="var(--font-mono)" text-anchor="middle">Tier 1: 8 Leagues (146) • Tier 2: 1,779</text>
                </g>
                <g id="embed-node-atomic-store">
                  <rect x="240" y="196" width="248" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="240" y="196" width="248" height="72" rx="6" fill="rgba(148, 163, 184, 0.06)" stroke="var(--diag-rule-solid)" stroke-width="1.2"/>
                  <rect x="248" y="204" width="74" height="12" rx="2" fill="rgba(148, 163, 184, 0.15)"/>
                  <text x="285" y="213" fill="var(--diag-soft)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">DATA INTEGRITY</text>
                  <text x="364" y="234" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">POSIX Atomic Store</text>
                  <text x="364" y="252" fill="var(--diag-muted)" font-size="8" font-family="var(--font-mono)" text-anchor="middle">multi_fpl_data.json • Hybrid xP+FDR</text>
                </g>
                <g id="embed-node-smart-commit">
                  <rect x="240" y="300" width="248" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="240" y="300" width="248" height="72" rx="6" fill="rgba(148, 163, 184, 0.06)" stroke="var(--diag-rule-solid)" stroke-width="1.2"/>
                  <rect x="248" y="308" width="74" height="12" rx="2" fill="rgba(148, 163, 184, 0.15)"/>
                  <text x="285" y="317" fill="var(--diag-soft)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">GIT ZERO-CHURN</text>
                  <text x="364" y="338" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Smart Commit Engine</text>
                  <text x="364" y="356" fill="var(--diag-muted)" font-size="7.8" font-family="var(--font-mono)" text-anchor="middle">Dual-Cadence 1h/4h • Semantic Diff Zero-Churn</text>
                </g>
                <g id="embed-node-preview-compiler">
                  <rect x="548" y="132" width="208" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="548" y="132" width="208" height="72" rx="6" fill="rgba(148, 163, 184, 0.06)" stroke="var(--diag-rule-solid)" stroke-width="1.2"/>
                  <rect x="556" y="140" width="80" height="12" rx="2" fill="rgba(148, 163, 184, 0.15)"/>
                  <text x="596" y="149" fill="var(--diag-soft)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">JAMSTACK BUILD</text>
                  <text x="652" y="170" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">update_preview.py</text>
                  <text x="652" y="188" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" text-anchor="middle">Shared Bundle • /{id}.json &amp; gw{gw}.json</text>
                </g>
                <g id="embed-node-edge-cdn">
                  <rect x="548" y="252" width="208" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="548" y="252" width="208" height="72" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke="var(--diag-link)" stroke-width="1.2"/>
                  <rect x="556" y="260" width="60" height="12" rx="2" fill="rgba(96, 165, 250, 0.15)"/>
                  <text x="586" y="269" fill="var(--diag-link)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">EDGE CDN</text>
                  <text x="652" y="290" fill="var(--diag-ink)" font-size="11.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Cloudflare DNS &amp; Edge CDN</text>
                  <text x="652" y="308" fill="var(--diag-muted)" font-size="7.6" font-family="var(--font-mono)" text-anchor="middle">fplsawadika.com • Multi-Tenant • Brotli</text>
                </g>
                <g id="embed-node-client-app">
                  <rect x="816" y="192" width="168" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="816" y="192" width="168" height="72" rx="6" fill="var(--diag-accent-tint)" stroke="var(--diag-accent)" stroke-width="1.5"/>
                  <rect x="824" y="200" width="64" height="12" rx="2" fill="var(--diag-accent)" opacity="0.18"/>
                  <text x="856" y="209" fill="var(--diag-accent)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">BROWSER SPA</text>
                  <text x="900" y="230" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Vanilla Client App</text>
                  <text x="900" y="248" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" text-anchor="middle">Zero-Framework • 20s/90s Poll • SRI</text>
                </g>
              </svg>
            </div>
          </div>

          <!-- Tech Stack Architecture Diagram (Brand & Topology Guide) -->
          <div class="mt-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 sm:p-4 overflow-hidden tech-stack-diagram">
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                <span class="truncate">TECH STACK ARCHITECTURE (DIAGRAM)</span>
              </span>
              <a href="${this.getAssetPrefix()}docs/tech-stack-diagram.html" target="_blank" rel="noopener noreferrer" class="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 flex-shrink-0">
                <span>Open Fullscreen ↗</span>
              </a>
            </div>
            <div class="w-full overflow-hidden rounded-lg border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/60 p-1 sm:p-2">
              <a href="${this.getAssetPrefix()}docs/tech-stack-diagram.html" target="_blank" rel="noopener noreferrer" class="block group relative cursor-zoom-in" title="Click to expand high-res diagram ↗">
                <!-- Light theme image -->
                <img src="${this.getAssetPrefix()}images/tech-stack-diagram.png?v=3" alt="FPLSaWaDiKa Tech Stack Diagram" class="w-full h-auto rounded block dark:hidden shadow-xs" loading="lazy">
                <!-- Dark theme image -->
                <img src="${this.getAssetPrefix()}images/tech-stack-diagram-dark.png?v=3" alt="FPLSaWaDiKa Tech Stack Diagram" class="w-full h-auto rounded hidden dark:block shadow-xs" loading="lazy">
                <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none shadow">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                  <span>Click to expand high-res diagram ↗</span>
                </div>
              </a>
            </div>
            <div class="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Python 3.11</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">GitHub Actions (1h/4h)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Cloudflare Workers + D1 &amp; KV</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Hybrid xP + FDR Engine</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">fplsawadika.com (Edge CDN)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Zero-Framework ES6+ (Shared Bundle)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Tailwind CSS v4 (SRI)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">SheetJS (Lazy + SRI)</span>
              </div>
              <span class="hidden sm:inline text-[9.5px] text-slate-400 dark:text-slate-500 flex-shrink-0">stack-diagram • High-DPI Retina</span>
            </div>
          </div>
    
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 text-slate-600 dark:text-slate-300 w-full min-w-0">
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">STAGE 01 • INGESTION</span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Dual-Cadence &amp; Auto-Picks</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">1. Dual-Cadence Pipeline &amp; Auto-Picks</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Smart Dual-Cadence Orchestration:</strong> Runs on commit-SHA-pinned GitHub Actions (Ubuntu Latest / Python 3.11) with a <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">58s</code> stagger offset — hourly Fri–Mon matchdays and every 4h Tue–Thu (~83% load reduction), plus manual dispatch.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Dual-Scale &amp; Tier 2 Auto-Picks Live:</strong> Tier 1 syncs concurrently via <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">ThreadPoolExecutor</code> (5 workers + 0.12s rate pacer, &gt;95% GW cache reuse), while Tier 2 (up to 3,000 teams / 8 workers) caches squad picks once post-deadline into <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">data/leagues/{id}/gw{gw}.json</code> for full live points, captaincy, hits, chips, and auto-subs.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Hybrid xP + FDR Transfer Advisor v2:</strong> In-house <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">sync_live_fpl.py</code> 1–3 GW projection engine combining Official <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">ep_next</code>, form, <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">xGI/90</code>, minutes reliability, and 3-GW FDR (with optional Azure xP blend).</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">STAGE 02 • STATE MACHINE</span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Atomic &amp; Zero-Churn</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">2. Data Integrity &amp; Atomic State Machine</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">POSIX Atomic Replacement:</strong> Serializes <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">multi_fpl_data.json</code>, per-league JSONs, and chunks via <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">tempfile</code> + <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">os.replace</code>, skipping identical writes to keep diffs minimal.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Pre-Commit Validation:</strong> Validates live points, auto-subs, VC x2 promotions, chip activations, transfer hits, multi-currency payouts (THB/USD), and tie-pooling formulas.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Zero-Churn Smart Commit &amp; 6h Heartbeat:</strong> Skips Git commits on unchanged scores/ranks (Zero Git Bloat) with a 6h periodic heartbeat and single-league <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">--league &lt;id&gt;</code> sync support.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">STAGE 03 • JAMSTACK</span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Shared Bundle &amp; Isolation</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">3. Config-Driven Jamstack &amp; Multi-Tenant</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Multi-Tenant Isolation &amp; Season Rollover:</strong> 100% driven by <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">config/leagues_config.json</code> with showcase vs. private tenant isolation (<code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">noindex</code> + sitemap filtering) and automated legacy directory cleanup.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Shared Bundle &amp; Decoupled Chunks:</strong> <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">update_preview.py</code> exports SHA-256 cache-busted <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">assets/dashboard-app.js</code>, dedicated <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">/{id}/index.html</code> routes, <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">data/leagues/{id}.json</code>, and Tier 2 <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">gw{gw}.json</code> chunks (&gt;85% smaller initial HTML).</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Hybrid Edge CDN Routing:</strong> Served on <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">www.fplsawadika.com</code> via Cloudflare DNS (CNAME Flattening) and Fastly Edge CDN (HTTP/2, Brotli, sub-50ms TTFB) paired with <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">api.fplsawadika.com</code>.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between ${I}">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border ${L}">
                          ${k}STAGE 04 • CLIENT &amp; EDGE
                        </span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">15s Edge • 20s/90s Poll</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">4. Adaptive Client Runtime &amp; Edge D1/KV</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Adaptive Poll, Edge D1/KV &amp; Tier 2 Relay:</strong> Client polls <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">api.fplsawadika.com</code> every <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">20s</code> in-play (<code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">90s</code> idle) over Cloudflare Workers (15s/120s/300s dynamic Edge TTL), on-demand <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">/picks</code> &amp; <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">/standings</code>, plus First-Party Edge Analytics on Cloudflare D1 &amp; KV.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Provisional Auto-Subs &amp; Race Guard:</strong> Live client-side provisional auto-subs during active matches, lazy per-league JSON fetching guarded by monotonic request tokens, synchronized via History API &amp; <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">localStorage</code>.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Zero-Framework, SRI Security &amp; A11y:</strong> Vanilla ES6+ shared bundle with pinned CDN scripts &amp; Subresource Integrity (<code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">sha384</code> on Tailwind v4.3.5 &amp; lazy SheetJS), Edge Security Headers (CSP/HSTS), <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">tabular-nums</code> (CLS: 0.00), and Page Visibility API battery saver.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          `:e.innerHTML=`
            <!-- Top Overview Banner (Consistent with Highlights, Chips, Transfers, Form Radar) -->
            <div class="glass-card rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-2xs w-full max-w-full overflow-hidden">
              <div class="min-w-0">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 motion-safe:animate-pulse flex-shrink-0"></span>
                  <h2 id="about-overview-title" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-snug">
                    Dev Corner &amp; สถาปัตยกรรมระบบ
                  </h2>
                </div>
                <p id="about-overview-subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  ${y}
                </p>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto mt-1 sm:mt-0">
                ${g}
                <span class="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs px-3 py-1 rounded-xl font-bold font-display">
                  v3.0 Hybrid Edge
                </span>
                <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1 rounded-xl font-mono text-[11px] font-semibold">
                  Fastly + Cloudflare Edge
                </span>
              </div>
            </div>

            <!-- 6 Core Feature Pillars (คู่มือฟังก์ชันการใช้งาน 6 เสาหลักของแพลตฟอร์ม) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0">
              
              <!-- Pillar 01: Live Scores & Auto-Sub -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${D}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        01
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    คะแนนสด &amp; เปลี่ยนตัวอัตโนมัติ
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>อัปเดตคะแนนสดแบบ Adaptive Poll (20 วิระหว่างแข่ง / 90 วิช่วงพัก) ผ่านแคช Edge 15 วิพร้อมโบนัส BPS</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>คำนวณตัวสำรองชั่วคราว (Provisional Auto-Sub) และดันรองกัปตัน (VC x2) สดครบทั้ง Tier 1 &amp; Tier 2 Auto-Picks Live</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>บทวิเคราะห์ไฮไลท์สด เกาะติดการสลับอันดับและโมเมนตัมแบบเรียลไทม์</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('gameweek-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">ไปยังแท็บ: คะแนนสด</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">เปิดดู <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 02: Squad Pitch Lineup -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${h}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        02
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    ส่องแผนจัดทัพ 11 ตัวจริง
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>คลิกที่ชื่อทีมเพื่อน เพื่อเปิดดูแผนผังสนามหญ้าและ 4 ตัวสำรอง (รองรับ Tier 2 On-Demand)</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>แสดงคะแนนรายคน สถานะลงสนาม และนาทีที่ลงเล่นแบบเรียลไทม์</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>ตรวจเช็กการใช้ชิปพิเศษอย่างชัดเจน (TC, BB, FH, WC)</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('gameweek-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">ไปที่ตารางคะแนน (คลิกชื่อทีม)</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">เปิดดู <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 03: Transfers & Advisor v2 -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        03
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    วิเคราะห์ย้ายตัว &amp; แนะนำการย้ายตัว v2
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>สรุปดีลซื้อขายคู่แข่ง แต้มได้-เสียสุทธิ (ROI/Hits) ตัวมหาชน (&gt;70%) และตัวทีเด็ด (&lt;20%)</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>โมเดล In-House Hybrid xP + FDR คำนวณแต้มคาดการณ์ 1–3 GW บนแท็บแนะนำการย้ายตัว</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>Smart Squad Advisor สแกน 15 ตัวแนะนำ "ขายใคร &rarr; ซื้อใคร" ตามงบจริงและกฎ 3 คน/ทีม</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('transfers-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">ไปยังแท็บ: วิเคราะห์การย้ายตัว</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">เปิดดู <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 04: Rival Chips Matrix -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        04
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    ติดตามสถานะชิปของคู่แข่ง
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>ตารางแมทริกซ์เช็กสถานะชิปพิเศษ (WC, FH, BB, TC) ของผู้จัดการทีมทุกคน</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>ตรวจสอบชิปที่ใช้ไปแล้วในแต่ละสัปดาห์ และชิปที่ยังเหลืออยู่แบบแยกเดี่ยว</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>ไฮไลท์พิเศษแจ้งเตือนชิปที่กำลังเปิดใช้งานระหว่างสัปดาห์แข่งขันสด</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('competition-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">ไปยังแท็บ: สถานะชิป</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">เปิดดู <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 05: Prizes & Treasury -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${$}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        05
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    เงินรางวัล &amp; บัญชีกองกลาง
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>คำนวณแชมป์สัปดาห์, แชมป์เดือน, สิ้นฤดูกาล และค่าปรับอัตโนมัติ (รองรับ THB/USD)</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>หักแต้มย้ายทีมในตัว พร้อมเฉลี่ยเงินรางวัลอย่างยุติธรรม (Tie-Pooling)</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>รองรับมินิเกมเฉพาะลีก เช่น ทายผลบอล และท้าชนคะแนนแฟนตาซี</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('prizes-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">ไปยังแท็บ: เงินรางวัล</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">เปิดดู <span>&rarr;</span></span>
                </button>
              </div>

              <!-- Pillar 06: Radar & Hall of Fame -->
              <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full min-w-0 overflow-hidden">
                <div class="min-w-0">
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs flex-shrink-0">
                      <svg class="w-4 h-4" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                    </span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      ${v}
                      <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider flex-shrink-0">
                        06
                      </span>
                    </div>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                    เรดาร์ฟอร์ม &amp; ทำเนียบแชมป์
                  </h3>
                  <ul class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1.5 leading-relaxed">
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>วิเคราะห์ความสม่ำเสมอ ประเมินแต้มต่ำสุด-สูงสุด ของทั้ง ${l} ลีก Tier 1</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>บันทึกประวัติศาสตร์ทำเนียบแชมป์และหอเกียรติยศตลอดทุกฤดูกาล</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">•</span>
                      <span>การ์ดสรุปพากษ์สด 4 บุคลิก เทียบคู่แข่ง 1v1 พร้อมแคปหน้าจอแชร์ และส่งออกไฟล์ Excel (.xlsx)</span>
                    </li>
                  </ul>
                </div>
                <button type="button" onclick="app.switchTab('hall-of-fame-view')" class="inline-flex items-center justify-between w-full pt-2.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer text-left min-w-0">
                  <span class="truncate">ไปยังแท็บ: ทำเนียบแชมป์ &amp; เรดาร์ฟอร์ม</span>
                  <span class="inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1 text-emerald-600 dark:text-emerald-400">เปิดดู <span>&rarr;</span></span>
                </button>
              </div>

            </div>

            <!-- Ultra Clean LINE Contact Box -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 w-full min-w-0 overflow-hidden">
              <div class="space-y-1.5 max-w-xl text-left min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#06C755] motion-safe:animate-pulse"></span>
                    DIRECT LINE HOTLINE
                  </span>
                  <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
                    🟢 ตอบกลับภายใน 24 ชม.
                  </span>
                </div>
                <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-display">
                  ทักคุยกับผู้พัฒนาโดยตรง (Developer Support)
                </h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  มีข้อสงสัยเรื่องแต้มสด, แจ้งปัญหาคะแนน หรืออยากเสนอแนะฟีเจอร์สำหรับมินิลีก สามารถทักคุยกับเดฟผ่าน LINE ส่วนตัวได้ตลอดเวลา
                </p>
              </div>

              <!-- Action Buttons (LINE + Email) -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
                <a 
                  href="https://line.me/ti/p/lgWPeyIBR7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="ติดต่อผู้พัฒนาผ่าน LINE (เปิดหน้าต่างใหม่)"
                  class="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors active:scale-95 cursor-pointer font-display focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  <svg class="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 3.1 1.87 5.86 4.75 7.37-.21.78-.77 2.82-.88 3.25-.15.58.21.57.44.42.18-.12 2.5-1.7 3.51-2.4.72.11 1.45.16 2.18.16 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg>
                  <span>เปิด LINE ทักหาเดฟ</span>
                </a>
                <a 
                  href="mailto:support@fplsawadika.com" 
                  aria-label="ส่งอีเมลติดต่อผู้พัฒนาที่ support@fplsawadika.com"
                  class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-colors active:scale-95 cursor-pointer font-display focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <svg class="w-4 h-4 flex-shrink-0" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span>support@fplsawadika.com</span>
                </a>
              </div>
            </div>

            <!-- Technical Architecture -->
            <details class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-xs text-slate-500 group transition-all w-full min-w-0 overflow-hidden">
              <summary class="cursor-pointer font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-between select-none min-w-0 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/70">
                <span class="flex items-center gap-2 min-w-0 pr-2">
                  <svg class="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span class="font-display tracking-tight text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">สถาปัตยกรรมระบบเบื้องหลัง (Specs)</span>
                </span>
                <span class="inline-flex items-center gap-1.5 text-[10.5px] text-emerald-700 dark:text-emerald-300 font-mono font-medium bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20 dark:border-emerald-500/30 flex-shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse"></span>
                  Hybrid Edge v3.0
                </span>
              </summary>
              <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 w-full min-w-0">
                <!-- Telemetry Spec Bar -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono min-w-0">
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">ระบบรันหลัก</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">Python 3.11</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Ubuntu • Dual-Cadence 1h/4h</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">การประมวลผลคู่ขนาน</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">${m} ลีก • ${o} ทีม</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Tier 1 &amp; 2 Auto-Picks Live</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">รีเลย์ &amp; คลังข้อมูล Edge</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">Cloudflare Workers</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">15s TTL • D1 &amp; KV • /picks</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <span class="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase tracking-wider font-semibold truncate">เครือข่าย &amp; ความปลอดภัย</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100 truncate">TTFB &lt; 50ms</span>
                    <span class="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Fastly + CF Edge • SRI</span>
                  </div>
                </div>
                
          <!-- Architecture Workflow Diagram (Visual Guide) -->
          <div class="mt-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 sm:p-4 overflow-hidden arch-diagram">
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="truncate">SYSTEM WORKFLOW ARCHITECTURE (DIAGRAM)</span>
              </span>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="sm:hidden text-[9.5px] font-mono text-slate-400 dark:text-slate-500">← เลื่อนแนวนอนเพื่อดูผังเต็ม →</span>
                <a href="${this.getAssetPrefix()}docs/architecture-workflow.html" target="_blank" rel="noopener noreferrer" class="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  <span>เปิดดูเต็มจอ ↗</span>
                </a>
              </div>
            </div>
            <div class="w-full overflow-x-auto rounded-lg border border-slate-200/60 dark:border-slate-800/80 p-2 sm:p-3 bg-slate-100/50 dark:bg-slate-950/60">
              <svg viewBox="0 0 1020 450" class="w-full min-w-[760px] h-auto block" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="fpl-embed-arch-title fpl-embed-arch-desc">
                <title id="fpl-embed-arch-title">สถาปัตยกรรมระบบเบื้องหลังและเวิร์กโฟลว์การประมวลผลข้อมูล FPLSaWaDiKa (Season 2026/27)</title>
                <desc id="fpl-embed-arch-desc">ไดอะแกรมแสดงโฟลว์การทำงานแบบ Hybrid Edge v3.0 (9 ลีก 1,921 ทีม): Smart Dual-Cadence 1h/4h, Tier 2 Auto-Picks Live, Hybrid xP+FDR และ Cloudflare Workers + D1/KV</desc>
                <defs>
                  <pattern id="embed-bg-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.8" fill="var(--diag-ink)" opacity="0.08"/>
                  </pattern>
                  <marker id="embed-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--diag-muted)"/>
                  </marker>
                  <marker id="embed-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--diag-accent)"/>
                  </marker>
                  <marker id="embed-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--diag-link)"/>
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="var(--diag-paper)" rx="10"/>
                <rect width="100%" height="100%" fill="url(#embed-bg-dots)" rx="10"/>
                <rect x="220" y="52" width="288" height="344" rx="8" fill="var(--diag-paper-2)" stroke="var(--diag-rule-solid)" stroke-width="1"/>
                <rect x="232" y="44" width="216" height="16" rx="2" fill="var(--diag-paper)"/>
                <text x="240" y="56" fill="var(--diag-accent)" font-size="8.5" font-weight="600" font-family="var(--font-mono)" letter-spacing="0.12em">1. INGESTION &amp; ATOMIC STATE</text>
                <rect x="528" y="52" width="248" height="344" rx="8" fill="var(--diag-paper-2)" stroke="var(--diag-rule-solid)" stroke-width="1"/>
                <rect x="540" y="44" width="204" height="16" rx="2" fill="var(--diag-paper)"/>
                <text x="548" y="56" fill="var(--diag-muted)" font-size="8.5" font-weight="600" font-family="var(--font-mono)" letter-spacing="0.12em">2. JAMSTACK &amp; EDGE CDN</text>
                <rect x="796" y="52" width="204" height="344" rx="8" fill="var(--diag-paper-2)" stroke="var(--diag-rule-solid)" stroke-width="1"/>
                <rect x="808" y="44" width="168" height="16" rx="2" fill="var(--diag-paper)"/>
                <text x="816" y="56" fill="var(--diag-accent)" font-size="8.5" font-weight="600" font-family="var(--font-mono)" letter-spacing="0.12em">3. CLIENT RUNTIME</text>
                <line x1="180" y1="128" x2="240" y2="128" stroke="var(--diag-link)" stroke-width="1.3" marker-end="url(#embed-arrow-link)"/>
                <line x1="364" y1="164" x2="364" y2="196" stroke="var(--diag-accent)" stroke-width="1.4" marker-end="url(#embed-arrow-accent)"/>
                <line x1="364" y1="268" x2="364" y2="300" stroke="var(--diag-muted)" stroke-width="1.2" marker-end="url(#embed-arrow)"/>
                <path d="M 488,336 H 510 Q 518,336 518,328 V 176 Q 518,168 526,168 H 548" fill="none" stroke="var(--diag-accent)" stroke-width="1.4" marker-end="url(#embed-arrow-accent)"/>
                <line x1="652" y1="204" x2="652" y2="252" stroke="var(--diag-muted)" stroke-width="1.2" marker-end="url(#embed-arrow)"/>
                <path d="M 756,280 H 778 Q 786,280 786,272 V 224 Q 786,216 794,216 H 816" fill="none" stroke="var(--diag-link)" stroke-width="1.3" marker-end="url(#embed-arrow-link)"/>
                <path d="M 816,244 H 794 Q 786,244 786,252 V 300 Q 786,308 778,308 H 756" fill="none" stroke="var(--diag-muted)" stroke-width="1.1" stroke-dasharray="4,3" marker-end="url(#embed-arrow)"/>
                <path d="M 102,324 V 412 Q 102,420 110,420 H 892 Q 900,420 900,412 V 264" fill="none" stroke="var(--diag-link)" stroke-width="1.3" stroke-dasharray="5,3" marker-end="url(#embed-arrow-link)"/>
                <rect x="186" y="106" width="48" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="210" y="116" fill="var(--diag-link)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.08em">REST JSON</text>
                <rect x="330" y="173" width="68" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="364" y="183" fill="var(--diag-accent)" font-size="7.5" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">THREAD-SAFE</text>
                <rect x="330" y="277" width="68" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="364" y="287" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.08em">OS.REPLACE</text>
                <rect x="487" y="242" width="62" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="518" y="252" fill="var(--diag-accent)" font-size="7.5" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">DIFF DETECT</text>
                <rect x="612" y="221" width="80" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="652" y="231" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.06em">SPLIT &amp; CHUNKS</text>
                <rect x="752" y="168" width="68" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="786" y="178" fill="var(--diag-link)" font-size="7.5" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.08em">TTFB &lt; 50ms</text>
                <rect x="744" y="330" width="84" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="786" y="340" fill="var(--diag-muted)" font-size="7" font-family="var(--font-mono)" font-weight="500" text-anchor="middle" letter-spacing="0.06em">LAZY &amp; CHUNKS</text>
                <rect x="300" y="413" width="400" height="14" rx="2" fill="var(--diag-paper)"/>
                <text x="500" y="423" fill="var(--diag-link)" font-size="7.5" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">15s EDGE TTL • 20s/90s POLL • /PICKS &amp; /STANDINGS</text>
                <g id="embed-node-fpl-api">
                  <rect x="24" y="92" width="156" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="24" y="92" width="156" height="72" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke="var(--diag-link)" stroke-width="1.2"/>
                  <rect x="32" y="100" width="64" height="12" rx="2" fill="rgba(96, 165, 250, 0.15)"/>
                  <text x="64" y="109" fill="var(--diag-link)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">EXTERNAL API</text>
                  <text x="102" y="130" fill="var(--diag-ink)" font-size="11.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Official FPL API</text>
                  <text x="102" y="148" fill="var(--diag-muted)" font-size="8" font-family="var(--font-mono)" text-anchor="middle">Live / Picks / Fixtures</text>
                </g>
                <g id="embed-node-cf-worker">
                  <rect x="24" y="252" width="156" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="24" y="252" width="156" height="72" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke="var(--diag-link)" stroke-width="1.2"/>
                  <rect x="32" y="260" width="76" height="12" rx="2" fill="rgba(96, 165, 250, 0.15)"/>
                  <text x="70" y="269" fill="var(--diag-link)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">EDGE &amp; STORAGE</text>
                  <text x="102" y="290" fill="var(--diag-ink)" font-size="11" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Cloudflare Edge + D1/KV</text>
                  <text x="102" y="308" fill="var(--diag-muted)" font-size="7.8" font-family="var(--font-mono)" text-anchor="middle">15s TTL • /picks • Analytics</text>
                </g>
                <g id="embed-node-sync-engine">
                  <rect x="240" y="92" width="248" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="240" y="92" width="248" height="72" rx="6" fill="var(--diag-accent-tint)" stroke="var(--diag-accent)" stroke-width="1.5"/>
                  <rect x="248" y="100" width="88" height="12" rx="2" fill="var(--diag-accent)" opacity="0.18"/>
                  <text x="292" y="109" fill="var(--diag-accent)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">HYBRID PIPELINE</text>
                  <text x="364" y="130" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">sync_live_fpl.py</text>
                  <text x="364" y="148" fill="var(--diag-muted)" font-size="8" font-family="var(--font-mono)" text-anchor="middle">Tier 1: 8 ลีก (146) • Tier 2: 1,779 ทีม</text>
                </g>
                <g id="embed-node-atomic-store">
                  <rect x="240" y="196" width="248" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="240" y="196" width="248" height="72" rx="6" fill="rgba(148, 163, 184, 0.06)" stroke="var(--diag-rule-solid)" stroke-width="1.2"/>
                  <rect x="248" y="204" width="74" height="12" rx="2" fill="rgba(148, 163, 184, 0.15)"/>
                  <text x="285" y="213" fill="var(--diag-soft)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">DATA INTEGRITY</text>
                  <text x="364" y="234" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">POSIX Atomic Store</text>
                  <text x="364" y="252" fill="var(--diag-muted)" font-size="8" font-family="var(--font-mono)" text-anchor="middle">multi_fpl_data.json • Hybrid xP+FDR</text>
                </g>
                <g id="embed-node-smart-commit">
                  <rect x="240" y="300" width="248" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="240" y="300" width="248" height="72" rx="6" fill="rgba(148, 163, 184, 0.06)" stroke="var(--diag-rule-solid)" stroke-width="1.2"/>
                  <rect x="248" y="308" width="74" height="12" rx="2" fill="rgba(148, 163, 184, 0.15)"/>
                  <text x="285" y="317" fill="var(--diag-soft)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">GIT ZERO-CHURN</text>
                  <text x="364" y="338" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Smart Commit Engine</text>
                  <text x="364" y="356" fill="var(--diag-muted)" font-size="7.8" font-family="var(--font-mono)" text-anchor="middle">Dual-Cadence 1h/4h • ข้าม Commit ไร้แต้มเปลี่ยน</text>
                </g>
                <g id="embed-node-preview-compiler">
                  <rect x="548" y="132" width="208" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="548" y="132" width="208" height="72" rx="6" fill="rgba(148, 163, 184, 0.06)" stroke="var(--diag-rule-solid)" stroke-width="1.2"/>
                  <rect x="556" y="140" width="80" height="12" rx="2" fill="rgba(148, 163, 184, 0.15)"/>
                  <text x="596" y="149" fill="var(--diag-soft)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">JAMSTACK BUILD</text>
                  <text x="652" y="170" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">update_preview.py</text>
                  <text x="652" y="188" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" text-anchor="middle">Shared Bundle • /{id}.json &amp; gw{gw}.json</text>
                </g>
                <g id="embed-node-edge-cdn">
                  <rect x="548" y="252" width="208" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="548" y="252" width="208" height="72" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke="var(--diag-link)" stroke-width="1.2"/>
                  <rect x="556" y="260" width="60" height="12" rx="2" fill="rgba(96, 165, 250, 0.15)"/>
                  <text x="586" y="269" fill="var(--diag-link)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">EDGE CDN</text>
                  <text x="652" y="290" fill="var(--diag-ink)" font-size="11.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Cloudflare DNS &amp; Edge CDN</text>
                  <text x="652" y="308" fill="var(--diag-muted)" font-size="7.6" font-family="var(--font-mono)" text-anchor="middle">fplsawadika.com • Multi-Tenant • Brotli</text>
                </g>
                <g id="embed-node-client-app">
                  <rect x="816" y="192" width="168" height="72" rx="6" fill="var(--diag-paper)"/>
                  <rect x="816" y="192" width="168" height="72" rx="6" fill="var(--diag-accent-tint)" stroke="var(--diag-accent)" stroke-width="1.5"/>
                  <rect x="824" y="200" width="64" height="12" rx="2" fill="var(--diag-accent)" opacity="0.18"/>
                  <text x="856" y="209" fill="var(--diag-accent)" font-size="7" font-family="var(--font-mono)" font-weight="600" text-anchor="middle" letter-spacing="0.08em">BROWSER SPA</text>
                  <text x="900" y="230" fill="var(--diag-ink)" font-size="12.5" font-weight="600" font-family="var(--font-sans)" text-anchor="middle">Vanilla Client App</text>
                  <text x="900" y="248" fill="var(--diag-muted)" font-size="7.5" font-family="var(--font-mono)" text-anchor="middle">Zero-Framework • 20s/90s Poll • SRI</text>
                </g>
              </svg>
            </div>
          </div>

          <!-- Tech Stack Architecture Diagram (Brand & Topology Guide) -->
          <div class="mt-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 sm:p-4 overflow-hidden tech-stack-diagram">
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                <span class="truncate">TECH STACK ARCHITECTURE (DIAGRAM)</span>
              </span>
              <a href="${this.getAssetPrefix()}docs/tech-stack-diagram.html" target="_blank" rel="noopener noreferrer" class="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 flex-shrink-0">
                <span>เปิดดูเต็มจอ ↗</span>
              </a>
            </div>
            <div class="w-full overflow-hidden rounded-lg border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/60 p-1 sm:p-2">
              <a href="${this.getAssetPrefix()}docs/tech-stack-diagram.html" target="_blank" rel="noopener noreferrer" class="block group relative cursor-zoom-in" title="คลิกเพื่อเปิดดูรูปขนาดเต็ม ↗">
                <!-- Light theme image -->
                <img src="${this.getAssetPrefix()}images/tech-stack-diagram.png?v=3" alt="FPLSaWaDiKa Tech Stack Diagram" class="w-full h-auto rounded block dark:hidden shadow-xs" loading="lazy">
                <!-- Dark theme image -->
                <img src="${this.getAssetPrefix()}images/tech-stack-diagram-dark.png?v=3" alt="FPLSaWaDiKa Tech Stack Diagram" class="w-full h-auto rounded hidden dark:block shadow-xs" loading="lazy">
                <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none shadow">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                  <span>คลิกเพื่อเปิดดูรูปขนาดเต็ม ↗</span>
                </div>
              </a>
            </div>
            <div class="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Python 3.11</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">GitHub Actions (1h/4h)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Cloudflare Workers + D1 &amp; KV</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Hybrid xP + FDR Engine</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">fplsawadika.com (Edge CDN)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Zero-Framework ES6+ (Shared Bundle)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">Tailwind CSS v4 (SRI)</span>
                <span class="px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[10px]">SheetJS (Lazy + SRI)</span>
              </div>
              <span class="hidden sm:inline text-[9.5px] text-slate-400 dark:text-slate-500 flex-shrink-0">stack-diagram • High-DPI Retina</span>
            </div>
          </div>
    
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 text-slate-600 dark:text-slate-300 w-full min-w-0">
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">STAGE 01 • INGESTION</span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Dual-Cadence &amp; Auto-Picks</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">1. Dual-Cadence Pipeline &amp; Auto-Picks</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Smart Dual-Cadence Orchestration:</strong> รันบน GitHub Actions (Ubuntu Latest / Python 3.11) แบบปัก SHA ความปลอดภัย พร้อม <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">58s</code> Stagger Offset — วันแข่ง ศุกร์–จันทร์ ซิงก์ทุก 1 ชม. และอังคาร–พฤหัส ทุก 4 ชม. ลดโหลดระบบลง ~83% พร้อมปุ่ม Manual Dispatch</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Dual-Scale &amp; Tier 2 Auto-Picks Live:</strong> ลีกมาตรฐาน (Tier 1) ซิงก์คู่ขนานด้วย <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">ThreadPoolExecutor</code> (5 workers + 0.12s Rate Pacer) พร้อมแคช GW สำเร็จรูป (&gt;95%) ขณะที่ Tier 2 (รองรับสูงสุด 3,000 ทีม / 8 workers) ซิงก์ Picks ครั้งเดียวหลังเดดไลน์ลง <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">data/leagues/{id}/gw{gw}.json</code> แสดงแต้มสด กัปตัน แต้มลบ ชิป และสำรองอัตโนมัติครบถ้วน</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Hybrid xP + FDR Transfer Advisor v2:</strong> โมเดลคาดการณ์แต้ม 1–3 GW ในตัว <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">sync_live_fpl.py</code> ผสาน <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">ep_next</code>, ฟอร์ม, <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">xGI/90</code>, นาทีลงสนาม และความยากโปรแกรม FDR ล่วงหน้า 3 นัด (เสริมสัญญาณ Azure xP แบบ Optional Blend)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">STAGE 02 • STATE MACHINE</span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Atomic &amp; Zero-Churn</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">2. Data Integrity &amp; Atomic State Machine</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">POSIX Atomic Replacement:</strong> บันทึก <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">multi_fpl_data.json</code>, ไฟล์แยกรายลีก และ Chunks ด้วย <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">tempfile</code> + <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">os.replace</code> ขจัดไฟล์เสียและข้ามการเขียนไฟล์ซ้ำถ้าข้อมูลไม่เปลี่ยน</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Pre-Commit Validation:</strong> ตรวจสอบความถูกต้องของแต้มสด, Auto-Sub, รองกัปตัน (VC x2), ชิปพิเศษ, แต้มลบย้ายตัว (Hits), สกุลเงินรางวัล (THB/USD) และ Tie-Pooling ก่อนบันทึกลงดิสก์</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Zero-Churn Smart Commit &amp; 6h Heartbeat:</strong> ตรวจ Semantic Diff ข้าม Commit เมื่อคะแนน/อันดับไม่เปลี่ยน (Zero Git Bloat) พร้อม Heartbeat Sync ทุก 6 ชม. และรองรับโหมดซิงก์รายลีก (<code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">--league &lt;id&gt;</code>)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">STAGE 03 • JAMSTACK</span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Shared Bundle &amp; Isolation</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">3. Config-Driven Jamstack &amp; Multi-Tenant</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Multi-Tenant Isolation &amp; Season Rollover:</strong> ขับเคลื่อนด้วย <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">config/leagues_config.json</code> แยกกลุ่มลีกสาธารณะกับลีกลูกค้าส่วนตัว (<code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">noindex</code> + Sitemap Filter) พร้อมเก็บกวาดโฟลเดอร์เก่าอัตโนมัติ</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Shared Bundle &amp; Decoupled Chunks:</strong> คอมไพล์เลอร์ <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">update_preview.py</code> แยก JS กลาง <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">assets/dashboard-app.js</code> ติด SHA-256 Hash Busting, สร้าง <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">/{id}/index.html</code>, <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">data/leagues/{id}.json</code> และ Tier 2 <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">gw{gw}.json</code> ลดขนาด Initial HTML ลงกว่า 85%</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Hybrid Edge CDN Routing:</strong> ให้บริการผ่าน <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">www.fplsawadika.com</code> (Cloudflare DNS CNAME Flattening + Fastly Edge CDN, HTTP/2, Brotli, TTFB &lt; 50ms) เชื่อมต่อกับ Edge API ที่ <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">api.fplsawadika.com</code></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0 flex flex-col justify-between ${I}">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border ${L}">
                          ${k}STAGE 04 • CLIENT &amp; EDGE
                        </span>
                        <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">15s Edge • 20s/90s Poll</span>
                      </div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-display mb-2.5">4. Adaptive Client Runtime &amp; Edge D1/KV</h4>
                      <ul class="space-y-2 text-xs sm:text-[12px] leading-relaxed">
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Adaptive Poll, Edge D1/KV &amp; Tier 2 Relay:</strong> เบราว์เซอร์ดึงคะแนนและโบนัส BPS สดทุก <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">20s</code> ช่วงกำลังเตะ (ผ่อนเป็น <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">90s</code> เมื่อพัก) ผ่าน Cloudflare Workers (Edge TTL 15s/120s/300s), ดึงผัง Tier 2 ผ่าน <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">/picks</code> &amp; <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">/standings</code> พร้อม First-Party Edge Analytics บน D1 &amp; KV</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Provisional Auto-Subs &amp; Race Guard:</strong> คำนวณตัวสำรองชั่วคราวสดระหว่างเกม, โหลด JSON รายลีกแบบ Lazy On-Demand พร้อมป้องกัน Race Condition และซิงก์สถานะด้วย History API + <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">localStorage</code></span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0"></span>
                          <span><strong class="font-semibold text-slate-900 dark:text-slate-100">Zero-Framework, SRI Security &amp; A11y:</strong> Vanilla ES6+ Shared Bundle ปักเวอร์ชัน + Subresource Integrity (<code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">sha384</code> บน Tailwind CSS v4.3.5 และ Lazy SheetJS), Edge Security Headers (CSP/HSTS), <code class="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80">tabular-nums</code> (CLS: 0.00) และ Page Visibility API</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          `}getTeamTierInfo(e){if(this._teamTierCache||(this._teamTierCache={}),this._teamTierCache[e])return this._teamTierCache[e];if(this._radarTeamList&&this._radarTeamList.length>0){const y=this._radarTeamList.find(D=>Number(D.entry_id)===Number(e));if(y){const D=Math.round(y.avg*10)/10,h=y.count!==void 0?y.count:Object.keys(y.scores_by_gw||{}).length;let $=y.tier_key;if(!$)if(h>=3){const I=D>=71&&y.low>=41&&y.high>=110,L=!I&&D>=64&&y.low>=32,k=!I&&!L&&(y.spread>=75&&y.low<35||y.high>=110&&y.low<32),x=!I&&!L&&!k&&D>=58;I?$="s":L?$="a":k?$="volatile":x?$="b":$="c"}else $="pending";const v={tierKey:$,count:h,avg:y.avg,displayAvg:D,high:y.high,low:y.low,spread:y.spread};return this._teamTierCache[e]=v,v}}const t=this.multiData&&this.multiData.leagues||{[this.currentLeagueId||"current"]:this.data},a=Number(this.multiData&&this.multiData.max_gw||this.selectedGW||1),r={};Object.values(t).forEach(y=>{if(!y)return;const D=y.gameweeks||{};for(let h=1;h<=a;h++){const $=D[String(h)];if(!$||!$.is_finished||!$.results)continue;const v=$.results.find(I=>Number(I.entry_id)===Number(e));v&&r[h]===void 0&&v.net_points!==void 0&&(r[h]=v.net_points)}}),Object.keys(r).length===0&&Object.values(t).forEach(y=>{if(!(!y||!y.squads))for(let D=1;D<=a;D++){const h=y.squads[`${e}_${D}`];h&&h.raw_hist&&h.raw_hist.current&&(h.raw_hist.current||[]).forEach($=>{const v=Number($.event);if(r[v]===void 0&&$.points!==void 0){const I=$.points-($.event_transfers_cost||0);r[v]=I}})}});const p=Object.values(r),i=p.length,d=p.reduce((y,D)=>y+D,0),n=i>0?d/i:0,c=Math.round(n*10)/10,m=i>0?Math.max(...p):0,s=i>0?Math.min(...p):0,o=m-s;let l="pending";if(i>=3){const y=c>=71&&s>=41&&m>=110,D=!y&&c>=64&&s>=32,h=!y&&!D&&(o>=75&&s<35||m>=110&&s<32),$=!y&&!D&&!h&&c>=58;y?l="s":D?l="a":h?l="volatile":$?l="b":l="c"}const g={tierKey:l,count:i,avg:n,displayAvg:c,high:m,low:s,spread:o};return this._teamTierCache[e]=g,g}getTeamTierBadge(e,t){const a=this.getTeamTierInfo(e);return a?a.tierKey==="s"?`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide font-display bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800/80 shadow-2xs flex-shrink-0 cursor-help" title="${t?`S-Tier: Elite top performers (Avg ≥ 71.0, Floor ≥ 41, High ≥ 110) • Avg: ${a.displayAvg} | Min: ${a.low} | Max: ${a.high}`:`S-Tier: หัวกะทิยอดเยี่ยมและนิ่งจริง (Avg ≥ 71.0, Floor ≥ 41, High ≥ 110) • เฉลี่ย: ${a.displayAvg} | ต่ำสุด: ${a.low} | สูงสุด: ${a.high}`}"><span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span><span>S-Tier</span></span>`:a.tierKey==="a"?`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide font-display bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/80 shadow-2xs flex-shrink-0 cursor-help" title="${t?`A-Tier: High standard performers (Avg ≥ 64.0, Floor ≥ 32) • Avg: ${a.displayAvg} | Min: ${a.low} | Max: ${a.high}`:`A-Tier: ฟอร์มดีมาตรฐานสูงสม่ำเสมอ (Avg ≥ 64.0, Floor ≥ 32) • เฉลี่ย: ${a.displayAvg} | ต่ำสุด: ${a.low} | สูงสุด: ${a.high}`}"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>A-Tier</span></span>`:a.tierKey==="volatile"?`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide font-display bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800/80 shadow-2xs flex-shrink-0 cursor-help" title="${t?`Volatile: Wild swings with deep floor drop or high score volatility • Avg: ${a.displayAvg} | Min: ${a.low} | Max: ${a.high} | Spread: ±${a.spread}`:`Volatile: แต้มสวิงสูง จุดต่ำสุดหลุดลึกหรือแกว่งรุนแรง • เฉลี่ย: ${a.displayAvg} | ต่ำสุด: ${a.low} | สูงสุด: ${a.high} | ส่วนต่าง: ±${a.spread}`}"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span>${t?"Volatile":"ฟอร์มเหวี่ยง"}</span></span>`:a.tierKey==="b"?`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide font-display bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/80 shadow-2xs flex-shrink-0 cursor-help" title="${t?`B-Tier: Steady mid baseline (Avg ≥ 58.0) • Avg: ${a.displayAvg} | Min: ${a.low} | Max: ${a.high}`:`B-Tier: ฟอร์มคงที่ระดับกลาง (Avg ≥ 58.0) • เฉลี่ย: ${a.displayAvg} | ต่ำสุด: ${a.low} | สูงสุด: ${a.high}`}"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>B-Tier</span></span>`:a.tierKey==="c"?`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide font-display bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-2xs flex-shrink-0 cursor-help" title="${t?`C-Tier: Developing baseline (Avg < 58.0) • Avg: ${a.displayAvg} | Min: ${a.low} | Max: ${a.high}`:`C-Tier: ระดับพัฒนาการ (Avg < 58.0) • เฉลี่ย: ${a.displayAvg} | ต่ำสุด: ${a.low} | สูงสุด: ${a.high}`}"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span><span>C-Tier</span></span>`:`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide font-display bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 shadow-2xs flex-shrink-0 cursor-help" title="${t?"Pending: Minimum 3 Gameweeks required for consistency rating":"กำลังเก็บข้อมูล: ต้องแข่งอย่างน้อย 3 Gameweeks เพื่อประเมินระดับความสม่ำเสมอ"}"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span><span>${t?"Pending":"รอประเมิน"}</span></span>`:""}async fetchTier2TeamSquad(e,t){try{const a=Number(e),r=Number(t);await this.ensurePlayersDict();const p=typeof resolveWorkerApiBase=="function"?resolveWorkerApiBase():{base:"https://api.fplsawadika.com",isOverride:!1};if(this._liveMapsByGw=this._liveMapsByGw||{},!this._liveMapsByGw[r]||Object.keys(this._liveMapsByGw[r]).length===0){const P=u=>({total_points:Number(u.total_points)||0,provisional_bonus:Number(u.provisional_bonus)||0,bps:Number(u.bps)||0,minutes:Number(u.minutes)||0,goals_scored:Number(u.goals_scored)||0,assists:Number(u.assists)||0,clean_sheets:Number(u.clean_sheets)||0,goals_conceded:Number(u.goals_conceded)||0,own_goals:Number(u.own_goals)||0,penalties_saved:Number(u.penalties_saved)||0,penalties_missed:Number(u.penalties_missed)||0,yellow_cards:Number(u.yellow_cards)||0,red_cards:Number(u.red_cards)||0,saves:Number(u.saves)||0,played:!!(u.played||Number(u.minutes)>0)});try{const u=await fetch(`${p.base}/live?event=${r}&slim=1`);if(u.ok){const N=await u.json();if(N&&Array.isArray(N.elements)){const w={};N.elements.forEach(b=>{b&&b.id&&b.stats&&(w[b.id]=P(b.stats))}),this._liveMapsByGw[r]=w}}}catch{}if(!this._liveMapsByGw[r]&&!p.isOverride)try{const u=await fetch(`https://fpl-live-relay.asawamanasak.workers.dev/live?event=${r}&slim=1`);if(u.ok){const N=await u.json();if(N&&Array.isArray(N.elements)){const w={};N.elements.forEach(b=>{b&&b.id&&b.stats&&(w[b.id]=P(b.stats))}),this._liveMapsByGw[r]=w}}}catch{}}let i=null;if(typeof window<"u"&&window.location&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"))try{const P=await fetch(`/picks?entry=${a}&gw=${r}`);if(P.ok){const u=await P.json();u&&Array.isArray(u.picks)&&(i=u)}}catch{}const n=async(P,u=6e3)=>{const N=typeof AbortController<"u"?new AbortController:null,w=N?setTimeout(()=>N.abort(),u):null;try{const b=await fetch(P,{signal:N?N.signal:void 0});return!b||!b.ok?null:await b.json()}catch{return null}finally{w&&clearTimeout(w)}};if(!i){const P=await n(`${p.base}/picks?entry=${a}&gw=${r}`);P&&Array.isArray(P.picks)&&(i=P)}if(!i&&!p.isOverride){const P=await n(`https://fpl-live-relay.asawamanasak.workers.dev/picks?entry=${a}&gw=${r}`);P&&Array.isArray(P.picks)&&(i=P)}if(!i||!Array.isArray(i.picks)||i.picks.length===0)return typeof window._reportClientError=="function"&&window._reportClientError("data_load"),!1;const c=i.picks,m=i.automatic_subs||[],s=c.filter(P=>(P.position||1)<=11).map(P=>({...P})),o=c.filter(P=>(P.position||1)>11).map(P=>({...P}));if(Array.isArray(m)&&m.length>0)for(const P of m){const u=P.element_in,N=P.element_out,w=s.findIndex(_=>_.element===N),b=o.findIndex(_=>_.element===u);if(w!==-1&&b!==-1){const _=s[w],S=o[b],E=S.multiplier!==void 0&&S.multiplier!==null&&Number(S.multiplier)>0?Number(S.multiplier):1;s[w]={...S,multiplier:E,is_captain:!!S.is_captain,is_vice_captain:!!S.is_vice_captain,is_sub:!0},o[b]={..._,multiplier:0,is_captain:!1,is_vice_captain:!1,is_sub_out:!0}}}const l=this._liveMapsByGw&&this._liveMapsByGw[r]||this._latestLiveMap||{},g=this.data&&this.data.gameweeks?this.data.gameweeks[String(r)]:null,y=g?!!g.is_finished:!1,D=g&&Array.isArray(g.unstarted_teams)?g.unstarted_teams:[],h=(P,u=!1)=>{const N=!!P.is_captain;let w=Number(P.multiplier!==void 0?P.multiplier:N?2:1);return(i.active_chip==="3xc"||i.active_chip==="triple_captain")&&N&&(w=3),this.buildSquadPlayerEntry(P.element,{elementType:P.element_type,isCaptain:N,isVice:!!P.is_vice_captain,multiplier:w,isBench:u,isSub:!!P.is_sub,isSubOut:!!P.is_sub_out,liveMap:l,isGwFinished:y,unstartedTeams:D})},$=s.map(P=>h(P,!1)),v=o.map(P=>h(P,!0)),I=i.entry_history||{},L=i.active_chip||null,k=String(L||"").trim().toLowerCase().replace(/_/g,""),x=k==="wildcard"||k==="freehit"?0:Number(I.event_transfers_cost||0),C=k==="bboost"||k==="benchboost",T=$.find(P=>P.is_captain)||v.find(P=>P.is_captain),H=T&&T.name?T.name:"-",z=`${a}_${r}`,U={starting:$,bench:v,auto_subs:Array.isArray(m)?m:[],chip:L,hits:x,raw_hist:I,summary_overall_rank:i.summary_overall_rank||null};this.data.squads||(this.data.squads={}),this.data.squads[z]=U;const Q=(this.data.gameweeks||{})[String(r)],W=Q&&Array.isArray(Q.results)?Q.results.find(P=>Number(P.entry_id)===a):null;if(W&&(H&&H!=="-"&&(W.captain=H),W.hits=x,W.chip=L,W._squadEnriched=!0,!y||Object.keys(l).length>0)){const P=$.reduce((w,b)=>w+(Number(b.points)||0),0),u=v.reduce((w,b)=>w+(Number(b.points)||0),0),N=C?P+u:P;N>0||Object.keys(l).length>0?(W.points=N,W.net_points=N-x,W.bench_points=C?0:u):W.points!==void 0&&(W.net_points=Number(W.points)-x)}if(this.multiData&&this.multiData.leagues)for(const P of Object.values(this.multiData.leagues))(P.teams||[]).some(u=>Number(u.entry_id)===a)&&(P.squads||(P.squads={}),P.squads[z]=U);return this.lastLiveJson&&Number(this.lastLiveGw)===r&&this.applyLiveElements(this.lastLiveJson,r),W&&(this.invalidateRenderCache(),this.renderAll()),!0}catch(a){return console.warn("[FPLSaWaDiKa] fetchTier2TeamSquad failed:",a),!1}}openTeamModal(e){const t=this.currentLang==="en",a=this.getDefaultShirtUrl(),r=Number(e);this.currentModalEntryId=r;try{typeof window._trackFeature=="function"&&window._trackFeature("pitch",r)}catch{}let p=null,i=(this.data.teams||[]).find(N=>Number(N.entry_id)===r);if(i)p=String(this.activeLeagueId);else if(this.multiData&&this.multiData.leagues)for(const[N,w]of Object.entries(this.multiData.leagues)){const b=(w.teams||[]).find(_=>Number(_.entry_id)===r);if(b){i=b,p=String(N);break}}i=i||{};const d=p&&this.multiData&&this.multiData.leagues?this.multiData.leagues[p]:this.data;let c=(((this.data.gameweeks||{})[String(this.selectedGW)]||{}).results||[]).find(N=>Number(N.entry_id)===r);if(!c&&d&&d.gameweeks&&(c=((d.gameweeks[String(this.selectedGW)]||{}).results||[]).find(w=>Number(w.entry_id)===r)),!c&&this.multiData&&this.multiData.leagues)for(const N of Object.values(this.multiData.leagues)){const b=(((N.gameweeks||{})[String(this.selectedGW)]||{}).results||[]).find(_=>Number(_.entry_id)===r);if(b){c=b;break}}c=c||{};const m=`${r}_${this.selectedGW}`;let s=(this.data.squads||{})[m];if(!s&&d&&d.squads&&(s=d.squads[m]),!s&&this.multiData&&this.multiData.leagues){for(const N of Object.values(this.multiData.leagues))if(N.squads&&N.squads[m]){s=N.squads[m];break}}const o=document.getElementById("team-modal-title");o&&(o.innerText=i.entry_name||c.team_name||"ชื่อทีม");const l=document.getElementById("team-modal-tier-badge");l&&(l.innerHTML=this.getTeamTierBadge(r,t));const g=document.getElementById("team-modal-overall-rank-badge");if(g){const N=Number(this.multiData&&this.multiData.max_gw||this.data&&this.data.current_gw||this.selectedGW||1),w=Number(this.selectedGW)>=N,b=!!(d&&d.tier===2||this.configs&&p&&this.configs[p]&&this.configs[p].tier===2||this.data&&this.data.tier===2&&!p);let _=null;if(b?w?_=s&&s.summary_overall_rank||c.fpl_overall_rank||i.fpl_overall_rank||s&&s.raw_hist&&s.raw_hist.overall_rank||null:_=c.fpl_overall_rank||s&&s.raw_hist&&s.raw_hist.overall_rank||null:w?_=i.overall_rank||s&&s.summary_overall_rank||c.fpl_overall_rank||c.overall_rank||s&&s.raw_hist&&s.raw_hist.overall_rank||null:_=c.fpl_overall_rank||c.overall_rank||s&&s.raw_hist&&s.raw_hist.overall_rank||null,!_&&this.multiData&&this.multiData.leagues){const S=String(this.selectedGW);for(const E of Object.values(this.multiData.leagues)){const A=E&&E.tier===2;if(w){const R=(E.teams||[]).find(G=>Number(G.entry_id)===r);if(R){const G=A?R.fpl_overall_rank:R.overall_rank;if(G){_=G;break}}}const F=(E.squads||{})[`${r}_${S}`];if(F&&w&&F.summary_overall_rank){_=F.summary_overall_rank;break}if(F&&F.raw_hist&&F.raw_hist.overall_rank){_=F.raw_hist.overall_rank;break}const j=(((E.gameweeks||{})[S]||{}).results||[]).find(R=>Number(R.entry_id)===r);if(j){const R=A?j.fpl_overall_rank:j.fpl_overall_rank||j.overall_rank;if(R){_=R;break}}}}_&&Number(_)>0?(g.className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs font-display flex-shrink-0",g.innerHTML=`<svg class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg><span class="text-[10px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-medium">${t?"Overall Rank":"อันดับโลก"}</span><span class="text-xs sm:text-sm font-bold text-indigo-800 dark:text-indigo-200 tabular-nums">#${Number(_).toLocaleString()}</span>`):(g.className="hidden",g.innerHTML="")}const y=document.getElementById("team-modal-badge-label");y&&(y.innerText=t?"Squad & Lineup":"ขุมกำลัง & การจัดทัพ");const D=document.getElementById("team-modal-bench-label");D&&(D.innerText=t?"Substitutes (Bench)":"ตัวสำรอง");const h=document.getElementById("team-modal-formation-label");h&&(h.innerText=t?"Formation:":"แผน:");const $=document.getElementById("team-modal-manager");$&&($.innerText=`${t?"Manager":"ผู้จัดการ"}: ${i.player_name||c.player_name||"-"}`);const v=document.getElementById("team-modal-pts-label");v&&(v.innerText=t?`GW ${this.selectedGW} Points:`:`คะแนน GW ${this.selectedGW}:`);const I=document.getElementById("team-modal-pts");let L=c.net_points;L==null&&s&&s.raw_hist&&s.raw_hist.points!==void 0&&(L=s.raw_hist.points),I&&(I.innerText=`${L!==void 0?L:0} pts`);const k=document.getElementById("team-modal-chip-badge"),x=c.chip||s&&s.chip;k&&(x?(k.className=`chip-badge badge-${String(x).toLowerCase()} font-display px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider`,k.innerText=String(x).toUpperCase()):(k.className="hidden",k.innerText=""));const C=document.getElementById("team-modal-actions");if(C)if(!this.isTier2League()&&String(p||this.activeLeagueId)===String(this.activeLeagueId)){const N=this.getMyTeamId(),w=N&&Number(N)===r,b=w?"bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500":"bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700",_=w?t?"My Team ✓":"ทีมฉัน ✓":t?"Pin My Team":"ปักหมุดทีมฉัน",S=`<button type="button" onclick="app.${w?"clearMyTeamId()":`setMyTeamId(${r})`}; app.openTeamModal(${r});" class="inline-flex items-center gap-1 px-2.5 py-1 min-h-[32px] rounded-xl text-[11px] font-bold border transition-colors cursor-pointer active:scale-95 ${b}">${_}</button>`;let E="";if(!w){const A=N||r,F=N?r:null;E=`<button type="button" onclick="app.openRivalModal(${A}, ${F!==null?F:"null"})" class="inline-flex items-center gap-1 px-2.5 py-1 min-h-[32px] rounded-xl text-[11px] font-bold bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors cursor-pointer active:scale-95 shadow-2xs">${t?"VS Compare":"เทียบ 1v1"}</button>`}C.innerHTML=S+E,C.classList.remove("hidden")}else C.innerHTML="",C.classList.add("hidden");const T=document.getElementById("pitch-line-gkp"),H=document.getElementById("pitch-line-def"),z=document.getElementById("pitch-line-mid"),U=document.getElementById("pitch-line-fwd"),Q=document.getElementById("team-bench-container"),W=document.getElementById("team-modal-bench-total"),P=document.getElementById("team-modal-formation");if(!s||!s.starting||s.starting.length===0){let N=p||String(this.activeLeagueId),w=this.multiData&&this.multiData.leagues?this.multiData.leagues[N]:this.data,b=!!(w&&w.squads&&Object.keys(w.squads).length>0);if(!b&&this.multiData&&this.multiData.leagues)for(const[q,j]of Object.entries(this.multiData.leagues)){const R=(j.teams||[]).some(K=>Number(K.entry_id)===r),G=!!(j.squads&&Object.keys(j.squads).length>0);if(R&&!G){N=String(q),w=j,b=!1;break}}const _=!!(w&&w.tier===2||this.configs&&this.configs[N]&&this.configs[N].tier===2),S=Number(this.selectedGW)||Number(this.multiData&&this.multiData.max_gw)||1,E=_?!0:this.hasTier1SquadsForGw(w,S);if((!b||!E)&&!_){P&&(P.innerText="..."),T&&(T.innerHTML=""),z&&(z.innerHTML=""),U&&(U.innerHTML=""),H&&(H.innerHTML=`<div class="text-center text-white/90 py-8 font-bold text-xs w-full animate-pulse"><div class="text-xl mb-1.5">⏳</div>${t?"Loading team lineup...":"กำลังโหลดข้อมูลผังผู้เล่น..."}</div>`),Q&&(Q.innerHTML=`<div class="text-center text-slate-400 py-4 col-span-2 text-xs animate-pulse">${t?"Loading bench...":"กำลังโหลดตัวสำรอง..."}</div>`),W&&(W.innerHTML="");const q=document.getElementById("team-modal");q&&(q.classList.contains("hidden")&&(this._lastFocusedElement=document.activeElement),q.classList.remove("hidden"),this.lockBodyScroll()),(b?this.ensureTier1GWSquads(S,N).then(()=>w):this.fetchLeagueData(N,2).then(async R=>(R&&!this.hasTier1SquadsForGw(R,S)&&await this.ensureTier1GWSquads(S,N),R))).then(R=>{this.currentModalEntryId===r&&(R&&R.squads&&this.hasTier1SquadsForGw(R,S)?this.openTeamModal(r):(P&&(P.innerText="-"),H&&(H.innerHTML=`<div class="text-center text-white/80 py-8 font-bold text-xs w-full">${t?"Unable to load lineup (Connection error)":"ไม่สามารถโหลดข้อมูลผังผู้เล่นได้ (ข้อผิดพลาดการเชื่อมต่อ)"}</div>`),Q&&(Q.innerHTML=`<div class="text-center text-slate-400 py-4 col-span-2 text-xs">${t?"No bench data available":"ไม่มีข้อมูลตัวสำรอง"}</div>`)))});return}if(_){const q=Number(this.multiData&&this.multiData.max_gw||this.data&&this.data.current_gw||this.config&&this.config.current_gw||10),j=Number(this.selectedGW)||q;P&&(P.innerText="...");const R=K=>`
              <div class="flex flex-col items-center justify-center p-0.5 text-center min-w-0 animate-pulse" style="width: ${100/Math.max(K,3)}%; max-width: ${K>=5?"80px":"76px"};">
                <div class="w-8 h-9 xs:w-9 xs:h-10 sm:w-11 sm:h-12 rounded-lg bg-white/20 mb-1"></div>
                <div class="h-2.5 xs:h-3 w-10 xs:w-12 bg-white/30 rounded mb-1"></div>
                <div class="h-2.5 xs:h-3 w-7 xs:w-8 bg-emerald-500/40 rounded"></div>
              </div>
            `;T&&(T.innerHTML=R(1)),H&&(H.innerHTML=[1,2,3,4].map(()=>R(4)).join("")),z&&(z.innerHTML=[1,2,3,4].map(()=>R(4)).join("")),U&&(U.innerHTML=[1,2].map(()=>R(2)).join("")),Q&&(Q.innerHTML=[1,2,3,4].map(()=>`
                <div class="bg-white/10 dark:bg-slate-800/60 border border-slate-200/20 dark:border-slate-700/40 rounded-xl p-2 sm:p-2.5 flex items-center justify-between animate-pulse">
                  <div class="flex items-center gap-2 sm:gap-2.5">
                    <div class="w-7 h-8 bg-slate-300/40 dark:bg-slate-700/60 rounded-md"></div>
                    <div class="h-3 w-16 bg-slate-300/40 dark:bg-slate-700/60 rounded"></div>
                  </div>
                  <div class="h-3 w-8 bg-slate-300/40 dark:bg-slate-700/60 rounded"></div>
                </div>
              `).join("")),W&&(W.innerHTML=`<span class="animate-pulse text-xs text-slate-400 font-display">${t?"⚡ Fetching lineup via Edge Relay...":"⚡ กำลังดึงข้อมูลผังนักเตะผ่าน Edge Relay..."}</span>`);const G=document.getElementById("team-modal");G&&(G.classList.contains("hidden")&&(this._lastFocusedElement=document.activeElement),G.classList.remove("hidden"),this.lockBodyScroll()),this.fetchTier2TeamSquad(r,j).then(K=>{this.currentModalEntryId===r&&(K?this.openTeamModal(r):(P&&(P.innerText="-"),T&&(T.innerHTML=""),H&&(H.innerHTML=`<div class="text-center text-white/90 py-8 font-bold text-xs w-full">${t?"Unable to load lineup (Team did not enter this GW or connection error)":"ไม่สามารถโหลดข้อมูลผังผู้เล่นได้ (ทีมอาจไม่ได้ส่งในสัปดาห์นี้หรือข้อผิดพลาดการเชื่อมต่อ)"}</div>`),z&&(z.innerHTML=""),U&&(U.innerHTML=""),Q&&(Q.innerHTML=`<div class="text-center text-slate-400 py-4 col-span-2 text-xs">${t?"No bench data available":"ไม่มีข้อมูลตัวสำรอง"}</div>`),W&&(W.innerHTML="")))});return}P&&(P.innerText="-"),T&&(T.innerHTML="");const A=s&&s.dnp?t?`This team joined after this gameweek (Did not enter in GW ${this.selectedGW})`:`ทีมนี้เข้าร่วมการแข่งขันหลังจากสัปดาห์นี้ (ไม่ได้ส่งทีมใน GW ${this.selectedGW})`:t?"No lineup data available for this gameweek":"ยังไม่มีข้อมูลแผนการจัดทัพในสัปดาห์นี้";H&&(H.innerHTML=`<div class="text-center text-white/80 py-8 font-bold text-xs w-full">${A}</div>`),z&&(z.innerHTML=""),U&&(U.innerHTML=""),Q&&(Q.innerHTML=`<div class="text-center text-slate-400 py-4 col-span-2 text-xs">${t?"No bench data available":"ไม่มีข้อมูลตัวสำรอง"}</div>`),W&&(W.innerHTML="");const F=document.getElementById("team-modal");F&&(F.classList.contains("hidden")&&(this._lastFocusedElement=document.activeElement),F.classList.remove("hidden"),this.lockBodyScroll());return}if(s&&s.starting){const N=s.starting.filter(R=>R.pos==="GKP"),w=s.starting.filter(R=>R.pos==="DEF"),b=s.starting.filter(R=>R.pos==="MID"),_=s.starting.filter(R=>R.pos==="FWD");P&&(P.innerText=`${w.length}-${b.length}-${_.length}`);const S=String(this.selectedGW),E=this.data.gameweeks?this.data.gameweeks[S]:null,A=E?!!E.is_finished:!1,F=E&&E.unstarted_teams?E.unstarted_teams:[],q=R=>A?!1:R.not_played_yet!==void 0&&R.not_played_yet!==null?!!R.not_played_yet:F.includes(R.team)||F.includes(R.team_code),j=(R,G)=>{const K=!!R.is_captain,B=!!R.is_vice,Y=this.getPlayerShirtUrl(R),X=q(R);return`
              <div class="flex flex-col items-center justify-center p-0.5 text-center min-w-0 transition-transform active:scale-95 group" style="width: ${100/Math.max(G,3)}%; max-width: ${G>=5?"80px":"76px"};">
                <div class="relative flex items-center justify-center mb-0.5">
                  <img 
                    src="${Y}" 
                    alt="${this.escapeHtml(R.team||"")}" 
                    width="44"
                    height="52"
                    decoding="async"
                    class="w-8 h-9 xs:w-9 xs:h-10 sm:w-11 sm:h-12 md:w-12 md:h-14 object-contain drop-shadow-md transition-transform group-hover:scale-105"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${a}';"
                  />
                  ${K?'<span class="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[7.5px] xs:text-[8px] sm:text-[9px] w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full flex items-center justify-center font-display shadow-md border border-amber-300 z-10">C</span>':""}
                  ${B?'<span class="absolute -top-1 -right-1 bg-slate-200 text-slate-950 font-black text-[7.5px] xs:text-[8px] sm:text-[9px] w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full flex items-center justify-center font-display shadow-md border border-slate-300 z-10">V</span>':""}
                </div>

                <div class="bg-slate-950/90 text-white font-bold text-[8px] xs:text-[9px] sm:text-[10px] px-0.5 xs:px-1 py-0.5 rounded shadow-sm w-full truncate text-center border border-white/10 leading-tight tracking-tight">
                  ${this.escapeHtml(R.name)}
                </div>

                ${X?`
                  <div class="bg-slate-900/80 text-slate-400 border border-slate-700/60 text-[7.5px] xs:text-[8px] sm:text-[9px] font-bold font-display px-1 py-0.5 rounded mt-0.5 shadow-xs whitespace-nowrap">
                    ${t?"Upcoming":"รอแข่ง"}
                  </div>
                `:`
                  <button 
                    type="button"
                    data-player-name="${this.escapeHtml(R.name)}"
                    data-player-points="${Number(R.points||0)}"
                    data-player-mult="${Number(R.multiplier||1)}"
                    data-player-cap="${R.is_captain?"1":"0"}"
                    data-player-bonus="${Number(R.provisional_bonus||0)}"
                    data-player-team="${this.escapeHtml(R.team||"")}"
                    onclick="app.handlePlayerStatsClick(event, this)"
                    class="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-black font-display px-1 sm:px-1.5 py-0.5 rounded mt-0.5 shadow-xs whitespace-nowrap cursor-pointer active:scale-95 transition-all"
                    title="${this.escapeHtml(t?`${R.name}: ${R.points} pts (Tap to view stats)`:`${R.name}: ${R.points} แต้ม (แตะเพื่อดูสถิติ)`)}"
                  >
                    ${R.points} pts
                  </button>
                `}
              </div>
            `};T&&(T.innerHTML=N.map(R=>j(R,N.length)).join("")),H&&(H.innerHTML=w.map(R=>j(R,w.length)).join("")),z&&(z.innerHTML=b.map(R=>j(R,b.length)).join("")),U&&(U.innerHTML=_.map(R=>j(R,_.length)).join(""))}if(s&&s.bench){let N=0,w="";const b=String(this.selectedGW),_=this.data.gameweeks?this.data.gameweeks[b]:null,S=_?!!_.is_finished:!1,E=_&&_.unstarted_teams?_.unstarted_teams:[],A=F=>S?!1:F.not_played_yet!==void 0&&F.not_played_yet!==null?!!F.not_played_yet:E.includes(F.team)||E.includes(F.team_code);if(s.bench.forEach((F,q)=>{const j=A(F);j||(N+=F.points||0);const R=this.getPlayerShirtUrl(F),G=F.pos==="GKP"?"GK":t?`Sub ${q}`:`สำรอง ${q}`;w+=`
              <div class="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2 sm:p-2.5 flex items-center justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div class="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
                  <img 
                    src="${R}" 
                    alt="${this.escapeHtml(F.team||"")}" 
                    width="32"
                    height="36"
                    decoding="async"
                    class="w-7 h-8 sm:w-8 sm:h-9 object-contain drop-shadow-xs flex-shrink-0"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${a}';"
                  />
                  <span class="text-[9.5px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md font-display flex-shrink-0">${F.pos}</span>
                  <span class="text-[9.5px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50 font-display flex-shrink-0">${G}</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">${this.escapeHtml(F.name)}</span>
                  ${F.is_captain?'<span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 px-1.5 py-0.5 rounded font-display flex-shrink-0">C</span>':""}
                  ${F.is_vice?'<span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-1.5 py-0.5 rounded font-display flex-shrink-0">V</span>':""}
                </div>
                ${j?'<span class="text-xs text-slate-400 font-bold font-display flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-lg">-</span>':`<span class="text-xs sm:text-xs font-black text-slate-700 dark:text-slate-300 font-display flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-lg">${F.points} pts</span>`}
              </div>
            `}),Q&&(Q.innerHTML=w),W){const F=["bboost","bench_boost"].includes((c.chip||"").toLowerCase()),q=c&&c.bench_points!==void 0&&c.bench_points!==null?c.bench_points:N;W.innerHTML=F?`<span class="text-emerald-600 dark:text-emerald-400 font-bold">${t?`Total ${q} pts (⚡ Bench Boost Active)`:`รวม ${q} pts (⚡ Bench Boost นับแต้ม)`}</span>`:`${t?"Total":"รวม"} ${q} pts`}}const u=document.getElementById("team-modal");if(u){u.classList.contains("hidden")&&(this._lastFocusedElement=document.activeElement),u.classList.remove("hidden"),this.lockBodyScroll();const N=document.getElementById("team-modal-body");N&&(N.scrollTop=0),u.focus({preventScroll:!0}),this._teamModalEscBound||(this._teamModalEscBound=w=>{w.key==="Escape"&&this.closeTeamModal()},window.addEventListener("keydown",this._teamModalEscBound))}}closeTeamModal(){const e=this.currentModalEntryId;this.currentModalEntryId=null,this._teamModalEscBound&&(window.removeEventListener("keydown",this._teamModalEscBound),this._teamModalEscBound=null);const t=document.getElementById("team-modal");t&&!t.classList.contains("hidden")&&(t.classList.add("hidden"),this.unlockBodyScroll(e),this._lastFocusedElement&&this._lastFocusedElement!==document.body&&typeof this._lastFocusedElement.focus=="function"&&this._lastFocusedElement.focus({preventScroll:!0}),this._lastFocusedElement=null)}isTier2League(e=this.activeLeagueId){const t=String(e||this.activeLeagueId||""),a=this.multiData&&this.multiData.leagues&&this.multiData.leagues[t]||(t===String(this.activeLeagueId)?this.data:null),r=this.configs&&this.configs[t]||(t===String(this.activeLeagueId)?this.config:null);return!!(a&&a.tier===2||r&&r.tier===2)}getMyTeamId(e){if(this.isTier2League())return"";try{if(typeof localStorage>"u"||!this.activeLeagueId)return"";const t=localStorage.getItem("fpl_advisor_team_"+this.activeLeagueId)||"";return t&&(Array.isArray(e)?e:this.data&&this.data.teams||[]).some(p=>String(p.entry_id)===String(t))?String(t):""}catch{return""}}setMyTeamId(e,t=!1){if(this.isTier2League())return;const a=e?String(e):"";this.compTransferTeam=a;try{typeof localStorage<"u"&&this.activeLeagueId&&(a?localStorage.setItem("fpl_advisor_team_"+this.activeLeagueId,a):localStorage.removeItem("fpl_advisor_team_"+this.activeLeagueId))}catch{}const r=document.getElementById("comp-transfers-team-select");if(r&&(r.value=a),this.invalidateRenderCache(),this.activeTab==="gameweek-view"&&this.renderGameweekView(),!t&&a&&typeof this.showToast=="function"){const p=this.currentLang==="en",i=(this.data&&this.data.teams||[]).find(n=>String(n.entry_id)===a),d=i?i.entry_name:"";this.showToast(p?`Pinned "${d}" as My Team`:`ปักหมุด "${d}" เป็นทีมของคุณแล้ว`,"success",2e3)}}clearMyTeamId(){this.setMyTeamId("",!0)}getLiveNoteCacheKey(e=this.selectedGW,t=!1,a=!1){return`${this.activeLeagueId}_${e}_${this.currentLang}_${!!t}_${!!a}`}computeGameweekOverallStandings(e=this.selectedGW){const t=Number(this.multiData&&this.multiData.max_gw||2),a=Math.min(Number(e)||t,t),r=this.isTier2League(),p=String(a),i=this.data&&this.data.gameweeks?this.data.gameweeks[p]:null,d={};let n=null;if(r){const m={};i&&Array.isArray(i.results)&&i.results.forEach(s=>{m[s.entry_id]=s}),(this.data&&this.data.teams||[]).forEach(s=>{const o=m[s.entry_id],l=o?Number(o.net_points)||0:Number(s.event_total)||0,g=o?Number(o.points)||0:Number(s.event_total)||0,y=o&&Number(o.hits)||0,D=o&&o.total_hits!==void 0?Number(o.total_hits):Number(s.total_hits)||0,h=s.rank!==void 0&&s.rank!==null?Number(s.rank):999,$=s.last_rank!==void 0&&s.last_rank!==null&&Number(s.last_rank)>0?Number(s.last_rank):null,v=a>=t,I=v||!o||o.total_points===void 0?Number(s.total_points)||0:Number(o.total_points)||0,L=v||!o||o.overall_rank===void 0?h:Number(o.overall_rank)||h,k=v||!o||o.last_rank===void 0?$:Number(o.last_rank)||null;d[s.entry_id]={entry_id:s.entry_id,team_name:s.entry_name,player_name:s.player_name,fpl_rank:L,overall_rank:L,prev_rank:k,total_points:I,total_hits:D,last_gw_pts:l,last_gw_raw:g,last_gw_hits:y}})}else{(this.data&&this.data.teams||[]).forEach($=>{d[$.entry_id]={entry_id:$.entry_id,team_name:$.entry_name,player_name:$.player_name,fpl_rank:$.rank||999,total_points:0,total_hits:0,last_gw_pts:0,last_gw_raw:0,last_gw_hits:0}});for(let $=1;$<=a;$++){const v=this.data&&this.data.gameweeks?this.data.gameweeks[String($)]:null;if(v&&v.results){if(v.is_started!==void 0?!!v.is_started:!!v.is_finished||v.results.some(L=>L.points>0)){const L=new Set;v.results.forEach(k=>{L.has(k.entry_id)||(L.add(k.entry_id),!this.isDepartedNonPrize(k.entry_id)&&(d[k.entry_id]||(d[k.entry_id]={entry_id:k.entry_id,team_name:k.team_name,player_name:k.player_name,fpl_rank:999,total_points:0,total_hits:0,last_gw_pts:0,last_gw_raw:0,last_gw_hits:0}),d[k.entry_id].total_points+=Number(k.net_points)||0,d[k.entry_id].total_hits=(d[k.entry_id].total_hits||0)+(Number(k.hits)||0)))})}$===a&&v.results.forEach(L=>{d[L.entry_id]&&(d[L.entry_id].last_gw_pts=Number(L.net_points)||0,d[L.entry_id].last_gw_raw=Number(L.points)||0,d[L.entry_id].last_gw_hits=Number(L.hits)||0)})}}let m=null;if(a>1){const $={};(this.data&&this.data.teams||[]).forEach(x=>{$[x.entry_id]={entry_id:x.entry_id,team_name:x.entry_name,fpl_rank:x.rank||999,total_points:0}});for(let x=1;x<a;x++){const C=this.data&&this.data.gameweeks?this.data.gameweeks[String(x)]:null;if(C&&C.results&&(C.is_started!==void 0?!!C.is_started:!!C.is_finished||C.results.some(H=>H.points>0))){const H=new Set;C.results.forEach(z=>{H.has(z.entry_id)||(H.add(z.entry_id),!this.isDepartedNonPrize(z.entry_id)&&($[z.entry_id]||($[z.entry_id]={entry_id:z.entry_id,team_name:z.team_name,fpl_rank:999,total_points:0}),$[z.entry_id].total_points+=Number(z.net_points)||0))})}}const v=Object.values($).sort((x,C)=>{const T=this.isTeamDeparted(x.entry_id)?1:0,H=this.isTeamDeparted(C.entry_id)?1:0;return T!==H?T-H:C.total_points-x.total_points||(x.fpl_rank||999)-(C.fpl_rank||999)});let I=1,L=0,k=null;v.forEach(x=>{if(!this.isActivePrizeEligible(x.entry_id)){x.prev_rank=null;return}L++,k!==null&&x.total_points<k&&(I=L),k=x.total_points,x.prev_rank=I,d[x.entry_id]&&(d[x.entry_id].prev_rank=I)}),m=v.find(x=>x.prev_rank===1)||v[0]||null}const s=Object.values(d).sort(($,v)=>{const I=this.isTeamDeparted($.entry_id)?1:0,L=this.isTeamDeparted(v.entry_id)?1:0;return I!==L?I-L:v.total_points-$.total_points||($.fpl_rank||999)-(v.fpl_rank||999)});let o=1,l=0,g=null;s.forEach($=>{if(!this.isActivePrizeEligible($.entry_id)){$.overall_rank=null;return}l++,g!==null&&$.total_points<g&&(o=l),g=$.total_points,$.overall_rank=o});const y=s.filter($=>$.overall_rank!==null),D=y[0]||s[0]||null,h=y[1]||s[1]||null;return D&&(n={leaderChanged:!!(m&&Number(m.entry_id)!==Number(D.entry_id)),prevLeaderName:m?m.team_name:"",currLeaderName:D.team_name,currLeaderPts:D.total_points,runnerName:h?h.team_name:"",runnerPts:h?h.total_points:0,gap:h?D.total_points-h.total_points:0}),{overallSorted:s,overallContext:n,targetGW:a}}return{overallSorted:Object.values(d).sort((m,s)=>(m.overall_rank||999)-(s.overall_rank||999)||s.total_points-m.total_points),overallContext:n,targetGW:a}}regenerateLiveNote(){const e=this.selectedGW,t=this.data.gameweeks?this.data.gameweeks[String(e)]:null,a=this.config&&this.config.non_prize_teams||[],r=this.config&&this.config.features&&this.config.features.prize_model==="weekly",p=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),i=this.currentLang==="en",d=t?!!t.is_finished:!1,c=!!(t&&Array.isArray(t.results)&&t.results.length>0)?t.is_started!==void 0?!!t.is_started:d||t.results.some(g=>g.points>0):!!(t&&t.is_started),{overallContext:m}=this.computeGameweekOverallStandings(e),s=LiveCommentaryEngine.generateNoteObject(e,t,this.data.name,!0,a,this.data,r,p,i,{overallContext:m}),o=this.getLiveNoteCacheKey(e,d,c);this.liveNotesCache[o]=s;const l=document.getElementById("current-gw-note-text");l&&(l.innerHTML=s.text)}computeLeagueDramaEvents(e,t,a,r,p){if(!e||!Array.isArray(t)||t.length===0)return[];const i=this.currentLang==="en",d=r&&!p,n=this.data&&this.data.squads?this.data.squads:{},c=[];if(!r){const h={},$=[],v=[];t.forEach(k=>{const x=(k.captain||"-").replace(/\s*\(C\)/gi,"").trim();x&&x!=="-"&&(h[x]||(h[x]=[]),h[x].push({entry_id:k.entry_id,team_name:k.team_name,player_name:k.player_name,meta:`(C) ${x}`})),k.chip&&k.chip!=="-"&&$.push({entry_id:k.entry_id,team_name:k.team_name,player_name:k.player_name,meta:String(k.chip).toUpperCase()}),(k.hits||0)>0&&v.push({entry_id:k.entry_id,team_name:k.team_name,player_name:k.player_name,meta:`-${k.hits} pts`})});const I=Object.entries(h).sort((k,x)=>x[1].length-k[1].length);if(I[0]){const[k,x]=I[0];c.push({id:"pre_pop_cap",tone:"emerald",badge:i?"POPULAR (C)":"กัปตันมหาชน",headline:i?`${k} (${x.length} teams)`:`${k} (${x.length} ทีมเลือก)`,detail:i?`${Math.round(x.length/t.length*100)}% of the league handed the armband to ${k}.`:`คิดเป็น ${Math.round(x.length/t.length*100)}% ของลีกที่ฝากความหวังไว้กับ ${k}`,teams:x})}const L=I.filter(([,k])=>k.length<=2);if(L.length>0){const k=L.slice(0,4).flatMap(([,x])=>x);c.push({id:"pre_diff_cap",tone:"amber",badge:i?"DIFFERENTIAL (C)":"กัปตันสายวัดใจ",headline:i?`${L.length} unique armbands`:`กัปตันแหวกแนว ${L.length} ตัว`,detail:i?"Bold differential captain picks ready to swing the table.":"ทีมที่กล้าเลือกกัปตันสวนกระแสเพื่อฉีกหนีคู่แข่ง",teams:k})}return $.length>0&&c.push({id:"pre_chips",tone:"amber",badge:i?"CHIPS ACTIVE":"เปิดชิปประจำวีค",headline:i?`${$.length} chips deployed`:`เปิดการ์ดพิเศษ ${$.length} ทีม`,detail:i?"Active chips locked in ahead of kickoff.":"รายชื่อทีมที่งัดการ์ดพิเศษออกมาใช้ในสัปดาห์นี้",teams:$}),v.length>0&&c.push({id:"pre_hits",tone:"rose",badge:i?"HITS TAKEN":"ยอมแลกแต้มลบ",headline:i?`${v.length} managers took hits`:`ผ่าตัดทีมติดลบ ${v.length} ทีม`,detail:i?"Managers sacrificing points for early squad surgery.":"ทีมที่ยอมหักแต้มลบเพื่อดึงนักเตะใหม่เข้าทัพ",teams:v}),c.slice(0,6)}const m={},s=[],o={},l=[];t.forEach(h=>{const $=n[`${h.entry_id}_${this.selectedGW}`];if(!(!$||!Array.isArray($.starting))){if(Array.isArray($.auto_subs)&&$.auto_subs.length>0){const v=new Set($.auto_subs.map(k=>Number(k.element_in))),I=$.starting.filter(k=>v.has(Number(k.id))),L=I.reduce((k,x)=>k+(Number(x.points)||0),0);L>=4&&I[0]&&l.push({entry_id:h.entry_id,team_name:h.team_name,player_name:h.player_name,meta:`${I[0].name} (+${L} pts)`,gain:L})}$.starting.forEach(v=>{const I=Number(v.id),L=Number(v.raw_points!==void 0?v.raw_points:v.is_captain?Math.floor((Number(v.points)||0)/(Number(v.multiplier)||2)):Number(v.points)||0),k=Number(v.goals_scored)||0,x=Number(v.assists)||0,C=Number(v.provisional_bonus)||0,T=Number(v.red_cards)||0,H=Number(v.penalties_missed)||0,z=Number(v.own_goals)||0;m[I]||(m[I]={id:I,name:v.name,team:v.team,raw:L,goals:k,assists:x,owners:[],captainsCount:0}),m[I].owners.push({entry_id:h.entry_id,team_name:h.team_name,player_name:h.player_name,meta:`${v.points} pts${v.is_captain?" (C)":""}`}),v.is_captain&&(m[I].captainsCount+=1),d&&C>=3&&(o[I]||(o[I]={id:I,name:v.name,bonus:C,owners:[]}),o[I].owners.push({entry_id:h.entry_id,team_name:h.team_name,player_name:h.player_name,meta:`+${C} BPS${v.is_captain?" (C)":""}`})),(T>0||H>0||z>0||L<0)&&s.push({player:v.name,reason:T>0?i?"Red Card":"ใบแดง":H>0?i?"Pen Missed":"พลาดจุดโทษ":z>0?i?"Own Goal":"ทำเข้าประตูตัวเอง":i?"Minus Pts":"แต้มติดลบ",entry_id:h.entry_id,team_name:h.team_name,player_name:h.player_name,meta:`${v.points} pts${v.is_captain?" (C)":""}`})})}});const g=Object.values(m).filter(h=>h.raw>=8).sort((h,$)=>$.raw-h.raw||$.owners.length-h.owners.length);if(g[0]){const h=g[0],$=h.goals>0||h.assists>0?` (${h.goals}G ${h.assists}A)`:"",v=t.length-h.owners.length;c.push({id:`star_${h.id}`,tone:"emerald",badge:d?i?"LIVE BOOM":"ระเบิดฟอร์มสด":i?"GW MVP":"ตัวท็อปประจำวีค",headline:`${h.name} · ${h.raw} pts${$}`,detail:i?`${h.owners.length} teams celebrate (${h.captainsCount} C) · ${v} teams sweating without him.`:`${h.owners.length} ทีมเฮ (${h.captainsCount} กัปตัน) · ${v} ทีมนั่งลุ้นตัวโก่งเพราะไม่มี`,teams:h.owners})}if(s.length>0){const h=s.slice(0,8),$=h[0];c.push({id:"disaster_card",tone:"rose",badge:i?"DISASTER ALERT":"ช็อตฝันร้าย",headline:`${$.player} (${$.reason})`,detail:i?`${h.length} squad spot(s) hit by negative points or card penalties.`:`กระทบ ${h.length} ทีมที่ส่งลงสนาม`,teams:h})}if(d){const h=Object.values(o).sort(($,v)=>v.owners.length-$.owners.length);if(h[0]){const $=h[0];c.push({id:`prov_bps_${$.id}`,tone:"emerald",badge:i?"BPS +3 WATCH":"ลุ้นโบนัส +3",headline:`${$.name} (+3 BPS)`,detail:i?`Currently on maximum provisional bonus for ${$.owners.length} teams.`:`จ่อรับโบนัสเต็ม +3 แต้มสด ส่งผลต่อ ${$.owners.length} ทีมในลีก`,teams:$.owners})}}l.length>0&&(l.sort((h,$)=>$.gain-h.gain),c.push({id:"autosub_rescue",tone:"amber",badge:d?i?"LIVE AUTO-SUB":"ออโต้ซับช่วยชีวิต":i?"AUTO-SUB GAIN":"สำรองลงมาแบก",headline:i?`${l.length} bench rescues`:`สำรองขยับช่วย ${l.length} ทีม`,detail:i?`Top boost: ${l[0].team_name} via ${l[0].meta}.`:`คุ้มสุดคือ ${l[0].team_name} ได้ ${l[0].meta}`,teams:l}));const y=[...t].filter(h=>(h.bench_points||0)>=10&&!["bboost","bench_boost"].includes(String(h.chip||"").toLowerCase())).sort((h,$)=>($.bench_points||0)-(h.bench_points||0));y.length>0&&c.push({id:"bench_tragedy",tone:"rose",badge:i?"BENCH PAIN":"ดองแต้มสำรอง",headline:i?`${y[0].bench_points} pts stranded`:`ดองไว้ข้างสนาม ${y[0].bench_points} pts`,detail:i?`${y[0].team_name} left big points sitting on the bench.`:`${y[0].team_name} และอีก ${Math.max(0,y.length-1)} ทีมเสียแต้มบนม้านั่ง`,teams:y.slice(0,5).map(h=>({entry_id:h.entry_id,team_name:h.team_name,player_name:h.player_name,meta:`${h.bench_points} bench pts`}))});const D=[...t].filter(h=>(h.transfers_net_impact||0)>=6).sort((h,$)=>($.transfers_net_impact||0)-(h.transfers_net_impact||0));if(D.length>0)c.push({id:"tx_swing",tone:"emerald",badge:i?"SMART TRANSFER":"ย้ายตัวเข้าเป้า",headline:`${D[0].team_name} (+${D[0].transfers_net_impact} net)`,detail:i?"Best net transfer impact across the league this gameweek.":"กำไรส่วนต่างย้ายตัวสูงสุดประจำสัปดาห์นี้",teams:D.slice(0,4).map(h=>({entry_id:h.entry_id,team_name:h.team_name,player_name:h.player_name,meta:`+${h.transfers_net_impact} net`}))});else if(t.length>=2){const h=Number(t[0].net_points||0)-Number(t[1].net_points||0);c.push({id:"top_duel",tone:"amber",badge:d?i?"TITLE SWEAT":"ลุ้นแชมป์วีค":i?"GW PODIUM":"ท็อปประจำวีค",headline:h===0?i?`Tied on ${t[0].net_points} pts`:`นำร่วม ${t[0].net_points} แต้ม`:i?`${h} pts separates #1 & #2`:`อันดับ 1-2 ห่าง ${h} แต้ม`,detail:`${t[0].team_name} vs ${t[1].team_name}`,teams:t.slice(0,3).map($=>({entry_id:$.entry_id,team_name:$.team_name,player_name:$.player_name,meta:`${$.net_points} pts`}))})}return c.slice(0,6)}renderLiveDramaStrip(e,t,a,r,p){const i=document.getElementById("live-drama-strip-container");if(!i)return;if(this.isTier2League()||!e||!Array.isArray(t)||t.length===0){i.innerHTML="",i.classList.add("hidden");return}const d=this.computeLeagueDramaEvents(e,t,a,r,p);if(this._latestDramaEvents=d,!d||d.length===0){i.innerHTML="",i.classList.add("hidden");return}const n=this.currentLang==="en",c=r&&!p,m=r?c?n?"Live Matchday Drama Feed":"ดราม่าสดกระทบอันดับลีก":n?"Gameweek Key Moments":"ช็อตเด็ดประจำสัปดาห์":n?"Pre-Kickoff Watchlist":"โฟกัสก่อนคิกออฟ";this._openDramaEventId&&!d.some(y=>y.id===this._openDramaEventId)&&(this._openDramaEventId=null);const s={emerald:{dot:"bg-emerald-500",badge:"bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/70"},rose:{dot:"bg-rose-500",badge:"bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/70"},amber:{dot:"bg-amber-500",badge:"bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/70"}},o=this._openDramaEventId?d.find(y=>y.id===this._openDramaEventId):null,l=!!this._dramaStripExpandedMobile,g=n?`${d.length} ${d.length===1?"moment":"moments"}`:`${d.length} ช็อตเด็ด`;i.classList.remove("hidden"),i.innerHTML=`
          <div class="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-slate-50/85 dark:bg-slate-900/60 overflow-hidden min-w-0 max-w-full">
            <button
              type="button"
              id="live-drama-toggle-btn"
              onclick="app.toggleLiveDramaStripMobile()"
              aria-expanded="${l?"true":"false"}"
              aria-controls="live-drama-body"
              class="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 sm:px-4 min-h-[44px] text-left cursor-pointer xl:cursor-default xl:pointer-events-none hover:bg-slate-100/70 dark:hover:bg-slate-800/40 xl:hover:bg-transparent xl:dark:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
            >
              <div class="flex items-center gap-2 min-w-0">
                ${c?'<span class="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse flex-shrink-0"></span>':""}
                <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display truncate">${m}</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 font-display flex-shrink-0 tabular-nums">${g}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display tabular-nums">GW ${this.selectedGW}</span>
                <svg class="w-4 h-4 text-slate-400 dark:text-slate-500 xl:hidden transition-transform duration-200 ${l?"rotate-180":""}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </button>

            <div id="live-drama-body" class="${l?"block":"hidden xl:block"} border-t border-slate-200/75 dark:border-slate-800/80 px-3 py-2.5 sm:px-4 sm:py-3">
              <div class="flex gap-2.5 overflow-x-auto touch-scroll scrollbar-thin pb-1 snap-x md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible">
                ${d.map(y=>{const D=s[y.tone]||s.amber,h=this._openDramaEventId===y.id,$=y.teams&&y.teams.length>0?n?`${y.teams.length} ${y.teams.length===1?"team":"teams"}`:`${y.teams.length} ทีม`:"";return`
                    <button type="button" onclick="app.toggleDramaEventDetail('${this.escapeHtml(y.id)}')" aria-expanded="${h?"true":"false"}" class="w-[245px] xs:w-[265px] md:w-auto flex-shrink-0 snap-start text-left p-3 rounded-xl border transition-colors cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${h?"bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-500 ring-1 ring-slate-300 dark:ring-slate-600":"bg-white/95 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}">
                      <div class="flex items-center justify-between gap-1.5 mb-1">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${D.badge} font-display">
                          <span class="w-1.5 h-1.5 rounded-full ${D.dot}"></span>
                          <span>${this.escapeHtml(y.badge)}</span>
                        </span>
                        ${$?`<span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-display">${$} ${h?"▲":"▼"}</span>`:""}
                      </div>
                      <div class="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white font-display truncate">${this.escapeHtml(y.headline)}</div>
                      <div class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-snug">${this.escapeHtml(y.detail)}</div>
                    </button>
                  `}).join("")}
              </div>

              ${o?`
                <div id="live-drama-detail-panel" class="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-display">${n?"Affected League Teams":"รายชื่อทีมที่ได้รับผลกระทบ"}: ${this.escapeHtml(o.headline)}</span>
                    <button type="button" onclick="app.toggleDramaEventDetail('${this.escapeHtml(o.id)}')" class="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded-lg cursor-pointer">${n?"Close ✕":"ปิด ✕"}</button>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${(o.teams||[]).map(y=>`
                      <button type="button" onclick="app.openTeamModal(${Number(y.entry_id)})" class="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-xl text-[11px] font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer">
                        <span class="font-bold truncate max-w-[140px]">${this.escapeHtml(y.team_name)}</span>
                        <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400">${this.escapeHtml(y.meta||"")}</span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              `:""}
            </div>
          </div>
        `}toggleLiveDramaStripMobile(){this._dramaStripExpandedMobile=!this._dramaStripExpandedMobile,this.renderGameweekView()}toggleDramaEventDetail(e){this._openDramaEventId=this._openDramaEventId===e?null:e,this.renderGameweekView()}async openRivalModal(e=null,t=null){if(this.isTier2League())return;const a=this.data&&this.data.teams||[];if(a.length<2)return;const r=document.getElementById("team-modal");r&&!r.classList.contains("hidden")&&this.closeTeamModal();const{overallSorted:p}=this.computeGameweekOverallStandings(this.selectedGW),i=p.filter(s=>!this.isTeamDeparted(s.entry_id)),d=this.getMyTeamId(a);let n=Number(e||d||i[0]&&i[0].entry_id||a[0].entry_id),c=t!=null?Number(t):null;if(!c||c===n){const s=i.findIndex(o=>Number(o.entry_id)===n);if(s>0)c=Number(i[s-1].entry_id);else if(i.length>1)c=Number(i[1].entry_id);else{const o=a.find(l=>Number(l.entry_id)!==n);c=o?Number(o.entry_id):n}}this._rivalState={isOpen:!0,teamAId:n,teamBId:c};const m=document.getElementById("rival-modal");if(m&&(m.classList.contains("hidden")&&(this._rivalLastFocus=document.activeElement),m.classList.remove("hidden"),this.lockBodyScroll(),m.focus({preventScroll:!0}),this._rivalModalEscBound||(this._rivalModalEscBound=s=>{s.key==="Escape"&&this.closeRivalModal()},window.addEventListener("keydown",this._rivalModalEscBound))),!this.hasTier1SquadsForGw(this.data,this.selectedGW)){const s=document.getElementById("rival-modal-body"),o=this.currentLang==="en";s&&(s.innerHTML=`<div class="py-10 text-center text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse">${o?`Loading GW ${this.selectedGW} squads...`:`กำลังโหลดขุมกำลัง GW ${this.selectedGW}...`}</div>`),await this.ensureTier1GWSquads(this.selectedGW,this.activeLeagueId)}this._rivalState&&this._rivalState.isOpen&&this.renderRivalModal()}setRivalQuickPreset(e){if(!this._rivalState)return;const{overallSorted:t}=this.computeGameweekOverallStandings(this.selectedGW),a=t.filter(d=>!this.isTeamDeparted(d.entry_id)),r=Number(this._rivalState.teamAId),p=a.findIndex(d=>Number(d.entry_id)===r);let i=null;e==="leader"?i=a.find(d=>Number(d.entry_id)!==r)||a[0]:e==="ahead"?i=p>0?a[p-1]:a[1]||null:e==="behind"&&(i=p>=0&&p+1<a.length?a[p+1]:a[p-1]||null),i&&Number(i.entry_id)!==r&&(this._rivalState.teamBId=Number(i.entry_id),this.renderRivalModal())}swapRivalTeams(){if(!this._rivalState)return;const e=this._rivalState.teamAId;this._rivalState.teamAId=this._rivalState.teamBId,this._rivalState.teamBId=e,this.renderRivalModal()}closeRivalModal(){this._rivalState&&(this._rivalState.isOpen=!1),this._rivalModalEscBound&&(window.removeEventListener("keydown",this._rivalModalEscBound),this._rivalModalEscBound=null);const e=document.getElementById("rival-modal");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),this.unlockBodyScroll(),this._rivalLastFocus&&this._rivalLastFocus!==document.body&&typeof this._rivalLastFocus.focus=="function"&&this._rivalLastFocus.focus({preventScroll:!0}),this._rivalLastFocus=null)}renderRivalModal(){if(!this._rivalState||!this._rivalState.isOpen)return;const e=document.getElementById("rival-modal-body");if(!e)return;const t=this.currentLang==="en",a=String(this.selectedGW),r=this.data&&this.data.gameweeks?this.data.gameweeks[a]:null,p=!!(r&&r.is_finished),d=(r?r.is_started!==void 0?!!r.is_started:p||(r.results||[]).some(O=>O.points>0):!1)&&!p,n=document.getElementById("rival-modal-league-pill");n&&(n.textContent=`${this.data?.name||"Mini-League"}`);const c=document.getElementById("rival-modal-status-pill");c&&(c.textContent=d?t?`GW ${this.selectedGW} · LIVE`:`GW ${this.selectedGW} · สด`:p?t?`GW ${this.selectedGW} · OFFICIAL`:`GW ${this.selectedGW} · ทางการ`:t?`GW ${this.selectedGW} · PRE-MATCH`:`GW ${this.selectedGW} · ก่อนคิกออฟ`,c.className=d?"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-display bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/70":"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-display bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700");const{overallSorted:m}=this.computeGameweekOverallStandings(this.selectedGW),s=r&&Array.isArray(r.results)?r.results:[],o=this.data&&this.data.teams||[],l=Number(this._rivalState.teamAId),g=Number(this._rivalState.teamBId),y=s.find(O=>Number(O.entry_id)===l)||{},D=s.find(O=>Number(O.entry_id)===g)||{},h=m.findIndex(O=>Number(O.entry_id)===l),$=m.findIndex(O=>Number(O.entry_id)===g),v=h>=0?m[h]:{},I=$>=0?m[$]:{},L=v.overall_rank?`#${v.overall_rank}`:h>=0?t?"Guest":"ร่วมสนุก":"-",k=I.overall_rank?`#${I.overall_rank}`:$>=0?t?"Guest":"ร่วมสนุก":"-",x=o.find(O=>Number(O.entry_id)===l)||{},C=o.find(O=>Number(O.entry_id)===g)||{},T=y.team_name||v.team_name||x.entry_name||"-",H=y.player_name||v.player_name||x.player_name||"-",z=D.team_name||I.team_name||C.entry_name||"-",U=D.player_name||I.player_name||C.player_name||"-",Q=Number(y.net_points??y.points??0),W=Number(D.net_points??D.points??0),P=Q-W,u=Number(v.total_points||0),N=Number(I.total_points||0),w=u-N,b=this.data.squads&&this.data.squads[`${l}_${a}`]||null,_=this.data.squads&&this.data.squads[`${g}_${a}`]||null,S=(O,ae)=>{const de=new Map;if(!O||!Array.isArray(O.starting))return{map:de,rem:0,cap:null};const oe=String(ae.chip||O.chip||"").toLowerCase(),_e=oe==="bboost"||oe==="bench_boost"?O.starting.concat(O.bench||[]):O.starting;let ce=0,J=null;return _e.forEach(ee=>{if(!ee||!ee.id)return;const re=ee.multiplier!==void 0&&ee.multiplier!==null?Number(ee.multiplier):ee.is_captain?2:1;if(re<=0)return;ee.not_played_yet&&ce++;const le=Number(ee.raw_points!==void 0?ee.raw_points:Math.round((Number(ee.points)||0)/Math.max(1,re)));ee.is_captain&&(J={id:Number(ee.id),name:ee.name,mult:re,pts:Number(ee.points)||0,raw:le,notPlayed:!!ee.not_played_yet}),de.set(Number(ee.id),{id:Number(ee.id),name:ee.name,pos:ee.pos||"MID",team:ee.team||"",mult:re,rawPts:le,totalPts:Number(ee.points)||0,provBonus:Number(ee.provisional_bonus)||0,notPlayed:!!ee.not_played_yet,mins:Number(ee.minutes)||0,isCap:!!ee.is_captain})}),{map:de,rem:ce,cap:J}},E=S(b,y),A=S(_,D),F=new Set([...E.map.keys(),...A.map.keys()]),q=[],j=[],R=[];F.forEach(O=>{const ae=E.map.get(O),de=A.map.get(O),oe=ae?ae.mult:0,ue=de?de.mult:0,_e=ae||de,ce=oe-ue;ce>0?q.push({..._e,edgeMult:ce,netImpact:_e.rawPts*ce,ownMult:oe,rivalMult:ue}):ce<0&&j.push({..._e,edgeMult:Math.abs(ce),netImpact:_e.rawPts*Math.abs(ce),ownMult:oe,rivalMult:ue});const J=Math.min(oe,ue);J>0&&R.push({..._e,sharedMult:J})});const G=O=>O.sort((ae,de)=>{if(d){const oe=ae.notPlayed?1:ae.mins>0?2:0,ue=de.notPlayed?1:de.mins>0?2:0;if(oe!==ue)return ue-oe}return de.netImpact-ae.netImpact||de.edgeMult-ae.edgeMult});G(q),G(j),R.sort((O,ae)=>ae.rawPts-O.rawPts);const K=LiveCommentaryEngine.generateMatchupVerdict({nameA:T,nameB:z,scoreA:Q,scoreB:W,remA:E.rem,remB:A.rem,overallDiff:w,isLive:d,isFinished:p,diffCountA:q.length,diffCountB:j.length,isEn:t}),B=(O,ae)=>{const de=p?t?"FT":"จบ":O.notPlayed?t?"Yet":"รอเตะ":t?"Play":"เตะ",oe=O.notPlayed?"bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400":"bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",ue=O.rivalMult>0&&O.ownMult>0?ae==="cheer"?`+${O.edgeMult}x (C)`:`+${O.edgeMult}x (C)`:O.edgeMult>=3?"3x (TC)":O.edgeMult===2?"2x (C)":"1x",_e=d&&O.provBonus>0?`<span class="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">+${O.provBonus} BPS</span>`:"",ce=O.notPlayed?"-":`${O.netImpact} pts`,J=ae==="cheer"?"text-emerald-700 dark:text-emerald-400":"text-rose-600 dark:text-rose-400";return`
            <div class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono flex-shrink-0">${this.escapeHtml(O.pos)}</span>
                <span class="font-bold text-slate-900 dark:text-white truncate">${this.escapeHtml(O.name)}</span>
                <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">${ue}</span>
                ${_e}
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded ${oe}">${de}</span>
                <span class="font-black font-mono tabular-nums ${J}">${ce}</span>
              </div>
            </div>
          `},Y=[...o].sort((O,ae)=>(O.entry_name||"").localeCompare(ae.entry_name||"")),X=P===0?t?"TIED":"เสมอกัน":P>0?`+${P}`:`${P}`,M=P>0?"bg-emerald-600 text-white":P<0?"bg-rose-600 text-white":"bg-slate-700 text-white",V=E.cap&&A.cap&&E.cap.id===A.cap.id&&E.cap.mult===A.cap.mult,Z=E.cap||A.cap?V?`<div class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs text-center text-slate-600 dark:text-slate-300 font-medium">${t?`Shared Captain: <strong>${this.escapeHtml(E.cap.name)}</strong> (${E.cap.mult}x · ${E.cap.pts} pts) — neutralized`:`กัปตันเหมือนกัน: <strong>${this.escapeHtml(E.cap.name)}</strong> (${E.cap.mult}x · ${E.cap.pts} pts) — หักล้างกัน`}</div>`:`<div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="px-2.5 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-800/50 flex items-center justify-between gap-1 min-w-0">
                    <span class="truncate font-semibold text-slate-700 dark:text-slate-200">(C) ${E.cap?this.escapeHtml(E.cap.name):"-"}</span>
                    <span class="font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400 flex-shrink-0">${E.cap?`${E.cap.pts}p`:"-"}</span>
                  </div>
                  <div class="px-2.5 py-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/25 border border-rose-200/70 dark:border-rose-800/50 flex items-center justify-between gap-1 min-w-0">
                    <span class="truncate font-semibold text-slate-700 dark:text-slate-200">(C) ${A.cap?this.escapeHtml(A.cap.name):"-"}</span>
                    <span class="font-black font-mono tabular-nums text-rose-600 dark:text-rose-400 flex-shrink-0">${A.cap?`${A.cap.pts}p`:"-"}</span>
                  </div>
                </div>`:"";e.innerHTML=`
          <!-- Quick Opponent Switcher -->
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" onclick="app.setRivalQuickPreset('leader')" class="px-2.5 py-1 min-h-[32px] rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer">${t?"Leader":"จ่าฝูง"}</button>
              <button type="button" onclick="app.setRivalQuickPreset('ahead')" class="px-2.5 py-1 min-h-[32px] rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer">${t?"Next Ahead":"คนข้างหน้า"}</button>
              <button type="button" onclick="app.setRivalQuickPreset('behind')" class="px-2.5 py-1 min-h-[32px] rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer">${t?"Next Behind":"คนข้างหลัง"}</button>
            </div>
            <div class="flex items-center gap-1.5 flex-1 sm:flex-initial justify-end min-w-0">
              <select aria-label="${t?"Select rival team":"เลือกทีมคู่แข่ง"}" onchange="if(this.value){ app._rivalState.teamBId = Number(this.value); app.renderRivalModal(); }" class="min-w-0 max-w-[180px] sm:max-w-[200px] min-h-[32px] px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 cursor-pointer">
                ${Y.map(O=>`<option value="${O.entry_id}" ${Number(O.entry_id)===g?"selected":""}>${this.escapeHtml(O.entry_name)}</option>`).join("")}
              </select>
              <button type="button" onclick="app.swapRivalTeams()" class="px-2.5 py-1 min-h-[32px] rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer" title="${t?"Swap sides":"สลับฝั่ง"}" aria-label="${t?"Swap sides":"สลับฝั่ง"}">⇄</button>
            </div>
          </div>

          <!-- Scoreboard Hero -->
          <div class="rounded-2xl p-3 sm:p-4 bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800">
            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-1 flex-wrap">
                  <span class="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-display">${t?"SIDE A":"ฝั่งเชียร์"}</span>
                  ${y.chip?`<span class="chip-badge badge-${String(y.chip).toLowerCase()} text-[9px]">${String(y.chip).toUpperCase()}</span>`:""}
                </div>
                <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display truncate mt-1">${this.escapeHtml(T)}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(H)}</div>
                <div class="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1.5">${Q} <span class="text-xs font-bold text-slate-400">pts</span></div>
                <div class="text-[10.5px] text-slate-500 dark:text-slate-400 font-display mt-0.5">
                  ${y.hits>0?`<span class="text-rose-600 dark:text-rose-400 font-bold">-${y.hits} hits</span> · `:""}${d?t?`${E.rem} left`:`เหลือ ${E.rem} ตัว`:t?`Overall ${L}`:`รวม ${L}`}
                </div>
              </div>

              <div class="flex flex-col items-center justify-center px-1">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-display">VS</span>
                <span class="mt-1 px-2.5 py-1 rounded-xl text-xs font-black font-mono tabular-nums shadow-2xs ${M}">${X}</span>
              </div>

              <div class="min-w-0 text-right">
                <div class="flex items-center justify-end gap-1 flex-wrap">
                  ${D.chip?`<span class="chip-badge badge-${String(D.chip).toLowerCase()} text-[9px]">${String(D.chip).toUpperCase()}</span>`:""}
                  <span class="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-display">${t?"RIVAL":"ฝั่งแช่ง"}</span>
                </div>
                <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display truncate mt-1">${this.escapeHtml(z)}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(U)}</div>
                <div class="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1.5">${W} <span class="text-xs font-bold text-slate-400">pts</span></div>
                <div class="text-[10.5px] text-slate-500 dark:text-slate-400 font-display mt-0.5">
                  ${D.hits>0?`<span class="text-rose-600 dark:text-rose-400 font-bold">-${D.hits} hits</span> · `:""}${d?t?`${A.rem} left`:`เหลือ ${A.rem} ตัว`:t?`Overall ${k}`:`รวม ${k}`}
                </div>
              </div>
            </div>

            <div class="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-display tabular-nums flex-wrap gap-1">
              <span>${t?`Overall: ${L} (${u}) vs ${k} (${N})`:`คะแนนรวมสะสม: ${L} (${u}) เทียบ ${k} (${N})`}</span>
              <span class="font-bold ${w>=0?"text-emerald-700 dark:text-emerald-400":"text-rose-600 dark:text-rose-400"}">${w===0?t?"Overall Level":"รวมเท่ากัน":w>0?`+${w} pts`:`${w} pts`}</span>
            </div>
          </div>

          ${Z}

          <!-- Differentials Arena -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-2xl p-3 bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-200/70 dark:border-emerald-900/40 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 font-display">${t?"Cheer For (Your Edge)":"ฝั่งเชียร์ (ตัวต่างฝั่งซ้าย)"}</span>
                <span class="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">${q.length}</span>
              </div>
              <div class="space-y-1.5">
                ${q.length>0?q.map(O=>B(O,"cheer")).join(""):`<div class="text-[11px] text-slate-400 py-2 text-center">${t?"No unique differentials":"ไม่มีตัวต่างฝั่งนี้"}</div>`}
              </div>
            </div>

            <div class="rounded-2xl p-3 bg-rose-50/40 dark:bg-rose-950/15 border border-rose-200/70 dark:border-rose-900/40 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-rose-800 dark:text-rose-300 font-display">${t?"Fear / Sweat (Rival Edge)":"ฝั่งแช่ง (ตัวต่างคู่แข่ง)"}</span>
                <span class="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">${j.length}</span>
              </div>
              <div class="space-y-1.5">
                ${j.length>0?j.map(O=>B(O,"fear")).join(""):`<div class="text-[11px] text-slate-400 py-2 text-center">${t?"No unique differentials":"ไม่มีตัวต่างฝั่งนี้"}</div>`}
              </div>
            </div>
          </div>

          <!-- 1-Line Tailored Verdict -->
          <div class="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800/95 border border-slate-800 dark:border-slate-700 text-xs font-medium leading-relaxed">
            ${K}
          </div>

          <!-- Collapsible Shared Players -->
          <details class="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 px-3 py-2">
            <summary class="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none font-display">
              ${t?`Shared Players (${R.length} — neutralized)`:`ตัวที่เหมือนกัน (${R.length} คน — หักล้างกัน)`}
            </summary>
            <div class="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap gap-1.5">
              ${R.map(O=>`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium">${this.escapeHtml(O.name)} <span class="font-mono font-bold text-slate-500 dark:text-slate-400">${O.notPlayed?"-":`${O.rawPts}p`}</span></span>`).join("")}
            </div>
          </details>
        `}showToast(e,t="success",a=2500){if(typeof document>"u")return;let r=document.getElementById("global-copied-toast");r||(r=document.createElement("div"),r.id="global-copied-toast",document.body.appendChild(r)),r.className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 z-[70] flex items-center gap-1.5 transition-all duration-200 opacity-0 pointer-events-none translate-y-2 backdrop-blur-xs font-display";let p='<svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>';t==="error"?p='<svg class="w-3.5 h-3.5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>':t==="info"?p='<svg class="w-3.5 h-3.5 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>':t==="line"&&(p='<svg class="w-3.5 h-3.5 text-[#06C755] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 3.1 1.87 5.86 4.75 7.37-.21.78-.77 2.82-.88 3.25-.15.58.21.57.44.42.18-.12 2.5-1.7 3.51-2.4.72.11 1.45.16 2.18.16 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg>'),r.innerHTML=p;const i=document.createElement("span");i.textContent=String(e??""),r.appendChild(i),r.classList.remove("opacity-0","translate-y-2"),r.classList.add("opacity-100","translate-y-0"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{r.classList.remove("opacity-100","translate-y-0"),r.classList.add("opacity-0","translate-y-2")},a)}onLiveSearchInput(e){const t=document.getElementById("live-team-search-clear");t&&(e&&e.trim().length>0?t.classList.remove("hidden"):t.classList.add("hidden")),this.filterLiveTables()}clearLiveSearch(){const e=document.getElementById("live-team-search");e&&(e.value="",e.focus());const t=document.getElementById("live-team-search-clear");t&&t.classList.add("hidden"),this.filterLiveTables()}showMoreMatchdayTeams(e){e==="all"?this.matchdayChunkLimit=999999:this.matchdayChunkLimit=(this.matchdayChunkLimit||40)+Number(e||100),this.renderGameweekView()}showMoreOverallTeams(e){e==="all"?this.overallChunkLimit=999999:this.overallChunkLimit=(this.overallChunkLimit||40)+Number(e||100),this.renderGameweekView()}filterLiveTables(){const e=document.getElementById("live-team-search"),t=e?e.value.trim().toLowerCase():"",a=document.getElementById("matchday-table-body"),r=document.getElementById("overall-standings-body"),p=document.getElementById("live-search-count"),i=this.currentLang==="en",d=this.data&&this.data.teams?this.data.teams.length:0;if(d>100){if(this.renderGameweekView(),p){const s=(a?a.querySelectorAll("tr[data-team-name]"):[]).length;t&&t.length>0?(p.textContent=i?`Found ${s} of ${d.toLocaleString()} teams`:`พบ ${s} จาก ${d.toLocaleString()} ทีม`,p.classList.remove("hidden")):(p.textContent="",p.classList.add("hidden"))}return}let n=0;const c=(m,s,o)=>{if(!m)return;const l=m.querySelector("tr.live-search-empty-row");l&&l.remove();const g=m.querySelectorAll("tr[data-team-name]");let y=0;if(g.forEach(D=>{const h=(D.getAttribute("data-team-name")||"").toLowerCase(),$=(D.getAttribute("data-manager-name")||"").toLowerCase(),v=!t||h.includes(t)||$.includes(t);D.style.display=v?"":"none",v&&(y++,o&&n++)}),t&&g.length>0&&y===0){const D=document.createElement("tr");D.className="live-search-empty-row",D.innerHTML=`<td colspan="${s}" class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">${i?"No matching teams found":"ไม่พบทีมหรือผู้จัดการที่ค้นหา"}</td>`,m.appendChild(D)}};c(a,6,!0),c(r,5,!1),p&&(t&&t.length>0?(p.textContent=i?`Found ${n} teams`:`พบ ${n} ทีม`,p.classList.remove("hidden")):(p.textContent="",p.classList.add("hidden")))}switchLiveMobileTable(e){const t=document.getElementById("matchday-table-card"),a=document.getElementById("overall-table-card"),r=document.getElementById("btn-switch-matchday-table"),p=document.getElementById("btn-switch-overall-table");if(!t||!a)return;const i="flex-1 sm:flex-initial px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-bold font-display transition-colors cursor-pointer bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs",d="flex-1 sm:flex-initial px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold font-display transition-colors cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";e==="matchday"?(t.classList.remove("hidden","max-xl:hidden"),a.classList.add("hidden","xl:block"),a.classList.remove("max-xl:hidden"),r&&(r.className=i,r.setAttribute("aria-selected","true")),p&&(p.className=d,p.setAttribute("aria-selected","false"))):(t.classList.add("hidden","xl:block"),t.classList.remove("max-xl:hidden"),a.classList.remove("hidden","max-xl:hidden"),r&&(r.className=d,r.setAttribute("aria-selected","false")),p&&(p.className=i,p.setAttribute("aria-selected","true")))}handlePlayerStatsClick(e,t){if(!t||!t.dataset)return;const a=t.dataset;this.showPlayerStatsToast(e,a.playerName||"",Number(a.playerPoints||0),Number(a.playerMult||1),a.playerCap==="1",Number(a.playerBonus||0),a.playerTeam||"")}showPlayerStatsToast(e,t,a,r,p,i,d){e&&typeof e.stopPropagation=="function"&&e.stopPropagation();const n=this.currentLang==="en",c=r>1?r===3?" (TC)":" (C)":"",m=i&&i>0?` (+${i} BPS)`:"",s=n?`👤 ${t}${c} • ${d} • ${a} pts${m}`:`👤 ${t}${c} • ${d} • ${a} แต้ม${m}`;this.showToast(s,"info")}ensureXlsxLoaded(){return typeof XLSX<"u"&&XLSX.utils&&XLSX.writeFile?Promise.resolve(!0):this._xlsxLoadPromise?this._xlsxLoadPromise:(this._xlsxLoadPromise=new Promise(e=>{if(typeof document>"u"){this._xlsxLoadPromise=null,e(!1);return}const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",t.integrity="sha384-vtjasyidUo0kW94K5MXDXntzOJpQgBKXmE7e2Ga4LG0skTTLeBi97eFAXsqewJjw",t.crossOrigin="anonymous",t.referrerPolicy="no-referrer",t.async=!0;const a=p=>{clearTimeout(r),p||(this._xlsxLoadPromise=null),e(p)},r=setTimeout(()=>a(!1),6e3);t.onload=()=>{a(typeof XLSX<"u"&&!!(XLSX.utils&&XLSX.writeFile))},t.onerror=()=>a(!1),document.head.appendChild(t)}),this._xlsxLoadPromise)}async exportToExcel(){try{const e=this.currentLang==="en";this.showToast(e?"Preparing data for Excel export...":"กำลังจัดเตรียมข้อมูลเพื่อ Export Excel..."),await this.ensureXlsxLoaded();const a=(this.data&&this.data.name?this.data.name:`League_${this.activeLeagueId}`).replace(/[\/*?:"<>|]/g,"_").trim(),r=Number(this.multiData&&this.multiData.max_gw)||1,p=new Date().toISOString().slice(0,10),i=`FPL_${a}_${this.activeLeagueId}_AllGWs_${p}.xlsx`,d=e?["Rank","Team Name","Manager","FPL ID","Status","Total Net Pts"]:["อันดับ","ชื่อทีม","ผู้จัดการ","FPL ID","สถานะ","คะแนนรวมสุทธิ"];for(let T=1;T<=r;T++)d.push(`GW ${T}`);e?d.push("Total Hits","Chips Used","Team Value (£M)","Bank (£M)"):d.push("คะแนนลบรวม","ชิปที่ใช้ไป","มูลค่าทีม (£M)","เงินในธนาคาร (£M)");const n=this.data.teams||[],c=!!(this.data&&this.data.tier===2||this.config&&this.config.tier===2);let m=!c;if(m)for(let T=1;T<=r;T++){const H=this.data.gameweeks?this.data.gameweeks[String(T)]:null;if(!!(H&&(H.is_finished||H.is_started))&&(!Array.isArray(H.results)||H.results.length===0)){m=!1;break}}const s=n.map(T=>{const H=Number(T.entry_id),z=this.isPrizeEligible(H);let U=0,Q=0;const W={},P=[];let u=100,N=0;for(let w=1;w<=r;w++){const b=this.data.gameweeks?this.data.gameweeks[String(w)]:null;if(b&&(!!b.is_finished||!!b.is_started||Array.isArray(b.results)&&b.results.some(S=>(S.points||0)>0||(S.net_points||0)!==0))&&b.results){const S=b.results.find(E=>Number(E.entry_id)===H);S?(W[w]=S.net_points,U+=S.net_points||0,Q+=S.hits||0,S.chip&&P.push(`${S.chip.toUpperCase()}(GW${w})`),S.team_value!==void 0&&(u=S.team_value),S.bank!==void 0&&(N=S.bank)):W[w]="-"}else W[w]="-"}return(!m||c)&&T.total_points!==void 0&&T.total_points!==null&&Number.isFinite(Number(T.total_points))&&(U=Number(T.total_points)),{entry_id:H,team_name:T.entry_name||T.team_name,player_name:T.player_name,is_prize:z,total_net:U,gw_points:W,total_hits:Q,chips_used:P.join(", ")||"-",team_value:u,bank:N,fpl_rank:T.rank||999}});s.sort((T,H)=>H.total_net-T.total_net||T.fpl_rank-H.fpl_rank);let o=1,l=0,g=null;s.forEach(T=>{if(!T.is_prize){T.displayRank=e?"Guest":"ร่วมสนุก";return}l++,g!==null&&T.total_net<g&&(o=l),g=T.total_net,T.displayRank=o});const y=[d];s.forEach(T=>{const H=[T.displayRank,T.team_name,T.player_name,T.entry_id,T.is_prize?e?"Prize Eligible":"แข่งขันชิงรางวัล":e?"Guest":"ร่วมสนุก",T.total_net];for(let z=1;z<=r;z++)H.push(T.gw_points[z]);H.push(T.total_hits,T.chips_used,T.team_value,T.bank),y.push(H)});const h=[e?["Gameweek","GW Status","GW Rank","Team Name","Manager","FPL ID","Team Status","Raw Points","Hits","Net Points","Captain","Chip Used","Bench Points","Transfers","Transfer Net Impact"]:["Gameweek","สถานะสัปดาห์","อันดับ GW","ชื่อทีม","ผู้จัดการ","FPL ID","สถานะทีม","คะแนนดิบ","คะแนนลบ","คะแนนสุทธิ","กัปตัน","ชิปที่ใช้","คะแนนตัวสำรอง","จำนวนย้ายตัว","ผลต่างคะแนนย้ายตัว"]];for(let T=1;T<=r;T++){const H=this.data.gameweeks?this.data.gameweeks[String(T)]:null;if(!H||!H.results||H.results.length===0)continue;const z=!!H.is_finished,U=H.is_started!==void 0?!!H.is_started:z||H.results.some(A=>A.points>0);if(!z&&!U)continue;const Q=z?e?"Finished":"จบการแข่งขัน":e?"Live":"กำลังแข่งขัน",W=this.config&&this.config.features&&this.config.features.prize_model==="weekly",P="net_points",u=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),N=[...H.results].sort((A,F)=>{const q=F[P]-A[P]||F.net_points-A.net_points||F.points-A.points;return q!==0?q:u?this.compareTeamPlayerScores(A.entry_id,F.entry_id,T):0});let w=1,b=0,_=null,S=null;const E={};N.forEach(A=>{if(!this.isPrizeEligible(A.entry_id)){E[A.entry_id]=e?"Guest":"ร่วมสนุก";return}b++;const q=A[P];let j=!1;_!==null&&q===_&&(u&&S?j=this.compareTeamPlayerScores(A.entry_id,S.entry_id,T)===0:j=!0),!j&&_!==null&&(w=b),_=q,S=A,E[A.entry_id]=w}),N.forEach(A=>{const F=this.isPrizeEligible(A.entry_id);h.push([`GW ${T}`,Q,E[A.entry_id]||"-",A.team_name,A.player_name,A.entry_id,F?e?"Prize Eligible":"แข่งขันชิงรางวัล":e?"Guest":"ร่วมสนุก",A.points!==void 0?A.points:0,A.hits!==void 0?A.hits:0,A.net_points!==void 0?A.net_points:0,A.captain?A.captain.replace(/\s*\(C\)/gi,"").trim():"-",A.chip?A.chip.toUpperCase():"-",A.bench_points!==void 0?A.bench_points:0,A.transfers_count!==void 0?A.transfers_count:0,A.transfers_net_impact!==void 0?A.transfers_net_impact:0])})}const $=[],v=this.config&&this.config.features||{},I=this.getLeagueCurrency(),L=v.prize_model==="weekly"||v.prize_model==="penalties"||!!v.has_weekly_penalties,k=!!v.has_weekly_penalties;if(L){$.push([e?"=== WEEKLY PRIZE WINNERS ===":"=== สรุปแชมป์เงินรางวัลประจำสัปดาห์ ==="]),$.push(["Gameweek","สถานะ","ทีมที่ได้รับรางวัล","ผู้จัดการ","FPL ID",e?"Raw Points":"คะแนนดิบ",e?"Hits":"คะแนนลบ",e?"Net Points":"คะแนนสุทธิ",e?`Prize (${I.code})`:`เงินรางวัล (${I.code})`,"หมายเหตุ"]);const T=Number(v.weekly_prize_amount)||350,H={};n.forEach(W=>{H[W.entry_id]={team_name:W.entry_name,player_name:W.player_name,is_prize:this.isPrizeEligible(W.entry_id),win_count:0,won_gws:[],total_prize:0,fines_paid:0,danger_count:0}});const z=v.weekly_prizes,U=z?Object.values(z).map(Number):[Number(v.weekly_prize_amount)||350];for(let W=1;W<=r;W++){const P=this.data.gameweeks?this.data.gameweeks[String(W)]:null;if(!P||!P.results)continue;const u=!!P.is_finished,N=P.results.filter(w=>this.isPrizeEligible(w.entry_id));if(N.length>0){const w=!!(this.config&&this.config.features&&this.config.features.tie_breaker==="highest_player"),b=[...N].sort((S,E)=>{const A=E.net_points-S.net_points;return A!==0?A:w?this.compareTeamPlayerScores(S.entry_id,E.entry_id,W):0});this.calculateWeeklyTierPrizes(b,U,W).forEach(S=>{u&&H[S.entry_id]&&(S.rank===1&&(H[S.entry_id].win_count+=1/S.jointCount),H[S.entry_id].won_gws.push(`GW${W}${U.length>1?` (อันดับ ${S.rank})`:""}`),H[S.entry_id].total_prize+=S.prize);const E=S.tieBreakNote?` (${S.tieBreakNote})`:"",A=S.isJoint?`ครองอันดับร่วม ${S.jointCount} ทีม (หารเท่า)`:U.length>1?`อันดับ ${S.rank}${E}`:"แชมป์เดี่ยว";$.push([`GW ${W}`,u?"จบการแข่งขัน (รับรางวัลแล้ว)":"กำลังแข่งขัน (ผู้นำชั่วคราว)",U.length>1?`อันดับ ${S.rank}: ${S.team_name}`:S.team_name,S.player_name,S.entry_id,S.points,S.hits||0,S.net_points,u?S.prize:0,A])}),k&&this.calculateWeeklyPenalties(b,W).forEach(E=>{u&&H[E.entry_id]&&(H[E.entry_id].fines_paid+=E.fine,H[E.entry_id].danger_count+=1)})}}if(k){const W=this.getWeeklyPenaltyTiers().length;$.push([]),$.push([e?"=== WEEKLY PENALTY FINES ===":`=== สรุปค่าปรับ ${W} อันดับท้ายประจำสัปดาห์ ===`]),$.push(["Gameweek","สถานะ","อันดับจากท้าย","ทีมที่เสียค่าปรับ","ผู้จัดการ","FPL ID",e?"Raw Points":"คะแนนดิบ",e?"Hits":"คะแนนลบ",e?"Net Points":"คะแนนสุทธิ",e?`Fine (${I.code})`:`ค่าปรับ (${I.code})`,"หมายเหตุ"]);for(let P=1;P<=r;P++){const u=this.data.gameweeks?this.data.gameweeks[String(P)]:null;if(!u||!u.results)continue;const N=!!u.is_finished,w=u.results.filter(b=>this.isPrizeEligible(b.entry_id));if(w.length>0){const b=[...w].sort((S,E)=>E.net_points-S.net_points);this.calculateWeeklyPenalties(b,P).forEach(S=>{const E=N?"จบการแข่งขัน (ชำระเข้ากองกลาง)":"กำลังแข่งขัน (อยู่ในโซนอันตราย)",A=S.isJoint?`คะแนนเท่ากัน ${S.jointCount} ทีม (เฉลี่ยค่าปรับ)`:S.tieBreakNote?`ตัดสินด้วย ${S.tieBreakNote}`:"อันดับเดี่ยว";$.push([`GW ${P}`,E,S.rankLabel||"อันดับท้าย",S.team_name,S.player_name,S.entry_id,S.points!==void 0?S.points:"-",S.hits||0,S.net_points,N?S.fine:0,A])})}}}$.push([]),$.push([k?e?"=== NET BALANCE PER TEAM ===":"=== สรุปยอดเงินรางวัลและค่าปรับสุทธิรายทีม ===":e?"=== TOTAL PRIZE WINNINGS PER TEAM ===":"=== สรุปยอดเงินรางวัลสะสมรายทีม ==="]),k?$.push(["อันดับยอดสุทธิ","ชื่อทีม","ผู้จัดการ","FPL ID","สถานะ","จำนวนแชมป์สัปดาห์ (ครั้ง)",`เงินรางวัลรวม (${I.code})`,`ค่าปรับรวม (${I.code})`,"ติดโซนอันตราย (ครั้ง)",e?`Net Balance (${I.code})`:`ยอดรวมสุทธิ (${I.code})`]):$.push(["อันดับเงินรางวัล","ชื่อทีม","ผู้จัดการ","FPL ID","สถานะ","จำนวนแชมป์สัปดาห์ (ครั้ง)","สัปดาห์ที่ชนะ",`เงินรางวัลรวมสะสม (${I.code})`]),Object.values(H).filter(W=>W.is_prize).sort((W,P)=>{if(k){const u=W.total_prize-W.fines_paid,N=P.total_prize-P.fines_paid;if(N!==u)return N-u}return P.total_prize-W.total_prize}).forEach((W,P)=>{const u=W.win_count%1===0?W.win_count:W.win_count.toFixed(1);k?$.push([P+1,W.team_name,W.player_name,W.entry_id,"แข่งขันชิงรางวัล",u,W.total_prize,W.fines_paid,W.danger_count,W.total_prize-W.fines_paid]):$.push([P+1,W.team_name,W.player_name,W.entry_id,"แข่งขันชิงรางวัล",u,W.won_gws.join(", ")||"-",W.total_prize])}),this.config.settlement_phases&&($.push([]),$.push([e?"=== SETTLEMENT PHASES ===":"=== รอบเคลียร์เงินรางวัล 6 งวด ==="]),$.push(e?["Round","Gameweeks","Budget","Status"]:["งวดที่","สัปดาห์","งบประมาณ","สถานะ"]),this.config.settlement_phases.forEach(W=>{$.push([W.title,W.gws,W.budget,W.status||"-"])})),this.config.season_prizes&&($.push([]),$.push([e?"=== SEASON & CUP PRIZES ===":"=== รางวัลประจำฤดูกาล & บอลถ้วย ==="]),$.push(["รางวัล","จำนวนเงิน"]),Object.entries(this.config.season_prizes).forEach(([W,P])=>{$.push([`อันดับ ${W}`,P])}),v.cup_champion_prize&&$.push(["แชมป์ฟุตบอลถ้วย",v.cup_champion_prize]))}else if(v.prize_model==="monthly"){const T=this.getMonthlySchedule();$.push([e?`=== MONTHLY AWARDS (${T.length} MONTHS) ===`:`=== สรุปรางวัลประจำเดือน ${T.length} เดือน ===`]),$.push(["เดือน","สัปดาห์แข่งขัน (GWs)","สถานะ","แชมป์ประจำเดือน","ผู้จัดการ (แชมป์)","คะแนนสุทธิเดือนนี้",`เงินรางวัลแชมป์ (${I.code})`,"รองแชมป์ประจำเดือน","ผู้จัดการ (รองแชมป์)","คะแนนสุทธิ",`เงินรางวัลรองแชมป์ (${I.code})`]);const H=Number(v.monthly_champion_prize??v.monthly_prize_amount??600),z=v.monthly_runner_up_prize!==void 0&&v.monthly_runner_up_prize!==null?Number(v.monthly_runner_up_prize):v.monthly_champion_prize!==void 0?0:400;T.forEach(Q=>{const W=Q.gw_list||[],P={};n.forEach(w=>{P[w.entry_id]={entry_id:w.entry_id,team_name:w.entry_name,player_name:w.player_name,is_prize:this.isPrizeEligible(w.entry_id),pts:0}}),W.forEach(w=>{const b=this.data.gameweeks?this.data.gameweeks[String(w)]:null;b&&b.results&&b.results.forEach(_=>{P[_.entry_id]&&(P[_.entry_id].pts+=_.net_points||0)})});const u=W.length>0&&W.every(w=>{const b=this.data.gameweeks?this.data.gameweeks[String(w)]:null;return b&&b.is_finished}),N=Object.values(P).filter(w=>w.is_prize).sort((w,b)=>b.pts-w.pts||(w.team_name||"").localeCompare(b.team_name||"")||w.entry_id-b.entry_id);if(N.length===0||N[0].pts===0)$.push([Q.month,Q.gws,u?"จบการแข่งขัน":Q.status||"รอการแข่งขัน","-","-",0,0,"-","-",0,0]);else{const w=N[0].pts,b=N.filter(R=>R.pts===w);let _=[],S=H,E=z;if(b.length>1){const R=(H+z)/b.length;S=(H+z)%b.length!==0?Number(R.toFixed(2)):Math.round(R),E=0}else{const R=N.find(G=>G.pts<w)?.pts;if(R!==void 0&&R>0){_=N.filter(K=>K.pts===R);const G=z/_.length;E=_.length>1&&z%_.length!==0?Number(G.toFixed(2)):Math.round(G)}}const A=b.map(R=>R.team_name).join(", "),F=b.map(R=>R.player_name).join(", "),q=_.map(R=>R.team_name).join(", ")||"-",j=_.map(R=>R.player_name).join(", ")||"-";$.push([Q.month,Q.gws,u?"จบการแข่งขัน (มอบรางวัลแล้ว)":Q.status||"รอการแข่งขัน",A+(b.length>1?` (แชมป์ร่วม ${b.length} ทีม)`:""),F,w,u?b.length>1?`${S} / ทีม`:S:0,q+(_.length>1?` (รองแชมป์ร่วม ${_.length} ทีม)`:""),j,_.length>0?_[0].pts:0,u?_.length>1?`${E} / ทีม`:E:0])}});const U=!!(this.config.season_prizes&&Object.keys(this.config.season_prizes).length>0);(U||v.cup_champion_prize||v.charity_donation||this.config.total_pool)&&($.push([]),$.push(["=== รางวัลประจำฤดูกาล บอลถ้วย และกองกลาง ==="]),$.push(["หมวดหมู่","รายละเอียด / จำนวนเงิน"]),U&&Object.entries(this.config.season_prizes).forEach(([Q,W])=>{$.push([`อันดับ ${Q} ประจำฤดูกาล`,W])}),v.cup_champion_prize&&$.push(["แชมป์ฟุตบอลถ้วย",v.cup_champion_prize]),v.charity_donation&&$.push(["บริจาคการกุศลให้โรงพยาบาล",v.charity_donation]),this.config.total_pool&&this.config.total_pool!=="-"&&$.push(["กองกลางรวมทั้งหมด",this.config.total_pool]))}else if(v.prize_model==="annual_zero_sum"||v.prize_model==="annual"){$.push([e?"=== ANNUAL ZERO-SUM SETTLEMENT ===":"=== สรุปยอดเงินรางวัล & ค่าปรับคะแนนรวมสิ้นฤดูกาล ==="]),$.push(["อันดับ","ทีม","ผู้จัดการ","FPL ID","คะแนนรวมสะสม","ยอดรวมสุทธิ (THB)"]);const T=v.annual_payout_tiers||{1:1e3,2:800,3:600,4:400,5:200,6:100,7:-100,8:-200,9:-400,10:-600,11:-800,12:-1e3},H=!!(this.data&&this.data.tier===2)||!!(this.config&&this.config.tier===2),z={};if((this.data.teams||[]).forEach(P=>{z[P.entry_id]={entry_id:P.entry_id,team_name:P.entry_name,player_name:P.player_name,fpl_rank:P.rank||999,total_points:H&&Number(P.total_points)||0}}),!H)for(let P=1;P<=r;P++){const u=this.data.gameweeks?this.data.gameweeks[String(P)]:null;if(u&&u.results&&(u.is_started!==void 0?!!u.is_started:!!u.is_finished||u.results.some(w=>w.points>0))){const w=new Set;u.results.forEach(b=>{w.has(b.entry_id)||(w.add(b.entry_id),z[b.entry_id]||(z[b.entry_id]={entry_id:b.entry_id,team_name:b.team_name,player_name:b.player_name,fpl_rank:999,total_points:0}),z[b.entry_id].total_points+=b.net_points)})}}const U=Object.values(z).sort((P,u)=>{const N=this.isPrizeEligible(P.entry_id)?1:0,w=this.isPrizeEligible(u.entry_id)?1:0;return N!==w?w-N:H?(P.fpl_rank||999)-(u.fpl_rank||999)||u.total_points-P.total_points:u.total_points-P.total_points||(P.fpl_rank||999)-(u.fpl_rank||999)}),Q=U.filter(P=>this.isPrizeEligible(P.entry_id));let W=0;for(;W<Q.length;){let P=W+1;for(;P<Q.length&&Q[P].total_points===Q[W].total_points;)P++;const u=P-W,N=W+1,w=W+u;let b=0;for(let S=N;S<=w;S++)b+=Number(T[String(S)]||0);const _=u>0?b/u:0;for(let S=W;S<P;S++){const E=Q[S];E.overall_rank=N,E.is_joint=u>1,E.joint_count=u,E.pos_start=N,E.pos_end=w,E.payout=_}W=P}U.forEach(P=>{this.isPrizeEligible(P.entry_id)||(P.overall_rank=null,P.is_joint=!1,P.payout=0)}),U.forEach(P=>{const u=this.isPrizeEligible(P.entry_id),N=P.overall_rank,w=u?P.payout:0;let b="-";u&&N&&(w>0?b=`+${w.toLocaleString()}`:w<0?b=`${w.toLocaleString()}`:b="0");const _=u?P.is_joint?`อันดับ ${N} (ร่วม)`:`อันดับ ${N}`:"ร่วมสนุก";$.push([_,P.team_name,P.player_name,P.entry_id,P.total_points,b])})}else if(v.prize_model==="bramann_dual_prize"){$.push([e?"=== BRAMANN LEAGUE DUAL PRIZES & MINI-GAMES ===":"=== สรุปเงินรางวัล FPL & มินิเกม Bramann League ==="]);const T=Number(v.prize1_target_gw)||18,H=Number(v.prize2_target_gw)||38,z=v.prize1_tiers||{1:500,2:500,3:500,5:500,7:500,9:500,11:500,13:500,15:500},U=v.prize2_tiers||{1:1e3,2:800,3:700,7:700,8:500,9:400,13:400,14:300,15:200};$.push(["อันดับ","ทีม","ผู้จัดการ","FPL ID","คะแนนรวมสะสม",`Prize 1 (GW ${T})`,`Prize 2 (GW ${H})`,"รวมรางวัล FPL (THB)","ทายผลสะสม (THB)","ท้าชนสะสม (THB)",e?"Grand Total (THB)":"ยอดรวมสุทธิ (THB)"]);const Q={};(this.data.teams||[]).forEach(b=>{Q[b.entry_id]={entry_id:b.entry_id,team_name:b.entry_name,player_name:b.player_name,fpl_rank:b.rank||999,p1_points:0,p2_points:0,total_points:0}});for(let b=1;b<=r;b++){const _=this.data.gameweeks?this.data.gameweeks[String(b)]:null;if(_&&_.results&&(_.is_started!==void 0?!!_.is_started:!!_.is_finished||_.results.some(E=>E.points>0))){const E=new Set;_.results.forEach(A=>{if(E.has(A.entry_id))return;E.add(A.entry_id);const F=Q[A.entry_id];if(F){const q=A.net_points||0;F.total_points+=q,b<=T&&(F.p1_points+=q),b<=H&&(F.p2_points+=q)}})}}const W=Object.values(Q).filter(b=>this.isPrizeEligible(b.entry_id)),P=(b,_,S,E,A,F)=>{const q=[...b].sort((R,G)=>G[_]-R[_]||(R.fpl_rank||999)-(G.fpl_rank||999));let j=0;for(;j<q.length;){let R=j+1;for(;R<q.length&&q[R][_]===q[j][_];)R++;const G=R-j,K=j+1,B=j+G;let Y=0;for(let M=K;M<=B;M++)Y+=Number(S[String(M)]||0);const X=G>0?Y/G:0;for(let M=j;M<R;M++)q[M][E]=Number.isInteger(X)?X:Number(X.toFixed(2)),A&&(q[M][A]=K),F&&(q[M][F]=G>1);j=R}};P(W,"p1_points",z,"p1_amt","p1_rank","p1_joint"),P(W,"p2_points",U,"p2_amt","p2_rank","p2_joint");const u={};this.bramannPredData&&this.bramannPredData.cumulative_standings&&this.bramannPredData.cumulative_standings.forEach(b=>{b.player&&(b.player.entry_id&&(u[b.player.entry_id]=Number(b.net)||0),b.player.display_name&&(u[b.player.display_name.toLowerCase()]=Number(b.net)||0))});const N={};this.bramannChalData&&this.bramannChalData.cumulative_standings&&this.bramannChalData.cumulative_standings.forEach(b=>{b.player&&(b.player.entry_id&&(N[b.player.entry_id]=Number(b.net)||0),b.player.display_name&&(N[b.player.display_name.toLowerCase()]=Number(b.net)||0))}),Object.values(Q).sort((b,_)=>{const S=this.isPrizeEligible(b.entry_id)?1:0,E=this.isPrizeEligible(_.entry_id)?1:0;return S!==E?E-S:_.total_points-b.total_points||(b.fpl_rank||999)-(_.fpl_rank||999)}).forEach(b=>{const _=this.isPrizeEligible(b.entry_id),S=_&&b.p1_amt||0,E=_&&b.p2_amt||0,A=Number((S+E).toFixed(2)),F=u[b.entry_id]!==void 0?u[b.entry_id]:u[(b.player_name||"").toLowerCase()]||0,q=N[b.entry_id]!==void 0?N[b.entry_id]:N[(b.player_name||"").toLowerCase()]||0,j=Number((A+F+q).toFixed(2)),R=_?b.p2_joint?`อันดับ ${b.p2_rank} (ร่วม)`:`อันดับ ${b.p2_rank}`:"ร่วมสนุก";$.push([R,b.team_name,b.player_name,b.entry_id,b.total_points,S,E,A,F,q,j])})}else $.push([e?"=== PRIZE & RULES MATRIX ===":"=== ข้อมูลเงินรางวัลและกติกา ==="]),$.push(["สถานะ","อยู่ระหว่างรอการประกาศกติกาและโครงสร้างเงินรางวัลอย่างเป็นทางการ (เว้นไว้ก่อน เดี๋ยวเข้ามาอธิบาย)"]),$.push(["ลีก",this.data.name]),$.push(["League ID",String(this.activeLeagueId)]),$.push(["จำนวนสมาชิก",(this.data.teams||[]).length+" ทีม"]);const x=T=>typeof T=="string"&&/^[=+\-@]/.test(T)?"'"+T:T,C=T=>T.map(H=>H.map(x));if(typeof XLSX<"u"&&XLSX.utils&&XLSX.writeFile){const T=XLSX.utils.book_new(),H=XLSX.utils.aoa_to_sheet(C(y)),z=XLSX.utils.aoa_to_sheet(C(h)),U=XLSX.utils.aoa_to_sheet(C($)),Q=W=>{const P=[];return W.forEach(u=>{u.forEach((N,w)=>{const b=N==null?"":String(N);P[w]=Math.max(P[w]||10,Math.min(b.length+3,40))})}),P.map(u=>({wch:u}))};H["!cols"]=Q(y),z["!cols"]=Q(h),U["!cols"]=Q($),XLSX.utils.book_append_sheet(T,H,"Total Leaderboard"),XLSX.utils.book_append_sheet(T,z,"Gameweek Standings"),XLSX.utils.book_append_sheet(T,U,"Prize Summary"),XLSX.writeFile(T,i),this.showToast(e?"Excel file downloaded successfully!":"ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว!")}else this.exportExcelXmlFallback(y,h,$,i.replace(/\.xlsx$/i,".xls")),this.showToast(e?"Excel file downloaded successfully!":"ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว!")}catch(e){console.error("Export Excel failed:",e),this.showToast(isEn?"Error exporting Excel file: "+(e.message||e):"เกิดข้อผิดพลาดในการส่งออก Excel: "+(e.message||e),"error")}}exportExcelXmlFallback(e,t,a,r){const p=o=>{if(o==null)return"";let l=String(o);return typeof o=="string"&&/^[=+\-@]/.test(l)&&(l="'"+l),l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")},i=o=>{let l="<Table>";return o.forEach(g=>{l+="<Row>",g.forEach(y=>{l+=`<Cell><Data ss:Type="${typeof y=="number"?"Number":"String"}">${p(y)}</Data></Cell>`}),l+="</Row>"}),l+="</Table>",l},n=['<?xml version="1.0" encoding="UTF-8"?>','<?mso-application progid="Excel.Sheet"?>','<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',' xmlns:o="urn:schemas-microsoft-com:office:office"',' xmlns:x="urn:schemas-microsoft-com:office:excel"',' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"',' xmlns:html="http://www.w3.org/TR/REC-html40">','  <Worksheet ss:Name="Total Leaderboard">'+i(e)+"</Worksheet>",'  <Worksheet ss:Name="Gameweek Standings">'+i(t)+"</Worksheet>",'  <Worksheet ss:Name="Prize Summary">'+i(a)+"</Worksheet>","</Workbook>"].join(""),c=new Blob(["\uFEFF",n],{type:"application/vnd.ms-excel;charset=utf-8"}),m=URL.createObjectURL(c),s=document.createElement("a");s.href=m,s.download=r,document.body.appendChild(s),s.click(),document.body.removeChild(s),setTimeout(()=>URL.revokeObjectURL(m),1e3)}openDevCornerFromFooter(){if(typeof window<"u"&&window.location){const e=this.getAssetPrefix(),t=window.location.protocol==="file:";window.location.href=t?`${e}index.html#pricing`:`${e}#pricing`}}renderFooterCta(){const e=document.getElementById("site-footer"),t=document.getElementById("footer-brand-copy"),a=document.getElementById("footer-upsell-text"),r=document.getElementById("footer-upsell-btn");if(!e||!t||!a)return;let p=parseInt(e.dataset.leagues||"0",10),i=parseInt(e.dataset.teams||"0",10);if(!Number.isFinite(p)||p<=0){const m=this.multiData&&this.multiData.leagues||{};p=Object.keys(m).length}if(!Number.isFinite(i)||i<=0){const m=this.multiData&&this.multiData.leagues||{},s=new Set;Object.values(m).forEach(o=>{(o&&o.teams||[]).forEach(l=>{l&&l.entry_id!==void 0&&s.add(Number(l.entry_id))})}),i=s.size}const d=this.currentLang==="en",n=i>0?Math.floor(i).toLocaleString():"1,900+",c=p>0?p:9;t.textContent=d?`FPLSaWaDiKa • Live across ${c} mini-leagues (${n} teams)`:`FPLSaWaDiKa • ใช้งานจริง ${c} มินิลีก (${n} ทีม)`,a.textContent=d?"Launch for your league":"สนใจระบบสำหรับลีกของคุณ",r&&r.setAttribute("aria-label",d?"Explore pricing plans and launch FPLSaWaDiKa for your mini-league":"ดูแพ็กเกจราคาและเปิดใช้งาน FPLSaWaDiKa สำหรับมินิลีกของคุณ")}}function startApp(){window.app||(window.app=new StandaloneApp(MULTI_LEAGUE_DATA,LEAGUES_CONFIG,INITIAL_DEFAULT_LEAGUE),window.app.init())}typeof document<"u"&&(document.readyState==="complete"||document.readyState==="interactive"?startApp():document.addEventListener("DOMContentLoaded",startApp),document.addEventListener("keydown",Ce=>{if(Ce.key==="Escape"&&window.app){window.app.closeTeamModal(),window.app.closeProjectedPointsModal();return}if(Ce.key==="Tab"){const e=["team-modal","projected-points-modal"].map(d=>document.getElementById(d)).find(d=>d&&!d.classList.contains("hidden"));if(!e)return;const a=Array.from(e.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(d=>{const n=window.getComputedStyle(d);return n.display!=="none"&&n.visibility!=="hidden"&&(d.offsetWidth>0||d.offsetHeight>0||d.getClientRects().length>0)});if(a.length===0){Ce.preventDefault(),e.focus({preventScroll:!0});return}const r=a[0],p=a[a.length-1],i=document.activeElement;e.contains(i)?i===e?(Ce.preventDefault(),(Ce.shiftKey?p:r).focus({preventScroll:!0})):Ce.shiftKey&&i===r?(Ce.preventDefault(),p.focus({preventScroll:!0})):!Ce.shiftKey&&i===p&&(Ce.preventDefault(),r.focus({preventScroll:!0})):(Ce.preventDefault(),(Ce.shiftKey?p:r).focus({preventScroll:!0}))}}),window.exportToExcelFallback=function(){window.app&&typeof window.app.exportToExcel=="function"?window.app.exportToExcel():alert("ระบบกำลังโหลดข้อมูล กรุณารอสักครู่แล้วคลิกใหม่อีกครั้ง")}),function(){try{let v=function(){var k="th",x="desktop";try{(typeof localStorage<"u"&&localStorage.getItem("fpl_lang")==="en"||typeof document<"u"&&document.documentElement&&document.documentElement.lang==="en")&&(k="en")}catch{}try{var C=typeof navigator<"u"&&navigator.userAgent?navigator.userAgent:"",T=typeof navigator<"u"&&navigator.maxTouchPoints?navigator.maxTouchPoints:0,H=typeof screen<"u"?Math.min(screen.width||0,screen.height||0):0;/ipad|tablet|playbook|silk/i.test(C)||/macintosh/i.test(C)&&T>1||T>0&&H>=768&&H<=1366?x="tablet":(/mobi|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(C)||T>0&&H>0&&H<768)&&(x="mobile")}catch{}return{lang:k,device_hint:x}},I=function(k){typeof navigator<"u"&&navigator.sendBeacon&&navigator.sendBeacon(p,JSON.stringify(k))},L=function(){if(i){var k=Math.round((Date.now()-d)/1e3);if(k>=2&&k<=3600){var x={type:"dwell_time",league_id:i,duration:k};Object.keys(c.tabs).length>0&&(x.tabs=c.tabs),c.pitch_opens>0&&(x.pitch_opens=c.pitch_opens),c={tabs:{},pitch_opens:0},I(x)}d=Date.now()}};var D=v,h=I,$=L,Ce=typeof window<"u"&&window.location?String(window.location.hostname||"").toLowerCase():"",e=typeof window<"u"&&window.location?String(window.location.protocol||"").toLowerCase():"",t=e==="file:"||!Ce||Ce==="localhost"||Ce==="127.0.0.1"||Ce==="::1"||Ce==="[::1]"||Ce==="0.0.0.0"||Ce.endsWith(".local"),a=Ce.endsWith(".pages.dev")||Ce.endsWith(".workers.dev"),r=typeof resolveWorkerApiBase=="function"?resolveWorkerApiBase("https://api.fplsawadika.com"):{base:"https://api.fplsawadika.com",isOverride:!1,isNonProdTarget:!1};if((t||a)&&!r.isNonProdTarget){window._trackFeature=function(){},window._trackLeagueSwitch=function(){},window._reportClientError=function(){};return}var p=r.base+"/api/telemetry/event",i="",d=Date.now(),n=window.location.pathname.match(/\/(\d{4,8})\/?/);n&&n[1]?i=n[1]:window.app&&window.app.activeLeagueId?i=String(window.app.activeLeagueId):i=typeof INITIAL_DEFAULT_LEAGUE<"u"&&INITIAL_DEFAULT_LEAGUE?String(INITIAL_DEFAULT_LEAGUE):"40700";var c={tabs:{},pitch_opens:0};window._trackFeature=function(k,x){try{k==="tab"&&x?c.tabs[x]=(c.tabs[x]||0)+1:k==="pitch"&&(c.pitch_opens+=1)}catch{}};var m=30*60*1e3,s=!0;try{if(typeof localStorage<"u"){var o=parseInt(localStorage.getItem("fpl_visit_dedup_ts")||"0",10);!isNaN(o)&&Date.now()-o<m?s=!1:localStorage.setItem("fpl_visit_dedup_ts",String(Date.now()))}}catch{}var l=v();I({type:s?"page_view":"league_view",league_id:i,path:window.location.pathname,lang:l.lang,device_hint:l.device_hint}),document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"?L():d=Date.now()}),window.addEventListener("pagehide",L),window.addEventListener("beforeunload",L),window._trackLeagueSwitch=function(k){if(!(!k||String(k)===i)){L(),i=String(k),d=Date.now();var x=v();I({type:"league_view",league_id:i,path:"/"+i+"/",lang:x.lang,device_hint:x.device_hint})}};var g=0,y={};window._reportClientError=function(k){try{if(g>=3)return;var x=String(k||"js_error").toLowerCase();if(x!=="js_error"&&x!=="api_timeout"&&x!=="api_http"&&x!=="data_load"&&(x="js_error"),y[x])return;y[x]=!0,g+=1,I({type:"client_error",category:x,league_id:i})}catch{}},window.addEventListener("error",function(k){try{var x=k&&k.filename?String(k.filename):"",C=window.location&&window.location.hostname?window.location.hostname:"";if(x&&C&&x.indexOf(C)===-1&&x.indexOf("fplsawadika")===-1)return;window._reportClientError("js_error")}catch{}}),window.addEventListener("unhandledrejection",function(k){try{var x=k&&k.reason?String(k.reason.message||k.reason):"";/AbortError|timeout/i.test(x)?window._reportClientError("api_timeout"):window._reportClientError("js_error")}catch{}})}catch{}}();
