export const LoadingOverlay = ({ visible }: { visible: boolean }) => {
  return (
    <>
      {visible && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="flex justify-center" aria-label="読み込み中">
            <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl"></div>
          </div>
        </div>
      )}
    </>
  );
};
