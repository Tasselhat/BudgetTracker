import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const BUDGETS_URL = "/budgets";

const Budgets = () => {
	const [budgets, setBudgets] = useState();
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getAllBudgets = async () => {
			try {
				const response = await axiosPrivate.get(BUDGETS_URL, {
					signal: controller.signal,
				});
				console.log(response.data);
				isMounted && setBudgets(response.data);
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getAllBudgets();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [axiosPrivate]);

	return (
		<article>
			<h2>User Budgets List</h2>
			{budgets?.length ? (
				<ul>
					{budgets.map((budgets, i) => (
						<div>
							<li key={i}>{budgets?.ownerUsername}'s Budget</li>
							<li key={i}>{budgets?.expenses.length} expenses</li>
							<li key={i}>{budgets?.savings.length} savings</li>
							<li key={i}>saving {budgets?.saving.percent}% or ${budgets?.saving.total} from each paycheck</li>
							<li key={i}>${budgets?.yearlyGrossIncome} Gross Income</li>
						</div>
					))}
				</ul>
			) : (
				<h2>No Budgets found</h2>
			)}
		</article>
	);
};

export default Budgets;
