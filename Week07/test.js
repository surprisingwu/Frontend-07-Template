function StringToNumber(v) {
  if(typeof v !== 'string') return `${v} is not a string`

  const hasNegative = v < 0
  v = hasNegative ? v.slice(1) : v;
  const numberPart = (/(\w+)\./.exec(v)||[])[1] || v

  if(!Number(numberPart) > Number.MAX_SAFE_INTEGER) throw new Error(`超出数字的最大值限制`)

  return hasNegative ? -Number(v) : Number(v)
}

function NumberToString(v, radix) {
  if (Number.isInteger(v) && !Number.isSafeInteger(v)) return `${value} 超出限制`
  return v.toString(radix)
}