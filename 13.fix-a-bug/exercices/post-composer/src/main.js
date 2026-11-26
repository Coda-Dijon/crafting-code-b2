import { canPublish, counterState, remainingCharacters } from './message.js';

const textarea = document.getElementById('message');
const counter = document.getElementById('counter');
const publishButton = document.getElementById('publish');
const timeline = document.getElementById('timeline');

function render() {
    const text = textarea.value;
    const remaining = remainingCharacters(text);

    counter.textContent = `${remaining} caractère${Math.abs(remaining) > 1 ? 's' : ''} restant${Math.abs(remaining) > 1 ? 's' : ''}`;
    counter.dataset.state = counterState(text);
    publishButton.disabled = !canPublish(text);
}

textarea.addEventListener('input', render);

document.getElementById('composer').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!canPublish(textarea.value)) return;

    const item = document.createElement('li');
    item.textContent = textarea.value;
    timeline.prepend(item);

    textarea.value = '';
    render();
});

render();
