$(document).ready(function() {
    // Add 'mousedown' classes for visual feedback on button presses
    $("#start-btn, .next-btn, .back-btn, #quiz-btn, .quiz-next").mousedown(function() {
        $(this).addClass($(this).attr('id') + '-mousedown');
    });

    const startTime = Date.now();
    let correctAnswers = 0;
    const totalQuestions = 5;
    const resultDiv = document.getElementById('result-display');

    // Submit answer using AJAX and handle response
    function submitAnswer(currentQuestion, selectedOption) {
        $.ajax({
            url: '/quiz/' + currentQuestion + '/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({answer: selectedOption}),
            success: function(response) {
             
                setResultBanner(response.is_correct);
                disableButtons(currentQuestion);

                // Increment correct answers count if the answer was correct
                if (response.is_correct) {
                    correctAnswers++;
                }

                // Check if the current question is the last one
                if (currentQuestion === totalQuestions) {
                    calculateResults();
                }
            },
            error: function(xhr, status, error) {
                console.error("Error submitting answer:", error);
            }
        });
    }

    // Handle button clicks for quiz answers
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.answer-button')) return;
        const button = event.target;
        if (button.classList.contains('answered')) return;

        const questionId = button.closest('[data-question-id]').getAttribute('data-question-id');
        const selectedOption = button.getAttribute('data-option');

        // Submit the answer using AJAX
        submitAnswer(parseInt(questionId), selectedOption);

        // Mark the button as answered
        button.classList.add('answered');
    });

    function disableButtons(questionId) {
        document.querySelectorAll(`[data-question-id='${questionId}'] .answer-button`).forEach(button => {
            button.disabled = true;
        });
    }

    // Set result display for button-based questions
    function setResultBanner(isCorrect) {
        resultDiv.textContent = isCorrect ? 'Correct' : 'Incorrect';
        resultDiv.className = 'alert ' + (isCorrect ? 'alert-success' : 'alert-danger');
        resultDiv.style.display = 'block';
    }

    // Calculate final results and send them to the server
    function calculateResults() {
        const endTime = Date.now();
        const timeTaken = Math.floor(endTime - startTime)
        const results = {
            correctAnswers: correctAnswers,
            timeTaken: timeTaken
        };

        // Log the results to the console for debugging
        console.log("Sending results:", results);
    
        // Send results to the server
        $.ajax({
            url: '/quiz/results',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(results),
            success: function() {
                window.location.href = '/quiz/results';  // Redirect to the results page
            },
            error: function(xhr, status, error) {
                console.error("Error submitting results:", error);
            }
        });
    }
});





    // // Existing functions for drag and drop or final results (if needed) remain unchanged

    // Drag and drop functionality
    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function() {
            if (this.classList.contains('answered')) return;
            this.classList.add('dragging');
        });

        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            this.classList.add('answered');
            checkCompletion();
        });
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            if (!draggable.classList.contains('answered')) {
                dropzone.appendChild(draggable);
            }
        });
    });

    // Check if all answers have been placed for drag-and-drop
    function checkCompletion() {
        const allPlaced = [...dropzones].every(dropzone => dropzone.querySelector('.draggable.answered'));
        if (allPlaced) {
            evaluateCorrectness();
            calculateResults();
        }
    }

    // Evaluate correctness for drag-and-drop
    function evaluateCorrectness() {
        dropzones.forEach(dropzone => {
            const draggable = dropzone.querySelector('.draggable');
            const isCorrect = draggable.getAttribute('data-chord') === dropzone.getAttribute('data-chord');
            dropzone.style.backgroundColor = isCorrect ? '#90ee90' : '#ffcccb';
            if (isCorrect) correctAnswers++;
        });
    }


