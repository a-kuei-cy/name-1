import React from 'react';

interface HeaderProps {
  classNameValue: string;
}

const Header: React.FC<HeaderProps> = ({ classNameValue }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-slate-800">學生簽到表</h1>
      <p className="text-xl text-slate-600 mt-2">{classNameValue}</p>
    </div>
  );
};

export default Header;
