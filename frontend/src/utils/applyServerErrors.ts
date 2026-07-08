import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { NormalizedApiError } from '@/types/api';

export function applyServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: NormalizedApiError
) {
  if (error.errors && error.errors.length > 0) {
    for (const fieldError of error.errors) {
      if (fieldError.field) {
        setError(fieldError.field as Path<T>, { type: 'server', message: fieldError.message });
      } else {
        setError('root' as Path<T>, { type: 'server', message: fieldError.message });
      }
    }
    return;
  }

  setError('root' as Path<T>, { type: 'server', message: error.message });
}
