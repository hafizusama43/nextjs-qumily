import React from 'react'

const TemplateHeader = ({ children }) => {
    return (
        <div className='min-h-14 max-h-14 rounded mb-5 border bg-gray-100 dark:bg-transparent border-white p-3 flex items-center justify-between'>
            {children}
        </div>
    )
}

export default TemplateHeader
