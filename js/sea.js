let seaData = [];
let seaNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(sea) {
    const label = `DiveFish_${String(sea["Internal ID"]).padStart(5, "0")}`;
    const entry = seaNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return sea.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const month = document.getElementById("month").value;
    const tooltip = document.getElementById("tooltip");

    seaData
        .filter(s => getName(s).toLowerCase().includes(searchQuery))
        .forEach(s => {

            const nh = s[`NH ${month}`] || "";
            const sh = s[`SH ${month}`] || "NA";

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[s.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="../icon/BookDiveFishIcon/${s["Critterpedia Filename"]}.png">

                <div>
                    <div class="name">${getName(s)}</div>

                    <div class="meta">
                    💰 ${s.Sell} • 🌑 ${s.Shadow} • 🚀${s["Movement Speed"]}
                    </div>

                    ${timeline("NH", nh, "#22c55e")}
                    ${timeline("SH", sh, "#38bdf8")}
                </div>
            `;

            const checkbox = card.querySelector("input");
            checkbox.addEventListener("change", () => {
                state[s.Name] = checkbox.checked;
                save();
                render();
            });

            const name = card.querySelector(".name");

            name.onmousemove = (e) => {
                tooltip.style.display = "block";
                tooltip.style.left = e.pageX + 10 + "px";
                tooltip.style.top = e.pageY + 10 + "px";
                tooltip.textContent = s.Description;
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
    const total = seaData.length;
    const done = seaData.filter(s => state[s.Name]).length;

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
    fetch("../data/sea.json").then(r => r.json()),
    fetch("../itemName/STR_ItemName_32_DiveFish.msbt.json").then(r => r.json())
]).then(([sea, names]) => {
    seaData = sea;
    seaNames = names;
    render();
});

const now = new Date().toLocaleString("en-AU", { month: "short" });
document.getElementById("month").value = now;
