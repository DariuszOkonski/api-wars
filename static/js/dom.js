import { data_handler } from "./data_handler.js";

const wishedPlanetsHeaders = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'];
const residentsHeaders = ['name', 'height', 'mass', 'skin_color', 'hair_color', 'eye_color', 'birth_year', 'gender'];

export const dom = {
    currentPlanetsObj: null,
    buttons: {
        next: document.querySelector('#next'),
        previous: document.querySelector('#previous'),
    },
    currResidents: [],
    init: function () {
        this.getPlanets();
        this.setNavigationButtons();
    },
    getPlanets: function () {
        data_handler._api_get('https://swapi.dev/api/planets/', (response) => {
            this.currentPlanetsObj = response;
            this.renderPlanets()
        })
    },
    renderPlanets: function () {
        const table = this.createTableHeaders(wishedPlanetsHeaders);

        table.appendChild(this.fillTable(wishedPlanetsHeaders, this.currentPlanetsObj.results));

        document.getElementById('table').innerText = '';
        document.getElementById('table').appendChild(table);
    },
    fillTable: function (headers, dataObj) {
        const tableBody = document.createElement('tbody')
        dataObj.forEach(planet => {
            let row = document.createElement('tr');
            for (let header of headers) {
                let cell = document.createElement('td')
                if (header === 'residents') {
                    const button = this.appendResidentButton(planet.residents);
                    cell.appendChild(button);
                } else {
                    cell.innerText = planet[header];
                }
                row.appendChild(cell)
            }
            tableBody.appendChild(row);
        })
        return tableBody;
    },
    appendResidentButton(residents) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-sm');
        button.innerText = residents.length;
        button.addEventListener('click', () => {
            this.currResidents = [];
            this.updateResidents(residents, (residents) => {
                // gonna happen after currResidents is filled
                this.appendTableModal(residents)
            });
        });
        return button;
    },
    appendTableModal(residents) {
        const tableModal = this.showResidentModal(residents);
        document.body.appendChild(tableModal);
    },
    createTableHeaders: function (headers) {
        const table = document.createElement('table')
        table.classList.add('table')

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        for (let header of headers) {
            let th = document.createElement('th');
            th.innerText = header;
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);
        return table;
    },
    setNavigationButtons() {
        this.buttons.next.addEventListener('click', () => {
            this.loadNextPlanets();
        });
        this.buttons.previous.addEventListener('click', () => {
            this.loadPreviousPlanets();
        });
    },
    loadNextPlanets() {
        if (this.currentPlanetsObj.next) {
            data_handler._api_get(this.currentPlanetsObj.next, (response) => {
                this.currentPlanetsObj = response;
                this.renderPlanets();
            });
        };
    },
    loadPreviousPlanets() {
        if (this.currentPlanetsObj.previous) {
            data_handler._api_get(this.currentPlanetsObj.previous, (response) => {
                this.currentPlanetsObj = response;
                this.renderPlanets();
            });
        };
    },
    showResidentModal() {
        const modal = document.createElement('div');
        const tableGuts = this.fillTable(residentsHeaders, this.currResidents);
        const table = this.createTableHeaders(residentsHeaders);

        modal.classList.add('residents-modal');
        modal.addEventListener('click', () => modal.remove());
        table.classList.add('container-sm', 'table-resident');

        table.appendChild(tableGuts);
        modal.appendChild(table);
        return modal
    },
    updateResidents(data, callback) {
        let counter = 0
        for (let url of data) {
            data_handler.updateResidents(url, function (response) {
                counter++;
                dom.currResidents.push(response);
                if (counter === data.length) {
                    callback(data);
                }
            });
        };
    },
}