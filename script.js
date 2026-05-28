/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO — Cherif Jebali  |  Terminal + Visual  |  EN / FR
═══════════════════════════════════════════════════════════════════ */

// ── State ─────────────────────────────────────────────────────────
let currentDirectory = "root";
let commandHistory   = [];
let historyIndex     = -1;
let isFirstCommand   = true;
let suggestions      = [];
let suggestionIndex  = 0;
let originalPartial  = "";
let currentLang      = "en";
let currentTheme     = "github";
let currentMode      = "visual";
const themes         = ["github","hacker","retro","matrix"];

// ── Helpers ───────────────────────────────────────────────────────
const $       = id => document.getElementById(id);
const norm    = s  => s.toLowerCase().trim();
const t       = () => T[currentLang];
const fmt     = (s,...a) => s.replace(/{(\d+)}/g, (_,i) => a[i] ?? '');
const makeEl  = (tag,cls,html) => { const e=document.createElement(tag); if(cls)e.className=cls; if(html!==undefined)e.innerHTML=html; return e; };
const inputEl = () => $('terminal-input');
const bodyEl  = () => $('terminal-body');
const inputLn = () => $('input-line');

function appendBefore(el){ bodyEl().insertBefore(el, inputLn()); }
function echoCmd(text){ const e=makeEl('div','command-line slide-in'); e.innerHTML=`<span class="prompt">cherif@kali:~$</span><span class="cmd-text" style="margin-left:8px">${text}</span>`; appendBefore(e); }
function respond(html){ const e=makeEl('div','response slide-in'); e.innerHTML=html; appendBefore(e); }
function respondText(text,col){ respond(`<p style="padding:4px 20px;color:${col||'var(--muted)'}">${text}</p>`); }
function scrollDown(){ const b=bodyEl(); if(b) b.scrollTop=b.scrollHeight; }
function clearSugs(){ const b=$('suggestions'); if(b)b.remove(); }

