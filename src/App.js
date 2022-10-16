import { Route, Routes } from "react-router-dom";
import "./css/index.css";
import Homepage from "./Pages/Homepage.jsx";
import TrackerRings from "./BudgetTracker/TrackerRings.jsx";
import RegistrationPage from "./Pages/RegistrationPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import AdminDashboard from "./Pages/Admin";
import BudgetDashboard from "./Pages/BudgetDashboard";
import Unauthorized from "./Pages/Unauthorized.jsx";
import EditorDashboard from "./Pages/Editor.jsx";
import Missing from "./Pages/Missing.jsx";
import Layout from "./Pages/Layout.js";
import RequireAuth from "./Components/RequireAuth";
import Logout from "./Components/Logout";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="register" element={<RegistrationPage />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="unauthorized" element={<Unauthorized />} />
				<Route path="logout" element={<Logout />} />

				<Route element={<RequireAuth allowedRoles={[2001]} />}>
					<Route path="/" element={<Homepage />} />
					<Route path="rings" element={<TrackerRings />} />
					<Route path="dashboard" element={<BudgetDashboard />} />
					<Route path="goals" element={<BudgetDashboard />} />
					<Route path="share" element={<BudgetDashboard />} />
				</Route>
				<Route element={<RequireAuth allowedRoles={[5150, 3005, 7776]} />}>
					<Route path="admin" element={<AdminDashboard />} />
				</Route>
				<Route element={<RequireAuth allowedRoles={[1984, 3005, 7776]} />}>
					<Route path="editor" element={<EditorDashboard />} />
				</Route>

				<Route path="*" element={<Missing />} />
			</Route>
		</Routes>
	);
}

export default App;
