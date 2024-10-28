import React from "react";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/person-api"; // Import your API methods
import { Button } from 'reactstrap'; // Make sure to import Button for styling

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Role',
        accessor: 'role',
    },
    {
        Header: 'Password',
        accessor: 'password',
    },
    {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
            <Button color="danger" onClick={() => {
                const personId = row.original.id; // Accessing the ID correctly
                if (personId) {
                    row.original.onDelete(personId); // Call the onDelete function passed from the parent
                } else {
                    console.error("Person ID is undefined");
                }
            }}>
                Delete
            </Button>
        ),
    }
];

const filters = [
    {
        accessor: 'id',
    }
];
class PersonTable extends React.Component {
    render() {
        return (
            <Table
                data={this.props.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
        );
    }
}

export default PersonTable;
