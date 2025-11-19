export class SaveSystem {
    save(data) {
        localStorage.setItem("mystery_save", JSON.stringify(data));
    }

    load() {
        return JSON.parse(localStorage.getItem("mystery_save")) || null;
    }
}