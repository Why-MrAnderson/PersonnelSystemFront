import { Tabs, Tab } from "@mui/material";
import "./AppMenu.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AppMenu() {
	const [selectedMenuItem, setSelectedMenuItem] = useState();
	const navigate = useNavigate();
	useEffect(() => {
		if(selectedMenuItem) {
			navigate(`/${selectedMenuItem}`)
		}
		
	}, [selectedMenuItem])

	function onChange(e, selectedValue) {
		setSelectedMenuItem(selectedValue);
	}

	return (
		<div className="app-menu">
			<Tabs orientation="vertical"
				onChange={onChange}
				value={selectedMenuItem}
			>
				<Tab label="Сотрудники" value={"employees"} key="employees-tab"/>
				<Tab label="Подразделения" value={"organizationUnits"} key="organization-units-tab"/>
			</Tabs>
		</div>
	);
}