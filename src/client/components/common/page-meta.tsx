import { createHead, UnheadProvider } from "@unhead/react/client";
import { Head } from "@unhead/react";

const head = createHead();

const PageMeta = ({
  title,
  description = "Launcher of gns3 sessions streamlining classroom based learning",
}: {
  title: string;
  description?: string;
}) => (
  <Head>
    <title>
      {title} • {import.meta.env.VITE_APP_TITLE}
    </title>
    <meta name="description" content={description} />
  </Head>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <UnheadProvider head={head}>{children}</UnheadProvider>
);

export default PageMeta;
