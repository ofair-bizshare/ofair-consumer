
// This file is now just re-exporting from the refactored modules
// To maintain backward compatibility with existing imports

export * from './professionals/index';
export * from '@/types/professionals';
export { getProfessionalFromData } from '@/utils/professionalTransformations';
