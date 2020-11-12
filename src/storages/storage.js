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
    return true;
  }

  toArray() {
    return Object.values(this._memory);
  }

  delete(id) {
    delete this._memory[id];
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
    return true;
  }
}

module.exports = {
  Storage,
};
