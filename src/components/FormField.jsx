// Label + input + inline validation message, reused by every form
export default function FormField({ id, label, error, children }) {
  return (
    <div className={'field' + (error ? ' has-error' : '')}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}
