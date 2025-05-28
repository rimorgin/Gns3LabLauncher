import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description = "Launcher of gns3 sessions streamlining classroom based learning",
}: {
  title: string;
  description?: string;
}) => (
  <Helmet>
    <title>
      {title} • {import.meta.env.VITE_APP_TITLE}
    </title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
