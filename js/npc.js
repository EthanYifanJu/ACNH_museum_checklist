let npcData = [];
let npcNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

const labels = {
    Gender: {
        USen: "Gender",
        EUen: "Gender",
        EUde: "Geschlecht",
        EUes: "Género",
        EUfr: "Genre",
        EUit: "Genere",
        EUnl: "Geslacht",
        EUru: "Пол",
        CNzh: "性别",
        TWzh: "性別",
        JPja: "性別",
        KRko: "성별"
    },

    Hobby: {
        USen: "Hobby",
        EUen: "Hobby",
        EUde: "Hobby",
        EUes: "Afición",
        EUfr: "Loisir",
        EUit: "Hobby",
        EUnl: "Hobby",
        EUru: "Хобби",
        CNzh: "爱好",
        TWzh: "興趣",
        JPja: "趣味",
        KRko: "취미"
    },

    Birthday: {
        USen: "Birthday",
        EUen: "Birthday",
        EUde: "Geburtstag",
        EUes: "Cumpleaños",
        EUfr: "Anniversaire",
        EUit: "Compleanno",
        EUnl: "Verjaardag",
        EUru: "День рождения",
        CNzh: "生日",
        TWzh: "生日",
        JPja: "誕生日",
        KRko: "생일"
    },
};

/* ---------------- GENDER RESOLVER ---------------- */
function getGenderName(gender) {
    const genderNames = {
        Male: {
            USen: "Male",
            EUen: "Male",
            EUde: "Männlich",
            EUes: "Macho",
            EUfr: "Mâle",
            EUit: "Maschio",
            EUnl: "Mannelijk",
            EUru: "Мужской",
            CNzh: "雄性",
            TWzh: "雄性",
            JPja: "オス",
            KRko: "수컷"
        },

        Female: {
            USen: "Female",
            EUen: "Female",
            EUde: "Weiblich",
            EUes: "Hembra",
            EUfr: "Femelle",
            EUit: "Femmina",
            EUnl: "Vrouwelijk",
            EUru: "Женский",
            CNzh: "雌性",
            TWzh: "雌性",
            JPja: "メス",
            KRko: "암컷"
        }
    };

    return genderNames[gender]?.[lang] || gender;
}

/* ---------------- NAME RESOLVER ---------------- */

function getName(npc) {
    const label = npc["NPC ID"];
    const entry = npcNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return npc.Name;

    return cleanName(entry.locale?.[lang]);
}

function cleanName(name) {
    if (!name) return "";

    return name
        .replace(/\{\{wordInfo[\s\S]*?\}\}/g, "")
        .replace(/\{\{wordCase[\s\S]*?\}\}/g, "")
        .trim();
}


/* ---------------- LABELS RESOLVER ---------------- */

function getLabel(key) {
    return labels[key]?.[lang] || labels[key]?.["USen"] || key;
}

/* ---------------- HOBBY RESOLVER ---------------- */

