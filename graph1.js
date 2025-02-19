// d3.json("../../lib/updated_CGMacros.json").then(function (data) {
//   const filteredData = data.filter(
//     (d) =>
//       !isNaN(d.HR) &&
//       d.HR !== null &&
//       !isNaN(d["Libre GL"]) &&
//       d["Libre GL"] !== null
//   );

//   function normalizeIdentity(identity) {
//     return identity.trim().toLowerCase().replace(/,/, "").replace(/\s+/g, " ");
//   }

//   const groupedData = d3.rollups(
//     filteredData,
//     (v) => ({
//       avgHR: d3.mean(v, (d) => d.HR),
//       avgLibreGL: d3.mean(v, (d) => d["Libre GL"]),
//       selfIdentify: normalizeIdentity(v[0]["Self-identify"]),
//     }),
//     (d) => d.Patient_ID,
//     (d) => d.Timestamp.split(" ")[0]
//   );

//   const flatData = [];
//   groupedData.forEach((patientGroup) => {
//     patientGroup[1].forEach((dayGroup) => {
//       flatData.push({
//         Patient_ID: patientGroup[0],
//         Date: dayGroup[0],
//         avgHR: dayGroup[1].avgHR,
//         avgLibreGL: dayGroup[1].avgLibreGL,
//         selfIdentify: dayGroup[1].selfIdentify,
//       });
//     });
//   });

//   const svg = d3.select("svg");
//   const margin = { top: 20, right: 30, bottom: 50, left: 50 };
//   const width = svg.attr("width") - margin.left - margin.right;
//   const height = svg.attr("height") - margin.top - margin.bottom;
//   const graph = svg
//     .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

//   const xScale = d3
//     .scaleLinear()
//     .domain([
//       d3.min(flatData, (d) => d.avgHR) - 5,
//       d3.max(flatData, (d) => d.avgHR) + 5,
//     ])
//     .range([0, width]);

//   const yScale = d3
//     .scaleLinear()
//     .domain([
//       d3.min(flatData, (d) => d.avgLibreGL) - 5,
//       d3.max(flatData, (d) => d.avgLibreGL) + 5,
//     ])
//     .range([height, 0]);

//   const zoom = d3
//     .zoom()
//     .scaleExtent([1, 5])
//     .translateExtent([
//       [0, 0],
//       [width, height],
//     ])
//     .on("zoom", zoomed);

//   svg.call(zoom);

//   function zoomed(event) {
//     const newXScale = event.transform.rescaleX(xScale);
//     const newYScale = event.transform.rescaleY(yScale);

//     graph.select(".x-axis").call(d3.axisBottom(newXScale));
//     graph.select(".y-axis").call(d3.axisLeft(newYScale));

//     graph
//       .selectAll("circle")
//       .attr("cx", (d) => newXScale(d.avgHR))
//       .attr("cy", (d) => newYScale(d.avgLibreGL));
//   }

//   const tooltip = d3
//     .select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("position", "absolute")
//     .style("background", "rgba(255, 255, 255, 0.9)")
//     .style("color", "#333")
//     .style("padding", "10px")
//     .style("border-radius", "8px")
//     .style("box-shadow", "2px 2px 10px rgba(0, 0, 0, 0.3)")
//     .style("font-size", "14px")
//     .style("pointer-events", "none")
//     .style("visibility", "hidden")
//     .style("opacity", 0)
//     .style("transition", "opacity 0.3s ease-in-out");

//   const colorScale = d3
//     .scaleOrdinal()
//     .domain([
//       "hispanic/latino",
//       "white",
//       "african american",
//       "black african american",
//     ])
//     .range(["#3498db", "#2ecc71", "#e74c3c", "#e74c3c"]);

//   const circles = graph
//     .selectAll("circle")
//     .data(flatData)
//     .enter()
//     .append("circle")
//     .attr("cx", (d) => xScale(d.avgHR))
//     .attr("cy", (d) => yScale(d.avgLibreGL))
//     .attr("r", 6)
//     .attr("fill", (d) => colorScale(d.selfIdentify) || "#95a5a6")
//     .style("stroke", "#fff")
//     .style("stroke-width", "1.5px")
//     .style("opacity", 0.85)
//     .on("mouseover", function (event, d) {
//       d3.select(this)
//         .transition()
//         .duration(200)
//         .attr("r", 8)
//         .style("opacity", 1);

//       tooltip.style("visibility", "visible").style("opacity", 1).html(`
//         <strong>🆔 Patient ID:</strong> ${d.Patient_ID}<br>
//         <strong>📅 Date:</strong> ${d.Date}<br>
//         <strong>❤️ Avg HR:</strong> ${d.avgHR.toFixed(1)} bpm<br>
//         <strong>🍬 Avg Glucose:</strong> ${d.avgLibreGL.toFixed(1)} mg/dL<br>
//         <strong>🌎 Self-Identify:</strong> ${d.selfIdentify}
//       `);
//     })
//     .on("mousemove", function (event) {
//       tooltip
//         .style("left", `${event.pageX + 15}px`)
//         .style("top", `${event.pageY - 35}px`);
//     })
//     .on("mouseout", function () {
//       d3.select(this)
//         .transition()
//         .duration(200)
//         .attr("r", 6)
//         .style("opacity", 0.85);

