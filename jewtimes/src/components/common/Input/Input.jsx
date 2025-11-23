import './Input.css';

const Input = ({ 
  label,
  type = 'text',
  error,
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input 
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
