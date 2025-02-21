const jwt = require('jsonwebtoken')
const User = require('../models/users')

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token
  next()
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) {    
    return authorization.replace('Bearer ', '')  
  }  
  return null
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)  
  if (!decodedToken.id) {    
    request.user = null
  }
  else{
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
} 