import React, { useEffect, useState } from "react";
import { Button, Dialog, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import "./OrganizationUnitsModal.css";

export function OrganizationUnitsModal(props) {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		setOpen(Boolean(props.open))
	}, [props.open]);

	const handleClose = () => {
		props.closeModal();
	};

	function OnSubmit(e) {
		e.preventDefault();
		const formData = new FormData(document.getElementById("organization-units-modal-form"));
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
			<div className="organization-units-modal">
				<form id="organization-units-modal-form" onSubmit={OnSubmit}>
					<div className="organization-units-modal-text-field hidden"><TextField name="id" label="id" defaultValue={props.selectedOrganizationUnit?.id}/></div>
					<div className="organization-units-modal-text-field"><TextField name="unitName" label="Название" defaultValue={props.selectedOrganizationUnit?.unitName} /></div>
					<FormControl fullWidth>
						<InputLabel id="parent-label">Родительское подразделение</InputLabel>
						<Select
							labelId="parent-label"
							label="Родительское подразделение"
							defaultValue={props.selectedOrganizationUnit?.parentId || null}
							name={"parentId"}
						>
							{props.existedOrganizationUnits?.filter(o => {
								return o.id !== props.selectedOrganizationUnit?.id;
							}).map(o => {
								return <MenuItem key={o.id} value={o.id}>{o.unitName}</MenuItem>
							})}
						</Select>
					</FormControl>
					<div className="organization-units-modal-button"><Button type="submit">Сохранить</Button></div>
				</form>
			</div>
		</Dialog>
	);
}