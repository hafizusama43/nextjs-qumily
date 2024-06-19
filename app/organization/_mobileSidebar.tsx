import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"
import { useSidebarStore } from '@/hooks/useMobileSidebar'
import { AlignJustify, X } from 'lucide-react'
import SideBar from './_sidebar'
import { usePathname } from 'next/navigation'

const MobileSidebar = () => {
    const pathname = usePathname();
    const { isOpen, onClose, onOpen } = useSidebarStore()

    useEffect(() => {
        onClose();

        return () => {
            onClose()
        }
    }, [pathname, onClose])

    return (
        <div className='block md:'>
            {isOpen ? <X role="button" onClick={() => { onClose() }} /> : <AlignJustify role="button" onClick={() => { onOpen() }} />}
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className='md:'>
                    <SideBar storageKey='t-mobile-sidebar'></SideBar>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileSidebar