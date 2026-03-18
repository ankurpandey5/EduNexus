async function generatePlan() {
            const days = document.getElementById("days").value;
            const hours = document.getElementById("hours").value;

            const res = await fetch("http://127.0.0.1:5000/plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    days: parseInt(days),
                    hours: parseInt(hours)
                })
            });

            const data = await res.json();

            displayTable("maths", data.maths);
            displayTable("gat", data.gat);
        }

        function displayTable(id, list) {
            if (list.length === 0) {
                document.getElementById(id).innerHTML = "No data";
                return;
            }

            let totalQ_low = 0;
            let totalQ_high = 0;
            let totalMarks_low = 0;
            let totalMarks_high = 0;
            let totalTime = 0;

            let html = `
    <table>
        <tr>
            <th>Chapter</th>
            <th>Questions</th>
            <th>Marks</th>
            <th>Time</th>
        </tr>
    `;

            list.forEach(item => {
                html += `
        <tr>
            <td>${item.Chapter}</td>
            <td>${item.Q_Low} - ${item.Q_High}</td>
            <td>${item.Marks_Low} - ${item.Marks_High}</td>
            <td>${item.Total_time_required} hr</td>
        </tr>
        `;

                totalQ_low += item.Q_Low;
                totalQ_high += item.Q_High;
                totalMarks_low += item.Marks_Low;
                totalMarks_high += item.Marks_High;
                totalTime += item.Total_time_required;
            });

            html += `
    <tr style="font-weight:bold; background:#1e293b;">
        <td>Total</td>
        <td>${totalQ_low} - ${totalQ_high}</td>
        <td>${totalMarks_low.toFixed(2)} - ${totalMarks_high.toFixed(2)}</td>
        <td>${totalTime}</td>
    </tr>
    </table>
    `;

            document.getElementById(id).innerHTML = html;
        }