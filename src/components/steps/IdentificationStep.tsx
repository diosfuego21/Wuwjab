import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';

interface IdentificationStepProps {
  dni: string;
  onDniChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const IdentificationStep: React.FC<IdentificationStepProps> = ({
  dni,
  onDniChange,
  onNext,
  onBack
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const validateDni = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    onDniChange(numericValue);
    
    if (numericValue.length === 0) {
      setError('Por favor ingrese su DNI');
    } else if (numericValue.length < 7 || numericValue.length > 8) {
      setError('El DNI debe tener entre 7 y 8 dígitos');
    } else {
      setError(null);
    }
  };
  
  const handleNext = () => {
    validateDni(dni);
    if (dni.length >= 7 && dni.length <= 8) {
      onNext();
    }
  };

  return (
    <div className="animate-fade-in py-2">
      <h2 className="text-lg font-light text-center tracking-wide text-gray-800 mb-8">
        Documento de identidad
      </h2>
      
      <div className="mb-12">
        <div className="flex items-center mb-2">
          <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
          <label className="text-xs font-light text-gray-700">Número de DNI</label>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            value={dni}
            onChange={(e) => validateDni(e.target.value)}
            placeholder="Ingrese su DNI (sin puntos)"
            inputMode="numeric"
            className="w-full px-0 py-2 bg-transparent border-b border-gray-300 focus:border-blue-600 text-gray-800 text-sm placeholder-gray-400 focus:outline-none transition-colors"
          />
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50/50 p-4 rounded-lg">
          <p>
            Este dato es necesario para verificar su identidad y analizar su historial crediticio.
            Toda su información personal está protegida de acuerdo a la ley de protección de datos.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={onBack}
          className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-light tracking-wide rounded-lg transition-colors flex items-center justify-center group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>
        
        <button 
          onClick={handleNext}
          className="w-2/3 py-3.5 bg-black/80 hover:bg-black text-white text-sm font-light tracking-wide rounded-lg shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-center group"
        >
          Continuar
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};