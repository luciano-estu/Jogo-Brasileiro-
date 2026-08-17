const clubs = [
  "Athletico-PR",
  "Atlético-MG",
  "Bahia",
  "Botafogo",
  "Chapecoense",
  "Corinthians",
  "Coritiba",
  "Cruzeiro",
  "Flamengo",
  "Fluminense",
  "Grêmio",
  "Internacional",
  "Mirassol",
  "Palmeiras",
  "Red Bull Bragantino",
  "Remo",
  "Santos",
  "São Paulo",
  "Vasco",
  "Vitória"
];

// ===============================
// 8 FORMAÇÕES
// ===============================

const forms = {
  "4-3-3": [
    ["PE", "CA", "PD"],
    ["MEI", "MC", "MC"],
    ["LE", "ZAG", "ZAG", "LD"],
    ["GOL"]
  ],

  "4-4-2": [
    ["PE", "CA", "PD"],
    ["MEI", "MC", "VOL", "MEI"],
    ["LE", "ZAG", "ZAG", "LD"],
    ["GOL"]
  ],

  "4-2-3-1": [
    ["CA"],
    ["PE", "MEI", "PD"],
    ["VOL", "VOL"],
    ["LE", "ZAG", "ZAG", "LD"],
    ["GOL"]
  ],

  "4-3-1-2": [
    ["CA", "CA"],
    ["MEI"],
    ["MC", "VOL", "MC"],
    ["LE", "ZAG", "ZAG", "LD"],
    ["GOL"]
  ],

  "3-5-2": [
    ["CA", "CA"],
    ["PE", "MEI", "MC", "MEI", "PD"],
    ["ZAG", "ZAG", "ZAG"],
    ["GOL"]
  ],

  "3-4-3": [
    ["PE", "CA", "PD"],
    ["MEI", "MC", "MC", "MEI"],
    ["ZAG", "ZAG", "ZAG"],
    ["GOL"]
  ],

  "5-3-2": [
    ["CA", "CA"],
    ["MC", "VOL", "MC"],
    ["LE", "ZAG", "ZAG", "ZAG", "LD"],
    ["GOL"]
  ],

  "5-4-1": [
    ["CA"],
    ["PE", "MEI", "MC", "PD"],
    ["LE", "ZAG", "ZAG", "ZAG", "LD"],
    ["GOL"]
  ]
};


// ===============================
// POSIÇÕES
// ===============================

const pos = [
  "GOL",
  "GOL",
  "ZAG",
  "ZAG",
  "ZAG",
  "LE",
  "LD",
  "LE",
  "LD",
  "VOL",
  "VOL",
  "MC",
  "MC",
  "MEI",
  "MEI",
  "PE",
  "PD",
  "CA",
  "CA",
  "PE"
];


// ===============================
// NOMES GENÉRICOS
// ===============================

const names = [
  "Gabriel",
  "Rafael",
  "Lucas",
  "Matheus",
  "João",
  "Bruno",
  "Pedro",
  "Carlos",
  "Guilherme",
  "Marcos",
  "Thiago",
  "André",
  "Gustavo",
  "Felipe",
  "Daniel",
  "Ruan",
  "Vinícius",
  "Arthur",
  "Mateus",
  "Henrique"
];


// ===============================
// JOGADORES DOS CLUBES
// ===============================

const data = {};

clubs.forEach((club, clubIndex) => {

  data[club] = names.map((name, i) => {

    const overall =
      77 + ((clubIndex * 3 + i * 5) % 11);

    return [
      name + " " + club.split(" ")[0],
      pos[i],
      overall
    ];

  });

});


// ===============================
// CORITIBA
// ===============================

data["Coritiba"] = [

  ["Pedro Morisco", "GOL", 84],
  ["Pedro Rangel", "GOL", 80],

  ["Tinga", "LD", 82],
  ["Felipe Jonatan", "LE", 82],

  ["Maicon", "ZAG", 82],
  ["Rodrigo Moledo", "ZAG", 84],
  ["Bruno Melo", "ZAG", 78],

  ["Jacy", "VOL", 83],
  ["Vini Paulista", "VOL", 85],
  ["Thiago Santos", "VOL", 82],

  ["Sebastián Gómez", "MC", 86],

  // ⭐ OVR MÁXIMO
  ["Josué", "MEI", 99],

  ["Lucas Ronier", "MEI", 84],

  ["Lavega", "PD", 85],

  ["Breno Lopes", "PE", 87],

  ["Pedro Rocha", "PE", 84],

  ["Wallisson", "VOL", 80],

  ["Matheus Bianqui", "MC", 79],

  ["Robson", "CA", 82],

  ["Everaldo", "CA", 80]

];


