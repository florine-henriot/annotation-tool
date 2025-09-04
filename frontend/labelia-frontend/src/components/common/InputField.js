import "./InputField.css"

export default function InputField(
    {
        type,
        value,
        onChange,
        placeholder,
        required
    }
) {
    return (
            <input 
            className="input-field"
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            />
    );
}