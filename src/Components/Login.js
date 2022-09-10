import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const LOGIN_URL = "./auth";

export const Login = () => {
	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [success, setSucess] = useState(false); // navigate to a new page with react router for a successful login later

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				LOGIN_URL,
				JSON.stringify({ user, pwd }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			console.log(JSON.stringify(response?.data));
			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;
			setAuth({ user, pwd, roles, accessToken });
			setUser("");
			setPwd("");
			setSucess(true);
			setTimeout(() => {
				navigate(from, { replace: true });
			}, 1500);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.response?.status === 401) {
				setErrMsg("Unauthorized, incorrect username or password.");
			} else {
				setErrMsg("Login failed");
			}
			errRef.current.focus();
			console.error(err);
		}
	};

	return (
		<>
			{success ? (
				<section>
					<h1>You have been logged in!</h1>
					<br />
					<p>
						Redirecting automatically... <br />
						<Link to="/">Go to home</Link>
					</p>
				</section>
			) : (
				<section className="loginSection">
					<p
						ref={errRef}
						className={errMsg ? "errmsg" : "offscreen"}
						aria-live="assertive"
					>
						{errMsg}
					</p>
					<h1>Sign In</h1>
					<form className="loginForm" onSubmit={handleSubmit}>
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="username"
							onChange={(e) => setUser(e.target.value)}
							value={user}
							required
						/>
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={(e) => setPwd(e.target.value)}
							value={pwd}
							required
						/>
						<button>Sign In</button>
					</form>
					<p>
						Need an account?
						<br />
						<Link to="/register">Sign Up</Link>
					</p>
				</section>
			)}
		</>
	);
};
