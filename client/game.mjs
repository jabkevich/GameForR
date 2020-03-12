let LEN;
let MainMap;
let piratePathOnX;
let piratePathOnY;
let shitPathOnX;
let shitPathOnY;
let scriptsForGoods;
let IDP;
let i;
let G;
let flagBuy;
let scripts;
let youHome;
let Pirates;
let BeginShipX;
let BeginShipY;
let MovesCount;
let pirateRouteX;
let pirateRouteY;
let PiratesWild;
let PiratesR;
export function startGame(levelMap, gameState) {
    MovesCount=180;
    //инцилизация карты
    MainMap =MAP(levelMap);
    //инцилизация карты
    if(gameState.pirates.length>0){
        Pirates = gameState.pirates.length;
    }
    piratePathOnX = new Array(Pirates);
    piratePathOnY = new Array(Pirates);
    //начальные координаты
    BeginShipX = gameState.ship.x;
    BeginShipY = gameState.ship.y;
    //начальные координаты

    //пиратские маршруты
    pirateRouteX = [];
    pirateRouteY = [];
    PiratesWild = [];
    PiratesR = [];
    for(let i=0; i<Pirates; i++){
        pirateRouteX[i] = [];
        pirateRouteY[i] = [];
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


    if (i === -1) {
        i++;
        return "N";
    }
    let wild;
    pirateRoute(gameState.pirates)
    for (let i = 0; i < PiratesR.length; i++) {
        if(PiratesWild[i].length-1 <= PiratesR[i]){
            PiratesR[i]=0;
        }else{PiratesR[i]++;}
    }
    if((G>=scriptsForGoods)&&(gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)){
        G=0;
        flagBuy=false;
    }
    if(!flagBuy) {
        flagBuy=true;
        scripts= MaxPOfPort(gameState.prices, gameState.goodsInPort, gameState.ports,gameState);
    }

    if((gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)&&(G<scriptsForGoods/2)){
        G++;
        youHome =true;
        MovesCount--;
        return scripts[G-1];
    }
    if((gameState.ship.x === gameState.ports[IDP].x) && (gameState.ship.y ===gameState.ports[IDP].y)&&(G>=scriptsForGoods/2)&&(G<scriptsForGoods)){
        G++;
        youHome = false;
        MovesCount--;
        return scripts[G-1];
    }
    if(youHome) {
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[IDP].x, gameState.ports[IDP].y)
    }else{
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[0].x, gameState.ports[0].y)
    }
    let Pirates = pirateBypass(gameState,wild);
    if(Pirates){return Pirates};
    MovesCount--;
    return wild[0];
}
/////////////////////

