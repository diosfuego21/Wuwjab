import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4 text-sm text-gray-600 font-light">Cargando...</p>
    </div>
  );
};