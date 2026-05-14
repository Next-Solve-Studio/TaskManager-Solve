export const FormatDocument = (value) => {
    if (!value) return "";

    // Remove tudo que não for número
    let v = value.replace(/\D/g, "");

    if (v.length <= 11) {
        // Máscara de CPF: 000.000.000-00
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        // Máscara de CNPJ: 00.000.000/0000-00
        v = v.substring(0, 14); // Impede que a pessoa digite mais de 14 números
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return v;
};
