let musicData = [];
let musicNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(music) {
    const label = `Music_${String(music["Internal ID"]).padStart(5, "0")}`;
    const entry = musicNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return music.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const tooltip = document.getElementById("tooltip");

    musicData
        .filter(m => getName(m).toLowerCase().includes(searchQuery))
        .forEach(m => {

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[m.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="../icon/FtrIcon/${m["Filename"]}.png">

                <div>
                    <div class="name">${getName(m)}</div>

                    <div class="meta">
                    💰 Buy: ${m.Buy} Sell: ${m.Sell} | 📍 ${m.Source}
                    </div>

                    <div class="meta">
                    ${m["Source Notes"]}
                    </div>
                </div>
            `;

            const checkbox = card.querySelector("input");
            checkbox.addEventListener("change", () => {
                state[m.Name] = checkbox.checked;
                save();
                render();
            });

            const name = card.querySelector(".name");

            name.onmousemove = (e) => {
                tooltip.style.display = "block";
                tooltip.style.left = e.pageX + 10 + "px";
                tooltip.style.top = e.pageY + 10 + "px";
                tooltip.textContent = m["Source Notes"];
            };

            name.onmouseleave = () => {
                tooltip.style.display = "none";
            };

            list.appendChild(card);
        });

    updateProgress();
}

/* ---------------- PROGRESS ---------------- */

function updateProgress() {
    const total = musicData.length;
    const done = musicData.filter(m => state[m.Name]).length;

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
    fetch("../data/music.json").then(r => r.json()),
    fetch("../itemName/STR_ItemName_82_Music.msbt.json").then(r => r.json())
]).then(([music, names]) => {
    musicData = music;
    musicNames = names;
    render();
});

