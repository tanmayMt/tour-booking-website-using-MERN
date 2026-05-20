import { Link } from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "./UserContext";
export default function Header()
{
    const {user} = useContext(UserContext);
    return(
        <header className="flex justify-between"> {/* "p-6" means padding */}
        <Link to={'/'} className="flex items-center gap-1">{/* distance betweent icon and Tripify*/}
          {/*Add web incon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 -rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
          </svg>
          <span className="font-bold text-xl">Tripify</span>
        </Link>
  
        {/*Search Area */}
        <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-500">
          {/*shadow-md shadow-orange-500 -> means adding shadow on search bar*/}  
          <div>Anywhere</div>
          <div className="border-l border-gray-300"></div>{/*Add side border inside search bar*/}
          <div>Any Week</div>
          <div className="border-l border-gray-300"></div>{/*Add side border */}
          <div>Add Guest</div>
          {/*Add search incon */}
          <button className="bg-primary text-white p-1 rounded-full">
          {/* bg-primary->bg-color of search icon, text-white->icon color, p-2->padding 2, rounded-full->search icon border will be rounded*/}
            {/*Add search incon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
  
        {/*Link to login page */}
        <Link to={user?'/account':'/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-500">{/*If we have user than go to his accout otheise go to login */}
          {/*Add 3-bar icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            {/* Add user icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            </div>
            {!!user && (
              <div>
                {user.userType==="Admin"&&(
                  <b>{user.name}({user.userType})</b>
                )}
                {user.userType==="Customer"&&(
                  <b>{user.name}</b>
                )}
              </div>
            )}
      </Link>
    </header>
  );
}
