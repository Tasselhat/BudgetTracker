import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/Homepage.css"

const SAVINGS_URL = "/savings";
const controller = new AbortController();

export const Homepage = () => {
	const grossIncomeRef = useRef();
	const errRef = useRef();

	const [grossIncome, setGrossIncome] = useState("");
	const [grossIncomeFocus, setGrossIncomeFocus] = useState(false);

	const [errMsg, setErrMsg] = useState("");

	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		grossIncomeRef.current.focus();
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
		<section className="homepage-wrapper">
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
		</section>
	);
};
