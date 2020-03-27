let LEN;
let MainMap;
let piratePathOnX;
let piratePathOnY;
let scriptsForGoods;
let IDP;
let i;
let G;
let flagBuy;
let scripts;
let youHome;
let PiratesC;
let BeginShipX;
let BeginShipY;
let MovesCount;
let ShipRouteX;
let ShipRouteY;
let pirateRouteX;
let pirateRouteY;
let PiratesWild;
let PiratesR;
let FLAG;
let wild;
let GAME_STATE;
export function startGame(levelMap, gameState) {
    IDP=0;
    LEN =0;
    scriptsForGoods=0;
    MovesCount=180;
    FLAG = false;
    wild = undefined;

    //инцилизация карты
    MainMap =MAP(levelMap);
    //инцилизация карты
    PiratesC = gameState.pirates.length;
    if(gameState.pirates.length===0){
        FLAG = true;
    }

    //начальные координаты
    BeginShipX = gameState.ship.x;
    BeginShipY = gameState.ship.y;
    //начальные координаты

    //пиратские маршруты
    pirateRouteX = [];
    pirateRouteY = [];
    PiratesWild = [];
    PiratesR = [];
    for(let i=0; i<PiratesC; i++){
        pirateRouteX[i] = [];
        pirateRouteY[i] = [];
        // pirateRouteX[i][0]
        // pirateRouteY[i][0];
        PiratesWild[i] = [];
        PiratesR[i] = -1;
    }

    i=-1;
    G=0;
    flagBuy=false;
    youHome=true;
    getNextCommand(gameState)
}


export function getNextCommand(gameState) {

    if (i<0) {
        i++;
        return "WAIT";
    }
    GAME_STATE = gameState;

        if (!pirateRoute(gameState.pirates)) {
            FLAG = true;
        }
        if (FLAG) {
            for (let i = 0; i < PiratesR.length; i++) {
                if (PiratesWild[i].length - 1 <= PiratesR[i]) {
                    PiratesR[i] = 0;
                } else {
                    PiratesR[i]++;
                }
            }
        }

    // if((G>=scriptsForGoods)&&(gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)){
    //     G=0;
    //     flagBuy=false;
    // }
    // if(!flagBuy) {
    //     flagBuy=true;
    //     scripts= MaxPOfPort(gameState.prices, gameState.goodsInPort, gameState.ports,gameState);
    //  }
    IDP = 2;
    // if((gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)&&(G<scriptsForGoods/2)){
    //     G++;
    //     youHome =true;
    //     MovesCount--;
    //     return "LOAD fish 1"
    //     return scripts[G-1];
    // }
    // if((gameState.ship.x === gameState.ports[IDP].x) && (gameState.ship.y ===gameState.ports[IDP].y)&&(G>=scriptsForGoods/2)&&(G<scriptsForGoods)){
    //     G++;
    //     youHome = false;
    //     MovesCount--;
    //     return "SELL fish 1"
    //     return scripts[G-1];
    // }
    if(gameState.ship.x===gameState.ports[IDP].x && gameState.ship.y===gameState.ports[IDP].y){
        youHome =  false;
    }else if(gameState.ship.x===5 && gameState.ship.y===12){
        youHome =  true;
    }
    if(youHome) {
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[IDP].x, gameState.ports[IDP].y)
    }else{
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, 5, 12);
    }
    if (PiratesC>0) {
        if(FLAG) {
            let map;
            for (let i = 0; i < PiratesC; i++) {
                map = MapWithP(MainMap, gameState.pirates[i].x, gameState.pirates[i].y, i)
            }
            console.log(map);
            console.log(PiratesR);
            console.log(pirateRouteX);
            console.log(pirateRouteY);
            console.log(PiratesWild);
            let NewWild = famousPiratesWild(gameState, wild);
            return Mov(NewWild);
        }else{
            for(let i=0; i<PiratesC; i++) {
                let problem = (ThereIsAProblem(gameState.ship.x, gameState.ship.y, gameState.pirates[i].x, gameState.pirates[i].y, 2, 2));
                if (problem) {
                    let map = MainMap;
                    for (let i = 0; i < PiratesC; i++) {
                        map = MapWithP(map, gameState.pirates[i].x, gameState.pirates[i].y, i)
                    }
                    if (youHome) {
                        wild = MinWildOfPortNum(map, gameState.ship.x, gameState.ship.y, gameState.ports[IDP].x, gameState.ports[IDP].y)
                    } else {
                        wild = MinWildOfPortNum(map, gameState.ship.x, gameState.ship.y, gameState.ports[0].x, gameState.ports[0].y);
                    }
                    // console.log(map);
                    return wild[0]
                }
            }
        }
    }
    return Mov(wild[0]);
}
/////////////////////

