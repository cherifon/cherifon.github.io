let isFirstCommand = true; // Pour savoir si c'est la première commande

document.getElementById("terminal-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const input = this.value.trim().toLowerCase();
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
        commandOutput.innerHTML = `<span class="prompt">root@kali:~$</span> ${input}`;

        // Ajouter la commande avant la ligne d'entrée
        terminalWindow.insertBefore(commandOutput, this.parentNode);

        // Simuler une réponse aux commandes
        const response = document.createElement("div");
        response.className = "response";

        switch (input) {
            case "-h":
            case "--help":
                response.innerHTML = `
                    Commandes disponibles :
                    <ul>
                        <li>whoami : Affiche ma présentation</li>
                        <li>ls projets : Liste mes projets</li>
                        <li>cat contact.txt : Affiche mes infos de contact</li>
                    </ul>
                `;
                break;

            case "whoami":
                response.textContent = "Bonjour, je suis [Ton Nom], passionné de cybersécurité et pentest.";
                break;

            case "ls projets":
                response.innerHTML = `
                    <ul>
                        <li>Pentest Python : Détection de vulnérabilités réseau</li>
                        <li>Honeypot local : Surveillance des intrusions</li>
                        <li>CTF Hack The Box : Résolution de challenges SOC</li>
                    </ul>
                `;
                break;

            case "cat contact.txt":
                response.innerHTML = `Email : <a href="mailto:tonemail@example.com">tonemail@example.com</a>`;
                break;

            default:
                response.textContent = "Commande non reconnue. Tapez '-h' ou '--help' pour voir les commandes disponibles.";
        }

        // Ajouter la réponse juste après la commande saisie
        terminalWindow.insertBefore(response, this.parentNode);

        // Effacer l'input
        this.value = "";

        // Scroll automatique vers le bas
        terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }
});
