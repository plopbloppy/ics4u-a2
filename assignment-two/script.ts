const form = document.getElementById("cubic-form") as HTMLFormElement;
const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2 + 5;
const centerY = canvas.height / 2 + 5;
const gridSize = 20;

//roots
let x1: any;
let x2: any;
let x3: any;

//grid
function drawGrid() {
    if (ctx) {
        ctx.beginPath();
        for (let i = 5; i <= canvas.width; i += gridSize) {
            ctx.moveTo(i, 5);
            ctx.lineTo(i, canvas.height);
            ctx.moveTo(5, i);
            ctx.lineTo(canvas.width, i);
            ctx.strokeStyle = "#cde8f5";
            ctx.stroke();
        }

        //x- and y- axis
        ctx.beginPath();
        ctx.moveTo(5, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.moveTo(centerX, 5);
        ctx.lineTo(centerX, canvas.height);

        ctx.strokeStyle = "#3c8dbc";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawFunction(a: number, b: number, c: number, d: number, x1: any, x2: any, x3: any) {
    const roots = [x1, x2, x3];

    if (ctx) {
        ctx.translate(centerX, centerY);
        ctx.beginPath();

        for (let x = -15; x <= 15; x += 0.01) {
            const y = -(a * x ** 3 + b * x ** 2 + c * x + d);
            ctx.lineTo(x * gridSize, y * gridSize);
            // x === -centerX ? ctx.moveTo(x * gridSize, y * gridSize) : ctx.lineTo(x * gridSize, y * gridSize);
            ctx.strokeStyle = "#f37f73";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.beginPath();

        for (let i = 0; i < roots.length; i++) {
            ctx.moveTo(roots[i] * gridSize, 0);
            ctx.arc(roots[i] * gridSize, 0, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "#ffd24f";
            ctx.fill();
            ctx.stroke();
        }
    }
}

function updateGraph(a: number, b: number, c: number, d: number, x1: any, x2: any, x3: any) {
    if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawFunction(a, b, c, d, x1, x2, x3);
    }
}

drawGrid();

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const a: number = Number(formData.get("a"));
    const b: number = Number(formData.get("b"));
    const c: number = Number(formData.get("c"));
    const d: number = Number(formData.get("d"));

    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (27 * a * a * d - 9 * a * b * c + 2 * b ** 3) / (27 * a ** 3);
    const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

    if (discriminant < 0) {
        const k = 2 * Math.sqrt(-p / 3);
        const theta = Math.acos(-q / (2 * Math.sqrt(-1 * ((p / 3) ** 3)))) / 3;
        x1 = k * Math.cos(theta) - b / (3 * a);
        x2 = k * Math.cos(theta + (2 * Math.PI) / 3) - b / (3 * a);
        x3 = k * Math.cos(theta + (4 * Math.PI / 3)) - b / (3 * a);

        (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;
    } else if (discriminant > 0) {
        const U = -q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3);
        const V = -q / 2 - Math.sqrt((q / 2) ** 2 + (p / 3) ** 3);
        x1 = U ** (1 / 3);
        x2 = V ** (1 / 3);
        x3 = x1 + x2 - b / (3 * a);

        (document.getElementById("result") as HTMLInputElement).value = `x1= Complex Number, x2= Complex Number, x3=${x3}`;
    } else {
        if (p == q && p == 0) {
            const x1 = (-q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3)) ** 2 / 3 - b / (3 * a);
            const x2 = (-q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3)) ** 2 / 3 - b / (3 * a);
            const x3 = (-q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3)) ** 2 / 3 - b / (3 * a);
            (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;

        } else {
            const x1 = (p / 2) ** 1 / 3 - b / (3 * a);
            const x2 = (p / 2) ** 1 / 3 - b / (3 * a);
            const x3 = -2 * x1;

            (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;
        }
    }
    updateGraph(a, b, c, d, x1, x2, x3);
})