function MaxPOfPort(Ports, goods, PortsXY) {

    let scripts = [];
    let GOODS;
    let MAXP = 0;
    let M;
    let max_x = goods.length;//количество товаров
    let max_ogran1 = goods.length+1; //количество тоаров +1

    let inp_val1=[];
    let Fun = [];


    let Goods = new Array(goods.length);
    for (let i = 0; i < goods.length; i++) {
        Goods[i] = goods[i]["name"]
    }
    for(let i=0; i<max_ogran1; i++){
        inp_val1[i]=[];
        for(let j=0; j<max_x+1; j++){
            inp_val1[i][j]=0;
        }
    }
    for(let j=0; j<max_x+1;j++) {
        if(max_x===j){inp_val1[0][j] = 368}else{ inp_val1[0][j] = goods[j].volume}
    }
    for (let j = 0; j < Ports.length; j++) {
        if (MinWildOfPortNum(MainMap, BeginShipX, BeginShipY, PortsXY[j + 1].x, PortsXY[j + 1].y )) {   // проверка на существование пути
            let numberOfSteps = MinWildOfPortNum(MainMap, BeginShipX, BeginShipY, PortsXY[j + 1].x, PortsXY[j + 1].y).length-1;
            for(let i=1; i<max_x+1;i++) {
                inp_val1[i][i-1]=1;
            }
            for(let i=1; i<max_ogran1;i++) {
                inp_val1[i][inp_val1[i].length-1]=goods[i-1].amount;
            }
            for(let i=0; i<max_x;i++){
                if((Ports[j][Goods[i]])){
                    Fun[i] =Ports[j][Goods[i]]*(-1)
                }else{
                    Fun[i]=0;
                }
            }
            Fun[max_x]=0;
            let P =  SimplexMethod(max_x,max_ogran1,inp_val1, Fun);
            let G = P[0];
            let a=0;
            let weight = 0;
            for(let i=0; i<G.length; i++){
                G[i]= Math.floor(G[i]);
                if(G[i]!==0){a+=2;
                    weight +=G[i] * goods[i].volume;
                }
            }
            let W=0;
            let m=0;
            let k;
            if(weight<368 &&(((numberOfSteps*3))<=MovesCount) ){
                for(let i=0; i<G.length; i++) {
                    W=0;
                while (weight <368){
                        if(G[i] + W +1 <= goods[i].amount && weight+ W*goods[i].volume + goods[i].volume<=368){
                            W +=1
                        } else break;
                    }
                    if(W>m){
                        k= i;
                        m = W;
                    }
                }

            }
            if(k!==undefined && (G[k]===0)){
                 G[k] +=m;
            }else if((k!==undefined && (G[k]!==0))){
                if (((numberOfSteps*3+(a+2)*3))<=MovesCount) {
                    G[k] +=m;
                    a+=2;
                }
            }

           P[1] =0;
            for(let i=0; i<G.length; i++){
                if(G[i]!==0){
                    P[1]+=G[i]* Ports[j][Goods[i]];
                }
            }

            if((P[1]/((numberOfSteps*2+a))>MAXP)&&(((numberOfSteps+a))<=MovesCount)){
                MAXP = P[1]/((numberOfSteps*2+a));
                M= P[1];
                IDP = Ports[j].portId;
                GOODS = G;
            }
        }
    }

    if(GOODS!==undefined) {
        let scripts1 = [];
        let c = 0;
        scriptsForGoods = 0;

        for (let i = 0; i < GOODS.length; i++) {
            if (GOODS[i] !== 0) {
                scripts[scriptsForGoods] = "LOAD " + goods[i].name + " " + GOODS[i];
                scripts1[c] = "SELL " + goods[i].name + " " + GOODS[i];
                c++;
                scriptsForGoods++;
            }
        }
        scriptsForGoods += c;
        scripts = scripts.concat(scripts1)
    }else{
            scriptsForGoods = 0;
            IDP = 1;
            scripts[scriptsForGoods] = "WAIT";
            scriptsForGoods++;
    }
    return scripts
}



