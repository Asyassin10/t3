import ChangePassword from "@/AppComponents/Profile/ChangePassword";
import ProfileUserData from "@/AppComponents/Profile/ProfileUserData";
import { getProfileData } from "@/axios/AbstractionsApi/ApiUser";
import { Spinner } from "@/shadcnuicomponents/ui/spinner";
import { ProfileResponse } from "@/types/response_types";
import { useQuery } from "@tanstack/react-query";

function Profile() {
    const user_data = useQuery<ProfileResponse>({
        queryKey: ['profile_data'],
        queryFn: () => getProfileData()
    })


    if (user_data.isLoading) {
        return <Spinner />
    }
    return (
        <div className="w-full flex h-full  p-4">
            <div className="w-1/2 p-10 ">
                <ProfileUserData user={user_data.data!.user} />
            </div>
            <div className="w-1/2 p-10 ">
                <ChangePassword />
            </div>
        </div>
    )
}

export default Profile
