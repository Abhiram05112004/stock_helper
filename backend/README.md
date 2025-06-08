# Stock Helper Backend

## Overview
This is the backend service for the Stock Helper project. It is built with FastAPI and provides APIs for stock prediction, news, and indicators. The backend communicates with external services (such as Perplexity AI) and requires an API key for operation.

---

## Setup Instructions

### 1. Requirements
- Python 3.8 or higher

### 2. Install Dependencies
```sh
cd backend
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory with the following content:
```env
perplexity_api_key=YOUR_PERPLEXITY_API_KEY
```
Replace `YOUR_PERPLEXITY_API_KEY` with your actual API key from Perplexity.

### 4. Running the Server
- From the `backend/app` directory:
  ```sh
  uvicorn main:app --reload
  ```
- Or from the `backend` directory:
  ```sh
  uvicorn app.main:app --reload
  ```
- The server will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Troubleshooting
- **401 Unauthorized from Perplexity API:**
  - Ensure your `.env` file contains a valid `perplexity_api_key`.
  - Restart the backend after updating `.env`.
- **Module import errors:**
  - Make sure you run `uvicorn` from the correct directory as shown above.
- **.env file is ignored by git:**
  - This is intentional for security. The backend will still use it if present.

---

## Technologies Used
- FastAPI
- Python

---

## License
This project is for educational and demonstration purposes.
