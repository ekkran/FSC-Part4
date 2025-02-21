const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(!username || username.length < 3){
    response.status(400).json({error: "username is invalid"})
    return
  }
  if(!password || password.length < 3){
    response.status(400).json({error: "password is invalid"})
    return
  }

  const repeatedUser = await User.findOne({username:username})

  if(repeatedUser){
    response.status(400).json({error: "username already exist"})
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', {title:1, likes:1, user:1})
  response.json(users)
})

module.exports = usersRouter