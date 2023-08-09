import { type PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="w-full border-x border-slate-400 md:max-w-2xl">
        <div className="border-b border-slate-400 p-4 ">{props.children}</div>
      </div>
    </main>
  );
};

export default Layout;
