const { nanoid } = require("nanoid");
const fs = require("fs");
const glob = require("glob");

class FileStorage {
  constructor(prefix) {
    this.pathPrefix = prefix;
  }

  add(event) {
    const id = nanoid();
    fs.writeFileSync(
      `${this.pathPrefix}/${id}.json`,
      JSON.stringify({
        id,
        ...event,
      })
    );
  }

  toArray() {
    const arr = [];
    glob.sync(`${this.pathPrefix}/*.json`).forEach((file) => {
      arr.push(JSON.parse(fs.readFileSync(`${file}`, "utf8")));
    });
    return arr;
  }

  delete(id) {
    fs.unlinkSync(`${this.pathPrefix}/${id}.json`);
  }

  get(id) {
    const buff = fs.readFileSync(`${this.pathPrefix}/${id}.json`, "utf8");
    return JSON.parse(buff);
  }

  change(id, event) {
    fs.writeFile(
      `${this.pathPrefix}/${id}.json`,
      JSON.stringify({
        ...event,
      }),
      (err) => {
        if (err) throw err;
        return event;
      }
    );
  }
}

module.exports = {
  FileStorage,
};
