import React, { useState } from "react";
import "./segmentStyle.css";
import SegmentPopup from "../segmentPopup/segmentPopup";

const SegmentPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="segment-wrap">
      <button className="btn" onClick={() => setOpen(!open)}>
        Save segment
      </button>
      <SegmentPopup open={open} setOpen={setOpen} />
    </div>
  );
};

export default SegmentPage;
