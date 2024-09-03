document.getElementById('fetchQuizData').addEventListener('click', function() {
    fetch('https://${EC2_IP}/quiz/1')  // Replace with your API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayQuizData(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});

function displayQuizData(data) {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';  // Clear previous content

    // Check if data has the expected structure
    if (data && data.title && data.question && Array.isArray(data.question)) {
        const quizItem = document.createElement('div');
        quizItem.className = 'quiz-item';

        const title = document.createElement('h3');
        title.textContent = data.title;
        quizItem.appendChild(title);

        // Display each question within the quiz
        data.question.forEach(question => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';

            const questionTitle = document.createElement('h4');
            questionTitle.textContent = question.questionTitle;
            questionItem.appendChild(questionTitle);

            // Create a form for radio buttons
            const form = document.createElement('form');
            form.className = 'question-options';

            // Add radio buttons for each option
            [question.option1, question.option2, question.option3, question.option4].forEach((option, index) => {
                const label = document.createElement('label');
                label.className = 'option-label';

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `question-${question.id}`;
                input.value = option;
                input.id = `question-${question.id}-option-${index}`;

                const span = document.createElement('span');
                span.textContent = option;

                label.appendChild(input);
                label.appendChild(span);
                form.appendChild(label);
                form.appendChild(document.createElement('br')); // Line break after each option
            });

            // Add submit button
            const submitButton = document.createElement('button');
            submitButton.type = 'button';
            submitButton.textContent = 'Submit';
            submitButton.disabled = true;
            submitButton.className = 'submit-button';

            // Handle submit button click
            submitButton.addEventListener('click', () => {
                const selectedOption = form.querySelector('input[name="question-' + question.id + '"]:checked');
                if (selectedOption) {
                    const selectedValue = selectedOption.value;
                    if (selectedValue === question.correctAnswer) {
                        alert('Correct answer!');
                    } else {
                        alert('Incorrect answer. Try again!');
                    }
                } else {
                    alert('Please select an option.');
                }
            });

            // Enable submit button when an option is selected
            form.addEventListener('change', () => {
                submitButton.disabled = !form.querySelector('input[name="question-' + question.id + '"]:checked');
            });

            questionItem.appendChild(form);
            questionItem.appendChild(submitButton);

            // Hide the correct answer
            // (No action needed as correctAnswer is not added to the DOM)

            // Display difficulty level and category
            const details = document.createElement('p');
            details.textContent = `Difficulty Level: ${question.difficultyLevel} | Category: ${question.category}`;
            questionItem.appendChild(details);

            quizItem.appendChild(questionItem);
        });

        quizContainer.appendChild(quizItem);
    } else {
        console.error('Unexpected data structure:', data);
    }
}



