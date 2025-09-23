import { useNavigate } from 'react-router-dom';
import logo from '../../src/assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };
    
    return (
        <header className="bg-[#1684a9] text-white p-4 flex flex-col sm:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                <span className="text-5xl font-bold font-moderno">LCB Finance PLC</span>
            </div>
            <nav className="flex space-x-4 justify-end w-full sm:w-auto">
                <a 
                    href="http://10.10.1.80:5173/phonebook"
                    className="flex items-center text-[#0F4C81] hover:text-white bg-white hover:bg-[#0F4C81] px-4 py-2 rounded-md transition duration-300 ease-in-out"
                >
                    <FontAwesomeIcon icon={faAddressBook} className="mr-2" />
                    <span>PHONEBOOK</span>
                </a>
                <button 
                    onClick={handleBackClick}
                    className="flex items-center text-[#A05C9B] hover:text-white bg-white hover:bg-[#A05C9B] px-4 py-2 rounded-md transition duration-300 ease-in-out"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    <span>BACK</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;