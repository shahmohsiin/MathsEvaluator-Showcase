# 📐 MathsEvaluator

AI-powered mobile application that automatically evaluates handwritten mathematics answer sheets using GPT-4 Vision.

![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4_Vision-412991?logo=openai)

## 📱 Screenshots

<p align="center">
  <img src="img/img (1).png" width="200" alt="Screenshot 1"/>
  <img src="img/img (2).png" width="200" alt="Screenshot 2"/>
  <img src="img/img (3).png" width="200" alt="Screenshot 3"/>
  <img src="img/img (4).png" width="200" alt="Screenshot 4"/>
</p>

<p align="center">
  <img src="img/img (5).png" width="200" alt="Screenshot 5"/>
  <img src="img/img (6).png" width="200" alt="Screenshot 6"/>
  <img src="img/img (7).jpeg" width="200" alt="Screenshot 7"/>
  <img src="img/img (8).png" width="200" alt="Screenshot 8"/>
</p>

## ✨ Features

- **📸 Image-Based Evaluation** — Capture or upload images of question papers and answer sheets
- **🤖 AI-Powered Grading** — GPT-4 Vision evaluates mathematical solutions step-by-step
- **❌ Error Detection** — Identifies incorrect/partial answers with detailed explanations
- **📚 Solution Guide** — Provides correct solutions with LaTeX-rendered math expressions
- **📊 History Tracking** — Stores past evaluations for review and progress tracking
- **🔐 Secure Auth** — JWT-based authentication system

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React Native, TypeScript, React Navigation, KaTeX |
| **Backend** | FastAPI, Python, Pydantic |
| **Database** | MongoDB (Motor async driver) |
| **AI** | OpenAI GPT-4 Vision API |
| **Auth** | JWT, bcrypt |

## 📁 Project Structure

```
MathsEvaluator/
├── backend/
│   ├── app/
│   │   ├── api/routes/      # Auth, evaluation, practice endpoints
│   │   ├── core/            # LLM client, prompts, JWT
│   │   ├── db/              # MongoDB connection
│   │   ├── models/          # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── screens/         # App screens
        ├── components/      # Reusable UI
        ├── context/         # Auth context
        ├── services/        # API layer
        └── theme/           # Styling
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20+
- MongoDB
- OpenAI API Key

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your OPENAI_API_KEY and MONGODB_URI

# Start server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install

# Android
npm run android

# iOS
cd ios && pod install && cd ..
npm run ios
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/evaluate` | Submit images for evaluation |
| GET | `/api/evaluations` | Get evaluation history |
| GET | `/api/evaluations/{id}` | Get specific evaluation |
| GET | `/health` | Health check |

## 🔧 Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
```

## 📄 License

MIT License

---

Built with ❤️ using React Native and FastAPI