function MAP(gameState) {
    let row  = gameState.split("\n").length;
    let col = gameState.indexOf("\n");
    let beg=0;
    let map = [];
    for(let i=0; i<row; i++){
        map[i] = gameState.slice(beg,beg+col);
        beg +=col+1;
    }
    return map
}

/**
 * @return {[]}*/



///СИМПЛИКС МЕТОД
/**
 * @return {[[], *]}
 */
function SimplexMethod(max_x, max_ogran1, inp_val1,Fun) {
    let j;
    let iteration;
    let matrix = [];
    matrix = [];
    let i = 0;
    /*################## ШАГ 0 ##################*/
    // Перебираем все ограничения
    for (i = 0; i < max_ogran1; i++) {
        matrix[i] = [];
        for (j = 0; j < max_x + 1; j++) {
            matrix[i][j] = inp_val1[i][j]; // Матрица исходных значений
        }
    }
    // Массив индексов по горизонтале
    let horizon_x = [];
    for (i = 0; i < max_x + 1; i++) {
        horizon_x[i] = i;
    }
    // Массив индексов по вертикале
    let vertical_x = [];
    for (i = 0; i < max_ogran1; i++) {
        vertical_x[i] = i + max_x;
    }
    // Матрица свободных членов
    let free = [];
    for (let k = 0; k < matrix.length; k++) {
        free[k] = matrix[k][max_x];
    }
    free[matrix.length] = 0;

    // Последняя строка сама функция
    // Добавим ее в основную матрицу
    matrix.push(Fun);
    // console.log(matrix);
    // Есть ли  отрицательные элементы в матрице свободных членов ?
    if (minElm(free) < 0) {
        iteration = 0; // счетчик итераций, для защиты от зависаний
        step1(); // Переходим к шагу 1
    }

    // Есть ли  отрицательные элементы в коэфициентах функции (последняя строчка) ?
    if (minElm(matrix[matrix.length - 1], false, true) < 0) {
        iteration = 0; // счетчик итераций, для защиты от зависаний
        step2(); // Переходим к шагу 2
    }
      return (results());// Отображаем результаты в понятном виде
    /*################## ШАГ1 ##################*/
    function step1() {
        iteration++;
        // находим ведущую строку
        const min_k_num = minElm(free, true, true);

        // находим ведущий столбец
        if (minElm(matrix[min_k_num]) < 0) {
            var min_k1_num =minElm(matrix[min_k_num], true, true);
        } else {
            return false;
        }
        // Печатаем таблицу и выделяем на ней ведущие строку и столбец
        // Обновляем индексы элементов по горизонтале и вертикале
        let tmp = horizon_x[min_k1_num];
        horizon_x[min_k1_num] = vertical_x[min_k_num];
        vertical_x[min_k_num] = tmp;


        // Замена
        update_matrix(min_k_num, min_k1_num);
        // матрица свободных членов
        for (let k = 0; k < matrix.length; k++) {
            free[k] = matrix[k][max_x];
        }
        if (minElm(free, false, true) < 0 && iteration < 10) // нужно ли еще разок пройти второй шаг ?
            step1();

    }


    /*################## ШАГ2 ##################*/
    function step2() {
        iteration++;
        // находим ведущий столбец
        const min_col_num = minElm(matrix[matrix.length - 1], true, true);

        // находим ведущую строку
        const cols_count = matrix[0].length - 1;
        let min_row_num = 999;
        // эмпирический коэфициент, тк мы не знаем, положително ли нулевое отношение
        let min_row = 9999;
        let tmp = 0;
        for (i = 0; i < matrix.length - 1; i++) {
            tmp = (free[i] / matrix[i][min_col_num]);
            if (tmp < min_row && tmp >= 0) {
                min_row_num = i;
                min_row = tmp;
            }
        }

        let min_k1_num = min_col_num;
        let min_k_num = min_row_num;
        // Печатаем таблицу и выделяем на ней ведущие строку и столбец
        // Обновляем индексы элементов по горизонтале и вертикале
        tmp = horizon_x[min_k1_num];
        horizon_x[min_k1_num] = vertical_x[min_k_num];
        vertical_x[min_k_num] = tmp;
        // Если мы не нашли ведущую строку (999 - это наш эмпирический коэфициент)
        // if (min_row_num == 999) {
        // 	alert('функция в области допустимых решений задачи не ограничена');
        // 	return false;
        // }

        // Замена
        update_matrix(min_k_num, min_k1_num);
        // матрица свободных членов
        for (var k = 0; k < matrix.length; k++) {
            free[k] = matrix[k][max_x]
        }

        // нужно ли еще разок пройти второй шаг ?
        if (minElm(matrix[matrix.length - 1], false, true) < 0 && iteration < 10)
            step2();

    }

// Функция замены (обновления матрицы)
    function update_matrix(min_k_num, min_k1_num) {

        const matrix1 = [];

        for (i = 0; i < matrix.length; i++) {
            matrix1[i] = [];
            for (j = 0; j < matrix[0].length; j++) {
                if (i === min_k_num && j === min_k1_num) {
                    matrix1[i][j] =  1 / matrix[i][j];
                } else {
                    if (i === min_k_num) {
                        matrix1[i][j] = matrix[i][j] * 1 / matrix[min_k_num][min_k1_num];
                    } else {
                        if (j === min_k1_num) {
                            matrix1[i][j] = -matrix[i][j] / matrix[min_k_num][min_k1_num];
                        } else {
                            matrix1[i][j] = matrix[i][j] -matrix[i][min_k1_num] * matrix[min_k_num][j]/ matrix[min_k_num][min_k1_num];
                        }
                    }

                }
                matrix1[i][j] = matrix1[i][j] * 1000/ 1000;
            }
        }
        matrix = matrix1;

        return false;

    }


    // Выводим результаты в понятном виде
    function results() {
        const vars = [];
        for(let i=0; i<max_x; i++){
            vars[i]=0;
        }
        // Иксы, отличные от нуля
        //vertical_x.length
        for (i = 0; i < max_x; i++) {
            if (vertical_x[i] < max_x)
                vars[(vertical_x[i])] =  matrix[i][max_x];
        }
        let main_result = matrix[matrix.length - 1][max_x];
        return [vars, main_result];
    }

    return false;
}
// Поиск минимального элемента
function minElm(v, dispnum, not_last){
    let m = v[0];
    let num= 0;
    let len=0;
    // если not_last, то последний элемент не учитываем в массиве
    if (not_last){
        len = v.length-2;
    }else{
        len = v.length-1;
    }
    for (let i=1; i <= len; i++){
        if (v[i] < m ){
            m= v[i];
            num = i
        }
    }
    // Выводим номер минимального
    if (dispnum){
        return num
    }else{ // или значение
        return m
    }
}



