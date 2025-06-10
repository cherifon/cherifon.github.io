let currentDirectory = "root"; // Répertoire actuel, initialement à la racine

// Ajouter au début du fichier
let commandHistory = [];
let historyIndex = -1;

// Ajouter cette fonction helper au début du fichier
function normalizeCommand(input) {
    return input.toLowerCase().trim();
}

// Ajouter au début du fichier, après les autres variables globales
const initialContent = `
    <div class="terminal-card">
        <div class="header">
            <span class="highlight">Cherif Jebali</span>
            <div class="tags">
                <span class="tag">Cybersécurité</span>
                <span class="tag">Pentesting</span>
                <span class="tag">IA</span>
                <span class="tag">Administration Système</span>
            </div>
        </div>

        <div class="section description">
            <p>Je m'appelle Cherif Jebali, étudiant en Cyberdéfense à l'école Hexagone.</p>
            <p>Passionné par la cybersécurité, le pentesting et l'IA, je développe régulièrement des outils de sécurité pour tester et renforcer la résilience des systèmes.</p>
            <p>Projet en cours : Création d'un homelab avec des services web sécurisés.</p>
        </div>

        <div class="command-hint">
            <p>Ce terminal interactif a été conçu pour présenter mes compétences, mes projets et mes expériences dans un format original inspiré de l'environnement Kali Linux.</p>
            <p>Tapez <span class="cmd">whoami</span> pour en savoir plus sur moi, <span class="cmd">home</span> pour revenir vers le menu principal et <span class="cmd">-h</span> pour la liste des commandes.</p>
        </div>
    </div>
`;

