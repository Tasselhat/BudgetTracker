import React from "react";
import { useState } from "react";
import Users from "../Components/Users";
import Budgets from "../Components/Budgets";

export default function AdminDashboard() {
	const [displayUsers, setDisplayUsers] = useState(true);
	const [displayBudgets, setDisplayBudgets] = useState(true);

	return (
		<>
			<h1>Admin Dashboard</h1>
			{displayUsers ? (
				<section>
					<Users />
				</section>
			) : (
				<section>
					<h1>Tools go here</h1>
					<br />
				</section>
			)}
			{displayBudgets ? (
				<section>
					<Budgets />
				</section>
			) : (
				<section>
					<h1>Tools go here</h1>
					<br />
				</section>
			)}
		</>
	);
}
