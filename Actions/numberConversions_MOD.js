modVersion = "v2.1.5"
module.exports = {
  data: {
    name: "Number Conversions",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Numbers",
  aliases: ["Format Numbers"],
  modules: ["mathjs"],
  UI: [
    {
      element: "largeInput",
      storeAs: "OriginalNum",
      name: "Number (Can Be Expression)",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "convType",
      name: "Conversions",
      choices: {
        plain: { name: "Plain Number | Example: 123.456", field: false },
        standard: { name: "Standardized Expression | Example: 12,345.678", field: false },
        sciNot: { name: "Scientific Notation | Example: 1.234×10⁵", field: false },
        generalized: { name: "Generalized Expression | Example: 1.23 + K/M/B/T", field: false },
        log2r: { name: "Log2r | Example: 2³+1", field: false },
        primeFactors: { name: "Prime Factors | Example: 2³×3²x11", field: false },
        price: { name: "Price | Example: 1234.56", field: false },
        standardPrice: { name: "Standardized Price | Example: 1,234.56", field: false },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "decimalNotation",
      name: "Decimal Symbol",
      choices: {
        period: { name: `Period | .`, field: false },
        comma: { name: `Comma | ,`, field: false },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "exponentPresentation",
      name: "Present Exponents As",
      choices: {
        superscript: { name: "Superscript | nⁿ", field: false },
        caret: { name: "Caret | n^n", field: false },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    return `Express ${values.OriginalNum} as ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[values.convType.type].name
    } | Stored as: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const { evaluate } = require("mathjs")
    let conversionType = bridge.transf(values.convType.type)
    let decimalNotation = bridge.transf(values.decimalNotation.type) || "period"
    let exponentPresentation = bridge.transf(values.exponentPresentation.type) || "caret"

    const switchDecNotation = (num) => {
      let [whole, dec] = String(num).split(".")
      whole = whole.replaceAll(",", ".")
      return dec ? `${whole},${dec}` : whole
    }

    function toSuperscript(num) {
      const superscriptMap = {
        0: "⁰",
        1: "¹",
        2: "²",
        3: "³",
        4: "⁴",
        5: "⁵",
        6: "⁶",
        7: "⁷",
        8: "⁸",
        9: "⁹",
        "+": "⁺",
        "-": "⁻",
        "=": "⁼",
        "(": "⁽",
        ")": "⁾",
      }
      return String(num)
        .split("")
        .map((char) => superscriptMap[char] || char)
        .join("")
    }

    function parseSuperScript(expression) {
      const normalizeSuperscriptMap = {
        "⁰": "0",
        "¹": "1",
        "²": "2",
        "³": "3",
        "⁴": "4",
        "⁵": "5",
        "⁶": "6",
        "⁷": "7",
        "⁸": "8",
        "⁹": "9",
        "⁺": "+",
        "⁻": "-",
        "⁼": "=",
        "⁽": "(",
        "⁾": ")",
      }
      normalizedExpression = expression.replace(/([0-9.]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾]+)/g, (_, base, exponent) => {
        let normalizeSuper = exponent
          .split("")
          .map((char) => normalizeSuperscriptMap[char] || char)
          .join("")
        return `${base}^${normalizeSuper}`
      })

      return normalizedExpression
    }

    let originalExpression = parseSuperScript(bridge.transf(values.OriginalNum))

    let input = 0
    let convertedTxt
    try {
      input = evaluate(originalExpression)
      let number = parseFloat(input)

      if (!isNaN(number) && number <= 1.7e308) {
        switch (conversionType) {
          case "plain":
          case "Normal":
            convertedTxt = number
            break

          case "standard":
          case "Standardise":
            convertedTxt = number.toLocaleString()
            break

          case "sciNot":
          case "SciNot":
            let sciNotValues = number.toExponential().split("e")
            let exponent = parseInt(sciNotValues[1])
            let coefficient = parseFloat(sciNotValues[0]).toFixed(3)
            if (exponentPresentation == "superscript") {
              convertedTxt = `${coefficient}×10${toSuperscript(exponent)}`
            } else if (exponentPresentation == "caret") {
              convertedTxt = `${coefficient}x10^${exponent}`
            }
            break

          case "generalized":
          case "Generalise":
            if (number >= 1e12) {
              convertedTxt = (number / 1e12).toFixed(2) + "T"
            } else if (number >= 1e9) {
              convertedTxt = (number / 1e9).toFixed(2) + "B"
            } else if (number >= 1e6) {
              convertedTxt = (number / 1e6).toFixed(2) + "M"
            } else if (number >= 1e3) {
              convertedTxt = (number / 1e3).toFixed(2) + "K"
            } else {
              convertedTxt = number
            }
            break

          case "log2r":
          case "Log2r":
            const expressAsP2 = (num) => {
              let exponent = Math.floor(Math.log2(num))
              let highestPowerOf2 = Math.pow(2, exponent)
              let remainder = num - highestPowerOf2
              if (remainder === 0) {
                if (exponentPresentation == "superscript") {
                  return `2${toSuperscript(exponent)}`
                } else if (exponentPresentation == "caret") {
                  return `2^${exponent}`
                }
              } else {
                if (exponentPresentation == "superscript") {
                  return `2${toSuperscript(exponent)}+${remainder}`
                } else if (exponentPresentation == "caret") {
                  return `2^${exponent}+${remainder}`
                }
              }
            }
            if (number < 0) {
              convertedTxt = `Number Needs To Be Positive To Be Represented As Log2r`
            } else {
              convertedTxt = expressAsP2(number)
            }
            break

          case "primeFactors":
          case "PrimeFactors":
            const expressAsPF = (num) => {
              let factors = {}
              let divisor = 2

              while (num % 2 === 0) {
                factors[2] = (factors[2] || 0) + 1
                num /= 2
              }

              for (let divisor = 3; divisor <= Math.sqrt(num); divisor += 2) {
                while (num % divisor === 0) {
                  factors[divisor] = (factors[divisor] || 0) + 1
                  num /= divisor
                }
              }

              if (num > 2) {
                factors[num] = (factors[num] || 0) + 1
              }

              let reducedFactors = []

              for (let [prime, count] of Object.entries(factors)) {
                if (count > 1) {
                  if (exponentPresentation == "superscript") {
                    reducedFactors.push(`${prime}${toSuperscript(count)}`)
                  } else if (exponentPresentation == "caret") {
                    reducedFactors.push(`${prime}^${count}`)
                  }
                } else {
                  reducedFactors.push(`${prime}`)
                }
              }

              return reducedFactors.join("×")
            }

            convertedTxt = expressAsPF(number)
            break

          case "price":
          case "Price":
            convertedTxt = number.toFixed(2)
            break

          case "standardPrice":
          case "GeneralisedPrice":
            let parts = number.toFixed(2).split(".")
            let formattedDollar = parseInt(parts[0]).toLocaleString()
            convertedTxt = `${formattedDollar}.${parts[1]}`
            break
        }

        if (decimalNotation == "comma") {
          convertedTxt = switchDecNotation(convertedTxt)
        }

        bridge.store(values.store, convertedTxt)
      } else {
        bridge.store(values.store, `Number Format Not Supported Or Is Too Big.`)
      }
    } catch (error) {
      console.log(error)
      bridge.store(values.store, error)
    }
  },
}
