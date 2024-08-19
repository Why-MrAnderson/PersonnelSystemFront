import { Button, TextField } from "@mui/material";
import "./OrganizationUnits.css";
import { OrganizationUnitsModal } from "./OrganizationUnitsModal/OrganizationUnitsModal";
import { useEffect, useState } from "react";
import {Tree} from "../Tree/Tree";

export function OrganizationUnits() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOrganizationUnit, setSelectedOrganizationUnit] = useState();
	const [organizationUnits, setOrganizationUnits] = useState([]);

	useEffect(() => {
		void (async () => {
			var result = await GetAllOrganizationUnits();
			setOrganizationUnits(result);
		})();
	},[]);

	function GetAllOrganizationUnits(date){
		return fetch(`http://localhost:5000/api/OrganizationalUnits/GetOrganizationalUnits${date ? `?date=${date}` : ""}`)
			.then((result) => {
				return result.json();
			});
	}

	function OnSelect(e, itemId) {
		setSelectedOrganizationUnit(organizationUnits.find(x => x.id === itemId));
	}

	function OnSubmit(formOrganizationUnit) {
		void (async () => {
			if(formOrganizationUnit.id) {
				const body = JSON.stringify({
					Id: formOrganizationUnit.id,
					UnitName: formOrganizationUnit.unitName,
					ParentId: Boolean(formOrganizationUnit.parentId) && formOrganizationUnit.parentId !== "" ? formOrganizationUnit.parentId : null
				});

				await(await fetch("http://localhost:5000/api/OrganizationalUnits/UpdateOrganizationalUnit", {
					method: "PUT",
					body,
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
				}));

				const updatedOrganizationUnitIndex = organizationUnits.findIndex(x => x.id === formOrganizationUnit.id);
				const updatedOrganizationUnitsList = [...organizationUnits];
				updatedOrganizationUnitsList[updatedOrganizationUnitIndex] = {
					id: formOrganizationUnit.id,
					unitName: formOrganizationUnit.unitName,
					parentId: Boolean(formOrganizationUnit.parentId) && formOrganizationUnit.parentId !== "" ? formOrganizationUnit.parentId : null
				};

				setOrganizationUnits(updatedOrganizationUnitsList)
	
				CloseModal();
			} else {
				const body = JSON.stringify({
					Id: "00000000-0000-0000-0000-000000000000",
					UnitName: formOrganizationUnit.unitName,
					ParentId: Boolean(formOrganizationUnit.parentId) && formOrganizationUnit.parentId !== "" ? formOrganizationUnit.parentId : null
				});

				var createdOrganizationUnit = await(await fetch("http://localhost:5000/api/OrganizationalUnits/CreateOrganizationalUnit", {
					method: "POST",
					body,
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
				})).json();

				setOrganizationUnits([
					...organizationUnits,
					createdOrganizationUnit
				]);
	
				CloseModal();
			}

		})();
	}

	function CloseModal() {
		setIsOpen(false);
	}

	function AddOrganizationUnit() {
		setSelectedOrganizationUnit(null);
		setIsOpen(true);
	}

	function EditOrganizationUnit(id) {
		return () => {
			if(selectedOrganizationUnit) {
				setSelectedOrganizationUnit(organizationUnits.find(x => x.id === id));
				setIsOpen(true);
			}
		}
	}

	function DeleteOrganizationUnit(id) {
		return () => {
			void (async () => {
				await fetch(`http://localhost:5000/api/OrganizationalUnits/DeleteOrganizationalUnit/${id}`, {
					method: "DELETE"
				});
			})();
			setOrganizationUnits(organizationUnits.filter((e) => e.id !== id));
		}
	}

	function ApplyFilter(e) {
		e.preventDefault();
		const formData = new FormData(document.getElementById("organization-units-filter"));
		const form = {};

		for (const [name,value] of formData) {
			Object.assign(form, {[name]: value})
		};

		void (async () => {
			var result = await GetAllOrganizationUnits(form.date);
			setOrganizationUnits(result);
		})();
	}

	return (
		<div className="organization-units">
			<Button onClick={AddOrganizationUnit}>+Добавить</Button>
			<Button onClick={EditOrganizationUnit(selectedOrganizationUnit?.id)} disabled={!Boolean(selectedOrganizationUnit?.id)}>Редактировать</Button>
			<Button onClick={DeleteOrganizationUnit(selectedOrganizationUnit?.id)} disabled={!Boolean(selectedOrganizationUnit?.id)}>Удалить</Button>
			<div className="organization-units-filter">
				<form onSubmit={ApplyFilter} id="organization-units-filter">
					<TextField name="date" label="Подразделения на дату (ГГГГ-ММ-ДД):" />
					<Button type="submit">Применить</Button>
				</form>
			</div>
			<Tree 
				treeItems={organizationUnits}	
				onSelect={OnSelect}
				itemIdFieldName={"id"}
				itemLabelFieldName={"unitName"}
				parentIdFieldName={"parentId"}
			/>
			<OrganizationUnitsModal
				open={isOpen}
				onSubmit={OnSubmit}
				selectedOrganizationUnit={selectedOrganizationUnit}
				existedOrganizationUnits={organizationUnits}
				closeModal={CloseModal}
			/>
		</div>
	);
}