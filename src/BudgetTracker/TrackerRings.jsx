import React from "react";
import axios from "../api/axios";
import ChartComponent from "./ChartComponent";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/TrackerRings.css";

const data = [
	{ label: "rent", value: 600 },
	{ label: "utilites", value: 80 },
	{ label: "food", value: 300 },
	{ label: "entertainment", value: 80 },
	{ label: "subscriptions", value: 20 },
	{ label: "savings", value: 520 },
];

const savingsData = [
	{ label: "stocks", value: 110 },
	{ label: "savings", value: 100 },
	{ label: "roth IRA", value: 200 },
	{ label: "crypto", value: 110 },
];

const SAVINGS_URL = "/savings";
const EXPENSE_URL = "/expenses";
const controller = new AbortController();
export default class TrackerRings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			expenseName: "Example: Rent",
			expensePercentage: "0",
			expenseFlatCost: "0",
			savingName: "Example: Retirement (401k)",
			savingPercentage: "0",
			savingFlatCost: "0",
			errMsg: "",
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmitExpense = this.handleSubmitExpense.bind(this);
		this.handleSubmitSaving = this.handleSubmitExpense.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	handleSubmitExpense = async (e) => {
		e.preventDefault(e);
		try {
			const expenseName = this.state.expenseName;
			const expensePercentage = this.state.expensePercentage;
			const expenseFlatCost = this.state.expenseFlatCost;
			const response = await axios.post(
				EXPENSE_URL,
				JSON.stringify({ expenseName, expensePercentage, expenseFlatCost }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			alert("An expense was submitted: " + this.state.label);
			console.log(response.data);
			console.log(response.accessToken);
			console.log(JSON.stringify(response));
			// clear input fields to stop multiple post requests
			this.setState({
				expenseName: "Example: Rent",
				expensePercentage: "0",
				expenseFlatCost: "0",
			});
		} catch (err) {
			if (!err?.response) {
				this.setState({ errMsg: "No response from the server" });
				console.error(err);
			} else if (err.response?.status === 409) {
				this.setState({ errMsg: "An expense with this name already exists." });
				console.error(err);
			} else {
				this.setState({ errMsg: "Submission Failed" });
				console.error(err);
			}
		}
	};

	handleSubmitSaving = async (e) => {
		e.preventDefault();
		try {
			const savingName = this.state.savingName;
			const savingPercentage = this.state.savingPercentage;
			const savingFlatCost = this.state.savingFlatCost;
			const response = await axios.post(
				SAVINGS_URL,
				JSON.stringify({ savingName, savingPercentage, savingFlatCost }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			alert("A saving/investment type was submitted: " + this.state.label);
			console.log(response.data);
			console.log(response.accessToken);
			console.log(JSON.stringify(response));
			// clear input fields to stop multiple post requests
			this.setState({
				expenseName: "Example: Retirement (401k)",
				expensePercentage: "0",
				expenseFlatCost: "0",
			});
		} catch (err) {
			if (!err?.response) {
				this.setState({ errMsg: "No response from the server" });
				console.error(err);
			} else if (err.response?.status === 409) {
				this.setState({
					errMsg: "A saving/investment with this name already exists.",
				});
				console.error(err);
			} else {
				this.setState({ errMsg: "Submission Failed" });
				console.error(err);
			}
		}
	};

	render() {
		return (
			<div className="tracker-rings-container">
				<div className="chart-container">
					<ChartComponent data={data} />
					<ChartComponent data={savingsData} />
				</div>
				<div>
					<p
						className={this.state.errMsg ? "errmsg" : "offscreen"}
						aria-live="assertive"
					>
						{this.state.errMsg}
					</p>
					<form onSubmit={(e) => this.handleSubmitExpense(e)}>
						<h3>Enter your expenses</h3>
						<label htmlFor="expenseName">Expense</label>
						<input
							name="expenseName"
							type="text"
							autoComplete="off"
							value={this.state.expenseName}
							onChange={this.handleInputChange}
						></input>
						<input
							name="expensePercentage"
							type="number"
							min="0"
							max="100"
							value={this.state.expensePercentage}
							onChange={this.handleInputChange}
						/>
						<label htmlFor="expensePercentage">% </label>
						<label htmlFor="expenseFlatCost">or cost in $</label>
						<input
							name="expenseFlatCost"
							type="number"
							min="0"
							max="1000000"
							value={this.state.expenseFlatCost}
							onChange={this.handleInputChange}
						/>
						<input
							disabled={
								!this.state.expenseName ||
								(this.state.expensePercentage == 0 &&
									this.state.expenseFlatCost == 0)
									? true
									: false
							}
							type="submit"
							value="Submit"
							onSubmit={(e) => this.handleSubmitExpense(e)}
						></input>
					</form>
					<form onSubmit={(e) => this.handleSubmitSaving(e)}>
						<h3>Enter your saving/investment</h3>
						<label htmlFor="savingName">Savings</label>
						<input
							name="savingName"
							type="text"
							autoComplete="off"
							value={this.state.savingName}
							onChange={this.handleInputChange}
						></input>
						<input
							name="savingPercentage"
							type="number"
							min="0"
							max="100"
							value={this.state.savingPercentage}
							onChange={this.handleInputChange}
						/>
						<label htmlFor="savingPercentage">% </label>
						<label htmlFor="savingFlatCost">or amount in $</label>
						<input
							name="savingFlatCost"
							type="number"
							min="0"
							max="1000000"
							value={this.state.savingFlatCost}
							onChange={this.handleInputChange}
						/>
						<input
							disabled={
								!this.state.savingName ||
								(this.state.savingPercentage == 0 &&
									this.state.savingFlatCost == 0)
									? true
									: false
							}
							type="submit"
							value="Submit"
							onSubmit={(e) => this.handleSubmitExpense(e)}
						></input>
					</form>
				</div>
			</div>
		);
	}
}
