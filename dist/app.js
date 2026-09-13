const diningLayout=document.querySelector('.dining-layout');
let diningScale=1;
function sizeDining(){const scene=document.querySelector('.scene');const w=scene.clientWidth,h=scene.clientHeight;const portrait=w/h<.85;diningLayout.classList.toggle('portrait',portrait);diningScale=Math.min(w/(portrait?800:1312),h/(portrait?1300:850));diningLayout.style.setProperty('--dining-scale',diningScale)}
sizeDining();
addEventListener('resize',sizeDining);
const dishes=[{name:'油麥遇上鯪魚',sub:'豆豉鯪魚炒油麥菜',desc:'爽口油麥，遇上惹味鯪魚。<br>平平常常，又想添飯。',ingredients:'準備：油麥菜、豆豉鯪魚、蒜頭。',steps:['油麥菜洗淨瀝乾，切段；蒜頭切碎，鯪魚拆成小塊。','熱鍋下少量油，炒香蒜末，先放較厚的菜梗，再加入菜葉。','加入鯪魚和豆豉，快速翻炒至菜熟，試味後上碟。']},{name:'涼瓜苦盡甘來',sub:'豆豉鯪魚炒苦瓜',desc:'一點甘苦，一點鹹香。<br>日子有滋味，飯要趁熱食。',ingredients:'準備：苦瓜、豆豉鯪魚、蒜頭。',steps:['苦瓜去籽切薄片；鯪魚拆小塊，蒜頭切碎。','熱鍋炒香蒜末，加入苦瓜翻炒，淋少量水，煮至喜歡的軟硬度。','加入豆豉和鯪魚炒勻，試味後上碟。']},{name:'惹味有魚通菜',sub:'豆豉鯪魚炒通菜',desc:'通菜脆卜卜，豆豉香噴噴。<br>有魚有餘，今晚食多啖。',ingredients:'準備：通菜、豆豉鯪魚、蒜頭。',steps:['通菜洗淨瀝乾，菜梗和菜葉分開；鯪魚拆小塊。','熱鍋炒香蒜末和少量豆豉，先炒菜梗，再放菜葉。','加入鯪魚快速炒勻，炒至通菜熟透，趁熱上碟。']}];
const $=s=>document.querySelector(s);let current=0,stamps=[];try{stamps=JSON.parse(localStorage.getItem('dace-free-stamps')||'[]').filter(s=>Number.isFinite(s.x)&&Number.isFinite(s.y)&&s.x>=0&&s.x<=1&&s.y>=0&&s.y<=1&&'ABC'.includes(s.letter)).slice(-150)}catch{}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#dots').innerHTML=dishes.map((d,i)=>`<button class="dot ${i===0?'active':''}" data-index="${i}" aria-label="轉到${d.name}">0${i+1}</button>`).join('');
function renderStamps(animateNew=false){const layer=$('#free-stamps');while(layer.children.length>stamps.length)layer.lastElementChild.remove();stamps.forEach((s,i)=>{let mark=layer.children[i];if(!mark){mark=document.createElement('span');mark.className='free-imprint';if(animateNew&&i===stamps.length-1)mark.classList.add('stamp-new');layer.append(mark)}mark.textContent=s.letter;mark.style.left=s.x*100+'%';mark.style.top=s.y*100+'%';mark.style.setProperty('--tilt',s.angle+'deg')});try{localStorage.setItem('dace-free-stamps',JSON.stringify(stamps))}catch{}}
const paper=$('#stamp-paper');let point={x:.5,y:.5};function addStamp(x,y){stamps.push({x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y)),letter:'ABC'[current],angle:Math.random()*24-12});if(stamps.length>150)stamps.shift();renderStamps(true);notify('蓋好喇！')}
paper.onclick=e=>{if(suppressStamp){suppressStamp=false;return}if(e.detail===0)addStamp(point.x,point.y);else addStamp(e.offsetX/paper.clientWidth,e.offsetY/paper.clientHeight)};
paper.onpointermove=e=>{point={x:e.offsetX/paper.clientWidth,y:e.offsetY/paper.clientHeight};$('#cursor').style.left=e.clientX+'px';$('#cursor').style.top=e.clientY+'px';$('#cursor').textContent='ABC'[current];if(e.pointerType==='mouse')$('#cursor').style.display='flex'};
paper.onpointerleave=()=>{$('#cursor').style.display='none';$('#cursor').classList.remove('pressed')};paper.onpointerdown=()=>$('#cursor').classList.add('pressed');paper.onpointerup=()=>$('#cursor').classList.remove('pressed');
paper.onkeydown=e=>{if(e.key==='Backspace'||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z')){e.preventDefault();stamps.pop();renderStamps();notify('已撤銷上一個章')}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();point.x=Math.max(.02,Math.min(.98,point.x+(e.key==='ArrowLeft'?-.05:e.key==='ArrowRight'?.05:0)));point.y=Math.max(.02,Math.min(.98,point.y+(e.key==='ArrowUp'?-.05:e.key==='ArrowDown'?.05:0)))}};
let toastTimer;function notify(s){$('#toast').textContent=s;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),1800)}
function setCurrent(i){current=i;document.querySelectorAll('.row').forEach((r,j)=>r.classList.toggle('active',i===j));document.querySelectorAll('.dot').forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-current',i===j?'true':'false')});$('#dish-number').textContent=`0${i+1}`;$('#dish-title').textContent=dishes[i].name;$('#dish-desc').innerHTML=dishes[i].desc;$('#prev').disabled=i===0;$('#next').disabled=i===2}
function go(i){i=Math.max(0,Math.min(2,i));const length=$('#journey').offsetHeight-innerHeight;scrollTo({top:$('#journey').offsetTop+length*(i+.35)/2.7,behavior:reduce?'instant':'smooth'})}
let ticking=false;function scroll(){const length=$('#journey').offsetHeight-innerHeight;let step=Math.max(0,Math.min(2,(scrollY-$('#journey').offsetTop)/length*2.7-.35));let n=Math.floor(step),fraction=step-n;let eased=fraction<.3?0:(fraction-.3)/.7;eased=eased*eased*(3-2*eased);let rotation=n+eased;const active=Math.round(rotation);if(active!==current)setCurrent(active);document.documentElement.style.setProperty('--angle',`${-120*(reduce?active:rotation)}deg`);ticking=false}addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(scroll)}},{passive:true});addEventListener('resize',scroll);
document.querySelectorAll('.dot').forEach(b=>b.onclick=()=>go(+b.dataset.index));
$('#prev').onclick=()=>go(current-1);$('#next').onclick=()=>go(current+1);$('#back').onclick=()=>go(0);$('.brand').onclick=e=>{e.preventDefault();go(0)};$('#reset').onclick=()=>{stamps=[];renderStamps();notify('印章已清空。')};
$('#recipe').onclick=()=>{$('#recipe-title').textContent=dishes[current].name;$('#ingredients').textContent=dishes[current].ingredients;$('#steps').innerHTML=dishes[current].steps.map(s=>`<li>${s}</li>`).join('');$('#dialog').showModal()};$('.close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog')){const r=$('#dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#dialog').close()}};
renderStamps();setCurrent(0);scroll();

