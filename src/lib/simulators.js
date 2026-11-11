const escapeHtml = str => String(str).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

'use strict';
/* Интерактивные тренажёры привязаны к конкретным страницам теории.
   Все расчёты происходят в браузере, без сервера и сторонних библиотек. */
const simulatorSpecs={
 'math:6':{
  type:'ellipse',label:'01 · Геометрия',title:'Как эксцентриситет меняет эллипс',desc:'Двигай ползунок. Звезда остаётся в одном из фокусов, а длина большой полуоси сохраняется.',
  controls:[['e','Эксцентриситет e',0,.9,.01,.4]],
  outputs:[['ecc','Эксцентриситет'],['minor','Малая полуось b'],['near','Перицентр'],['far','Апоцентр'],['area','Площадь / πa²']],
  formula:String.raw`\(b=a\sqrt{1-e^2},\;c=ae,\;r_{p}=a(1-e),\;r_a=a(1+e),\;S=\pi ab\)`},
 'math:7':{
  type:'combinatorics',label:'09 · Комбинаторика',title:'Порядок и повторения: сколько программ наблюдений?',desc:'Изменяй количество доступных фильтров n и длину серии k. Сравни выбор без повторений, сочетания и последовательности с повторениями.',
  controls:[['n','Число фильтров n',3,10,1,6],['k','Число кадров k',1,6,1,3]],
  outputs:[['n','Доступно фильтров'],['k','Длина серии'],['ordered','Порядок важен, без повторов'],['unordered','Порядок не важен, без повторов'],['repeat','Порядок важен, с повторами']],
  formula:String.raw`\(A_n^k=\frac{n!}{(n-k)!},\quad C_n^k=\binom nk,\quad N_{\text{с повторами}}=n^k\)`},
 'math:8':{
  type:'statistics',label:'10 · Статистика',title:'Как выброс меняет среднее и правило трёх сигм',desc:'Десять измерений близки к 10. Меняй одиннадцатое измерение и смотри, как меняются среднее, медиана, стандартное отклонение и проверка по 3σ.',
  controls:[['offset','Отклонение 11-го наблюдения',0,20,.5,8]],
  outputs:[['mean','Среднее'],['median','Медиана'],['std','Выборочное s'],['z','Отклонение в s'],['verdict','Критерий 3σ']],
  formula:String.raw`\(\bar x=\frac{1}{n}\sum x_i,\quad s=\sqrt{\frac{\sum(x_i-\bar x)^2}{n-1}},\quad z=\frac{x-\bar x}{s}\)`},
 'distances:0':{
  type:'distancescale',label:'11 · Расстояния',title:'Космическая линейка: от Луны до Галактики',
  desc:'Двигай ползунок по логарифмической шкале. Каждый шаг на 1 увеличивает расстояние в 10 раз. Сравни одновременно а.е., километры, световые годы, парсеки и время движения света.',
  controls:[['logAU','Логарифм расстояния log₁₀(d / а.е.)',-3,10,.1,0]],
  outputs:[['au','Расстояние в а.е.'],['km','Расстояние в км'],['ly','Расстояние в св. годах'],['pc','Расстояние в пк'],['lightTime','Время хода света']],
  formula:String.raw`\(1\,\mathrm{au}=149\,597\,870.7\,\mathrm{км},\quad 1\,\mathrm{pc}\approx206\,265\,\mathrm{au},\quad t=d/c\)`},
 'distances:1':{
  type:'angularsize',label:'12 · Угловые размеры',title:'Угловой диаметр: размер, расстояние и ошибка приближения',
  desc:'Меняй радиус сферического тела и расстояние до его центра. Сравни точный угол с малоугловой формулой. На схеме показаны касательные лучи без соблюдения масштаба.',
  controls:[['r','Радиус объекта R (км)',500,15000,1,1737],['logD','log₁₀ расстояния d (км)',4.3,8,.02,5.58]],
  outputs:[['radius','Радиус тела'],['distance','Расстояние до центра'],['exact','Точный угловой диаметр'],['approx','Малоугловое приближение'],['error','Относительная ошибка']],
  formula:String.raw`\(\theta_{\text{точн}}=2\arcsin(R/d),\qquad\theta_{\text{мал}}\approx 2R/d,\qquad\theta''\approx 206265\,(2R/d)\)`},
 'distances:2':{
  type:'parallax',label:'02 · Расстояния',title:'Годичный параллакс и расстояние до звезды',desc:'Измени параллакс в угловых секундах и посмотри, как меняется расстояние до звезды.',
  controls:[['p','Параллакс p (угл. секунды)',.02,1,.01,.1]],
  outputs:[['p','Параллакс'],['pc','Расстояние, пк'],['ly','Расстояние, св. лет'],['shift','Смещение за полгода']],
  formula:String.raw`\(d\,[\mathrm{пк}]=\frac{1}{p\,[\text{угл. сек}]},\quad \Delta\theta\approx 2p\)`},
 'distances:3':{
  type:'propermotion',label:'13 · Движение звёзд',title:'Собственное движение и поперечная скорость',desc:'Измени расстояние и угловое движение. Точки показывают положение звезды на фоне далёких объектов через 0, 10, 20 и 30 лет (схематический масштаб).',
  controls:[['mu','Собственное движение μ (mas/год)',0,1000,10,250],['d','Расстояние d (пк)',1,100,1,20]],
  outputs:[['mu','Угловое движение'],['d','Расстояние'],['v','Тангенциальная скорость'],['shift','Смещение за 30 лет']],
  formula:String.raw`\(v_t=4.74047\,\mu[\prime\prime/\mathrm{год}]\,d[\mathrm{пк}],\quad\Delta\theta=\mu\Delta t\)`},
 'coordinates:2':{
  type:'culmination',label:'03 · Координаты',title:'Высота звезды в верхней кульминации',desc:'Поменяй широту наблюдателя и склонение звезды. На схеме горизонт проведён через центр.',
  controls:[['phi','Широта φ (градусы)',-65,65,1,52],['delta','Склонение δ (градусы)',-70,70,1,25]],
  outputs:[['lat','Широта'],['dec','Склонение'],['alt','Высота h'],['visible','Видимость']],
  formula:String.raw`\(h_{\max}=90^\circ-|\varphi-\delta|\)`},
 'photometry:2':{
  type:'pogson',label:'04 · Фотометрия',title:'Закон Погсона: звёздная величина и поток',desc:'Измени разницу звёздных величин m₂−m₁. Отрицательная разница означает, что вторая звезда ярче.',
  controls:[['dm','Разность m₂ − m₁',-5,5,.1,2]],
  outputs:[['dm','Разность величин'],['ratio','Поток F₂/F₁'],['times','Сравнение блеска']],
  formula:String.raw`\(m_2-m_1=-2.5\log_{10}\frac{F_2}{F_1},\quad\frac{F_2}{F_1}=10^{-0.4(m_2-m_1)}\)`},
 'thermal:0':{
  type:'stefan',label:'05 · Излучение',title:'Как радиус и температура определяют светимость',desc:'Относительные параметры звезды сравниваются с Солнцем. Смотри, почему температура влияет сильнее, чем кажется.',
  controls:[['r','Радиус R/R☉',.5,3,.1,1],['t','Температура T/T☉',.5,2,.05,1]],
  outputs:[['r','Радиус'],['t','Температура'],['lum','Светимость L/L☉'],['power','Вклад температуры T⁴']],
  formula:String.raw`\(\frac{L}{L_\odot}=\left(\frac{R}{R_\odot}\right)^2\left(\frac{T}{T_\odot}\right)^4\)`},
 'mechanics:4':{
  type:'kepler',label:'06 · Орбиты',title:'Третий закон Кеплера в действии',desc:'Для планеты около Солнца, при пренебрежимо малой массе планеты, период в годах зависит от большой полуоси в а.е.',
  controls:[['a','Большая полуось a (а.е.)',.3,10,.1,2]],
  outputs:[['a','Полуось'],['period','Период обращения'],['speed','Средняя орбитальная скорость / земная'],['ratio','Отношение T²/a³']],
  formula:String.raw`\(T^2=a^3,\quad T=a^{3/2}\)`},
 'planets:0':{
  type:'phases',label:'07 · Планеты',title:'Фазовый угол и освещённая доля диска',desc:'Нулевая фаза означает полный освещённый диск, 90° — половину, 180° — почти тёмный диск. На схеме показана одна из возможных ориентаций.',
  controls:[['alpha','Фазовый угол α',0,180,5,60]],
  outputs:[['angle','Фазовый угол'],['fraction','Освещённая часть'],['phase','Описание фазы']],
  formula:String.raw`\(k=\frac{1+\cos\alpha}{2}\)`},
 'binaries:1':{
  type:'eclipse',label:'08 · Двойные звёзды',title:'Как формируется минимум затмения',desc:'Вторая звезда расположена перед первой. Сравни размеры и поверхностную яркость: глубина затмения зависит от перекрытой площади.',
  controls:[['s','Расстояние между центрами (в R₁)',0,2.5,.05,.5],['q','Радиус R₂/R₁',.3,1,.05,.6],['i','Поверхностная яркость I₂/I₁',.25,1.5,.05,.7]],
  outputs:[['flux','Доля наблюдаемого потока'],['depth','Ослабление блеска Δm'],['overlap','Перекрытая доля диска 1']],
  formula:String.raw`\(F=I_1\pi R_1^2+I_2\pi R_2^2-I_1A_{\mathrm{перекр}},\quad\Delta m=-2.5\log_{10}(F/F_0)\)`}
};

