import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/Dashboard.css";

const SAVINGS_URL = "/savings";
const controller = new AbortController();

export const Dashboard = () => {
	const [budget, setBudget] = useState();
	const grossIncomeRef = useRef();
	const errRef = useRef();

	const [grossIncome, setGrossIncome] = useState("");
	const [grossIncomeFocus, setGrossIncomeFocus] = useState(false);
	const [savingAmount, setSavingAmount] = useState(false);

	const [errMsg, setErrMsg] = useState("");

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
						setSavingAmount(savingAsPerecentOfIncome);
					} else {
						setSavingAmount(savingTotalAmount);
					}
				} else if (!savingTotalAmount) {
					setSavingAmount(Math.round(income * (savingPercentOfIncome / 100)));
				} else {
					setSavingAmount(savingTotalAmount);
				}
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getBudgets();
		grossIncomeRef.current.focus();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [grossIncome]);

	const handleSubmitGrossIncome = async (e) => {
		e.preventDefault(e);
		if (!grossIncome || grossIncome == 0) {
			setErrMsg("Please include a value for your current yearly Income.");
			return;
		}
		try {
			const response = await axiosPrivate.post(
				SAVINGS_URL,
				JSON.stringify({ grossIncome }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					signal: controller.signal,
				}
			);
			console.log(response.data);
			alert("Income was submitted: $" + grossIncome);
			// clear input fields to stop multiple put requests
			setGrossIncome(0);
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
				//navigate("/login", { state: { from: location }, replace: true });
			}
			errRef.current.focus();
		}
	};

	return (
		<section className="dashboard-wrapper">
			<div className="gross-income-submission-form">
				<form onSubmit={(e) => handleSubmitGrossIncome(e)}>
					<h3>Enter your gross annual income</h3>
					<label htmlFor="income">Yearly Income $</label>
					<input
						name="grossIncome"
						type="number"
						min="0"
						max="1000000000"
						id="grossIncome"
						aria-describedby="grossIncomeNote"
						autoComplete="off"
						ref={grossIncomeRef}
						value={grossIncome}
						onChange={(e) => setGrossIncome(e.target.value)}
						required
						onFocus={() => setGrossIncomeFocus(true)}
						onBlur={() => setGrossIncomeFocus(false)}
					/>
					&nbsp;
					<input
						disabled={!grossIncome || grossIncome == 0 ? true : false}
						className="submit-button"
						type="submit"
						value="Submit"
						onSubmit={(e) => handleSubmitGrossIncome(e)}
					/>
					<p
						id="incomeNote"
						className={
							grossIncomeFocus && !grossIncome ? "instructions" : "offscreen"
						}
					>
						<FaIcons.FaInfoCircle />
						Enter your gross annual income (Yearly income before taxes.) <br />
						Must be a whole number greater than 0. <br />
					</p>
				</form>
			</div>
			<div className="dashboard-info-panel">
				<p>You are saving approx. {savingAmount} from each paycheck. </p>
			</div>
		</section>
	);
};