// ── i18n ──────────────────────────────────────────────────────────
const T = {
  en: {
    langBtn:"🇫🇷 FR",
    placeholder:"type a command...",
    dirChanged:"Directory changed →",
    dirNotFound:"cd: {0}: No such directory.",
    fileNotFound:"cat: {0}: No such file.",
    currentDir:"Current directory: ",
    unknownCmd:"bash: {0}: command not found. Type 'help'.",
    grepNoResults:"grep: no matches for '{0}'",
    grepUsage:"Usage: grep [keyword]",
    treeTitle:"~/",
    dlLabelEN:"English version", dlLabelFR:"French version",
    helpRows:[
      ["whoami","About me — education, skills, languages"],
      ["ls","List files in current directory"],
      ["cd [dir]","Change directory (projets / certifications / experiences)"],
      ["cat [file]","Display file content"],
      ["tree","Show full filesystem tree"],
      ["grep [keyword]","Search across all files"],
      ["download cv","Download my CV (EN or FR)"],
      ["theme [name]","Switch theme: github / hacker / retro / matrix"],
      ["lang fr","Switch to French"],
      ["home","Return to welcome screen"],
      ["clear","Clear terminal"],
      ["↑ / ↓","Command history"],
      ["Tab","Autocomplete"],
    ],
    nmapCmd:"nmap -sV -p- cherifon.github.io",
    nmapLines:[
      "Starting Nmap 7.94 ( https://nmap.org )",
      "Scanning cherifon.github.io [443 ports]",
      "───────────────────────────────────────",
      "<port>80/tcp    open  http      nginx 1.24",
      "<port>443/tcp   open  https     TLS 1.3",
      "<port>8080/tcp  open  portfolio Cherif Jebali v2026",
      "<port>9999/tcp  open  homelab   pi-hole · cowrie · unbound",
      "───────────────────────────────────────",
      "<done>Nmap done: 1 host up — 4 open ports",
    ],
    heroSubtitle:"M1 Cyberdefense · Ecole Hexagone Versailles",
    tags:["M1 Cyberdefense","SOC / Blue Team","Pentest","CTF","Pi-hole","Raspberry Pi"],
    welcomeDesc:[
      'Student in <strong>M1 Cyberdefense</strong> at Ecole Hexagone (Versailles).',
      'B.Sc. Maths &amp; CS — Paris-Dauphine.',
      'Active home lab: Pi-hole + Unbound DNS, Fail2ban, Cowrie honeypot, SIEM.',
    ],
    welcomeHint:'Type <span class="cmd">whoami</span> · <span class="cmd">ls</span> · <span class="cmd">help</span>',
    welcomeGuide:[
      {icon:'fas fa-user',       cmd:'whoami',           label:'About me',         desc:'Education, skills, languages, interests.'},
      {icon:'fas fa-folder-open',cmd:'ls',               label:'Browse files',      desc:'List all available projects, certs, experiences.'},
      {icon:'fas fa-shield-alt', cmd:'cd projets',       label:'Projects',          desc:'Home lab, CTF, scripts, CO2 sensor, web crawler...'},
      {icon:'fas fa-award',      cmd:'cd certifications',label:'Certifications',    desc:'Cisco, Microsoft — badges and details.'},
      {icon:'fas fa-briefcase',  cmd:'cd experiences',   label:'Experience',        desc:'STMicro internship, IT LAB, MidnightFlag CTF...'},
      {icon:'fas fa-search',     cmd:'grep python',      label:'Search',            desc:'grep [keyword] — find anything across all files.'},
      {icon:'fas fa-file-download',cmd:'download cv',    label:'Download CV',       desc:'Get my resume in PDF (EN or FR).'},
      {icon:'fas fa-palette',    cmd:'theme hacker',     label:'Change theme',      desc:'github / hacker / retro / matrix.'},
      {icon:'fas fa-th-large',   cmd:'visual',           label:'Visual mode',       desc:'Switch to a graphical interface.'},
    ],
    sectionAbout:"About", sectionProjects:"Projects", sectionCerts:"Certifications",
    sectionExp:"Experience", sectionContact:"Contact",
    cardProfile:"Profile", cardEducation:"Education", cardSkills:"Skills",
    cardLanguages:"Languages", cardInterests:"Interests",
    profileDesc:['M1 Cyberdefense student at Ecole Hexagone (Versailles), combining rigorous academic training with intensive hands-on practice — CTF, pentest, Blue Team, home lab.'],
    education:[
      '└── M1 Cyberdefense — Ecole Hexagone, Versailles <span class="dim">(2025–2026)</span>',
      '<span class="indent dim">ISMS · ISO 27001 · EBIOS RM · SOC · Forensics · DevSecOps · Cloud Security · Threat Intelligence · Cryptology</span>',
      '└── B.Sc. Maths &amp; CS — Paris-Dauphine <span class="dim">(2022–2025)</span>',
      '└── Baccalaureat — Maths &amp; NSI, High Distinction <span class="dim">(2022)</span>',
    ],
    skillBars:[
      {label:"SOC & Detection (SIEM, EDR, Forensics)", pct:78},
      {label:"Pentest & CTF (HTB, THM, OWASP)",        pct:85},
      {label:"Networks & Infra (DNS, Pi-hole, Docker)", pct:80},
      {label:"Python / Bash scripting",                 pct:88},
      {label:"C Embedded (STM32)",                      pct:72},
    ],
    langs:["French — bilingual","Arabic — bilingual","English — fluent (technical)"],
    interests:["Offensive &amp; defensive security","Hardware / electronics","Guitar &amp; singing","Cyber news &amp; CTF"],
    easter:{
      sudo:  ['<span style="color:var(--warn)">sudo: permission denied — you are not root.</span>','<span class="dim">(nice try 👀)</span>'],
      hack:  ['<span style="color:var(--green)">Initiating hack sequence...</span>','<span class="dim">Just kidding. Try <span class="cmd">cat projets/Pentesting-CTF...</span></span>'],
      coffee:['<span style="color:var(--warn)">Brewing coffee...</span>','<span class="dim">Error 418: I\'m a teapot.</span>'],
      exit:  ['<span class="dim">logout — Connection closed. (You can\'t really leave 😄)</span>'],
    },
  },
  fr: {
    langBtn:"🇬🇧 EN",
    placeholder:"tapez une commande...",
    dirChanged:"Répertoire changé →",
    dirNotFound:"cd: {0}: Répertoire introuvable.",
    fileNotFound:"cat: {0}: Fichier introuvable.",
    currentDir:"Répertoire actuel : ",
    unknownCmd:"bash: {0}: commande introuvable. Tapez 'help'.",
    grepNoResults:"grep: aucun résultat pour '{0}'",
    grepUsage:"Usage : grep [mot-clé]",
    treeTitle:"~/",
    dlLabelEN:"Version anglaise", dlLabelFR:"Version française",
    helpRows:[
      ["whoami","Présentation — formation, compétences, langues"],
      ["ls","Liste les fichiers du répertoire courant"],
      ["cd [dossier]","Changer de répertoire (projets / certifications / experiences)"],
      ["cat [fichier]","Affiche le contenu d'un fichier"],
      ["tree","Arborescence complète"],
      ["grep [mot-clé]","Recherche dans tous les fichiers"],
      ["download cv","Télécharger le CV (EN ou FR)"],
      ["theme [nom]","Thème : github / hacker / retro / matrix"],
      ["lang en","Passer en anglais"],
      ["home","Retour à l'accueil"],
      ["clear","Effacer le terminal"],
      ["↑ / ↓","Historique des commandes"],
      ["Tab","Autocomplétion"],
    ],
    nmapCmd:"nmap -sV -p- cherifon.github.io",
    nmapLines:[
      "Nmap 7.94 démarré ( https://nmap.org )",
      "Scan de cherifon.github.io [443 ports]",
      "───────────────────────────────────────",
      "<port>80/tcp    ouvert  http      nginx 1.24",
      "<port>443/tcp   ouvert  https     TLS 1.3",
      "<port>8080/tcp  ouvert  portfolio Cherif Jebali v2026",
      "<port>9999/tcp  ouvert  homelab   pi-hole · cowrie · unbound",
      "───────────────────────────────────────",
      "<done>Nmap terminé : 1 hôte actif — 4 ports ouverts",
    ],
    heroSubtitle:"M1 Cyberdéfense · École Hexagone Versailles",
    tags:["M1 Cyberdéfense","SOC / Blue Team","Pentest","CTF","Pi-hole","Raspberry Pi"],
    welcomeDesc:[
      'Étudiant en <strong>M1 Cyberdéfense</strong> à l\'École Hexagone (Versailles).',
      'Licence Maths &amp; Informatique — Paris-Dauphine.',
      'Home lab actif : Pi-hole + DNS Unbound, Fail2ban, Cowrie honeypot, SIEM.',
    ],
    welcomeHint:'Tapez <span class="cmd">whoami</span> · <span class="cmd">ls</span> · <span class="cmd">help</span>',
    welcomeGuide:[
      {icon:'fas fa-user',       cmd:'whoami',           label:'À mon sujet',           desc:'Formation, compétences, langues, intérêts.'},
      {icon:'fas fa-folder-open',cmd:'ls',               label:'Parcourir les fichiers', desc:'Liste projets, certifications, expériences.'},
      {icon:'fas fa-shield-alt', cmd:'cd projets',       label:'Projets',                desc:'Home lab, CTF, scripts, capteur CO2, crawler...'},
      {icon:'fas fa-award',      cmd:'cd certifications',label:'Certifications',         desc:'Cisco, Microsoft — badges et détails.'},
      {icon:'fas fa-briefcase',  cmd:'cd experiences',   label:'Expériences',            desc:'Stage STMicro, IT LAB, MidnightFlag CTF...'},
      {icon:'fas fa-search',     cmd:'grep python',      label:'Recherche',              desc:'grep [mot-clé] — trouvez n\'importe quoi.'},
      {icon:'fas fa-file-download',cmd:'download cv',    label:'Télécharger le CV',      desc:'Obtenir mon CV en PDF (EN ou FR).'},
      {icon:'fas fa-palette',    cmd:'theme hacker',     label:'Changer le thème',       desc:'github / hacker / retro / matrix.'},
      {icon:'fas fa-th-large',   cmd:'visual',           label:'Mode visuel',            desc:'Basculer vers une interface graphique.'},
    ],
    sectionAbout:"À propos", sectionProjects:"Projets", sectionCerts:"Certifications",
    sectionExp:"Expériences", sectionContact:"Contact",
    cardProfile:"Profil", cardEducation:"Formation", cardSkills:"Compétences",
    cardLanguages:"Langues", cardInterests:"Intérêts",
    profileDesc:['Étudiant en M1 Cyberdéfense à l\'École Hexagone (Versailles), alliant formation académique rigoureuse et pratique intensive — CTF, pentest, Blue Team, home lab.'],
    education:[
      '└── M1 Cyberdéfense — École Hexagone, Versailles <span class="dim">(2025–2026)</span>',
      '<span class="indent dim">SMSI · ISO 27001 · EBIOS RM · SOC · Forensic · DevSecOps · Sécurité Cloud · Threat Intelligence · Cryptologie</span>',
      '└── Licence Maths &amp; Informatique — Paris-Dauphine <span class="dim">(2022–2025)</span>',
      '└── Bac général — Spé Maths &amp; NSI, Mention Très Bien <span class="dim">(2022)</span>',
    ],
    skillBars:[
      {label:"SOC & Détection (SIEM, EDR, Forensic)", pct:78},
      {label:"Pentest & CTF (HTB, THM, OWASP)",       pct:85},
      {label:"Réseaux & Infra (DNS, Pi-hole, Docker)", pct:80},
      {label:"Python / Bash scripting",                pct:88},
      {label:"C embarqué (STM32)",                     pct:72},
    ],
    langs:["Français — bilingue","Arabe — bilingue","Anglais — courant (technique)"],
    interests:["Cybersécurité offensive &amp; défensive","Hardware / électronique","Guitare &amp; chant","Veille cyber &amp; CTF"],
    easter:{
      sudo:  ['<span style="color:var(--warn)">sudo : permission refusée — vous n\'êtes pas root.</span>','<span class="dim">(bien essayé 👀)</span>'],
      hack:  ['<span style="color:var(--green)">Séquence de hack initiée...</span>','<span class="dim">Blague. Essayez <span class="cmd">cat projets/Pentesting...</span></span>'],
      coffee:['<span style="color:var(--warn)">Préparation du café...</span>','<span class="dim">Erreur 418 : Je suis une théière.</span>'],
      exit:  ['<span class="dim">logout — Connexion fermée. (Vous ne pouvez pas vraiment partir 😄)</span>'],
    },
  },
};

