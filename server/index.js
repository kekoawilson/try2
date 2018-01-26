require('dotenv').config()
const app = require('express')()
        ,  bodyParser = require('body-parser')
        ,  cors = require('cors')
        ,  port = 3001 || process.env.SERVER_PORT
        ,  massive = require('massive');
        let  sampleData = [
            { that: 'yo', theOther: 'yay' }, { that: 'hi', theOther: 'hey' }, { that: 'no', theOther: 'nay' }, { that: 'bye', theOther: 'bae' }, { that: 'so', theOther: 'stay' },
        ]

// 76F
app.use(bodyParser.json())
app.use(cors())

// 70C
massive( process.env.DB_CONNECTION ).then( db => { app.set( 'db', db ) } )

// 74D-1, 70K
app.get('/api/get', ( req, res ) => {
    let db = req.app.get('db')
    db.getAllThings().then( things => res.send( things ))
})

// 76D, 76E
app.get('/api/get/:param', ( req, res ) => {
    let sendIt = sampleData.slice()
    sendIt = sendIt.filter( e => e.theOther === req.params.param )

    if (req.query.that) {
        sendIt = sendIt.filter( e => e.that === req.query.that )
    } 
    res.status(200).send(sendIt)
})

// 74D-2
app.put('/api/put/:param', ( req, res ) => {
    const param = req.params.param
        const dataUpdate = sampleData.filter( e => {
            return e.that === param
        })

        dataUpdate[0].that = req.body.that
        res.status(200).send( sampleData )
    
})
// 74D-3
app.post('/api/post', ( req, res ) => {
    let db = req.app.get('db')
    let {that, theOther } = req.body
    const newData = { that, theOther }
    sampleData.push( newData )
        res.status(200).send( sampleData )
}),
// 74D-4
app.delete('/api/delete/:param', ( req, res ) => {
    const param = req.params.param
    let db = req.app.get('db')
    db.deleteThing([param]).then( () => {
        res.status(200).send( 'Deleted' )})
    })

app.listen( port, () => console.log(`Listening on port : ${port}`));