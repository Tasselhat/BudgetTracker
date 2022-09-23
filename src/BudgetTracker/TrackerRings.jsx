import React from "react";
import "../css/TrackerRings.css";
import { BudgetSubmitter } from "./BudgetSubmitter";
import GetBudget from "./GetBudget";
import GetSavings from "./GetSavings";

export default class TrackerRings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	render() {
		return (
			<div className="tracker-rings-container">
				<div className="chart-container">
					<GetBudget />
					<GetSavings />
				</div>
				<section>
					<BudgetSubmitter />
				</section>
			</div>
		);
	}
}