// ── Content data ──────────────────────────────────────────────────
const DATA = {
  projects:[
    { id:"homelab",
      en:{ title:"Home Lab — Blue Team & Monitoring", tags:["Raspberry Pi","Pi-hole","DNS","Fail2ban","Cowrie","SIEM"],
           desc:"Active home-network infrastructure focused on detection and defence.",
           points:["<strong>Pi-hole</strong> + <strong>Unbound</strong> recursive DNS on Raspberry Pi — tracker/ad blocking, no third-party DNS.","Iptables + Fail2ban — automatic SSH intrusion blocking.","Cowrie SSH honeypot — real attacker log collection (IPs, commands, payloads).","Local SIEM monitoring: log correlation, anomaly alerts."] },
      fr:{ title:"Home Lab Défensif — Blue Team & Monitoring", tags:["Raspberry Pi","Pi-hole","DNS","Fail2ban","Cowrie","SIEM"],
           desc:"Infrastructure réseau maison orientée détection et défense, opérationnelle en continu.",
           points:["<strong>Pi-hole</strong> + résolveur DNS récursif <strong>Unbound</strong> — blocage trackers &amp; pubs, zéro dépendance DNS tiers.","Iptables + Fail2ban — blocage automatique des tentatives d'intrusion SSH.","Honeypot Cowrie SSH — logs d'attaquants réels (IPs, commandes, payloads).","Supervision SIEM locale : corrélation des logs, alertes sur comportements anormaux."] },
    },
    { id:"ctf",
      en:{ title:"Pentesting & CTF — HTB, TryHackMe, Hack This Site, Root-Me", tags:["Kali Linux","Burp Suite","Nmap","MITRE ATT&CK","CTF","Forensic"],
           desc:"Intensive offensive and defensive security practice on international platforms.",
           points:["HTB: Cicada (rank #9470) &amp; UnderPass (rank #5290) pwned.","Hack This Site: web, network &amp; crypto challenges.","TryHackMe: SOC, Forensic, Active Directory — MITRE ATT&amp;CK &amp; Kill Chain.","OWASP Top 10: SQLi, path traversal, LFI/RFI, command injection.","MidnightFlag CTF (Mar 2026): team qualifying — crypto challenges solved."],
           links:[{href:"https://app.hackthebox.com/profile/638392",icon:"fas fa-cube",label:"HTB Profile"},{href:"https://github.com/cherifon/HackTheBox",icon:"fab fa-github",label:"Write-ups"}] },
      fr:{ title:"Pentesting & CTF — HTB, TryHackMe, Hack This Site, Root-Me", tags:["Kali Linux","Burp Suite","Nmap","MITRE ATT&CK","CTF","Forensic"],
           desc:"Pratique intensive de la sécurité offensive et défensive sur plateformes internationales.",
           points:["HTB : Cicada (rank #9470) et UnderPass (rank #5290) pwned.","Hack This Site : challenges web, réseaux et cryptographie.","TryHackMe : rooms SOC, Forensic, Active Directory — MITRE ATT&amp;CK &amp; Kill Chain.","OWASP Top 10 : injection SQL, path traversal, LFI/RFI, command injection.","MidnightFlag CTF (mars 2026) : épreuves qualificatives en équipe — challenges crypto résolus."],
           links:[{href:"https://app.hackthebox.com/profile/638392",icon:"fas fa-cube",label:"Profil HTB"},{href:"https://github.com/cherifon/HackTheBox",icon:"fab fa-github",label:"Write-ups"}] },
    },
    { id:"scripts",
      en:{ title:"Python & Bash Scripts — Cybersecurity Automation", tags:["Python","Bash","Scapy","CVSS"],
           desc:"Offensive and defensive tooling for educational and research purposes.",
           points:["Multi-threaded TCP port scanner + CVSS-scored vulnerability analysis.","DDoS simulation (SYN flooding) with Scapy.","SSH/Telnet brute-force with wordlist management.","Automated Nmap scan reporting."],
           links:[{href:"https://github.com/cherifon/Cybersecurity-Tools",icon:"fab fa-github",label:"GitHub Repo"}] },
      fr:{ title:"Scripts Python & Bash — Automatisation Cybersécurité", tags:["Python","Bash","Scapy","CVSS"],
           desc:"Outillage offensif et défensif à des fins éducatives et de recherche.",
           points:["Scanner de ports TCP multi-thread + scoring CVSS automatisé.","Simulation DDoS (SYN flooding) avec Scapy.","Brute-force SSH/Telnet avec gestion de wordlists.","Génération automatisée de rapports d'incidents Nmap."],
           links:[{href:"https://github.com/cherifon/Cybersecurity-Tools",icon:"fab fa-github",label:"Dépôt GitHub"}] },
    },
    { id:"co2",
      en:{ title:"CO2 Forecasting & Microelectronics — C, Python, STM32", tags:["STM32","C embedded","UART","Python","pandas"],
           desc:"End-to-end IoT project from hardware collection to predictive analysis (STMicroelectronics).",
           points:["Embedded C on STM32 — CO2 sensor SDC30 via I2C, UART transmission.","Python pipeline: cleaning, visualisation, CO2 trend forecasting (pandas, matplotlib).","Technical documentation and benchmarking reports."],
           links:[{href:"https://github.com/cherifon/CO2_Forecasting",icon:"fab fa-github",label:"GitHub Repo"}] },
      fr:{ title:"Prévision de CO2 & Microélectronique — C, Python, STM32", tags:["STM32","C embarqué","UART","Python","pandas"],
           desc:"Projet IoT complet de la collecte hardware à l'analyse prédictive (stage STMicroelectronics).",
           points:["C embarqué sur STM32 — capteur CO2 SDC30 via I2C, transmission UART.","Pipeline Python : nettoyage, visualisation, prévision tendances CO2 (pandas, matplotlib).","Documentation technique et rapports de benchmarking."],
           links:[{href:"https://github.com/cherifon/CO2_Forecasting",icon:"fab fa-github",label:"Dépôt GitHub"}] },
    },
    { id:"crawler",
      en:{ title:"Web Crawler — Java", tags:["Java","HTTP","Multithreading"],
           desc:"Recursive web mapper with access-constraint handling.",
           points:["Recursive exploration following internal links.","HTTP error handling, redirects, robots.txt compliance.","Multi-threaded architecture for large-scale crawling."],
           links:[{href:"https://github.com/cherifon/Java-Web-Crawler",icon:"fab fa-github",label:"GitHub Repo"}] },
      fr:{ title:"Web Crawler — Java", tags:["Java","HTTP","Multithreading"],
           desc:"Outil de cartographie web récursif avec gestion des contraintes d'accès.",
           points:["Exploration récursive en suivant les liens internes.","Gestion des codes HTTP, redirections et robots.txt.","Architecture multithreadée pour les grands sites."],
           links:[{href:"https://github.com/cherifon/Java-Web-Crawler",icon:"fab fa-github",label:"Dépôt GitHub"}] },
    },
    { id:"tournoi",
      en:{ title:"Tournament Manager — Java, SQL", tags:["Java","JavaFX","SQL","MVC"],
           desc:"Desktop application for sports competition management.",
           points:["JavaFX GUI with MVC pattern.","SQL relational database: participants, scores, scheduling."],
           links:[{href:"https://github.com/cherifon/Gestionnaire_de_tournoi",icon:"fab fa-github",label:"GitHub Repo"}] },
      fr:{ title:"Gestionnaire de Tournoi — Java, SQL", tags:["Java","JavaFX","SQL","MVC"],
           desc:"Application desktop pour la gestion de compétitions sportives.",
           points:["Interface graphique JavaFX (pattern MVC).","Base de données SQL : participants, scores, calendriers."],
           links:[{href:"https://github.com/cherifon/Gestionnaire_de_tournoi",icon:"fab fa-github",label:"Dépôt GitHub"}] },
    },
  ],
  certs:[
    {en:{title:"Introduction to Cybersecurity",  org:"Cisco Networking Academy",date:"Nov 2024"},
     fr:{title:"Introduction to Cybersecurity",  org:"Cisco Networking Academy",date:"Nov. 2024"}},
    {en:{title:"Network Defense",                org:"Cisco Networking Academy",date:"2024"},
     fr:{title:"Network Defense",                org:"Cisco Networking Academy",date:"2024"}},
    {en:{title:"Endpoint Security",              org:"Cisco Networking Academy",date:"2024"},
     fr:{title:"Endpoint Security",              org:"Cisco Networking Academy",date:"2024"}},
    {en:{title:"Networking Basics",              org:"Cisco Networking Academy",date:"Dec 2024"},
     fr:{title:"Networking Basics",              org:"Cisco Networking Academy",date:"Déc. 2024"}},
    {en:{title:"Networking Devices & Initial Configuration",org:"Cisco Networking Academy",date:"2024"},
     fr:{title:"Networking Devices & Initial Configuration",org:"Cisco Networking Academy",date:"2024"}},
    {en:{title:"Prepare for a Career in Cybersecurity",org:"Microsoft / LinkedIn Learning",date:"2024"},
     fr:{title:"Préparer votre carrière en cybersécurité",org:"Microsoft / LinkedIn Learning",date:"2024"}},
  ],
  experiences:[
    { en:{role:"MidnightFlag CTF — Qualifying Rounds",  org:"",                    period:"March 2026",  tags:["CTF","Cryptography","Team"],      points:["Team participation in qualifying rounds (13–15 March 2026).","Solved several cryptography challenges within the group."]},
      fr:{role:"MidnightFlag CTF — Épreuves qualificatives",org:"",               period:"Mars 2026",   tags:["CTF","Cryptographie","Équipe"],   points:["Participation en équipe aux épreuves qualificatives (13–15 mars 2026).","Résolution de plusieurs épreuves de cryptographie au sein du groupe."]} },
    { en:{role:"Engineering Intern",               org:"STMicroelectronics",       period:"2024",        tags:["C embedded","STM32","IoT","Python"],points:["Embedded C on STM32: CO2 sensor (I2C), UART, secure hardware architecture.","Python analysis: time-series, predictive algorithms, dashboards.","Technical documentation and circuit benchmarking."]},
      fr:{role:"Stagiaire Ingénieur",              org:"STMicroelectronics",       period:"2024",        tags:["C embarqué","STM32","IoT","Python"],points:["C embarqué sur STM32 : capteur CO2 (I2C), UART, architecture matérielle sécurisée.","Analyse Python : séries temporelles, algorithmes prédictifs, tableaux de bord.","Documentation technique et rapports de benchmarking."]} },
    { en:{role:"Volunteer",                        org:"Handisport Open Paris",    period:"2024",        tags:["Volunteer","Paris 2024","Logistics"],points:["Logistical support at Stade Charlety — last edition before Paris 2024 Paralympics.","Athlete medical classification at Hopital de la Salpetriere (French Handisport Federation)."]},
      fr:{role:"Volontaire",                       org:"Handisport Open Paris",    period:"2024",        tags:["Bénévolat","Paris 2024","Logistique"],points:["Support logistique au Stade Charléty — dernière édition avant les JO Paris 2024.","Assistance à la classification médicale des athlètes (Fédération Française Handisport)."]} },
    { en:{role:"IT Project Coordinator",           org:"IT LAB Dauphine",          period:"2023–2025",   tags:["Leadership","Project Management","CTF","Hackathon"],points:["Organised 4 CTF & hackathons: steganography, OSINT, cryptanalysis challenges.","Coordinated dev projects (Godot game, WordPress site): roles, deadlines, delivery.","GitHub workshops and technical training sessions."]},
      fr:{role:"Coordinateur de Projets IT",       org:"IT LAB Dauphine",          period:"2023–2025",   tags:["Leadership","Gestion de projet","CTF","Hackathon"],points:["Organisation de 4 CTF & hackathons : stéganographie, OSINT, cryptanalyse.","Coordination de projets (jeu Godot, site WordPress) : rôles, deadlines, livraison.","Ateliers GitHub et formations techniques pour les membres du club."]} },
    { en:{role:"Python Bootcamp Instructor",       org:"Paris-Dauphine",           period:"2023",        tags:["Python","Teaching","Algorithms"],points:["Taught Python to student groups: algorithms, data structures, applied maths.","Made technical concepts accessible to non-CS backgrounds."]},
      fr:{role:"Formateur BootCamp Python",        org:"Paris-Dauphine",           period:"2023",        tags:["Python","Pédagogie","Algorithmique"],points:["Initiation au Python : algorithmique, structures de données, maths appliquées.","Vulgarisation pour des publics sans background informatique."]} },
  ],
};

