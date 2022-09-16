import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/TrackerRings.css";
import * as FaIcons from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const SAVINGS_URL = "/savings";
const EXPENSE_URL = "/expenses";
const controller = new AbortController();

export const BudgetSubmitter = () => {
	const expenseRef = useRef();
	const savingRef = useRef();
	const errRef = useRef();

	const [expenseName, setExpenseName] = useState("Example: Rent");
	const [expensePercentage, setExpensePercentage] = useState(0);
	const [expenseFlatCost, setExpenseFlatCost] = useState(0);
	const [expenseFocus, setExpenseFocus] = useState(false);
	const [expensePercentageFocus, setExpensePercentageFocus] = useState(false);
	const [expenseFlatCostFocus, setExpenseFlatCostFocus] = useState(false);

	const [savingName, setSavingName] = useState("Example: Retirement (401k)");
	const [savingPercentage, setSavingPercentage] = useState(0);
	const [savingFlatCost, setSavingFlatCost] = useState(0);
	const [savingFocus, setSavingFocus] = useState(false);
	const [savingPercentageFocus, setSavingPercentageFocus] = useState(false);
	const [savingFlatCostFocus, setSavingFlatCostFocus] = useState(false);

	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		expenseRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [
		expenseName,
		expensePercentage,
		expenseFlatCost,
		savingName,
		savingPercentage,
		savingFlatCost,
	]);

	const handleSubmitExpense = async (e) => {
		e.preventDefault(e);
		if (!expenseName || ((!expenseFlatCost && !expensePercentage) || (expenseFlatCost === "0" && expensePercentage === "0"))) {
			setErrMsg("Please include a name for your expense and a percentage of your income or dollar amount for how much you spend/wish to spend on that expense each month");
			return;
		}
		try {
			const response = await axiosPrivate.post(
				EXPENSE_URL,
				JSON.stringify({ expenseName, expensePercentage, expenseFlatCost }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					signal: controller.signal,
				}
			);
			console.log(response.data);
			alert("An expense was submitted: " + expenseName);
			// reset input fields to stop multiple post requests
			setExpenseName("Example: Rent");
			setExpensePercentage(0);
			setExpenseFlatCost(0);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No response from the server");
				console.error(err);
				//navigate("/login", { state: { from: location }, replace: true });
			} else if (err.response?.status === 409) {
				setErrMsg("An expense with this name already exists.");
				console.error(err);
				//navigate("/login", { state: { from: location }, replace: true });
			} else {
				setErrMsg("Submission Failed");
				console.error(err);
				//navigate("/login", { state: { from: location }, replace: true });
			}
			errRef.current.focus();
		}
	};

	const handleSubmitSaving = async (e) => {
		e.preventDefault(e);
		try {
			const response = await axiosPrivate.post(
				SAVINGS_URL,
				JSON.stringify({ savingName, savingPercentage, savingFlatCost }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					signal: controller.signal,
				}
			);
			console.log(response.data);
			alert("A saving/investment type was submitted: " + savingName);
			// clear input fields to stop multiple post requests
			setExpenseName("Example: Retirement (401k)");
			setExpensePercentage(0);
			setExpenseFlatCost(0);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No response from the server");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			} else if (err.response?.status === 409) {
				setErrMsg("A saving/investment with this name already exists.");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			} else {
				setErrMsg("Submission Failed");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
			errRef.current.focus();
		}
	};

	return (
		<>
			<div>
				<p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
					{errMsg}
				</p>
				<form onSubmit={(e) => handleSubmitExpense(e)}>
					<h3>Enter your expenses</h3>
					<label htmlFor="expenseName">Expense</label>

					<input
						type="text"
						id="expenseName"
						name="expenseName"
						ref={expenseRef}
						autoComplete="off"
						value={expenseName}
						onChange={(e) => setExpenseName(e.target.value)}
						required
						onFocus={() => setExpenseFocus(true)}
						onBlur={() => setExpenseFocus(false)}
					/>
					<input
						name="expensePercentage"
						type="number"
						min="0"
						max="100"
						id="expensePercentage"
						autoComplete="off"
						value={expensePercentage}
						onChange={(e) => setExpensePercentage(e.target.value)}
						onFocus={() => setExpensePercentageFocus(true)}
						onBlur={() => setExpensePercentageFocus(false)}
					/>
					<label htmlFor="expensePercentage">% </label>
					<label htmlFor="expenseFlatCost">or cost in $</label>
					<input
						name="expenseFlatCost"
						type="number"
						min="0"
						max="1000000"
						id="expenseFlatCost"
						autoComplete="off"
						value={expenseFlatCost}
						onChange={(e) => setExpenseFlatCost(e.target.value)}
						onFocus={() => setExpenseFlatCostFocus(true)}
						onBlur={() => setExpenseFlatCostFocus(false)}
					/>
					<input
						disabled={
							!expenseName || ((expensePercentage === "0" && expenseFlatCost === "0") || (expensePercentage === "" || expenseFlatCost === ""))
								? true
								: false
						}
						type="submit"
						value="Submit"
						onSubmit={(e) => handleSubmitExpense(e)}
					/>
				</form>
				<form onSubmit={(e) => handleSubmitSaving(e)}>
					<h3>Enter your saving/investment</h3>
					<label htmlFor="savingName">Savings</label>
					<input
						name="savingName"
						type="text"
						id="savingName"
						ref={savingRef}
						autoComplete="off"
						value={savingName}
						onChange={(e) => setSavingName(e.target.value)}
						required
						onFocus={() => setSavingFocus(true)}
						onBlur={() => setSavingFocus(false)}
					/>
					<input
						name="savingPercentage"
						type="number"
						min="0"
						max="100"
						id="savingPercentage"
						autoComplete="off"
						value={savingPercentage}
						onChange={(e) => setSavingPercentage(e.target.value)}
						required
						onFocus={() => setSavingPercentageFocus(true)}
						onBlur={() => setSavingPercentageFocus(false)}
					/>
					<label htmlFor="savingPercentage">% </label>
					<label htmlFor="savingFlatCost">or amount in $</label>
					<input
						name="savingFlatCost"
						type="number"
						min="0"
						max="1000000"
						id="savingFlatCost"
						autoComplete="off"
						value={savingFlatCost}
						onChange={(e) => setSavingFlatCost(e.target.value)}
						onFocus={() => setSavingFlatCostFocus(true)}
						onBlur={() => setSavingFlatCostFocus(false)}
					/>
					<input
						disabled={
							!savingName || ((savingPercentage === "0" && savingFlatCost === "0") || (savingPercentage === "" || savingFlatCost === ""))
								? true
								: false
						}
						type="submit"
						value="Submit"
						onSubmit={(e) => handleSubmitSaving(e)}
					></input>
				</form>
			</div>
		</>
	);
};
