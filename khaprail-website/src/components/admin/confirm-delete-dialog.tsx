import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteDialogProps {
  itemLabel: string
  onConfirm: () => Promise<void>
  trigger: React.ReactNode
}

// Native `confirm()` blocks the browser automation used to QA this app, and
// is poor UX besides — a real dialog everywhere a delete needs confirming.
export function ConfirmDeleteDialog({ itemLabel, onConfirm, trigger }: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirm() {
    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemLabel}?</DialogTitle>
          <DialogDescription>This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void handleConfirm()} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
