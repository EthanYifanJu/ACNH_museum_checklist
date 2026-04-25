/* ---------------- TIME ---------------- */

function to24(h, p) {
    p = p.toUpperCase();
    if (p === "AM") return h === 12 ? 0 : h;
    if (p === "PM") return h === 12 ? 12 : h + 12;
}

function parse(str) {
    if (!str || str === "NA") return null;
    if (str === "All day") return { start: 0, end: 24 };

    const m = str.match(/(\d+)\s*(AM|PM)\s*–\s*(\d+)\s*(AM|PM)/i);
    if (!m) return null;

    return {
        start: to24(+m[1], m[2]),
        end: to24(+m[3], m[4])
    };
}

function split(r) {
    if (!r) return [];
    if (r.start < r.end) return [r];
    return [
        { start: r.start, end: 24 },
        { start: 0, end: r.end }
    ];
}

function fmt(h) {
    if (h === 0 || h === 24) return "12 AM";
    if (h === 12) return "12 PM";
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

/* ---------------- TIMELINE ---------------- */

function timeline(label, val, color) {

    const isNH = label === "NH";

    const scale = `
        <div style="
        display:flex;
        justify-content:space-between;
        font-size:9px;
        color:#94a3b8;
        margin-bottom:2px;
        padding:0 2px;
        ">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>12 AM</span>
        </div>
    `;

    if (val === "All day") {
        return `
        <div class="timeline">
            ${scale}
            <div class="bar" style="
            background:${color};
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:11px;
            font-weight:600;
            ">
            </div>
            <div style="font-size:10px; color:#94a3b8; margin-top:2px;">
            ${isNH ? " North Hemisphere: " : " South Hemisphere: "}
                Whole day
            </div>
        </div>
        `;
    }

    const r = parse(val);
    if (!r) {
        return `
        <div class="timeline">
            ${scale}
            <div class="bar" style="color:#94a3b8; display:flex; align-items:center; justify-content:center;">
            </div>
            <div style="font-size:10px; color:#94a3b8; margin-top:2px;">
            ${isNH ? " North Hemisphere: " : " South Hemisphere: "}
                Not Available
            </div>
        </div>
        `;
    }

    const segs = split(r);

    return `
        <div class="timeline">
        ${scale}

        <div class="bar">
            ${segs.map(s => `
            <div class="seg" style="
                left:${(s.start / 24) * 100}%;
                width:${((s.end - s.start) / 24) * 100}%;
                background:${color};
            ">
            </div>
            `).join("")}
        </div>

        <div style="font-size:10px; color:#94a3b8; margin-top:2px;">
            ${isNH ? " North Hemisphere" : " South Hemisphere"}
                : ${fmt(r.start)} → ${fmt(r.end)}
        </div>
        </div>
    `;
}