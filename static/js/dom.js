import {data_handler} from "./data_handler.js";
const wishedPlanetsHeaders = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population']

export const dom = {
    currentPlanetsObj: null,
    init: function () {
      this.getPlanets();
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

        document.getElementById('table').appendChild(table);
    },
    buildTableBody: function (headers, dataObj) {
        const tbody = document.createElement('tbody')
        dataObj.forEach(planet => {
            let tr = document.createElement('tr');

            for(let header of headers) {
                let td = document.createElement('td')
                td.innerText = planet[header];
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

        for(let header of headers) {
            let th = document.createElement('th');
            th.innerText = header;
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);
        return table;
    }
}