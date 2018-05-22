// Type definitions for Countable.js 3.0.0
// Project: countable
// Definitions by: youjenli youjenli1124+pub@gmail.com

/**
 * How to use this library in typescript?
 * 
 * If you want to use this library in terms of typescript module, 
 * which means you want to import functions exported from this module to another module and invoke them later, 
 * then you should add this library to your typescript code by expression `import * as Countable from 'path/to/this/project';` 
 * or simply import functions which you want to invoke by `import { on, off } from 'path/to/this/project'`.
 * Since this library was written in UMD, imported-functions can be load by the module loader  
 * which you have specified in tsc settings `module` from javascript source file `Countable.js` without occupancy of global namespace. 
 * 
 * The other way is to call this library in a non-modular javascript file through global namespace.
 * By calling 'non-modular' javascript file, it means that export and import expressions are not allowed in these js file,
 * otherwise typescript transpiler will report error.
 * 
 * The first thing you have to do in this case is to let tsc know where is the javascript source file of this library by adding directives 
 * `/// <reference path="path/to/countable/index.d.ts" />` on the top of javascript file which utilize this library.
 * After that you can invoke functions of this library from global variable `Countable` (e.g. `Countable.count(elements, callback, )`)
 * in your module without warning from development tool which perform type checking for you. 
 * Notice that in case of importing Countable to global namespace, you will be responsible for concatenating the javascript file of this library 
 * with your code if you want to, as well as link it to your runtime.
 *
 */

/**
 * The `on` method binds the counting handler to all given elements. The
 * event is either `oninput` or `onkeydown`, based on the capabilities of
 * the browser.
 *
 * @param elements All elements that should receive the Countable functionality.
 *
 * @param callback The callback to fire whenever the element's value changes.
 *                 The callback is called with the relevant element bound to `this` 
 *                 and the counted values as the single parameter.
 *
 * @param options An object to modify Countable's behaviour.
 *
 * @return Returns the Countable object to allow for chaining if the binding complete successfully. Returns void if the argument is not valid. 
 */
export function on(elements: NodeList | HTMLCollection | Element,
    callback?: (counter: {
        paragraphs: number
        sentences: number
        words: number
        characters: number
        all: number
    }) => void,
    options?: {
        hardReturns?: boolean
        stripTags?: boolean
        ignore?: string[]
    }): Countable

/**
* The `off` method removes the Countable functionality from all given
* elements.
*
* @param elements All elements whose Countable functionality should be unbound.
*
* @return Returns the Countable object to allow for chaining.
*/
export function off(elements: NodeList | HTMLCollection | Element): Countable;

/**
 * The `count` method works mostly like the `live` method, but no events are
 * bound, the functionality is only executed once.
 *
 * @param elements All elements that should be counted.
 *
 * @param callback The callback to fire whenever the element's value changes. 
 *                 The callback is called with the relevant element bound to `this` 
 *                 and the counted values as the single parameter.
 *
 * @param options An object to modify Countable's behaviour.
 *
 * @returns The Countable object to allow for chaining. Return void if the argument is not valid. 
 */
export function count(elements: NodeList | HTMLCollection | Element,
    callback?: (counter: {
        paragraphs: number
        sentences: number
        words: number
        characters: number
        all: number
    }) => void,
    options?: {
        hardReturns?: boolean
        stripTags?: boolean
        ignore?: string[]
    }): Countable;

/**
 * The `enabled` method checks if the live-counting functionality is bound
 * to an element.
 *
 * @param element All elements that should be checked for the Countable functionality.
 *
 * @return A boolean value representing whether Countable functionality is bound to all given elements.
 */
export function enabled(elements: NodeList | HTMLCollection | Element): boolean;

/**
 * The purpose of this type is to gather all functions exported above together.
 * Thus content assist of vscode will display the return type of functions above as `Countable` 
 * instead of the whole structure of this module. Users won't be disturb by verbosity of assisting content.
 */
type Countable = {
    on:typeof on
    off: typeof off
    count: typeof count
    enabled: typeof enabled
}

export as namespace Countable;