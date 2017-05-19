import { context } from 'f-promise';
import * as fs from 'fs';
import * as fsp from 'path';
import * as hb from 'handlebars';
// LOCALE should be a symbol but we keep a string for compat
const LOCALE = 'locale';

type Dict<T> = { [key: string]: T };
type Formatter = (args: any[]) => string;
interface CacheEntry {
	raw: Dict<string>;
	compiled: Dict<Formatter>;
}

const longMap = {
	ar: "ar-sa", // Arabic
	cz: "cz-cz", // Czech
	de: "de-de", // German
	//	en: "en-au", // English  Australia
	//	en: "en-gb", // English - British
	//	en: "en-ph", // Filipino
	en: "en-us", // English - American
	es: "es-es", // Spanish
	//	fr: "fr-ca", // French-Canada
	fr: "fr-fr", // French
	it: "it-it", // Italian
	pl: "pl-pl", // Polish
	pt: "pt-pt", // Portuguese
	ru: "ru-ru", // Russian
	zh: "zh-cn", // Chinese
	//	zh: "zh-tw", // Chinese tranditional
} as Dict<string>;

export class Locale {
	/// * `loc = locale.current;`
	///   returns the current locale, as a string ('en', 'en-US', 'fr-FR', etc.
	get current() {
		const cx = context();
		return cx[LOCALE] || 'en-US';

	}
	set current(locale: string) {
		const cx = context();
		cx[LOCALE] = locale;
	}
	get isRTL() {
		const locale = this.current.substring(0, 2);
		return locale === 'ar' || locale === 'iw';
	}

	resources(from: string) {
		return new Resources(from);
	}
}

export const locale = new Locale();

export class Resources {
	private static CACHE = {} as Dict<CacheEntry>;
	private _from: string;

	constructor(from: string) {
		debugger;
		this._from = from;
	}

	private _data(loc?: string) {
		loc = loc || locale.current;
		var key = this._from + '-' + loc,
			r = Resources.CACHE[key];
		if (!r) r = Resources.CACHE[key] = this._loadResources(loc);
		return r;

	}

	/// * `resources = locale.resources(l)`
	///   Returns a loader function for localized resources.
	///   Resource `foo` is loaded with `resources().foo`
	///   Warning: Returns a function. Do not forget the parentheses!
	private _loadResources(l: string) {
		const result = {} as Dict<string>;
		const _loadFile = (l: string) => {
			debugger;
			const dir = fsp.join(fsp.dirname(this._from), 'resources');
			const base = fsp.basename(this._from, '.js');
			if (!fs.existsSync(dir)) return result || {};
			let p = fsp.join(dir, base + '-' + l + '.json');
			var exists = fs.existsSync(p);
			if (!exists && l.length === 2) {
				var re = new RegExp('^' + base + '-' + l + '-\\w+\\.json$');
				var first = fs.readdirSync(dir).filter(function (s) {
					return re.test(s);
				})[0];
				if (first) {
					p = fsp.join(dir, first);
					exists = true;
				}
			}
			if (exists) {
				var delta = JSON.parse(fs.readFileSync(p, 'utf8'));
				if (!result) return delta;
				Object.assign(result, delta);
			}
			return result;
		}
		var r = _loadFile('en');
		var k = l.substring(0, 2);
		if (k !== 'en') r = _loadFile(k);
		if (l !== k) r = _loadFile(l);
		return {
			raw: r,
			compiled: {},
		};
	}

	message(key: string, locale?: string) {
		const resources = this._data(locale);
		return resources.raw[key];
	}

	formatter(key: string, locale?: string) {
		const resources = this._data(locale);
		let fn = resources.compiled[key];
		if (!fn) fn = resources.compiled[key] = hb.compile(this.message(key, locale));
		return fn;
	}
	format(key: string, ...args: any[]) {
		return this.formatter(key)(args);
	}

	allFormatters(key: string) {
		const all = {
			"default": this.formatter(key),
		} as Dict<Formatter>;
		Object.keys(longMap).forEach(lang => {
			var res = this.formatter(key);
			if (lang === "en" || (lang !== "en" && res !== all.default)) all[longMap[lang]] = res;
		});
		return all;
	};
	parseAcceptLanguage(str: string) {
		// for now just take the first; TODO: take the best really supported from the list
		var a = (str || "").split(",")[0].split(';');
		var res = a[0];
		// prefer long format: Can be dangerous a better way would be to have mapping between short format and a long one.
		a.forEach(function (l) {
			if (l.indexOf("-") >= 0) res = l;
		});
		return res;
	};
	longIso(isocode: string) {
		isocode = isocode.toLowerCase();
		return isocode.length >= 5 ? isocode : longMap[isocode.substring(0, 2)];
	};
}
