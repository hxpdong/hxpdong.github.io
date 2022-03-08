/*const getGameInfo = () =>{
    JSON.parse(localStore.getItem('game'));
}*/

const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE:9,
    BOX_SIZE:3,
    NUMBERS:[1,2,3,4,5,6,7,8,9],
    LEVEL_NAME:[
        'Easy',
        'Medium',
        'Hard'
    ],
    LEVEL:[29,38,47]
};
//Make null board
const newBoard = (size) =>{
    let arr = new Array(size);
    for(let i=0;i<size;i++){
      arr[i] = new Array(size);
    }
    for (let i=0;i<Math.pow(size,2);i++){
        arr[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
    }
    return arr;
}
//check is valid or not
const isColSafe = (grid,col,value) =>{
    for (let row =0; row<CONSTANT.GRID_SIZE; row++){
        if(grid[row][col] === value) return false;
    }
    return true;
}
const isRowSafe = (grid,row,value) =>{
    for (let col =0; col <CONSTANT.GRID_SIZE; col++){
        if(grid[row][col] === value) return false;
    }
    return true;
}
const isBoxSafe = (grid, box_row,box_col, value) =>{
    for (let row=0;row < CONSTANT.BOX_SIZE;row++){
        for(let col =0;col <CONSTANT.BOX_SIZE;col++){
            if(grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}
const isSafe =(grid,row,col,value) =>{
    return isColSafe(grid,col,value) && isRowSafe(grid,row,value) && isBoxSafe(grid,row - row%3, col - col%3, value) && value !==CONSTANT.UNASSIGNED;
}
//find  unassigned cell
const findUnassignedPos = (grid, pos) =>{
    for (let row =0; row<CONSTANT.GRID_SIZE;row++){
        for(let col=0;col<CONSTANT.GRID_SIZE;col++){
            if(grid[row][col] ===CONSTANT.UNASSIGNED){
                pos.row=row;
                pos.col=col;
                return true;
            }
        }
    }
    return false;
}
//shuffle arr
const shuffleArray =(arr)=>{
    let curr_index = arr.length;
    while (curr_index !== 0){
        let rand_index = Math.floor(Math.random() * curr_index);
        curr_index -=1;   

        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    } 
    return arr;
}
//check puzzle is complete
const isFullBoard =(grid) =>{
    return grid.every((row,i)=>{
        return row.every((value,j)=>{
            return value !== CONSTANT.UNASSIGNED;
        })
    })
}
const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    number_list.forEach((num, i) => {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (isFullBoard(grid)) {
                return true;
            } else {
                if (sudokuCreate(grid)) {
                    return true;
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return isFullBoard(grid);
}
const sudokuCheck = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(grid, i, j, num)) {
                if (isFullBoard(grid)) {
                    return true;
                } else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }
            }
        })
    })

    return isFullBoard(grid);
}
const rand =()=>Math.floor(Math.random()*CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = [...grid];
    let attemps = level;
    while (attemps > 0) {
        let row = rand();
        let col = rand();
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attemps--;
    }
    return res;
}
// generate sudoku base on level
const sudokuGen = (level) => {
    let sudoku = newBoard(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined;
}


//screen
const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');
//
const cells = document.querySelectorAll('.main-sudoku-cell');
const number_inputs = document.querySelectorAll('.number');

const game_level = document.querySelector('#game-level');
//
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];
let pause = false;

let su = undefined;
let su_answer = undefined;
let selected_cell = -1;

