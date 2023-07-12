import { api } from "@/utils/api";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

export default function Home() {
  const { data } = api.posts.getAll.useQuery(); 
  const user = useUser();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {user.isSignedIn ? (
          <SignOutButton />
        ) : (
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        )}

        {data?.map((post) => (
          <p key={post.authorId}>Posts: {post.content}</p>
        ))}
      </main>
    </>
  );
}
