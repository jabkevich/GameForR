let beginShipX;
let beginShipY;
let LEN;
let MainMap;
let wild;
let piratePathOnX;
let piratePathOnY;
let shitPathOnX;
let shitPathOnY;
let scriptsForGodds;
let IDP;
let i;
let G;
let flagBuy;
let scripts;
let youHome;
let Pirates;
let shipN;
let shipS;
let shipW;
let shipE;
let X;
let Y;

let K;

export function startGame(levelMap, gameState) {
    console.log(gameState)
    console.log(levelMap)
    K=180;
    //инцилизация карты
    MainMap =MAP(levelMap)
    //инцилизация карты
    if(gameState.pirates.length>0){
        Pirates = gameState.pirates.length;
    }
    piratePathOnX = new Array(Pirates)
    piratePathOnY = new Array(Pirates)
    shipN = undefined;
    shipS = undefined;
    shipE = undefined;
    shipW = undefined;


    X = gameState.ship.x;
    Y = gameState.ship.y;
    //начальные координаты
    beginShipX = gameState.ship.x;
    beginShipY = gameState.ship.y;
    //начальные координаты
    i=-1;
    G=0;
    flagBuy=false;


    youHome=true;
    getNextCommand(gameState)
}


export function getNextCommand(gameState) {
    if (i == -1) {
        i++;
        K--;
        return "N"
    }
    if((G>=scriptsForGodds)&&(gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)){
        G=0;
        flagBuy=false;
    }

    if(!flagBuy) {
        flagBuy=true;
        scripts= MaxPOfPort(gameState.prices, gameState.goodsInPort, gameState.ports,gameState);
    }

    if((gameState.ship.x === gameState.ports[0].x) && (gameState.ship.y === gameState.ports[0].y)&&(G<scriptsForGodds/2)){
        G++;
        youHome =true;
        K--;
        return scripts[G-1];
    }
    if((gameState.ship.x === gameState.ports[IDP].x) && (gameState.ship.y ===gameState.ports[IDP].y)&&(G>=scriptsForGodds/2)&&(G<scriptsForGodds)){
        G++;
        youHome = false;
        K--;
        return scripts[G-1];
    }
    if(youHome) {
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[IDP].x, gameState.ports[IDP].y, gameState)
        // .concat(BakWildofPort(MinWildOfPortNum(MainMap, beginShipX, beginShipY, gameState.ports[IDP].x, gameState.ports[IDP].y)))
    }else{
        wild = MinWildOfPortNum(MainMap, gameState.ship.x, gameState.ship.y, gameState.ports[0].x, gameState.ports[0].y, gameState)
    }
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

                if (((x + 2 === xNow) && (y + 2 === yNow)) || ((x + 1 === xNow) && (y + 2 === yNow)) || ((x + 2 === xNow) && (y + 1 === yNow)) || ((x + 1 === xNow) && (y + 1 === yNow))) { //1, фи, A, круглешочик
                    // console.log("1, фи, A, круглешочик")
                    // console.log("x = " + x + "; y = "+ y )
                    // console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] === "E" || wild[0] === "S")) {
                        if ((x + 1 === xNow) && (y + 1 === yNow)) {
                            if ((wild[0] === "E") && W) {
                                if (MainMap[y - 1][x] !== "#") {
                                    K--;
                                    return "N"
                                } else {      K--;

                                    return "W"
                                }
                            }
                            if ((wild[0] === "E") && N) {
                                if (MainMap[y][x - 1] !== "#") {
                                    K--;
                                    return "W"
                                } else {
                                    K--;
                                    return "N"
                                }
                            }
                            if ((wild[0] === "S") && W) {
                                if (MainMap[y - 1][x] !== "#") {
                                    return "N";
                                    K--;
                                } else {      K--;

                                    return "W"
                                }
                            }
                            if ((wild[0] === "S") && N) {
                                if (MainMap[y][x - 1] !== "#") {
                                    return "W";
                                    K--;
                                } else {
                                    K--;
                                    return "N"
                                }
                            }
                        } // A
                        if ((x + 1 === xNow) && (y + 2 === yNow)) {
                            if ((wild[0] == "E") && N) {
                                if (MainMap[y][x - 1] != "#") {
                                    K--;
                                    return "W"
                                } else {
                                    K--;
                                    return "N"
                                }
                            }
                            if ((wild[0] == "S") && N) {
                                if (MainMap[y][x - 1] != "#") {
                                    K--;
                                    return "W"

                                } else {
                                    K--;
                                    return "N"
                                }
                            }
                            if ((wild[0] == "S") && W) {
                                if (MainMap[y][x + 1] != "#") {      K--;

                                    return "E"
                                } else {
                                    K--;
                                    return "WAIT"
                                }
                            }
                        } // фи
                        if ((x + 2 == xNow) && (y + 1 == yNow)) {
                            if ((wild[0] == "E") && W) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "N"
                                } else {      K--;
                                    return "W"
                                }
                            }
                            if ((wild[0] == "E") && N) {
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                            if ((wild[0] == "S") && W) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "N"
                                } else {      K--;
                                    return "W"
                                }
                            }
                        } //нолик
                        if ((x + 2 == xNow) && (y + 2 == yNow)) {
                            if (wild[0] == "E" && N) {
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                            if (wild[0] == "S" && W) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "N"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                        } //1
                    }
                }


                if (((x - 2 == xNow) && (y + 2 == yNow)) || ((x - 1 == xNow) && (y + 2 == yNow)) || ((x - 2 == xNow) && (y + 1 == yNow)) || ((x - 1 == xNow) && (y + 1 == yNow))) { //2, пси, B, квадратик
                    // console.log("2, пси, B, квадратик")
                    // console.log("x = " + x + "; y = "+ y )
                    // console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] == "W" || wild[0] == "S")) {
                        if ((x - 1 == xNow) && (y + 1 == yNow)) {
                            if ((wild[0] == "W") && E) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "N"
                                } else {      K--;
                                    return "E"
                                }
                            }
                            if ((wild[0] == "W") && N) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "N"
                                }
                            }
                            if ((wild[0] == "S") && E) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "N"
                                } else {      K--;
                                    return "E"
                                }
                            }
                            if ((wild[0] == "S") && N) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "N"
                                }
                            } // B
                            if ((x - 1 == xNow) && (y + 2 == yNow)) {
                                if ((wild[0] == "W") && N) {
                                    if (MainMap[y][x + 1] != "#") {      K--;
                                        return "E"
                                    } else {      K--;
                                        return "N"
                                    }
                                }
                                if ((wild[0] == "S") && N) {
                                    if (MainMap[y][x + 1] != "#") {      K--;
                                        return "E"
                                    } else {      K--;
                                        return "N"
                                    }
                                }
                                if ((wild[0] == "S") && E) {
                                    if (MainMap[y][x - 1] != "#") {      K--;
                                        return "W"
                                    } else {      K--;
                                        return "WAIT"
                                    }
                                }
                            } // пси
                            if ((x - 2 == xNow) && (y + 1 == yNow)) {
                                if ((wild[0] == "W") && E) {
                                    if (MainMap[y - 1][x] != "#") {      K--;
                                        return "N"
                                    } else {      K--;
                                        return "W"
                                    }
                                }
                                if ((wild[0] == "W") && N) {
                                    if (MainMap[y + 1][x] != "#") {      K--;
                                        return "S"
                                    } else {      K--;
                                        return "WAIT"
                                    }
                                }
                                if ((wild[0] == "S") && E) {
                                    if (MainMap[y - 1][x] != "#") {      K--;
                                        return "N"
                                    } else {      K--;
                                        return "W"
                                    }
                                }
                            } //квадратик
                            if ((x - 2 === xNow) && (y + 2 === yNow)) {
                                if (wild[0] === "W" && N) {
                                    if (MainMap[y + 1][x] != "#") {      K--;
                                        return "S"
                                    } else {      K--;
                                        return "WAIT"
                                    }
                                }
                                if (wild[0] === "S" && E) {
                                    if (MainMap[y - 1][x] !== "#") {      K--;
                                        return "N"
                                    } else {      K--;
                                        return "WAIT"
                                    }
                                }
                            } //2
                        }
                    }
                }

                if (((x + 2 === xNow) && (y - 2 === yNow)) || ((x + 1 === xNow) && (y - 2 == yNow)) || ((x + 2 === xNow) && (y - 1 === yNow)) || ((x + 1 === xNow) && (y - 1 === yNow))) { //3, лямда, C, палочка
                    // console.log("3, лямда, C, палочка")
                    // console.log("x = " + x + "; y = "+ y )
                    // console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] === "E" || wild[0] === "N")) {
                        if ((x + 1 === xNow) && (y - 1 === yNow)) {
                            if ((wild[0] === "E") && W) {
                                if (MainMap[y + 1][x] !== "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "E") && S) {
                                if (MainMap[y][x - 1] !== "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "S"
                                }
                            }
                            if ((wild[0] === "N") && W) {
                                if (MainMap[y + 1][x] !== "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "W"
                                }
                            }
                            if ((wild[0] === "N") && S) {
                                if (MainMap[y][x - 1] !== "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "S"
                                }
                            }
                        } // C
                        if ((x + 1 == xNow) && (y - 2 == yNow)) {
                            if ((wild[0] == "E") && S) {
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "S"
                                }
                            }
                            if ((wild[0] == "N") && S) {
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "S"
                                }
                            }
                            if ((wild[0] == "N") && W) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                        } // лямда
                        if ((x + 2 == xNow) && (y - 1 == yNow)) {
                            if ((wild[0] == "E") && W) {
                                if (MainMap[y + 1][x] != "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "W"
                                }
                            }
                            if ((wild[0] == "E") && S) {
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                            if ((wild[0] == "N") && W) {
                                if (MainMap[y + 1][x] != "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "W"
                                }
                            }
                        } //палочка
                        if ((x + 2 == xNow) && (y - 2 == yNow)) {
                            // console.log("3")
                            if (wild[0] == "E" && S) {
                                // console.log("E")
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "W"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                            if (wild[0] == "N" && W) {
                                // console.log("N")
                                if (MainMap[y + 1][x] != "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                        } //3
                    }
                }

                if (((x - 2 == xNow) && (y - 2 == yNow)) || ((x - 1 == xNow) && (y - 2 == yNow)) || ((x - 2 == xNow) && (y - 1 == yNow)) || ((x - 1 == xNow) && (y - 1 == yNow))) { //D, M, 4, треугольничик
                    // console.log("D, M, 4, треугольник")
                    //  console.log("x = " + x + "; y = "+ y )
                    //  console.log("xN = " + xNow + "; yN = "+ yNow )
                    if ((wild[0] == "W" || wild[0] == "N")) {
                        if ((x - 1 == xNow) && (y - 1 == yNow)) {
                            if ((wild[0] == "W") && E) {
                                console.log("1")
                                if (MainMap[y + 1][x] != "#") {      K--;
                                    console.log("S")
                                    return "S"
                                } else {      K--;
                                    return "E"
                                }
                            }
                            if ((wild[0] == "W") && N) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "S"
                                }
                            }
                            if ((wild[0] == "N") && E) {
                                if (MainMap[y + 1][x] != "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "E"
                                }
                            }
                            if ((wild[0] == "N") && N) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "S"
                                }
                            }
                        } // D
                        if ((x - 1 == xNow) && (y - 2 == yNow)) {
                            if ((wild[0] == "W") && N) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "S"
                                }
                            }
                            if ((wild[0] == "N") && N) {
                                if (MainMap[y][x + 1] != "#") {      K--;
                                    return "E"
                                } else {      K--;
                                    return "S"
                                }
                            }
                            if ((wild[0] == "N") && E) {
                                if (MainMap[y][x - 1] != "#") {      K--;
                                    return "WAIT"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                        } // мю
                        if ((x - 2 == xNow) && (y - 1 == yNow)) {
                            if ((wild[0] == "W") && E) {
                                if (MainMap[y + 1][x] != "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "W"
                                }
                            }
                            if ((wild[0] == "W") && N) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "WAIT"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                            if ((wild[0] == "N") && E) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "S"
                                } else {      K--;
                                    return "W"
                                }
                            }
                        } //треугольничик
                        if ((x - 2 == xNow) && (y - 2 == yNow)) {
                            if (wild[0] == "W" && S) {
                                if (MainMap[y - 1][x] != "#") {      K--;
                                    return "WAIT"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                            if (wild[0] == "N" && E) {
                                if (MainMap[y][x-1] != "#") {      K--;
                                    return "WAIT"
                                } else {      K--;
                                    return "WAIT"
                                }
                            }
                        } //4
                    }
                }
                if (((y + 3 === yNow) || (y + 2 === yNow)) && ((x - 1 === xNow) || (x === xNow) || (x + 1 === xNow))) { //!@#%
                    if(E||W){
                        if(wild[0]==="S"){      K--;
                            return "WAIT"}
                    }
                    if(N&&(wild[0]==="S")){      K--;
                        return "E"
                    }
                }
                if (((y - 3 === yNow) || (y - 2 === yNow)) && ((x - 1 == xNow) || (x == xNow) || (x + 1 == xNow))) { //BKNM
                    if(E||W){
                        if(wild[0]==="N"){      K--;
                            return "WAIT"}
                    }
                    if(S&&(wild[0]==="N")){      K--;
                        return "E"
                    }


                }
                if (((x - 2 == xNow) || (x - 3 == xNow)) && ((y + 1 == yNow) || (y == yNow) || (y - 1 == yNow))) { //zxcv
                    // console.log("zxcv")
                    if(N||S){
                        if(wild[0]=="E"){      K--;
                            return "WAIT"
                        }
                    }
                    if(E&&(wild[0]==="W")){
                        if(y-2==yNow) {      K--;
                            return "W"
                        }else if(y+2==yNow){      K--;return "W"}else {
                            if(y==yNow){
                                if(MainMap[y+1][x]!="#"){    K--;return "S"}else{  K--;return "N"}
                            }

                        }
                    }
                }
                if (((x + 2 == xNow) || (x + 3 == xNow)) && ((y - 1 == yNow) || (y == yNow) || (y + 1 == yNow))) { //OIPU
                    // console.log("OIPU")
                    if(N||S){
                        if(wild[0]=="W"){
                            // console.log("WAIT")
                            K--;
                            return "WAIT"
                        }
                    }
                    if(W&&(wild[0]==="E")){      K--;
                        // console.log("N")
                        return"N"
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
    // console.log(wild[0])
    // console.log("x = " + x + "; y = "+ y )
    // console.log("xN = " +  gameState.pirates[0].x + "; yN = "+ gameState.pirates[0].y)
    i++;
    K--;
    return wild[0];
}
/////////////////////

function MaxPOfPort(Ports, goods, PortsXY, gameState) {
    let scripts = new Array();
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
    let inp_val1=[]
    let Fun = []


    let Goods = new Array(goods.length);
    for (let i = 0; i < goods.length; i++) {
        Goods[i] = goods[i]["name"]
    }
    for(let i=0; i<max_ogran1; i++){
        inp_val1[i]=[]
        for(let j=0; j<max_x+1; j++){
            inp_val1[i][j]=0;
        }
    }
    for(let j=0; j<max_x+1;j++) {
        if(max_x===j){  inp_val1[0][j] = 368}else{ inp_val1[0][j] = goods[j].volume}
    }
    for (let j = 0; j < Ports.length; j++) {
        if (MinWildOfPortNum(MainMap, X, Y, PortsXY[j + 1].x, PortsXY[j + 1].y, gameState)) {   // проверка на существование пути
            let numberOfSteps = MinWildOfPortNum(MainMap, X, Y, PortsXY[j + 1].x, PortsXY[j + 1].y, gameState).length;
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
            Fun[max_x]=0
           let P =  simp(max_x,max_ogran1,inp_val1, Fun)
           let G = P[0];
            for(let i=0; i<G.length; i++){
                G[i]= Math.floor(G[i]);
            }

            if(((P[1]/(numberOfSteps))>MAXP)&&((numberOfSteps)<K)){
                MAXP = P[1]/(numberOfSteps);
                M= P[1];
                IDP = Ports[j].portId;
                GOODS = P[0]
            }
        }
    }

    if(GOODS!=undefined) {
        let scripts1 = []
        let c = 0;
        scriptsForGodds = 0;

        for (let i = 0; i < GOODS.length; i++) {
            if (GOODS[i] != 0) {
                scripts[scriptsForGodds] = "LOAD " + goods[i].name + " " + GOODS[i]
                scripts1[c] = "SELL " + goods[i].name + " " + GOODS[i];
                c++;
                scriptsForGodds++;
            }
        }
        scriptsForGodds += c;
        scripts = scripts.concat(scripts1)
    }else{
        console.log("HHA")
        scriptsForGodds = 0;
        IDP = 1;
        scripts[scriptsForGodds] = "WAIT";
        scriptsForGodds++;
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
function MapWithP(MAP, x, y) {
    let x1=[];
    for (let i=0; i<MAP.length; i++) {
        x1[i] = []
    }
    for(let i=0; i<MAP.length; i++){
        for(let j=0; j<MAP[0].length; j++){
            x1[i][j] = MAP[i][j]
        }
    }
    for(let i=x; i<=(x+1); i++){
        for(let j=y-1; j<=(y+1); j++){
            x1[j][i] = "#"
        }
    }
    return x1;
}

function MAP(gameState) {
    let row  = gameState.split("\n").length;
    let col = gameState.indexOf("\n")
    let beg=0;
    let map = new Array();
    for(let i=0; i<row; i++){
        map[i] = gameState.slice(beg,beg+col)
        beg +=col+1;
    }
    return map
}

function MinWildOfPortNum(map, x1, y1, x2, y2, gameState) { //вычисляет коротчайший путь до порта
    let scripts = [];

    let H = map.length-1;         // ширина рабочего поля  13
    let W = map[0].length-1;         // высота рабочего поля  18
    let WALL = -1;         // непроходимая ячейка
    let BLANK = -2;         // свободная непомеченная ячейка


    let px= new Array(), py = new Array();      // координаты ячеек, входящих  путь
    let len;                       // длина пути
    let grid = new Array(H);

    for (let i = 0; i <= H; i++) {
        grid[i] = new Array (W);
        for (let j = 0; j <= W; j++) {
            if (map[i][j].localeCompare("~")==0) {
                grid[i][j] = -2;
            }
            else if(map[i][j].localeCompare("#")==0){
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
    scripts[0] ="WAIT"
    if (grid[ay][ax] == WALL || grid[by][bx] == WALL) {return false; } // ячейка (ax, ay) или (bx, by) - стена

    // распространение волны
    d = 0;
    grid[ay][ax] = 0;            // стартовая ячейка помечена 0


    do {
        stop = true;               // предполагаем, что все свободные клетки уже помечены
        for (y = 0; y < H; ++y)
            for (x = 0; x < W; ++x)
                if (grid[y][x] == d)                         // ячейка (beginShipX, beginShipY) помечена числом d
                {
                    for (k = 0; k < 4; ++k)                    // проходим по всем непомеченным соседям
                    {
                        let iy = y + dy[k], ix = x + dx[k];
                        if (iy >= 0 && iy < H && ix >= 0 && ix < W &&
                            grid[iy][ix] == BLANK)
                        {
                            stop = false;              // найдены непомеченные клетки
                            grid[iy][ix] = d + 1;      // распространяем волну
                        }
                    }
                }
        d++;
    } while (!stop && grid[by][bx] == BLANK);
    if (grid[by][bx] == BLANK){return false;}   // путь не найден

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
                grid[iy][ix] == d)
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
        if(py[i]!=py[i-1]){
            if(py[i]>py[i-1]){

                scripts[i-1] = "S"
            }else{

                scripts[i-1] = "N"
            }
        }else if(px[i]!=px[i-1]){
            if(px[i]>px[i-1]){

                scripts[i-1] = "E"
            }else{

                scripts[i-1] = "W"
            }
        }
    }
    return scripts;
}


function BakWildofPort(BackWild) {
    let   Back = []
    for(let i = 0; i<BackWild.length; i++){
        Back[i] = BackWild[i]
    }

    for(let i=0; i<BackWild.length; i++){
        switch (BackWild[i]) {
            case "N": Back[i] = "S";break;
            case "S":Back[i] = "N";break;
            case "W": Back[i] = "E"; break;
            case "E": Back[i] = "W"; break;
        }
    }
    Back= Back.reverse();
    return Back;
}
///СИМПЛИКС МЕТОД


function simp(max_x, max_ogran1, inp_val1,Fun) {
    let iteration;
    var matrix = new Array();
    //	var count_ogr = $('#ogranichenie_block .ogranichenie').length;
    matrix = new Array();
    var i = 0;
    /*################## ШАГ 0 ##################*/
    // Перебираем все ограничения
    for (i = 0; i < max_ogran1; i++) {
        matrix[i] = new Array();
        for (var j = 0; j < max_x + 1; j++) {
            matrix[i][j] = inp_val1[i][j]; // Матрица исходных значений
        }
    }
    // Массив индексов по горизонтале
    let horisont_x = new Array();
    for (i = 0; i < max_x + 1; i++) {
        horisont_x[i] = i;
    }
    // Массив индексов по вертикале
    let vertical_x = new Array();
    for (i = 0; i < max_ogran1; i++) {
        vertical_x[i] = i + max_x;
    }
    // Матрица свободных членов
    var free = new Array();
    for (var k = 0; k < matrix.length; k++) {
        free[k] = matrix[k][max_x];
    }
    free[matrix.length] = 0;

    // Последняя строка сама функция
    // Добавим ее в основную матрицу
    matrix.push(Fun);

    // Есть ли  отрицательные элементы в матрице свободных членов ?
    if (minelm(free) < 0) {
        iteration = 0; // счетчик итераций, для защиты от зависаний
        step1(); // Переходим к шагу 1
    }
    // Есть ли  отрицательные элементы в коэфициентах функции (последняя строчка) ?
    if (minelm(matrix[matrix.length - 1], false, true) < 0) {
        iteration = 0; // счетчик итераций, для защиты от зависаний
        step2(); // Переходим к шагу 2
    }
    return (results()) // Отображаем результаты в понятном виде
    /*################## ШАГ1 ##################*/
    function step1() {
        iteration++;
        // находим ведущую строку
        var min_k_num = minelm(free, true, true);

        // находим ведущий столбец
        var min_k1 =minelm(free)
        if (minelm(matrix[min_k_num]) < 0) {
            var min_k1_num =minelm(matrix[min_k_num], true, true);
        } else {
            return false;
        }
        // Печатаем таблицу и выделяем на ней ведущие строку и столбец
        // Обновляем индексы элементов по горизонтале и вертикале
        let tmp = horisont_x[min_k1_num];
        horisont_x[min_k1_num] = vertical_x[min_k_num];
        vertical_x[min_k_num] = tmp;


        // Замена
        update_matrix(min_k_num, min_k1_num);
        // матрица свободных членов
        for (var k = 0; k < matrix.length; k++) {
            free[k] = matrix[k][max_x];
        }
        if (minelm(free, false, true) < 0 && iteration < 10) // нужно ли еще разок пройти второй шаг ?
            step1();

    }


    /*################## ШАГ2 ##################*/
    function step2() {
        iteration++;
        // находим ведущий столбец
        var min_col_num = minelm(matrix[matrix.length - 1], true, true);

        // находим ведущую строку
        var cols_count = matrix[0].length - 1;
        var min_row_num = 999;
        // эмпирический коэфициент, тк мы не знаем, положително ли нулевое отношение
        var min_row = 9999;
        var tmp = 0;
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
        tmp = horisont_x[min_k1_num];
        horisont_x[min_k1_num] = vertical_x[min_k_num];
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
        if (minelm(matrix[matrix.length - 1], false, true) < 0 && iteration < 10)
            step2();

    }

// Функция замены (обновления матрицы)
    function update_matrix(min_k_num, min_k1_num) {

        var matrix1 = new Array();

        for (i = 0; i < matrix.length; i++) {
            matrix1[i] = new Array()
            for (j = 0; j < matrix[0].length; j++) {
                if (i == min_k_num && j == min_k1_num) {
                    matrix1[i][j] =  1 / matrix[i][j];
                } else {
                    if (i == min_k_num) {
                        matrix1[i][j] = matrix[i][j] * 1 / matrix[min_k_num][min_k1_num];
                    } else {
                        if (j == min_k1_num) {
                            matrix1[i][j] = -matrix[i][j] * 1 / matrix[min_k_num][min_k1_num];
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
        var vars = new Array();
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
        let ansver= [vars, main_result]
        // console.log("F = " +  main_result)
        // console.log(vars)
        return ansver;
    }

    return false;
}
// Поиск минимального элемента
function minelm(v, dispnum, not_last){
    var m= v[0];
    var num= 0;
    var len=0;
    // если not_last, то последний элемент не учитываем в массиве
    if (not_last){
        len = v.length-2;
    }else{
        len = v.length-1;
    }
    for (var i=1; i <= len; i++){
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
