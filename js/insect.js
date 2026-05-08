let insectData = [];
let insectNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(insect) {
    const label = `Insect_${String(insect["Internal ID"]).padStart(5, "0")}`;
    const entry = insectNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return insect.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const month = document.getElementById("month").value;
    const tooltip = document.getElementById("tooltip");

    insectData
        .filter(i => getName(i).toLowerCase().includes(searchQuery))
        .forEach(i => {

            const nh = i[`NH ${month}`] || "";
            const sh = i[`SH ${month}`] || "NA";

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[i.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="/icon/BookInsectIcon/${i["Critterpedia Filename"]}.png">

                <div>
                    <div class="name">${getName(i)}</div>

                    <div class="meta">
                    💰 ${i.Sell} • 📍 ${i["Where/How"]} • 🌑 ${i.Weather}
                    </div>

                    ${timeline("NH", nh, "#22c55e")}
                    ${timeline("SH", sh, "#38bdf8")}
                </div>
            `;

            const checkbox = card.querySelector("input");
            checkbox.addEventListener("change", () => {
                state[i.Name] = checkbox.checked;
                save();
                render();
            });

            const name = card.querySelector(".name");

            name.onmousemove = (e) => {
                tooltip.style.display = "block";
                tooltip.style.left = e.pageX + 10 + "px";
                tooltip.style.top = e.pageY + 10 + "px";
                tooltip.textContent = i.Description;
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
    const total = insectData.length;
    const done = insectData.filter(i => state[i.Name]).length;

    document.getElementById("progressText").innerText =
        `${done} / ${total} caught`;

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

document.getElementById("month").addEventListener("change", render);

/* ---------------- LOAD ---------------- */

Promise.all([
    fetch("/data/insect.json").then(r => r.json()),
    fetch("/itemName/STR_ItemName_30_Insect.msbt.json").then(r => r.json())
]).then(([insect, names]) => {
    insectData = insect;
    insectNames = names;
    render();
});

const now = new Date().toLocaleString("en-AU", { month: "short" });
document.getElementById("month").value = now;
