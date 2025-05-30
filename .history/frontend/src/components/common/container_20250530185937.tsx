import { FC, ReactNode } from "react";
import NavBar from "./NavBar";

interface Props {
  children: ReactNode;
}

const Container: FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-700 max-w-5xl mx-auto flex flex-col">
      <NavBar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Container;