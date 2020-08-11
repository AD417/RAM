function f(n, type = "standard") {
	let s = N[type](n);
	return s == "NaN" ? "0" : s;
}

let N = {};

N.bytes = function (n) {
	n = D(n);
	let suffix = Math.floor(n.exponent / 3);
	if (suffix >= SI_Prefixes.length) {
		suffix = "e" + n.exponent;
		return Math.floor(n.mantissa * 100) / 100 + suffix;
	} else {
		suffix = SI_Prefixes[suffix];
		let residue = n.exponent % 3;
		return (
			Math.floor(n.mantissa * 10 ** residue * (suffix != "" ? 100 : 1)) / (suffix != "" ? 100 : 1) +
			suffix
		);
	}
};

N.standard = function (n) {
	n = D(n);
	let suffix = Math.floor(n.exponent / 3);
	if (suffix >= Standard_Prefixes.length) {
		suffix = "e" + n.exponent;
		return Math.floor(n.mantissa * 100) / 100 + suffix;
	} else {
		suffix = Standard_Prefixes[suffix];
		let residue = n.exponent % 3;
		return (
			Math.floor(n.mantissa * 10 ** residue * (suffix != "" ? 100 : 1)) / (suffix != "" ? 100 : 1) +
			suffix
		);
	}
};

const SI_Prefixes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
const Standard_Prefixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
