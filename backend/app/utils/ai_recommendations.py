"""
AI-powered doctor recommendation engine
Maps symptoms to specializations and recommends suitable doctors
"""

SYMPTOM_TO_SPECIALIZATION = {
    # Cardiovascular
    "chest pain": ["Cardiologist", "General Physician"],
    "heart": ["Cardiologist"],
    "heartbeat": ["Cardiologist"],
    "palpitation": ["Cardiologist"],
    "high blood pressure": ["Cardiologist"],
    "hypertension": ["Cardiologist"],
    
    # Neurological
    "headache": ["Neurologist"],
    "migraine": ["Neurologist"],
    "migraine headache": ["Neurologist"],
    "dizziness": ["Neurologist"],
    "vertigo": ["Neurologist"],
    "brain": ["Neurologist", "Neurosurgeon"],
    "seizure": ["Neurologist"],
    "epilepsy": ["Neurologist"],
    
    # Orthopedic
    "back pain": ["Orthopedic", "Neurologist"],
    "joint pain": ["Orthopedic"],
    "spine": ["Orthopedic", "Neurologist"],
    "fracture": ["Orthopedic"],
    "arthritis": ["Orthopedic"],
    "knee": ["Orthopedic"],
    "shoulder": ["Orthopedic"],
    "bone": ["Orthopedic"],
    
    # Dermatological
    "skin": ["Dermatologist"],
    "rash": ["Dermatologist"],
    "acne": ["Dermatologist"],
    "eczema": ["Dermatologist"],
    "psoriasis": ["Dermatologist"],
    "hair loss": ["Dermatologist"],
    "itch": ["Dermatologist"],
    
    # Gastrointestinal
    "stomach": ["Gastroenterologist", "General Physician"],
    "digestive": ["Gastroenterologist"],
    "nausea": ["Gastroenterologist", "General Physician"],
    "diarrhea": ["Gastroenterologist"],
    "constipation": ["Gastroenterologist"],
    "acid reflux": ["Gastroenterologist"],
    "ulcer": ["Gastroenterologist"],
    
    # Respiratory
    "cough": ["General Physician", "Pulmonologist"],
    "cold": ["General Physician"],
    "fever": ["General Physician"],
    "asthma": ["Pulmonologist", "General Physician"],
    "shortness of breath": ["Pulmonologist", "Cardiologist"],
    "breathing": ["Pulmonologist"],
    
    # Ophthalmological
    "eye": ["Ophthalmologist"],
    "vision": ["Ophthalmologist"],
    "eye pain": ["Ophthalmologist"],
    "glasses": ["Ophthalmologist"],
    "glaucoma": ["Ophthalmologist"],
    
    # ENT
    "ear": ["ENT Specialist"],
    "hearing": ["ENT Specialist"],
    "throat": ["ENT Specialist"],
    "throat pain": ["ENT Specialist"],
    "sore throat": ["ENT Specialist"],
    "nose": ["ENT Specialist"],
    "sinus": ["ENT Specialist"],
    
    # Gynecological
    "pregnancy": ["Gynecologist"],
    "period": ["Gynecologist"],
    "menstrual": ["Gynecologist"],
    "gynecological": ["Gynecologist"],
    
    # Pediatric
    "baby": ["Pediatrician"],
    "child": ["Pediatrician"],
    "infant": ["Pediatrician"],
    "newborn": ["Pediatrician"],
    
    # Psychiatric/Mental Health
    "anxiety": ["Psychiatrist"],
    "depression": ["Psychiatrist"],
    "mental": ["Psychiatrist"],
    "stress": ["Psychiatrist"],
    "sleep": ["Psychiatrist", "General Physician"],
    "insomnia": ["Psychiatrist", "General Physician"],
    
    # Dental
    "tooth": ["Dentist"],
    "teeth": ["Dentist"],
    "dental": ["Dentist"],
    "cavity": ["Dentist"],
}


def recommend_doctors(symptoms: str, doctors_list: list) -> tuple[list, str, float]:
    """
    Recommend doctors based on symptoms
    
    Args:
        symptoms: User's symptom description
        doctors_list: List of available doctor objects
    
    Returns:
        Tuple of (recommended_doctors, primary_specialization, confidence_score)
    """
    symptoms_lower = symptoms.lower()
    recommended_specs = []
    confidence = 0.0
    
    # Find matching specializations
    for symptom_keyword, specializations in SYMPTOM_TO_SPECIALIZATION.items():
        if symptom_keyword in symptoms_lower:
            recommended_specs.extend(specializations)
            confidence += 0.1
    
    # If no exact match, use general physician
    if not recommended_specs:
        recommended_specs = ["General Physician"]
        confidence = 0.5
    
    # Remove duplicates and sort by frequency
    from collections import Counter
    spec_counts = Counter(recommended_specs)
    primary_spec = spec_counts.most_common(1)[0][0]
    
    # Filter doctors by recommended specializations
    recommended_doctors = [
        d for d in doctors_list 
        if d.specialization in spec_counts
    ]
    
    # Sort by rating
    recommended_doctors.sort(key=lambda x: x.rating, reverse=True)
    
    # Cap confidence at 1.0
    confidence = min(confidence, 1.0)
    
    return recommended_doctors, primary_spec, confidence


def get_symptom_specializations(symptoms: str) -> list:
    """Get specializations for given symptoms"""
    symptoms_lower = symptoms.lower()
    specs = []
    
    for keyword, specializations in SYMPTOM_TO_SPECIALIZATION.items():
        if keyword in symptoms_lower:
            specs.extend(specializations)
    
    return list(set(specs)) if specs else ["General Physician"]
