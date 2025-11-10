document.addEventListener('DOMContentLoaded', function() {
    const lengthSlider = document.querySelector('#length');
    const lengthValue = document.querySelector('#length-value');
    const uppercaseCheckbox = document.querySelector('#uppercase');
    const lowercaseCheckbox = document.querySelector('#lowercase');
    const numbersCheckbox = document.querySelector('#numbers');
    const symbolsCheckbox = document.querySelector('#symbols');
    const generateBtn = document.querySelector('#generate-btn');
    const passwordDisplay = document.querySelector('#password');
    const copyBtn = document.querySelector('#copy-btn');

    // Mettre à jour l'affichage de la longueur
    lengthSlider.addEventListener('input', function () {
        lengthValue.textContent = lengthSlider.value;
    });

    // Fonction pour générer un mot de passe
    function generatePassword() {
        const length = lengthSlider.value;
        const useUppercase = uppercaseCheckbox.checked;
        const useLowercase = lowercaseCheckbox.checked;
        const useNumbers = numbersCheckbox.checked;
        const useSymbols = symbolsCheckbox.checked;

        // Vérifier qu'au moins une option est sélectionnée
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            passwordDisplay.textContent = "Sélectionnez au moins une option";
            return;
        }

        // Définir les caractères possibles
        let chars = '';
        if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) chars += '0123456789';
        if (useSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        // Générer le mot de passe
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        passwordDisplay.textContent = password;
    }

    // Générer un mot de passe au chargement de la page
    generatePassword();

    // Générer un mot de passe quand le bouton est cliqué
    generateBtn.addEventListener('click', generatePassword);

    // Fonction pour copier le mot de passe
    copyBtn.addEventListener('click', function () {
        const password = passwordDisplay.textContent;

        if (password === "Cliquez générer" || password === "Sélectionnez au moins une option") {
            return;
        }

        navigator.clipboard.writeText(password).then(function () {
            // Animation de copie réussie
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                    `;

            setTimeout(function () {
                copyBtn.innerHTML = originalText;
            }, 1500);
        });
    });
});
