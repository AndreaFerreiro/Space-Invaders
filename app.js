document.addEventListener('DOMContentLoaded', () => {
    const square = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let width = 15
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []
    let result = 0
    let direction = 1
    let invaderId

    //define the alien invaders
    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ]

    // draw the aliens invaders
    alienInvaders.forEach( invader => square[currentInvaderIndex + invader].classList.add('invader'))

    // draw the shooter
    square[currentShooterIndex].classList.add('shooter')

    //move the shooter along a line
    function moveShooter (e) {
        square[currentShooterIndex].classList.remove('shooter')
        switch(e.keyCode){
            case 37:
                if (currentShooterIndex % width !== 0) currentShooterIndex -=1
                break
            case 39:
                if (currentShooterIndex % width < width - 1) currentShooterIndex +=1
                break
            
        }
        square[currentShooterIndex].classList.add('shooter')
    }
    document.addEventListener('keydown', moveShooter)

    // move the aliens invaders
    function moveInvaders () {
        const leftEdge = alienInvaders[0] % width === 0
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)){
            direction = width
        } else if (direction === width){
            if (leftEdge) direction = 1
            else direction = -1
        }
        for (let i=0; i<alienInvaders.length-1; i++){
            square[alienInvaders[i]].classList.remove('invader')
        }
        for (let i=0; i<alienInvaders.length - 1; i++){
            alienInvaders[i] += direction
        }
        for (let i=0; i<alienInvaders.length-1; i++){
            if (!alienInvadersTakenDown.includes(i)){
                square[alienInvaders[i]].classList.add('invader')
            }
        }

        //decide a game over
        if (square[currentShooterIndex].classList.contains('invader', 'shooter')){
            resultDisplay.textContent = 'Game Over'
            square[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
        }

        for (let i=0; i<alienInvaders.length-1; i++){
            if (alienInvaders[i] > (square.length - (width - 1))){
                resultDisplay.textContent = 'Game Over'
                clearInterval(invaderId)
            }
        }
        // decide a win
        if (alienInvadersTakenDown.length === alienInvaders.length -1){
            resultDisplay.textContent ='You Win'
            clearInterval(invaderId)
        }
    }
    invaderId = setInterval(moveInvaders, 500)

    // shoot at aliens
    function shoot (e) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        // move the laser from the shooter to the alien Invader
        function moveLaser () {
            square[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            square[currentLaserIndex].classList.add('laser')
            if (square[currentLaserIndex].classList.contains('invader')){
                square[currentLaserIndex].classList.remove('laser')
                square[currentLaserIndex].classList.remove('invader')
                square[currentLaserIndex].classList.add('boom')

                setTimeout(() => square[currentLaserIndex].classList.remove('boom'), 250)
                clearInterval(laserId)
                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(alienTakenDown)
                result++
                resultDisplay.textContent = result
            }
            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => square[currentLaserIndex].classList.remove('laser', 100))
            }
        }
        /*document.addEventListener('keyup', e => {
            if (e.keyCode === 32){
                laserId = setInterval(moveLaser, 100)
            }
        })*/
        switch (e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }
    document.addEventListener('keyup', shoot)
})