// ── Terminal filesystem ────────────────────────────────────────────
function buildFS() {
  const fs = { root:{ projets:{}, certifications:{}, experiences:{}, "contact.txt":null } };
  DATA.projects.forEach(p => {
    const fn = p[currentLang].title.replace(/[^a-zA-Z0-9]/g,'-').replace(/-+/g,'-').slice(0,38)+'.txt';
    fs.root.projets[fn] = p;
  });
  DATA.certs.forEach(c => {
    const fn = c[currentLang].title.replace(/[^a-zA-Z0-9]/g,'-').replace(/-+/g,'-').slice(0,38)+'.txt';
    fs.root.certifications[fn] = c;
  });
  DATA.experiences.forEach(e => {
    const fn = (e[currentLang].role+'-'+e[currentLang].period).replace(/[^a-zA-Z0-9]/g,'-').replace(/-+/g,'-').slice(0,38)+'.txt';
    fs.root.experiences[fn] = e;
  });
  fs.projets        = fs.root.projets;
  fs.certifications = fs.root.certifications;
  fs.experiences    = fs.root.experiences;
  return fs;
}

function renderItem(item) {
  if (!item) return null;
  const d = item[currentLang] || item.en;
  if (d.points) {
    const links = (d.links||[]).map(l=>`<a href="${l.href}" target="_blank" class="project-links"><i class="${l.icon}"></i> ${l.label}</a>`).join('');
    return `<div class="project-card"><h2>${d.title}</h2><div class="tags">${(d.tags||[]).map(tg=>`<span class="tag">${tg}</span>`).join('')}</div><p style="color:var(--muted);font-size:.83rem;margin:8px 0">${d.desc||''}</p><ul>${d.points.map(p=>`<li>${p}</li>`).join('')}</ul>${links?`<div class="project-links">${links}</div>`:''}</div>`;
  }
  if (d.org) {
    return `<div class="project-card"><h2>${d.title}</h2><p style="color:var(--muted);font-size:.82rem">${d.org} · <span style="color:var(--accent)">${d.date}</span></p></div>`;
  }
  return null;
}

