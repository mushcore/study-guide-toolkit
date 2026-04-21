import {ReactNode} from "react";

type HomePageProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const HomePage = ({ title = "Title", subtitle = "Subtitle", children }: HomePageProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <h3>{subtitle}</h3>
      <p>{children}</p>
    </div>
  );
};

export default HomePage;