// Structure des dossiers et fichiers
const fileSystem = {
    root: {
        "projets": {
            "Pentesting-et-Bug-Bounty.txt": {
                content: `
                    <div class="project-card">
                        <h2>Pentesting et Bug Bounty</h2>
                        <div class="tags">
                            <span class="tag">Pentest</span>
                            <span class="tag">Sécurité</span>
                        </div>
                        <p>Participation active sur des plateformes comme Hack The Box (HTB) et Hack This Site :</p>
                        <ul>
                            <li>Exploitation de vulnérabilités (SQL injection, path traversal, commande injection...)</li>
                            <li>Utilisation d'outils comme Nmap et Burp Suite de la reconnaissance et l'analyse de systèmes</li>
                            <li>Identification de faille sur des applications web et mise en œuvre de failles pour les exploiter</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://app.hackthebox.com/profile/638392" target="_blank">Voir mon profil Hack The Box</a>
                            <a href="https://github.com/cherifon/HackTheBox" target="_blank">Voir mes write-ups</a>
                        </div>
                    </div>
                `
            },
            "Scripts-Cybersecurite.txt": {
                content: `
                    <div class="project-card">
                        <h2>Scripts pour la Cybersécurité</h2>
                        <div class="tags">
                            <span class="tag">Python</span>
                            <span class="tag">Bash</span>
                        </div>
                        <p>Développement de scripts Python et Bash :</p>
                        <ul>
                            <li>Scanner de ports pour l'analyse de la surface d'attaque</li>
                            <li>Simulation d'attaques DDoS ou de flooding utilisant Scapy</li>
                            <li>Automatisation de scans et de tests sur des cibles définies</li>
                            <li>Attaques de mots de passe sur SSH et Telnet</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/cherifon/Cybersecurity-Tools" target="_blank">Voir le dépôt GitHub</a>
                        </div>
                    </div>
                `
            },
            "Web-Crawler-Java.txt": {
                content: `
                    <div class="project-card">
                        <h2>Web Crawler en Java</h2>
                        <div class="tags">
                            <span class="tag">Java</span>
                            <span class="tag">Web Scraping</span>
                        </div>
                        <p>Création d'un outil de web scraping :</p>
                        <ul>
                            <li>Exploration de pages web en suivant des liens pour collecter des données</li>
                            <li>Gestion des exceptions HTTP et des restrictions de robots.txt</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/cherifon/Java-Web-Crawler" target="_blank">Voir le dépôt GitHub</a>
                        </div>
                    </div>
                `
            },
            "Honeypot-SSH.txt": {
                content: `
                    <div class="project-card">
                        <h2>Honeypot sur un Serveur Local (SSH, Cowrie)</h2>
                        <div class="tags">
                            <span class="tag">Honeypot</span>
                            <span class="tag">Sécurité</span>
                            <span class="tag">SSH</span>
                        </div>
                        <p>Mise en place d’un honeypot pour observer les comportements des attaquants :</p>
                        <ul>
                            <li>Simulation d’un environnement SSH vulnérable sur une machine hébergée localement</li>
                            <li>Surveillance des tentatives de connexion et des commandes exécutées</li>
                            <li>Analyse des logs collectés</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/cherifon/Cowrie-SSH-Honeypot" target="_blank">Voir le dépôt GitHub</a>
                        </div>
                    </div>
                `
            },
            "Gestionnaire-de-Tournoi.txt": {
                content: `
                    <div class="project-card">
                        <h2>Gestionnaire de Tournoi</h2>
                        <div class="tags">
                            <span class="tag">Java</span>
                            <span class="tag">JavaFX</span>
                            <span class="tag">SQL</span>
                        </div>
                        <p>Application en Java pour la gestion de tournois sportifs :</p>
                        <ul>
                            <li>Stockage des participants, scores et calendriers en base de données SQL</li>
                            <li>Interface graphique intuitive avec JavaFX</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/cherifon/Gestionnaire_de_tournoi" target="_blank">Voir le dépôt GitHub</a>
                        </div>
                    </div>
                `
            },
            "CO2-Forecasting.txt": {
                content: `
                    <div class="project-card">
                        <h2>Prévision de CO₂ et Microélectronique</h2>
                        <div class="tags">
                            <span class="tag">STM32</span>
                            <span class="tag">Python</span>
                            <span class="tag">C</span>
                            <span class="tag">Data Science</span>
                        </div>
                        <p>Projet mêlant IoT, microélectronique et data science :</p>
                        <ul>
                            <li>Utilisation de STM32 et capteur SDC30 pour la collecte des données</li>
                            <li>Analyse des données avec Python (pandas, matplotlib)</li>
                            <li>Prédiction des concentrations de CO₂ avec modèles de régression</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/cherifon/CO2_Forecasting" target="_blank">Voir le dépôt GitHub</a>
                        </div>
                    </div>
                `
            }
        },
        "certifications": {
            "Introduction-to-Cybersecurity-Cisco.txt": {
                content: `
                    <div class="project-card">
                        <h2>Introduction to Cybersecurity - Cisco</h2>
                        <div class="tags">
                            <span class="tag">Cybersécurité</span>
                            <span class="tag">Cisco</span>
                        </div>
                        <img src="assets/Certif_intro_to_cyber.png" alt="Certification Cybersécurité Cisco" class="cert-image">
                        <p>Compétences acquises :</p>
                        <ul>
                            <li>Analyse des cyberattaques courantes (phishing, ransomware, DDoS)</li>
                            <li>Utilisation des pare-feu et des logiciels antivirus</li>
                            <li>Concepts clés : Confidentialité, Intégrité, Disponibilité (CIA)</li>
                        </ul>
                    </div>
                `
            },
            "Networking-Basics-Cisco.txt": {
                content: `
                    <div class="project-card">
                        <h2>Networking Basics - Cisco</h2>
                        <div class="tags">
                            <span class="tag">Réseaux</span>
                            <span class="tag">Cisco</span>
                        </div>
                        <img src="assets/Certif_networking_basics.png" alt="Certification Réseaux Cisco" class="cert-image">
                        <p>Principaux acquis :</p>
                        <ul>
                            <li>Configuration des réseaux locaux (LAN) et étendus (WAN)</li>
                            <li>Utilisation des protocoles TCP/IP, DHCP, DNS</li>
                            <li>Diagnostique réseau avec ping et traceroute</li>
                        </ul>
                    </div>
                `
            }
        },
        "experiences": {
            "Coordinateur-IT-LAB.txt": {
                content: `
                    <div class="project-card">
                        <h2>Coordinateur au Club Informatique IT LAB Dauphine</h2>
                        <div class="tags">
                            <span class="tag">Encadrement</span>
                            <span class="tag">Étudiants</span>
                            <span class="tag">Hackathons</span>
                        </div>
                        <p>Encadrement d’une équipe d’étudiants :</p>
                        <ul>
                            <li>Formation sur GitHub et Godot Engine</li>
                            <li>Coordination d’un projet de création de jeu vidéo</li>
                            <li>Organisation de Hackathons et CTF</li>
                        </ul>
                    </div>
                `
            },
            "Volontariat-HOP.txt": {
                content: `
                    <div class="project-card">
                        <h2>Volontariat - Handisport Open Paris</h2>
                        <div class="tags">
                            <span class="tag">Handisport</span>
                            <span class="tag">Sport</span>
                            <span class="tag">Événement</span>
                        </div>
                        <p>Contributions au Handisport Open Paris :</p>
                        <ul>
                            <li>Assistance à la mise en place des installations sportives</li>
                            <li>Support au processus de classification des athlètes</li>
                        </ul>
                    </div>
                `
            }
        },
        "contact.txt": {
            content: `
                <div class="contact-card">
                    <h2>Me contacter</h2>
                    <div class="contact-links">
                        <a href="mailto:cherifjebali0301@gmail.com" class="contact-link">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                        </a>
                        <a href="https://www.linkedin.com/in/cherif-jebali-a248a1241/" target="_blank" class="contact-link">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://github.com/cherifon" target="_blank" class="contact-link">
                            <i class="fab fa-github"></i>
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            `
        }
    },

    // Garder les sous-répertoires accessibles directement
    projets: {
        "Pentesting-et-Bug-Bounty.txt": {
            content: `
                <div class="project-card">
                    <h2>Pentesting et Bug Bounty</h2>
                    <div class="tags">
                        <span class="tag">Pentest</span>
                        <span class="tag">Sécurité</span>
                    </div>
                    <p>Participation active sur des plateformes comme Hack The Box (HTB) et Hack This Site :</p>
                    <ul>
                        <li>Exploitation de vulnérabilités (SQL injection, path traversal, commande injection...)</li>
                        <li>Utilisation d'outils comme Nmap et Burp Suite de la reconnaissance et l'analyse de systèmes</li>
                        <li>Identification de faille sur des applications web et mise en œuvre de failles pour les exploiter</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://app.hackthebox.com/profile/638392" target="_blank">Voir mon profil Hack The Box</a>
                        <a href="https://github.com/cherifon/HackTheBox" target="_blank">Voir mes write-ups</a>
                    </div>
                </div>
            `
        },
        "Scripts-Cybersecurite.txt": {
            content: `
                <div class="project-card">
                    <h2>Scripts pour la Cybersécurité</h2>
                    <div class="tags">
                        <span class="tag">Python</span>
                        <span class="tag">Bash</span>
                    </div>
                    <p>Développement de scripts Python et Bash :</p>
                    <ul>
                        <li>Scanner de ports pour l'analyse de la surface d'attaque</li>
                        <li>Simulation d'attaques DDoS ou de flooding utilisant Scapy</li>
                        <li>Automatisation de scans et de tests sur des cibles définies</li>
                        <li>Attaques de mots de passe sur SSH et Telnet</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://github.com/cherifon/Cybersecurity-Tools" target="_blank">Voir le dépôt GitHub</a>
                    </div>
                </div>
            `
        },
        "Web-Crawler-Java.txt": {
            content: `
                <div class="project-card">
                    <h2>Web Crawler en Java</h2>
                    <div class="tags">
                        <span class="tag">Java</span>
                        <span class="tag">Web Scraping</span>
                    </div>
                    <p>Création d'un outil de web scraping :</p>
                    <ul>
                        <li>Exploration de pages web en suivant des liens pour collecter des données</li>
                        <li>Gestion des exceptions HTTP et des restrictions de robots.txt</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://github.com/cherifon/Java-Web-Crawler" target="_blank">Voir le dépôt GitHub</a>
                    </div>
                </div>
            `
        },
        "Honeypot-SSH.txt": {
            content: `
                <div class="project-card">
                    <h2>Honeypot sur un Serveur Local (SSH, Cowrie)</h2>
                    <div class="tags">
                        <span class="tag">Honeypot</span>
                        <span class="tag">Sécurité</span>
                        <span class="tag">SSH</span>
                    </div>
                    <p>Mise en place d’un honeypot pour observer les comportements des attaquants :</p>
                    <ul>
                        <li>Simulation d’un environnement SSH vulnérable sur une machine hébergée localement</li>
                        <li>Surveillance des tentatives de connexion et des commandes exécutées</li>
                        <li>Analyse des logs collectés</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://github.com/cherifon/Cowrie-SSH-Honeypot" target="_blank">Voir le dépôt GitHub</a>
                    </div>
                </div>
            `
        },
        "Gestionnaire-de-Tournoi.txt": {
            content: `
                <div class="project-card">
                    <h2>Gestionnaire de Tournoi</h2>
                    <div class="tags">
                        <span class="tag">Java</span>
                        <span class="tag">JavaFX</span>
                        <span class="tag">SQL</span>
                    </div>
                    <p>Application en Java pour la gestion de tournois sportifs :</p>
                    <ul>
                        <li>Stockage des participants, scores et calendriers en base de données SQL</li>
                        <li>Interface graphique intuitive avec JavaFX</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://github.com/cherifon/Gestionnaire_de_tournoi" target="_blank">Voir le dépôt GitHub</a>
                    </div>
                </div>
            `
        },
        "CO2-Forecasting.txt": {
            content: `
                <div class="project-card">
                    <h2>Prévision de CO₂ et Microélectronique</h2>
                    <div class="tags">
                        <span class="tag">STM32</span>
                        <span class="tag">Python</span>
                        <span class="tag">C</span>
                        <span class="tag">Data Science</span>
                    </div>
                    <p>Projet mêlant IoT, microélectronique et data science :</p>
                    <ul>
                        <li>Utilisation de STM32 et capteur SDC30 pour la collecte des données</li>
                        <li>Analyse des données avec Python (pandas, matplotlib)</li>
                        <li>Prédiction des concentrations de CO₂ avec modèles de régression</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://github.com/cherifon/CO2_Forecasting" target="_blank">Voir le dépôt GitHub</a>
                    </div>
                </div>
            `
        } 
    },
    certifications: {
        "Introduction-to-Cybersecurity-Cisco.txt": {
            content: `
                <div class="project-card">
                    <h2>Introduction to Cybersecurity - Cisco</h2>
                    <div class="tags">
                        <span class="tag">Cybersécurité</span>
                        <span class="tag">Cisco</span>
                    </div>
                    <img src="assets/Certif_intro_to_cyber.png" alt="Certification Cybersécurité Cisco" class="cert-image">
                    <p>Compétences acquises :</p>
                    <ul>
                        <li>Analyse des cyberattaques courantes (phishing, ransomware, DDoS)</li>
                        <li>Utilisation des pare-feu et des logiciels antivirus</li>
                        <li>Concepts clés : Confidentialité, Intégrité, Disponibilité (CIA)</li>
                    </ul>
                </div>
            `
        },
        "Networking-Basics-Cisco.txt": {
            content: `
                <div class="project-card">
                    <h2>Networking Basics - Cisco</h2>
                    <div class="tags">
                        <span class="tag">Réseaux</span>
                        <span class="tag">Cisco</span>
                    </div>
                    <img src="assets/Certif_networking_basics.png" alt="Certification Réseaux Cisco" class="cert-image">
                    <p>Principaux acquis :</p>
                    <ul>
                        <li>Configuration des réseaux locaux (LAN) et étendus (WAN)</li>
                        <li>Utilisation des protocoles TCP/IP, DHCP, DNS</li>
                        <li>Diagnostique réseau avec ping et traceroute</li>
                    </ul>
                </div>
            `
        }
        },
    experiences: {
        "Coordinateur-IT-LAB.txt": {
            content: `
                <div class="project-card">
                    <h2>Coordinateur au Club Informatique IT LAB Dauphine</h2>
                    <div class="tags">
                        <span class="tag">Encadrement</span>
                        <span class="tag">Étudiants</span>
                        <span class="tag">Hackathons</span>
                    </div>
                    <p>Encadrement d’une équipe d’étudiants :</p>
                    <ul>
                        <li>Formation sur GitHub et Godot Engine</li>
                        <li>Coordination d’un projet de création de jeu vidéo</li>
                        <li>Organisation de Hackathons et CTF</li>
                    </ul>
                </div>
            `
        },
        "Volontariat-HOP.txt": {
            content: `
                <div class="project-card">
                    <h2>Volontariat - Handisport Open Paris</h2>
                    <div class="tags">
                        <span class="tag">Handisport</span>
                        <span class="tag">Sport</span>
                        <span class="tag">Événement</span>
                    </div>
                    <p>Contributions au Handisport Open Paris :</p>
                    <ul>
                        <li>Assistance à la mise en place des installations sportives</li>
                        <li>Support au processus de classification des athlètes</li>
                    </ul>
                </div>
            `
        }
    }
};

