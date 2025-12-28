import { ProfileResponse } from '@/types/response_types'
//user: User
function ProfileClientEsoft({ profileResponse }: { profileResponse: ProfileResponse }) {
    return (
        <div className='w-full bg-red-50 flex-1'>
            {profileResponse.user.role.role_name}
        </div>
    )
}

export default ProfileClientEsoft
