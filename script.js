let gridSize;
        let selectedWords = [];
        let bingoGrid = [];

        function generateTable() {
            gridSize = parseInt(document.getElementById("gridSize").value);
            const bingoTable = document.getElementById("bingoTable");
            bingoTable.innerHTML = ''; 

            for (let i = 0; i < gridSize; i++) {
                const row = document.createElement("tr");
                for (let j = 0; j < gridSize; j++) {
                    const cell = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.id = `word${i * gridSize + j + 1}`;
                    input.placeholder = `word${i * gridSize + j + 1}`;
                    cell.appendChild(input);
                    row.appendChild(cell);
                }
                bingoTable.appendChild(row);
            }
        }

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

            selectedWords = selectedWords.sort(() => Math.random() - 0.5);

            const bingoGridDiv = document.getElementById("bingoCard");
            bingoGridDiv.innerHTML = "";
            bingoGridDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

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

            hideEditTable();
        }

        function hideEditTable() {
            document.getElementById("editTableContainer").classList.add("hidden");
            document.getElementById("generateBtn").classList.add("hidden");
            document.getElementById("editBtn").classList.remove("hidden");
            document.getElementById("bingoCard").classList.remove("hidden");
            document.getElementById("bingoMessage").classList.add("hidden");
        }

        function enableEditing() {
            const inputs = document.querySelectorAll("#bingoTable input");
            inputs.forEach(input => {
                input.disabled = false;
            });
            document.getElementById("generateBtn").classList.remove("hidden");
            document.getElementById("editBtn").classList.add("hidden");
            document.getElementById("editTableContainer").classList.remove("hidden");
            document.getElementById("bingoCard").classList.add("hidden");
            document.getElementById("bingoMessage").classList.add("hidden");
        }

        function checkBingo() {
            let bingo = false;

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

            const bingoMessage = document.getElementById("bingoMessage");
            if (bingo) {
                bingoMessage.classList.remove("hidden");
            } else {
                bingoMessage.classList.add("hidden");
            }
        }

        function saveState() {
            const state = {
                gridSize,
                selectedWords,
                bingoGrid: bingoGrid.map(cell => ({
                    text: cell.textContent,
                    clicked: cell.classList.contains("clicked")
                }))
            };
            localStorage.setItem("bingoState", JSON.stringify(state));
        }

        function loadState() {
            const savedState = localStorage.getItem("bingoState");
            if (savedState) {
                const state = JSON.parse(savedState);
                gridSize = state.gridSize;
                document.getElementById("gridSize").value = gridSize;
                generateTable();
                selectedWords = state.selectedWords || [];
                selectedWords.forEach((word, index) => {
                    const input = document.getElementById(`word${index + 1}`);
                    if (input) input.value = word;
                });
                if (state.bingoGrid && state.bingoGrid.length) {
                    generateBingoCard();
                    state.bingoGrid.forEach((cellState, index) => {
                        const cell = bingoGrid[index];
                        if (cell) {
                            cell.textContent = cellState.text;
                            if (cellState.clicked) {
                                cell.classList.add("clicked");
                            }
                        }
                    });
                }
            }
        }

        window.addEventListener("beforeunload", saveState);
        window.onload = () => {
            loadState();
            generateTable();
        };
