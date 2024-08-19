import React, { useEffect, useState } from "react";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

export function Tree(props) {
	const [dataSource, setDataSource] = useState([]);
	useEffect(() => {
		const treeDataSource = BuildTree(props.treeItems, null);
		setDataSource(treeDataSource);
	},[props]);

	function BuildTree(items, parentId) {
		const childItems = items.filter(i => {
			return i[props.parentIdFieldName] === parentId;
		});

		if(childItems && childItems.length) {
			return childItems.map(i => {
				return {
					id: i[props.itemIdFieldName],
					label: i[props.itemLabelFieldName],
					children: BuildTree(items, i[props.itemIdFieldName])
				}
			});
		} else {
			return childItems.map(i => {
				return {
					id: i[props.itemIdFieldName],
					label: i[props.itemLabelFieldName]
				}
			});
		}
	}

	return (
		<RichTreeView items={dataSource} 
			onItemClick={props.onSelect}
		/>
	);
}