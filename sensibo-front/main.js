const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// cloud stuff
const cloudPrefix = 'https://raw.githubusercontent.com/GabiCtrlZ/air-conditioner-controler-ui/main/images/'
const localPrefix = 'images/'

// images names
const blink2 = 'blink2'
const blowing1 = 'blowing1'
const blowing2 = 'blowing2'
const blowing3 = 'blowing3'
const looking_left = 'looking_left'
const looking_right = 'looking_right'
const sleeping1 = 'sleeping1'
const sleeping2 = 'sleeping2'
const start_blowing1 = 'start_blowing1'
const start_blowing2 = 'start_blowing2'
const start_blowing3 = 'start_blowing3'
const waking_up1 = 'waking_up1'
const waking_up2 = 'waking_up2'
const waking_up3 = 'waking_up3'

const imagesNames = [
  blink2,
  blowing1,
  blowing2,
  blowing3,
  looking_left,
  looking_right,
  sleeping1,
  sleeping2,
  start_blowing1,
  start_blowing2,
  start_blowing3,
  waking_up1,
  waking_up2,
  waking_up3,
]

// animation sequences
const sleeping = [[sleeping1, 75], [sleeping2, 75]] // the second value represents the frames to wait
const wakingUp = [[waking_up1, 7], [waking_up2, 7], [waking_up3, 7], [looking_left, 50], [looking_right, 50], [looking_left, 50], [waking_up2, 7], [blink2, 7], [waking_up2, 7], [looking_right, 50], [looking_left, 50]]
const goingToSleep = [...wakingUp].reverse()
const startBlowing = [[waking_up3, 7], [waking_up2, 7], [waking_up1, 7], [start_blowing1, 10], [start_blowing2, 10], [start_blowing3, 10]]
const stopBlowing = [...startBlowing].reverse()
const blowing = [[blowing1, 20], [blowing2, 20], [blowing3, 20], [blowing2, 20]]

// setting canvas consts
canvas.width = window.innerWidth
const cw = canvas.width
const cx = cw / 2

canvas.height = window.innerHeight
const ch = canvas.height
const cy = ch / 2

// consts
const IMAGES_TO_LOAD = imagesNames.length
const IMAGE_WIDTH = Math.floor(2 * 63 * Math.min(cw / 100, 4))
const IMAGE_HEIGHT = Math.floor(2 * 35 * Math.min(cw / 100, 4))

// counters
let imageLoadedCounter = 0
let framesCounter = 0

// user controlled state
let state = !!INITIAL_STATE

// animations queue
const queue = state ? [blowing] : [sleeping]

// initialize sequence variables
let currentSequence = []
let frame = -1
let imageName = ''
let framesToWait = -1

// load images
const images = {}
imagesNames.forEach((name) => {
  const image = new Image(IMAGE_WIDTH, IMAGE_HEIGHT)
  image.onload = () => { imageLoadedCounter += 1 }
  image.src = `${cloudPrefix}${name}.png`
  images[name] = image
})


function animate() {
  requestAnimationFrame(animate)

  // make sure all of the images actually loaded
  if (imageLoadedCounter < IMAGES_TO_LOAD) return

  if (framesCounter > framesToWait) {
    frame += 1
    const currentSequenceLength = currentSequence.length

    if (queue.length && frame === currentSequenceLength) currentSequence = queue.shift()
    if (frame === currentSequenceLength) frame = 0

    imageName = currentSequence[frame][0]
    framesToWait = currentSequence[frame][1]

    framesCounter = 0
  }

  // clear the canvas here!
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(images[imageName], cx - Math.floor(IMAGE_WIDTH / 2), Math.floor(cy / 2) - Math.floor(IMAGE_HEIGHT / 2), IMAGE_WIDTH, IMAGE_HEIGHT)
  framesCounter += 1
}
animate()

const button = document.querySelector('#button')

if (state) button.innerHTML = 'TURN OFF'

button.addEventListener('click', () => {
  if (!state) {
    queue.push(wakingUp, startBlowing, blowing)
    button.innerHTML = 'TURN OFF'
  }
  else {
    queue.push(stopBlowing, goingToSleep, sleeping)
    button.innerHTML = 'TURN ON'
  }
  fetch(`${SERVER_URI}/turn`)
  state = !state
})