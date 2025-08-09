const db = require("../../utils/db");

const getDonationSecure = async (req, res) => {
  const { id } = req.params;

  // Session (preferred)
  const s = req.session || {};
  const sessionUser = s.user || {};
  let userId = s.userId || sessionUser.user_id || null;
  let roleId = s.role_id || sessionUser.role_id || null;

  // Fallback: cookies (requires cookie-parser middleware on the server)
  // app.use(require("cookie-parser")());
  const cookies = req.cookies || {};
  if (!userId) userId = cookies.userId || cookies.userid || null;
  if (!roleId) roleId = cookies.userRole || cookies.role_id || null;

  const isAdmin = Number(roleId) === 1;

  try {
    // must be logged in (any role) OR admin bypass
    if (!userId && !isAdmin) {
      return res.status(401).json({ error: "Login required" });
    }

    // Try to acquire/refresh a 5-minute lock for this user (admins bypass)
    if (!isAdmin) {
      const [upd] = await db
        .promise()
        .query(
          `UPDATE donations
           SET locked_by = ?, locked_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
           WHERE donation_id = ?
             AND (locked_until IS NULL OR locked_until < NOW() OR locked_by = ?)`,
          [userId, id, userId]
        );

      if (upd.affectedRows === 0) {
        const [[row]] = await db
          .promise()
          .query(`SELECT locked_until FROM donations WHERE donation_id = ?`, [id]);
        return res.status(423).json({
          error: "Locked by another user",
          locked_until: row?.locked_until || null,
        });
      }
    }

    // Return full details (same shape as public GET)
    const [results] = await db
      .promise()
      .query(
        `
        SELECT 
          donations.*, 
          ratings.user_id AS rating_user_id,
          donations.requestor_id,
          users.full_name AS donor_name,
          users.phone_number AS phone,
          users.address AS address
        FROM donations
        LEFT JOIN ratings ON ratings.donation_id = donations.donation_id
        LEFT JOIN users ON users.user_id = donations.user_id
        WHERE donations.donation_id = ?
        LIMIT 1;
        `,
        [id]
      );

    if (!results.length) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const donation = results[0];
    if (donation.donation_date) {
      donation.donation_date = new Date(donation.donation_date).toISOString().split("T")[0];
    }

    return res.status(200).json(donation);
  } catch (err) {
    console.error("Error fetching secure donation:", err);
    return res.status(500).json({ error: "Failed to fetch donation (secure)" });
  }
};

module.exports = getDonationSecure;
