import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardTab } from "@/components/admin/DashboardTab";
import { ParticipantsTab } from "@/components/admin/ParticipantsTab";
import { TShirtTab } from "@/components/admin/TShirtTab";
import { ReportsTab } from "@/components/admin/ReportsTab";
import { ContactsTab } from "@/components/admin/ContactsTab";
import { ResultsTab } from "@/components/admin/ResultsTab";
import { EditModal } from "@/components/admin/EditModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import type { Participant } from "@/components/admin/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel · Run Beyond Limits 2026" }] }),
  component: AdminPage,
});

function AdminPage() {
  const {
    token,
    tab,
    setTab,
    participants,
    contacts,
    tshirtData,
    cityFilter,
    setCityFilter,
    raceFilter,
    setRaceFilter,
    paymentFilter,
    setPaymentFilter,
    searchQuery,
    setSearchQuery,
    filteredParticipants,
    stats,
    categoryData,
    dailyData,
    cityData,
    reportData,
    revenueByCity,
    revenueByRace,
    handleLogin,
    handleLogout,
    togglePaymentStatus,
    deleteParticipant,
    sendCertificateEmail,
    updateParticipant,
  } = useAdmin();

  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <AdminLayout
      tab={tab}
      setTab={setTab}
      onLogout={handleLogout}
      participantCount={participants.length}
    >
      {tab === "dashboard" && (
        <DashboardTab
          stats={stats}
          categoryData={categoryData}
          dailyData={dailyData}
          cityData={cityData}
          participants={participants}
          revenueByRace={revenueByRace}
        />
      )}

      {tab === "players" && (
        <ParticipantsTab
          participants={participants}
          filteredParticipants={filteredParticipants}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          raceFilter={raceFilter}
          setRaceFilter={setRaceFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onEdit={setEditingParticipant}
          onDelete={setDeletingId}
          onTogglePayment={togglePaymentStatus}
          onSendCertificate={sendCertificateEmail}
        />
      )}

      {tab === "tshirt" && <TShirtTab tshirtData={tshirtData} />}

      {tab === "reports" && (
        <ReportsTab
          reportData={reportData}
          revenueByCity={revenueByCity}
          revenueByRace={revenueByRace}
          participants={participants}
        />
      )}

      {tab === "contacts" && <ContactsTab contacts={contacts} />}

      {tab === "results" && (
        <ResultsTab
          participants={participants}
          onUpdateParticipant={updateParticipant}
          onSendCertificate={sendCertificateEmail}
        />
      )}

      <EditModal
        participant={editingParticipant}
        onClose={() => setEditingParticipant(null)}
        onSave={updateParticipant}
      />

      <DeleteModal
        participantId={deletingId}
        participants={participants}
        onClose={() => setDeletingId(null)}
        onConfirm={(id) => {
          deleteParticipant(id);
          setDeletingId(null);
        }}
      />
    </AdminLayout>
  );
}