import { data_handler } from "./data_handler.js";

const wishedPlanetsHeaders = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'];
const wishedResidentsHeaders = ['name', 'height', 'mass', 'skin_color', 'hair_color', 'eye_color', 'birth_year', 'gender'];

export const dom = {
    currentPlanetsObj: null,
    buttons: {
        next: document.querySelector('#next'),
        previous: document.querySelector('#previous'),
    },
    currResidents: new Array(),
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
        const table = this.buildTableWithHeaders(wishedPlanetsHeaders);

        table.appendChild(this.buildTableBody(wishedPlanetsHeaders, this.currentPlanetsObj.results));

        document.getElementById('table').innerText = '';
        document.getElementById('table').appendChild(table);
    },
    buildTableBody: function (headers, dataObj) {
        const tbody = document.createElement('tbody')
        dataObj.forEach(planet => {
            let tr = document.createElement('tr');

            for (let header of headers) {
                let td = document.createElement('td')
                if (header === 'residents') {
                    const button = this.createResidentButton(planet[header]);
                    td.appendChild(button);
                } else {
                    td.innerText = planet[header];
                }
                tr.appendChild(td)
            }
            tbody.appendChild(tr);
        })
        return tbody;
    },
    buildTableWithHeaders: function (headers) {
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
    createResidentButton: function (residentUrls) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-sm');
        button.innerText = residentUrls.length;
        button.addEventListener('click', () => {
            this.getResidents(residentUrls)
                .then((values) => {
                    console.log(values)
                    this.createResidentModal(values)
                })
        });
        return button;
    },
    createResidentModal: function (residentData) {
        const modal = document.createElement('div');
        const table = this.buildTableWithHeaders(wishedResidentsHeaders);
        const tbody = this.buildTableBody(wishedResidentsHeaders, residentData)

        modal.classList.add('residents-modal');
        table.classList.add('container-sm', 'table-resident',);

        modal.addEventListener('click', () => {
            modal.remove();
            this.currResidents = [];
        });

        table.appendChild(tbody);
        modal.appendChild(table);

        document.body.appendChild(modal)
    },
    getResidents: function (urlArray) {
        const array = []

        urlArray.forEach((url) => {
            array.push(this.getResident(url))
        })

        return Promise.all(array).then((values) => values)
    },
    getResident: function (url) {
        return new Promise(resolve => {
            data_handler._api_get(url, (response) =>
                resolve(response));
        })
    },
}