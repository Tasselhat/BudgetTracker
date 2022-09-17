import React from "react";
import { useState } from "react";
import Users from "../Components/Users";

export default function AdminDashboard() {
	const [displayUsers, setDisplayUsers] = useState(true);
	const [displayBudgets, setDisplayBudgets] = useState(false);

	return (
		<>
			<h1>Admin Dashboard</h1>
			{displayUsers ? (
				<section>
					<Users />
				</section>
			) : displayBudgets ? (
				<section>
					<div />
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
