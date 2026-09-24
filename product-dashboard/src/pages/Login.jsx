import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {loginUser} from "../services/authService"
function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(username, password);

            localStorage.setItem("accessToken", data.accessToken);

            navigate("/products");
        } catch (error) {
            setError(
                error.response?.data?.message || "Invalid username or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">
                    Login
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full border p-3 mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border p-3 mb-4"
                />

                {error && (
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-3"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;