import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useId } from 'react';

const FormField = ({ id, label, type = 'text', error, description, required, children, ...props }) => {
  const fallbackId = useId();
  const fieldId = id || fallbackId;
  const descriptionId = description ? `${fieldId}-desc` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-semibold text-primary-strong">
          {label}
          {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
        </label>
      )}
      {description && (
        <p id={descriptionId} className="text-sm text-muted">
          {description}
        </p>
      )}
      {children || (
        <input
          id={fieldId}
          type={type}
          required={required}
          aria-describedby={clsx(descriptionId, errorId)}
          aria-invalid={Boolean(error)}
          className={clsx(
            'w-full rounded-md border bg-surface px-4 py-3 text-base shadow-xs transition focus-visible:focus-outline',
            error ? 'border-danger' : 'border-transparent'
          )}
          style={{ borderColor: error ? undefined : 'var(--color-border)' }}
          {...props}
        />
      )}
      <div aria-live="polite" className="min-h-[1.25rem] text-sm text-danger" id={errorId}>
        {error}
      </div>
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node
};

export default FormField;
