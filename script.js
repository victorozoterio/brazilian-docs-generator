function generateCNPJ(useMask = false) {
	const generateRandomDigit = () => Math.floor(Math.random() * 9);

	const calculateVerificationDigit = (digits, weights) => {
		const sum = digits.reduce(
			(total, digit, index) => total + digit * weights[index],
			0,
		);
		const remainder = sum % 11;
		return remainder < 2 ? 0 : 11 - remainder;
	};

	const base = Array.from({ length: 8 }, generateRandomDigit).concat([
		0, 0, 0, 1,
	]);

	const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	const secondWeights = [6].concat(firstWeights);

	base.push(calculateVerificationDigit(base, firstWeights));
	base.push(calculateVerificationDigit(base, secondWeights));

	const cnpj = base.join("");
	return useMask
		? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
		: cnpj;
}

function generateCPF(useMask = false) {
	const generateRandomDigit = () => Math.floor(Math.random() * 9);

	const calculateVerificationDigit = (digits) => {
		const sum = digits.reduce(
			(total, digit, index) => total + digit * (digits.length + 1 - index),
			0,
		);
		const remainder = sum % 11;
		return remainder < 2 ? 0 : 11 - remainder;
	};

	const digits = Array.from({ length: 9 }, generateRandomDigit);
	digits.push(calculateVerificationDigit(digits));
	digits.push(calculateVerificationDigit(digits));

	const cpf = digits.join("");
	return useMask
		? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
		: cpf;
}

function generateCNH(useMask = false) {
	const generateRandomDigit = () => Math.floor(Math.random() * 9);

	const baseDigits = Array.from({ length: 9 }, generateRandomDigit);
	const calculateDV = (digits, factorStart) => {
		let sum = 0;
		for (let i = 0; i < digits.length; i++) {
			sum += digits[i] * (factorStart - i);
		}
		const result = sum % 11;
		return result >= 10 ? 0 : result;
	};

	const firstDV = calculateDV(baseDigits, 9);
	const secondDV = calculateDV([...baseDigits, firstDV], 1 + baseDigits.length);
	const cnh = baseDigits.join("") + firstDV + secondDV;

	return useMask
		? cnh.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
		: cnh;
}

function generateRG(useMask = false) {
	const generateRandomDigit = () => Math.floor(Math.random() * 9);

	let digits;
	let verificationDigit;

	do {
		digits = Array.from({ length: 8 }, generateRandomDigit);
		const sum = digits.reduce(
			(total, digit, index) => total + digit * (9 - index),
			0,
		);
		const remainder = sum % 11;
		verificationDigit = remainder === 10 ? null : remainder;
	} while (verificationDigit === null);

	const rg = digits.join("") + verificationDigit;
	return useMask ? rg.replace(/(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4") : rg;
}

function copyToClipboard(text) {
	navigator.clipboard
		.writeText(text)
		.catch((err) => console.error("Copy failed:", err));
	showToast();
}

function showToast() {
	const toast = document.getElementById("toast");
	toast.classList.add("show");
}

function handleGeneration(generatorFunction) {
	const useMask = document.getElementById("use-mask").checked;
	const result = generatorFunction(useMask);
	const display = document.getElementById("display");
	display.value = result;
	copyToClipboard(result);
}

document
	.getElementById("btn-cnpj")
	.addEventListener("click", () => handleGeneration(generateCNPJ));
document
	.getElementById("btn-cpf")
	.addEventListener("click", () => handleGeneration(generateCPF));
document
	.getElementById("btn-cnh")
	.addEventListener("click", () => handleGeneration(generateCNH));
document
	.getElementById("btn-rg")
	.addEventListener("click", () => handleGeneration(generateRG));
