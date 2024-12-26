import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DevicePersonPage = () => {
    const [devices, setDevices] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [deviceId, setDeviceId] = useState(''); // State for input box
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));

                if (!storedUser || storedUser.role !== 'user') {
                    setErrorMessage('Access denied: User role required.');
                    navigate('/');
                    return;
                }

                const clientId = storedUser.id;

                if (!clientId) {
                    setErrorMessage('User ID is not available.');
                    return;
                }

                const response = await axios.get(`/device/person/${clientId}`);
                console.log('Fetched devices:', response.data);

                if (Array.isArray(response.data)) {
                    if (response.data.length === 0) {
                        setErrorMessage('No devices found for this Client ID.');
                    } else {
                        setDevices(response.data);
                        setErrorMessage('');
                    }
                } else if (typeof response.data === 'object' && response.data !== null) {
                    setErrorMessage(response.data.message || 'Unexpected response format.');
                } else {
                    setErrorMessage('No devices found for this Client ID.');
                }
            } catch (error) {
                console.error('Error fetching devices:', error);
                setDevices([]);
                if (error.response) {
                    setErrorMessage(error.response.data?.message || 'Error fetching devices. Please try again.');
                } else {
                    setErrorMessage('Error fetching devices. Please check your network connection or try again.');
                }
            }
        };

        fetchDevices();
    }, [navigate]);

    const handleRedirect = () => {
        if (!deviceId.trim()) {
            setErrorMessage('Please enter a device ID.');
            return;
        }

        // Search the entered Device ID in the list of devices
        const matchingDevice = devices.find(device => String(device.id) === String(deviceId));

        if (matchingDevice) {
            // Redirect to the calendar page
            navigate(`/calendar`);
        } else {
            setErrorMessage('Device ID not found in your list.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>
                Devices Associated with Client ID:{' '}
                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : ''}
            </h1>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Device Search Box */}
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Enter Device ID:
                    <input
                        type="text"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>
                <button
                    onClick={handleRedirect}
                    style={{
                        marginLeft: '10px',
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Go
                </button>
            </div>

            {/* Display Devices */}
            {devices.length > 0 ? (
                <ul>
                    {devices.map((device) => (
                        <li key={device.id}>
                            <strong>Device ID:</strong> {device.id} <br />
                            <strong>Description:</strong> {device.description} <br />
                            <strong>Address:</strong> {device.address} <br />
                            <strong>Hourly Rate:</strong> {device.hourly} <br />
                        </li>
                    ))}
                </ul>
            ) : (
                devices.length === 0 && !errorMessage && <p>No devices found for this Client ID.</p>
            )}
        </div>
    );
};

export default DevicePersonPage;