function formatLs(items, dir) {
  const fs = buildFS();
  return `<div class="directory-list">${items.map(item => {
    const d = fs[dir][item];
    const isDir = typeof d==='object' && d!==null && !d.en && !d.fr;
    return `<span class="${isDir?'directory':'file'}">${isDir?item+'/':item}</span>`;
  }).join(' ')}</div>`;
}

// ── Build welcome card ─────────────────────────────────────────────
function buildWelcome() {
  const s = t();
  const wc = $('welcome-container');
  if (!wc) return;
  wc.innerHTML = `<div class="terminal-card">
    <div class="header">
      <span class="highlight">Cherif Jebali</span>
      <div class="tags">${s.tags.map(tg=>`<span class="tag">${tg}</span>`).join('')}</div>
    </div>
    <div class="section description">${s.welcomeDesc.map(p=>`<p>${p}</p>`).join('')}</div>
    <div class="iframe-container"><iframe src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=363282" style="border:none" scrolling="no"></iframe></div>
    <div class="section">
      <h3 style="color:var(--accent);font-size:.82rem;margin-bottom:12px;letter-spacing:.06em">$ what can you do here?</h3>
      <div class="guide-grid">${s.welcomeGuide.map(g=>`
        <div class="guide-card" onclick="processCommand('${g.cmd}')">
          <div class="guide-icon"><i class="${g.icon}"></i></div>
          <div class="guide-body">
            <div class="guide-label">${g.label}</div>
            <div class="guide-cmd"><span class="cmd">${g.cmd}</span></div>
            <div class="guide-desc">${g.desc}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
  const ls = $('init-ls');
  if (ls) ls.innerHTML = formatLs(Object.keys(buildFS().root), 'root');
}

// ── Build whoami ───────────────────────────────────────────────────
function buildWhoami() {
  const s = t();
  return `<div class="terminal-card">
    <div class="header"><span class="highlight">Cherif Jebali</span>
      <div class="tags">${s.tags.map(tg=>`<span class="tag">${tg}</span>`).join('')}</div></div>
    <div class="section description"><h3>${s.cardProfile}</h3>${s.profileDesc.map(p=>`<p>${p}</p>`).join('')}</div>
    <div class="section"><h3>$ ${s.cardEducation}</h3>${s.education.map(p=>`<p>${p}</p>`).join('')}</div>
    <div class="section"><h3>$ ${s.cardSkills}</h3>
      ${s.skillBars.map(b=>`<div style="margin:6px 0">
        <div style="display:flex;justify-content:space-between;font-size:.76rem;color:var(--muted);margin-bottom:3px"><span>${b.label}</span><span style="color:var(--green)">${b.pct}%</span></div>
        <div style="background:var(--border);border-radius:3px;height:4px"><div style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--green),var(--accent));width:${b.pct}%"></div></div>
      </div>`).join('')}
    </div>
    <div class="section"><h3>$ ${s.cardLanguages}</h3>${s.langs.map(l=>`<p>${l}</p>`).join('')}</div>
    <div class="section"><h3>$ ${s.cardInterests}</h3>${s.interests.map(i=>`<p>· ${i}</p>`).join('')}</div>
    <div class="command-hint">${s.welcomeHint}</div>
  </div>`;
}

// ── Nmap boot animation ────────────────────────────────────────────
function runNmap() {
  const container = $('nmap-container');
  if (!container) return;
  const s = t();
  const body = bodyEl();

  const block = makeEl('div','nmap-block');
  block.innerHTML = `<div class="nmap-cmd">$ ${s.nmapCmd}</div>`;
  container.appendChild(block);

  // Scroll to top so user sees the animation from the beginning
  if (body) body.scrollTop = 0;

  s.nmapLines.forEach((line, i) => {
    setTimeout(() => {
      const row = document.createElement('div');
      row.className = 'nmap-line';
      if (line.startsWith('<port>')) {
        const p = line.replace('<port>','').split(/\s+/);
        row.innerHTML = `<span class="port-open">${p[0].padEnd(10)}</span><span style="color:var(--green)">${p[1].padEnd(7)}</span><span class="port-info">${p.slice(2).join(' ')}</span>`;
      } else if (line.startsWith('<done>')) {
        row.className += ' nmap-done';
        row.textContent = line.replace('<done>','');
      } else {
        row.textContent = line;
      }
      block.appendChild(row);
      // Don't auto-scroll during animation — keep view at top
    }, i * 150);
  });
}

// ── Terminal commands ──────────────────────────────────────────────
function buildHelp() {
  return `<div class="help-table">${t().helpRows.map(([c,d])=>`<div class="help-row"><span class="help-cmd">${c}</span><span class="help-desc">${d}</span></div>`).join('')}</div>`;
}

function buildTree() {
  const fs = buildFS(); const s = t();
  let h = `<div class="tree-output"><span class="tree-dir">${s.treeTitle}</span><br>`;
  ['projets','certifications','experiences'].forEach((dir,di,arr) => {
    const last = di===arr.length-1;
    h += `${last?'└──':'├──'} <span class="tree-dir">${dir}/</span><br>`;
    Object.keys(fs.root[dir]).forEach((f,fi,files) => {
      h += `${last?'    ':'│   '}${fi===files.length-1?'└──':'├──'} <span class="tree-file">${f}</span><br>`;
    });
  });
  return h + `└── <span class="tree-file">contact.txt</span></div>`;
}

function runGrep(kw) {
  if (!kw) return `<p style="padding:4px 20px;color:var(--warn)">${t().grepUsage}</p>`;
  const kl = kw.toLowerCase(), fs = buildFS(), res = [];
  ['projets','certifications','experiences'].forEach(dir => {
    Object.entries(fs.root[dir]).forEach(([fn, item]) => {
      const txt = JSON.stringify(item||'').toLowerCase();
      if (txt.includes(kl)) {
        const d = item?.[currentLang] || item?.en || {};
        const raw = ((d.title||'')+(d.desc||'')+(d.points||[]).join(' ')).replace(/<[^>]+>/g,'');
        const idx = raw.toLowerCase().indexOf(kl);
        const s = Math.max(0,idx-25), e = Math.min(raw.length,idx+kw.length+25);
        const snip = (s>0?'…':'')+raw.substring(s,e).replace(new RegExp(`(${kw})`,'gi'),`<span class="grep-hl">$1</span>`)+(e<raw.length?'…':'');
        res.push(`<div class="grep-match"><span class="grep-file">${dir}/${fn}</span>: <span class="grep-text">${snip}</span></div>`);
      }
    });
  });
  return res.length ? res.join('') : `<p style="padding:4px 20px;color:var(--muted)">${fmt(t().grepNoResults,kw)}</p>`;
}