// Drag the paper to reposition it; a short click still stamps at the contact point.
const card=$('.original-order'),rotateHandle=$('.rotate-card');let cardPose={x:0,y:0,angle:-4},gesture=null,suppressStamp=false;
try{const saved=JSON.parse(localStorage.getItem('dace-card-pose'));if(saved&&['x','y','angle'].every(k=>Number.isFinite(saved[k])))cardPose=saved}catch{}
function applyPose(){card.style.setProperty('--card-x',cardPose.x+'px');card.style.setProperty('--card-y',cardPose.y+'px');card.style.setProperty('--card-angle',cardPose.angle+'deg');if(typeof window.validateCardPose==='function')window.validateCardPose()}
function savePose(){try{localStorage.setItem('dace-card-pose',JSON.stringify(cardPose))}catch{}}
applyPose();
paper.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();paper.focus({preventScroll:true});gesture={id:e.pointerId,x:e.clientX,y:e.clientY,startX:cardPose.x,startY:cardPose.y,moved:false};paper.setPointerCapture(e.pointerId)});
paper.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;let dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)>5)gesture.moved=true;if(gesture.moved){cardPose.x=gesture.startX+dx/diningScale;cardPose.y=gesture.startY+dy/diningScale;applyPose();card.classList.add('moving');$('#cursor').style.display='none'}});
function finishDrag(e){if(!gesture||gesture.id!==e.pointerId)return;suppressStamp=gesture.moved;gesture=null;card.classList.remove('moving');savePose();if(paper.hasPointerCapture(e.pointerId))paper.releasePointerCapture(e.pointerId)}
paper.addEventListener('pointerup',finishDrag);paper.addEventListener('pointercancel',e=>{finishDrag(e);suppressStamp=false});
let turning=null;rotateHandle.onpointerdown=e=>{e.preventDefault();const r=card.getBoundingClientRect();turning={id:e.pointerId,cx:r.x+r.width/2,cy:r.y+r.height/2,angle:cardPose.angle,start:Math.atan2(e.clientY-(r.y+r.height/2),e.clientX-(r.x+r.width/2))};rotateHandle.setPointerCapture(e.pointerId);$('#cursor').style.display='none'};
rotateHandle.onpointermove=e=>{if(!turning)return;let a=Math.atan2(e.clientY-turning.cy,e.clientX-turning.cx)-turning.start;cardPose.angle=turning.angle+a*180/Math.PI;applyPose()};
rotateHandle.onpointerup=e=>{turning=null;savePose();if(rotateHandle.hasPointerCapture(e.pointerId))rotateHandle.releasePointerCapture(e.pointerId)};rotateHandle.onpointercancel=()=>{turning=null;savePose()};
rotateHandle.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();cardPose.angle=e.key==='Home'?-4:cardPose.angle+(e.key==='ArrowLeft'?-5:5);applyPose();savePose()}};

