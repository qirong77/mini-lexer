const KEY_WORDS = ["var", "const", "function", "console", "return"];
const BRCKTETS = ["(", ")", "[", "]", "{", "}"];
const NOT_HANLDES = [",", " ", ".", ";"];
const OPERATOR = ["+", "?", ":", "-", "="];
enum TOKEN_TYPES {
  "KEYWORDS" = "KEYWORDS",
  "BRCKET" = "BRCKET",
  "VARIABLE" = "VARIABLE",
  "EOL" = "EOL",
  "NUMBER" = "NUMBER",
  "COMMENT" = "COMMENT",
  "OPERATOR" = "OPERATOR",
  "UNHANDLE" = "UNHANDLE",
  "STRING" = "STRING",
}
export const parse = (doc: string) => {
  let index = 0;
  const results: {
    type: TOKEN_TYPES;
    value: string;
  }[] = [];
  while (true) {
    const i = doc[index];
    const r = doc[index + 1];
    if (i === undefined) break;
    if (NOT_HANLDES.includes(i)) {
      colltect(TOKEN_TYPES.UNHANDLE, i);
      continue;
    }
    if (i === "\n") {
      colltect(TOKEN_TYPES.EOL, "\n");
      continue;
    }
    // bracket
    if (BRCKTETS.includes(i)) {
      colltect(TOKEN_TYPES.BRCKET, i);
      continue;
    }
    // operator
    if (OPERATOR.includes(i)) {
      const nextChar = doc[index + 1];
      if (OPERATOR.includes(nextChar)) {
        colltect(TOKEN_TYPES.OPERATOR, i + nextChar);
      } else colltect(TOKEN_TYPES.OPERATOR, i);
      continue;
    }
    // variable
    if (/[a-zA-Z_$]/.test(i)) {
      const string = getString(index, doc, /[\w_$]/);
      colltect(
        KEY_WORDS.includes(string)
          ? TOKEN_TYPES.KEYWORDS
          : TOKEN_TYPES.VARIABLE,
        string
      );
      continue;
    }
    // string
    if (i === '"' || i === "'") {
      const string = getString(
        index,
        doc,
        i === '"' ? /[^\"]/ : /[^\']/,
        new RegExp(i)
      );
      colltect(TOKEN_TYPES.STRING, string);
      continue;
    }
    // number
    if (/\d/.test(i)) {
      const num = getString(index, doc, /\d/);
      colltect(TOKEN_TYPES.NUMBER, num);
      continue;
    }
    // comnent
    if (i === "/" && r === "/") {
      const comment = getString(index, doc, /./);
      colltect(TOKEN_TYPES.COMMENT, comment);
      continue;
    }
    index++;
    console.warn("没有处理该字符入口" + i);
  }
  return results;
  function colltect(type: TOKEN_TYPES, value: string) {
    index += value.length;
    results.push({ type, value });
  }
};

function getString(index: number, doc: string, regex = /\w/, endChar?: RegExp) {
  let str = doc[index];
  let nextChar = doc[index + 1] || "";
  index++;
  if (nextChar === undefined) {
    return str;
  }
  while (regex.test(nextChar)) {
    str += nextChar;
    index += 1;
    nextChar = doc[index];
    if (nextChar === undefined) break;
    if (endChar?.test(nextChar)) {
      str += nextChar;
      break;
    }
  }
  return str;
}
