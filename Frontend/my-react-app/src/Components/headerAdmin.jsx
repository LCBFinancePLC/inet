import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../src/assets/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <header className="bg-[#1684a9] text-white p-4 flex flex-col 2xl:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center justify-between w-full 2xl:w-auto mb-4 2xl:mb-0">
                <div className="flex items-center">
                    <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                    <span className="text-5xl font-bold font-moderno">LCB Finance PLC</span>
                </div>
                
                {/* Hamburger Menu Button */}
                <button
                    onClick={toggleMenu}
                    aria-controls="primary-navigation"
                    aria-expanded={isMenuOpen}
                    className="2xl:hidden text-[#1684a9]"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav 
                id="primary-navigation"
                className={`${
                    isMenuOpen ? 'flex' : 'hidden 2xl:flex'
                } flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-16 justify-start w-full 2xl:w-auto 2xl:pr-24`}
            >
                <Link 
                    to="/homeAdmin" 
                    className="text-white hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Home
                </Link>
                <Link 
                    to="/pdfupload" 
                    className="text-white hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Upload Documents
                </Link>
                <Link 
                    to="/registration" 
                    className="text-white hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Content Manager
                </Link>
                <Link 
                    to="/adminReview" 
                    className="text-white hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Admin Approval
                </Link>
                <Link 
                    to="/managephoneBook" 
                    className="text-white hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Phone Book
                </Link>
                <button 
                    onClick={() => {
                        handleLoginClick();
                        setIsMenuOpen(false);
                    }}
                    className="bg-[#A05C9B] hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full 2xl:w-auto"
                >
                    Log Out
                </button>
            </nav>
        </header>
    );
};

export default Header;