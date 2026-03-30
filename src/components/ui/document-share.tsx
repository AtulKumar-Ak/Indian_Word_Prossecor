import { useState } from "react";
import { UserPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export const DocumentShare = ({ documentId }: { documentId: Id<"documents"> }) => {
  const [email, setEmail] = useState("");
  const addCollaborator = useMutation(api.documents.addCollaborator);
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await addCollaborator({ documentId, email });
      toast.success("Collaborator added!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to add collaborator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-full border-blue-200 hover:bg-blue-50 dark:border-neutral-700">
          <UserPlus className="size-4 text-blue-600" />
          <span className="text-xs font-medium">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">Enter the User ID of the person you want to collaborate with.</p>
          <Input 
              type="email"
              placeholder="Enter colaborater's email..." 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
        </div>
        <DialogFooter>
          <Button onClick={handleInvite} disabled={loading}>
            {loading ? "Inviting..." : "Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