// ===============================
// VARIÁVEIS DO JOGO
// ===============================

let team = {};

let used = [];

let club = null;

let pending = false;

let selectedSlot = "CA";

let formation = "4-3-3";

let league = null;

let peer = null;

let connection = null;

let remoteTeam = null;


// ===============================
// ATALHO
// ===============================

const $ = id => document.getElementById(id);


// ===============================
// TROCA DE TELAS
// ===============================

function show(screen) {

  const screens = [
    "home",
    "friends",
    "build",
    "league",
    "match"
  ];

  screens.forEach(id => {

    const element = $(id);

    if (element) {
      element.classList.toggle(
        "hide",
        id !== screen
      );
    }

  });

}


// ===============================
// MENU
// ===============================

function home() {
  show("home");
}

function solo() {

  resetGame();

  show("build");

}

function friends() {

  show("friends");

}


// ===============================
// FORMAÇÕES
// ===============================

const formationSelect =
  $("formation");

formationSelect.innerHTML =
  Object.keys(forms)
    .map(
      f => `<option value="${f}">${f}</option>`
    )
    .join("");


formationSelect.onchange = function () {

  formation =
    this.value;

  team = {};

  selectedSlot = "CA";

  renderField();

  updateStats();

};


// ===============================
// RESET
// ===============================

function resetGame() {

  team = {};

  used = [];

  club = null;

  pending = false;

  selectedSlot = "CA";

  formation = "4-3-3";

  league = null;

  remoteTeam = null;

  formationSelect.value =
    formation;

  $("draw").disabled = false;

  $("club").textContent =
    "Nenhum clube";

  $("players").innerHTML =
    "Sorteie um clube.";

  renderField();

  updateStats();

}


// ===============================
// CAMPO
// ===============================

function renderField() {

  const rows =
    forms[formation];

  $("field").innerHTML =
    rows.map(row => {

      return row.map(position => {

        const player =
          team[position];

        const selected =
          selectedSlot === position
            ? "sel"
            : "";

        const filled =
          player
            ? "filled"
            : "";

        const text =
          player
            ? `${player.name}<br>⭐${player.ovr}`
            : position;

        return `
          <span
            class="slot ${selected} ${filled}"
            onclick="selectPosition('${position}')">

            ${text}

          </span>
        `;

      }).join("");

    }).join("<br>");

}


// ===============================
// SELECIONAR POSIÇÃO
// ===============================

function selectPosition(position) {

  selectedSlot =
    position;

  renderField();

}


// ===============================
// OVR
// ===============================

function playerEffectiveOvr(
  player,
  position
) {

  if (
    player.pos === position
  ) {

    return player.ovr;

  }

  const similar =
    (
      player.pos === "MC" &&
      ["VOL", "MEI"].includes(position)
    ) ||

    (
      player.pos === "MEI" &&
      ["MC", "PE", "PD"].includes(position)
    ) ||

    (
      ["PE", "PD"].includes(player.pos) &&
      ["PE", "PD", "CA", "MEI"].includes(position)
    );

  if (similar) {

    return Math.max(
      50,
      player.ovr - 4
    );

  }

  return Math.max(
    50,
    player.ovr - 13
  );

}


// ===============================
// ESTATÍSTICAS DO TIME
// ===============================

function updateStats() {

  const players =
    Object.entries(team);

  $("n").textContent =
    players.length + "/11";

  if (players.length === 0) {

    $("ovr").textContent = "0";

  } else {

    let total = 0;

    players.forEach(
      ([position, player]) => {

        total +=
          playerEffectiveOvr(
            player,
            position
          );

      }
    );

    $("ovr").textContent =
      Math.round(
        total / players.length
      );

  }

  $("ready").disabled =
    players.length !== 11;

}


// ===============================
// SORTEAR CLUBE
// ===============================

function drawClub() {

  if (pending) {

    alert(
      "Escolha um jogador antes de sortear outro clube."
    );

    return;

  }

  const available =
    clubs.filter(
      c => !used.includes(c)
    );

  if (available.length === 0) {

    alert(
      "Todos os clubes já foram utilizados."
    );

    return;

  }

  club =
    available[
      Math.floor(
        Math.random() *
        available.length
      )
    ];

  pending = true;

  $("draw").disabled = true;

  $("club").textContent =
    "🎲 " + club;

  renderPlayers();

}


