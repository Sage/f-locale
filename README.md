# f-mocha

Mocha wrapper for f-promise

`f-mocha` is a companion package for [`f-promise`](https://github.com/Sage/f-promise). 
It provides a small helper to manage localized messages.

## Installation

``` sh
npm install --save f-locale
```

## Usage

```js
import { locale } from 'f-locale';
const resources = locale.resources(module);

// setting the locale
locale.current = 'fr';
// loading a simple message
const msg1 = resources.message('simple')
// formating a parameterized message
const msg2 = resources.message('complex', 'hello', 5);
```

## License

MIT.

