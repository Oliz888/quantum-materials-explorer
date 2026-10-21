/* Conceptual navigation is independent of the publication datasets. */
(function () {
  'use strict';
  const A = window.QMAtlas;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const words = {
    title: ['从物理学走进量子材料', 'From physics to quantum materials'],
    subtitle: ['点击进入下一层，沿时间轴认识关键发现与研究联系。', 'Explore one layer at a time, with milestones and connections along the way.'],
    jump: ['直达量子材料', 'Jump to quantum materials'], searchLabel: ['搜索所有方向', 'Search all topics'],
    back: ['返回上一层', 'Back one layer'], legendArea: ['研究领域 / 方向', 'Fields / research areas'],
    legendMechanism: ['机制 / 现象 / 理论', 'Mechanisms / phenomena / theories'], legendMaterial: ['材料 / 结构', 'Materials / structures'],
    legendBridge: ['跨领域主题 / 方法', 'Shared themes / approaches'], timeline: ['沿时间看研究发展', 'Follow the milestones'],
    scope: ['时间轴范围', 'Timeline scope'], currentScope: ['当前方向及下属路线', 'Current topic and its routes'], allScope: ['所有已收录路线', 'All mapped routes'],
    through: ['截至', 'Through'], allYears: ['全部年份', 'All years'],
    dateNote: ['方向通常逐渐形成。节点给出大致时期；下方年份表示具体事件，并非所有领域的“诞生年”。年份筛选只作用于事件。', 'Fields usually develop gradually. Nodes describe approximate periods; timeline dates mark specific events, not universal founding dates. The year filter applies to events only.'],
    readingTitle: ['这张地图怎么读', 'How to read this map'],
    readingText: ['连线表示阅读路线和研究联系，不是严格的学科家谱。量子材料是跨方向的共同主题；量子限域是机制，量子点是结构。其他物理学板块在此版本中只列入口。', 'Lines show reading routes and research connections, not a strict family tree. Quantum materials is a shared theme; confinement is a mechanism, and a quantum dot is a structure. Other physics domains have overview entries only.'],
    sourcesTitle: ['分类与主要阅读来源', 'Classification and core readings'],
    sourceMethod: ['大板块选自 APS PhySH；凝聚态内部的路线按三篇阅读整理，并非照搬一套正式分类。每个历史事件均附原始论文或机构来源。范围未覆盖所有物理学。', 'The broad domains are selected from APS PhySH. Routes within condensed matter synthesize the three readings rather than reproduce a formal taxonomy. Each milestone links to a paper or institutional source. Coverage is selective.'],
    dataset: ['返回论文图谱时使用', 'Publication map source'], datasetNote: ['本页是文献整理的概念地图，内容不随论文数据集切换。', 'This curated conceptual map does not change with the publication dataset.'],
    field: ['学科领域', 'Field'], area: ['研究方向', 'Research area'], umbrella: ['共同研究主题', 'Shared research theme'],
    mechanism: ['物理机制', 'Mechanism'], material: ['材料 / 结构', 'Material / structure'], state: ['量子态', 'Quantum state'],
    phenomenon: ['物理现象', 'Phenomenon'], framework: ['解释 / 预测框架', 'Theoretical framework'], bridge: ['跨领域连接', 'Cross-field connection'], approach: ['研究方法', 'Research approach'],
    discovery: ['发现', 'Discovery'], theory: ['理论', 'Theory'], institution: ['组织 / 命名 / 议程', 'Community / naming / agenda'], experiment: ['实验', 'Experiment'], synthesis: ['合成', 'Synthesis'],
    layer: ['第 {n} 层', 'Layer {n}'], current: ['当前位置', 'You are here'], explore: ['进入下一层 →', 'Explore →'],
    overview: ['仅列入口', 'Overview only'], read: ['查看与探索 →', 'Read & explore →'],
    related: ['交叉联系', 'Connected topics'], leaf: ['此处展示相关方向；虚线表示交叉联系。', 'These are connected topics; dashed lines indicate cross-links.'],
    period: ['形成与发展时期', 'Period of development'], milestones: ['标志性事件', 'Selected milestones'],
    noEvents: ['此节点未指定历史事件。', 'No dated milestones assigned to this node.'], sources: ['阅读依据', 'Reading sources'],
    placeholder: ['这一板块暂不展开。可以返回凝聚态路线继续探索。', 'Subtopics are not expanded here yet. Continue through the condensed-matter route.'],
    noMatches: ['没有匹配方向。可试试“超导”或 graphene。', 'No matches. Try “superconductivity” or “graphene”.'],
    openTopic: ['进入相关方向 →', 'Open topic →'], source: ['查看来源 ↗', 'Read source ↗'],
    count: ['{n} 个事件 · 截至 {year} 年 · {topic}', '{n} milestones through {year} · {topic}'],
    noTimeline: ['这一范围与年份内没有收录事件。可选择“全部年份”或“所有已收录路线”。', 'No milestones in this scope and period. Try “All years” or “All mapped routes”.'],
    searchHint: ['搜索方向 / Search topics', 'Search topics / 搜索方向'],
    relatedHint: ['多个方向可以进入同一个节点。', 'The same topic can be reached along different routes.']
  };
  const readStore = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const writeStore = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  let route = ['physics'], lang = 'zh', year = 2025, scope = 'current', selectedEvent = null;
  let source = 'symposium', detailId = 'physics';
  const tr = (key, substitutions = {}) => {
    let text = (words[key] || [key, key])[lang === 'zh' ? 0 : 1];
    for (const [k, v] of Object.entries(substitutions)) text = text.replaceAll(`{${k}}`, v);
    return text;
  };
  const localized = obj => obj[lang];
  const otherName = n => n.name[lang === 'zh' ? 'en' : 'zh'];
  const eventDate = e => e.id === 'qd1981' ? (lang === 'zh' ? '1980年代初' : 'Early 1980s') : e.display;
  const current = () => A.get(route.at(-1));
  function restore() {
    const params = new URL(location.href).searchParams;
    const candidate = (params.get('path') || 'physics').split(',');
    route = A.validPath(candidate) ? candidate : ['physics'];
    lang = (params.get('lang') || readStore('qm_atlas_lang')) === 'en' ? 'en' : 'zh';
    const cutoff = Number(params.get('year') || 2025);
    year = Number.isFinite(cutoff) ? Math.max(1911, Math.min(2025, Math.round(cutoff))) : 2025;
    scope = params.get('scope') === 'all' ? 'all' : 'current';
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
  function sourceLink(key) {
    const s = A.sources[key];
    return `<a class="source-link" href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a>`;
  }
  function renderDetails() {
    const n = A.get(detailId);
    $('nodeDetails').innerHTML = `<span class="type-tag">${tr(n.kind)}</span><h2>${escape(localized(n.name))}</h2><p class="detail-en">${escape(otherName(n))}</p><p>${escape(localized(n.summary))}</p><h3>${tr('period')}</h3><p class="period-text">${escape(localized(n.period))}</p>${n.placeholder ? `<p class="detail-note">${tr('placeholder')}</p>` : `<h3>${tr('milestones')}</h3>${n.events.length ? n.events.map(id => { const e = A.events[id]; return `<div class="mini-event"><b>${escape(eventDate(e))}</b><a href="${escape(A.sources[e.source].url)}" target="_blank" rel="noopener noreferrer">${escape(localized(e.title))} ↗</a></div>`; }).join('') : `<p class="detail-note">${tr('noEvents')}</p>`}`}<h3>${tr('sources')}</h3>${n.sources.map(sourceLink).join('')}`;
  }
  function hideTooltip() {
    $('nodeTooltip').hidden = true;
    document.querySelectorAll('[aria-describedby="nodeTooltip"]').forEach(el => el.removeAttribute('aria-describedby'));
  }
  function tipForNode(node) {
    return `<strong>${escape(localized(node.name))}</strong><small>${tr(node.kind)}</small><p>${escape(localized(node.period))}</p>${node.events.slice(0, 3).map(id => {const e = A.events[id]; return `<div class="tip-event">${escape(eventDate(e))} · ${escape(localized(e.title))}</div>`;}).join('')}${node.placeholder ? `<small>${tr('overview')}</small>` : ''}`;
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
    const action = central ? tr('current') : n.placeholder ? tr('overview') : n.children.length ? tr('explore') : tr('read');
    el.innerHTML = `<strong>${escape(localized(n.name))}</strong><span class="secondary-name">${escape(otherName(n))}</span><span class="node-action">${action}</span>`;
    el.setAttribute('aria-label', `${localized(n.name)} · ${tr(n.kind)} · ${action}`);
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
    const topic = scope === 'all' ? 'physics' : current().id, events = A.timeline(topic, year);
    $('atlasYear').value = year; $('atlasYearLabel').textContent = year; $('timelineScope').value = scope;
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
    box.innerHTML = matches.length ? matches.map(n => `<button type="button" data-node="${n.id}">${escape(localized(n.name))}<small>${escape(otherName(n))} · ${tr(n.kind)}</small></button>`).join('') : `<p>${tr('noMatches')}</p>`;
    box.querySelectorAll('button').forEach((button, i, buttons) => {
      button.onclick = () => { visit(button.dataset.node, true); box.hidden = true; };
      button.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); buttons[(i + (e.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length].focus(); } };
    });
  }
  function render() {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    $('language').textContent = lang === 'zh' ? 'English' : '中文';
    $('language').setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换为中文');
    $('atlasSearch').placeholder = tr('searchHint');
    $('readingSources').innerHTML = ['physh', 'nature', 'cava', 'goyal'].map(sourceLink).join('');
    renderMap(); renderDetails(); renderTimeline(); syncSource();
  }
  $('backLevel').onclick = () => { if (route.length > 1) goPath(route.slice(0, -1)); };
  $('jumpQuantum').onclick = () => visit('quantum-materials', true);
  $('language').onclick = () => { lang = lang === 'zh' ? 'en' : 'zh'; writeStore('qm_atlas_lang', lang); hideTooltip(); syncURL(); render(); if ($('atlasSearch').value) renderSearch(); };
  $('atlasYear').oninput = e => { year = Number(e.target.value); hideTooltip(); syncURL(); renderTimeline(); };
  $('resetYear').onclick = () => { year = 2025; syncURL(); renderTimeline(); };
  $('timelineScope').onchange = e => { scope = e.target.value; selectedEvent = null; syncURL(); renderTimeline(); };
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
