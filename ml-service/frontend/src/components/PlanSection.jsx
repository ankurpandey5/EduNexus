import Card from "./Card";
import Summary from "./Summary";
import "./PlanSection.css";

function PlanSection({ title, data, hours, startDay, totalDays }) {
  let currentDay = startDay;

  let totalQ = 0;
  let totalMarks = 0;
  let totalTime = 0;

  let cards = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    const daysNeeded = Math.ceil(item.Total_time_required / hours);

    if (currentDay + daysNeeded - 1 > totalDays) break;

    cards.push(
      <Card
        key={i}
        item={item}
        startDay={currentDay}
        daysNeeded={daysNeeded}
        hours={hours}
      />
    );

    currentDay += daysNeeded;

    totalQ += item.Q_High;
    totalMarks += item.Marks_High;
    totalTime += item.Total_time_required;
  }

  return (
    <div className="section-container">
      <h2 className="section-title">{title}</h2>

      <div className="card-grid">
        {cards}
      </div>

      <Summary
        totalQ={totalQ}
        totalMarks={totalMarks}
        totalTime={totalTime}
        hours= {hours}
      />
    </div>
  );
}

export default PlanSection;