// A dedicated move handle makes repositioning discoverable without adding ink.
const moveHandle=$('.move-card');
moveHandle.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();gesture={id:e.pointerId,x:e.clientX,y:e.clientY,startX:cardPose.x,startY:cardPose.y,moved:false};moveHandle.setPointerCapture(e.pointerId);card.classList.add('moving');$('#cursor').style.display='none'};
moveHandle.onpointermove=e=>{if(!gesture||gesture.id!==e.pointerId)return;cardPose.x=gesture.startX+(e.clientX-gesture.x)/diningScale;cardPose.y=gesture.startY+(e.clientY-gesture.y)/diningScale;applyPose()};
moveHandle.onpointerup=e=>{gesture=null;card.classList.remove('moving');savePose();if(moveHandle.hasPointerCapture(e.pointerId))moveHandle.releasePointerCapture(e.pointerId)};
moveHandle.onpointercancel=()=>{gesture=null;card.classList.remove('moving');savePose()};
moveHandle.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){cardPose.x=0;cardPose.y=0}else{let amount=e.shiftKey?20:5;cardPose.x+=(e.key==='ArrowRight'?amount:e.key==='ArrowLeft'?-amount:0);cardPose.y+=(e.key==='ArrowDown'?amount:e.key==='ArrowUp'?-amount:0)}applyPose();savePose()};