//       tooltip.style("visibility", "hidden").style("opacity", 0);
//     });

//   graph
//     .append("g")
//     .attr("class", "x-axis")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(xScale));

//   graph.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

//   svg
//     .append("text")
//     .attr("x", width / 2)
//     .attr("y", height + margin.top + 40)
//     .style("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("fill", "#333")
//     .style("font-weight", "bold")
//     .text("💓 Average Heart Rate (HR)");

//   svg
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", -height / 2)
//     .attr("y", margin.left - 35)
//     .style("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("fill", "#333")
//     .style("font-weight", "bold")
//     .text("🍬 Average Glucose Level (mg/dL)");

//   const legend = svg
//     .append("g")
//     .attr("transform", `translate(${width - 180}, 20)`);

//   const legendData = [
//     { label: "Hispanic/Latino", color: "#3498db" },
//     { label: "White", color: "#2ecc71" },
//     { label: "African American", color: "#e74c3c" },
//   ];

//   legendData.forEach((item, index) => {
//     const legendItem = legend
//       .append("g")
//       .attr("transform", `translate(0, ${index * 25})`);

//     legendItem
//       .append("rect")
//       .attr("width", 18)
//       .attr("height", 18)
//       .attr("fill", item.color)
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//       .attr("rx", 4);

//     legendItem
//       .append("text")
//       .attr("x", 25)
//       .attr("y", 13)
//       .text(item.label)
//       .style("font-size", "14px")
//       .style("fill", "#333")
//       .style("font-weight", "bold");
//   });

//   let activeCategory = null;

//   const legendItems = legend
//     .selectAll(".legend-item")
//     .data(legendData)
//     .enter()
//     .append("g")
//     .attr("class", "legend-item")
//     .attr("transform", (d, i) => `translate(0, ${i * 25})`);

//   legendItems
//     .append("rect")
//     .attr("width", 18)
//     .attr("height", 18)
//     .attr("fill", (d) => d.color)
//     .attr("stroke", "#fff")
//     .attr("stroke-width", 1.5)
//     .attr("rx", 4);

//   legendItems
//     .append("text")
//     .attr("x", 25)
//     .attr("y", 13)
//     .text((d) => d.label)
//     .style("font-size", "14px")
//     .style("fill", "#333")
//     .style("font-weight", "bold");

//   legendItems.on("click", function (event, d) {
//     event.stopPropagation();


//     if (activeCategory === d.label) {
//       activeCategory = null;
//       circles.transition().duration(300).style("opacity", 0.85);
//     } else {
//       activeCategory = d.label;
//       circles.transition().duration(300).style("opacity", 0.1);

//       circles
//         .filter((c) => {
//           let identity = c.selfIdentify.toLowerCase();
//           return (
//             identity === d.label.toLowerCase() ||
//             (d.label === "African American" &&
//               ["african american", "black african american"].includes(identity))
//           );
//         })
//         .transition()
//         .duration(300)
//         .style("opacity", 0.85);
//     }
//   });

//   d3.select("body").on("click", function (event) {
//     if (!event.target.closest(".legend-item")) {
//       activeCategory = null;
//       circles.transition().duration(300).style("opacity", 0.85);
//     }
//   });
// });

// Initialize an empty array to hold all data from chunks
let allData = [];

function loadChunkData(chunkNumber) {
  return d3.json(`chunks/chunk_${chunkNumber}.json`).then(function (data) {
    allData = allData.concat(data);  // Add the data from the current chunk to the allData array

    // Process data when the last chunk is loaded
    if (chunkNumber === 50) {
      processData(allData);  // Once all chunks are loaded, process the data
    }
  });
}

// Load all chunks (from chunk_1.json to chunk_50.json)
for (let i = 1; i <= 50; i++) {
  loadChunkData(i);
}

