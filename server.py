from flask import Flask, render_template, request, redirect, url_for, json, jsonify
from datetime import datetime 

app = Flask(__name__)

global current_lesson
current_lesson = 1
quiz_answers = 0

question_number = 1

lessons = [
    {
        "id": 1,
        "title": "Part 1: Basic Terminology",
        "text": """Let's start with some basic terms! A chord is any group of two or more notes played together. Depending on the notes that make up the chord and the quality of sound they produce, there are different names for each one. You likely have heard of major and minor chords, where major chords sound bright & happy, and minor chords are sad or contemplative. Look below at different chords!""",
        "img":"https://wpe.hoffmanacademy.com/wp-content/uploads/2021/02/How-to-Read-and-Play-Piano-Chords.jpeg",
    },
    {
        "id": 2,
        "title": "Part 1: Chord Progression",
        "text": """A chord progression is simply a sequence of chords. Oftentimes pop songs have a sequence of 4 chords that repeat throughout the song. Pop songs are notorious for recycling chord progressions. We represent different chord progressions as a string of roman numerals. They may seem intimidating, but for now, just know that the numbers help us understand the chords in relation to each other. In each song, we have different expectations for which chords will be major or minor, without even realizing it! Major chords are represented by capital roman numerals, while minor chords are in lowercase. Below are some common chord progressions and their notation!""",
        "img":"https://writetracks.files.wordpress.com/2012/11/chord_progressions.jpg",
    },
    {
        "id": 3,
        "title": "Part 2: The I-iii-vi-IV",
        "text": """Let's look at a specific chord progression: the 1-3-6-4. Often known as the “emotional progression,” many pop and rock ballads use this formula. Click the play button to hear the progression.""",
        "video":"https://www.youtube.com/embed/eu__YcNCDgY"
    },
    {
        "id": 4,
        "title": "Part 2: Traitor",
        "text": "You might recognize the chord progression from Olivia Rodrigo's song 'Traitor'.",
        "video":"https://www.youtube.com/embed/6tsu2oeZJgo"
    },
    {
        "id": 5,
        "title": "Part 3: I-III-IV-iv",
        "text":"Let's look at another progression. This one does something a little funky: it adds two chords that aren't from the key: E major (the III) and F minor (the iv).",
        "video":"https://www.youtube.com/embed/Ud5CkdeL3K4"
    },
    {
        "id": 6,
        "title": "Part 3: Vampire",
        "text": "You might recognize the chord progression from Olivia Rodrigo's song 'Vampire'. It works well with the song because the unexpected sounds add an eerie quality!",
        "video":"https://www.youtube.com/embed/RlPNh_PBZb4"
    },
]

@app.route('/learn/<int:current_lesson>/', methods=['GET', 'POST'])
def learn(current_lesson):
    global lessons
    lesson = lessons[current_lesson - 1]
    return render_template('learn.html', lesson=lesson, current_lesson=current_lesson)

@app.route('/')
def home():
    return render_template('home.html')

current_question = 1

# Define your questions and answers
questions = [
    {
        "id": 1,
        "text": "True or False: a minor chord sounds bright or happy while a major chord sounds sad or contemplative.",
        "options": {1: "True", 2: "False"},
        "answer": 2,
    },
    {
        "id": 2,
        "text": "True or False: minor chords are represented by lowercase roman numerals, while major chords are upper case.",
        "options": {1: "True", 2: "False"},
        "answer": 1,
    },
    {
        "id": 3,
        "text": "True or False: Traitor uses the I-iii-vi-IV chord progression, which is nicknamed the emotional progression.",
        "options": {1: "True", 2: "False"},
        "answer": 1,
    },
    {
        "id": 4,
        "text": "True or False: As listeners, we have different expectations for major and minor chords within a key.",
        "options": {1: "True", 2: "False"},
        "answer": 1,
    },
    {
        "id": 5,
        "text": "Which chord progression do the songs use?",
        "options": {1: "Option URL 1", 2: "Option URL 2"},
        "answer": 1,
    },
]

@app.route('/quiz/<int:current_question>/', methods=['GET', 'POST'])
def quiz(current_question):
    if request.method == 'POST':
        # Assume the answer comes in a JSON payload
        data = request.json
        print("Received data:", data)  # This will show you what the server sees

        selected_answer = data['answer']
        correct_answer = questions[current_question - 1]['answer']
        is_correct = int(selected_answer) == correct_answer
        
        # Respond with whether the answer was correct
        response_data = {'is_correct': is_correct, 'current_question': current_question}
        if current_question == len(questions):
            response_data['final'] = True
            # Optionally, calculate and include more data like total correct answers
        return jsonify(response_data)
    
    # Display the question page
    question = questions[current_question - 1]
    return render_template('quiz.html', question=question, current_question=current_question)

results_storage = {}

@app.route('/quiz/results', methods=['GET', 'POST'])
def handle_results():
    if request.method == 'POST':
        data = request.get_json()
        results_storage['last_results'] = data  # Store results
        return jsonify({'success': True})
    else:
        results = results_storage.get('last_results', {'correctAnswers': 0, 'timeTaken': 0})
        return render_template('results.html', quiz_answers=results['correctAnswers'], total_time=results['timeTaken'])

if __name__ == '__main__':
    app.run(debug=True)
