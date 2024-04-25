from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)


quiz_answers = {}

@app.route('/quiz/<int:question_number>/', methods=['GET', 'POST'])
def quiz(question_number):
    if request.method == 'POST':
        answer = request.form.get('answer', '')
        quiz_answers[question_number] = answer
        next_question = question_number + 1
        if next_question > 5:
            return redirect(url_for('results'))
        else:
            return redirect(url_for('quiz', question_number=next_question))
    

    next_question = question_number + 1 if question_number < 5 else None
    return render_template(f'quiz-q{question_number}.html', next_question=next_question)


@app.route('/quiz')  
def quiz_start():
    return redirect(url_for('quiz', question_number=1))

@app.route('/quiz/results')
def results():

    return f"Quiz answers: {quiz_answers}"

@app.route('/')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