function buildDownload() {
  const s = t();
  return `<div class="download-bar">
    <a class="dl-btn" href="assets/CV_Cherif_Jebali_EN.pdf" download><i class="fas fa-file-download"></i> ${s.dlLabelEN} 🇬🇧</a>
    <a class="dl-btn" href="assets/CV_Cherif_Jebali_FR.pdf" download><i class="fas fa-file-download"></i> ${s.dlLabelFR} 🇫🇷</a>
  </div>`;
}

function matrixRain() {
  const ch = 'アイウエオカキクケコサシスセソ01ABCDEF';
  let h = '<div class="matrix-rain">';
  for (let r=0; r<5; r++) {
    let l='';
    for (let c=0; c<55; c++) l+=`<span style="opacity:${(Math.random()*.8+.2).toFixed(2)}">${ch[Math.floor(Math.random()*ch.length)]}</span>`;
    h+=l+'<br>';
  }
  return h+'</div>';
}

// ── Main command processor ─────────────────────────────────────────
function processCommand(raw) {
  if (!raw || !raw.trim()) return;
  commandHistory.push(raw); historyIndex = -1;
  originalPartial=''; suggestionIndex=0; suggestions=[];
  clearSugs();

  if (isFirstCommand) {
    document.querySelectorAll('.initial-content').forEach(e=>e.remove());
    isFirstCommand = false;
  }
  bodyEl().querySelectorAll('.command-line:not(#input-line),.response,.nmap-block,.help-table,.tree-output,.grep-match,.download-bar,.matrix-rain,.easter-card').forEach(e=>e.remove());

  echoCmd(raw);
  const cmd   = norm(raw);
  const parts = raw.trim().split(/\s+/);
  const sub   = (parts[1]||'').toLowerCase();
  const fs    = buildFS();

  if (cmd==='help'||cmd==='-h') {
    respond(buildHelp());
  } else if (cmd==='whoami') {
    respond(buildWhoami());
  } else if (cmd==='ls') {
    if (fs[currentDirectory]) respond(formatLs(Object.keys(fs[currentDirectory]),currentDirectory));
    else respondText('ls: directory not found');
  } else if (cmd==='cd'||cmd==='cd .') {
    respondText(t().currentDir + currentDirectory);
  } else if (cmd.startsWith('cd ')) {
    const tgt = parts[1];
    if (tgt==='..'||tgt==='~'||tgt==='root') { currentDirectory='root'; respondText(t().dirChanged+' root','var(--green)'); }
    else if (fs[tgt]) { currentDirectory=tgt; respondText(t().dirChanged+' '+tgt,'var(--green)'); }
    else respondText(fmt(t().dirNotFound,tgt));
  } else if (cmd.startsWith('cat ')) {
    const fn   = parts[1];
    const item = fs[currentDirectory]?.[fn];
    if (fn==='contact.txt') {
      respond(`<div class="contact-card"><h2>Contact</h2><div class="contact-links">
        <a href="mailto:cherif.jebali@proton.me" class="contact-link"><i class="fas fa-envelope"></i> cherif.jebali@proton.me</a>
        <a href="https://github.com/cherifon" target="_blank" class="contact-link"><i class="fab fa-github"></i> GitHub</a>
        <a href="https://www.linkedin.com/in/cherif-jebali-a248a1241/" target="_blank" class="contact-link"><i class="fab fa-linkedin"></i> LinkedIn</a>
        <a href="https://www.credly.com/users/cherif-jebali/badges" target="_blank" class="contact-link"><i class="fas fa-medal"></i> Credly</a>
      </div></div>`);
    } else if (item) {
      const c = renderItem(item);
      if (c) respond(c); else respondText(fmt(t().fileNotFound,fn));
    } else {
      respondText(fmt(t().fileNotFound,fn));
    }
  } else if (cmd==='tree') {
    respond(buildTree());
  } else if (cmd.startsWith('grep ')) {
    respond(runGrep(parts.slice(1).join(' ')));
  } else if (cmd==='grep') {
    respondText(t().grepUsage,'var(--warn)');
  } else if (cmd==='download cv'||cmd==='download') {
    respond(buildDownload());
  } else if (cmd.startsWith('theme ')) {
    setTheme(sub); respondText('Theme → '+currentTheme,'var(--green)');
  } else if (cmd==='theme') {
    setTheme(''); respondText('Theme → '+currentTheme,'var(--green)');
  } else if (cmd.startsWith('lang ')) {
    if (sub==='fr'||sub==='en') { setLang(sub); respondText('Language → '+sub.toUpperCase(),'var(--green)'); }
    else respondText('Usage: lang en | lang fr','var(--warn)');
  } else if (cmd==='home') {
    isFirstCommand=true;
    bodyEl().querySelectorAll('*:not(#input-line):not(#input-line *)').forEach(e=>e.remove());
    const wc=makeEl('div','initial-content'); wc.id='welcome-container'; bodyEl().insertBefore(wc,inputLn());
    const lr=makeEl('div','command-line initial-content'); lr.innerHTML=`<span class="prompt">cherif@kali:~$</span><span class="cmd-text" style="margin-left:8px">ls</span>`; bodyEl().insertBefore(lr,inputLn());
    const lo=makeEl('div','directory-list initial-content'); lo.id='init-ls'; bodyEl().insertBefore(lo,inputLn());
    buildWelcome(); isFirstCommand=false;
  } else if (cmd==='clear') {
    bodyEl().querySelectorAll('*:not(#input-line):not(#input-line *)').forEach(e=>e.remove());
    scrollDown(); return;
  } else if (cmd==='visual') {
    setMode('visual');
  runBootNmap();
  document.getElementById('boot-btn').addEventListener('click', closeBootModal);
  } else if (cmd==='sudo'||cmd.startsWith('sudo ')) {
    const l=t().easter.sudo; respond(`<div class="easter-card">${l.map(x=>`<p>${x}</p>`).join('')}</div>`);
  } else if (cmd==='hack'||cmd==='exploit') {
    const l=t().easter.hack; respond(`<div class="easter-card">${l.map(x=>`<p>${x}</p>`).join('')}</div>`);
  } else if (cmd==='coffee'||cmd==='cafe') {
    const l=t().easter.coffee; respond(`<div class="easter-card">${l.map(x=>`<p>${x}</p>`).join('')}</div>`);
  } else if (cmd==='matrix') {
    respond(matrixRain());
  } else if (cmd==='exit'||cmd==='quit') {
    const l=t().easter.exit; respond(`<div class="easter-card">${l.map(x=>`<p>${x}</p>`).join('')}</div>`);
  } else if (cmd==='pwd') {
    respondText('/home/cherif/'+(currentDirectory==='root'?'':currentDirectory),'var(--green)');
  } else if (cmd==='date') {
    respondText(new Date().toString(),'var(--muted)');
  } else {
    respondText(fmt(t().unknownCmd,raw));
  }
  scrollDown();
}

