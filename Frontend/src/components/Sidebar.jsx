/* eslint-disable no-unused-vars */
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-700 text-white p-4">
      <nav>
        <ul>
          <li className="mb-2"><a href="#" className="hover:text-gray-300">File 1</a></li>
          <li className="mb-2"><a href="#" className="hover:text-gray-300">File 2</a></li>
          <li className="mb-2"><a href="#" className="hover:text-gray-300">File 3</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
