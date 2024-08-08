document.addEventListener("DOMContentLoaded", function () {
    graficad31();
    graficad32();
    graficad33();
});

function graficad31() {
    const csvUrl = 'https://raw.githubusercontent.com/EdisonFlores/Pruebas-d3chart/main/Parametrosfisio.csv';

    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#graficad3js1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Crear un div para el tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("font-size", "12px");

    d3.csv(csvUrl).then(data => {
        const filteredData = data.filter(d => d.RIO === 'RIO HUASAGA' && d.PUNTO === 'P1');

        if (filteredData.length === 0) {
            console.error("No se encontraron datos para el RIO HUASAGA en el PUNTO P1.");
            return;
        }

        const parseDate = d3.timeParse("%Y//%m/%d");

        filteredData.forEach(d => {
            const parsedDate = parseDate(d.FECHA);
            if (parsedDate) {
                d.FECHA = parsedDate;
            } else {
                console.error(`Fecha no válida encontrada: ${d.FECHA}`);
            }
            d['CALIDAD AGUA NSF'] = +d['CALIDAD AGUA NSF'];
        });

        const x = d3.scaleBand()
            .domain(filteredData.map(d => d.FECHA))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d['CALIDAD AGUA NSF'])])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"))); // Mostrar solo el año

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.FECHA))
            .attr("y", d => y(d['CALIDAD AGUA NSF']))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d['CALIDAD AGUA NSF']))
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "green");
                tooltip.style("visibility", "visible")
                    .html(`<strong>${d3.timeFormat("%Y-/%m-%d")(d.FECHA)}</strong><br>Calidad Agua NSF: <strong>${d['CALIDAD AGUA NSF']}</strong>`);
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "steelblue");
                tooltip.style("visibility", "hidden");
            });
    }).catch(error => {
        console.error("Error al cargar o procesar el CSV:", error);
    });
}




function graficad32() {
    const csvUrl = 'https://raw.githubusercontent.com/EdisonFlores/Pruebas-d3chart/main/Parametrosfisio.csv';

    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#graficad3js2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Crear un div para el tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("font-size", "12px");

    d3.csv(csvUrl).then(data => {
        let filteredData = data.filter(d => d.RIO === 'RIO HUASAGA' && d.PUNTO === 'P1');

        if (filteredData.length === 0) {
            console.error("No se encontraron datos para el RIO HUASAGA en el PUNTO P1.");
            return;
        }

        const parseDate = d3.timeParse("%Y//%m/%d");

        filteredData.forEach(d => {
            const parsedDate = parseDate(d.FECHA);
            if (parsedDate) {
                d.FECHA = parsedDate;
            } else {
                console.error(`Fecha no válida encontrada: ${d.FECHA}`);
            }
            d['CALIDAD AGUA NSF'] = +d['CALIDAD AGUA NSF'];
        });

        // Ordenar los datos cronológicamente
        filteredData.sort((a, b) => a.FECHA - b.FECHA);

        const x = d3.scaleTime()
            .domain(d3.extent(filteredData, d => d.FECHA))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d['CALIDAD AGUA NSF'])])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y"))); // Mostrar solo el año

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        const line = d3.line()
            .x(d => x(d.FECHA))
            .y(d => y(d['CALIDAD AGUA NSF']));

        svg.append("path")
            .datum(filteredData)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        // Agregar puntos con interacción
        svg.selectAll(".dot")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.FECHA))
            .attr("cy", d => y(d['CALIDAD AGUA NSF']))
            .attr("r", 4) // Tamaño del punto
            .attr("fill", "blue")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("r", 7); // Aumentar el tamaño del punto
                tooltip.style("visibility", "visible")
                    .html(`<strong>${d3.timeFormat("%Y-%m-%d")(d.FECHA)}</strong><br>Calidad Agua NSF: <strong>${d['CALIDAD AGUA NSF']}</strong>`);
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 4); // Restaurar el tamaño original del punto
                tooltip.style("visibility", "hidden");
            });

    }).catch(error => {
        console.error("Error al cargar o procesar el CSV:", error);
    });
}


function graficad33() {
    const csvUrl = 'https://raw.githubusercontent.com/EdisonFlores/Pruebas-d3chart/main/Parametrosfisio.csv';

    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#graficad3js3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${(width + margin.left + margin.right) / 2},${(height + margin.top + margin.bottom) / 2})`);

    // Crear un div para el tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("font-size", "12px");

    d3.csv(csvUrl).then(data => {
        const filteredData = data.filter(d => d.RIO === 'RIO HUASAGA' && d.PUNTO === 'P1');

        if (filteredData.length === 0) {
            console.error("No se encontraron datos para el RIO HUASAGA en el PUNTO P1.");
            return;
        }

        // Agrupar y contar las clasificaciones
        const classificationCount = d3.rollup(
            filteredData,
            v => v.length,
            d => d['Clasificacion ']
        );

        const pieData = Array.from(classificationCount, ([key, value]) => ({ classification: key, count: value }));

        const total = d3.sum(pieData, d => d.count); // Calcular el total

        // Definir la escala de colores
        const color = d3.scaleOrdinal()
            .domain(['Buena', 'Regular', 'Mala'])
            .range(['green', 'orange', 'red']);

        const pie = d3.pie()
            .value(d => d.count);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const arcs = pie(pieData);

        const arcSelection = svg.selectAll(".arc")
            .data(arcs)
            .enter()
            .append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("fill", d => color(d.data.classification))
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("transform", "scale(1.1)"); // Aumentar el tamaño del sector
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 2); // Resaltar el sector
                tooltip.style("visibility", "visible")
                    .html(`<strong>${d.data.classification}</strong><br>Count: <strong>${d.data.count}</strong><br>Percentage: <strong>${((d.data.count / total) * 100).toFixed(2)}%</strong>`);
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("transform", "scale(1)"); // Restaurar el tamaño original del sector
                d3.select(this).attr("stroke", null).attr("stroke-width", 0); // Quitar el resaltado
                tooltip.style("visibility", "hidden");
            });

        svg.selectAll(".label")
            .data(arcs)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => `${d.data.classification}: ${((d.data.count / total) * 100).toFixed(2)}%`)
            .style("fill", "#fff");

    }).catch(error => {
        console.error("Error al cargar o procesar el CSV:", error);
    });
}