let isFirstCommand = true; // Pour savoir si c'est la première commande

// Variables pour gérer les suggestions
let suggestions = [];
let suggestionIndex = 0;
let lastPartial = "";

// Fonction pour afficher les suggestions
function displaySuggestions(matches) {
    // Créer ou récupérer le conteneur de suggestions
    let suggestionContainer = document.getElementById("suggestions");
    if (!suggestionContainer) {
        suggestionContainer = document.createElement("div");
        suggestionContainer.id = "suggestions";
        // Style simple pour rendre le texte plus transparent
        suggestionContainer.style.color = "rgba(255, 255, 255, 0.5)";
        suggestionContainer.style.marginTop = "5px";
        this.parentNode.insertBefore(suggestionContainer, this.nextSibling);
    }
    // Nettoyer le contenu précédent
    suggestionContainer.innerHTML = "";
    // Afficher toutes les suggestions
    matches.forEach(match => {
        const item = document.createElement("div");
        item.textContent = match;
        suggestionContainer.appendChild(item);
    });
}

// Variables pour gérer l'autocomplétion
let originalPartial = ""; // On mémorise le préfixe initial

document.getElementById("terminal-input").addEventListener("keydown", function(event) {
    // Gestion de l'historique des commandes
    if (event.key === "ArrowUp") {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[commandHistory.length - 1 - historyIndex];
        }
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
            historyIndex = -1;
            this.value = "";
        }
    }

    if (event.key === "Tab") {
        event.preventDefault();
        
        const currentValue = this.value.trim();
        
        // Si c'est le premier Tab
        if (!originalPartial) {
            originalPartial = currentValue;
            suggestionIndex = 0;
            suggestions = []; 

            // Analyser la commande
            const [command, arg] = currentValue.split(" ");
            
            // Si on a une commande sans argument
            if (command && !arg) {
                if (command === "cd") {
                    // Suggérer tous les dossiers
                    suggestions = Object.keys(fileSystem[currentDirectory]).filter(item => {
                        const itemData = fileSystem[currentDirectory][item];
                        // Un dossier est un objet qui n'a pas de propriété content
                        return (typeof itemData === 'object' && !itemData.content) || item === "..";
                    });
                }
                else if (command === "cat") {
                    const files = Object.keys(fileSystem[currentDirectory]).filter(item => {
                        const fileData = fileSystem[currentDirectory][item];
                        return (typeof fileData === 'string' && item.endsWith('.txt')) || 
                               (typeof fileData === 'object' && fileData.content && item.endsWith('.txt'));
                    });
                    suggestions = files.filter(file => file.startsWith(arg || ''));
                }
                else {
                    // Suggérer les commandes de base qui commencent par la saisie
                    const baseCommands = ["-h", "--help", "whoami", "ls", "cd", "cat", "home"];
                    suggestions = baseCommands.filter(cmd => cmd.startsWith(currentValue.toLowerCase()));
                }
            }
            // Si on a un début d'argument
            else if (arg) {
                if (command === "cd") {
                    const dirs = Object.keys(fileSystem[currentDirectory]).filter(item => 
                        typeof fileSystem[currentDirectory][item] === 'object' || item === ".."
                    );
                    suggestions = dirs.filter(dir => dir.startsWith(arg));
                }
                else if (command === "cat") {
                    const files = Object.keys(fileSystem[currentDirectory]).filter(item => {
                        const fileData = fileSystem[currentDirectory][item];
                        return (typeof fileData === 'string' && item.endsWith('.txt')) || 
                               (typeof fileData === 'object' && fileData.content && item.endsWith('.txt'));
                    });
                    suggestions = files.filter(file => file.startsWith(arg || ''));
                }
            }
            
            if (suggestions.length > 0) {
                displaySuggestions.call(this, suggestions);
            }
        }

        // Faire défiler les suggestions si présentes
        if (suggestions.length > 0) {
            const [command] = originalPartial.split(" ");
            if (command === "cd" || command === "cat") {
                this.value = `${command} ${suggestions[suggestionIndex]}`;
            } else {
                this.value = suggestions[suggestionIndex];
            }
            suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        }
    } else if (event.key !== "Enter") {
        // Si une autre touche est pressée (sauf Enter), réinitialiser
        originalPartial = "";
        suggestionIndex = 0;
        suggestions = [];
    }

    if (event.key === "Enter") {
        const input = this.value.trim();
        if (input) {
            commandHistory.push(input);
            historyIndex = -1;
        }

        // Réinitialiser complètement l'autocomplétion
        originalPartial = "";
        suggestionIndex = 0;
        suggestions = [];

        const terminalWindow = document.querySelector(".terminal-window");

        // Effacer tous les éléments initiaux lors de la première commande
        if (isFirstCommand) {
            const initialContent = terminalWindow.querySelectorAll('.initial-content');
            initialContent.forEach(content => content.remove());
            isFirstCommand = false; // Ne plus effacer les éléments après la première fois
        }

        // Effacer tout sauf la ligne d'entrée
        const oldOutputs = terminalWindow.querySelectorAll('.command-line, .response');
        oldOutputs.forEach(output => {
            if (output !== this.parentNode) output.remove();
        });

        // Créer la ligne de commande affichant l'entrée de l'utilisateur
        const commandOutput = document.createElement("div");
        commandOutput.className = "command-line";
        commandOutput.innerHTML = `<span class="prompt">cherif@kali:~$</span> ${input}`;

        // Ajouter la commande avant la ligne d'entrée
        terminalWindow.insertBefore(commandOutput, this.parentNode);

        // Simuler une réponse aux commandes
        const response = document.createElement("div");
        response.className = "response";

        switch (true) { // Utilise true pour évaluer les conditions
            case normalizeCommand(input) === "-h" || normalizeCommand(input) === "--help":
                response.innerHTML = `
                    Commandes disponibles :
                    <ul>
                        <li>home : Retourne à l'accueil</li>
                        <li>whoami : Affiche ma présentation</li>
                        <li>ls : Liste des fichiers et dossiers</li>
                        <li>cat [fichier] : Affiche le contenu d'un fichier</li>
                        <li>cd [répertoire] : Change de répertoire</li>
                    </ul>
                `;
                break;
        
            case normalizeCommand(input) === "whoami":
                const projetsContent = document.getElementById("whoami-content").innerHTML;
                response.innerHTML = projetsContent;
                break;
        
            case normalizeCommand(input) === "ls":    
                if (fileSystem[currentDirectory]) {
                    const currentDirectoryContent = Object.keys(fileSystem[currentDirectory]);
                    response.innerHTML = formatLsOutput(currentDirectoryContent, currentDirectory);
                } else {
                    response.textContent = "Erreur : Répertoire introuvable.";
                }
                break;

            case normalizeCommand(input) === "cd":
                response.textContent = "Répertoir actuel : " + currentDirectory;
                break;
        
            case normalizeCommand(input).startsWith("cd "):
                const directory = input.split(" ")[1]; // On garde la casse originale pour le nom du répertoire
                if (fileSystem[directory]) {
                    currentDirectory = directory;
                    response.textContent = `Répertoire changé pour "${directory}".`;
                }
                else if (directory === "..") {
                    currentDirectory = "root";
                    response.textContent = `Répertoire changé pour "root".`;
                }
                else {
                    response.textContent = `Répertoire "${directory}" introuvable.`;
                }
                break;
        
            case normalizeCommand(input).startsWith("cat "): 
                const file = input.split(" ")[1]; // On garde la casse originale pour le nom du fichier
                if (fileSystem[currentDirectory] && fileSystem[currentDirectory][file]) {
                    const fileData = fileSystem[currentDirectory][file];
                    if (typeof fileData === 'object') {
                        response.innerHTML = fileData.content;
                    } else {
                        response.innerHTML = fileData; // Changé de textContent à innerHTML
                    }
                } else {
                    response.textContent = `Fichier "${file}" introuvable.`;
                }
                break;

            case normalizeCommand(input) === "home":
                response.innerHTML = initialContent;
                break;
        
            default:
                response.textContent = "Commande non reconnue. Tapez '-h' ou '--help' pour voir les commandes disponibles.";
        }
        
        // Supprimer le bloc suggestions
        const suggestionContainer = document.getElementById("suggestions");
        if (suggestionContainer) {
            suggestionContainer.remove();
        }
        suggestionIndex = 0;

        // Ajouter la réponse juste après la commande saisie
        terminalWindow.insertBefore(response, this.parentNode);

        // Effacer l'input
        this.value = "";

        // Scroll automatique vers le bas
        terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }
});

