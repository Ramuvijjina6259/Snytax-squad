const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const castBooleans = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const newObj = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === 'true') {
      newObj[key] = true;
    } else if (val === 'false') {
      newObj[key] = false;
    } else if (typeof val === 'object' && val !== null) {
      newObj[key] = castBooleans(val);
    } else {
      newObj[key] = val;
    }
  }
  return newObj;
};

class MockModel {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(dataDir, `${name.toLowerCase()}.json`);
    this.preSaveHooks = [];
    this.methods = {};
  }

  // Read data from file
  _read() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
      return [];
    }
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (err) {
      console.error(`Error reading mock db file for ${this.name}:`, err);
      return [];
    }
  }

  // Write data to file
  _write(data) {
    try {
      const castedData = castBooleans(data);
      fs.writeFileSync(this.filePath, JSON.stringify(castedData, null, 2));
    } catch (err) {
      console.error(`Error writing mock db file for ${this.name}:`, err);
    }
  }

  pre(hookName, fn) {
    if (hookName === 'save') {
      this.preSaveHooks.push(fn);
    }
  }

  // Helper to run pre-save hooks
  async _runPreSave(item) {
    for (const hook of this.preSaveHooks) {
      await hook.call(item, () => {});
    }
    return item;
  }

  // Mock methods mapping
  find(filter = {}) {
    let items = this._read();
    
    // Simple filter matching
    if (filter && Object.keys(filter).length > 0) {
      items = items.filter(item => {
        return Object.keys(filter).every(key => {
          let val = filter[key];
          if ((key === 'email' || key === 'slug') && typeof val === 'string') {
            val = val.toLowerCase();
          }
          if (val && typeof val === 'object') {
            if (val.$regex) {
              const regex = new RegExp(val.$regex, val.$options || '');
              return regex.test(item[key]);
            }
            if (val.$or) {
              return val.$or.some(subFilter => {
                return Object.keys(subFilter).every(subKey => {
                  const subVal = subFilter[subKey];
                  if (subVal && subVal.$regex) {
                    return new RegExp(subVal.$regex, subVal.$options || '').test(item[subKey]);
                  }
                  return item[subKey] === subVal;
                });
              });
            }
            if (val.$in) {
              return val.$in.includes(item[key]);
            }
          }
          if (key === 'isVisible' && val === true) {
            return item[key] === true || item[key] === undefined;
          }
          return item[key] === val;
        });
      });
    }

    const chain = {
      data: items,
      sort: (sortOpts) => {
        if (sortOpts) {
          const sortKey = Object.keys(sortOpts)[0];
          const direction = sortOpts[sortKey]; // 1 or -1
          chain.data.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1 * direction;
            if (a[sortKey] > b[sortKey]) return 1 * direction;
            return 0;
          });
        }
        return chain;
      },
      populate: (pathStr) => {
        if (pathStr === 'members' || pathStr === 'member') {
          const TeamMember = require('../models/TeamMember');
          const allMembers = TeamMember.find().data;
          chain.data.forEach(item => {
            if (pathStr === 'members' && Array.isArray(item.members)) {
              item.members = item.members.map(memberId => {
                const idStr = typeof memberId === 'object' ? memberId._id?.toString() : memberId?.toString();
                const matched = allMembers.find(m => m._id === idStr);
                return matched ? { _id: matched._id, name: matched.name, role: matched.role, slug: matched.slug } : memberId;
              });
            } else if (pathStr === 'member' && item.member) {
              const idStr = typeof item.member === 'object' ? item.member._id?.toString() : item.member?.toString();
              const matched = allMembers.find(m => m._id === idStr);
              if (matched) item.member = { _id: matched._id, name: matched.name, role: matched.role, slug: matched.slug };
            }
          });
        }
        return chain;
      },
      then: (resolve) => resolve(chain.data),
      catch: (reject) => {},
    };

    return chain;
  }

  findOne(filter = {}) {
    const list = this.find(filter).data;
    const item = list[0] ? { ...list[0] } : null;
    if (item) {
      // Attach methods
      Object.keys(this.methods).forEach(mName => {
        item[mName] = this.methods[mName].bind(item);
      });
      // Stub save method
      item.save = async () => {
        await this._runPreSave(item);
        const all = this._read();
        const idx = all.findIndex(x => x._id === item._id);
        if (idx !== -1) {
          all[idx] = item;
          this._write(all);
        }
        return item;
      };
    }

    const chain = {
      data: item,
      select: () => chain,
      populate: (pathStr) => {
        if (item && (pathStr === 'members' || pathStr === 'member')) {
          const TeamMember = require('../models/TeamMember');
          const allMembers = TeamMember.find().data;
          if (pathStr === 'members' && Array.isArray(item.members)) {
            item.members = item.members.map(memberId => {
              const idStr = typeof memberId === 'object' ? memberId._id?.toString() : memberId?.toString();
              const matched = allMembers.find(m => m._id === idStr);
              return matched ? { _id: matched._id, name: matched.name, role: matched.role, slug: matched.slug } : memberId;
            });
          } else if (pathStr === 'member' && item.member) {
            const idStr = typeof item.member === 'object' ? item.member._id?.toString() : item.member?.toString();
            const matched = allMembers.find(m => m._id === idStr);
            if (matched) item.member = { _id: matched._id, name: matched.name, role: matched.role, slug: matched.slug };
          }
        }
        return chain;
      },
      then: (resolve) => resolve(chain.data),
      catch: (reject) => {},
    };

    return chain;
  }

  findById(id) {
    if (!id) return { then: (resolve) => resolve(null) };
    return this.findOne({ _id: id.toString() });
  }

  async create(data) {
    const items = this._read();
    let newItem = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };

    // Attach methods
    Object.keys(this.methods).forEach(mName => {
      newItem[mName] = this.methods[mName].bind(newItem);
    });

    newItem = await this._runPreSave(newItem);
    
    // Stub save
    newItem.save = async () => {
      const idx = items.findIndex(x => x._id === newItem._id);
      if (idx !== -1) {
        items[idx] = newItem;
      } else {
        items.push(newItem);
      }
      this._write(items);
      return newItem;
    };

    await newItem.save();
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const items = this._read();
    const idx = items.findIndex(x => x._id === id.toString());
    if (idx === -1) return null;

    let updatedItem = {
      ...items[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    items[idx] = updatedItem;
    this._write(items);
    return updatedItem;
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const idx = items.findIndex(x => x._id === id.toString());
    if (idx === -1) return null;
    const deleted = items[idx];
    const updated = items.filter(x => x._id !== id.toString());
    this._write(updated);
    return deleted;
  }

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }

  async insertMany(arr) {
    const items = this._read();
    const prepared = arr.map(x => ({
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...x
    }));
    items.push(...prepared);
    this._write(items);
    return prepared;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      this._write([]);
    } else {
      // Simple filter deletion stub
      const remaining = this._read().filter(item => {
        return !Object.keys(filter).every(key => item[key] === filter[key]);
      });
      this._write(remaining);
    }
    return { deletedCount: 0 };
  }
}

// Global toggle manager
let useMock = false;

const setUseMock = (val) => {
  useMock = val;
  if (useMock) {
    console.log('⚠️ Running in Mock JSON Database Mode!');
  }
};

const getModel = (modelName, mongooseModel) => {
  const mockModel = new MockModel(modelName);
  
  // Custom schema overrides
  if (modelName === 'Admin') {
    mockModel.pre('save', async function (next) {
      if (this.password && !this.password.startsWith('$2a$')) {
        this.password = await bcrypt.hash(this.password, 12);
      }
    });
    mockModel.methods.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
  }

  // Pre-save slugs for member/project
  if (modelName === 'TeamMember') {
    mockModel.pre('save', function (next) {
      if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
    });
  }
  if (modelName === 'Project') {
    mockModel.pre('save', function (next) {
      if (!this.slug) {
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
    });
  }

  // Proxy to switch backends transparently
  const handler = {
    get: (target, prop) => {
      if (useMock) {
        return mockModel[prop] ? mockModel[prop].bind(mockModel) : undefined;
      }
      return mongooseModel[prop];
    }
  };

  return new Proxy(mongooseModel, handler);
};

module.exports = { setUseMock, getModel };