// ===============================
// LISTAR JOGADORES
// ===============================

function renderPlayers() {

  if (!club) {

    $("players").innerHTML =
      "Sorteie um clube.";

    return;

  }

  $("players").innerHTML =
    data[club]
      .map((player, index) => {

        return `
          <div class="player">

            <button
              class="pick"
              onclick="pickPlayer(${index})">

              Escolher

            </button>

            <b>${player[0]}</b>

            <br>

            <small>
              ${player[1]}
              • ⭐${player[2]}
            </small>

          </div>
        `;

      })
      .join("");

}


// ===============================
// ESCOLHER JOGADOR
// ===============================

function pickPlayer(index) {

  if (!pending) {

    return;

  }

  if (team[selectedSlot]) {

    alert(
      "Essa posição já está ocupada."
    );

    return;

  }

  const player =
    data[club][index];

  team[selectedSlot] = {

    name: player[0],

    pos: player[1],

    ovr: player[2],

    club: club

  };

  used.push(club);

  pending = false;

  $("draw").disabled = false;

  $("club").textContent =
    "🔒 " + club + " usado";

  $("players").innerHTML =
    "Sorteie outro clube.";

  renderField();

  updateStats();

  sendTeam();

}


// ===============================
// CONFIRMAR TIME
// ===============================

function ready() {

  if (
    Object.keys(team).length !== 11
  ) {

    alert(
      "Complete os 11 jogadores."
    );

    return;

  }

  if (connection) {

    sendTeam();

    show("match");

    checkFriend();

  } else {

    startLeague();

  }

}


// ===============================
// MODO SOLO
// ===============================

function startLeague() {

  show("league");

  const table = {};

  const opponents =
    clubs.filter(
      c => !used.includes(c)
    );

  opponents.forEach(
    c => {

      table[c] = {
        p: 0,
        j: 0,
        v: 0,
        e: 0,
        d: 0,
        gp: 0,
        gc: 0
      };

    }
  );

  table["Meu Time"] = {

    p: 0,
    j: 0,
    v: 0,
    e: 0,
    d: 0,
    gp: 0,
    gc: 0

  };

  league = {

    round: 0,

    table: table,

    opponents: opponents,

    scorers:
      Object.fromEntries(
        Object.values(team)
          .map(
            p => [p.name, 0]
          )
      )

  };

  $("round").textContent =
    "0/38";

  renderTable();

  renderScorers();

}


// ===============================
// SISTEMA DE EQUILÍBRIO
// ===============================

function teamPower() {

  const players =
    Object.entries(team);

  if (!players.length) {

    return 0;

  }

  let total = 0;

  players.forEach(
    ([position, player]) => {

      total +=
        playerEffectiveOvr(
          player,
          position
        );

    }
  );

  return total /
    players.length;

}


function opponentPower(clubName) {

  const players =
    data[clubName];

  let total = 0;

  players.forEach(
    player => {

      total += player[2];

    }
  );

  return total /
    players.length;

}


// ===============================
// GOLS
// ===============================

function randomGoals() {

  const r =
    Math.random();

  if (r < 0.25)
    return 0;

  if (r < 0.55)
    return 1;

  if (r < 0.78)
    return 2;

  if (r < 0.92)
    return 3;

  if (r < 0.98)
    return 4;

  return 5;

}


// ===============================
// PRÓXIMA RODADA
// ===============================

