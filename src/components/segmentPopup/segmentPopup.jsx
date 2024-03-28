import React, { useState } from "react";
import "./segmentPopupStyle.css";
import axios from "axios";
import arrowIcon from "../../assets/images/leftVector.svg";

const initialOptions = [
  { label: "First Name", value: "first_name", color: "green" },
  { label: "Last Name", value: "last_name", color: "green" },
  { label: "Gender", value: "gender", color: "green" },
  { label: "Age", value: "age", color: "red" },
  { label: "Account Name", value: "account_name", color: "green" },
  { label: "City", value: "city", color: "red" },
  { label: "State", value: "state", color: "green" },
];

function SegmentPopup({ open, setOpen }) {
  const [segmentName, setSegmentName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (event) => {
    setSegmentName(event.target.value);
  };

  const handleRemoveSegment = (option) => {
    const updatedOptions = selectedOptions.filter((item) => item !== option);
    setSelectedOptions(updatedOptions);
  };

  const handleAddDropdown = () => {
    setSelectedOptions([...selectedOptions, {}]);
  };

  const handleSelectChange = (index, value, label, color) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = { [value]: { label, color } };
    setSelectedOptions(updatedOptions);
  };

  const saveSegment = () => {
    const schema = selectedOptions.map((option) => {
      const key = Object.keys(option)[0];
      const label = option[key].label;
      return { [key]: label };
    });

    const data = {
      segment_name: segmentName,
      schema: schema,
    };

    axios
      .post("https://webhook.site/a0eed016-5825-4a84-a923-e7de14a384c5", data)
      .then((response) => {
        console.log("Segment saved successfully:", response.data);
        // Handle success if needed
      })
      .catch((error) => {
        console.error("Error saving segment:", error);
        // Handle error if needed
      });
  };

  console.log(selectedOptions, segmentName, "segmentName");

  return (
    <div className={`segment-popup ${open ? "active" : ""}`}>
      <div className="wrapper">
        <div className="wrap">
          <div className="header">
            <img src={arrowIcon} alt="icon" onClick={() => setOpen(false)} />
            <h2 className="title">Saving Segment</h2>
          </div>
          <div className="input-wrap">
            <label htmlFor="segmentName">Enter Name of the Segment</label>
            <input
              type="text"
              id="segmentName"
              name="segmentName"
              placeholder="Name of the Segment"
              value={segmentName}
              onChange={handleInputChange}
            />
          </div>
          <p className="sub-title">
            To save your segment, you need to add the schemas to build your
            query
          </p>
          <div className="icon-wrap">
            <div className="icon">
              <div className="dot green"></div>- User Traits
            </div>
            <div className="icon">
              <div className="dot red"></div>- Group Traits
            </div>
          </div>
          {selectedOptions.map((selectedOption, index) => (
            <div key={index} className="select-wrap">
              {selectedOption && Object.keys(selectedOption)[0] ? (
                <div
                  className={`dot
                ${
                  initialOptions.find(
                    (option) => option.value === Object.keys(selectedOption)[0]
                  ).color
                }`}
                ></div>
              ) : (
                <div className="dot gray"></div>
              )}
              <select
                value={Object.keys(selectedOption)[0] || ""}
                onChange={(e) =>
                  handleSelectChange(
                    index,
                    e.target.value,
                    e.target.options[e.target.selectedIndex].text,
                    initialOptions.find(
                      (option) => option.value === e.target.value
                    ).color
                  )
                }
              >
                <option value="" disabled style={{ color: "gray" }}>
                  Select an option
                </option>
                {initialOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={
                      selectedOptions.some(
                        (item) => Object.keys(item)[0] === option.value
                      ) &&
                      selectedOptions.findIndex(
                        (item) => Object.keys(item)[0] === option.value
                      ) !== index
                    }
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleRemoveSegment(selectedOption)}
                className="remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddDropdown} className="link">
            +Add new schema
          </button>
        </div>
        <div className="btn-wrap">
          <button className="save-btn" onClick={saveSegment}>
            save the segment
          </button>
          <button className="cancel-btn" onClick={() => setOpen(false)}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SegmentPopup;
