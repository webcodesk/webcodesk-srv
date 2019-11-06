export function findMarkdownDeclarations (sourceCode) {
  const declarations = [];
  try {
    const markdownDeclaration = {
      markdownContent: sourceCode,
    };
    declarations.push(markdownDeclaration);
  } catch (e) {
    console.error('Parsing the markdown source: ', e);
    // do nothing...
  }
  return declarations;
}
