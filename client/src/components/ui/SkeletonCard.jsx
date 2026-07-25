const SkeletonCard = () => {
  return (
    <div className="bg-surface p-4 rounded-md animate-pulse">
      <div className="w-full aspect-square bg-surfaceHover rounded-md mb-3" />
      <div className="h-4 bg-surfaceHover rounded w-3/4 mb-2" />
      <div className="h-3 bg-surfaceHover rounded w-1/2" />
    </div>
  );
};

export default SkeletonCard;