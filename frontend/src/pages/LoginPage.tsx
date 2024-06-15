import React, {useState, FormEvent} from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../auth/provider/auth';

interface LoginForm {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginForm>({email: '', password: ''});

    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuth();
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password); // Passing email and password
            navigate(from, {replace: true});
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center"
             style={{backgroundImage: "url('src/components/images/authenticateBG.png')"}}>
            <section className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full mx-auto"> {/* Adjusted max-width */}
                    <h1 className="text-lg font-bold mb-4 text-deep-purple">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-deep-purple">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-deep-purple">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit"
                                className="w-full bg-[#c080f0] hover:bg-[#a070d0] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                            Log in
                        </button>
                        <div className="mt-4 text-center">
                            <Link to="/register" className="text-sm text-cyan-600 hover:text-cyan-800">Need an account? Sign up</Link>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default LoginPage;
