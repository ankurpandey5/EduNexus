import { useState } from "react";
import InputForm from "./components/InputForm";
import PlanSection from "./components/PlanSection";
import "./app.css";
function App() {
  const [data, setData] = useState(null);

  return (
    <div className="app">
      <InputForm setData={setData} />

      {data && (
        <>
          <PlanSection
            title="Maths Plan"
            data={data.maths}
            hours={data.hours}
            startDay={1}
            totalDays={data.days}
          />

          <PlanSection
            title="GAT Plan"
            data={data.gat}
            hours={data.hours}
            startDay={1}
            totalDays={data.days}
          />
        </>
      )}
    </div>
  );
}

export default App;