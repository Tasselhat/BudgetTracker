import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ChartComponent from "./ChartComponent";

const data = [
	{ label: "rent", value: 600 },
	{ label: "utilites", value: 80 },
	{ label: "food", value: 300 },
	{ label: "entertainment", value: 80 },
	{ label: "subscriptions", value: 20 },
	{ label: "savings", value: 520 },
	{ label: "misc", value: 100 },
];

const GetBudget = () => {
	const [budget, setBudget] = useState();
	const [chartData, setChartData] = useState();
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getBudgets = async () => {
			try {
				const response = await axiosPrivate.get("/expenses", {
					signal: controller.signal,
				});
				console.log(response.data);
				isMounted && setBudget(response.data);
				const chartData = [];
				const budgetObject = response.data;
				const income = budgetObject.income;
				//add savings as a percent of income or flat $ amount to make saving chart.
				const expensesArrayLength = Object.keys(budgetObject.expenses).length;
				const savingsArrayLength = Object.keys(budgetObject.savings).length;
				console.log(expensesArrayLength);
				console.log(savingsArrayLength);
				if (income && income > 0) {
					for (let i = 0; i < expensesArrayLength; i++) {
						const percentageValue =
							income * (budgetObject.expenses[i].expensePercentage / 100);
						const flatCostValue = budgetObject.expenses[i].expenseFlatCost;
						if (percentageValue > flatCostValue) {
							chartData.push({
								label: budgetObject.expenses[i].expenseName,
								value: percentageValue,
							});
						} else {
							chartData.push({
								label: budgetObject.expenses[i].expenseName,
								value: flatCostValue,
							});
						}
					}
				} else {
					for (let i = 0; i < expensesArrayLength; i++) {
						chartData.push({
							label: budgetObject.expenses[i].expenseName,
							value: budgetObject.expenses[i].expenseFlatCost,
						});
					}
				}
				console.log(chartData);
				console.log(data);
				setChartData(chartData);
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getBudgets();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [axiosPrivate]);

	return (
		<section>
			{chartData?.length ? (
				<>
					<ChartComponent data={chartData} />
				</>
			) : (
				<>
					<ChartComponent data={data} />
				</>
			)}
		</section>
	);
};

export default GetBudget;
