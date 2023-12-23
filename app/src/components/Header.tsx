import React from 'react';

interface HeaderProps {
  headerText: string;
  subTitleText?: string; // Optional prop
}

const Header: React.FC<HeaderProps> = ({ headerText, subTitleText }) => {
  return (
    <>
      <header className="mb-5">
        <h1 className="text-3xl mb-3">{headerText}</h1>
        {subTitleText && <p>{subTitleText}</p>}
      </header>
      <hr className="h-1 mx-auto bg-gray-100 border-0 rounded" />
    </>
  );
};

export default Header;
