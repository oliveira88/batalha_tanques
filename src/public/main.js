import { Arena } from "../js/arena.js";
import { Colors } from "../js/colors.js";
import { Tank } from "../js/tank.js";
import { Boom } from "../js/boom.js";
import { Visualizer } from "../js/visualizer.js";
//// não mexa nessas linhas:
let windowHeight = $(window).height(),
  windowWidth = $(window).width(),
  lastUpdateScore = Date.now(),
  prologTankIDs = 0,
  timeForUpdatingProlog = 200;
const tankCanvas = document.getElementById("tankCanvas");
const neuralCanvas = document.getElementById("neuralCanvas");
tankCanvas.width = 1200; //windowWidth;
tankCanvas.height = 900; //windowHeight;
neuralCanvas.width = 600; //windowWidth;
neuralCanvas.height = 600; //windowWidth;
const tankCtx = tankCanvas.getContext("2d");
const neuralCtx = neuralCanvas.getContext("2d");
//prettier-ignore
const dummyTunkNames = /*from chatGPT*/ [
  "Boladão", "Rabugento", "Trovão", "Bagunceiro", "Marrento", "Trambiqueiro", "Espertinho",
  "Sorriso", "Soneca", "Maluco", "Zé Bala", "Trapalhão", "Fofinho", "Dengoso",
  "Terremoto", "Estabanado", "Cuspidor de Fogo", "Doidivanas", "Trovador", "Curioso", "Esquentadinho",
  "Pestinha", "Trapaceiro", "Esperto", "Relâmpago", "Roncador", "Surpresa", "Malandrinho",
  "Borbulhante", "Folgado", "Trovão Azul", "Espião", "Explosivo", "Cabeça de Vento", "Malabarista",
  "Tristonho", "Saltitante", "Dorminhoco", "Felpudo", "Arrasador", "Espirra-Água", "Trapaceiro",
  "Esquentado", "Reluzente", "Fofoqueiro", "Torpedo", "Dente de Leão", "Terrível", "Sapeca",
  "Bate-Papo", "Barulhento", "Faísca", "Linguarudo", "Abobalhado", "Bagunceiro", "Furacão",
  "Tagarela", "Artilheiro", "Engraçadinho", "Furioso", "Bicudo", "Mágico", "Espanta-Mosquito",
  "Ziguezague", "Estiloso", "Brincalhão", "Trancado", "Bagunçado", "Sorridente", "Tornado",
  "Desastrado", "Malabarista", "Mala Sem Alça", "Borbulhante", "Dorminhoco", "Trovão Azul", "Risadinha",
  "Bagunceiro", "Barulhento", "Fofinho", "Sorriso Largo", "Reluzente", "Esperto", "Arrepiante",
  "Mexeriqueiro", "Estelar", "Roncador", "Zigzag", "Fanfarrão", "Bate-Papo", "Trapaceiro",
  "Estourado", "Espirra-Água", "Bagunceiro", "Bagunça", "Trovador", "Saltitante", "Cabeça de Vento",
  "Veloz",
];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// Essa área pode ser configurada por você, mas aconselho não trocar o speed, arenaPadding e tamanho dos tanques.
const speed = 1.5,
  arenaPadding = 10,
  tankW = 50,
  tankH = 30,
  score = 100, // vida de cada tanque
  dummyTanks = 15, // quantidade de tanques aleatórios
  aiTank = false, // modifique para ter um tanque controlado pelo teclado
  keysTank = true,
  showNeural = false,
  numberOfAITanks = 15, // modifique para ter um tanque controlado pelo teclado
  // nome dos tanques controlados por Prolog (obs.: tem que adaptar o servidor.pl ao mexer aqui)
  // a quantidade é referente a quantidade de nomes, na falta de criatividade, o nome pode repetir... rs
  // exemplos de dois:
  //prologTanks=["Ligerin", "ApagaFogo"], // se quiser colocar dois tanques proloog, faça assim
  //prologTanks=["Ligerin"], // escolha aqui o nome de seu tanque controlado por prolog
  prologTanks = ["tanque0"], //se não quiser nenhum tanque prolog, faça assim
  showSensors = true, //modifique para mostrar os sensores dos tanques PROLOG e KEYS
  showSensorsOfDummyTanks = false; //modifique para mostrar os sensores dos tanques DUMMY
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (showNeural) {
  $("#neuralCanvas").show();
} else {
  $("#neuralCanvas").hide();
}
//// Não mexa daqui para baixo:
const arena = new Arena(tankCanvas.height, tankCanvas.width, arenaPadding);
const _colors = new Colors(0);
const tanks = [];
if (aiTank) {
  tanks.push(...generateTanks(numberOfAITanks));
}
let bestTank = tanks[0];
restore();
if (keysTank) tanks.push(newTank("KEYS", showSensors));
for (const _ of prologTanks) {
  tanks.push(newTank("PROLOG", showSensors));
}
for (let i = 0; i < dummyTanks; i++) {
  tanks.push(newTank("DUMMY", showSensorsOfDummyTanks));
}

let allBOOMS = new Array();
let lastBullet = new Array(tanks.length).fill(0);

animate();

