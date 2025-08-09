/**
 * קומפוננטת שמירה על הצגת תוכן.
 * מונעת טעינה של תוכן במצבים של שגיאה, טעינה, נעילה או חוסר נתונים.
 */
const Guard = ({ loading, error, accessDenied, donationData, children }) => {
  if (loading) return <div>Loading donation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (accessDenied) return <div>מצטערים , התרומה נצפת על-ידי משתמש אחר כרגע</div>;
  if (!donationData) return <div>תרומה אינה קיימת במערכת</div>;
  return children;
};

export default Guard;
