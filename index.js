let results = {
    '✕': 0,
    '◯': 0,
    'Ties': 0
};

var lastMoveIsCircle = true;
var winnerFound = "";
var gameWrapper = document.querySelector('.game-wrapper');
var cellGroup = document.querySelector(".level-grid");
cellGroup.addEventListener("click", async function (e) {
    if (!e.target || e.target.matches(".cell") == false)
        return;

    var cell = e.target;
    if (winnerFound != "") {
        resetGame(cell.parentElement);
        if (lastMoveIsCircle == false && cellGroup.dataset.gametype == "solo") {
            playAI(cell.parentElement, "&#x25EF;");
            lastMoveIsCircle = !lastMoveIsCircle;
        }


        return;
    }

    if (cell.innerHTML != "")
        return;
    if (cellGroup.dataset.gametype == "duo") {
        if (lastMoveIsCircle)
            cell.innerHTML = "&#10005;";
        else
            cell.innerHTML = "&#x25EF;";
        lastMoveIsCircle = !lastMoveIsCircle;
    } else {
        cell.innerHTML = "&#10005;";
    }


    if (checkWin(cell.parentElement))
        return;

    if (cellGroup.dataset.gametype == "solo") {
        await new Promise(r => setTimeout(r, 300));
        playAI(cell.parentElement, "&#x25EF;");
        checkWin(cell.parentElement);
    }
});

function getEmptySpaces(grid) {
    items = [...grid.children];
    emptyIndexes = [];
    items.forEach(function (currentValue, index) {
        if (currentValue.innerHTML == '') {
            emptyIndexes.push(index);
        }
    });
    return emptyIndexes;
}
function playAI(grid, AIPlayer) {

    emptyIndexes = getEmptySpaces(grid);
    if (emptyIndexes.length == 1) {
        items[emptyIndexes[0]].innerHTML = AIPlayer;
    } else {
        var choice = Math.floor(Math.random() * emptyIndexes.length);
        items[emptyIndexes[choice]].innerHTML = AIPlayer;
    }
}

var gameplayButtonGroup = document.querySelector(".gameplay-selector");
gameplayButtonGroup.addEventListener("click", function (e) {
    if (!e.target || e.target.matches(".gameplay-select") == false)
        return;

    var gameplayButton = e.target;
    var type = gameplayButton.dataset.selectortype;
    cellGroup.dataset.gametype = type;

    gameplayButtonGroup.classList.add('hide');
    gameWrapper.classList.remove('hide');
});

class Match {
    constructor(index1, index2, index3) {
        this.items = [index1, index2, index3];
    }

    isMatch(grid) {
        if (grid[this.items[0]].innerHTML == '')
            return false;

        return grid[this.items[0]].innerHTML == grid[this.items[1]].innerHTML && grid[this.items[0]].innerHTML == grid[this.items[2]].innerHTML;
    }

    getWinner(grid) {
        return grid[this.items[0]].innerHTML;
    }
}

function checkWin(grid) {
    if (grid.matches(".level-grid") == false)
        return;

    cells = [...grid.children];
    possibleMatches = [
        new Match(0, 1, 2),
        new Match(3, 4, 5),
        new Match(6, 7, 8),
        new Match(0, 3, 6),
        new Match(1, 4, 7),
        new Match(2, 5, 8),
        new Match(0, 4, 8),
        new Match(2, 4, 6)
    ];

    winnerFound = "";
    possibleMatches.forEach(function (currentValue, index) {
        if (currentValue.isMatch(cells)) {
            winnerFound = currentValue.getWinner(cells);
            document.querySelector(".level-result").innerHTML = winnerFound + " Won!";
            results[winnerFound] += 1;
            updateScoreboard();
            return;
        }
    });


    if (getEmptySpaces(grid).length == 0 && winnerFound == "") {
        winnerFound = 'Ties';
        document.querySelector('.level-result').innerHTML = "It's a tie!";
        results[winnerFound] += 1;
        updateScoreboard();
    }




    return winnerFound != "";

}

function resetGame(grid) {
    cells = [...grid.children];
    cells.forEach(function (currentValue) {
        currentValue.innerHTML = "";
    })

    document.querySelector(".level-result").innerHTML = "";

    winnerFound = "";
}

function updateScoreboard() {
    var xValueLabel = document.querySelector("[data-scoreboard-label='X'");
    var oValueLabel = document.querySelector("[data-scoreboard-label='O'");
    var tValueLabel = document.querySelector("[data-scoreboard-label='Ties'");

    xValueLabel.innerHTML = results['✕'];
    oValueLabel.innerHTML = results['◯'];
    tValueLabel.innerHTML = results['Ties'];

}