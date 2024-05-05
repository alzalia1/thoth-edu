import { Pconfirm, Palert, Pinput } from "../../../shared/scripts/modules/utils.js";

/**
 * Permet de construire une liste dans une div
 * @param {HTMLDivElement} pDiv - Div dans laquelle insérer la liste
 * @param {Array} list - liste de chaque élément (couple name/id + status/note)
 */
export function construct(pDiv, list, pageTo) {
    const table = document.createElement("table");

    let ref = {
        name: true,
        status: false,
        note: false,
    };
    let order = {};

    /** ========
     *   HEADER
     *  ========
     */

    const theader = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const hname = document.createElement("th");
    order.name = { status: 0, object: hname, column: Object.keys(order).length + 1 };
    hname.textContent = "Nom";
    hname.addEventListener("click", () => {
        orderHandler(order, "name", tbody);
    });
    theader.appendChild(hname);

    // Check the presence of notes/status
    list.forEach((el) => {
        if (el.status) {
            ref.status = true;
        }

        if (el.note) {
            ref.note = true;
        }

        if (ref.note && ref.status) {
            return;
        }
    });

    if (ref.status) {
        const hstatus = document.createElement("th");
        order.status = { status: 0, object: hstatus, column: Object.keys(order).length + 1 };
        hstatus.textContent = "Status";
        hstatus.addEventListener("click", () => {
            orderHandler(order, "status", tbody);
        });
        theader.appendChild(hstatus);
    }

    if (ref.note) {
        const hnote = document.createElement("th");
        order.note = { status: 0, object: hnote, column: Object.keys(order).length + 1 };
        hnote.textContent = pageTo.param == "c" ? "Note (/20)" : "Moyenne (/20)";
        hnote.addEventListener("click", () => {
            orderHandler(order, "note", tbody);
        });
        theader.appendChild(hnote);
    }

    table.appendChild(theader);

    /** ======
     *   BODY
     *  ======
     */
    list.forEach((el) => {
        const div = document.createElement("tr");
        div.className = "listRow";
        div.addEventListener("click", () => {
            window.location.href = `https://professeur.thoth-edu.fr/dashboard/${pageTo.url}?${pageTo.param}=${el.id}`;
        });

        // Name
        const name = document.createElement("td");
        name.textContent = el.name;
        div.append(name);

        // Status if one :
        if (ref.status) {
            const status = document.createElement("td");
            switch (el.status) {
                case 0:
                    status.textContent = "À venir";
                    break;

                case 1:
                    status.textContent = "En cours";
                    break;

                case 2:
                    status.textContent = "Terminé";
                    break;

                default:
                    status.textContent = "Non déterminé";
                    break;
            }
            div.append(status);
        }

        // Note if one :
        if (ref.note) {
            const note = document.createElement("td");
            if (el.note) {
                note.textContent = el.note.toString();
            }
            div.append(note);
        }

        tbody.appendChild(div);
    });

    table.appendChild(tbody);

    pDiv.append(table);
}

/**
 * Trie le tableau selon un paramètre particulier
 * @param {number} column - Numéro de la colonne
 * @param {HTMLTableElement} body - le tbody du tableau à modifier
 * @param {boolean} ascending - true (default) = croissant, false = décroissant
 */
function orderBy(column, body, ascending = true) {
    const rows = Array.from(body.children);

    rows.sort((a, b) => {
        const cellA = a.querySelector(`td:nth-child(${column})`).textContent;
        const cellB = b.querySelector(`td:nth-child(${column})`).textContent;

        if (ascending) {
            return cellA.localeCompare(cellB);
        } else {
            return cellB.localeCompare(cellA);
        }
    });

    body.innerHTML = "";
    rows.forEach((row) => body.append(row));
}

/**
 * Permet de trouver l'ancienne colonne de tri, et en enlever l'indicateur
 * @param {object} obj - Objet avec les données sur l'ordre
 */
function findAncientOrder(obj) {
    for (let key in obj) {
        if (obj[key].status == 1 || obj[key].status == 2) {
            obj[key].object.textContent = obj[key].object.textContent.slice(0, -1);
            obj[key].status = 0;
        }
    }
}

function orderHandler(order, key, tbody) {
    if (order[key].status == 0) {
        findAncientOrder(order);
        orderBy(order[key].column.toString(), tbody);
        order[key].object.textContent = order[key].object.textContent + "⮟";
        order[key].status++;
    } else if (order[key].status == 2) {
        orderBy(order[key].column.toString(), tbody);
        order[key].object.textContent = order[key].object.textContent.slice(0, -1) + "⮟";
        order[key].status--;
    } else {
        orderBy(order[key].column.toString(), tbody, false);
        order[key].object.textContent = order[key].object.textContent.slice(0, -1) + "⮝";
        order[key].status++;
    }
}
