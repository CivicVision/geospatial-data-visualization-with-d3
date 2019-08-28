(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.JavascriptRepl = factory());
}(this, function () { 'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_style(node, key, value) {
        node.style.setProperty(key, value);
    }
    function add_resize_listener(element, fn) {
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        const object = document.createElement('object');
        object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        object.type = 'text/html';
        object.tabIndex = -1;
        let win;
        object.onload = () => {
            win = object.contentDocument.defaultView;
            win.addEventListener('resize', fn);
        };
        if (/Trident/.test(navigator.userAgent)) {
            element.appendChild(object);
            object.data = 'about:blank';
        }
        else {
            object.data = 'about:blank';
            element.appendChild(object);
        }
        return {
            cancel: () => {
                win && win.removeEventListener && win.removeEventListener('resize', fn);
                element.removeChild(object);
            }
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        if (component.$$.props.indexOf(name) === -1)
            return;
        component.$$.bound[name] = callback;
        callback(component.$$.ctx[name]);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    var srcdoc = "<!doctype html>\n<html>\n  <head>\n    <style>\n    </style>\n\t\t<!-- Inject Style instead of adding it here --!>\n\t\t<script src=\"https://d3js.org/d3.v5.min.js\"></script>\n    <script>\n      (function(){\n        function handle_message(event) {\n\t\t\t\t\ttry {\n\t\t\t\t\t\teval(event.data.script)\n\t\t\t\t\t} catch(e) {\n\t\t\t\t\t\tconsole.log(e)\n\t\t\t\t\t\t//send error bacl\n\t\t\t\t\t}\n        }\n        window.addEventListener('message', handle_message, false);\n      }).call(this);\n    </script>\n  </head>\n  <body></body>\n</html>\n";

    /* src/Viewer.svelte generated by Svelte v3.8.1 */

    function create_fragment(ctx) {
    	var iframe_1;

    	return {
    		c() {
    			iframe_1 = element("iframe");
    			attr(iframe_1, "title", "Result");
    			attr(iframe_1, "sandbox", "allow-scripts allow-same-origin");
    			attr(iframe_1, "srcdoc", srcdoc);
    		},

    		m(target, anchor) {
    			insert(target, iframe_1, anchor);
    			ctx.iframe_1_binding(iframe_1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d(detaching) {
    			if (detaching) {
    				detach(iframe_1);
    			}

    			ctx.iframe_1_binding(null);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	
    	let iframe;
    	let { injectedJS = '', injectedCSS = '', injectedLibraries = [], html = '', code = '', ready = false } = $$props;
    	let message = '';
    	onMount(() => {
    		iframe.addEventListener('load', () => {
    			$$invalidate('ready', ready = true);
    		});
    	});

    	function iframe_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('iframe', iframe = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('injectedJS' in $$props) $$invalidate('injectedJS', injectedJS = $$props.injectedJS);
    		if ('injectedCSS' in $$props) $$invalidate('injectedCSS', injectedCSS = $$props.injectedCSS);
    		if ('injectedLibraries' in $$props) $$invalidate('injectedLibraries', injectedLibraries = $$props.injectedLibraries);
    		if ('html' in $$props) $$invalidate('html', html = $$props.html);
    		if ('code' in $$props) $$invalidate('code', code = $$props.code);
    		if ('ready' in $$props) $$invalidate('ready', ready = $$props.ready);
    	};

    	let styles;

    	$$self.$$.update = ($$dirty = { injectedCSS: 1, ready: 1, code: 1, html: 1, injectedJS: 1, styles: 1, iframe: 1, message: 1, injectedLibraries: 1 }) => {
    		if ($$dirty.injectedCSS) { $$invalidate('styles', styles = injectedCSS && `{
    const style = document.createElement('style');
    style.textContent = ${JSON.stringify(injectedCSS)};
    document.head.appendChild(style);
  }`); }
    		if ($$dirty.ready || $$dirty.code || $$dirty.html || $$dirty.injectedJS || $$dirty.styles || $$dirty.iframe || $$dirty.message) { if(ready && (code || html)) {
    				$$invalidate('message', message = `
		    ${injectedJS}
		    ${styles}
				document.body.innerHTML = '';
    document.body.innerHTML = '${html}';
		${code}
				`);
    				iframe.contentWindow.postMessage({ script: message }, '*');
    			} }
    		if ($$dirty.injectedLibraries) { if(injectedLibraries.length > 0) {
    		    libraries = injectedLibraries.map((lib) => {
    		      return `{
        const script = document.createElement('script');
        script.type= 'text/javascript';
        script.src = '${lib}';
        document.head.appendChild(script);
      }`
    		    });
    		  } }
    	};

    	return {
    		iframe,
    		injectedJS,
    		injectedCSS,
    		injectedLibraries,
    		html,
    		code,
    		ready,
    		iframe_1_binding
    	};
    }

    class Viewer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, ["injectedJS", "injectedCSS", "injectedLibraries", "html", "code", "ready"]);
    	}
    }

    /* src/Editor.svelte generated by Svelte v3.8.1 */

    function add_css() {
    	var style = element("style");
    	style.id = 'svelte-5qo5ik-style';
    	style.textContent = ".codemirror-container.svelte-5qo5ik{position:relative;width:100%;height:100%;border:none;line-height:1.5;overflow:hidden}.codemirror-container.svelte-5qo5ik .CodeMirror{height:100%;background:transparent;font:400 14px/1.7 var(--font-mono);color:var(--base)}.codemirror-container.flex.svelte-5qo5ik .CodeMirror{height:auto}.codemirror-container.flex.svelte-5qo5ik .CodeMirror-lines{padding:0}.codemirror-container.svelte-5qo5ik .CodeMirror-gutters{padding:0 16px 0 8px;border:none}.codemirror-container.svelte-5qo5ik .error-loc{position:relative;border-bottom:2px solid #da106e}.codemirror-container.svelte-5qo5ik .error-line{background-color:rgba(200, 0, 0, .05)}textarea.svelte-5qo5ik{visibility:hidden}pre.svelte-5qo5ik{position:absolute;width:100%;height:100%;top:0;left:0;border:none;padding:4px 4px 4px 60px;resize:none;font-family:var(--font-mono);font-size:13px;line-height:1.7;user-select:none;pointer-events:none;color:#ccc;tab-size:2;-moz-tab-size:2}.flex.svelte-5qo5ik pre.svelte-5qo5ik{padding:0 0 0 4px;height:auto}";
    	append(document.head, style);
    }

    // (214:1) {#if !CodeMirror}
    function create_if_block(ctx) {
    	var pre, t0, t1, div;

    	return {
    		c() {
    			pre = element("pre");
    			t0 = text(ctx.code);
    			t1 = space();
    			div = element("div");
    			set_style(pre, "position", "absolute");
    			set_style(pre, "left", "0");
    			set_style(pre, "top", "0");
    			attr(pre, "class", "svelte-5qo5ik");
    			set_style(div, "position", "absolute");
    			set_style(div, "width", "100%");
    			set_style(div, "bottom", "0");
    		},

    		m(target, anchor) {
    			insert(target, pre, anchor);
    			append(pre, t0);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    		},

    		p(changed, ctx) {
    			if (changed.code) {
    				set_data(t0, ctx.code);
    			}
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(pre);
    				detach(t1);
    				detach(div);
    			}
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	var div, textarea, t, div_resize_listener;

    	var if_block = (!ctx.CodeMirror) && create_if_block(ctx);

    	return {
    		c() {
    			div = element("div");
    			textarea = element("textarea");
    			t = space();
    			if (if_block) if_block.c();
    			attr(textarea, "tabindex", "0");
    			textarea.readOnly = true;
    			textarea.value = ctx.code;
    			attr(textarea, "class", "svelte-5qo5ik");
    			add_render_callback(() => ctx.div_resize_handler.call(div));
    			attr(div, "class", "codemirror-container svelte-5qo5ik");
    			toggle_class(div, "flex", ctx.flex);
    		},

    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, textarea);
    			ctx.textarea_binding(textarea);
    			append(div, t);
    			if (if_block) if_block.m(div, null);
    			div_resize_listener = add_resize_listener(div, ctx.div_resize_handler.bind(div));
    		},

    		p(changed, ctx) {
    			if (changed.code) {
    				textarea.value = ctx.code;
    			}

    			if (!ctx.CodeMirror) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (changed.flex) {
    				toggle_class(div, "flex", ctx.flex);
    			}
    		},

    		i: noop,
    		o: noop,

    		d(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			ctx.textarea_binding(null);
    			if (if_block) if_block.d();
    			div_resize_listener.cancel();
    		}
    	};
    }

    let codemirror_promise;

    function sleep(ms) {
    	return new Promise(fulfil => setTimeout(fulfil, ms));
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { readonly = false, errorLoc = null, flex = false, lineNumbers = true, tab = true } = $$props;
    	let w;
    	let h;
    	let { code = '' } = $$props;
    	let mode;
    	// We have to expose set and update methods, rather
    	// than making this state-driven through props,
    	// because it's difficult to update an editor
    	// without resetting scroll otherwise
    	async function set(new_code, new_mode) {
    		if (new_mode !== mode) {
    			await createEditor(mode = new_mode);		}
    		$$invalidate('code', code = new_code);
    		updating_externally = true;
    		if (editor) editor.setValue(code);
    		updating_externally = false;
    	}
    	function update(new_code) {
    		$$invalidate('code', code = new_code);
    		if (editor) {
    			const { left, top } = editor.getScrollInfo();
    			editor.setValue(code = new_code); $$invalidate('code', code);
    			editor.scrollTo(left, top);
    		}
    	}
    	function resize() {
    		editor.refresh();
    	}
    	function focus() {
    		editor.focus();
    	}
    	const modes = {
    		js: {
    			name: 'javascript',
    			json: false
    		},
    		json: {
    			name: 'javascript',
    			json: true
    		},
    	};
    	const refs = {};
    	let editor;
    	let updating_externally = false;
    	let marker;
    	let error_line;
    	let destroyed = false;
    	let CodeMirror;
    	let previous_error_line;
    	onMount(() => {
    		if (window.CodeMirror) {
    			$$invalidate('CodeMirror', CodeMirror = window.CodeMirror);
    			createEditor(mode || 'js').then(() => {
    				if (editor) editor.setValue(code || '');
    			});
    		} else {
    			codemirror_promise.then(async mod => {
    				$$invalidate('CodeMirror', CodeMirror = mod.default);
    				await createEditor(mode || 'js');
    				if (editor) editor.setValue(code || '');
    			});
    		}
    		return () => {
    			destroyed = true;
    			if (editor) editor.toTextArea();
    		}
    	});
    	let first = true;
    	async function createEditor(mode) {
    		if (destroyed || !CodeMirror) return;
    		if (editor) editor.toTextArea();
    		const opts = {
    			lineNumbers,
    			lineWrapping: true,
    			indentWithTabs: true,
    			indentUnit: 2,
    			tabSize: 2,
    			value: '',
    			mode: modes[mode] || {
    				name: mode
    			},
    			readOnly: readonly,
    			autoCloseBrackets: true,
    			autoCloseTags: true
    		};
    		if (!tab) opts.extraKeys = {
    			Tab: tab,
    			'Shift-Tab': tab
    		};
    		// Creating a text editor is a lot of work, so we yield
    		// the main thread for a moment. This helps reduce jank
    		if (first) await sleep(50);
    		if (destroyed) return;
    		$$invalidate('editor', editor = CodeMirror.fromTextArea(refs.editor, opts));
    		editor.on('change', instance => {
    			if (!updating_externally) {
    				const value = instance.getValue();
    				dispatch('change', { value });
    			}
    		});
    		if (first) await sleep(50);
    		editor.refresh();
    		first = false;
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.editor = $$value;
    			$$invalidate('refs', refs);
    		});
    	}

    	function div_resize_handler() {
    		w = this.offsetWidth;
    		h = this.offsetHeight;
    		$$invalidate('w', w);
    		$$invalidate('h', h);
    	}

    	$$self.$set = $$props => {
    		if ('readonly' in $$props) $$invalidate('readonly', readonly = $$props.readonly);
    		if ('errorLoc' in $$props) $$invalidate('errorLoc', errorLoc = $$props.errorLoc);
    		if ('flex' in $$props) $$invalidate('flex', flex = $$props.flex);
    		if ('lineNumbers' in $$props) $$invalidate('lineNumbers', lineNumbers = $$props.lineNumbers);
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('code' in $$props) $$invalidate('code', code = $$props.code);
    	};

    	$$self.$$.update = ($$dirty = { editor: 1, w: 1, h: 1, marker: 1, errorLoc: 1, previous_error_line: 1, error_line: 1 }) => {
    		if ($$dirty.editor || $$dirty.w || $$dirty.h) { if (editor && w && h) {
    				editor.refresh();
    			} }
    		if ($$dirty.marker || $$dirty.errorLoc || $$dirty.editor) { {
    				if (marker) marker.clear();
    				if (errorLoc) {
    					const line = errorLoc.line - 1;
    					const ch = errorLoc.column;
    					$$invalidate('marker', marker = editor.markText({ line, ch }, { line, ch: ch + 1 }, {
    						className: 'error-loc'
    					}));
    					$$invalidate('error_line', error_line = line);
    				} else {
    					$$invalidate('error_line', error_line = null);
    				}
    			} }
    		if ($$dirty.editor || $$dirty.previous_error_line || $$dirty.error_line) { if (editor) {
    				if (previous_error_line != null) {
    					editor.removeLineClass(previous_error_line, 'wrap', 'error-line');
    				}
    				if (error_line && (error_line !== previous_error_line)) {
    					editor.addLineClass(error_line, 'wrap', 'error-line');
    					$$invalidate('previous_error_line', previous_error_line = error_line);
    				}
    			} }
    	};

    	return {
    		readonly,
    		errorLoc,
    		flex,
    		lineNumbers,
    		tab,
    		w,
    		h,
    		code,
    		set,
    		update,
    		resize,
    		focus,
    		refs,
    		CodeMirror,
    		textarea_binding,
    		div_resize_handler
    	};
    }

    class Editor extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-5qo5ik-style")) add_css();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["readonly", "errorLoc", "flex", "lineNumbers", "tab", "code", "set", "update", "resize", "focus"]);
    	}

    	get set() {
    		return this.$$.ctx.set;
    	}

    	get update() {
    		return this.$$.ctx.update;
    	}

    	get resize() {
    		return this.$$.ctx.resize;
    	}

    	get focus() {
    		return this.$$.ctx.focus;
    	}
    }

    /* src/Console.svelte generated by Svelte v3.8.1 */

    function create_fragment$2(ctx) {
    	var current;

    	var viewer = new Viewer({ props: { code: ctx.message } });

    	return {
    		c() {
    			viewer.$$.fragment.c();
    		},

    		m(target, anchor) {
    			mount_component(viewer, target, anchor);
    			current = true;
    		},

    		p(changed, ctx) {
    			var viewer_changes = {};
    			if (changed.message) viewer_changes.code = ctx.message;
    			viewer.$set(viewer_changes);
    		},

    		i(local) {
    			if (current) return;
    			transition_in(viewer.$$.fragment, local);

    			current = true;
    		},

    		o(local) {
    			transition_out(viewer.$$.fragment, local);
    			current = false;
    		},

    		d(detaching) {
    			destroy_component(viewer, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	
      let { output } = $$props;
      let message = '';

    	$$self.$set = $$props => {
    		if ('output' in $$props) $$invalidate('output', output = $$props.output);
    	};

    	$$self.$$.update = ($$dirty = { output: 1 }) => {
    		if ($$dirty.output) { if(output) {
        		$$invalidate('message', message = `
    		document.body.innerHTML = '';
    var consoleOutput = '';
    var old = console.log;
    console.log = function (message) {
      if (typeof message == 'object') {
        consoleOutput += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
      } else {
        consoleOutput += message + '<br />';
      }
    };
		${output}
    		document.body.innerHTML = '';
    document.body.innerHTML = consoleOutput;
		`);
        	} }
    	};

    	return { output, message };
    }

    class Console extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["output"]);
    	}
    }

    /* src/Repl.svelte generated by Svelte v3.8.1 */

    function add_css$1() {
    	var style = element("style");
    	style.id = 'svelte-7fiviz-style';
    	style.textContent = ".hidden.svelte-7fiviz{visibility:hidden}.content-container.svelte-7fiviz{transition-property:all;transition-duration:.5s;transition-timing-function:cubic-bezier(0, 1, 0.5, 1)}.hide-content.svelte-7fiviz .content-container.svelte-7fiviz{max-width:0;overflow-x:hidden}.hide-content.svelte-7fiviz .result-container.svelte-7fiviz{width:95%}";
    	append(document.head, style);
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.name = list[i].name;
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (136:4) {#if showEditor}
    function create_if_block_1(ctx) {
    	var div, t, div_class_value, current;

    	var if_block = (ctx.showFiles) && create_if_block_2(ctx);

    	let editor_1_props = {};
    	var editor_1 = new Editor({ props: editor_1_props });

    	ctx.editor_1_binding(editor_1);
    	editor_1.$on("change", ctx.debounceChangeCode);

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			editor_1.$$.fragment.c();
    			attr(div, "class", div_class_value = "" + null_to_empty(ctx.cssStyles.editor) + " svelte-7fiviz");
    			toggle_class(div, "hidden", !ctx.showEditor);
    		},

    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append(div, t);
    			mount_component(editor_1, div, null);
    			current = true;
    		},

    		p(changed, ctx) {
    			if (ctx.showFiles) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			var editor_1_changes = {};
    			editor_1.$set(editor_1_changes);

    			if ((!current || changed.cssStyles) && div_class_value !== (div_class_value = "" + null_to_empty(ctx.cssStyles.editor) + " svelte-7fiviz")) {
    				attr(div, "class", div_class_value);
    			}

    			if ((changed.cssStyles || changed.showEditor)) {
    				toggle_class(div, "hidden", !ctx.showEditor);
    			}
    		},

    		i(local) {
    			if (current) return;
    			transition_in(editor_1.$$.fragment, local);

    			current = true;
    		},

    		o(local) {
    			transition_out(editor_1.$$.fragment, local);
    			current = false;
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if (if_block) if_block.d();
    			ctx.editor_1_binding(null);

    			destroy_component(editor_1);
    		}
    	};
    }

    // (138:8) {#if showFiles}
    function create_if_block_2(ctx) {
    	var div, div_class_value;

    	var each_value = ctx.files;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			div = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(div, "class", div_class_value = "" + null_to_empty(ctx.cssStyles.editorActions.container) + " svelte-7fiviz");
    		},

    		m(target, anchor) {
    			insert(target, div, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},

    		p(changed, ctx) {
    			if (changed.cssStyles || changed.currentFileIndex || changed.files) {
    				each_value = ctx.files;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if ((changed.cssStyles) && div_class_value !== (div_class_value = "" + null_to_empty(ctx.cssStyles.editorActions.container) + " svelte-7fiviz")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (140:12) {#each files as { name }
    function create_each_block(ctx) {
    	var div, a, t0_value = ctx.name + "", t0, a_class_value, t1, div_class_value, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	return {
    		c() {
    			div = element("div");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr(a, "class", a_class_value = "" + null_to_empty(ctx.cssStyles.editorActions.link) + " svelte-7fiviz");
    			toggle_class(a, "active", ctx.currentFileIndex == ctx.i);
    			attr(div, "class", div_class_value = "" + null_to_empty(ctx.cssStyles.editorActions.tabItem) + " svelte-7fiviz");
    			dispose = listen(a, "click", click_handler);
    		},

    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, a);
    			append(a, t0);
    			append(div, t1);
    		},

    		p(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.files) && t0_value !== (t0_value = ctx.name + "")) {
    				set_data(t0, t0_value);
    			}

    			if ((changed.cssStyles) && a_class_value !== (a_class_value = "" + null_to_empty(ctx.cssStyles.editorActions.link) + " svelte-7fiviz")) {
    				attr(a, "class", a_class_value);
    			}

    			if ((changed.cssStyles || changed.currentFileIndex)) {
    				toggle_class(a, "active", ctx.currentFileIndex == ctx.i);
    			}

    			if ((changed.cssStyles) && div_class_value !== (div_class_value = "" + null_to_empty(ctx.cssStyles.editorActions.tabItem) + " svelte-7fiviz")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    // (151:6) {#if showTabs}
    function create_if_block$1(ctx) {
    	var div2, div0, a0, t0, a0_class_value, div0_class_value, t1, div1, a1, t2, a1_class_value, div1_class_value, div2_class_value, dispose;

    	return {
    		c() {
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			t0 = text("Result");
    			t1 = space();
    			div1 = element("div");
    			a1 = element("a");
    			t2 = text("Console");
    			attr(a0, "class", a0_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.link) + " svelte-7fiviz");
    			toggle_class(a0, "active", ctx.tab == 'viewer');
    			attr(div0, "class", div0_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.tabItem) + " svelte-7fiviz");
    			attr(a1, "class", a1_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.link) + " svelte-7fiviz");
    			toggle_class(a1, "active", ctx.tab == 'console');
    			attr(div1, "class", div1_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.tabItem) + " svelte-7fiviz");
    			attr(div2, "class", div2_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.container) + " svelte-7fiviz");

    			dispose = [
    				listen(a0, "click", ctx.click_handler_1),
    				listen(a1, "click", ctx.click_handler_2)
    			];
    		},

    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, a0);
    			append(a0, t0);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, a1);
    			append(a1, t2);
    		},

    		p(changed, ctx) {
    			if ((changed.cssStyles) && a0_class_value !== (a0_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.link) + " svelte-7fiviz")) {
    				attr(a0, "class", a0_class_value);
    			}

    			if ((changed.cssStyles || changed.tab)) {
    				toggle_class(a0, "active", ctx.tab == 'viewer');
    			}

    			if ((changed.cssStyles) && div0_class_value !== (div0_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.tabItem) + " svelte-7fiviz")) {
    				attr(div0, "class", div0_class_value);
    			}

    			if ((changed.cssStyles) && a1_class_value !== (a1_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.link) + " svelte-7fiviz")) {
    				attr(a1, "class", a1_class_value);
    			}

    			if ((changed.cssStyles || changed.tab)) {
    				toggle_class(a1, "active", ctx.tab == 'console');
    			}

    			if ((changed.cssStyles) && div1_class_value !== (div1_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.tabItem) + " svelte-7fiviz")) {
    				attr(div1, "class", div1_class_value);
    			}

    			if ((changed.cssStyles) && div2_class_value !== (div2_class_value = "" + null_to_empty(ctx.cssStyles.viewerActions.container) + " svelte-7fiviz")) {
    				attr(div2, "class", div2_class_value);
    			}
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(div2);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	var div5, div4, t0, div3, t1, div2, div0, updating_ready, div0_class_value, t2, div1, div1_class_value, div2_class_value, div3_class_value, div4_class_value, div5_class_value, current;

    	var if_block0 = (ctx.showEditor) && create_if_block_1(ctx);

    	var if_block1 = (ctx.showTabs) && create_if_block$1(ctx);

    	function viewer_ready_binding(value) {
    		ctx.viewer_ready_binding.call(null, value);
    		updating_ready = true;
    		add_flush_callback(() => updating_ready = false);
    	}

    	let viewer_props = {
    		code: ctx.code,
    		injectedLibraries: ctx.injectedLibraries,
    		html: ctx.html,
    		injectedJS: ctx.injectedJS
    	};
    	if (ctx.ready !== void 0) {
    		viewer_props.ready = ctx.ready;
    	}
    	var viewer = new Viewer({ props: viewer_props });

    	binding_callbacks.push(() => bind(viewer, 'ready', viewer_ready_binding));

    	var console = new Console({ props: { output: ctx.code } });

    	return {
    		c() {
    			div5 = element("div");
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			viewer.$$.fragment.c();
    			t2 = space();
    			div1 = element("div");
    			console.$$.fragment.c();
    			attr(div0, "class", div0_class_value = "" + null_to_empty(ctx.cssStyles.viewer) + " svelte-7fiviz");
    			toggle_class(div0, "hidden", ctx.tab != 'viewer');
    			attr(div1, "class", div1_class_value = "" + null_to_empty(ctx.cssStyles.console) + " svelte-7fiviz");
    			toggle_class(div1, "hidden", ctx.tab != 'console');
    			attr(div2, "class", div2_class_value = "" + null_to_empty(ctx.cssStyles.viewerConsoleContainer) + " svelte-7fiviz");
    			attr(div3, "class", div3_class_value = "" + null_to_empty(ctx.cssStyles.viewerContainer) + " svelte-7fiviz");
    			toggle_class(div3, "view-only", !ctx.showEditor);
    			attr(div4, "class", div4_class_value = "result-container " + ctx.cssStyles.resultContainer + " svelte-7fiviz");
    			attr(div5, "class", div5_class_value = "" + null_to_empty(ctx.cssStyles.container) + " svelte-7fiviz");
    		},

    		m(target, anchor) {
    			insert(target, div5, anchor);
    			append(div5, div4);
    			if (if_block0) if_block0.m(div4, null);
    			append(div4, t0);
    			append(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append(div3, t1);
    			append(div3, div2);
    			append(div2, div0);
    			mount_component(viewer, div0, null);
    			append(div2, t2);
    			append(div2, div1);
    			mount_component(console, div1, null);
    			current = true;
    		},

    		p(changed, ctx) {
    			if (ctx.showEditor) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div4, t0);
    				}
    			} else if (if_block0) {
    				group_outros();
    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});
    				check_outros();
    			}

    			if (ctx.showTabs) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div3, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			var viewer_changes = {};
    			if (changed.code) viewer_changes.code = ctx.code;
    			if (changed.injectedLibraries) viewer_changes.injectedLibraries = ctx.injectedLibraries;
    			if (changed.html) viewer_changes.html = ctx.html;
    			if (changed.injectedJS) viewer_changes.injectedJS = ctx.injectedJS;
    			if (!updating_ready && changed.ready) {
    				viewer_changes.ready = ctx.ready;
    			}
    			viewer.$set(viewer_changes);

    			if ((!current || changed.cssStyles) && div0_class_value !== (div0_class_value = "" + null_to_empty(ctx.cssStyles.viewer) + " svelte-7fiviz")) {
    				attr(div0, "class", div0_class_value);
    			}

    			if ((changed.cssStyles || changed.tab)) {
    				toggle_class(div0, "hidden", ctx.tab != 'viewer');
    			}

    			var console_changes = {};
    			if (changed.code) console_changes.output = ctx.code;
    			console.$set(console_changes);

    			if ((!current || changed.cssStyles) && div1_class_value !== (div1_class_value = "" + null_to_empty(ctx.cssStyles.console) + " svelte-7fiviz")) {
    				attr(div1, "class", div1_class_value);
    			}

    			if ((changed.cssStyles || changed.tab)) {
    				toggle_class(div1, "hidden", ctx.tab != 'console');
    			}

    			if ((!current || changed.cssStyles) && div2_class_value !== (div2_class_value = "" + null_to_empty(ctx.cssStyles.viewerConsoleContainer) + " svelte-7fiviz")) {
    				attr(div2, "class", div2_class_value);
    			}

    			if ((!current || changed.cssStyles) && div3_class_value !== (div3_class_value = "" + null_to_empty(ctx.cssStyles.viewerContainer) + " svelte-7fiviz")) {
    				attr(div3, "class", div3_class_value);
    			}

    			if ((changed.cssStyles || changed.showEditor)) {
    				toggle_class(div3, "view-only", !ctx.showEditor);
    			}

    			if ((!current || changed.cssStyles) && div4_class_value !== (div4_class_value = "result-container " + ctx.cssStyles.resultContainer + " svelte-7fiviz")) {
    				attr(div4, "class", div4_class_value);
    			}

    			if ((!current || changed.cssStyles) && div5_class_value !== (div5_class_value = "" + null_to_empty(ctx.cssStyles.container) + " svelte-7fiviz")) {
    				attr(div5, "class", div5_class_value);
    			}
    		},

    		i(local) {
    			if (current) return;
    			transition_in(if_block0);

    			transition_in(viewer.$$.fragment, local);

    			transition_in(console.$$.fragment, local);

    			current = true;
    		},

    		o(local) {
    			transition_out(if_block0);
    			transition_out(viewer.$$.fragment, local);
    			transition_out(console.$$.fragment, local);
    			current = false;
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(div5);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();

    			destroy_component(viewer);

    			destroy_component(console);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	

      let ready = false;
      let editor;
      let manualUpdates = false;
      let tab = 'viewer';
      let currentFile = {};
      let currentFileIndex = 0;
      let currentContent = '';
      let code = '';
      let html = '';
      let { mode = 'normal', changedCode = () => {} } = $$props;
      let { files = [], injectedLibraries = [], injectedJS = '', debounceTime = 300, cssStyles = {
        container: 'container',
        resultContainer: 'result-container',
        viewerContainer: 'viewer-container',
        viewerConsoleContainer: 'viewer-console-container',
        editorActions: {
          container: '',
          tabItem: '',
          link: ''
        },
        viewerActions: {
          container: '',
          tabItem: '',
          link: ''
        },
        editor: 'editor',
        viewer: 'viewer',
      } } = $$props;

      const debounce = (func, delay) => {
        let inDebounce;
        return function() {
          const context = this;
          const args = arguments;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(() =>
            func.apply(context, args)
          , delay);
        }
      };

      const debounceChangeCode = debounce(changeCode, debounceTime);

      function changeCode(event) {
        currentContent = event.detail.value;
        $$invalidate('manualUpdates', manualUpdates = true);
        changedCode();
        if (currentFile.type === 'js') {
          $$invalidate('code', code = currentContent);
        } else {
          $$invalidate('html', html = currentContent.replace(/\n/g,''));
        }
      }


      function getContentForType(type = 'js') {
        return files.reduce((content, file) => {
          if(file.type === type) {
            return content + file.content;
          }
          return content;
        }, '');
      }

      function update() {
        $$invalidate('code', code = getContentForType('js') || '');
        $$invalidate('html', html = getContentForType('html') || '');
        if(!html) $$invalidate('html', html = '');
        if(editor) {
          editor.update(currentFile.content);
        }

      }
      function showFile(fileIndex) {
        currentFile.content = currentContent; $$invalidate('currentFile', currentFile), $$invalidate('files', files), $$invalidate('currentFileIndex', currentFileIndex), $$invalidate('ready', ready);
        $$invalidate('currentFileIndex', currentFileIndex = fileIndex);
      }
      function showConsole() {
        $$invalidate('tab', tab = 'console');
      }
      function showResult() {
        $$invalidate('tab', tab = 'viewer');
      }

    	function click_handler({ i }) {
    		return showFile(i);
    	}

    	function editor_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('editor', editor = $$value);
    		});
    	}

    	function click_handler_1() {
    		return showResult();
    	}

    	function click_handler_2() {
    		return showConsole();
    	}

    	function viewer_ready_binding(value) {
    		ready = value;
    		$$invalidate('ready', ready);
    	}

    	$$self.$set = $$props => {
    		if ('mode' in $$props) $$invalidate('mode', mode = $$props.mode);
    		if ('changedCode' in $$props) $$invalidate('changedCode', changedCode = $$props.changedCode);
    		if ('files' in $$props) $$invalidate('files', files = $$props.files);
    		if ('injectedLibraries' in $$props) $$invalidate('injectedLibraries', injectedLibraries = $$props.injectedLibraries);
    		if ('injectedJS' in $$props) $$invalidate('injectedJS', injectedJS = $$props.injectedJS);
    		if ('debounceTime' in $$props) $$invalidate('debounceTime', debounceTime = $$props.debounceTime);
    		if ('cssStyles' in $$props) $$invalidate('cssStyles', cssStyles = $$props.cssStyles);
    	};

    	let showEditor, showTabs, showFiles;

    	$$self.$$.update = ($$dirty = { mode: 1, files: 1, currentFileIndex: 1, ready: 1, editor: 1, currentFile: 1, manualUpdates: 1 }) => {
    		if ($$dirty.mode) { $$invalidate('showEditor', showEditor = (mode === 'normal' || mode === 'minimal')); }
    		if ($$dirty.mode) { $$invalidate('showTabs', showTabs = (mode === 'normal' || mode === 'view')); }
    		if ($$dirty.mode) { $$invalidate('showFiles', showFiles = (mode === 'normal' || mode === 'view')); }
    		if ($$dirty.files || $$dirty.currentFileIndex) { $$invalidate('currentFile', currentFile = files[currentFileIndex]); }
    		if ($$dirty.files || $$dirty.ready || $$dirty.currentFileIndex) { if(files && ready) {
            $$invalidate('manualUpdates', manualUpdates = false);
            $$invalidate('currentFile', currentFile = files[currentFileIndex]);
            update();
          } }
    		if ($$dirty.editor || $$dirty.currentFile) { if(editor && currentFile) {
            editor.update(currentFile.content);
          } }
    		if ($$dirty.ready || $$dirty.manualUpdates) { if(ready && !manualUpdates) {
            update();
          } }
    	};

    	return {
    		ready,
    		editor,
    		tab,
    		currentFileIndex,
    		code,
    		html,
    		mode,
    		changedCode,
    		files,
    		injectedLibraries,
    		injectedJS,
    		debounceTime,
    		cssStyles,
    		debounceChangeCode,
    		showFile,
    		showConsole,
    		showResult,
    		showEditor,
    		showTabs,
    		showFiles,
    		click_handler,
    		editor_1_binding,
    		click_handler_1,
    		click_handler_2,
    		viewer_ready_binding
    	};
    }

    class Repl extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-7fiviz-style")) add_css$1();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["mode", "changedCode", "files", "injectedLibraries", "injectedJS", "debounceTime", "cssStyles"]);
    	}
    }

    return Repl;

}));
