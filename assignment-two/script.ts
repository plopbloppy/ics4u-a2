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

function drawFunction(a: number, b: number, c: number, d: number, realRoots: any[]) {
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

        //dot around each real root
        ctx.beginPath();
        ctx.fillStyle = "#ffd24f";

        for (let i = 0; i < realRoots.length; i++) {
            ctx.moveTo(realRoots[i] * gridSize, 0);
            ctx.arc(realRoots[i] * gridSize, 0, 3, 0, 2 * Math.PI);
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

    const p = (3 * a * c - b ** 2) / (3 * a ** 2);
    const q = (27 * a ** 2 * d - 9 * a * b * c + 2 * b ** 3) / (27 * a ** 3);
    const discriminant = ((q / 2) ** 2 + (p / 3) ** 3);
    const theta = 1 / 3 * Math.acos(-q / (2 * Math.sqrt(-Math.pow(p / 3, 3))));

    let x1: any;
    let x2: any;
    let x3: any;
    let realRoots: number[];

    if (discriminant < 0) {
        //three disctinct roots
        const k = 2 * Math.sqrt(-p / 3);
        x1 = k * Math.cos(theta) - b / (3 * a);
        x2 = k * Math.cos(theta + (2 * Math.PI) / 3) - b / (3 * a);
        x3 = k * Math.cos(theta + (4 * Math.PI / 3)) - b / (3 * a);
        realRoots = [x1, x2, x3];

        (document.getElementById("x1") as HTMLElement).textContent = `${x1.toFixed(2)}`;
        (document.getElementById("x2") as HTMLElement).textContent = `${x2.toFixed(2)}`;
        (document.getElementById("x3") as HTMLElement).textContent = `${x3.toFixed(2)}`;
    } else if (discriminant > 0) {
        //single root and two complex roots
        x1 = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
        x2 = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
        x3 = x1 + x2 - b / (3 * a);
        realRoots = [x3];

        (document.getElementById("x1") as HTMLElement).textContent = `Complex Number`;
        (document.getElementById("x2") as HTMLElement).textContent = `Complex Number`;
        (document.getElementById("x3") as HTMLElement).textContent = `${x3.toFixed(2)}`;
    } else {
        if (p == 0 && q == 0) {
            //triple root
            x1 = - b / (3 * a);
            x2 = x1;
            x3 = x1;
            realRoots = [x1];
        } else {
            //double root
            const r1 = Math.cbrt(q / 2);
            x1 = r1 - b / (3 * a);
            x2 = x1;
            x3 = -2 * r1 - b / (3 * a);;
            realRoots = [x1, x2, x3];
        }
        (document.getElementById("x1") as HTMLElement).textContent = `${x1.toFixed(2)}`;
        (document.getElementById("x2") as HTMLElement).textContent = `${x2.toFixed(2)}`;
        (document.getElementById("x3") as HTMLElement).textContent = `${x3.toFixed(2)}`;
    }

    (document.getElementById("equation") as HTMLElement).textContent = `${a}x³ + ${b}x² + ${c}x + ${d}`;
    (document.getElementById("p") as HTMLElement).textContent = `${p.toFixed(5)}`;
    (document.getElementById("q") as HTMLElement).textContent = `${q.toFixed(5)}`;
    (document.getElementById("discriminant") as HTMLElement).textContent = `${discriminant.toFixed(5)}`;

    updateGraph(a, b, c, d, realRoots);
})