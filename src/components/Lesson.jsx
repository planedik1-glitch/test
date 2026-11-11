import React,{useEffect,useMemo,useRef,useState} from 'react';
import {topics,problems} from '../data/core';
import {lessonContent} from '../data/lessons';
import {allLessons,lessonHref} from '../lib/progress';
import {useMathJax} from '../lib/useMathJax';
import {makeSimulator,refreshSimulator,simulatorSpecs} from '../lib/simulators';

export default function Lesson({topicId,index,completed,onToggle,onPracticeTopic}) {
  const section=topics.find(t=>t.id===topicId);
  const valid=!!section && index>=0 && Number.isInteger(index) && index<section.points.length;
  const key=`${topicId}:${index}`;
  const content=lessonContent[key];
  const [visibleAnswers,setVisibleAnswers]=useState([]);
  const mathRoot=useMathJax(key+'|'+visibleAnswers.join(',')+'|'+completed.join(','));
  const simRoot=useRef(null);
  const pos=allLessons.findIndex(x=>x.id===topicId&&x.index===index);
  const prev=allLessons[pos-1], next=allLessons[pos+1];
  useEffect(()=>setVisibleAnswers([]),[key]);
  useEffect(()=>{
    if(!valid)return;
    document.title=`${section.points[index]} | AstroPath`;
    const sim=simRoot.current?.querySelector('[data-simulator]');
    if(!sim) return;
    refreshSimulator(sim);
    const onInput=e=>{if(e.target.matches('[data-sim-param]'))refreshSimulator(sim);};
    const onClick=e=>{
      if(e.target.closest('[data-sim-reset]')){
        const spec=simulatorSpecs[key];
        spec?.controls.forEach(([name,,, , ,value])=>{
          const input=sim.querySelector(`[data-sim-param="${name}"]`);
          if(input)input.value=String(value);
        });
        refreshSimulator(sim);
      }
    };
    sim.addEventListener('input',onInput);sim.addEventListener('click',onClick);
    return ()=>{sim.removeEventListener('input',onInput);sim.removeEventListener('click',onClick);};
  },[key,valid]);
  const simHtml=useMemo(()=>makeSimulator(key),[key]);
  if(!valid)return <div className="empty"><p>Урок не найден.</p><a href="#theory">К программе →</a></div>;
  const subsections=section.details[index]??[];
  const related=problems.filter(p=>p.topic===topicId);
  const done=completed.includes(key);
  const sectionDone=section.points.filter((_,i)=>completed.includes(`${topicId}:${i}`)).length;
  return <section className="section lesson-view" id="lesson" ref={mathRoot}>
    <div className="lesson-breadcrumb"><a href="#theory">Все разделы</a><span>›</span><span>{section.name}</span><span>›</span><strong>Урок {pos+1}</strong></div>
    <article className="lesson-article">
      <div className="lesson-kicker"><span>РАЗДЕЛ {topics.indexOf(section)+1} / УРОК {index+1}</span><span className={`tag ${content?'lesson-ready':''}`}>{content?'Есть объяснение':'В программе'}</span></div>
      <h1>{section.points[index]}</h1><p className="lesson-section-name">{section.name}</p>
      <div className="lesson-toolbar"><button className={`btn small ${done?'secondary':''}`} onClick={()=>onToggle(key)}>{done?'✓ Изучено':'✓ Отметить изученным'}</button><span className="lesson-status">{sectionDone} из {section.points.length} уроков раздела изучено</span></div>
      <div className="lesson-main">
        <section className="lesson-outline"><h2>В этом уроке</h2><ul>{subsections.map((s,i)=><li key={i}>{s.replace(/[.]$/,'')}</li>)}</ul></section>
        {simHtml&&<div ref={simRoot} dangerouslySetInnerHTML={{__html:simHtml}} />}
        {content ? <>
          <div className="lesson-summary">{content.lead}</div>
          {content.blocks.length>=8&&<nav className="lesson-toc" aria-label="Оглавление урока"><div className="lesson-toc-header"><strong>Быстрая навигация</strong><span>{content.blocks.length} глав · {content.examples.length} примеров · {content.checks.length} вопросов</span></div><div className="lesson-toc-grid">{content.blocks.map((b,i)=><button key={i} onClick={()=>document.getElementById(`lessonChapter-${i}`)?.scrollIntoView({behavior:'smooth',block:'start'})}><span>{String(i+1).padStart(2,'0')}</span>{b.title}</button>)}</div></nav>}
          {content.blocks.map((b,i)=><section className="lesson-chapter" id={`lessonChapter-${i}`} key={i}><div className="chapter-number">{String(i+1).padStart(2,'0')}</div><div><span className="chapter-topic">{b.topic}</span><h2>{b.title}</h2><div dangerouslySetInnerHTML={{__html:b.html}} /></div></section>)}
          {content.examples.map((b,i)=><section className="lesson-example" id={`lessonExample-${i}`} key={i}><span className="lesson-eyebrow">✦ Разобранный пример{content.examples.length>1?` · ${i+1}`:''}</span><p className="example-topic">{b.topic}</p><div dangerouslySetInnerHTML={{__html:b.html}} /></section>)}
          {content.checks.map((check,i)=><section className="lesson-selfcheck" id={`selfcheck-${i}`} key={i}><h2>Проверь себя{content.checks.length>1?` · ${i+1}`:''}</h2><p>{check.question}</p><button className="btn secondary small" aria-expanded={visibleAnswers.includes(i)} onClick={()=>setVisibleAnswers(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])}>{visibleAnswers.includes(i)?'Скрыть ответ':'Показать ответ'}</button>{visibleAnswers.includes(i)&&<div className="selfcheck-answer" dangerouslySetInnerHTML={{__html:check.answer}} />}</section>)}
          {content.covered<subsections.length&&<div className="lesson-notice">Подробный конспект готов для {content.covered} из {subsections.length} вопросов этого урока.</div>}
        </>:<div className="lesson-not-ready"><div className="placeholder-mark">✧</div><h2>Подробный конспект ещё не добавлен</h2><p>Все вопросы урока перечислены выше. Можно перейти к связанным задачам.</p><div className="lesson-formula">{`\\[${section.formula}\\]`}</div></div>}
      </div>
      <div className="lesson-related"><h2>Практика по разделу</h2><p>{related.length?`В разделе доступно задач: ${related.length}.`:'Задачи по разделу пока не добавлены.'}</p><button className="btn secondary small" onClick={()=>onPracticeTopic(topicId)}>Открыть практику →</button></div>
      <nav className="lesson-pager" aria-label="Навигация по урокам"><div>{prev&&<a className="pager-link" href={lessonHref(prev)}><span>← Предыдущий урок</span><strong>{prev.name}</strong></a>}</div><div>{next&&<a className="pager-link next" href={lessonHref(next)}><span>Следующий урок →</span><strong>{next.name}</strong></a>}</div></nav>
      <div className="lesson-back"><a href="#theory">← Вернуться ко всем разделам</a></div>
    </article>
  </section>;
}