// controls: ["DUMMY", "KEYS", "PROLOG"]
function newTank(controls = "DUMMY", showSensor) {
  let pos = getPosition(),
    name,
    id = -1;
  switch (controls) {
    case "PROLOG":
      name = prologTanks[prologTankIDs];
      id = prologTankIDs++;
      break;
    case "DUMMY":
      name =
        dummyTunkNames[
          Math.round(Math.random() * dummyTunkNames.length) %
            dummyTunkNames.length
        ];
      break;
    case "KEYS":
      name = "Humano";
      break;
    case "AI":
      name = "AI";
      break;
  }
  return new Tank(
    pos.x,
    pos.y,
    tankH,
    tankW,
    tankCanvas.height,
    tankCanvas.width,
    arenaPadding,
    controls,
    speed,
    _colors.getColor(),
    score,
    controls == "PROLOG" ? id : -1,
    name,
    timeForUpdatingProlog,
    showSensor
  );
}

function getPosition() {
  let tankPadding = arenaPadding + Math.max(tankH, tankW);
  let x = parseInt(
      Math.random() * (tankCanvas.width - tankPadding * 2) + tankPadding
    ),
    y = parseInt(
      Math.random() * (tankCanvas.height - tankPadding * 2) + tankPadding
    );
  return { x: x, y: y };
}

function getScores() {
  let ret = { scores: new Array(tanks.length), winner: undefined },
    aux;
  aux = 0;
  for (let i = 0; i < tanks.length; i++) {
    ret.scores[i] = tanks[i].score;
    if (tanks[i].score > 0)
      if (aux++ == 0) ret.winner = i;
      else ret.winner = undefined;
  }
  return ret;
}

function updateScoresDiv(scores) {
  let e = $("#id_score");
  e.empty();
  if (scores.winner != undefined) {
    $("#id_winner").text(
      "Vencedor: Tank " +
        scores.winner +
        " (" +
        tanks[scores.winner].name +
        "," +
        tanks[scores.winner].controlType +
        ")"
    );
    $("#id_km").hide();
  } else {
    lastUpdateScore = Date.now();
    for (let i = 0; i < scores.scores.length; i++) {
      e.append(
        '<label style="color:' +
          tanks[i].color +
          ';">' +
          tanks[i].name +
          ": " +
          scores.scores[i] +
          "</label>"
      );
    }
  }
}

$("#kmdiv").toggle();
updateScoresDiv(getScores());
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "s":
      $("#kmdiv").toggle();
      break;
  }
});

function updateCanvas() {
  // Updating booms (removing deactivted ones)
  let newBooms = new Array();
  for (let i = 0; i < allBOOMS.length; i++) {
    if (!allBOOMS[i].deactivated) newBooms.push(allBOOMS[i]);
  }
  allBOOMS = newBooms;

  // Updating tanks
  for (let i = 0; i < tanks.length; i++) {
    // Tanks list :
    let newTanks = new Array();
    for (let j = 0; j < tanks.length; j++) {
      if (i != j) newTanks.push(tanks[j]);
    }
    // For each tank, it will check the other tanks and bombs
    let boom = tanks[i].update(arena.borders, newTanks, allBOOMS);
    // If it goes more than 1000 milliseconds after the last bomb, it can fire again
    if (boom[0] && Math.abs(lastBullet[i] - Date.now()) > 1000) {
      let bomb = new Boom(boom[1], boom[2], boom[3], Math.max(tankH, tankW));
      lastBullet[i] = Date.now();
      allBOOMS.push(bomb);
    }
  }
  // bombs update:
  for (let i = 0; i < allBOOMS.length; i++) {
    allBOOMS[i].update(arena.position);
  }
}

function animate() {
  let scores = getScores();
  let runFinished = scores.winner != undefined;
  if (Date.now() - lastUpdateScore > 1000) updateScoresDiv(scores);

  updateCanvas();

  tankCtx.save();
  arena.draw(tankCtx);

  for (let i = 0; i < tanks.length; i++) {
    if (tanks[i].controlType == "DUMMY") {
      tankCtx.globalAlpha = 0.2;
      tanks[i].draw(tankCtx);
    } else {
      switch (tanks[i].name) {
        case "Humano":
          tankCtx.globalAlpha = 1;
          tanks[i].draw(tankCtx, "grey");
          break;
        case "AI":
          tankCtx.globalAlpha = 0.2;
          tanks[i].draw(tankCtx, "green");
          tanks[i].showSensor = false;
          break;
        case "tanque0":
          tankCtx.globalAlpha = 0.2;
          tanks[i].draw(tankCtx, "red");
          break;
        default:
          tanks[i].draw(tankCtx);
      }
    }
  }
  for (let i = 0; i < allBOOMS.length; i++) {
    if (allBOOMS[i] != undefined) allBOOMS[i].draw(tankCtx);
  }

  tankCtx.restore();

  if (runFinished) {
    scores = getScores();
    updateScoresDiv(scores);
    updateScoresDiv = function () {};
    $("#kmdiv").show();
  } else {
    const bestTank = tanks.find(
      (tank) =>
        tank.controlType == "AI" &&
        tank.score == Math.max(...tanks.map((tank) => tank.score))
    );
    if (bestTank) {
      tankCtx.globalAlpha = 1;
      bestTank.showSensor = true;
      bestTank.draw(tankCtx, "green");
      Visualizer.drawNeural(neuralCtx, bestTank.brain);
    }
    requestAnimationFrame(animate);
  }
}

function generateTanks(size) {
  const tanks = [];
  for (let i = 1; i < size; i++) {
    tanks.push(newTank("AI", false));
  }
  return tanks;
}

window.save = function save() {
  localStorage.setItem("bestTank", JSON.stringify(bestTank.brain));
};
window.discard = function discard() {
  localStorage.removeItem("bestTank");
};

function restore() {
  if (localStorage.getItem("bestTank")) {
    bestTank.brain = JSON.parse(localStorage.getItem("bestTank"));
  }
}
