import * as React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import defaultState from "./dashboardDefaults";

const controller = new AbortController();

function VariablesFormCompound({ onUpdate }) {
	const [state, setState] = React.useState(defaultState);
	const [budget, setBudget] = React.useState();

	const { initialAmount, period, growthRate, monthlyContribution } = state;

	const axiosPrivate = useAxiosPrivate();

	React.useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getBudgets = async () => {
			try {
				const response = await axiosPrivate.get("/expenses", {
					signal: controller.signal,
				});
				console.log(response.data);
				isMounted && setBudget(response.data);

				const budgetObject = response.data;
				const income = budgetObject.income;
				const savingsObject = budgetObject.saving;
				const savingTotalAmount = !savingsObject ? 0 : savingsObject.total;
				const savingPercentOfIncome = !savingsObject
					? 0
					: savingsObject.percent;

				if (savingTotalAmount && savingPercentOfIncome) {
					const savingAsPerecentOfIncome = Math.round(
						income * (savingPercentOfIncome / 100)
					);
					if (savingAsPerecentOfIncome > savingTotalAmount) {
						setState({
							...state,
							monthlyContribution: Number(savingAsPerecentOfIncome),
						});
					} else {
						setState({
							...state,
							monthlyContribution: Number(savingTotalAmount),
						});
					}
				} else if (!savingTotalAmount) {
					setState({
						...state,
						monthlyContribution: Number(
							Math.round(income * (savingPercentOfIncome / 100))
						),
					});
				} else {
					setState({
						...state,
						monthlyContribution: Number(savingTotalAmount),
					});
				}
			} catch (err) {
				console.error(err);
			}
		};

		getBudgets();

		return () => {
			isMounted = false;
			controller.abort();
		};
	});

	return (
		<section>
			<h2>Financials</h2>
			<div className="flex">
				<label htmlFor="initialAmount">
					Initial Amount ($)
					<input
						type="number"
						id="initialAmount"
						name="initialAmount"
						value={initialAmount}
						onChange={({ target }) =>
							setState({ ...state, initialAmount: Number(target.value) })
						}
					/>
				</label>
				<label htmlFor="period">
					Investment Period (Years)
					<input
						type="number"
						id="period"
						name="period"
						value={period}
						onChange={({ target }) =>
							setState({ ...state, period: Number(target.value) })
						}
					/>
				</label>
				<label htmlFor="growthRate">
					Annual Growth Rate (%)
					<input
						type="number"
						id="growthRate"
						name="growthRate"
						value={growthRate}
						onChange={({ target }) =>
							setState({ ...state, growthRate: Number(target.value) })
						}
					/>
				</label>
				<label htmlFor="monthlyContribution">
					Monthly Contribution (£)
					<input
						type="number"
						id="monthlyContribution"
						name="monthlyContribution"
						value={monthlyContribution}
						onChange={({ target }) =>
							setState({ ...state, monthlyContribution: Number(target.value) })
						}
					/>
				</label>
			</div>
			<button type="button" onClick={() => onUpdate(state)}>
				Update Chart
			</button>
		</section>
	);
}

export default VariablesFormCompound;
