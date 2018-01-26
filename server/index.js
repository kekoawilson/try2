require('dotenv').config()
const app = require('express')()
        ,  bodyParser = require('body-parser')
        ,  cors = require('cors')
        ,  port = 3001 || process.env.SERVER_PORT
        ,  massive = require('massive')
        , passport = require('passport')
        , Auth0Strategy = require('passport-auth0');
        let  sampleData = [
            { that: 'yo', theOther: 'yay' }, { that: 'hi', theOther: 'hey' }, { that: 'no', theOther: 'nay' }, { that: 'bye', theOther: 'bae' }, { that: 'so', theOther: 'stay' },
        ]

// 76F
app.use(bodyParser.json())
app.use(cors())

// 78B
passport.use( new Auth0Strategy( {
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK_URL,
}, function( acessToken, refreshToken, extraParams, profile, done ) {
    const db = app.get( 'db' )
    let userData = profile._json, // coming from google. Find out what it is for FB and other ones you want to use for login.
    auth_id = userData.user_id.split('|')[1]
    db.find_user( [auth_id] ).then( user => {
        if ( user[0] ) {
            return done( null, user[0].id )
        } else {
            db.create_user( [ userData.family_name, userData.given_name, userData.email, auth_id, userData.picture ] )
            .then( user => done( null, user[0].id ) )
        }
    } )

} ) )

app.get( '/auth', passport.authenticate( 'auth0' ) )
app.get( '/auth/callback', passport.authenticate( 'auth0', {
    successRedirect: 'http://localhost:3001',
    failureRedirect: '/auth'
} ) )

passport.serializeUser( ( ID, done ) => done( null, ID ) ) // saves user id to session

passport.deserializeUser( ( ID, done ) => {
    const db = app.get( 'db' )
    db.find_user_session( [ID] )
    .then( user => {
        done( null, user[0] )
    } )
} )

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