function next() {

  if (
    league.round >= 38
  ) {

    return;

  }

  const opponent =
    league.opponents[
      league.round %
      league.opponents.length
    ];

  const myPower =
    teamPower();

  const opponentPowerValue =
    opponentPower(
      opponent
    );

  /*
    Sistema de equilíbrio:

    diferença pequena =
    jogo mais imprevisível.

    diferença grande =
    time mais forte tem
    mais chance de vencer.
  */

  let balance =
    (
      myPower -
      opponentPowerValue
    ) / 15;

  balance +=
    (
      Math.random() -
      0.5
    ) * 1.4;

  let myGoals =
    randomGoals();

  let opponentGoals =
    randomGoals();

  if (
    balance > 0.5 &&
    Math.random() < 0.70
  ) {

    myGoals =
      Math.max(
        myGoals,
        opponentGoals + 1
      );

  }

  if (
    balance < -0.5 &&
    Math.random() < 0.70
  ) {

    opponentGoals =
      Math.max(
        opponentGoals,
        myGoals + 1
      );

  }

  if (
    Math.abs(balance) < 0.2 &&
    Math.random() < 0.30
  ) {

    opponentGoals =
      myGoals;

  }

  updateLeague(
    "Meu Time",
    opponent,
    myGoals,
    opponentGoals
  );

  const events = [];

  for (
    let i = 0;
    i < myGoals;
    i++
  ) {

    const players =
      Object.values(team);

    const scorer =
      players[
        Math.floor(
          Math.random() *
          players.length
        )
      ];

    league.scorers[
      scorer.name
    ]++;

    events.push(
      "⚽ " +
      scorer.name
    );

  }

  for (
    let i = 0;
    i < opponentGoals;
    i++
  ) {

    const players =
      data[opponent];

    const scorer =
      players[
        Math.floor(
          Math.random() *
          players.length
        )
      ];

    events.push(
      "🔴 " +
      scorer[0]
    );

  }

  league.round++;

  $("round").textContent =
    league.round +
    "/38";

  $("result").innerHTML =
    `
      <div class="score">
        Meu Time ${myGoals}
        ×
        ${opponentGoals}
        ${opponent}
      </div>

      ${
        events
          .map(
            e =>
              `<div class="goal">${e}</div>`
          )
          .join("")
      }
    `;

  renderTable();

  renderScorers();

}


// ===============================
// ATUALIZAR CLASSIFICAÇÃO
// ===============================

function updateLeague(
  home,
  away,
  goalsHome,
  goalsAway
) {

  const A =
    league.table[home];

  const B =
    league.table[away];

  A.j++;
  B.j++;

  A.gp += goalsHome;
  A.gc += goalsAway;

  B.gp += goalsAway;
  B.gc += goalsHome;

  // Vitória = 3
  // Empate = 1
  // Derrota = 0

  if (
    goalsHome >
    goalsAway
  ) {

    A.v++;
    A.p += 3;

    B.d++;

  } else if (
    goalsHome <
    goalsAway
  ) {

    B.v++;
    B.p += 3;

    A.d++;

  } else {

    A.e++;
    B.e++;

    A.p++;
    B.p++;

  }

}


// ===============================
// TABELA
// ===============================

function renderTable() {

  const rows =
    Object.entries(
      league.table
    ).sort(
      (a, b) => {

        const pts =
          b[1].p -
          a[1].p;

        if (pts !== 0)
          return pts;

        const sgA =
          a[1].gp -
          a[1].gc;

        const sgB =
          b[1].gp -
          b[1].gc;

        if (sgA !== sgB)
          return sgB - sgA;

        return b[1].gp -
          a[1].gp;

      }
    );

  $("table").innerHTML =
    `
      <table>

        <tr>
          <th>#</th>
          <th>Time</th>
          <th>PTS</th>
          <th>J</th>
          <th>V</th>
          <th>E</th>
          <th>D</th>
          <th>SG</th>
        </tr>

        ${
          rows
            .map(
              (row, index) => {

                const name =
                  row[0];

                const s =
                  row[1];

                return `
                  <tr
                    class="${
                      name ===
                      "Meu Time"
                        ? "mine"
                        : ""
                    }">

                    <td>
                      ${index + 1}
                    </td>

                    <td>
                      ${name}
                    </td>

                    <td>
                      <b>
                        ${s.p}
                      </b>
                    </td>

                    <td>
                      ${s.j}
                    </td>

                    <td>
                      ${s.v}
                    </td>

                    <td>
                      ${s.e}
                    </td>

                    <td>
                      ${s.d}
                    </td>

                    <td>
                      ${s.gp - s.gc}
                    </td>

                  </tr>
                `;

              }
            )
            .join("")
        }

      </table>
    `;

}


// ===============================
// ARTILHARIA
// ===============================

function renderScorers() {

  const list =
    Object.entries(
      league.scorers
    ).sort(
      (a, b) =>
        b[1] - a[1]
    );

  $("scorers").innerHTML =
    list
      .map(
        (item, index) => {

          return `
            <div class="art">

              <span>
                ${index + 1}.
                ${item[0]}
              </span>

              <b>
                ${item[1]} ⚽
              </b>

            </div>
          `;

        }
      )
      .join("");

}


// ===============================
// SIMULAR TODO
// ===============================

function allRounds() {

  while (
    league.round < 38
  ) {

    next();

  }

}


// =====================================================
// MODO AMIGOS
// =====================================================

