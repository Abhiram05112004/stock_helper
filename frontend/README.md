# Stock Helper Project

## Project Overview

This project consists of a FastAPI backend and a Vite/React frontend. It provides stock prediction, news, and indicators using modern web technologies.

---

## How to Run the Project

### 1. Backend (FastAPI)

**Requirements:**
- Python 3.8+
- Install dependencies:
  ```sh
  cd backend
  pip install -r requirements.txt
  ```
- Create a `.env` file in the `backend` directory with your API key:
  ```env
  perplexity_api_key=YOUR_PERPLEXITY_API_KEY
  ```
- Start the backend server:
  ```sh
  cd backend/app
  uvicorn main:app --reload
  ```
  Or, from the backend root:
  ```sh
  uvicorn app.main:app --reload
  ```
- The backend will run at [http://127.0.0.1:8000](http://127.0.0.1:8000)

### 2. Frontend (Vite + React)

**Requirements:**
- Node.js & npm
- Install dependencies:
  ```sh
  cd frontend
  npm install
  ```
- Start the frontend server:
  ```sh
  npm run dev
  ```
- The frontend will run at [http://localhost:5173](http://localhost:5173) (default)

---

## Troubleshooting

- **401 Unauthorized from Perplexity API:**
  - Make sure your `.env` file in `backend` contains a valid `perplexity_api_key`.
  - Restart the backend after updating `.env`.
- **.env file is ignored:**
  - This is normal for security. The backend will still use it if present.
- **Module import errors:**
  - Make sure you run `uvicorn` from the correct directory as shown above.

---

## Technologies Used
- FastAPI (Python)
- Vite (React, TypeScript)
- Tailwind CSS
- shadcn-ui

---

## Deployment
See the Lovable documentation or your preferred deployment method for both frontend and backend.

## Project info

**URL**: https://lovable.dev/projects/55755e47-68aa-49f8-92c0-f925e47e03be

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/55755e47-68aa-49f8-92c0-f925e47e03be) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/55755e47-68aa-49f8-92c0-f925e47e03be) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
