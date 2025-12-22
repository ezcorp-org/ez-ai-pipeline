// node_modules/esm-env/true.js
var true_default = true;
// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
var noop = () => {};
function run_all(arr) {
  for (var i = 0;i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function to_array(value, n) {
  if (Array.isArray(value)) {
    return value;
  }
  if (n === undefined || !(Symbol.iterator in value)) {
    return Array.from(value);
  }
  const array = [];
  for (const element of value) {
    array.push(element);
    if (array.length === n)
      break;
  }
  return array;
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var EFFECT_RAN = 1 << 15;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 15;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
};
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (true_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function bind_invalid_checkbox_value() {
  if (true_default) {
    const error = new Error(`bind_invalid_checkbox_value
Using \`bind:value\` together with a checkbox input is not allowed. Use \`bind:checked\` instead
https://svelte.dev/e/bind_invalid_checkbox_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/bind_invalid_checkbox_value`);
  }
}
function derived_references_self() {
  if (true_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function effect_in_teardown(rune) {
  if (true_default) {
    const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  if (true_default) {
    const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  if (true_default) {
    const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  if (true_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (true_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function props_invalid_value(key) {
  if (true_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key}={undefined}\` when \`${key}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function rune_outside_svelte(rune) {
  if (true_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function state_descriptors_fixed() {
  if (true_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (true_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (true_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (true_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/constants.js
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol();
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function await_waterfall(name, location2) {
  if (true_default) {
    console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location2}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function hydration_attribute_changed(attribute, html, value) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_html_changed(location2) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_html_changed
%c${location2 ? `The value of an \`{@html ...}\` block ${location2} changed between server and client renders. The client value will be ignored in favour of the server value` : "The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_html_changed`);
  }
}
function hydration_mismatch(location2) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_mismatch
%c${location2 ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location2}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function select_multiple_invalid_value() {
  if (true_default) {
    console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (true_default) {
    console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function reset(node) {
  if (!hydrating)
    return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = node.data;
      if (data === HYDRATION_END) {
        if (depth === 0)
          return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE) {
        depth += 1;
      }
    }
    var next2 = get_next_sibling(node);
    if (remove)
      node.remove();
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node.nodeType !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return node.data;
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source, label) {
  source.label = label;
  tag_proxy(source.v, label);
  return source;
}
function tag_proxy(value, label) {
  value?.[PROXY_PATH_SYMBOL]?.(label);
  return value;
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label) {
  const error = new Error;
  const stack = get_stack();
  if (stack.length === 0) {
    return null;
  }
  stack.unshift(`
`);
  define_property(error, "stack", {
    value: stack.join(`
`)
  });
  define_property(error, "name", {
    value: label
  });
  return error;
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack)
    return [];
  const lines = stack.split(`
`);
  const new_lines = [];
  for (let i = 0;i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack) {
  dev_stack = stack;
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
  if (true_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component) {
  var context = component_context;
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component !== undefined) {
    context.x = component;
  }
  context.i = true;
  component_context = context.p;
  if (true_default) {
    dev_current_component_function = component_context?.function ?? null;
  }
  return component ?? {};
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks)
        run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = new WeakMap;
function handle_error(error) {
  var effect = active_effect;
  if (effect === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (true_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect));
  }
  if ((effect.f & EFFECT_RAN) === 0) {
    if ((effect.f & BOUNDARY_EFFECT) === 0) {
      if (true_default && !effect.parent && error instanceof Error) {
        apply_adjustments(error);
      }
      throw error;
    }
    effect.b.error(error);
  } else {
    invoke_error_boundary(error, effect);
  }
}
function invoke_error_boundary(error, effect) {
  while (effect !== null) {
    if ((effect.f & BOUNDARY_EFFECT) !== 0) {
      try {
        effect.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect = effect.parent;
  }
  if (true_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect) {
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable)
    return;
  var indent = is_firefox ? "  " : "\t";
  var component_stack = `
${indent}in ${effect.fn?.name || "<unknown>"}`;
  var context = effect.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message: error.message + `
${component_stack}
`,
    stack: error.stack?.split(`
`).filter((line) => !line.includes("svelte/src/internal")).join(`
`)
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var batches = new Set;
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var queued_root_effects = [];
var last_scheduled_effect = null;
var is_flushing = false;
var is_flushing_sync = false;

class Batch {
  committed = false;
  current = new Map;
  previous = new Map;
  #commit_callbacks = new Set;
  #discard_callbacks = new Set;
  #pending = 0;
  #blocking_pending = 0;
  #deferred = null;
  #dirty_effects = new Set;
  #maybe_dirty_effects = new Set;
  skipped_effects = new Set;
  is_fork = false;
  is_deferred() {
    return this.is_fork || this.#blocking_pending > 0;
  }
  process(root_effects) {
    queued_root_effects = [];
    previous_batch = null;
    this.apply();
    var target = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: []
    };
    for (const root of root_effects) {
      this.#traverse_effect_tree(root, target);
    }
    if (!this.is_fork) {
      this.#resolve();
    }
    if (this.is_deferred()) {
      this.#defer_effects(target.effects);
      this.#defer_effects(target.render_effects);
    } else {
      previous_batch = this;
      current_batch = null;
      flush_queued_effects(target.render_effects);
      flush_queued_effects(target.effects);
      previous_batch = null;
      this.#deferred?.resolve();
    }
    batch_values = null;
  }
  #traverse_effect_tree(root, target) {
    root.f ^= CLEAN;
    var effect = root.first;
    while (effect !== null) {
      var flags = effect.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect);
      if ((effect.f & BOUNDARY_EFFECT) !== 0 && effect.b?.is_pending()) {
        target = {
          parent: target,
          effect,
          effects: [],
          render_effects: []
        };
      }
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if ((flags & EFFECT) !== 0) {
          target.effects.push(effect);
        } else if (async_mode_flag && (flags & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
          target.render_effects.push(effect);
        } else if (is_dirty(effect)) {
          if ((effect.f & BLOCK_EFFECT) !== 0)
            this.#dirty_effects.add(effect);
          update_effect(effect);
        }
        var child = effect.first;
        if (child !== null) {
          effect = child;
          continue;
        }
      }
      var parent = effect.parent;
      effect = effect.next;
      while (effect === null && parent !== null) {
        if (parent === target.effect) {
          this.#defer_effects(target.effects);
          this.#defer_effects(target.render_effects);
          target = target.parent;
        }
        effect = parent.next;
        parent = parent.parent;
      }
    }
  }
  #defer_effects(effects) {
    for (const e of effects) {
      if ((e.f & DIRTY) !== 0) {
        this.#dirty_effects.add(e);
      } else if ((e.f & MAYBE_DIRTY) !== 0) {
        this.#maybe_dirty_effects.add(e);
      }
      this.#clear_marked(e.deps);
      set_signal_status(e, CLEAN);
    }
  }
  #clear_marked(deps) {
    if (deps === null)
      return;
    for (const dep of deps) {
      if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
        continue;
      }
      dep.f ^= WAS_MARKED;
      this.#clear_marked(dep.deps);
    }
  }
  capture(source2, value) {
    if (!this.previous.has(source2)) {
      this.previous.set(source2, value);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, source2.v);
      batch_values?.set(source2, source2.v);
    }
  }
  activate() {
    current_batch = this;
    this.apply();
  }
  deactivate() {
    if (current_batch !== this)
      return;
    current_batch = null;
    batch_values = null;
  }
  flush() {
    this.activate();
    if (queued_root_effects.length > 0) {
      flush_effects();
      if (current_batch !== null && current_batch !== this) {
        return;
      }
    } else if (this.#pending === 0) {
      this.process([]);
    }
    this.deactivate();
  }
  discard() {
    for (const fn of this.#discard_callbacks)
      fn(this);
    this.#discard_callbacks.clear();
  }
  #resolve() {
    if (this.#blocking_pending === 0) {
      for (const fn of this.#commit_callbacks)
        fn();
      this.#commit_callbacks.clear();
    }
    if (this.#pending === 0) {
      this.#commit();
    }
  }
  #commit() {
    if (batches.size > 1) {
      this.previous.clear();
      var previous_batch_values = batch_values;
      var is_earlier = true;
      var dummy_target = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: []
      };
      for (const batch of batches) {
        if (batch === this) {
          is_earlier = false;
          continue;
        }
        const sources = [];
        for (const [source2, value] of this.current) {
          if (batch.current.has(source2)) {
            if (is_earlier && value !== batch.current.get(source2)) {
              batch.current.set(source2, value);
            } else {
              continue;
            }
          }
          sources.push(source2);
        }
        if (sources.length === 0) {
          continue;
        }
        const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
        if (others.length > 0) {
          var prev_queued_root_effects = queued_root_effects;
          queued_root_effects = [];
          const marked = new Set;
          const checked = new Map;
          for (const source2 of sources) {
            mark_effects(source2, others, marked, checked);
          }
          if (queued_root_effects.length > 0) {
            current_batch = batch;
            batch.apply();
            for (const root of queued_root_effects) {
              batch.#traverse_effect_tree(root, dummy_target);
            }
            batch.deactivate();
          }
          queued_root_effects = prev_queued_root_effects;
        }
      }
      current_batch = null;
      batch_values = previous_batch_values;
    }
    this.committed = true;
    batches.delete(this);
  }
  increment(blocking) {
    this.#pending += 1;
    if (blocking)
      this.#blocking_pending += 1;
  }
  decrement(blocking) {
    this.#pending -= 1;
    if (blocking)
      this.#blocking_pending -= 1;
    this.revive();
  }
  revive() {
    for (const e of this.#dirty_effects) {
      this.#maybe_dirty_effects.delete(e);
      set_signal_status(e, DIRTY);
      schedule_effect(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      schedule_effect(e);
    }
    this.flush();
  }
  oncommit(fn) {
    this.#commit_callbacks.add(fn);
  }
  ondiscard(fn) {
    this.#discard_callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new Batch;
      batches.add(current_batch);
      if (!is_flushing_sync) {
        Batch.enqueue(() => {
          if (current_batch !== batch) {
            return;
          }
          batch.flush();
        });
      }
    }
    return current_batch;
  }
  static enqueue(task) {
    queue_micro_task(task);
  }
  apply() {
    if (!async_mode_flag || !this.is_fork && batches.size === 1)
      return;
    batch_values = new Map(this.current);
    for (const batch of batches) {
      if (batch === this)
        continue;
      for (const [source2, previous] of batch.previous) {
        if (!batch_values.has(source2)) {
          batch_values.set(source2, previous);
        }
      }
    }
  }
}
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null) {
        flush_effects();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        current_batch?.flush();
        if (queued_root_effects.length === 0) {
          last_scheduled_effect = null;
          return result;
        }
      }
      flush_effects();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function flush_effects() {
  var was_updating_effect = is_updating_effect;
  is_flushing = true;
  var source_stacks = true_default ? new Set : null;
  try {
    var flush_count = 0;
    set_is_updating_effect(true);
    while (queued_root_effects.length > 0) {
      var batch = Batch.ensure();
      if (flush_count++ > 1000) {
        if (true_default) {
          var updates = new Map;
          for (const source2 of batch.current.keys()) {
            for (const [stack, update2] of source2.updated ?? []) {
              var entry = updates.get(stack);
              if (!entry) {
                entry = { error: update2.error, count: 0 };
                updates.set(stack, entry);
              }
              entry.count += update2.count;
            }
          }
          for (const update2 of updates.values()) {
            if (update2.error) {
              console.error(update2.error);
            }
          }
        }
        infinite_loop_guard();
      }
      batch.process(queued_root_effects);
      old_values.clear();
      if (true_default) {
        for (const source2 of batch.current.keys()) {
          source_stacks.add(source2);
        }
      }
    }
  } finally {
    is_flushing = false;
    set_is_updating_effect(was_updating_effect);
    last_scheduled_effect = null;
    if (true_default) {
      for (const source2 of source_stacks) {
        source2.updated = null;
      }
    }
  }
}
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (true_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0)
    return;
  var i = 0;
  while (i < length) {
    var effect = effects[i++];
    if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
      eager_block_effects = new Set;
      update_effect(effect);
      if (effect.deps === null && effect.first === null && effect.nodes === null) {
        if (effect.teardown === null && effect.ac === null) {
          unlink_effect(effect);
        } else {
          effect.fn = null;
        }
      }
      if (eager_block_effects?.size > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0)
            continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j = ordered_effects.length - 1;j >= 0; j--) {
            const e2 = ordered_effects[j];
            if ((e2.f & (DESTROYED | INERT)) !== 0)
              continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value))
    return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags = reaction.f;
      if ((flags & DERIVED) !== 0) {
        mark_effects(reaction, sources, marked, checked);
      } else if ((flags & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(reaction);
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== undefined)
    return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (sources.includes(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(dep, sources, checked)) {
        checked.set(dep, true);
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(signal) {
  var effect = last_scheduled_effect = signal;
  while (effect.parent !== null) {
    effect = effect.parent;
    var flags = effect.f;
    if (is_flushing && effect === active_effect && (flags & BLOCK_EFFECT) !== 0 && (flags & HEAD_EFFECT) === 0) {
      return;
    }
    if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags & CLEAN) === 0)
        return;
      effect.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect);
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (true_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = undefined;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED | BOUNDARY_EFFECT;
function boundary(node, props, children) {
  new Boundary(node, props, children);
}

class Boundary {
  parent;
  #pending = false;
  #anchor;
  #hydrate_open = hydrating ? hydrate_node : null;
  #props;
  #children;
  #effect;
  #main_effect = null;
  #pending_effect = null;
  #failed_effect = null;
  #offscreen_fragment = null;
  #pending_anchor = null;
  #local_pending_count = 0;
  #pending_count = 0;
  #is_creating_fallback = false;
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    if (true_default) {
      tag(this.#effect_pending, "$effect.pending()");
    }
    return () => {
      this.#effect_pending = null;
    };
  });
  constructor(node, props, children) {
    this.#anchor = node;
    this.#props = props;
    this.#children = children;
    this.parent = active_effect.b;
    this.#pending = !!this.#props.pending;
    this.#effect = block(() => {
      active_effect.b = this;
      if (hydrating) {
        const comment = this.#hydrate_open;
        hydrate_next();
        const server_rendered_pending = comment.nodeType === COMMENT_NODE && comment.data === HYDRATION_START_ELSE;
        if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        var anchor = this.#get_anchor();
        try {
          this.#main_effect = branch(() => children(anchor));
        } catch (error) {
          this.error(error);
        }
        if (this.#pending_count > 0) {
          this.#show_pending_snippet();
        } else {
          this.#pending = false;
        }
      }
      return () => {
        this.#pending_anchor?.remove();
      };
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
    this.#pending = false;
  }
  #hydrate_pending_content() {
    const pending = this.#props.pending;
    if (!pending) {
      return;
    }
    this.#pending_effect = branch(() => pending(this.#anchor));
    Batch.enqueue(() => {
      var anchor = this.#get_anchor();
      this.#main_effect = this.#run(() => {
        Batch.ensure();
        return branch(() => this.#children(anchor));
      });
      if (this.#pending_count > 0) {
        this.#show_pending_snippet();
      } else {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
        this.#pending = false;
      }
    });
  }
  #get_anchor() {
    var anchor = this.#anchor;
    if (this.#pending) {
      this.#pending_anchor = create_text();
      this.#anchor.before(this.#pending_anchor);
      anchor = this.#pending_anchor;
    }
    return anchor;
  }
  is_pending() {
    return this.#pending || !!this.parent && this.parent.is_pending();
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  #show_pending_snippet() {
    const pending = this.#props.pending;
    if (this.#main_effect !== null) {
      this.#offscreen_fragment = document.createDocumentFragment();
      this.#offscreen_fragment.append(this.#pending_anchor);
      move_effect(this.#main_effect, this.#offscreen_fragment);
    }
    if (this.#pending_effect === null) {
      this.#pending_effect = branch(() => pending(this.#anchor));
    }
  }
  #update_pending_count(d) {
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        this.parent.#update_pending_count(d);
      }
      return;
    }
    this.#pending_count += d;
    if (this.#pending_count === 0) {
      this.#pending = false;
      if (this.#pending_effect) {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
      }
      if (this.#offscreen_fragment) {
        this.#anchor.before(this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      }
    }
  }
  update_pending_count(d) {
    this.#update_pending_count(d);
    this.#local_pending_count += d;
    if (this.#effect_pending) {
      internal_set(this.#effect_pending, this.#local_pending_count);
    }
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get(this.#effect_pending);
  }
  error(error) {
    var onerror = this.#props.onerror;
    let failed = this.#props.failed;
    if (this.#is_creating_fallback || !onerror && !failed) {
      throw error;
    }
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(this.#hydrate_open);
      next();
      set_hydrate_node(skip_nodes());
    }
    var did_reset = false;
    var calling_on_error = false;
    const reset2 = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      Batch.ensure();
      this.#local_pending_count = 0;
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#pending = this.has_pending_snippet();
      this.#main_effect = this.#run(() => {
        this.#is_creating_fallback = false;
        return branch(() => this.#children(this.#anchor));
      });
      if (this.#pending_count > 0) {
        this.#show_pending_snippet();
      } else {
        this.#pending = false;
      }
    };
    var previous_reaction = active_reaction;
    try {
      set_active_reaction(null);
      calling_on_error = true;
      onerror?.(error, reset2);
      calling_on_error = false;
    } catch (error2) {
      invoke_error_boundary(error2, this.#effect && this.#effect.parent);
    } finally {
      set_active_reaction(previous_reaction);
    }
    if (failed) {
      queue_micro_task(() => {
        this.#failed_effect = this.#run(() => {
          Batch.ensure();
          this.#is_creating_fallback = true;
          try {
            return branch(() => {
              failed(this.#anchor, () => error, () => reset2);
            });
          } catch (error2) {
            invoke_error_boundary(error2, this.#effect.parent);
            return null;
          } finally {
            this.#is_creating_fallback = false;
          }
        });
      });
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  if (async.length === 0 && blockers.length === 0) {
    fn(sync.map(d));
    return;
  }
  var batch = current_batch;
  var parent = active_effect;
  var restore = capture();
  function run() {
    Promise.all(async.map((expression) => async_derived(expression))).then((result) => {
      restore();
      try {
        fn([...sync.map(d), ...result]);
      } catch (error) {
        if ((parent.f & DESTROYED) === 0) {
          invoke_error_boundary(error, parent);
        }
      }
      batch?.deactivate();
      unset_context();
    }).catch((error) => {
      invoke_error_boundary(error, parent);
    });
  }
  if (blockers.length > 0) {
    Promise.all(blockers).then(() => {
      restore();
      try {
        return run();
      } finally {
        batch?.deactivate();
        unset_context();
      }
    });
  } else {
    run();
  }
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch2 = current_batch;
  if (true_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch)
      previous_batch2?.activate();
    if (true_default) {
      set_from_async_derived(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context() {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (true_default) {
    set_from_async_derived(null);
    set_dev_stack(null);
  }
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var current_async_effect = null;
function set_from_async_derived(v) {
  current_async_effect = v;
}
var recent_async_deriveds = new Set;
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? active_reaction : null;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: UNINITIALIZED,
    wv: 0,
    parent: parent_derived ?? active_effect,
    ac: null
  };
  if (true_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
function async_derived(fn, location2) {
  let parent = active_effect;
  if (parent === null) {
    async_derived_orphan();
  }
  var boundary2 = parent.b;
  var promise = undefined;
  var signal = source(UNINITIALIZED);
  var should_suspend = !active_reaction;
  var deferreds = new Map;
  async_effect(() => {
    if (true_default)
      current_async_effect = active_effect;
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, d.reject).then(() => {
        if (batch === current_batch && batch.committed) {
          batch.deactivate();
        }
        unset_context();
      });
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (true_default)
      current_async_effect = null;
    var batch = current_batch;
    if (should_suspend) {
      var blocking = !boundary2.is_pending();
      boundary2.update_pending_count(1);
      batch.increment(blocking);
      deferreds.get(batch)?.reject(STALE_REACTION);
      deferreds.delete(batch);
      deferreds.set(batch, d);
    }
    const handler = (value, error = undefined) => {
      current_async_effect = null;
      batch.activate();
      if (error) {
        if (error !== STALE_REACTION) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        }
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        internal_set(signal, value);
        for (const [b, d2] of deferreds) {
          deferreds.delete(b);
          if (b === batch)
            break;
          d2.reject(STALE_REACTION);
        }
        if (true_default && location2 !== undefined) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal)) {
              await_waterfall(signal.label, location2);
              recent_async_deriveds.delete(signal);
            }
          });
        }
      }
      if (should_suspend) {
        boundary2.update_pending_count(-1);
        batch.decrement(blocking);
      }
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds.values()) {
      d.reject(STALE_REACTION);
    }
  });
  if (true_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
}
function user_derived(fn) {
  const d = derived(fn);
  if (!async_mode_flag)
    push_reaction_value(d);
  return d;
}
function derived_safe_equal(fn) {
  const signal = derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0;i < effects.length; i += 1) {
      destroy_effect(effects[i]);
    }
  }
}
var stack = [];
function get_derived_parent_effect(derived2) {
  var parent = derived2.parent;
  while (parent !== null) {
    if ((parent.f & DERIVED) === 0) {
      return (parent.f & DESTROYED) === 0 ? parent : null;
    }
    parent = parent.parent;
  }
  return null;
}
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(get_derived_parent_effect(derived2));
  if (true_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(new Set);
    try {
      if (stack.includes(derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    if (!current_batch?.is_fork) {
      derived2.v = value;
    }
    derived2.wv = increment_write_version();
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || current_batch?.is_fork) {
      batch_values.set(derived2, value);
    }
  } else {
    var status = (derived2.f & CONNECTED) === 0 ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = new Set;
var old_values = new Map;
function set_eager_effects(v) {
  eager_effects = v;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v, stack2) {
  var signal = {
    f: 0,
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  if (true_default && tracing_mode_flag) {
    signal.created = stack2 ?? get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
function state(v, stack2) {
  const s = source(v, stack2);
  push_reaction_value(s);
  return s;
}
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    (component_context.l.s ??= []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (true_default) {
    tag_proxy(new_value, source2.label);
  }
  return internal_set(source2, new_value);
}
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    var old_value = source2.v;
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else {
      old_values.set(source2, old_value);
    }
    source2.v = value;
    var batch = Batch.ensure();
    batch.capture(source2, old_value);
    if (true_default) {
      if (tracing_mode_flag || active_effect !== null) {
        source2.updated ??= new Map;
        const count = (source2.updated.get("")?.count ?? 0) + 1;
        source2.updated.set("", { error: null, count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(source2);
      }
      set_signal_status(source2, (source2.f & CONNECTED) !== 0 ? CLEAN : MAYBE_DIRTY);
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  var prev_is_updating_effect = is_updating_effect;
  set_is_updating_effect(true);
  const inspects = Array.from(eager_effects);
  try {
    for (const effect of inspects) {
      if ((effect.f & CLEAN) !== 0) {
        set_signal_status(effect, MAYBE_DIRTY);
      }
      if (is_dirty(effect)) {
        update_effect(effect);
      }
    }
  } finally {
    set_is_updating_effect(prev_is_updating_effect);
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0;i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect)
      continue;
    if (true_default && (flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(reaction);
      continue;
    }
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & DERIVED) !== 0) {
      var derived2 = reaction;
      batch_values?.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY);
      }
    } else if (not_dirty) {
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(reaction);
      }
      schedule_effect(reaction);
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = new Map;
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 = true_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(value.length, stack2));
    if (true_default) {
      value = inspectable_array(value);
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating)
      return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop, source2] of sources) {
      tag(source2, get_label(path, prop));
    }
    updating = false;
  }
  return new Proxy(value, {
    defineProperty(_, prop, descriptor) {
      if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
        state_descriptors_fixed();
      }
      var s = sources.get(prop);
      if (s === undefined) {
        s = with_parent(() => {
          var s2 = state(descriptor.value, stack2);
          sources.set(prop, s2);
          if (true_default && typeof prop === "string") {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
      } else {
        set(s, descriptor.value, true);
      }
      return true;
    },
    deleteProperty(target, prop) {
      var s = sources.get(prop);
      if (s === undefined) {
        if (prop in target) {
          const s2 = with_parent(() => state(UNINITIALIZED, stack2));
          sources.set(prop, s2);
          increment(version);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
        }
      } else {
        set(s, UNINITIALIZED);
        increment(version);
      }
      return true;
    },
    get(target, prop, receiver) {
      if (prop === STATE_SYMBOL) {
        return value;
      }
      if (true_default && prop === PROXY_PATH_SYMBOL) {
        return update_path;
      }
      var s = sources.get(prop);
      var exists = prop in target;
      if (s === undefined && (!exists || get_descriptor(target, prop)?.writable)) {
        s = with_parent(() => {
          var p = proxy(exists ? target[prop] : UNINITIALIZED);
          var s2 = state(p, stack2);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
        sources.set(prop, s);
      }
      if (s !== undefined) {
        var v = get(s);
        return v === UNINITIALIZED ? undefined : v;
      }
      return Reflect.get(target, prop, receiver);
    },
    getOwnPropertyDescriptor(target, prop) {
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor && "value" in descriptor) {
        var s = sources.get(prop);
        if (s)
          descriptor.value = get(s);
      } else if (descriptor === undefined) {
        var source2 = sources.get(prop);
        var value2 = source2?.v;
        if (source2 !== undefined && value2 !== UNINITIALIZED) {
          return {
            enumerable: true,
            configurable: true,
            value: value2,
            writable: true
          };
        }
      }
      return descriptor;
    },
    has(target, prop) {
      if (prop === STATE_SYMBOL) {
        return true;
      }
      var s = sources.get(prop);
      var has = s !== undefined && s.v !== UNINITIALIZED || Reflect.has(target, prop);
      if (s !== undefined || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
        if (s === undefined) {
          s = with_parent(() => {
            var p = has ? proxy(target[prop]) : UNINITIALIZED;
            var s2 = state(p, stack2);
            if (true_default) {
              tag(s2, get_label(path, prop));
            }
            return s2;
          });
          sources.set(prop, s);
        }
        var value2 = get(s);
        if (value2 === UNINITIALIZED) {
          return false;
        }
      }
      return has;
    },
    set(target, prop, value2, receiver) {
      var s = sources.get(prop);
      var has = prop in target;
      if (is_proxied_array && prop === "length") {
        for (var i = value2;i < s.v; i += 1) {
          var other_s = sources.get(i + "");
          if (other_s !== undefined) {
            set(other_s, UNINITIALIZED);
          } else if (i in target) {
            other_s = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(i + "", other_s);
            if (true_default) {
              tag(other_s, get_label(path, i));
            }
          }
        }
      }
      if (s === undefined) {
        if (!has || get_descriptor(target, prop)?.writable) {
          s = with_parent(() => state(undefined, stack2));
          if (true_default) {
            tag(s, get_label(path, prop));
          }
          set(s, proxy(value2));
          sources.set(prop, s);
        }
      } else {
        has = s.v !== UNINITIALIZED;
        var p = with_parent(() => proxy(value2));
        set(s, p);
      }
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor?.set) {
        descriptor.set.call(receiver, value2);
      }
      if (!has) {
        if (is_proxied_array && typeof prop === "string") {
          var ls = sources.get("length");
          var n = Number(prop);
          if (Number.isInteger(n) && n >= ls.v) {
            set(ls, n + 1);
          }
        }
        increment(version);
      }
      return true;
    },
    ownKeys(target) {
      get(version);
      var own_keys = Reflect.ownKeys(target).filter((key2) => {
        var source3 = sources.get(key2);
        return source3 === undefined || source3.v !== UNINITIALIZED;
      });
      for (var [key, source2] of sources) {
        if (source2.v !== UNINITIALIZED && !(key in target)) {
          own_keys.push(key);
        }
      }
      return own_keys;
    },
    setPrototypeOf() {
      state_prototype_fixed();
    }
  });
}
function get_label(path, prop) {
  if (typeof prop === "symbol")
    return `${path}[Symbol(${prop.description ?? ""})]`;
  if (regex_is_valid_identifier.test(prop))
    return `${path}.${prop}`;
  return /^\d+$/.test(prop) ? `${path}[${prop}]` : `${path}['${prop}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {}
  return value;
}
function is(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
}
var ARRAY_MUTATING_METHODS = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function inspectable_array(array) {
  return new Proxy(array, {
    get(target, prop, receiver) {
      var value = Reflect.get(target, prop, receiver);
      if (!ARRAY_MUTATING_METHODS.has(prop)) {
        return value;
      }
      return function(...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    }
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes } = array_prototype2;
  array_prototype2.indexOf = function(item, from_index) {
    const index = indexOf.call(this, item, from_index);
    if (index === -1) {
      for (let i = from_index ?? 0;i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.lastIndexOf = function(item, from_index) {
    const index = lastIndexOf.call(this, item, from_index ?? this.length - 1);
    if (index === -1) {
      for (let i = 0;i <= (from_index ?? this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.includes = function(item, from_index) {
    const has = includes.call(this, item, from_index);
    if (!has) {
      for (let i = 0;i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes;
  };
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== undefined) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype.__click = undefined;
    element_prototype.__className = undefined;
    element_prototype.__attributes = null;
    element_prototype.__style = undefined;
    element_prototype.__e = undefined;
  }
  if (is_extensible(text_prototype)) {
    text_prototype.__t = undefined;
  }
  if (true_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
function get_first_child(node) {
  return first_child_getter.call(node);
}
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function child(node, is_text) {
  if (!hydrating) {
    return get_first_child(node);
  }
  var child2 = get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text = create_text();
    child2?.before(text);
    set_hydrate_node(text);
    return text;
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  if (!hydrating) {
    var first = get_first_child(node);
    if (first instanceof Comment && first.data === "")
      return get_next_sibling(first);
    return first;
  }
  if (is_text && hydrate_node?.nodeType !== TEXT_NODE) {
    var text = create_text();
    hydrate_node?.before(text);
    set_hydrate_node(text);
    return text;
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text && next_sibling?.nodeType !== TEXT_NODE) {
    var text = create_text();
    if (next_sibling === null) {
      last_sibling?.after(text);
    } else {
      next_sibling.before(text);
    }
    set_hydrate_node(text);
    return text;
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag)
    return false;
  if (eager_block_effects !== null)
    return false;
  var flags2 = active_effect.f;
  return (flags2 & EFFECT_RAN) !== 0;
}

// node_modules/svelte/src/internal/client/dom/elements/misc.js
function remove_textarea_child(dom) {
  if (hydrating && get_first_child(dom) !== null) {
    clear_text_content(dom);
  }
}
var listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener("reset", (evt) => {
      Promise.resolve().then(() => {
        if (!evt.defaultPrevented) {
          for (const e of evt.target.elements) {
            e.__on_r?.();
          }
        }
      });
    }, { capture: true });
  }
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
  element.addEventListener(event, () => without_reactive_context(handler));
  const prev = element.__on_r;
  if (prev) {
    element.__on_r = () => {
      prev();
      on_reset(true);
    };
  } else {
    element.__on_r = () => on_reset(true);
  }
  add_form_reset_listener();
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function validate_effect(rune) {
  if (active_effect === null) {
    if (active_reaction === null) {
      effect_orphan(rune);
    }
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown(rune);
  }
}
function push_effect(effect, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect;
  } else {
    parent_last.next = effect;
    effect.prev = parent_last;
    parent_effect.last = effect;
  }
}
function create_effect(type, fn, sync) {
  var parent = active_effect;
  if (true_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (true_default) {
    effect.component_function = dev_current_component_function;
  }
  if (sync) {
    try {
      update_effect(effect);
      effect.f |= EFFECT_RAN;
    } catch (e2) {
      destroy_effect(effect);
      throw e2;
    }
  } else if (fn !== null) {
    schedule_effect(effect);
  }
  var e = effect;
  if (sync && e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & EFFECT_PRESERVED) === 0) {
    e = e.first;
    if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
      e.f |= EFFECT_TRANSPARENT;
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = active_reaction;
      (derived2.effects ??= []).push(e);
    }
  }
  return effect;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect = create_effect(RENDER_EFFECT, null, false);
  set_signal_status(effect, CLEAN);
  effect.teardown = fn;
  return effect;
}
function user_effect(fn) {
  validate_effect("$effect");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect"
    });
  }
  var flags2 = active_effect.f;
  var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & EFFECT_RAN) === 0;
  if (defer) {
    var context = component_context;
    (context.e ??= []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn, false);
}
function effect_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
  return () => {
    destroy_effect(effect);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect, () => {
          destroy_effect(effect);
          fulfil(undefined);
        });
      } else {
        destroy_effect(effect);
        fulfil(undefined);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn, false);
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn, true);
}
function template_effect(fn, sync = [], async = [], blockers = []) {
  flatten(blockers, sync, async, (values) => {
    create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
  });
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn, true);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
    remove_effect_dom(effect2.nodes.start, effect2.nodes.end);
    removed = true;
  }
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  set_signal_status(effect2, DESTROYED);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (true_default) {
    effect2.component_function = null;
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null)
    prev.next = next2;
  if (next2 !== null)
    next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2)
      parent.first = next2;
    if (parent.last === effect2)
      parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy)
      destroy_effect(effect2);
    if (callback)
      callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0)
    return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
    pause_children(child2, transitions, transparent ? local : false);
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0)
    return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    schedule_effect(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transition.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
function set_is_updating_effect(value) {
  is_updating_effect = value;
}
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    if (dependencies !== null) {
      var length = dependencies.length;
      for (var i = 0;i < length; i++) {
        var dependency = dependencies[i];
        if (is_dirty(dependency)) {
          update_derived(dependency);
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
    }
    if ((flags2 & CONNECTED) !== 0 && batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root = true) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  if (!async_mode_flag && current_sources?.includes(signal)) {
    return;
  }
  for (var i = 0;i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(reaction, effect2, false);
    } else if (effect2 === reaction) {
      if (root) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(reaction);
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = reaction.fn;
    var result = fn();
    var deps = reaction.deps;
    if (new_deps !== null) {
      var i;
      remove_reactions(reaction, skipped_deps);
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0;i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps;i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0;i < untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(...untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = index_of.call(reactions, signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && (new_deps === null || !new_deps.includes(dependency))) {
    set_signal_status(dependency, MAYBE_DIRTY);
    if ((dependency.f & CONNECTED) !== 0) {
      dependency.f ^= CONNECTED;
      dependency.f &= ~WAS_MARKED;
    }
    destroy_derived_effects(dependency);
    remove_reactions(dependency, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null)
    return;
  for (var i = start_index;i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  if (true_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = dev_stack;
    set_dev_stack(effect2.dev_stack ?? dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (true_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (true_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
async function tick() {
  if (async_mode_flag) {
    return new Promise((f) => {
      requestAnimationFrame(() => f());
      setTimeout(() => f());
    });
  }
  await Promise.resolve();
  flushSync();
}
function get(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  captured_signals?.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && !current_sources?.includes(signal)) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      } else {
        (active_reaction.deps ??= []).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!reactions.includes(active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (true_default) {
    recent_async_deriveds.delete(signal);
    if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
      if (signal.trace) {
        signal.trace();
      } else {
        var trace = get_error("traced at");
        if (trace) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === undefined) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace.stack !== last?.stack) {
            entry.traces.push(trace);
          }
        }
      }
    }
  }
  if (is_destroying_effect) {
    if (old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      var derived2 = signal;
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
  } else if (is_derived && (!batch_values?.has(signal) || current_batch?.is_fork && !effect_tracking())) {
    derived2 = signal;
    if (is_dirty(derived2)) {
      update_derived(derived2);
    }
    if (is_updating_effect && effect_tracking() && (derived2.f & CONNECTED) === 0) {
      reconnect(derived2);
    }
  }
  if (batch_values?.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  if (derived2.deps === null)
    return;
  derived2.f ^= CONNECTED;
  for (const dep of derived2.deps) {
    (dep.reactions ??= []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      reconnect(dep);
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED)
    return true;
  if (derived2.deps === null)
    return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(dep)) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
// node_modules/svelte/src/utils.js
var regex_return_characters = /\r/g;
function hash(str) {
  str = str.replace(regex_return_characters, "");
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return (hash2 >>> 0).toString(36);
}
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = [
  "$state",
  "$state.raw",
  "$derived",
  "$derived.by"
];
var RUNES = [
  ...STATE_CREATION_RUNES,
  "$state.eager",
  "$state.snapshot",
  "$props",
  "$props.id",
  "$bindable",
  "$effect",
  "$effect.pre",
  "$effect.tracking",
  "$effect.root",
  "$effect.pending",
  "$inspect",
  "$inspect().with",
  "$inspect.trace",
  "$host"
];
function sanitize_location(location2) {
  return location2?.replace(/\//g, "/​");
}
// node_modules/svelte/src/internal/client/dev/css.js
var all_styles = new Map;
// node_modules/svelte/src/internal/client/dom/elements/events.js
var all_registered_events = new Set;
var root_event_handles = new Set;
function delegate(events) {
  for (var i = 0;i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = handler_element.ownerDocument;
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = path[0] || event.target;
  last_propagated_event = event;
  var path_idx = 0;
  var handled_at = last_propagated_event === event && event.__root;
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
      event.__root = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = path[path_idx] || event.target;
  if (current_target === handler_element)
    return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || current_target.host || null;
      try {
        var delegated = current_target["__" + event_name];
        if (delegated != null && (!current_target.disabled || event.target === current_target)) {
          delegated.call(current_target, event);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event.__root = handler_element;
    delete event.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
function create_fragment_from_html(html) {
  var elem = document.createElement("template");
  elem.innerHTML = html.replaceAll("<!>", "<!---->");
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start, end) {
  var effect2 = active_effect;
  if (effect2.nodes === null) {
    effect2.nodes = { start, end, a: null, t: null };
  }
}
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === undefined) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment)
        node = get_first_child(node);
    }
    var clone = use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function from_namespace(content, flags2, ns = "svg") {
  var has_start = !content.startsWith("<!>");
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
  var node;
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (!node) {
      var fragment = create_fragment_from_html(wrapped);
      var root = get_first_child(fragment);
      if (is_fragment) {
        node = document.createDocumentFragment();
        while (get_first_child(root)) {
          node.appendChild(get_first_child(root));
        }
      } else {
        node = get_first_child(root);
      }
    }
    var clone = node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function from_svg(content, flags2) {
  return from_namespace(content, flags2, "svg");
}
function text(value = "") {
  if (!hydrating) {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
  var node = hydrate_node;
  if (node.nodeType !== TEXT_NODE) {
    node.before(node = create_text());
    set_hydrate_node(node);
  }
  assign_nodes(node, node);
  return node;
}
function comment() {
  if (hydrating) {
    assign_nodes(hydrate_node, null);
    return hydrate_node;
  }
  var frag = document.createDocumentFragment();
  var start = document.createComment("");
  var anchor = create_text();
  frag.append(start, anchor);
  assign_nodes(start, anchor);
  return frag;
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = active_effect;
    if ((effect2.f & EFFECT_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(dom);
}

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function set_text(text2, value) {
  var str = value == null ? "" : typeof value === "object" ? value + "" : value;
  if (str !== (text2.__t ??= text2.nodeValue)) {
    text2.__t = str;
    text2.nodeValue = str + "";
  }
}
function mount(component, options) {
  return _mount(component, options);
}
function hydrate(component, options) {
  init_operations();
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (anchor && (anchor.nodeType !== COMMENT_NODE || anchor.data !== HYDRATION_START)) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(anchor);
    const instance = _mount(component, { ...options, anchor });
    set_hydrating(false);
    return instance;
  } catch (error) {
    if (error instanceof Error && error.message.split(`
`).some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var document_listeners = new Map;
function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
  init_operations();
  var registered_events = new Set;
  var event_handle = (events2) => {
    for (var i = 0;i < events2.length; i++) {
      var event_name = events2[i];
      if (registered_events.has(event_name))
        continue;
      registered_events.add(event_name);
      var passive = is_passive_event(event_name);
      target.addEventListener(event_name, handle_event_propagation, { passive });
      var n = document_listeners.get(event_name);
      if (n === undefined) {
        document.addEventListener(event_name, handle_event_propagation, { passive });
        document_listeners.set(event_name, 1);
      } else {
        document_listeners.set(event_name, n + 1);
      }
    }
  };
  event_handle(array_from(all_registered_events));
  root_event_handles.add(event_handle);
  var component = undefined;
  var unmount = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    boundary(anchor_node, {
      pending: () => {}
    }, (anchor_node2) => {
      if (context) {
        push({});
        var ctx = component_context;
        ctx.c = context;
      }
      if (events) {
        props.$$events = events;
      }
      if (hydrating) {
        assign_nodes(anchor_node2, null);
      }
      should_intro = intro;
      component = Component(anchor_node2, props) || {};
      should_intro = true;
      if (hydrating) {
        active_effect.nodes.end = hydrate_node;
        if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || hydrate_node.data !== HYDRATION_END) {
          hydration_mismatch();
          throw HYDRATION_ERROR;
        }
      }
      if (context) {
        pop();
      }
    });
    return () => {
      for (var event_name of registered_events) {
        target.removeEventListener(event_name, handle_event_propagation);
        var n = document_listeners.get(event_name);
        if (--n === 0) {
          document.removeEventListener(event_name, handle_event_propagation);
          document_listeners.delete(event_name);
        } else {
          document_listeners.set(event_name, n);
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component, unmount);
  return component;
}
var mounted_components = new WeakMap;
function unmount(component, options) {
  const fn = mounted_components.get(component);
  if (fn) {
    mounted_components.delete(component);
    return fn(options);
  }
  if (true_default) {
    if (STATE_SYMBOL in component) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}
// node_modules/svelte/src/internal/client/dom/blocks/branches.js
class BranchManager {
  anchor;
  #batches = new Map;
  #onscreen = new Map;
  #offscreen = new Map;
  #outroing = new Set;
  #transition = true;
  constructor(anchor, transition = true) {
    this.anchor = anchor;
    this.#transition = transition;
  }
  #commit = () => {
    var batch = current_batch;
    if (!this.#batches.has(batch))
      return;
    var key = this.#batches.get(batch);
    var onscreen = this.#onscreen.get(key);
    if (onscreen) {
      resume_effect(onscreen);
      this.#outroing.delete(key);
    } else {
      var offscreen = this.#offscreen.get(key);
      if (offscreen) {
        this.#onscreen.set(key, offscreen.effect);
        this.#offscreen.delete(key);
        offscreen.fragment.lastChild.remove();
        this.anchor.before(offscreen.fragment);
        onscreen = offscreen.effect;
      }
    }
    for (const [b, k] of this.#batches) {
      this.#batches.delete(b);
      if (b === batch) {
        break;
      }
      const offscreen2 = this.#offscreen.get(k);
      if (offscreen2) {
        destroy_effect(offscreen2.effect);
        this.#offscreen.delete(k);
      }
    }
    for (const [k, effect2] of this.#onscreen) {
      if (k === key || this.#outroing.has(k))
        continue;
      const on_destroy = () => {
        const keys = Array.from(this.#batches.values());
        if (keys.includes(k)) {
          var fragment = document.createDocumentFragment();
          move_effect(effect2, fragment);
          fragment.append(create_text());
          this.#offscreen.set(k, { effect: effect2, fragment });
        } else {
          destroy_effect(effect2);
        }
        this.#outroing.delete(k);
        this.#onscreen.delete(k);
      };
      if (this.#transition || !onscreen) {
        this.#outroing.add(k);
        pause_effect(effect2, on_destroy, false);
      } else {
        on_destroy();
      }
    }
  };
  #discard = (batch) => {
    this.#batches.delete(batch);
    const keys = Array.from(this.#batches.values());
    for (const [k, branch2] of this.#offscreen) {
      if (!keys.includes(k)) {
        destroy_effect(branch2.effect);
        this.#offscreen.delete(k);
      }
    }
  };
  ensure(key, fn) {
    var batch = current_batch;
    var defer = should_defer_append();
    if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        this.#offscreen.set(key, {
          effect: branch(() => fn(target)),
          fragment
        });
      } else {
        this.#onscreen.set(key, branch(() => fn(this.anchor)));
      }
    }
    this.#batches.set(batch, key);
    if (defer) {
      for (const [k, effect2] of this.#onscreen) {
        if (k === key) {
          batch.skipped_effects.delete(effect2);
        } else {
          batch.skipped_effects.add(effect2);
        }
      }
      for (const [k, branch2] of this.#offscreen) {
        if (k === key) {
          batch.skipped_effects.delete(branch2.effect);
        } else {
          batch.skipped_effects.add(branch2.effect);
        }
      }
      batch.oncommit(this.#commit);
      batch.ondiscard(this.#discard);
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      this.#commit();
    }
  }
}
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function if_block(node, fn, elseif = false) {
  if (hydrating) {
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
  function update_branch(condition, fn2) {
    if (hydrating) {
      const is_else = read_hydration_instruction(node) === HYDRATION_START_ELSE;
      if (condition === is_else) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(condition, fn2);
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(condition, fn2);
  }
  block(() => {
    var has_branch = false;
    fn((fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    });
    if (!has_branch) {
      update_branch(false, null);
    }
  }, flags2);
}
// node_modules/svelte/src/internal/client/dom/blocks/each.js
function index(_, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0;i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(effect2, () => {
      if (group) {
        group.pending.delete(effect2);
        group.done.add(effect2);
        if (group.pending.size === 0) {
          var groups = state2.outrogroups;
          destroy_effects(array_from(group.done));
          groups.delete(group);
          if (groups.size === 0) {
            state2.outrogroups = null;
          }
        }
      } else {
        remaining -= 1;
      }
    }, false);
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null;
    if (fast_path) {
      var anchor = controlled_anchor;
      var parent_node = anchor.parentNode;
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: new Set
    };
    (state2.outrogroups ??= new Set).add(group);
  }
}
function destroy_effects(to_destroy, remove_dom = true) {
  for (var i = 0;i < to_destroy.length; i++) {
    destroy_effect(to_destroy[i], remove_dom);
  }
}
var offscreen_anchor;
function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var items = new Map;
  var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = node;
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  var array;
  var first_run = true;
  function commit() {
    state2.fallback = fallback;
    reconcile(state2, array, anchor, flags2, get_key);
    if (fallback !== null) {
      if (array.length === 0) {
        if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback);
        } else {
          fallback.f ^= EFFECT_OFFSCREEN;
          move(fallback, null, anchor);
        }
      } else {
        pause_effect(fallback, () => {
          fallback = null;
        });
      }
    }
  }
  var effect2 = block(() => {
    array = get(each_array);
    var length = array.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = new Set;
    var batch = current_batch;
    var defer = should_defer_append();
    for (var index2 = 0;index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && hydrate_node.data === HYDRATION_END) {
        anchor = hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array[index2];
      var key = get_key(value, index2);
      var item = first_run ? null : items.get(key);
      if (item) {
        if (item.v)
          internal_set(item.v, value);
        if (item.i)
          internal_set(item.i, index2);
        if (defer) {
          batch.skipped_effects.delete(item.e);
        }
      } else {
        item = create_item(items, first_run ? anchor : offscreen_anchor ??= create_text(), value, key, index2, render_fn, flags2, get_collection);
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key, item);
      }
      keys.add(key);
    }
    if (length === 0 && fallback_fn && !fallback) {
      if (first_run) {
        fallback = branch(() => fallback_fn(anchor));
      } else {
        fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
        fallback.f |= EFFECT_OFFSCREEN;
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      if (defer) {
        for (const [key2, item2] of items) {
          if (!keys.has(key2)) {
            batch.skipped_effects.add(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(() => {});
      } else {
        commit();
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get(each_array);
  });
  var state2 = { effect: effect2, flags: flags2, items, outrogroups: null, fallback };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function reconcile(state2, array, anchor, flags2, get_key) {
  var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
  var length = array.length;
  var items = state2.items;
  var current = state2.effect.first;
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0;i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect2 = items.get(key).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        effect2.nodes?.a?.measure();
        (to_animate ??= new Set).add(effect2);
      }
    }
  }
  for (i = 0;i < length; i += 1) {
    value = array[i];
    key = get_key(value, i);
    effect2 = items.get(key).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current) {
        move(effect2, null, anchor);
      } else {
        var next2 = prev ? prev.next : current;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev)
          effect2.prev.next = effect2.next;
        if (effect2.next)
          effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next2);
        move(effect2, next2, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        effect2.nodes?.a?.unfix();
        (to_animate ??= new Set).delete(effect2);
      }
    }
    if (effect2 !== current) {
      if (seen !== undefined && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start = stashed[0];
          var j;
          prev = start.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0;j < matched.length; j += 1) {
            move(matched[j], start, anchor);
          }
          for (j = 0;j < stashed.length; j += 1) {
            seen.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start);
          current = start;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current !== effect2) {
        (seen ??= new Set).add(current);
        stashed.push(current);
        current = current.next;
      }
      if (current === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current = effect2.next;
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(array_from(group.done));
        state2.outrogroups?.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current !== null || seen !== undefined) {
    var to_destroy = [];
    if (seen !== undefined) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current !== null) {
      if ((current.f & INERT) === 0 && current !== state2.fallback) {
        to_destroy.push(current);
      }
      current = current.next;
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0;i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.measure();
        }
        for (i = 0;i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      if (to_animate === undefined)
        return;
      for (effect2 of to_animate) {
        effect2.nodes?.a?.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key, index2, render_fn, flags2, get_collection) {
  var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  if (true_default && v) {
    v.trace = () => {
      get_collection()[i?.v ?? index2];
    };
  }
  return {
    v,
    i,
    e: branch(() => {
      render_fn(anchor, v ?? value, i ?? index2, get_collection);
      return () => {
        items.delete(key);
      };
    })
  };
}
function move(effect2, next2, anchor) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? next2.nodes.start : anchor;
  while (node !== null) {
    var next_node = get_next_sibling(node);
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next2) {
  if (prev === null) {
    state2.effect.first = next2;
  } else {
    prev.next = next2;
  }
  if (next2 === null) {
    state2.effect.last = prev;
  } else {
    next2.prev = prev;
  }
}
// node_modules/svelte/src/internal/client/dom/blocks/html.js
function check_hash(element, server_hash, value) {
  if (!server_hash || server_hash === hash(String(value ?? "")))
    return;
  let location2;
  const loc = element.__svelte_meta?.loc;
  if (loc) {
    location2 = `near ${loc.file}:${loc.line}:${loc.column}`;
  } else if (dev_current_component_function?.[FILENAME]) {
    location2 = `in ${dev_current_component_function[FILENAME]}`;
  }
  hydration_html_changed(sanitize_location(location2));
}
function html(node, get_value, svg = false, mathml = false, skip_warning = false) {
  var anchor = node;
  var value = "";
  template_effect(() => {
    var effect2 = active_effect;
    if (value === (value = get_value() ?? "")) {
      if (hydrating)
        hydrate_next();
      return;
    }
    if (effect2.nodes !== null) {
      remove_effect_dom(effect2.nodes.start, effect2.nodes.end);
      effect2.nodes = null;
    }
    if (value === "")
      return;
    if (hydrating) {
      var hash2 = hydrate_node.data;
      var next2 = hydrate_next();
      var last = next2;
      while (next2 !== null && (next2.nodeType !== COMMENT_NODE || next2.data !== "")) {
        last = next2;
        next2 = get_next_sibling(next2);
      }
      if (next2 === null) {
        hydration_mismatch();
        throw HYDRATION_ERROR;
      }
      if (true_default && !skip_warning) {
        check_hash(next2.parentNode, hash2, value);
      }
      assign_nodes(hydrate_node, last);
      anchor = set_hydrate_node(next2);
      return;
    }
    var html2 = value + "";
    if (svg)
      html2 = `<svg>${html2}</svg>`;
    else if (mathml)
      html2 = `<math>${html2}</math>`;
    var node2 = create_fragment_from_html(html2);
    if (svg || mathml) {
      node2 = get_first_child(node2);
    }
    assign_nodes(get_first_child(node2), node2.lastChild);
    if (svg || mathml) {
      while (get_first_child(node2)) {
        anchor.before(get_first_child(node2));
      }
    } else {
      anchor.before(node2);
    }
  });
}
// node_modules/svelte/src/internal/client/timing.js
var now = true_default ? () => performance.now() : () => Date.now();
var raf = {
  tick: (_) => (true_default ? requestAnimationFrame : noop)(_),
  now: () => now(),
  tasks: new Set
};
// node_modules/svelte/src/internal/shared/attributes.js
var replacements = {
  translate: new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
var whitespace = [...` 	
\r\f \v\uFEFF`];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key in directives) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key in styles) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0;i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/svelte/src/internal/client/dom/elements/class.js
function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
  var prev = dom.__className;
  if (hydrating || prev !== value || prev === undefined) {
    var next_class_name = to_class(value, hash2, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom.__className = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key in next_classes) {
      var is_present = !!next_classes[key];
      if (prev_classes == null || is_present !== !!prev_classes[key]) {
        dom.classList.toggle(key, is_present);
      }
    }
  }
  return next_classes;
}

// node_modules/svelte/src/internal/client/dom/elements/style.js
function update_styles(dom, prev = {}, next2, priority) {
  for (var key in next2) {
    var value = next2[key];
    if (prev[key] !== value) {
      if (next2[key] == null) {
        dom.style.removeProperty(key);
      } else {
        dom.style.setProperty(key, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom.__style;
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom.__style = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == undefined) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== undefined) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function bind_select_value(select, get2, set2 = get2) {
  var batches2 = new WeakSet;
  var mounting = true;
  listen_to_event_and_reset_event(select, "change", (is_reset) => {
    var query = is_reset ? "[selected]" : ":checked";
    var value;
    if (select.multiple) {
      value = [].map.call(select.querySelectorAll(query), get_option_value);
    } else {
      var selected_option = select.querySelector(query) ?? select.querySelector("option:not([disabled])");
      value = selected_option && get_option_value(selected_option);
    }
    set2(value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
  });
  effect(() => {
    var value = get2();
    if (select === document.activeElement) {
      var batch = previous_batch ?? current_batch;
      if (batches2.has(batch)) {
        return;
      }
    }
    select_option(select, value, mounting);
    if (mounting && value === undefined) {
      var selected_option = select.querySelector(":checked");
      if (selected_option !== null) {
        value = get_option_value(selected_option);
        set2(value);
      }
    }
    select.__value = value;
    mounting = false;
  });
  init_select(select);
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
function set_attribute2(element, attribute, value, skip_warning) {
  var attributes = get_attributes(element);
  if (hydrating) {
    attributes[attribute] = element.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element.nodeName === "LINK") {
      if (!skip_warning) {
        check_src_in_dev_hydration(element, attribute, value ?? "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value))
    return;
  if (attribute === "loading") {
    element[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
    element[attribute] = value;
  } else {
    element.setAttribute(attribute, value);
  }
}
function get_attributes(element) {
  return element.__attributes ??= {
    [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
    [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
  };
}
var setters_cache = new Map;
function get_setters(element) {
  var cache_key = element.getAttribute("is") || element.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters)
    return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key in descriptors) {
      if (descriptors[key].set) {
        setters.push(key);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element, attribute, value) {
  if (!true_default)
    return;
  if (attribute === "srcset" && srcset_url_equal(element, value))
    return;
  if (src_url_equal(element.getAttribute(attribute) ?? "", value))
    return;
  hydration_attribute_changed(attribute, element.outerHTML.replace(element.innerHTML, element.innerHTML && "..."), String(value));
}
function src_url_equal(element_src, url) {
  if (element_src === url)
    return true;
  return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element, srcset) {
  var element_urls = split_srcset(element.srcset);
  var urls = split_srcset(srcset);
  return urls.length === element_urls.length && urls.every(([url, width], i) => width === element_urls[i][1] && (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0])));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function bind_value(input, get2, set2 = get2) {
  var batches2 = new WeakSet;
  listen_to_event_and_reset_event(input, "input", async (is_reset) => {
    if (true_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
    await tick();
    if (value !== (value = get2())) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      var length = input.value.length;
      input.value = value ?? "";
      if (end !== null) {
        var new_length = input.value.length;
        if (start === end && end === length && new_length > length) {
          input.selectionStart = new_length;
          input.selectionEnd = new_length;
        } else {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, new_length);
        }
      }
    }
  });
  if (hydrating && input.defaultValue !== input.value || untrack(get2) == null && input.value) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
  }
  render_effect(() => {
    if (true_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = get2();
    if (input === document.activeElement) {
      var batch = previous_batch ?? current_batch;
      if (batches2.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
var pending = new Set;
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/size.js
class ResizeObserverSingleton {
  #listeners = new WeakMap;
  #observer;
  #options;
  static entries = new WeakMap;
  constructor(options) {
    this.#options = options;
  }
  observe(element, listener) {
    var listeners = this.#listeners.get(element) || new Set;
    listeners.add(listener);
    this.#listeners.set(element, listeners);
    this.#getObserver().observe(element, this.#options);
    return () => {
      var listeners2 = this.#listeners.get(element);
      listeners2.delete(listener);
      if (listeners2.size === 0) {
        this.#listeners.delete(element);
        this.#observer.unobserve(element);
      }
    };
  }
  #getObserver() {
    return this.#observer ?? (this.#observer = new ResizeObserver((entries) => {
      for (var entry of entries) {
        ResizeObserverSingleton.entries.set(entry.target, entry);
        for (var listener of this.#listeners.get(entry.target) || []) {
          listener(entry);
        }
      }
    }));
  }
}
// node_modules/svelte/src/internal/client/reactivity/store.js
var is_store_binding = false;
var IS_UNMOUNTED = Symbol();
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/internal/client/reactivity/props.js
function prop(props, key, flags2, fallback) {
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = fallback;
  var fallback_dirty = true;
  var get_fallback = () => {
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(fallback) : fallback;
    }
    return fallback_value;
  };
  var setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : undefined);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
  } else {
    initial_value = props[key];
  }
  if (initial_value === undefined && fallback !== undefined) {
    initial_value = get_fallback();
    if (setter) {
      if (runes)
        props_invalid_value(key);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = props[key];
      if (value === undefined)
        return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = props[key];
      if (value !== undefined) {
        fallback_value = undefined;
      }
      return value === undefined ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return function(value, mutation) {
      if (arguments.length > 0) {
        if (!runes || !mutation || legacy_parent || is_store_sub) {
          setter(mutation ? getter() : value);
        }
        return value;
      }
      return getter();
    };
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (true_default) {
    d.label = key;
  }
  if (bindable)
    get(d);
  var parent_effect = active_effect;
  return function(value, mutation) {
    if (arguments.length > 0) {
      const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
      set(d, new_value);
      overridden = true;
      if (fallback_value !== undefined) {
        fallback_value = new_value;
      }
      return value;
    }
    if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
      return d.v;
    }
    return get(d);
  };
}
// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
class Svelte4Component {
  #events;
  #instance;
  constructor(options) {
    var sources = new Map;
    var add_source = (key, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key, s);
      return s;
    };
    const props = new Proxy({ ...options.props || {}, $$events: {} }, {
      get(target, prop2) {
        return get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
      },
      has(target, prop2) {
        if (prop2 === LEGACY_PROPS)
          return true;
        get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
        return Reflect.has(target, prop2);
      },
      set(target, prop2, value) {
        set(sources.get(prop2) ?? add_source(prop2, value), value);
        return Reflect.set(target, prop2, value);
      }
    });
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover
    });
    if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key of Object.keys(this.#instance)) {
      if (key === "$set" || key === "$destroy" || key === "$on")
        continue;
      define_property(this, key, {
        get() {
          return this.#instance[key];
        },
        set(value) {
          this.#instance[key] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  $set(props) {
    this.#instance.$set(props);
  }
  $on(event, callback) {
    this.#events[event] = this.#events[event] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event].push(cb);
    return () => {
      this.#events[event] = this.#events[event].filter((fn) => fn !== cb);
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    $$ctor;
    $$s;
    $$c;
    $$cn = false;
    $$d = {};
    $$r = false;
    $$p_d = {};
    $$l = {};
    $$l_u = new Map;
    $$me;
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return (anchor) => {
            const slot = document.createElement("slot");
            if (name !== "default")
              slot.name = name;
            append(anchor, slot);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== undefined) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this
          }
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            this.$$r = true;
            for (const key of object_keys(this.$$c)) {
              if (!this.$$p_d[key]?.reflect)
                continue;
              this.$$d[key] = this.$$c[key];
              const attribute_value = get_custom_element_value(key, this.$$d[key], this.$$p_d, "toAttribute");
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      if (this.$$r)
        return;
      attr = this.$$g_p(attr);
      this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr]: this.$$d[attr] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = undefined;
        }
      });
    }
    $$g_p(attribute_name) {
      return object_keys(this.$$p_d).find((key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  const type = props_definition[prop2]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element) {
  const result = {};
  element.childNodes.forEach((node) => {
    result[node.slot || "default"] = true;
  });
  return result;
}
// node_modules/svelte/src/index-client.js
if (true_default) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        get: () => {
          if (value !== undefined) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}

// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= new Set).add(PUBLIC_VERSION);
}

// web/components/Sidebar.svelte
var root_2 = from_html(`
          <span class="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[1.25rem] text-center"> </span>
        `, 1);
var root_1 = from_html(`
      <a>
        <span class="text-lg"> </span>
        <span class="flex-1"> </span>
        <!>
      </a>
    `, 1);
var root = from_html(`

<aside class="fixed left-0 top-0 h-full w-60 bg-slate-900 text-white flex flex-col">
  <div class="p-4 border-b border-slate-700">
    <h1 class="text-xl font-bold flex items-center gap-2">
      <span class="text-2xl">⚡</span>
      Pipeline Viewer
    </h1>
    <p class="text-xs text-slate-400 mt-1">ezAiPipeline Dashboard</p>
  </div>

  <nav class="flex-1 py-4">
    <!>
  </nav>

  <div class="p-4 border-t border-slate-700 text-xs text-slate-500">
    <p>Built with Bun + Svelte</p>
  </div>
</aside>`, 1);
function Sidebar($$anchor, $$props) {
  push($$props, true);
  let runningCount = state(0);
  const navItems = [
    { path: "/", label: "Dashboard", icon: "\uD83D\uDCCA" },
    { path: "/pipelines", label: "Pipelines", icon: "\uD83D\uDD27" },
    {
      path: "/running",
      label: "Running",
      icon: "▶️",
      showCount: true
    },
    { path: "/outputs", label: "Outputs", icon: "\uD83D\uDCC4" }
  ];
  function isActive(path) {
    if (path === "/")
      return $$props.currentPath === "/" || $$props.currentPath === "";
    return $$props.currentPath.startsWith(path);
  }
  function handleClick(e, path) {
    e.preventDefault();
    $$props.navigate(path);
  }
  async function fetchRunningCount() {
    try {
      const res = await fetch("/api/executions/running");
      if (res.ok) {
        const data = await res.json();
        set(runningCount, data.count, true);
      }
    } catch {}
  }
  user_effect(() => {
    fetchRunningCount();
    const interval = setInterval(fetchRunningCount, 2000);
    return () => clearInterval(interval);
  });
  next();
  var fragment = root();
  var aside = sibling(first_child(fragment));
  var nav = sibling(child(aside), 3);
  var node = sibling(child(nav));
  each(node, 17, () => navItems, index, ($$anchor2, item) => {
    next();
    var fragment_1 = root_1();
    var a = sibling(first_child(fragment_1));
    a.__click = (e) => handleClick(e, get(item).path);
    var span = sibling(child(a));
    var text2 = child(span, true);
    reset(span);
    var span_1 = sibling(span, 2);
    var text_1 = child(span_1, true);
    reset(span_1);
    var node_1 = sibling(span_1, 2);
    {
      var consequent = ($$anchor3) => {
        var fragment_2 = root_2();
        var span_2 = sibling(first_child(fragment_2));
        var text_2 = child(span_2);
        reset(span_2);
        next();
        template_effect(() => set_text(text_2, `
            ${get(runningCount) ?? ""}
          `));
        append($$anchor3, fragment_2);
      };
      if_block(node_1, ($$render) => {
        if (get(item).showCount && get(runningCount) > 0)
          $$render(consequent);
      });
    }
    next();
    reset(a);
    next();
    template_effect(($0) => {
      set_attribute2(a, "href", get(item).path);
      set_class(a, 1, `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors cursor-pointer ${$0 ?? ""}`);
      set_text(text2, get(item).icon);
      set_text(text_1, get(item).label);
    }, [
      () => isActive(get(item).path) ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
    ]);
    append($$anchor2, fragment_1);
  });
  next();
  reset(nav);
  next(3);
  reset(aside);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var Sidebar_default = Sidebar;
delegate(["click"]);

// web/components/Dashboard.svelte
var root_12 = from_html(`
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading...</div>
    </div>
  `, 1);
var root_3 = from_html(`
            <button class="w-full p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer">
              <div class="font-medium text-slate-800"> </div>
              <div class="text-sm text-slate-500"> </div>
            </button>
          `, 1);
var root_4 = from_html(`
            <div class="p-4 text-slate-500 text-sm">No pipelines found</div>
          `, 1);
var root_5 = from_html(`
            <button class="w-full p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer">
              <div class="flex items-center justify-between">
                <div class="font-medium text-slate-800"> </div>
                <span> </span>
              </div>
              <div class="text-sm text-slate-500 mt-1"> </div>
            </button>
          `, 1);
var root_6 = from_html(`
            <div class="p-4 text-slate-500 text-sm">No outputs found</div>
          `, 1);
var root_22 = from_html(`
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-blue-600"> </div>
        <div class="text-sm text-slate-500 mt-1">Pipelines</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-green-600"> </div>
        <div class="text-sm text-slate-500 mt-1">Total Runs</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-emerald-600"> </div>
        <div class="text-sm text-slate-500 mt-1">Successful</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-purple-600"> </div>
        <div class="text-sm text-slate-500 mt-1">Total Cost</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 class="font-semibold text-slate-700">Pipelines</h2>
          <button class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            View all →
          </button>
        </div>
        <div class="divide-y divide-slate-100">
          <!>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 class="font-semibold text-slate-700">Recent Runs</h2>
          <button class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            View all →
          </button>
        </div>
        <div class="divide-y divide-slate-100">
          <!>
        </div>
      </div>
    </div>
  `, 1);
var root2 = from_html(`

<div>
  <h1 class="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

  <!>
</div>`, 1);
function Dashboard($$anchor, $$props) {
  push($$props, true);
  let pipelines = state(proxy([]));
  let outputs = state(proxy([]));
  let loading = state(true);
  user_effect(() => {
    Promise.all([
      fetch("/api/pipelines").then((r) => r.json()),
      fetch("/api/outputs").then((r) => r.json())
    ]).then(([p, o]) => {
      set(pipelines, p, true);
      set(outputs, o, true);
      set(loading, false);
    });
  });
  function formatCost(cost) {
    return `$${cost?.toFixed(4) ?? "0.0000"}`;
  }
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  let totalCost = user_derived(() => get(outputs).reduce((sum, o) => sum + (o.cost || 0), 0));
  let successCount = user_derived(() => get(outputs).filter((o) => o.status === "success").length);
  next();
  var fragment = root2();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div), 3);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_12();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_22();
      var div_1 = sibling(first_child(fragment_2));
      var div_2 = sibling(child(div_1));
      var div_3 = sibling(child(div_2));
      var text2 = child(div_3, true);
      reset(div_3);
      next(3);
      reset(div_2);
      var div_4 = sibling(div_2, 2);
      var div_5 = sibling(child(div_4));
      var text_1 = child(div_5, true);
      reset(div_5);
      next(3);
      reset(div_4);
      var div_6 = sibling(div_4, 2);
      var div_7 = sibling(child(div_6));
      var text_2 = child(div_7, true);
      reset(div_7);
      next(3);
      reset(div_6);
      var div_8 = sibling(div_6, 2);
      var div_9 = sibling(child(div_8));
      var text_3 = child(div_9, true);
      reset(div_9);
      next(3);
      reset(div_8);
      next();
      reset(div_1);
      var div_10 = sibling(div_1, 2);
      var div_11 = sibling(child(div_10));
      var div_12 = sibling(child(div_11));
      var button = sibling(child(div_12), 3);
      button.__click = () => $$props.navigate("/pipelines");
      next();
      reset(div_12);
      var div_13 = sibling(div_12, 2);
      var node_1 = sibling(child(div_13));
      each(node_1, 17, () => get(pipelines), index, ($$anchor3, pipeline) => {
        next();
        var fragment_3 = root_3();
        var button_1 = sibling(first_child(fragment_3));
        button_1.__click = () => $$props.navigate(`/pipelines/${get(pipeline).id}`);
        var div_14 = sibling(child(button_1));
        var text_4 = child(div_14, true);
        reset(div_14);
        var div_15 = sibling(div_14, 2);
        var text_5 = child(div_15);
        reset(div_15);
        next();
        reset(button_1);
        next();
        template_effect(() => {
          set_text(text_4, get(pipeline).name);
          set_text(text_5, `${get(pipeline).stageCount ?? ""} stages`);
        });
        append($$anchor3, fragment_3);
      }, ($$anchor3) => {
        next();
        var fragment_4 = root_4();
        next(2);
        append($$anchor3, fragment_4);
      });
      next();
      reset(div_13);
      next();
      reset(div_11);
      var div_16 = sibling(div_11, 2);
      var div_17 = sibling(child(div_16));
      var button_2 = sibling(child(div_17), 3);
      button_2.__click = () => $$props.navigate("/outputs");
      next();
      reset(div_17);
      var div_18 = sibling(div_17, 2);
      var node_2 = sibling(child(div_18));
      each(node_2, 17, () => get(outputs).slice(0, 5), index, ($$anchor3, output) => {
        next();
        var fragment_5 = root_5();
        var button_3 = sibling(first_child(fragment_5));
        button_3.__click = () => $$props.navigate(`/outputs/${get(output).filename}`);
        var div_19 = sibling(child(button_3));
        var div_20 = sibling(child(div_19));
        var text_6 = child(div_20, true);
        reset(div_20);
        var span = sibling(div_20, 2);
        var text_7 = child(span);
        reset(span);
        next();
        reset(div_19);
        var div_21 = sibling(div_19, 2);
        var text_8 = child(div_21);
        reset(div_21);
        next();
        reset(button_3);
        next();
        template_effect(($0, $1) => {
          set_text(text_6, get(output).pipelineId);
          set_class(span, 1, `text-xs px-2 py-1 rounded-full ${get(output).status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`);
          set_text(text_7, `
                  ${get(output).status ?? ""}
                `);
          set_text(text_8, `
                ${$0 ?? ""} · ${$1 ?? ""}
              `);
        }, [
          () => formatDate(get(output).timestamp),
          () => formatCost(get(output).cost)
        ]);
        append($$anchor3, fragment_5);
      }, ($$anchor3) => {
        next();
        var fragment_6 = root_6();
        next(2);
        append($$anchor3, fragment_6);
      });
      next();
      reset(div_18);
      next();
      reset(div_16);
      next();
      reset(div_10);
      next();
      template_effect(($0) => {
        set_text(text2, get(pipelines).length);
        set_text(text_1, get(outputs).length);
        set_text(text_2, get(successCount));
        set_text(text_3, $0);
      }, [() => formatCost(get(totalCost))]);
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(loading))
        $$render(consequent);
      else
        $$render(alternate, false);
    });
  }
  next();
  reset(div);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var Dashboard_default = Dashboard;
delegate(["click"]);

// web/components/pipelines/PipelineList.svelte
var root_13 = from_html(`
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading pipelines...</div>
    </div>
  `, 1);
var root_32 = from_html(`
    <div class="bg-red-50 text-red-600 p-4 rounded-lg"> </div>
  `, 1);
var root_52 = from_html(`
        <button class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-left hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
          <div class="flex items-start justify-between mb-3">
            <div class="text-2xl">\uD83D\uDD27</div>
            <span> </span>
          </div>

          <h3 class="font-semibold text-slate-800 mb-1"> </h3>
          <p class="text-xs text-slate-400 mb-2"> </p>

          <p class="text-sm text-slate-600 line-clamp-2 mb-4"> </p>

          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500"> </span>
            <span class="text-blue-600">View →</span>
          </div>
        </button>
      `, 1);
var root_62 = from_html(`
        <div class="col-span-full text-center py-12 text-slate-500">
          <p class="text-4xl mb-4">\uD83D\uDCED</p>
          <p>No pipelines found</p>
          <p class="text-sm mt-2">Add pipeline files to the <code class="bg-slate-100 px-2 py-1 rounded">pipelines/</code> folder</p>
        </div>
      `, 1);
var root_42 = from_html(`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!>
    </div>
  `, 1);
var root3 = from_html(`

<div>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-800">Pipelines</h1>
    <p class="text-slate-500 mt-1">View and explore your pipeline configurations</p>
  </div>

  <!>
</div>`, 1);
function PipelineList($$anchor, $$props) {
  push($$props, true);
  let pipelines = state(proxy([]));
  let loading = state(true);
  let error = state(null);
  user_effect(() => {
    fetch("/api/pipelines").then((r) => r.json()).then((data) => {
      set(pipelines, data, true);
      set(loading, false);
    }).catch((e) => {
      set(error, e.message, true);
      set(loading, false);
    });
  });
  const providerColors = {
    anthropic: "bg-orange-100 text-orange-700",
    openai: "bg-green-100 text-green-700",
    google: "bg-blue-100 text-blue-700"
  };
  next();
  var fragment = root3();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div), 3);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_13();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate_1 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_32();
          var div_1 = sibling(first_child(fragment_3));
          var text2 = child(div_1, true);
          reset(div_1);
          next();
          template_effect(() => set_text(text2, get(error)));
          append($$anchor3, fragment_3);
        };
        var alternate = ($$anchor3) => {
          var fragment_4 = root_42();
          var div_2 = sibling(first_child(fragment_4));
          var node_2 = sibling(child(div_2));
          each(node_2, 17, () => get(pipelines), index, ($$anchor4, pipeline) => {
            next();
            var fragment_5 = root_52();
            var button = sibling(first_child(fragment_5));
            button.__click = () => $$props.navigate(`/pipelines/${get(pipeline).id}`);
            var div_3 = sibling(child(button));
            var span = sibling(child(div_3), 3);
            var text_1 = child(span);
            reset(span);
            next();
            reset(div_3);
            var h3 = sibling(div_3, 2);
            var text_2 = child(h3, true);
            reset(h3);
            var p = sibling(h3, 2);
            var text_3 = child(p);
            reset(p);
            var p_1 = sibling(p, 2);
            var text_4 = child(p_1);
            reset(p_1);
            var div_4 = sibling(p_1, 2);
            var span_1 = sibling(child(div_4));
            var text_5 = child(span_1);
            reset(span_1);
            next(3);
            reset(div_4);
            next();
            reset(button);
            next();
            template_effect(() => {
              set_class(span, 1, `text-xs px-2 py-1 rounded-full ${(providerColors[get(pipeline).defaultProvider] || "bg-gray-100 text-gray-700") ?? ""}`);
              set_text(text_1, `
              ${get(pipeline).defaultProvider ?? ""}
            `);
              set_text(text_2, get(pipeline).name);
              set_text(text_3, `v${get(pipeline).version ?? ""}`);
              set_text(text_4, `
            ${(get(pipeline).description || "No description") ?? ""}
          `);
              set_text(text_5, `${get(pipeline).stageCount ?? ""} stages`);
            });
            append($$anchor4, fragment_5);
          }, ($$anchor4) => {
            next();
            var fragment_6 = root_62();
            next(2);
            append($$anchor4, fragment_6);
          });
          next();
          reset(div_2);
          next();
          append($$anchor3, fragment_4);
        };
        if_block(node_1, ($$render) => {
          if (get(error))
            $$render(consequent_1);
          else
            $$render(alternate, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(loading))
        $$render(consequent);
      else
        $$render(alternate_1, false);
    });
  }
  next();
  reset(div);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var PipelineList_default = PipelineList;
delegate(["click"]);

// web/components/execution/StageStatus.svelte
var root_14 = from_html(`
        <span class="text-sm font-medium"> </span>
      `, 1);
var root_33 = from_svg(`
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `, 1);
var root_53 = from_svg(`
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      `, 1);
var root_7 = from_svg(`
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
        </svg>
      `, 1);
var root_9 = from_svg(`
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      `, 1);
var root_10 = from_html(`
        <div class="text-xs text-red-600 mt-1 truncate"> </div>
      `, 1);
var root_122 = from_html(`
        <div class="text-xs text-blue-600 mt-1">Running...</div>
      `, 1);
var root_132 = from_html(`
        <span class="text-blue-600">...</span>
      `, 1);
var root_15 = from_html(`
      <div class="p-1.5 shrink-0">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    `, 1);
var root_16 = from_html(`
    <div class="border-t border-current/10 p-4 bg-white/80">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xs font-medium text-slate-500">Stage Output</div>
        <div class="text-xs text-slate-400"> </div>
      </div>
      <div class="text-sm text-slate-700 max-h-96 overflow-y-auto bg-slate-50 rounded-lg p-4 prose prose-sm prose-slate max-w-none">
        <!>
      </div>
    </div>
  `, 1);
var root4 = from_html(`

<div>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="flex items-center gap-3 p-3">
    <!-- Status Icon -->
    <div>
      <!>
    </div>

    <!-- Stage Info -->
    <div class="flex-1 min-w-0">
      <div class="font-medium text-slate-800 truncate"> </div>
      <!>
    </div>

    <!-- Duration -->
    <div class="text-sm text-slate-600 w-16 text-right shrink-0">
      <!>
    </div>

    <!-- Cost -->
    <div class="text-sm text-slate-600 w-20 text-right shrink-0"> </div>

    <!-- Output Toggle Indicator -->
    <!>
  </div>

  <!-- Expandable Output Section with Syntax Highlighting -->
  <!>
</div>`, 1);
function StageStatus($$anchor, $$props) {
  push($$props, true);
  let expanded = prop($$props, "expanded", 3, false);
  const statusColors = {
    pending: "text-slate-400 bg-slate-50",
    running: "text-blue-600 bg-blue-50",
    completed: "text-green-600 bg-green-50",
    skipped: "text-yellow-600 bg-yellow-50",
    failed: "text-red-600 bg-red-50"
  };
  function formatDuration(ms) {
    if (!ms)
      return "—";
    if (ms < 1000)
      return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }
  function formatCost(cost) {
    if (!cost)
      return "—";
    return `$${cost.toFixed(4)}`;
  }
  function handleCardClick() {
    if ($$props.stage.output && $$props.onToggle) {
      $$props.onToggle();
    }
  }
  function highlightOutput(text2) {
    if (!text2)
      return "";
    let html2 = text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html2 = html2.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="bg-slate-800 text-slate-100 rounded-md p-3 my-2 overflow-x-auto"><div class="text-xs text-slate-400 mb-1">${lang || "code"}</div><code class="text-sm">${highlightCode(code, lang)}</code></div>`;
    });
    html2 = html2.replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm">$1</code>');
    html2 = html2.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, content) => {
      const level = hashes.length;
      const sizes = [
        "text-xl font-bold",
        "text-lg font-bold",
        "text-base font-semibold",
        "text-sm font-semibold",
        "text-sm font-medium",
        "text-xs font-medium"
      ];
      return `<div class="${sizes[level - 1] || sizes[5]} text-slate-800 mt-3 mb-1">${content}</div>`;
    });
    html2 = html2.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html2 = html2.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    html2 = html2.replace(/^[-*]\s+(.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-slate-400">•</span><span>$1</span></div>');
    html2 = html2.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-slate-500 font-medium">$1.</span><span>$2</span></div>');
    return html2;
  }
  function highlightCode(code, lang) {
    const keywords = {
      js: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this)\b/g,
      ts: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|interface|type|extends|implements)\b/g,
      python: /\b(def|class|import|from|return|if|elif|else|for|while|try|except|raise|with|as|lambda|yield|async|await)\b/g,
      json: /("(?:[^"\\]|\\.)*")\s*:/g
    };
    let highlighted = code;
    highlighted = highlighted.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-400">$&</span>');
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');
    const langKey = lang?.toLowerCase();
    if (keywords[langKey]) {
      highlighted = highlighted.replace(keywords[langKey], '<span class="text-purple-400">$&</span>');
    }
    highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, '<span class="text-slate-500 italic">$1</span>');
    return highlighted;
  }
  next();
  var fragment = root4();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div));
  var node_1 = sibling(node, 2);
  var div_1 = sibling(node_1, 2);
  div_1.__click = handleCardClick;
  var node_2 = sibling(child(div_1));
  var div_2 = sibling(node_2, 2);
  var node_3 = sibling(child(div_2));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_14();
      var span = sibling(first_child(fragment_1));
      var text_1 = child(span, true);
      reset(span);
      next();
      template_effect(() => set_text(text_1, $$props.index + 1));
      append($$anchor2, fragment_1);
    };
    var alternate_3 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_4 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_33();
          next(2);
          append($$anchor3, fragment_3);
        };
        var alternate_2 = ($$anchor3) => {
          var fragment_4 = comment();
          var node_5 = first_child(fragment_4);
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_5 = root_53();
              next(2);
              append($$anchor4, fragment_5);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment_6 = comment();
              var node_6 = first_child(fragment_6);
              {
                var consequent_3 = ($$anchor5) => {
                  var fragment_7 = root_7();
                  next(2);
                  append($$anchor5, fragment_7);
                };
                var alternate = ($$anchor5) => {
                  var fragment_8 = comment();
                  var node_7 = first_child(fragment_8);
                  {
                    var consequent_4 = ($$anchor6) => {
                      var fragment_9 = root_9();
                      next(2);
                      append($$anchor6, fragment_9);
                    };
                    if_block(node_7, ($$render) => {
                      if ($$props.stage.status === "failed")
                        $$render(consequent_4);
                    }, true);
                  }
                  append($$anchor5, fragment_8);
                };
                if_block(node_6, ($$render) => {
                  if ($$props.stage.status === "skipped")
                    $$render(consequent_3);
                  else
                    $$render(alternate, false);
                }, true);
              }
              append($$anchor4, fragment_6);
            };
            if_block(node_5, ($$render) => {
              if ($$props.stage.status === "completed")
                $$render(consequent_2);
              else
                $$render(alternate_1, false);
            }, true);
          }
          append($$anchor3, fragment_4);
        };
        if_block(node_4, ($$render) => {
          if ($$props.stage.status === "running")
            $$render(consequent_1);
          else
            $$render(alternate_2, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node_3, ($$render) => {
      if ($$props.stage.status === "pending")
        $$render(consequent);
      else
        $$render(alternate_3, false);
    });
  }
  next();
  reset(div_2);
  var node_8 = sibling(div_2, 2);
  var div_3 = sibling(node_8, 2);
  var div_4 = sibling(child(div_3));
  var text_2 = child(div_4);
  reset(div_4);
  var node_9 = sibling(div_4, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var fragment_10 = root_10();
      var div_5 = sibling(first_child(fragment_10));
      var text_3 = child(div_5, true);
      reset(div_5);
      next();
      template_effect(() => set_text(text_3, $$props.stage.error));
      append($$anchor2, fragment_10);
    };
    var alternate_4 = ($$anchor2) => {
      var fragment_11 = comment();
      var node_10 = first_child(fragment_11);
      {
        var consequent_6 = ($$anchor3) => {
          var fragment_12 = root_122();
          next(2);
          append($$anchor3, fragment_12);
        };
        if_block(node_10, ($$render) => {
          if ($$props.stage.status === "running")
            $$render(consequent_6);
        }, true);
      }
      append($$anchor2, fragment_11);
    };
    if_block(node_9, ($$render) => {
      if ($$props.stage.error)
        $$render(consequent_5);
      else
        $$render(alternate_4, false);
    });
  }
  next();
  reset(div_3);
  var node_11 = sibling(div_3, 2);
  var div_6 = sibling(node_11, 2);
  var node_12 = sibling(child(div_6));
  {
    var consequent_7 = ($$anchor2) => {
      var fragment_13 = root_132();
      next(2);
      append($$anchor2, fragment_13);
    };
    var alternate_5 = ($$anchor2) => {
      var text_4 = text();
      template_effect(($0) => set_text(text_4, `
        ${$0 ?? ""}
      `), [() => formatDuration($$props.stage.duration)]);
      append($$anchor2, text_4);
    };
    if_block(node_12, ($$render) => {
      if ($$props.stage.status === "running")
        $$render(consequent_7);
      else
        $$render(alternate_5, false);
    });
  }
  next();
  reset(div_6);
  var node_13 = sibling(div_6, 2);
  var div_7 = sibling(node_13, 2);
  var text_5 = child(div_7);
  reset(div_7);
  var node_14 = sibling(div_7, 2);
  var node_15 = sibling(node_14, 2);
  {
    var consequent_8 = ($$anchor2) => {
      var fragment_15 = root_15();
      var div_8 = sibling(first_child(fragment_15));
      var svg = sibling(child(div_8));
      next();
      reset(div_8);
      next();
      template_effect(() => set_class(svg, 0, `w-4 h-4 text-slate-500 transition-transform duration-200 ${expanded() ? "rotate-180" : ""}`));
      append($$anchor2, fragment_15);
    };
    if_block(node_15, ($$render) => {
      if ($$props.stage.output)
        $$render(consequent_8);
    });
  }
  next();
  reset(div_1);
  var node_16 = sibling(div_1, 2);
  var node_17 = sibling(node_16, 2);
  {
    var consequent_9 = ($$anchor2) => {
      var fragment_16 = root_16();
      var div_9 = sibling(first_child(fragment_16));
      var div_10 = sibling(child(div_9));
      var div_11 = sibling(child(div_10), 3);
      var text_6 = child(div_11);
      reset(div_11);
      next();
      reset(div_10);
      var div_12 = sibling(div_10, 2);
      var node_18 = sibling(child(div_12));
      html(node_18, () => highlightOutput($$props.stage.output));
      next();
      reset(div_12);
      next();
      reset(div_9);
      next();
      template_effect(($0) => set_text(text_6, `${$0 ?? ""} chars`), [() => $$props.stage.output.length.toLocaleString()]);
      append($$anchor2, fragment_16);
    };
    if_block(node_17, ($$render) => {
      if ($$props.stage.output && expanded())
        $$render(consequent_9);
    });
  }
  next();
  reset(div);
  template_effect(($0) => {
    set_class(div, 1, `rounded-lg border ${statusColors[$$props.stage.status] ?? ""} transition-all duration-300 ${$$props.stage.output && $$props.onToggle ? "cursor-pointer hover:shadow-md" : ""}`);
    set_class(div_2, 1, `w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0
      ${$$props.stage.status === "pending" ? "bg-slate-200 text-slate-500" : ""}
      ${$$props.stage.status === "running" ? "bg-blue-200 text-blue-700 animate-pulse" : ""}
      ${$$props.stage.status === "completed" ? "bg-green-200 text-green-700" : ""}
      ${$$props.stage.status === "skipped" ? "bg-yellow-200 text-yellow-700" : ""}
      ${$$props.stage.status === "failed" ? "bg-red-200 text-red-700" : ""}
    `);
    set_text(text_2, `
        ${$$props.index + 1}. ${$$props.stage.name ?? ""}
      `);
    set_text(text_5, `
      ${$0 ?? ""}
    `);
  }, [() => formatCost($$props.stage.cost)]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var StageStatus_default = StageStatus;
delegate(["click"]);

// web/components/execution/ExecutionProgress.svelte
var root_17 = from_html(`
        <span class="text-xs text-blue-600 flex items-center gap-1">
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Connecting...
        </span>
      `, 1);
var root_34 = from_html(`
        <span class="text-xs text-green-600 flex items-center gap-1">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Live
        </span>
      `, 1);
var root_43 = from_html(`
      <!>
    `, 1);
var root_54 = from_html(`
      <div class="text-center text-slate-500 py-8">
        Waiting for stages to start...
      </div>
    `, 1);
var root_8 = from_html(`
            <div class="text-sm text-green-600 grid grid-cols-2 gap-2">
              <div> </div>
              <div> </div>
              <div> </div>
              <div> </div>
            </div>
          `, 1);
var root_72 = from_html(`
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <div class="flex items-center gap-2 text-green-700 font-medium mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Execution Complete
          </div>
          <!>
        </div>
      `, 1);
var root_102 = from_html(`
        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div class="flex items-center gap-2 text-yellow-700 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Execution Cancelled
          </div>
        </div>
      `, 1);
var root_123 = from_html(`
            <div class="text-sm text-red-600"> </div>
          `, 1);
var root_11 = from_html(`
        <div class="bg-red-50 rounded-lg p-4 border border-red-200">
          <div class="flex items-center gap-2 text-red-700 font-medium mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Execution Failed
          </div>
          <!>
        </div>
      `, 1);
var root_63 = from_html(`
    <div class="mt-6 pt-4 border-t border-slate-200">
      <!>
    </div>
  `, 1);
var root5 = from_html(`

<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center justify-between mb-4">
    <h2 class="font-semibold text-slate-700">Execution Progress</h2>
    <div class="flex items-center gap-4">
      <!>
      <span class="text-sm font-medium text-slate-700"> </span>
    </div>
  </div>

  <div class="space-y-2">
    <!>
  </div>

  <!>
</div>`, 1);
function ExecutionProgress($$anchor, $$props) {
  push($$props, true);
  let stages = state(proxy([]));
  let result = state(null);
  let wsStatus = state("connecting");
  let totalCost = state(0);
  let expandedStages = state(proxy(new Set));
  function toggleStage(stageId) {
    const newSet = new Set(get(expandedStages));
    if (newSet.has(stageId)) {
      newSet.delete(stageId);
    } else {
      newSet.add(stageId);
    }
    set(expandedStages, newSet, true);
  }
  function autoExpandStage(stageId) {
    if (!get(expandedStages).has(stageId)) {
      const newSet = new Set(get(expandedStages));
      newSet.add(stageId);
      set(expandedStages, newSet, true);
    }
  }
  user_effect(() => {
    if (!$$props.executionId)
      return;
    const ws = new WebSocket(`ws://${location.host}/ws`);
    ws.onopen = () => {
      set(wsStatus, "connected");
      ws.send(JSON.stringify({ type: "subscribe", executionId: $$props.executionId }));
    };
    ws.onmessage = (event2) => {
      const data = JSON.parse(event2.data);
      if (data.type === "subscribed" && !data.success) {
        set(wsStatus, "disconnected");
        return;
      }
      if (data.type === "execution:started") {
        set(stages, [], true);
      }
      if (data.type === "stage:started") {
        const existingIndex = get(stages).findIndex((s) => s.id === data.stage.id);
        if (existingIndex >= 0) {
          get(stages)[existingIndex] = { ...get(stages)[existingIndex], status: "running" };
        } else {
          set(stages, [
            ...get(stages),
            {
              id: data.stage.id,
              name: data.stage.name,
              type: data.stage.type,
              status: "running"
            }
          ], true);
        }
        autoExpandStage(data.stage.id);
      }
      if (data.type === "stage:completed") {
        const index2 = get(stages).findIndex((s) => s.id === data.stage.id);
        if (index2 >= 0) {
          get(stages)[index2] = {
            ...get(stages)[index2],
            status: "completed",
            duration: data.result?.duration,
            cost: data.result?.cost
          };
          set(totalCost, get(stages).reduce((sum, s) => sum + (s.cost || 0), 0), true);
        }
      }
      if (data.type === "stage:skipped") {
        const existingIndex = get(stages).findIndex((s) => s.id === data.stage.id);
        if (existingIndex >= 0) {
          get(stages)[existingIndex] = { ...get(stages)[existingIndex], status: "skipped" };
        } else {
          set(stages, [
            ...get(stages),
            {
              id: data.stage.id,
              name: data.stage.name,
              type: data.stage.type,
              status: "skipped"
            }
          ], true);
        }
      }
      if (data.type === "stage:failed") {
        const index2 = get(stages).findIndex((s) => s.id === data.stage.id);
        if (index2 >= 0) {
          get(stages)[index2] = { ...get(stages)[index2], status: "failed", error: data.error };
        }
      }
      if (data.type === "stage:output") {
        const index2 = get(stages).findIndex((s) => s.id === data.stageId);
        if (index2 >= 0) {
          get(stages)[index2] = { ...get(stages)[index2], output: data.output };
          autoExpandStage(data.stageId);
        }
      }
      if (data.type === "execution:completed" || data.type === "execution:failed") {
        set(result, data.result || { status: "failed", pipelineId: "", error: data.error }, true);
        set(totalCost, get(result)?.summary?.totalCost || get(totalCost), true);
        ws.close();
        set(wsStatus, "disconnected");
        if ($$props.onComplete) {
          $$props.onComplete(get(result));
        }
      }
      if (data.type === "execution:cancelled") {
        set(result, { status: "cancelled", pipelineId: "" }, true);
        ws.close();
        set(wsStatus, "disconnected");
        if ($$props.onComplete) {
          $$props.onComplete(get(result));
        }
      }
    };
    ws.onerror = () => {
      set(wsStatus, "disconnected");
    };
    ws.onclose = () => {
      set(wsStatus, "disconnected");
    };
    return () => {
      ws.close();
    };
  });
  function formatCost(cost) {
    return `$${cost.toFixed(4)}`;
  }
  next();
  var fragment = root5();
  var div = sibling(first_child(fragment));
  var div_1 = sibling(child(div));
  var div_2 = sibling(child(div_1), 3);
  var node = sibling(child(div_2));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_17();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_34();
          next(2);
          append($$anchor3, fragment_3);
        };
        if_block(node_1, ($$render) => {
          if (get(wsStatus) === "connected")
            $$render(consequent_1);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(wsStatus) === "connecting")
        $$render(consequent);
      else
        $$render(alternate, false);
    });
  }
  var span = sibling(node, 2);
  var text2 = child(span);
  reset(span);
  next();
  reset(div_2);
  next();
  reset(div_1);
  var div_3 = sibling(div_1, 2);
  var node_2 = sibling(child(div_3));
  each(node_2, 17, () => get(stages), index, ($$anchor2, stage, index2) => {
    next();
    var fragment_4 = root_43();
    var node_3 = sibling(first_child(fragment_4));
    {
      let $0 = user_derived(() => get(expandedStages).has(get(stage).id));
      StageStatus_default(node_3, {
        get stage() {
          return get(stage);
        },
        index: index2,
        get expanded() {
          return get($0);
        },
        onToggle: () => toggleStage(get(stage).id)
      });
    }
    next();
    append($$anchor2, fragment_4);
  }, ($$anchor2) => {
    next();
    var fragment_5 = root_54();
    next(2);
    append($$anchor2, fragment_5);
  });
  next();
  reset(div_3);
  var node_4 = sibling(div_3, 2);
  {
    var consequent_6 = ($$anchor2) => {
      var fragment_6 = root_63();
      var div_4 = sibling(first_child(fragment_6));
      var node_5 = sibling(child(div_4));
      {
        var consequent_3 = ($$anchor3) => {
          var fragment_7 = root_72();
          var div_5 = sibling(first_child(fragment_7));
          var node_6 = sibling(child(div_5), 3);
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_8 = root_8();
              var div_6 = sibling(first_child(fragment_8));
              var div_7 = sibling(child(div_6));
              var text_1 = child(div_7);
              reset(div_7);
              var div_8 = sibling(div_7, 2);
              var text_2 = child(div_8);
              reset(div_8);
              var div_9 = sibling(div_8, 2);
              var text_3 = child(div_9);
              reset(div_9);
              var div_10 = sibling(div_9, 2);
              var text_4 = child(div_10);
              reset(div_10);
              next();
              reset(div_6);
              next();
              template_effect(($0, $1) => {
                set_text(text_1, `Duration: ${$0 ?? ""}s`);
                set_text(text_2, `Cost: $${$1 ?? ""}`);
                set_text(text_3, `Stages run: ${get(result).summary.stagesRun ?? ""}`);
                set_text(text_4, `Stages skipped: ${get(result).summary.stagesSkipped ?? ""}`);
              }, [
                () => (get(result).summary.totalDuration / 1000).toFixed(1),
                () => get(result).summary.totalCost.toFixed(4)
              ]);
              append($$anchor4, fragment_8);
            };
            if_block(node_6, ($$render) => {
              if (get(result).summary)
                $$render(consequent_2);
            });
          }
          next();
          reset(div_5);
          next();
          append($$anchor3, fragment_7);
        };
        var alternate_2 = ($$anchor3) => {
          var fragment_9 = comment();
          var node_7 = first_child(fragment_9);
          {
            var consequent_4 = ($$anchor4) => {
              var fragment_10 = root_102();
              next(2);
              append($$anchor4, fragment_10);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment_11 = root_11();
              var div_11 = sibling(first_child(fragment_11));
              var node_8 = sibling(child(div_11), 3);
              {
                var consequent_5 = ($$anchor5) => {
                  var fragment_12 = root_123();
                  var div_12 = sibling(first_child(fragment_12));
                  var text_5 = child(div_12, true);
                  reset(div_12);
                  next();
                  template_effect(() => set_text(text_5, get(result).error));
                  append($$anchor5, fragment_12);
                };
                if_block(node_8, ($$render) => {
                  if (get(result).error)
                    $$render(consequent_5);
                });
              }
              next();
              reset(div_11);
              next();
              append($$anchor4, fragment_11);
            };
            if_block(node_7, ($$render) => {
              if (get(result).status === "cancelled")
                $$render(consequent_4);
              else
                $$render(alternate_1, false);
            }, true);
          }
          append($$anchor3, fragment_9);
        };
        if_block(node_5, ($$render) => {
          if (get(result).status === "success" || get(result).status === "completed")
            $$render(consequent_3);
          else
            $$render(alternate_2, false);
        });
      }
      next();
      reset(div_4);
      next();
      append($$anchor2, fragment_6);
    };
    if_block(node_4, ($$render) => {
      if (get(result))
        $$render(consequent_6);
    });
  }
  next();
  reset(div);
  template_effect(($0) => set_text(text2, `
        Cost: ${$0 ?? ""}
      `), [() => formatCost(get(totalCost))]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExecutionProgress_default = ExecutionProgress;

// web/components/execution/ExecutionResult.svelte
var root_23 = from_html(`
      <div class="mt-4 pt-4 border-t border-slate-100">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Duration</div>
            <div class="font-medium text-slate-800"> </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Total Cost</div>
            <div class="font-medium text-slate-800"> </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Stages Run</div>
            <div class="font-medium text-slate-800"> </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Skipped</div>
            <div class="font-medium text-slate-800"> </div>
          </div>
        </div>
      </div>
    `, 1);
var root_19 = from_html(`
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-slate-700">Output</h2>
      <div class="flex gap-2">
        <button class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          Copy
        </button>
        <button class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"> </button>
      </div>
    </div>

    <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <pre> </pre>
    </div>

    <!>
  </div>
`, 1);
var root6 = from_html(`

<!>`, 1);
function ExecutionResult($$anchor, $$props) {
  push($$props, true);
  let showFullOutput = state(false);
  function formatOutput(output) {
    if (!output)
      return "";
    if (typeof output === "object") {
      return JSON.stringify(output, null, 2);
    }
    if (typeof output === "string") {
      try {
        const parsed = JSON.parse(output);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return output;
      }
    }
    return String(output);
  }
  function copyToClipboard() {
    if ($$props.result.output) {
      navigator.clipboard.writeText(formatOutput($$props.result.output));
    }
  }
  next();
  var fragment = root6();
  var node = sibling(first_child(fragment));
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_1 = root_19();
      var div = sibling(first_child(fragment_1));
      var div_1 = sibling(child(div));
      var div_2 = sibling(child(div_1), 3);
      var button = sibling(child(div_2));
      button.__click = copyToClipboard;
      var button_1 = sibling(button, 2);
      button_1.__click = () => set(showFullOutput, !get(showFullOutput));
      var text2 = child(button_1);
      reset(button_1);
      next();
      reset(div_2);
      next();
      reset(div_1);
      var div_3 = sibling(div_1, 2);
      var pre = sibling(child(div_3));
      var text_1 = child(pre, true);
      reset(pre);
      next();
      reset(div_3);
      var node_1 = sibling(div_3, 2);
      {
        var consequent = ($$anchor3) => {
          var fragment_2 = root_23();
          var div_4 = sibling(first_child(fragment_2));
          var div_5 = sibling(child(div_4));
          var div_6 = sibling(child(div_5));
          var div_7 = sibling(child(div_6), 3);
          var text_2 = child(div_7);
          reset(div_7);
          next();
          reset(div_6);
          var div_8 = sibling(div_6, 2);
          var div_9 = sibling(child(div_8), 3);
          var text_3 = child(div_9);
          reset(div_9);
          next();
          reset(div_8);
          var div_10 = sibling(div_8, 2);
          var div_11 = sibling(child(div_10), 3);
          var text_4 = child(div_11);
          reset(div_11);
          next();
          reset(div_10);
          var div_12 = sibling(div_10, 2);
          var div_13 = sibling(child(div_12), 3);
          var text_5 = child(div_13);
          reset(div_13);
          next();
          reset(div_12);
          next();
          reset(div_5);
          next();
          reset(div_4);
          next();
          template_effect(($0, $1) => {
            set_text(text_2, `
              ${$0 ?? ""}s
            `);
            set_text(text_3, `
              $${$1 ?? ""}
            `);
            set_text(text_4, `
              ${$$props.result.summary.stagesRun ?? ""}
            `);
            set_text(text_5, `
              ${$$props.result.summary.stagesSkipped ?? ""}
            `);
          }, [
            () => ($$props.result.summary.totalDuration / 1000).toFixed(2),
            () => $$props.result.summary.totalCost.toFixed(4)
          ]);
          append($$anchor3, fragment_2);
        };
        if_block(node_1, ($$render) => {
          if ($$props.result.summary)
            $$render(consequent);
        });
      }
      next();
      reset(div);
      next();
      template_effect(($0) => {
        set_text(text2, `
          ${get(showFullOutput) ? "Collapse" : "Expand"}
        `);
        set_class(pre, 1, `p-4 text-sm text-slate-700 whitespace-pre-wrap overflow-x-auto ${get(showFullOutput) ? "" : "max-h-64 overflow-y-auto"}`);
        set_text(text_1, $0);
      }, [() => formatOutput($$props.result.output)]);
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if ($$props.result.output)
        $$render(consequent_1);
    });
  }
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExecutionResult_default = ExecutionResult;
delegate(["click"]);

