import PostHome from "@src/pages/components/Home";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@src/constants/cookies";
import axios from "axios";
import { API_URLS } from "@src/constants/api";
import { GetUserInfo } from "@src/types/api";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  const response = await axios.post<GetUserInfo>(
    API_URLS.GET_USER_INFO,
    { accessToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (response.status === 401) {
    redirect("/login");
  }
  const { email } = response.data;

  return <PostHome email={email} />;
}
