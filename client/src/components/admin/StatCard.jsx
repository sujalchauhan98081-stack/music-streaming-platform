const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-surface rounded-lg p-5 flex items-center gap-4">
      <div className="bg-primary/20 text-primary p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-textSecondary">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;