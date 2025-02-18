const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    return sum + item.likes
  }  
  return blogs.length > 0 ? blogs.reduce(reducer, 0) : 0
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return null
  }

  var favorite = blogs[0]
  blogs.forEach(element => {
    if(favorite.likes < element.likes){
      favorite = element
    }
  });

  return {
    title:favorite.title,
    author:favorite.author,
    likes:favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return null
  }

  const sum = _(blogs)
  .countBy('author')
  .entries()
  .maxBy(_.last)

  const response = {
    author: _.head(sum),
    blogs:_.tail(sum)[0]
  }

  return response
}

const mostLikes = (blogs) => {
  if(blogs.length === 0){
    return null
  }

  const search = _(blogs)
    .groupBy('author')
    .map(group => ({
      author:group[0].author,
      likes: _.sumBy(group, 'likes')
    }))
    .maxBy('likes')

    return search
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}