# T-i18n

A lightweighted internationalization module for Deno that is simple to use.

## Usage

> Use double brackets `{{some.variable}}` to allow unsafe variable content  
> check **_unsafeButDoNotEscape_** example

```javascript
import { t, load } from "https://deno.land/x/t_i18n/mod.ts";

load("en", {
  welcome: "Welcome",
  myName: "My name is {first} {last}",
  myNameNestedArgs: "My name is {user.name.first} {user.name.last}",
  this: {
    is: {
      nested: "this is nested",
      nestedWith: { args: "this should show nested arg named {arg.name}" },
    },
  },
  unsafe: "this is unsafe {html}",
  unsafeButDoNotEscape: "this is unsafe {{html}}",
});

t("en", "welcome"); // "Welcome");

t("en", "myName", { first: "Mouadh", last: "Hsoumi" }); // "My name is Mouadh Hsoumi"

t("en", "myNameNestedArgs", {
  user: {
    name: {
      first: "Mouadh",
      last: "Hsoumi",
    },
  },
}); // "My name is Mouadh Hsoumi"

t("en", "this.is.nested"); // "this is nested");

t("en", "unsafe", { html: '<img src="url" />' }); // "this is unsafe &lt;img src=&quot;url&quot; /&gt;"

t("en", "unsafeButDoNotEscape", { html: '<img src="url" />' }); // 'this is unsafe <img src="url" />'
```

## License

MIT
