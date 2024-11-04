const path = require('path');

module.exports = {
    entry: './source_code.js',  // seu arquivo de entrada
    output: {
        filename: 'bundle.js',  // nome do arquivo gerado
        path: path.resolve(__dirname, 'dist'),  // pasta de saída
    },
    mode: 'production',  // ou 'production'
};

// Para traspilação automática TS (durante desenvolvimento):
// module.exports = {
//     entry: './teste.ts',
//     module: {
//       rules: [
//         {
//           test: /\.ts$/,
//           use: 'ts-loader',
//           exclude: /node_modules/,
//         },
//       ],
//     },
//     resolve: {
//       extensions: ['.ts', '.js'],
//     },
//     watch: true,  // Ativa o modo de observação
//   };