let gridSize;
let selectedWords = [];
let bingoGrid = [];

// Funkce pro generování tabulky podle vybraného rozměru
function generateTable() {
    gridSize = parseInt(document.getElementById("gridSize").value);
    const bingoTable = document.getElementById("bingoTable");
    bingoTable.innerHTML = ''; // Vymaže předchozí tabulku

    // Dynamické generování řádků a sloupců
    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.id = `word${i * gridSize + j + 1}`;
            input.placeholder = `word${i * gridSize + j + 1}`; // Nastavení výchozího textu
            cell.appendChild(input);
            row.appendChild(cell);
        }
        bingoTable.appendChild(row);
    }
}

// Funkce pro generování Bingo karty
function generateBingoCard() {
    selectedWords = [];
    for (let i = 1; i <= gridSize * gridSize; i++) {
        let word = document.getElementById(`word${i}`).value.trim();
        if (word) {
            selectedWords.push(word);
        }
    }

    if (selectedWords.length < gridSize * gridSize) {
        alert(`Prosím vyplňte všechna pole (${gridSize * gridSize} slov).`);
        return;
    }

    // Náhodně vyber slova pro bingo
    selectedWords = selectedWords.sort(() => Math.random() - 0.5);

    const bingoGridDiv = document.getElementById("bingoCard");
    bingoGridDiv.innerHTML = "";
    bingoGridDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // Dynamicky mění počet sloupců

    bingoGrid = [];
    selectedWords.forEach((word, index) => {
        const cell = document.createElement("div");
        cell.textContent = word;
        cell.id = `bingoCell${index}`;
        cell.onclick = function() {
            cell.classList.toggle("clicked");
            checkBingo();
        };
        bingoGrid.push(cell);
        bingoGridDiv.appendChild(cell);
    });

    // Skryj tabulku pro editaci a zobraz Bingo kartu
    hideEditTable();
}

// Funkce pro skrytí tabulky pro editaci
function hideEditTable() {
    document.getElementById("editTableContainer").classList.add("hidden");
    document.getElementById("generateBtn").classList.add("hidden");
    document.getElementById("editBtn").classList.remove("hidden");
    document.getElementById("bingoCard").classList.remove("hidden");
    document.getElementById("bingoMessage").classList.add("hidden"); // Skryje BINGO zprávu
}

// Funkce pro obnovení tabulky pro editaci
function enableEditing() {
    const inputs = document.querySelectorAll("#bingoTable input");
    inputs.forEach(input => {
        input.disabled = false;
    });
    document.getElementById("generateBtn").classList.remove("hidden");
    document.getElementById("editBtn").classList.add("hidden");
    document.getElementById("editTableContainer").classList.remove("hidden");
    document.getElementById("bingoCard").classList.add("hidden");
    document.getElementById("bingoMessage").classList.add("hidden"); // Skryje BINGO zprávu
}

// Funkce pro kontrolu BINGO
function checkBingo() {
    let bingo = false;

    // Kontrola horizontálních řad
    for (let row = 0; row < gridSize; row++) {
        bingo = true;
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            if (!bingoGrid[index].classList.contains("clicked")) {
                bingo = false;
                break;
            }
        }
        if (bingo) break;
    }

    // Kontrola vertikálních sloupců
    if (!bingo) {
        for (let col = 0; col < gridSize; col++) {
            bingo = true;
            for (let row = 0; row < gridSize; row++) {
                const index = row * gridSize + col;
                if (!bingoGrid[index].classList.contains("clicked")) {
                    bingo = false;
                    break;
                }
            }
            if (bingo) break;
        }
    }

    // Kontrola diagonál
    if (!bingo) {
        bingo = true;
        for (let i = 0; i < gridSize; i++) {
            const index = i * gridSize + i;
            if (!bingoGrid[index].classList.contains("clicked")) {
                bingo = false;
                break;
            }
        }
    }

    if (!bingo) {
        bingo = true;
        for (let i = 0; i < gridSize; i++) {
            const index = i * gridSize + (gridSize - i - 1);
            if (!bingoGrid[index].classList.contains("clicked")) {
                bingo = false;
                break;
            }
        }
    }

    // Zobrazí nebo skryje zprávu podle výsledku kontroly
    const bingoMessage = document.getElementById("bingoMessage");
    if (bingo) {
        bingoMessage.classList.remove("hidden");
    } else {
        bingoMessage.classList.add("hidden");
    }
}

// Inicializace tabulky a při změně velikosti mřížky
document.getElementById("gridSize").addEventListener("change", generateTable);
window.onload = generateTable; // Zavolá generování tabulky při načtení stránky
