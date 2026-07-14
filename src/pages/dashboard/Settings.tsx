import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiDeleteAccount } from "@/lib/authClient";

/**
 * Settings. Today this is the account-deletion page.
 *
 * The Privacy Policy promises "ask us to delete your account and we delete the
 * account, its search history and its brand evaluations" -- so it has to be a
 * thing a user can actually do, not an email they send and hope about.
 */
const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    setDeleting(true);
    try {
      await apiDeleteAccount(password);
      setConfirmOpen(false);
      toast({
        title: "Account deleted",
        description: "Your account and all of its data have been permanently removed.",
      });
      // The server has already cleared the cookies; this clears the client state
      // and drops the user back on the marketing site.
      await logout();
    } catch (err) {
      setConfirmOpen(false);
      toast({
        title: "Could not delete account",
        description: err instanceof Error ? err.message : "Please check your password and try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setPassword("");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account{user?.email ? ` — ${user.email}` : ""}.
        </p>
      </div>

      <Card className="max-w-2xl border-destructive/40">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/15">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            This permanently deletes your account and everything attached to it. It cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">What gets deleted</p>
            <ul className="mt-2 space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li className="list-disc">Your account and email address</li>
              <li className="list-disc">Every product lookup in your history</li>
              <li className="list-disc">Every brand evaluation you have run</li>
              <li className="list-disc">All active sessions, on every device</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Deleted means deleted. Nothing is archived and nothing is kept for later.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm your password to continue</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We ask for this so that someone with access to an open session cannot delete your data.
            </p>
          </div>

          <Button
            variant="destructive"
            disabled={!password || deleting}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete my account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account, your entire search history and every brand evaluation will be erased. This
              cannot be undone, and we cannot restore it for you afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep my account</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Yes, delete everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