//////////////////////
/**
 * @return {string}
 */

function MapWithP(MAP, x, y, k) {
    let x1=[];
    let x2 = [];
    for (let i=0; i<MAP.length; i++) {
        x1[i] = []
        x2[i] = []
    }
    for(let i=0; i<MAP.length; i++){
        for(let j=0; j<MAP[0].length; j++){
            x1[i][j] = MAP[i][j]
            x2[i][j] = MAP[i][j]
        }
    }
    let direction = DeterminationWild(x,y);
    let X1 = 1;
    let X2 = 1;
    let Y1 =1 ;
    let Y2 = 1;
    if(FLAG) {
        if (PiratesWild[k][PiratesR[k]] === "E") X2 = 5;
        if (PiratesWild[k][PiratesR[k]] === "W") X1 = 5;
        if (PiratesWild[k][PiratesR[k]] === "S") Y2 = 5;
        if (PiratesWild[k][PiratesR[k]] === "N") Y1 = 5;
    }else{
        if (direction === "E") X2 = 2;
        if (direction === "W") X1 = 2;
        if (direction === "S") Y2 = 2;
        if (direction === "N") Y1 = 2;
    }

    for(let i=x-X1; i<=(x+X2); i++){
            x1[y][i] = "#"
    }
    for(let i=y-Y1; i<=(y+Y2); i++){
            x1[i][x] = "#"
    }
    x1[GAME_STATE.ship.y][GAME_STATE.ship.x ] = "k";
    for(let j=0; j<GAME_STATE.ports.length; j++){
        x1[GAME_STATE.ports[j].y][GAME_STATE.ports[j].x ] = "O";
        for(let i=GAME_STATE.ports[j].x-1; i<=GAME_STATE.ports[j].x+1; i++){
            x1[GAME_STATE.ports[j].y][i] = x2[GAME_STATE.ports[j].y][i];
        }
        for(let i=GAME_STATE.ports[j].y-1; i<=GAME_STATE.ports[j].y+1; i++){
            x1[i][GAME_STATE.ports[j].x] = x2[i][GAME_STATE.ports[j].x];
        }
    }
    // console.log("x2" )
    // console.log(x2)
    // console.log("x1" )
    // console.log(x1)
    return x1;
}

