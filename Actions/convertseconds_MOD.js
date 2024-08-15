/*
 Mod for converting seconds to:
 Year,Month,Day,Hour,Minute
*/
module.exports = {
	data: {
	  name: "Convert Seconds",
	},
	info: {
	  source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
	  creator: "lik_rus",
	},
	category: "Numbers",

	UI: [
    {
      element: "input",
      name: "Seconds",
      storeAs: "time"
    },
    "-",
    {
		element: "halfDropdown",
		name: "Date type",
		storeAs: "tipo",
		choices: [
		  {
			name: "Ignore groups equal to 0",
		  },
		  {
			name: "Ignore groups equal to 0 and years/months"
		  },
		  {
			name: "Ignore groups equal to 0 and years/months/days"
		  },
		  {
			name: "[Minimum 2 digits] Ignore groups equal to 0"
		  },
		  {
			name: "[Minimum 2 digits] Ignore groups equal to 0 and years/months"
		  },
		  {
			name: "[Minimum 2 digits] Ignore groups equal to 0 and years/months/days"
		  },
		  {
			name: "Show all groups"
		  },
		  {
			name: "Show only groups of days/hours/minutes/seconds"
		  },
		  {
			name: "Show only the hours/minutes/seconds groups"
		  },
		  {
			name: "[Minimum 2 digits] Show all groups"
		  },
		  {
			name: "[Minimum 2 digits] Show only groups of days/hours/minutes/seconds"
		  },
		  {
			name: "[Minimum 2 digits] Show only the hours/minutes/seconds groups"
		  },
		]
	  },
	  "-",
	  {
		element: "inputGroup",
		nameSchemes: ["Years", "Months"],
		storeAs: ["ano", "meses"]
	  },
	  {
		element: "inputGroup",
		nameSchemes: ["Days", "Watch"],
		storeAs: ["dia", "hora"]
	  },
	  {
		element: "inputGroup",
		nameSchemes: ["Minutes", "Seconds"],
		storeAs: ["min", "seg"]
	  },
	  "-",
	  {
		element: "inputGroup",
		nameSchemes: ["Year", "Month"],
		storeAs: ["ano2", "meses2"]
	  },
	  {
		element: "inputGroup",
		nameSchemes: ["Day", "Hour"],
		storeAs: ["dia2", "hora2"]
	  },
	  {
		element: "inputGroup",
		nameSchemes: ["Minute", "Second"],
		storeAs: ["min2", "seg2"]
	  },
	  "-",
	  {
		element: "store",
		name: "Store As",
		storeAs: "storage"
	  }
],
subtitle: (data, constants) => {
    return `Convert "${data.time} seconds"`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {

	let time = Number(
		bridge.transf(values.time)
	  );

	const ano = bridge.transf(values.ano);
	const meses = bridge.transf(values.meses);
	const dia = bridge.transf(values.dia);
	const hora = bridge.transf(values.hora);
	const min = bridge.transf(values.min);
	const seg = bridge.transf(values.seg);
	const ano2 = bridge.transf(values.ano2);
	const meses2 = bridge.transf(values.meses2);
	const dia2 = bridge.transf(values.dia2);
	const hora2 = bridge.transf(values.hora2);
	const min2 = bridge.transf(values.min2);
	const seg2 = bridge.transf(values.seg2);

	let d, h, m, s;
	let result;

	   s = time;

		m = Math.floor(s / 60);
		s = s % 60;
		h = Math.floor(m / 60);
		m = m % 60;
		a = Math.floor(time / 60 / 60 / 24 / 365.242214);
		mes = Math.floor(time / 60 / 60 / 24 / 30.43685116666667 - (a * 12));
		d = Math.floor(h / 24 - (a * 365.242214) - (30.43685116666667 * mes));
		h = h % 24;

		decimal_a = a < 10 ? "0" + a : a;
		decimal_mes = mes < 10 ? "0" + mes : mes;
		decimal_d = d < 10 ? "0" + d : d;
		decimal_h = h < 10 ? "0" + h : h;
		decimal_m = m < 10 ? "0" + m : m;
		decimal_s = s < 10 ? "0" + s : s;

		s2 = time;
		m2 = Math.floor(s2 / 60);
		s2 %= 60;
		h2 = Math.floor(m2 / 60);
		m2 %= 60;
		d2 = Math.floor(h2 / 24);
		h2 %= 24;
		decimal_d2 = d2 < 10 ? "0" + d2 : d2;
		decimal_h2 = h2 < 10 ? "0" + h2 : h2;
		decimal_m2 = m2 < 10 ? "0" + m2 : m2;
		decimal_s2 = s2 < 10 ? "0" + s2 : s2;

		s3 = time;
		m3 = Math.floor(s3 / 60);
		s3 %= 60;
		h3 = Math.floor(m3 / 60);
		m3 %= 60;
		decimal_h3 = h3 < 10 ? "0" + h3 : h3;
		decimal_m3 = m3 < 10 ? "0" + m3 : m3;
		decimal_s3 = s3 < 10 ? "0" + s3 : s3;



		switch (values.tipo) {
			case "Ignore groups equal to 0":
				result = (a > 1 ? ''+ a + ano : '') + (a == 1 ? ''+ a + ano2 : '') + (mes > 1 ? ''+ mes + meses : '') + (mes == 1 ? ''+ mes + meses2 : '') + (d > 1 ? d + dia : '') + (d == 1 ? ''+ d + dia2 : '') + (h > 1 ? h + hora : '') + (h == 1 ? ''+ h + hora2 : '') + (m > 1 ? m + min : '') + (m == 1 ? ''+ m + min2 : '') + (s > 1 ? s + seg : '') + (s == 1 ? ''+ s + seg2 : '');
			  break;
			case "Show all groups":
				result = (a > 1 ? ''+ a + ano : '') + (a == 1 ? ''+ a + ano2 : '') + (a == 0 ? ''+ a + ano : '') + (mes > 1 ? ''+ mes + meses : '') + (mes == 1 ? ''+ mes + meses2 : '') + (mes == 0 ? ''+ mes + meses : '') + (d > 1 ? d + dia : '') + (d == 1 ? ''+ d + dia2 : '') + (d == 0 ? ''+ d + dia : '') + (h > 1 ? h + hora : '') + (h == 1 ? ''+ h + hora2 : '') + (h == 0 ? ''+ h + hora : '') + (m > 1 ? m + min : '') + (m == 1 ? ''+ m + min2 : '') + (m == 0 ? ''+ m + min : '') + (s > 1 ? s + seg : '') + (s == 1 ? ''+ s + seg2 : '') + (s == 0 ? ''+ s + seg : '');
			  break;
			  case "[Minimum 2 digits] Show all groups":
				result = (a > 1 ? ''+ decimal_a + ano : '') + (a == 1 ? ''+ decimal_a + ano2 : '') + (a == 0 ? ''+ decimal_a + ano : '') + (mes > 1 ? ''+ decimal_mes + meses : '') + (mes == 1 ? ''+ decimal_mes + meses2 : '') + (mes == 0 ? ''+ decimal_mes + meses : '') + (d > 1 ? decimal_d + dia : '') + (d == 1 ? ''+ decimal_d + dia2 : '') + (d == 0 ? ''+ decimal_d + dia : '') + (h > 1 ? decimal_h + hora : '') + (h == 1 ? ''+ decimal_h + hora2 : '') + (h == 0 ? ''+ decimal_h + hora : '') + (m > 1 ? decimal_m + min : '') + (m == 1 ? ''+ decimal_m + min2 : '') + (m == 0 ? ''+ decimal_m + min : '') + (s > 1 ? decimal_s + seg : '') + (s == 1 ? ''+ decimal_s + seg2 : '') + (s == 0 ? ''+ decimal_s + seg : '');
			  break;
			  case "[Minimum 2 digits] Show only groups of days/hours/minutes/seconds":
				result = (d > 1 ? decimal_d2 + dia : '') + (d == 1 ? ''+ decimal_d2 + dia2 : '') + (d == 0 ? ''+ decimal_d2 + dia : '') + (h > 1 ? decimal_h2 + hora : '') + (h == 1 ? ''+ decimal_h2 + hora2 : '') + (h == 0 ? ''+ decimal_h2 + hora : '') + (m > 1 ? decimal_m2 + min : '') + (m == 1 ? ''+ decimal_m2 + min2 : '') + (m == 0 ? ''+ decimal_m2 + min : '') + (s > 1 ? decimal_s2 + seg : '') + (s == 1 ? ''+ decimal_s2 + seg2 : '') + (s == 0 ? ''+ decimal_s2 + seg : '');
			  break;
			  case "[Minimum 2 digits] Show only the hours/minutes/seconds groups":
				result = (h > 1 ? decimal_h3 + hora : '') + (h == 1 ? ''+ decimal_h3 + hora2 : '') + (h == 0 ? ''+ decimal_h3 + hora : '') + (m > 1 ? decimal_m3 + min : '') + (m == 1 ? ''+ decimal_m3 + min2 : '') + (m == 0 ? ''+ decimal_m3 + min : '') + (s > 1 ? decimal_s3 + seg : '') + (s == 1 ? ''+ decimal_s3 + seg2 : '') + (s == 0 ? ''+ decimal_s3 + seg : '');
			  break;
			  case "[Minimum 2 digits] Ignore groups equal to 0":
				result = (a > 1 ? ''+ decimal_a + ano : '') + (a == 1 ? ''+ decimal_a + ano2 : '') + (mes > 1 ? ''+ decimal_mes + meses : '') + (mes == 1 ? ''+ decimal_mes + meses2 : '') + (d > 1 ? decimal_d + dia : '') + (d == 1 ? ''+ decimal_d + dia2 : '') + (h > 1 ? decimal_h + hora : '') + (h == 1 ? ''+ decimal_h + hora2 : '') + (m > 1 ? decimal_m + min : '') + (m == 1 ? ''+ decimal_m + min2 : '') + (s > 1 ? decimal_s + seg : '') + (s == 1 ? ''+ decimal_s + seg2 : '');
			  break;
			  case "[Minimum 2 digits] Ignore groups equal to 0 and years/months":
				result =  (d > 1 ? decimal_d2 + dia : '') + (d == 1 ? ''+ decimal_d2 + dia2 : '') + (h > 1 ? decimal_h2 + hora : '') + (h == 1 ? ''+ decimal_h2 + hora2 : '') + (m > 1 ? decimal_m2 + min : '') + (m == 1 ? ''+ decimal_m2 + min2 : '') + (s > 1 ? decimal_s2 + seg : '') + (s == 1 ? ''+ decimal_s2 + seg2 : '');
			  break;
			  case "[Minimum 2 digits] Ignore groups equal to 0 and years/months/days":
				result =  (h > 1 ? decimal_h3 + hora : '') + (h == 1 ? ''+ decimal_h3 + hora2 : '') + (m > 1 ? decimal_m3 + min : '') + (m == 1 ? ''+ decimal_m3 + min2 : '') + (s > 1 ? decimal_s3 + seg : '') + (s == 1 ? ''+ decimal_s3 + seg2 : '');
			  break;
			  case "Show only groups of days/hours/minutes/seconds":
				result = (d > 1 ? d2 + dia : '') + (d == 1 ? ''+ d2 + dia2 : '') + (d == 0 ? ''+ d2 + dia : '') + (h > 1 ? h2 + hora : '') + (h == 1 ? ''+ h2 + hora2 : '') + (h == 0 ? ''+ h2 + hora : '') + (m > 1 ? m2 + min : '') + (m == 1 ? ''+ m2 + min2 : '') + (m == 0 ? ''+ m2 + min : '') + (s > 1 ? s2 + seg : '') + (s == 1 ? ''+ s2 + seg2 : '') + (s == 0 ? ''+ s2 + seg : '');
			  break;
			  case "Show only the hours/minutes/seconds groups":
				result = (h > 1 ? h3 + hora : '') + (h == 1 ? ''+ h3 + hora2 : '') + (h == 0 ? ''+ h3 + hora : '') + (m > 1 ? m3 + min : '') + (m == 1 ? ''+ m3 + min2 : '') + (m == 0 ? ''+ m3 + min : '') + (s > 1 ? s3 + seg : '') + (s == 1 ? ''+ s3 + seg2 : '') + (s == 0 ? ''+ s3 + seg : '');
			  break;
			  case "Ignore groups equal to 0 and years/months":
				result =  (d > 1 ? d2 + dia : '') + (d == 1 ? ''+ d2 + dia2 : '') + (h > 1 ? h2 + hora : '') + (h == 1 ? ''+ h2 + hora2 : '') + (m > 1 ? m2 + min : '') + (m == 1 ? ''+ m2 + min2 : '') + (s > 1 ? s2 + seg : '') + (s == 1 ? ''+ s2 + seg2 : '');
			  break;
			  case "Ignore groups equal to 0 and years/months/days":
				result =  (h > 1 ? h3 + hora : '') + (h == 1 ? ''+ h3 + hora2 : '') + (m > 1 ? m3 + min : '') + (m == 1 ? ''+ m3 + min2 : '') + (s > 1 ? s3 + seg : '') + (s == 1 ? ''+ s3 + seg2 : '');
			  break;
		}

		bridge.store(values.storage, result)
  },
};