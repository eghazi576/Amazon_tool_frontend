import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/*
        nginx serves index.html for unmatched paths, so this route answers with
        HTTP 200 rather than 404 (a "soft 404"). This noindex is the only signal
        we control from the client; the real fix is an edge rule.
        See docs/seo-redirects.md.
      */}
      <Seo
        title="Page Not Found | WholesaleOS"
        description="The page you are looking for does not exist."
        path={location.pathname}
        noindex
      />

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
