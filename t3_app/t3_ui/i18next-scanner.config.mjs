export default {
    input: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/i18n.ts", // Exclude the existing i18n file
    ],
    output: "./src",
    options: {
        func: {
            list: ["t", "i18next.t"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        lngs: ["en"],
        defaultLng: "en",
        defaultNs: "translation",
        resource: {
            loadPath: "src/translation_scan.json",
            savePath: "src/translation_scan.json",
            jsonIndent: 2,
        },
        ns: ["translation"],
        defaultValue: (lng, ns, key) => key,
        keySeparator: false,
        nsSeparator: false,
        interpolation: {
            prefix: "{{",
            suffix: "}}",
        },
    },
};
