import { createContext, useContext, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCaregiverPermissions } from '@/features/caregivers/api/caregivers';
import { CaregiverPermission } from '@/common/types/caregiver.types';

interface CaregiverContextType {
	currentPatientId: number | null;
	isCaregiver: boolean;
	permissions: CaregiverPermission[];
	isLoading: boolean;
	switchToPatient: (patientId: number) => void;
	switchToOwnAccount: () => void;
	hasPermission: (permission: CaregiverPermission) => boolean;
}

const CaregiverContext = createContext<CaregiverContextType | undefined>(undefined);

export function CaregiverProvider({ children }: { children: ReactNode }) {
	const [searchParams, setSearchParams] = useSearchParams();

	// URL is the source of truth
	const patientIdParam = searchParams.get('patientId');
	const currentPatientId = patientIdParam ? Number(patientIdParam) : null;
	const isCaregiver = currentPatientId !== null;

	// Fetch permissions based on current patient
	const { data: permissions = [], isLoading } = useCaregiverPermissions(currentPatientId);

	// Helper functions
	const switchToPatient = (patientId: number) => {
		setSearchParams({ patientId: String(patientId) });
	};

	const switchToOwnAccount = () => {
		setSearchParams({});
	};

	const hasPermission = (permission: CaregiverPermission): boolean => {
		return permissions.includes(permission);
	};

	const value: CaregiverContextType = {
		currentPatientId,
		isCaregiver,
		permissions,
		isLoading,
		switchToPatient,
		switchToOwnAccount,
		hasPermission,
	};

	return (
		<CaregiverContext.Provider value={value}>
			{children}
		</CaregiverContext.Provider>
	);
}

export function useCaregiver() {
	const context = useContext(CaregiverContext);
	if (context === undefined) {
		throw new Error('useCaregiver must be used within a CaregiverProvider');
	}
	return context;
}