// web/components/execution/ExecutionHistory.svelte
var root_35 = from_svg(`
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                `, 1);
var root_55 = from_svg(`
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                `, 1);
var root_64 = from_svg(`
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                `, 1);
var root_24 = from_html(`
        <button class="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="font-medium text-slate-800 text-sm truncate"> </div>
              <div class="text-xs text-slate-500 truncate mt-0.5"> </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span>
                <!> </span>
              <span class="text-xs text-slate-400"> </span>
            </div>
          </div>
        </button>
      `, 1);
var root_110 = from_html(`
  <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
    <h3 class="text-sm font-medium text-slate-500 mb-3">Recent Executions</h3>
    <div class="space-y-2">
      <!>
    </div>
  </div>
`, 1);
var root7 = from_html(`

<!>`, 1);
function ExecutionHistory($$anchor, $$props) {
  push($$props, true);
  let history = state(proxy([]));
  user_effect(() => {
    try {
      const stored = localStorage.getItem("executionHistory");
      if (stored) {
        set(history, JSON.parse(stored), true);
      }
    } catch {
      set(history, [], true);
    }
  });
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now2 = new Date;
    const diff = now2.getTime() - date.getTime();
    if (diff < 60000)
      return "Just now";
    if (diff < 3600000)
      return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
      return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }
  const statusIcons = { completed: "", failed: "", cancelled: "" };
  const statusColors = {
    completed: "text-green-600 bg-green-50",
    failed: "text-red-600 bg-red-50",
    cancelled: "text-yellow-600 bg-yellow-50"
  };
  next();
  var fragment = root7();
  var node = sibling(first_child(fragment));
  {
    var consequent_2 = ($$anchor2) => {
      var fragment_1 = root_110();
      var div = sibling(first_child(fragment_1));
      var div_1 = sibling(child(div), 3);
      var node_1 = sibling(child(div_1));
      each(node_1, 17, () => get(history), index, ($$anchor3, entry) => {
        next();
        var fragment_2 = root_24();
        var button = sibling(first_child(fragment_2));
        button.__click = () => $$props.onSelect?.(get(entry).executionId);
        var div_2 = sibling(child(button));
        var div_3 = sibling(child(div_2));
        var div_4 = sibling(child(div_3));
        var text2 = child(div_4);
        reset(div_4);
        var div_5 = sibling(div_4, 2);
        var text_1 = child(div_5);
        reset(div_5);
        next();
        reset(div_3);
        var div_6 = sibling(div_3, 2);
        var span = sibling(child(div_6));
        var node_2 = sibling(child(span));
        {
          var consequent = ($$anchor4) => {
            var fragment_3 = root_35();
            next(2);
            append($$anchor4, fragment_3);
          };
          var alternate_1 = ($$anchor4) => {
            var fragment_4 = comment();
            var node_3 = first_child(fragment_4);
            {
              var consequent_1 = ($$anchor5) => {
                var fragment_5 = root_55();
                next(2);
                append($$anchor5, fragment_5);
              };
              var alternate = ($$anchor5) => {
                var fragment_6 = root_64();
                next(2);
                append($$anchor5, fragment_6);
              };
              if_block(node_3, ($$render) => {
                if (get(entry).status === "failed")
                  $$render(consequent_1);
                else
                  $$render(alternate, false);
              }, true);
            }
            append($$anchor4, fragment_4);
          };
          if_block(node_2, ($$render) => {
            if (get(entry).status === "completed")
              $$render(consequent);
            else
              $$render(alternate_1, false);
          });
        }
        var text_2 = sibling(node_2);
        reset(span);
        var span_1 = sibling(span, 2);
        var text_3 = child(span_1);
        reset(span_1);
        next();
        reset(div_6);
        next();
        reset(div_2);
        next();
        reset(button);
        next();
        template_effect(($0) => {
          set_text(text2, `
                ${get(entry).pipelineName ?? ""}
              `);
          set_text(text_1, `
                ${get(entry).inputPreview ?? ""}
              `);
          set_class(span, 1, `text-xs px-2 py-0.5 rounded-full ${statusColors[get(entry).status] ?? ""}`);
          set_text(text_2, `
                ${get(entry).status ?? ""}
              `);
          set_text(text_3, `
                ${$0 ?? ""}
              `);
        }, [() => formatTime(get(entry).timestamp)]);
        append($$anchor3, fragment_2);
      });
      next();
      reset(div_1);
      next();
      reset(div);
      next();
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (get(history).length > 0)
        $$render(consequent_2);
    });
  }
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExecutionHistory_default = ExecutionHistory;
delegate(["click"]);

