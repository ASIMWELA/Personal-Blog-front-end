import React from 'react';
import { Link } from 'react-router-dom'
import { FaUserLock } from 'react-icons/fa'
import './NavBar.css'


export default function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg  navbar-light bg-light navbar-fixed-top">
                <Link to='/' className="navbar-brand" >[OwnerBrand]</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav navbar-right justify-content right">

                        <li className="nav-item">
                            <Link to='/' className="nav-link" >Home </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/profile' className="nav-link" >Profile</Link>
                        </li>

                        <li className="nav-item">
                            <Link to='/abilities' className="nav-link" >Abilities</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/projects' className="nav-link" >Projects</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/contact' className="nav-link" >Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/login' className="nav-link" ><FaUserLock size={30} /></Link>
                        </li>



                    </ul>

                </div>
            </nav>
        </>
    );
}
