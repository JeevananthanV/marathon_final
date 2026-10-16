import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, X as XIcon } from "lucide-react";
import type { Participant } from "./types";
import { PremiumBadge, InsightCard, TrendBadge, PremiumAvatar, PremiumSkeleton, StatTrend, PremiumProgressRing, PremiumCard, SectionHeader, PageHeader } from "./PremiumUI";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EditModalProps {
  participant: Participant | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<Participant>) => Promise<void>;
}

export function EditModal({ participant, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState(() => (participant ? { ...participant } : ({} as Participant)));
  const [isSaving, setIsSaving] = useState(false);

  if (!participant) return null;

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(form._id, form);
      onClose();
    } catch {
    } finally {
      setIsSaving(false);
    }
  }

  const fields = [
    { label: "Full Name", key: "fullName", icon: User },
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Email", key: "email", type: "email" },
    { label: "DOB", key: "dob", type: "date" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Address", key: "address" },
    { label: "Pincode", key: "pincode" },
    { label: "Emergency Contact", key: "emergencyContact" },
  ];

  return (
    <Dialog open={!!participant} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-strong sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="p-6 border-b border-border/40 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">Edit Participant</DialogTitle>
              <p className="text-sm text-muted-foreground dark:text-white/50 mt-0.5">{participant.fullName}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          {fields.map(({ label, key, type, icon: Icon }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="space-y-1.5"
            >
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider dark:text-white/50">{label}</Label>
              <Input
                type={type || "text"}
                value={(form as any)[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="h-10 rounded-xl bg-muted/40 border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:bg-white/10"
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="space-y-1.5"
          >
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider dark:text-white/50">T-Shirt Size</Label>
            <Select value={form.size} onValueChange={(v) => handleChange("size", v)}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-border/60 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-white/5 dark:border-white/10 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-1.5"
          >
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider dark:text-white/50">Race Category</Label>
            <Select value={form.raceId} onValueChange={(v) => handleChange("raceId", v)}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-border/60 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-white/5 dark:border-white/10 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5k">5K Fun Run</SelectItem>
                <SelectItem value="10k">10K Challenge</SelectItem>
                <SelectItem value="21k">Half Marathon (21K)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        <DialogFooter className="px-6 pb-6 pt-2 border-t border-border/40 dark:border-white/10">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-xl shadow-lg shadow-primary/30">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}