function getHobbyName(hobby) {
    const hobbyNames = {
        Education: {
            USen: "Education",
            EUen: "Education",
            EUde: "Bildung",
            EUes: "Educación",
            EUfr: "Éducation",
            EUit: "Istruzione",
            EUnl: "Educatie",
            EUru: "Образование",
            CNzh: "教育",
            TWzh: "教育",
            JPja: "教育",
            KRko: "교육"
        },

        Fashion: {
            USen: "Fashion",
            EUen: "Fashion",
            EUde: "Mode",
            EUes: "Moda",
            EUfr: "Mode",
            EUit: "Moda",
            EUnl: "Mode",
            EUru: "Мода",
            CNzh: "时尚",
            TWzh: "時尚",
            JPja: "ファッション",
            KRko: "패션"
        },

        Fitness: {
            USen: "Fitness",
            EUen: "Fitness",
            EUde: "Fitness",
            EUes: "Ejercicio",
            EUfr: "Sport",
            EUit: "Fitness",
            EUnl: "Fitness",
            EUru: "Фитнес",
            CNzh: "健身",
            TWzh: "健身",
            JPja: "フィットネス",
            KRko: "운동"
        },

        Music: {
            USen: "Music",
            EUen: "Music",
            EUde: "Musik",
            EUes: "Música",
            EUfr: "Musique",
            EUit: "Musica",
            EUnl: "Muziek",
            EUru: "Музыка",
            CNzh: "音乐",
            TWzh: "音樂",
            JPja: "音楽",
            KRko: "음악"
        },

        Nature: {
            USen: "Nature",
            EUen: "Nature",
            EUde: "Natur",
            EUes: "Naturaleza",
            EUfr: "Nature",
            EUit: "Natura",
            EUnl: "Natuur",
            EUru: "Природа",
            CNzh: "自然",
            TWzh: "自然",
            JPja: "自然",
            KRko: "자연"
        },

        Play: {
            USen: "Play",
            EUen: "Play",
            EUde: "Spielen",
            EUes: "Jugar",
            EUfr: "Jeu",
            EUit: "Giochi",
            EUnl: "Spelen",
            EUru: "Игра",
            CNzh: "玩耍",
            TWzh: "玩耍",
            JPja: "遊び",
            KRko: "놀이"
        }
    };

    return hobbyNames[hobby]?.[lang] || hobby;
}

/* ---------------- RENDER ---------------- */
function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    npcData
        .filter(v =>
            getName(v).toLowerCase().includes(searchQuery)
        )
        .forEach(v => {

            const card = document.createElement("div");
            card.className = "villager-card";

            const nameColor = v["Name Color"] || "#333333";
            const bubbleColor = v["Bubble Color"] || "#ffffff";

            card.innerHTML = `
                <div class="villager-images">

                    <img
                        class="villager-icon"
                        src="../icon/NpcIcon/${v["Icon Filename"]}.png"
                        alt="${getName(v)}"
                    >

                    <img
                        class="villager-post"
                        src="../icon/NpcBromide/NpcSp${v["Icon Filename"]}.png"
                        alt="${getName(v)}"
                        onerror="this.style.display='none';"
                    >

                </div>

                <div class="villager-info">

                    <h2
                        class="villager-name"
                        style="
                            color: ${nameColor};
                            background: ${bubbleColor};
                        "
                    >
                        ${getName(v)}
                    </h2>

                    <div class="villager-details">

                        <div class="detail">
                            <span class="label">${getLabel("Gender")}</span>
                            <span>${getGenderName(v["Gender"])}</span>
                        </div>

                        <div class="detail">
                            <span class="label">${getLabel("Gender")} (Asia)</span>
                            <span>${getGenderName(v["Gender (Asia)"])}</span>
                        </div>

                        <div class="detail">
                            <span class="label">${getLabel("Hobby")}</span>
                            <span>${getHobbyName(v["Hobby"])}</span>
                        </div>

                        <div class="detail">
                            <span class="label">${getLabel("Birthday")}</span>
                            <span>${v["Birthday"]}</span>
                        </div>

                    </div>

                </div>
            `;

            list.appendChild(card);
        });
}
/* ---------------- PROGRESS ---------------- */

function updateProgress() {
    const total = npcData.length;
    const done = npcData.filter(f => state[f.Name]).length;

    document.getElementById("progressText").innerText =
        `${done} / ${total} collected`;

    document.getElementById("progressFill").style.width =
        `${(done / total) * 100}%`;
}

/* ---------------- EVENTS ---------------- */

document.getElementById("search").addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase();
    render();
});

document.getElementById("lang").addEventListener("change", e => {
    lang = e.target.value;
    render();
});


/* ---------------- LOAD ---------------- */

Promise.all([
    fetch("../data/npc.json").then(r => r.json()),
    fetch("../itemName/STR_SNpcName.msbt.json").then(r => r.json())
]).then(([npcs, names]) => {
    npcData = npcs;
    npcNames = names;
    render();
});

