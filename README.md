# 🛡️ Insurance & Reinsurance Management System

A full-stack web application to manage customers, insurance policies, claims, and
reinsurance treaty allocations, with an admin dashboard.

🔗 **Live demo:** https://insurance-reinsurance.vercel.app

> The backend runs on a free tier, so the first load may take up to a minute to wake up.

## 🔑 Demo logins

|   Role  |      Email      | Password |
|---------|-----------------|----------|
| Admin   | admin@gmail.com | admin123 |
| Customer| demo@gmail.com  | demo123  |

> This is a demo with fake data. Please don't enter any real personal information.

## ✨ Features

**Customer**
- Register and log in (JWT authentication)
- Create policies (Health, Motor, Property, Life) with add-ons and a live premium calculation
- Raise claims against active policies, with limit and date validation
- View profile, policies, and claims

**Admin**
- View all customers, policies, and claims, with view dialogs for related records
- Approve policies (Pending Approval to Active) and move claims (Submitted to Approved to Settled)
- Proportional and non-proportional treaty pages (fixed setup and allocation tables)
- Dashboard with 4 live charts

## 📐 Business rules

- Premium = sum insured x base rate x (1 + add-on %), calculated on both frontend and backend
- A claim cannot exceed the remaining limit (sum insured minus earlier claims), and the incident date must fall within the policy period
- On policy approval: sum insured and premium are split 20% retention, 30% quota share, 50% surplus
- On claim approval: the claim is split the same way, and the retention goes to non-proportional allocation only if it is above 50,000 (priority 50,000, then layers 1 to 3, with any amount above 3,50,000 added to priority)
- All allocations are saved in the same database transaction as the approval

## 🧰 Tech stack

- **Frontend:** React, TypeScript, Vite, Material UI, MUI X Charts, React Router, Axios
- **Backend:** Java, Spring Boot, Spring Security with JWT, Spring Data JPA, BCrypt
- **Database:** PostgreSQL (Neon)
- **Build and deploy:** Gradle, Docker, Render (backend), Vercel (frontend)


## 🚀 Run locally

**Requirements:** Java 25, Node.js 18+, PostgreSQL

1. Clone the repo:
   ```
   git clone https://github.com/asina-1234/insurance-reinsurance-management.git
   ```
2. Create a PostgreSQL database named `insurance_db_new`.
3. Backend: in `Insurance Management System/Backend/src/main/resources`, create `application-dev.properties` with your own values:
   ```
   spring.datasource.url=jdbc:postgresql://localhost:5432/insurance_db_new
   spring.datasource.username=YOUR_DB_USER
   spring.datasource.password=YOUR_DB_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   jwt.secret=any-random-string-of-at-least-32-characters
   app.admin.email=admin@gmail.com
   app.admin.password=admin123
   ```
4. Start the backend (it runs on http://localhost:8080):
   ```
   cd "Insurance Management System/Backend"
   SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
   ```
   On Windows PowerShell, use:
   ```
   $env:SPRING_PROFILES_ACTIVE="dev"; .\gradlew bootRun
   ```
5. Frontend: in a new terminal:
   ```
   cd "Insurance Management System/Frontend"
   npm install
   ```
   Create a `.env` file with `VITE_API_URL=http://localhost:8080/api`, then run:
   ```
   npm run dev
   ```
   Open http://localhost:5173.

## 👩‍💻 Author

**Asina Begam**
[LinkedIn](www.linkedin.com/in/asina-begam-709171383) | [GitHub](https://github.com/asina-1234)