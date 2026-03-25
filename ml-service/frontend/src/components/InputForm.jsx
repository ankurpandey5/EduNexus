// import { useState } from "react";
// import "./InputForm.css";
// import "../index.css";

// function InputForm({ setData }) {
//     const [days, setDays] = useState("");
//     const [hours, setHours] = useState("");

//     const generatePlan = async () => {
//         if (hours > 24) {
//             alert("You cannot study more than 24 hours per day!");
//             return;
//         }

//         if (hours <= 0) {
//             alert("Hours must be greater than 0!");
//             return;
//         }

//         if (days <= 0) {
//             alert("Days must be greater than 0!");
//             return;
//         }
//         const res = await fetch("http://127.0.0.1:5000/NDAplan", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 days: parseInt(days),
//                 hours: parseInt(hours)
//             })
//         });

//         const data = await res.json();

//         setData({ ...data, hours });
//     };

//     return (
//         <div className="input-box">
//             <h2>Enter details</h2>

//             <div className="form-row">
//                 <span>Number of remaining days : </span>
//                 <input placeholder="Enter days" onChange={(e) => setDays(e.target.value)} />
//             </div>

//             <div className="form-row">
//                 <span>Hours you can study daily : </span>
//                 <input placeholder="Enter hours" onChange={(e) => setHours(e.target.value)} />
//             </div>

//             <div className="form-row">
//                 <span>Select your exam</span>
//                 <select onChange={(e) => setExam(e.target.value)}>
//                     <option value="">Choose exam</option>
//                     <option value="NDA">NDA</option>
//                     <option value="GATE">GATE</option>
//                     <option value="CDS">CDS</option>
//                     <option value="SSC-CGL">SSC-CGL</option>
//                 </select>
//             </div>

//             <button onClick={generatePlan}>Generate Plan</button>
//         </div>
//     );
// }

// export default InputForm;


import { useState } from "react";
import "./InputForm.css";
import "../index.css";

function InputForm({ setData }) {
    const [days, setDays] = useState("");
    const [hours, setHours] = useState("");
    const [exam, setExam] = useState(""); // ✅ added

    const generatePlan = async () => {
        if (!exam) {
            alert("Please select an exam!");
            return;
        }

        if (hours > 24) {
            alert("You cannot study more than 24 hours per day!");
            return;
        }

        if (hours <= 0) {
            alert("Hours must be greater than 0!");
            return;
        }

        if (days <= 0) {
            alert("Days must be greater than 0!");
            return;
        }

        // ✅ dynamic endpoint
        const endpoint = `http://127.0.0.1:5000/${exam}plan`;

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                days: parseInt(days),
                hours: parseInt(hours)
            })
        });

        const data = await res.json();

        setData({ ...data, hours });
    };

    return (
        <div className="input-box">
            <h2>Enter details</h2>

            <div className="form-row">
                <span>Number of remaining days :</span>
                <input
                    placeholder="Enter days"
                    onChange={(e) => setDays(e.target.value)}
                />
            </div>

            <div className="form-row">
                <span>Hours you can study daily :</span>
                <input
                    placeholder="Enter hours"
                    onChange={(e) => setHours(e.target.value)}
                />
            </div>

            <div className="form-row">
                <span>Select your exam</span>
                <select onChange={(e) => setExam(e.target.value)}>
                    <option value="">Choose exam</option>
                    <option value="NDA">NDA</option>
                    <option value="GATE">GATE</option>
                    <option value="CDS">CDS</option>
                    <option value="SSC-CGL">SSC-CGL</option>
                </select>
            </div>

            <button onClick={generatePlan}>Generate Plan</button>
        </div>
    );
}

export default InputForm;