// import "./Card.css";
// let chapterCounter = 0;
// function Card({ item, startDay, daysNeeded, hours }) {
//   const lowDays = Math.floor(item.Total_time_required / hours);
//   const highDays = Math.ceil(item.Total_time_required / hours);

//   const dayRange =
//     lowDays === highDays ? `${lowDays}` : `${lowDays} - ${highDays}`;

//   return (
//     <div className="card">
//         <h3>{item.Chapter}</h3>

//       <p>📘 Questions Asked: {item.Q_Low} - {item.Q_High}</p>
//       <p>🎯 Marks Cover: {item.Marks_Low} - {item.Marks_High}</p>
//       <p>⏱ Req Time to complete: {item.Total_time_required} hrs</p>

//       {/* ✅ ONLY THIS */}
//       <p>📅 Days Required: {dayRange} days</p>
//     </div>
//   );
// }

// export default Card;

import "./Card.css";

function Card({ item, hours }) {
  const lowDays = Math.floor(item.Total_time_required / hours);
  const highDays = Math.ceil(item.Total_time_required / hours);

  const dayRange =
    lowDays === highDays ? `${lowDays}` : `${lowDays} - ${highDays}`;

  return (
    <div className="card">
      <h3 className="title">{item.Chapter}</h3>

      <table className="card-table">
        <tbody>
          <tr>
            <td>📘 Questions</td>
            <td>{item.Q_Low} - {item.Q_High}</td>
          </tr>
          <tr>
            <td>🎯 Marks</td>
            <td>{item.Marks_Low} - {item.Marks_High}</td>
          </tr>
          <tr>
            <td>⏱ Time Required</td>
            <td>{item.Total_time_required} hrs</td>
          </tr>
          <tr>
            <td>📅 Days Needed</td>
            <td>{dayRange} days</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Card;