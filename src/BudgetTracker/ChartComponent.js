import React, { useEffect, useRef } from "react";
import drawChart from "./drawChart";
import "../css/TrackerRings.css";

const DonutChart = ({ data }) => {
	const ref = useRef(null);
	console.log(data + " Chart Component");

	useEffect(() => {
		if (ref.current) {
			drawChart(ref.current, data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);

	return (
		<div className="container">
			<div className="graph" ref={ref} />
		</div>
	);
};

export default React.memo(DonutChart);
