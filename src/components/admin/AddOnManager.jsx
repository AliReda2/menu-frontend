import { useState, useEffect } from "react";
import api from "../../services/api";

const AddOnManager = ({ shopId }) => {
  const [addOnName, setAddOnName] = useState("");
  const [addOnPrice, setAddOnPrice] = useState("");
  const [addOns, setAddOns] = useState([]);
  const [editingAddOnId, setEditingAddOnId] = useState(null);

  const fetchAddOns = async () => {
    try {
      const response = await api.get(`/addOns?shop_id=${shopId}`);
      setAddOns(response.data);
    } catch (err) {
      console.error("Error fetching addOns:", err);
    }
  };

  useEffect(() => {
    if (shopId) fetchAddOns();
  }, [shopId]);

  const handleAddAddOn = async () => {
    try {
      const addOnData = {
        name: addOnName,
        price: parseFloat(addOnPrice),
        shop_id: shopId,
      };

      await api.post("/addOns", addOnData);
      alert("AddOn added successfully");
      setAddOnName("");
      setAddOnPrice("");
      fetchAddOns();
    } catch (err) {
      console.error("Error adding AddOn:", err);
      alert("Error adding AddOn");
    }
  };

  const handleUpdateAddOn = async () => {
    try {
      const addOnData = {
        name: addOnName,
        price: parseFloat(addOnPrice),
      };

      await api.patch(`/addOns/${editingAddOnId}`, addOnData);
      alert("AddOn updated successfully");
      setEditingAddOnId(null);
      setAddOnName("");
      setAddOnPrice("");
      fetchAddOns();
    } catch (err) {
      console.error("Error updating AddOn:", err);
      alert("Error updating AddOn");
    }
  };

  const handleDeleteAddOn = async (id) => {
    try {
      await api.delete(`/addOns/${id}`);
      alert("AddOn deleted successfully");
      fetchAddOns();
    } catch (err) {
      console.error("Error deleting AddOn:", err);
      alert("Error deleting AddOn");
    }
  };

  const handleEditAddOn = (addOn) => {
    setEditingAddOnId(addOn.id);
    setAddOnName(addOn.name);
    setAddOnPrice(addOn.price);
  };

  return (
    <div>
      <h3>{editingAddOnId ? "Edit AddOn" : "Add AddOn"}</h3>
      <input
        type="text"
        placeholder="AddOn Name"
        value={addOnName}
        onChange={(e) => setAddOnName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={addOnPrice}
        onChange={(e) => setAddOnPrice(e.target.value)}
      />
      {editingAddOnId ? (
        <div>
          <button onClick={handleUpdateAddOn}>Update AddOn</button>
          <button
            onClick={() => {
              setEditingAddOnId(null);
              setAddOnName("");
              setAddOnPrice("");
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleAddAddOn}>Add AddOn</button>
      )}

      <h3>AddOns</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addOns.map((addOn) => (
            <tr key={addOn.id}>
              <td>{addOn.name}</td>
              <td>{addOn.price}</td>
              <td>
                <button onClick={() => handleEditAddOn(addOn)}>Edit</button>
                <button onClick={() => handleDeleteAddOn(addOn.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddOnManager;
