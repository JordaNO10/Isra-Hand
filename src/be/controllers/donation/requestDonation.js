const db = require("../../utils/db");
const sendMail = require("../../utils/mailer");
const {
  requestConfirmation,
  notifyDonor,
} = require("../../templates/emailTemplates");

const requestDonation = async (req, res) => {
  const donationId = req.params.id;
  const { requestor_id } = req.body;

  try {
    // ✅ Try to update the donation to assign the requestor
    const [updateResult] = await db
      .promise()
      .query(
        `UPDATE donations SET requestor_id = ? WHERE donation_id = ? AND requestor_id IS NULL`,
        [requestor_id, donationId]
      );

    if (updateResult.affectedRows === 0) {
      return res.status(409).json({ error: "Donation already requested." });
    }

    // ✅ Fetch requestor info
    const [[requestor]] = await db
      .promise()
      .query("SELECT email, full_name FROM users WHERE user_id = ?", [
        requestor_id,
      ]);

    // ✅ Fetch donation info including donor_id
    const [[donation]] = await db
      .promise()
      .query(
        "SELECT donation_name, user_id FROM donations WHERE donation_id = ?",
        [donationId]
      );

    if (!requestor || !donation) {
      return res
        .status(404)
        .json({ error: "Missing requestor or donation info" });
    }

    // ✅ Send email to requestor
    const confirmationMsg = requestConfirmation(
      requestor.full_name,
      donation.donation_name
    );
    await sendMail({
      to: requestor.email,
      subject: "בקשת תרומה התקבלה - Isra-Hand",
      html: confirmationMsg,
    });
    console.log("📧 Requestor email sent to:", requestor.email);

    // ✅ Fetch donor info
    const [[donor]] = await db
      .promise()
      .query("SELECT email, full_name FROM users WHERE user_id = ?", [
        donation.user_id,
      ]);

    if (donor) {
      // ✅ Send email to donor
      const donorMsg = notifyDonor(
        donor.full_name,
        donation.donation_name,
        requestor.full_name,
        donationId
      );
      await sendMail({
        to: donor.email,
        subject: "התרומה שלך התבקשה - Isra-Hand",
        html: donorMsg,
      });
      console.log("📧 Donor email sent to:", donor.email);
    } else {
      console.warn("⚠️ Donor not found for donation:", donationId);
    }

    res.json({ message: "Donation requested and notifications sent" });
  } catch (err) {
    console.error("❌ Error processing donation request:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = requestDonation;