// web/components/execution/ExecutionForm.svelte
var root_111 = from_html(`
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <div class="flex items-center justify-center py-8">
      <div class="text-slate-500">Checking configuration...</div>
    </div>
  </div>
`, 1);
var root_36 = from_html(`
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h3 class="font-semibold text-amber-800 mb-2">No Execution Method Available</h3>
      <p class="text-amber-700 text-sm mb-3">
        To run pipelines, you need either an Anthropic API key or a CLI tool installed.
      </p>
      <div class="text-sm text-amber-700 space-y-2">
        <p><strong>Option 1:</strong> Set ANTHROPIC_API_KEY environment variable</p>
        <p><strong>Option 2:</strong> Install Claude Code: <code class="bg-amber-100 px-1.5 py-0.5 rounded">npm install -g @anthropic-ai/claude-code</code></p>
      </div>
    </div>
  </div>
`, 1);
var root_56 = from_html(`
              <span class="ml-1 text-xs opacity-75">(ready)</span>
            `, 1);
var root_73 = from_html(`
                <option> </option>
              `, 1);
var root_82 = from_html(`
                <option> </option>
              `, 1);
var root_92 = from_html(`
                <option> </option>
              `, 1);
var root_65 = from_html(`
          <div class="flex gap-2 ml-4">
            <span class="text-sm text-slate-500">Tool:</span>
            <select class="text-sm border border-slate-300 rounded-lg px-2 py-1 bg-white disabled:opacity-50">
              <!>
              <!>
              <!>
            </select>
          </div>
        `, 1);
