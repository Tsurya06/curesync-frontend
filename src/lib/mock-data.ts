import {
	Medication,
	Frequency,
} from '@/common/types/medication.types';
import {
	Caregiver,
	CaregiverInvite,
	InviteStatus,
	CaregiverPermission,
} from '@/common/types/caregiver.types';
import { DoseLog } from '@/common/types/dose.types';

// --- MEDICATIONS ---

export const MEDICATION_NAMES = [
	'Lisinopril', 'Metformin', 'Amoxicillin', 'Vitamin D', 'Omega 3',
	'Magnesium', 'Zinc', 'Probiotic', 'Iron', 'Calcium',
	'Vitamin C', 'Melatonin', 'Ashwagandha', 'Theanine', 'CBD Oil',
	'Ibuprofen', 'Acetaminophen', 'Atorvastatin', 'Levothyroxine', 'Amlodipine'
];

export const DOSAGES = ['10mg', '20mg', '50mg', '100mg', '200mg', '500mg', '1000IU', '5000IU', '1 capsule', '2 tablets'];

export const FREQUENCIES = Object.values(Frequency);

export const NOTES = [
	'Take with food', 'Take on empty stomach', 'Before bed', 'With breakfast',
	'Do not crush', 'Shake well', 'Store in fridge', 'May cause drowsiness'
];

// Generate dynamic mock data
export const generateMockMedications = (count: number): Medication[] => {
	return Array.from({ length: count }, (_, i) => {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30)); // Started within last 30 days

		const frequency = FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)];

		// Generate random times based on frequency
		let timesOfDay: string[] = [];
		if (frequency === Frequency.ONCE_DAILY) timesOfDay = ['09:00'];
		else if (frequency === Frequency.TWICE_DAILY) timesOfDay = ['09:00', '21:00'];
		else if (frequency === Frequency.EVERY_8_HOURS) timesOfDay = ['08:00', '16:00', '00:00'];
		else timesOfDay = ['12:00']; // Default

		return {
			id: i + 1,
			userId: 1,
			name: MEDICATION_NAMES[Math.floor(Math.random() * MEDICATION_NAMES.length)],
			dosage: DOSAGES[Math.floor(Math.random() * DOSAGES.length)],
			frequency: frequency,
			startDate: startDate.toISOString().split('T')[0],
			timesOfDay: timesOfDay,
			notes: Math.random() > 0.5 ? NOTES[Math.floor(Math.random() * NOTES.length)] : undefined,
			status: 'ACTIVE',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	});
};

export const MOCK_MEDICATIONS: Medication[] = generateMockMedications(50);

// --- CAREGIVERS ---

export const MOCK_CAREGIVERS: Caregiver[] = [
	{
		id: 2,
		email: 'caregiver@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		role: 'CAREGIVER',
		permissions: [
			CaregiverPermission.VIEW_MEDICATIONS,
			CaregiverPermission.LOG_DOSES,
			CaregiverPermission.VIEW_HISTORY
		],
		createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
	},
];

export const MOCK_INVITES: CaregiverInvite[] = [
	{
		id: 1,
		patient: {
			id: 1,
			email: 'user@example.com',
			firstName: 'John',
			lastName: 'Doe',
			role: 'PATIENT',
		},
		caregiver: {
			id: 2,
			email: 'caregiver@example.com',
			firstName: 'Jane',
			lastName: 'Smith',
			role: 'CAREGIVER',
		},
		permissions: [],
		status: InviteStatus.PENDING,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

// --- DOSES ---

export const MOCK_DOSES: DoseLog[] = [];

// --- AUTH ---

import { User, UserRole } from '@/common/types/auth.types';

export const MOCK_USERS: User[] = [
	{
		id: 1,
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		role: UserRole.PATIENT,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 2,
		email: 'caregiver@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		role: UserRole.CAREGIVER,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}
];
