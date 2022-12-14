const { UserAccount } = require('../models')
const middleware = require('../middleware')

const Login = async (req, res) => {
  try {
    const user = await UserAccount.findOne({ email: req.body.email })
    if (
      user &&
      (await middleware.comparePassword(user.passwordDigest, req.body.password))
    ) {
      let payload = {
        id: user.id,
        email: user.email
      }
      let token = middleware.createToken(payload)
      return res.send({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized TEST' })
  } catch (error) {
    throw error
  }
}

const Register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body
    let passwordDigest = await middleware.hashPassword(password)
    const user = await UserAccount.create({
      email,
      passwordDigest,
      firstname,
      lastname,
      username
    })
    res.send(user)
  } catch (error) {
    throw error
  }
}

const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await UserAccount.findByPk(req.params.user_id)
    if (
      user &&
      (await middleware.comparePassword(
        user.dataValues.passwordDigest,
        oldPassword
      ))
    ) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      await user.update({ passwordDigest })
      return res.send({ status: 'Ok', payload: user })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {}
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.send(payload)
}

module.exports = {
  Login,
  Register,
  UpdatePassword,
  CheckSession
}
