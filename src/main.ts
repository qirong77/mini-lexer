import { parse } from "./lexer"

const testStr = `
// 定义一个函数，计算两个数字的和
function addNumbers(a, b) {
  return a + b;
}

// 调用函数并打印结果
const num1 = 5;
const num2 = 3;
const string = 'xxxx'
const sum = addNumbers(num1, num2);
`
console.log(parse(testStr))
