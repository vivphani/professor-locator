```markdown
# Professor Locator

A fast, serverless full-stack web application designed to help students instantly locate professor staffrooms. Users can simply scan a QR code placed at the department entrance to access a searchable, mobile-responsive directory. 

## Features

* **Instant Search:** Filter professors in real-time by Name, Faculty ID, or Department.
* **Mobile-First Design:** Built with Tailwind CSS to look clean and professional on any smartphone screen.
* **Secure Admin Dashboard:** A password-protected `/admin` portal allowing authorized staff to Add, Edit, or Delete directory records without touching code.
* **Serverless Architecture:** Fully hosted on Vercel with a Supabase PostgreSQL backend for maximum uptime and zero maintenance.

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Icons:** Lucide React
* **Backend / Database:** Supabase (PostgreSQL)
* **Deployment:** Vercel

## Getting Started (Local Development)

If you want to clone and run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/vivphani/professor-locator.git](https://github.com/vivphani/professor-locator.git)
cd professor-locator

```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up the Database

Create a new project in [Supabase](https://supabase.com/) and run the following SQL query in the SQL Editor to create the table:

```sql
CREATE TABLE professors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  staffroom_location VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials and a custom admin password:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASS=your_custom_secure_password

```

### 5. Run the development server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result. To access the admin panel, navigate to `/admin`.

## License

This project is open-source and available under the MIT License.

```

```