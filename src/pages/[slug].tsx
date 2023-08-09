import { PageLayout } from "@/components";
import { api } from "@/utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Profile: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "peter-amd",
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            alt={`${data.username ?? ""}'s profile pic`}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
            height={128}
            src={data.profilePicture}
            width={128}
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-2xl font-bold">
          {`@${data.username ?? ""}`}
        </div>
        <div className="w-full border-b border-slate-400" />
      </PageLayout>
    </>
  );
};

export default Profile;
