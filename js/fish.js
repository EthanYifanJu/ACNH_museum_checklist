let fishData = [];
let fishNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(fish) {
    const label = `Fish_${String(fish["Internal ID"]).padStart(5, "0")}`;
    const entry = fishNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return fish.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const month = document.getElementById("month").value;
    const tooltip = document.getElementById("tooltip");

    fishData
        .filter(f => getName(f).toLowerCase().includes(searchQuery))
        .forEach(f => {

            const nh = f[`NH ${month}`] || "";
            const sh = f[`SH ${month}`] || "NA";

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[f.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="../icon/BookFishIcon/${f["Critterpedia Filename"]}.png">

                <div>
                    <div class="name">${getName(f)}</div>

                    <div class="meta">
                    💰 ${f.Sell} • 📍 ${f["Where/How"]} • 🌑 ${f.Shadow}
                    </div>

                    ${timeline("NH", nh, "#22c55e")}
                    ${timeline("SH", sh, "#38bdf8")}
                </div>
            `;

            const checkbox = card.querySelector("input");
            checkbox.addEventListener("change", () => {
                state[f.Name] = checkbox.checked;
                save();
                render();
            });

            const name = card.querySelector(".name");

            name.onmousemove = (e) => {
                tooltip.style.display = "block";
                tooltip.style.left = e.pageX + 10 + "px";
                tooltip.style.top = e.pageY + 10 + "px";
                tooltip.textContent = f.Description;
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
    const total = fishData.length;
    const done = fishData.filter(f => state[f.Name]).length;

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
    fetch("../data/fish.json").then(r => r.json()),
    fetch("../itemName/STR_ItemName_31_Fish.msbt.json").then(r => r.json())
]).then(([fish, names]) => {
    fishData = fish;
    fishNames = names;
    render();
});

const now = new Date().toLocaleString("en-AU", { month: "short" });
document.getElementById("month").value = now;
