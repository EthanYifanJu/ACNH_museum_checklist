let artData = [];
let artNames = {};
let idToLabel = {};

let searchQuery = "";
let lang = "USen";

/* ---------------- NAME RESOLVER ---------------- */

function getName(art) {
    const category = art.Tag;

    const suffix = art["Filename"].endsWith("Fake") ? "Fake" : "";

    const label = `${category}${suffix}_${String(art["Internal ID"]).padStart(5, "0")}`;

    const entry = artNames.find(x => x.label === label);

    console.log(label, entry);

    if (!entry) return art.Name;

    const name = entry.locale?.[lang] || art.Name;

    return art["Filename"].endsWith("Fake")
        ? `${name} (Fake)`
        : name;
}


/* ---------------- RENDER ---------------- */

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const tooltip = document.getElementById("tooltip");

    artData
        .filter(f => getName(f).toLowerCase().includes(searchQuery))
        .forEach(f => {

            const card = document.createElement("div");
            card.className = "card";

            const checked = state[f.Name];

            card.innerHTML = `
                <input type="checkbox" ${checked ? "checked" : ""}>

                <img src="../icon/art_images/${f["Filename"]}.png">

                <div>
                    <div class="name">${getName(f)}</div>

                    <div class="meta">
                    Real Artwork Title: ${f["Real Artwork Title"]}<br>
                    Artist: ${f["Artist"]}<br>
                    Source: ${f["Source"]}<br>
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
    const total = artData.length;
    const done = artData.filter(f => state[f.Name]).length;

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
    fetch("../data/art.json").then(r => r.json()),
    fetch("../itemName/STR_ItemName_01_Art.msbt.json").then(r => r.json())
]).then(([art, names]) => {
    artData = art;
    artNames = names;
    render();
});

