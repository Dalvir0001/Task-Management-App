const getProfile = (req, res) => {
    res.status(200).json({
        message: "Welcome to your profile",
        user: req.user,
    });
};

module.exports = {
    getProfile,
};