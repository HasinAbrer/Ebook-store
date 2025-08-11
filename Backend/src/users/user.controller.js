const User = require('./user.model');

const getUserById = async (req, res) => {
console.log("🚀 ~ getUserById ~ req:", req.params)

  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send({ message: "User not found" });
        }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).send({ message: "Failed to fetch user" });
  }
}

module.exports = {
    getUserById
}