const clearSudoku =()=>{
    for(let i=0;i<Math.pow(CONSTANT.GRID_SIZE,2);i++){
        cells[i].innerHTML ='';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}
//Init Sudoku board
const initSudoku = ()=>{
    //clear old sudoku
    clearSudoku();
    resetBg();
    removeErr();
    su = sudokuGen(level);
    su_answer = [...su.question];

    console.table(su_answer);

    for (let i=0;i<Math.pow(CONSTANT.GRID_SIZE,2);i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i%CONSTANT.GRID_SIZE;
        cells[i].setAttribute('data-value', su.question[row][col]);

        if(su.question[row][col] !== 0){
            cells[i].classList.add('filled');
            cells[i].innerHTML = su.question[row][col];
        }
    }
}
const hoverBg = (index) =>{
    let row=Math.floor(index/CONSTANT.GRID_SIZE);
    let col = index%CONSTANT.GRID_SIZE;

    let box_start_row = row - row%3;
    let box_start_col = col - col%3;
    
    for(let i=0;i<CONSTANT.BOX_SIZE;i++){
        for(let j=0;j<CONSTANT.BOX_SIZE;j++){
            let cell = cells[9*(box_start_row+i) + (box_start_col +j)];
            cell.classList.add('hover');
        }
    }
    let step = 9;
    while (index - step >=0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }
    
    step =1;
    while (index - step >=9*row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step =1;
    while (index + step < 9*row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
}
const resetBg =()=>{
    cells.forEach(e => e.classList.remove('hover'));
}
const checkErr = (value) =>{
    const addErr = (cell) =>{
        if(parseInt(cell.getAttribute('data-value')) === value){
            cell.classList.add('err');
            /*
            cell.classList.add('cell-err');
            setTimeout(()=>{
                cell.classList.remove('cell-err');
            }, 500);*/
        }
    }
    let index = selected_cell;

    let row=Math.floor(index/CONSTANT.GRID_SIZE);
    let col = index%CONSTANT.GRID_SIZE;

    let box_start_row = row - row%3;
    let box_start_col = col - col%3;
    
    for(let i=0;i<CONSTANT.BOX_SIZE;i++){
        for(let j=0;j<CONSTANT.BOX_SIZE;j++){
            let cell = cells[9*(box_start_row+i) + (box_start_col +j)];
            if (cell.classList.contains('selected')) addErr(cell);
        }
    }
    let step = 9;
    while (index - step >=0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }
    
    step =1;
    while (index - step >=9*row) {
        addErr(cells[index - step]);
        step += 1;
    }

    step =1;
    while (index + step < 9*row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
}

const removeErr =()=> cells.forEach(e => e.classList.remove('err'));

const isGameWin = ()=> sudokuCheck(su_answer);
const showResult =() => {
    //show result screen
    result_screen.classList.add('active');
}
const initNumberInputEvent = () =>{
    number_inputs.forEach((e,index)=>{
        e.addEventListener('click', ()=>{
            if(!cells[selected_cell].classList.contains('filled')){
                cells[selected_cell].innerHTML = index +1;
                cells[selected_cell].setAttribute('data-value', index+1);
                //add to answer
                let row = Math.floor(selected_cell  / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index +1;
                //save game
                //
                removeErr();
                checkErr(index+1);
                

                //check game win
                if (isGameWin()){
                    showResult();
                }
            }
        })
    })
}

const initCellsEvent = () =>{
    cells.forEach((e,index) => {
        e.addEventListener('click',()=>{
            if(!e.classList.contains('filled')){
                cells.forEach(e=>e.classList.remove('selected'));

                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBg();
                hoverBg(index);
            }
        })
    })
}

//Change screen when press play game
const startGame =()=>{
    start_screen.classList.remove('active');
    game_screen.classList.add('active');
    
    game_level.innerHTML=CONSTANT.LEVEL_NAME[level_index];

}
//return to start screen
const returnStartScreen =()=>{
    pause = false;
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    pause_screen.classList.remove('active');
    result_screen.classList.remove('active');
}
//Add button event choose level
document.querySelector('#btn-choose-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});
//Add button event play game
document.querySelector('#btn-play').addEventListener('click',()=>{
    initSudoku();
    startGame();
});
//Add button event Pause game
document.querySelector('#btn-pause-game').addEventListener('click', () =>{
    pause_screen.classList.add('active');
    pause = true;
});
//button event resume recent game
document.querySelector('#btn-resume').addEventListener('click',() =>{
    pause_screen.classList.remove('active');
    pause = false;
});
//button event new game
document.querySelector('#btn-new-game').addEventListener('click', ()=>{
    returnStartScreen();
});
document.querySelector('#btn-new-game-2').addEventListener('click', ()=>{
    returnStartScreen();
});
const getGameInfo = ()=>JSON.parse(localStorage.getItem('game'));
//Make space for board
const initGameBoard = () =>{
    let index =0;
    for (let i=0;i<Math.pow(CONSTANT.GRID_SIZE,2);i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i%CONSTANT.GRID_SIZE;
        if (row ===2 || row === 5) cells[index].style.marginBottom='10px';
        if (col ===2 || col===5) cells[index].style.marginRight ='10px';
        index++;
    }
}

document.querySelector('#btn-delete').addEventListener('click',()=>{
    cells[selected_cell].innerHTML ="";
    cells[selected_cell].setAttribute('data-value', 0);

    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;

    su_answer[row][col] = 0;
    removeErr();
})

const init = ()=>{
    const game = getGameInfo();

    initGameBoard();
    initCellsEvent();
    initNumberInputEvent();
}

init();