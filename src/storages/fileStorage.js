const { nanoid } = require('nanoid');
const fs = require('fs');
const glob = require('glob');

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
    return this.get(id);
  }

  toArray() {
    const arr = [];
    glob.sync(`${this.pathPrefix}/*.json`).forEach((file) => {
      arr.push(JSON.parse(fs.readFileSync(`${file}`, 'utf8')));
    });
    return arr;
  }

  delete(id) {
    const deleteFile = this.get(id);
    fs.unlinkSync(`${this.pathPrefix}/${id}.json`);
    return deleteFile;
  }

  get(id) {
    const buff = fs.readFileSync(`${this.pathPrefix}/${id}.json`, 'utf8');
    return JSON.parse(buff);
  }

  change(id, event) {
    fs.writeFileSync(
      `${this.pathPrefix}/${id}.json`,
      JSON.stringify({
        ...event,
      })
    );
  }

  getAsync(id) {
    return new Promise((res, rej) => {
      fs.readFile(`${this.pathPrefix}/${id}.json`, 'utf8', (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(JSON.parse(data));
      });
    });
  }
}

module.exports = {
  FileStorage,
};
