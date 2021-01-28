import {html} from "htl";
import {arrayify} from "./array.js";
import {preventDefault} from "./event.js";
import {defaultStyle, flexStyle, mr2} from "./style.js";

const radioStyle = {...mr2, ...flexStyle};

export function Radio(data, {
  format = d => d,
  label,
  value,
  multiple,
  style = {}
} = {}) {
  multiple = !!multiple;
  if (multiple) value = value === undefined ? [] : arrayify(value);
  const {...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onchange=${onchange} oninput=${oninput} onsubmit=${preventDefault}>${Array.from(data, (d, i) => html`<label style=${radioStyle}><input type=${multiple ? "checkbox" : "radio"} style=${mr2} name="input" value=${i} checked=${multiple ? value.includes(d) : value === d}>${format(d, i, data)}`)}${label ? html.fragment`<span style=${{color: "#aaa", margin: "0 0.5em 0 0"}}>—</span>${label}` : null}</form>`;
  const {input} = form.elements;
  function onchange() {
    form.dispatchEvent(new CustomEvent("input")); // Safari
  }
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    value = multiple
      ? Array.from(input).filter(i => i.checked).map(i => data[i.value])
      : data[input.value];
  }
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      if (multiple) {
        const selection = new Set(v);
        for (const i of input) i.checked = selection.has(data[i.value]);
      } else {
        input.value = data.indexOf(v);
      }
      oninput();
    }
  });
}