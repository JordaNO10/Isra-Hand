/**
 * טופס הוספת תרומה:
 * מרכיב שדות הטופס מתתי־קומפוננטות קצרות.
 */
import TextInput from "./components/TextInput";
import EmailChoice from "./components/EmailChoice";
import CategorySelect from "./components/CategorySelect";
import SubCategorySelect from "./components/SubCategorySelect";
import ImageField from "./components/ImageField";

function DonationAddForm({
  formData, onChange, onImageUpload, onSubmit,
  categories, userEmail, useUserEmail, setUseUserEmail
}) {
  return (
    <form className="donationadd-form" onSubmit={onSubmit}>
      <h2>העלאת תרומה</h2>

      <TextInput label="שם התרומה:" name="donation_name"
                 value={formData.donation_name} onChange={onChange} />

      <TextInput label="תיאור התרומה:" name="description"
                 value={formData.description} onChange={onChange} />

      <EmailChoice
        currentEmail={userEmail}
        useUserEmail={useUserEmail}
        setUseUserEmail={setUseUserEmail}
      />

      {!useUserEmail && (
        <TextInput label="אימייל:" type="email" name="email"
                   value={formData.email} onChange={onChange} />
      )}

      <TextInput label="מספר טלפון:" name="Phonenumber"
                 value={formData.Phonenumber} onChange={onChange} readOnly />

      <CategorySelect categories={categories}
                      value={formData.category_name} onChange={onChange} />

      <SubCategorySelect categories={categories}
                         categoryName={formData.category_name}
                         value={formData.sub_category_name}
                         onChange={onChange} />

      <ImageField onImageUpload={onImageUpload} />

      <button type="submit" className="donationadd-submit">העלאה</button>
    </form>
  );
}
export default DonationAddForm;
