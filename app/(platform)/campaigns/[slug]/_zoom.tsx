import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Minus, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ZoomControl: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(100);

    useEffect(() => {
        // const currentZoom = Math.round(window.devicePixelRatio * 100);
        const element = document.querySelector('.custom-template-table') as HTMLElement;
        if (element) {
            element.style.zoom = `${80}%`;
        }
        setZoomLevel(80);

    }, []);

    const handleZoomIn = () => {
        const newZoom = zoomLevel + 10;
        const element = document.querySelector('.custom-template-table') as HTMLElement;
        if (element) {
            element.style.zoom = `${newZoom}%`;
        }
        setZoomLevel(newZoom);
    };

    const handleZoomOut = () => {
        const newZoom = zoomLevel - 10;
        const element = document.querySelector('.custom-template-table') as HTMLElement;
        if (element) {
            element.style.zoom = `${newZoom}%`;
        }
        setZoomLevel(newZoom);
    };

    const handleResetZoom = () => {
        const element = document.querySelector('.custom-template-table') as HTMLElement;
        if (element) {
            element.style.zoom = '100%';
        }
        setZoomLevel(100);
    };

    return (
        <div className='my-5 max-w-max border rounded p-3'>
            <small>Current Zoom Level: {zoomLevel}%</small>
            <Separator />
            <div className='flex gap-4 mt-3'>
                <Button size="icon" onClick={handleZoomIn}><Plus></Plus></Button>
                <Button size="icon" onClick={handleZoomOut}><Minus></Minus></Button>
                <Button size="sm" className='h-[2.25rem]' onClick={handleResetZoom}>Reset</Button>
            </div>
        </div>
    );
};

export default ZoomControl;
