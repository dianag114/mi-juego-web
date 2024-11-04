const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let shapes = [];
let score = 0;
let gameOver = false;
let speedIncrement = 0.1;
let spawnInterval = 1000;

// Configuración del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function showIntro() {
    hideAllPhases();
    document.getElementById("intro").style.display = "block";
}

function showInstructions() {
    hideAllPhases();
    document.getElementById("instructions").style.display = "block";
}

function startGame() {
    hideAllPhases();
    document.getElementById("game").style.display = "block";
    score = 0;
    updateScore();
    gameOver = false;
    shapes = [];
    generateShapes();
    animate();
}

function endGame() {
    hideAllPhases();
    document.getElementById("credits").style.display = "block";
}

function hideAllPhases() {
    document.querySelectorAll(".phase").forEach(phase => phase.style.display = "none");
}

class Shape {
    constructor(x, y, imageSrc, speed) {
        this.posX = x;
        this.posY = y;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = -Math.abs(this.speed);
        this.image = new Image();
        this.image.src = imageSrc;
        this.size = 50; // Tamaño de las figuras
    }

    draw(context) {
        context.drawImage(this.image, this.posX - this.size / 2, this.posY - this.size / 2, this.size, this.size);
    }

    update() {
        this.posX += this.dx;

        // Rebote en los bordes laterales
        if (this.posX + this.size / 2 > canvas.width || this.posX - this.size / 2 < 0) {
            this.dx = -this.dx;
        }

        this.posY += this.dy;

        // Verificar si toca el borde superior para terminar el juego
        if (this.posY - this.size / 2 <= 0) {
            gameOver = true;
        }
    }

    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.posX - this.size / 2 &&
            mouseX <= this.posX + this.size / 2 &&
            mouseY >= this.posY - this.size / 2 &&
            mouseY <= this.posY + this.size / 2
        );
    }
}

class Star extends Shape {
    constructor(x, y, speed) {
        super(x, y, 'assets/star.png', speed);
    }
}

class Fish extends Shape {
    constructor(x, y, speed) {
        super(x, y, 'assets/fish.png', speed);
    }
}

class Crab extends Shape {
    constructor(x, y, speed) {
        super(x, y, 'assets/crab.png', speed);
    }
}

function generateShapes() {
    setInterval(() => {
        if (!gameOver) {
            let x = Math.random() * canvas.width;
            let y = canvas.height;
            let speed = Math.random() * 2 + 1 + score * speedIncrement;

            const randomShape = Math.floor(Math.random() * 3);
            switch (randomShape) {
                case 0:
                    shapes.push(new Star(x, y, speed));
                    break;
                case 1:
                    shapes.push(new Fish(x, y, speed));
                    break;
                case 2:
                    shapes.push(new Crab(x, y, speed));
                    break;
            }
        }
    }, spawnInterval);
}

function updateScore() {
    document.getElementById("score").innerText = `Puntos: ${score}`;
}

// Manejo de clic en el canvas para eliminar figuras
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    shapes = shapes.filter(shape => {
        if (shape.isClicked(mouseX, mouseY)) {
            score++;
            updateScore();
            return false; // Elimina la figura si fue clickeada
        }
        return true; // Conserva la figura si no fue clickeada
    });
});

function animate() {
    if (gameOver) {
        endGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        shape.update();
        shape.draw(ctx);
    });
    requestAnimationFrame(animate);
}

showIntro();

