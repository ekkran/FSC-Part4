const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { title } = require('node:process')

const blogsTest = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('Total Likes', () => {
  test('empty list', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('one item', () => {
    const blogs = [
      {
        title:"My life is a joke, literally",
        author:"Pepe Paleta",
        url:"https://localhost/my-life-joke",
        likes: 1
      }
    ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('Favorite Blog', () => {
  test('empty list', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)    
  })
  test('max likes', () => {
    const result = listHelper.favoriteBlog(blogsTest)
    assert.deepStrictEqual(result, {
      title: blogsTest[2].title,
      author: blogsTest[2].author,
      likes: blogsTest[2].likes
    })
  })

})

describe('Most Blog', () => {
  test('empty list', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)    
  })
  test('max blogs', () => {
    const result = listHelper.mostBlogs(blogsTest)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

})

describe('Max Likes', () => {
  test('empty list', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)    
  })
  test('max likes', () => {
    const result = listHelper.mostLikes(blogsTest)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})