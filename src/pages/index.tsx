import { LoadingSpinner, PageLayout } from "@/components";
import PostView from "@/components/postView";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRef } from "react";

const CreatePostWizard = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: loadingSavePost } =
    api.posts.createPost.useMutation({
      onSuccess: () => {
        if (!inputRef.current) return null;

        inputRef.current.value = "";
        void ctx.posts.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;

        toast({
          title: "Error saving post",
          description: errorMessage ? errorMessage[0] : "Darn it.",
        });
      },
    });

  if (!user) {
    return null;
  }

  const buttonSubmit = () => {
    if (!inputRef.current) {
      return console.log("no text value");
    }

    const inputValue = inputRef.current.value;
    mutate({ content: inputValue, username: user.username ?? "" });
  };

  return (
    <div className="flex gap-3">
      <Image
        alt="profile image"
        className="h-16 w-16 rounded-full"
        height={48}
        src={user.profileImageUrl}
        width={48}
      />
      <input
        className="grow bg-transparent outline-none"
        disabled={loadingSavePost}
        placeholder="Type some emojis!"
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (
              typeof inputRef.current?.value === "string" &&
              inputRef.current?.value !== ""
            ) {
              const inputValue = inputRef.current.value;
              mutate({ content: inputValue, username: user.username ?? "" });
            }
          }
        }}
      />
      <button disabled={loadingSavePost} onClick={buttonSubmit}>
        {loadingSavePost ? <LoadingSpinner /> : "Save Post"}
      </button>
    </div>
  );
};



const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <LoadingSpinner size={60} />;
  if (!data) return <p>No Data</p>;

  return data?.map(({ post, author }) => (
    <PostView author={author} key={post.id} post={post} />
  ));
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) {
    return <div />;
  }
  return (
    <PageLayout>
      {isSignedIn ? (
        <>
          <SignOutButton />
          <CreatePostWizard />
        </>
      ) : (
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      )}
      <ul className="flex flex-col">
        <Feed />
      </ul>
    </PageLayout>
  );
}
