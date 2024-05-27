import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
    <div className='flex justify-center items-center flex-col'>
        <UserProfile path="/user-profile" />
    </div>
);

export default UserProfilePage;