var root_124 = from_html(`
            <button class="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors cursor-pointer"> </button>
          `, 1);
var root_142 = from_html(`
            <button class="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
              New Run
            </button>
          `, 1);
var root_152 = from_svg(`
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            `, 1);
var root_172 = from_html(`
      <div class="bg-red-50 text-red-600 p-4 rounded-lg mt-4 border border-red-200">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="font-medium">Error</div>
            <div class="text-sm mt-1"> </div>
            <button class="mt-2 text-sm text-red-700 hover:text-red-800 underline cursor-pointer">
              Retry
            </button>
          </div>
        </div>
      </div>
    `, 1);
var root_18 = from_html(`
    <!>
  `, 1);
var root_44 = from_html(`
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <h2 class="font-semibold text-slate-700 mb-4 flex items-center gap-2">
      <span class="text-xl">&#9654;</span> Run Pipeline
    </h2>

    <!-- Execution Mode Selector -->
    <div class="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-sm font-medium text-slate-600">Execution Mode:</span>
        <div class="flex gap-2">
          <button>
            API
            <!>
          </button>
          <button>
            CLI Tool
          </button>
        </div>

        <!>
      </div>
      <p class="text-xs text-slate-500 mt-2">
        <!>
      </p>
    </div>

    <div class="mb-4">
      <label for="prompt-input" class="block text-sm font-medium text-slate-600 mb-2">
        Enter your prompt to optimize
      </label>
      <textarea id="prompt-input" placeholder="Type your prompt here..." class="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"></textarea>
      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-500"> </span>
          <span class="text-xs text-slate-400">Ctrl+Enter to run</span>
        </div>
        <div class="flex gap-2">
          <!>
          <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2">
            <!>
          </button>
        </div>
      </div>
    </div>

    <!>
  </div>

  <!>
`, 1);
var root_192 = from_html(`
  <!>
`, 1);
var root_20 = from_html(`
  <div class="mt-6">
    <!>
  </div>
`, 1);
var root8 = from_html(`

<!>

<!>

<!>`, 1);
function ExecutionForm($$anchor, $$props) {
  push($$props, true);
  let input = state("");
  let status = state("idle");
  let executionId = state(null);
  let error = state(null);
  let result = state(null);
  let configStatus = state("checking");
  let config = state(null);
  let executionMode = state("api");
  let selectedCliTool = state("claude");
  let cancelRequested = state(false);
  user_effect(() => {
    fetch("/api/config/status").then((r) => r.json()).then((data) => {
      set(config, data, true);
      set(configStatus, "loaded");
      if (data.hasApiKey) {
        set(executionMode, "api");
      } else {
        set(executionMode, "cli");
        if (data.cliTools.claude.available) {
          set(selectedCliTool, "claude");
        } else if (data.cliTools.opencode.available) {
          set(selectedCliTool, "opencode");
        } else if (data.cliTools.aider.available) {
          set(selectedCliTool, "aider");
        }
      }
    }).catch(() => {
      set(configStatus, "loaded");
      set(config, {
        hasApiKey: false,
        cliTools: {
          claude: { available: false },
          opencode: { available: false },
          aider: { available: false }
        }
      }, true);
    });
  });
  let canExecute = user_derived(() => () => {
    if (!get(config))
      return false;
    if (get(executionMode) === "api")
      return get(config).hasApiKey;
    return get(config).cliTools[get(selectedCliTool)]?.available ?? false;
  });
  user_effect(() => {
    function handleKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (get(status) !== "running" && get(input).trim() && get(canExecute)()) {
          e.preventDefault();
          runPipeline();
        }
      }
      if (e.key === "Escape" && get(status) === "running") {
        e.preventDefault();
        cancelExecution();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });
  async function runPipeline() {
    if (!get(input).trim() || !get(canExecute)())
      return;
    set(status, "running");
    set(error, null);
    set(result, null);
    set(cancelRequested, false);
    try {
      const body = {
        input: get(input).trim(),
        executionMode: get(executionMode)
      };
      if (get(executionMode) === "cli") {
        body.cliTool = get(selectedCliTool);
      }
      const response = await fetch(`/api/pipelines/${$$props.pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const data2 = await response.json();
        throw new Error(data2.error || "Failed to start execution");
      }
      const data = await response.json();
      set(executionId, data.executionId, true);
    } catch (e) {
      set(status, "failed");
      set(error, e instanceof Error ? e.message : "Unknown error", true);
    }
  }
  async function cancelExecution() {
    if (!get(executionId) || get(cancelRequested))
      return;
    if (get(status) === "running") {
      set(cancelRequested, true);
      try {
        await fetch(`/api/executions/${get(executionId)}/cancel`, { method: "POST" });
      } catch {}
    }
  }
  function handleComplete(execResult) {
    set(result, execResult, true);
    set(status, execResult.status === "success" || execResult.status === "completed" ? "completed" : "failed", true);
    saveToHistory({
      executionId: get(executionId),
      pipelineId: $$props.pipelineId,
      pipelineName: $$props.pipelineName || $$props.pipelineId,
      timestamp: new Date().toISOString(),
      status: execResult.status === "success" || execResult.status === "completed" ? "completed" : execResult.status === "cancelled" ? "cancelled" : "failed",
      inputPreview: get(input).trim().substring(0, 100)
    });
  }
  function saveToHistory(entry) {
    try {
      const history = JSON.parse(localStorage.getItem("executionHistory") || "[]");
      history.unshift(entry);
      localStorage.setItem("executionHistory", JSON.stringify(history.slice(0, 3)));
    } catch {}
  }
  function reset2() {
    set(status, "idle");
    set(executionId, null);
    set(result, null);
    set(error, null);
    set(cancelRequested, false);
  }
  next();
  var fragment = root8();
  var node = sibling(first_child(fragment));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_111();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate_4 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_36();
          next(2);
          append($$anchor3, fragment_3);
        };
        var alternate_3 = ($$anchor3) => {
          var fragment_4 = root_44();
          var div = sibling(first_child(fragment_4));
          var node_2 = sibling(child(div), 3);
          var div_1 = sibling(node_2, 2);
          var div_2 = sibling(child(div_1));
          var div_3 = sibling(child(div_2), 3);
          var button = sibling(child(div_3));
          button.__click = () => set(executionMode, "api");
          var node_3 = sibling(child(button));
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_5 = root_56();
              next(2);
              append($$anchor4, fragment_5);
            };
            if_block(node_3, ($$render) => {
              if (get(config)?.hasApiKey)
                $$render(consequent_2);
            });
          }
          next();
          reset(button);
          var button_1 = sibling(button, 2);
          button_1.__click = () => set(executionMode, "cli");
          next();
          reset(div_3);
          var node_4 = sibling(div_3, 2);
          {
            var consequent_6 = ($$anchor4) => {
              var fragment_6 = root_65();
              var div_4 = sibling(first_child(fragment_6));
              var select = sibling(child(div_4), 3);
              var node_5 = sibling(child(select));
              {
                var consequent_3 = ($$anchor5) => {
                  var fragment_7 = root_73();
                  var option = sibling(first_child(fragment_7));
                  var text2 = child(option);
                  reset(option);
                  option.value = option.__value = "claude";
                  next();
                  template_effect(() => set_text(text2, `Claude Code ${get(config).cliTools.claude.version ? `(${get(config).cliTools.claude.version})` : ""}`));
                  append($$anchor5, fragment_7);
                };
                if_block(node_5, ($$render) => {
                  if (get(config)?.cliTools.claude.available)
                    $$render(consequent_3);
                });
              }
              var node_6 = sibling(node_5, 2);
              {
                var consequent_4 = ($$anchor5) => {
                  var fragment_8 = root_82();
                  var option_1 = sibling(first_child(fragment_8));
                  var text_1 = child(option_1);
                  reset(option_1);
                  option_1.value = option_1.__value = "opencode";
                  next();
                  template_effect(() => set_text(text_1, `OpenCode ${get(config).cliTools.opencode.version ? `(${get(config).cliTools.opencode.version})` : ""}`));
                  append($$anchor5, fragment_8);
                };
                if_block(node_6, ($$render) => {
                  if (get(config)?.cliTools.opencode.available)
                    $$render(consequent_4);
                });
              }
              var node_7 = sibling(node_6, 2);
              {
                var consequent_5 = ($$anchor5) => {
                  var fragment_9 = root_92();
                  var option_2 = sibling(first_child(fragment_9));
                  var text_2 = child(option_2);
                  reset(option_2);
                  option_2.value = option_2.__value = "aider";
                  next();
                  template_effect(() => set_text(text_2, `Aider ${get(config).cliTools.aider.version ? `(${get(config).cliTools.aider.version})` : ""}`));
                  append($$anchor5, fragment_9);
                };
                if_block(node_7, ($$render) => {
                  if (get(config)?.cliTools.aider.available)
                    $$render(consequent_5);
                });
              }
              next();
              reset(select);
              next();
              reset(div_4);
              next();
              template_effect(() => select.disabled = get(status) === "running");
              bind_select_value(select, () => get(selectedCliTool), ($$value) => set(selectedCliTool, $$value));
              append($$anchor4, fragment_6);
            };
            if_block(node_4, ($$render) => {
              if (get(executionMode) === "cli")
                $$render(consequent_6);
            });
          }
          next();
          reset(div_2);
          var p = sibling(div_2, 2);
          var node_8 = sibling(child(p));
          {
            var consequent_7 = ($$anchor4) => {
              var text_3 = text(`
          Uses your Anthropic API key to call Claude directly.
        `);
              append($$anchor4, text_3);
            };
            var alternate = ($$anchor4) => {
              var text_4 = text();
              template_effect(() => set_text(text_4, `
          Uses ${get(selectedCliTool) === "claude" ? "Claude Code" : get(selectedCliTool) === "opencode" ? "OpenCode" : "Aider"} CLI for execution. No API key required.
        `));
              append($$anchor4, text_4);
            };
            if_block(node_8, ($$render) => {
              if (get(executionMode) === "api")
                $$render(consequent_7);
              else
                $$render(alternate, false);
            });
          }
          next();
          reset(p);
          next();
          reset(div_1);
          var div_5 = sibling(div_1, 2);
          var textarea = sibling(child(div_5), 3);
          remove_textarea_child(textarea);
          var div_6 = sibling(textarea, 2);
          var div_7 = sibling(child(div_6));
          var span = sibling(child(div_7));
          var text_5 = child(span);
          reset(span);
          next(3);
          reset(div_7);
          var div_8 = sibling(div_7, 2);
          var node_9 = sibling(child(div_8));
          {
            var consequent_8 = ($$anchor4) => {
              var fragment_11 = root_124();
              var button_2 = sibling(first_child(fragment_11));
              button_2.__click = cancelExecution;
              var text_6 = child(button_2);
              reset(button_2);
              next();
              template_effect(() => {
                button_2.disabled = get(cancelRequested);
                set_text(text_6, `
              ${get(cancelRequested) ? "Cancelling..." : "Cancel"}
            `);
              });
              append($$anchor4, fragment_11);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment_12 = comment();
              var node_10 = first_child(fragment_12);
              {
                var consequent_9 = ($$anchor5) => {
                  var fragment_13 = root_142();
                  var button_3 = sibling(first_child(fragment_13));
                  button_3.__click = reset2;
                  next();
                  append($$anchor5, fragment_13);
                };
                if_block(node_10, ($$render) => {
                  if (get(status) === "completed" || get(status) === "failed")
                    $$render(consequent_9);
                }, true);
              }
              append($$anchor4, fragment_12);
            };
            if_block(node_9, ($$render) => {
              if (get(status) === "running")
                $$render(consequent_8);
              else
                $$render(alternate_1, false);
            });
          }
          var button_4 = sibling(node_9, 2);
          button_4.__click = runPipeline;
          var node_11 = sibling(child(button_4));
          {
            var consequent_10 = ($$anchor4) => {
              var fragment_14 = root_152();
              next(2);
              append($$anchor4, fragment_14);
            };
            var alternate_2 = ($$anchor4) => {
              var text_7 = text(`
              Run Pipeline ▶
            `);
              append($$anchor4, text_7);
            };
            if_block(node_11, ($$render) => {
              if (get(status) === "running")
                $$render(consequent_10);
              else
                $$render(alternate_2, false);
            });
          }
          next();
          reset(button_4);
          next();
          reset(div_8);
          next();
          reset(div_6);
          next();
          reset(div_5);
          var node_12 = sibling(div_5, 2);
          {
            var consequent_11 = ($$anchor4) => {
              var fragment_15 = root_172();
              var div_9 = sibling(first_child(fragment_15));
              var div_10 = sibling(child(div_9));
              var div_11 = sibling(child(div_10), 3);
              var div_12 = sibling(child(div_11), 3);
              var text_8 = child(div_12, true);
              reset(div_12);
              var button_5 = sibling(div_12, 2);
              button_5.__click = runPipeline;
              next();
              reset(div_11);
              next();
              reset(div_10);
              next();
              reset(div_9);
              next();
              template_effect(() => set_text(text_8, get(error)));
              append($$anchor4, fragment_15);
            };
            if_block(node_12, ($$render) => {
              if (get(error))
                $$render(consequent_11);
            });
          }
          next();
          reset(div);
          var node_13 = sibling(div, 2);
          {
            var consequent_12 = ($$anchor4) => {
              var fragment_16 = root_18();
              var node_14 = sibling(first_child(fragment_16));
              ExecutionHistory_default(node_14, {});
              next();
              append($$anchor4, fragment_16);
            };
            if_block(node_13, ($$render) => {
              if (get(status) === "idle")
                $$render(consequent_12);
            });
          }
          next();
          template_effect(($0) => {
            button.disabled = !get(config)?.hasApiKey || get(status) === "running";
            set_class(button, 1, `px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${get(executionMode) === "api" ? "bg-blue-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"} disabled:opacity-50 disabled:cursor-not-allowed`);
            button_1.disabled = !get(config)?.cliTools.claude.available && !get(config)?.cliTools.opencode.available && !get(config)?.cliTools.aider.available || get(status) === "running";
            set_class(button_1, 1, `px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${get(executionMode) === "cli" ? "bg-blue-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"} disabled:opacity-50 disabled:cursor-not-allowed`);
            textarea.disabled = get(status) === "running";
            set_text(text_5, `${get(input).length ?? ""} characters`);
            button_4.disabled = $0;
          }, [
            () => get(status) === "running" || !get(input).trim() || !get(canExecute)()
          ]);
          bind_value(textarea, () => get(input), ($$value) => set(input, $$value));
          append($$anchor3, fragment_4);
        };
        if_block(node_1, ($$render) => {
          if (!get(canExecute)())
            $$render(consequent_1);
          else
            $$render(alternate_3, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(configStatus) === "checking")
        $$render(consequent);
      else
        $$render(alternate_4, false);
    });
  }
  var node_15 = sibling(node, 2);
  {
    var consequent_13 = ($$anchor2) => {
      var fragment_17 = root_192();
      var node_16 = sibling(first_child(fragment_17));
      ExecutionProgress_default(node_16, {
        get executionId() {
          return get(executionId);
        },
        get stageCount() {
          return $$props.stageCount;
        },
        onComplete: handleComplete
      });
      next();
      append($$anchor2, fragment_17);
    };
    if_block(node_15, ($$render) => {
      if (get(executionId))
        $$render(consequent_13);
    });
  }
  var node_17 = sibling(node_15, 2);
  {
    var consequent_14 = ($$anchor2) => {
      var fragment_18 = root_20();
      var div_13 = sibling(first_child(fragment_18));
      var node_18 = sibling(child(div_13));
      ExecutionResult_default(node_18, {
        get result() {
          return get(result);
        }
      });
      next();
      reset(div_13);
      next();
      append($$anchor2, fragment_18);
    };
    if_block(node_17, ($$render) => {
      if (get(result))
        $$render(consequent_14);
    });
  }
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExecutionForm_default = ExecutionForm;
delegate(["click"]);

// web/components/pipelines/PipelineDetail.svelte
var root_112 = from_html(`
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading pipeline...</div>
    </div>
  `, 1);
var root_37 = from_html(`
    <div class="bg-red-50 text-red-600 p-4 rounded-lg"> </div>
  `, 1);
var root_66 = from_html(`
        <p class="text-slate-600 mt-4"> </p>
      `, 1);
var root_74 = from_html(`
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Caching</span>
        `, 1);
var root_83 = from_html(`
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Early Exit</span>
        `, 1);
var root_93 = from_html(`
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"> </span>
        `, 1);
var root_125 = from_html(`
                <div class="mt-2 text-xs text-red-600 truncate pl-12"> </div>
              `, 1);
var root_113 = from_html(`
            <button class="w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <!-- Status Icon -->
                <div>
                  <span class="text-sm"> </span>
                </div>

                <!-- Execution Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span> </span>
                    <span class="text-xs text-slate-500"> </span>
                  </div>
                  <p class="text-sm text-slate-600 truncate mt-1"> </p>
                </div>

                <!-- Stats -->
                <div class="flex items-center gap-4 shrink-0 text-xs text-slate-500">
                  <div class="text-right">
                    <div class="font-medium text-slate-700"> </div>
                    <div>duration</div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-slate-700"> </div>
                    <div>cost</div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-slate-700"> </div>
                    <div>stages</div>
                  </div>
                </div>

                <!-- Arrow -->
                <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>

              <!>
            </button>
          `, 1);
var root_103 = from_html(`
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 class="font-semibold text-slate-700">Recent Executions</h2>
          <button class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            View all →
          </button>
        </div>
        <div class="divide-y divide-slate-100">
          <!>
        </div>
      </div>
    `, 1);
var root_143 = from_html(`
            <div class="absolute left-6 -top-4 w-0.5 h-4 bg-slate-300"></div>
          `, 1);
var root_153 = from_html(`
                <span class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Conditional</span>
              `, 1);
var root_173 = from_html(`
                  <p class="text-sm text-slate-600 mb-4"> </p>
                `, 1);
var root_202 = from_html(`
                              <span class="text-slate-400"> </span>
                            `, 1);
var root_21 = from_html(`
                              <span class="text-slate-400"> </span>
                            `, 1);
var root_193 = from_html(`
                        <div class="p-2 text-sm flex items-center gap-2">
                          <code class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs"> </code>
                          <span class="text-slate-400">←</span>
                          <span class="text-slate-600"> <!>
                            <!>
                          </span>
                        </div>
                      `, 1);
var root_182 = from_html(`
                  <div class="mb-4">
                    <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Variables</h4>
                    <div class="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                      <!>
                    </div>
                  </div>
                `, 1);
var root_232 = from_html(`<span class="text-green-500">*</span>`);
var root_222 = from_html(`
                        <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200"> <!>
                        </span>
                      `, 1);
var root_25 = from_html(`
                        <div class="mb-1">
                          <span class="font-medium text-amber-700">Skip if:</span>
                          <code class="ml-2 text-xs"> </code>
                          <span class="text-slate-500"> </span>
                        </div>
                      `, 1);
var root_26 = from_html(`
                        <div class="mb-1">
                          <span class="font-medium text-amber-700">Run if:</span>
                          <code class="ml-2 text-xs"> </code>
                          <span class="text-slate-500"> </span>
                        </div>
                      `, 1);
var root_27 = from_html(`
                        <div>
                          <span class="font-medium text-amber-700">Early exit:</span>
                          <code class="ml-2 text-xs"> </code>
                          <span class="text-slate-500"> </span>
                        </div>
                      `, 1);
var root_242 = from_html(`
                  <div>
                    <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Conditions</h4>
                    <div class="bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm">
                      <!>
                      <!>
                      <!>
                    </div>
                  </div>
                `, 1);
var root_162 = from_html(`
              <div class="border-t border-slate-200 p-4 bg-slate-50">
                <!>

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Model</h4>
                  <div class="bg-white rounded-lg p-3 border border-slate-200 text-sm">
                    <div class="grid grid-cols-2 gap-2">
                      <div><span class="text-slate-500">Provider:</span> </div>
                      <div><span class="text-slate-500">Model:</span> </div>
                      <div><span class="text-slate-500">Tier:</span> </div>
                      <div><span class="text-slate-500">Max Tokens:</span> </div>
                      <div><span class="text-slate-500">Temperature:</span> </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">System Prompt</h4>
                  <pre class="text-xs whitespace-pre-wrap"> </pre>
                </div>

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Template</h4>
                  <pre class="text-xs whitespace-pre-wrap max-h-64 overflow-y-auto"> </pre>
                </div>

                <!>

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Output Extraction</h4>
                  <div class="bg-white rounded-lg p-3 border border-slate-200 text-sm">
                    <div class="mb-2"><span class="text-slate-500">Format:</span> </div>
                    <div class="flex flex-wrap gap-1">
                      <!>
                    </div>
                  </div>
                </div>

                <!>
              </div>
            `, 1);
var root_28 = from_html(`
            <div class="absolute left-6 -bottom-4 w-0.5 h-4 bg-slate-300"></div>
          `, 1);
var root_133 = from_html(`
        <div class="relative">
          <!>

          <div>
            <button class="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-medium"></div>

              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-slate-800"> </span>
                  <span> </span>
                </div>
                <div class="text-sm text-slate-500 mt-1"> </div>
              </div>

              <!>

              <span class="text-slate-400 text-lg"> </span>
            </button>

            <!>
          </div>

          <!>
        </div>
      `, 1);
var root_57 = from_html(`
    <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800"> </h1>
          <p class="text-sm text-slate-500 mt-1"> </p>
        </div>
        <span class="text-3xl">\uD83D\uDD27</span>
      </div>
      <!>

      <div class="mt-4 flex flex-wrap gap-2">
        <!>
        <!>
        <!>
      </div>
    </div>

    <!>

    <!-- Recent Executions -->
    <!>

    <div class="space-y-4">
      <h2 class="font-semibold text-slate-700 mb-4">Pipeline Stages</h2>

      <!>
    </div>
  `, 1);
var root9 = from_html(`

<div>
  <button class="text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1 cursor-pointer">
    ← Back to Pipelines
  </button>

  <!>
</div>`, 1);
function PipelineDetail($$anchor, $$props) {
  push($$props, true);
  let pipeline = state(null);
  let loading = state(true);
  let error = state(null);
  let expandedStage = state(null);
  let recentExecutions = state(proxy([]));
  user_effect(() => {
    set(loading, true);
    fetch(`/api/pipelines/${$$props.id}`).then((r) => {
      if (!r.ok)
        throw new Error("Pipeline not found");
      return r.json();
    }).then((data) => {
      set(pipeline, data, true);
      set(loading, false);
    }).catch((e) => {
      set(error, e.message, true);
      set(loading, false);
    });
  });
  user_effect(() => {
    fetch("/api/executions/history?pageSize=10").then((r) => r.json()).then((data) => {
      set(recentExecutions, (data.executions || []).filter((exec) => exec.pipelineId === $$props.id).slice(0, 5), true);
    }).catch(() => {
      set(recentExecutions, [], true);
    });
  });
  function formatDuration(ms) {
    if (ms < 1000)
      return `${ms}ms`;
    if (ms < 60000)
      return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms % 60000 / 1000);
    return `${minutes}m ${seconds}s`;
  }
  function formatCost(cost) {
    return `$${cost.toFixed(4)}`;
  }
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now2 = new Date;
    const diffMs = now2.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
      return "just now";
    if (diffMins < 60)
      return `${diffMins}m ago`;
    if (diffHours < 24)
      return `${diffHours}h ago`;
    if (diffDays < 7)
      return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
  function getStatusColor(status) {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "cancelled":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  }
  function getStatusIcon(status) {
    switch (status) {
      case "completed":
        return "✓";
      case "failed":
        return "✕";
      case "cancelled":
        return "⏸";
      default:
        return "•";
    }
  }
  const stageTypeColors = {
    analyze: "bg-blue-100 text-blue-700 border-blue-300",
    structure: "bg-purple-100 text-purple-700 border-purple-300",
    enhance: "bg-green-100 text-green-700 border-green-300",
    validate: "bg-orange-100 text-orange-700 border-orange-300",
    iterate: "bg-yellow-100 text-yellow-700 border-yellow-300",
    test: "bg-cyan-100 text-cyan-700 border-cyan-300",
    custom: "bg-gray-100 text-gray-700 border-gray-300"
  };
  const stageTypeIcons = {
    analyze: "\uD83D\uDD0D",
    structure: "\uD83D\uDCD0",
    enhance: "✨",
    validate: "✅",
    iterate: "\uD83D\uDD04",
    test: "\uD83E\uDDEA",
    custom: "⚙️"
  };
  function toggleStage(stageId) {
    set(expandedStage, get(expandedStage) === stageId ? null : stageId, true);
  }
  function getModelShortName(modelId) {
    if (modelId.includes("haiku"))
      return "Haiku";
    if (modelId.includes("sonnet"))
      return "Sonnet";
    if (modelId.includes("opus"))
      return "Opus";
    if (modelId.includes("gpt-4o-mini"))
      return "GPT-4o Mini";
    if (modelId.includes("gpt-4o"))
      return "GPT-4o";
    if (modelId.includes("gemini"))
      return "Gemini";
    return modelId;
  }
  next();
  var fragment = root9();
  var div = sibling(first_child(fragment));
  var button = sibling(child(div));
  button.__click = () => $$props.navigate("/pipelines");
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_112();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate_1 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_37();
          var div_1 = sibling(first_child(fragment_3));
          var text2 = child(div_1, true);
          reset(div_1);
          next();
          template_effect(() => set_text(text2, get(error)));
          append($$anchor3, fragment_3);
        };
        var alternate = ($$anchor3) => {
          var fragment_4 = comment();
          var node_2 = first_child(fragment_4);
          {
            var consequent_21 = ($$anchor4) => {
              var fragment_5 = root_57();
              var div_2 = sibling(first_child(fragment_5));
              var div_3 = sibling(child(div_2));
              var div_4 = sibling(child(div_3));
              var h1 = sibling(child(div_4));
              var text_1 = child(h1, true);
              reset(h1);
              var p = sibling(h1, 2);
              var text_2 = child(p);
              reset(p);
              next();
              reset(div_4);
              next(3);
              reset(div_3);
              var node_3 = sibling(div_3, 2);
              {
                var consequent_2 = ($$anchor5) => {
                  var fragment_6 = root_66();
                  var p_1 = sibling(first_child(fragment_6));
                  var text_3 = child(p_1, true);
                  reset(p_1);
                  next();
                  template_effect(() => set_text(text_3, get(pipeline).pipeline.description));
                  append($$anchor5, fragment_6);
                };
                if_block(node_3, ($$render) => {
                  if (get(pipeline).pipeline.description)
                    $$render(consequent_2);
                });
              }
              var div_5 = sibling(node_3, 2);
              var node_4 = sibling(child(div_5));
              {
                var consequent_3 = ($$anchor5) => {
                  var fragment_7 = root_74();
                  next(2);
                  append($$anchor5, fragment_7);
                };
                if_block(node_4, ($$render) => {
                  if (get(pipeline).pipeline.settings?.enableCaching)
                    $$render(consequent_3);
                });
              }
              var node_5 = sibling(node_4, 2);
              {
                var consequent_4 = ($$anchor5) => {
                  var fragment_8 = root_83();
                  next(2);
                  append($$anchor5, fragment_8);
                };
                if_block(node_5, ($$render) => {
                  if (get(pipeline).pipeline.settings?.enableEarlyExit)
                    $$render(consequent_4);
                });
              }
              var node_6 = sibling(node_5, 2);
              {
                var consequent_5 = ($$anchor5) => {
                  var fragment_9 = root_93();
                  var span = sibling(first_child(fragment_9));
                  var text_4 = child(span);
                  reset(span);
                  next();
                  template_effect(() => set_text(text_4, `
            ${get(pipeline).pipeline.settings.maxRetries ?? ""} retries
          `));
                  append($$anchor5, fragment_9);
                };
                if_block(node_6, ($$render) => {
                  if (get(pipeline).pipeline.settings?.maxRetries)
                    $$render(consequent_5);
                });
              }
              next();
              reset(div_5);
              next();
              reset(div_2);
              var node_7 = sibling(div_2, 2);
              ExecutionForm_default(node_7, {
                get pipelineId() {
                  return get(pipeline).pipeline.id;
                },
                get pipelineName() {
                  return get(pipeline).pipeline.name;
                },
                get stageCount() {
                  return get(pipeline).stages.length;
                }
              });
              var node_8 = sibling(node_7, 2);
              var node_9 = sibling(node_8, 2);
              {
                var consequent_7 = ($$anchor5) => {
                  var fragment_10 = root_103();
                  var div_6 = sibling(first_child(fragment_10));
                  var div_7 = sibling(child(div_6));
                  var button_1 = sibling(child(div_7), 3);
                  button_1.__click = () => $$props.navigate("/running");
                  next();
                  reset(div_7);
                  var div_8 = sibling(div_7, 2);
                  var node_10 = sibling(child(div_8));
                  each(node_10, 17, () => get(recentExecutions), index, ($$anchor6, execution) => {
                    next();
                    var fragment_11 = root_113();
                    var button_2 = sibling(first_child(fragment_11));
                    button_2.__click = () => $$props.navigate(`/executions/${get(execution).id}`);
                    var div_9 = sibling(child(button_2));
                    var node_11 = sibling(child(div_9));
                    var div_10 = sibling(node_11, 2);
                    var span_1 = sibling(child(div_10));
                    var text_5 = child(span_1, true);
                    reset(span_1);
                    next();
                    reset(div_10);
                    var node_12 = sibling(div_10, 2);
                    var div_11 = sibling(node_12, 2);
                    var div_12 = sibling(child(div_11));
                    var span_2 = sibling(child(div_12));
                    var text_6 = child(span_2);
                    reset(span_2);
                    var span_3 = sibling(span_2, 2);
                    var text_7 = child(span_3, true);
                    reset(span_3);
                    next();
                    reset(div_12);
                    var p_2 = sibling(div_12, 2);
                    var text_8 = child(p_2);
                    reset(p_2);
                    next();
                    reset(div_11);
                    var node_13 = sibling(div_11, 2);
                    var div_13 = sibling(node_13, 2);
                    var div_14 = sibling(child(div_13));
                    var div_15 = sibling(child(div_14));
                    var text_9 = child(div_15, true);
                    reset(div_15);
                    next(3);
                    reset(div_14);
                    var div_16 = sibling(div_14, 2);
                    var div_17 = sibling(child(div_16));
                    var text_10 = child(div_17, true);
                    reset(div_17);
                    next(3);
                    reset(div_16);
                    var div_18 = sibling(div_16, 2);
                    var div_19 = sibling(child(div_18));
                    var text_11 = child(div_19);
                    reset(div_19);
                    next(3);
                    reset(div_18);
                    next();
                    reset(div_13);
                    var node_14 = sibling(div_13, 2);
                    next(3);
                    reset(div_9);
                    var node_15 = sibling(div_9, 2);
                    {
                      var consequent_6 = ($$anchor7) => {
                        var fragment_12 = root_125();
                        var div_20 = sibling(first_child(fragment_12));
                        var text_12 = child(div_20);
                        reset(div_20);
                        next();
                        template_effect(() => set_text(text_12, `
                  Error: ${get(execution).error ?? ""}
                `));
                        append($$anchor7, fragment_12);
                      };
                      if_block(node_15, ($$render) => {
                        if (get(execution).error)
                          $$render(consequent_6);
                      });
                    }
                    next();
                    reset(button_2);
                    next();
                    template_effect(($0, $1, $2, $3, $4, $5) => {
                      set_class(div_10, 1, `w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${$0 ?? ""}`);
                      set_text(text_5, $1);
                      set_class(span_2, 1, `text-xs px-2 py-0.5 rounded-full font-medium ${$2 ?? ""}`);
                      set_text(text_6, `
                      ${get(execution).status ?? ""}
                    `);
                      set_text(text_7, $3);
                      set_text(text_8, `
                    "${get(execution).inputPreview ?? ""}"
                  `);
                      set_text(text_9, $4);
                      set_text(text_10, $5);
                      set_text(text_11, `${get(execution).stagesRun ?? ""}/${get(execution).totalStages ?? ""}`);
                    }, [
                      () => getStatusColor(get(execution).status),
                      () => getStatusIcon(get(execution).status),
                      () => getStatusColor(get(execution).status),
                      () => formatTime(get(execution).startTime),
                      () => formatDuration(get(execution).duration),
                      () => formatCost(get(execution).totalCost)
                    ]);
                    append($$anchor6, fragment_11);
                  });
                  next();
                  reset(div_8);
                  next();
                  reset(div_6);
                  next();
                  append($$anchor5, fragment_10);
                };
                if_block(node_9, ($$render) => {
                  if (get(recentExecutions).length > 0)
                    $$render(consequent_7);
                });
              }
              var div_21 = sibling(node_9, 2);
              var node_16 = sibling(child(div_21), 3);
              each(node_16, 17, () => get(pipeline).stages, index, ($$anchor5, stage, index2) => {
                next();
                var fragment_13 = root_133();
                var div_22 = sibling(first_child(fragment_13));
                var node_17 = sibling(child(div_22));
                {
                  var consequent_8 = ($$anchor6) => {
                    var fragment_14 = root_143();
                    next(2);
                    append($$anchor6, fragment_14);
                  };
                  if_block(node_17, ($$render) => {
                    if (index2 > 0)
                      $$render(consequent_8);
                  });
                }
                var div_23 = sibling(node_17, 2);
                var button_3 = sibling(child(div_23));
                button_3.__click = () => toggleStage(get(stage).id);
                var div_24 = sibling(child(button_3));
                div_24.textContent = `
                ${index2 + 1}
              `;
                var div_25 = sibling(div_24, 2);
                var div_26 = sibling(child(div_25));
                var span_4 = sibling(child(div_26));
                var text_13 = child(span_4, true);
                reset(span_4);
                var span_5 = sibling(span_4, 2);
                var text_14 = child(span_5);
                reset(span_5);
                next();
                reset(div_26);
                var div_27 = sibling(div_26, 2);
                var text_15 = child(div_27);
                reset(div_27);
                next();
                reset(div_25);
                var node_18 = sibling(div_25, 2);
                {
                  var consequent_9 = ($$anchor6) => {
                    var fragment_15 = root_153();
                    next(2);
                    append($$anchor6, fragment_15);
                  };
                  if_block(node_18, ($$render) => {
                    if (get(stage).conditions?.skipIf || get(stage).conditions?.runIf || get(stage).conditions?.earlyExit)
                      $$render(consequent_9);
                  });
                }
                var span_6 = sibling(node_18, 2);
                var text_16 = child(span_6, true);
                reset(span_6);
                next();
                reset(button_3);
                var node_19 = sibling(button_3, 2);
                {
                  var consequent_19 = ($$anchor6) => {
                    var fragment_16 = root_162();
                    var div_28 = sibling(first_child(fragment_16));
                    var node_20 = sibling(child(div_28));
                    {
                      var consequent_10 = ($$anchor7) => {
                        var fragment_17 = root_173();
                        var p_3 = sibling(first_child(fragment_17));
                        var text_17 = child(p_3, true);
                        reset(p_3);
                        next();
                        template_effect(() => set_text(text_17, get(stage).description));
                        append($$anchor7, fragment_17);
                      };
                      if_block(node_20, ($$render) => {
                        if (get(stage).description)
                          $$render(consequent_10);
                      });
                    }
                    var div_29 = sibling(node_20, 2);
                    var div_30 = sibling(child(div_29), 3);
                    var div_31 = sibling(child(div_30));
                    var div_32 = sibling(child(div_31));
                    var text_18 = sibling(child(div_32));
                    reset(div_32);
                    var div_33 = sibling(div_32, 2);
                    var text_19 = sibling(child(div_33));
                    reset(div_33);
                    var div_34 = sibling(div_33, 2);
                    var text_20 = sibling(child(div_34));
                    reset(div_34);
                    var div_35 = sibling(div_34, 2);
                    var text_21 = sibling(child(div_35));
                    reset(div_35);
                    var div_36 = sibling(div_35, 2);
                    var text_22 = sibling(child(div_36));
                    reset(div_36);
                    next();
                    reset(div_31);
                    next();
                    reset(div_30);
                    next();
                    reset(div_29);
                    var div_37 = sibling(div_29, 2);
                    var pre = sibling(child(div_37), 3);
                    var text_23 = child(pre, true);
                    reset(pre);
                    next();
                    reset(div_37);
                    var div_38 = sibling(div_37, 2);
                    var pre_1 = sibling(child(div_38), 3);
                    var text_24 = child(pre_1, true);
                    reset(pre_1);
                    next();
                    reset(div_38);
                    var node_21 = sibling(div_38, 2);
                    {
                      var consequent_13 = ($$anchor7) => {
                        var fragment_18 = root_182();
                        var div_39 = sibling(first_child(fragment_18));
                        var div_40 = sibling(child(div_39), 3);
                        var node_22 = sibling(child(div_40));
                        each(node_22, 17, () => get(stage).prompt.variables, index, ($$anchor8, variable) => {
                          next();
                          var fragment_19 = root_193();
                          var div_41 = sibling(first_child(fragment_19));
                          var code = sibling(child(div_41));
                          var text_25 = child(code, true);
                          reset(code);
                          var span_7 = sibling(code, 4);
                          var text_26 = child(span_7);
                          var node_23 = sibling(text_26);
                          {
                            var consequent_11 = ($$anchor9) => {
                              var fragment_20 = root_202();
                              var span_8 = sibling(first_child(fragment_20));
                              var text_27 = child(span_8);
                              reset(span_8);
                              next();
                              template_effect(() => set_text(text_27, `(${get(variable).stageId ?? ""})`));
                              append($$anchor9, fragment_20);
                            };
                            if_block(node_23, ($$render) => {
                              if (get(variable).stageId)
                                $$render(consequent_11);
                            });
                          }
                          var node_24 = sibling(node_23, 2);
                          {
                            var consequent_12 = ($$anchor9) => {
                              var fragment_21 = root_21();
                              var span_9 = sibling(first_child(fragment_21));
                              var text_28 = child(span_9);
                              reset(span_9);
                              next();
                              template_effect(() => set_text(text_28, `.${get(variable).path ?? ""}`));
                              append($$anchor9, fragment_21);
                            };
                            if_block(node_24, ($$render) => {
                              if (get(variable).path)
                                $$render(consequent_12);
                            });
                          }
                          next();
                          reset(span_7);
                          next();
                          reset(div_41);
                          next();
                          template_effect(() => {
                            set_text(text_25, `{{${get(variable).name}}}`);
                            set_text(text_26, `
                            ${get(variable).source ?? ""}
                            `);
                          });
                          append($$anchor8, fragment_19);
                        });
                        next();
                        reset(div_40);
                        next();
                        reset(div_39);
                        next();
                        append($$anchor7, fragment_18);
                      };
                      if_block(node_21, ($$render) => {
                        if (get(stage).prompt.variables?.length)
                          $$render(consequent_13);
                      });
                    }
                    var div_42 = sibling(node_21, 2);
                    var div_43 = sibling(child(div_42), 3);
                    var div_44 = sibling(child(div_43));
                    var text_29 = sibling(child(div_44));
                    reset(div_44);
                    var div_45 = sibling(div_44, 2);
                    var node_25 = sibling(child(div_45));
                    each(node_25, 17, () => get(stage).output.extract || [], index, ($$anchor7, field) => {
                      next();
                      var fragment_22 = root_222();
                      var span_10 = sibling(first_child(fragment_22));
                      var text_30 = child(span_10);
                      var node_26 = sibling(text_30);
                      {
                        var consequent_14 = ($$anchor8) => {
                          var span_11 = root_232();
                          append($$anchor8, span_11);
                        };
                        if_block(node_26, ($$render) => {
                          if (get(field).required)
                            $$render(consequent_14);
                        });
                      }
                      next();
                      reset(span_10);
                      next();
                      template_effect(() => set_text(text_30, `
                          ${get(field).name ?? ""}`));
                      append($$anchor7, fragment_22);
                    });
                    next();
                    reset(div_45);
                    next();
                    reset(div_43);
                    next();
                    reset(div_42);
                    var node_27 = sibling(div_42, 2);
                    {
                      var consequent_18 = ($$anchor7) => {
                        var fragment_23 = root_242();
                        var div_46 = sibling(first_child(fragment_23));
                        var div_47 = sibling(child(div_46), 3);
                        var node_28 = sibling(child(div_47));
                        {
                          var consequent_15 = ($$anchor8) => {
                            var fragment_24 = root_25();
                            var div_48 = sibling(first_child(fragment_24));
                            var code_1 = sibling(child(div_48), 3);
                            var text_31 = child(code_1, true);
                            reset(code_1);
                            var span_12 = sibling(code_1, 2);
                            var text_32 = child(span_12);
                            reset(span_12);
                            next();
                            reset(div_48);
                            next();
                            template_effect(($0) => {
                              set_text(text_31, $0);
                              set_text(text_32, ` from ${get(stage).conditions.skipIf.sourceStage ?? ""}`);
                            }, [
                              () => JSON.stringify(get(stage).conditions.skipIf.condition)
                            ]);
                            append($$anchor8, fragment_24);
                          };
                          if_block(node_28, ($$render) => {
                            if (get(stage).conditions.skipIf)
                              $$render(consequent_15);
                          });
                        }
                        var node_29 = sibling(node_28, 2);
                        {
                          var consequent_16 = ($$anchor8) => {
                            var fragment_25 = root_26();
                            var div_49 = sibling(first_child(fragment_25));
                            var code_2 = sibling(child(div_49), 3);
                            var text_33 = child(code_2, true);
                            reset(code_2);
                            var span_13 = sibling(code_2, 2);
                            var text_34 = child(span_13);
                            reset(span_13);
                            next();
                            reset(div_49);
                            next();
                            template_effect(($0) => {
                              set_text(text_33, $0);
                              set_text(text_34, ` from ${get(stage).conditions.runIf.sourceStage ?? ""}`);
                            }, [
                              () => JSON.stringify(get(stage).conditions.runIf.condition)
                            ]);
                            append($$anchor8, fragment_25);
                          };
                          if_block(node_29, ($$render) => {
                            if (get(stage).conditions.runIf)
                              $$render(consequent_16);
                          });
                        }
                        var node_30 = sibling(node_29, 2);
                        {
                          var consequent_17 = ($$anchor8) => {
                            var fragment_26 = root_27();
                            var div_50 = sibling(first_child(fragment_26));
                            var code_3 = sibling(child(div_50), 3);
                            var text_35 = child(code_3, true);
                            reset(code_3);
                            var span_14 = sibling(code_3, 2);
                            var text_36 = child(span_14);
                            reset(span_14);
                            next();
                            reset(div_50);
                            next();
                            template_effect(($0) => {
                              set_text(text_35, $0);
                              set_text(text_36, ` return to ${get(stage).conditions.earlyExit.returnStage ?? ""}`);
                            }, [
                              () => JSON.stringify(get(stage).conditions.earlyExit.condition)
                            ]);
                            append($$anchor8, fragment_26);
                          };
                          if_block(node_30, ($$render) => {
                            if (get(stage).conditions.earlyExit)
                              $$render(consequent_17);
                          });
                        }
                        next();
                        reset(div_47);
                        next();
                        reset(div_46);
                        next();
                        append($$anchor7, fragment_23);
                      };
                      if_block(node_27, ($$render) => {
                        if (get(stage).conditions?.skipIf || get(stage).conditions?.runIf || get(stage).conditions?.earlyExit)
                          $$render(consequent_18);
                      });
                    }
                    next();
                    reset(div_28);
                    next();
                    template_effect(() => {
                      set_text(text_18, ` ${get(stage).model.providerID ?? ""}`);
                      set_text(text_19, ` ${get(stage).model.modelID ?? ""}`);
                      set_text(text_20, ` ${get(stage).model.tier ?? ""}`);
                      set_text(text_21, ` ${get(stage).model.maxTokens ?? ""}`);
                      set_text(text_22, ` ${get(stage).model.temperature ?? ""}`);
                      set_text(text_23, get(stage).prompt.systemPrompt);
                      set_text(text_24, get(stage).prompt.template);
                      set_text(text_29, ` ${get(stage).output.format ?? ""}`);
                    });
                    append($$anchor6, fragment_16);
                  };
                  if_block(node_19, ($$render) => {
                    if (get(expandedStage) === get(stage).id)
                      $$render(consequent_19);
                  });
                }
                next();
                reset(div_23);
                var node_31 = sibling(div_23, 2);
                {
                  var consequent_20 = ($$anchor6) => {
                    var fragment_27 = root_28();
                    next(2);
                    append($$anchor6, fragment_27);
                  };
                  if_block(node_31, ($$render) => {
                    if (index2 < get(pipeline).stages.length - 1)
                      $$render(consequent_20);
                  });
                }
                next();
                reset(div_22);
                next();
                template_effect(($0) => {
                  set_class(div_23, 1, `bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${get(expandedStage) === get(stage).id ? "ring-2 ring-blue-200" : ""}`);
                  set_text(text_13, get(stage).name);
                  set_class(span_5, 1, `text-xs px-2 py-0.5 rounded-full border ${(stageTypeColors[get(stage).type] || stageTypeColors.custom) ?? ""}`);
                  set_text(text_14, `
                    ${(stageTypeIcons[get(stage).type] || "⚙️") ?? ""} ${get(stage).type ?? ""}
                  `);
                  set_text(text_15, `
                  ${$0 ?? ""} · temp: ${get(stage).model.temperature ?? ""}
                `);
                  set_text(text_16, get(expandedStage) === get(stage).id ? "−" : "+");
                }, [() => getModelShortName(get(stage).model.modelID)]);
                append($$anchor5, fragment_13);
              });
              next();
              reset(div_21);
              next();
              template_effect(() => {
                set_text(text_1, get(pipeline).pipeline.name);
                set_text(text_2, `
            v${get(pipeline).pipeline.version ?? ""} · ${get(pipeline).pipeline.defaultProvider ?? ""} · ${get(pipeline).stages.length ?? ""} stages
          `);
              });
              append($$anchor4, fragment_5);
            };
            if_block(node_2, ($$render) => {
              if (get(pipeline))
                $$render(consequent_21);
            }, true);
          }
          append($$anchor3, fragment_4);
        };
        if_block(node_1, ($$render) => {
          if (get(error))
            $$render(consequent_1);
          else
            $$render(alternate, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(loading))
        $$render(consequent);
      else
        $$render(alternate_1, false);
    });
  }
  next();
  reset(div);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var PipelineDetail_default = PipelineDetail;
delegate(["click"]);

// web/components/outputs/OutputList.svelte
var root_114 = from_html(`
        <option> </option>
      `, 1);
var root_29 = from_html(`
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading outputs...</div>
    </div>
  `, 1);
var root_45 = from_html(`
    <div class="bg-red-50 text-red-600 p-4 rounded-lg"> </div>
  `, 1);
var root_67 = from_html(`
    <div class="text-center py-12 text-slate-500">
      <p class="text-4xl mb-4">\uD83D\uDCED</p>
      <p>No outputs found</p>
      <p class="text-sm mt-2">Run a pipeline to see results here</p>
    </div>
  `, 1);
var root_94 = from_html(`
            <button class="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-200 text-left hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <span class="text-xl">
                    <!>
                  </span>

                  <div>
                    <div class="font-medium text-slate-800"> </div>
                    <div class="text-xs text-slate-500"> </div>
                  </div>
                </div>

                <span> </span>
              </div>

              <div class="flex items-center gap-4 text-sm text-slate-500">
                <span> </span>
                <span> </span>
                <span> <!>
                  <!>
                </span>
              </div>
            </button>
          `, 1);
var root_84 = from_html(`
      <div class="mb-6">
        <h2 class="text-sm font-semibold text-slate-500 mb-3"> </h2>

        <div class="space-y-2">
          <!>
        </div>
      </div>
    `, 1);
var root_75 = from_html(`
    <!>
  `, 1);
var root10 = from_html(`

<div>
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Execution Outputs</h1>
      <p class="text-slate-500 mt-1">View pipeline execution results and stage details</p>
    </div>

    <select class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
      <option>All Pipelines</option>
      <!>
    </select>
  </div>

  <!>
</div>`, 1);
function OutputList($$anchor, $$props) {
  push($$props, true);
  let outputs = state(proxy([]));
  let loading = state(true);
  let error = state(null);
  let filter = state("all");
  user_effect(() => {
    fetch("/api/outputs").then((r) => r.json()).then((data) => {
      set(outputs, data, true);
      set(loading, false);
    }).catch((e) => {
      set(error, e.message, true);
      set(loading, false);
    });
  });
  function formatDuration(ms) {
    if (!ms)
      return "-";
    if (ms < 1000)
      return `${ms}ms`;
    if (ms < 60000)
      return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.round(ms % 60000 / 1000);
    return `${mins}m ${secs}s`;
  }
  function formatCost(cost) {
    if (!cost)
      return "-";
    return `$${cost.toFixed(4)}`;
  }
  let pipelineIds = user_derived(() => [...new Set(get(outputs).map((o) => o.pipelineId))]);
  let filteredOutputs = user_derived(() => get(filter) === "all" ? get(outputs) : get(outputs).filter((o) => o.pipelineId === get(filter)));
  function getGroupedOutputs(outputList) {
    const groups = {};
    for (const output of outputList) {
      const date = new Date(output.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      if (!groups[date])
        groups[date] = [];
      groups[date].push(output);
    }
    return groups;
  }
  let groupedOutputs = user_derived(() => getGroupedOutputs(get(filteredOutputs)));
  next();
  var fragment = root10();
  var div = sibling(first_child(fragment));
  var div_1 = sibling(child(div));
  var select = sibling(child(div_1), 3);
  var option = sibling(child(select));
  option.value = option.__value = "all";
  var node = sibling(option, 2);
  each(node, 17, () => get(pipelineIds), index, ($$anchor2, pid) => {
    next();
    var fragment_1 = root_114();
    var option_1 = sibling(first_child(fragment_1));
    var text2 = child(option_1, true);
    reset(option_1);
    var option_1_value = {};
    next();
    template_effect(() => {
      set_text(text2, get(pid));
      if (option_1_value !== (option_1_value = get(pid))) {
        option_1.value = (option_1.__value = get(pid)) ?? "";
      }
    });
    append($$anchor2, fragment_1);
  });
  next();
  reset(select);
  next();
  reset(div_1);
  var node_1 = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_2 = root_29();
      next(2);
      append($$anchor2, fragment_2);
    };
    var alternate_4 = ($$anchor2) => {
      var fragment_3 = comment();
      var node_2 = first_child(fragment_3);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_4 = root_45();
          var div_2 = sibling(first_child(fragment_4));
          var text_1 = child(div_2, true);
          reset(div_2);
          next();
          template_effect(() => set_text(text_1, get(error)));
          append($$anchor3, fragment_4);
        };
        var alternate_3 = ($$anchor3) => {
          var fragment_5 = comment();
          var node_3 = first_child(fragment_5);
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_6 = root_67();
              next(2);
              append($$anchor4, fragment_6);
            };
            var alternate_2 = ($$anchor4) => {
              var fragment_7 = root_75();
              var node_4 = sibling(first_child(fragment_7));
              each(node_4, 17, () => Object.entries(get(groupedOutputs)), index, ($$anchor5, $$item) => {
                var $$array = user_derived(() => to_array(get($$item), 2));
                let date = () => get($$array)[0];
                let dateOutputs = () => get($$array)[1];
                next();
                var fragment_8 = root_84();
                var div_3 = sibling(first_child(fragment_8));
                var h2 = sibling(child(div_3));
                var text_2 = child(h2, true);
                reset(h2);
                var div_4 = sibling(h2, 2);
                var node_5 = sibling(child(div_4));
                each(node_5, 17, dateOutputs, index, ($$anchor6, output) => {
                  next();
                  var fragment_9 = root_94();
                  var button = sibling(first_child(fragment_9));
                  button.__click = () => $$props.navigate(`/outputs/${get(output).filename}`);
                  var div_5 = sibling(child(button));
                  var div_6 = sibling(child(div_5));
                  var span = sibling(child(div_6));
                  var node_6 = sibling(child(span));
                  {
                    var consequent_3 = ($$anchor7) => {
                      var text_3 = text(`
                      ✅
                    `);
                      append($$anchor7, text_3);
                    };
                    var alternate_1 = ($$anchor7) => {
                      var fragment_10 = comment();
                      var node_7 = first_child(fragment_10);
                      {
                        var consequent_4 = ($$anchor8) => {
                          var text_4 = text(`
                      ❌
                    `);
                          append($$anchor8, text_4);
                        };
                        var alternate = ($$anchor8) => {
                          var text_5 = text(`
                      ⚠️
                    `);
                          append($$anchor8, text_5);
                        };
                        if_block(node_7, ($$render) => {
                          if (get(output).status === "failed")
                            $$render(consequent_4);
                          else
                            $$render(alternate, false);
                        }, true);
                      }
                      append($$anchor7, fragment_10);
                    };
                    if_block(node_6, ($$render) => {
                      if (get(output).status === "success")
                        $$render(consequent_3);
                      else
                        $$render(alternate_1, false);
                    });
                  }
                  next();
                  reset(span);
                  var div_7 = sibling(span, 2);
                  var div_8 = sibling(child(div_7));
                  var text_6 = child(div_8, true);
                  reset(div_8);
                  var div_9 = sibling(div_8, 2);
                  var text_7 = child(div_9);
                  reset(div_9);
                  next();
                  reset(div_7);
                  next();
                  reset(div_6);
                  var span_1 = sibling(div_6, 2);
                  var text_8 = child(span_1);
                  reset(span_1);
                  next();
                  reset(div_5);
                  var div_10 = sibling(div_5, 2);
                  var span_2 = sibling(child(div_10));
                  var text_9 = child(span_2);
                  reset(span_2);
                  var span_3 = sibling(span_2, 2);
                  var text_10 = child(span_3);
                  reset(span_3);
                  var span_4 = sibling(span_3, 2);
                  var text_11 = child(span_4);
                  var node_8 = sibling(text_11);
                  {
                    var consequent_5 = ($$anchor7) => {
                      var text_12 = text();
                      template_effect(() => set_text(text_12, `
                    · ${get(output).stagesSkipped ?? ""} skipped
                  `));
                      append($$anchor7, text_12);
                    };
                    if_block(node_8, ($$render) => {
                      if (get(output).stagesSkipped)
                        $$render(consequent_5);
                    });
                  }
                  var node_9 = sibling(node_8, 2);
                  {
                    var consequent_6 = ($$anchor7) => {
                      var text_13 = text();
                      template_effect(() => set_text(text_13, `
                    · ${get(output).stagesFailed ?? ""} failed
                  `));
                      append($$anchor7, text_13);
                    };
                    if_block(node_9, ($$render) => {
                      if (get(output).stagesFailed)
                        $$render(consequent_6);
                    });
                  }
                  next();
                  reset(span_4);
                  next();
                  reset(div_10);
                  next();
                  reset(button);
                  next();
                  template_effect(($0, $1, $2) => {
                    set_text(text_6, get(output).pipelineId);
                    set_text(text_7, `
                      ${$0 ?? ""}
                    `);
                    set_class(span_1, 1, `text-xs px-2 py-1 rounded-full ${get(output).status === "success" ? "bg-green-100 text-green-700" : get(output).status === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`);
                    set_text(text_8, `
                  ${get(output).status ?? ""}
                `);
                    set_text(text_9, `⏱ ${$1 ?? ""}`);
                    set_text(text_10, `\uD83D\uDCB0 ${$2 ?? ""}`);
                    set_text(text_11, `
                  \uD83D\uDCCA ${get(output).stagesRun ?? ""} run
                  `);
                  }, [
                    () => new Date(get(output).timestamp).toLocaleTimeString(),
                    () => formatDuration(get(output).duration),
                    () => formatCost(get(output).cost)
                  ]);
                  append($$anchor6, fragment_9);
                });
                next();
                reset(div_4);
                next();
                reset(div_3);
                next();
                template_effect(() => set_text(text_2, date()));
                append($$anchor5, fragment_8);
              });
              next();
              append($$anchor4, fragment_7);
            };
            if_block(node_3, ($$render) => {
              if (get(filteredOutputs).length === 0)
                $$render(consequent_2);
              else
                $$render(alternate_2, false);
            }, true);
          }
          append($$anchor3, fragment_5);
        };
        if_block(node_2, ($$render) => {
          if (get(error))
            $$render(consequent_1);
          else
            $$render(alternate_3, false);
        }, true);
      }
      append($$anchor2, fragment_3);
    };
    if_block(node_1, ($$render) => {
      if (get(loading))
        $$render(consequent);
      else
        $$render(alternate_4, false);
    });
  }
  next();
  reset(div);
  bind_select_value(select, () => get(filter), ($$value) => set(filter, $$value));
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var OutputList_default = OutputList;
delegate(["click"]);

// web/components/outputs/OutputDetail.svelte
var root_116 = from_html(`
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading output...</div>
    </div>
  `, 1);
var root_38 = from_html(`
    <div class="bg-red-50 text-red-600 p-4 rounded-lg"> </div>
  `, 1);
var root_154 = from_html(`
                  <div class="text-xs text-slate-500 mt-0.5"> </div>
                `, 1);
var root_174 = from_html(`
                  <div class="text-sm text-slate-500"> </div>
                `, 1);
var root_183 = from_html(`
                <div class="text-xs text-slate-500"> </div>
              `, 1);
var root_203 = from_html(`
                  <pre class="text-xs whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96"> </pre>
                `, 1);
var root_223 = from_html(`
                  <pre class="text-xs whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96"> </pre>
                `, 1);
var root_233 = from_html(`
                  <p class="text-sm text-slate-500">No parsed output available</p>
                `, 1);
var root_194 = from_html(`
              <div class="px-4 pb-4 bg-slate-50">
                <div class="flex gap-2 mb-3">
                  <button>
                    Parsed
                  </button>
                  <button>
                    Raw
                  </button>
                </div>

                <!>

                <div class="mt-3 flex gap-4 text-xs text-slate-500">
                  <span> </span>
                  <span> </span>
                </div>
              </div>
            `, 1);
var root_243 = from_html(`
              <div class="px-4 pb-4 bg-red-50">
                <pre class="text-xs whitespace-pre-wrap text-red-700"> </pre>
              </div>
            `, 1);
var root_85 = from_html(`
          <div>
            <button class="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer">
              <span class="text-xl">
                <!>
              </span>

              <div></div>

              <div class="flex-1">
                <div class="font-medium text-slate-800"> </div>
                <!>
              </div>

              <!>

              <span class="text-slate-400"> </span>
            </button>

            <!>

            <!>
          </div>
        `, 1);
var root_58 = from_html(`
    <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <div class="flex items-center gap-3">
            <span class="text-2xl">
              <!>
            </span>
            <h1 class="text-2xl font-bold text-slate-800"> </h1>
            <span> </span>
          </div>
          <p class="text-sm text-slate-500 mt-2"> </p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-800"> </div>
          <div class="text-xs text-slate-500">Duration</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-800"> </div>
          <div class="text-xs text-slate-500">Cost</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-800"> </div>
          <div class="text-xs text-slate-500">Tokens</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-green-600"> </div>
          <div class="text-xs text-slate-500">Stages Run</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-500"> </div>
          <div class="text-xs text-slate-500">Skipped</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
      <div class="p-4 border-b border-slate-200">
        <h2 class="font-semibold text-slate-700">Input</h2>
      </div>
      <div class="p-4">
        <pre class="text-sm whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto"> </pre>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
      <div class="p-4 border-b border-slate-200">
        <h2 class="font-semibold text-slate-700">Stages</h2>
      </div>

      <div class="divide-y divide-slate-100">
        <!>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 class="font-semibold text-slate-700">Final Output</h2>
        <button class="text-sm px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"> </button>
      </div>
      <div class="p-4">
        <pre class="text-sm whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-[32rem]"> </pre>
      </div>
    </div>
  `, 1);
var root11 = from_html(`

<div>
  <button class="text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1 cursor-pointer">
    ← Back to Outputs
  </button>

  <!>
</div>`, 1);
function OutputDetail($$anchor, $$props) {
  push($$props, true);
  let output = state(null);
  let loading = state(true);
  let error = state(null);
  let expandedStages = state(proxy(new Set));
  let showRaw = state(proxy({}));
  let copied = state(false);
  user_effect(() => {
    set(loading, true);
    fetch(`/api/outputs/${$$props.filename}`).then((r) => {
      if (!r.ok)
        throw new Error("Output not found");
      return r.json();
    }).then((data) => {
      set(output, data, true);
      set(loading, false);
    }).catch((e) => {
      set(error, e.message, true);
      set(loading, false);
    });
  });
  function formatDuration(ms) {
    if (!ms)
      return "-";
    if (ms < 1000)
      return `${ms}ms`;
    if (ms < 60000)
      return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.round(ms % 60000 / 1000);
    return `${mins}m ${secs}s`;
  }
  function formatCost(cost) {
    if (!cost && cost !== 0)
      return "-";
    return `$${cost.toFixed(4)}`;
  }
  function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function formatNumber(n) {
    return n?.toLocaleString() ?? "-";
  }
  function toggleStage(stageId) {
    const newSet = new Set(get(expandedStages));
    if (newSet.has(stageId)) {
      newSet.delete(stageId);
    } else {
      newSet.add(stageId);
    }
    set(expandedStages, newSet, true);
  }
  function toggleRaw(stageId) {
    set(showRaw, { ...get(showRaw), [stageId]: !get(showRaw)[stageId] }, true);
  }
  function getModelShortName(modelId) {
    if (!modelId)
      return "-";
    if (modelId.includes("haiku"))
      return "Haiku";
    if (modelId.includes("sonnet"))
      return "Sonnet";
    if (modelId.includes("opus"))
      return "Opus";
    if (modelId.includes("gpt-4o-mini"))
      return "GPT-4o Mini";
    if (modelId.includes("gpt-4o"))
      return "GPT-4o";
    if (modelId.includes("gemini"))
      return "Gemini";
    return modelId;
  }
  function formatAnyOutput(val) {
    if (!val)
      return "";
    if (typeof val === "object") {
      return JSON.stringify(val, null, 2);
    }
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return val;
      }
    }
    return String(val);
  }
  function getFinalOutput() {
    if (!get(output))
      return "";
    const out = get(output).output;
    if (out.optimizedPrompt)
      return String(out.optimizedPrompt);
    if (out.refinedPrompt)
      return String(out.refinedPrompt);
    if (out.enhancedPrompt)
      return String(out.enhancedPrompt);
    if (out["stage-3-generate"]?.pipelineConfig) {
      return JSON.stringify(out["stage-3-generate"].pipelineConfig, null, 2);
    }
    return JSON.stringify(out, null, 2);
  }
  async function copyToClipboard() {
    const text2 = getFinalOutput();
    await navigator.clipboard.writeText(text2);
    set(copied, true);
    setTimeout(() => set(copied, false), 2000);
  }
  next();
  var fragment = root11();
  var div = sibling(first_child(fragment));
  var button = sibling(child(div));
  button.__click = () => $$props.navigate("/outputs");
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_116();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate_8 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_38();
          var div_1 = sibling(first_child(fragment_3));
          var text_1 = child(div_1, true);
          reset(div_1);
          next();
          template_effect(() => set_text(text_1, get(error)));
          append($$anchor3, fragment_3);
        };
        var alternate_7 = ($$anchor3) => {
          var fragment_4 = comment();
          var node_2 = first_child(fragment_4);
          {
            var consequent_13 = ($$anchor4) => {
              var fragment_5 = root_58();
              var div_2 = sibling(first_child(fragment_5));
              var div_3 = sibling(child(div_2));
              var div_4 = sibling(child(div_3));
              var div_5 = sibling(child(div_4));
              var span = sibling(child(div_5));
              var node_3 = sibling(child(span));
              {
                var consequent_2 = ($$anchor5) => {
                  var text_2 = text(`
                ✅
              `);
                  append($$anchor5, text_2);
                };
                var alternate = ($$anchor5) => {
                  var text_3 = text(`
                ❌
              `);
                  append($$anchor5, text_3);
                };
                if_block(node_3, ($$render) => {
                  if (get(output).status === "success")
                    $$render(consequent_2);
                  else
                    $$render(alternate, false);
                });
              }
              next();
              reset(span);
              var h1 = sibling(span, 2);
              var text_4 = child(h1, true);
              reset(h1);
              var span_1 = sibling(h1, 2);
              var text_5 = child(span_1);
              reset(span_1);
              next();
              reset(div_5);
              var p = sibling(div_5, 2);
              var text_6 = child(p, true);
              reset(p);
              next();
              reset(div_4);
              next();
              reset(div_3);
              var div_6 = sibling(div_3, 2);
              var div_7 = sibling(child(div_6));
              var div_8 = sibling(child(div_7));
              var text_7 = child(div_8, true);
              reset(div_8);
              next(3);
              reset(div_7);
              var div_9 = sibling(div_7, 2);
              var div_10 = sibling(child(div_9));
              var text_8 = child(div_10, true);
              reset(div_10);
              next(3);
              reset(div_9);
              var div_11 = sibling(div_9, 2);
              var div_12 = sibling(child(div_11));
              var text_9 = child(div_12, true);
              reset(div_12);
              next(3);
              reset(div_11);
              var div_13 = sibling(div_11, 2);
              var div_14 = sibling(child(div_13));
              var text_10 = child(div_14, true);
              reset(div_14);
              next(3);
              reset(div_13);
              var div_15 = sibling(div_13, 2);
              var div_16 = sibling(child(div_15));
              var text_11 = child(div_16, true);
              reset(div_16);
              next(3);
              reset(div_15);
              next();
              reset(div_6);
              next();
              reset(div_2);
              var div_17 = sibling(div_2, 2);
              var div_18 = sibling(child(div_17), 3);
              var pre = sibling(child(div_18));
              var text_12 = child(pre, true);
              reset(pre);
              next();
              reset(div_18);
              next();
              reset(div_17);
              var div_19 = sibling(div_17, 2);
              var div_20 = sibling(child(div_19), 3);
              var node_4 = sibling(child(div_20));
              each(node_4, 17, () => get(output).stages, index, ($$anchor5, stage, index2) => {
                next();
                var fragment_6 = root_85();
                var div_21 = sibling(first_child(fragment_6));
                var button_1 = sibling(child(div_21));
                button_1.__click = () => toggleStage(get(stage).stageId);
                var span_2 = sibling(child(button_1));
                var node_5 = sibling(child(span_2));
                {
                  var consequent_3 = ($$anchor6) => {
                    var text_13 = text(`
                  ✅
                `);
                    append($$anchor6, text_13);
                  };
                  var alternate_3 = ($$anchor6) => {
                    var fragment_7 = comment();
                    var node_6 = first_child(fragment_7);
                    {
                      var consequent_4 = ($$anchor7) => {
                        var text_14 = text(`
                  ⏭️
                `);
                        append($$anchor7, text_14);
                      };
                      var alternate_2 = ($$anchor7) => {
                        var fragment_8 = comment();
                        var node_7 = first_child(fragment_8);
                        {
                          var consequent_5 = ($$anchor8) => {
                            var text_15 = text(`
                  ❌
                `);
                            append($$anchor8, text_15);
                          };
                          var alternate_1 = ($$anchor8) => {
                            var text_16 = text(`
                  ⏳
                `);
                            append($$anchor8, text_16);
                          };
                          if_block(node_7, ($$render) => {
                            if (get(stage).status === "failed")
                              $$render(consequent_5);
                            else
                              $$render(alternate_1, false);
                          }, true);
                        }
                        append($$anchor7, fragment_8);
                      };
                      if_block(node_6, ($$render) => {
                        if (get(stage).status === "skipped")
                          $$render(consequent_4);
                        else
                          $$render(alternate_2, false);
                      }, true);
                    }
                    append($$anchor6, fragment_7);
                  };
                  if_block(node_5, ($$render) => {
                    if (get(stage).status === "completed")
                      $$render(consequent_3);
                    else
                      $$render(alternate_3, false);
                  });
                }
                next();
                reset(span_2);
                var div_22 = sibling(span_2, 2);
                div_22.textContent = `
                ${index2 + 1}
              `;
                var div_23 = sibling(div_22, 2);
                var div_24 = sibling(child(div_23));
                var text_17 = child(div_24, true);
                reset(div_24);
                var node_8 = sibling(div_24, 2);
                {
                  var consequent_6 = ($$anchor6) => {
                    var fragment_9 = root_154();
                    var div_25 = sibling(first_child(fragment_9));
                    var text_18 = child(div_25, true);
                    reset(div_25);
                    next();
                    template_effect(() => set_text(text_18, get(stage).error));
                    append($$anchor6, fragment_9);
                  };
                  var alternate_4 = ($$anchor6) => {
                    var fragment_10 = comment();
                    var node_9 = first_child(fragment_10);
                    {
                      var consequent_7 = ($$anchor7) => {
                        var fragment_11 = root_174();
                        var div_26 = sibling(first_child(fragment_11));
                        var text_19 = child(div_26);
                        reset(div_26);
                        next();
                        template_effect(($0, $1, $2) => set_text(text_19, `
                    ${$0 ?? ""} · ${$1 ?? ""} · ${$2 ?? ""}
                  `), [
                          () => getModelShortName(get(stage).model),
                          () => formatDuration(get(stage).duration),
                          () => formatCost(get(stage).cost)
                        ]);
                        append($$anchor7, fragment_11);
                      };
                      if_block(node_9, ($$render) => {
                        if (get(stage).status === "completed")
                          $$render(consequent_7);
                      }, true);
                    }
                    append($$anchor6, fragment_10);
                  };
                  if_block(node_8, ($$render) => {
                    if (get(stage).status === "skipped" && get(stage).error)
                      $$render(consequent_6);
                    else
                      $$render(alternate_4, false);
                  });
                }
                next();
                reset(div_23);
                var node_10 = sibling(div_23, 2);
                {
                  var consequent_8 = ($$anchor6) => {
                    var fragment_12 = root_183();
                    var div_27 = sibling(first_child(fragment_12));
                    var text_20 = child(div_27);
                    reset(div_27);
                    next();
                    template_effect(($0) => set_text(text_20, `${$0 ?? ""} tokens`), [
                      () => formatNumber(get(stage).inputTokens + get(stage).outputTokens)
                    ]);
                    append($$anchor6, fragment_12);
                  };
                  if_block(node_10, ($$render) => {
                    if (get(stage).status === "completed")
                      $$render(consequent_8);
                  });
                }
                var span_3 = sibling(node_10, 2);
                var text_21 = child(span_3, true);
                reset(span_3);
                next();
                reset(button_1);
                var node_11 = sibling(button_1, 2);
                {
                  var consequent_11 = ($$anchor6) => {
                    var fragment_13 = root_194();
                    var div_28 = sibling(first_child(fragment_13));
                    var div_29 = sibling(child(div_28));
                    var button_2 = sibling(child(div_29));
                    button_2.__click = () => toggleRaw(get(stage).stageId);
                    var button_3 = sibling(button_2, 2);
                    button_3.__click = () => toggleRaw(get(stage).stageId);
                    next();
                    reset(div_29);
                    var node_12 = sibling(div_29, 2);
                    {
                      var consequent_9 = ($$anchor7) => {
                        var fragment_14 = root_203();
                        var pre_1 = sibling(first_child(fragment_14));
                        var text_22 = child(pre_1, true);
                        reset(pre_1);
                        next();
                        template_effect(($0) => set_text(text_22, $0), [() => formatAnyOutput(get(stage).output)]);
                        append($$anchor7, fragment_14);
                      };
                      var alternate_6 = ($$anchor7) => {
                        var fragment_15 = comment();
                        var node_13 = first_child(fragment_15);
                        {
                          var consequent_10 = ($$anchor8) => {
                            var fragment_16 = root_223();
                            var pre_2 = sibling(first_child(fragment_16));
                            var text_23 = child(pre_2, true);
                            reset(pre_2);
                            next();
                            template_effect(($0) => set_text(text_23, $0), [() => JSON.stringify(get(stage).parsedOutput, null, 2)]);
                            append($$anchor8, fragment_16);
                          };
                          var alternate_5 = ($$anchor8) => {
                            var fragment_17 = root_233();
                            next(2);
                            append($$anchor8, fragment_17);
                          };
                          if_block(node_13, ($$render) => {
                            if (get(stage).parsedOutput)
                              $$render(consequent_10);
                            else
                              $$render(alternate_5, false);
                          }, true);
                        }
                        append($$anchor7, fragment_15);
                      };
                      if_block(node_12, ($$render) => {
                        if (get(showRaw)[get(stage).stageId])
                          $$render(consequent_9);
                        else
                          $$render(alternate_6, false);
                      });
                    }
                    var div_30 = sibling(node_12, 2);
                    var span_4 = sibling(child(div_30));
                    var text_24 = child(span_4);
                    reset(span_4);
                    var span_5 = sibling(span_4, 2);
                    var text_25 = child(span_5);
                    reset(span_5);
                    next();
                    reset(div_30);
                    next();
                    reset(div_28);
                    next();
                    template_effect(($0, $1) => {
                      set_class(button_2, 1, `text-xs px-3 py-1 rounded-lg border cursor-pointer ${get(showRaw)[get(stage).stageId] ? "bg-white border-slate-300" : "bg-blue-50 border-blue-200 text-blue-700"}`);
                      set_class(button_3, 1, `text-xs px-3 py-1 rounded-lg border cursor-pointer ${get(showRaw)[get(stage).stageId] ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-300"}`);
                      set_text(text_24, `Input: ${$0 ?? ""} tokens`);
                      set_text(text_25, `Output: ${$1 ?? ""} tokens`);
                    }, [
                      () => formatNumber(get(stage).inputTokens),
                      () => formatNumber(get(stage).outputTokens)
                    ]);
                    append($$anchor6, fragment_13);
                  };
                  if_block(node_11, ($$render) => {
                    if (get(expandedStages).has(get(stage).stageId) && get(stage).status === "completed")
                      $$render(consequent_11);
                  });
                }
                var node_14 = sibling(node_11, 2);
                {
                  var consequent_12 = ($$anchor6) => {
                    var fragment_18 = root_243();
                    var div_31 = sibling(first_child(fragment_18));
                    var pre_3 = sibling(child(div_31));
                    var text_26 = child(pre_3, true);
                    reset(pre_3);
                    next();
                    reset(div_31);
                    next();
                    template_effect(() => set_text(text_26, get(stage).error));
                    append($$anchor6, fragment_18);
                  };
                  if_block(node_14, ($$render) => {
                    if (get(expandedStages).has(get(stage).stageId) && get(stage).status === "failed" && get(stage).error)
                      $$render(consequent_12);
                  });
                }
                next();
                reset(div_21);
                next();
                template_effect(($0) => {
                  set_class(div_22, 1, `w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${get(stage).status === "completed" ? "bg-green-100 text-green-700" : get(stage).status === "skipped" ? "bg-slate-100 text-slate-500" : "bg-red-100 text-red-700"}`);
                  set_text(text_17, get(stage).stageName);
                  set_text(text_21, $0);
                }, [
                  () => get(expandedStages).has(get(stage).stageId) ? "−" : "+"
                ]);
                append($$anchor5, fragment_6);
              });
              next();
              reset(div_20);
              next();
              reset(div_19);
              var div_32 = sibling(div_19, 2);
              var div_33 = sibling(child(div_32));
              var button_4 = sibling(child(div_33), 3);
              button_4.__click = copyToClipboard;
              var text_27 = child(button_4);
              reset(button_4);
              next();
              reset(div_33);
              var div_34 = sibling(div_33, 2);
              var pre_4 = sibling(child(div_34));
              var text_28 = child(pre_4, true);
              reset(pre_4);
              next();
              reset(div_34);
              next();
              reset(div_32);
              next();
              template_effect(($0, $1, $2, $3, $4, $5) => {
                set_text(text_4, get(output).pipelineId);
                set_class(span_1, 1, `text-sm px-3 py-1 rounded-full ${get(output).status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`);
                set_text(text_5, `
              ${get(output).status ?? ""}
            `);
                set_text(text_6, $0);
                set_text(text_7, $1);
                set_text(text_8, $2);
                set_text(text_9, $3);
                set_text(text_10, get(output).summary.stagesRun);
                set_text(text_11, get(output).summary.stagesSkipped);
                set_text(text_12, $4);
                set_text(text_27, `
          ${get(copied) ? "Copied!" : "Copy"}
        `);
                set_text(text_28, $5);
              }, [
                () => formatDate(get(output).timestamp),
                () => formatDuration(get(output).summary.totalDuration),
                () => formatCost(get(output).summary.totalCost),
                () => formatNumber(get(output).summary.totalInputTokens + get(output).summary.totalOutputTokens),
                () => JSON.stringify(get(output).input, null, 2),
                getFinalOutput
              ]);
              append($$anchor4, fragment_5);
            };
            if_block(node_2, ($$render) => {
              if (get(output))
                $$render(consequent_13);
            }, true);
          }
          append($$anchor3, fragment_4);
        };
        if_block(node_1, ($$render) => {
          if (get(error))
            $$render(consequent_1);
          else
            $$render(alternate_7, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(loading))
        $$render(consequent);
      else
        $$render(alternate_8, false);
    });
  }
  next();
  reset(div);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var OutputDetail_default = OutputDetail;
