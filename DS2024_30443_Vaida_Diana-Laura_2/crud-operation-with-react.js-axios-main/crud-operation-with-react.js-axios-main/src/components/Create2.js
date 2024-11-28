import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';

export default function Create2() {
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [hourly, setHourly] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || storedUser.role !== 'admin') {
            setError('Access restricted: Admin role required.');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [navigate]);

    const validateFields = () => {
        if (!description || !address || !hourly) {
            setError('Please fill in all fields.');
            setProgress(0);
            return false;
        }
        return true;
    };

    const postData = async () => {
        const hourlyRate = parseInt(hourly, 10);

        try {
            setProgress(50);
            const response = await axios.post('/device', {
                description,
                address,
                hourly: hourlyRate,
            });

            if (response.status === 201 || response.status === 200) {
                setSuccess(true);
                setError('');
                setTimeout(() => {
                    navigate('/read2');
                }, 1000);
            }
        } catch (error) {
            console.error('Error posting data:', error);
            if (error.response) {
                if (error.response.status === 409) {
                    setError('Conflict: Device already exists.');
                } else {
                    setError(error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`);
                }
            } else {
                setError('Failed to create device. Please check your network connection or try again.');
            }
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        setProgress(0);
        setError('');
        setSuccess(false);

        if (validateFields()) {
            postData();
        }
    };

    return (
        <div>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {error && <Message negative>{error}</Message>}
            {success && <Message positive>Device created successfully!</Message>}
            <Form className="create-form" onSubmit={handleButtonClick}>
                <Form.Field>
                    <label>Description</label>
                    <input
                        placeholder='Enter a brief description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Address</label>
                    <input
                        placeholder='Enter address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Hourly Rate</label>
                    <input
                        type='number'
                        placeholder='Enter hourly rate'
                        value={hourly}
                        onChange={(e) => setHourly(e.target.value)}
                        required
                    />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
        </div>
    );
}