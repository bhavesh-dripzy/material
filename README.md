<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1IFVVACRuaI-iWqH9_4GU7EhoKIJl72ym

## Run Locally

### Frontend (React)

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

### Backend (Django)

**Prerequisites:** Python 3.9+

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the setup script:
   ```bash
   ./setup.sh
   ```
   Or manually:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env and update SECRET_KEY
   python manage.py migrate
   ```
3. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

For more details, see [backend/README.md](backend/README.md)
