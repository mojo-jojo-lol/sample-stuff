import path from 'path';

export default async function eslint(
  {
    files, eslintConfigPath, eslintignorePath,
    githubWorkspace, customDirectory, title
  }
) {
  const { ESLint } = (
    await import(path.join(process.cwd(), customDirectory,
      'node_modules/eslint/lib/api.js')).then((
      (module) => (
        module.default
      )
    ))
  );
  const cli = new ESLint({
    useEslintrc: false,
    overrideConfigFile: path.join(githubWorkspace, eslintConfigPath),
    ignore: true,
    ignorePath: eslintignorePath,
    resolvePluginsRelativeTo: path.join(githubWorkspace, customDirectory, 'node_modules'),
    extensions: ['.js', '.jsx', '.tsx']
  });
  const report = await cli.lintFiles(files);

  const levels = ['', 'warning', 'failure'];

  const annotations = [];
  let totalErrorCount = 0;
  let totalWarningCount = 0;
  for (const result of report) {
    const { filePath, messages, errorCount, warningCount } = result;
    totalErrorCount = totalErrorCount + errorCount;
    totalWarningCount = totalWarningCount + warningCount;
    const path = filePath.substring(githubWorkspace.length + 1);
    for (const msg of messages) {
      const {
        line, severity,
        ruleId, message,
        endLine
      } = msg;
      const annotationLevel = levels[severity];
      if (!cli.isPathIgnored(filePath)) {
        // current limit is 50 annotations per request
        if (annotations.length >= 50) {
          break;
        }
        annotations.push({
          path,
          start_line: line,
          end_line: endLine,
          annotation_level: annotationLevel,
          message: `[${ruleId}] ${message}`
        });
      }
    }
  }
  return {
    conclusion: totalErrorCount > 0 ? 'failure' : 'success',
    output: {
      title,
      summary: `${totalErrorCount} error(s), ${totalWarningCount} warning(s) found`,
      annotations
    }
  };
}