// ── Lang / Theme / Mode ────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  const btn = $('lang-btn');
  if (btn) btn.textContent = T[lang].langBtn;
  const inp = inputEl();
  if (inp) inp.placeholder = T[lang].placeholder;
  if (currentMode==='terminal') buildWelcome();
  else buildVisual();
}

function setTheme(name) {
  const v = themes.includes(name) ? name : themes[(themes.indexOf(currentTheme)+1)%themes.length];
  currentTheme = v;
  document.body.dataset.theme = v;
}

function setMode(mode) {
  currentMode = mode;
  document.body.dataset.mode = mode;
  $('terminal-view').style.display = mode==='terminal' ? 'flex'  : 'none';
  $('visual-view').style.display   = mode==='visual'   ? 'block' : 'none';
  updateModeSlider();
  if (mode==='visual') buildVisual();
  else setTimeout(()=>{ const i=inputEl(); if(i)i.focus(); },50);
}

function updateModeSlider() {
  const toggle = $('mode-toggle');
  if (!toggle) return;
  const active = toggle.querySelector(`.mode-opt[data-m="${currentMode}"]`);
  const slider = toggle.querySelector('.mode-slider');
  if (active && slider) {
    slider.style.width     = active.offsetWidth+'px';
    slider.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  toggle.querySelectorAll('.mode-opt').forEach(o => {
    o.style.color = o.dataset.m===currentMode ? '#000' : '';
  });
}

// ── Visual mode ────────────────────────────────────────────────────
function buildVisual() {
  const s = t();
  const set = (id, val) => { const e=$(id); if(e) e.textContent=val; };
  set('v-name','Cherif Jebali');
  set('v-subtitle', s.heroSubtitle);
  $('v-tags').innerHTML = s.tags.map(tg=>`<span class="v-tag">${tg}</span>`).join('');
  set('tab-about',    s.sectionAbout);
  set('tab-projects', s.sectionProjects);
  set('tab-certs',    s.sectionCerts);
  set('tab-exp',      s.sectionExp);
  set('tab-contact',  s.sectionContact);

  // About
  $('v-about').innerHTML = `<div class="v-about-grid">
    <div class="v-card">
      <div class="v-card-title"><i class="fas fa-user-shield"></i> ${s.cardProfile}</div>
      ${s.profileDesc.map(p=>`<p>${p}</p>`).join('')}
      <div class="v-thm"><iframe src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=363282" style="border:none" scrolling="no"></iframe></div>
    </div>
    <div class="v-card">
      <div class="v-card-title"><i class="fas fa-graduation-cap"></i> ${s.cardEducation}</div>
      ${s.education.map(e=>`<p>${e}</p>`).join('')}
    </div>
    <div class="v-card">
      <div class="v-card-title"><i class="fas fa-code"></i> ${s.cardSkills}</div>
      ${s.skillBars.map(b=>`<div class="v-skill-bar"><div class="v-skill-label"><span>${b.label}</span><span>${b.pct}%</span></div><div class="v-bar-track"><div class="v-bar-fill" style="width:${b.pct}%"></div></div></div>`).join('')}
    </div>
    <div class="v-card">
      <div class="v-card-title"><i class="fas fa-language"></i> ${s.cardLanguages}</div>
      ${s.langs.map(l=>`<p>${l}</p>`).join('')}
      <div style="margin-top:14px">
        <div class="v-card-title"><i class="fas fa-heart"></i> ${s.cardInterests}</div>
        ${s.interests.map(i=>`<p>· ${i}</p>`).join('')}
      </div>
    </div>
  </div>`;

  // Projects
  $('v-projects').innerHTML = `<div class="v-project-grid">${DATA.projects.map(p=>{
    const d = p[currentLang]||p.en;
    const links = (d.links||[]).map(l=>`<a class="v-proj-link" href="${l.href}" target="_blank"><i class="${l.icon}"></i>${l.label}</a>`).join('');
    return `<div class="v-proj-card">
      <div class="v-proj-title">${d.title}</div>
      <div class="v-proj-tags">${(d.tags||[]).map(tg=>`<span class="v-proj-tag">${tg}</span>`).join('')}</div>
      <div class="v-proj-desc">${d.desc||''}</div>
      <ul style="list-style:none;padding:0;margin:0">${(d.points||[]).map(pt=>`<li style="color:var(--muted);font-size:.78rem;line-height:1.65;padding-left:12px;position:relative"><span style="position:absolute;left:0;color:var(--green)">▸</span>${pt}</li>`).join('')}</ul>
      ${links?`<div class="v-proj-links">${links}</div>`:''}
    </div>`;
  }).join('')}</div>`;

  // Certifications
  $('v-certs').innerHTML = `<div class="v-cert-grid">${DATA.certs.map(c=>{
    const d = c[currentLang]||c.en;
    return `<div class="v-cert-card"><div class="v-cert-title">${d.title}</div><div class="v-cert-org">${d.org}</div><div class="v-cert-date">${d.date}</div></div>`;
  }).join('')}</div>`;

  // Experience
  $('v-exp').innerHTML = `<div class="v-timeline">${DATA.experiences.map(e=>{
    const d = e[currentLang]||e.en;
    return `<div class="v-tl-item">
      <div class="v-tl-header"><span class="v-tl-role">${d.role}</span><span class="v-tl-period">${d.period}</span></div>
      ${d.org?`<div class="v-tl-org">${d.org}</div>`:''}
      <div class="v-tl-tags">${(d.tags||[]).map(tg=>`<span class="v-tl-tag">${tg}</span>`).join('')}</div>
      <ul class="v-tl-points">${(d.points||[]).map(pt=>`<li>${pt}</li>`).join('')}</ul>
    </div>`;
  }).join('')}</div>`;

  // Contact
  $('v-contact').innerHTML = `<div class="v-contact-grid">
    <a href="mailto:cherif.jebali@proton.me" class="v-contact-item"><i class="fas fa-envelope"></i><span class="v-contact-label">Email</span><span class="v-contact-value">cherif.jebali@proton.me</span></a>
    <a href="https://github.com/cherifon" target="_blank" class="v-contact-item"><i class="fab fa-github"></i><span class="v-contact-label">GitHub</span><span class="v-contact-value">github.com/cherifon</span></a>
    <a href="https://www.linkedin.com/in/cherif-jebali-a248a1241/" target="_blank" class="v-contact-item"><i class="fab fa-linkedin"></i><span class="v-contact-label">LinkedIn</span><span class="v-contact-value">cherif-jebali</span></a>
    <a href="https://www.credly.com/users/cherif-jebali/badges" target="_blank" class="v-contact-item"><i class="fas fa-medal"></i><span class="v-contact-label">Credly</span><span class="v-contact-value">badges</span></a>
    <a href="assets/CV_Cherif_Jebali_EN.pdf" download class="v-contact-item" style="color:var(--green)"><i class="fas fa-file-download"></i><span class="v-contact-label">${s.dlLabelEN} 🇬🇧</span><span class="v-contact-value">PDF</span></a>
    <a href="assets/CV_Cherif_Jebali_FR.pdf" download class="v-contact-item" style="color:var(--green)"><i class="fas fa-file-download"></i><span class="v-contact-label">${s.dlLabelFR} 🇫🇷</span><span class="v-contact-value">PDF</span></a>
  </div>`;
}

// ── Visual tabs ────────────────────────────────────────────────────
function initVisualTabs() {
  document.querySelectorAll('.v-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v-tab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.v-section').forEach(s=>s.classList.remove('active'));
      btn.classList.add('active');
      const sec = $('v-'+btn.dataset.section);
      if (sec) sec.classList.add('active');
    });
  });
}

