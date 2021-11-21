const User = require('../models/User')
const Role = require('../models/Role')
const Token = require('./../models/Token')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const config = require('../config/app')
const authHelper = require('./../helpers/authHelper')
const {secret} = require("../config/app");

/** Генерация токена */
const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, config.jwt.secret, config.jwt.tokens.access.expiresIn)
}

const updateTokens = async (userId, roles) => {
	const accessToken = authHelper.generateAccessToken(userId, roles)
	const refreshToken = authHelper.generateRefreshToken(userId, roles)
	const updates = await authHelper.replaceDbRefreshToken(refreshToken.id, userId)
	return {
		accessToken,
		refreshToken: refreshToken.token
	}
}

class AuthController {
	/** Регистрация */
	async registration(req, res) {
		try {
			/** Передаем в валидатор реквест */
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({message: 'Registration error', errors})
			}
			/** Реквест */
			const {username, password, email} = req.body
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
			const user = new User({
				username,
				email,
				password: hashPassword,
				profile: {birthday: null, location: null},
				roles: [userRole.value]
			})
			/** Сохранение юзера в БД */
			await user.save()
			return res.status(200).json({message: 'User registered successfully!'})
		} catch (e) {
			console.log('ERROR => ', e.errors, ' END')
			const errorMessages = e.errors
			res.status(400).json({message: 'Registration error'})
		}

	}

	/** Авторизация */
	async login(req, res) {
		try {
			const {username, password} = req.body
			/** Проверяем наличие пользователя в БД */
			const user = await User.findOne({username})
			if (!user) {
				return res.status(401).json({message: `User ${username} not found!`})
			}
			/** Проверяем пароль пользователя */
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(401).json({message: `Wrong password entered!`})
			}
			/** Создание токена */
				// const token = await generateAccessToken(user._id, user.roles)
			const tokens = await updateTokens(user._id, user.roles)
			/** Передача токена клиенту */
			return res.json({tokens})
		} catch (e) {
			console.log(e)
			res.status(500).json({message: e.message})
		}

	}

	/** Получение списка пользователей */
	async getUsers(req, res) {
		try {
			const users = await User.find()
			res.json(users)
		} catch (e) {

			console.log(e)
		}
	}

	/** Обновление refreshToken */
	async refreshTokens (req, res) {
		const {refreshToken} = req.body
		let payload
		try {
			payload = jwt.verify(refreshToken, secret)
			if (payload.type !== 'refresh') {
				return res.status(400).json({message: 'Invalid token!'})
			}
			const token = await Token.findOne({tokenId: payload.id})
			if (!token) {
				return res.status(400).json({message: 'Invalid token!'})
			}
			const tokens = await updateTokens(token.userId)
			return res.status(200).json({tokens})
		} catch (e) {
			if (e instanceof jwt.TokenExpiredError) {
				console.log(e)
				return res.status(400).json({message: 'Token expired!'})
			} else if (e instanceof jwt.JsonWebTokenError) {
				console.log(e)
				return res.status(400).json({message: 'Invalid token!'})
			} else {
				console.log(e)
				return res.status(500).json({message: e.message})
			}
		}
	}
}

module.exports = new AuthController();
