const form = document.getElementById("cubic-form") as HTMLFormElement;

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const a: number = Number(formData.get("a"));
    const b: number = Number(formData.get("b"));
    const c: number = Number(formData.get("c"));
    const d: number = Number(formData.get("d"));

    const p = (3 * a * c - b * b)/(3 * a * a);
    const q = (27 * a * a * d - 9 * a * b * c + 2 * b ** 3)/(27 * a ** 3); 
    const discriminant = (q/2) ** 2 + (p/3) ** 3;

    if (discriminant < 0) {
        // use Trignometric Method or Cardano's Method once and cube roots of unity (passed test)
        const k = 2 * Math.sqrt(-p/3);
        const theta = Math.acos(-q/(2 * Math.sqrt(-1 *((p/3) ** 3))))/3;
        const x1 = k * Math.cos(theta) - b/(3 * a);
        const x2 = k * Math.cos(theta + (2 * Math.PI)/3) - b/(3 * a);
        const x3 = k * Math.cos(theta + (4 * Math.PI/3)) - b/(3 * a);
        
        (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;
    } else if (discriminant > 0) {
        // use Cardano's Method once and use cube roots of unity to find other two real roots
        const U = -q/2 + Math.sqrt((q/2) ** 2 + (p/3) ** 3);
        const V = -q/2 - Math.sqrt((q/2) ** 2 + (p/3) ** 3);
        const u = U ** 1/3;
        const v = V ** 1/3;
        const x = (-q/2 + Math.sqrt((q/2) ** 2 + (p/3) ** 3)) ** 2/3 - b/(3 * a);

        (document.getElementById("result") as HTMLInputElement).value = `x1=${u}, x2=${v}, x3=${x}`;

    } else {
       // see if ternary can be used here
       if (p == q && p == 0) {
        // use Cardano's Method once to get triple root

        } else {
        // use Cardano's Method once to get double root
        // use something else to get the single root (on doc)

        
        }
    }
})