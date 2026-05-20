{/*
   Instead of putting a header again into our login page
   and then we will need all need footer so both header and
   footer login page and other component and other pages, we
    will actually create a template or layout.
*/}
import { Outlet } from "react-router-dom";
import Header from "./Header"; {/*Why we get this error*/}

export default function Layout()
{
    return(
        <div className="py-4 px-8 flex flex-col min-h-screen">
            <Header/>
            <Outlet/>{/* We want to have content of our page so for index it will be like some random places here for login page it will this login form and so to make it work for our layout we will use a component called Outlet (impoted from react-router-dom). */}
        </div>
    )
}