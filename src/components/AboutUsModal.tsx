import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutUsModal({ open, onOpenChange }: AboutUsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[65vh] overflow-hidden p-0">
        <div className="max-h-[65vh] overflow-y-auto p-5 pr-10">
          <DialogHeader>
            <DialogTitle>About Us</DialogTitle>
            <DialogDescription>
              Project members, repositories, and contact details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6 text-sm text-muted-foreground">
            <section className="space-y-2 rounded-2xl border border-border bg-background p-4">
              <h3 className="text-base font-semibold text-foreground">GitHub Manager</h3>
              <p>Mark Vincent Battulayan</p>
            </section>

            <section className="space-y-3 rounded-2xl border border-border bg-background p-4">
              <h3 className="text-base font-semibold text-foreground">Repositories</h3>
              <div className="space-y-2">
                <a
                  href="https://github.com/RaidenSh0wgun/Fullstack-Frontend.git"
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-primary hover:underline"
                >
                  front - https://github.com/RaidenSh0wgun/Fullstack-Frontend.git
                </a>
                <a
                  href="https://github.com/RaidenSh0wgun/Fullstack-Backend.git"
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-primary hover:underline"
                >
                  back - https://github.com/RaidenSh0wgun/Fullstack-Backend.git
                </a>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">Frontend Members</h3>
                <p>Hillary Mae Oñate - Leader</p>
                <p>Alyssa Jyrah Cardell</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">Backend Members</h3>
                <p>Mark Vincent Battulayan</p>
                <p>Ashleigh Donsal</p>
                <p>Wesley Niduaza</p>
                <p>Jerome Andre</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">Documentation</h3>
                <p>Meralie Decena Salig</p>
                <p>Lourence Garrido</p>
                <p>Samantha Shaine Gimena - Backend Owner</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">QA</h3>
                <p>Alyssa Jyrah Cardell</p>
                <p>Hillary Mae Oñate</p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">Contact</h3>
                <p>whalmms@gmail.com</p>
                <p>whalmmsstorage@gmail.com</p>
                <p>09301380640</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">School</h3>
                <p>MFI Institute Polytechnic Inc.</p>
                <p>Pasig, Philippines</p>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
