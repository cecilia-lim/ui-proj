$(document).ready(function(){

  $(".start-btn").mousedown(function () { 
    $(this).addClass("start-btn-mousedown")
  })

  $(".next-btn").mousedown(function () { 
    $(this).addClass("next-btn-mousedown")
  })

  $(".back-btn").mousedown(function () { 
    $(this).addClass("back-btn-mousedown")
  })


})


document.addEventListener('DOMContentLoaded', (event) => {
  const buttons = document.querySelectorAll('.answers button');
  const resultDiv = document.getElementById('result');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const isCorrect = this.getAttribute('data-correct') === 'true';
      console.log('Clicked button:', this.id, 'isCorrect:', isCorrect); // This will log the result
      setResult(button, isCorrect);
    });
  });


  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const isCorrect = this.getAttribute('data-correct') === 'true';
      setResult(button, isCorrect);
    });
  });

  function setResult(selectedButton, isCorrect) {
    buttons.forEach(btn => {
      btn.classList.remove('btn-success', 'btn-danger');
    });

    selectedButton.classList.add(isCorrect ? 'btn-success' : 'btn-danger');
    resultDiv.textContent = isCorrect ? 'Correct' : 'Incorrect';
    resultDiv.style.display = 'block';
    resultDiv.className = 'result alert ' + (isCorrect ? 'alert-success' : 'alert-danger');
  }
});