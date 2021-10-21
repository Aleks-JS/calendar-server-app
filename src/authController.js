class AuthController {
	async regisration(req, res) {
		try {

		} catch (e) {
			console.log(e)
		}

	}

	async login(req, res) {
		try {

		} catch (e) {
			console.log(e)
		}

	}

	async getUsers(req, res) {
		try {
			res.json('getUsers response')
		} catch (e) {
			console.log(e)
		}

	}
}

module.exports = new AuthController();
