module.exports = {
    sqlite : {
        client : "sqlite3",
        connection: {
            filename : "./book.sqlite"
        },
        pool : {max:1,min :1},
        debug : true
    }
}