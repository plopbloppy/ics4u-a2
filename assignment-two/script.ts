const form = document.getElementById("cubic-form") as HTMLFormElement;
const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const gridSize = 25;

function drawGrid() {
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "#cde8f5";
        for (let i = 0; i <= canvas.width; i += gridSize) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        //x- and y- axis
        ctx.beginPath();
        ctx.strokeStyle = "#3c8dbc";
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
    }
}

function drawFunction(a: number, b: number, c: number, d: number, roots: any[]) {
    if (ctx) {
        ctx.translate(centerX, centerY);
        ctx.beginPath();
        ctx.strokeStyle = "#f37f73";
        ctx.lineWidth = 2;

        for (let x = -15; x <= 15; x += 0.1) {
            const y = -(a * x ** 3 + b * x ** 2 + c * x + d);
            ctx.lineTo(x * gridSize, y * gridSize);
            ctx.stroke();
        }

        //draws a dot around each real root
        ctx.beginPath();
        ctx.fillStyle = "#ffd24f";

        for (let i = 0; i < roots.length; i++) {
            ctx.moveTo(roots[i] * gridSize, 0);
            ctx.arc(roots[i] * gridSize, 0, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
}

function updateGraph(a: number, b: number, c: number, d: number, roots: any[]) {
    if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawFunction(a, b, c, d, roots);
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

    let x1: any;
    let x2: any;
    let x3: any;
    let roots: number[];

    if (discriminant < 0) {
        //three disctinct roots
        const k = 2 * Math.sqrt(-p / 3);
        const theta = Math.acos(-q / (2 * Math.sqrt(-((p / 3) ** 3)))) / 3;
        x1 = k * Math.cos(theta) - b / (3 * a);
        x2 = k * Math.cos(theta + (2 * Math.PI) / 3) - b / (3 * a);
        x3 = k * Math.cos(theta + (4 * Math.PI / 3)) - b / (3 * a);
        roots = [x1, x2, x3];
    } else if (discriminant > 0) {
        x1 = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
        x2 = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
        x3 = x1 + x2 - b / (3 * a);
        roots = [x3];
    } else {
        if (p == 0 && q == 0) {
            //p = 0 and q = 0 so the original equation from above collapses into the equation below
            x1 = - b / (3 * a);
            x2 = x1;
            x3 = x1;
            roots = [x1];
        } else {
            x1 = Math.cbrt(q / 2) - b / (3 * a);
            roots = [x1];
        }
    }
    (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;
    //(document.getElementById("p") as HTMLInputElement).value = `${p}`;
    // (document.getElementById("discriminant") as HTMLInputElement).value = `${discriminant}`;
    // (document.getElementById("x1") as HTMLInputElement).value = `${x1}`;
    // (document.getElementById("x2") as HTMLInputElement).value = `${x2}`;
    // (document.getElementById("x3") as HTMLInputElement).value = `${x3}`;

    updateGraph(a, b, c, d, roots);
})