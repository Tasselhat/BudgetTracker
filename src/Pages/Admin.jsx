import React from "react";
import { useState } from "react";
import Users from "../Components/Users";
import Budgets from "../Components/Budgets";
import "../css/Admin.css";

export default function AdminDashboard() {
	const [displayUsers, setDisplayUsers] = useState(true);
	const [displayBudgets, setDisplayBudgets] = useState(true);

	return (
		<section className="admin-wrapper">
			<h1>Admin Dashboard</h1>
			{displayUsers ? (
				<section className="users-wrapper">
					<Users />
				</section>
			) : (
				<section>
					<h1>User List Goes Here</h1>
					<br />
				</section>
			)}
			{displayBudgets ? (
				<section className="budgets-wrapper">
					<Budgets />
				</section>
			) : (
				<section>
					<h1>Budgets go here</h1>
					<br />
				</section>
			)}
		</section>
	);
}
