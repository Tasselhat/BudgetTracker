import React from "react";
import { useState } from "react";
import Users from "../Components/Users";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
	const [displayUsers, setDisplayUsers] = useState(true);
	const [displayEmployees, setDisplayEmployees] = useState(false);

	return (
		<>
			{displayUsers ? (
				<section>
					<Users />
				</section>
			) : displayEmployees ? (
				<section>
					<h2>Employees</h2>
				</section>
			) : (
				<section>
					<h1>Admin Dashboard</h1>
					<br />
				</section>
			)}
		</>
	);
}
