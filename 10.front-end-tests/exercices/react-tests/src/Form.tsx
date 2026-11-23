import React, { useState } from "react";
import axios from "axios";

interface FormData {
    name: string;
    email: string;
}

const Form: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
    const [status, setStatus] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Submitting...");
        try {
            const response = await axios.post<{ message: string }>("/api/submit", formData);
            setStatus(`Success: ${response.data.message}`);
        } catch (error) {
            setStatus("Error: Unable to submit.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} aria-label="Contact form">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-required="true"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {status && <p role="status" aria-live="polite">{status}</p>}
        </div>
    );
};

export default Form;