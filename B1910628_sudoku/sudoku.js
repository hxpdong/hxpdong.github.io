const CONSTANT = {
    NUMBERS:[1,2,3,4,5,6,7,8,9],
    LEVEL_NAME:[
        'Easy',
        'Medium',
        'Hard'
    ],
    LEVEL:[25,35,45]
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
                } /*else {
                    if (sudokuCreateBoard(quest)) {
                        return true;
                    }
                }*/
            }
        })
    })

    return isFullBoard(quest);
}

const solveSudoku = (board) =>{
    let null_pos = {
        row: -1,
        col: -1
    }
    if (!findNull(board, null_pos)) return true;
    let number_list = [...CONSTANT.NUMBERS];
    let row = null_pos.row;
    let col = null_pos.col;

    number_list.forEach((num, i) => {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;

            if (isFullBoard(board)) {
                return true;
            } else {
                if (solveSudoku(board)) {
                    return true;
                } else board[row][col] = 0;
            }

            
        }
    });
    return isFullBoard(board);
}


/////////////////////////////////////////////////////////////////////////////
/*
.innerHTML =""; //set number showed on the screen
.setAttribute('data-value',0);  //set attribute value of cells
su_[row][col] = 0; //set value in array of board
*/
////////////////////// Start screen //////////////////////
const start_screen = document.querySelector('#start-screen');
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

