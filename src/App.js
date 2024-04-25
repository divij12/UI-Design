import React, { useState,useEffect } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import ApiCallCounts from './ApiCallCounts'; // Ensure this import path is correct

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  padding: "10px",
  overflow: "auto"
};

function App() {
  const [inputValues, setInputValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [searchValues, setSearchValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [updateValues, setUpdateValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [data, setData] = useState({});
  const [executionTime, setExecutionTime] = useState('');
  const [counts, setCounts] = useState({ addCount: 0, updateCount: 0 });


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getCounts');
        setCounts(response.data);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
  }, []);
  const handleInputChange = (value, componentKey, type) => {
    if (type === 'add') {
      setInputValues(prev => ({ ...prev, [componentKey]: value }));
    } else if (type === 'search') {
      setSearchValues(prev => ({ ...prev, [componentKey]: value }));
    } else if (type === 'update') {
      setUpdateValues(prev => ({ ...prev, [componentKey]: value }));
    }
  };

  const handleAddData = async (componentKey) => {
    try {
      const response = await axios.post('http://localhost:3001/add', { content: inputValues[componentKey] });
      if (response.status === 201) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        setCounts(prev => ({ ...prev, addCount: prev.addCount + 1 }));
        alert('Data added successfully');
      } else {
        throw new Error('Failed to add data');
      }
    } catch (error) {
      console.error(`Error adding data:`, error);
      alert(`Failed to add data: ${error.message || error}`);
    }
  };

  const handleUpdateData = async (componentKey) => {
    try {
      const response = await axios.post('http://localhost:3001/updateBySearch', {
        searchContent: searchValues[componentKey],
        newContent: updateValues[componentKey]
      });
      if (response.status === 200) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        alert('Data updated successfully');
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error(`Error updating data:`, error);
      alert(`Failed to update data: ${error.message || error}`);
    }
  };

  const fetchData = async () => {
    const startTime = Date.now(); // Start timing before the request
    try {
      const response = await axios.get('http://localhost:3001/data');
      setData(response.data);
      const endTime = Date.now(); // End timing after the request completes
      setExecutionTime(`The request took ${endTime - startTime} ms`);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setExecutionTime(`Failed to fetch data: ${error.message}`);
    }
  };

  return (
    <div className="App">
      {['comp1', 'comp2', 'comp3'].map((compKey, index) => (
        <Rnd
          key={compKey}
          style={style}
          default={{
            x: index * 360,
            y: 200,
            width: 320,
            height: 250,
          }}
        >
          <input
            type="text"
            value={inputValues[compKey]}
            onChange={e => handleInputChange(e.target.value, compKey, 'add')}
            placeholder={`Enter new data for Component ${index + 1}`}
          />
          <button onClick={() => handleAddData(compKey)}>Add</button>
          <input
            type="text"
            value={searchValues[compKey]}
            onChange={e => handleInputChange(e.target.value, compKey, 'search')}
            placeholder="Content to search for update"
          />
          <input
            type="text"
            value={updateValues[compKey]}
            onChange={e => handleInputChange(e.target.value, compKey, 'update')}
            placeholder="New content for update"
          />
          <button onClick={() => handleUpdateData(compKey)}>Update</button>
          <div>
            <strong>Current Data:</strong>
            {data[compKey] ? JSON.stringify(data[compKey]) : 'No data yet.'}
          </div>
          <div>
    </div>
        </Rnd>
      ))}
      <div>
        <h3>API Call Counts:</h3>
        <p>Add Calls: {counts.addCount}</p>
        <p>Update Calls: {counts.updateCount}</p>
      </div>
    </div>
    
  );
}

export default App;
