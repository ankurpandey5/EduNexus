## EduNexus - Smart E-Learning Website
Empowering students with ML-driven personalized study plans.

Most online platforms give you a list of videos without tracking actual learning progress. **EduNexus** is a comprehensive, smart e-learning platform that analyzes quiz scores using Machine Learning to identify student weak points and automatically generates a dynamic, day-by-day study timetable. 


## Key Features
* **Student Panel:** Watch lectures, track progress, attempt auto-evaluated quizzes, and receive an ML-generated study timetable based on target exam scores.
* **Teacher Panel:** Create courses, upload media (videos/notes), and build customized quizzes.
* **Admin Panel:** Manage user roles, oversee course quality, and handle platform administration.

## Technology Stack (MERN + Python)
* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Machine Learning:** Python, Scikit-learn, Flask/FastAPI
* **Authentication:** JSON Web Tokens (JWT)

### 1. Backend (Node.js / Express)
To run the backend server locally on your machine, open your terminal and run:




## ML Update

1. Collected **NDA Previous Year Questions (PYQs)** from multiple exam years.

2. Built a **structured Excel dataset**, where each row represents a chapter for a specific year.

3. Dataset columns include:
   - Year
   - Subject (Maths or GAT)
   - Chapter
   - Questions (questions asked from that chapter in that year)
   - Time_required (estimated study hours)

4. Calculated **Total_time_required** by multiplying `Time_required` with a factor (≈2.5–3) to account for lectures, notes, practice, and revision.

5. Computed **Importance score**:

   `Importance = Questions / Total questions in that exam year`

6. Calculated **Priority score** to decide study order:

   `Priority = Importance / Total_time_required`



```bash
cd backend
npm install
npm run dev
