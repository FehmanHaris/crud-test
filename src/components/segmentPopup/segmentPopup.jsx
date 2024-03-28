import React, { useState } from "react";
import "./segmentpopupStyle.css";
import axios from "axios";

const initialOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

const SegmentPopup = () => {
  const [segmentName, setSegmentName] = useState("");
  const [segments, setSegments] = useState([{ name: "", schema: [] }]);
  const [newSchema, setNewSchema] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState(initialOptions);

  const handleAddNewSchema = (index) => {
    if (newSchema) {
      const updatedSegments = [...segments];
      updatedSegments[index].schema.push(newSchema);
      setSegments(updatedSegments);
      setNewSchema("");
      updateOptions(newSchema);
    }
  };

  const updateOptions = (selectedOption) => {
    const updatedOptions = options.map((option) => {
      if (option.value === selectedOption) {
        return { ...option, disabled: true };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  const handleSaveSegment = () => {
    const segmentData = segments.map((segment) => ({
      segment_name: segment.name,
      schema: segment.schema.map((option) => ({ [option]: option })),
    }));

    axios
      .post("https://webhook.site/your-webhook-url", segmentData)
      .then((response) => {
        console.log(response.data);
        // Handle success
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  const handleSelectChange = (e) => {
    setNewSchema(e.target.value);
  };

  const handleSegmentNameChange = (index, e) => {
    const updatedSegments = [...segments];
    updatedSegments[index].name = e.target.value;
    setSegments(updatedSegments);
  };

  const handleRemoveSchema = (segmentIndex, schemaIndex) => {
    const updatedSegments = [...segments];
    const removedSchema = updatedSegments[segmentIndex].schema.splice(
      schemaIndex,
      1
    )[0];
    setSegments(updatedSegments);
    restoreOption(removedSchema);
  };

  const restoreOption = (removedOption) => {
    const updatedOptions = options.map((option) => {
      if (option.value === removedOption) {
        return { ...option, disabled: false };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  const handleAddSegment = () => {
    setSegments([...segments, { name: "", schema: [] }]);
  };

  return (
    <div>
      {segments.map((segment, segmentIndex) => (
        <div key={segmentIndex}>
          <input
            type="text"
            placeholder="Segment Name"
            value={segment.name}
            onChange={(e) => handleSegmentNameChange(segmentIndex, e)}
          />
          <br />
          <select value={newSchema} onChange={handleSelectChange}>
            <option value="">Select Schema</option>
            {options.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <button onClick={() => handleAddNewSchema(segmentIndex)}>
            + Add New Schema
          </button>
          <br />
          {segment.schema.map((option, schemaIndex) => (
            <div key={schemaIndex}>
              <span>{option}</span>
              <button
                onClick={() => handleRemoveSchema(segmentIndex, schemaIndex)}
              >
                Remove
              </button>
              <br />
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleAddSegment}>Add Segment</button>
      <br />
      <button onClick={handleSaveSegment}>Save Segment</button>
    </div>
  );
};

export default SegmentPopup;
