import React from 'react';

interface TopMenuBarProps {
  documentName?: string;
}

const TopMenuBar = ({ documentName = "Indian_Word_Processor" }: TopMenuBarProps) => {
  const menus = ["File", "Edit", "View", "Insert", "Format", "Tools", "Extensions", "Help"];

  return (
    <div className="flex items-center px-4 py-2 bg-[#111111] border-b border-zinc-800">
      {/* Logo Placeholder */}
      <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-bold rounded mr-3 cursor-pointer">
        BD
      </div>

      <div className="flex flex-col justify-center">
        {/* Document Title */}
        <input 
          type="text" 
          defaultValue={documentName}
          className="bg-transparent text-gray-100 font-medium text-lg px-1 hover:border-gray-600 border border-transparent rounded focus:outline-none focus:border-blue-500 transition-colors w-fit"
        />
        
        {/* Menu Items */}
        <div className="flex items-center gap-1 mt-0.5">
          {menus.map((menu) => (
            <button 
              key={menu}
              className="px-2 py-0.5 text-sm text-gray-300 hover:bg-zinc-800 rounded transition-colors"
            >
              {menu}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;