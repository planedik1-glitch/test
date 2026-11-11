import React,{useMemo,useState} from 'react';
import {topics,problems} from '../data/core';
import {hintBank} from '../data/hints';
import {workshopsHtml} from '../data/workshops';
import {useMathJax} from '../lib/useMathJax';

const difficultyNames={easy:'Лёгкая',medium:'Средняя',hard:'Сложная'};
const focusNames={eclipses:'🌒 Затмения',spherical:'◉ Сферическая тригонометрия',mechanics:'⚙ Механика и орбиты'};
function ProblemCard({problem,done,onToggle,hintsUsed,onNextHint,onResetHints,solutionOpen,onToggleSolution}) {
  const hints=hintBank[problem.id]??[];
  const used=Math.min(hints.length,hintsUsed||0);
  const topic=topics.find(t=>t.id===problem.topic);
  const htmlAnswer=typeof problem.answer==='string'&&/^\s*</.test(problem.answer);
  return <article className="problem-card" id={`problem-${problem.id}`}>
    <div className="problem-head"><span className="tag">{topic?.name??problem.topic}</span><span className={`tag ${problem.difficulty}`}>{difficultyNames[problem.difficulty]??problem.difficulty}</span></div>
    {problem.track&&<div className="problem-head"><span className="tag">{focusNames[problem.track]??'Спецтема'}</span></div>}
    <h3>№ {problem.id}. {problem.title}</h3><p>{problem.question}</p>
    {Array.isArray(problem.parts)&&<><div className="ioaa-problem-meta"><span>✦ Большая задача IOAA</span><span>⏱ {problem.timeEstimate??'30–60 мин'}</span><span>{problem.parts.length} связанных пунктов</span></div><ol className="ioaa-problem-parts">{problem.parts.map((p,i)=><li key={i}>{p}</li>)}</ol></>}
    <div className="problem-hint-intro">Решай самостоятельно. Если застрял, открывай подсказки по одной.</div>
    {!!hints.length&&<div className="problem-hint-track" aria-label="Прогресс подсказок">{hints.map((_,i)=><span key={i} className={`hint-dot ${i<used?'hint-used':''}`}/>) }<span>{used} из {hints.length} подсказок</span></div>}
    {used>0&&<div className="hint-stack">{hints.slice(0,used).map((hint,i)=><div className="hint-step" key={i}><strong>Подсказка {i+1}</strong><p>{hint}</p></div>)}</div>}
    <div className="problem-actions">
      {used<hints.length&&<button className="btn secondary small" onClick={onNextHint}>✧ {used?'Следующая подсказка':'Получить подсказку'} {used+1}/{hints.length}</button>}
      {used===hints.length&&<button className={`btn small ${solutionOpen?'secondary':''}`} onClick={onToggleSolution}>{solutionOpen?'Скрыть решение':'Посмотреть полное решение'}</button>}
      {used>0&&<button className="btn ghost small" onClick={onResetHints}>Начать без подсказок</button>}
      <button className={`btn small ${done?'secondary':'ghost'}`} onClick={onToggle}>{done?'✓ Решено':'Отметить решённой'}</button>
    </div>
    {solutionOpen&&<div className="answer"><strong>Полное решение:</strong> {htmlAnswer?<div dangerouslySetInnerHTML={{__html:problem.answer}}/>:<div style={{whiteSpace:'pre-line'}}>{problem.answer}</div>}</div>}
  </article>;
}
export default function Practice({solved,onToggle,selectedTopic,onClearTopic}) {
  const [topic,setTopic]=useState('all');
  const [difficulty,setDifficulty]=useState('all');
  const [format,setFormat]=useState('all');
  const [focus,setFocus]=useState('all');
  const [shown,setShown]=useState(12);
  const [randomId,setRandomId]=useState(null);
  const [hintsUsed,setHintsUsed]=useState({});
  const [solutions,setSolutions]=useState([]);
  const activeTopic=selectedTopic??topic;
  const filtered=useMemo(()=>problems.filter(p=>(activeTopic==='all'||p.topic===activeTopic)&&(difficulty==='all'||p.difficulty===difficulty)&&(format==='all'||(format==='ioaa'?Array.isArray(p.parts):!Array.isArray(p.parts)))&&(focus==='all'||p.track===focus)),[activeTopic,difficulty,format,focus]);
  const displayed=randomId?filtered.filter(p=>p.id===randomId):filtered.slice(0,shown);
  const root=useMathJax([activeTopic,difficulty,format,focus,shown,randomId,solved.length,JSON.stringify(hintsUsed),solutions.join(',')].join('|'));
  function reset(){setTopic('all');onClearTopic();setDifficulty('all');setFormat('all');setFocus('all');setRandomId(null);setShown(12);}
  function changeTopic(v){setTopic(v);onClearTopic();setShown(12);setRandomId(null);}
  function pickRandom(){if(!filtered.length)return;const options=filtered.filter(p=>p.id!==randomId);const pool=options.length?options:filtered;setRandomId(pool[Math.floor(Math.random()*pool.length)].id);}
  function nextHint(id){setHintsUsed(prev=>({...prev,[id]:(prev[id]??0)+1}));}
  return <section className="section" id="practice" ref={root}>
    <section aria-label="Практические навыки IOAA" dangerouslySetInnerHTML={{__html:workshopsHtml}} />
    <div className="section-head"><div><h2>Банк олимпиадных задач</h2><p>{problems.length} тренировочная задача по {topics.length} разделам. Фильтруй по теме и сложности.</p></div><span className="pill">{problems.length} задач</span></div>
    <div className="toolbar">
      <div className="field"><label htmlFor="topicFilter">Тема</label><select id="topicFilter" value={activeTopic} onChange={e=>changeTopic(e.target.value)}><option value="all">Все темы</option>{topics.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></div>
      <div className="field"><label htmlFor="difficultyFilter">Сложность</label><select id="difficultyFilter" value={difficulty} onChange={e=>{setDifficulty(e.target.value);setRandomId(null);setShown(12);}}><option value="all">Любая сложность</option>{Object.entries(difficultyNames).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></div>
      <div className="field"><label htmlFor="typeFilter">Формат</label><select id="typeFilter" value={format} onChange={e=>{setFormat(e.target.value);setRandomId(null);setShown(12);}}><option value="all">Все задачи</option><option value="ioaa">Большие задачи IOAA</option><option value="short">Короткие задачи</option></select></div>
      <div className="field"><label htmlFor="focusFilter">Спецтема</label><select id="focusFilter" value={focus} onChange={e=>{setFocus(e.target.value);setRandomId(null);setShown(12);}}><option value="all">Все направления</option><option value="eclipses">🌒 Затмения</option><option value="spherical">◉ Сферическая тригонометрия</option><option value="mechanics">⚙ Механика и орбиты</option></select></div>
      <button className="btn" onClick={pickRandom}>🎲 Случайная задача</button><button className="btn ghost" onClick={reset}>Сбросить</button>
    </div>
    <div className="section-head"><div><h2 style={{fontSize:18}}>Доступные задачи</h2><p className="counter" aria-live="polite">Найдено: {filtered.length}. {randomId?'Показана случайная задача.':`Показано: ${displayed.length}.`}</p></div></div>
    <div className="intro"><strong>Как работать:</strong> сначала попробуй решить задачу самостоятельно. После подсказок можно открыть решение. Отметка «Решено» — только личная запись в браузере, она не является проверкой ответа и не начисляет XP.</div>
    <div className="problem-list">{displayed.length?displayed.map(p=><ProblemCard key={p.id} problem={p} done={solved.includes(p.id)} onToggle={()=>onToggle(p.id)} hintsUsed={hintsUsed[p.id]} onNextHint={()=>nextHint(p.id)} onResetHints={()=>{setHintsUsed(x=>({...x,[p.id]:0}));setSolutions(x=>x.filter(id=>id!==p.id));}} solutionOpen={solutions.includes(p.id)} onToggleSolution={()=>setSolutions(x=>x.includes(p.id)?x.filter(id=>id!==p.id):[...x,p.id])}/>):<div className="empty">По этим фильтрам задач пока нет.</div>}
      {!randomId&&shown<filtered.length&&<div className="more-problems"><button className="btn secondary" onClick={()=>setShown(n=>n+12)}>Показать ещё 12 задач</button></div>}
    </div>
  </section>;
}
