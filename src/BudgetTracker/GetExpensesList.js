import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { BudgetSubmitter } from "./BudgetSubmitter";

const GetExpensesList = (updatedKey) => {
	const [budget, setBudget] = useState();
	const [key, setKey] = useState(updatedKey);
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getExpenses = async () => {
			try {
				const response = await axiosPrivate.get("/expenses", {
					signal: controller.signal,
				});
				console.log(response.data);
				isMounted && setBudget(response.data);
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getExpenses();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [axiosPrivate]);

	return (
		<article>
			<h2>Current Income:</h2>
			<p>${budget?.income}</p>
			<h2>Saving allocation:</h2>
			{budget?.saving?.total ? ( //is there a total
				budget?.saving?.percent ? ( //if there is a total is there a percent
					<p>
						${budget.saving.total} or {budget.saving.percent}% (whichever is
						greater)
					</p>
				) : (
					//yes total no percent?
					<p>${budget.saving.total}</p>
				)
			) : budget?.saving?.percent ? ( //no total, is there a percent?
				<p>{budget.saving.percent}% of income</p>
			) : (
				//no total, no percent.
				<p>No saving allocation</p>
			)}
			<h2>Expense List</h2>
			{budget?.expenses?.length ? (
				<ul>
					{budget.expenses.map((expenses, i) => (
						<li key={i}>
							{expenses?.expenseName} {expenses?.expensePercentage}% of income
							or ${expenses?.expenseFlatCost}
						</li>
					))}
					<br />
				</ul>
			) : (
				<h2>No Expenses found</h2>
			)}
			<h2>Saving/Investments List</h2>
			{budget?.savings?.length ? (
				<ul>
					{budget.savings.map((savings, i) => (
						<li key={i}>
							{savings?.savingName} {savings?.savingPercentage}% of income or $
							{savings?.savingFlatCost}
						</li>
					))}
					<br />
				</ul>
			) : (
				<h2>No Expenses found</h2>
			)}
		</article>
	);
};

export default GetExpensesList;
