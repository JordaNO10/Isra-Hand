// Build full image URL
exports.buildImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// Handle error response
exports.handleError = (res, message = "Database error") => {
  return res.status(500).json({ error: message });
};

// Build dynamic SQL update query
exports.buildUpdateQuery = (fields) => {
  const updates = [];
  const values = [];

  for (const key in fields) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  return { updates, values };
};
