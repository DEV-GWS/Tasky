function SyncStatus({ syncStatus }) {
  const styles = {
    online: "bg-green-100 text-green-700",
    offline: "bg-red-100 text-red-700",
    syncing: "bg-yellow-100 text-yellow-700",
    synced: "bg-blue-100 text-blue-700",
  };

  const labels = {
    online: "🟢 Online",
    offline: "🔴 Offline",
    syncing: "🔄 Syncing",
    synced: "✅ Synced",
  };

  return (
    <div
      className={`
        w-[75px] h-[25px] m-2 px-3 py-1 rounded-full text-xs font-semibold
        ${styles[syncStatus]}
      `}
    >
      {labels[syncStatus]}
    </div>
  );
}

export default SyncStatus;