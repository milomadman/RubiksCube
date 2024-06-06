document.addEventListener("DOMContentLoaded", function() {
    normalColors();
});

var colorface;
var letters;
var pairs;
let positions = {}
var startletter;
var STARTLETTER;
var loop = 0;
var inplace = [];

function normalColors(){
    //set color of rectangles
    colorface = {
        R:"rgb(255, 0, 0)",
        L:"rgb(255, 165, 0)",
        U:"rgb(255, 255, 255)",
        D:"rgb(255, 255, 0)",
        F:"rgb(0, 128, 0)",
        B:"rgb(0, 0, 255)",
    }

    for (i=0;i<6;i++){
        var elements =  document.getElementsByClassName(Object.keys(colorface)[i]);
        for (var j=0;j<elements.length;j++) {
            elements[j].setAttribute("fill", Object.values(colorface)[i]);
        }
    }

    document.getElementById("scramble").innerHTML = "&nbsp";
    document.getElementById("unScramble").style.visibility="hidden";
    document.getElementById("getLetters").style.visibility="hidden";
    document.getElementById("letters").innerHTML="&nbsp";
}

function generateScramble() {
    document.getElementById("unScramble").style.visibility="visible";
    document.getElementById("getLetters").style.visibility="visible";
    document.getElementById("letters").innerHTML = "&nbsp";
    startletter = "b";
    STARTLETTER = "E"

    var possible_faces = ["R","L","U","D","F","B"];
    var possible_turns = [" ","'","2"];
    var scramble_array =[];

    for (i=0; i<15; i++){
        var letter = possible_faces[getRandomInt(0, 5)]
        var turn = possible_turns[getRandomInt(0,2)];
        scramble_array.push(letter+turn);

        var length = scramble_array.length;
        
        if (i>0){
            while (scramble_array[length-1][0] == scramble_array[length-2][0]){
                scramble_array[length-1] = possible_faces[getRandomInt(0, 5)] + turn;
            }
        }
    }

    document.getElementById("scramble").innerHTML = scramble_array.join("  ");

    doScramble(scramble_array);
}

function doScramble(scramble){
    var rects = document.getElementsByTagName('rect');
    var rect_col = [];
    var rect_name = [];


    //create the key and value arrays by getting the ids and fill colors
    for (s=0;s<rects.length;s++){
        if (!rects[s].classList.contains("Base")){
            rect_col.push(window.getComputedStyle(rects[s]).getPropertyValue("fill"));
            rect_name.push(rects[s].id);
        }  
    }

    //create the object with the keys and values
    for (let i = 0; i < rect_name.length; i++) {
        positions[rect_name[i]] = rect_col[i];
    }

    //for each part of the scramble we have to do
    for (i=0;i<scramble.length;i++){
        var turn = scramble[i][0];
        var dir = scramble[i][1];
        if (dir==" "){dir=1;}
        else if (dir=="'"){dir=3;}
        else if (dir=="2"){dir=2;};

        for (j=0;j<dir;j++){ // define the turns and replacements for all faces
            if (turn == "U"){
                rotatePositions(positions, ["a","b","c","d"]);
                rotatePositions(positions, ["A","B","C","D"]);
                rotatePositions(positions, ["i","e","q","m"]);
                rotatePositions(positions, ["I","E","Q","M"]);
                rotatePositions(positions, ["J","F","R","N"]);
            } else if (turn == "L"){
                rotatePositions(positions, ["e","f","g","h"]);
                rotatePositions(positions, ["E","F","G","H"]);
                rotatePositions(positions, ["d","l","x","r"]);
                rotatePositions(positions, ["D","L","X","R"]);
                rotatePositions(positions, ["A","I","U","S"]);
            }  else if (turn == "F"){
                rotatePositions(positions, ["i","j","k","l"]);
                rotatePositions(positions, ["I","J","K","L"]);
                rotatePositions(positions, ["c","p","u","f"]);
                rotatePositions(positions, ["C","P","U","F"]);
                rotatePositions(positions, ["D","M","V","G"]);
            } else if (turn == "R"){
                rotatePositions(positions, ["m","n","o","p"]);
                rotatePositions(positions, ["M","N","O","P"]);
                rotatePositions(positions, ["C","Q","W","K"]);
                rotatePositions(positions, ["b","t","v","j"]);
                rotatePositions(positions, ["B","T","V","J"]);
            } else if (turn == "B"){
                rotatePositions(positions, ["q","r","s","t"]);
                rotatePositions(positions, ["Q","R","S","T"]);
                rotatePositions(positions, ["a","h","w","n"]);
                rotatePositions(positions, ["B","E","X","O"]);
                rotatePositions(positions, ["A","H","W","N"]);
            } else if (turn == "D"){
                rotatePositions(positions, ["u","v","w","x"]);
                rotatePositions(positions, ["U","V","W","X"]);
                rotatePositions(positions, ["L","P","T","H"]);
                rotatePositions(positions, ["k","o","s","g"]);
                rotatePositions(positions, ["K","O","S","G"]);
            } 
        }
    }

    Object.entries(positions).forEach(([key,value])=>{
        document.getElementById(key).setAttribute("fill",value);
    });
}

function rotatePositions(obj, keys) {
    // Use array destructuring to rotate values among the specified keys
    let lastValue = obj[keys[keys.length - 1]]; // Save the last value to rotate
    for (let i = keys.length - 1; i > 0; i--) {
        obj[keys[i]] = obj[keys[i - 1]];
    }
    obj[keys[0]] = lastValue; // Complete the rotation
}

