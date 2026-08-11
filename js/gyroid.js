let gyroidData = [];
let gyroidNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(gyroid) {
    const label = `Gyroid_${String(gyroid["Internal ID"]).padStart(5, "0")}`;
    const entry = gyroidNames.find(x => x.label === label);
    console.log(label, entry);
    if (!entry) return gyroid.Name;

    return entry.locale?.[lang];
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const tooltip = document.getElementById("tooltip");

    gyroidData
        .filter(g => getName(g).toLowerCase().includes(searchQuery))
        .forEach(g => {

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[g.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="../icon/FtrIcon/${g["Filename"]}.png">

                <div>
                    <div class="name">${getName(g)}</div>

                    <div class="meta">
                    Variant: ${g.Variation} | Sell: ${g.Sell} | Source: ${g.Source} | Sound: ${g["Sound Type"]}
                    </div>

                    <div class="meta">
                    ${g["Source Notes"]}
                    </div>
                </div>
            `;

            const checkbox = card.querySelector("input");
            checkbox.addEventListener("change", () => {
                state[g.Name] = checkbox.checked;
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
    const total = gyroidData.length;
    const done = gyroidData.filter(g => state[g.Name]).length;

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
    fetch("../data/gyroid.json").then(r => r.json()),
    fetch("../itemName/STR_ItemName_35_Gyroid.msbt.json").then(r => r.json())
]).then(([gyroid, names]) => {
    gyroidData = gyroid;
    gyroidNames = names;
    render();
});

