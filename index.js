const matchTable = {
  "}": "{",
  "]": "[",
  ")": "("
};
const contentMatchRegExp = /[\[\(\[\{\'\"\`}\]\)\]]/;
const doubleQuotesMatchRegExp = /(?<!\\\\)"/;
const singleQuotesMatchRegExp = /(?<!\\\\)'/;
const combiningGraveAccentMatchRegExp = /(?<!\\\\)`/;
const slashMatchRegExp = /(?<!\\\\)\//;
const functionStartRegExp = /[0~9]|[a~z]|[A~Z]|\./;

function getCharRegExp(char) {
  switch (char) {
    case '"':
      return doubleQuotesMatchRegExp;
    case "'":
      return singleQuotesMatchRegExp;
    case "`":
      return combiningGraveAccentMatchRegExp;
    case "/":
      return slashMatchRegExp;
  }
}

function doStrip(content, index) {
  const stack = ["("];
  let _idx = Number(content.indexOf("(", index) + 1),
    restContent = content.substr(_idx);

  while (stack.length > 0) {
    const matchResult = restContent.match(contentMatchRegExp);
    if (matchResult) {
      const matchedChar = matchResult[0];
      const matchIndex = matchResult.index + 1;

      switch (matchedChar) {
        case "/":
        case "'":
        case "`":
        case '"':
          // process string and reg
          const nextIndex =
            1 +
            restContent.substr(matchIndex).search(getCharRegExp(matchedChar));
          _idx += Number(matchIndex + nextIndex);
          break;
        default:
          // process brackts
          if (matchTable[matchedChar] === stack[stack.length - 1]) {
            stack.pop();
          } else {
            stack.push(matchedChar);
          }
          _idx += Number(matchIndex);
          break;
      }
      restContent = content.substr(_idx);
    } else {
      break;
    }
  }
  return content.substr(0, index) + content.substr(_idx);
}

function StripFunctionCallLoader(content) {
  const { funcCall } = this.query;
  if (funcCall) {
    let index = content.indexOf(funcCall);
    if (index === 0) {
      content = doStrip(content, index);
      index = content.indexOf(funcCall, index);
    }
    while (index !== -1) {
      const preChar = content[index - 1];
      if (!functionStartRegExp.test(preChar)) {
        content = doStrip(content, index);
      }
      index = content.indexOf(funcCall, index);
    }
  }

  this.callback(null, content);
}

module.exports = StripFunctionCallLoader;
