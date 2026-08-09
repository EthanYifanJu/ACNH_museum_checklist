let fossilData = [];
let fossilNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(fossil) {
    const label = `Fossil_${String(fossil["Internal ID"]).padStart(5, "0")}`;
    const entry = fossilNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return fossil.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const tooltip = document.getElementById("tooltip");

    fossilData
        .filter(f => getName(f).toLowerCase().includes(searchQuery))
        .forEach(f => {

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[f.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="/icon/FtrIcon/${f["Filename"]}.png">

                <div>
                    <div class="name">${getName(f)}</div>

                    <div class="meta">
                    💰 ${f.Sell}
                    </div>
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
    const total = fossilData.length;
    const done = fossilData.filter(f => state[f.Name]).length;

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
    fetch("/data/fossil.json").then(r => r.json()),
    fetch("/itemName/STR_ItemName_34_Fossil.msbt.json").then(r => r.json())
]).then(([fossil, names]) => {
    fossilData = fossil;
    fossilNames = names;
    render();
});

