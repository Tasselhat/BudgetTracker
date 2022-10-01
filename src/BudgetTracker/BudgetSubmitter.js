import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/TrackerRings.css";
import * as FaIcons from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import GetExpensesList from "./GetExpensesList";

const SAVINGS_URL = "/savings";
const EXPENSE_URL = "/expenses";
const BUDGET_URL = "/budgets";
const controller = new AbortController();

export const BudgetSubmitter = () => {
	const incomeRef = useRef();
	const savingRef = useRef();
	const errRef = useRef();

	const [income, setIncome] = useState(0);
	const [incomeFocus, setIncomeFocus] = useState(false);

	const [totalSavingAmount, setTotalSavingAmount] = useState(0);
	const [totalSavingAmountFocus, setTotalSavingAmountFocus] = useState(false);

	const [totalSavingPercent, setTotalSavingPercent] = useState(0);
	const [totalSavingPercentFocus, setTotalSavingPercentFocus] = useState(false);

	const [expenseName, setExpenseName] = useState("Example: Rent");
	const [expensePercentage, setExpensePercentage] = useState(0);
	const [expenseFlatCost, setExpenseFlatCost] = useState(0);
	const [expenseNameFocus, setExpenseNameFocus] = useState(false);
	const [expensePercentageFocus, setExpensePercentageFocus] = useState(false);
	const [expenseFlatCostFocus, setExpenseFlatCostFocus] = useState(false);

	const [savingName, setSavingName] = useState("Example: Retirement (401k)");
	const [savingPercentage, setSavingPercentage] = useState(0);
	const [savingFlatCost, setSavingFlatCost] = useState(0);
	const [savingNameFocus, setSavingNameFocus] = useState(false);
	const [savingPercentageFocus, setSavingPercentageFocus] = useState(false);
	const [savingFlatCostFocus, setSavingFlatCostFocus] = useState(false);

	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	const [errMsg, setErrMsg] = useState("");
	const [updatedKey, setUpdatedKey] = useState(0);

	useEffect(() => {
		incomeRef.current.focus();
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
		income,
		totalSavingAmount,
		totalSavingPercent,
	]);

	const handleFocus = (event) => event.target.select();

	const handleSubmitExpense = async (e) => {
		e.preventDefault(e);
		if (
			!expenseName ||
			(!expenseFlatCost && !expensePercentage) ||
			(expenseFlatCost == 0 && expensePercentage == 0)
		) {
			setErrMsg(
				"Please include a name for your expense and a percentage of your income or dollar amount for how much you spend/wish to spend on that expense each month"
			);
			return;
		}
		try {
			const response = await axiosPrivate.put(
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
			// reset input fields to stop multiple put requests
			setExpenseName("Example: Rent");
			setExpensePercentage(0);
			setExpenseFlatCost(0);
			setUpdatedKey(1+updatedKey);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No response from the server");
				console.error(err);
				//navigate("/login", { state: { from: location }, replace: true });
			} else if (err.response?.status === 409) {
				setErrMsg("An expense with this name already exists.");
				console.error(err);
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
		if (
			!savingName ||
			(!savingFlatCost && !savingPercentage) ||
			(savingFlatCost == 0 && savingPercentage == 0)
		) {
			setErrMsg(
				"Please include a name for your saving/investment and a percentage of your income or dollar amount for how much you wish to invest in this saving/investment each month"
			);
			return;
		}
		try {
			const response = await axiosPrivate.put(
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
			// clear input fields to stop multiple put requests
			setExpenseName("Example: Retirement (401k)");
			setExpensePercentage(0);
			setExpenseFlatCost(0);
			setUpdatedKey(1+updatedKey);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No response from the server");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			} else if (err.response?.status === 409) {
				setErrMsg("A saving/investment with this name already exists.");
				console.error(err);
			} else {
				setErrMsg("Submission Failed");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
			errRef.current.focus();
		}
	};

	const handleSubmitIncome = async (e) => {
		e.preventDefault(e);
		if (!income || income == 0) {
			setErrMsg("Please include a value for your current income.");
			return;
		}
		try {
			const response = await axiosPrivate.put(
				BUDGET_URL,
				JSON.stringify({ income }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					signal: controller.signal,
				}
			);
			console.log(response.data);
			alert("Income was submitted: $" + income);
			// clear input fields to stop multiple put requests
			setIncome(0);
			setUpdatedKey(1+updatedKey);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No response from the server");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			} else if (err.response?.status === 400) {
				setErrMsg("Income value is required.");
				console.error(err);
			} else {
				setErrMsg("Submission Failed");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
			errRef.current.focus();
		}
	};

	const handleSubmitSavingAmount = async (e) => {
		e.preventDefault(e);
		if (
			(!totalSavingAmount && !totalSavingPercent) ||
			(totalSavingAmount == 0 && totalSavingPercent == 0)
		) {
			setErrMsg(
				"Please include a percentage of your income or dollar amount for how much you wish to invest in this saving/investment each month"
			);
			return;
		}
		try {
			const response = await axiosPrivate.post(
				BUDGET_URL,
				JSON.stringify({ totalSavingAmount, totalSavingPercent }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					signal: controller.signal,
				}
			);
			console.log(response.data);
			if (totalSavingPercent && totalSavingPercent > 0) {
				alert("Saving submitted: " + totalSavingPercent + "% of each paycheck");
			} else {
				alert(
					"Saving amount was submitted: $" +
						totalSavingAmount +
						" of each paycheck"
				);
			}
			// clear input fields to stop multiple put requests
			setTotalSavingAmount(0);
			setTotalSavingPercent(0);
			setUpdatedKey(1+updatedKey);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No response from the server");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			} else if (err.response?.status === 400) {
				setErrMsg("Saving amount/percent is required.");
				console.error(err);
			} else {
				setErrMsg("Submission Failed");
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
			errRef.current.focus();
		}
	};

	return (
		<div className="budget-submitter-wrapper">
			<GetExpensesList key={updatedKey} />
			<div className="budget-submission-form">
				<p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
					{errMsg}
				</p>
				<form onSubmit={(e) => handleSubmitIncome(e)}>
					<h3>Enter this months income</h3>
					<label htmlFor="income">Income $</label>
					<input
						name="income"
						type="number"
						min="0"
						max="1000000000"
						id="income"
						aria-describedby="incomeNote"
						autoComplete="off"
						ref={incomeRef}
						value={income}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setIncome(e.target.value)}
						required
						onFocus={() => setIncomeFocus(true)}
						onBlur={() => setIncomeFocus(false)}
					/>
					&nbsp;
					<input
						disabled={!income || income == 0 ? true : false}
						type="submit"
						value="Submit"
						onSubmit={(e) => handleSubmitIncome(e)}
					/>
					<p
						id="incomeNote"
						className={incomeFocus && !income ? "instructions" : "offscreen"}
					>
						<FaIcons.FaInfoCircle />
						Enter your monthly income <br />
						Must be a whole number greater than 0. <br />
					</p>
				</form>
				<form onSubmit={(e) => handleSubmitExpense(e)}>
					<h3>Enter an expense</h3>
					<label htmlFor="expenseName">Expense: </label>
					<input
						type="text"
						id="expenseName"
						name="expenseName"
						autoComplete="off"
						aria-describedby="expenseNameNote"
						value={expenseName}						
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setExpenseName(e.target.value)}
						required
						onFocus={() => setExpenseNameFocus(true)}
						onBlur={() => setExpenseNameFocus(false)}
					/>
					&nbsp;
					<input
						name="expensePercentage"
						type="number"
						min="0"
						max="100"
						id="expensePercentage"
						aria-describedby="expensePercentageNote"
						autoComplete="off"
						value={expensePercentage}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setExpensePercentage(e.target.value)}
						onFocus={() => setExpensePercentageFocus(true)}
						onBlur={() => setExpensePercentageFocus(false)}
					/>
					<label htmlFor="expensePercentage">% of income </label>
					<label htmlFor="expenseFlatCost">or cost in $</label>
					<input
						name="expenseFlatCost"
						type="number"
						min="0"
						max="1000000"
						id="expenseFlatCost"
						aria-describedby="expenseCostNote"
						autoComplete="off"
						onClick={(e) => handleFocus(e)}
						value={expenseFlatCost}
						onChange={(e) => setExpenseFlatCost(e.target.value)}
						onFocus={() => setExpenseFlatCostFocus(true)}
						onBlur={() => setExpenseFlatCostFocus(false)}
					/>
					&nbsp;
					<input
						disabled={
							!expenseName ||
							(expensePercentage == 0 && expenseFlatCost == 0) ||
							expensePercentage === "" ||
							expenseFlatCost === ""
								? true
								: false
						}
						type="submit"
						value="Submit"
						onSubmit={(e) => handleSubmitExpense(e)}
					/>
					<p
						id="expenseNameNote"
						className={expenseNameFocus ? "instructions" : "offscreen"}
					>
						<FaIcons.FaInfoCircle />
						Enter a name for this expense, <br />
						Must not be blank <br />
					</p>
					<p
						id="expensePercentageNote"
						className={
							expensePercentageFocus && !expensePercentage
								? "instructions"
								: "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter how much of your monthly income you want to commit to this
						expense, <br />
						Must be a value between 1-99%, not required if you wish to only
						enter a flat $ cost.
						<br />
					</p>
					<p
						id="expenseCostNote"
						className={
							expenseFlatCostFocus && !expenseFlatCost
								? "instructions"
								: "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter how much of your months income you want to commit to this
						expense, <br />
						Must be a value rounded to the nearest whole dollar, not required if
						you wish to only enter a percentage of monthly income. <br />
					</p>
				</form>
				<form onSubmit={(e) => handleSubmitSavingAmount(e)}>
					<h3>How much would you like to save from each paycheck?</h3>
					<label htmlFor="totalSavingAmount">Save a total of $</label>
					<input
						name="totalSavingAmount"
						type="number"
						min="0"
						id="totalSavingAmount"
						autoComplete="off"
						aria-describedby="totalSavingAmountNote"
						value={totalSavingAmount}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setTotalSavingAmount(e.target.value)}
						required
						onFocus={() => setTotalSavingAmountFocus(true)}
						onBlur={() => setTotalSavingAmountFocus(false)}
					/>
					<label> or </label>
					<input
						name="totalSavingPercent"
						type="number"
						min="0"
						max="100"
						id="totalSavingPercent"
						autoComplete="off"
						aria-describedby="totalSavingPercentNote"
						value={totalSavingPercent}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setTotalSavingPercent(e.target.value)}
						required
						onFocus={() => setTotalSavingPercentFocus(true)}
						onBlur={() => setTotalSavingPercentFocus(false)}
					/>
					<label htmlFor="totalSavingPercent">% of each paycheck.</label>
					&nbsp;
					<input
						disabled={
							(totalSavingPercent == 0 && totalSavingAmount == 0) ||
							totalSavingPercent === "" ||
							totalSavingAmount === ""
								? true
								: false
						}
						type="submit"
						value="Submit"
						onClick={(e) => handleFocus(e)}
						onSubmit={(e) => handleSubmitIncome(e)}
					/>
					<p
						id="totalSavingAmountNote"
						className={
							totalSavingAmountFocus && !totalSavingAmount
								? "instructions"
								: "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter how much of your income you wish to allocate to
						savings/investments each month, <br />
						Must be a value rounded to the nearest whole dollar, not required if
						you wish to only enter a percentage of monthly income. <br />
					</p>
					<p
						id="totalSavingPercentNote"
						className={
							totalSavingPercentFocus && !totalSavingPercent
								? "instructions"
								: "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter what percentage you wish to allocate to savings/investments
						each month, <br />
						Must be a value between 1-99%, not required if you wish to only
						enter an dollar amount. <br />
					</p>
				</form>
				<form onSubmit={(e) => handleSubmitSaving(e)}>
					<h3>Enter a saving/investment</h3>
					<label htmlFor="savingName">Saving: </label>
					<input
						name="savingName"
						type="text"
						id="savingName"
						ref={savingRef}
						autoComplete="off"
						aria-describedby="savingNameNote"
						value={savingName}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setSavingName(e.target.value)}
						required
						onFocus={() => setSavingNameFocus(true)}
						onBlur={() => setSavingNameFocus(false)}
					/>
					&nbsp;
					<input
						name="savingPercentage"
						type="number"
						min="0"
						max="100"
						id="savingPercentage"
						aria-describedby="savingPercentageNote"
						autoComplete="off"
						value={savingPercentage}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setSavingPercentage(e.target.value)}
						onFocus={() => setSavingPercentageFocus(true)}
						onBlur={() => setSavingPercentageFocus(false)}
					/>
					<label htmlFor="savingPercentage">% of savings fund </label>
					<label htmlFor="savingFlatCost">or amount in $</label>
					<input
						name="savingFlatCost"
						type="number"
						min="0"
						max="1000000000"
						id="savingFlatCost"
						autoComplete="off"
						aria-describedby="savingCostNote"
						value={savingFlatCost}
						onClick={(e) => handleFocus(e)}
						onChange={(e) => setSavingFlatCost(e.target.value)}
						onFocus={() => setSavingFlatCostFocus(true)}
						onBlur={() => setSavingFlatCostFocus(false)}
					/>
					&nbsp;
					<input
						disabled={
							!savingName ||
							(savingPercentage == 0 && savingFlatCost == 0) ||
							savingPercentage === "" ||
							savingFlatCost === ""
								? true
								: false
						}
						type="submit"
						value="Submit"
						onSubmit={(e) => handleSubmitSaving(e)}
					/>
					<p
						id="savingPercentageNote"
						className={
							savingPercentageFocus && !savingPercentage
								? "instructions"
								: "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter how much of your monthly saving allocation you want to commit
						to this saving/investment, <br />
						Must be a value between 1-99%, not required if you wish to only
						enter a flat $ amount.
						<br />
					</p>
					<p
						id="savingCostNote"
						className={
							savingFlatCostFocus && !savingFlatCost
								? "instructions"
								: "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter how much of your monthy saving allocation you want to commit
						to this saving, <br />
						Must be a value rounded to the nearest whole dollar, not required if
						you wish to only enter a percentage of monthly savings. <br />
					</p>
					<p
						id="savingNameNote"
						className={savingNameFocus ? "instructions" : "offscreen"}
					>
						<FaIcons.FaInfoCircle />
						Enter a name for this saving/investment type, <br />
						Must not be blank <br />
					</p>
				</form>
			</div>
		</div>
	);
};
