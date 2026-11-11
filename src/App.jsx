import React,{useEffect,useMemo,useState} from 'react';
import {topics,problems} from './data/core';
import {legacyLessonMap} from './data/legacyMap';
import {initialCompleted,usePersistentArray} from './lib/progress';
import General from './components/General';
import Theory from './components/Theory';
import Practice from './components/Practice';
import Lesson from './components/Lesson';

function getRoute() {
  const raw=decodeURIComponent(location.hash.replace(/^#/,''));
  if(raw.startsWith('lesson/')){
    const bits=raw.split('/');
    if(bits.length===3){
      const id=bits[1]; let index=bits[2];
      if(/^\d+$/.test(index)){
        const remapped=legacyLessonMap[`${id}:${index}`];
        if(remapped)index=`g${remapped.split(':')[1]}`;
      }
      if(/^g\d+$/.test(index))return {kind:'lesson',topicId:id,index:Number(index.slice(1))};
    }
  }
  return {kind:['general','theory','practice'].includes(raw)?raw:'general'};
}
export default function App() {
  const [route,setRoute]=useState(getRoute);
  const [solved,setSolved]=usePersistentArray('astropath_solved');
  const [completed,setCompleted]=usePersistentArray('astropath_lessons_v2',initialCompleted);
  const [selectedTopic,setSelectedTopic]=useState(null);
  useEffect(()=>{
    const update=()=>{setRoute(getRoute());window.scrollTo({top:0,behavior:'instant'});};
    window.addEventListener('hashchange',update);window.addEventListener('popstate',update);
    return ()=>{window.removeEventListener('hashchange',update);window.removeEventListener('popstate',update);};
  },[]);
  const active=route.kind==='lesson'?'theory':route.kind;
  const toggleLesson=id=>setCompleted(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleSolved=id=>setSolved(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const practiceTopic=id=>{setSelectedTopic(id);location.hash='#practice';setRoute(getRoute());};
  useEffect(()=>{document.title=route.kind==='lesson'?document.title:'AstroPath — Олимпиадная астрономия';},[route.kind]);
  return <>
    <header className="header"><div className="wrap header-inner">
      <a href="#general" className="brand" aria-label="AstroPath — главная"><div className="brand-icon">✦</div>Astro<span>Path</span></a>
      <nav className="nav" aria-label="Основная навигация">
        {[['general','Общее'],['theory','Теория'],['practice','Практика']].map(([id,label])=><a key={id} href={`#${id}`} className={active===id?'active':''} aria-current={active===id?'page':undefined}>{label}</a>)}
      </nav>
    </div></header>
    <noscript>Для работы AstroPath требуется JavaScript.</noscript>
    <main className="wrap" aria-live="off">
      {route.kind==='general'&&<General solvedCount={solved.length}/>}
      {route.kind==='theory'&&<Theory completed={completed} onToggle={toggleLesson} onPracticeTopic={practiceTopic}/>}
      {route.kind==='practice'&&<Practice solved={solved} onToggle={toggleSolved} selectedTopic={selectedTopic} onClearTopic={()=>setSelectedTopic(null)}/>}
      {route.kind==='lesson'&&<Lesson key={`${route.topicId}:${route.index}`} topicId={route.topicId} index={route.index} completed={completed} onToggle={toggleLesson} onPracticeTopic={practiceTopic}/>}
    </main>
    <footer className="footer"><div className="wrap"><span>✦ AstroPath</span><span>Теория · практика · интерактивная лаборатория</span><span className="footer-demo">Демо: аккаунты и оплата ещё не подключены</span></div></footer>
  </>;
}
