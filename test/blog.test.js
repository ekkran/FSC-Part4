const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const assert = require('assert').strict

const initialBlogs = [
  {
    "title":"My four blog",
    "author":"anonymous",
    "url":"http://localhost/blogs/my-first-blog",
    "likes":0
  }, 
  {
    "title":"My fifth blog",
    "author":"anonymous",
    "url":"http://localhost/blogs/my-first-blog",
    "likes":0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(x => x.save())
  await Promise.all(promises)
})


test('blogs are returned as json', async () => {
  await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)
})

test('blogs have property id', async () => {
  const newBlog = {
    "title":"My third blog",
    "author":"anonymous",
    "url":"http://localhost/blogs/my-first-blog",
    "likes":0
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect(x => assert.ok(x.body.id))

})

test('Correct creation', async () => {
  const newBlog = {
    "title":"My third blog",
    "author":"anonymous",
    "url":"http://localhost/blogs/my-first-blog",
    "likes":0
  }
  
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  
})

test('Likes not sent', async () => {
  const newBlog = {
    "title":"My third blog",
    "author":"anonymous",
    "url":"http://localhost/blogs/my-first-blog"    
  }
  
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect(x => assert.equal(x.body.likes, 0))
  
})

describe('Incorrect data return 400', () => {
  test('Blogs without title', async () => {
    const newBlog = {
      "author":"anonymous",
      "url":"http://localhost/blogs/my-first-blog"    
    }
    
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  })

  test('Blogs without author', async () => {
    const newBlog = {
      "title":"My third blog",
      "url":"http://localhost/blogs/my-first-blog"    
    }
    
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  })
})



after(async () => {
  await mongoose.connection.close()
})