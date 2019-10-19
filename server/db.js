export default {
  links: [
    {
      author: 1,
      comments: [0, 4],
      description: 'a website',
      id: 0,
      score: 5,
      url: 'https://example.com',
    },
    {
      author: 2,
      comments: [],
      description: 'another website',
      id: 1,
      score: 50,
      url: 'https://example2.com',
    },
  ],

  users: [
    {id: 0, username: 'angi', about: 'the oldest'},
    {id: 1, username: 'giangi', about: 'the smartest'},
    {id: 2, username: 'pungi', about: 'the troublesome'},
    {id: 3, username: 'rangi', about: 'the youngest'},
  ],

  comments: [
    {id: 0, parent: null, author: 0, content: 'chocolate is good'},
    {id: 1, parent: 0, author: 1, content: "but that's fatty"},
    {id: 2, parent: 1, author: 0, content: 'yay but I cannot resist'},
    {id: 3, parent: 0, author: 2, content: 'have you tried the raw one?'},
    {id: 4, parent: null, author: 2, content: 'what about kunafa?'},
  ],
};