/**
 * @return {boolean}
 */
function ThereIsAProblem (xS, yS, xP, yP, x,y){ // провека, входит ли пират в зону n клеток
    if((Math.abs(yP-yS) <=y && Math.abs(xP-xS) <=x)) return true;
    else return false;
}
function abcCheck(ShipO, PirateO, PortO) { //Ship, Pirate и Port - должны находиться на одной оси
    if(Math.abs(PortO - ShipO)===Math.abs(PirateO-ShipO)+Math.abs(PortO-PirateO)) return true;
    return false;
}
function collisionCheck(xS, yS, pirateRouteX, pirateRouteY, PirateR, ShipRouteX, ShipRouteY, stop) {
    let TempRoutPirateX = pirateRouteX.slice(0, pirateRouteX.length - 1).concat(pirateRouteX);
    let TempRoutPirateY = pirateRouteY.slice(0, pirateRouteX.length - 1).concat(pirateRouteY);
    let TempRoutShipX = ShipRouteX; TempRoutShipX[0] = xS;
    let TempRoutShipY = ShipRouteY; TempRoutShipY[0] = yS;
    let k=0;
    if(stop!==undefined) {
        for (let i = 0; i <= stop; i++) {
            if (ThereIsAProblem(TempRoutShipX[k], TempRoutShipY[k], TempRoutPirateX[i + PirateR], TempRoutPirateY[i + PirateR], 1, 0)) return true;
            if (ThereIsAProblem(TempRoutShipX[k], TempRoutShipY[k], TempRoutPirateX[i + PirateR], TempRoutPirateY[i + PirateR], 0, 1)) return true;
        }
        PirateR +=stop;
    }
    for(let i=0; i<wild.length; i++){
        k++;
        if(ThereIsAProblem(TempRoutShipX[k], TempRoutShipY[k], TempRoutPirateX[i+PirateR], TempRoutPirateY[i+PirateR], 1, 0)) return [TempRoutPirateX[i+PirateR], TempRoutPirateY[i+PirateR]];
        if(ThereIsAProblem(TempRoutShipX[k], TempRoutShipY[k], TempRoutPirateX[i+PirateR], TempRoutPirateY[i+PirateR], 0, 1)) return [TempRoutPirateX[i+PirateR], TempRoutPirateY[i+PirateR]];
    }
    return false;
}
function stopCheck(xS, yS,stop, pirateRouteX, pirateRouteY, PirateR,ShipRouteX, ShipRouteY){
    return(collisionCheck( xS, yS,pirateRouteX, pirateRouteY, PirateR, ShipRouteX, ShipRouteY, stop))
}
function countCheck(xS, yS, pirateRouteX, pirateRouteY, PirateR, ShipRouteX, ShipRouteY){
    let arrboll = [];
    for(let j=0; j<PiratesC; j++) {
        arrboll[j] = [];
        for (let i = 0; i < wild.length; i++) {
            arrboll[j][i] = -1;
            if (!(stopCheck(xS, yS, i, pirateRouteX[j], pirateRouteY[j], (PirateR[j]), ShipRouteX, ShipRouteY))) {
                if(PiratesC<2){return i}
                arrboll[j][i] = i;
            }
        }
    }
    let WAIT = [];
    for(let i=0; i<PiratesC-1; i++){
        for(let j=0; j<arrboll[i].length; j++){
            if(arrboll[i][j]>=0 &&arrboll[i+1][j]>=0){
                WAIT[j] = arrboll[i][j];
            }else{
                WAIT[j] =undefined;
            }
        }
    }
    for(let i=0; i<WAIT.length; i++){
        if(WAIT[i]>=0) return WAIT[i];
    }

    return -1;
}

