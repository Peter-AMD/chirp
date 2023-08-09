import { type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUserType = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUserType) => {
  return (
    <li className="flex min-h-[66px] gap-6 p-6">
      <Image
        alt={`${props.author.username || ""} profile picture`}
        className="h-12 w-12 rounded-full"
        height={48}
        src={props.author.profilePicture}
        width={48}
      />
      <div>
        <div className="flex gap-2 text-slate-300">
          <Link
            href={`/@${props.author.username}`}
          >{`@${props.author.username}`}</Link>
          <span>·</span>
          <span className="font-thin">
            {dayjs(props.post.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-2xl">{props.post.content}</p>
      </div>
    </li>
  );
};

export default PostView;
