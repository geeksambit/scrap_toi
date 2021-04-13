const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
 const uri = 'mongodb://localhost:27017/toi'

const insertQuery = (tableName,myObj) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err,db) {
            if (err) reject(err)
            else {
                var dbo = db.db("toi");
                let res = dbo.collection(tableName).insertOne(myObj, function(err,res) {
                    if(err) reject(err);
                    db.close()
                })
                resolve(res)
            }
            
        })
    })
}

module.exports = insertQuery