simulatorSpecs['coordinates:0']={type:'horizon',label:'14 · Небесная сфера',title:'Высота и азимут на местном небе',desc:'Меняй высоту и азимут светила. Схема показывает три локальные оси: восток, север, зенит. Горизонт изображён плоскостью в перспективе.',controls:[['h','Высота h (°)',-60,90,1,35],['A','Азимут A (°)',0,359,1,75]],outputs:[['height','Высота'],['az','Азимут'],['zenith','Зенитное расстояние'],['direction','Положение']],formula:String.raw`\(z=90^\circ-h,\qquad \mathbf u=(\cos h\sin A,\cos h\cos A,\sin h)\)`};

simulatorSpecs['coordinates:1']={type:'frames',label:'15 · Системы координат',title:'Экваториальные и эклиптические координаты',desc:'Измени эклиптическую долготу и широту. Схема показывает положение направления относительно небесного экватора и эклиптики; переход рассчитан поворотом на угол наклона эклиптики.',controls:[['lambda','Эклиптическая долгота λ (°)',0,360,1,45],['beta','Эклиптическая широта β (°)',-75,75,1,0],['eps','Наклон эклиптики ε (°)',0,35,.1,23.44]],outputs:[['lat','Эклиптическая широта β'],['lon','Эклиптическая долгота λ'],['decl','Склонение δ'],['ra','Прямое восхождение α']],formula:String.raw`\(\sin\delta=\sin\beta\cos\varepsilon+\cos\beta\sin\varepsilon\sin\lambda,\quad \alpha=\operatorname{atan2}(y_{\rm eq},x_{\rm eq})\)`};
function makeSimulator(key){
 const sim=simulatorSpecs[key];if(!sim)return '';
 const controls=sim.controls.map(([name,label,min,max,step,value])=>`<label class="lab-control" for="lab-${sim.type}-${name}"><span><strong>${escapeHtml(label)}</strong><b data-sim-current="${name}">${value}</b></span><input id="lab-${sim.type}-${name}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-sim-param="${name}" aria-label="${escapeHtml(label)}" /></label>`).join('');
 const outputs=sim.outputs.map(([name,label])=>`<div class="lab-metric"><span>${escapeHtml(label)}</span><strong data-sim-value="${name}">—</strong></div>`).join('');
 return `<section class="astro-lab" data-simulator="${sim.type}"><div class="lab-heading"><span class="lab-badge">✧ Интерактивная лаборатория</span><span class="lab-index">${sim.label}</span></div><h2>${sim.title}</h2><p class="lab-description">${sim.desc}</p><div class="lab-layout"><div class="lab-visual"><svg class="lab-svg" viewBox="0 0 600 250" role="img" aria-label="Интерактивная астрономическая схема" data-sim-canvas></svg><p class="lab-dynamic-note" data-sim-note aria-live="polite"></p></div><div class="lab-controls">${controls}<button class="lab-reset" type="button" data-sim-reset>↺ Исходные значения</button></div></div><div class="lab-metrics">${outputs}</div><div class="lab-equation"><span>Используемая формула</span><div>${sim.formula}</div></div><p class="lab-footnote">Иллюстрация схематична и может быть не в масштабе. Изменяй параметры и сравнивай результаты с формулой.</p></section>`;
}
const simN=(num,d=2)=>Number(num).toLocaleString('ru-RU',{maximumFractionDigits:d,minimumFractionDigits:0});
function simSet(lab,key,value){const el=lab.querySelector(`[data-sim-value="${key}"]`);if(el)el.textContent=String(value)}
function simGrid(){return `<defs><radialGradient id="labSun"><stop stop-color="#fff8cc"/><stop offset="0.45" stop-color="#f7ca6b"/><stop offset="1" stop-color="#bd7b26"/></radialGradient></defs><path d="M30 125H570 M300 15V235" stroke="#6b593e" stroke-width="1" stroke-dasharray="5 8" opacity=".6"/>`}
function simDisc(x,y,r,color){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`}
function simOverlap(r,R,d){
 if(d>=r+R)return 0;
 if(d<=Math.abs(R-r))return Math.PI*Math.min(r,R)**2;
 const x=(d*d+R*R-r*r)/(2*d*R),y=(d*d+r*r-R*R)/(2*d*r);
 const a=Math.acos(Math.max(-1,Math.min(1,x))),b=Math.acos(Math.max(-1,Math.min(1,y)));
 return R*R*a+r*r*b-0.5*Math.sqrt(Math.max(0,(-d+R+r)*(d+R-r)*(d-R+r)*(d+R+r)));
}
function refreshSimulator(lab){
 if(!lab)return;
 const type=lab.dataset.simulator,inputs=Object.fromEntries([...lab.querySelectorAll('[data-sim-param]')].map(i=>[i.dataset.simParam,Number(i.value)]));
 lab.querySelectorAll('[data-sim-current]').forEach(out=>{out.textContent=simN(inputs[out.dataset.simCurrent],2)});
 const canvas=lab.querySelector('[data-sim-canvas]'),note=lab.querySelector('[data-sim-note]');
 const gold='#e6b75b', pale='#fff0c4', blue='#88bdea';
 let svg=simGrid();let caption='';
 if(type==='frames'){
  const rad=Math.PI/180, lam=inputs.lambda*rad, beta=inputs.beta*rad, eps=inputs.eps*rad;
  const x=Math.cos(beta)*Math.cos(lam), y0=Math.cos(beta)*Math.sin(lam), z0=Math.sin(beta);
  const y=y0*Math.cos(eps)-z0*Math.sin(eps),z=y0*Math.sin(eps)+z0*Math.cos(eps);
  const dec=Math.asin(Math.max(-1,Math.min(1,z)))/rad;
  const ra=((Math.atan2(y,x)/rad)%360+360)%360;
  // Orthographic projection of two intersecting great circles in a tilted 3D perspective.
  const proj=(xx,yy,zz)=>[300+165*(.86*xx+.46*yy),130+165*(.22*xx-.30*yy-.72*zz)];
  const drawCircle=(fn,color,dash)=>{let pts=[];for(let i=0;i<=96;i++){const t=i*Math.PI*2/96;pts.push(proj(...fn(t)).map(v=>v.toFixed(2)).join(','))}return `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="5 5"':''}/>`};
  svg+=drawCircle(t=>[Math.cos(t),Math.sin(t),0],gold,false);
  svg+=drawCircle(t=>[Math.cos(t),Math.sin(t)*Math.cos(eps),Math.sin(t)*Math.sin(eps)],blue,true);
  const [sx,sy]=proj(x,y,z),[ox,oy]=proj(0,0,0);
  svg+=`<path d="M${ox} ${oy}L${sx} ${sy}" stroke="#fff3ce" stroke-width="3"/><circle cx="${sx}" cy="${sy}" r="7" fill="#fff1be"/><text x="365" y="30" fill="${gold}" font-size="16">Экватор</text><text x="365" y="51" fill="${blue}" font-size="16">Эклиптика</text>`;
  const hours=ra/15,hh=Math.floor(hours),mm=Math.round((hours-hh)*60),disp=mm===60?`${(hh+1)%24} ч 00 мин`:`${hh} ч ${String(mm).padStart(2,'0')} мин`;
  simSet(lab,'lat',simN(inputs.beta,1)+'°');simSet(lab,'lon',simN(inputs.lambda,1)+'°');simSet(lab,'decl',simN(dec,2)+'°');simSet(lab,'ra',disp+' ('+simN(ra,2)+'°)');
  caption='Жёлтая окружность — небесный экватор; голубая пунктирная — эклиптика. Схема перспективная, не предназначена для измерения углов по рисунку.';
 } else if(type==='horizon'){

  const h=inputs.h,A=inputs.A*Math.PI/180,hr=h*Math.PI/180;
  // Perspective projection: east toward lower right, north toward upper right, zenith up.
  const cx=300,cy=147,scale=107;
  const E=[0.92,0.30],N=[0.72,-0.45],Z=[0,-1.0];
  const project=(east,north,up)=>[cx+scale*(east*E[0]+north*N[0]),cy+scale*(east*E[1]+north*N[1]+up*Z[1])];
  const pathPts=[[1,0],[0,1],[-1,0],[0,-1]].map(([ee,nn])=>project(ee,nn));
  svg+=`<polygon points="${pathPts.map(p=>p.join(',')).join(' ')}" fill="#ad7b3030" stroke="#a58b63" stroke-width="1.5"/>`;
  svg+=`<path d="M${cx} ${cy}L${cx} 20" stroke="#d5ac68" stroke-width="2" stroke-dasharray="5 5"/>`;
  [[1,0,'E'],[0,1,'N'],[-1,0,'W'],[0,-1,'S']].forEach(([ee,nn,dir])=>{const [x,y]=project(ee,nn,0);svg+=`<text x="${x}" y="${y-5}" fill="#cabb9e" text-anchor="middle" font-size="16">${dir}</text>`});
  const ux=Math.cos(hr)*Math.sin(A),uy=Math.cos(hr)*Math.cos(A),uz=Math.sin(hr);
  const [x,y]=project(ux,uy,uz),[hx,hy]=project(ux,uy,0);
  svg+=`<path d="M${cx} ${cy}L${hx} ${hy}" stroke="#83714d" stroke-dasharray="5 6" stroke-width="2"/>`;
  svg+=`<path d="M${hx} ${hy}L${x} ${y}" stroke="#88bdea" stroke-dasharray="4 4" stroke-width="2"/>`;
  svg+=`<path d="M${cx} ${cy}L${x} ${y}" stroke="${gold}" stroke-width="3.5"/>`;
  svg+=simDisc(x,y,8,pale)+simDisc(cx,cy,4,'#a7a39a');
  svg+=`<text x="${Math.min(515,Math.max(45,x+13))}" y="${Math.max(21,Math.min(230,y-11))}" fill="${pale}" font-size="15">светило</text>`;
  svg+=`<text x="${cx+7}" y="24" fill="${gold}" font-size="14">зенит</text>`;
  simSet(lab,'height',simN(h,0)+'°');simSet(lab,'az',simN(inputs.A,0)+'°');simSet(lab,'zenith',simN(90-h,0)+'°');simSet(lab,'direction',h<0?'ниже горизонта':h===0?'на горизонте':'выше горизонта');
  caption=h===90?'В зените азимут физически не определён, хотя положение ползунка можно сохранить.':h<0?'Светило находится под математическим горизонтом.':'Азимут отсчитывается от севера через восток; схема дана в перспективе.';
 } else if(type==='ellipse'){

  const e=inputs.e,shape=Math.sqrt(1-e*e),cx=300,cy=125;
  const maxRx=205,maxRy=95;
  const a=Math.min(maxRx,maxRy/Math.max(shape,.001));
  const b=a*shape,c=a*e;
  const px=cx,py=cy-b;
  svg+=`<ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${b}" fill="#b9873620" stroke="${gold}" stroke-width="3"/>`;
  svg+=`<path d="M${cx-c} ${cy}H${cx+a} M${cx} ${cy}V${cy-b}" stroke="#a18b5b" stroke-dasharray="5 5"/>`;
  svg+=simDisc(cx-c,cy,12,'url(#labSun)')+simDisc(px,py,7,blue);
  svg+=`<text x="${Math.max(40,cx-c+15)}" y="118" fill="${pale}" font-size="15">звезда в фокусе</text><text x="${Math.min(545,px+18)}" y="${Math.max(18,py-10)}" fill="${blue}" font-size="13">планета</text>`;
  simSet(lab,'ecc',simN(e));simSet(lab,'minor',simN(shape,3)+' a');simSet(lab,'near',simN(1-e,3)+' a');simSet(lab,'far',simN(1+e,3)+' a');simSet(lab,'area',simN(shape*100,1)+' %');
  caption=e<.005?'Орбита круговая: эллипс автоматически уменьшен, чтобы полностью помещаться в окно симулятора.':`При e = ${simN(e)} звезда смещена из центра в фокус, а перицентр ближе апоцентра.`;
 } else if(type==='combinatorics'){
  const n=inputs.n,k=inputs.k;
  const factorial=t=>{let v=1;for(let j=2;j<=t;j++)v*=j;return v;};
  const valid=k<=n;
  const arrangements=valid?factorial(n)/factorial(n-k):0;
  const combinations=valid?arrangements/factorial(k):0;
  const repeated=n**k;
  svg+=`<text x="300" y="28" text-anchor="middle" fill="${pale}" font-size="17">Фильтры для серии наблюдений</text>`;
  for(let j=0;j<n;j++){
    const px=67+(j%5)*116,py=85+Math.floor(j/5)*83,sel=j<k;
    svg+=`<rect x="${px-28}" y="${py-27}" width="74" height="57" rx="11" fill="${sel?'#72531c':'#212122'}" stroke="${sel?gold:'#64553d'}" stroke-width="1.8"/>`;
    svg+=`<text x="${px+9}" y="${py+8}" fill="${sel?pale:'#ae9c7a'}" text-anchor="middle" font-size="20">${String.fromCharCode(65+j)}</text>`;
  }
  simSet(lab,'n',n);simSet(lab,'k',k);simSet(lab,'ordered',simN(arrangements,0));simSet(lab,'unordered',simN(combinations,0));simSet(lab,'repeat',simN(repeated,0));
  caption=valid?`Выделен один из допустимых наборов ${k} фильтров. Если переставить их местами, программа становится другой только при важном порядке.`:'Когда k больше n, выбрать k различных фильтров без повторения невозможно, но последовательности с повторами остаются допустимыми.';
 } else if(type==='statistics'){
  const offset=inputs.offset;
  const values=[9.8,10.1,10,10.2,9.9,10.1,9.8,10.2,10,9.9,10+offset];
  const n=values.length,mean=values.reduce((acc,v)=>acc+v,0)/n;
  const sorted=[...values].sort((a,b)=>a-b),median=sorted[(n-1)/2];
  const std=Math.sqrt(values.reduce((acc,v)=>acc+(v-mean)**2,0)/(n-1));
  const z=std>0?Math.abs(values[n-1]-mean)/std:0;
  const limit=Math.max(12,11+offset),y=v=>204-(v-9)*160/(limit-9);
  svg+=`<path d="M42 35V204H564" stroke="#827159" stroke-width="1.6" fill="none"/>`;
  svg+=`<text x="302" y="238" fill="${pale}" font-size="14" text-anchor="middle">Номер измерения</text>`;
  svg+=`<text x="56" y="27" fill="${gold}" font-size="14">Величина</text>`;
  values.forEach((v,i)=>{const px=71+i*44,py=y(v);svg+=`<circle cx="${px}" cy="${py}" r="${i===n-1?8:5}" fill="${i===n-1?'#f28f6c':blue}" stroke="#0e0b08" stroke-width="2"/>`;if(i===n-1){svg+=`<text x="${Math.min(540,px-20)}" y="${Math.max(20,py-13)}" fill="#f8b39b" font-size="13">11-я точка</text>`;}});
  const meanY=y(mean);
  svg+=`<path d="M45 ${meanY}H552" stroke="${gold}" stroke-width="2" stroke-dasharray="7 6"/>`;
  svg+=`<text x="46" y="${Math.max(16,meanY-7)}" fill="${gold}" font-size="13">среднее</text>`;
  simSet(lab,'mean',simN(mean,3));simSet(lab,'median',simN(median,3));simSet(lab,'std',simN(std,3));simSet(lab,'z',simN(z,2)+' s');simSet(lab,'verdict',z>3?'превышает 3σ':'не превышает 3σ');
  caption=z>3?'Последнее наблюдение выходит за 3s, рассчитанные по выборке. Это повод проверить измерение, а не автоматически удалять его.':'Даже сильный выброс может увеличить собственную оценку s и не выйти за пределы 3s: эффект маскирования.';
 } else if(type==='distancescale'){
  const logAU=inputs.logAU, au=Math.pow(10,logAU), km=au*149597870.7,ly=au/63241.077084,pc=au/(648000/Math.PI);
  const exponentGlyph=n=>String(n).replace(/[0123456789\-]/g,ch=>({'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'}[ch]||ch));
  const formatDistance=v=>{if(v===0)return '0';const exp=Math.floor(Math.log10(Math.abs(v)));return (exp>=5||exp<=-3)?simN(v/Math.pow(10,exp),3)+' × 10'+exponentGlyph(exp):simN(v,4)};
  const tSeconds=au*499.004783836;
  const timeLabel=tSeconds<60?simN(tSeconds,2)+' с':tSeconds<3600?simN(tSeconds/60,2)+' мин':tSeconds<86400?simN(tSeconds/3600,2)+' ч':tSeconds<31557600?simN(tSeconds/86400,2)+' сут':formatDistance(tSeconds/31557600)+' лет';
  const xFor=v=>64+(v+3)*472/13;
  svg+=`<path d="M64 125 H536" stroke="#af8650" stroke-width="3"/><text x="300" y="26" fill="${pale}" font-size="17" text-anchor="middle">Логарифмическая шкала астрономических расстояний</text>`;
  const marks=[[-2.59,'Луна','top'],[0,'1 а.е.','bottom'],[1.48,'Нептун','top'],[5.43,'Проксима','bottom'],[9.22,'Центр Галактики','top']];
  marks.forEach(([log,label,side])=>{const x=xFor(log);svg+=`<path d="M${x} 115V135" stroke="#bc9b66" stroke-width="1.6"/>`;
   const y=side==='top'?89:159;const anchor=x<105?'start':x>478?'end':'middle';svg+=`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#bba88e" font-size="13">${label}</text>`;});
  const px=xFor(logAU);
  svg+=`<path d="M${px} 60 V202" stroke="${gold}" stroke-width="2.4" stroke-dasharray="5 4"/><circle cx="${px}" cy="125" r="8" fill="${pale}" stroke="#a87729" stroke-width="2"/>`;
  svg+=`<text x="300" y="228" fill="${gold}" text-anchor="middle" font-size="17">Выбрано: ${formatDistance(au)} а.е.</text>`;
  simSet(lab,'au',formatDistance(au));simSet(lab,'km',formatDistance(km));simSet(lab,'ly',formatDistance(ly));simSet(lab,'pc',formatDistance(pc));simSet(lab,'lightTime',timeLabel);
  caption='Масштаб по горизонтали логарифмический: расстояния 1, 10 и 100 а.е. занимают одинаковые отрезки. Подписи — ориентиры, значения округлены.';
 } else if(type==='angularsize'){
  const r=inputs.r,d=Math.pow(10,inputs.logD),ratio=Math.min(.999999,r/d);
  const exact=2*Math.asin(ratio),approx=2*ratio;
  const exactDeg=exact*180/Math.PI,approxDeg=approx*180/Math.PI;
  const percent=Math.abs(exact-approx)/exact*100;
  const fmtAngle=deg=>deg>=1?simN(deg,4)+'°':deg>=1/60?simN(deg*60,3)+'′':simN(deg*3600,3)+'″';
  const lineGold='#e6b75b',obsX=100,cy=125,cx=432,visR=16+57*Math.pow(ratio,.35),L=cx-obsX;
  const tx=cx-visR*visR/L,ty=visR*Math.sqrt(1-visR*visR/(L*L));
  svg+=`<path d="M${obsX} ${cy} L${tx} ${cy-ty} M${obsX} ${cy} L${tx} ${cy+ty}" fill="none" stroke="${lineGold}" stroke-width="2.5"/>`;
  svg+=`<circle cx="${cx}" cy="${cy}" r="${visR}" fill="#aa79313c" stroke="${gold}" stroke-width="2.2"/>`;
  svg+=`<path d="M${obsX} ${cy} H${cx}" stroke="#a18b5b" stroke-dasharray="5 5" stroke-width="1.3"/>`;
  svg+=simDisc(obsX,cy,8,blue)+simDisc(cx,cy,3,pale);
  svg+=`<text x="${obsX}" y="${cy+28}" fill="${blue}" font-size="14" text-anchor="middle">наблюдатель</text>`;
  svg+=`<text x="${cx}" y="${Math.max(22,cy-visR-14)}" fill="${pale}" font-size="14" text-anchor="middle">сфера</text>`;
  svg+=`<text x="${(cx+obsX)/2}" y="${cy+18}" fill="#e3bc7d" font-size="14" text-anchor="middle">d</text>`;
  svg+=`<text x="${cx+visR+11}" y="${cy+5}" fill="#f3ce90" font-size="14">R</text>`;
  svg+=`<text x="300" y="27" fill="${pale}" font-size="17" text-anchor="middle">Точные касательные к сфере</text>`;
  simSet(lab,'radius',simN(r,0)+' км');simSet(lab,'distance',simN(d,0)+' км');
  simSet(lab,'exact',fmtAngle(exactDeg));simSet(lab,'approx',fmtAngle(approxDeg));simSet(lab,'error',simN(percent,4)+' %');
  caption='Угол на рисунке намеренно преувеличен ради читаемости. Числа рассчитаны по истинному отношению R/d; при d > R касательные существуют.';
 } else if(type==='parallax'){
  const p=inputs.p,d=1/p;
  svg+=`<path d="M200 207L300 34L400 207" stroke="${gold}" stroke-width="2.6" fill="none"/><path d="M185 207H415" stroke="#a6a199" stroke-width="2"/>`;
  svg+=simDisc(200,207,8,blue)+simDisc(400,207,8,blue)+simDisc(300,34,10,pale)+simDisc(300,207,12,'url(#labSun)');
  svg+=`<text x="300" y="17" fill="${pale}" font-size="16" text-anchor="middle">Далёкая звезда</text><text x="166" y="230" fill="${blue}" font-size="13">Земля A</text><text x="384" y="230" fill="${blue}" font-size="13">Земля B</text><text x="300" y="242" fill="${gold}" font-size="13" text-anchor="middle">Солнце</text><text x="340" y="135" fill="${gold}" font-size="17">p</text>`;
  simSet(lab,'p',simN(p,2)+'″');simSet(lab,'pc',simN(d,2));simSet(lab,'ly',simN(d*3.26156,2));simSet(lab,'shift',simN(2*p,2)+'″');
  caption='Геометрия специально преувеличена: настоящие углы параллакса чрезвычайно малы.';
 } else if(type==='propermotion'){
  const mu=inputs.mu,d=inputs.d,mas30=mu*30,vt=4.74047*(mu/1000)*d;
  svg+=`<path d="M35 190 H565" stroke="#806a45" stroke-width="1.5"/><text x="300" y="23" fill="${pale}" text-anchor="middle" font-size="16">Движение на фоне далёких звёзд</text>`;
  for(let i=0;i<12;i++){const x=55+((i*97)%490),y=40+((i*37)%125);svg+=`<circle cx="${x}" cy="${y}" r="2" fill="#7e92a5" opacity=".6"/>`}
  const spread=Math.min(400,mu*30/75), start=100;
  svg+=`<path d="M${start} 120 H${start+spread}" stroke="${gold}" stroke-width="2" stroke-dasharray="5 5"/>`;
  for(let i=0;i<4;i++){const x=start+spread*i/3;svg+=`<circle cx="${x}" cy="120" r="${i===3?10:6}" fill="${i===3?gold:blue}" opacity="${.45+.18*i}"/><text x="${x}" y="150" fill="${pale}" text-anchor="middle" font-size="12">${i*10} лет</text>`}
  simSet(lab,'mu',simN(mu,0)+' mas/год');simSet(lab,'d',simN(d,0)+' пк');simSet(lab,'v',simN(vt,2)+' км/с');simSet(lab,'shift',simN(mas30/1000,2)+'″');
  caption='Масштаб перемещения на рисунке условный. Реальный угловой сдвиг указан в таблице и не зависит от расстояния при заданном μ.';
 } else if(type==='culmination'){
  const phi=inputs.phi,delta=inputs.delta,h=90-Math.abs(phi-delta),angle=h*Math.PI/180;
  const x=300+128*Math.cos(angle),y=157-128*Math.sin(angle);
  svg+=`<path d="M80 157H520" stroke="${gold}" stroke-width="2.4"/><path d="M300 20V235" stroke="#856c49" stroke-dasharray="6 6"/>`;
  svg+=`<path d="M130 157A170 170 0 0 1 470 157" fill="none" stroke="#b9a471" stroke-width="1.8" opacity=".6"/>`;
  svg+=`<line x1="300" y1="157" x2="${x}" y2="${y}" stroke="${blue}" stroke-width="2.8"/>`+simDisc(x,y,8,pale);
  svg+=`<text x="84" y="178" fill="${gold}" font-size="14">горизонт</text><text x="307" y="25" fill="#d2ccb9" font-size="14">зенит</text><text x="${Math.min(520,x+12)}" y="${Math.max(21,y-11)}" fill="${pale}" font-size="14">звезда</text>`;
  simSet(lab,'lat',simN(phi)+'°');simSet(lab,'dec',simN(delta)+'°');simSet(lab,'alt',simN(h)+'°');simSet(lab,'visible',h>0?'над горизонтом':h===0?'на горизонте':'под горизонтом');
  caption=h<0?'Даже при верхней кульминации светило ниже горизонта.':'Показана геометрическая высота без учёта атмосферной рефракции.';
 } else if(type==='pogson'){
  const dm=inputs.dm,ratio=Math.pow(10,-.4*dm),m=Math.max(1,ratio),h1=175/m,h2=175*ratio/m;
  svg+=`<rect x="185" y="${218-h1}" width="80" height="${h1}" rx="7" fill="#9b8b70"/><rect x="330" y="${218-h2}" width="80" height="${h2}" rx="7" fill="${gold}"/>`;
  svg+=`<path d="M130 218H472" stroke="#7b6750" stroke-width="2"/><text x="225" y="241" text-anchor="middle" fill="#ccc1b0" font-size="14">Звезда 1</text><text x="370" y="241" text-anchor="middle" fill="${pale}" font-size="14">Звезда 2</text><text x="300" y="29" text-anchor="middle" fill="#f2d393" font-size="16">Потоки в относительных единицах</text>`;
  simSet(lab,'dm',simN(dm,1)+' m');simSet(lab,'ratio',simN(ratio,3));simSet(lab,'times',Math.abs(dm)<.001?'одинаковый блеск':ratio>1?'звезда 2 ярче в '+simN(ratio,1)+'×':'звезда 2 тусклее в '+simN(1/ratio,1)+'×');
  caption='Высота столбиков пропорциональна потоку, а не звёздной величине.';
 } else if(type==='stefan'){
  const r=inputs.r,t=inputs.t,L=r*r*Math.pow(t,4),solarR=32,starR=solarR*r;
  const warmth=t<.95?'#e6a16c':t>1.2?'#c7e2ff':'#fff1bd';
  svg+=simDisc(178,128,solarR,'url(#labSun)')+`<circle cx="402" cy="128" r="${starR}" fill="${warmth}" stroke="#ffffff77" stroke-width="1"/>`;
  svg+=`<text x="178" y="214" text-anchor="middle" fill="#d4c4a2" font-size="16">Солнце</text><text x="402" y="214" text-anchor="middle" fill="${pale}" font-size="16">Наша звезда</text><text x="300" y="27" text-anchor="middle" fill="#efd39b" font-size="16">Сравнение радиусов в масштабе</text>`;
  simSet(lab,'r',simN(r,2)+' R☉');simSet(lab,'t',simN(t,2)+' T☉');simSet(lab,'lum',simN(L,2)+' L☉');simSet(lab,'power',simN(Math.pow(t,4),2)+'×');
  caption='Цвет схематичен: настоящая температура определяет распределение энергии по спектру.';
 } else if(type==='kepler'){
  const a=inputs.a,T=Math.pow(a,1.5),v=1/Math.sqrt(a);
  const r=30+140*(Math.sqrt(a)-Math.sqrt(.3))/(Math.sqrt(10)-Math.sqrt(.3));
  svg+=`<circle cx="300" cy="126" r="112" fill="none" stroke="#ac8450" stroke-width="2" stroke-dasharray="5 6" opacity=".65"/><circle cx="300" cy="126" r="${r}" fill="none" stroke="${gold}" stroke-width="3"/>`;
  svg+=simDisc(300,126,12,'url(#labSun)')+simDisc(300+r,126,7,blue);
  svg+=`<text x="300" y="26" fill="${pale}" text-anchor="middle" font-size="15">Орбита (радиус показан условно)</text><text x="300" y="151" fill="#f4d28b" text-anchor="middle" font-size="13">Солнце</text>`;
  simSet(lab,'a',simN(a,1)+' а.е.');simSet(lab,'period',simN(T,2)+' года');simSet(lab,'speed',simN(v,2)+'×');simSet(lab,'ratio','1 (в выбранных единицах)');
  caption='Здесь для сравнения скоростей предполагаются круговые орбиты; для эллиптических скорость меняется вдоль орбиты.';
 } else if(type==='phases'){
  const alpha=inputs.alpha,cs=Math.cos(alpha*Math.PI/180),k=(1+cs)/2;
  svg+=`<circle cx="300" cy="123" r="85" fill="#26344b" stroke="#647185" stroke-width="2"/>`;
  let boundary=[],right=[];
  for(let j=0;j<=72;j++){
   const yy=-85+j*170/72,rad=Math.sqrt(Math.max(0,85*85-yy*yy));
   boundary.push([300-cs*rad,123+yy]);right.push([300+rad,123+yy]);
  }
  const coords=[...boundary,...right.reverse()];svg+=`<path d="M${coords.map(pt=>pt.map(x=>x.toFixed(2)).join(',')).join(' L')} Z" fill="#f1e9d3"/>`;
  svg+=`<text x="300" y="24" text-anchor="middle" fill="${pale}" font-size="17">Освещённая часть видимого диска</text>`;
  const phase=alpha<25?'почти полная фаза':alpha<80?'выпуклая фаза':alpha<100?'половина диска':alpha<165?'серп':'почти новая фаза';
  simSet(lab,'angle',simN(alpha)+'°');simSet(lab,'fraction',simN(k*100,1)+' %');simSet(lab,'phase',phase);
  caption='Показана геометрическая освещённость, без поправок на рассеяние и атмосферу.';
 } else if(type==='eclipse'){
  const d=inputs.s,r=inputs.q,i=inputs.i,A=simOverlap(1,r,d),baseline=Math.PI*(1+i*r*r),flux=1-A/baseline,mag=-2.5*Math.log10(flux),shadowPercent=A/Math.PI*100;
  svg+=`<circle cx="247" cy="125" r="69" fill="#f6cf75" stroke="#fce1a2" stroke-width="2"/>`;
  svg+=`<circle cx="${247+d*69}" cy="125" r="${r*69}" fill="#9cbedb" stroke="#e3eff9" stroke-width="2"/>`;
  svg+=`<text x="247" y="35" text-anchor="middle" fill="${gold}" font-size="15">Звезда 1 (позади)</text><text x="${Math.min(515,247+d*69)}" y="223" text-anchor="middle" fill="${blue}" font-size="15">Звезда 2 (спереди)</text>`;
  simSet(lab,'flux',simN(flux*100,1)+' %');simSet(lab,'depth',simN(mag,3)+' m');simSet(lab,'overlap',simN(shadowPercent,1)+' %');
  caption='Диски равномерно светятся; в расчёте нет потемнения к краю, отражения, изменения видимого размера и наклона орбиты.';
 }
 canvas.innerHTML=svg;note.textContent=caption;
}