function MaxPOfPort(Ports, goods, PortsXY) {
    let scripts = [];
    let GOODS;
    let MAXP = 0;
    let M;
    let max_x = goods.length;//количество товаров
    let max_ogran1 = goods.length+1; //количество тоаров +1
    // let inp_val1 = [[3, 1, 3, 10, 50, 10,368],
    //     [1, 0, 0, 0,  0,  0, 3000],
    //     [0, 1, 0, 0,  0,  0, 3000],
    //     [0, 0, 1, 0,  0,  0, 5],
    //     [0, 0, 0, 1,  0,  0, 10],
    //     [0, 0, 0, 0,  1,  0, 15],
    //     [0, 0, 0, 0,  0,  1, 3000]
    // ];
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
        if(max_x===j){  inp_val1[0][j] = 368}else{ inp_val1[0][j] = goods[j].volume}
    }
    for (let j = 0; j < Ports.length; j++) {
        if (MinWildOfPortNum(MainMap, BeginShipX, BeginShipY, PortsXY[j + 1].x, PortsXY[j + 1].y )) {   // проверка на существование пути
            let numberOfSteps = MinWildOfPortNum(MainMap, BeginShipX, BeginShipY, PortsXY[j + 1].x, PortsXY[j + 1].y).length;
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
            for(let i=0; i<G.length; i++){
                G[i]= Math.floor(G[i]);
            }

            if(((P[1]/(numberOfSteps))>MAXP)&&((numberOfSteps)<MovesCount)){
                MAXP = P[1]/(numberOfSteps);
                M= P[1];
                IDP = Ports[j].portId;
                GOODS = P[0]
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
        console.log("HHA");
        scriptsForGoods = 0;
        IDP = 1;
        scripts[scriptsForGoods] = "WAIT";
        scriptsForGoods++;
    }
    return scripts
}


//
// if ((Ports[j][Goods[i]]) && (goods[i]["amount"] > 0)) {
//     PriseInPorts[v] = Ports[j][Goods[i]];
//     volume[v] = goods[i].volume;
//     amount[v] = goods[i].amount;
//     name[v] = goods[i].name;
//     ID[v] = goods[i].id;
//     v++;
// }


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
    // if(gameState.pirates.length>1) {
    //     for(let i=0; i<gameState.pirates.length; i++) {
    //         grid = MapWithP(grid, gameState.pirates[i].x, gameState.pirates[i].y)
    //     }
    // }
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

    px[0] = ax;
    py[0] = ay;                    // теперь px[0..len] и py[0..len] - координаты ячеек пути

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
    return scripts;
}

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
            tmp = Math.floor(free[i] / matrix[i][min_col_num]);
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
            free[k] = matrix[k][max_x];
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
function pirateBypass(gameState, wild) {
    let x = gameState.ship.x;
    let y = gameState.ship.y;
    if(Pirates>0) {
        if(piratePathOnX !== undefined) {
            for (let k = 0; k < Pirates; k++) {
                let xNow = gameState.pirates[k].x;
                let yNow = gameState.pirates[k].y;
                let N;
                let S;
                let W;
                let E;
                if (yNow < piratePathOnY[k]) {
                    N = true;
                    S = false;
                } else if ((yNow > piratePathOnY[k])) {
                    N = false;
                    S = true;
                } else {
                    N = false;
                    S = false;
                }

                if (xNow > piratePathOnX[k]) {
                    E = true;
                    W = false;
                } else if (xNow < piratePathOnX[k]) {
                    E = false;
                    W = true
                } else {
                    W = false;
                    E = false
                }
                // console.log("xNow = " + xNow +"; yNow =  " + yNow)
                if(PiratesWild[k][PiratesR[k]] == "N"){
                    N=true}
                if(PiratesWild[k][PiratesR[k]] == "S"){
                    S=true}
                if(PiratesWild[k][PiratesR[k]] == "W")
                {W=true}
                if(PiratesWild[k][PiratesR[k]] == "E"){
                    E=true}


                if (((x + 2 === xNow) && (y + 2 === yNow)) || ((x + 1 === xNow) && (y + 2 === yNow)) || ((x + 2 === xNow) && (y + 1 === yNow)) || ((x + 1 === xNow) && (y + 1 === yNow))) { //1, фи, A, круглешочик
                    console.log("1, фи, A, круглешочик")
                    console.log("x = " + x + "; y = "+ y )
                    console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] === "E" || wild[0] === "S")) {
                        if ((x + 1 === xNow) && (y + 1 === yNow)) {
                            if ((wild[0] === "E") && W) {
                                if (MainMap[y - 1][x] !== "#") {
                                    MovesCount--;
                                    return "N"
                                } else {      MovesCount--;

                                    return "W"
                                }
                            }
                            if ((wild[0] === "E") && N) {
                                if (MainMap[y][x - 1] !== "#") {
                                    MovesCount--;
                                    return "W"
                                } else {
                                    MovesCount--;
                                    return "N"
                                }
                            }
                            if ((wild[0] === "S") && W) {
                                if (MainMap[y - 1][x] !== "#") {
                                    MovesCount--;
                                    return "N";
                                } else {
                                    MovesCount--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "S") && N) {
                                if (MainMap[y][x - 1] !== "#") {
                                    MovesCount--;
                                    return "W";
                                } else {
                                    MovesCount--;
                                    return "N"
                                }
                            }
                        } // A
                        if ((x + 1 === xNow) && (y + 2 === yNow)) {
                            if ((wild[0] === "E") && N) {
                                if (MainMap[y][x - 1] !== "#") {
                                    MovesCount--;
                                    return "W"
                                } else {
                                    MovesCount--;
                                    return "N"
                                }
                            }
                            if ((wild[0] === "S") && N) {
                                if (MainMap[y][x - 1] !== "#") {
                                    MovesCount--;
                                    return "W"

                                } else {
                                    MovesCount--;
                                    return "N"
                                }
                            }
                            if ((wild[0] === "S") && (W)) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {
                                    MovesCount--;
                                    return "WAIT"
                                }
                            }
                        } // фи
                        if ((x + 2 === xNow) && (y + 1 === yNow)) {
                            if ((wild[0] === "E") && W) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "N"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "E") && N) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                            if ((wild[0] === "S") && (W)) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "N"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }

                        } //нолик
                        if ((x + 2 === xNow) && (y + 2 === yNow)) {
                            if (wild[0] === "E" && N) {{
                                    MovesCount--;
                                    return "WAIT"
                            }
                            if (wild[0] === "S" && W) {{
                                    MovesCount--;
                                    return "WAIT"
                            }
                        } //1
                    }
                }


                if (((x - 2 === xNow) && (y + 2 === yNow)) || ((x - 1 === xNow) && (y + 2 === yNow)) || ((x - 2 === xNow) && (y + 1 === yNow)) || ((x - 1 === xNow) && (y + 1 === yNow))) { //2, пси, B, квадратик
                    console.log("2, пси, B, квадратик")
                    // console.log("x = " + x + "; y = "+ y )
                    // console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] === "W" || wild[0] === "S")) {
                        if ((x - 1 === xNow) && (y + 1 === yNow)) {
                            if ((wild[0] === "W") && E) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "N"
                                } else {      MovesCount--;
                                    return "E"
                                }
                            }
                            if ((wild[0] === "W") && N) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {      MovesCount--;
                                    return "N"
                                }
                            }
                            if ((wild[0] === "S") && E) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "N"
                                } else {      MovesCount--;
                                    return "E"
                                }
                            }
                            if ((wild[0] === "S") && N) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {      MovesCount--;
                                    return "N"
                                }
                            } // B
                            if ((x - 1 === xNow) && (y + 2 === yNow)) {
                                if ((wild[0] === "W") && N) {
                                    if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                        return "E"
                                    } else {      MovesCount--;
                                        return "N"
                                    }
                                }
                                if ((wild[0] === "S") && N) {
                                    if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                        return "E"
                                    } else {      MovesCount--;
                                        return "N"
                                    }
                                }
                                if ((wild[0] === "S") && E) {
                                    if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                        return "W"
                                    } else {      MovesCount--;
                                        return "WAIT"
                                    }
                                }
                            } // пси
                            if ((x - 2 === xNow) && (y + 1 === yNow)) {
                                if ((wild[0] === "W") && E) {
                                    if (MainMap[y - 1][x] !== "#") {
                                        MovesCount--;
                                        return "N"
                                    } else {
                                        MovesCount--;
                                        return "W"
                                    }
                                }
                                if ((wild[0] === "W") && N) {
                                    if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                        return "S"
                                    } else {      MovesCount--;
                                        return "WAIT"
                                    }
                                }
                                if ((wild[0] === "S") && E) {
                                    if (MainMap[y - 1][x] !=="#") {      MovesCount--;
                                        return "N"
                                    } else {      MovesCount--;
                                        return "W"
                                    }
                                }
                            } //квадратик
                            if ((x - 2 === xNow) && (y + 2 === yNow)) {
                                if (wild[0] === "W" && N) {
                                    if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                        return "S"
                                    } else {      MovesCount--;
                                        return "WAIT"
                                    }
                                }
                                if (wild[0] === "S" && E) {
                                    if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                        return "N"
                                    } else {      MovesCount--;
                                        return "WAIT"
                                    }
                                }
                            } //2
                        }
                    }
                }

                if (((x + 2 === xNow) && (y - 2 === yNow)) || ((x + 1 === xNow) && (y - 2 === yNow)) || ((x + 2 === xNow) && (y - 1 === yNow)) || ((x + 1 === xNow) && (y - 1 === yNow))) { //3, лямда, C, палочка
                    console.log("3, лямда, C, палочка")
                    // console.log("x = " + x + "; y = "+ y )
                    // console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] === "E" || wild[0] === "N")) {
                        if ((x + 1 === xNow) && (y - 1 === yNow)) {
                            if ((wild[0] === "E") && W) {
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "E") && S) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && W) {
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "N") && S) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                        } // C
                        if ((x + 1 === xNow) && (y - 2 === yNow)) {
                            if ((wild[0] === "E") && S) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && S) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && W) {
                                    return Mov("WAIT")
                                }
                        } // лямда
                        if ((x + 2 === xNow) && (y - 1 === yNow)) {
                            if ((wild[0] === "E") && W) {
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "E") && S) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                            if ((wild[0] === "N") && W) {
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                        } //палочка
                        if ((x + 2 === xNow) && (y - 2 === yNow)) {
                            // console.log("3")
                            if (wild[0] === "E" && S) {
                                // console.log("E")
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "W"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                            if (wild[0] === "N" && W) {
                                // console.log("N")
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                        } //3
                    }
                }

                if (((x - 2 === xNow) && (y - 2 === yNow)) || ((x - 1 === xNow) && (y - 2 === yNow)) || ((x - 2 === xNow) && (y - 1 === yNow)) || ((x - 1 === xNow) && (y - 1 === yNow))) { //D, M, 4, треугольничик
                    console.log("D, M, 4, треугольник")
                    //  console.log("x = " + x + "; y = "+ y )
                    //  console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] === "W" || wild[0] === "N")) {
                        if ((x - 1 === xNow) && (y - 1 === yNow)) {
                            if ((wild[0] === "W") && E) {
                                // console.log("1")
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    // console.log("S")
                                    return "S"
                                } else {      MovesCount--;
                                    return "E"
                                }
                            }
                            if ((wild[0] === "W") && N) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && E) {
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "E"
                                }
                            }
                            if ((wild[0] === "N") && N) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                        } // D
                        if ((x - 1 === xNow) && (y - 2 === yNow)) {
                            if ((wild[0] === "W") && N) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && N) {
                                if (MainMap[y][x + 1] !== "#") {      MovesCount--;
                                    return "E"
                                } else {      MovesCount--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && E) {
                                if (MainMap[y][x - 1] !== "#") {      MovesCount--;
                                    return "WAIT"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                        } // мю
                        if ((x - 2 === xNow) && (y - 1 === yNow)) {
                            if ((wild[0] === "W") && E) {
                                if (MainMap[y + 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "W") && N) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "WAIT"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                            if ((wild[0] === "N") && E) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "S"
                                } else {      MovesCount--;
                                    return "W"
                                }
                            }
                        } //треугольничик
                        if ((x - 2 === xNow) && (y - 2 === yNow)) {
                            if (wild[0] === "W" && S) {
                                if (MainMap[y - 1][x] !== "#") {      MovesCount--;
                                    return "WAIT"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                            if (wild[0] === "N" && E) {
                                if (MainMap[y][x-1] !== "#") {      MovesCount--;
                                    return "WAIT"
                                } else {      MovesCount--;
                                    return "WAIT"
                                }
                            }
                        } //4
                    }
                }
                if (((y + 3 === yNow) || (y + 2 === yNow)) && ((x - 1 === xNow) || (x === xNow) || (x + 1 === xNow))) { //!@#%
                    console.log("!@#%");
                    if(wild[0]==="S"&&(E||W)){
                            if (y + 2 === yNow && ((x === xNow)||(((x-1===xNow)&&E)||((x+1===xNow)&&W)))) {
                                return Mov("WAIT")
                            } else if (E&&(y + 3 === yNow) && ((x + 1 === xNow) || (x === xNow))) {
                                return Mov(wild[0])
                            }else if (W&&(y + 3 === yNow) && ((x - 1 === xNow) || (x === xNow))) {
                                return Mov(wild[0])
                            }
                        }else if(N&&wild[0]==="S") {
                        if (MainMap[y][x + 1] !== "#") {
                            return Mov("E")
                        } else if (MainMap[y][x - 1] !== "#") {
                            return Mov("W")
                        }
                        if (MainMap[y + 1][x] !== "#") {
                            return Mov("N")
                        } else {
                            return Mov("WAIT")
                        }
                    }
                }
                if (((y - 3 === yNow) || (y - 2 === yNow)) && ((x - 1 === xNow) || (x === xNow) || (x + 1 === xNow))) { //BKNM
        console.log("BKNM")
                    if(wild[0]==="N"&&(E||W)){
                        console.log("y: " + y + "; x: "+ x)
                        console.log("yNow: " + yNow + "; xNow: "+ xNow)
                        if (y - 2 === yNow && ((x === xNow)||(((x-1===xNow)&&E)||((x+1===xNow)&&W)))) {
                            return Mov("WAIT")
                        } else if (E&&(y - 3 === yNow) && ((x + 1 === xNow) || (x === xNow))) {
                            return Mov(wild[0])
                        }else if (W&&(y - 3 === yNow) && ((x - 1 === xNow) || (x === xNow))) {
                            return Mov(wild[0])
                        }
                    }else if(S&&wild[0]==="N") {
                        if (MainMap[y][x + 1] !== "#") {
                            return Mov("E")
                        } else if (MainMap[y][x - 1] !== "#") {
                            return Mov("W")
                        }
                        if (MainMap[y - 1][x] !== "#") {
                            return Mov("S")
                        } else {
                            return Mov("WAIT")
                        }

                    }
                }
                if (((x - 2 === xNow) || (x - 3 === xNow)) && ((y + 1 === yNow) || (y === yNow) || (y - 1 === yNow))) { //zxcv
                    // console.log("zxcv")
                    if(N||S){
                        if(wild[0]==="E"){      MovesCount--;
                            return "WAIT"
                        }
                    }
                    if(E&&(wild[0]==="W")){
                        if(y-2===yNow) {      MovesCount--;
                            return "W"
                        }else if(y+2===yNow){      MovesCount--;return "W"}else {
                            if(y===yNow){
                                if(MainMap[y+1][x]!=="#"){    MovesCount--;return "S"}else{  MovesCount--;return "N"}
                            }

                        }
                    }
                }
                if (((x + 2 === xNow) &&(y === yNow)) || (((x + 3 === xNow)) && ((y - 1 === yNow) || (y === yNow) || (y + 1 === yNow)))) { //OIPU
                    console.log("OIPU");
                    console.log("E: " + E + "; W: " + W + "; S: " + S + "; N: "+ N);
                    console.log("y: " + y + "; x: "+ x);
                    console.log("yNow: " + yNow + "; xNow: "+ xNow);
                    console.log(wild[0]);
                    if(wild[0]==="E"&&(S||N)){
                        if ((x + 2 === xNow) && ((y=== yNow)||((y-1===yNow)&&N)||((y+1===yNow))&&S)) {
                            if(y===yNow){Mov("W")}
                            return Mov("WAIT")
                      } else if (N&&(x+ 3 === xNow) &&((y + 1 === yNow) || (y === yNow))) {
                            return Mov(wild[0])
                          }else if (S&&(x + 3 === xNow) && ((y - 1 === yNow) || (y === yNow))) {
                            return Mov(wild[0])
                        }
                    }else if(W&&(wild[0]==="E")) {
                        if (MainMap[y+1][x] !== "#") {
                            return Mov("S")
                        } else if (MainMap[y-1][x] !== "#") {
                            return Mov("N")
                        }
                        if (MainMap[y][x-1] !== "#") {
                            return Mov("W")
                        } else {
                            return Mov("WAIT")
                        }
                    }
                }
            }
        }
        for(let k=0; k<Pirates; k++){
            piratePathOnX[k] = gameState.pirates[k].x;
            piratePathOnY[k] =gameState.pirates[k].y;
            shitPathOnX = gameState.ship.x;
            shitPathOnY = gameState.ship.y;
        }
    }
    return undefined
}


function Mov(mov) {
    MovesCount--;
    return mov
}


function pirateRoute(Pirates) {
    let flag = 0;
    for(let i=0; i<PiratesWild.length; i++){
        if(PiratesWild[i].length>1){
            flag ++;
        }
    }
    if(flag != Pirates.length) {
        for (let i = 0; i<Pirates.length; i++) {
            if (!(pirateRouteX[i][0] === Pirates[i].x && pirateRouteY[i][0] === Pirates[i].y)) {
                pirateRouteX[i][pirateRouteX[i].length] = Pirates[i].x;
                pirateRouteY[i][pirateRouteY[i].length] = Pirates[i].y;
            } else {
                pirateRouteX[i][pirateRouteX[i].length] = Pirates[i].x;
                pirateRouteY[i][pirateRouteY[i].length] = Pirates[i].y;
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
        for (let i=0; i<Pirates.length; i++){
            for(let j=0 ; j<pirateRouteX[i].length; j++){
                if(pirateRouteX[i][j] === Pirates[i].x && pirateRouteY[i][j] === Pirates[i].y){
                    PiratesR[i] = j-1;
                }
            }
        }
        return false
    }

}