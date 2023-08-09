import { LoadingSpinner, PageLayout } from "@/components";
import PostView from "@/components/postView";
import { api } from "@/utils/api";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";

const ProfileFeed = (props: { username: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    username: props.username,
  });
  console.log("data", { data, props });
  if (isLoading) return <LoadingSpinner />;
  if (!data || data.length === 0) {
    return <p>User has not posted</p>;
  }
  return (
    <div className="flex flex-col">
      {data?.map(({ post, author }) => (
        <PostView author={author} key={post.id} post={post} />
      ))}
    </div>
  );
};

const Profile: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const slug = (props?.slug as string) ?? "";
  console.log("slug", slug);
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: slug.replace("@", ""),
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
        <div className="w-full border-b border-slate-400">
          <ProfileFeed username={slug} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = (context) => {
  console.log("context", context);

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  console.log("context at staticProps", context);

  return {
    props: {
      slug: context.params?.slug,
    },
  };
};

export default Profile;