function getRandomInt(min, max) {
    min = Math.ceil(min); // Ensure min is rounded up to the nearest integer
    max = Math.floor(max); // Ensure max is rounded down to the nearest integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSmLetters(){
    letters = [startletter];
    var bool = true;
    var letter = startletter;

    while (bool){
        var partner = getPartner(letter);
        var aimedPlace = getPieceID([getColor(letter),getColor(partner)]);

        letters.push(aimedPlace);
        letter = aimedPlace;

        if (aimedPlace == startletter || aimedPlace == getPartner(startletter)){
            bool = findnewstart();
            letter = startletter;
        }
    }

    for (i=0;i<letters.length;i++){
        if (letters[i]=="b" || letters[i]=="m"){
            letters.splice(i,1);
        }
        if (letters[i]==letters[i+1]){
            letters.splice(i,2);
            i-=2;
        }
    }
    
    document.getElementById("letters").innerHTML = letters.join(" . ");

    if (letters.length % 2 != 0){
        document.getElementById("letters").innerHTML += "<br>"+ "do a permutation";
    }

    GETLETTERS()
}

function findnewstart(){
    var halfletters = Object.keys(pairs);
    for (i=0;i<halfletters.length;i++){
        if (!letters.includes(halfletters[i])){
            if (!letters.includes(getPartner(halfletters[i]))){
                if(!checkCorrect(halfletters[i])){//if piece isn't in the right spot
                    startletter = halfletters[i]
                    letters.push(startletter);
                    return true;
                } else {
                    letters.push(halfletters[i]);
                    letters.push(halfletters[i]);
                }
            }
            
        }
    }
    return false;
}

function checkCorrect(x){
    return x == getPieceID([getColor(x),getColor(getPartner(x))]);
}

function getPartner(x){
    pairs = {
        a: "q",
        b: "m",
        c: "i",
        d: "e",
        f: "l",
        g: "x",
        h: "r",
        j: "p",
        k: "u",
        n: "t",
        o: "v",
        s: "w",       
    };


    if (pairs.hasOwnProperty(x)){
        return pairs[x];
    } else {
        return(Object.keys(pairs).find(key => pairs[key] === x))
    }    
}

function getColor(x){
    //get the color of the face
    x = document.getElementById(x).attributes.fill.value;

    //convert RGB to the original face name
    x = Object.keys(colorface).find(key => colorface[key] === x);

    return x;
}   

function getArrayColor(x){
    var cols = [];
    for (i=0;i<x.length;i++){
        cols.push(getColor(x[i]));
    }
    return cols;
}

function getPieceID(x){
    var pieces = {
        a: ['U','B'],
        b: ['U','R'],
        c: ['U','F'],
        d: ['U','L'],
        e: ['L','U'],
        f: ['L','F'],
        g: ['L','D'],
        h: ['L','B'],
        i: ['F','U'],
        j: ['F','R'],
        k: ['F','D'],
        l: ['F','L'],
        m: ['R','U'],
        n: ['R','B'],
        o: ['R','D'],
        p: ['R','F'],
        q: ['B','U'],
        r: ['B','L'],
        s: ['B','D'],
        t: ['B','R'],
        u: ['D','F'],
        v: ['D','R'],
        w: ['D','B'],
        x: ['D','L'],
    }

    var pieceID = Object.keys(pieces).find(key => JSON.stringify(pieces[key]) === JSON.stringify(x));
    return (pieceID);
}

function GETLETTERS(){
    var LETTERS = [STARTLETTER];
    var BOOL = true;
    var Letter = STARTLETTER;

    while (BOOL){
        var PARTNERS = GETPARTNERS(Letter);
        var AIM = GETPIECEID([[getColor(Letter)],getArrayColor(PARTNERS).sort()]);

        LETTERS.push(AIM);
        Letter = AIM;

        console.log(AIM);
        console.log(STARTLETTER);

        if (AIM == STARTLETTER || GETPARTNERS(STARTLETTER).includes(AIM)){
            BOOL = FINDNEWSTART();
            Letter = STARTLETTER;
        }
    }
    
    

    document.getElementById("letters").innerHTML += "<br>"+ LETTERS.join(" .     ");
}

function FINDNEWSTART(){
    return false;
}

function GETPARTNERS(X){
    var triplets = [
        ["A","E","R"],
        ["B","N","Q"],
        ["C","J","M"],
        ["D","F","I"],
        ["G","L","U"],
        ["H","S","X"],
        ["K","P","V"],
        ["O","T","w"],
    ]
    
    for (i=0;i<triplets.length;i++){
        if (triplets[i].includes(X)){
            return triplets[i].filter(function (letter) {return letter !== X;}) //If we only want twins without the original single
        }
    }
}

function GETPIECEID(Z){
    var PIECES = {
        A: [['U'],['B','L']],
        B: [['U'],['B','R']],
        C: [['U'],['F','R']],
        D: [['U'],['F','L']],
        E: [['L'],['B','U']],
        F: [['L'],['F','U']],
        G: [['L'],['D','F']],
        H: [['L'],['B','D']],
        I: [['F'],['L','U']],
        J: [['F'],['R','U']],
        K: [['F'],['D','R']],
        L: [['F'],['D','L']],
        M: [['R'],['F','U']],
        N: [['R'],['B','U']],
        O: [['R'],['B','D']],
        P: [['R'],['D','F']],
        Q: [['B'],['R','U']],
        R: [['B'],['L','U']],
        S: [['B'],['D','L']],
        T: [['B'],['D','R']],
        U: [['D'],['F','L']],
        V: [['D'],['F','R']],
        W: [['D'],['B','R']],
        X: [['D'],['B','L']],
    }
    
    return Object.keys(PIECES).find(key => JSON.stringify(PIECES[key]) === JSON.stringify(Z));
}