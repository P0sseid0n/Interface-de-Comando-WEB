const socket = io()
const input = document.querySelector('input')
let receivedPast = false

input.addEventListener('keyup', event => {
	if (event.key != 'Enter') return
	if (input.value.trim() == '') return

	socket.emit('userCommand', input.value.trim())
	input.value = ''
})

window.addEventListener('keyup', e => {
	if (document.activeElement == input) return

	if (e.key.length == 1) input.value += e.key
	input.focus()
})

const addOnHtml = ({ author, msg }) => {
	const main = document.querySelector('main')
	const p = document.createElement('p')

	if (author) {
		p.innerHTML = `<b>[${author.toUpperCase()}]:</b> ${msg}`
		p.classList.add(author.toLowerCase().replace(' ', '-'))
	} else {
		p.innerText = msg
	}

	main.append(p)
	main.scrollTop = main.scrollHeight
}

socket.on('renderCommand', addOnHtml)

socket.on('renderPast', past => {
	if (receivedPast) return
	past.forEach(addOnHtml)
	receivedPast = true
})