delegate(["click"]);

// web/components/execution/ExecutionCard.svelte
var root12 = from_html(`

<button class="w-full text-left p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group cursor-pointer">
  <div class="flex items-start justify-between mb-2">
    <div class="flex items-center gap-2">
      <span class="text-lg">\uD83D\uDD27</span>
      <h3 class="font-medium text-slate-800"> </h3>
    </div>
    <span> </span>
  </div>

  <p class="text-sm text-slate-500 mb-3 line-clamp-1"> </p>

  <div class="flex items-center gap-4">
    <!-- Progress Bar -->
    <div class="flex-1">
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div></div>
      </div>
    </div>

    <!-- Stage Progress -->
    <span class="text-xs text-slate-500 shrink-0"> </span>

    <!-- Elapsed Time -->
    <span class="text-xs text-slate-500 shrink-0 w-16 text-right"> </span>

    <!-- View Arrow -->
    <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </div>
</button>`, 1);
function ExecutionCard($$anchor, $$props) {
  push($$props, true);
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("ExecutionCard clicked, execution:", $$props.execution.id);
    if ($$props.onselect) {
      $$props.onselect();
    } else {
      console.error("onselect is not defined!");
    }
  }
  function formatElapsed(startTime) {
    const elapsed2 = Date.now() - startTime;
    const seconds = Math.floor(elapsed2 / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
  function getProgressPercent() {
    if ($$props.execution.totalStages === 0)
      return 0;
    return Math.round($$props.execution.currentStage / $$props.execution.totalStages * 100);
  }
  function getStatusColor() {
    switch ($$props.execution.status) {
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "cancelled":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  }
  function getStatusIcon() {
    switch ($$props.execution.status) {
      case "running":
        return "▶";
      case "completed":
        return "✓";
      case "failed":
        return "✕";
      case "cancelled":
        return "⏸";
      default:
        return "•";
    }
  }
  let elapsed = state(proxy(formatElapsed($$props.execution.startTime)));
  user_effect(() => {
    if ($$props.execution.status !== "running")
      return;
    const interval = setInterval(() => {
      set(elapsed, formatElapsed($$props.execution.startTime), true);
    }, 1000);
    return () => clearInterval(interval);
  });
  next();
  var fragment = root12();
  var button = sibling(first_child(fragment));
  button.__click = handleClick;
  var div = sibling(child(button));
  var div_1 = sibling(child(div));
  var h3 = sibling(child(div_1), 3);
  var text2 = child(h3, true);
  reset(h3);
  next();
  reset(div_1);
  var span = sibling(div_1, 2);
  var text_1 = child(span);
  reset(span);
  next();
  reset(div);
  var p = sibling(div, 2);
  var text_2 = child(p);
  reset(p);
  var div_2 = sibling(p, 2);
  var node = sibling(child(div_2));
  var div_3 = sibling(node, 2);
  var div_4 = sibling(child(div_3));
  var div_5 = sibling(child(div_4));
  next();
  reset(div_4);
  next();
  reset(div_3);
  var node_1 = sibling(div_3, 2);
  var span_1 = sibling(node_1, 2);
  var text_3 = child(span_1);
  reset(span_1);
  var node_2 = sibling(span_1, 2);
  var span_2 = sibling(node_2, 2);
  var text_4 = child(span_2);
  reset(span_2);
  var node_3 = sibling(span_2, 2);
  next(3);
  reset(div_2);
  next();
  reset(button);
  template_effect(($0, $1, $2) => {
    set_text(text2, $$props.execution.pipelineName);
    set_class(span, 1, `text-xs px-2 py-1 rounded-full font-medium ${$0 ?? ""}`);
    set_text(text_1, `
      ${$1 ?? ""} ${$$props.execution.status ?? ""}
    `);
    set_text(text_2, `
    "${$$props.execution.inputPreview ?? ""}"
  `);
    set_class(div_5, 1, `h-full bg-blue-500 transition-all duration-300 ${$$props.execution.status === "running" ? "animate-pulse" : ""}`);
    set_style(div_5, `width: ${$2 ?? ""}%`);
    set_text(text_3, `
      Stage ${$$props.execution.currentStage ?? ""}/${$$props.execution.totalStages ?? ""}
    `);
    set_text(text_4, `
      ${get(elapsed) ?? ""}
    `);
  }, [getStatusColor, getStatusIcon, getProgressPercent]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExecutionCard_default = ExecutionCard;
delegate(["click"]);

// web/components/execution/HistoryCard.svelte
var root_117 = from_html(`
    <div class="mt-2 text-xs text-red-600 truncate pl-12"> </div>
  `, 1);
var root13 = from_html(`

<button class="w-full text-left p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group cursor-pointer">
  <div class="flex items-center gap-4">
    <!-- Status Icon -->
    <div>
      <span class="text-sm"> </span>
    </div>

    <!-- Pipeline Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium text-slate-800 truncate"> </h3>
        <span> </span>
      </div>
      <p class="text-xs text-slate-500 truncate mt-0.5"> </p>
    </div>

    <!-- Stats -->
    <div class="flex items-center gap-4 shrink-0 text-xs text-slate-500">
      <div class="text-right">
        <div class="font-medium text-slate-700"> </div>
        <div>duration</div>
      </div>
      <div class="text-right">
        <div class="font-medium text-slate-700"> </div>
        <div>cost</div>
      </div>
      <div class="text-right">
        <div class="font-medium text-slate-700"> </div>
        <div>stages</div>
      </div>
      <div class="text-right w-16">
        <div class="font-medium text-slate-700"> </div>
      </div>
    </div>

    <!-- Arrow -->
    <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </div>

  <!>
</button>`, 1);
function HistoryCard($$anchor, $$props) {
  push($$props, true);
  function getStatusColor() {
    switch ($$props.record.status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "cancelled":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  }
  function getStatusIcon() {
    switch ($$props.record.status) {
      case "completed":
        return "✓";
      case "failed":
        return "✕";
      case "cancelled":
        return "⏸";
      default:
        return "•";
    }
  }
  next();
  var fragment = root13();
  var button = sibling(first_child(fragment));
  button.__click = function(...$$args) {
    $$props.onclick?.apply(this, $$args);
  };
  var div = sibling(child(button));
  var node = sibling(child(div));
  var div_1 = sibling(node, 2);
  var span = sibling(child(div_1));
  var text2 = child(span, true);
  reset(span);
  next();
  reset(div_1);
  var node_1 = sibling(div_1, 2);
  var div_2 = sibling(node_1, 2);
  var div_3 = sibling(child(div_2));
  var h3 = sibling(child(div_3));
  var text_1 = child(h3, true);
  reset(h3);
  var span_1 = sibling(h3, 2);
  var text_2 = child(span_1);
  reset(span_1);
  next();
  reset(div_3);
  var p = sibling(div_3, 2);
  var text_3 = child(p);
  reset(p);
  next();
  reset(div_2);
  var node_2 = sibling(div_2, 2);
  var div_4 = sibling(node_2, 2);
  var div_5 = sibling(child(div_4));
  var div_6 = sibling(child(div_5));
  var text_4 = child(div_6, true);
  reset(div_6);
  next(3);
  reset(div_5);
  var div_7 = sibling(div_5, 2);
  var div_8 = sibling(child(div_7));
  var text_5 = child(div_8, true);
  reset(div_8);
  next(3);
  reset(div_7);
  var div_9 = sibling(div_7, 2);
  var div_10 = sibling(child(div_9));
  var text_6 = child(div_10);
  reset(div_10);
  next(3);
  reset(div_9);
  var div_11 = sibling(div_9, 2);
  var div_12 = sibling(child(div_11));
  var text_7 = child(div_12, true);
  reset(div_12);
  next();
  reset(div_11);
  next();
  reset(div_4);
  var node_3 = sibling(div_4, 2);
  next(3);
  reset(div);
  var node_4 = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_117();
      var div_13 = sibling(first_child(fragment_1));
      var text_8 = child(div_13);
      reset(div_13);
      next();
      template_effect(() => set_text(text_8, `
      Error: ${$$props.record.error ?? ""}
    `));
      append($$anchor2, fragment_1);
    };
    if_block(node_4, ($$render) => {
      if ($$props.record.error)
        $$render(consequent);
    });
  }
  next();
  reset(button);
  template_effect(($0, $1, $2, $3, $4, $5) => {
    set_class(div_1, 1, `w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${$0 ?? ""}`);
    set_text(text2, $1);
    set_text(text_1, $$props.record.pipelineName);
    set_class(span_1, 1, `text-xs px-2 py-0.5 rounded-full font-medium ${$2 ?? ""} shrink-0`);
    set_text(text_2, `
          ${$$props.record.status ?? ""}
        `);
    set_text(text_3, `
        "${$$props.record.inputPreview ?? ""}"
      `);
    set_text(text_4, $3);
    set_text(text_5, $4);
    set_text(text_6, `${$$props.record.stagesRun ?? ""}/${$$props.record.totalStages ?? ""}`);
    set_text(text_7, $5);
  }, [
    getStatusColor,
    getStatusIcon,
    getStatusColor,
    () => $$props.formatDuration($$props.record.duration),
    () => $$props.formatCost($$props.record.totalCost),
    () => $$props.formatTime($$props.record.startTime)
  ]);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var HistoryCard_default = HistoryCard;
delegate(["click"]);

// web/components/execution/RunningExecutions.svelte
var root_118 = from_html(`
    <div class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3 text-slate-500">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading executions...</span>
      </div>
    </div>
  `, 1);
var root_39 = from_html(`
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p class="font-medium">Error loading executions</p>
      <p class="text-sm"> </p>
    </div>
  `, 1);
var root_59 = from_html(`
          <span class="text-sm text-slate-500"> </span>
        `, 1);
var root_68 = from_html(`
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="text-base font-medium text-slate-700 mb-1">No Active Runs</h3>
          <p class="text-sm text-slate-500">
            Start a pipeline to see live execution progress here.
          </p>
        </div>
      `, 1);
var root_86 = from_html(`
            <!>
          `, 1);
var root_76 = from_html(`
        <div class="space-y-3">
          <!>
        </div>
      `, 1);
var root_95 = from_html(`
            <span class="text-sm text-slate-500"> </span>
          `, 1);
var root_104 = from_svg(`
          <svg class="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `, 1);
var root_115 = from_html(`
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <div class="text-3xl mb-3">\uD83D\uDCCB</div>
          <h3 class="text-base font-medium text-slate-700 mb-1">No Execution History</h3>
          <p class="text-sm text-slate-500">
            Completed pipeline runs will appear here.
          </p>
        </div>
      `, 1);
var root_134 = from_html(`
            <!>
          `, 1);
var root_155 = from_html(`
                  <button> </button>
                `, 1);
var root_144 = from_html(`
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div class="text-sm text-slate-500"> </div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                First
              </button>
              <button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                Previous
              </button>
              <div class="flex items-center gap-1">
                <!>
              </div>
              <button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                Next
              </button>
              <button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                Last
              </button>
            </div>
          </div>
        `, 1);
var root_126 = from_html(`
        <div class="space-y-2">
          <!>
        </div>

        <!-- Pagination Controls -->
        <!>
      `, 1);
var root_46 = from_html(`
    <!-- Active Runs Section -->
    <section class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <h2 class="text-lg font-semibold text-slate-700">Active Runs</h2>
        <!>
      </div>

      <!>
    </section>

    <!-- Previous Executions Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-slate-700">Previous Executions</h2>
          <!>
        </div>
        <!>
      </div>

      <!>
    </section>
  `, 1);
var root14 = from_html(`

<div class="max-w-4xl">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Executions</h1>
      <p class="text-slate-500 mt-1">Monitor active runs and view execution history</p>
    </div>
  </div>

  <!>
</div>`, 1);
function RunningExecutions($$anchor, $$props) {
  push($$props, true);
  let activeExecutions = state(proxy([]));
  let historyPage = state(null);
  let currentPage = state(1);
  let loading = state(true);
  let historyLoading = state(false);
  let error = state(null);
  async function fetchActiveExecutions() {
    try {
      const res = await fetch("/api/executions/running");
      if (!res.ok)
        throw new Error("Failed to fetch executions");
      const data = await res.json();
      set(activeExecutions, data.executions, true);
      set(error, null);
    } catch (e) {
      set(error, e instanceof Error ? e.message : "Unknown error", true);
    } finally {
      set(loading, false);
    }
  }
  async function fetchHistory(page = 1) {
    set(historyLoading, true);
    try {
      const res = await fetch(`/api/executions/history?page=${page}&pageSize=20`);
      if (!res.ok)
        throw new Error("Failed to fetch history");
      set(historyPage, await res.json(), true);
      set(currentPage, page, true);
    } catch (e) {
      console.error("Failed to fetch history:", e);
    } finally {
      set(historyLoading, false);
    }
  }
  user_effect(() => {
    fetchActiveExecutions();
    fetchHistory(1);
    const interval = setInterval(fetchActiveExecutions, 2000);
    return () => clearInterval(interval);
  });
  function handleExecutionClick(execution) {
    $$props.navigate(`/executions/${execution.id}`);
  }
  function handleHistoryClick(record) {
    $$props.navigate(`/executions/${record.id}`);
  }
  function goToPage(page) {
    if (page >= 1 && get(historyPage) && page <= get(historyPage).totalPages) {
      fetchHistory(page);
    }
  }
  function formatDuration(ms) {
    if (ms < 1000)
      return `${ms}ms`;
    if (ms < 60000)
      return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms % 60000 / 1000);
    return `${minutes}m ${seconds}s`;
  }
  function formatCost(cost) {
    return `$${cost.toFixed(4)}`;
  }
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now2 = new Date;
    const diffMs = now2.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
      return "Just now";
    if (diffMins < 60)
      return `${diffMins}m ago`;
    if (diffHours < 24)
      return `${diffHours}h ago`;
    if (diffDays < 7)
      return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
  next();
  var fragment = root14();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div), 3);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_118();
      next(2);
      append($$anchor2, fragment_1);
    };
    var alternate_3 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_1 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_39();
          var div_1 = sibling(first_child(fragment_3));
          var p_1 = sibling(child(div_1), 3);
          var text2 = child(p_1, true);
          reset(p_1);
          next();
          reset(div_1);
          next();
          template_effect(() => set_text(text2, get(error)));
          append($$anchor3, fragment_3);
        };
        var alternate_2 = ($$anchor3) => {
          var fragment_4 = root_46();
          var node_2 = sibling(first_child(fragment_4));
          var section = sibling(node_2, 2);
          var div_2 = sibling(child(section));
          var node_3 = sibling(child(div_2), 5);
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_5 = root_59();
              var span = sibling(first_child(fragment_5));
              var text_1 = child(span);
              reset(span);
              next();
              template_effect(() => set_text(text_1, `(${get(activeExecutions).length ?? ""})`));
              append($$anchor4, fragment_5);
            };
            if_block(node_3, ($$render) => {
              if (get(activeExecutions).length > 0)
                $$render(consequent_2);
            });
          }
          next();
          reset(div_2);
          var node_4 = sibling(div_2, 2);
          {
            var consequent_3 = ($$anchor4) => {
              var fragment_6 = root_68();
              next(2);
              append($$anchor4, fragment_6);
            };
            var alternate = ($$anchor4) => {
              var fragment_7 = root_76();
              var div_3 = sibling(first_child(fragment_7));
              var node_5 = sibling(child(div_3));
              each(node_5, 17, () => get(activeExecutions), (execution) => execution.id, ($$anchor5, execution) => {
                next();
                var fragment_8 = root_86();
                var node_6 = sibling(first_child(fragment_8));
                ExecutionCard_default(node_6, {
                  get execution() {
                    return get(execution);
                  },
                  onselect: () => handleExecutionClick(get(execution))
                });
                next();
                append($$anchor5, fragment_8);
              });
              next();
              reset(div_3);
              next();
              append($$anchor4, fragment_7);
            };
            if_block(node_4, ($$render) => {
              if (get(activeExecutions).length === 0)
                $$render(consequent_3);
              else
                $$render(alternate, false);
            });
          }
          next();
          reset(section);
          var node_7 = sibling(section, 2);
          var section_1 = sibling(node_7, 2);
          var div_4 = sibling(child(section_1));
          var div_5 = sibling(child(div_4));
          var node_8 = sibling(child(div_5), 3);
          {
            var consequent_4 = ($$anchor4) => {
              var fragment_9 = root_95();
              var span_1 = sibling(first_child(fragment_9));
              var text_2 = child(span_1);
              reset(span_1);
              next();
              template_effect(() => set_text(text_2, `(${get(historyPage).total ?? ""} total)`));
              append($$anchor4, fragment_9);
            };
            if_block(node_8, ($$render) => {
              if (get(historyPage))
                $$render(consequent_4);
            });
          }
          next();
          reset(div_5);
          var node_9 = sibling(div_5, 2);
          {
            var consequent_5 = ($$anchor4) => {
              var fragment_10 = root_104();
              next(2);
              append($$anchor4, fragment_10);
            };
            if_block(node_9, ($$render) => {
              if (get(historyLoading))
                $$render(consequent_5);
            });
          }
          next();
          reset(div_4);
          var node_10 = sibling(div_4, 2);
          {
            var consequent_6 = ($$anchor4) => {
              var fragment_11 = root_115();
              next(2);
              append($$anchor4, fragment_11);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment_12 = root_126();
              var div_6 = sibling(first_child(fragment_12));
              var node_11 = sibling(child(div_6));
              each(node_11, 17, () => get(historyPage).executions, (record) => record.id, ($$anchor5, record) => {
                next();
                var fragment_13 = root_134();
                var node_12 = sibling(first_child(fragment_13));
                HistoryCard_default(node_12, {
                  get record() {
                    return get(record);
                  },
                  formatDuration,
                  formatCost,
                  formatTime,
                  onclick: () => handleHistoryClick(get(record))
                });
                next();
                append($$anchor5, fragment_13);
              });
              next();
              reset(div_6);
              var node_13 = sibling(div_6, 2);
              var node_14 = sibling(node_13, 2);
              {
                var consequent_7 = ($$anchor5) => {
                  var fragment_14 = root_144();
                  var div_7 = sibling(first_child(fragment_14));
                  var div_8 = sibling(child(div_7));
                  var text_3 = child(div_8);
                  reset(div_8);
                  var div_9 = sibling(div_8, 2);
                  var button = sibling(child(div_9));
                  button.__click = () => goToPage(1);
                  var button_1 = sibling(button, 2);
                  button_1.__click = () => goToPage(get(currentPage) - 1);
                  var div_10 = sibling(button_1, 2);
                  var node_15 = sibling(child(div_10));
                  each(node_15, 17, () => Array.from({ length: Math.min(5, get(historyPage).totalPages) }, (_, i) => {
                    const start = Math.max(1, Math.min(get(currentPage) - 2, get(historyPage).totalPages - 4));
                    return start + i;
                  }).filter((p) => p <= get(historyPage).totalPages), index, ($$anchor6, pageNum) => {
                    next();
                    var fragment_15 = root_155();
                    var button_2 = sibling(first_child(fragment_15));
                    button_2.__click = () => goToPage(get(pageNum));
                    var text_4 = child(button_2);
                    reset(button_2);
                    next();
                    template_effect(() => {
                      set_class(button_2, 1, `w-8 h-8 text-sm rounded-lg transition-colors cursor-pointer ${get(pageNum) === get(currentPage) ? "bg-blue-500 text-white" : "border border-slate-200 hover:bg-slate-50"}`);
                      set_text(text_4, `
                    ${get(pageNum) ?? ""}
                  `);
                    });
                    append($$anchor6, fragment_15);
                  });
                  next();
                  reset(div_10);
                  var button_3 = sibling(div_10, 2);
                  button_3.__click = () => goToPage(get(currentPage) + 1);
                  var button_4 = sibling(button_3, 2);
                  button_4.__click = () => goToPage(get(historyPage).totalPages);
                  next();
                  reset(div_9);
                  next();
                  reset(div_7);
                  next();
                  template_effect(() => {
                    set_text(text_3, `
              Page ${get(historyPage).page ?? ""} of ${get(historyPage).totalPages ?? ""}
            `);
                    button.disabled = get(currentPage) === 1;
                    button_1.disabled = get(currentPage) === 1;
                    button_3.disabled = get(currentPage) === get(historyPage).totalPages;
                    button_4.disabled = get(currentPage) === get(historyPage).totalPages;
                  });
                  append($$anchor5, fragment_14);
                };
                if_block(node_14, ($$render) => {
                  if (get(historyPage).totalPages > 1)
                    $$render(consequent_7);
                });
              }
              next();
              append($$anchor4, fragment_12);
            };
            if_block(node_10, ($$render) => {
              if (!get(historyPage) || get(historyPage).executions.length === 0)
                $$render(consequent_6);
              else
                $$render(alternate_1, false);
            });
          }
          next();
          reset(section_1);
          next();
          append($$anchor3, fragment_4);
        };
        if_block(node_1, ($$render) => {
          if (get(error))
            $$render(consequent_1);
          else
            $$render(alternate_2, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if (get(loading))
        $$render(consequent);
      else
        $$render(alternate_3, false);
    });
  }
  next();
  reset(div);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var RunningExecutions_default = RunningExecutions;
