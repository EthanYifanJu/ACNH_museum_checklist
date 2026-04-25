let state = JSON.parse(localStorage.getItem("museum")) || {};

function save() {
    localStorage.setItem("museum", JSON.stringify(state));
}

function formatMonth() {
    return new Date().toLocaleString("en-AU", { month: "short" });
}