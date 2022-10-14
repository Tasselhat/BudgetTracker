import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ChartComponent from "./ChartComponent";

const savingsData = [
	{ label: "stocks", value: 104 },
	{ label: "crypto", value: 100 },
	{ label: "roth IRA", value: 200 },
	{ label: "savings", value: 104 },
	{ label: "Extra Savings", value: 12 },
];

const GetSavings = (updatedKey) => {
	const [savings, setSavings] = useState();
	const [key, setKey] = useState(updatedKey);
	const [chartData, setChartData] = useState();
	const [arrayExists, setArrayExists] = useState(false);
	const [noSavingWarning, setNoSavingWarning] = useState("");
	const [savingsExceedtotalWarning, setSavingsExceedTotalWarning] =
		useState("");
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getSavingsHook = async () => {
			try {
				const response = await axiosPrivate.get("/expenses", {
					signal: controller.signal,
				});
				console.log(response.data);
				isMounted && setSavings(response.data);
				const chartData = [];
				const budgetObject = response.data;
				if (!budgetObject) return setArrayExists(false);
				const income = budgetObject.income;
				const savingsObject = budgetObject.saving;
				const savingTotalAmount = !savingsObject ? 0 : savingsObject.total;
				const savingPercentOfIncome = !savingsObject
					? 0
					: savingsObject.percent;
				const savingsArrayLength = Object.keys(budgetObject.savings).length;
				if (savingsArrayLength > 0) {
					setArrayExists(true);
				}
				const savingAsPerecentOfIncome = Math.round(
					income * (savingPercentOfIncome / 100)
				);
				const savingTotal =
					savingAsPerecentOfIncome > savingTotalAmount
						? savingAsPerecentOfIncome
						: savingTotalAmount;
				if (!savingTotal) {
					for (let i = 0; i < savingsArrayLength; i++) {
						chartData.push({
							label: budgetObject.savings[i].savingName,
							value: budgetObject.savings[i].savingFlatCost,
						});
					}
					setNoSavingWarning(
						"Please enter how much you wish to save each month as a dollar amount or a percentage of income to properly display graph."
					);
				} else {
					for (let i = 0; i < savingsArrayLength; i++) {
						const percentageValue = Math.round(
							savingTotal * (budgetObject.savings[i].savingPercentage / 100)
						);
						const flatCostValue = budgetObject.savings[i].savingFlatCost;
						if (percentageValue > flatCostValue) {
							chartData.push({
								label: budgetObject.savings[i].savingName,
								value: percentageValue,
							});
						} else {
							chartData.push({
								label: budgetObject.savings[i].savingName,
								value: flatCostValue,
							});
						}
					}
				}
				setChartData(chartData);
				const chartDataSum = chartData.reduce((accumulator, object) => {
					return accumulator + object.value;
				}, 0);
				if (chartDataSum < savingTotal) {
					const excess = savingTotal - chartDataSum;
					chartData.push({
						label: "Extra Savings",
						value: excess,
					});
				} else {
					setSavingsExceedTotalWarning(
						`Warning: Savings and Investment total currently exceeds your entered saving allocation,
consider adjusting savings/investments amounts, increasing monthly income, or adjusting any errors.`
					);
				}
				setChartData(chartData);
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getSavingsHook();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [axiosPrivate]);

	if (arrayExists) {
		return (
			<div>
				<h2 className="header">Breakdown of Savings/Investments:</h2>
				<ChartComponent data={chartData} />
				<p
					className={noSavingWarning ? "errmsg" : "offscreen"}
					aria-live="assertive"
				>
					{noSavingWarning}
				</p>
				<p
					className={savingsExceedtotalWarning ? "errmsg" : "offscreen"}
					aria-live="assertive"
				>
					{savingsExceedtotalWarning}
				</p>
			</div>
		);
	} else {
		return (
			<>
				<h2 className="header">Example savings chart:</h2>
				<ChartComponent data={savingsData} />
			</>
		);
	}
};

export default GetSavings;
