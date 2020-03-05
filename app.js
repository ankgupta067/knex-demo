const config = require("./knex-config").sqlite;

var knex = require("knex")(config);
var treeize = require("treeize");
var query = knex("book")
  .join("author", "author.id", "=", "book.author_id")
  .where("author.id", 1)
  .select(
    "author.firstname",
    "author.lastname",
    "book.title as books:title",
    "book.id as books:id"
  )
  .debug(false)
  .then(rows => {
    var tree = new treeize();
    tree.grow(rows);
    return tree.getData()[0];
  });

// promise based query

// var pAuthor = knex("author")
//   .where("id", 1)
//   .then();
// var pBooks = knex("book")
//   .where("author_id", 1)
//   .then();

// Promise.all([pAuthor, pBooks])
//   .then(results => {
//     var author = results[0][0];
//     author.books = results[1];
//     console.log(author);
//   })
//   .catch(error => {
//     console.log("---", error);
//   })
//   .finally(() => knex.destroy());

// Insert

// knex("author")
//   .insert({ firstname: "charles", lastname: "darwin" })
//   .then(id => {
//     console.log(id);
//     return knex("author");
//   })
//   .then(rows => console.log(rows))
//   .finally(() => knex.destroy());

// delete
// knex("author")
//   .where("id",">","4").del()
//   .then(count => {
//     console.log(count);
//     return knex("author");
//   })
//   .then(rows => console.log(rows))
//   .finally(() => knex.destroy());

// update
// knex("book")
//   .where("author_id", 1)
//   .update({ rating: 0 })
//   .then(count => {
//     console.log(count);
//     return knex("book");
//   })
//   .then(rows => console.log(rows))
//   .finally(() => knex.destroy());

// transaction

var author = { firstname: "first", lastname: "second" };
var books = [
  { title: "test book1", rating: 9 },
  { title: "test book1", rating: 100 }
];

knex
  .transaction(trx => {
   return trx  // return is mandatory here else transaction wont commit other way is to manually commit in then
      .insert(author,"id")
      .into("author")
      .then(idarr => {
        console.log("----", idarr);
        books.forEach(x => (x.author_id = idarr[0]));
        return trx.insert(books).into("book");
      });
  })
  .then(() => {
    console.log("--- in then")
    knex("book").then(rows => {
      console.log(rows);
    });
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => knex.destroy());

//runQuery(query);

async function runQuery(query) {
  var result = await query;
  console.log(result);
  knex.destroy();
  console.log("done");
}