//button choose level
document.querySelector('#btn-choose-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});

//button start game
const startGame =()=>{
    start_screen.classList.remove('active');
    game_screen.classList.add('active');
    game_level.innerHTML=CONSTANT.LEVEL_NAME[level_index];
}
document.querySelector('#btn-start-game').addEventListener('click',()=>{
    initSudoku();
    startGame();
});
//button solve sudoku
const solveScreen = () =>{
    start_screen.classList.remove('active');
    solve_screen.classList.add('active');
}
document.querySelector('#btn-solve-sudoku').addEventListener('click',()=>{
    solveScreen();
    let board = newBoard();
    su_solve = board;
    for (let i=0;i<81;i++){
        let row = Math.floor(i/9);
        let col = i%9;
        cellsSolve[i].setAttribute('data-value',su_solve[row][col]);
        cellsSolve[i].classList.remove('filled');
        cellsSolve[i].classList.remove('selected');
        cellsSolve[i].innerHTML="";
    }
    resetErrorSolve();
})



////////////////////// Game screen //////////////////////
const game_screen = document.querySelector('#game-screen');
const game_level = document.querySelector('#game-level');
const cells = document.querySelectorAll('.sudoku-cell');
const number_inputs = document.querySelectorAll('.number');
let su_quest = undefined;
let su_answer = undefined;
let selected_cell = -1;

const result_screen = document.querySelector('#result-screen');
//init box
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

const resetSudoku =()=>{
    for(let i=0;i<81 ;i++){
        cells[i].innerHTML ='';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const resetHoverBg =()=>{
    cells.forEach(e => e.classList.remove('hover'));
}

const resetError = () => {
    cells.forEach(e => e.classList.remove('err'));
}

const resetErrorValue = () =>{
    cells.forEach(e => e.classList.remove('errValue'));
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
/*
    console.table(su_quest);
    console.table(su_answer);
*/
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

//button submit
const isGameWin = ()=> sudokuCheck(su_quest);
document.querySelector('#btn-submit').addEventListener('click', ()=>{
    document.getElementById("txt-notification").classList.remove('Solved');
    document.getElementById("txt-notification").classList.remove('notSolved');
    if(isGameWin()){
        //alert("You win!");
        result_screen.classList.add('active');
        document.getElementById("txt-notification").classList.add('Solved');
        document.getElementById("txt-notification").innerHTML = "You Win!";
    }
    else
        //alert("The quest is not solved!");
        {
            result_screen.classList.add('active');
            document.getElementById("txt-notification").classList.add('notSolved');
            document.getElementById("txt-notification").innerHTML = "The quest is not solved!";
        }

})
//button close notification
closeNotification = () =>{
    result_screen.classList.remove('active');
}
//button new game
const returnStartScreen =()=>{
    //pause = false;
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    solve_screen.classList.remove('active');
    /*pause_screen.classList.remove('active');
    result_screen.classList.remove('active');*/
}
document.querySelector("#btn-new-game").addEventListener('click', ()=>{
    returnStartScreen();
})

//button clear all value
const clearNotFill =()=>{
    document.getElementById("txt-notification").classList.remove('Solved');
    document.getElementById("txt-notification").classList.remove('notSolved');
    for(let i=0;i<81 ;i++){
        
        if(!cells[i].classList.contains('filled')){
            cells[i].innerHTML ='';
            let row = Math.floor(i/9);
            let col = i%9;
            su_quest[row][col] = 0;
            cells[i].classList.remove('selected');
            cells[i].setAttribute('data-value',0);
        }
    }
}
document.querySelector('#btn-clear').addEventListener('click',()=>{
    clearNotFill();
    resetErrorValue();
    resetHoverBg();
    resetError();
})

//button solve game
const solveGame = () =>{
    for (let i=0;i<81;i++){
        let row = Math.floor(i/9);
        let col = i%9;
        cells[i].setAttribute('data-value',su_answer[row][col]);
        cells[i].innerHTML = su_answer[row][col];
        resetErrorValue();
        resetHoverBg();
        resetError();
        
        /*
        if (su_quest[row][col] !== 0){
            cells[i].classList.add('filled');
            cells[i].innerHTML = su_quest[row][col];
        }*/

    }
}
document.querySelector('#btn-solve-game').addEventListener('click',()=>{
    solveGame();
})

const cellHoverBg = (index) =>{
    let row=Math.floor(index/9);
    let col = index%9;

    let box_start_row = row - row%3;
    let box_start_col = col - col%3;
    //hover 3x3 cells
    //console.log("index box: ");
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let cell = cells[9*(box_start_row+i) + (box_start_col +j)];
            cell.classList.add('hover');
            //console.log(9*(box_start_row+i) + (box_start_col +j));
        }
    }
    //hover above cells (column)
    let step = 9;
    //console.log("index above index: ");
    while (index - step >=0) {
        cells[index - step].classList.add('hover');
        //console.log(index - step);
        step += 9;
    }
    //hover below cells (column)
    step = 9;
    //console.log("index below index: ");
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        //console.log(index + step);
        step += 9;
    }
    //hover left cells (row)
    step =1;
    //console.log("index left index: ");
    while (index - step >=9*row) {
        cells[index - step].classList.add('hover');
        //console.log(index - step);
        step += 1;
    }
    //hover right cells (row)
    step =1;
    //console.log("index right index: ");
    while (index + step < 9*row + 9) {
        cells[index + step].classList.add('hover');
        //console.log(index + step);
        step += 1;
    }
}
const initCellsEvent = () =>{
    cells.forEach((e,index) => {
        e.addEventListener('click',()=>{
            /*console.log("selected index:");
            console.log(index);*/
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
const clearErrorValue = (cell) =>{
    cell.classList.remove('errValue');
}
const initNumberInputEvent = () =>{
    number_inputs.forEach((e,num)=>{
        e.addEventListener('click',()=>{
            for(let i=0;i<81;i++) {
                if(cells[i].classList.contains('errValue')){
                    cells[i].innerHTML ="";
                    cells[i].setAttribute('data-value',0);
                    let row = Math.floor(i/9);
                    let col = i%9;
                    su_quest[row][col] = 0;
                    cells[i].classList.remove('errValue');
                }
            };
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
//button delete value (X)
document.querySelector('#btn-delete').addEventListener('click',()=>{
    cells[selected_cell].innerHTML ="";
    cells[selected_cell].setAttribute('data-value',0);
    let row = Math.floor(selected_cell/9);
    let col = selected_cell%9;
    su_quest[row][col] = 0;
})



////////////////////// Solve screen //////////////////////
const solve_screen = document.querySelector('#solve-screen');
const cellsSolve = document.querySelectorAll('.sudoku-cell-solve');
const number_inputsSolve = document.querySelectorAll('.number-solve');
let su_solve = undefined;

//button return home
document.querySelector('#btn-home').addEventListener('click',()=>{
    returnStartScreen();
    su_solve = newBoard();
    for(let i=0;i<81;i++){
        let row = Math.floor(i/9);
        let col = i%9;
        cellsSolve[i].setAttribute('data-value',su_solve[row][col]);
        cellsSolve[i].classList.remove('filled');
        cellsSolve[i].classList.remove('selected');
        cellsSolve[i].classList.remove('err');
        cellsSolve[i].classList.remove('errValue');
        cellsSolve[i].innerHTML="";
    }
    resetErrorSolve();
    resetErrorValueSolve();
})
//button clear all
document.querySelector('#btn-clear-solve').addEventListener('click',()=>{
    su_solve = newBoard();
    for(let i=0;i<81;i++){
        let row = Math.floor(i/9);
        let col = i%9;
        cellsSolve[i].setAttribute('data-value',su_solve[row][col]);
        cellsSolve[i].classList.remove('filled');
        cellsSolve[i].classList.remove('selected');
        cellsSolve[i].classList.remove('err');
        cellsSolve[i].classList.remove('errValue');
        cellsSolve[i].innerHTML="";
    }
    resetErrorSolve();
    resetErrorValueSolve();
})
//init box
const initGameBoardSolve = () =>{
    let index =0;
    for (let i=0;i<9;i++){
        for (let j=0;j<9;j++){
            if (i ===2 || i === 5) cellsSolve[index].style.marginBottom='5px';
            if (j ===2 || j===5) cellsSolve[index].style.marginRight ='5px';
            index++;
        }
    }
}
const initCellsEventSolve = () =>{
    cellsSolve.forEach((e,index) => {
        e.addEventListener('click',()=>{
            /*console.log("selected index:");
            console.log(index);*/
            cellsSolve.forEach(e=>e.classList.remove('selected'));
            selected_cell = index;
            e.classList.add('selected');
            
        })
    })
}
const resetErrorSolve =()=>{
    cellsSolve.forEach(e => e.classList.remove('err'));
}
const resetErrorValueSolve = () =>{
    cellsSolve.forEach(e => e.classList.remove('errValue'));
}
const cellCheckErrorSolve = (value) =>{
    const addErrValue = (cell) =>{
        cell.classList.add('errValue');
    }
    const addError = (cell) =>{
        if(parseInt(cell.getAttribute('data-value')) === value){
            cell.classList.add('err');
            addErrValue(cellsSolve[selected_cell]);
        }
    }
    let index = selected_cell;
    let row=Math.floor(index/9);
    let col=index%9;
    let box_start_row = row - row%3;
    let box_start_col = col - col%3;

   
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let cell = cellsSolve[9*(box_start_row+i) + (box_start_col +j)];
            if(!cell.classList.contains('selected'))
                addError(cell);
           
        }
    }
    //check above cells
    let step = 9;
    while (index - step >=0) {
        addError(cellsSolve[index - step]);
        step += 9;
    }
   //check below cells
    step = 9;
    while (index + step < 81) {
        addError(cellsSolve[index + step]);
        step += 9;
    }
    //check left cells
    step =1;
    while (index - step >=9*row) {
        addError(cellsSolve[index - step]);
        step += 1;
    }
    //check right cells
    step =1;
    while (index + step < 9*row + 9) {
        addError(cellsSolve[index + step]);
        step += 1;
    }
}
const initNumberInputEventSolve = () =>{
    number_inputsSolve.forEach((e,num)=>{
        e.addEventListener('click',()=>{
            for(let i=0;i<81;i++) {
                if(cellsSolve[i].classList.contains('errValue')){
                    cellsSolve[i].innerHTML ="";
                    cellsSolve[i].setAttribute('data-value',0);
                    let row = Math.floor(i/9);
                    let col = i%9;
                    su_solve[row][col] = 0;
                    cellsSolve[i].classList.remove('filled');
                    cellsSolve[i].classList.remove('errValue');
                }
            };
            if(cellsSolve[selected_cell].classList.contains('errValue')){
                clearErrorValue(cellsSolve[selected_cell]);
            }

            cellsSolve[selected_cell].innerHTML = num + 1;
            cellsSolve[selected_cell].setAttribute('data-value',num+1);
            cellsSolve[selected_cell].classList.add('filled');
            let row = Math.floor(selected_cell/9);
            let col = selected_cell%9;
            su_solve[row][col] = num +1;
            resetErrorSolve();
            cellCheckErrorSolve(num+1);
        })
    })
}
//button delete value (X)
document.querySelector('#btn-delete-solve').addEventListener('click',()=>{
    cellsSolve[selected_cell].innerHTML ="";
    cellsSolve[selected_cell].setAttribute('data-value',0);
    cellsSolve[selected_cell].classList.remove('filled');
    let row = Math.floor(selected_cell/9);
    let col = selected_cell%9;
    su_solve[row][col] = 0;
    resetErrorSolve();
})
//button solve board
const solveSudokuBoard = () =>{
    resetErrorSolve();
    for(let i=0;i<81;i++) {
        if(cellsSolve[i].classList.contains('errValue')){
            cellsSolve[i].innerHTML ="";
            cellsSolve[i].setAttribute('data-value',0);
            let row = Math.floor(i/9);
            let col = i%9;
            su_solve[row][col] = 0;
            cellsSolve[i].classList.remove('filled');
            cellsSolve[i].classList.remove('errValue');
        }
    };
    solveSudoku(su_solve);
    for(let i=0;i<81;i++){
        let row = Math.floor(i/9);
        let col = i%9;
        cellsSolve[i].setAttribute('data-value',su_solve[row][col]);
        if(su_solve[row][col] !== 0){
            cellsSolve[i].innerHTML = su_solve[row][col];
        }
    }
}

document.querySelector('#btn-solve').addEventListener('click',()=>{
    solveSudokuBoard();
})


const init = () =>{
    initGameBoard();
    initCellsEvent();
    initNumberInputEvent();
    initGameBoardSolve();
    initCellsEventSolve();
    initNumberInputEventSolve();
}
init();

let numInput;
const initNumberEvent = () =>{
    numInput = 0;
    if(navigator.appName=='Netscape'){
        if (event.which >= 49 && event.which <= 57)
            numInput = parseInt(String.fromCharCode(event.which));
        else if (event.which == 120 || event.which == 88)
            numInput = "";
    }
    else
        if (event.keyCode >= 49 && event.keyCode <= 57)
            numInput = parseInt(String.fromCharCode(event.keyCode));
        else if (event.keyCode == 120 || event.keyCode == 88)
            numInput = "";
    if (numInput !== 0){
        for(let i=0;i<81;i++) {
            if(cells[i].classList.contains('errValue')){
                cells[i].innerHTML ="";
                cells[i].setAttribute('data-value',0);
                let row = Math.floor(i/9);
                let col = i%9;
                su_quest[row][col] = 0;
                cells[i].classList.remove('errValue');
            }
            if(cellsSolve[i].classList.contains('errValue')){
                cellsSolve[i].innerHTML ="";
                cellsSolve[i].setAttribute('data-value',0);
                let row = Math.floor(i/9);
                let col = i%9;
                su_solve[row][col] = 0;
                cellsSolve[i].classList.remove('filled');
                cellsSolve[i].classList.remove('errValue');
            }
        }
    
        if(cells[selected_cell].classList.contains('errValue')){
            clearErrorValue(cells[selected_cell]);
        }
        if(cellsSolve[selected_cell].classList.contains('errValue')){
            clearErrorValue(cellsSolve[selected_cell]);
        }
    
        if(!cells[selected_cell].classList.contains('filled')){
            cells[selected_cell].innerHTML = numInput;
            cells[selected_cell].setAttribute('data-value',numInput);
            let row = Math.floor(selected_cell/9);
            let col = selected_cell%9;
            su_quest[row][col] = numInput;
            resetError();
            cellCheckError(numInput);
        }
        cellsSolve[selected_cell].innerHTML = numInput;
        cellsSolve[selected_cell].setAttribute('data-value',numInput);
        cellsSolve[selected_cell].classList.add('filled');
        let row = Math.floor(selected_cell/9);
        let col = selected_cell%9;
        su_solve[row][col] = numInput;
        resetErrorSolve();
        cellCheckErrorSolve(numInput);
    }
}