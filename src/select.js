import {html} from "htl";
import {createChooser} from "./chooser.js";
import {length} from "./css.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export const Select = createChooser({
  render(data, index, selected, disabled, {format, multiple, size, label, width}) {
    const form = html`<form class=__ns__>
      ${maybeLabel(label)}<select disabled=${disabled === true} style=${{width: length(width)}} multiple=${multiple} size=${size} name=input>
        ${index.map(i => html`<option value=${i} disabled=${typeof disabled === "function" ? disabled(i) : false} selected=${selected(i)}>${stringify(format(data[i], i, data))}`)}
      </select>
    </form>`;
    return [form];
  },
  selectedIndexes(input) {
    return Array.from(input.selectedOptions, i => +i.value);
  },
  select(input, selected) {
    input.selected = selected;
  }
});
