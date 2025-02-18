const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  
  const blogData = request.body

  if(!blogData.title){
    response.status(400).json({error: 'blogs need a title'})
    return
  }
  if(!blogData.author){
    response.status(400).json({error: 'blogs need an author'})
    return
  }

  if(!blogData.likes){
    blogData.likes = 0
  }
  const blog = new Blog(request.body)
  const result = await blog.save()  
  response.status(201).json(result)

})

blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = request.params.id
  const result = await Blog.findByIdAndDelete(blogToDelete)
  response.status(200).json(result)
})

module.exports = blogRouter