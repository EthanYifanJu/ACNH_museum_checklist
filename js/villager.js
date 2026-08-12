let villagerData = [];
let villagerNames = {};
let villagerPhrases = {};
let musicNames = {};
let musicData = [];
let raceData = [];
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

const labels = {
    Species: {
        USen: "Species",
        EUen: "Species",
        EUde: "Art",
        EUes: "Especie",
        EUfr: "Espèce",
        EUit: "Specie",
        EUnl: "Soort",
        EUru: "Вид",
        CNzh: "种类",
        TWzh: "種類",
        JPja: "種族",
        KRko: "종족"
    },

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

    Personality: {
        USen: "Personality",
        EUen: "Personality",
        EUde: "Persönlichkeit",
        EUes: "Personalidad",
        EUfr: "Personnalité",
        EUit: "Personalità",
        EUnl: "Persoonlijkheid",
        EUru: "Характер",
        CNzh: "性格",
        TWzh: "個性",
        JPja: "性格",
        KRko: "성격"
    },

    Subtype: {
        USen: "Subtype",
        EUen: "Subtype",
        EUde: "Untertyp",
        EUes: "Subtipo",
        EUfr: "Sous-type",
        EUit: "Sottotipo",
        EUnl: "Subtype",
        EUru: "Подтип",
        CNzh: "子类型",
        TWzh: "子類型",
        JPja: "サブタイプ",
        KRko: "하위 유형"
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

    Catchphrase: {
        USen: "Catchphrase",
        EUen: "Catchphrase",
        EUde: "Spruch",
        EUes: "Muletilla",
        EUfr: "Phrase fétiche",
        EUit: "Frase tipica",
        EUnl: "Uitdrukking",
        EUru: "Фраза",
        CNzh: "口头禅",
        TWzh: "口頭禪",
        JPja: "口ぐせ",
        KRko: "말버릇"
    },

    FavoriteSong: {
        USen: "Favorite Song",
        EUen: "Favorite Song",
        EUde: "Lieblingslied",
        EUes: "Canción favorita",
        EUfr: "Chanson préférée",
        EUit: "Canzone preferita",
        EUnl: "Favoriete nummer",
        EUru: "Любимая песня",
        CNzh: "最喜欢的歌曲",
        TWzh: "最喜歡的歌曲",
        JPja: "好きな曲",
        KRko: "좋아하는 노래"
    },

    FavoriteSaying: {
        USen: "Favorite Saying",
        EUen: "Favorite Saying",
        EUde: "Lieblingsspruch",
        EUes: "Frase favorita",
        EUfr: "Citation préférée",
        EUit: "Detto preferito",
        EUnl: "Favoriete uitspraak",
        EUru: "Любимая поговорка",
        CNzh: "最喜欢的名言",
        TWzh: "最喜歡的名言",
        JPja: "座右の銘",
        KRko: "좋아하는 말"
    }
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

function getName(villager) {
    const label = villager.Filename;
    const entry = villagerNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return villager.Name;

    return cleanName(entry.locale?.[lang]);
}

/* ---------------- PHRASE RESOLVER ---------------- */

function getPhrase(villager) {
    const label = villager.Filename;
    const entry = villagerPhrases.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return villager.Catchphrase;

    return entry.locale?.[lang];
}

/* ---------------- SONG RESOLVER ---------------- */
function getSongName(songName) {
    const song = musicData.find(m => m.Name === songName);

    if (!song) return songName;

    const label = `Music_${String(
        Number(song["Internal ID"]) + 1
    ).padStart(5, "0")}`;

    const entry = musicNames.find(x => x.label === label);

    if (!entry) return songName;

    return entry.locale?.[lang] || songName;
}

/* ---------------- RACE RESOLVER ---------------- */

function getRaceLabel(raceName, gender) {
    let raceLabel = "";
    switch (raceName.toLowerCase()) {
        case "anteater":
            raceLabel = "ant";
            break;
        case "bear":
            raceLabel = "bea";
            break;
        case "bird":
            raceLabel = "brd";
            break;
        case "bull":
            raceLabel = "bul";
            break;
        case "cat":
            raceLabel = "cat";
            break;
        case "bear cub":
            raceLabel = "cbr";
            break;
        case "chicken":
            raceLabel = "chn";
            break;
        case "cow":
            raceLabel = "cow";
            break;
        case "crocodile":
            raceLabel = "crd";
            break;
        case "deer":
            raceLabel = "der";
            break;
        case "dog":
            raceLabel = "dog";
            break;
        case "duck":
            raceLabel = "duk";
            break;
        case "elephant":
            raceLabel = "elp";
            break;
        case "frog":
            raceLabel = "frg";
            break;
        case "goat":
            raceLabel = "goa";
            break;
        case "gorilla":
            raceLabel = "gor";
            break;
        case "hamster":
            raceLabel = "ham";
            break;
        case "hippo":
            raceLabel = "hip";
            break;
        case "horse":
            raceLabel = "hrs";
            break;
        case "koala":
            raceLabel = "kal";
            break;
        case "kangaroo":
            raceLabel = "kgr";
            break;
        case "lion":
            raceLabel = "lon";
            break;
        case "monkey":
            raceLabel = "mnk";
            break;
        case "mouse":
            raceLabel = "mus";
            break;
        case "octopus":
            raceLabel = "ocp";
            break;
        case "ostrich":
            raceLabel = "ost";
            break;
        case "eagle":
            raceLabel = "pbr";
            break;
        case "penguin":
            raceLabel = "png";
            break;
        case "pig":
            raceLabel = "pig";
            break;
        case "rabbit":
            raceLabel = "rbt";
            break;
        case "rhinoceros":
            raceLabel = "rhn";
            break;
        case "sheep":
            raceLabel = "shp";
            break;
        case "squirrel":
            raceLabel = "squ";
            break;
        case "tiger":
            raceLabel = "tig";
            break;
        case "wolf":
            raceLabel = "wol";
            break;
        default:
            raceLabel = raceName;
    }
    switch (gender) {
        case "Male":
            raceLabel += "_M";
            break;
        case "Female":
            raceLabel += "_F";
            break;
    }

    return raceLabel;
}

function cleanName(name) {
    if (!name) return "";

    return name
        .replace(/\{\{wordInfo[\s\S]*?\}\}/g, "")
        .replace(/\{\{wordCase[\s\S]*?\}\}/g, "")
        .trim();
}

function getRaceName(raceName, gender) {
    raceLabel = getRaceLabel(raceName, gender);

    console.log(raceLabel);

    const entry = raceData.find(x => x.label === raceLabel);

    if (!entry) return raceName;

    return cleanName(entry.locale?.[lang]) || raceName;
}

/* ---------------- LABELS RESOLVER ---------------- */

function getLabel(key) {
    return labels[key]?.[lang] || labels[key]?.["USen"] || key;
}

/* ---------------- PERSONALITY RESOLVER ---------------- */

function getPersonalityName(personality) {
    const personalityNames = {
        "Big sister": {
            USen: "Big sister",
            EUen: "Big sister",
            EUde: "Große Schwester",
            EUes: "Hermana mayor",
            EUfr: "Grande sœur",
            EUit: "Sorella maggiore",
            EUnl: "Grote zus",
            EUru: "Старшая сестра",
            CNzh: "大姐姐",
            TWzh: "大姊姊",
            JPja: "アネキ",
            KRko: "단순활발"
        },

        Cranky: {
            USen: "Cranky",
            EUen: "Cranky",
            EUde: "Miesepeter",
            EUes: "Gruñón",
            EUfr: "Grognon",
            EUit: "Burbero",
            EUnl: "Chagrijnig",
            EUru: "Ворчун",
            CNzh: "暴躁",
            TWzh: "暴躁",
            JPja: "コワイ",
            KRko: "무뚝뚝"
        },

        Jock: {
            USen: "Jock",
            EUen: "Jock",
            EUde: "Sportlich",
            EUes: "Atlético",
            EUfr: "Sportif",
            EUit: "Sportivo",
            EUnl: "Sportief",
            EUru: "Спортивный",
            CNzh: "运动",
            TWzh: "運動",
            JPja: "ハキハキ",
            KRko: "운동광"
        },

        Lazy: {
            USen: "Lazy",
            EUen: "Lazy",
            EUde: "Schlafmütze",
            EUes: "Perezoso",
            EUfr: "Paresseux",
            EUit: "Pigro",
            EUnl: "Lui",
            EUru: "Лентяй",
            CNzh: "悠闲",
            TWzh: "悠閒",
            JPja: "ぼんやり",
            KRko: "먹보"
        },

        Normal: {
            USen: "Normal",
            EUen: "Normal",
            EUde: "Ausgeglichen",
            EUes: "Normal",
            EUfr: "Normale",
            EUit: "Normale",
            EUnl: "Normaal",
            EUru: "Нормальный",
            CNzh: "普通",
            TWzh: "普通",
            JPja: "普通",
            KRko: "친절함"
        },

        Peppy: {
            USen: "Peppy",
            EUen: "Peppy",
            EUde: "Patzig",
            EUes: "Vivaz",
            EUfr: "Vive",
            EUit: "Vivace",
            EUnl: "Energiek",
            EUru: "Энергичная",
            CNzh: "元气",
            TWzh: "元氣",
            JPja: "元気",
            KRko: "활발함"
        },

        Smug: {
            USen: "Smug",
            EUen: "Smug",
            EUde: "Selbstgefällig",
            EUes: "Engreído",
            EUfr: "Arrogant",
            EUit: "Saccente",
            EUnl: "Zelfingenomen",
            EUru: "Самодовольный",
            CNzh: "自恋",
            TWzh: "自戀",
            JPja: "キザ",
            KRko: "느끼함"
        },

        Snooty: {
            USen: "Snooty",
            EUen: "Snooty",
            EUde: "Hochnäsig",
            EUes: "Petulante",
            EUfr: "Arrogante",
            EUit: "Snob",
            EUnl: "Arrogant",
            EUru: "Высокомерная",
            CNzh: "成熟",
            TWzh: "成熟",
            JPja: "オトナ",
            KRko: "성숙함"
        }
    };

    return personalityNames[personality]?.[lang] || personality;
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

    villagerData
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
                        src="../icon/NpcIcon/${v["Filename"]}.png"
                        alt="${getName(v)}"
                    >

                    <img
                        class="villager-post"
                        src="../icon/NpcBromide/NpcNml${v["Filename"].charAt(0).toUpperCase() + v["Filename"].slice(1)}.png"
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
                            <span class="label">${getLabel("Species")}</span>
                            <span>${getRaceName(v["Species"], v["Gender"])}</span>
                        </div>

                        <div class="detail">
                            <span class="label">${getLabel("Gender")}</span>
                            <span>${getGenderName(v["Gender"])}</span>
                        </div>

                        <div class="detail">
                            <span class="label">${getLabel("Personality")}</span>
                            <span>${getPersonalityName(v["Personality"])}</span>
                        </div>

                        <div class="detail">
                            <span class="label">${getLabel("Subtype")}</span>
                            <span>${v["Subtype"]}</span>
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

                    <div
                        class="villager-bubble"
                        style="background: ${bubbleColor};"
                    >
                        <div>
                            <span class="label">${getLabel("Catchphrase")}</span>
                            <span>${getPhrase(v)}</span>
                        </div>

                        <div>
                            <span class="label">${getLabel("FavoriteSong")}</span>
                            <span>${getSongName(v["Favorite Song"])}</span>
                        </div>

                        <div>
                            <span class="label">${getLabel("FavoriteSaying")}</span>
                            <span>${v["Favorite Saying"]}</span>
                        </div>
                    </div>

                </div>
            `;

            list.appendChild(card);
        });
}
/* ---------------- PROGRESS ---------------- */

function updateProgress() {
    const total = villagerData.length;
    const done = villagerData.filter(f => state[f.Name]).length;

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
    fetch("../data/villager.json").then(r => r.json()),
    fetch("../itemName/STR_NNpcName.msbt.json").then(r => r.json()),
    fetch("../itemName/STR_NNpcPhrase.msbt.json").then(r => r.json()),
    fetch("../itemName/STR_ItemName_82_Music.msbt.json").then(r => r.json()),
    fetch("../data/music.json").then(r => r.json()),
    fetch("../itemName/STR_Race.msbt.json").then(r => r.json()),
]).then(([villagers, names, phrases, songs, music, race]) => {
    villagerData = villagers;
    villagerNames = names;
    villagerPhrases = phrases;
    musicNames = songs;
    musicData = music;
    raceData = race;
    render();
});

