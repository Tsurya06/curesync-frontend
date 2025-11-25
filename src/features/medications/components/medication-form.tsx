import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	useCreateMedication,
	useUpdateMedication,
	useMedication,
} from '@/features/medications/api';
import { Frequency, CreateMedicationRequest } from '@/common/types/medication.types';

export default function MedicationForm() {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditMode = !!id;
	const medicationId = id ? Number(id) : 0;

	const { data: medication, isLoading: isLoadingMedication } = useMedication(medicationId);
	const { mutate: createMedication, isPending: isCreating } = useCreateMedication();
	const { mutate: updateMedication, isPending: isUpdating } = useUpdateMedication();

	// Form shape with object array for timesOfDay
	type MedicationFormData = Omit<CreateMedicationRequest, 'timesOfDay'> & {
		timesOfDay: { value: string }[];
		customFrequency?: string;
	};

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<MedicationFormData>({
		defaultValues: {
			name: '',
			dosage: '',
			frequency: Frequency.ONCE_DAILY,
			startDate: new Date().toISOString().split('T')[0],
			timesOfDay: [{ value: '09:00' }],
			notes: '',
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'timesOfDay',
	});

	const selectedFrequency = watch('frequency');

	useEffect(() => {
		if (medication) {
			reset({
				name: medication.name,
				dosage: medication.dosage,
				frequency: medication.frequency,
				startDate: medication.startDate.split('T')[0],
				endDate: medication.endDate ? medication.endDate.split('T')[0] : undefined,
				timesOfDay: medication.timesOfDay.map((t) => ({ value: t })),
				notes: medication.notes,
				// If custom frequency logic existed, we'd map it here. 
				// For now, we assume notes might contain it or it's a future field.
			});
		}
	}, [medication, reset]);

	const onSubmit = (data: MedicationFormData) => {
		// Transform form data back to API request shape
		const apiData: CreateMedicationRequest = {
			...data,
			timesOfDay: data.timesOfDay.map((t) => t.value),
			// Append custom frequency to notes if selected
			notes: data.frequency === Frequency.CUSTOM && data.customFrequency
				? `${data.notes ? data.notes + '\n' : ''}${t('medications.customSchedule', { schedule: data.customFrequency })}`
				: data.notes,
		};

		if (isEditMode && id) {
			updateMedication(
				{ id: Number(id), ...apiData },
				{
					onSuccess: () => navigate('/medications'),
				}
			);
		} else {
			createMedication(apiData, {
				onSuccess: () => navigate('/medications'),
			});
		}
	};

	if (isEditMode && isLoadingMedication) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	const isPending = isCreating || isUpdating;

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" onClick={() => navigate('/medications')}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h2 className="text-3xl font-bold tracking-tight">
					{isEditMode ? t('medications.edit') : t('medications.add')}
				</h2>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t('medications.details')}</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">{t('medications.form.name')}</Label>
							<Input
								id="name"
								placeholder={t('medications.form.namePlaceholder')}
								{...register('name', { required: t('medications.validation.nameRequired') })}
							/>
							{errors.name && (
								<p className="text-sm text-destructive">{errors.name.message}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="dosage">{t('medications.form.dosage')}</Label>
								<Input
									id="dosage"
									placeholder={t('medications.form.dosagePlaceholder')}
									{...register('dosage', { required: t('medications.validation.dosageRequired') })}
								/>
								{errors.dosage && (
									<p className="text-sm text-destructive">
										{errors.dosage.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="frequency">{t('medications.form.frequency')}</Label>
								<Controller
									control={control}
									name="frequency"
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder={t('medications.form.frequencyPlaceholder')} />
											</SelectTrigger>
											<SelectContent>
												{Object.values(Frequency).map((freq) => (
													<SelectItem key={freq} value={freq}>
														{t(`medications.frequencies.${freq}`)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>

						{selectedFrequency === Frequency.CUSTOM && (
							<div className="space-y-2">
								<Label htmlFor="customFrequency">{t('medications.form.customFrequency')}</Label>
								<Input
									id="customFrequency"
									placeholder={t('medications.form.customFrequencyPlaceholder')}
									{...register('customFrequency', { required: t('medications.validation.customFreqRequired') })}
								/>
								{errors.customFrequency && (
									<p className="text-sm text-destructive">{errors.customFrequency.message}</p>
								)}
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="startDate">{t('medications.form.startDate')}</Label>
								<Input
									id="startDate"
									type="date"
									{...register('startDate', { required: t('medications.validation.startDateRequired') })}
								/>
								{errors.startDate && (
									<p className="text-sm text-destructive">
										{errors.startDate.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="endDate">{t('medications.form.endDate')}</Label>
								<Input id="endDate" type="date" {...register('endDate')} />
							</div>
						</div>

						<div className="space-y-2">
							<Label>{t('medications.form.timesOfDay')}</Label>
							<div className="flex flex-wrap gap-3">
								{fields.map((field, index) => (
									<div key={field.id} className="flex items-center gap-1 bg-muted p-1 rounded-md">
										<Input
											type="time"
											className="w-32 h-8 border-0 bg-transparent focus-visible:ring-0 p-1"
											{...register(`timesOfDay.${index}.value` as const, {
												required: t('medications.validation.timeRequired'),
											})}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-6 w-6 text-muted-foreground hover:text-destructive"
											onClick={() => remove(index)}
											disabled={fields.length === 1}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => append({ value: '09:00' })}
									className="h-10"
								>
									<Plus className="mr-2 h-4 w-4" /> {t('medications.form.addTime')}
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">{t('medications.form.notes')}</Label>
							<Textarea
								id="notes"
								placeholder={t('medications.form.notesPlaceholder')}
								{...register('notes')}
							/>
						</div>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate('/medications')}
							>
								{t('medications.form.cancel')}
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isEditMode ? t('medications.form.submitUpdate') : t('medications.form.submitAdd')}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
