import React, { useState, useEffect } from 'react';
import "./TollGateForm.css"

const TollGateAdjacencyList = () => {
  const [adjacencies, setAdjacencies] = useState([]);
  const [newAdjacency, setNewAdjacency] = useState({
    gateId1: '',
    gateId2: '',
    charges: 0,
  });
  const [editingAdjacency, setEditingAdjacency] = useState(null);

  const fetchAdjacencies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gatepay-server.vercel.app/api/toll/adjacency', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch adjacencies');
      }
      const data = await response.json();
      setAdjacencies(data);
    } catch (error) {
      console.error('Error fetching adjacencies:', error.message);
    }
  };

  const createAdjacency = async () => {
    // Create a new adjacency
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gatepay-server.vercel.app/api/toll/adjacency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAdjacency),
      });

      if (!response.ok) {
        throw new Error('Failed to create adjacency');
      }

      const createdAdjacency = await response.json();
      setAdjacencies([...adjacencies, createdAdjacency]);
      setNewAdjacency({ gateId1: '', gateId2: '', charges: 0 });
    } catch (error) {
      console.error('Error creating adjacency:', error.message);
    }
  };

  const updateAdjacency = async () => {
    // Update an existing adjacency
    if (!editingAdjacency) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gatepay-server.vercel.app/api/toll/adjacency/${editingAdjacency.edgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingAdjacency),
      });

      if (!response.ok) {
        throw new Error('Failed to update adjacency');
      }

      const updatedAdjacency = await response.json();
      setAdjacencies(adjacencies.map((adj) => (adj.edgeId === updatedAdjacency.edgeId ? updatedAdjacency : adj)));
      setEditingAdjacency(null);
    } catch (error) {
      console.error('Error updating adjacency:', error.message);
    }
  };

  const deleteAdjacency = async (edgeId) => {
    // Delete an adjacency
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gatepay-server.vercel.app/api/toll/adjacency/${edgeId}`, {
        method: 'DELETE',
        headers : {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete adjacency');
      }

      setAdjacencies(adjacencies.filter((adj) => adj.edgeId !== edgeId));
    } catch (error) {
      console.error('Error deleting adjacency:', error.message);
    }
  };

  useEffect(() => {
    fetchAdjacencies();
  }, []); // Fetch adjacencies on component mount

  return (
    <div className="adjacency-list-container">
      <h2>Toll Gate Adjacency List</h2>
      <ul className="adjacency-list">
        {adjacencies.map((adjacency) => (
          <li key={adjacency.edgeId} className="adjacency-item table-row">
            {`Gate ID 1: ${adjacency.gateId1}, Gate ID 2: ${adjacency.gateId2}, Charges: ${adjacency.charges}`}
            <div className="adjacency-buttons">
              <button onClick={() => setEditingAdjacency(adjacency)}>Edit</button>
              <button onClick={() => deleteAdjacency(adjacency.edgeId)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Create/Update Adjacency</h3>
      <form className="create-update-adjacency-form">
        <label>
          Gate ID 1:
          <input
            type="text"
            value={newAdjacency.gateId1 || ''}
            onChange={(e) => setNewAdjacency({ ...newAdjacency, gateId1: e.target.value })}
          />
        </label>
        <label>
          Gate ID 2:
          <input
            type="text"
            value={newAdjacency.gateId2 || ''}
            onChange={(e) => setNewAdjacency({ ...newAdjacency, gateId2: e.target.value })}
          />
        </label>
        <label>
          Charges:
          <input
            type="number"
            value={newAdjacency.charges || ''}
            onChange={(e) => setNewAdjacency({ ...newAdjacency, charges: +e.target.value })}
          />
        </label>
        {editingAdjacency ? (
          <button type="button" onClick={updateAdjacency}>
            Update
          </button>
        ) : (
          <button type="button" onClick={createAdjacency}>
            Create
          </button>
        )}
      </form>
    </div>
  );
};

export default TollGateAdjacencyList;
