


import React from 'react';
import { TbError404 } from 'react-icons/tb';

const NotFound404 = ({ title = 'No data found', iconSize = 20, textStyle = 'text-2xl ' }) => {
    return (
        <div className="flex flex-col items-center justify-center ">
            <TbError404 size={iconSize} />
            <p className={`mt-2 ${textStyle}`}>{title}</p>
        </div >
    );
};

export default NotFound404;