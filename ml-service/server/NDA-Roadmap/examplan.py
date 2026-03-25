from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("final_csv_for_nda.csv")

# Clean data
df["Total_time_required"] = pd.to_numeric(df["Total_time_required"], errors="coerce")
df["Total_time_required"].fillna(df["Total_time_required"].mean(), inplace=True)

# -------------------------------
# Add Marks + Range
# -------------------------------
def add_marks(df):
    df = df.copy()

    df["Per_Exam_Q"] = df["Avg_Question(past-10-year)"] / 2

    # Create ranges
    df["Q_Low"] = df["Per_Exam_Q"].astype(int)
    df["Q_High"] = df["Q_Low"] + 1

    df.loc[df["Subject"] == "Maths", "Marks_Low"] = df["Q_Low"] * 2.5
    df.loc[df["Subject"] == "Maths", "Marks_High"] = df["Q_High"] * 2.5

    df.loc[df["Subject"] == "GAT", "Marks_Low"] = df["Q_Low"] * 4
    df.loc[df["Subject"] == "GAT", "Marks_High"] = df["Q_High"] * 4

    return df


# -------------------------------
# Knapsack (Max Marks)
# -------------------------------
def knapsack(df, max_time):
    n = len(df)
    max_time = int(max_time)

    dp = [[0 for _ in range(max_time + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        time = int(df.iloc[i - 1]["Total_time_required"])
        marks = df.iloc[i - 1]["Marks_High"]

        for t in range(max_time + 1):
            if time <= t:
                dp[i][t] = max(dp[i - 1][t], dp[i - 1][t - time] + marks)
            else:
                dp[i][t] = dp[i - 1][t]

    # Backtrack
    result = []
    t = max_time

    for i in range(n, 0, -1):
        if dp[i][t] != dp[i - 1][t]:
            row = df.iloc[i - 1]
            result.append(row.to_dict())
            t -= int(row["Total_time_required"])

    return result


# -------------------------------
# API
# -------------------------------
@app.route("/NDAplan", methods=["POST"])
def generate_plan():
    data = request.json

    days = data["days"]
    hours = data["hours"]

    total_time = days * hours

    # Split
    maths_df = df[df["Subject"] == "Maths"].copy()
    gat_df = df[df["Subject"] == "GAT"].copy()

    maths_df = add_marks(maths_df)
    gat_df = add_marks(gat_df)

    # Smart split
    maths_score = maths_df["Marks_High"].sum()
    gat_score = gat_df["Marks_High"].sum()

    maths_time = total_time * (maths_score / (maths_score + gat_score))
    gat_time = total_time * (gat_score / (maths_score + gat_score))

    # Optimize
    maths_plan = knapsack(maths_df, maths_time)
    gat_plan = knapsack(gat_df, gat_time)
    # 🔥 Sort by highest marks first
    maths_plan = sorted(maths_plan, key=lambda x: x["Marks_High"], reverse=True)
    gat_plan = sorted(gat_plan, key=lambda x: x["Marks_High"], reverse=True)
    return jsonify({
        "maths": maths_plan,
        "gat": gat_plan
    })


if __name__ == "__main__":
    app.run(debug=True)