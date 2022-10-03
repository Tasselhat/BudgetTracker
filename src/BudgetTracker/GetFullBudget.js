import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import * as FaIcons from "react-icons/fa";
import "../css/TrackerRings.css";

const EXPENSE_URL = "/expenses";
const BUDGET_URL = "/budgets";

const controller = new AbortController();

const GetFullBudget = (updatedKey) => {
	const [budget, setBudget] = useState();
	const [name, setName] = useState("");

	const [errMsg, setErrMsg] = useState("");
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

	const handleClick = (e) => {
		e.preventDefault();
		setName(e.target.value);
		console.log(name);
		const handleDeleteExpense = async () => {
			if (!name) {
				setErrMsg("Please include a value for your current income.");
				return;
			}
			try {
				const response = await axiosPrivate.delete(
					EXPENSE_URL,
					JSON.stringify({ name }),
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
						signal: controller.signal,
					}
				);
				console.log(response.data);
				alert("An expense was deleted " + name);
				setName("");
			} catch (err) {
				if (!err?.response) {
					console.error(err);
					//navigate("/login", { state: { from: location }, replace: true });
				} else {
					console.error(err);
					//navigate("/login", { state: { from: location }, replace: true });
				}
			}
		};
		handleDeleteExpense();
	};

	const handleDelete = async (e) => {
		e.preventDefault();
		try {
			const response = await axiosPrivate.delete(BUDGET_URL, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
				signal: controller.signal,
			});
			console.log(response.data);
			alert("User Budget Reset.");
		} catch (err) {
			if (!err?.response) {
				console.error(err);
				//navigate("/login", { state: { from: location }, replace: true });
			} else {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		}
	};

	return (
		<div className="expense-list-wrapper">
			<article className="expense-list">
				<h2>Current Income:</h2>
				{budget?.income ? <p>${budget.income}</p> : <p>No income found</p>}
				<br />
				<h2>Saving allocation:</h2>
				{budget?.saving?.total ? ( //is there a total
					budget?.saving?.percent ? ( //if there is a total is there a percent
						<p>
							${budget.saving.total} or {budget.saving.percent}% of income
							(whichever is greater)
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
				<br />
				<h2>Expense List</h2>
				{budget?.expenses?.length ? (
					<ul>
						{budget.expenses.map((expenses, i) => (
							<li key={i}>
								{expenses?.expenseName} {expenses?.expensePercentage}% of income
								or ${expenses?.expenseFlatCost}
								<button
									value={expenses.expenseName}
									onClick={(e) => handleClick(e, "value")}
								>
									<FaIcons.FaTrash></FaIcons.FaTrash>
								</button>
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
								{savings?.savingName} {savings?.savingPercentage}% of income or
								${savings?.savingFlatCost}
								<button value={savings._id}>
									<FaIcons.FaTrash></FaIcons.FaTrash>
								</button>
							</li>
						))}
						<br />
					</ul>
				) : (
					<div>
					<h2>No Expenses found</h2>
					<br />
					</div>
				)}
				<button onClick={(e) => handleDelete(e)}>Reset Budget</button>
			</article>
		</div>
	);
};

export default GetFullBudget;