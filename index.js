const path = require('path')
const express = require('express')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'view'))
app.set('view engine', 'ejs')
app.use(express.json())

const commandCheck = require('./commandCheck')

const usersConnected = {}
const pastMsgs = []
const cli = {
	send: ({ author, msg }) => {
		io.emit('renderCommand', { author, msg })
	},
}

io.on('connection', socket => {
	usersConnected[socket.id] = socket.handshake.headers['user-agent']

	io.emit('renderPast', pastMsgs)

	socket.on('userCommand', msg => {
		cli.send({ msg })
		commandCheck(cli)
	})

	socket.on('disconnect', (a, b) => {
		delete usersConnected[socket.id]
	})
})

app.get('/', (req, res) => res.render('console'))

app.post('/', (req, res) => {
	const { author, msg } = req.body
	if (!author) return res.status(400).send('Author field is invalid')

	pastMsgs.join({ author, msg })

	cli.send({ author, msg })
	return res.status(200).send()
})

http.listen(process.env.PORT || 3000, () => console.log('Online'))
