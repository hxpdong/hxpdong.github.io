const CONSTANT = {
    NUMBERS:[1,2,3,4,5,6,7,8,9],
    LEVEL_NAME:[
        'Easy',
        'Medium',
        'Hard'
    ],
    LEVEL:[29,38,47]
};
//Make null board
const newBoard = () =>{
    let board = new Array(9);
    for(let i=0;i<9;i++){
      board[i] = new Array(9);
    }
    for (let i=0;i<9;i++){
        for (let j=0;j<9;j++){
            board[i][j] = 0;
        }
    }
    return board;
}
//check is valid or not
const isColSafe = (board,col,value) =>{
    for (let row =0; row<9; row++){
        if(board[row][col] === value) return false;
    }
    return true;
}
const isRowSafe = (board,row,value) =>{
    for (let col =0; col <9; col++){
        if(board[row][col] === value) return false;
    }
    return true;
}
const isBoxSafe = (board, box_row,box_col, value) =>{
    for (let row=0;row < 3;row++){
        for(let col =0;col < 3;col++){
            if(board[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}
const isSafe =(board,row,col,value) =>{
    return isColSafe(board,col,value) && isRowSafe(board,row,value) && isBoxSafe(board,row - row%3, col - col%3, value) && value !==0;
}
//find  unassigned cell
const findNull = (board, pos) =>{
    for (let row =0; row<9;row++){
        for(let col=0;col<9;col++){
            if(board[row][col] === 0){
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

const isFullBoard =(board) =>{
    
    for (let i=0;i<9;i++){
        for (let j=0;j<9;j++){
            if (board[i][j] === 0){
                return false;
                
            }
        }
    }
    return true;
}

const sudokuCreateBoard = (board)=>{
    let null_pos = {
        row: -1,
        col: -1
    }
    if (!findNull(board, null_pos)) return true;
    let number_list = shuffleArray([...CONSTANT.NUMBERS]);
    let row = null_pos.row;
    let col = null_pos.col;

    number_list.forEach((num, i) => {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;

            if (isFullBoard(board)) {
                return true;
            } else {
                if (sudokuCreateBoard(board)) {
                    return true;
                } else board[row][col] = 0;
            }

            
        }
    });
    return isFullBoard(board);
}

const sudokuCheck = (quest) => {
    let null_pos = {
        row: -1,
        col: -1
    }
    if (!findNull(quest, null_pos)) return true;
    
    quest.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(quest, i, j, num)) {
                if (isFullBoard(quest)) {
                    return true;
                } else {
                    if (sudokuCreateBoard(quest)) {
                        return true;
                    }
                }
            }
        })
    })

    return isFullBoard(quest);
}


const rand =()=>Math.floor(Math.random()*9);

const sudokuCreateQuest = (board,level,quest) =>{
    for (let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            quest[i][j] = board[i][j];
        }
    }
    let cnt = 0;
    while (cnt !== level){
        let pi = rand();
        let pj = rand();
        if(quest[pi][pj]!==0){
            quest[pi][pj] = 0;
            cnt++;
        }
    }
}

//screen
const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');

//
const cells = document.querySelectorAll('.sudoku-cell');
const number_inputs = document.querySelectorAll('.number');

const game_level = document.querySelector('#game-level');
//
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];
let pause = false;

let su_quest = undefined;
let su_answer = undefined;
let selected_cell = -1;


const resetSudoku =()=>{
    for(let i=0;i<81 ;i++){
        cells[i].innerHTML ='';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}
//Init board into screen
const initSudoku = ()=>{
    //clear old sudoku
    resetSudoku();
    resetErrorValue();
    resetHoverBg();
    resetError();
    let board = newBoard();
    let quest = newBoard();
    sudokuCreateBoard(board);
    sudokuCreateQuest(board,level,quest);
    su_quest = quest;
    su_answer = board;

    console.table(su_quest);
    console.table(su_answer);

    for (let i=0;i<81;i++){
        let row = Math.floor(i/9);
        let col = i%9;
        cells[i].setAttribute('data-value',su_quest[row][col]);
        if (su_quest[row][col] !== 0){
            cells[i].classList.add('filled');
            cells[i].innerHTML = su_quest[row][col];
        }
    }
}

const cellHoverBg = (index) =>{
    let row=Math.floor(index/9);
    let col = index%9;

    let box_start_row = row - row%3;
    let box_start_col = col - col%3;
    //hover 3x3 cells
    console.log("index box: ");
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let cell = cells[9*(box_start_row+i) + (box_start_col +j)];
            cell.classList.add('hover');
            console.log(9*(box_start_row+i) + (box_start_col +j));
        }
    }
    //hover above cells (column)
    let step = 9;
    console.log("index above index: ");
    while (index - step >=0) {
        cells[index - step].classList.add('hover');
        console.log(index - step);
        step += 9;
    }
    //hover below cells (column)
    step = 9;
    console.log("index below index: ");
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        console.log(index + step);
        step += 9;
    }
    //hover left cells (row)
    step =1;
    console.log("index left index: ");
    while (index - step >=9*row) {
        cells[index - step].classList.add('hover');
        console.log(index - step);
        step += 1;
    }
    //hover right cells (row)
    step =1;
    console.log("index right index: ");
    while (index + step < 9*row + 9) {
        cells[index + step].classList.add('hover');
        console.log(index + step);
        step += 1;
    }
}

