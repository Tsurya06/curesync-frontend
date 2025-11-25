import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// At this point, we don't have any client state slices
// Redux is kept for future complex UI state (forms, wizards, etc.)
// Server state is managed by TanStack Query

export const store = configureStore({
  reducer: {
    // Add client-only state slices here as needed
    // Example: uiState: uiReducer,
    // Example: formDrafts: formDraftsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;