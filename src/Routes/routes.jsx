import { AppLayout } from "../AppLayout/AppLayout";
import { Employees } from "../Employees/Employees";
import { OrganizationUnits } from "../OrganizationUnits/OrganizationUnits";

export function buildRoutes() {
	return [
		{
			caseSensitive: false,
			path: "/",
			element: <AppLayout />,
			children: [
				{
					caseSensitive: false,
					path: "employees",
					element: <Employees />
				},
				{
					caseSensitive: false,
					path: "organizationUnits",
					element: <OrganizationUnits />
				}
			]
		}
	];
}