const resetHoverBg =()=>{
    cells.forEach(e => e.classList.remove('hover'));
}

const initCellsEvent = () =>{
    cells.forEach((e,index) => {
        e.addEventListener('click',()=>{
            console.log("selected index:");
            console.log(index);
            if(!e.classList.contains('filled')){
                cells.forEach(e=>e.classList.remove('selected'));
                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetHoverBg();
                cellHoverBg(index);
            }
        })
    })
}
const cellCheckError = (value) =>{
    const addErrValue = (cell) =>{
        cell.classList.add('errValue');
    }
    const addError = (cell) =>{
        if(parseInt(cell.getAttribute('data-value')) === value){
            cell.classList.add('err');
            addErrValue(cells[selected_cell]);
        }
    }
    let index = selected_cell;
    let row=Math.floor(index/9);
    let col=index%9;
    let box_start_row = row - row%3;
    let box_start_col = col - col%3;

   
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let cell = cells[9*(box_start_row+i) + (box_start_col +j)];
            if(!cell.classList.contains('selected'))
                addError(cell);
           
        }
    }
    //check above cells
    let step = 9;
    while (index - step >=0) {
        addError(cells[index - step]);
        step += 9;
    }
   //check below cells
    step = 9;
    while (index + step < 81) {
        addError(cells[index + step]);
        step += 9;
    }
    //check left cells
    step =1;
    while (index - step >=9*row) {
        addError(cells[index - step]);
        step += 1;
    }
    //check right cells
    step =1;
    while (index + step < 9*row + 9) {
        addError(cells[index + step]);
        step += 1;
    }
}
const resetError = () => {
    cells.forEach(e => e.classList.remove('err'));
}
const resetErrorValue = () =>{
    cells.forEach(e => e.classList.remove('errValue'));
}
const clearErrorValue = (cell) =>{
    cell.classList.remove('errValue');
}
const isGameWin = ()=> sudokuCheck(su_quest);

const initNumberInputEvent = () =>{
    number_inputs.forEach((e,num)=>{
        e.addEventListener('click',()=>{
            if(cells[selected_cell].classList.contains('errValue')){
                clearErrorValue(cells[selected_cell]);
            }
            if(!cells[selected_cell].classList.contains('filled')){
                cells[selected_cell].innerHTML = num + 1;
                cells[selected_cell].setAttribute('data-value',num+1);
                let row = Math.floor(selected_cell/9);
                let col = selected_cell%9;
                su_quest[row][col] = num +1;
                resetError();
                cellCheckError(num+1);
            }
        })
    })
}
//button delete value
document.querySelector('#btn-delete').addEventListener('click',()=>{
    cells[selected_cell].innerHTML ="";
    cells[selected_cell].setAttribute('data-value',0);
    let row = Math.floor(selected_cell/9);
    let col = selected_cell%9;
    su_quest[row][col] = 0;
    cellClearError();
})
//button choose level
document.querySelector('#btn-choose-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});

//Change screen when press play game
const startGame =()=>{
    start_screen.classList.remove('active');
    game_screen.classList.add('active');
    game_level.innerHTML=CONSTANT.LEVEL_NAME[level_index];
}
//button start game
document.querySelector('#btn-start-game').addEventListener('click',()=>{
    initSudoku();
    startGame();
});
//button submit
document.querySelector('#btn-submit').addEventListener('click', ()=>{
    if(isGameWin()){
        alert("You win!");
    }
    else
        alert("The quest is not solved!");
})
const returnStartScreen =()=>{
    //pause = false;
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    /*pause_screen.classList.remove('active');
    result_screen.classList.remove('active');*/
}
//button new game
document.querySelector("#btn-new-game").addEventListener('click', ()=>{
    returnStartScreen();
})
const initGameBoard = () =>{
    let index =0;
    for (let i=0;i<9;i++){
        for (let j=0;j<9;j++){
            if (i ===2 || i === 5) cells[index].style.marginBottom='5px';
            if (j ===2 || j===5) cells[index].style.marginRight ='5px';
            index++;
        }
    }
}

const init = () =>{
    
    initGameBoard();
    initCellsEvent();
    initNumberInputEvent();
}
init();