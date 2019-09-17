const pg = require('pg');
const { Client } = pg;
const uuid = require('uuid');

const client = new Client('postgres://localhost/acme_posts');

client.connect();

const noteOneId = uuid.v4();
const noteTwoId = uuid.v4();
const noteThreeId = uuid.v4();

const tagOneId = uuid.v4();
const tagTwoId = uuid.v4();
const tagThreeId = uuid.v4();


const SQL = `
  DROP TABLE IF EXISTS tags;
  DROP TABLE IF EXISTS posts;

  CREATE TABLE posts(
    id UUID PRIMARY KEY,
    topic VARCHAR(255)
  );

  CREATE TABLE tags(
    id UUID PRIMARY KEY,
    text VARCHAR(255),
    post_id UUID REFERENCES posts(id)
  );

  INSERT INTO posts(id, topic) VALUES('${noteOneId}', 'Node');
  INSERT INTO posts(id, topic) VALUES('${noteTwoId}', 'Express');
  INSERT INTO posts(id, topic) VALUES('${noteThreeId}', 'React');

  INSERT INTO tags(id, text, post_id) VALUES('${tagOneId}', 'Fun', '${noteOneId}');
  INSERT INTO tags(id, text, post_id) VALUES('${tagTwoId}', 'Interesting', '${noteOneId}');
  INSERT INTO tags(id, text, post_id) VALUES('${tagThreeId}', 'Awesome', '${noteTwoId}');
`;

const syncAndSeed = async () => {
  await client.query(SQL);
};

const findAllTags = async () => {
  const allTags = await client.query('SELECT * FROM tags;');
  return allTags.rows;
};

const findAllPosts = async () => {
  const allPosts = await client.query('SELECT * FROM posts;');
  return allPosts.rows;
};

module.exports = {
  syncAndSeed,
  findAllTags,
  findAllPosts
}
