import "./Summary.css";

function Summary({ totalQ, totalMarks, totalTime,hours }) {
  return (
    <div className="summary-bar">
      <div>📘 Total Questions: {totalQ}</div>
      <div>🎯 Total Marks: {totalMarks}</div>
      <div>⏱ Total Time: {totalTime} hrs [{totalTime / hours} Days]</div>
    </div>
  );
}

export default Summary;