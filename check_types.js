const ts = require("typescript");
const path = require("path");

const configPath = ts.findConfigFile(
  "./",
  ts.sys.fileExists,
  "tsconfig.json"
);

if (!configPath) {
  console.log("Could not find a valid 'tsconfig.json'.");
  process.exit(1);
}

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedCommandLine = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(configPath)
);

const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
const emitResult = program.emit();

let allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

allDiagnostics.forEach(diagnostic => {
  if (diagnostic.file) {
    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  }
});

console.log(`Finished checking types. Found ${allDiagnostics.length} errors.`);
