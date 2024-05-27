import BackButton from '@/components/ui/backButton'
import Image from 'next/image'
import React from 'react'

const Error = () => {
    // const router = useRouter();
    return (
        <div className='flex justify-center items-center flex-col'>
            <Image src={"/not-found.png"} width={600} height={600} alt='error.png'></Image>
            <BackButton></BackButton>
        </div>
    )
}

export default Error
