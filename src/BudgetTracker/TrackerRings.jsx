import React from "react";
import ChartComponent from "./ChartComponent";
import "../css/TrackerRings.css";
import { BudgetSubmitter } from "./BudgetSubmitter";

const data = [
	{ label: "rent", value: 600 },
	{ label: "utilites", value: 80 },
	{ label: "food", value: 300 },
	{ label: "entertainment", value: 80 },
	{ label: "subscriptions", value: 20 },
	{ label: "savings", value: 520 },
	{ label: "misc", value: 100 },
];

const savingsData = [
	{ label: "stocks", value: 110 },
	{ label: "crypto", value: 110 },
	{ label: "roth IRA", value: 200 },
	{ label: "savings", value: 100 },
];
export default class TrackerRings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	render() {
		return (
			<div className="tracker-rings-container">
				<div className="chart-container">
					<ChartComponent data={data} />
					<ChartComponent data={savingsData} />
				</div>
				<section>
					<BudgetSubmitter />
				</section>
			</div>
		);
	}
}
