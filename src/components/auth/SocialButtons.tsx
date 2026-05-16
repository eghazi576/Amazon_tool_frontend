import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.8 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-5.1c-2 1.4-4.4 2.2-7 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6 5.1c-.4.4 6.7-4.9 6.7-14.5 0-1.2-.1-2.3-.4-3.5z" />
  </svg>
);

const SocialButtons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClick = (provider: string) => {
    localStorage.setItem("demo_authed", "1");
    toast({
      title: `${provider} sign-in (demo)`,
      description: "Redirecting to your dashboard…",
    });
    navigate("/dashboard");
  };

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="glass"
        className="w-full"
        onClick={() => handleClick("Google")}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
    </div>
  );
};

export default SocialButtons;
