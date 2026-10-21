/* Conceptual navigation is independent of the publication datasets. */
(function () {
  'use strict';
  const A = window.QMAtlas;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const words = {
    title: ['量子材料如何成为一个领域', 'How quantum materials became a field'],
    subtitle: ['研究传统、具体问题与相互影响：沿三篇阅读逐层探索。', 'Research traditions, questions and exchange, traced through three readings.'],
    jump: ['量子材料', 'Quantum materials'], searchLabel: ['搜索领域、主题和问题', 'Search fields, topics and questions'],
    back: ['返回上一层', 'Back one layer'], legendArea: ['研究领域 / 方向', 'Fields / research areas'],
    legendMechanism: ['机制 / 现象 / 理论', 'Mechanisms / phenomena / theories'], legendMaterial: ['材料 / 结构', 'Materials / structures'],
    legendBridge: ['跨领域主题 / 方法', 'Shared themes / approaches'], timeline: ['沿时间看研究发展', 'Follow the milestones'],
    scope: ['时间轴范围', 'Timeline scope'], currentScope: ['当前方向及下属路线', 'Current topic and its routes'], allScope: ['所有已收录路线', 'All mapped routes'],
    through: ['截至', 'Through'], allYears: ['全部年份', 'All years'],
    dateNote: ['方向通常逐渐形成。节点给出大致时期；下方年份表示具体事件，并非所有领域的“诞生年”。年份筛选只作用于事件。', 'Fields usually develop gradually. Nodes describe approximate periods; timeline dates mark specific events, not universal founding dates. The year filter applies to events only.'],
    readingTitle: ['这张地图怎么读', 'How to read this map'],
    readingText: ['连线表示研究联系与阅读路线。物理、化学、材料科学和量子信息是并列入口；同一主题可以沿多条路线到达。节点区分领域、机制、材料与方法。', 'Lines show research connections and reading routes. Physics, chemistry, materials science and quantum information are parallel entry points. Topics can appear along multiple routes; node types distinguish fields, mechanisms, materials and methods.'],
    sourcesTitle: ['分类与主要阅读来源', 'Classification and core readings'],
    sourceMethod: ['物理学大板块参考APS PhySH。跨学科结构和节点问题是依据三篇阅读整理的分析框架，并非原文的正式分类或已经证实的学科家谱。覆盖核心主题与方法组，不逐一列出所有化合物和案例。', 'Physics domains draw on APS PhySH. The cross-field structure and topic questions are our reading-based synthesis, not a formal taxonomy or an established genealogy. Coverage includes principal themes and method groups, rather than every compound and case study.'],
    dataset: ['返回论文图谱时使用', 'Publication map source'], datasetNote: ['本页是文献整理的概念地图，内容不随论文数据集切换。', 'This curated conceptual map does not change with the publication dataset.'],
    field: ['学科领域', 'Field'], area: ['研究方向', 'Research area'], umbrella: ['共同研究主题', 'Shared research theme'], orientation: ['研究版图', 'Research landscape'],
    mechanism: ['物理机制', 'Mechanism'], material: ['材料 / 结构', 'Material / structure'], state: ['量子态', 'Quantum state'],
    phenomenon: ['物理现象', 'Phenomenon'], framework: ['解释 / 预测框架', 'Theoretical framework'], bridge: ['跨领域连接', 'Cross-field connection'], approach: ['研究方法', 'Research approach'],
    discovery: ['发现', 'Discovery'], theory: ['理论', 'Theory'], institution: ['组织 / 命名 / 议程', 'Community / naming / agenda'], experiment: ['实验', 'Experiment'], synthesis: ['合成', 'Synthesis'],
    layer: ['第 {n} 层', 'Layer {n}'],
    related: ['交叉联系', 'Connected topics'], leaf: ['此处展示相关方向；虚线表示交叉联系。', 'These are connected topics; dashed lines indicate cross-links.'],
    period: ['形成与发展时期', 'Period of development'], milestones: ['标志性事件', 'Selected milestones'],
    noEvents: ['此节点未指定历史事件。', 'No dated milestones assigned to this node.'], sources: ['阅读依据', 'Reading sources'],
    placeholder: ['这一板块暂不展开；本图聚焦三篇文章中的量子材料联系。', 'This domain is not expanded; the map focuses on quantum-materials connections in the three readings.'],
    noMatches: ['没有匹配方向。可试试“超导”或 graphene。', 'No matches. Try “superconductivity” or “graphene”.'],
    openTopic: ['进入相关方向 →', 'Open topic →'], source: ['查看来源 ↗', 'Read source ↗'],
    count: ['{n} 个事件 · 截至 {year} 年 · {topic}', '{n} milestones through {year} · {topic}'],
    noTimeline: ['这一范围与年份内没有收录事件。可选择“全部年份”或“所有已收录路线”。', 'No milestones in this scope and period. Try “All years” or “All mapped routes”.'],
    searchHint: ['搜索领域、主题和问题', 'Search fields, topics and questions'],
    relatedHint: ['多个方向可以进入同一个节点。', 'The same topic can be reached along different routes.'],
    questions: ['研究问题', 'Research questions'], questionNote: ['依据阅读提出的问题，非原文引语。', 'Questions derived from the readings; not quotations.'],
    evidence: ['文章中的位置', 'Where it appears in the readings'],
    traditions: ['研究入口', 'Research entry points'], formation: ['领域形成', 'Field formation'],
    formationTitle: ['“谁先行”需要分成哪些问题？', 'What does it mean for a discipline to lead?'],
    formationText: ['Nature追踪凝聚态物理中共同概念的扩展；Cava把化学已有的发现与解释传统带入同一框架。这支持逐步会合的理解，尚不能据此认定整个领域的单一学科创立者。', 'Nature traces a widening concept in condensed-matter physics. Cava brings chemical traditions of discovery and explanation into the same frame. Together, they suggest convergence, without establishing a single disciplinary founder.'],
    coverageTitle: ['三篇阅读的覆盖与视角', 'Coverage and perspectives of the three readings'],
    coverageNote: ['下方条目可进入相应节点。页码指原文；分组与研究问题是本图的整理。', 'Topic links open the map. Page numbers refer to the original papers; the grouping and research questions are our synthesis.'],
    lens: ['历史视角', 'Historical lens'], lensAll: ['全部活动', 'All activities'], lensPhenomena: ['发现与理论', 'Discovery & theory'], lensMaterials: ['材料设计与制备', 'Material design & preparation'], lensCommunity: ['共同名称与组织', 'Naming & community'],
    lensNote: ['活动类别可以重叠，不代表某个学科独占该事件。这里只收录选定事件，并非各学科完整、对称的历史对照。', 'Activities can overlap without belonging to a single discipline. These selected milestones are not a complete, matched chronology of the disciplines.'],
    evidenceMore: ['其他来源', 'Additional sources']
  };
  const readStore = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const writeStore = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  let route = ['landscape'], lang = 'en', year = 2025, scope = 'current', selectedEvent = null, lens = 'all';
  let source = 'symposium', detailId = 'landscape';
  const tr = (key, substitutions = {}) => {
    let text = (words[key] || [key, key])[lang === 'zh' ? 0 : 1];
    for (const [k, v] of Object.entries(substitutions)) text = text.replaceAll(`{${k}}`, v);
    return text;
  };
  const localized = obj => obj[lang];
  const secondary = n => lang === 'zh' ? `<span class="secondary-name">${escape(n.name.en)}</span>` : '';
  const eventDate = e => e.id === 'qd1981' ? (lang === 'zh' ? '1980年代初' : 'Early 1980s') : e.display;
  const current = () => A.get(route.at(-1));
  function restore() {
    const params = new URL(location.href).searchParams;
    let candidate = (params.get('path') || 'landscape').split(',');
    if (candidate[0] === 'physics') candidate = ['landscape', ...candidate];
    route = A.validPath(candidate) ? candidate : ['landscape'];
    lang = (params.get('lang') || readStore('qm_atlas_lang')) === 'zh' ? 'zh' : 'en';
    const cutoff = Number(params.get('year') || 2025);
    year = Number.isFinite(cutoff) ? Math.max(1911, Math.min(2025, Math.round(cutoff))) : 2025;
    scope = params.get('scope') === 'all' ? 'all' : 'current';
    lens = ['phenomena','materials','community'].includes(params.get('lens')) ? params.get('lens') : 'all';
    const requestedSource = params.get('source') || readStore('qm_source');
    source = requestedSource === 'wos' ? 'wos' : 'symposium';
    detailId = current().id;
  }
  function syncURL(push = false) {
    const url = new URL(location.href);
    url.searchParams.set('source', source);
    url.searchParams.set('path', route.join(','));
    url.searchParams.set('lang', lang);
    if (year !== 2025) url.searchParams.set('year', year); else url.searchParams.delete('year');
    if (scope === 'all') url.searchParams.set('scope', 'all'); else url.searchParams.delete('scope');
    if (lens !== 'all') url.searchParams.set('lens', lens); else url.searchParams.delete('lens');
    history[push ? 'pushState' : 'replaceState'](null, '', url);
  }
  function syncSource() {
    $('dataSource').value = source;
    writeStore('qm_source', source);
    document.querySelectorAll('.site-nav a').forEach(a => {
      const url = new URL(a.href); url.searchParams.set('source', source); a.href = url;
    });
  }
  function goPath(path, eventId = null) {
    if (!A.validPath(path)) return;
    route = path; detailId = current().id; selectedEvent = eventId;
    $('atlasSearch').value = ''; $('searchResults').hidden = true;
    hideTooltip(); syncURL(true); render();
    $('levelTitle').scrollIntoView({block: 'nearest'});
    $('levelTitle').focus({preventScroll: true});
    $('atlasAnnounce').textContent = route.map(id => localized(A.get(id).name)).join(' → ');
  }
  function visit(id, forceCanonical = false, eventId = null) {
    const node = A.get(id);
    if (node.placeholder) {
      detailId = id; renderDetails();
      $('atlasAnnounce').textContent = `${localized(node.name)}. ${tr('placeholder')}`;
      $('nodeDetails').scrollIntoView({block: 'nearest'});
      return;
    }
    const canAppend = !forceCanonical && !route.includes(id) && current().children.includes(id);
    goPath(canAppend ? [...route, id] : A.pathTo(id), eventId);
  }
  function sourceLink(key, locator = '') {
    const s = A.sources[key];
    return `<a class="source-link" href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}${locator ? ` · ${escape(locator)}` : ''} ↗</a>`;
  }
  function renderDetails() {
    const n = A.get(detailId);
    const cited = new Set(n.evidence.map(e => e.source));
    const extra = n.sources.filter(id => !cited.has(id));
    $('nodeDetails').innerHTML = `<span class="type-tag">${tr(n.kind)}</span><h2>${escape(localized(n.name))}</h2>${secondary(n)}<p>${escape(localized(n.summary))}</p>
      ${n.questions.length ? `<div class="topic-questions"><h3>${tr('questions')}</h3><ul>${n.questions.map(q=>`<li>${escape(localized(q))}</li>`).join('')}</ul><p class="detail-note">${tr('questionNote')}</p></div>` : ''}
      <h3>${tr('period')}</h3><p class="period-text">${escape(localized(n.period))}</p>
      ${n.placeholder ? `<p class="detail-note">${tr('placeholder')}</p>` : ''}
      ${n.events.length ? `<h3>${tr('milestones')}</h3>${n.events.map(id => { const e=A.events[id];return `<div class="mini-event"><b>${escape(eventDate(e))}</b><a href="${escape(A.sources[e.source].url)}" target="_blank" rel="noopener noreferrer">${escape(localized(e.title))} ↗</a></div>`;}).join('')}` : ''}
      ${n.evidence.length ? `<h3>${tr('evidence')}</h3>${n.evidence.map(e=>sourceLink(e.source,e.locator)).join('')}` : ''}
      ${extra.length ? `<details class="extra-sources"><summary>${tr('evidenceMore')}</summary>${extra.map(id=>sourceLink(id)).join('')}</details>` : ''}`;
  }
  function hideTooltip() {
    $('nodeTooltip').hidden = true;
    document.querySelectorAll('[aria-describedby="nodeTooltip"]').forEach(el => el.removeAttribute('aria-describedby'));
  }
  function tipForNode(node) {
    return `<strong>${escape(localized(node.name))}</strong><small>${tr(node.kind)}</small><p>${escape(localized(node.period))}</p>${node.events.slice(0, 2).map(id => {const e = A.events[id]; return `<div class="tip-event">${escape(eventDate(e))} · ${escape(localized(e.title))}</div>`;}).join('')}${node.questions.length ? `<p>${escape(localized(node.questions[0]))}</p>` : ''}`;
  }
  function showTooltip(anchor, html) {
    const tip = $('nodeTooltip');
    tip.innerHTML = html; tip.hidden = false;
    anchor.setAttribute('aria-describedby', 'nodeTooltip');
    const rect = anchor.getBoundingClientRect(), bounds = tip.getBoundingClientRect();
    const x = Math.max(12, Math.min(innerWidth - bounds.width - 12, rect.left + rect.width / 2 - bounds.width / 2));
    let y = rect.bottom + 10;
    if (y + bounds.height > innerHeight - 12) y = Math.max(12, rect.top - bounds.height - 10);
    tip.style.left = `${x}px`; tip.style.top = `${y}px`;
  }
  function bindTooltip(el, html) {
    el.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') showTooltip(el, html()); });
    el.addEventListener('pointerleave', hideTooltip);
    el.addEventListener('focus', () => showTooltip(el, html()));
    el.addEventListener('blur', hideTooltip);
  }
  function makeNode(n, x, y, central = false) {
    const el = document.createElement('button'); el.type = 'button';
    el.className = `map-node${central ? ' central-node' : ''}${n.placeholder ? ' placeholder' : ''}`;
    el.dataset.node = n.id; el.dataset.kind = n.kind;
    el.style.left = `${x}%`; el.style.top = `${y}%`;
    el.innerHTML = `<strong>${escape(localized(n.name))}</strong>${secondary(n)}`;
    el.setAttribute('aria-label', `${localized(n.name)} · ${tr(n.kind)}`);
    if (central) el.setAttribute('aria-current', 'location');
    el.addEventListener('click', () => { if (central) { detailId = n.id; renderDetails(); } else visit(n.id); });
    bindTooltip(el, () => tipForNode(n)); return el;
  }
  function renderMap() {
    const n = current();
    $('levelLabel').textContent = `${tr('layer', {n: route.length})} / ${tr(n.kind)}`;
    $('levelTitle').textContent = localized(n.name);
    $('levelDescription').textContent = localized(n.summary);
    $('backLevel').disabled = route.length === 1;
    $('breadcrumbs').replaceChildren();
    route.forEach((id, i) => {
      if (i) { const sep = document.createElement('span'); sep.className = 'crumb-sep'; sep.textContent = '›'; sep.setAttribute('aria-hidden', 'true'); $('breadcrumbs').append(sep); }
      const button = document.createElement('button'); button.type = 'button'; button.className = 'crumb'; button.textContent = localized(A.get(id).name);
      if (i === route.length - 1) button.setAttribute('aria-current', 'page');
      button.onclick = () => goPath(route.slice(0, i + 1)); $('breadcrumbs').append(button);
    });
    const leaf = n.children.length === 0, topics = (leaf ? n.related : n.children).map(id => A.get(id));
    $('mapCanvas').classList.toggle('compact-map', topics.length <= 4);
    $('mapCanvas').style.setProperty('--map-height', `${Math.max(320, Math.ceil(topics.length / 2) * 110 + 50)}px`);
    $('mapNodes').replaceChildren(makeNode(n, 50, 50, true));
    const half = Math.ceil(topics.length / 2), paths = [];
    topics.forEach((topic, i) => {
      const left = i < half, count = left ? half : topics.length - half, row = left ? i : i - half;
      const x = left ? 16 : 84, y = count === 1 ? 50 : 12 + row * 76 / (count - 1);
      $('mapNodes').append(makeNode(topic, x, y));
      paths.push(`<path d="M ${left ? 365 : 635} 285 C ${left ? 325 : 675} 285, ${left ? 325 : 675} ${y * 5.7}, ${left ? 295 : 705} ${y * 5.7}"${leaf ? ' stroke-dasharray="5 5"' : ''}/>`);
    });
    $('mapEdges').innerHTML = paths.join('');
    $('mapHint').textContent = leaf ? tr('leaf') : n.hint ? localized(n.hint) : tr('relatedHint');
    $('relatedTopics').replaceChildren();
    if (n.related.length && !leaf) {
      const label = document.createElement('span'); label.textContent = `${tr('related')} ↔`; $('relatedTopics').append(label);
      for (const id of n.related) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = localized(A.get(id).name);
        button.onclick = () => visit(id, true); bindTooltip(button, () => tipForNode(A.get(id))); $('relatedTopics').append(button);
      }
    }
    $('relatedTopics').hidden = leaf || !n.related.length;
  }
  function renderTimeline() {
    const topic = scope === 'all' ? 'landscape' : current().id, events = A.timeline(topic, year, lens);
    $('atlasYear').value = year; $('atlasYearLabel').textContent = year; $('timelineScope').value = scope; $('timelineLens').value = lens;
    $('timelineStatus').textContent = tr('count', {n: events.length, year, topic: localized(A.get(topic).name)});
    const xFor = value => 18 + (value - 1911) / (2025 - 1911) * 964;
    const rows = [-Infinity, -Infinity, -Infinity, -Infinity];
    const markers = events.map(e => {
      const x = xFor(e.year); let row = rows.findIndex(last => x - last > 16);
      if (row < 0) row = rows.indexOf(Math.min(...rows)); rows[row] = x;
      return `<g><line x1="${x}" x2="${x}" y1="${29 + row * 14}" y2="85" stroke="#dbe4ef"/><circle class="timeline-mark" data-event="${e.id}" cx="${x}" cy="${29 + row * 14}" r="6" role="button" tabindex="0" aria-label="${escape(eventDate(e) + ' · ' + localized(e.title))}"><title>${escape(eventDate(e) + ' · ' + localized(e.title))}</title></circle></g>`;
    }).join('');
    $('timelinePlot').innerHTML = `<svg viewBox="0 0 1000 124" preserveAspectRatio="none" role="group" aria-label="${tr('timeline')}"><line x1="18" x2="982" y1="85" y2="85" stroke="#bfcee1"/>${[1911, 1940, 1970, 2000, 2025].map(y => `<line x1="${xFor(y)}" x2="${xFor(y)}" y1="85" y2="92" stroke="#bfcee1"/><text class="timeline-tick" x="${xFor(y)}" y="113" text-anchor="${y === 1911 ? 'start' : y === 2025 ? 'end' : 'middle'}">${y}</text>`).join('')}${markers}</svg>`;
    $('timelinePlot').querySelectorAll('[data-event]').forEach(el => {
      const e = A.events[el.dataset.event];
      const open = () => { visit(e.node, true, e.id); $('levelTitle').scrollIntoView({block: 'start'}); };
      el.addEventListener('click', open);
      el.addEventListener('keydown', key => { if (key.key === 'Enter' || key.key === ' ') {key.preventDefault(); open();} });
      bindTooltip(el, () => `<strong>${escape(eventDate(e))} · ${escape(localized(e.title))}</strong><small>${tr(e.kind)}</small><p>${escape(localized(e.detail))}</p><small>${tr('openTopic')}</small>`);
    });
    const chosen = events.find(e => e.id === selectedEvent);
    $('timelineEvents').innerHTML = `${chosen ? `<div class="event-detail"><button type="button" id="eventTopic">${tr('openTopic')}</button><b>${escape(eventDate(chosen))} · ${escape(localized(chosen.title))}</b><p>${escape(localized(chosen.detail))}</p><a href="${escape(A.sources[chosen.source].url)}" target="_blank" rel="noopener noreferrer">${tr('source')} · ${escape(A.sources[chosen.source].title)}</a></div>` : ''}${events.length ? events.map(e => `<button type="button" class="event-card" data-event="${e.id}" aria-pressed="${e.id === selectedEvent}"><span class="event-year">${escape(eventDate(e))}</span> <span class="event-meta">${tr(e.kind)}</span><strong>${escape(localized(e.title))}</strong><span class="event-meta">${escape(localized(A.get(e.node).name))}</span></button>`).join('') : `<p class="detail-note">${tr('noTimeline')}</p>`}`;
    $('timelineEvents').querySelectorAll('.event-card').forEach(el => {
      el.onclick = () => { selectedEvent = el.dataset.event; renderTimeline(); $('timelineEvents').scrollTop = 0; $('eventTopic')?.focus({preventScroll: true}); };
    });
    if (chosen) $('eventTopic').onclick = () => { visit(chosen.node, true, chosen.id); $('levelTitle').scrollIntoView({block: 'start'}); };
  }
  function renderSearch() {
    const input = $('atlasSearch'), box = $('searchResults'), matches = A.search(input.value).slice(0, 10);
    box.hidden = !input.value.trim();
    box.innerHTML = matches.length ? matches.map(n => `<button type="button" data-node="${n.id}">${escape(localized(n.name))}<small>${lang === 'zh' ? `${escape(n.name.en)} · ` : ''}${tr(n.kind)}</small></button>`).join('') : `<p>${tr('noMatches')}</p>`;
    box.querySelectorAll('button').forEach((button, i, buttons) => {
      button.onclick = () => { visit(button.dataset.node, true); box.hidden = true; };
      button.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); buttons[(i + (e.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length].focus(); } };
    });
  }
  function topicButton(id) {
    return `<button type="button" data-topic="${id}">${escape(localized(A.get(id).name))}</button>`;
  }
  function renderReadingContext() {
    $('entryPoints').innerHTML = ['landscape','physics','chemistry','materials-science','quantum-information'].map(topicButton).join('');
    $('formationPaths').innerHTML = A.formation.map(f=>`<article><h3>${escape(localized(f.title))}</h3><p>${escape(localized(f.text))}</p><div class="topic-links">${f.nodes.map(topicButton).join('')}</div><div class="formation-refs">${f.sources.map(id=>`<a href="${A.sources[id].url}" target="_blank" rel="noopener noreferrer">${A.readings.find(r=>r.id===id).label}</a>`).join(' · ')}</div></article>`).join('');
    $('readingCoverage').innerHTML = A.readings.map(r=>`<details class="coverage-reading"><summary><span>${escape(r.label)}</span> ${escape(localized(r.title))}</summary><p>${escape(localized(r.argument))}</p><p class="reading-limit">${escape(localized(r.limit))}</p>${r.groups.map(g=>`<section><h4>${escape(localized(g.title))}</h4><p class="locator">${escape(g.locator)}</p><div class="topic-links">${g.nodes.map(topicButton).join('')}</div></section>`).join('')}${sourceLink(r.id,r.locator)}</details>`).join('');
    document.querySelectorAll('[data-topic]').forEach(button=>button.onclick=()=>visit(button.dataset.topic,true));
    document.querySelectorAll('#entryPoints [data-topic]').forEach(button=>{
      if(route.includes(button.dataset.topic) && button.dataset.topic!=='landscape' || current().id==='landscape'&&button.dataset.topic==='landscape') button.setAttribute('aria-current','true');
    });
  }
  function render() {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    $('language').textContent = lang === 'zh' ? 'English' : 'Chinese';
    $('language').setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : 'Switch to Chinese');
    $('atlasSearch').placeholder = tr('searchHint');
    $('atlasAnnounce').textContent = route.map(id=>localized(A.get(id).name)).join(' → ');
    $('readingSources').innerHTML = ['physh', 'nature', 'cava', 'goyal'].map(id=>sourceLink(id)).join('');
    renderReadingContext(); renderMap(); renderDetails(); renderTimeline(); syncSource();
  }
  $('backLevel').onclick = () => { if (route.length > 1) goPath(route.slice(0, -1)); };
  $('jumpQuantum').onclick = () => visit('quantum-materials', true);
  $('language').onclick = () => { lang = lang === 'zh' ? 'en' : 'zh'; writeStore('qm_atlas_lang', lang); hideTooltip(); syncURL(); render(); if ($('atlasSearch').value) renderSearch(); };
  $('atlasYear').oninput = e => { year = Number(e.target.value); hideTooltip(); syncURL(); renderTimeline(); };
  $('resetYear').onclick = () => { year = 2025; syncURL(); renderTimeline(); };
  $('timelineScope').onchange = e => { scope = e.target.value; selectedEvent = null; syncURL(); renderTimeline(); };
  $('timelineLens').onchange = e => { lens = e.target.value; selectedEvent = null; syncURL(); renderTimeline(); };
  $('dataSource').onchange = e => { source = e.target.value; syncSource(); syncURL(); };
  $('atlasSearch').oninput = renderSearch;
  $('atlasSearch').onkeydown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); $('searchResults').querySelector('button')?.focus(); }
    if (e.key === 'Enter') { e.preventDefault(); $('searchResults').querySelector('button')?.click(); }
  };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { hideTooltip(); $('searchResults').hidden = true; } });
  document.addEventListener('click', e => { if (!e.target.closest('.atlas-search')) $('searchResults').hidden = true; });
  addEventListener('scroll', () => {
    const active = document.activeElement;
    if (!$('nodeTooltip').hidden && active?.getAttribute('aria-describedby') === 'nodeTooltip') {
      const rect = active.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) showTooltip(active, $('nodeTooltip').innerHTML);
      else hideTooltip();
    } else hideTooltip();
  }, true);
  addEventListener('resize', hideTooltip);
  addEventListener('popstate', () => { restore(); selectedEvent = null; hideTooltip(); render(); });
  restore(); syncURL(); render();
})();
