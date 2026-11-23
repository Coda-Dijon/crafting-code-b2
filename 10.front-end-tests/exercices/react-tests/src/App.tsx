import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import Form from './Form'; // Import the Form component

function App() {
    const [count, setCount] = useState(0);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    aria-label={`Increment counter, current count is ${count}`}
                >
                    count is {count}
                </button>

                <button
                    onClick={() => setShowForm(!showForm)}
                    aria-expanded={showForm}
                    aria-controls="contact-form-section"
                >
                    {showForm ? 'Hide Form' : 'Show Form'}
                </button>
            </div>
            {showForm && (
                <section id="contact-form-section" aria-label="Contact section">
                    <Form />
                </section>
            )}
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
