import React, { useState, useEffect } from 'react';
import "./PointsManagement.css"

const PointsManagement = ({ userType }) => {
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState({ location: '', isActive: true });
  const [editingPoint, setEditingPoint] = useState(null);

  useEffect(() => {
    // Fetch points when the component mounts
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://gatepay-server.vercel.app/api/point', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch points');
        }


      const data = await response.json();
      setPoints(data);
    } catch (error) {
      console.error('Error fetching points:', error.message);
    }
  };

  const createPoint = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://gatepay-server.vercel.app/api/point', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newPoint),
        });
      if (!response.ok) {
        throw new Error('Failed to create point');
      }

      const data = await response.json();
      setPoints([...points, data]);
      setNewPoint({ location: '', isActive: true });
    } catch (error) {
      console.error('Error creating point:', error.message);
    }
  };

  const updatePoint = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://gatepay-server.vercel.app/api/point/${editingPoint.pointId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editingPoint),
        });


      if (!response.ok) {
        throw new Error('Failed to update point');
      }

      const updatedPoint = await response.json();
      setPoints(points.map((point) => (point.pointId === updatedPoint.pointId ? updatedPoint : point)));
      setEditingPoint(null);
    } catch (error) {
      console.error('Error updating point:', error.message);
    }
  };

  const deletePoint = async (pointID) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gatepay-server.vercel.app/api/point/${pointID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete point');
      }

      setPoints(points.filter((point) => point.pointId !== pointID));
    } catch (error) {
      console.error('Error deleting point:', error.message);
    }
  };

  
  const handleEditClick = (point) => {
    setEditingPoint({ ...point });
  };

  const handleCancelEdit = () => {
    setEditingPoint(null);
  };

  return (
    <div className="points-management-container">
      <h2>{userType === 'Toll' ? 'Toll Gate' : 'Parking Lot'} Entry/Exit Points Management</h2>
      <ul className="points-list">
        {points.map((point) => (
          <li key={point.pointId} className="table-row point-item">
            <span>
              {point.pointId} : {point.location} - {point.isActive ? 'Active' : 'Inactive'}
            </span>
            <div className="point-buttons">
              <button onClick={() => handleEditClick(point)}>Edit</button>
              <button onClick={() => deletePoint(point.pointId)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {editingPoint ? (
        <div className="edit-point-form">
          <h3>Edit Point</h3>
          <label>
            Location:
            <input
              type="text"
              value={editingPoint.location}
              onChange={(e) => setEditingPoint({ ...editingPoint, location: e.target.value })}
            />
          </label>
          <hr/>
          <label>
            Status:
            <select
              value={editingPoint.isActive}
              onChange={(e) => setEditingPoint({ ...editingPoint, isActive: e.target.value === 'true' })}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </label>
          <div className="edit-point-buttons">
            <button onClick={updatePoint}>Update</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="create-point-form">
          <h3>Create New Point</h3>
          <label>
            Location:
            <input
              type="text"
              value={newPoint.location}
              onChange={(e) => setNewPoint({ ...newPoint, location: e.target.value })}
            />
          </label>
          <br/>
          <br/>
          <hr/>
          <br/>
          <label>
            Status:
            <select
              value={newPoint.isActive}
              onChange={(e) => setNewPoint({ ...newPoint, isActive: e.target.value === 'true' })}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </label>
          <button onClick={createPoint}>Create</button>
        </div>
      )}
    </div>
  );
};

export default PointsManagement;