function processData(data) {
  const filteredData = data.filter(
    (d) =>
      !isNaN(d.HR) &&
      d.HR !== null &&
      !isNaN(d["Libre GL"]) &&
      d["Libre GL"] !== null
  );

  function normalizeIdentity(identity) {
    return identity.trim().toLowerCase().replace(/,/, "").replace(/\s+/g, " ");
  }

  const groupedData = d3.rollups(
    filteredData,
    (v) => ({
      avgHR: d3.mean(v, (d) => d.HR),
      avgLibreGL: d3.mean(v, (d) => d["Libre GL"]),
      selfIdentify: normalizeIdentity(v[0]["Self-identify"]),
    }),
    (d) => d.Patient_ID,
    (d) => d.Timestamp.split(" ")[0]
  );

  const flatData = [];
  groupedData.forEach((patientGroup) => {
    patientGroup[1].forEach((dayGroup) => {
      flatData.push({
        Patient_ID: patientGroup[0],
        Date: dayGroup[0],
        avgHR: dayGroup[1].avgHR,
        avgLibreGL: dayGroup[1].avgLibreGL,
        selfIdentify: dayGroup[1].selfIdentify,
      });
    });
  });

  const svg = d3.select("svg");
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const width = svg.attr("width") - margin.left - margin.right;
  const height = svg.attr("height") - margin.top - margin.bottom;
  const graph = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(flatData, (d) => d.avgHR) - 5,
      d3.max(flatData, (d) => d.avgHR) + 5,
    ])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(flatData, (d) => d.avgLibreGL) - 5,
      d3.max(flatData, (d) => d.avgLibreGL) + 5,
    ])
    .range([height, 0]);

  const zoom = d3
    .zoom()
    .scaleExtent([1, 5])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zoomed);

  svg.call(zoom);

  function zoomed(event) {
    const newXScale = event.transform.rescaleX(xScale);
    const newYScale = event.transform.rescaleY(yScale);

    graph.select(".x-axis").call(d3.axisBottom(newXScale));
    graph.select(".y-axis").call(d3.axisLeft(newYScale));

    graph
      .selectAll("circle")
      .attr("cx", (d) => newXScale(d.avgHR))
      .attr("cy", (d) => newYScale(d.avgLibreGL));
  }

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("color", "#333")
    .style("padding", "10px")
    .style("border-radius", "8px")
    .style("box-shadow", "2px 2px 10px rgba(0, 0, 0, 0.3)")
    .style("font-size", "14px")
    .style("pointer-events", "none")
    .style("visibility", "hidden")
    .style("opacity", 0)
    .style("transition", "opacity 0.3s ease-in-out");

  const colorScale = d3
    .scaleOrdinal()
    .domain([
      "hispanic/latino",
      "white",
      "african american",
      "black african american",
    ])
    .range(["#3498db", "#2ecc71", "#e74c3c", "#e74c3c"]);

  const circles = graph
    .selectAll("circle")
    .data(flatData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.avgHR))
    .attr("cy", (d) => yScale(d.avgLibreGL))
    .attr("r", 6)
    .attr("fill", (d) => colorScale(d.selfIdentify) || "#95a5a6")
    .style("stroke", "#fff")
    .style("stroke-width", "1.5px")
    .style("opacity", 0.85)
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 8)
        .style("opacity", 1);

      tooltip.style("visibility", "visible").style("opacity", 1).html(`
        <strong>🆔 Patient ID:</strong> ${d.Patient_ID}<br>
        <strong>📅 Date:</strong> ${d.Date}<br>
        <strong>❤️ Avg HR:</strong> ${d.avgHR.toFixed(1)} bpm<br>
        <strong>🍬 Avg Glucose:</strong> ${d.avgLibreGL.toFixed(1)} mg/dL<br>
        <strong>🌎 Self-Identify:</strong> ${d.selfIdentify}
      `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 35}px`);
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 6)
        .style("opacity", 0.85);

      tooltip.style("visibility", "hidden").style("opacity", 0);
    });

  graph
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  graph.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 40)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "#333")
    .style("font-weight", "bold")
    .text("💓 Average Heart Rate (HR)");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", margin.left - 35)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "#333")
    .style("font-weight", "bold")
    .text("🍬 Average Glucose Level (mg/dL)");

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 180}, 20)`);

  const legendData = [
    { label: "Hispanic/Latino", color: "#3498db" },
    { label: "White", color: "#2ecc71" },
    { label: "African American", color: "#e74c3c" },
  ];

  legendData.forEach((item, index) => {
    const legendItem = legend
      .append("g")
      .attr("transform", `translate(0, ${index * 25})`);

    legendItem
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", item.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("rx", 4);

    legendItem
      .append("text")
      .attr("x", 25)
      .attr("y", 13)
      .text(item.label)
      .style("font-size", "14px")
      .style("fill", "#333")
      .style("font-weight", "bold");
  });

  let activeCategory = null;

  const legendItems = legend
    .selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 25})`);

  legendItems
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d) => d.color)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("rx", 4);

  legendItems
    .append("text")
    .attr("x", 25)
    .attr("y", 13)
    .text((d) => d.label)
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold");

  legendItems.on("click", function (event, d) {
    event.stopPropagation();

    if (activeCategory === d.label) {
      activeCategory = null;
      circles.transition().duration(300).style("opacity", 0.85);
    } else {
      activeCategory = d.label;
      circles.transition().duration(300).style("opacity", 0.1);

      circles
        .filter((c) => {
          let identity = c.selfIdentify.toLowerCase();
          return (
            identity === d.label.toLowerCase() ||
            (d.label === "African American" &&
              ["african american", "black african american"].includes(identity))
          );
        })
        .transition()
        .duration(300)
        .style("opacity", 0.85);
    }
  });

  d3.select("body").on("click", function (event) {
    if (!event.target.closest(".legend-item")) {
      activeCategory = null;
      circles.transition().duration(300).style("opacity", 0.85);
    }
  });
}
