## Notas / procedimientos y comandos generales



### Scripts

**Correr todas las pruebas**
```bash
npm run test
```

**Probar la aplicacion antes de construirla (package.json)**
```ts
"scripts": {
  "build": "npm run test && nest build",
}
```

**Correr las pruebas y detectar los cambios --watch**
```bash
npm run test:watch
```

**Ejecutar la cobertura de los test**
(Genera la carpeta coverage y se puede abrir el archivo ./lcov-report/index.html para ver la cobertura en el navegador)
```bash
npm run test:cov
```


**Correr los test e2e**
```bash
npm run test:e2e
```
