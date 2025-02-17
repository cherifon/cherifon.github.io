let currentDirectory = "root"; // Répertoire actuel, initialement à la racine

// Ajouter au début du fichier
let commandHistory = [];
let historyIndex = -1;

// Ajouter cette fonction helper au début du fichier
function normalizeCommand(input) {
    return input.toLowerCase().trim();
}

// Structure des dossiers et fichiers
const fileSystem = {
    root: {
        "projets": {
            "Cybersecurity-Tools.txt": {
                content: `
                    <div class="project-card">
                        <h2>Outils de Cybersécurité</h2>
                        <img src="assets/projects/cyber-tools.png" alt="Outils Cybersécurité">
                        <div class="tags">
                            <span class="tag">Python</span>
                            <span class="tag">Pentest</span>
                            <span class="tag">Sécurité</span>
                        </div>
                        <p>Suite d'outils développés pour les tests de pénétration:</p>
                        <ul>
                            <li>Scanner de vulnérabilités</li>
                            <li>Analyseur de trafic réseau</li>
                            <li>Détecteur d'injections SQL</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/username/cyber-tools" target="_blank">GitHub</a>
                            <a href="https://demo-link.com" target="_blank">Démo</a>
                        </div>
                    </div>
                `
            },
            "HackTheBox-Writeups.txt" : "Une collection de write-ups détaillant la résolution des challenges et des machines virtuelles de Hack The Box.",
            "Java-Web-Crawler.txt" : "Un crawler web développé en Java qui explore des pages web et extrait des données structurées.",
            "Gestionnaire-de-Tournoi.txt" : "Un gestionnaire de tournoi développé en Java intégrant une base de données en SQL pour suivre les scores et les classements.",
            "CO2-Forecasting.txt" : "Un projet de prédiction de la concentration de CO2 dans l'air en utilisant des méthodes de machine learning et des données collectées sur une période de plusieurs semaines."
        },
        "certifications": {
            "Cisco_Introduction_to_Cybersecurity.txt": "Cette certification m’a permis d’acquérir une compréhension approfondie des principes fondamentaux de la cybersécurité, essentiels pour protége les systèmes informatiques contre les cybermenaces. Le programme couvrait des sujets tels que les différentes catégories de cyberattaques (phishing, ransomware, attaques DDoS, injections SQL, etc.), l’identification des vulnérabilités dans les systèmes, ainsi que les techniques de protection comme l’utilisation des pare-feu et  des logiciels antivirus.",
            "Cisco_Networking_Basics.txt": "Avec cette certification, j’ai développé une maîtrise des principesfondamentaux des réseaux informatiques, couvrant la conception,l’administration, et la sécurisation des infrastructures réseau. J’ai appris àutiliser le modèle OSI pour comprendre les interactions entre les couchesréseau, ainsi qu’à configurer des réseaux locaux (LAN) et des réseauxétendus (WAN). Le programme incluait des protocoles clés commeTCP/IP, DHCP, et DNS, ainsi que des technologies de routage et decommutation. J’ai également acquis des compétences pratiques enadressage IP"
        },
        "experiences": {
            "Stage-SOC.txt": "Stage au sein d'un Security Operations Center - Détection et réponse aux incidents de sécurité",
            "Pentester.txt": "Tests d'intrusion et audits de sécurité pour diverses entreprises",
            "Dev-Securite.txt": "Développement d'outils de sécurité et automatisation des tests"
        },
        "contact.txt": "Mes informations de contact"
    },
    // Garder les sous-répertoires accessibles directement
    projets: {
        "Cybersecurity-Tools.txt": {
            content: `
                <div class="project-card">
                    <h2>Outils de Cybersécurité</h2>
                    <img src="assets/projects/cyber-tools.png" alt="Outils Cybersécurité">
                    <div class="tags">
                        <span class="tag">Python</span>
                        <span class="tag">Pentest</span>
                        <span class="tag">Sécurité</span>
                    </div>
                    <p>Suite d'outils développés pour les tests de pénétration:</p>
                    <ul>
                        <li>Scanner de vulnérabilités</li>
                        <li>Analyseur de trafic réseau</li>
                        <li>Détecteur d'injections SQL</li>
                    </ul>
                    <div class="project-links">
                        <a href="https://github.com/username/cyber-tools" target="_blank">GitHub</a>
                        <a href="https://demo-link.com" target="_blank">Démo</a>
                    </div>
                </div>
            `
        },
        "HackTheBox-Writeups.txt" : "Une collection de write-ups détaillant la résolution des challenges et des machines virtuelles de Hack The Box.",
        "Java-Web-Crawler.txt" : "Un crawler web développé en Java qui explore des pages web et extrait des données structurées.",
        "Gestionnaire-de-Tournoi.txt" : "Un gestionnaire de tournoi développé en Java intégrant une base de données en SQL pour suivre les scores et les classements.",
        "CO2-Forecasting.txt" : "Un projet de prédiction de la concentration de CO2 dans l'air en utilisant des méthodes de machine learning et des données collectées sur une période de plusieurs semaines."
    },
    certifications: {
        "Cisco_Introduction_to_Cybersecurity.txt": "Cette certification m’a permis d’acquérir une compréhension approfondie des principes fondamentaux de la cybersécurité, essentiels pour protége les systèmes informatiques contre les cybermenaces. Le programme couvrait des sujets tels que les différentes catégories de cyberattaques (phishing, ransomware, attaques DDoS, injections SQL, etc.), l’identification des vulnérabilités dans les systèmes, ainsi que les techniques de protection comme l’utilisation des pare-feu et  des logiciels antivirus.",
        "Cisco_Networking_Basics.txt": "Avec cette certification, j’ai développé une maîtrise des principesfondamentaux des réseaux informatiques, couvrant la conception,l’administration, et la sécurisation des infrastructures réseau. J’ai appris àutiliser le modèle OSI pour comprendre les interactions entre les couchesréseau, ainsi qu’à configurer des réseaux locaux (LAN) et des réseauxétendus (WAN). Le programme incluait des protocoles clés commeTCP/IP, DHCP, et DNS, ainsi que des technologies de routage et decommutation. J’ai également acquis des compétences pratiques enadressage IP"
    },
    experiences: {
        "Stage-SOC.txt": "Stage au sein d'un Security Operations Center - Détection et réponse aux incidents de sécurité",
        "Pentester.txt": "Tests d'intrusion et audits de sécurité pour diverses entreprises",
        "Dev-Securite.txt": "Développement d'outils de sécurité et automatisation des tests"
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
                    const baseCommands = ["-h", "--help", "whoami", "ls", "cd", "cat"];
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
    // Ajouter whoami si on est dans le répertoire root
    const displayItems = [...items];
    if (currentDir === 'root') {
        displayItems.push('whoami');
    }

    return `<div class="directory-list">
        ${displayItems.map(item => {
            const itemData = fileSystem[currentDir][item];
            let className = '';
            
            if (item === 'whoami') {
                className = 'command';
            } else if (typeof itemData === 'object' && !itemData.content) {
                className = 'directory';
                item = item + '/'; // Ajoute un slash pour les dossiers
            } else if (item === 'contact.txt') {
                className = 'file';
            } else if (typeof itemData === 'string' || (typeof itemData === 'object' && itemData.content)) {
                className = 'file';
            }
            
            return `<span class="${className}">${item}</span>`;
        }).join(' ')}
    </div>`;
}
