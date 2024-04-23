document.addEventListener('DOMContentLoaded', (event) => {
    const trueButton = document.getElementById('true');
    const falseButton = document.getElementById('false');
    const resultDiv = document.getElementById('result');
  
    trueButton.addEventListener('click', function() {
      setResult(falseButton, trueButton, 'Incorrect');
    });
  
    falseButton.addEventListener('click', function() {
      setResult(trueButton, falseButton, 'Correct');
    });
  
    function setResult(correctButton, incorrectButton, message) {
      correctButton.classList.remove('btn-secondary');
      correctButton.classList.add('btn-success');
      incorrectButton.classList.remove('btn-secondary');
      incorrectButton.classList.add('btn-danger');
      resultDiv.textContent = message;
      resultDiv.style.display = 'block';
      if (message === 'Correct') {
        resultDiv.className = 'result alert alert-success';
      } else {
        resultDiv.className = 'result alert alert-danger';
      }
    }
  });
  