// Ajouter un écouteur d'événements pour l'input
document.getElementById("terminal-input").addEventListener("input", function(event) {
    const currentValue = this.value.trim();
    const [command, arg] = currentValue.toLowerCase().split(" ");

    // Réinitialiser les suggestions
    suggestions = [];
    suggestionIndex = 0;

    // Si on a "cd " ou "cat "
    if (currentValue.endsWith(" ")) {
        if (command === "cd") {
            suggestions = Object.keys(fileSystem[currentDirectory]).filter(item => {
                const itemData = fileSystem[currentDirectory][item];
                // Un dossier est un objet qui n'a pas de propriété content
                return (typeof itemData === 'object' && !itemData.content) || item === "..";
            });
        }
        else if (command === "cat") {
            suggestions = Object.keys(fileSystem[currentDirectory]).filter(item => {
                const fileData = fileSystem[currentDirectory][item];
                return (typeof fileData === 'string' && item.endsWith('.txt')) || 
                       (typeof fileData === 'object' && fileData.content && item.endsWith('.txt'));
            });
        }
        
        if (suggestions.length > 0) {
            displaySuggestions.call(this, suggestions);
        }
    } else {
        // Supprimer le conteneur de suggestions s'il existe
        const suggestionContainer = document.getElementById("suggestions");
        if (suggestionContainer) {
            suggestionContainer.remove();
        }
    }
});

// Ajouter cette fonction de formatage
function formatLsOutput(items, currentDir) {
    return `<div class="directory-list">
        ${items.map(item => {
            const itemData = fileSystem[currentDir][item];
            let className = '';
            
            if (typeof itemData === 'object' && !itemData.content) {
                className = 'directory';
                item = item + '/'; // Ajoute un slash pour les dossiers
            } else {
                className = 'file';
            }
            
            return `<span class="${className}">${item}</span>`;
        }).join(' ')}
    </div>`;
}