// Collision constraints use screen-space footprints, so rotation and responsive
// scaling are included. Cloth objects stay outside the moving glass footprint.
const resetUtensils=[];
const movablePieces=[...document.querySelectorAll('.bowl-piece,.cup-piece,.sticks-piece')];
const padding=7;
function bounds(el){return el.getBoundingClientRect()}
function intersects(a,b){return a.left<b.right+padding&&a.right>b.left-padding&&a.top<b.bottom+padding&&a.bottom>b.top-padding}
function touchesGlass(r){const t=bounds($('.table')),cx=t.x+t.width/2,cy=t.y+t.height/2;const x=Math.max(r.left,Math.min(cx,r.right)),y=Math.max(r.top,Math.min(cy,r.bottom));return Math.hypot(x-cx,y-cy)<t.width/2+padding}
function validCloth(el){const r=bounds(el),scene=bounds($('.scene'));if(r.left<scene.left+4||r.right>scene.right-4||r.top<scene.top+4||r.bottom>scene.bottom-4)return false;if(touchesGlass(r))return false;return [card,...movablePieces].every(other=>other===el||!intersects(r,bounds(other)))}
let acceptedCard={...cardPose};
function writeCardPose(){card.style.setProperty('--card-x',cardPose.x+'px');card.style.setProperty('--card-y',cardPose.y+'px');card.style.setProperty('--card-angle',cardPose.angle+'deg')}
window.validateCardPose=()=>{if(validCloth(card))acceptedCard={...cardPose};else{cardPose={...acceptedCard};writeCardPose()}};
// Repair an older saved arrangement that allowed the paper to cover a cup.
if(!validCloth(card)){cardPose={x:0,y:0,angle:-4};writeCardPose();acceptedCard={...cardPose};savePose()}
movablePieces.forEach((el,index)=>{
 let pose={x:0,y:0},accepted={...pose},drag=null;
 const key='dace-utensil-'+index;
 function paint(){el.style.setProperty('--item-x',pose.x+'px');el.style.setProperty('--item-y',pose.y+'px')}
 function persist(){try{localStorage.setItem(key,JSON.stringify(pose))}catch{}}
 try{const old=JSON.parse(localStorage.getItem(key));if(old&&Number.isFinite(old.x)&&Number.isFinite(old.y)){pose=old;paint();if(!validCloth(el)){pose={x:0,y:0};paint()}accepted={...pose}}}catch{}
 resetUtensils.push(()=>{pose={x:0,y:0};accepted={...pose};paint();persist()});
 el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',['拖動移動碗碟及湯匙','拖動移動茶杯','拖動移動筷子'][index]);
 function move(dx,dy){const scale=(parseFloat(getComputedStyle($('.place-setting')).scale)||1)*diningScale;const steps=Math.ceil(Math.hypot(dx,dy)/4)||1;for(let i=0;i<steps;i++){pose={x:accepted.x+dx/steps/scale,y:accepted.y+dy/steps/scale};paint();if(validCloth(el))accepted={...pose};else{pose={...accepted};paint();break}}}
 el.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();el.focus({preventScroll:true});drag={id:e.pointerId,x:e.clientX,y:e.clientY};el.setPointerCapture(e.pointerId);el.classList.add('dragging');$('#cursor').style.display='none'};
 el.onpointermove=e=>{if(!drag)return;move(e.clientX-drag.x,e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY};
 el.onpointerup=e=>{drag=null;el.classList.remove('dragging');persist();if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId)};
 el.onpointercancel=()=>{drag=null;el.classList.remove('dragging');persist()};
 el.onkeydown=e=>{const v={ArrowLeft:[-5,0],ArrowRight:[5,0],ArrowUp:[0,-5],ArrowDown:[0,5]}[e.key];if(v){e.preventDefault();move(...v);persist()}};
});
// The teapot is positioned in rotor coordinates; its entire future orbit must
// remain inside the glass and clear of all three serving plates.
const pot=$('.pot-piece');let potOffset=null,potDrag=null;
function potBase(){const w=$('.table').clientWidth;return w>1300?510:w<1000?315:440}
function potXY(){return potOffset||{x:-potBase()/2,y:-potBase()*Math.sqrt(3)/2}}
function paintPot(){const p=potXY();pot.style.transform=`translate(-50%,-50%) translate(${p.x}px,${p.y}px) rotate(-120deg)`}
function validPot(p){const t=$('.table'),w=t.clientWidth,pr=w<1000?85:125;const orbit=w>1300?370:w<1000?220:335;const dr=$('.dish').clientWidth*.46;if(Math.hypot(p.x,p.y)+pr>w/2-12)return false;for(let i=0;i<3;i++){const a=i*2*Math.PI/3;if(Math.hypot(p.x+orbit*Math.cos(a),p.y+orbit*Math.sin(a))<dr+pr+8)return false}return true}
pot.setAttribute('role','button');pot.setAttribute('aria-label','拖動移動茶壺');pot.tabIndex=0;$('.table-area').removeAttribute('aria-hidden');
paintPot();
pot.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();potDrag={id:e.pointerId,x:e.clientX,y:e.clientY};pot.setPointerCapture(e.pointerId)};
pot.onpointermove=e=>{if(!potDrag)return;const a=parseFloat(document.documentElement.style.getPropertyValue('--angle'))*Math.PI/180||0;const dx=(e.clientX-potDrag.x)/diningScale,dy=(e.clientY-potDrag.y)/diningScale;const steps=Math.ceil(Math.hypot(dx,dy)/4)||1;for(let i=0;i<steps;i++){const p=potXY(),next={x:p.x+(dx*Math.cos(a)+dy*Math.sin(a))/steps,y:p.y+(-dx*Math.sin(a)+dy*Math.cos(a))/steps};if(!validPot(next))break;potOffset=next;paintPot()}potDrag.x=e.clientX;potDrag.y=e.clientY};
pot.onpointerup=e=>{potDrag=null;if(pot.hasPointerCapture(e.pointerId))pot.releasePointerCapture(e.pointerId)};pot.onpointercancel=()=>potDrag=null;
addEventListener('resize',()=>{potOffset=null;paintPot()});

// Recheck saved positions together, including after a portrait/landscape change.
function repairDining(){if([card,...movablePieces].some(el=>!validCloth(el))){resetUtensils.forEach(reset=>reset());cardPose={x:0,y:0,angle:-4};acceptedCard={...cardPose};writeCardPose();savePose()}}
repairDining();
addEventListener('resize',repairDining);