delegate(["click"]);

// web/components/execution/ExecutionDetail.svelte
var root_119 = from_html(`
      <span> </span>
    `, 1);
var root_211 = from_html(`
    <div class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3 text-slate-500">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading execution...</span>
      </div>
    </div>
  `, 1);
var root_47 = from_html(`
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div class="text-4xl mb-4">\uD83D\uDE15</div>
      <p class="font-medium text-red-700 mb-2">Execution Not Found</p>
      <p class="text-red-600 text-sm mb-4"> </p>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
        <span>Back to Running Executions</span>
      </button>
    </div>
  `, 1);
var root_77 = from_html(`
            <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span class="text-blue-600 font-medium">Live</span>
          `, 1);
var root_96 = from_html(`
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <span class="text-green-600 font-medium">Complete</span>
          `, 1);
var root_1110 = from_html(`
            <span class="w-2 h-2 bg-red-500 rounded-full"></span>
            <span class="text-red-600 font-medium">Failed</span>
          `, 1);
var root_127 = from_html(`
            <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span class="text-yellow-600 font-medium">Cancelled</span>
          `, 1);
var root_145 = from_html(`
          <span class="text-xs text-blue-600 flex items-center gap-1">
            <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Connecting...
          </span>
        `, 1);
var root_163 = from_html(`
          <span class="text-xs text-green-600 flex items-center gap-1">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            Live Updates
          </span>
        `, 1);
