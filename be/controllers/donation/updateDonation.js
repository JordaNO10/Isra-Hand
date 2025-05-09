const db = require("../../utils/db");
const { buildImageUrl, buildUpdateQuery } = require("../../utils/helpers");

const updateDonation = async (req, res) => {
  const { id } = req.params;

  // Check if the donation exists first
  const [checkResults] = await db
    .promise()
    .query("SELECT * FROM donations WHERE donation_id = ?", [id]);

  if (checkResults.length === 0) {
    return res.status(404).json({ error: "Donation not found." });
  }

  // Build dynamic update fields
  const fields = {
    donation_name: req.body.donation_name,
    description: req.body.description,
    email: req.body.email,
    donat_photo: req.file ? buildImageUrl(req, req.file.filename) : undefined,
  };

  const { updates, values } = buildUpdateQuery(fields);

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const sql = `UPDATE donations SET ${updates.join(
    ", "
  )} WHERE donation_id = ?`;
  values.push(id);

  try {
    const [results] = await db.promise().query(sql, values);
    res.status(200).json({ message: "Donation updated successfully." });
  } catch (error) {
    console.error("Error updating donation:", error);
    res.status(500).json({ error: "Failed to update donation." });
  }
};

module.exports = updateDonation;