function createRoom() {

  if (!window.Peer) {

    alert(
      "Não foi possível carregar o sistema de salas. Verifique sua internet."
    );

    return;

  }

  const roomCode =
    "7A0-" +
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  peer =
    new Peer(
      roomCode
    );

  peer.on(
    "open",
    () => {

      $("room").textContent =
        "Código da sala: " +
        roomCode +
        " — envie para seu amigo.";

    }
  );

  peer.on(
    "connection",
    connection => {

      setupConnection(
        connection
      );

    }
  );

}


function joinRoom() {

  const code =
    $("code")
      .value
      .trim()
      .toUpperCase();

  if (!code) {

    alert(
      "Digite o código da sala."
    );

    return;

  }

  if (!window.Peer) {

    alert(
      "PeerJS não carregou."
    );

    return;

  }

  peer =
    new Peer();

  peer.on(
    "open",
    () => {

      const connection =
        peer.connect(
          code,
          {
            reliable: true
          }
        );

      setupConnection(
        connection
      );

    }
  );

}


function setupConnection(
  connection
) {

  connection.on(
    "open",
    () => {

      conn =
        connection;

      $("room").textContent =
        "🟢 Conectado ao amigo!";

      show("build");

      resetGame();

      sendTeam();

    }
  );


  connection.on(
    "data",
    message => {

      if (
        message.type ===
        "TEAM"
      ) {

        remoteTeam =
          message;

        checkFriend();

      }


      if (
        message.type ===
        "RESULT"
      ) {

        $("friendResult")
          .innerHTML =
          message.html;

      }

    }
  );


  connection.on(
    "close",
    () => {

      $("friendStatus")
        .textContent =
        "🔴 O amigo desconectou.";

    }
  );

}


// ===============================
// ENVIAR TIME
// ===============================

function sendTeam() {

  if (
    conn &&
    conn.open
  ) {

    conn.send({

      type: "TEAM",

      team: team,

      ovr: Math.round(
        teamPower()
      )

    });

  }

}


// ===============================
// VERIFICAR OS DOIS TIMES
// ===============================

function checkFriend() {

  if (
    !remoteTeam
  ) {

    return;

  }

  const localReady =
    Object.keys(team)
      .length === 11;

  const remoteReady =
    Object.keys(
      remoteTeam.team
    ).length === 11;

  $("myOvr").textContent =
    Math.round(
      teamPower()
    );

  $("friendOvr").textContent =
    remoteTeam.ovr;

  if (
    localReady &&
    remoteReady
  ) {

    $("friendStatus")
      .textContent =
      "✅ Os dois times estão prontos!";

    $("play").disabled =
      false;

  } else {

    $("friendStatus")
      .textContent =
      "Aguardando os dois jogadores completarem os times.";

    $("play").disabled =
      true;

  }

}


// ===============================
// PARTIDA AMIGOS
// ===============================

function friendMatch() {

  if (
    !remoteTeam
  ) {

    return;

  }

  const myPower =
    teamPower();

  const friendPower =
    remoteTeam.ovr;

  let myGoals =
    randomGoals();

  let friendGoals =
    randomGoals();

  let balance =
    (
      myPower -
      friendPower
    ) / 15;

  balance +=
    (
      Math.random() -
      0.5
    ) * 1.3;


  if (
    balance > 0.5 &&
    Math.random() < 0.7
  ) {

    myGoals =
      Math.max(
        myGoals,
        friendGoals + 1
      );

  }


  if (
    balance < -0.5 &&
    Math.random() < 0.7
  ) {

    friendGoals =
      Math.max(
        friendGoals,
        myGoals + 1
      );

  }


  if (
    Math.abs(balance) < 0.2 &&
    Math.random() < 0.3
  ) {

    friendGoals =
      myGoals;

  }


  const html =
    `
      <div class="score">

        Meu Time
        ${myGoals}
        ×
        ${friendGoals}
        Amigo

      </div>

      <p>

        ${
          myGoals > friendGoals
            ? "🟢 Você venceu!"
            : myGoals < friendGoals
              ? "🔴 Seu amigo venceu!"
              : "🟡 Empate!"
        }

      </p>
    `;


  $("friendResult")
    .innerHTML =
    html;


  if (
    conn &&
    conn.open
  ) {

    conn.send({

      type: "RESULT",

      html: html

    });

  }

}


// ===============================
// INICIALIZAÇÃO
// ===============================

renderField();

updateStats();
