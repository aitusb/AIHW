document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    if (!chatMessages || !chatInput || !sendButton) {
        console.error('One or more required elements are missing from the DOM.');
        return;
    }

    function addMessage(content, sender) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        message.textContent = content;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        try {
            const response = await fetch('http://localhost:4000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            return data.reply;
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return 'Sorry, I am having trouble responding right now.';
        }
    }

    sendButton.addEventListener('click', async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            chatInput.value = '';

            const botResponse = await getBotResponse(userMessage);
            addMessage(botResponse, 'bot');
        }
    });

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });

    document.getElementById('addIngredientButton').addEventListener('click', () => {
        const input = document.getElementById('ingredientInput');
        const ingredient = input.value.trim();

        if (ingredient) {
            const list = document.getElementById('ingredientList');

            // Create list item
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✕';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                listItem.remove();
            });

            listItem.appendChild(deleteButton);
            list.appendChild(listItem);

            // Add success animation
            listItem.classList.add('add-success');
            setTimeout(() => listItem.classList.remove('add-success'), 500);

            // Clear input field
            input.value = '';
        }
    });
});