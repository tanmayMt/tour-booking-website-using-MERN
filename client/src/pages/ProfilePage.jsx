import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
// import PlacesPage from "./PlacesPage";
// import AccountNav from "../AccountNav";
export default function ProfilePage(){

    const [redirect,setRedirect] = useState(null);
    const{ready,user,setUser} = useContext(UserContext);
    
    let {subpage} = useParams();
    // console.log(subpage);

    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        // setUser(null);
        setRedirect('/');
        setUser(null);

    }

    if (!ready){
        return ' Loading....';
    } 

    if(ready && !user && !redirect){
        return <Navigate to={'/login'}/>
    }

    

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return(
        <div>
            
            <AccountNav/>
            {subpage ==='profile' &&(
                <div className="text-center max-w-lg mx-auto">

                        Name: <b>{user.name}</b><br/>
                        Email: <b>{user.email}</b><br/>

                        {user.userType==="Admin"&&(
                            <div>Loging in as <b>{user.userType}</b><br/></div>
                        )}
                        

                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage == 'places' &&(
                <PlacesPage/>
            )}
        </div>
    )
}