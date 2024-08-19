import React, { useEffect, useState } from "react";
import { Button, Dialog, TextField, FormControl, InputLabel, Select, MenuItem} from "@mui/material";

import "./EmployeesModal.css";

export function EmployeesModal(props) {
	const [open, setOpen] = React.useState(false);
	const [organizationUnits, setOrganizationUnits] = useState();

	useEffect(() => {
		setOpen(Boolean(props.open))
		void (async () => {
			var orgUnits = await(await fetch("http://localhost:5000/api/OrganizationalUnits/GetOrganizationalUnits")).json();
			setOrganizationUnits(orgUnits);
		})();
	}, [props.open]);

	const handleClose = () => {
		props.closeModal();
	};

	function OnSubmit(e) {
		e.preventDefault();
		const formData = new FormData(document.getElementById("employees-modal-form"));
		const result = {};

		for (const [name,value] of formData) {
			Object.assign(result, {[name]: value})
		};
		props.onSubmit(result);
	}

	return (
		<Dialog
	        open={open}
	        onClose={handleClose}
			onSelect={props.onSelect}
      	>
			<div className="employees-modal">
				<form id="employees-modal-form" onSubmit={OnSubmit}>
					<div className="employees-modal-text-field hidden"><TextField name="id" label="id" defaultValue={props.selectedEmployee?.id}/></div>
					<div className="employees-modal-text-field"><TextField name="Surname" label="Фамилия" defaultValue={props.selectedEmployee?.surname} /></div>
					<div className="employees-modal-text-field"><TextField name="Name" label="Имя" defaultValue={props.selectedEmployee?.name} /></div>
					<div className="employees-modal-text-field"><TextField name="Patronymic" label="Отчество" defaultValue={props.selectedEmployee?.patronymic} /></div>
					<FormControl fullWidth>
						<InputLabel id="orgunit-label">Подразделение пользователя</InputLabel>
						<Select
							labelId="orgunit-label"
							label="Подразделение пользователя"
							defaultValue={props.selectedEmployee?.organizationalUnitId || null}
							name={"OrganizationalUnitId"}
						>
							{organizationUnits?.map(o => {
								return <MenuItem key={o.id} value={o.id}>{o.unitName}</MenuItem>
							})}
						</Select>
					</FormControl>
					
					<div className="employees-modal-button"><Button type="submit">Сохранить</Button></div>
				</form>
			</div>
		</Dialog>
	);
}