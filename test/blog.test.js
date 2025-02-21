const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const api = supertest(app)
const assert = require('assert').strict
const helper = require('./test_helper')
const logger = require('../utils/logger')

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

const initialUser = [
  {    
    "username": "ekkran",
    "name": "Juan Perez",
    "password": "uwqerqw"
  }
]

var token = ''

const login = async () => {
  const response = await api
  .post('/api/login')
  .send(
    {
      username:'ekkran', 
      password:'uwqerqw'
    })
  .expect(200)
  token = response.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(x => x.save())
  await Promise.all(promises)

  await User.deleteMany({})
  const userObjects = initialUser.map(async user => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(user.password, saltRounds)

    const userObject = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })
    return userObject
  })
  const resolvedUsers = await Promise.all(userObjects)
  const userSaved = resolvedUsers.map(user => user.save())
  await Promise.all(userSaved)

  await login()

})


test('blogs are returned as json', async () => {
  await api
  .get('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
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
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(201)
  .expect(x => assert.ok(x.body.id))

})

describe('Correct creation', async () => {
  test('Correct data and login', async () => {
    const newBlog = {
      "title":"My third blog",
      "author":"anonymous",
      "url":"http://localhost/blogs/my-first-blog",
      "likes":0
    }
    
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
  
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    
  })

  test('Correct data without login', async () => {
    const newBlog = {
      "title":"My third blog",
      "author":"anonymous",
      "url":"http://localhost/blogs/my-first-blog",
      "likes":0
    }
    
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVra3JhbiIsImlkIjoiNjdiNGY3NDBiODM0NDFlODhmOGEyNTdlIiwiaWF0IjoxNzQwMTczMzE1LCJleHAiOjE3NDAxNzY5MTV9._cAMdEAHu4lUV-sBO9DomdbeDalxsY1oW6Rc11A_dJQ`)
    .send(newBlog)
    .expect(401)
    
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
  
    assert.strictEqual(response.body.length, initialBlogs.length)
    
  })
})

test('Likes not sent', async () => {
  const newBlog = {
    "title":"My third blog",
    "author":"anonymous",
    "url":"http://localhost/blogs/my-first-blog"    
  }
  
  await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  })
})

describe('Delete data', () => {

  var blogsId

  test('Existing blog', async () => {
    
    const blogs = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    blogsId = blogs.body[0].id
    await api
    .del('/api/blogs/' + blogs.body[0].id)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  })

  test('Inexsistent blog', async () => {

    await api
    .del('/api/blogs/' + blogsId) 
    .set('Authorization', `Bearer ${token}`)   
    .expect(404)
  })
})

describe('Update data', () => {

  var blogsId
  
  test('Existing blog', async () => {
    
    const blogs = await api.get('/api/blogs').expect(200)
    blogsId = blogs.body[0].id
    const blogLikes = {
      likes: 15
    }
    await api
    .put('/api/blogs/' + blogs.body[0].id)
    .set('Authorization', `Bearer ${token}`)
    .send(blogLikes)
    .expect(200)
    .expect(blog => assert.equal(blog.body.likes, blogLikes.likes))

  })

  test('Inexsistent blog', async () => {

    await api
    .put('/api/blogs/' + blogsId)
    .auth('ekkran', 'uwqerqw')
    .send({
      likes: 190
    })
    .expect(404)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('when name or password does not meet the requirements', () => {
  test('username too short', async () => {
    const testUser = {
      "username": "qw",
      "name": "Juan Perez",
      "password": "uwqerqw"
    }

    const result = await api
    .post('/api/users')
    .send(testUser)
    .expect(400)

  })

  test('username duplicate', async () => {
    const testUser = {
      "username": "ekkran",
      "name": "Juan Perez",
      "password": "uwqerqw"
    }

    const result = await api
    .post('/api/users')
    .send(testUser)
    .expect(400)

  })

  test('password too short', async () => {
    const testUser = {
      "username": "juancho2",
      "name": "Juan Perez",
      "password": "qw"
    }

    const result = await api
    .post('/api/users')
    .send(testUser)
    .expect(400)

  })

})


after(async () => {
  await mongoose.connection.close()
})