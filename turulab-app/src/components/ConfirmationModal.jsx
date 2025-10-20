import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title || "Konfirmasi Tindakan"}
        </h3>
        <div className="text-gray-600 mb-6">
          {children || "Apakah Anda yakin ingin melanjutkan tindakan ini?"}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="font-bold px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="font-bold px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