// ── Suggestions ────────────────────────────────────────────────────
function showSugs(matches) {
  let b = $('suggestions');
  if (!b) { b=makeEl('div',''); b.id='suggestions'; inputLn().parentNode.insertBefore(b,inputLn()); }
  b.innerHTML = matches.map(m=>`<span>${m}</span>`).join('');
}

// ── Init ───────────────────────────────────────────────────────────

function runBootNmap() {
  const s = t();
  const container = document.getElementById('boot-nmap-container');
  if (!container) return;
  const block = document.createElement('div');
  block.className = 'nmap-block';
  block.innerHTML = '<div class="nmap-cmd">$ ' + s.nmapCmd + '</div>';
  container.appendChild(block);
  const totalLines = s.nmapLines.length;
  s.nmapLines.forEach((line, i) => {
    setTimeout(() => {
      const row = document.createElement('div');
      row.className = 'nmap-line';
      if (line.startsWith('<port>')) {
        const p = line.replace('<port>','').split(/\s+/);
        row.innerHTML = '<span class="port-open">'+p[0].padEnd(10)+'</span><span style="color:var(--green)">'+p[1].padEnd(7)+'</span><span class="port-info">'+p.slice(2).join(' ')+'</span>';
      } else if (line.startsWith('<done>')) {
        row.className += ' nmap-done';
        row.textContent = line.replace('<done>','');
      } else { row.textContent = line; }
      block.appendChild(row);
      if (i === totalLines - 1)
        setTimeout(() => { document.getElementById('boot-enter').style.display = 'block'; }, 300);
    }, i * 150);
  });
}
function closeBootModal() {
  const modal = document.getElementById('boot-modal');
  if (!modal) return;
  modal.style.opacity = '0';
  setTimeout(() => modal.remove(), 500);
}
window.addEventListener('DOMContentLoaded', () => {
  setMode('visual');
  runBootNmap();
  document.getElementById('boot-btn').addEventListener('click', closeBootModal);
  buildWelcome();
  initVisualTabs();
  setTimeout(updateModeSlider, 100);

  $('lang-btn').addEventListener('click', () => setLang(currentLang==='en'?'fr':'en'));
  $('theme-btn').addEventListener('click', () => setTheme(''));
  $('mode-toggle').querySelectorAll('.mode-opt').forEach(opt => {
    opt.addEventListener('click', () => setMode(opt.dataset.m));
  });
  document.querySelectorAll('.mob-btn').forEach(btn => {
    btn.addEventListener('click', () => processCommand(btn.dataset.cmd));
  });
  document.querySelector('.terminal-window').addEventListener('click', () => { const i=inputEl(); if(i)i.focus(); });

  const inp = inputEl();
  if (!inp) return;

  // Auto-resize input to keep cursor right after text
  const mirror = document.createElement('span');
  mirror.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;white-space:pre;font-family:inherit;font-size:.9rem;pointer-events:none;';
  document.body.appendChild(mirror);
  function resizeInput() {
    mirror.textContent = inp.value || '';
    inp.style.width = Math.max(2, mirror.offsetWidth+2)+'px';
  }
  inp.addEventListener('input', resizeInput);
  inp.addEventListener('keyup',  resizeInput);
  resizeInput();
  inp.focus();

  inp.addEventListener('keydown', function(e) {
    // History
    if (e.key==='ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length-1) { historyIndex++; this.value=commandHistory[commandHistory.length-1-historyIndex]; resizeInput(); }
      return;
    }
    if (e.key==='ArrowDown') {
      e.preventDefault();
      if (historyIndex>0) { historyIndex--; this.value=commandHistory[commandHistory.length-1-historyIndex]; }
      else { historyIndex=-1; this.value=''; }
      resizeInput(); return;
    }
    // Tab autocomplete
    if (e.key==='Tab') {
      e.preventDefault();
      const val = this.value.trim();
      if (!originalPartial) {
        originalPartial=val; suggestionIndex=0; suggestions=[];
        const [cmd2,arg] = val.split(' ');
        const fs = buildFS();
        if (!arg) {
          if (cmd2==='cd')  suggestions=Object.keys(fs[currentDirectory]).filter(k=>{ const d=fs[currentDirectory][k]; return typeof d==='object'&&!d?.en&&!d?.fr; });
          else if (cmd2==='cat') suggestions=Object.keys(fs[currentDirectory]).filter(k=>k.endsWith('.txt'));
          else suggestions=['help','whoami','ls','cd','cat','tree','grep','download','theme','lang','home','clear','visual','matrix','pwd','date'].filter(c=>c.startsWith(val.toLowerCase()));
        } else {
          const fs2=buildFS();
          if (cmd2==='cd')    suggestions=Object.keys(fs2[currentDirectory]).filter(k=>{ const d=fs2[currentDirectory][k]; return typeof d==='object'&&!d?.en&&!d?.fr&&k.startsWith(arg); });
          if (cmd2==='cat')   suggestions=Object.keys(fs2[currentDirectory]).filter(k=>k.endsWith('.txt')&&k.startsWith(arg));
          if (cmd2==='theme') suggestions=themes.filter(th=>th.startsWith(arg));
          if (cmd2==='lang')  suggestions=['en','fr'].filter(l=>l.startsWith(arg));
        }
        if (suggestions.length) showSugs(suggestions);
      }
      if (suggestions.length) {
        const [cmd3]=originalPartial.split(' ');
        this.value=['cd','cat','theme','lang','grep'].includes(cmd3)?`${cmd3} ${suggestions[suggestionIndex]}`:suggestions[suggestionIndex];
        suggestionIndex=(suggestionIndex+1)%suggestions.length;
        resizeInput();
      }
      return;
    }
    if (e.key!=='Enter') { originalPartial=''; suggestionIndex=0; suggestions=[]; return; }
    // Enter
    const raw=this.value; this.value=''; resizeInput();
    processCommand(raw);
  });

  inp.addEventListener('input', function() {
    const val=this.value.trim(), [cmd2]=val.toLowerCase().split(' ');
    suggestions=[]; suggestionIndex=0;
    if (val.endsWith(' ')) {
      const fs=buildFS();
      if (cmd2==='cd')    suggestions=Object.keys(fs[currentDirectory]).filter(k=>{ const d=fs[currentDirectory][k]; return typeof d==='object'&&!d?.en&&!d?.fr; });
      if (cmd2==='cat')   suggestions=Object.keys(fs[currentDirectory]).filter(k=>k.endsWith('.txt'));
      if (cmd2==='theme') suggestions=[...themes];
      if (cmd2==='lang')  suggestions=['en','fr'];
      if (suggestions.length) showSugs(suggestions);
    } else clearSugs();
  });
});
