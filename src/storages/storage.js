const { nanoid } = require("nanoid");

class Storage {
  _memory = {};

  add(event) {
    const id = nanoid();
    if (this._memory[id]) {
      return false;
    }
    this._memory[id] = {
      id,
      ...event,
    };
    return this._memory[id];
  }

  toArray() {
    return Object.values(this._memory);
  }

  delete(id) {
    const deleteItem = this._memory[id];
    delete this._memory[id];
    return deleteItem;
  }

  get(id) {
    return this._memory[id];
  }

  change(id, event) {
    if (!this._memory[id]) {
      return false;
    }
    this._memory[id] = {
      id,
      ...event,
    };
    return this._memory[id];
  }
}

module.exports = {
  Storage,
};
