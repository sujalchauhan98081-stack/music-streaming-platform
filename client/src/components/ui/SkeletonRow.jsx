const SkeletonRow = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 animate-pulse">
      <div className="w-10 h-10 bg-surfaceHover rounded" />
      <div className="flex-1">
        <div className="h-4 bg-surfaceHover rounded w-1/3 mb-2" />
        <div className="h-3 bg-surfaceHover rounded w-1/4" />
      </div>
    </div>
  );
};

export default SkeletonRow;