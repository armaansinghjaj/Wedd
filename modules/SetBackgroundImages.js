const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../", "public", "image"));
	},
	filename: (req, file, cb) => {
		let suffix = path.extname(file.originalname);

		let new_name = "";
		if (req.query.page === "home") new_name = "homepage" + suffix;
		else if (req.query.page === "about") new_name = "aboutpage" + suffix;
		else if (req.query.page === "contact") new_name = "contactpage" + suffix;
		else if (req.query.page === "news") new_name = "newspage" + suffix;

		cb(null, new_name);
	},
});
const SetBackgroundImages = multer({storage: storage});

module.exports = SetBackgroundImages;