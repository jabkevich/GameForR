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
let Pirates;
let BeginShipX;
let BeginShipY;
let MovesCount;
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
    console.log(gameState);
    scriptsForGoods=0;
    MovesCount=180;
    FLAG = false;
    wild = undefined;
    //инцилизация карты
    MainMap =MAP(levelMap);
    //инцилизация карты
    if(gameState.pirates.length>0){
        Pirates = gameState.pirates.length;
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

    GAME_STATE = gameState;
    if (i === -1) {
        i++;
        return "N";
    }

        if (!pirateRoute(gameState.pirates)) {
            FLAG = true;
        }

    if(FLAG) {
        for (let i = 0; i < PiratesR.length; i++) {
            if (PiratesWild[i].length -1 <= PiratesR[i]) {
                PiratesR[i] = 0;
            } else {
                PiratesR[i]++;
            }
        }
    }

    if((G>=scriptsForGoods)&&(gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)){
        G=0;
        flagBuy=false;
    }
    if(!flagBuy) {
        flagBuy=true;
        scripts= MaxPOfPort(gameState.prices, gameState.goodsInPort, gameState.ports,gameState);
    }
    // IDP = 3;
    if((gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)&&(G<scriptsForGoods/2)){
        G++;
        youHome =true;
        MovesCount--;
        // return "LOAD fish 1"
        return scripts[G-1];
    }
    if((gameState.ship.x === gameState.ports[IDP].x) && (gameState.ship.y ===gameState.ports[IDP].y)&&(G>=scriptsForGoods/2)&&(G<scriptsForGoods)){
        G++;
        youHome = false;
        MovesCount--;
        // return "SELL fish 1"
        return scripts[G-1];
    }
    if(youHome) {
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[IDP].x, gameState.ports[IDP].y)
    }else{
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[0].x, gameState.ports[0].y)
    }
        let Pirates = famousPiratesWild(gameState, wild);
        if (Pirates) {
            return Mov(Pirates);
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
function whereWeAreGoing(xS,yS,distanceX, distanceY, x, y, k, PiratsWild) {
    let XPort;
    let YPort;
    // let map= MainMap;
    // for(let i=0; i<Pirates; i++) {
    //     // if(i!==k) {
    //     MainMap = MapWithP(MainMap, GAME_STATE.pirates[i].x, GAME_STATE.pirates[i].y, i)
    //     // }
    // }
    // // console.log(MainMap)
    // if(youHome) {
    //     wild = MinWildOfPortNum(MainMap, GAME_STATE.ship.x, GAME_STATE.ship.y, GAME_STATE.ports[IDP].x, GAME_STATE.ports[IDP].y)
    // }else{
    //     wild = MinWildOfPortNum(MainMap, GAME_STATE.ship.x, GAME_STATE.ship.y, GAME_STATE.ports[0].x, GAME_STATE.ports[0].y)
    // }
    // // console.log("x = " + GAME_STATE.ship.x + " y = " +  GAME_STATE.ship.y)
    // console.log(MainMap)
    // MainMap = map;
    // return wild[0];

    if(!youHome)
    {
        XPort = GAME_STATE.ports[0].x;
        YPort = GAME_STATE.ports[0].y;
    }else{
        XPort = GAME_STATE.ports[IDP].x;
        YPort = GAME_STATE.ports[IDP].y;
    }
    //
    if((distanceX===0 && distanceY===1)&&(wild[0]==="S")){ // N0
        let WILD = "N";
        let WILD1 = "N";
        let wi =0;
        if(XPort > xS){WILD="E";WILD1="W"; wi=+1}
        if(XPort < xS){WILD="W"; WILD1="E";wi = -1}
        if(XPort === xS){WILD="N"; WILD1="W";wi = -1}
            if (PiratsWild === "E") {
                if (MainMap[yS][xS +wi] !== "#") return WILD; else return "N"
            }//если нада - доделеать
            if (PiratsWild === "W") {
                if (MainMap[yS][xS +wi] !== "#") return WILD; else return "N"
            } //если нада - доделеать
            if (PiratsWild === "N") {
                if (MainMap[yS][xS +wi] !== "#") return WILD; else if (MainMap[yS][xS -wi] !== "#") return WILD1; else return "N"
            }
            if (PiratsWild === "S") {
                if (MainMap[yS][xS +wi] !== "#") return WILD; else if (MainMap[y][x -wi] !== "#") return WILD1; else return "N";
            }
    }
    if((distanceX===0 && distanceY===-1)&&(wild[0]==="N")){//S0
        let WILD = "S";
        let WILD1 = "S";
        let wi =0;
        let wj=0;
        if(XPort > xS){WILD="E";WILD1="W"; wi = 1}
        if(XPort < xS){WILD="W"; WILD1="E";wi = -1}
        if(XPort === xS){WILD="S"; wj = 1; WILD1="E";wi = +1}
            if (PiratsWild === "E") {
                if (MainMap[yS+wj][xS+wi] !== "#") return WILD; else return "S"
            }//если нада - доделеать
            if (PiratsWild === "W") {
                if (MainMap[yS+wj][xS+wi] !== "#") return WILD; else return "S"
            }//если нада - доделеать
            if (PiratsWild === "S") {
                if (MainMap[y+wj][xS] !== "#") return WILD; else if (MainMap[yS][xS + wi] !== "#") return WILD1; else return "S"
            }
    }
    if((distanceX===1&&distanceY===0)&&(wild[0]==="E")){//W0
        let WILD = "W";
        let WILD1 = "W";
        let wi =0;
        if(YPort > yS){WILD="S";WILD1="N"; wi=+1}
        if(YPort < yS){WILD="N"; WILD1="S";wi = -1}
        if(YPort === yS){WILD="W"; WILD1="S";wi = -1}
        if(PiratsWild==="S"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="N"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="W"){if(MainMap[yS+wi][xS]!=="#") return WILD; else if(MainMap[yS-wi][xS]!=="#")return WILD1; else return "W"}
        if(PiratsWild==="E"){if(MainMap[yS+wi][xS]!=="#") return WILD; else  return WILD1}//если нада - доделеать
    }
    if((distanceX===-1&&distanceY===0)&&(wild[0]==="W")){//E0
        let WILD = "E";
        let WILD1 = "E";
        let wi =0;
        if(YPort > yS){WILD="S";WILD1="N"; wi= +1}
        if(YPort < yS){WILD="N"; WILD1="S";wi = -1}
        if(YPort === yS){WILD="E"; WILD1="S";wi = -1}
        if(PiratsWild==="S"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="N"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="E"){if(MainMap[yS+wi][xS]!=="#") return WILD; else if(MainMap[yS-wi][xS]!=="#")return WILD1; else return "E"}
        if(PiratsWild==="W"){if(MainMap[yS+wi][xS]!=="#") return WILD; else  return WILD1}//если нада - доделеать
    }
    //
    if((distanceX===0 && distanceY===2)&&(wild[0]==="S")){ // N
        let WILD = "S";
        let WILD1 = "S";
        let wi =0;
        if(XPort > xS){WILD="E";WILD1="W"; wi=+1}
        if(XPort < xS){WILD="W"; WILD1="E";wi = -1}
        if(XPort === xS){WILD="W"; WILD1="E";wi = -1}

            if (PiratsWild === "E") {
                if (MainMap[yS][xS +wi] !== "#") return WILD; else return WILD1
            }//если нада - доделеать
            if (PiratsWild === "W") {
                if (MainMap[yS][xS + wi] !== "#") return WILD; else return WILD1
            } //если нада - доделеать
            if (PiratsWild === "N") {
                if (MainMap[yS][xS + wi] !== "#") return WILD; else if (MainMap[yS][xS - wi] !== "#") return WILD1; else if(MainMap[yS-1][xS]!=="#")return "N";else return "WAIT"
            }
    }
    if((distanceX===0 && distanceY===-2)&&(wild[0]==="N")){//S
        let WILD = "S";
        let WILD1 = "S";
        let wi =0;
        if(XPort >= xS){WILD="E";WILD1="W"; wi=+1}
        if(XPort <= xS){WILD="W"; WILD1="E";wi = -1}
            if (PiratsWild === "E") {
                if (MainMap[yS][xS +wi] !== "#") return WILD; else return WILD1
            }//если нада - доделеать
            if (PiratsWild === "W") {
                if (MainMap[yS][xS + wi] !== "#") return WILD; else return WILD1
            }//если нада - доделеать
            if (PiratsWild === "S") {
                if (MainMap[yS][xS + wi] !== "#") return WILD; else if (MainMap[yS][xS - wi] !== "#") return WILD1; else return "S"
            }
    }
    if((distanceX===2&&distanceY===0)&&(wild[0]==="E")){//W
        // console.log("W0")
        let WILD = "W";
        let WILD1 = "W";
        let wi =0;
        if(YPort > yS){WILD="S";WILD1="N"; wi=+1}
        if(YPort < yS){WILD="N"; WILD1="S";wi = -1}
        if(YPort === yS){WILD="N"; WILD1="S";wi = -1}
        if(PiratsWild==="S"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="N"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="W"){if(MainMap[yS+wi][xS]!=="#") return WILD; else if(MainMap[yS-wi][xS]!=="#")return WILD1; else return "W"}
    }
    if((distanceX===-2&&distanceY===0)&&(wild[0]==="W")){
        let WILD = "E";
        let WILD1 = "E";
        let wi =0;
        if(YPort > yS){WILD="S";WILD1="N"; wi=+1}
        if(YPort < yS){WILD="N"; WILD1="S";wi = -1}
        if(YPort === yS){WILD="N"; WILD1="S";wi = -1}
        if(PiratsWild==="S"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="N"){if(MainMap[yS+wi][xS]!=="#") return WILD; else return WILD1}//если нада - доделеать
        if(PiratsWild==="E"){if(MainMap[yS+wi][xS]!=="#") return WILD; else if(MainMap[yS-wi][xS]!=="#")return WILD1; else return "E"}
    }
    //
    if(distanceX===1 && distanceY===1 &&(wild[0]==="S"||wild[0]==="E")){ //q
       if( PiratsWild==="W"&&wild[0]==="E"){
            return "WAIT"
       }
        if( PiratsWild==="N"&&wild[0]==="S"){
            return "WAIT"
        }
    }
    if(distanceX===-1 && distanceY===1 &&(wild[0]==="S"||wild[0]==="W")){//s
        if(PiratsWild==="E"){
           return "WAIT"
        }
        if( PiratsWild==="N"){
          return "WAIT"
        }
    }
    if(distanceX===1 && distanceY===-1 &&(wild[0]==="N"||wild[0]==="E")){//t
        if( PiratsWild==="W"){
            return "WAIT"
        }
        if( PiratsWild==="S"){
         return "WAIT"
        }
    }
    if(distanceX===-1 && distanceY===-1 &&(wild[0]==="N"||wild[0]==="W")){//c
        if( PiratsWild==="E"){
            return "WAIT"
        }
        if( PiratsWild==="S"){
           return "WAIT"
        }
    }
    //
}
function MapWithP(MAP, x, y, k) {
    let x1=[];
    for (let i=0; i<MAP.length; i++) {
        x1[i] = []
    }
    for(let i=0; i<MAP.length; i++){
        for(let j=0; j<MAP[0].length; j++){
            x1[i][j] = MAP[i][j]
        }
    }
    // for(let i=x-1; i<=(x+1); i++){
    //     for(let j=y-1; j<=(y+1); j++){
    //         x1[j][i] = "#"
    //     }
    // }
    let X2=1;
    let X1=1;
    if(DeterminationWild(x,y,k) ==="E"){
        X2 = 2;
    }
    if(DeterminationWild(x,y,k)==="W"){
        X1 = 2;
    }
    let Y2=1;
    let Y1=1;
    if(DeterminationWild(x,y,k) ==="N"){
        Y2 = 2;
    }
    if(DeterminationWild(x,y,k)==="S"){
        Y1 = 2;
    }
    for(let i=x-X1; i<=(x+X2); i++){
            x1[y][i] = "#"
    }
    for(let i=y-Y1; i<=(y+Y2); i++){
            x1[i][x] = "#"
    }
    x1[GAME_STATE.ship.y][GAME_STATE.ship.x ] = "~";
    return x1;
}
function angleDetermination(angle, xP, yP, xS, yS, distanceX, distanceY, x, y, k) {
    let PWild;
    let map= MainMap;
    for(let i=0; i<Pirates; i++) {
        if(i!==k) {
            MainMap = MapWithP(MainMap, GAME_STATE.pirates[i].x, GAME_STATE.pirates[i].y)
        }
    }
    if(FLAG) {
        PWild = PiratesWild[k][PiratesR[k]];
    }else{
        PWild = DeterminationWild(xP,yP,k)
    }
        if((xS+distanceX+x===xP)&&(yS+distanceY+y===yP)){angle[0] = true; angle[4]=true; angle[5] = whereWeAreGoing(xS,yS,distanceX, distanceY, x, y, k,PWild )}
        if((xS-distanceX===xP)&&(yS+distanceY===yP)){angle[1]= true; angle[4]=true; angle[5] = whereWeAreGoing(xS,yS,-distanceX, distanceY, x, y, k, PWild)}
        if((xS+distanceX===xP)&&(yS-distanceY-y===yP)){angle[2]= true; angle[4]=true; angle[5] = whereWeAreGoing(xS,yS,distanceX, -distanceY, x, y, k, PWild)}
        if((xS-distanceX-x===xP)&&(yS-distanceY===yP)){angle[3]= true; angle[4]=true; angle[5] = whereWeAreGoing(xS,yS,-distanceX, -distanceY, x, y, k, PWild)}
        MainMap = map;
}
function ThereIsAProblem (){}
function famousPiratesWild(gameState, PiratesWild) { //знаем путь пиратов.
    let x = gameState.ship.x;
    let y = gameState.ship.y;
    let angle;
    for (let k = 0; k < Pirates; k++) {
        let angleQSTE = {q: false, s: false, t: false, e: false, FLAG: false, wild:""};
        let angleABCD = {A: false, B: false, C: false, D: false, FLAG: false, wild:""};
        let angleZXCV = {z: false, x: false, c: false, v: false , FLAG: false, wild:""};
        let angleUIOP = {u: false, i: false, o: false, p: false, FLAG: false, wild:""};
        let angleNN0SS0 = {N: false, N0: false, S: false, S0: false, FLAG: false, wild:""};
        let angleWW0EE0 = {W: false, W0: false, E: false, E0: false, FLAG: false, wild:""};
        angleDetermination(angleQSTE, gameState.pirates[k].x, gameState.pirates[k].y, x, y, 1, 1, 0, 0, k);
        angleDetermination(angleABCD, gameState.pirates[k].x, gameState.pirates[k].y, x, y, 2, 2, 0, 0,k);
        angleDetermination(angleZXCV, gameState.pirates[k].x, gameState.pirates[k].y, x, y, 1, 2, 0, 0, k);
        angleDetermination(angleUIOP, gameState.pirates[k].x, gameState.pirates[k].y, x, y, 2, 1, 0, 0, k);
        angleDetermination(angleNN0SS0, gameState.pirates[k].x, gameState.pirates[k].y, x, y, 0, 1, 0, 1, k);
        angleDetermination(angleWW0EE0, gameState.pirates[k].x, gameState.pirates[k].y, x, y, 1, 0, 1, 0, k);

        if(angleQSTE[4]==true){
            angle =angleQSTE[5];
        }else if (angleABCD[4]==true){
            angle =angleABCD[5];
        }else if (angleZXCV[4]==true){
            angle =angleZXCV[5];
        }else if (angleUIOP[4]==true){
            angle =angleUIOP[5];
        }else if (angleNN0SS0[4]==true){
            angle =angleNN0SS0[5];
        }else if (angleWW0EE0[4]==true){
            angle =angleWW0EE0[5];
        }
        if(angle!==undefined){
            return angle
        }
    }
    return angle
}
function Mov(mov) {
    MovesCount--;
    return mov
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
            if (!(pirateRouteX[i][0] === Pirates[i].x && pirateRouteY[i][0] === Pirates[i].y)) {
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