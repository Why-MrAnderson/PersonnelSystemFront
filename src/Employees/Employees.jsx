import { useEffect, useState } from "react";
import "./Employees.css";
import { DataGrid } from '@mui/x-data-grid';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { EmployeesModal } from "./EmployeesModal/EmployeesModal";

export function Employees() {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState();
	const [organizationUnits, setOrganizationUnits] = useState();
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		void (async () => {
				var allEmployees = await GetAllEmployees();
				var orgUnits = await(await fetch("http://localhost:5000/api/OrganizationalUnits/GetOrganizationalUnits")).json();
				setOrganizationUnits(orgUnits);
				setEmployees(allEmployees);
		})();
	}, []);

	function GetAllEmployees(start, end, organizationalUnitId){
		let parameters = "";
		if(start && end && organizationalUnitId) {
			parameters = `?start=${start}&end=${end}&organizationalUnit=${organizationalUnitId}`;
		}
		return fetch(`http://localhost:5000/api/Employees/GetEmployees${parameters}`)
			.then((result) => {
				return result.json();
			});
	}

	function AddEmployee() {
		setSelectedEmployee(null);
		setIsOpen(true);
	}

	function EditEmployee(id) {
		return () => {
			setSelectedEmployee(employees.find(x => x.id === id));
			setIsOpen(true);
		}
	}

	function DeleteEmployee(id) {
		return () => {
			void (async () => {
				await fetch(`http://localhost:5000/api/Employees/DeleteEmployee/${id}`, {
					method: "DELETE"
				});
			})();
			setEmployees(employees.filter((e) => e.id !== id));
		}
	}

	function OnSubmit(formEmployee) {
		void (async () => {
			if(formEmployee.id) {
				const body = JSON.stringify({
					Id: formEmployee.id,
					Name: formEmployee.Name,
					Surname: formEmployee.Surname,
					Patronymic: formEmployee.Patronymic,
					OrganizationalUnitId: formEmployee.OrganizationalUnitId
				});

				await(await fetch("http://localhost:5000/api/Employees/UpdateEmployee", {
					method: "PUT",
					body,
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
				}));

				const updatedEmployeeIndex = employees.findIndex(x => x.id === formEmployee.id);
				const updatedEmployeesList = [...employees];
				updatedEmployeesList[updatedEmployeeIndex] = {
					id: formEmployee.id,
					name: formEmployee.Name,
					surname: formEmployee.Surname,
					patronymic: formEmployee.Patronymic,
					organizationalUnitId: formEmployee.OrganizationalUnitId
				};
	
				setEmployees(updatedEmployeesList)
	
				CloseModal();
			} else {
				const body = JSON.stringify({
					Id: "00000000-0000-0000-0000-000000000000",
					Name: formEmployee.Name,
					Surname: formEmployee.Surname,
					Patronymic: formEmployee.Patronymic,
					OrganizationalUnitId: formEmployee.OrganizationalUnitId || null
				});

				var createdEmployee = await(await fetch("http://localhost:5000/api/Employees/CreateEmployee", {
					method: "POST",
					body,
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
				})).json();

				setEmployees([
					...employees,
					createdEmployee
				]);
	
				CloseModal();
			}

		})();
	}

	function CloseModal() {
		setIsOpen(false);
		setSelectedEmployee(null);
	}

	const columns = [
		{ field: "id", headerName: "Id", width: 200	},
		{ field: "surname",headerName: "Фамилия", width: 200 },
		{ field: "name", headerName: "Имя",	width: 200 },
		{ field: "patronymic", headerName: "Отчество", width: 200 },
		{ field: "organizationalUnitName", headerName: "Подразделение", width: 200 },
		{ field: "Actions", headerName: "", width: 300, renderCell: (e) => {
				return (
					<div className="employee-actions">
						<Button onClick={EditEmployee(e.row.id)}>Редактировать</Button>
						<Button onClick={DeleteEmployee(e.row.id)}>Уволить</Button>
					</div>
				);
			}
		}
	];

	function ApplyFilter(e) {
		e.preventDefault();
		const formData = new FormData(document.getElementById("employees-filter"));
		const form = {};

		for (const [name,value] of formData) {
			Object.assign(form, {[name]: value})
		};

		void (async () => {
			var result = await GetAllEmployees(form.start, form.end, form.organizationalUnitId);
			setEmployees(result);
		})();
	}

	return (
		<div className="employees">
			<Button onClick={AddEmployee}>+Добавить</Button>
			<div className="employees-filter">
				<form onSubmit={ApplyFilter} id="employees-filter">
					<div className="employees-filter-field"><TextField name="start" label="Начало периода (ГГГГ-ММ-ДД):" /></div>
					<div className="employees-filter-field"><TextField name="end" label="Окончание периода (ГГГГ-ММ-ДД):" /></div>
					<div className="employees-filter-field">
						<FormControl fullWidth>
							<InputLabel id="employees-label">Подразделение пользователя</InputLabel>
							<Select
								className="employees-"
								labelId="employees-label"
								label="Подразделение"
								defaultValue={organizationUnits ? organizationUnits[0].id : null}
								name={"organizationalUnitId"}
							>
								{organizationUnits?.map(o => {
									return <MenuItem key={o.id} value={o.id}>{o.unitName}</MenuItem>
								})}
							</Select>
						</FormControl>
					</div>
					<Button type="submit">Применить</Button>
				</form>
			</div>
			<DataGrid
				initialState={{ columns: { columnVisibilityModel: { id: false }}}}
		    	rows={employees.map(e => {
					return {
						...e,
						organizationalUnitName: organizationUnits.find(o => o.id === e.organizationalUnitId)?.unitName
					}
				})}
		    	columns={columns}
		    />
			<EmployeesModal
				open={isOpen}
				onSubmit={OnSubmit}
				selectedEmployee={selectedEmployee}
				closeModal={CloseModal} 
			/>
		</div>
	);
}