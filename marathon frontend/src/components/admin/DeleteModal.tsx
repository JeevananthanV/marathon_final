import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { User, Trash2, AlertTriangle, X as XIcon, Check } from "lucide-react";
import type { Participant } from "./types";
import { PremiumBadge, InsightCard, TrendBadge, PremiumAvatar, PremiumSkeleton, StatTrend, PremiumProgressRing, PremiumCard, SectionHeader, PageHeader } from "./PremiumUI";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeleteModalProps {
  participantId: string | null;
  participants: Participant[];
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteModal({ participantId, participants, onClose, onConfirm }: DeleteModalProps) {
  const participant = participants.find((p) => p._id === participantId);

  return (
    <AlertDialog open={!!participantId} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="glass-strong max-w-md rounded-2xl overflow-hidden">
        <AlertDialogHeader className="p-6 border-b border-border/40 dark:border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-bold text-foreground">Delete Registration</AlertDialogTitle>
              <p className="text-sm text-muted-foreground dark:text-white/50 mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          {participant && (
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 dark:bg-white/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <PremiumAvatar name={participant.fullName} size="lg" colorIndex={String(participant._id).charCodeAt(0)} />
                <div>
                  <p className="font-semibold text-foreground">{participant.fullName}</p>
                  <p className="text-sm text-muted-foreground dark:text-white/50">
                    {participant.raceId.toUpperCase()} • {participant.cityId} • {participant.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          )}
          <AlertDialogDescription className="mt-4 text-sm text-muted-foreground dark:text-white/60">
            Are you sure you want to permanently delete <strong className="text-foreground dark:text-white">{participant?.fullName}</strong>&apos;s registration?
            All data will be lost and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="p-4 gap-3">
          <AlertDialogCancel
            onClick={onClose}
            className={cn(
              "flex-1 rounded-xl py-3 font-semibold transition-all",
              "bg-muted/40 border border-border/60 text-foreground hover:bg-muted/60 dark:bg-white/5 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10"
            )}
          >
            <XIcon className="h-4 w-4 mr-2 inline" /> Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => participantId && onConfirm(participantId)}
            className={cn(
              "flex-1 rounded-xl py-3 font-semibold transition-all",
              "bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/25"
            )}
          >
            <Trash2 className="h-4 w-4 mr-2 inline" /> Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}