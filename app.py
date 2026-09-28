""" app.py
------
AI-Based Resume Analyzer & Job Match Predictor — Backend (Flask)

Ye file real project ka "brain" hai:
1. Resume PDF se text extract karta hai (pdfplumber)
2. Resume aur Job Description dono se skills nikalta hai (spaCy NLP)
3. TF-IDF + Cosine Similarity se match score calculate karta hai
4. Missing skills suggest karta hai

Chalane ke liye:
    pip install -r requirements.txt
    python -m spacy download en_core_web_sm
    python app.py

Phir browser me: http://127.0.0.1:5000
"""

from flask import Flask, request, jsonify, render_template
import pdfplumber
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# spaCy ka small English model load kar rahe hain (skills/entities nikalne ke liye)
nlp = spacy.load("en_core_web_sm")

# Common technical + soft skills ki list — resume aur JD dono me isi list se match dhoondhenge
SKILL_BANK = [
    "python", "java", "javascript", "react", "node.js", "sql", "html", "css",
    "machine learning", "deep learning", "nlp", "flask", "django",
    "tensorflow", "pytorch", "excel", "communication", "leadership",
    "project management", "git", "docker", "aws", "data analysis",
    "opencv", "pandas", "numpy", "c++", "figma", "testing", "kubernetes"
]


def extract_text_from_pdf(file_stream) -> str:
    #PDF file se saara text nikaal ke ek string me return karta hai.
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_skills(text: str) -> list:
    # Diye gaye text me se SKILL_BANK ki skills dhoondh ke list return karta hai.
    text_lower = text.lower()
    found = [skill for skill in SKILL_BANK if skill in text_lower]
    return sorted(set(found))


def calculate_similarity(resume_text: str, jd_text: str) -> float:
    # TF-IDF vectors bana ke dono texts ka cosine similarity % nikalta hai.
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(score * 100, 2)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    # Frontend se resume (PDF file) aur job description (text) leta hai,
    # match score + matched/missing skills JSON me return karta hai.
    
    if "resume" not in request.files:
        return jsonify({"error": "Resume file nahi mili"}), 400

    resume_file = request.files["resume"]
    jd_text = request.form.get("job_description", "")

    if not jd_text.strip():
        return jsonify({"error": "Job description khaali hai"}), 400

    resume_text = extract_text_from_pdf(resume_file)

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    matched_skills = [s for s in jd_skills if s in resume_skills]
    missing_skills = [s for s in jd_skills if s not in resume_skills]

    similarity_score = calculate_similarity(resume_text, jd_text)
    skill_match_percent = (
        round((len(matched_skills) / len(jd_skills)) * 100, 2) if jd_skills else 0
    )

    return jsonify({
        "similarity_score": similarity_score,
        "skill_match_percent": skill_match_percent,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    })


if __name__ == "__main__":
    app.run(debug=True)