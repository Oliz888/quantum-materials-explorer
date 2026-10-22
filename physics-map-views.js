/* Source-specific lenses over shared topic identities. Membership is not ancestry. */
(function(root,factory){
 const data=typeof module==='object'&&module.exports?require('./physics-map-data.js'):root.QMAtlas;
 const verified=typeof module==='object'&&module.exports?require('./physics-map-physh.js'):root.QMPhySHVerified;
 const api=factory(data,verified);if(typeof module==='object'&&module.exports)module.exports=api;else root.QMAtlasViews=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(A,verified){
'use strict';
const L=(zh,en)=>({zh,en});
A.sources.npj={title:'npj Quantum Materials · Aims & Scope',url:'https://www.nature.com/npjquantmats/aims'};
A.sources.physhAbout={title:'APS · About PhySH',url:'https://physh.org/about'};
A.sources.tokura={title:'Tokura, Kawasaki & Nagaosa (2017) · Figure 1',url:'https://www.nature.com/articles/nphys4274/figures/1'};
const additions=[
 ['unconventional-superconductivity','非常规超导','Unconventional superconductivity','area','研究超出常规配对图景的超导态及其机制。','Studies superconducting states and pairing mechanisms beyond the conventional picture.','superconductivity',['correlations','cuprates']],
 ['heavy-fermion-superconductivity','重费米子超导','Heavy-fermion superconductivity','area','重费米子体系中的超导，是重费米子研究与超导研究的交集。','Superconductivity in heavy-fermion systems connects two overlapping research communities.','superconductivity',['heavy-fermions','correlations']],
 ['colossal-magnetoresistance','庞磁阻','Colossal magnetoresistance','phenomenon','某些材料的电阻随磁场发生巨大变化，涉及电荷、自旋与晶格的联系。','A very large change of electrical resistance with magnetic field links charge, spin and lattice behavior.','correlations',['magnetism','coupled-degrees']],
 ['multiferroics','多铁性与多铁材料','Multiferroics','material','多种铁性有序在同一材料中共存，研究者关心这些有序如何相互影响。','Multiple ferroic orders coexist in a material; researchers study how those orders interact.','correlations',['magnetism','symmetry','coupled-degrees']],
 ['quantum-phase-transitions','量子相变','Quantum phase transitions','phenomenon','改变压力、磁场等参数，可以在零温极限改变体系的基态。','Tuning pressure, magnetic field or another parameter can change the ground state in the zero-temperature limit.','correlations',['criticality','symmetry']],
 ['dirac-semimetals','Dirac 半金属','Dirac semimetals','material','低能电子态呈现 Dirac 型色散的材料体系，与晶体对称性和拓扑研究相连。','Materials with Dirac-like low-energy electronic states connect crystal symmetry and topology.','topology',['weyl','symmetry']],
 ['magnetic-topological-insulators','磁性拓扑绝缘体','Magnetic topological insulators','material','磁性与拓扑电子态相遇的材料研究方向。','Materials research at the intersection of magnetism and topological electronic states.','topology',['magnetism','topological-insulators']],
 ['topological-heterostructures','拓扑异质结构与器件','Topological heterostructures','material','通过界面组合研究拓扑态与器件功能；这是异质结构中的特定方向。','Combines interfaces to study topological states and devices, a specific subset of heterostructures.','topology',['heterostructures','interfaces','electronics']],
 ['non-fermi-liquids','非费米液体','Non-Fermi liquids','state','一些金属的行为超出常规费米液体描述，常与强关联和量子临界问题相连。','Some metals behave beyond the conventional Fermi-liquid description, often connecting correlations and quantum criticality.','correlations',['criticality','heavy-fermions']],
 ['bose-einstein-condensation','玻色—爱因斯坦凝聚','Bose–Einstein condensation','phenomenon','大量玻色子占据同一量子态，连接冷原子、多体物理和超流研究。','Many bosons occupy one quantum state, connecting cold atoms, many-body physics and superfluidity.','cold-atoms',['superfluidity','quantum-simulation']],
 ['artificial-correlated-systems','人工关联量子体系','Artificial correlated systems','area','在可设计的结构中研究多体关联，例如人工晶格与部分莫尔体系。','Studies many-body correlations in designed structures, including artificial lattices and some moiré systems.','quantum-platforms',['moire','correlations','cold-atoms']],
 ['photovoltaics','光伏材料','Photovoltaic systems','area','研究吸光、载流子产生与输运如何影响光电转换。','Studies how absorption, carrier generation and transport affect light-to-electricity conversion.','energy',['quantum-dots','semiconductors']],
 ['photocatalysis','光催化','Photocatalysis','area','研究光激发与材料电子结构如何推动化学反应。','Studies how light excitation and material electronic structure drive chemical reactions.','energy',['catalysis','quantum-dots']],
 ['batteries-fuel-cells','电池与燃料电池','Batteries & fuel cells','area','关注能源存储和转换中的材料问题；具体研究需说明量子效应的作用。','Materials questions in energy storage and conversion; a particular study must identify the role of quantum effects.','energy',['catalysis','electronic-design']],
 ['thermoelectrics','热电材料','Thermoelectrics','area','研究热与电之间的转换，以及电子和晶格输运如何协同影响性能。','Studies conversion between heat and electricity and the roles of electronic and lattice transport.','energy',['transport-probes','coupled-degrees']],
 ['quantum-simulation','量子模拟','Quantum simulation','approach','用可控量子体系研究另一个难以直接计算的量子体系。','Uses a controllable quantum system to study another quantum system that is difficult to calculate directly.','quantum-information',['cold-atoms','quantum-algorithms','correlations']]
];
for(const [id,zh,en,kind,sz,se,parent,related] of additions){
 A.nodes[id]={id,name:L(zh,en),kind,summary:L(sz,se),period:L('本收稿范围没有给出单一形成日期','The scope does not assign a single founding date'),children:[],events:[],sources:['npj'],related,evidence:[{source:'npj',locator:'Aims & Scope · topic list'}],questions:[L('哪些材料、机制或测量证据能推进这个问题？','Which materials, mechanisms or measurements can advance this question?')],questionStatus:'reader-synthesis'};
 A.nodes[parent].children.push(id);
}
A.nodes['heavy-fermion-superconductivity'].events=['heavy1979'];
const newQuestions={
 'unconventional-superconductivity':['什么相互作用使电子形成非常规配对？','Which interactions produce unconventional electron pairing?'],
 'heavy-fermion-superconductivity':['重费米子行为与超导配对有什么联系？','How is heavy-fermion behavior connected to superconducting pairing?'],
 'colossal-magnetoresistance':['自旋、电荷和晶格如何共同改变电阻？','How do spin, charge and lattice changes combine to alter resistance?'],
 'multiferroics':['怎样用电场控制磁性，或用磁场改变极化？','How can electric fields control magnetism, or magnetic fields change polarization?'],
 'quantum-phase-transitions':['哪个调控参数改变基态，临界附近会发生什么？','Which tuning parameter changes the ground state, and what happens near the transition?'],
 'dirac-semimetals':['哪些晶体对称性支持或保护 Dirac 电子态？','Which crystal symmetries support or protect Dirac electronic states?'],
 'magnetic-topological-insulators':['磁性如何改变拓扑表面态与输运？','How does magnetism change topological surface states and transport?'],
 'topological-heterostructures':['界面的组合怎样创造或控制拓扑态？','How can combining interfaces create or control topological states?'],
 'non-fermi-liquids':['哪些测量能区分不同的异常金属机制？','Which measurements distinguish mechanisms of unusual metallic behavior?'],
 'bose-einstein-condensation':['相互作用与限制空间如何改变凝聚态？','How do interactions and confinement change the condensate?'],
 'artificial-correlated-systems':['哪些相互作用和几何参数可以独立调节？','Which interactions and geometric parameters can be tuned independently?'],
 'photovoltaics':['哪些电子态帮助产生并分离可用载流子？','Which electronic states help generate and separate useful charge carriers?'],
 'photocatalysis':['光生电荷怎样在复合前参与目标反应？','How can photoexcited charges drive the intended reaction before recombining?'],
 'batteries-fuel-cells':['电子结构如何影响电荷输运和反应路径？','How does electronic structure affect charge transport and reaction pathways?'],
 'thermoelectrics':['怎样同时调节电子输运和晶格热传导？','How can electronic transport and lattice heat conduction be tuned together?'],
 'quantum-simulation':['如何验证模拟器确实再现了目标模型？','How can a simulator be validated against the intended model?']
};
for(const [id,q] of Object.entries(newQuestions))A.nodes[id].questions=[L(...q)];

const extraProps=[['spin','自旋','Spin','电子的内禀量子属性，与磁性和量子信息研究相关。','An intrinsic quantum property of electrons, relevant to magnetism and quantum information.'],['magnetic-moment','磁矩','Magnetic moment','描述一个体系磁性响应的物理量。','A quantity describing a system’s magnetic character.'],['symmetries','对称性','Symmetries','描述哪些变换保持体系的相关规律或结构不变。','Describes transformations that leave relevant laws or structures unchanged.']];
for(const [id,zh,en,sz,se] of extraProps){A.nodes[id]={id,name:L(zh,en),kind:'property',summary:L(sz,se),period:L('基本概念；没有单一领域成立日期','A basic concept, without a single field-founding date'),children:[],events:[],sources:['physhAbout'],related:['coupled-degrees','magnetism','symmetry'],evidence:[{source:'physhAbout',locator:'Properties facet'}],questions:[L('如何测量或控制这一性质？','How can this property be measured or controlled?')],questionStatus:'reader-synthesis'}; A.nodes['coupled-degrees'].children.push(id);}
const group=(id,zh,en,role,nodes,featured,locator)=>({id,name:L(zh,en),role:L(...role),members:nodes.split(' '),featured:featured.split(' '),locator});
const views={
 physh:{id:'physh',label:'PhySH',tag:L('物理学主题词','Physics subject headings'),title:L('同一个主题，不同的研究角色','One topic, several research roles'),intro:L('APS 的多维分类：研究方向、物理体系、性质与方法。','The APS faceted vocabulary: research areas, physical systems, properties and techniques.'),basis:L('四个正式维度；主题与词条的对应经过人工核对。专业活动维度未展示。官方词条可跨多个维度。','Four official facets; topic-to-concept matches are curated and verified. Professional Topics is omitted. Official concepts can span facets.'),source:'physhAbout',groups:[
  group('research','研究方向','Research Areas',['正式维度','Official facet'],'','superconductivity topology crystal-growth magnetism','PhySH · Research Areas'),
  group('systems','物理体系','Physical Systems',['正式维度','Official facet'],'','topological-insulators quantum-dots heavy-fermions spin-ice','PhySH · Physical Systems'),
  group('properties','性质','Properties',['正式维度','Official facet'],'','spin magnetic-moment symmetries','PhySH · Properties'),
  group('techniques','研究方法','Techniques',['正式维度','Official facet'],'','crystal-growth photoemission first-principles quantum-simulation','PhySH · Techniques')
 ]},
 goyal:{id:'goyal',label:'Goyal',tag:L('综述的组织方式 · 2025','Review structure · 2025'),title:L('从量子性质走向材料与应用','From quantum properties to materials and uses'),intro:L('四个核心概念连接材料、制备与应用；拓扑与对称性在原文共用一个小节。','Four central concepts connect materials, preparation and applications. Topology and symmetry share one subsection in the review.'),basis:L('依据原文章节与表1、表3；分成七个视觉区域是本图的整理，不是七种互斥材料。关联表示原文讨论的主题联系。','Based on the paper’s sections and Tables 1 and 3. Seven visual regions are our organization, not seven exclusive material classes. Membership links topics discussed in the paper.'),source:'goyal',groups:[
  group('confinement','量子限域','Quantum confinement',['性质主题','Property theme'],'confinement quantum-dots quantum-wells quantum-wires excitons two-dimensional','confinement quantum-dots quantum-wells excitons','pp. 3–5'),
  group('correlations','强电子关联','Strong correlations',['性质主题','Property theme'],'correlations mott superconductivity cuprates heavy-fermions magnetism spin-liquids frustration many-body-methods soft-organic criticality','correlations mott superconductivity spin-liquids','pp. 5–8'),
  group('topology','拓扑','Topology',['性质主题','Property theme'],'topology topological-insulators topological-superconductivity weyl hall integer-hall fractional-hall majorana topological-chemistry','topology topological-insulators weyl majorana','pp. 8–11; Table 1'),
  group('symmetry','对称性','Symmetry',['性质主题','Property theme'],'symmetry symmetry-breaking symmetries coupled-degrees topological-insulators topological-chemistry magnetism','symmetry symmetry-breaking coupled-degrees topological-insulators','pp. 8–11'),
  group('systems','材料、态与平台','Materials & systems',['表1','Table 1'],'superconductivity topological-insulators topological-superconductivity magnetism frustration quantum-dots quantum-wells quantum-wires superfluidity majorana defects hall two-dimensional spin-liquids metamaterials weyl','quantum-dots two-dimensional defects superfluidity','Table 1 · p. 12; mixes materials, states and effects'),
  group('applications','应用','Applications',['应用章节','Application sections'],'electronics sensing communication energy spintronics quantum-computing photonics neuromorphic quantum-dots defects topological-superconductivity photovoltaics photocatalysis batteries-fuel-cells thermoelectrics','quantum-computing sensing energy photonics','pp. 11–26'),
  group('preparation','材料制备','Preparation',['表3','Table 3'],'synthesis-methods thin-films solution-synthesis solid-state-processing patterning self-assembly spray-processing nano-synthesis','thin-films solution-synthesis patterning self-assembly','Table 3 · pp. 27–30; methods have broader uses')
 ]},
 npj:{id:'npj',label:'npj',tag:L('期刊收稿范围','Journal aims & scope'),title:L('一个期刊希望汇聚哪些研究？','Which research does a journal bring together?'),intro:L('六个收稿主题，结合现象、材料体系与技术目标；它们可以重叠。','Six editorial topics combine phenomena, material systems and technological goals. Their boundaries overlap.'),basis:L('区域依据官方 Aims & Scope。明确列出的主题与本图添加的相关对应分别标注；未列出不代表期刊排除。','Regions follow the official Aims & Scope. Explicitly named topics are distinguished from our related mappings. A topic not itemized is not necessarily excluded by the journal.'),source:'npj',groups:[
  group('superconductivity','超导与超导材料','Superconductivity',['收稿主题','Scope topic'],'superconductivity unconventional-superconductivity cuprates iron-superconductors heavy-fermion-superconductivity bcs topological-superconductivity moire','superconductivity cuprates iron-superconductors heavy-fermion-superconductivity','Superconductivity and superconducting materials'),
  group('correlated','关联电子物理与材料','Correlated electrons',['收稿主题','Scope topic'],'correlations mott magnetism colossal-magnetoresistance multiferroics quantum-phase-transitions many-body-methods criticality cuprates heavy-fermions frustration spin-liquids pseudogap moire orbitals','correlations mott multiferroics quantum-phase-transitions','Correlated electronic physics and materials'),
  group('topological','拓扑量子物理与材料','Topological quantum matter',['收稿主题','Scope topic'],'topology topological-insulators topological-superconductivity dirac-semimetals weyl majorana magnetic-topological-insulators topological-heterostructures hall fractional-hall topological-chemistry topology-chemistry','topological-insulators weyl majorana topological-superconductivity','Topological quantum physics and materials'),
  group('other','其他关联体系','Other correlated systems',['收稿主题','Scope topic'],'heavy-fermions non-fermi-liquids criticality hall integer-hall fractional-hall artificial-correlated-systems bose-einstein-condensation superfluidity cold-atoms moire quantum-platforms','heavy-fermions non-fermi-liquids fractional-hall cold-atoms','Other correlated systems'),
  group('energy','先进能源材料','Advanced energy materials',['收稿主题','Scope topic'],'energy photovoltaics photocatalysis batteries-fuel-cells thermoelectrics','photovoltaics photocatalysis batteries-fuel-cells thermoelectrics','Quantum phenomena in advanced energy materials'),
  group('technology','先进量子技术','Quantum technologies',['收稿主题','Scope topic'],'quantum-computing quantum-simulation communication sensing cold-atoms quantum-algorithms qubits quantum-platforms defects circuit-qed trapped-ions quantum-dots topological-superconductivity majorana','quantum-computing quantum-simulation communication sensing','Condensed matter and materials science issues in advanced quantum technologies')
 ]}
};
const named={
 superconductivity:'superconductivity unconventional-superconductivity cuprates iron-superconductors heavy-fermion-superconductivity',
 correlated:'correlations mott colossal-magnetoresistance multiferroics quantum-phase-transitions many-body-methods',
 topological:'topology topological-insulators topological-superconductivity dirac-semimetals weyl majorana magnetic-topological-insulators topological-heterostructures',
 other:'heavy-fermions non-fermi-liquids criticality hall integer-hall fractional-hall artificial-correlated-systems bose-einstein-condensation superfluidity cold-atoms',
 energy:'energy photovoltaics photocatalysis batteries-fuel-cells thermoelectrics',technology:'quantum-computing quantum-simulation communication sensing'
};
for(const g of views.physh.groups){g.members=verified.mappings.filter(m=>m.facets.includes(g.id)&&A.nodes[m.id]).map(m=>m.id);g.featured=g.featured.filter(id=>g.members.includes(id));for(const id of g.members)if(g.featured.length<4&&!g.featured.includes(id))g.featured.push(id);}
for(const view of Object.values(views))for(const g of view.groups){g.members=[...new Set(g.members.filter(Boolean))];g.featured=g.featured.filter(id=>g.members.includes(id));}
function memberships(id,viewId){return views[viewId].groups.filter(g=>g.members.includes(id));}
function mapping(id,viewId,groupId){
 if(viewId==='physh'){const m=verified.mappings.find(m=>m.id===id);return m?{status:m.match==='exact'?'official':'related',label:m.label,url:m.url,note:m.note||'',locator:verified.version}:null;}
 const g=views[viewId].groups.find(g=>g.id===groupId&&g.members.includes(id));if(!g)return null;
 if(viewId==='npj')return {status:named[groupId].split(' ').includes(id)?'named':'related',url:A.sources.npj.url,label:g.locator,locator:'Aims & Scope',note:({magnetism:'This category concerns magnetism in correlated-electron systems, not every magnetic system.',moire:'Only relevant superconducting or correlated moiré examples are intended.','cold-atoms':groupId==='technology'?'Mapping concerns cold-atom studies used for quantum technologies.':'', 'quantum-dots':'This mapping concerns quantum-dot materials used for quantum technologies.', 'topological-superconductivity':groupId==='technology'?'Mapping concerns proposed quantum-technology connections; it does not establish a working technology.':''})[id]||''};
 return {status:'reading',url:A.sources.goyal.url,label:g.locator,locator:g.locator,note:''};
}
function topics(viewId,groupId='all'){const groups=views[viewId].groups.filter(g=>groupId==='all'||g.id===groupId);return [...new Set(groups.flatMap(g=>g.members))].map(id=>A.nodes[id]);}
const bridges=[
 {id:'dots',topic:'quantum-dots',title:L('量子点：尺寸成为控制工具','Quantum dots: size as a control'),physics:L('尺寸如何改变电子能级和发光？','How does size change energy levels and emission?'),chemistry:L('怎样控制颗粒大小、表面和均匀性？','How can size, surfaces and uniformity be controlled?'),nodes:['confinement','quantum-dots','nano-synthesis','solution-synthesis','excitons'],sources:['cava','dots']},
 {id:'cuprates',topic:'cuprates',title:L('铜氧化物：组成与集体行为','Cuprates: composition meets collective behavior'),physics:L('电子怎样共同形成超导态？','How do electrons collectively form a superconducting state?'),chemistry:L('哪些组成、氧含量与结构可以稳定存在？','Which compositions, oxygen contents and structures are stable?'),nodes:['cuprates','superconductivity','correlations','doping','crystal-growth','bonding'],sources:['nature','cava']},
 {id:'topology',topic:'topological-chemistry',title:L('拓扑材料：把分类变成化合物','Topology: from a classification to a compound'),physics:L('哪些对称性和电子态允许特殊拓扑？','Which symmetries and electronic states allow unusual topology?'),chemistry:L('哪些轨道、成键和晶体结构能够实现它？','Which orbitals, bonds and crystal structures can realize it?'),nodes:['topology','topological-insulators','topological-chemistry','topology-chemistry','orbitals','bonding','crystal-chemistry'],sources:['cava','tqc']}
];
function bridgesFor(id){return bridges.filter(b=>b.nodes.includes(id));}
function eventsFor(viewId,groupId,topicId,scope,year,lens){
 const ids=scope==='topic'&&A.nodes[topicId]?A.descendants(topicId):scope==='category'&&groupId!=='all'?topics(viewId,groupId).flatMap(n=>A.descendants(n.id)):Object.keys(A.nodes);
 const eventIds=new Set(ids.flatMap(id=>A.nodes[id]?.events||[]));
 return Object.values(A.events).filter(e=>eventIds.has(e.id)&&e.year<=year&&(lens==='all'||e.lenses.includes(lens))).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
}
return {A,views,verified,memberships,mapping,topics,bridges,bridgesFor,eventsFor};
});
