const path = require('path')
const express = require('express')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
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

	if (pastMsgs.length > 0) io.to(socket.id).emit('renderPast', pastMsgs)

	socket.on('userCommand', msg => {
		cli.send({ msg })
		commandCheck(cli)
	})

	socket.on('disconnect', () => {
		delete usersConnected[socket.id]
	})
})

app.get('/', (req, res) => {
	res.setHeader('X-Powered-By', 'Doutrinas').render('console')
})

app.post('/', (req, res) => {
	const { author, msg } = req.body
	if (!author) return res.status(400).send('Author field is invalid')

	pastMsgs.push({ author, msg })

	cli.send({ author, msg })
	return res.status(200).send()
})

http.listen(process.env.PORT || 3000, () => console.log('Online'))
