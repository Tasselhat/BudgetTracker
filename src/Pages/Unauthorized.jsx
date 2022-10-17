import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
	const navigate = useNavigate();

	const goBack = () => navigate(-1);

	return (
		<section className="unauth-page-wrapper">
			<h1>Acess Denied</h1>
			<p>You do not have access to the requested page</p>
			<div>
				<button onClick={goBack}>Take Me Back</button>
			</div>
		</section>
	);
}
