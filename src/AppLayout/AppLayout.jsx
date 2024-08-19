import { Outlet } from "react-router";
import { AppMenu } from "../AppMenu/AppMenu";
import "./AppLayout.css";

export function AppLayout() {
	return (
		<div className="app-content">
			<AppMenu />
			<div className="selected-menu-item-content">
				<Outlet />
			</div>
		</div>
	);
}