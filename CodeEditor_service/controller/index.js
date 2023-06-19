const dummy = async (req, res) => {
  try {
    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

module.exports = { dummy };
