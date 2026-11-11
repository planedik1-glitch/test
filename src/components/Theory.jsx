import React, {useMemo, useState} from 'react';
import {topics} from '../data/core';
import {totalLessons} from '../lib/progress';
import {useMathJax} from '../lib/useMathJax';

export default function Theory({completed,onToggle,onPracticeTopic}) {
  const [search,setSearch] = useState('');
  const [expanded,setExpanded] = useState([]);
  const found = useMemo(() => {
    const q=search.toLocaleLowerCase('ru').trim();
    return topics.filter(t => !q || `${t.name} ${t.desc} ${t.points.join(' ')} ${t.details.flat().join(' ')}`.toLocaleLowerCase('ru').includes(q));
  },[search]);
  const completedSet=new Set(completed);
  const percent=Math.round(completed.length/totalLessons*100);
  const root=useMathJax(search+'|'+expanded.join(',')+'|'+completed.length);
  function toggle(id) {setExpanded(x=>x.includes(id)?x.filter(v=>v!==id):[...x,id]);}
  return <section className="section" id="theory" ref={root}>
    <div className="section-head"><div><h2>Теоретическая программа</h2><p>{topics.length} разделов, {totalLessons} уроков</p></div><span className="pill">{topics.length} тем</span></div>
    <div className="intro"><strong>Как учиться:</strong> разделы расположены последовательно, а близкие вопросы объединены в крупные уроки. Выбирай урок и отмечай изученное. Отметки сохраняются в этом браузере до подключения аккаунтов.</div>
    <div className="global-progress"><div className="progress-header"><strong>Прогресс по программе</strong><span>{completed.length} из {totalLessons} уроков · {percent}%</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${percent}%`}} /></div></div>
    <div className="topic-searchbar"><input className="search-input" aria-label="Поиск по урокам и вопросам" placeholder="Поиск по урокам и вопросам..." type="search" value={search} onChange={e=>setSearch(e.target.value)}/>
      <button className="btn secondary small" onClick={()=>setExpanded(topics.map(t=>t.id))}>Раскрыть все</button>
      <button className="btn ghost small" onClick={()=>{setExpanded([]);setSearch('');}}>Свернуть все</button>
    </div>
    <div className="topic-list">{found.length?found.map((t,i)=>{
      const q=search.toLocaleLowerCase('ru').trim(),isOpen=expanded.includes(t.id)||!!q;
      const selected=t.points.map((title,index)=>({title,index})).filter(x=>!q||t.name.toLocaleLowerCase('ru').includes(q)||`${x.title} ${t.details[x.index].join(' ')}`.toLocaleLowerCase('ru').includes(q));
      const done=t.points.filter((_,index)=>completedSet.has(`${t.id}:${index}`)).length;
      return <article className="topic-card react-topic" key={t.id}>
        <div className="topic-num">{String(topics.indexOf(t)+1).padStart(2,'0')}</div>
        <div className="topic-content">
          <button type="button" className="topic-title-button" aria-expanded={isOpen} onClick={()=>toggle(t.id)}><h3>{t.name}</h3><span>{isOpen?'−':'＋'}</span></button>
          <p>{t.desc}</p><div className="topic-meta"><span className="tag">{t.points.length} уроков</span><span className="tag">{done} изучено</span></div>
          {isOpen && <div className="react-topic-details">
            {selected.map(({title,index})=><div className="react-lesson-row" key={index}>
              <label title="Моя отметка о прохождении"><input type="checkbox" checked={completedSet.has(`${t.id}:${index}`)} onChange={()=>onToggle(`${t.id}:${index}`)} aria-label={`Отметить урок ${title} изученным`}/></label>
              <a href={`#lesson/${t.id}/g${index}`}><strong>{title}</strong><small>{t.details[index]?.join(' · ')}</small></a>
            </div>)}
            <button className="btn secondary small" onClick={()=>onPracticeTopic(t.id)}>Задачи по разделу →</button>
          </div>}
        </div>
      </article>;
    }):<div className="empty">Ничего не найдено. Попробуй другой запрос.</div>}</div>
  </section>;
}
