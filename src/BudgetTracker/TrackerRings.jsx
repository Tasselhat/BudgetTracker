import React from "react";
import { Link } from "react-router-dom";
import "../css/TrackerRings.css";
import GetBudget from "./GetBudget";
import GetSavings from "./GetSavings";

export default class TrackerRings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			updatedKey0: 0,
			updatedKey1: -1,
		};
	}

	handleClick = (e) => {
		this.setState((prevState) => {
			return {
				updatedKey0: prevState.updatedKey0 + 1,
				updatedKey1: prevState.updatedKey1 + 1,
			};
		});
	};

	render() {
		return (
			<section>
				<div className="tracker-rings-container">
					<div className="chart-container">
						<GetBudget key={this.state.updatedKey0} />
						<GetSavings key={this.state.updatedKey1} />
					</div>
					<button className="updateButton" onClick={(e) => this.handleClick(e)}>
						Update Rings
					</button>
					<Link to="/">
						<button className="changeButton">Change Budget</button>
					</Link>
				</div>
			</section>
		);
	}
}