var root_175 = from_html(`
          <span class="text-xs text-slate-400 flex items-center gap-1">
            <span class="w-2 h-2 bg-slate-300 rounded-full"></span>
            Disconnected
          </span>
        `, 1);
var root_135 = from_html(`
      <div class="flex items-center justify-end gap-2 mb-2">
        <!>
      </div>
    `, 1);
var root_184 = from_html(`
          <span class="text-xs text-slate-400">Click a stage to view output</span>
        `, 1);
var root_195 = from_html(`
        <div class="bg-slate-50 rounded-lg p-6 text-center">
          <div class="text-slate-400 text-3xl mb-2">\uD83D\uDCDC</div>
          <p class="text-sm text-slate-600 mb-1">Historical Record</p>
          <p class="text-xs text-slate-500">
            Stage details are not available for historical executions.
            Only the summary is preserved.
          </p>
        </div>
      `, 1);
var root_212 = from_html(`
        <div class="bg-slate-50 rounded-lg p-6 text-center">
          <div class="text-slate-400">Waiting for stages...</div>
        </div>
      `, 1);
var root_234 = from_html(`
            <!>
          `, 1);
var root_224 = from_html(`
        <div class="space-y-2">
          <!>
        </div>
      `, 1);
var root_244 = from_html(`
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-3">
          <span class="text-2xl">\uD83C\uDF89</span>
          <div class="flex-1">
            <h3 class="font-semibold text-purple-800">Pipeline Auto-Saved!</h3>
            <p class="text-purple-600 text-sm">
              Your generated pipeline has been saved to:
              <code class="bg-purple-100 px-2 py-0.5 rounded font-mono text-purple-700"> </code>
            </p>
          </div>
          <button class="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium cursor-pointer">
            View Pipeline
          </button>
        </div>
      </div>
    `, 1);
var root_262 = from_html(`
            <div class="prose prose-slate max-w-none">
              <pre class="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 bg-slate-50 rounded-lg p-4 max-h-[32rem] overflow-y-auto"> </pre>
            </div>
          `, 1);
var root_282 = from_html(`
            <pre class="text-sm bg-slate-800 text-slate-100 rounded-lg p-4 overflow-x-auto max-h-[32rem] overflow-y-auto font-mono"> </pre>
          `, 1);
var root_292 = from_html(`
            <pre class="text-sm text-slate-700 whitespace-pre-wrap break-words bg-slate-50 rounded-lg p-4 max-h-[32rem] overflow-y-auto font-mono"> </pre>
          `, 1);
var root_252 = from_html(`
      <div class="bg-white rounded-xl border border-slate-200 mb-6 overflow-hidden">
        <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
          <div class="flex items-center gap-2">
            <span class="text-green-600 text-lg">✨</span>
            <h3 class="font-semibold text-slate-800"> </h3>
          </div>
          <button class="text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
          </button>
        </div>
        <div class="p-4">
          <!>
        </div>
      </div>
    `, 1);
var root_31 = from_html(`
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-slate-50 rounded-lg p-3">
              <div class="text-xs text-slate-500">Duration</div>
              <div class="font-medium"> </div>
            </div>
            <div class="bg-slate-50 rounded-lg p-3">
              <div class="text-xs text-slate-500">Total Cost</div>
              <div class="font-medium"> </div>
            </div>
            <div class="bg-slate-50 rounded-lg p-3">
              <div class="text-xs text-slate-500">Stages</div>
              <div class="font-medium"> </div>
            </div>
          </div>
        `, 1);
var root_322 = from_html(`
          <div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="text-xs font-medium text-red-500 mb-1">Error</div>
            <div class="text-sm text-red-700"> </div>
          </div>
        `, 1);
var root_30 = from_html(`
      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h3 class="text-sm font-medium text-slate-700 mb-3">Execution Summary</h3>

        <!>

        <!>
      </div>
    `, 1);
var root_332 = from_html(`
        <button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
          Cancel Execution
        </button>
      `, 1);
var root_69 = from_html(`
    <!-- Summary Cards -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Elapsed Time</div>
        <div class="text-lg font-semibold text-slate-800"> </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Progress</div>
        <div class="text-lg font-semibold text-slate-800"> </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Total Cost</div>
        <div class="text-lg font-semibold text-slate-800"> </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Status</div>
        <div class="flex items-center gap-2">
          <!>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <h3 class="text-sm font-medium text-slate-700 mb-2">Input</h3>
      <pre class="text-sm text-slate-600 whitespace-pre-wrap break-words bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto"> </pre>
    </div>

    <!-- WebSocket Status -->
    <!>

    <!-- Stages -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-slate-700">Stages</h3>
        <!>
      </div>
      <!>
    </div>

    <!-- Saved Pipeline Notice -->
    <!>

    <!-- Final Output - Main Result -->
    <!>

    <!-- Result Summary -->
    <!>

    <!-- Actions -->
    <div class="flex gap-3">
      <button class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
        View Pipeline
      </button>
      <!>
    </div>
  `, 1);
