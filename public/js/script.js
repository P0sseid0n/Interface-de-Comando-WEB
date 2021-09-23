const socket = io()
const input = document.querySelector('input')

input.addEventListener('keyup', event => {
	if (a.key != 'Enter') return
	if (input.value.trim() == '') return

	socket.emit('userCommand', input.value.trim())
	input.value = ''
})

window.addEventListener('keyup', e => {
	console.log(e)
})

socket.on('renderCommand', ({ author, msg }) => {
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
})
