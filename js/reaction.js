let reactionData = [];
let reactionNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(reaction) {
    const label = `Reaction_${String(reaction["Internal ID"]).padStart(5, "0")}`;
    const entry = reactionNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return reaction.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const tooltip = document.getElementById("tooltip");

    reactionData
        .filter(r => getName(r).toLowerCase().includes(searchQuery))
        .forEach(r => {

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[r.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="/icon/ManpuIcon/${r["Icon Filename"]}.png">

                <div>
                    <div class="name">${getName(r)}</div>

                    <div class="meta">
                    📍 ${r.Source} | ${r["Source Notes"]} | ${r["Season/Event"]}
                    </div>

                    <div class="meta">
                    ${r["Source Notes"]}
                    </div>
                </div>
            `;

            const checkbox = card.querySelector("input");
            checkbox.addEventListener("change", () => {
                state[r.Name] = checkbox.checked;
                save();
                render();
            });

            const name = card.querySelector(".name");

            name.onmousemove = (e) => {
                tooltip.style.display = "block";
                tooltip.style.left = e.pageX + 10 + "px";
                tooltip.style.top = e.pageY + 10 + "px";
                tooltip.textContent = r["Source Notes"];
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
    const total = reactionData.length;
    const done = reactionData.filter(r => state[r.Name]).length;

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
    fetch("/data/reaction.json").then(r => r.json()),
    fetch("/itemName/STR_Emoticon.msbt.json").then(r => r.json())
]).then(([reaction, names]) => {
    reactionData = reaction;
    reactionNames = names;
    render();
});