var root15 = from_html(`

<div class="max-w-4xl">
  <!-- Header -->
  <div class="flex items-center gap-4 mb-6">
    <button class="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" title="Back to Running Executions">
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    <div class="flex-1">
      <h1 class="text-2xl font-bold text-slate-800"> </h1>
      <p class="text-slate-500 text-sm mt-1"> </p>
    </div>
    <!>
  </div>

  <!>
</div>`, 1);
function ExecutionDetail($$anchor, $$props) {
  push($$props, true);
  let execution = state(null);
  let loading = state(true);
  let error = state(null);
  let wsStatus = state("disconnected");
  let expandedStages = state(proxy(new Set));
  function toggleStage(stageId) {
    const newSet = new Set(get(expandedStages));
    if (newSet.has(stageId)) {
      newSet.delete(stageId);
    } else {
      newSet.add(stageId);
    }
    set(expandedStages, newSet, true);
  }
  function autoExpandStage(stageId) {
    if (!get(expandedStages).has(stageId)) {
      const newSet = new Set(get(expandedStages));
      newSet.add(stageId);
      set(expandedStages, newSet, true);
    }
  }
  async function fetchExecution() {
    try {
      const res = await fetch(`/api/executions/${$$props.executionId}`);
      if (!res.ok) {
        if (res.status === 404) {
          set(error, "Execution not found. It may have expired or been cleaned up.");
        } else {
          throw new Error("Failed to fetch execution");
        }
        return;
      }
      const data = await res.json();
      set(execution, data, true);
      set(error, null);
      if (data.stages) {
        const toExpand = new Set;
        for (const stage of data.stages) {
          if (stage.status === "running" || stage.output) {
            toExpand.add(stage.id);
          }
        }
        if (toExpand.size > 0) {
          set(expandedStages, toExpand, true);
        }
      }
    } catch (e) {
      set(error, e instanceof Error ? e.message : "Unknown error", true);
    } finally {
      set(loading, false);
    }
  }
  user_effect(() => {
    fetchExecution();
  });
  user_effect(() => {
    if (!get(execution) || get(execution).status !== "running" || get(execution).isHistorical)
      return;
    set(wsStatus, "connecting");
    const ws = new WebSocket(`ws://${location.host}/ws`);
    ws.onopen = () => {
      set(wsStatus, "connected");
      ws.send(JSON.stringify({ type: "subscribe", executionId: $$props.executionId }));
    };
    ws.onmessage = (event2) => {
      const data = JSON.parse(event2.data);
      if (data.type === "stage:started" && get(execution)) {
        const stageIndex = get(execution).stages.findIndex((s) => s.id === data.stage.id);
        if (stageIndex >= 0) {
          get(execution).stages[stageIndex] = { ...get(execution).stages[stageIndex], status: "running" };
          get(execution).currentStage = data.index + 1;
          autoExpandStage(data.stage.id);
        }
      }
      if (data.type === "stage:completed" && get(execution)) {
        const stageIndex = get(execution).stages.findIndex((s) => s.id === data.stage.id);
        if (stageIndex >= 0) {
          get(execution).stages[stageIndex] = {
            ...get(execution).stages[stageIndex],
            status: "completed",
            duration: data.result?.duration,
            cost: data.result?.cost
          };
        }
      }
      if (data.type === "stage:skipped" && get(execution)) {
        const stageIndex = get(execution).stages.findIndex((s) => s.id === data.stage.id);
        if (stageIndex >= 0) {
          get(execution).stages[stageIndex] = { ...get(execution).stages[stageIndex], status: "skipped" };
        }
      }
      if (data.type === "stage:failed" && get(execution)) {
        const stageIndex = get(execution).stages.findIndex((s) => s.id === data.stage.id);
        if (stageIndex >= 0) {
          get(execution).stages[stageIndex] = {
            ...get(execution).stages[stageIndex],
            status: "failed",
            error: data.error
          };
        }
      }
      if (data.type === "stage:output" && get(execution)) {
        const stageIndex = get(execution).stages.findIndex((s) => s.id === data.stageId);
        if (stageIndex >= 0) {
          get(execution).stages[stageIndex] = { ...get(execution).stages[stageIndex], output: data.output };
          autoExpandStage(data.stageId);
        }
      }
      if ((data.type === "execution:completed" || data.type === "execution:failed") && get(execution)) {
        get(execution).status = data.result?.status === "success" ? "completed" : data.result?.status === "cancelled" ? "cancelled" : data.result?.status === "failed" ? "failed" : "completed";
        get(execution).result = data.result;
        ws.close();
        set(wsStatus, "disconnected");
      }
      if (data.type === "execution:cancelled" && get(execution)) {
        get(execution).status = "cancelled";
        ws.close();
        set(wsStatus, "disconnected");
      }
    };
    ws.onerror = () => {
      set(wsStatus, "disconnected");
    };
    ws.onclose = () => {
      set(wsStatus, "disconnected");
    };
    return () => {
      ws.close();
    };
  });
  function formatDuration(ms) {
    if (ms < 1000)
      return `${ms}ms`;
    if (ms < 60000)
      return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms % 60000 / 1000);
    return `${minutes}m ${seconds}s`;
  }
  function formatCost(cost) {
    return `$${cost.toFixed(4)}`;
  }
  function formatOutput(output) {
    if (!output)
      return "";
    if (typeof output === "object") {
      return JSON.stringify(output, null, 2);
    }
    if (typeof output === "string") {
      try {
        const parsed = JSON.parse(output);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return output;
      }
    }
    return String(output);
  }
  function getFinalOutput(output) {
    if (!output || typeof output !== "object")
      return null;
    const out = output;
    if (out._extractedFinalOutput) {
      const extracted = out._extractedFinalOutput;
      return extracted;
    }
    const finalizeStage = out["stage-6-finalize"];
    if (finalizeStage?.optimizedPrompt) {
      return {
        type: "text",
        content: String(finalizeStage.optimizedPrompt),
        label: "Optimized Prompt"
      };
    }
    if (out.optimizedPrompt) {
      return {
        type: "text",
        content: String(out.optimizedPrompt),
        label: "Optimized Prompt"
      };
    }
    if (out.refinedPrompt) {
      return {
        type: "text",
        content: String(out.refinedPrompt),
        label: "Refined Prompt"
      };
    }
    if (out.enhancedPrompt) {
      return {
        type: "text",
        content: String(out.enhancedPrompt),
        label: "Enhanced Prompt"
      };
    }
    if (out.generatedCode) {
      return {
        type: "code",
        content: String(out.generatedCode),
        label: "Generated Code"
      };
    }
    const generateStage = out["stage-3-generate"];
    if (generateStage?.pipelineConfig) {
      return {
        type: "code",
        content: JSON.stringify(generateStage.pipelineConfig, null, 2),
        label: "Generated Pipeline"
      };
    }
    return {
      type: "json",
      content: JSON.stringify(output, null, 2),
      label: "Output"
    };
  }
  function formatElapsed(startTime) {
    const elapsed2 = Date.now() - startTime;
    return formatDuration(elapsed2);
  }
  function getStatusColor() {
    if (!get(execution))
      return "";
    switch (get(execution).status) {
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "cancelled":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  }
  let totalCost = user_derived(() => get(execution)?.result?.summary?.totalCost || get(execution)?.stages.reduce((sum, s) => sum + (s.cost || 0), 0) || 0);
  let finalOutput = user_derived(() => get(execution)?.result?.output ? getFinalOutput(get(execution).result.output) : null);
  let elapsed = state("");
  user_effect(() => {
    if (!get(execution))
      return;
    if (get(execution).isHistorical && get(execution).result?.summary?.totalDuration) {
      set(elapsed, formatDuration(get(execution).result.summary.totalDuration), true);
      return;
    }
    set(elapsed, formatElapsed(get(execution).startTime), true);
    if (get(execution).status !== "running")
      return;
    const interval = setInterval(() => {
      set(elapsed, formatElapsed(get(execution).startTime), true);
    }, 1000);
    return () => clearInterval(interval);
  });
  next();
  var fragment = root15();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div));
  var div_1 = sibling(node, 2);
  var button = sibling(child(div_1));
  button.__click = () => $$props.navigate("/running");
  var div_2 = sibling(button, 2);
  var h1 = sibling(child(div_2));
  var text2 = child(h1);
  reset(h1);
  var p = sibling(h1, 2);
  var text_1 = child(p);
  reset(p);
  next();
  reset(div_2);
  var node_1 = sibling(div_2, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_119();
      var span = sibling(first_child(fragment_1));
      var text_2 = child(span);
      reset(span);
      next();
      template_effect(($0) => {
        set_class(span, 1, `px-3 py-1 rounded-full text-sm font-medium border ${$0 ?? ""}`);
        set_text(text_2, `
        ${get(execution).status ?? ""}
      `);
      }, [getStatusColor]);
      append($$anchor2, fragment_1);
    };
    if_block(node_1, ($$render) => {
      if (get(execution))
        $$render(consequent);
    });
  }
  next();
  reset(div_1);
  var node_2 = sibling(div_1, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_2 = root_211();
      next(2);
      append($$anchor2, fragment_2);
    };
    var alternate_10 = ($$anchor2) => {
      var fragment_3 = comment();
      var node_3 = first_child(fragment_3);
      {
        var consequent_2 = ($$anchor3) => {
          var fragment_4 = root_47();
          var div_3 = sibling(first_child(fragment_4));
          var p_1 = sibling(child(div_3), 5);
          var text_3 = child(p_1, true);
          reset(p_1);
          var button_1 = sibling(p_1, 2);
          button_1.__click = () => $$props.navigate("/running");
          next();
          reset(div_3);
          next();
          template_effect(() => set_text(text_3, get(error)));
          append($$anchor3, fragment_4);
        };
        var alternate_9 = ($$anchor3) => {
          var fragment_5 = comment();
          var node_4 = first_child(fragment_5);
          {
            var consequent_20 = ($$anchor4) => {
              var fragment_6 = root_69();
              var node_5 = sibling(first_child(fragment_6));
              var div_4 = sibling(node_5, 2);
              var div_5 = sibling(child(div_4));
              var div_6 = sibling(child(div_5), 3);
              var text_4 = child(div_6, true);
              reset(div_6);
              next();
              reset(div_5);
              var div_7 = sibling(div_5, 2);
              var div_8 = sibling(child(div_7), 3);
              var text_5 = child(div_8);
              reset(div_8);
              next();
              reset(div_7);
              var div_9 = sibling(div_7, 2);
              var div_10 = sibling(child(div_9), 3);
              var text_6 = child(div_10, true);
              reset(div_10);
              next();
              reset(div_9);
              var div_11 = sibling(div_9, 2);
              var div_12 = sibling(child(div_11), 3);
              var node_6 = sibling(child(div_12));
              {
                var consequent_3 = ($$anchor5) => {
                  var fragment_7 = root_77();
                  next(4);
                  append($$anchor5, fragment_7);
                };
                var alternate_2 = ($$anchor5) => {
                  var fragment_8 = comment();
                  var node_7 = first_child(fragment_8);
                  {
                    var consequent_4 = ($$anchor6) => {
                      var fragment_9 = root_96();
                      next(4);
                      append($$anchor6, fragment_9);
                    };
                    var alternate_1 = ($$anchor6) => {
                      var fragment_10 = comment();
                      var node_8 = first_child(fragment_10);
                      {
                        var consequent_5 = ($$anchor7) => {
                          var fragment_11 = root_1110();
                          next(4);
                          append($$anchor7, fragment_11);
                        };
                        var alternate = ($$anchor7) => {
                          var fragment_12 = root_127();
                          next(4);
                          append($$anchor7, fragment_12);
                        };
                        if_block(node_8, ($$render) => {
                          if (get(execution).status === "failed")
                            $$render(consequent_5);
                          else
                            $$render(alternate, false);
                        }, true);
                      }
                      append($$anchor6, fragment_10);
                    };
                    if_block(node_7, ($$render) => {
                      if (get(execution).status === "completed")
                        $$render(consequent_4);
                      else
                        $$render(alternate_1, false);
                    }, true);
                  }
                  append($$anchor5, fragment_8);
                };
                if_block(node_6, ($$render) => {
                  if (get(execution).status === "running")
                    $$render(consequent_3);
                  else
                    $$render(alternate_2, false);
                });
              }
              next();
              reset(div_12);
              next();
              reset(div_11);
              next();
              reset(div_4);
              var node_9 = sibling(div_4, 2);
              var div_13 = sibling(node_9, 2);
              var pre = sibling(child(div_13), 3);
              var text_7 = child(pre, true);
              reset(pre);
              next();
              reset(div_13);
              var node_10 = sibling(div_13, 2);
              var node_11 = sibling(node_10, 2);
              {
                var consequent_8 = ($$anchor5) => {
                  var fragment_13 = root_135();
                  var div_14 = sibling(first_child(fragment_13));
                  var node_12 = sibling(child(div_14));
                  {
                    var consequent_6 = ($$anchor6) => {
                      var fragment_14 = root_145();
                      next(2);
                      append($$anchor6, fragment_14);
                    };
                    var alternate_4 = ($$anchor6) => {
                      var fragment_15 = comment();
                      var node_13 = first_child(fragment_15);
                      {
                        var consequent_7 = ($$anchor7) => {
                          var fragment_16 = root_163();
                          next(2);
                          append($$anchor7, fragment_16);
                        };
                        var alternate_3 = ($$anchor7) => {
                          var fragment_17 = root_175();
                          next(2);
                          append($$anchor7, fragment_17);
                        };
                        if_block(node_13, ($$render) => {
                          if (get(wsStatus) === "connected")
                            $$render(consequent_7);
                          else
                            $$render(alternate_3, false);
                        }, true);
                      }
                      append($$anchor6, fragment_15);
                    };
                    if_block(node_12, ($$render) => {
                      if (get(wsStatus) === "connecting")
                        $$render(consequent_6);
                      else
                        $$render(alternate_4, false);
                    });
                  }
                  next();
                  reset(div_14);
                  next();
                  append($$anchor5, fragment_13);
                };
                if_block(node_11, ($$render) => {
                  if (get(execution).status === "running")
                    $$render(consequent_8);
                });
              }
              var node_14 = sibling(node_11, 2);
              var div_15 = sibling(node_14, 2);
              var div_16 = sibling(child(div_15));
              var node_15 = sibling(child(div_16), 3);
              {
                var consequent_9 = ($$anchor5) => {
                  var fragment_18 = root_184();
                  next(2);
                  append($$anchor5, fragment_18);
                };
                if_block(node_15, ($$render) => {
                  if (!get(execution).isHistorical && get(execution).stages.length > 0)
                    $$render(consequent_9);
                });
              }
              next();
              reset(div_16);
              var node_16 = sibling(div_16, 2);
              {
                var consequent_10 = ($$anchor5) => {
                  var fragment_19 = root_195();
                  next(2);
                  append($$anchor5, fragment_19);
                };
                var alternate_6 = ($$anchor5) => {
                  var fragment_20 = comment();
                  var node_17 = first_child(fragment_20);
                  {
                    var consequent_11 = ($$anchor6) => {
                      var fragment_21 = root_212();
                      next(2);
                      append($$anchor6, fragment_21);
                    };
                    var alternate_5 = ($$anchor6) => {
                      var fragment_22 = root_224();
                      var div_17 = sibling(first_child(fragment_22));
                      var node_18 = sibling(child(div_17));
                      each(node_18, 17, () => get(execution).stages, index, ($$anchor7, stage, index2) => {
                        next();
                        var fragment_23 = root_234();
                        var node_19 = sibling(first_child(fragment_23));
                        {
                          let $0 = user_derived(() => get(expandedStages).has(get(stage).id));
                          StageStatus_default(node_19, {
                            get stage() {
                              return get(stage);
                            },
                            index: index2,
                            get expanded() {
                              return get($0);
                            },
                            onToggle: () => toggleStage(get(stage).id)
                          });
                        }
                        next();
                        append($$anchor7, fragment_23);
                      });
                      next();
                      reset(div_17);
                      next();
                      append($$anchor6, fragment_22);
                    };
                    if_block(node_17, ($$render) => {
                      if (get(execution).stages.length === 0)
                        $$render(consequent_11);
                      else
                        $$render(alternate_5, false);
                    }, true);
                  }
                  append($$anchor5, fragment_20);
                };
                if_block(node_16, ($$render) => {
                  if (get(execution).isHistorical)
                    $$render(consequent_10);
                  else
                    $$render(alternate_6, false);
                });
              }
              next();
              reset(div_15);
              var node_20 = sibling(div_15, 2);
              var node_21 = sibling(node_20, 2);
              {
                var consequent_12 = ($$anchor5) => {
                  var fragment_24 = root_244();
                  var div_18 = sibling(first_child(fragment_24));
                  var div_19 = sibling(child(div_18));
                  var div_20 = sibling(child(div_19), 3);
                  var p_2 = sibling(child(div_20), 3);
                  var code = sibling(child(p_2));
                  var text_8 = child(code);
                  reset(code);
                  next();
                  reset(p_2);
                  next();
                  reset(div_20);
                  var button_2 = sibling(div_20, 2);
                  button_2.__click = () => $$props.navigate(`/pipelines/${get(execution).result.savedPipeline.filename.replace(".ts", "")}`);
                  next();
                  reset(div_19);
                  next();
                  reset(div_18);
                  next();
                  template_effect(() => set_text(text_8, `
                pipelines/${get(execution).result.savedPipeline.filename ?? ""}
              `));
                  append($$anchor5, fragment_24);
                };
                if_block(node_21, ($$render) => {
                  if (get(execution).result?.savedPipeline)
                    $$render(consequent_12);
                });
              }
              var node_22 = sibling(node_21, 2);
              var node_23 = sibling(node_22, 2);
              {
                var consequent_15 = ($$anchor5) => {
                  var fragment_25 = root_252();
                  var div_21 = sibling(first_child(fragment_25));
                  var div_22 = sibling(child(div_21));
                  var div_23 = sibling(child(div_22));
                  var h3 = sibling(child(div_23), 3);
                  var text_9 = child(h3, true);
                  reset(h3);
                  next();
                  reset(div_23);
                  var button_3 = sibling(div_23, 2);
                  button_3.__click = () => {
                    navigator.clipboard.writeText(get(finalOutput).content);
                  };
                  next();
                  reset(div_22);
                  var div_24 = sibling(div_22, 2);
                  var node_24 = sibling(child(div_24));
                  {
                    var consequent_13 = ($$anchor6) => {
                      var fragment_26 = root_262();
                      var div_25 = sibling(first_child(fragment_26));
                      var pre_1 = sibling(child(div_25));
                      var text_10 = child(pre_1, true);
                      reset(pre_1);
                      next();
                      reset(div_25);
                      next();
                      template_effect(() => set_text(text_10, get(finalOutput).content));
                      append($$anchor6, fragment_26);
                    };
                    var alternate_8 = ($$anchor6) => {
                      var fragment_27 = comment();
                      var node_25 = first_child(fragment_27);
                      {
                        var consequent_14 = ($$anchor7) => {
                          var fragment_28 = root_282();
                          var pre_2 = sibling(first_child(fragment_28));
                          var text_11 = child(pre_2, true);
                          reset(pre_2);
                          next();
                          template_effect(() => set_text(text_11, get(finalOutput).content));
                          append($$anchor7, fragment_28);
                        };
                        var alternate_7 = ($$anchor7) => {
                          var fragment_29 = root_292();
                          var pre_3 = sibling(first_child(fragment_29));
                          var text_12 = child(pre_3, true);
                          reset(pre_3);
                          next();
                          template_effect(() => set_text(text_12, get(finalOutput).content));
                          append($$anchor7, fragment_29);
                        };
                        if_block(node_25, ($$render) => {
                          if (get(finalOutput).type === "code")
                            $$render(consequent_14);
                          else
                            $$render(alternate_7, false);
                        }, true);
                      }
                      append($$anchor6, fragment_27);
                    };
                    if_block(node_24, ($$render) => {
                      if (get(finalOutput).type === "text")
                        $$render(consequent_13);
                      else
                        $$render(alternate_8, false);
                    });
                  }
                  next();
                  reset(div_24);
                  next();
                  reset(div_21);
                  next();
                  template_effect(() => set_text(text_9, get(finalOutput).label));
                  append($$anchor5, fragment_25);
                };
                if_block(node_23, ($$render) => {
                  if (get(finalOutput))
                    $$render(consequent_15);
                });
              }
              var node_26 = sibling(node_23, 2);
              var node_27 = sibling(node_26, 2);
              {
                var consequent_18 = ($$anchor5) => {
                  var fragment_30 = root_30();
                  var div_26 = sibling(first_child(fragment_30));
                  var node_28 = sibling(child(div_26), 3);
                  {
                    var consequent_16 = ($$anchor6) => {
                      var fragment_31 = root_31();
                      var div_27 = sibling(first_child(fragment_31));
                      var div_28 = sibling(child(div_27));
                      var div_29 = sibling(child(div_28), 3);
                      var text_13 = child(div_29, true);
                      reset(div_29);
                      next();
                      reset(div_28);
                      var div_30 = sibling(div_28, 2);
                      var div_31 = sibling(child(div_30), 3);
                      var text_14 = child(div_31, true);
                      reset(div_31);
                      next();
                      reset(div_30);
                      var div_32 = sibling(div_30, 2);
                      var div_33 = sibling(child(div_32), 3);
                      var text_15 = child(div_33);
                      reset(div_33);
                      next();
                      reset(div_32);
                      next();
                      reset(div_27);
                      next();
                      template_effect(($0, $1) => {
                        set_text(text_13, $0);
                        set_text(text_14, $1);
                        set_text(text_15, `
                ${get(execution).result.summary.stagesRun ?? ""} run,
                ${get(execution).result.summary.stagesSkipped ?? ""} skipped,
                ${get(execution).result.summary.stagesFailed ?? ""} failed
              `);
                      }, [
                        () => formatDuration(get(execution).result.summary.totalDuration),
                        () => formatCost(get(execution).result.summary.totalCost)
                      ]);
                      append($$anchor6, fragment_31);
                    };
                    if_block(node_28, ($$render) => {
                      if (get(execution).result.summary)
                        $$render(consequent_16);
                    });
                  }
                  var node_29 = sibling(node_28, 2);
                  {
                    var consequent_17 = ($$anchor6) => {
                      var fragment_32 = root_322();
                      var div_34 = sibling(first_child(fragment_32));
                      var div_35 = sibling(child(div_34), 3);
                      var text_16 = child(div_35, true);
                      reset(div_35);
                      next();
                      reset(div_34);
                      next();
                      template_effect(() => set_text(text_16, get(execution).result.error));
                      append($$anchor6, fragment_32);
                    };
                    if_block(node_29, ($$render) => {
                      if (get(execution).result.error)
                        $$render(consequent_17);
                    });
                  }
                  next();
                  reset(div_26);
                  next();
                  append($$anchor5, fragment_30);
                };
                if_block(node_27, ($$render) => {
                  if (get(execution).result)
                    $$render(consequent_18);
                });
              }
              var node_30 = sibling(node_27, 2);
              var div_36 = sibling(node_30, 2);
              var button_4 = sibling(child(div_36));
              button_4.__click = () => $$props.navigate(`/pipelines/${get(execution).pipelineId}`);
              var node_31 = sibling(button_4, 2);
              {
                var consequent_19 = ($$anchor5) => {
                  var fragment_33 = root_332();
                  var button_5 = sibling(first_child(fragment_33));
                  button_5.__click = async () => {
                    await fetch(`/api/executions/${$$props.executionId}/cancel`, { method: "POST" });
                  };
                  next();
                  append($$anchor5, fragment_33);
                };
                if_block(node_31, ($$render) => {
                  if (get(execution).status === "running")
                    $$render(consequent_19);
                });
              }
              next();
              reset(div_36);
              next();
              template_effect(($0) => {
                set_text(text_4, get(elapsed));
                set_text(text_5, `
          ${get(execution).currentStage ?? ""}/${get(execution).totalStages ?? ""} stages
        `);
                set_text(text_6, $0);
                set_text(text_7, get(execution).input);
              }, [() => formatCost(get(totalCost))]);
              append($$anchor4, fragment_6);
            };
            if_block(node_4, ($$render) => {
              if (get(execution))
                $$render(consequent_20);
            }, true);
          }
          append($$anchor3, fragment_5);
        };
        if_block(node_3, ($$render) => {
          if (get(error))
            $$render(consequent_2);
          else
            $$render(alternate_9, false);
        }, true);
      }
      append($$anchor2, fragment_3);
    };
    if_block(node_2, ($$render) => {
      if (get(loading))
        $$render(consequent_1);
      else
        $$render(alternate_10, false);
    });
  }
  next();
  reset(div);
  template_effect(() => {
    set_text(text2, `
        ${(get(execution)?.pipelineName || "Execution Details") ?? ""}
      `);
    set_text(text_1, `
        ${$$props.executionId ?? ""}
      `);
  });
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ExecutionDetail_default = ExecutionDetail;
delegate(["click"]);

// web/components/App.svelte
var root_120 = from_html(`
      <!>
    `, 1);
var root_310 = from_html(`
      <!>
    `, 1);
var root_510 = from_html(`
      <!>
    `, 1);
var root_78 = from_html(`
      <!>
    `, 1);
var root_97 = from_html(`
      <!>
    `, 1);
var root_1112 = from_html(`
      <!>
    `, 1);
var root_136 = from_html(`
      <!>
    `, 1);
var root16 = from_html(`

<div class="flex min-h-screen">
  <!>

  <main class="flex-1 ml-64 p-8">
    <!>
  </main>
</div>`, 1);
function App($$anchor, $$props) {
  push($$props, true);
  let currentPath = state(proxy(window.location.pathname));
  function navigate(path) {
    window.history.pushState({}, "", path);
    set(currentPath, path, true);
  }
  user_effect(() => {
    const handlePopState = () => {
      set(currentPath, window.location.pathname, true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });
  function getView() {
    if (get(currentPath) === "/" || get(currentPath) === "")
      return "dashboard";
    if (get(currentPath) === "/pipelines")
      return "pipelines";
    if (get(currentPath).startsWith("/pipelines/"))
      return "pipeline-detail";
    if (get(currentPath) === "/running")
      return "running";
    if (get(currentPath).startsWith("/executions/"))
      return "execution-detail";
    if (get(currentPath) === "/outputs")
      return "outputs";
    if (get(currentPath).startsWith("/outputs/"))
      return "output-detail";
    return "dashboard";
  }
  function getPipelineId() {
    return get(currentPath).replace("/pipelines/", "");
  }
  function getOutputFilename() {
    return get(currentPath).replace("/outputs/", "");
  }
  function getExecutionId() {
    return get(currentPath).replace("/executions/", "");
  }
  let view = user_derived(getView);
  let pipelineId = user_derived(getPipelineId);
  let outputFilename = user_derived(getOutputFilename);
  let executionId = user_derived(getExecutionId);
  next();
  var fragment = root16();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div));
  Sidebar_default(node, {
    get currentPath() {
      return get(currentPath);
    },
    navigate
  });
  var main = sibling(node, 2);
  var node_1 = sibling(child(main));
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_120();
      var node_2 = sibling(first_child(fragment_1));
      Dashboard_default(node_2, { navigate });
      next();
      append($$anchor2, fragment_1);
    };
    var alternate_5 = ($$anchor2) => {
      var fragment_2 = comment();
      var node_3 = first_child(fragment_2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_3 = root_310();
          var node_4 = sibling(first_child(fragment_3));
          PipelineList_default(node_4, { navigate });
          next();
          append($$anchor3, fragment_3);
        };
        var alternate_4 = ($$anchor3) => {
          var fragment_4 = comment();
          var node_5 = first_child(fragment_4);
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_5 = root_510();
              var node_6 = sibling(first_child(fragment_5));
              PipelineDetail_default(node_6, {
                get id() {
                  return get(pipelineId);
                },
                navigate
              });
              next();
              append($$anchor4, fragment_5);
            };
            var alternate_3 = ($$anchor4) => {
              var fragment_6 = comment();
              var node_7 = first_child(fragment_6);
              {
                var consequent_3 = ($$anchor5) => {
                  var fragment_7 = root_78();
                  var node_8 = sibling(first_child(fragment_7));
                  RunningExecutions_default(node_8, { navigate });
                  next();
                  append($$anchor5, fragment_7);
                };
                var alternate_2 = ($$anchor5) => {
                  var fragment_8 = comment();
                  var node_9 = first_child(fragment_8);
                  {
                    var consequent_4 = ($$anchor6) => {
                      var fragment_9 = root_97();
                      var node_10 = sibling(first_child(fragment_9));
                      ExecutionDetail_default(node_10, {
                        get executionId() {
                          return get(executionId);
                        },
                        navigate
                      });
                      next();
                      append($$anchor6, fragment_9);
                    };
                    var alternate_1 = ($$anchor6) => {
                      var fragment_10 = comment();
                      var node_11 = first_child(fragment_10);
                      {
                        var consequent_5 = ($$anchor7) => {
                          var fragment_11 = root_1112();
                          var node_12 = sibling(first_child(fragment_11));
                          OutputList_default(node_12, { navigate });
                          next();
                          append($$anchor7, fragment_11);
                        };
                        var alternate = ($$anchor7) => {
                          var fragment_12 = comment();
                          var node_13 = first_child(fragment_12);
                          {
                            var consequent_6 = ($$anchor8) => {
                              var fragment_13 = root_136();
                              var node_14 = sibling(first_child(fragment_13));
                              OutputDetail_default(node_14, {
                                get filename() {
                                  return get(outputFilename);
                                },
                                navigate
                              });
                              next();
                              append($$anchor8, fragment_13);
                            };
                            if_block(node_13, ($$render) => {
                              if (get(view) === "output-detail")
                                $$render(consequent_6);
                            }, true);
                          }
                          append($$anchor7, fragment_12);
                        };
                        if_block(node_11, ($$render) => {
                          if (get(view) === "outputs")
                            $$render(consequent_5);
                          else
                            $$render(alternate, false);
                        }, true);
                      }
                      append($$anchor6, fragment_10);
                    };
                    if_block(node_9, ($$render) => {
                      if (get(view) === "execution-detail")
                        $$render(consequent_4);
                      else
                        $$render(alternate_1, false);
                    }, true);
                  }
                  append($$anchor5, fragment_8);
                };
                if_block(node_7, ($$render) => {
                  if (get(view) === "running")
                    $$render(consequent_3);
                  else
                    $$render(alternate_2, false);
                }, true);
              }
              append($$anchor4, fragment_6);
            };
            if_block(node_5, ($$render) => {
              if (get(view) === "pipeline-detail")
                $$render(consequent_2);
              else
                $$render(alternate_3, false);
            }, true);
          }
          append($$anchor3, fragment_4);
        };
        if_block(node_3, ($$render) => {
          if (get(view) === "pipelines")
            $$render(consequent_1);
          else
            $$render(alternate_4, false);
        }, true);
      }
      append($$anchor2, fragment_2);
    };
    if_block(node_1, ($$render) => {
      if (get(view) === "dashboard")
        $$render(consequent);
      else
        $$render(alternate_5, false);
    });
  }
  next();
  reset(main);
  next();
  reset(div);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var App_default = App;

// web/app.ts
var target = document.getElementById("app");
if (target) {
  mount(App_default, { target });
}

//# debugId=B1DFEB2A81601EA864756E2164756E21
//# sourceMappingURL=app.js.map
