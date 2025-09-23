

import { Link, useNavigate } from 'react-router-dom';
import logo from '../../src/assets/logo.png';

const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header className="bg-[#1684a9] text-white p-4 flex flex-col sm:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                <span className="text-5xl font-bold font-moderno">LCB Finance PLC</span>
            </div>
            <nav className="flex space-x-32 justify-start w-full sm:w-auto pr-32">
            <Link to="/homeManager" className="text-white hover:text-purple-600">Home</Link>
            <Link to="/pdfuploadManager" className="text-white hover:text-purple-600">Upload Documents</Link>
                <button 
                    onClick={handleLoginClick}
                    className="bg-[#A05C9B] hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                    Log Out
                </button>
            </nav>
        </header>
    );
};

export default Header;