const User = require('../src/models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./config')

/** Генерация токена */
const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class AuthController {
	async registration(req, res) {
		try {
			/** Передаем в валидатор реквест */
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({message: 'Registration error', errors})
			}
			/** Реквест */
			const {username, password} = req.body
			/** Проверяем наличие пользователя в БД */
			const candidate = await User.findOne({username})
			if (candidate) {
				return res.status(400).json({message: 'User with this login is already registered!'})
			}
			/** Хэширование пароля */
			const hashPassword = await bcrypt.hashSync(password, 7)
			/** Получаем роль юзера из БД */
			const userRole = await Role.findOne({value: 'USER'})
			/** Создаем нового юзера */
			const user = new User({username, password: hashPassword, roles: [userRole.value]})
			/** Сохранение юзера в БД */
			user.save()
			return res.status(200).json({message: 'User registered successfully!'})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Registration error'})
		}

	}

	async login(req, res) {
		try {
			const {username, password} = req.body
			/** Проверяем наличие пользователя в БД */
			const user = await User.findOne({username})
			if (!user) {
				return res.status(400).json({message: `User ${username} not found!`})
			}
			/** Проверяем пароль пользователя */
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({message: `Wrong password entered!`})
			}
			/** Создание токена */
			const token = generateAccessToken(user._id, user.roles)
			/** Передача токена клиенту */
			return res.json({token})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Login error'})
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
