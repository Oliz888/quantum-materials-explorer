/* Reading-grounded additions. Questions and grouping are editorial synthesis,
   not quotations or an empirically established disciplinary genealogy. */
(function(root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.QMAtlasReadings = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const L = (zh, en) => ({zh, en});
  const readings = [
    {id:'nature', label:'Nature Physics · 2016', locator:'p. 105',
      title:L('一个更宽的物理学共同名称','A broader name within physics'),
      argument:L('从对称性与有序、强关联问题，到拓扑和人工量子平台：社论说明为何需要更宽的共同名称。','The editorial traces a widening scope: symmetry and order, strong correlations, topology, and engineered quantum platforms.'),
      limit:L('这是名称与问题范围的历史叙述，没有比较所有学科的起源先后。','This is an account of a label and research scope, not a comparison establishing which discipline founded the whole field first.'),
      groups:[
        {title:L('有序与强关联','Order and strong correlations'),locator:'p. 105, columns 1–2',nodes:['symmetry','superconductivity','superfluidity','correlations','heavy-fermions','criticality','pseudogap']},
        {title:L('拓扑与涌现激发','Topology and emergent excitations'),locator:'p. 105, columns 1–3',nodes:['hall','topological-insulators','graphene','spin-ice','skyrmions','weyl']},
        {title:L('拓宽共同研究范围','An expanding research umbrella'),locator:'p. 105, column 3',nodes:['two-dimensional','quantum-platforms','cold-atoms','trapped-ions','defects','circuit-qed','heterostructures','quantum-computing']}
      ]},
    {id:'cava',label:'Cava, de Leon & Xie · 2021',locator:'pp. 2777–2779',
      title:L('物理与化学之间的双向联系','Connections between physics and chemistry'),
      argument:L('导言把此前很大程度上平行发展的传统联系起来，化学通过材料发现、成键、结构、轨道和掺杂参与解释与设计。','The introduction seeks connections between traditions that had largely developed in parallel. Chemistry contributes discovery, bonding, structure, orbital ideas and doping principles.'),
      limit:L('专刊的搭桥目标不是化学首次进入的日期，也不证明两个学科已合并。','A special issue’s bridge-building agenda is neither chemistry’s entry date nor proof that two disciplines have merged.'),
      groups:[
        {title:L('新材料的实验发现','Experimental discovery of materials'),locator:'p. 2778, theme 1; spin ice also p. 2778 overview',nodes:['topology-chemistry','photoemission','skyrmions','spin-liquids','spin-ice','hexagonal-perovskites','superconductivity','bonding','crystal-growth']},
        {title:L('理论预测与解释','Theoretical prediction and interpretation'),locator:'pp. 2778–2779, theme 2',nodes:['orbitals','doping','electronic-design','coupled-degrees']},
        {title:L('量子信息与能源','Quantum information and energy'),locator:'p. 2779, theme 3',nodes:['quantum-algorithms','electrides','catalysis','nano-synthesis','quantum-dots','qubits']}
      ]},
    {id:'goyal',label:'Goyal et al. · 2025',locator:'pp. 1–32; Tables 1–3',
      title:L('性质、材料、方法与应用的联系','Links among properties, materials, methods and uses'),
      argument:L('综述围绕限域、关联、拓扑和对称性组织性质，并把多类材料、制备方法与应用联系起来。','The review organizes properties around confinement, correlations, topology and symmetry, then connects material types, fabrication methods and applications.'),
      limit:L('应用导向的综述不能证明整个领域已进入应用阶段；表中混合了材料、现象、态和候选平台。','An applications-focused review does not establish an application-only stage for the field. Its tables mix materials, effects, states and candidate platforms.'),
      groups:[
        {title:L('四个性质主题','Four property themes'),locator:'pp. 3–11',nodes:['confinement','correlations','topology','symmetry','excitons','coupled-degrees']},
        {title:L('材料、态与平台','Materials, states and platforms'),locator:'Table 1, p. 12',nodes:['superconductivity','topological-insulators','topological-superconductivity','magnetism','frustration','quantum-wells','quantum-wires','quantum-dots','superfluidity','majorana','defects','hall','two-dimensional','spin-liquids','metamaterials','weyl']},
        {title:L('应用研究方向','Application areas'),locator:'pp. 11–26',nodes:['electronics','sensing','communication','energy','spintronics','quantum-computing','neuromorphic','photonics']},
        {title:L('理论与表征方法','Theory and characterization'),locator:'pp. 8–10, 15, 18, 21–23',nodes:['materials-theory','many-body-methods','first-principles','characterization','photoemission','scattering','local-probes','optical-probes','transport-probes','interfaces']},
        {title:L('制备与扩展阅读','Preparation and further reading'),locator:'Table 2, p. 26; Table 3, pp. 27–30',nodes:['soft-organic','synthesis-methods','thin-films','solution-synthesis','patterning','solid-state-processing','self-assembly','spray-processing']}
      ]}
  ];
  const formation = [
    {id:'traditions',title:L('已有研究传统','Existing traditions'),text:L('凝聚态、固体化学、晶体化学与材料制备先于共同名称存在。','Condensed matter, solid-state chemistry, crystal chemistry and materials preparation predate the shared label.'),nodes:['physics','chemistry','materials-science'],sources:['nature','cava']},
    {id:'broadening',title:L('问题与名称扩展','Problems and labels broaden'),text:L('在凝聚态物理内部，强关联之外的拓扑与人工平台推动更宽的共同名称。','Within condensed-matter physics, topology and engineered platforms beyond strong correlations motivate a broader label.'),nodes:['correlations','topology','quantum-platforms'],sources:['nature']},
    {id:'exchange',title:L('通过具体问题会合','Connections through concrete problems'),text:L('组成、成键、轨道和生长，参与预测、发现和控制新的量子态。','Composition, bonding, orbitals and growth participate in predicting, discovering and controlling quantum states.'),nodes:['bonding','orbitals','doping','crystal-growth'],sources:['cava']},
    {id:'applications',title:L('新的目标与反馈','New goals and feedback'),text:L('计算、传感与能源提出新的材料问题；基础发现仍在继续。','Computing, sensing and energy pose new materials questions alongside continuing basic discovery.'),nodes:['quantum-computing','sensing','energy'],sources:['cava','goyal']}
  ];

  function enrich({N, nodes, events}) {
    function add(d) {
      const refs = [...new Set(d.evidence.map(e => e[0]))];
      N(d.id,d.zh,d.en,d.kind,d.summary[0],d.summary[1],
        ...(d.period || ['这些阅读未指定单一形成年份','These readings assign no single founding date']),
        d.children || [],d.events || [],refs,d.related || []);
      nodes[d.id].evidence = d.evidence.map(([source, locator]) => ({source, locator}));
      nodes[d.id].questions = (d.questions || []).map(q => L(...q));
    }
    add({id:'landscape',zh:'领域的形成',en:'Field formation',kind:'orientation',
      summary:['从多个研究传统出发，考察量子材料如何形成共同问题、材料与研究身份。','Trace how several research traditions connect through shared problems, materials and a quantum-materials identity.'],
      children:['physics','chemistry','materials-science','quantum-information','quantum-materials'],
      period:['旧研究传统汇合；共同名称在2000至2010年代更显著','Older traditions converge; the shared label becomes more visible in the 2000s–2010s'],
      events:['cifar2002','epiqs2013','umbrella2016','bridge2021'],evidence:[['nature','p. 105'],['cava','pp. 2777–2779'],['goyal','pp. 1–3']],
      questions:[['“先行”指先发现现象、先创造材料，还是先组织共同名称？','Does “leading” mean discovering a phenomenon, making a material, or organizing a shared identity first?'],['哪些合作与方法流动的证据，能区分共同名称与共同研究领域？','What evidence of collaboration and method transfer distinguishes a shared name from a connected field?']]});
    add({id:'chemistry',zh:'化学',en:'Chemistry',kind:'field',
      summary:['从组成、成键、结构与反应出发，发现新材料并提出解释与设计原则。这里展开与量子材料相连的部分。','Starts from composition, bonding, structure and reactions to discover materials and develop explanations and design principles. Only quantum-materials connections are expanded.'],
      children:['solid-chemistry','electronic-design','nano-synthesis','catalysis','soft-organic'],related:['physics','materials-science','quantum-materials'],
      period:['这些化学传统早于“量子材料”共同名称；2021年是搭桥议程的节点','These chemical traditions predate the umbrella; 2021 marks an explicit bridge-building agenda'],evidence:[['cava','pp. 2777–2779']],
      questions:[['化学概念何时改变了物理学家能够研究的材料与现象？','When do chemical ideas change which materials and phenomena physicists can investigate?'],['如何识别化学家参与解释与发现，而不仅是供应样品？','How can we identify chemistry’s role in explanation and discovery, beyond supplying samples?']]});
    add({id:'materials-science',zh:'材料科学与工程',en:'Materials science & engineering',kind:'field',
      summary:['把制备、结构、性质与性能联系起来；样品质量、界面和测量方法会改变可研究的问题。','Connects preparation, structure, properties and performance. Sample quality, interfaces and measurement methods shape which questions can be studied.'],
      children:['synthesis-methods','characterization','materials-theory','interfaces','applications'],related:['chemistry','physics','quantum-information'],evidence:[['nature','p. 105, column 3'],['cava','p. 2778'],['goyal','pp. 11–31']],
      questions:[['哪些制备或表征进步让一个新量子现象变得可重复研究？','Which advances in preparation or measurement make a new quantum phenomenon reproducible?']]});
    add({id:'symmetry',zh:'对称性与相变',en:'Symmetry & phase transitions',kind:'framework',
      summary:['研究物质变成新状态时，哪些对称性保持或改变。拓扑又补充了仅靠局部有序难以描述的情形。','As matter changes state, some symmetries remain and others change. Topology adds ways to describe states that local order alone can miss.'],
      children:['symmetry-breaking','coupled-degrees'],related:['topology','magnetism','superconductivity'],
      period:['Nature强调1960至1970年代对有序与对称性的关注，及1980年代的挑战','Nature emphasizes order and symmetry in the 1960s–1970s and challenges in the 1980s'],
      evidence:[['nature','p. 105, column 1'],['goyal','pp. 8–11']],questions:[['哪些相变可以用对称性破缺描述，哪些需要别的框架？','Which phase changes can symmetry breaking describe, and which need another framework?']]});
    add({id:'symmetry-breaking',zh:'对称性破缺与有序',en:'Symmetry breaking & order',kind:'framework',summary:['Landau–Ginzburg路线寻找描述有序的量。量子霍尔等问题说明，这不是所有量子态的完整分类。','The Landau–Ginzburg approach identifies quantities that describe order. Quantum Hall states help show why this is not a complete classification of quantum states.'],related:['hall','criticality'],evidence:[['nature','p. 105, column 1'],['goyal','pp. 8–11']],questions:[['什么可以作为某种状态的可测量“有序指标”？','What measurable quantity signals order in a given state?']]});
    add({id:'coupled-degrees',zh:'晶格、电荷、轨道与自旋',en:'Lattice, charge, orbital & spin',kind:'framework',summary:['原子位置、电荷、电子轨道和磁性相互影响；改变组成或结构会改变它们之间的关系。','Atomic positions, electric charge, electron orbitals and magnetism affect one another. Changing composition or structure changes these connections.'],children:['orbitals','doping'],related:['magnetism','bonding'],evidence:[['cava','p. 2777'],['goyal','pp. 2–3']],questions:[['哪一种变化主导材料的新状态，其余变化如何响应？','Which change drives a new material state, and how do the others respond?']]});
    add({id:'criticality',zh:'量子临界性',en:'Quantum criticality',kind:'phenomenon',summary:['研究低温相变附近的强烈量子涨落，以及它们与异常金属行为和超导的联系。','Studies strong quantum fluctuations near low-temperature phase changes and their links to unusual metals and superconductivity.'],related:['correlations','heavy-fermions','superconductivity'],evidence:[['nature','p. 105, columns 1–2'],['goyal','pp. 5–8']],questions:[['接近量子相变如何改变电子的集体行为？','How does approaching a quantum phase transition change collective electron behavior?']]});
    add({id:'pseudogap',zh:'赝能隙',en:'Pseudogap',kind:'phenomenon',summary:['某些材料在进入超导之前，低能电子态就已减少。这成为理解铜氧化物的重要问题。','In some materials, low-energy electronic states are reduced before superconductivity begins. This is an important problem in cuprates.'],related:['cuprates','correlations'],evidence:[['nature','p. 105, columns 1–2']],questions:[['赝能隙与超导配对或其他有序有什么关系？','How is the pseudogap related to superconducting pairing or other forms of order?']]});
    add({id:'superfluidity',zh:'超流',en:'Superfluidity',kind:'phenomenon',summary:['流体中出现无黏滞流动等集体量子行为；它让共同范围超出固体。','Collective quantum behavior in fluids includes flow without viscosity. It extends the shared scope beyond solids.'],related:['cold-atoms','superconductivity'],evidence:[['nature','p. 105, column 1'],['goyal','Table 1, p. 12']],questions:[['液体中的集体量子态与超导有哪些联系和区别？','How are collective quantum states in fluids related to, and different from, superconductivity?']]});
    add({id:'spin-ice',zh:'自旋冰与涌现磁单极子',en:'Spin ice & emergent monopoles',kind:'state',summary:['局部磁性排列受类似冰的规则限制；某些激发可用有效磁单极子描述。','Local magnetic arrangements follow ice-like constraints. Some excitations can be described as effective magnetic monopoles.'],related:['frustration','spin-liquids'],evidence:[['nature','p. 105, column 2 and reference 2'],['cava','p. 2778, theme overview']],questions:[['晶格几何如何使集体激发表现得像新粒子？','How can lattice geometry make collective excitations behave like new particles?']]});
    add({id:'skyrmions',zh:'斯格明子与磁纹理',en:'Skyrmions & magnetic textures',kind:'state',summary:['磁矩形成扭转纹理。化学组成、晶体结构和相互作用影响它们的形成与运动。','Magnetic moments form twisting textures. Composition, crystal structure and interactions influence their formation and motion.'],related:['spintronics','magnetism','crystal-chemistry'],evidence:[['nature','p. 105, column 2 and reference 3'],['cava','p. 2778, Magnetic Skyrmion Materials']],questions:[['哪些成分与结构能稳定并控制这些磁纹理？','Which compositions and structures stabilize and control these magnetic textures?']]});
    add({id:'weyl',zh:'Weyl 半金属',en:'Weyl semimetals',kind:'material',summary:['某些固体里的低能电子激发表现得像Weyl粒子，连接拓扑分类、对称性与具体晶体。','Low-energy electronic excitations in some solids behave like Weyl particles, linking topology and symmetry to particular crystals.'],related:['topology','symmetry','crystal-chemistry'],evidence:[['nature','p. 105, column 3'],['goyal','Table 1, p. 12']],questions:[['哪些晶体和对称性允许Weyl电子态？','Which crystals and symmetries allow Weyl electronic states?']]});
    add({id:'topological-superconductivity',zh:'拓扑超导',en:'Topological superconductivity',kind:'state',summary:['把超导配对与非平庸拓扑联系起来，是寻找特殊边界激发的一条路线。','Connects superconducting pairing with nontrivial topology, providing a route to unusual boundary excitations.'],children:['majorana'],related:['superconductivity','topology','quantum-computing'],evidence:[['goyal','Table 1, p. 12; pp. 21–23']],questions:[['怎样区分拓扑超导信号与其他机制产生的相似信号？','How can signatures of topological superconductivity be distinguished from similar signals with other origins?']]});
    add({id:'majorana',zh:'Majorana 模式',en:'Majorana modes',kind:'state',summary:['某些候选量子体系中的特殊准粒子模式，是拓扑量子计算研究的一部分；不是一种材料。','Special quasiparticle modes proposed in certain quantum systems are studied for topological computing. They are not a material category.'],related:['topological-superconductivity','qubits'],evidence:[['goyal','Table 1, p. 12; pp. 21–24']],questions:[['需要什么证据来识别、控制并使用这些候选模式？','What evidence is needed to identify, control and use these candidate modes?']]});
    add({id:'excitons',zh:'激子与光物质相互作用',en:'Excitons & light–matter interactions',kind:'phenomenon',summary:['电子与空穴可以形成束缚对；尺寸、介电环境和界面会改变它们的行为。','An electron and a hole can form a bound pair. Size, dielectric environment and interfaces change its behavior.'],related:['quantum-dots','two-dimensional','photonics'],evidence:[['goyal','pp. 3–5'],['cava','p. 2779, quantum algorithms']],questions:[['尺寸与界面如何改变吸光、发光和电子空穴的结合？','How do size and interfaces change absorption, emission and electron–hole binding?']]});
    add({id:'crystal-chemistry',zh:'晶体化学',en:'Crystal chemistry',kind:'area',summary:['考察原子怎样排列和连接，以及这些结构如何改变电子和磁性。','Studies how atoms are arranged and connected, and how those structures change electronic and magnetic behavior.'],children:['hexagonal-perovskites','electrides'],related:['bonding','spin-liquids','skyrmions'],evidence:[['cava','p. 2778']],questions:[['哪些结构单元使有趣的电子态成为可能？','Which structural building blocks make an unusual electronic state possible?']]});
    add({id:'topology-chemistry',zh:'拓扑材料的化学路线',en:'Chemical approaches to topology',kind:'area',summary:['Cava介绍从固体化学出发理解拓扑材料、单晶生长与性质测量的路线。','Cava introduces a solid-state-chemistry approach to topological materials, single-crystal growth and property measurements.'],children:['topological-insulators','weyl'],related:['topological-chemistry','crystal-growth','photoemission'],evidence:[['cava','p. 2778, Topological Quantum Materials from the Viewpoint of Chemistry']],questions:[['怎样把抽象电子态分类转化为具体可研究的化合物？','How can an abstract classification of electronic states become a concrete compound to investigate?']]});
    add({id:'hexagonal-perovskites',zh:'六方氧化物钙钛矿',en:'Hexagonal oxide perovskites',kind:'material',summary:['共面的结构单元形成链段或簇，提供探索磁性、轨道与几何阻挫的材料家族。','Face-sharing structural units form chain segments or clusters, offering a family for exploring magnetism, orbitals and geometric frustration.'],related:['frustration','orbitals','crystal-chemistry'],evidence:[['cava','p. 2778, Hexagonal Perovskites as Quantum Materials']],questions:[['原子连接方式如何阻止常规磁性有序？','How can atomic connectivity frustrate conventional magnetic order?']]});
    add({id:'electronic-design',zh:'电子结构与化学设计',en:'Electronic structure & chemical design',kind:'area',summary:['用化学和物理原则预测电子如何分布，以及哪些新化合物与性质可能存在。','Uses chemical and physical principles to predict electronic arrangements and possible new compounds and properties.'],children:['orbitals','doping','topological-chemistry'],related:['bonding','quantum-algorithms'],evidence:[['cava','pp. 2778–2779, theme 2']],questions:[['化学直觉与电子理论在哪些具体预测上相遇？','Where do chemical intuition and electronic theory meet in concrete predictions?']]});
    add({id:'orbitals',zh:'固体中的轨道效应',en:'Orbital effects in solids',kind:'mechanism',summary:['电子轨道的形状和占据影响成键、磁性与有效维度；它们也与自旋和晶格相互作用。','Orbital shape and occupancy influence bonding, magnetism and effective dimensionality, while interacting with spin and the lattice.'],related:['coupled-degrees','bonding','magnetism'],evidence:[['cava','p. 2778, Orbital Effects in Solids']],questions:[['轨道安排如何改变电子移动的方向和磁性？','How does orbital arrangement change the directions of electron motion and magnetic behavior?']]});
    add({id:'doping',zh:'掺杂与缺陷控制',en:'Doping & defect control',kind:'approach',summary:['改变组成或缺陷可能改变电子数量与能量；可实现的掺杂受化学稳定性等条件限制。','Changing composition or defects can change carrier populations and energies; feasible doping depends on constraints such as chemical stability.'],related:['cuprates','defects','electronic-design'],evidence:[['cava','pp. 2778–2779, Understanding Doping']],questions:[['目标电子状态在什么化学条件下能够实现并稳定存在？','Under which chemical conditions can a target electronic state be realized and remain stable?']]});
    add({id:'electrides',zh:'电子化合物',en:'Electrides',kind:'material',summary:['某些电子占据结构空隙，发挥类似阴离子的作用；这些材料把电子结构与催化反应联系起来。','Some electrons occupy structural cavities and act like anions. These materials connect electronic structure with catalytic chemistry.'],related:['catalysis','crystal-chemistry','energy'],evidence:[['cava','p. 2779, Inorganic Electrides']],questions:[['空隙中的电子如何改变催化活性？','How do electrons in structural cavities change catalytic activity?']]});
    add({id:'catalysis',zh:'催化与化学反应',en:'Catalysis & chemical reactions',kind:'area',summary:['研究材料的表面与电子结构如何改变反应路径，例如合成氨和选择性氢化。','Studies how surfaces and electronic structure change reaction pathways, including ammonia synthesis and selective hydrogenation.'],children:['electrides'],related:['energy','solution-synthesis'],evidence:[['cava','p. 2779'],['goyal','pp. 18–21']],questions:[['哪一种电子结构变化提高反应速率或选择性？','Which electronic-structure changes improve reaction rate or selectivity?']]});
    add({id:'soft-organic',zh:'软物质与有机量子材料',en:'Soft & organic quantum materials',kind:'area',summary:['Goyal在关联材料中讨论有机体系，并在扩展阅读中列出软物质路线。这里标明其较有限的覆盖范围。','Goyal includes organic systems among correlated materials and lists soft-matter routes in further reading. Coverage is more limited than for its central themes.'],related:['self-assembly','chemistry','correlations'],evidence:[['goyal','pp. 6–7; Table 2, p. 26']],questions:[['分子设计与自组装可以为量子态带来什么新控制方式？','What new control over quantum states can molecular design and self-assembly offer?']]});
    add({id:'quantum-platforms',zh:'人工量子平台',en:'Engineered quantum platforms',kind:'area',summary:['通过原子、离子、固体缺陷、电路和异质结构，构造可控制的量子体系。','Builds controllable quantum systems using atoms, ions, defects, circuits and heterostructures.'],children:['cold-atoms','trapped-ions','defects','circuit-qed','heterostructures','quantum-dots'],related:['quantum-information','amo'],evidence:[['nature','p. 105, column 3'],['cava','pp. 2777, 2779']],questions:[['哪些问题能在不同平台上用相似的量子控制方法研究？','Which questions can be studied across different platforms using related quantum-control methods?']]});
    add({id:'cold-atoms',zh:'冷原子与量子模拟',en:'Cold atoms & quantum simulation',kind:'area',summary:['冷却并控制原子，构造能够检验多体行为的实验体系。','Cools and controls atoms to build experimental systems for studying many-body behavior.'],related:['correlations','superfluidity','quantum-algorithms'],evidence:[['nature','p. 105, column 3']],questions:[['可控制的原子系统能检验哪些材料模型？','Which models of materials can controlled atomic systems test?']]});
    add({id:'trapped-ions',zh:'囚禁离子',en:'Trapped ions',kind:'area',summary:['控制带电原子及其相互作用，研究量子信息和人工量子物质。','Controls charged atoms and their interactions for quantum information and engineered quantum matter.'],related:['qubits','cold-atoms'],evidence:[['nature','p. 105, column 3']],questions:[['如何控制相互作用并保留量子相干？','How can interactions be controlled while preserving quantum coherence?']]});
    add({id:'defects',zh:'固体缺陷与色心',en:'Solid-state defects & color centers',kind:'material',summary:['例如金刚石NV色心：特定缺陷的自旋可用于传感和量子信息；周围材料影响相干性。','For example, spins at diamond NV centers can support sensing and quantum information. The surrounding material affects coherence.'],related:['doping','sensing','qubits'],evidence:[['nature','p. 105, column 3'],['goyal','p. 2; Table 1, p. 12; pp. 15–17']],questions:[['哪些缺陷和表面条件使自旋更稳定、更容易读取？','Which defect and surface conditions make spins more stable and easier to read?']]});
    add({id:'circuit-qed',zh:'电路QED',en:'Circuit QED',kind:'area',summary:['电路中的量子元件与微波场相互作用，连接超导材料、量子光学与信息处理。','Quantum circuit elements interact with microwave fields, connecting superconducting materials, quantum optics and information processing.'],related:['superconductivity','qubits','quantum-computing'],evidence:[['nature','p. 105, column 3']],questions:[['材料损耗怎样限制电路的相干时间？','How do material losses limit coherence in a quantum circuit?']]});
    add({id:'qubits',zh:'量子比特与相干性',en:'Qubits & coherence',kind:'framework',summary:['量子信息的基本单元可以有多种物理实现。材料、噪声与控制方式决定它是否可靠。','The basic unit of quantum information has many physical implementations. Materials, noise and control determine its reliability.'],related:['quantum-dots','defects','circuit-qed','majorana'],evidence:[['cava','pp. 2777, 2779'],['goyal','pp. 23–24']],questions:[['哪些材料因素限制相干时间、读取精度和扩展规模？','Which materials factors limit coherence, readout accuracy and scaling?']]});
    add({id:'quantum-algorithms',zh:'关联物质的量子算法',en:'Quantum algorithms for matter',kind:'approach',summary:['研究如何计算或模拟相互作用电子与纠缠态，也把量子信息工具带回材料理论。','Studies how to compute or simulate interacting electrons and entangled states, bringing quantum-information tools back into materials theory.'],related:['correlations','spin-liquids','quantum-computing'],evidence:[['cava','p. 2779, Quantum Information and Algorithms']],questions:[['新算法能解释哪些原来难以计算的多体状态？','Which previously difficult many-body states can new algorithms help explain?']]});
    add({id:'applications',zh:'应用研究',en:'Application research',kind:'area',summary:['这些目标提出新的材料与控制问题。不同平台成熟程度不同，潜力不等于已经实现。','These goals pose new materials and control problems. Maturity varies across platforms; potential is not the same as achievement.'],children:['electronics','sensing','communication','energy','spintronics','quantum-computing','photonics'],related:['materials-science','quantum-materials'],evidence:[['goyal','pp. 11–26'],['cava','p. 2779']],questions:[['应用需求如何反过来改变材料选择与基础问题？','How do application needs change materials choices and basic research questions?']]});
    const applications = [
      ['electronics','先进电子学','Advanced electronics','电子输运和可调电子结构支持低功耗与新型器件研究。','Transport and tunable electronic structures support research on low-power and new device designs.',['semiconductors','two-dimensional','confinement'],'pp. 11–15','哪些性质优势能在真实器件中保留？','Which property advantages survive in a working device?'],
      ['sensing','量子传感与成像','Quantum sensing & imaging','用量子态对磁场、电场或其他环境变化的响应来测量。','Uses the response of quantum states to magnetic fields, electric fields or other environmental changes.',['defects','quantum-dots'],'pp. 15–17','怎样在灵敏度、稳定性和可用环境之间取舍？','How do sensitivity, stability and operating conditions trade off?'],
      ['communication','量子通信与信息处理','Quantum communication & information','把量子态的产生、传输与读取连接起来；材料影响光源和接口。','Connects generation, transmission and readout of quantum states; materials shape sources and interfaces.',['photonics','qubits'],'pp. 17–18','材料和接口怎样影响量子信息的传递？','How do materials and interfaces affect the transfer of quantum information?'],
      ['energy','能量转换与存储','Energy conversion & storage','包括光伏、热电、电池和催化；每种用途依赖的具体机制需要分别判断。','Includes photovoltaics, thermoelectrics, batteries and catalysis; the relevant mechanism must be assessed for each use.',['catalysis','two-dimensional','superconductivity'],'pp. 18–21','性能改善究竟来自哪种电子、结构或界面机制？','Which electronic, structural or interface mechanism actually improves performance?'],
      ['spintronics','自旋电子学','Spintronics','利用电子的自旋及其与运动的联系处理信息，连接磁性、拓扑和器件。','Uses electron spin and its coupling to motion to process information, linking magnetism, topology and devices.',['skyrmions','topology','magnetism'],'pp. 21–23','如何以较低能耗产生、传输和读取自旋信息？','How can spin information be created, transported and read with less energy?'],
      ['quantum-computing','量子计算','Quantum computing','不同量子平台尝试实现可靠的量子比特、控制与连接。','Different quantum platforms pursue reliable qubits, control and connections.',['qubits','quantum-algorithms','quantum-platforms'],'pp. 23–24','从单个量子比特到可扩展计算需要哪些材料进展？','Which materials advances are needed to go from individual qubits to scalable computing?'],
      ['photonics','光学与光子学','Optics & photonics','控制光的产生、传播与相互作用，连接量子点、二维材料和人工光学结构。','Controls light generation, propagation and interactions, connecting dots, 2D materials and engineered optical structures.',['excitons','metamaterials','quantum-dots'],'pp. 24–26','怎样把量子发光体与可制造的光学结构连接？','How can quantum emitters be integrated with manufacturable optical structures?']
    ];
    for (const [id,zh,en,sz,se,related,locator,qz,qe] of applications) add({id,zh,en,kind:'area',summary:[sz,se],children:id==='quantum-computing'?['qubits','quantum-algorithms']:id==='photonics'?['metamaterials']:[],related,evidence:[['goyal',locator]],questions:[[qz,qe]]});
    add({id:'metamaterials',zh:'超材料与超表面',en:'Metamaterials & metasurfaces',kind:'material',summary:['人工结构用于控制光和电磁波。Goyal把它们纳入应用范围；其中许多效应也可用经典电磁学解释。','Engineered structures control light and electromagnetic waves. Goyal includes them in its application scope; many such effects also have classical electromagnetic explanations.'],related:['photonics','patterning'],evidence:[['goyal','Table 1, p. 12; pp. 24–26']],questions:[['这个器件需要特殊量子态，还是主要依赖结构设计？','Does this device require a distinctive quantum state, or mainly structural design?']]});
    add({id:'characterization',zh:'表征与测量',en:'Characterization & measurement',kind:'approach',summary:['从结构、谱学与输运测量中判断材料有什么状态，连接制备与解释。','Uses structural, spectroscopic and transport measurements to identify material states, connecting preparation with explanation.'],children:['photoemission','scattering','local-probes','optical-probes','transport-probes'],related:['crystal-growth','topology','superconductivity'],evidence:[['cava','p. 2778, experimental-discovery theme'],['goyal','pp. 15, 18, 21–22']],questions:[['什么测量能够区分相互竞争的解释？','Which measurement can distinguish competing explanations?']]});
    add({id:'photoemission',zh:'角度、自旋与深度分辨光电子谱',en:'Angle-, spin- & depth-resolved photoemission',kind:'approach',summary:['用光电子谱研究电子状态，并比较表面与内部、动量与自旋的信息。','Uses photoemission to study electronic states, distinguishing surface and bulk contributions and resolving momentum and spin information.'],related:['topological-insulators','two-dimensional','characterization'],evidence:[['cava','p. 2778, Photoelectron Spectroscopy']],questions:[['观测到的电子态属于表面还是内部，支持哪种模型？','Are the observed electronic states from the surface or the bulk, and which model do they support?']]});
    add({id:'synthesis-methods',zh:'合成与制备方法',en:'Synthesis & fabrication',kind:'approach',summary:['不同方法控制不同的组成、结构、尺寸和缺陷。表3是广泛的材料制备清单，不代表每种方法在量子材料中都同样重要。','Different methods control composition, structure, size and defects. Table 3 is a broad processing inventory, not evidence that every method is equally central to quantum materials.'],children:['thin-films','solution-synthesis','solid-state-processing','patterning','self-assembly','spray-processing'],related:['crystal-growth','nano-synthesis','characterization'],evidence:[['goyal','Table 3, pp. 27–30'],['cava','p. 2778']],questions:[['某种制备方法让以前无法研究的哪类问题变得可研究？','Which previously inaccessible question becomes tractable through a preparation method?']]});
    const methods = [
      ['thin-films','薄膜与气相生长','Thin films & vapor growth','CVD、PVD、MBE、PLD和ALD等方法控制薄膜、表面与界面。','Methods such as CVD, PVD, MBE, PLD and ALD control films, surfaces and interfaces.',['heterostructures','two-dimensional'],'生长条件怎样改变缺陷、界面与电子态？','How do growth conditions change defects, interfaces and electronic states?'],
      ['solution-synthesis','溶液与胶体制备','Solution & colloidal preparation','溶胶凝胶、水热、溶剂热和其他溶液方法控制组成与纳米颗粒。','Sol–gel, hydrothermal, solvothermal and other solution routes control composition and nanoparticles.',['nano-synthesis','quantum-dots'],'怎样控制颗粒的尺寸分布和表面？','How can particle-size distributions and surfaces be controlled?'],
      ['solid-state-processing','固相与体材料制备','Solid-state & bulk processing','固相反应、烧结、机械合金化等路线制备和改变体材料。','Solid-state reactions, sintering and mechanical alloying prepare and modify bulk materials.',['crystal-growth','bonding'],'组成和处理条件怎样影响最终相与纯度？','How do composition and processing conditions affect the resulting phases and purity?'],
      ['patterning','图形化与剥离','Patterning & exfoliation','光刻和剥离控制结构形状并分离薄层。','Lithography and exfoliation control structure geometry and isolate thin layers.',['two-dimensional','metamaterials'],'加工是否保留了希望研究的量子性质？','Does fabrication preserve the quantum property of interest?'],
      ['self-assembly','自组装与模板方法','Self-assembly & templates','通过相互作用和模板让组分形成结构，也连接胶体和软物质方法。','Uses interactions and templates to organize components, connecting colloidal and soft-matter approaches.',['quantum-dots','soft-organic'],'局部组装规则如何产生可重复的整体结构？','How do local assembly rules produce reproducible larger structures?'],
      ['spray-processing','喷雾制备','Spray processing','喷雾热解与火焰喷雾热解提供连续生产颗粒的路径。','Spray pyrolysis and flame spray pyrolysis provide routes to continuous particle production.',['solution-synthesis','nano-synthesis'],'怎样在连续生产中保持颗粒尺寸与形状可控？','How can particle size and shape be controlled during continuous production?']
    ];
    for(const [id,zh,en,sz,se,related,qz,qe] of methods) add({id,zh,en,kind:'approach',summary:[sz,se],related,evidence:[['goyal','Table 3, pp. 27–30']],questions:[[qz,qe]]});

    const extraTopics = [
      ['materials-theory','材料理论与计算','Materials theory & computation','area','建立并检验材料的电子模型，连接预测、解释与实验。','Builds and tests electronic models of materials, linking prediction, explanation and experiment.',['many-body-methods','first-principles','quantum-algorithms'],['electronic-design','synthesis-methods'],'pp. 8–10, 15, 18, 23, 31','预测怎样改变实验室选择制备的材料？','How do predictions change which materials laboratories choose to make?'],
      ['many-body-methods','多体计算方法','Many-body methods','approach','DMFT、DMRG和张量网络等方法研究相互作用粒子的集体行为。','Methods such as DMFT, DMRG and tensor networks study the collective behavior of interacting particles.',[],['correlations','quantum-algorithms'],'p. 8','哪些简化保留了解释某种量子态所需的相互作用？','Which approximations retain the interactions needed to explain a quantum state?'],
      ['first-principles','第一性原理与电子结构计算','First-principles & electronic-structure calculations','approach','把成分、晶体结构与电子态连接起来，为性质和材料候选提供预测。','Connects composition and crystal structure with electronic states to predict properties and candidate materials.',[],['electronic-design','topological-chemistry'],'pp. 9–10, 15, 18','计算结果如何与合成可行性和测量证据共同筛选候选材料？','How do calculations, synthesis feasibility and measurements jointly narrow material candidates?'],
      ['interfaces','表面与界面研究','Surfaces & interfaces','area','边界、堆叠、表面处理和缺陷会改变输运、光学和相干性。','Boundaries, stacking, surface treatments and defects alter transport, optics and coherence.',['heterostructures'],['thin-films','defects','spintronics'],'pp. 16–17, 22–24','共享的界面问题能否把不同研究群体长期连接起来？','Can shared interface problems create lasting connections between research communities?'],
      ['scattering','中子与X射线探测','Neutron & X-ray probes','approach','通过散射研究结构、磁性激发和随时间变化的状态。','Scattering probes structure, magnetic excitations and time-dependent states.',[],['spin-liquids','magnetism','crystal-chemistry'],'pp. 18, 22','什么谱学证据支持一种磁性状态而排除其他解释？','Which spectral evidence supports one magnetic state over competing explanations?'],
      ['local-probes','局域探针与隧穿谱','Local probes & tunnelling spectroscopy','approach','STM与STS在局部研究表面和电子态。','STM and STS investigate surfaces and electronic states locally.',[],['correlations','topology'],'p. 18','空间上不均匀的电子行为意味着什么？','What does spatially nonuniform electronic behavior reveal?'],
      ['optical-probes','光学与振动探测','Optical & vibrational probes','approach','拉曼、吸收、发光和时间分辨测量连接电子、晶格与光的行为。','Raman, absorption, luminescence and time-resolved measurements connect electronic, lattice and optical behavior.',[],['excitons','photonics','quantum-dots'],'pp. 15, 19–20','光谱变化来自尺寸、缺陷还是电子相互作用？','Does a spectral change come from size, defects or electronic interactions?'],
      ['transport-probes','输运、磁性与热学测量','Transport, magnetic & thermal probes','approach','电阻、磁化、热容和热输运等测量从不同角度检验材料状态。','Resistance, magnetization, heat capacity and thermal transport test material states from different angles.',[],['superconductivity','hall','spin-liquids'],'pp. 21–22','哪些相互独立的测量能共同确认一种状态？','Which independent measurements can jointly establish a state?'],
      ['neuromorphic','神经形态计算','Neuromorphic computing','area','利用材料中的记忆、非线性响应和可塑性研究类脑器件；这不等同于量子计算。','Studies brain-inspired devices using material memory, nonlinear response and plasticity; this is distinct from quantum computation.',[],['electronics','spintronics'],'pp. 23–24','哪些可控材料响应能够实现可重复的学习或记忆功能？','Which controllable material responses enable reproducible learning or memory functions?']
    ];
    for(const [id,zh,en,kind,sz,se,children,related,locator,qz,qe] of extraTopics) add({id,zh,en,kind,summary:[sz,se],children,related,evidence:[['goyal',locator]],questions:[[qz,qe]]});
    nodes.electronics.children.push('neuromorphic');

    // Multiple navigation routes represent overlapping work, not exclusive ancestry.
    nodes.condensed.children.push('symmetry','superfluidity');
    nodes.correlations.children.push('criticality','pseudogap');
    nodes.magnetism.children.push('spin-ice','skyrmions');
    nodes.topology.children.push('weyl','topological-superconductivity');
    nodes.superconductivity.related.push('topological-superconductivity','bonding','doping');
    nodes.nanoscale.children.push('excitons');
    nodes['quantum-materials'].children = ['superconductivity','correlations','magnetism','topology','nanoscale','symmetry','quantum-platforms','solid-chemistry','applications'];
    nodes['quantum-materials'].related = ['physics','chemistry','materials-science','quantum-information'];
    nodes['solid-chemistry'].kind = 'area';
    nodes['solid-chemistry'].children = ['crystal-chemistry','crystal-growth','bonding','doping','topology-chemistry'];
    nodes['solid-chemistry'].related.push('chemistry','electronic-design');
    nodes['crystal-growth'].related.push('synthesis-methods','characterization');
    nodes['nano-synthesis'].related.push('chemistry','solution-synthesis','qubits');
    nodes.amo.placeholder = false;
    nodes.amo.children = ['cold-atoms','trapped-ions'];
    nodes.amo.period = L('这里仅展开Nature提到的人工量子物质联系','Only the engineered-quantum-matter connections named by Nature are expanded');
    nodes.amo.sources.push('nature');
    nodes['quantum-information'].placeholder = false;
    nodes['quantum-information'].children = ['quantum-platforms','quantum-computing','quantum-algorithms','communication','sensing'];
    nodes['quantum-information'].related = ['physics','chemistry','materials-science','quantum-materials'];
    nodes['quantum-information'].period = L('三篇文章都提到该联系；这里不把应用目标当作领域的成立日期','All three readings discuss this connection; application goals are not treated as a founding date');
    nodes['quantum-information'].sources.push('nature','cava','goyal');

    // Attach precise reading locations to both existing and added topics.
    for (const reading of readings) for (const group of reading.groups) for (const id of group.nodes) {
      const n = nodes[id];
      n.evidence ||= [];
      if (!n.evidence.some(e => e.source === reading.id)) n.evidence.push({source:reading.id,locator:group.locator});
      if (!n.sources.includes(reading.id)) n.sources.push(reading.id);
    }
    const questions = {
      physics:[['哪些异常现象推动了原有理论和研究范围的变化？','Which anomalous phenomena changed existing theories and the scope of research?']],
      condensed:[['从寻找有序到研究拓扑与涌现，问题如何改变？','How did the questions change from finding order to studying topology and emergence?']],
      'quantum-materials':[['哪些问题、方法与研究者真正跨越了原有边界？','Which problems, methods and researchers actually crossed earlier boundaries?'],['共同名称的增长是否伴随共同研究实践的增长？','Did the growth of a shared name coincide with growth in shared research practices?']],
      superconductivity:[['怎样从组成、成键和电子相互作用解释不同超导体？','How can composition, bonding and electronic interactions explain different superconductors?']],
      correlations:[['独立电子图景在哪些条件下失效？','Under which conditions does an independent-electron picture fail?']],
      magnetism:[['晶体结构和相互作用如何产生有序或无常规有序的磁态？','How do crystal structure and interactions produce ordered or unconventional magnetic states?']],
      topology:[['哪些拓扑分类能对应到可制备、可测量的材料？','Which topological classifications can be connected to materials that can be made and measured?']],
      nanoscale:[['限制尺寸或改变堆叠如何改变电子态？','How do restricted size and altered stacking change electronic states?']],
      confinement:[['改变可活动的空间，如何改变能级和发光？','How does changing the available space change energy levels and light emission?']],
      'quantum-dots':[['尺寸、表面化学与组装如何影响光和自旋？','How do size, surface chemistry and assembly affect light and spin?']],
      'solid-chemistry':[['怎样用组成、成键和结构提出新的量子材料候选？','How can composition, bonding and structure suggest new quantum-material candidates?']],
      bonding:[['哪种成键与连接方式能支持目标电子态？','Which bonding and connectivity can support a target electronic state?']],
      'crystal-growth':[['怎样获得足够纯净、稳定且可重复研究的样品？','How can samples be made pure, stable and reproducible enough to investigate?']],
      'nano-synthesis':[['合成进步如何同时打开新的基础问题和器件用途？','How do synthesis advances open both new basic questions and device possibilities?']],
      'quantum-information':[['材料的量子态与信息处理工具怎样双向影响？','How do material quantum states and information-processing tools influence each other?']],
      'spin-liquids':[['哪些晶体和相互作用能支持自旋液体，如何验证？','Which crystals and interactions can support a spin liquid, and how can it be tested?']],
      'two-dimensional':[['层数、堆叠和界面如何成为控制性质的工具？','How do layer number, stacking and interfaces become controls for material properties?']],
      'topological-chemistry':[['轨道和晶体对称性如何进入拓扑材料预测？','How do orbitals and crystal symmetry enter predictions of topological materials?']]
    };
    Object.assign(questions,{
      bcs:[['哪些相互作用使电子配对并形成相干的超导态？','Which interactions make electrons pair and form a coherent superconducting state?']],
      cuprates:[['改变组成和氧含量如何改变铜氧化物的超导与关联行为？','How do composition and oxygen content change superconductivity and correlated behavior in cuprates?']],
      'iron-superconductors':[['铁基材料中的轨道与磁性如何联系到超导？','How do orbitals and magnetism in iron-based materials connect to superconductivity?']],
      'heavy-fermions':[['为什么相互作用会让电子表现得像质量很大的粒子？','Why do interactions make electrons behave as if they have a large effective mass?']],
      mott:[['电子之间的排斥如何使一个预期的金属变成绝缘体？','How can electron repulsion turn an expected metal into an insulator?']],
      frustration:[['局部相互作用为什么无法同时满足？','Why can local interactions not all be satisfied at once?']],
      hall:[['量子化输运如何帮助识别不同的电子状态？','How does quantized transport help identify different electronic states?']],
      'integer-hall':[['电子态如何使霍尔响应呈现整数台阶？','How do electronic states produce integer steps in the Hall response?']],
      'fractional-hall':[['相互作用如何产生分数电荷等集体现象？','How do interactions produce collective phenomena such as fractional charge?']],
      'topological-insulators':[['什么条件保护边界电子态，什么改变会破坏它们？','Which conditions protect boundary states, and which changes destroy them?']],
      graphene:[['单层碳的电子结构与其他二维材料有何不同？','How does the electronic structure of a single carbon layer differ from other 2D materials?']],
      moire:[['扭转角怎样改变电子相互作用和超导？','How does twist angle change electronic interactions and superconductivity?']],
      'quantum-wells':[['限制一个方向的运动会怎样改变电子与光的行为？','How does confining motion in one direction change electronic and optical behavior?']],
      'quantum-wires':[['主要沿一个方向移动的电子会出现哪些特殊行为？','What unusual behavior appears when electrons move mainly in one direction?']],
      heterostructures:[['把两种材料接在一起，界面会产生什么新状态？','What new states can appear at the interface between two materials?']],
      semiconductors:[['组成、电场与尺寸如何控制电流和发光？','How do composition, electric fields and size control current and light emission?']],
      amo:[['可控制的原子与离子能如何模拟复杂材料？','How can controlled atoms and ions simulate complex materials?']]
    });
    for (const [id,qs] of Object.entries(questions)) nodes[id].questions=qs.map(q=>L(...q));
    for (const n of Object.values(nodes)) {
      n.questions ||= n.placeholder ? [] : [L('怎样制备、测量并解释这一体系的特殊性质？','How can this system’s distinctive properties be prepared, measured and explained?')];
      n.evidence ||= n.sources.filter(s=>['nature','cava','goyal'].includes(s)).map(source=>({source,locator:source==='nature'?'p. 105':source==='cava'?'pp. 2777–2779':'see linked review'}));
      n.questionStatus = 'reader-synthesis';
    }
    // Lenses are kinds of activity, not claims of disciplinary ownership.
    for (const e of Object.values(events)) e.lenses = e.kind==='institution' ? ['community'] : ['phenomena'];
    for (const id of ['cuprate1986','qd1981','qd1993','graphene2004','hgte2007','iron2008','tqc2017','moire2018','super1970']) events[id].lenses.push('materials');
  }
  return {readings,formation,enrich};
});
