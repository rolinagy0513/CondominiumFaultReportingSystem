import React, {useState} from "react";

import {FaBuilding, FaHouse, FaLocationDot} from "react-icons/fa6";
import {MdAddHomeWork} from "react-icons/md";
import {FaPlus, FaTrash} from "react-icons/fa";

import "./component-styles/AddBuildingForm.css"


const AddBuildingForm = ({ handleChange, handleSubmit, formData, isLoading, message }) => {

    const [showOverrides, setShowOverrides] = useState(false);

    const addOverride = () => {
        const newOverrides = [...(formData.overrides || []), { floorNumber: 0, apartmentsOnFloor: 0 }];
        handleChange({
            target: {
                name: 'overrides',
                value: newOverrides
            }
        });
    };

    const removeOverride = (index) => {
        const newOverrides = formData.overrides.filter((_, i) => i !== index);
        handleChange({
            target: {
                name: 'overrides',
                value: newOverrides
            }
        });
    };

    const handleOverrideChange = (index, field, value) => {
        const newOverrides = [...formData.overrides];
        newOverrides[index][field] = field === 'floorNumber' || field === 'apartmentsOnFloor'
            ? parseInt(value) || 0
            : value;

        handleChange({
            target: {
                name: 'overrides',
                value: newOverrides
            }
        });
    };

    return (
        <div className='addBuilding-form-container'>
            <form className='addBuilding-form-element' onSubmit={handleSubmit}>

                <div className='feedback-message'>
                    {message && <div>{message}</div>}
                </div>

                <div className="input-group">
                    <label>Add the number of floors in the building</label>
                    <FaBuilding className="building-icon"/>
                    <input
                        type="number"
                        name="numberOfFloors"
                        value={formData.numberOfFloors}
                        onChange={handleChange}
                        onFocus={(e) => {
                            if (e.target.value === "0") e.target.value = "";
                        }}
                        required
                        min="1"
                        placeholder="Number of floors"
                    />
                </div>

                <div className="input-group">
                    <label>Add the number of apartments that are in a floor</label>
                    <FaHouse className="house-icon"/>
                    <input
                        type="number"
                        name="numberOfApartmentsInOneFloor"
                        value={formData.numberOfApartmentsInOneFloor}
                        onChange={handleChange}
                        onFocus={(e) => {
                            if (e.target.value === "0") e.target.value = "";
                        }}
                        required
                        min="1"
                        placeholder="Number of apartments in one floor"
                    />
                </div>

                <div className="input-group">
                    <label>Add the number of the building</label>
                    <MdAddHomeWork className="buildingNumber-icon"/>
                    <input
                        type="number"
                        name="buildingNumber"
                        value={formData.buildingNumber}
                        onChange={handleChange}
                        onFocus={(e) => {
                            if (e.target.value === "0") e.target.value = "";
                        }}
                        required
                        min="1"
                        placeholder="The number of the building"
                    />
                </div>

                <div className="input-group">
                    <label>Add the address of the building</label>
                    <FaLocationDot className="address-icon"/>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="The address of the building"
                    />
                </div>


                <div className="overrides-section">
                    <label className="override-toggle">
                        <input
                            type="checkbox"
                            checked={showOverrides}
                            onChange={() => setShowOverrides(!showOverrides)}
                        />
                        Add Floor Overrides
                    </label>

                    {showOverrides && (
                        <div className="overrides-list">
                            <h4>Floor Overrides</h4>
                            <p>Specify custom apartment counts for specific floors</p>

                            {(formData.overrides || []).map((override, index) => (
                                <div key={index} className="override-item">
                                    <div className="override-inputs">
                                        <input
                                            type="number"
                                            value={override.floorNumber || 0}
                                            onChange={(e) => handleOverrideChange(index, 'floorNumber', e.target.value)}
                                            min="1"
                                            placeholder="Floor number"
                                        />
                                        <input
                                            type="number"
                                            value={override.apartmentsOnFloor || 0}
                                            onChange={(e) => handleOverrideChange(index, 'apartmentsOnFloor', e.target.value)} // ✅ Fixed: apartmentsOnFloor
                                            min="1"
                                            placeholder="Apartments on this floor"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-override"
                                        onClick={() => removeOverride(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="add-override-btn"
                                onClick={addOverride}
                            >
                                <FaPlus /> Add Override
                            </button>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default AddBuildingForm;