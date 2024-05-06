$(document).ready(function() {
    $(".start-btn").mousedown(function() {
        $(this).addClass("start-btn-mousedown");
    });

    $(".next-btn").mousedown(function() {
        $(this).addClass("next-btn-mousedown");
    });

    $(".back-btn").mousedown(function() {
        $(this).addClass("back-btn-mousedown");
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.answers button');
    const resultDiv = document.getElementById('result');
    const startTime = Date.now();
    let correctAnswers = 0;

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('answered')) return;
            const isCorrect = this.getAttribute('data-correct') === 'true';
            if (isCorrect) correctAnswers++;
            setResult(this, isCorrect);
            this.classList.add('answered');
            disableButtons(this.parentNode); // Disable all buttons in this question group
        });
    });

    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            if (draggable.classList.contains('answered')) return;
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            draggable.classList.add('answered');
            checkCompletion();
        });
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            if (!draggable.classList.contains('answered')) {
                dropzone.appendChild(draggable);
            }
        });
    });

    function disableButtons(buttonGroup) {
        buttonGroup.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
    }

    function checkCompletion() {
        const allPlaced = [...dropzones].every(dropzone => dropzone.querySelector('.draggable.answered'));
        if (allPlaced) {
            evaluateCorrectness();
            calculateResults();
        }
    }

    function setResult(element, isCorrect) {
        element.classList.add(isCorrect ? 'btn-success' : 'btn-danger');
        resultDiv.textContent = isCorrect ? 'Correct' : 'Incorrect';
        resultDiv.style.display = 'block';
        resultDiv.className = 'result alert ' + (isCorrect ? 'alert-success' : 'alert-danger');
    }

    function evaluateCorrectness() {
        dropzones.forEach(dropzone => {
            const isCorrect = dropzone.querySelector('.draggable').getAttribute('data-chord') === dropzone.getAttribute('data-chord');
            dropzone.style.backgroundColor = isCorrect ? '#90ee90' : '#ffcccb';
            if (isCorrect) correctAnswers++;
        });
    }

    function calculateResults() {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 60000); // Time in minutes
        resultDiv.textContent += ` You got a score of ${correctAnswers} / 5! It took you ${timeTaken} minutes.`;
    }
});
