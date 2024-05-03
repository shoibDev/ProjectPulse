import React from 'react';
import backgroundImage from '../images/headerBG.png'; // Ensure path is correct

const Header: React.FC<{ title: string }> = ({ title }) => {
    return (
        <header className="flex justify-between items-center py-2.5 px-5 bg-no-repeat bg-cover text-gray-800 relative" style={{ height: "150px", backgroundImage: `url(${backgroundImage})` }}>
            <h1 className="text-lg font-semibold">{title}</h1>
        </header>
    );
};

export default Header;
