var fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

const storeProfilePicture = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../", "public", "profile_pictures"));
	},
	filename: (req, file, cb) => {
		const unique_hex = crypto.randomBytes(4).toString("hex");
		let new_name = unique_hex + file.originalname;

		try {
            fs.writeFileSync(path.join(__dirname, "../", "server-side files", "temporary text files", "profile picture temporary data", `${req.session.user}.txt`), new_name);
		} catch (err) {
			console.error(err);
		}

		cb(null, new_name);
	},
});
const setProfilePicture = multer({storage: storeProfilePicture});

module.exports = setProfilePicture;