# ResumeMatch AI — Resume Analyzer & Job Match Predictor

## 📌 Project Prompt / Definition (submission ke liye)

> *Project Title:* AI-Based Resume Analyzer and Job Match Predictor
>
> *Problem Statement:* Job seekers ko pata nahi chalta ki unka resume kisi specific
> job description ke liye kitna suitable hai, aur unme kaunsi skills missing hain.
>
> *Objective:* Ek web application banana jo user ka resume (PDF) aur ek job
> description input ke roop me le, NLP (Natural Language Processing) ka use
> karke dono se skills/keywords extract kare, TF-IDF aur Cosine Similarity
> algorithm se match score calculate kare, aur missing skills highlight kare
> taaki user apna resume improve kar sake.
>
> *Scope:*
> - Resume upload (PDF) aur text extraction
> - Job description input
> - NLP-based skill extraction
> - Similarity score calculation (match %)
> - Matched vs missing skills ka visual breakdown
>
> *Tech Stack:* Python (Flask backend), HTML/CSS/JavaScript (frontend),
> spaCy (NLP), scikit-learn (TF-IDF + Cosine Similarity), pdfplumber (PDF parsing),
> Three.js (3D visualization)

---

## 🧠 Ye kaam kaise karta hai (Working Explanation)

1. *Extract:* User apna resume PDF upload karta hai → pdfplumber us PDF ko
   parse karke plain text nikalta hai.
2. *Understand:* spaCy (aur ek custom skill-list) resume ke text aur job
   description dono me se technical/soft skills identify karta hai.
3. *Match:* Dono texts ko TfidfVectorizer se numerical vectors me convert
   kiya jaata hai, phir cosine_similarity se ye vectors compare hote hain —
   jitna angle chhota, utna match zyada.
4. *Result:* User ko ek overall match % milta hai, saath me "matched skills"
   aur "missing skills" ki alag-alag list — taaki resume improve kiya ja sake.

---

## 🗂️ File Structure (har language alag file me)


resume-analyzer/
├── index.html          → Frontend structure (HTML) + 3D hero section
├── style.css            → Saari styling (CSS)
├── script.js             → 3D animation (Three.js) + browser-side demo logic (JavaScript)
├── app.py                → Backend server + NLP + matching logic (Python)
├── requirements.txt       → Python dependencies list
└── README.md              → Ye guide


---

## 🚀 Step-by-Step Setup Guide

### Step 1 — Demo dekhne ke liye (bina backend ke, sirf frontend)
index.html file ko seedha *double-click* karke kisi bhi browser (Chrome,
Edge) me open kar do. 3D animation aur ek halka JavaScript-based matching
demo turant kaam karega — isme Python ki zaroorat nahi hai.

> Note: "Google me link kholna" ka matlab agar aap live internet URL chahte
> ho, to us HTML file ko free hosting (GitHub Pages / Netlify) par upload
> karna padega — isका tarika Step 5 me diya hai.

### Step 2 — Python environment set karo (real backend ke liye)
bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux


### Step 3 — Dependencies install karo
bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm


### Step 4 — Server chalao
bash
python app.py

Terminal me http://127.0.0.1:5000 jaisa link aayega — usko browser me kholo.
(app.py me render_template use hua hai, isliye index.html ko ek
templates/ folder ke andar copy kar lena jab full Flask app banao.)

### Step 5 — Free me live link banane ke liye (Google me kholne wala link)
1. GitHub par ek naya repository banao aur ye saari files upload karo.
2. Repository → *Settings → Pages* me jaake *GitHub Pages* enable karo.
3. Kuch minute me ek live link milega jaise:
   https://your-username.github.io/resume-analyzer/
4. Ye link kisi bhi browser (Chrome/Google) me khulega aur 3D demo turant
   dikhega. (Ye static frontend hoga — Python backend chalane ke liye Render
   ya PythonAnywhere jaisi free service use karo.)

---

## 📊 Kaunsi Language kis kaam ke liye

| Language / Tool | Kaam |
|---|---|
| HTML | Page ka structure |
| CSS | Design aur layout |
| JavaScript + Three.js | 3D animation, interactivity, browser-demo logic |
| Python (Flask) | Backend server, routes |
| spaCy (Python) | NLP — skills/entities nikalna |
| scikit-learn (Python) | TF-IDF vectorization + Cosine Similarity |
| pdfplumber (Python) | Resume PDF se text extract karna |

---

## ✅ Viva/Submission ke liye Tip
Evaluators ko ye 3 cheezein zaroor dikhao:
1. Live 3D demo (index.html)
2. Backend code (app.py) — NLP aur similarity algorithm samjhao
3. Ek real resume PDF upload karke live match score dikhao