function anotherRoute(xS, yS, pirateRouteX, pirateRouteY, PirateR, ShipRouteXT, ShipRouteYT) {

    let map = MainMap;
    let Pr;
    for(let i=0; i<PiratesC; i++){
         Pr = collisionCheck(xS, yS, pirateRouteX[i], pirateRouteY[i], PiratesR[i], ShipRouteXT, ShipRouteYT);
        if(Pr){
           map = MapWithP(map, Pr[0], Pr[1], i)
        }
    }


    return  MinWildOfPortNum(map, xS, yS, ShipRouteXT[ShipRouteXT.length-1],ShipRouteYT[ShipRouteYT.length-1]);
}
function Hz(gameState) {
    let WAIT;
    let problem = false;
    for(let i=0; i<PiratesC; i++) {
        problem = (ThereIsAProblem(gameState.ship.x, gameState.ship.y, gameState.pirates[i].x, gameState.pirates[i].y,3, 3));
        if(problem) {problem = i; break;}
    }
    let idp = 0;
    if(youHome) {
        idp = IDP
    }
    if(problem!==false){
        problem = false;
        for(let i =0; i<PiratesC; i++) {
            problem = false;
            if (abcCheck(gameState.ship.x, gameState.pirates[i].x, gameState.ports[idp].x) || abcCheck(gameState.ship.y, gameState.pirates[i].y, gameState.ports[idp].y)) {
                problem = true;
                break;
            }
        }
        if(problem) {
            problem = false;
            for(let i=0; i<PiratesC; i++) {
                if (collisionCheck(gameState.ship.x, gameState.ship.y, pirateRouteX[i], pirateRouteY[i], PiratesR[i] , ShipRouteX, ShipRouteY)) {
                    problem = true;
                    break;
                }
            }
        }
        if(problem) {
            WAIT = countCheck(gameState.ship.x, gameState.ship.y, pirateRouteX, pirateRouteY, PiratesR, ShipRouteX, ShipRouteY)
        }
    }
    return WAIT;
}
function famousPiratesWild(gameState, PiratesWild) { //знаем путь пиратов.
    let WAIT = Hz(gameState);
    if(WAIT===undefined ||WAIT===0){
        console.log(wild)
        return wild[0]
    }
    if(WAIT!==-1) {
        let OldWAIT = wild;
        let NewWAIT = anotherRoute(gameState.ship.x, gameState.ship.y, pirateRouteX, pirateRouteY, PiratesR, ShipRouteX, ShipRouteY);
        NewWAIT = Hz(gameState);
        if(NewWAIT===-1){
             NewWAIT = anotherRoute(gameState.ship.x, gameState.ship.y, pirateRouteX, pirateRouteY, PiratesR, ShipRouteX, ShipRouteY);
        }
        if(OldWAIT.length+ WAIT> NewWAIT.length){
            return NewWAIT[0]
        }else{
                return "WAIT"
            }
    }else{
        let NewWAIT = anotherRoute(gameState.ship.x, gameState.ship.y, pirateRouteX, pirateRouteY, PiratesR, ShipRouteX, ShipRouteY);
        return NewWAIT[0]
    }
}
function Mov(mov) {
    MovesCount--;
    return mov
}
function pirateRoute(Pirates) {
    if(FLAG === true) return false;
    let flag = 0;
    for(let i=0; i<PiratesWild.length; i++){
        if(PiratesWild[i].length>1){
            flag ++;
        }
    }
    if(flag != Pirates.length) {
        for (let i = 0; i<Pirates.length; i++) {
            if (!(pirateRouteX[i][0] === Pirates[i].x && pirateRouteY[i][0] === Pirates[i].y) ) {
                pirateRouteX[i][pirateRouteX[i].length] = Pirates[i].x;
                pirateRouteY[i][pirateRouteY[i].length] = Pirates[i].y;
                PiratesR[i]++;
            } else {
                pirateRouteX[i][pirateRouteX[i].length] = Pirates[i].x;
                pirateRouteY[i][pirateRouteY[i].length] = Pirates[i].y;
                PiratesR[i]=0;
                for (let j = 0; j < pirateRouteX[i].length-1; j++) {

                    if (pirateRouteX[i][j] != pirateRouteX[i][j + 1]) {
                        if (pirateRouteX[i][j] <= pirateRouteX[i][j + 1]) {
                            PiratesWild[i][j] = "E"
                        } else {
                            PiratesWild[i][j] = "W"
                        }
                    } else if (pirateRouteY[i][j] != pirateRouteY[i][j + 1]) {
                        if (pirateRouteY[i][j] >= pirateRouteY[i][j + 1]) {
                            PiratesWild[i][j] = "N"
                        } else {
                            PiratesWild[i][j] = "S"
                        }
                    }
                }

            }
        }
        return true;
    }else{
        return false
    }
    return true;
}


