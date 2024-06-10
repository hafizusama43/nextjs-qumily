import React from 'react'

const TemplateHeader = ({ children }) => {
    return (
        <div className='min-h-14 max-h-14 rounded mb-5 bg-gray-100 p-3 flex items-center justify-between'>
            {children}
        </div>
    )
}

export default TemplateHeader
