import React from 'react';
import { topics, problems } from '../data/core';
import { news } from '../data/news';
import { featuresHtml } from '../data/features';

export default function General({solvedCount}) {
  return <>
    <div className="hero">
      <div><div className="eyebrow"><i className="dot" /> Подготовка к международным олимпиадам</div>
      <h1>Твой путь к <em>звёздам</em> начинается здесь.</h1>
      <p>{topics.length} разделов, {topics.reduce((n,t)=>n+t.points.length,0)} уроков, интерактивные симуляторы, формулы LaTeX и олимпиадные задачи.</p>
      </div><div className="planet" aria-hidden="true" />
    </div>
    <section className="section" id="general">
      <div className="lesson-feature-grid" style={{display:'none'}} />
      <div className="original-feature-wrapper" dangerouslySetInnerHTML={{__html:featuresHtml}} />
      <div className="sim-launch">
        <h2>✧ Интерактивная астрономическая лаборатория</h2>
        <p>Открой урок и экспериментируй с параметрами. Все расчёты работают прямо в браузере.</p>
        <div className="sim-launch-grid">
          {[
            ['math','g6','Орбита и эллипс','Эксцентриситет и фокусы'],
            ['math','g7','Комбинаторика','Порядок и повторения'],
            ['math','g8','Статистика','Среднее и выбросы'],
            ['distances','g2','Параллакс','Расстояние до звезды'],
            ['coordinates','g2','Кульминация','Широта и высота светила'],
            ['photometry','g2','Закон Погсона','Разность звёздных величин'],
            ['thermal','g0','Тепловое излучение','Температура и светимость'],
            ['mechanics','g3','Небесная механика','Гравитация и орбиты'],
            ['planets','g0','Фазы планет','Фазовый угол'],
            ['binaries','g1','Затмения','Перекрытие звёздных дисков'],
          ].map(([t,i,label,desc]) => <a href={`#lesson/${t}/${i}`} key={`${t}:${i}`}><strong>{label}</strong><small>{desc}</small></a>)}
        </div>
      </div>
      <div className="kpis">
        <div className="kpi"><strong>{topics.length}</strong><small>Разделов в программе</small></div>
        <div className="kpi"><strong>{problems.length}</strong><small>Задач в базе</small></div>
        <div className="kpi"><strong>{solvedCount}</strong><small>Задач отмечено решёнными</small></div>
      </div>
      <div className="section-head"><div><h2>Новости и объявления</h2><p>Демонстрационная лента платформы</p></div><span className="pill">Обновления</span></div>
      <div className="cards">{news.map((n,i) => <article className="card" key={i}>
        <div className="card-top"><span>{n.icon} &nbsp;{n.tag}</span><span className="pill">Демо</span></div>
        <h3>{n.title}</h3><p>{n.text}</p><div className="bottom"><span className="date">{n.date}</span></div>
      </article>)}</div>
      <div className="section-head"><div><h2>С чего начать?</h2><p>Два первых шага для нового участника</p></div></div>
      <div className="cards" style={{gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))'}}>
        <article className="card"><div className="card-top">01 · ОБУЧЕНИЕ</div><h3>Изучи основы</h3><p>Начни с математических основ, расстояний и движения светил.</p><a href="#theory" className="btn secondary">Перейти к теории →</a></article>
        <article className="card"><div className="card-top">02 · ТРЕНИРОВКА</div><h3>Реши первую задачу</h3><p>Выбери тему и сложность или воспользуйся случайной задачей.</p><a href="#practice" className="btn secondary">Открыть задачи →</a></article>
      </div>
    </section>
  </>;
}
