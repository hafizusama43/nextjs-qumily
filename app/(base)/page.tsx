import { Button } from '@/components/ui/button';
import { Medal } from 'lucide-react';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="bg-orange-300 p-5 flex items-center gap-2 rounded-full uppercase dark:text-black">
        <Medal />
        <span>No 1 task management app</span>
      </div>
      <h1 className='mt-10 text-3xl md:text-5xl uppercase'>Qumily helps team move</h1>
      <p className='bg-gradient-to-r from-orange-300 to-orange-600 p-5 mt-10 rounded-lg text-2xl md:text-4xl uppercase dark:text-black'>forward efficiently.</p>
      <span className='mt-10 break-all text-neutral-400 max-w-xs text-center md:max-w-2xl'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum, voluptates dolore quisquam culpa quasi temporibus soluta deserunt reprehenderit nisi tenetur dolorem deleniti nihil, sapiente fugiat vero? Consequuntur doloribus ad iure.</span>
      <Button className='mt-10 min-h-10'>Get Qumily for free</Button>
    </div>
  );
}
