import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

export default function Read2() {
    const [APIData, setAPIData] = useState([]);
    const [userID, setUserID] = useState('');
    const [userData, setUserData] = useState(null);
    const API_URL = '/device';

   
    const navigate = useNavigate();

    useEffect(() => {
       
        const loggedInUser = JSON.parse(localStorage.getItem('user')); 
        if (!loggedInUser || loggedInUser.role !== 'admin') {
            navigate('/'); 
        }

        getData();
    }, [navigate]);

    const getData = () => {
        axios.get(API_URL)
            .then((response) => {
                console.log('API Response:', response.data); 
                setAPIData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const getUserById = () => {
        if (userID) {
            axios.get(`${API_URL}/${userID}`)
                .then((response) => {
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching user by ID:', error);
                });
        }
    };

    const setData = (data) => {
        const { id, description, address, hourly } = data; 
        localStorage.setItem('ID', id);
        localStorage.setItem('Description', description);
        localStorage.setItem('Address', address);
        localStorage.setItem('Hourly', hourly);
    };

    const onDelete = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
            });
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <Input
                    placeholder="Enter Device ID"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                />
                <Button onClick={getUserById}>Get Device by ID</Button>
            </div>

            {userData && (
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Hourly Rate</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>{userData.id}</Table.Cell>
                            <Table.Cell>{userData.description}</Table.Cell>
                            <Table.Cell>{userData.address}</Table.Cell>
                            <Table.Cell>{userData.hourly}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            )}

            <h3>All Devices</h3>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Hourly Rate</Table.HeaderCell>
                        <Table.HeaderCell>Update</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {APIData.map((data) => (
                        <Table.Row key={data.id}>
                            <Table.Cell>{data.id}</Table.Cell>
                            <Table.Cell>{data.description}</Table.Cell>
                            <Table.Cell>{data.address}</Table.Cell>
                            <Table.Cell>{data.hourly}</Table.Cell>
                            <Table.Cell>
                                <Link to='/update2'>
                                    <Button onClick={() => setData(data)}>Update</Button>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Button onClick={() => onDelete(data.id)}>Delete</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}