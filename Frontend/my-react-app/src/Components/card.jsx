import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  title, 
  content, 
  bgColor, 
  textColor, 
  buttonText, 
  buttonColor, 
  buttonTextColor, 
  onClick, 
  backgroundImage,
  cardImage
}) => {
  return (
    <div 
      className={`relative shadow-md rounded p-4 m-2 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between w-full h-full`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`absolute inset-0 ${bgColor} opacity-75`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className={`text-xl font-bold mb-2 text-center ${textColor}`}>{title}</h2>
        
        {cardImage && (
          <div className="mb-4 flex justify-center">
            <img src={cardImage} alt={title} className="max-w-full h-auto rounded" />
          </div>
        )}
        
        <p className={`text-sm font-semibold ${textColor} flex-grow overflow-auto`}>{content}</p>
        
        {buttonText && (
          <div className="flex justify-center mt-2">
            <button 
              className={`py-2 px-4 rounded ${buttonColor} ${buttonTextColor} hover:opacity-75 transition-opacity duration-200`}
              onClick={(e) => {
                e.preventDefault();
                onClick();
              }}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  onClick: PropTypes.func,
  backgroundImage: PropTypes.string,
  cardImage: PropTypes.string,
};

Card.defaultProps = {
  bgColor: 'bg-purple-200',
  textColor: 'text-white',
  buttonText: '',
  buttonColor: 'bg-blue-500',
  buttonTextColor: 'text-white',
  backgroundImage: '',
  cardImage: '',
};

export default Card;