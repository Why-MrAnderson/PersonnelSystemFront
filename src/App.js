import "./App.css";
import { useRoutes } from "react-router";
import { buildRoutes } from "./Routes/routes";

function App() {
	const appRoutes = useRoutes(buildRoutes());

	return appRoutes || <></>;
}

export default App;
