// import API from "../axiosConfig"; // Import the configured axios instance
// const VITE_API_BASE_URL="https://tour-booking-api.onrender.com";
import {Link, Navigate} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";//../UserContext.jsx

export default function LoginPage(){
    //We need to add some state for our input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev) {
      ev.preventDefault();
      try {
        const res = await axios.post('/login', { email, password });
        if (res.data.success) {
          setUser(res.data.userDoc);
          setRedirect(true);
        } else {
          alert(res.data.message || 'Login failed');
        }
      } catch (e) {
        const message = e.response?.data?.message || 'Unable to connect to the server. Is the API running?';
        alert(message);
      }
    }
    //Re-direct to the home page
    if (redirect) {
        return <Navigate to={'/'} />
    }

    
    return(
        <div className="mt-4 grow flex items-center justify-around">
            {/*mt-4->mergin top-4 */}
            <div className="mb-64">
                {/*mb-64->Margin botton of 64*/}
                <h1 className="text-4xl text-center mb-4">Login</h1>
                {/* mb-4->Margin Button of 4 */}
                <form className="max-w-md mx-auto broder" onSubmit={handleLoginSubmit}>
                    {/*max-w-md->Maximum-Width-Medium 
                       mx-auto->Margin*/}
                       <input type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={ev => setEmail(ev.target.value)} />
                        <input type="password"
                               placeholder="password"
                               value={password}
                               onChange={ev => setPassword(ev.target.value)}/>
                        <button className="primary">Login</button>
                        <div className="text-center py-2 text-gray-500">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <div className="text-center py-2 text-gray-500">
                            Don't have an account yet?{' '}
                            <Link to="/register">Register now</Link>
                        </div>
                    </form>
            </div>
        </div>
    )
}
