import React, { useState } from 'react';
import api from "../utils/API.tsx";
import {Link, useNavigate} from 'react-router-dom';

import '../index.css';

interface RegisterForm {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegistrationPage: React.FC = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Assume register is a method from your auth context or API helper
            await api.register(formData.firstName, formData.lastName, formData.email, formData.phoneNumber, formData.password);
            console.log('Registration successful'); // Replace with actual registration logic
            navigate('/login'); // Navigate to login page after successful registration
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center"
             style={{backgroundImage: "url('src/components/images/authenticateBG.png')"}}>
            <section className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full mx-auto">
                    <div className="space-y-6">
                        <h1 className="text-xl font-bold text-center text-deep-purple mb-6">
                            Create an account
                        </h1>
                        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                            <div className="col-span-1">
                                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-deep-purple">First
                                    Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="w-full p-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-deep-purple">Last
                                    Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="w-full p-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="phoneNumber"
                                       className="block mb-2 text-sm font-medium text-deep-purple">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    className="w-full p-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-deep-purple">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-deep-purple">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full p-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="confirmPassword"
                                       className="block mb-2 text-sm font-medium text-deep-purple">Confirm
                                    Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="w-full p-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-2 text-center">
                                <button
                                    type="submit"
                                    className="w-full text-white bg-[#c080f0] hover:bg-[#a070d0] font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-[#c080f0] focus:ring-opacity-50"
                                >
                                    Create an account
                                </button>
                            </div>
                            <div className="col-span-2 text-center mt-4">
                                <Link to="/login" className="text-sm text-cyan-600 hover:text-cyan-800">Already Have an
                                    Account? Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegistrationPage;