simulatorSpecs['coordinates:0']={type:'horizon',label:'14 · Небесная сфера',title:'Высота и азимут на местном небе',desc:'Меняй высоту и азимут светила. Схема показывает три локальные оси: восток, север, зенит. Горизонт изображён плоскостью в перспективе.',controls:[['h','Высота h (°)',-60,90,1,35],['A','Азимут A (°)',0,359,1,75]],outputs:[['height','Высота'],['az','Азимут'],['zenith','Зенитное расстояние'],['direction','Положение']],formula:String.raw`\(z=90^\circ-h,\qquad \mathbf u=(\cos h\sin A,\cos h\cos A,\sin h)\)`};
simulatorSpecs['coordinates:1']={type:'frames',label:'15 · Системы координат',title:'Экваториальные и эклиптические координаты',desc:'Измени эклиптическую долготу и широту. Схема показывает положение направления относительно небесного экватора и эклиптики; переход рассчитан поворотом на угол наклона эклиптики.',controls:[['lambda','Эклиптическая долгота λ (°)',0,360,1,45],['beta','Эклиптическая широта β (°)',-75,75,1,0],['eps','Наклон эклиптики ε (°)',0,35,.1,23.44]],outputs:[['lat','Эклиптическая широта β'],['lon','Эклиптическая долгота λ'],['decl','Склонение δ'],['ra','Прямое восхождение α']],formula:String.raw`\(\sin\delta=\sin\beta\cos\varepsilon+\cos\beta\sin\varepsilon\sin\lambda,\quad \alpha=\operatorname{atan2}(y_{\rm eq},x_{\rm eq})\)`};
simulatorSpecs["mechanics:3"]=simulatorSpecs["mechanics:4"];delete simulatorSpecs["mechanics:4"];
export {simulatorSpecs,makeSimulator,refreshSimulator};
