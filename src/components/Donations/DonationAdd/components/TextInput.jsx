/**
 * שדה טקסט כללי לטפסים.
 */
function TextInput({ label, type="text", name, value, onChange, readOnly }) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} />
    </>
  );
}
export default TextInput;
