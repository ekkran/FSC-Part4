const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  
  const blogData = request.body

  const user = request.user

  if(!user) return response.status(401).json({error: "invalid token"})

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
  
  blogData.user = user.id

  const blog = new Blog(blogData)
  const result = await blog.save()  

  user.blogs = user.blogs.concat(result.id)

  await user.save()

  response.status(201).json(result)

})

blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = request.params.id

  const user = request.user

  const blog = await Blog.findById(blogToDelete)  

  if(!blog) return response.status(404).end()

  if(blog.user.toString() !== user.id.toString()){
    return response.status(401).json({error:'permission denied'})
  }

  const result = await Blog.findByIdAndDelete(blogToDelete)
  if(result){
    response.status(200).json(result)
  }
  else{
    response.status(404).end()
  }
  
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    "likes": body.likes
  }

  const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  if(newBlog)
  {
    response.json(newBlog)
  }
  else{
    response.status(404).end()
  }
  
  
})

module.exports = blogRouter