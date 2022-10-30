import { assertEquals } from 'https://deno.land/std@0.135.0/testing/asserts.ts';
import { initTranslation, load } from './mod.ts';

const enTranslation = {
  welcome: 'Welcome',
  myName: 'My name is {first} {last}',
  myNameNestedArgs: 'My name is {user.name.first} {user.name.last}',
  this: {
    is: {
      nested: 'this is nested',
      nestedWith: { args: 'this should show nested arg named {arg.name}' },
    },
  },
  unsafe: 'this is unsafe {html}',
  unsafeButDoNotEscape: 'this is unsafe {{html}}',
};

const frTranslation = {
  welcome: 'Bienvenue',
  myName: 'Mon nom est {first} {last}',
  myNameNestedArgs: 'Mon nom est {user.name.first} {user.name.last}',
  this: {
    is: {
      nested: 'c\'est imbriqué',
      nestedWith: {
        args: 'cela devrait afficher un argument imbriqué nommé {arg.name}',
      },
    },
  },
  unsafe: 'ceci n\'est pas sécurisé {html}',
  unsafeButDoNotEscape: 'ceci n\'est pas sécurisé {{html}}',
};

load('en', enTranslation);
load('fr', frTranslation);

const t = initTranslation<typeof enTranslation>();

Deno.test({
  name: 'Simple translation',
  fn(): void {
    assertEquals(t('en', 'welcome'), 'Welcome');
    assertEquals(t('fr', 'welcome'), 'Bienvenue');
  },
});

Deno.test({
  name: 'Simple translation with args',
  fn(): void {
    assertEquals(
      t('en', 'myName', {
        first: 'Mouadh',
        last: 'Hsoumi',
      }),
      'My name is Mouadh Hsoumi',
    );
    assertEquals(
      t('fr', 'myName', {
        first: 'Mouadh',
        last: 'Hsoumi',
      }),
      'Mon nom est Mouadh Hsoumi',
    );
  },
});
Deno.test({
  name: 'Simple translation with nested args',
  fn(): void {
    assertEquals(
      t('en', 'myNameNestedArgs', {
        user: {
          name: {
            first: 'Mouadh',
            last: 'Hsoumi',
          },
        },
      }),
      'My name is Mouadh Hsoumi',
    );
    assertEquals(
      t('fr', 'myNameNestedArgs', {
        user: {
          name: {
            first: 'Mouadh',
            last: 'Hsoumi',
          },
        },
      }),
      'Mon nom est Mouadh Hsoumi',
    );
  },
});

Deno.test({
  name: 'Nested translation',
  fn(): void {
    assertEquals(t('en', 'this.is.nested'), 'this is nested');
    assertEquals(t('fr', 'this.is.nested'), 'c\'est imbriqué');
  },
});

Deno.test({
  name: 'Nested translation with nested args',
  fn(): void {
    assertEquals(
      t('en', 'this.is.nestedWith.args', { arg: { name: 'NESTED' } }),
      'this should show nested arg named NESTED',
    );
    assertEquals(
      t('fr', 'this.is.nestedWith.args', { arg: { name: 'NESTED FR' } }),
      'cela devrait afficher un argument imbriqué nommé NESTED FR',
    );
  },
});

Deno.test({
  name: 'Escape unsafe translation',
  fn(): void {
    assertEquals(
      t('en', 'unsafe', { html: '<img src="url" />' }),
      'this is unsafe &lt;img src=&quot;url&quot; /&gt;',
    );
  },
});

Deno.test({
  name: 'Don\'t escape unsafe translation',
  fn(): void {
    assertEquals(
      t('en', 'unsafeButDoNotEscape', { html: '<img src="url" />' }),
      'this is unsafe <img src="url" />',
    );
  },
});
