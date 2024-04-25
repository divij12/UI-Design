import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApiCallCounts() {
    const [counts, setCounts] = useState({ addCount: 0, updateCount: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/getCounts');
                setCounts(response.data);
            } catch (error) {
                console.error('Failed to fetch counts:', error);
                alert('Failed to load counts from server');
            }
        };

        fetchCounts();
    }, []);

    return (
        <div>
            <h3>API Call Counts</h3>
            <p><strong>Add Calls:</strong> {counts.addCount}</p>
            <p><strong>Update Calls:</strong> {counts.updateCount}</p>
        </div>
    );
}

export default ApiCallCounts;
