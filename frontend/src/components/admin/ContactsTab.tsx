import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import type { ContactMessage } from "./types";
import { PremiumAvatar, PremiumBadge, InsightCard, TrendBadge, PremiumSkeleton, StatTrend, PremiumProgressRing, PremiumCard, SectionHeader, PageHeader } from "./PremiumUI";
import { motion } from "framer-motion";

interface ContactsTabProps {
  contacts: ContactMessage[];
}

export function ContactsTab({ contacts }: ContactsTabProps) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center text-center gap-3">
        <div>
          <p className="text-sm text-muted-foreground text-center">
            {contacts.length} total messages
            {" • "} {contacts.filter(c => new Date(c.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <InsightCard
          title="Total Messages"
          value={contacts.length}
          icon={<MessageSquare className="h-5 w-5" />}
          variant="highlight"
        />
        <InsightCard
          title="This Week"
          value={contacts.filter(c => new Date(c.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          icon={<Calendar className="h-5 w-5" />}
          variant="default"
        />
        <InsightCard
          title="With Phone"
          value={contacts.filter(c => c.phone && c.phone.trim() !== "").length}
          icon={<Phone className="h-5 w-5" />}
          variant="bordered"
        />
        <InsightCard
          title="With Email"
          value={contacts.filter(c => c.email && c.email.trim() !== "").length}
          icon={<Mail className="h-5 w-5" />}
          variant="default"
        />
      </div>

      <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        {/* Desktop Table View */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-border/40">
              <TableHead className="font-bold text-xs uppercase tracking-wider">Sender</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Contact</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Message</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((c, index) => (
              <motion.tr
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="hover:bg-muted/40 transition-colors border-b-border/20"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PremiumAvatar name={c.name} size="md" colorIndex={index} />
                    <span className="font-semibold text-foreground text-sm">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="truncate max-w-[180px]">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/75 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>{c.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground text-sm max-w-xs">
                  <p className="truncate">{c.message}</p>
                </TableCell>
                <TableCell className="text-right text-xs whitespace-nowrap text-muted-foreground">
                  {new Date(c.date).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              </motion.tr>
            ))}
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-muted grid place-items-center">
                      <MessageSquare className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">No messages yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Messages from the contact form will appear here</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-border/20 dark:divide-white/5">
          {contacts.map((c, index) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PremiumAvatar name={c.name} size="md" colorIndex={index} />
                  <div>
                    <h4 className="font-bold text-foreground text-sm leading-snug">{c.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(c.date).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-1.5 bg-muted/30 dark:bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-foreground bg-muted/10 dark:bg-white/5 rounded-xl p-3 border border-border/10">
                <p className="leading-relaxed whitespace-pre-wrap">{c.message}</p>
              </div>
            </motion.div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-2xl bg-muted grid place-items-center mx-auto">
                  <MessageSquare className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Messages will appear here once received</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}