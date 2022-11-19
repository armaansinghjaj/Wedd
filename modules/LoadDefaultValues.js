function loadDefaultValues(req) {
	req.session.drivers = [];
	req.session.edit_employee_id = null;
	req.session.edit_name = null;
	req.session.edit_email = null;
	req.session.edit_role_id = null;
	req.session.edit_title = null;
	if (!(req.session.access)) {
		req.session.access = 2; 
		req.session.user = 'driver1@gmail.com';
	}
}

module.exports = loadDefaultValues;