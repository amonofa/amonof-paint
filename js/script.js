const canvas = document.querySelector('canvas')
const toolBts = document.querySelectorAll('.tool')
const fillColor = document.querySelector('#fill-color')
const sizeSlider = document.querySelector('#size-slider')
const colorBtns = document.querySelectorAll('.colors .option')
const colorPicker = document.querySelector('#color-picker')
const clearCanvasBtn = document.querySelector('.clear-canvas')
const saveImageBtn = document.querySelector('.save-img')

// let ctx = canvas.getContext('2d'),
//     isDrawing = false;
//     brushWidth = 5,
//     selectedTool = 'brush',
//     prevMouseX,
//     prevMouseY,
//     // snapshot

let ctx = canvas.getContext('2d'),
isDrawing = false,
brushWidth = 5,
selectedTool = 'brush',
selectedColor = '#000',
prevMouseX,
prevMouseY,
snapshot


// set canvas background 

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor
}

window.addEventListener('load', () => {
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

const startDraw = e => {
    isDrawing = true
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    console.log(prevMouseY);
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0 , canvas.width, canvas.height)
}

// draw rectangle 

const drawRectangle = e => {
    fillColor.checked
    ?  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    :  ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
       
}

// draw circle 
const drawCircle = e => {
    ctx.beginPath()
    const radius = 
       Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2)
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
    
}

// draw Triangle 
const drawTriangle = e => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawing = e => {
    if(!isDrawing) return

    ctx.putImageData(snapshot, 0 , 0)

    switch (selectedTool) {
        case 'brush':
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break
        case 'rectangle':
            drawRectangle(e)
            break
        case 'circle':
            drawCircle(e)
            break 
        case 'triangle':
            drawTriangle(e)
            break   
        case 'eraser':
            ctx.strokeStyle = '#fff'
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break        
        default:
            break        
    }
 
}




toolBts.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
        console.log(selectedTool);
    })
})

sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value))


// set Color to shapes 

colorBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelector('.options .selected').classList.remove('selected')
        btn.classList.add('selected')
        const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
        selectedColor = bgColor
    })
})

// set color from color picker 

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})

// clear canvas button 


clearCanvasBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground()
})

// save like image our paint 
saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a')
    link.download = `amonov-paint${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

const stopDraw = () => {
    isDrawing = false
}

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove' , drawing)
canvas.addEventListener('mouseup', stopDraw)