function DeterminationWild(xP,yP) {
    if(piratePathOnX !== undefined){
        if(piratePathOnX>xP) return "W"
        if(piratePathOnX<xP) return "E"
        if(piratePathOnY>yP) return "S"
        if(piratePathOnY>yP) return "N"
    }
    piratePathOnX = xP;
    piratePathOnY = yP;
}
function MinWildOfPortNum(map, x1, y1, x2, y2) { //вычисляет коротчайший путь до порта
    let scripts = [];

    let H = map.length-1;         // ширина рабочего поля  13
    let W = map[0].length-1;         // высота рабочего поля  18
    let WALL = -1;         // непроходимая ячейка
    let BLANK = -2;         // свободная непомеченная ячейка


    let px= [], py = [];      // координаты ячеек, входящих  путь
    let len;                       // длина пути
    let grid = new Array(H);

    for (let i = 0; i <= H; i++) {
        grid[i] = new Array (W);
        for (let j = 0; j <= W; j++) {
            if (map[i][j].localeCompare("~")===0) {
                grid[i][j] = -2;
            }
            else if(map[i][j].localeCompare("#")===0){
                grid[i][j] = -1;
            }else{grid[i][j] = -2;}
        }
    }
    let ax= x1;
    let ay= y1;
    let bx =x2;
    let by =y2;

    let dx = [1, 0, -1, 0 ];   // смещения, соответствующие соседям ячейки
    let dy = [ 0, 1, 0, -1 ];   // справа, снизу, слева и сверху
    let  d, x, y, k;
    let stop;
    if (grid[ay][ax] === WALL || grid[by][bx] === WALL) {return false; } // ячейка (ax, ay) или (bx, by) - стена

    // распространение волны
    d = 0;
    grid[ay][ax] = 0;            // стартовая ячейка помечена 0


    do {
        stop = true;               // предполагаем, что все свободные клетки уже помечены
        for (y = 0; y < H; ++y)
            for (x = 0; x < W; ++x)
                if (grid[y][x] === d)                         // ячейка (beginShipX, beginShipY) помечена числом d
                {
                    for (k = 0; k < 4; ++k)                    // проходим по всем непомеченным соседям
                    {
                        let iy = y + dy[k], ix = x + dx[k];
                        if (iy >= 0 && iy < H && ix >= 0 && ix < W &&
                            grid[iy][ix] === BLANK)
                        {
                            stop = false;              // найдены непомеченные клетки
                            grid[iy][ix] = d + 1;      // распространяем волну
                        }
                    }
                }
        d++;
    } while (!stop && grid[by][bx] === BLANK);
    if (grid[by][bx] === BLANK){return false;}   // путь не найден

    // восстановление пути
    len = grid[by][bx];            // длина кратчайшего пути из (ax, ay) в (bx, by)

    LEN =len;
    x = bx;
    y = by;
    d = len;
    while (d > 0)
    {
        px[d] = x;
        py[d] = y;                   // записываем ячейку (beginShipX, beginShipY) в путь
        d--;
        for (k = 0; k < 4; ++k)
        {
            let iy = y + dy[k], ix = x + dx[k];
            if (iy >= 0 && iy < H && ix >= 0 && ix < W &&
                grid[iy][ix] === d)
            {
                x = x + dx[k];
                y = y + dy[k];           // переходим в ячейку, которая на 1 ближе к старту
                break;
            }
        }
    }
    ShipRouteX = px.slice();
    ShipRouteY = py.slice();
    px[0] = ax;
    py[0] = ay;                    // теперь px[0..len] и py[0..len] - координаты ячеек пути
///
    for(let i=1; i<=len; i++){
        if(py[i]!==py[i-1]){
            if(py[i]>py[i-1]){
                scripts[i-1] = "S"
            }else{
                scripts[i-1] = "N"
            }
        }else if(px[i]!==px[i-1]){
            if(px[i]>px[i-1]){

                scripts[i-1] = "E"
            }else{

                scripts[i-1] = "W"
            }
        }
    }
    /// заменить на функцию.
    return scripts;
}
