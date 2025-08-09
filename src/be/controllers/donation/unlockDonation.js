const db = require("../../utils/db");

const unlockDonation = async (req, res) => {
  const { id } = req.params;

  // Session (preferred)
  const s = req.session || {};
  const sessionUser = s.user || {};
  let userId = s.userId || sessionUser.user_id || null;
  let roleId = s.role_id || sessionUser.role_id || null;

  // Fallback: cookies
  const cookies = req.cookies || {};
  if (!userId) userId = cookies.userId || cookies.userid || null;
  if (!roleId) roleId = cookies.userRole || cookies.role_id || null;

  const isAdmin = Number(roleId) === 1;

  try {
    if (!userId && !isAdmin) {
      return res.status(401).json({ error: "Login required" });
    }

    // Admin can unlock any; users can only unlock their own lock
    await db
      .promise()
      .query(
        `
        UPDATE donations
        SET locked_by = NULL, locked_until = NULL
        WHERE donation_id = ?
          AND (locked_by = ? OR ? = 1)
        `,
        [id, userId || 0, isAdmin ? 1 : 0]
      );

    // Idempotent: always 204
    return res.status(204).end();
  } catch (err) {
    console.error("Error unlocking donation:", err);
    return res.status(500).json({ error: "Failed to unlock donation" });
  }
};

module.exports = unlockDonation;
