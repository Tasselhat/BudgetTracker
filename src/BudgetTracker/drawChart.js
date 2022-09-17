import * as d3 from "d3";

const drawChart = (element, data) => {
	const colors = [
		"#0a0a29",
		"#151536",
		"#252543",
		"#37374f",
		"#190a29",
		"#251536",
		"#332543",
		"#43374f",
		"#0a2929",
		"#153636",
		"#254343",
		"#374f4f",
		"#29190a",
		"#362515",
		"#433325",
		"#4f4337",
		"#29290a",
		"#363615",
		"#434325",
		"#4f4f37",
		"#290a29",
		"#361536",
		"#432543",
		"#4f374f",
		"#5c325c",
		"#692a69",
		"#751d75",
		"#823382",
		"#8f4f8f",
		"#9b6c9b",
		"#9b6c84",
		"#846c9b",
		"#846c9b",
		"#846c9b",
		"#846c9b",
		"#846c9b",
		"#846c9b",
		"#846c9b",
	];
	console.log(data);
	const boxSize = 500;
	const dataSum = data.reduce((accumulator, object) => {
		return accumulator + object.value;
	}, 0);

	d3.select(element).select("svg").remove(); // Remove the old svg
	// Create new svg
	const svg = d3
		.select(element)
		.append("svg")
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("height", "100%")
		.attr("width", "100%")
		.attr("viewBox", `0 0 ${boxSize + 200} ${boxSize + 200}`)
		.append("g")
		.attr("transform", `translate(${boxSize / 1.5}, ${boxSize / 1.5})`);

	const arcGenerator = d3
		.arc()
		.cornerRadius(5)
		.padAngle(0.01)
		.innerRadius(100)
		.outerRadius(250);

	const pieGenerator = d3
		.pie()
		.startAngle(-1.5 * Math.PI)
		.value((d) => d.value);

	const arcs = svg.selectAll().data(pieGenerator(data)).enter();
	arcs
		.append("path")
		.attr("d", arcGenerator)
		.style("fill", (d, i) => colors[i % data.length])
		.transition()
		.duration(700)
		.attrTween("d", function (d) {
			const i = d3.interpolate(d.startAngle, d.endAngle);
			return function (t) {
				d.endAngle = i(t);
				return arcGenerator(d);
			};
		});
	arcs
		.append("text")
		.attr("text-anchor", "middle")
		.text((d) => `${((d.data.value / dataSum) * 100).toFixed(2)}%`) //label text
		.style("fill", "#000")
		.attr("transform", (d) => {
			const [x, y] = arcGenerator.centroid(d);
			return `translate(${x * 1.7} ${y * 1.7})`;
		})
		.style("font-size", 0)
		.transition()
		.duration(700)
		.style("font-size", "30px");
	arcs
		.append("text")
		.attr("text-anchor", "middle")
		.text(
			(d) =>
				`$${d.data.value} ${d.data.label
					.charAt(0)
					.toUpperCase()}${d.data.label.slice(1)}`
		) //label text
		.style("fill", "#FFF")
		.style("font-size", "30px")
		.attr("transform", (d) => {
			const [x, y] = arcGenerator.centroid(d);
			return `translate(${x * 1.7} ${y * 1.7 + 30})`;
		})
		.style("font-size", 0)
		.transition()
		.duration(700)
		.style("font-size", "30px");
};

export default drawChart;
