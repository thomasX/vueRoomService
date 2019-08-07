const Joi = require('joi')
module.exports = {
  register (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-z,A-Z,0-9]{8,32}$')
      )
    }
    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            message: 'please enter a valid e-mail address'
          })
          break
        case 'password':
          res.status(400).send({
            message: `please enter a valid password:
            <br>
            1. it must contain ONLY the following characters: lower case, upper case, numerics
            <br>
            2. it must be at least 8 characters in length and not ngreater than 32 characters in length`
          })
          break
        default:
          res.status(400).send({
            message: `you have entered an invalid registration information ${value}`
          })
          break
      }
    } else {
      next()
    }
  }
}
